(function () {
  "use strict";

  const FEATURE_ID = "hf-status-public-client";
  const VERSION = "0.1.0";
  const BUILD = "0.1.0-etag-cache";
  const GLOBAL = "KWWitchDockPublicStatus";
  const CACHE_RECORD_VERSION = 1;
  const MIN_REFRESH_MS = 5 * 60 * 1000;
  const AUTO_REFRESH_MS = 30 * 60 * 1000;
  const MAX_RESPONSE_BYTES = 256 * 1024;
  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

  if (UW[GLOBAL] && UW[GLOBAL].build === BUILD) return;

  const listeners = new Set();
  const state = {
    started: false,
    refreshing: false,
    source: "none",
    payload: null,
    etag: "",
    fetchedAt: null,
    checkedAt: null,
    lastAttemptAt: null,
    lastError: null,
    timer: null
  };

  function nowIso() {
    return new Date().toISOString();
  }

  function clone(value) {
    if (value == null) return value;
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return null; }
  }

  function statusHost() {
    const host = UW.KWWitchDockStatusHost;
    if (!host || typeof host !== "object") return null;
    if (typeof host.requestPublicStatus !== "function") return null;
    if (typeof host.readCache !== "function" || typeof host.writeCache !== "function") return null;
    return host;
  }

  function validNotificationClass(value) {
    return [
      "silent",
      "alert",
      "critical",
      "patch",
      "release",
      "migration",
      "maintenance"
    ].includes(value);
  }

  function validatePayload(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("HF.Status response is not an object.");
    }
    if (value.schemaVersion !== "1.0") {
      throw new Error("Unsupported HF.Status schema version.");
    }
    if (typeof value.revisionId !== "string" || !value.revisionId) {
      throw new Error("HF.Status response is missing revisionId.");
    }
    if (typeof value.updatedAt !== "string" || !value.updatedAt) {
      throw new Error("HF.Status response is missing updatedAt.");
    }
    if (!validNotificationClass(value.notificationClass)) {
      throw new Error("HF.Status response has an invalid notification class.");
    }
    if (!Array.isArray(value.criticalAlerts)) {
      throw new Error("HF.Status response is missing criticalAlerts.");
    }
    if (!value.monthlyBreakage || typeof value.monthlyBreakage !== "object") {
      throw new Error("HF.Status response is missing monthlyBreakage.");
    }
    if (!Array.isArray(value.monthlyBreakage.active) || !Array.isArray(value.monthlyBreakage.fixedThisPeriod)) {
      throw new Error("HF.Status response has invalid monthlyBreakage lists.");
    }
    if (!Array.isArray(value.resources)) {
      throw new Error("HF.Status response is missing resources.");
    }
    return clone(value);
  }

  function normalizeCacheRecord(value) {
    if (!value || typeof value !== "object" || value.recordVersion !== CACHE_RECORD_VERSION) return null;
    try {
      const payload = validatePayload(value.payload);
      return {
        recordVersion: CACHE_RECORD_VERSION,
        payload: payload,
        etag: typeof value.etag === "string" ? value.etag : "",
        fetchedAt: typeof value.fetchedAt === "string" ? value.fetchedAt : null,
        checkedAt: typeof value.checkedAt === "string" ? value.checkedAt : null
      };
    } catch (_) {
      return null;
    }
  }

  function saveCache() {
    const host = statusHost();
    if (!host || !state.payload) return false;
    const record = {
      recordVersion: CACHE_RECORD_VERSION,
      payload: clone(state.payload),
      etag: state.etag || "",
      fetchedAt: state.fetchedAt,
      checkedAt: state.checkedAt
    };
    try {
      host.writeCache(record);
      return true;
    } catch (_) {
      return false;
    }
  }

  function loadCache() {
    const host = statusHost();
    if (!host) return false;
    try {
      const record = normalizeCacheRecord(host.readCache());
      if (!record) return false;
      state.payload = record.payload;
      state.etag = record.etag;
      state.fetchedAt = record.fetchedAt;
      state.checkedAt = record.checkedAt;
      state.source = "cache";
      state.lastError = null;
      return true;
    } catch (_) {
      return false;
    }
  }

  function snapshot() {
    const host = statusHost();
    return {
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      started: state.started,
      refreshing: state.refreshing,
      source: state.source,
      available: !!state.payload,
      stale: !!state.payload && !!state.lastError,
      payload: clone(state.payload),
      etag: state.etag || "",
      fetchedAt: state.fetchedAt,
      checkedAt: state.checkedAt,
      lastAttemptAt: state.lastAttemptAt,
      lastError: state.lastError,
      siteBase: host && typeof host.siteBase === "string" ? host.siteBase : "",
      endpoint: host && typeof host.endpoint === "string" ? host.endpoint : ""
    };
  }

  function emit() {
    const next = snapshot();
    for (const listener of Array.from(listeners)) {
      try { listener(next); } catch (_) {}
    }
  }

  function onChange(listener) {
    if (typeof listener !== "function") return function () {};
    listeners.add(listener);
    try { listener(snapshot()); } catch (_) {}
    return function () { listeners.delete(listener); };
  }

  function shouldThrottle(force) {
    if (force || !state.lastAttemptAt) return false;
    const last = Date.parse(state.lastAttemptAt);
    if (!Number.isFinite(last)) return false;
    return Date.now() - last < MIN_REFRESH_MS;
  }

  async function refresh(options) {
    const opts = options && typeof options === "object" ? options : {};
    if (state.refreshing) return { ok: false, skipped: "refresh-in-flight", state: snapshot() };
    if (shouldThrottle(!!opts.force)) return { ok: true, skipped: "throttled", state: snapshot() };

    const host = statusHost();
    state.lastAttemptAt = nowIso();
    if (!host) {
      state.lastError = "HF.Status transport unavailable.";
      state.source = state.payload ? "cache" : "none";
      emit();
      return { ok: false, error: state.lastError, state: snapshot() };
    }

    state.refreshing = true;
    emit();

    try {
      const response = await host.requestPublicStatus({
        etag: state.etag || "",
        timeoutMs: Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : 5000
      });

      if (!response || typeof response.status !== "number") {
        throw new Error("HF.Status transport returned an invalid response.");
      }

      if (response.status === 304) {
        if (!state.payload) throw new Error("HF.Status returned 304 without a cached payload.");
        state.checkedAt = nowIso();
        state.source = "validated-cache";
        state.lastError = null;
        saveCache();
        return { ok: true, notModified: true, state: snapshot() };
      }

      if (response.status !== 200) {
        throw new Error("HF.Status returned HTTP " + response.status + ".");
      }

      const text = typeof response.text === "string" ? response.text : "";
      if (!text || text.length > MAX_RESPONSE_BYTES) {
        throw new Error("HF.Status response was empty or exceeded the client limit.");
      }

      const payload = validatePayload(JSON.parse(text));
      const checkedAt = nowIso();
      state.payload = payload;
      state.etag = typeof response.etag === "string" ? response.etag : "";
      state.fetchedAt = checkedAt;
      state.checkedAt = checkedAt;
      state.source = "network";
      state.lastError = null;
      saveCache();
      return { ok: true, notModified: false, state: snapshot() };
    } catch (error) {
      state.lastError = error && error.message ? String(error.message).slice(0, 240) : "HF.Status refresh failed.";
      state.source = state.payload ? "cache" : "none";
      return { ok: false, error: state.lastError, state: snapshot() };
    } finally {
      state.refreshing = false;
      emit();
    }
  }

  function start() {
    if (state.started) return snapshot();
    state.started = true;
    loadCache();
    emit();

    setTimeout(function () {
      refresh({ force: false }).catch(function () {});
    }, 750);

    state.timer = setInterval(function () {
      refresh({ force: false }).catch(function () {});
    }, AUTO_REFRESH_MS);

    return snapshot();
  }

  function dispose() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
    state.started = false;
    return true;
  }

  UW[GLOBAL] = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    start: start,
    refresh: refresh,
    getState: snapshot,
    onChange: onChange,
    dispose: dispose
  });

  start();
})();

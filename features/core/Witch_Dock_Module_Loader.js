(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const GLOBAL = "KWModuleLoader";
  const VERSION = "0.1.2";
  const BUILD = "0.1.2-preferences-enablement-read";
  const FALLBACK_MANIFEST_URL = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/manifest.json";
  const SESSION = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  if (UW[GLOBAL] && UW[GLOBAL].build === BUILD && UW[GLOBAL].active) return;

  const state = {
    version: VERSION,
    build: BUILD,
    active: true,
    status: "initializing",
    startedAt: new Date().toISOString(),
    completedAt: null,
    durationMs: null,
    manifestUrl: null,
    total: 0,
    enabled: 0,
    started: 0,
    fetched: 0,
    executed: 0,
    failed: 0,
    modules: []
  };
  const startedPerf = performance.now();

  function cloneState() {
    return JSON.parse(JSON.stringify(state));
  }

  UW[GLOBAL] = {
    version: VERSION,
    build: BUILD,
    active: true,
    getState: cloneState
  };

  function finish(status) {
    state.status = status;
    state.completedAt = new Date().toISOString();
    state.durationMs = Math.round((performance.now() - startedPerf) * 10) / 10;
    UW[GLOBAL].active = status === "loading";
  }

  function kwStableHash(input) {
    const text = String(input == null ? "" : input);
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function kwWithCacheKey(url, key) {
    try {
      const u = new URL(String(url));
      u.searchParams.set("kwcache", String(key));
      return u.toString();
    } catch {
      const raw = String(url || "");
      const join = raw.includes("?") ? "&" : "?";
      return `${raw}${join}kwcache=${encodeURIComponent(String(key))}`;
    }
  }

  function kwModuleRequestUrl(tool, registryEntry) {
    const url = tool && typeof tool.url === "string" ? tool.url : "";
    const registry = registryEntry && typeof registryEntry === "object" ? registryEntry : null;
    const identity = [
      tool && tool.id,
      registry && registry.version,
      registry && registry.build,
      registry && registry.path,
      url
    ].map((v) => String(v == null ? "" : v)).join("|");
    return kwWithCacheKey(url, `module-${kwStableHash(identity)}`);
  }

  async function fetchText(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
    return response.text();
  }

  function getToolEnabled(toolId, enabledByDefault) {
    const preferences = UW.KWWitchDockPreferences;
    if (!preferences || typeof preferences.getToolEnabledFromPage !== "function") return !!enabledByDefault;
    return preferences.getToolEnabledFromPage(toolId, enabledByDefault);
  }

  function markFailure(record, phase, error) {
    record.status = `${phase}-error`;
    record.error = error && error.message ? String(error.message).slice(0, 500) : String(error || "unknown error").slice(0, 500);
    state.failed += 1;
  }

  async function run() {
    state.status = "loading";
    const manifestUrl = (UW && typeof UW.KWWitchDockManifestURL === "string" && UW.KWWitchDockManifestURL)
      ? UW.KWWitchDockManifestURL
      : FALLBACK_MANIFEST_URL;
    state.manifestUrl = manifestUrl;

    let manifest;
    try {
      const raw = await fetchText(kwWithCacheKey(manifestUrl, `bootstrap-${SESSION}`));
      manifest = JSON.parse(raw);
    } catch (error) {
      state.failed += 1;
      state.modules.push({
        id: "manifest",
        status: "manifest-error",
        error: error && error.message ? String(error.message).slice(0, 500) : String(error || "unknown error").slice(0, 500)
      });
      finish("manifest-error");
      return;
    }

    const registryEntries = Array.isArray(manifest && manifest.moduleRegistry) ? manifest.moduleRegistry : [];
    const registryById = new Map();
    for (const entry of registryEntries) {
      if (!entry || typeof entry !== "object" || typeof entry.id !== "string" || !entry.id) continue;
      if (!registryById.has(entry.id)) registryById.set(entry.id, entry);
    }

    const modules = Array.isArray(manifest && manifest.modules) ? manifest.modules : [];
    state.total = modules.length;

    const scheduled = [];
    for (const moduleDef of modules) {
      if (!moduleDef || typeof moduleDef !== "object") continue;
      const id = typeof moduleDef.id === "string" ? moduleDef.id : "";
      const url = typeof moduleDef.url === "string" ? moduleDef.url : "";
      const enabledByDefault = !!moduleDef.enabledByDefault;
      if (!id || !url) continue;

      const record = {
        id,
        status: "pending",
        fetchStartedAt: null,
        fetchCompletedAt: null,
        fetchDurationMs: null,
        executedAt: null,
        error: null
      };
      state.modules.push(record);

      if (!getToolEnabled(id, enabledByDefault)) {
        record.status = "disabled";
        continue;
      }

      state.enabled += 1;
      const registryEntry = registryById.get(id) || null;
      const requestUrl = kwModuleRequestUrl(moduleDef, registryEntry);
      record.status = "fetching";
      record.fetchStartedAt = new Date().toISOString();
      state.started += 1;
      const fetchStart = performance.now();

      const promise = fetchText(requestUrl).then(
        (code) => {
          record.fetchCompletedAt = new Date().toISOString();
          record.fetchDurationMs = Math.round((performance.now() - fetchStart) * 10) / 10;
          if (!code) {
            record.status = "empty";
            return { ok: false, empty: true, code: "" };
          }
          record.status = "ready";
          state.fetched += 1;
          return { ok: true, code };
        },
        (error) => {
          record.fetchCompletedAt = new Date().toISOString();
          record.fetchDurationMs = Math.round((performance.now() - fetchStart) * 10) / 10;
          markFailure(record, "fetch", error);
          return { ok: false, error };
        }
      );

      scheduled.push({ moduleDef, record, promise });
    }

    for (const item of scheduled) {
      const result = await item.promise;
      if (!result || !result.ok || !result.code) continue;
      try {
        new Function(result.code)();
        item.record.status = "executed";
        item.record.executedAt = new Date().toISOString();
        state.executed += 1;
      } catch (error) {
        markFailure(item.record, "exec", error);
      }
    }

    finish("complete");
  }

  run().catch((error) => {
    state.failed += 1;
    state.modules.push({
      id: "bootstrap",
      status: "bootstrap-error",
      error: error && error.message ? String(error.message).slice(0, 500) : String(error || "unknown error").slice(0, 500)
    });
    finish("bootstrap-error");
  });
})();

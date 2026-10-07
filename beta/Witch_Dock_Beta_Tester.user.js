// ==UserScript==
// @name         WITCH DOCK - BETA TESTER
// @namespace    KnightWitch
// @version      0.1.0
// @description  Optional Public Beta layer for Witch Dock Stable.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-idle
// @updateURL    https://witchdock.knightwitch.dev/beta/Witch_Dock_Beta_Tester.user.js
// @downloadURL  https://witchdock.knightwitch.dev/beta/Witch_Dock_Beta_Tester.user.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      witchdock.knightwitch.dev
// ==/UserScript==

(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const GLOBAL = "KWWitchDockBetaTester";
  const VERSION = "0.1.0";
  const BUILD = "0.1.0-public-beta-channel";
  const TOOL_ID = "beta-tester";
  const PROVIDER_ID = "beta-tester";
  const MANIFEST_URL = "https://witchdock.knightwitch.dev/beta/manifest.json";
  const PAYLOAD_ROOT = "https://witchdock.knightwitch.dev/payloads/";
  const MASTER_KEY = "kw.betaTester.enabled.v1";
  const MODULE_KEY_PREFIX = "kw.betaTester.module.";
  const WAIT_TIMEOUT_MS = 30000;
  const WAIT_STEP_MS = 250;

  if (UW[GLOBAL] && UW[GLOBAL].build === BUILD) return;

  const moduleRuntime = new Map();
  const listeners = new Set();
  let registrationExpected = null;
  let panelBody = null;
  let disposed = false;

  const state = {
    version: VERSION,
    build: BUILD,
    status: "initializing",
    enabled: !!GM_getValue(MASTER_KEY, false),
    manifestUrl: MANIFEST_URL,
    manifestRevision: null,
    manifestUpdatedAt: null,
    manifestError: null,
    lastRefreshAt: null,
    hostReady: false,
    stableVersion: null,
    diagnosticsRegistered: false,
    moduleCount: 0,
    activeCount: 0,
    modules: []
  };

  function nowIso() { return new Date().toISOString(); }
  function sleep(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
  function clone(value) {
    if (value == null) return value;
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return null; }
  }
  function clean(value) { return String(value == null ? "" : value).trim(); }
  function isSlug(value) { return /^[a-z0-9][a-z0-9-]*$/.test(clean(value)); }
  function isSha(value) { return /^[0-9a-f]{40}$/i.test(clean(value)); }
  function safePath(value) {
    const path = clean(value);
    return !!path && !path.includes("..") && !path.includes("\\") && !path.startsWith("/");
  }
  function parseVersion(value) {
    const match = clean(value).match(/^(\d+)\.(\d+)\.(\d+)(?:[-+]([0-9A-Za-z.-]+))?$/);
    if (!match) return null;
    return {
      numbers: [Number(match[1]), Number(match[2]), Number(match[3])],
      suffix: match[4] || ""
    };
  }
  function compareVersions(a, b) {
    const left = parseVersion(a);
    const right = parseVersion(b);
    if (!left || !right) return null;
    for (let index = 0; index < 3; index += 1) {
      if (left.numbers[index] !== right.numbers[index]) return left.numbers[index] > right.numbers[index] ? 1 : -1;
    }
    if (left.suffix === right.suffix) return 0;
    if (!left.suffix) return 1;
    if (!right.suffix) return -1;
    return left.suffix > right.suffix ? 1 : -1;
  }
  function stableVersion() {
    try {
      const host = UW.KWWitchDockStableHost;
      const snapshot = host && typeof host.getState === "function" ? host.getState() : null;
      const version = snapshot && (snapshot.resolvedLauncherVersion || snapshot.installedWrapperVersion);
      return clean(version) || null;
    } catch (_) {
      return null;
    }
  }
  function supportsMinimum(minimum) {
    if (!minimum) return true;
    const current = state.stableVersion || stableVersion();
    state.stableVersion = current;
    const order = compareVersions(current, minimum);
    return order !== null && order >= 0;
  }

  function modulePreferenceKey(id) { return MODULE_KEY_PREFIX + id + ".enabled.v1"; }
  function getModulePreference(entry) {
    return !!GM_getValue(modulePreferenceKey(entry.id), entry.defaultEnabled !== false);
  }
  function setModulePreference(id, enabled) {
    GM_setValue(modulePreferenceKey(id), !!enabled);
  }
  function emit() {
    renderPanel();
    const snapshot = getState();
    for (const listener of Array.from(listeners)) {
      try { listener(snapshot); } catch (_) {}
    }
  }

  function requestText(url) {
    const target = new URL(String(url));
    if (target.origin !== "https://witchdock.knightwitch.dev") {
      return Promise.reject(new Error("Beta Tester refused a non-Witch-Dock source."));
    }
    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({
        method: "GET",
        url: target.href,
        headers: { "Cache-Control": "no-cache" },
        timeout: 15000,
        onload: function (response) {
          if (response.status >= 200 && response.status < 300) resolve(response.responseText || "");
          else reject(new Error("HTTP " + response.status + " for " + target.href));
        },
        onerror: function () { reject(new Error("Request failed for " + target.href)); },
        ontimeout: function () { reject(new Error("Request timed out for " + target.href)); }
      });
    });
  }

  function validateProviderIds(value) {
    if (!Array.isArray(value)) return [];
    const out = [];
    for (const raw of value) {
      const id = clean(raw);
      if (!isSlug(id) || out.includes(id)) continue;
      out.push(id);
      if (out.length >= 20) break;
    }
    return out;
  }

  function validateManifest(input) {
    const raw = input && typeof input === "object" ? input : null;
    if (!raw || raw.schemaVersion !== 1 || raw.channel !== "public-beta") {
      throw new Error("Beta manifest schema/channel is incompatible.");
    }
    if (!Number.isInteger(raw.revision) || raw.revision < 1) {
      throw new Error("Beta manifest revision is invalid.");
    }
    const reporting = raw.reporting && typeof raw.reporting === "object" ? raw.reporting : {};
    const modules = [];
    const seen = new Set();

    for (const item of Array.isArray(raw.modules) ? raw.modules : []) {
      if (!item || typeof item !== "object") continue;
      const id = clean(item.id);
      const title = clean(item.title);
      const version = clean(item.version);
      const build = clean(item.build);
      const status = clean(item.status || "active");
      const payloadRef = clean(item.payloadRef);
      const path = clean(item.path);
      if (!isSlug(id)) throw new Error("Invalid beta module id: " + id);
      if (seen.has(id)) throw new Error("Duplicate beta module id: " + id);
      if (!title || !version || !build) throw new Error("Beta module " + id + " is missing title/version/build.");
      if (!["active", "paused", "graduated"].includes(status)) throw new Error("Beta module " + id + " has invalid status.");
      if (!isSha(payloadRef) || !safePath(path)) throw new Error("Beta module " + id + " must use an immutable payload SHA and safe path.");
      seen.add(id);
      modules.push(Object.freeze({
        id: id,
        title: title,
        version: version,
        build: build,
        status: status,
        defaultEnabled: item.defaultEnabled !== false,
        payloadRef: payloadRef.toLowerCase(),
        path: path,
        minimumStableVersion: clean(item.minimumStableVersion || raw.minimumStableVersion),
        requiresReloadToDisable: item.requiresReloadToDisable === true,
        diagnosticProviderIds: validateProviderIds(item.diagnosticProviderIds),
        reporting: item.reporting && typeof item.reporting === "object"
          ? { featureId: clean(item.reporting.featureId) }
          : {}
      }));
    }

    return Object.freeze({
      schemaVersion: 1,
      channel: "public-beta",
      revision: raw.revision,
      updatedAt: clean(raw.updatedAt),
      minimumStableVersion: clean(raw.minimumStableVersion),
      reporting: Object.freeze({
        productId: clean(reporting.productId || "witch-dock"),
        groupId: clean(reporting.groupId || "wd-beta-qa"),
        featureId: clean(reporting.featureId || "public-beta-testing"),
        diagnosticProviderId: clean(reporting.diagnosticProviderId || PROVIDER_ID)
      }),
      modules: Object.freeze(modules)
    });
  }

  function runtimeRecord(entry) {
    let record = moduleRuntime.get(entry.id);
    if (!record) {
      record = {
        id: entry.id,
        entry: entry,
        definition: null,
        loadedIdentity: null,
        active: false,
        status: entry.status === "active" ? "available" : entry.status,
        error: null,
        activatedAt: null,
        deactivatedAt: null
      };
      moduleRuntime.set(entry.id, record);
    }
    record.entry = entry;
    return record;
  }

  function entryIdentity(entry) {
    return [entry.version, entry.build, entry.payloadRef, entry.path].join("|");
  }

  function moduleContext(entry) {
    return Object.freeze({
      channel: "public-beta",
      hostVersion: VERSION,
      hostBuild: BUILD,
      manifestRevision: state.manifestRevision,
      module: clone(entry),
      witchDock: UW.WitchDock || null,
      diagnostics: UW.KWWitchDockDiagnostics || null,
      reporter: UW.KWWitchDockBugReporter || null
    });
  }

  function registerModule(definition) {
    const def = definition && typeof definition === "object" ? definition : null;
    if (!registrationExpected) throw new Error("No beta module registration is currently expected.");
    const entry = registrationExpected.entry;
    if (!def || def.id !== entry.id || def.version !== entry.version || def.build !== entry.build) {
      throw new Error("Beta module registration identity did not match its manifest entry.");
    }
    if (typeof def.activate !== "function" || typeof def.deactivate !== "function") {
      throw new Error("Beta module " + entry.id + " requires activate() and deactivate().");
    }
    if (registrationExpected.definition) throw new Error("Beta module " + entry.id + " registered more than once.");
    registrationExpected.definition = Object.freeze({
      id: entry.id,
      version: entry.version,
      build: entry.build,
      activate: def.activate,
      deactivate: def.deactivate,
      render: typeof def.render === "function" ? def.render : null,
      getState: typeof def.getState === "function" ? def.getState : null,
      dispose: typeof def.dispose === "function" ? def.dispose : null
    });
    return true;
  }

  async function disposeLoadedRecord(record) {
    if (!record) return;
    if (record.active) await deactivateRecord(record, "replace");
    if (record.definition && typeof record.definition.dispose === "function") {
      try { await Promise.resolve(record.definition.dispose(moduleContext(record.entry))); } catch (_) {}
    }
    record.definition = null;
    record.loadedIdentity = null;
  }

  async function loadDefinition(entry) {
    const record = runtimeRecord(entry);
    const identity = entryIdentity(entry);
    if (record.definition && record.loadedIdentity === identity) return record.definition;
    if (record.definition) await disposeLoadedRecord(record);

    record.status = "loading";
    record.error = null;
    emit();

    const url = PAYLOAD_ROOT + entry.payloadRef + "/" + entry.path.replace(/^\/+/, "");
    const code = await requestText(url);
    if (!code) throw new Error("Beta module " + entry.id + " returned empty source.");

    registrationExpected = { entry: entry, definition: null };
    try {
      new Function("unsafeWindow", "window", code)(UW, UW);
      if (!registrationExpected.definition) {
        throw new Error("Beta module " + entry.id + " did not register with KWWitchDockBetaTester.");
      }
      record.definition = registrationExpected.definition;
      record.loadedIdentity = identity;
      record.status = "loaded";
      return record.definition;
    } finally {
      registrationExpected = null;
    }
  }

  async function activateRecord(record, reason) {
    const entry = record.entry;
    if (!state.enabled || entry.status !== "active" || !getModulePreference(entry)) return false;
    if (record.active) return true;

    const minimum = entry.minimumStableVersion || (state.manifest && state.manifest.minimumStableVersion) || "";
    if (!supportsMinimum(minimum)) {
      record.status = "incompatible-stable";
      record.error = state.stableVersion
        ? "Requires Witch Dock Stable v" + minimum + " or newer; current is v" + state.stableVersion + "."
        : "Could not verify a compatible Witch Dock Stable version.";
      emit();
      return false;
    }

    try {
      const def = await loadDefinition(entry);
      record.status = "activating";
      record.error = null;
      emit();
      const ok = await Promise.resolve(def.activate(moduleContext(entry), reason || "enable"));
      if (ok === false) throw new Error("Module declined activation.");
      record.active = true;
      record.status = "active";
      record.activatedAt = nowIso();
      state.activeCount = Array.from(moduleRuntime.values()).filter(function (row) { return row.active; }).length;
      emit();
      return true;
    } catch (error) {
      record.active = false;
      record.status = "error";
      record.error = error && error.message ? error.message : String(error);
      state.activeCount = Array.from(moduleRuntime.values()).filter(function (row) { return row.active; }).length;
      emit();
      return false;
    }
  }

  async function deactivateRecord(record, reason) {
    if (!record || !record.active) return true;
    if (record.entry.requiresReloadToDisable) {
      record.status = "reload-required";
      record.error = "This beta module requires a Hero Forge reload to disable safely.";
      emit();
      return false;
    }
    try {
      record.status = "deactivating";
      emit();
      const ok = await Promise.resolve(record.definition.deactivate(moduleContext(record.entry), reason || "disable"));
      if (ok === false) throw new Error("Module declined deactivation.");
      record.active = false;
      record.status = record.entry.status === "active" ? "loaded" : record.entry.status;
      record.error = null;
      record.deactivatedAt = nowIso();
      state.activeCount = Array.from(moduleRuntime.values()).filter(function (row) { return row.active; }).length;
      emit();
      return true;
    } catch (error) {
      record.status = "error";
      record.error = error && error.message ? error.message : String(error);
      emit();
      return false;
    }
  }

  async function reconcileManifest(manifest) {
    const nextIds = new Set(manifest.modules.map(function (entry) { return entry.id; }));

    for (const [id, record] of Array.from(moduleRuntime.entries())) {
      const nextEntry = manifest.modules.find(function (entry) { return entry.id === id; }) || null;
      const changed = nextEntry && entryIdentity(nextEntry) !== record.loadedIdentity && record.loadedIdentity !== null;
      if (!nextEntry || nextEntry.status !== "active" || changed) {
        await deactivateRecord(record, nextEntry ? "manifest-change" : "manifest-remove");
        if (changed || !nextEntry) await disposeLoadedRecord(record);
        if (!nextEntry) moduleRuntime.delete(id);
      }
    }

    for (const entry of manifest.modules) {
      const record = runtimeRecord(entry);
      if (entry.status !== "active") {
        record.status = entry.status;
        continue;
      }
      if (state.enabled && getModulePreference(entry)) await activateRecord(record, "manifest");
      else if (!record.active) record.status = record.definition ? "loaded" : "available";
    }

    for (const id of Array.from(moduleRuntime.keys())) {
      if (!nextIds.has(id)) moduleRuntime.delete(id);
    }
  }

  async function refreshManifest() {
    if (disposed) return false;
    state.status = "manifest-loading";
    state.manifestError = null;
    emit();
    try {
      const text = await requestText(MANIFEST_URL + "?kwbeta=" + Date.now().toString(36));
      const manifest = validateManifest(JSON.parse(text));
      state.manifestRevision = manifest.revision;
      state.manifestUpdatedAt = manifest.updatedAt || null;
      state.lastRefreshAt = nowIso();
      state.moduleCount = manifest.modules.length;
      await reconcileManifest(manifest);
      state.manifest = manifest;
      state.status = "ready";
      state.manifestError = null;
      emit();
      return true;
    } catch (error) {
      state.status = "manifest-error";
      state.manifestError = error && error.message ? error.message : String(error);
      emit();
      return false;
    }
  }

  async function setEnabled(value) {
    state.enabled = !!value;
    GM_setValue(MASTER_KEY, state.enabled);
    if (state.enabled) {
      await refreshManifest();
      return state.status === "ready";
    }
    for (const record of Array.from(moduleRuntime.values())) await deactivateRecord(record, "master-off");
    state.status = state.manifestError ? "manifest-error" : "ready";
    emit();
    return true;
  }

  async function setModuleEnabled(id, value) {
    const entry = state.manifest && state.manifest.modules.find(function (row) { return row.id === id; });
    if (!entry) return false;
    setModulePreference(id, !!value);
    const record = runtimeRecord(entry);
    if (!value) return deactivateRecord(record, "module-off");
    if (state.enabled && entry.status === "active") return activateRecord(record, "module-on");
    emit();
    return true;
  }

  function providerIdsFor(entry) {
    const ids = [PROVIDER_ID].concat(entry && entry.diagnosticProviderIds || []);
    return Array.from(new Set(ids.filter(isSlug)));
  }

  function reportBetaBug(entry) {
    const reporter = UW.KWWitchDockBugReporter;
    if (!reporter || typeof reporter.open !== "function") return false;
    const reporting = state.manifest && state.manifest.reporting || {
      productId: "witch-dock",
      groupId: "wd-beta-qa",
      featureId: "public-beta-testing"
    };
    reporter.open({
      launchMethod: "contextual-action",
      productId: reporting.productId || "witch-dock",
      groupId: reporting.groupId || "wd-beta-qa",
      featureId: entry && entry.reporting && entry.reporting.featureId || reporting.featureId || "public-beta-testing",
      toolId: "beta-tester:" + (entry ? entry.id : "channel"),
      scopeHint: "witch-dock-beta",
      diagnosticProviderIds: providerIdsFor(entry)
    });
    return true;
  }

  async function captureBetaDiagnostic(entry) {
    const diagnostics = UW.KWWitchDockDiagnostics;
    if (!diagnostics || typeof diagnostics.captureAndDownload !== "function") return false;
    const result = await diagnostics.captureAndDownload({
      captureMode: "snapshot",
      providerIds: providerIdsFor(entry)
    });
    return !!(result && result.ok !== false);
  }

  function betaDiagnosticState() {
    return {
      host: {
        version: VERSION,
        build: BUILD,
        status: state.status,
        enabled: state.enabled,
        manifestRevision: state.manifestRevision,
        manifestUpdatedAt: state.manifestUpdatedAt,
        manifestError: state.manifestError
      },
      modules: Array.from(moduleRuntime.values()).map(function (record) {
        let moduleState = null;
        if (record.definition && typeof record.definition.getState === "function") {
          try { moduleState = clone(record.definition.getState()); } catch (error) {
            moduleState = { stateError: error && error.message ? error.message : String(error) };
          }
        }
        return {
          id: record.id,
          title: record.entry.title,
          version: record.entry.version,
          build: record.entry.build,
          payloadRef: record.entry.payloadRef,
          path: record.entry.path,
          manifestStatus: record.entry.status,
          preferredEnabled: getModulePreference(record.entry),
          active: record.active,
          runtimeStatus: record.status,
          error: record.error,
          moduleState: moduleState
        };
      })
    };
  }

  function registerDiagnosticsProvider() {
    const diagnostics = UW.KWWitchDockDiagnostics;
    if (!diagnostics || typeof diagnostics.registerProvider !== "function") return false;
    try {
      const inventory = typeof diagnostics.getProviderInventory === "function"
        ? diagnostics.getProviderInventory()
        : [];
      if (inventory.some(function (row) { return row.providerId === PROVIDER_ID; }) &&
          typeof diagnostics.unregisterProvider === "function") {
        diagnostics.unregisterProvider(PROVIDER_ID);
      }
      diagnostics.registerProvider({
        providerId: PROVIDER_ID,
        providerSchemaVersion: 1,
        version: VERSION,
        build: BUILD,
        modes: ["snapshot"],
        capabilities: {
          observational: true,
          captures: ["beta-host-state", "beta-module-state"],
          excludes: ["module-source", "raw-character-json", "credentials"]
        },
        capture: function () {
          const snapshot = betaDiagnosticState();
          return {
            summary: {
              enabled: snapshot.host.enabled,
              manifestRevision: snapshot.host.manifestRevision,
              moduleCount: snapshot.modules.length,
              activeCount: snapshot.modules.filter(function (row) { return row.active; }).length,
              errorCount: snapshot.modules.filter(function (row) { return !!row.error; }).length
            },
            sections: {
              channel: snapshot.host,
              modules: snapshot.modules
            },
            coverage: [
              { sectionName: "channel", status: "captured" },
              { sectionName: "modules", status: "captured" }
            ],
            warnings: [],
            events: []
          };
        }
      });
      state.diagnosticsRegistered = true;
      emit();
      return true;
    } catch (error) {
      state.diagnosticsRegistered = false;
      return false;
    }
  }

  function makeButton(text, onClick, primary) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.style.padding = "6px 9px";
    button.style.borderRadius = "6px";
    button.style.border = "1px solid rgba(255,255,255,.15)";
    button.style.background = primary ? "rgba(127,95,190,.42)" : "rgba(255,255,255,.07)";
    button.style.color = "inherit";
    button.style.cursor = "pointer";
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      Promise.resolve(onClick()).catch(function () {});
    });
    return button;
  }

  function renderModuleSurface(host, record) {
    if (!record.active || !record.definition || typeof record.definition.render !== "function") return;
    const surface = document.createElement("div");
    surface.style.marginTop = "7px";
    surface.style.paddingTop = "7px";
    surface.style.borderTop = "1px solid rgba(255,255,255,.08)";
    host.appendChild(surface);
    try {
      record.definition.render(surface, moduleContext(record.entry));
    } catch (error) {
      surface.textContent = "Beta module UI failed: " + (error && error.message ? error.message : String(error));
    }
  }

  function renderPanel() {
    if (!panelBody) return;
    panelBody.replaceChildren();

    const intro = document.createElement("div");
    intro.style.opacity = ".72";
    intro.style.fontSize = "11px";
    intro.style.lineHeight = "1.4";
    intro.textContent = "Public Beta overlays normal Witch Dock Stable. Turning Beta OFF deactivates reversible beta modules without changing Stable.";
    panelBody.appendChild(intro);

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "6px";
    actions.style.flexWrap = "wrap";
    actions.style.marginTop = "8px";
    actions.appendChild(makeButton(state.enabled ? "Beta Tester: ON" : "Beta Tester: OFF", function () {
      return setEnabled(!state.enabled);
    }, state.enabled));
    actions.appendChild(makeButton("Refresh Beta Manifest", refreshManifest, false));
    actions.appendChild(makeButton("Report Beta Channel Bug", function () { return reportBetaBug(null); }, false));
    panelBody.appendChild(actions);

    const status = document.createElement("div");
    status.style.marginTop = "7px";
    status.style.fontSize = "10px";
    status.style.opacity = state.manifestError ? "1" : ".62";
    status.textContent = "Status: " + state.status +
      (state.manifestRevision ? " · manifest r" + state.manifestRevision : "") +
      (state.manifestError ? " · " + state.manifestError : "");
    panelBody.appendChild(status);

    const records = state.manifest
      ? state.manifest.modules.map(function (entry) { return runtimeRecord(entry); })
      : [];

    if (!records.length) {
      const empty = document.createElement("div");
      empty.style.marginTop = "9px";
      empty.style.padding = "8px";
      empty.style.border = "1px solid rgba(255,255,255,.08)";
      empty.style.borderRadius = "7px";
      empty.style.opacity = ".65";
      empty.textContent = "No public beta modules are currently assigned.";
      panelBody.appendChild(empty);
      return;
    }

    for (const record of records) {
      const entry = record.entry;
      const card = document.createElement("div");
      card.style.marginTop = "8px";
      card.style.padding = "8px";
      card.style.border = "1px solid rgba(255,255,255,.10)";
      card.style.borderRadius = "7px";
      card.style.background = "rgba(255,255,255,.025)";

      const head = document.createElement("div");
      head.style.display = "flex";
      head.style.alignItems = "center";
      head.style.gap = "7px";
      const title = document.createElement("strong");
      title.textContent = entry.title;
      const badge = document.createElement("span");
      badge.textContent = "IN BETA";
      badge.style.fontSize = "9px";
      badge.style.fontWeight = "700";
      badge.style.letterSpacing = ".06em";
      badge.style.padding = "2px 6px";
      badge.style.borderRadius = "999px";
      badge.style.background = "rgba(153,105,230,.28)";
      badge.style.border = "1px solid rgba(180,145,235,.38)";
      head.append(title, badge);
      card.appendChild(head);

      const meta = document.createElement("div");
      meta.style.fontSize = "10px";
      meta.style.opacity = ".6";
      meta.style.marginTop = "3px";
      meta.textContent = "v" + entry.version + " · " + entry.build + " · " + entry.status + " · runtime " + record.status;
      card.appendChild(meta);

      if (record.error) {
        const error = document.createElement("div");
        error.style.fontSize = "10px";
        error.style.marginTop = "5px";
        error.textContent = record.error;
        card.appendChild(error);
      }

      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.gap = "6px";
      row.style.flexWrap = "wrap";
      row.style.marginTop = "7px";
      const preferred = getModulePreference(entry);
      row.appendChild(makeButton(preferred ? "Module: ON" : "Module: OFF", function () {
        return setModuleEnabled(entry.id, !getModulePreference(entry));
      }, preferred && state.enabled && record.active));
      row.appendChild(makeButton("Report Beta Bug", function () { return reportBetaBug(entry); }, false));
      row.appendChild(makeButton("Capture Beta Diagnostic", function () { return captureBetaDiagnostic(entry); }, false));
      card.appendChild(row);

      if (entry.requiresReloadToDisable) {
        const note = document.createElement("div");
        note.style.fontSize = "10px";
        note.style.opacity = ".6";
        note.style.marginTop = "5px";
        note.textContent = "This module requires a Hero Forge reload to disable safely.";
        card.appendChild(note);
      }

      renderModuleSurface(card, record);
      panelBody.appendChild(card);
    }
  }

  function registerTool() {
    const dock = UW.WitchDock;
    if (!dock || typeof dock.registerTool !== "function") return false;
    dock.registerTool({
      id: TOOL_ID,
      title: "Beta Tester",
      tab: "Utilities",
      render: function (container, api) {
        const section = api.ui.createSection({ id: "beta-tester", title: "Beta Tester", defaultCollapsed: false });
        panelBody = section.body;
        container.appendChild(section.root);
        renderPanel();
      }
    });
    return true;
  }

  async function waitForStableHost() {
    const end = Date.now() + WAIT_TIMEOUT_MS;
    while (!disposed && Date.now() < end) {
      if (UW.KWWitchDockDevChannel) {
        state.status = "unsupported-dev-channel";
        state.manifestError = "Beta Tester is designed to layer onto Public Stable, not WITCH DOCK - DEV.";
        emit();
        return false;
      }
      if (UW.WitchDock && typeof UW.WitchDock.registerTool === "function") {
        state.hostReady = true;
        state.stableVersion = stableVersion();
        return true;
      }
      await sleep(WAIT_STEP_MS);
    }
    state.status = "host-timeout";
    state.manifestError = "Witch Dock Stable did not become ready.";
    emit();
    return false;
  }

  function getState() {
    return {
      version: VERSION,
      build: BUILD,
      status: state.status,
      enabled: state.enabled,
      manifestUrl: state.manifestUrl,
      manifestRevision: state.manifestRevision,
      manifestUpdatedAt: state.manifestUpdatedAt,
      manifestError: state.manifestError,
      lastRefreshAt: state.lastRefreshAt,
      hostReady: state.hostReady,
      stableVersion: state.stableVersion,
      diagnosticsRegistered: state.diagnosticsRegistered,
      moduleCount: state.moduleCount,
      activeCount: state.activeCount,
      modules: Array.from(moduleRuntime.values()).map(function (record) {
        return {
          id: record.id,
          title: record.entry.title,
          version: record.entry.version,
          build: record.entry.build,
          payloadRef: record.entry.payloadRef,
          path: record.entry.path,
          manifestStatus: record.entry.status,
          preferredEnabled: getModulePreference(record.entry),
          active: record.active,
          status: record.status,
          error: record.error
        };
      })
    };
  }

  function onChange(listener) {
    if (typeof listener !== "function") return function () {};
    listeners.add(listener);
    try { listener(getState()); } catch (_) {}
    return function () { listeners.delete(listener); };
  }

  async function dispose() {
    disposed = true;
    for (const record of Array.from(moduleRuntime.values())) {
      try { await deactivateRecord(record, "host-dispose"); } catch (_) {}
      try { await disposeLoadedRecord(record); } catch (_) {}
    }
    const diagnostics = UW.KWWitchDockDiagnostics;
    if (diagnostics && typeof diagnostics.unregisterProvider === "function") {
      try { diagnostics.unregisterProvider(PROVIDER_ID); } catch (_) {}
    }
    listeners.clear();
    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }
    return true;
  }

  const api = Object.freeze({
    version: VERSION,
    build: BUILD,
    registerModule: registerModule,
    refreshManifest: refreshManifest,
    setEnabled: setEnabled,
    setModuleEnabled: setModuleEnabled,
    reportBetaBug: reportBetaBug,
    captureBetaDiagnostic: captureBetaDiagnostic,
    getState: getState,
    onChange: onChange,
    dispose: dispose
  });

  Object.defineProperty(UW, GLOBAL, {
    configurable: true,
    enumerable: true,
    writable: false,
    value: api
  });

  (async function initialize() {
    if (!await waitForStableHost()) return;
    registerTool();

    const diagnosticsEnd = Date.now() + 10000;
    while (!disposed && Date.now() < diagnosticsEnd && !registerDiagnosticsProvider()) {
      await sleep(WAIT_STEP_MS);
    }

    await refreshManifest();
    if (!state.enabled) {
      for (const record of Array.from(moduleRuntime.values())) {
        if (record.active) await deactivateRecord(record, "initial-master-off");
      }
    }
    state.status = state.manifestError ? "manifest-error" : "ready";
    emit();
  })().catch(function (error) {
    state.status = "error";
    state.manifestError = error && error.message ? error.message : String(error);
    emit();
  });
})();

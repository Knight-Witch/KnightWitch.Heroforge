(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const GLOBAL = "KWWitchDockDiagnostics";
  const FEATURE_ID = "witch-dock-diagnostics-core";
  const VERSION = "0.1.1";
  const BUILD = "0.1.1-isolated-provider-section-budgets";
  const DIAGNOSTIC_CONTRACT_VERSION = 1;
  const GENERAL_SCHEMA_VERSION = 1;
  const EVENT_LIMIT = 80;
  const ERROR_LIMIT = 80;
  const PROVIDER_ITEM_LIMIT = 500;
  const GENERAL_SECTIONS = ["environment", "graphics", "witch-dock", "hero-forge", "scene", "errors", "events", "coverage"];

  if (UW[GLOBAL] && UW[GLOBAL].build === BUILD) return;

  const providers = new Map();
  const events = [];
  const errors = [];
  const listeners = new Set();
  let captureCounter = 0;
  let busy = false;
  let lastCapture = null;
  let lastError = null;
  const loadedAt = new Date().toISOString();

  function nowIso() {
    return new Date().toISOString();
  }

  function boundedString(value, max) {
    if (value == null) return null;
    const text = String(value);
    const limit = Number(max) || 1000;
    return text.length > limit ? text.slice(0, limit) + "…" : text;
  }

  function trimRing(list, limit) {
    while (list.length > limit) list.shift();
  }

  function sanitizeUrl(value) {
    if (!value) return null;
    try {
      const u = new URL(String(value), location.href);
      return {
        origin: u.origin,
        pathname: boundedString(u.pathname, 1200)
      };
    } catch (_) {
      return { pathname: boundedString(String(value).split(/[?#]/, 1)[0], 1200) };
    }
  }

  function sanitizeText(value, max) {
    let text = boundedString(value, max || 1600);
    if (!text) return text;
    text = text.replace(/https?:\/\/[^\s)"']+/gi, function (raw) {
      const safe = sanitizeUrl(raw);
      return safe ? String(safe.origin || "") + String(safe.pathname || "") : "[url]";
    });
    text = text.replace(/\b(authorization|cookie|token|access[_-]?token|refresh[_-]?token|session[_-]?token)\s*[:=]\s*[^\s,;]+/gi, "$1=[redacted]");
    return text;
  }

  function sensitiveKey(key) {
    return /^(password|passwd|token|accessToken|refreshToken|authorization|cookie|cookies|secret|sessionToken|auth)$/i.test(String(key || ""));
  }

  function normalize(value, options, state, depth) {
    const opts = Object.assign({
      maxDepth: 8,
      maxKeys: 400,
      maxArray: 500,
      maxString: 1200,
      maxNodes: 6000
    }, options || {});
    const walk = state || { seen: new WeakSet(), nodes: 0 };
    const level = Number(depth) || 0;

    if (value == null || typeof value === "boolean" || typeof value === "number") return value;
    if (typeof value === "string") return boundedString(value, opts.maxString);
    if (typeof value === "bigint") return String(value);
    if (typeof value === "function" || typeof value === "symbol") return undefined;
    if (walk.nodes >= opts.maxNodes) return { __truncated: "node-limit" };
    if (level >= opts.maxDepth) return { __truncated: "depth-limit", type: value && value.constructor ? value.constructor.name : typeof value };

    if (ArrayBuffer.isView(value)) {
      return {
        __typedArray: value.constructor && value.constructor.name || "TypedArray",
        length: Number(value.length) || 0,
        byteLength: Number(value.byteLength) || 0
      };
    }

    if (Array.isArray(value)) {
      if (walk.seen.has(value)) return "[Circular]";
      walk.seen.add(value);
      walk.nodes += 1;
      const out = [];
      const limit = Math.min(value.length, opts.maxArray);
      for (let i = 0; i < limit; i += 1) out.push(normalize(value[i], opts, walk, level + 1));
      if (value.length > limit) out.push({ __truncatedItems: value.length - limit });
      return out;
    }

    if (typeof value === "object") {
      if (walk.seen.has(value)) return "[Circular]";
      walk.seen.add(value);
      walk.nodes += 1;
      const out = {};
      const keys = Object.keys(value).sort();
      const limit = Math.min(keys.length, opts.maxKeys);
      for (let i = 0; i < limit; i += 1) {
        const key = keys[i];
        if (sensitiveKey(key)) continue;
        let descriptor = null;
        try { descriptor = Object.getOwnPropertyDescriptor(value, key); } catch (_) {}
        if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value")) continue;
        const next = normalize(descriptor.value, opts, walk, level + 1);
        if (next !== undefined) out[key] = next;
      }
      if (keys.length > limit) out.__truncatedKeys = keys.length - limit;
      return out;
    }

    return undefined;
  }

  function cloneJson(value) {
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_) { return null; }
  }

  function canonicalValue(value) {
    if (value == null || typeof value !== "object") return value;
    if (Array.isArray(value)) return value.map(canonicalValue);
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = canonicalValue(value[key]);
    return out;
  }

  function canonicalJson(value) {
    return JSON.stringify(canonicalValue(value));
  }

  async function sectionHash(value) {
    const text = canonicalJson(value);
    if (globalThis.crypto && globalThis.crypto.subtle && typeof TextEncoder !== "undefined") {
      try {
        const bytes = new TextEncoder().encode(text);
        const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
        const hex = Array.from(new Uint8Array(digest)).map(function (n) { return n.toString(16).padStart(2, "0"); }).join("");
        return { algorithm: "sha256", value: hex };
      } catch (_) {}
    }

    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return { algorithm: "fnv1a32-fallback", value: (hash >>> 0).toString(16).padStart(8, "0") };
  }

  function byteSize(value) {
    const text = canonicalJson(value);
    try { return new TextEncoder().encode(text).byteLength; }
    catch (_) { return text.length; }
  }

  function recordEvent(type, detail) {
    events.push({
      timestamp: nowIso(),
      type: boundedString(type, 120),
      detail: normalize(detail, { maxDepth: 4, maxKeys: 80, maxArray: 80, maxString: 600, maxNodes: 500 })
    });
    trimRing(events, EVENT_LIMIT);
  }

  function recordError(source, error, extra) {
    const row = {
      timestamp: nowIso(),
      source: boundedString(source || "unknown", 120),
      message: sanitizeText(error && error.message ? error.message : error, 1200),
      stack: sanitizeText(error && error.stack, 2400),
      extra: normalize(extra, { maxDepth: 4, maxKeys: 60, maxArray: 60, maxString: 500, maxNodes: 400 })
    };
    errors.push(row);
    trimRing(errors, ERROR_LIMIT);
    lastError = row.message;
    return row;
  }

  function installHooks() {
    window.addEventListener("error", function (event) {
      recordError("window.error", event && (event.error || event.message), {
        source: event && event.filename ? sanitizeUrl(event.filename) : null,
        line: event && Number(event.lineno) || null,
        column: event && Number(event.colno) || null
      });
    });

    window.addEventListener("unhandledrejection", function (event) {
      recordError("window.unhandledrejection", event && event.reason);
    });

    window.addEventListener("online", function () { recordEvent("network-online", null); });
    window.addEventListener("offline", function () { recordEvent("network-offline", null); });
    document.addEventListener("visibilitychange", function () {
      recordEvent("visibility-change", { state: document.visibilityState });
    });
  }

  function routeKind() {
    const parts = String(location.pathname || "").split("/").filter(Boolean);
    if (!parts.length) return "root";
    return boundedString(parts[0], 120);
  }

  function extractConfigId() {
    try {
      const path = decodeURIComponent(location.pathname || "");
      const match = path.match(/load_config(?:=|\/)(\d{4,})/i);
      if (match) return match[1];
    } catch (_) {}
    try {
      const params = new URLSearchParams(location.search || "");
      for (const key of ["load_config", "config_id", "config"]) {
        const value = params.get(key);
        if (value && /^\d{4,}$/.test(value)) return value;
      }
    } catch (_) {}
    return null;
  }

  function captureEnvironment() {
    return {
      userAgent: boundedString(navigator.userAgent, 700),
      platform: boundedString(navigator.platform, 200),
      hardwareConcurrency: Number(navigator.hardwareConcurrency) || null,
      deviceMemory: Number(navigator.deviceMemory) || null,
      viewport: {
        width: Number(window.innerWidth) || 0,
        height: Number(window.innerHeight) || 0
      },
      devicePixelRatio: Number(window.devicePixelRatio) || 1,
      visibilityState: document.visibilityState || null,
      online: typeof navigator.onLine === "boolean" ? navigator.onLine : null,
      readyState: document.readyState || null
    };
  }

  function captureGraphics() {
    const CK = UW && UW.CK;
    const renderer = CK && CK.renderManager && CK.renderManager.renderer;
    const gl = renderer && typeof renderer.getContext === "function" ? renderer.getContext() : null;
    if (!gl) return { available: false, reason: "renderer-context-unavailable" };

    const out = {
      available: true,
      contextLost: typeof gl.isContextLost === "function" ? !!gl.isContextLost() : null,
      version: null,
      shadingLanguageVersion: null,
      vendor: null,
      renderer: null,
      limits: {}
    };

    try {
      const debug = gl.getExtension && gl.getExtension("WEBGL_debug_renderer_info");
      out.version = boundedString(gl.getParameter(gl.VERSION), 500);
      out.shadingLanguageVersion = boundedString(gl.getParameter(gl.SHADING_LANGUAGE_VERSION), 500);
      out.vendor = boundedString(debug ? gl.getParameter(debug.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR), 500);
      out.renderer = boundedString(debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER), 500);
    } catch (error) {
      out.identityError = sanitizeText(error && error.message || error, 500);
    }

    const params = [
      ["maxTextureSize", "MAX_TEXTURE_SIZE"],
      ["maxRenderbufferSize", "MAX_RENDERBUFFER_SIZE"],
      ["maxCombinedTextureImageUnits", "MAX_COMBINED_TEXTURE_IMAGE_UNITS"]
    ];
    for (const pair of params) {
      try { out.limits[pair[0]] = Number(gl.getParameter(gl[pair[1]])) || null; } catch (_) { out.limits[pair[0]] = null; }
    }
    try {
      const v = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
      out.limits.maxViewportDims = v && v.length >= 2 ? [Number(v[0]) || 0, Number(v[1]) || 0] : null;
    } catch (_) { out.limits.maxViewportDims = null; }

    return out;
  }

  function compactLoaderState() {
    const loader = UW.KWModuleLoader;
    if (!loader || typeof loader.getState !== "function") return null;
    let raw = null;
    try { raw = loader.getState(); } catch (error) {
      recordError("diagnostics.loader-state", error);
      return null;
    }
    const modules = Array.isArray(raw && raw.modules) ? raw.modules.slice(0, PROVIDER_ITEM_LIMIT).map(function (row) {
      return {
        id: boundedString(row && row.id, 200),
        status: boundedString(row && row.status, 120),
        sourceMode: boundedString(row && row.sourceMode, 120),
        error: row && row.error ? sanitizeText(row.error, 700) : null
      };
    }) : [];

    return {
      version: raw && raw.version || null,
      build: raw && raw.build || null,
      status: raw && raw.status || null,
      durationMs: raw && Number(raw.durationMs) || null,
      total: raw && Number(raw.total) || 0,
      enabled: raw && Number(raw.enabled) || 0,
      executed: raw && Number(raw.executed) || 0,
      failed: raw && Number(raw.failed) || 0,
      immutableResolutionCount: raw && Number(raw.immutableResolutionCount) || 0,
      fallbackResolutionCount: raw && Number(raw.fallbackResolutionCount) || 0,
      modules: modules,
      modulesTruncated: Array.isArray(raw && raw.modules) && raw.modules.length > modules.length
    };
  }

  function safeState(apiName) {
    const api = UW[apiName];
    if (!api || typeof api.getState !== "function") return null;
    try { return normalize(api.getState(), { maxDepth: 6, maxKeys: 180, maxArray: 180, maxString: 700, maxNodes: 1600 }); }
    catch (error) {
      recordError("diagnostics." + apiName, error);
      return null;
    }
  }

  function captureWitchDock() {
    const dev = safeState("KWWitchDockDevChannel");
    const stable = safeState("KWWitchDockStableHost");
    const core = safeState("KWWitchDockCore");
    const registry = safeState("KWWitchDockRegistry");
    const loader = compactLoaderState();

    return {
      channel: dev ? "dev" : (stable ? "stable" : (core && core.channel || null)),
      devChannel: dev,
      stableHost: stable,
      core: core,
      loader: loader,
      registry: registry,
      diagnostics: {
        version: VERSION,
        build: BUILD,
        generalSchemaVersion: GENERAL_SCHEMA_VERSION,
        providerIds: Array.from(providers.keys()).sort()
      }
    };
  }

  function scalar(obj, key) {
    try {
      const value = obj && obj[key];
      return value == null || ["string", "number", "boolean"].includes(typeof value) ? value : null;
    } catch (_) {
      return null;
    }
  }

  function captureHeroForge() {
    const HF = UW && UW.HF;
    const CK = UW && UW.CK;
    return {
      origin: location.origin,
      pathname: boundedString(location.pathname, 1000),
      routeKind: routeKind(),
      configId: extractConfigId(),
      build: {
        hfVersion: scalar(HF, "version"),
        hfBuild: scalar(HF, "build"),
        ckVersion: scalar(CK, "version"),
        ckBuild: scalar(CK, "build")
      },
      anchors: {
        CK: !!CK,
        HF: !!HF,
        character: !!(CK && CK.character),
        renderManager: !!(CK && CK.renderManager),
        renderer: !!(CK && CK.renderManager && CK.renderManager.renderer),
        maker: !!(CK && (CK.maker || CK.liveEngine)),
        summonCircle: !!(HF && (HF.summonCircle || HF.app && HF.app.summonCircle || HF.scene && HF.scene.summonCircle))
      }
    };
  }

  function captureScene() {
    const CK = UW && UW.CK;
    const character = CK && CK.character;
    const rows = [];
    const seen = new Set();

    function add(key, display, primary) {
      if (!display || typeof display !== "object" || seen.has(display)) return;
      seen.add(display);
      rows.push({
        key: boundedString(key || "", 120),
        primary: !!primary,
        resourcesReady: display.resourcesReady !== false,
        finished: display.finished !== false,
        meshesPresent: !!display.meshes,
        moddedPresent: !!display.modded
      });
    }

    if (character) {
      add("", character.display, true);
      if (character.allDisplays && typeof character.allDisplays === "object") {
        for (const entry of Object.entries(character.allDisplays)) add(entry[0], entry[1], entry[1] === character.display);
      }
    }

    return {
      characterAvailable: !!character,
      needsUpdating: !!(character && character._needsUpdating),
      inUpdate: !!(character && character._inUpdate),
      displayCount: rows.length,
      primaryDisplayPresent: !!(character && character.display),
      displays: rows,
      renderManagerPresent: !!(CK && CK.renderManager),
      rendererPresent: !!(CK && CK.renderManager && CK.renderManager.renderer)
    };
  }

  function coverageRow(sectionName, status, reason, extra) {
    return Object.assign({
      owner: "general",
      sectionName: sectionName,
      status: status,
      capturedAt: nowIso(),
      reason: reason || null
    }, extra || {});
  }

  function freezeGeneral() {
    const general = {
      schemaVersion: GENERAL_SCHEMA_VERSION,
      environment: captureEnvironment(),
      graphics: null,
      "witch-dock": captureWitchDock(),
      "hero-forge": captureHeroForge(),
      scene: captureScene(),
      errors: cloneJson(errors),
      events: cloneJson(events),
      coverage: null
    };
    general.coverage = [
      coverageRow("environment", "captured", null),
      coverageRow("graphics", "not-captured", "passive-enrichment-pending"),
      coverageRow("witch-dock", "captured", null),
      coverageRow("hero-forge", "captured", null),
      coverageRow("scene", "captured", null),
      coverageRow("errors", "captured-bounded", "ring-started-at-diagnostics-load", { ringStartedAt: loadedAt, limit: ERROR_LIMIT }),
      coverageRow("events", "captured-bounded", "ring-started-at-diagnostics-load", { ringStartedAt: loadedAt, limit: EVENT_LIMIT }),
      coverageRow("coverage", "captured", null)
    ];
    return general;
  }

  function updateCoverage(general, sectionName, status, reason, extra) {
    const rows = Array.isArray(general.coverage) ? general.coverage : [];
    const index = rows.findIndex(function (row) { return row && row.sectionName === sectionName; });
    const row = coverageRow(sectionName, status, reason, extra);
    if (index >= 0) rows[index] = row;
    else rows.push(row);
    general.coverage = rows;
  }

  async function manifestRow(captureId, owner, sectionName, schemaVersion, coverage, value, limitations) {
    return {
      address: [captureId, owner, sectionName].join(" / "),
      owner: owner,
      sectionName: sectionName,
      schemaVersion: schemaVersion,
      coverage: coverage || "captured",
      capturedAt: nowIso(),
      sizeBytes: byteSize(value),
      hash: await sectionHash(value),
      limitations: Array.isArray(limitations) ? limitations.slice(0, 20).map(function (x) { return boundedString(x, 500); }) : []
    };
  }

  function providerSummary(def, result) {
    return {
      providerId: def.providerId,
      providerSchemaVersion: def.providerSchemaVersion,
      version: def.version || null,
      build: def.build || null,
      modes: Array.isArray(def.modes) ? def.modes.slice(0, 20) : [],
      summary: normalize(result && result.summary, { maxDepth: 6, maxKeys: 160, maxArray: 160, maxString: 700, maxNodes: 1200 }),
      warningCodes: Array.isArray(result && result.warnings) ? result.warnings.map(function (row) { return row && row.code; }).filter(Boolean).slice(0, 80) : []
    };
  }

  function normalizeProviderCapture(rawResult) {
    const raw = rawResult && typeof rawResult === "object" ? rawResult : {};
    const rawSections = raw.sections && typeof raw.sections === "object" ? raw.sections : {};
    const sections = {};

    // A large evidence area (for example, material uniforms) must not consume
    // the shared walk budget and erase later, independently addressable areas.
    // Keep every area bounded and privacy-filtered, but budget it separately.
    for (const sectionName of Object.keys(rawSections).sort().slice(0, 80)) {
      sections[sectionName] = normalize(rawSections[sectionName], {
        maxDepth: 12,
        maxKeys: 900,
        maxArray: 1200,
        maxString: 1400,
        maxNodes: 4000
      });
    }

    return {
      summary: normalize(raw.summary, { maxDepth: 6, maxKeys: 160, maxArray: 160, maxString: 700, maxNodes: 1200 }) || {},
      sections: sections,
      coverage: normalize(raw.coverage, { maxDepth: 6, maxKeys: 160, maxArray: 240, maxString: 700, maxNodes: 2400 }) || [],
      warnings: normalize(raw.warnings, { maxDepth: 6, maxKeys: 160, maxArray: 160, maxString: 900, maxNodes: 1600 }) || [],
      events: normalize(raw.events, { maxDepth: 7, maxKeys: 180, maxArray: 240, maxString: 900, maxNodes: 2400 }) || []
    };
  }

  function captureContext(captureId, mode, frozenGeneral) {
    return Object.freeze({
      captureId: captureId,
      captureMode: mode,
      capturedAt: nowIso(),
      general: cloneJson(frozenGeneral),
      recordEvent: function (type, detail) { recordEvent("provider:" + type, detail); },
      recordError: function (source, error, extra) { recordError("provider:" + source, error, extra); }
    });
  }

  function selectedProviders(ids) {
    if (!Array.isArray(ids) || !ids.length) return [];
    const out = [];
    const seen = new Set();
    for (const raw of ids) {
      const id = String(raw || "");
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const def = providers.get(id);
      if (def) out.push(def);
    }
    return out;
  }

  async function captureCurrent(options) {
    if (busy) return { ok: false, error: "Diagnostic capture is already running." };
    const opts = options && typeof options === "object" ? options : {};
    const mode = String(opts.captureMode || "snapshot");
    const captureId = "wdc-" + Date.now().toString(36) + "-" + (++captureCounter).toString(36);
    const capturedAt = nowIso();
    const providerDefs = selectedProviders(opts.providerIds);
    const frozenSeeds = new Map();

    busy = true;
    lastError = null;
    recordEvent("capture-started", { captureId: captureId, captureMode: mode, providerIds: providerDefs.map(function (p) { return p.providerId; }) });
    emit();

    try {
      const general = freezeGeneral();
      const context = captureContext(captureId, mode, general);

      for (const def of providerDefs) {
        if (typeof def.freeze !== "function") continue;
        try {
          frozenSeeds.set(def.providerId, normalize(def.freeze(context), { maxDepth: 8, maxKeys: 300, maxArray: 300, maxString: 900, maxNodes: 3000 }));
        } catch (error) {
          frozenSeeds.set(def.providerId, { __freezeError: sanitizeText(error && error.message || error, 800) });
          recordError("provider-freeze:" + def.providerId, error);
        }
      }

      try {
        general.graphics = captureGraphics();
        updateCoverage(
          general,
          "graphics",
          general.graphics && general.graphics.available ? "captured" : "unavailable",
          general.graphics && general.graphics.available ? null : (general.graphics && general.graphics.reason || "renderer-context-unavailable")
        );
      } catch (error) {
        general.graphics = { available: false, error: sanitizeText(error && error.message || error, 800) };
        updateCoverage(general, "graphics", "unavailable", "graphics-capture-error");
        recordError("general.graphics", error);
      }

      general.errors = cloneJson(errors);
      general.events = cloneJson(events);

      const providerPayloads = {};
      const providerManifest = [];
      const manifestRows = [];
      const topCoverage = cloneJson(general.coverage) || [];

      for (const sectionName of GENERAL_SECTIONS) {
        const value = general[sectionName];
        const coverage = (general.coverage || []).find(function (row) { return row && row.sectionName === sectionName; });
        manifestRows.push(await manifestRow(
          captureId,
          "general",
          sectionName,
          GENERAL_SCHEMA_VERSION,
          coverage && coverage.status || "captured",
          value,
          coverage && coverage.reason ? [coverage.reason] : []
        ));
      }

      for (const def of providerDefs) {
        const id = def.providerId;
        let result = null;
        let failure = null;
        try {
          result = await Promise.resolve(def.capture(context, frozenSeeds.get(id)));
          result = normalizeProviderCapture(result);
        } catch (error) {
          failure = recordError("provider-capture:" + id, error);
          result = {
            summary: { captureFailed: true },
            sections: {},
            coverage: [{ sectionName: "provider", status: "unavailable", reason: "provider-capture-failed" }],
            warnings: [{ provider: id, code: "DIAGNOSTIC_PROVIDER_CAPTURE_FAILED", severity: "warning", message: failure.message }],
            events: []
          };
        }

        const sections = result && result.sections && typeof result.sections === "object" ? result.sections : {};
        const coverageRows = Array.isArray(result && result.coverage) ? result.coverage : [];
        providerPayloads[id] = {
          providerSchemaVersion: def.providerSchemaVersion,
          version: def.version || null,
          build: def.build || null,
          summary: result.summary || {},
          sections: sections,
          coverage: coverageRows,
          warnings: Array.isArray(result.warnings) ? result.warnings : [],
          events: Array.isArray(result.events) ? result.events : []
        };
        providerManifest.push(providerSummary(def, result));

        for (const sectionName of Object.keys(sections).sort()) {
          const coverage = coverageRows.find(function (row) { return row && row.sectionName === sectionName; });
          manifestRows.push(await manifestRow(
            captureId,
            id,
            sectionName,
            def.providerSchemaVersion,
            coverage && coverage.status || "captured",
            sections[sectionName],
            coverage && coverage.reason ? [coverage.reason] : []
          ));
        }
        for (const row of coverageRows) {
          topCoverage.push(Object.assign({ owner: id }, row || {}));
        }
      }

      const channelState = general["witch-dock"] || {};
      const channel = channelState.channel || null;
      const coreState = channelState.core || {};
      const devState = channelState.devChannel || {};
      const stableState = channelState.stableHost || {};

      const pkg = {
        diagnosticContractVersion: DIAGNOSTIC_CONTRACT_VERSION,
        captureId: captureId,
        capturedAt: capturedAt,
        captureMode: mode,
        source: {
          product: "witch-dock",
          channel: channel,
          version: devState.version || stableState.resolvedLauncherVersion || stableState.installedWrapperVersion || null,
          build: devState.build || stableState.resolvedLauncherBuild || coreState.build || null,
          diagnosticsVersion: VERSION,
          diagnosticsBuild: BUILD,
          generalSchemaVersion: GENERAL_SCHEMA_VERSION
        },
        manifest: {
          schemaVersion: 1,
          generatedAt: nowIso(),
          sectionCount: manifestRows.length,
          providerCount: providerManifest.length,
          providers: providerManifest,
          sections: manifestRows
        },
        general: general,
        providers: providerPayloads,
        coverage: topCoverage
      };

      lastCapture = pkg;
      recordEvent("capture-completed", {
        captureId: captureId,
        providerCount: providerManifest.length,
        sectionCount: manifestRows.length,
        sizeBytes: byteSize(pkg)
      });
      return { ok: true, captureId: captureId, capture: cloneJson(pkg) };
    } catch (error) {
      recordError("capture", error);
      return { ok: false, error: sanitizeText(error && error.message || error, 1200) };
    } finally {
      busy = false;
      emit();
    }
  }

  function humanFilename(doc) {
    const stamp = String(doc && doc.capturedAt || nowIso()).replace(/[:.]/g, "-");
    const id = doc && doc.captureId || "unknown";
    return "WitchDock_Bug_Diagnostic_" + stamp + "_" + id + ".json";
  }

  async function downloadLatest() {
    if (!lastCapture) return { ok: false, error: "No diagnostic has been captured yet." };
    const dock = UW.WitchDock;
    if (!dock || typeof dock.downloadBlob !== "function") return { ok: false, error: "Witch Dock download service is unavailable." };
    try {
      const filename = humanFilename(lastCapture);
      const blob = new Blob([JSON.stringify(lastCapture, null, 2)], { type: "application/json;charset=utf-8" });
      await dock.downloadBlob(blob, filename);
      recordEvent("capture-downloaded", { captureId: lastCapture.captureId, filename: filename, sizeBytes: blob.size });
      return { ok: true, filename: filename, sizeBytes: blob.size };
    } catch (error) {
      recordError("download", error);
      return { ok: false, error: sanitizeText(error && error.message || error, 1200) };
    } finally {
      emit();
    }
  }

  async function captureAndDownload(options) {
    const captured = await captureCurrent(options);
    if (!captured.ok) return captured;
    const downloaded = await downloadLatest();
    return Object.assign({ captureId: captured.captureId }, downloaded);
  }

  function registerProvider(definition) {
    const def = definition && typeof definition === "object" ? definition : null;
    if (!def) throw new Error("Diagnostic provider definition is required.");
    const id = String(def.providerId || "");
    if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) throw new Error("Diagnostic providerId must be a stable lowercase slug.");
    if (!Number.isInteger(def.providerSchemaVersion) || def.providerSchemaVersion < 1) throw new Error("Diagnostic providerSchemaVersion must be a positive integer.");
    if (typeof def.capture !== "function") throw new Error("Diagnostic provider requires capture().");

    const normalized = Object.freeze({
      providerId: id,
      providerSchemaVersion: def.providerSchemaVersion,
      version: def.version ? String(def.version) : null,
      build: def.build ? String(def.build) : null,
      modes: Array.isArray(def.modes) ? def.modes.map(String).slice(0, 20) : ["snapshot"],
      capabilities: normalize(def.capabilities, { maxDepth: 4, maxKeys: 80, maxArray: 80, maxString: 500, maxNodes: 500 }),
      freeze: typeof def.freeze === "function" ? def.freeze : null,
      capture: def.capture,
      compare: typeof def.compare === "function" ? def.compare : null,
      dispose: typeof def.dispose === "function" ? def.dispose : null
    });

    providers.set(id, normalized);
    recordEvent("provider-registered", {
      providerId: id,
      providerSchemaVersion: normalized.providerSchemaVersion,
      version: normalized.version,
      build: normalized.build
    });
    emit();
    return true;
  }

  function unregisterProvider(providerId) {
    const id = String(providerId || "");
    const current = providers.get(id);
    if (!current) return false;
    if (typeof current.dispose === "function") {
      try { current.dispose(); } catch (error) { recordError("provider-dispose:" + id, error); }
    }
    providers.delete(id);
    recordEvent("provider-unregistered", { providerId: id });
    emit();
    return true;
  }

  function getProviderInventory() {
    return Array.from(providers.values()).map(function (def) {
      return {
        providerId: def.providerId,
        providerSchemaVersion: def.providerSchemaVersion,
        version: def.version,
        build: def.build,
        modes: def.modes.slice()
      };
    }).sort(function (a, b) { return a.providerId.localeCompare(b.providerId); });
  }

  function getLatestManifest() {
    return cloneJson(lastCapture && lastCapture.manifest || null);
  }

  function getLatestSection(owner, sectionName) {
    if (!lastCapture) return null;
    const o = String(owner || "");
    const name = String(sectionName || "");
    if (o === "general") return cloneJson(lastCapture.general && lastCapture.general[name]);
    const provider = lastCapture.providers && lastCapture.providers[o];
    return cloneJson(provider && provider.sections && provider.sections[name]);
  }

  function getState() {
    return {
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      diagnosticContractVersion: DIAGNOSTIC_CONTRACT_VERSION,
      generalSchemaVersion: GENERAL_SCHEMA_VERSION,
      busy: busy,
      loadedAt: loadedAt,
      providerCount: providers.size,
      providers: getProviderInventory(),
      eventCount: events.length,
      errorCount: errors.length,
      lastCaptureId: lastCapture && lastCapture.captureId || null,
      lastCaptureAt: lastCapture && lastCapture.capturedAt || null,
      lastError: lastError
    };
  }

  function onChange(listener) {
    if (typeof listener !== "function") return function () {};
    listeners.add(listener);
    try { listener(getState()); } catch (_) {}
    return function () { listeners.delete(listener); };
  }

  function emit() {
    const state = getState();
    for (const listener of Array.from(listeners)) {
      try { listener(state); } catch (_) {}
    }
  }

  function dispose() {
    for (const id of Array.from(providers.keys())) unregisterProvider(id);
    listeners.clear();
    return true;
  }

  installHooks();
  recordEvent("diagnostics-loaded", { version: VERSION, build: BUILD });

  UW[GLOBAL] = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    registerProvider: registerProvider,
    unregisterProvider: unregisterProvider,
    getProviderInventory: getProviderInventory,
    captureCurrent: captureCurrent,
    captureAndDownload: captureAndDownload,
    downloadLatest: downloadLatest,
    getLatestManifest: getLatestManifest,
    getLatestSection: getLatestSection,
    getState: getState,
    onChange: onChange,
    dispose: dispose
  });
})();

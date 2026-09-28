(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const FEATURE_ID = "booth-diagnostic-provider";
  const PROVIDER_ID = "booth";
  const PROVIDER_SCHEMA_VERSION = 1;
  const VERSION = "0.2.0";
  const BUILD = "0.2.0-settings-io";
  const MAX_REGISTER_TRIES = 120;

  if (UW.KWBoothDiagnosticProvider && UW.KWBoothDiagnosticProvider.build === BUILD) return;

  let registered = false;
  let registerTries = 0;
  let timer = null;

  function core() {
    return UW.KWWitchDockDiagnostics || null;
  }

  function boothApi() {
    return UW.KW_WD_BOOTH || null;
  }

  function bootstrapApi() {
    return UW.KW_WD_BOOTH_BOOTSTRAP || null;
  }

  function readinessApi() {
    return UW.KWPhotoBoothTrueResolutionReadiness || null;
  }

  function trueResApi() {
    return UW.KWPhotoBoothTrueResolution || null;
  }

  function spinnyApi() {
    return UW.KWSpinnyMiniWebP || null;
  }

  function safeCall(fn, fallback) {
    try { return typeof fn === "function" ? fn() : fallback; }
    catch (_) { return fallback; }
  }

  function safeValue(fn, fallback) {
    try { return fn(); } catch (_) { return fallback; }
  }

  function sanitizeText(value, max) {
    if (value == null) return null;
    const text = String(value);
    return text.length > (max || 800) ? text.slice(0, max || 800) + "…" : text;
  }

  function sanitizeUrl(value) {
    if (!value) return null;
    try {
      const url = new URL(String(value), location.href);
      const out = { origin: url.origin, pathname: url.pathname };
      const version = url.searchParams.get("version");
      if (version) out.version = sanitizeText(version, 200);
      return out;
    } catch (_) {
      return { pathname: sanitizeText(String(value).split(/[?#]/, 1)[0], 1000) };
    }
  }

  function cloneBounded(value, depth, state) {
    const level = Number(depth) || 0;
    const walk = state || { seen: new WeakSet(), nodes: 0 };
    if (value == null || typeof value === "boolean" || typeof value === "number") return value;
    if (typeof value === "string") return sanitizeText(value, 800);
    if (typeof value === "function" || typeof value === "symbol") return undefined;
    if (walk.nodes > 4000) return { __truncated: "node-limit" };
    if (level >= 7) return { __truncated: "depth-limit" };

    if (Array.isArray(value)) {
      if (walk.seen.has(value)) return "[Circular]";
      walk.seen.add(value);
      walk.nodes += 1;
      const limit = Math.min(value.length, 250);
      const out = [];
      for (let i = 0; i < limit; i += 1) out.push(cloneBounded(value[i], level + 1, walk));
      if (value.length > limit) out.push({ __truncatedItems: value.length - limit });
      return out;
    }

    if (typeof value === "object") {
      if (walk.seen.has(value)) return "[Circular]";
      walk.seen.add(value);
      walk.nodes += 1;
      const out = {};
      const keys = Object.keys(value).sort().slice(0, 240);
      for (const key of keys) {
        if (/^(model|character|characterName|character_name|config_id|configId|downloadFilename|filename)$/i.test(key)) continue;
        let descriptor = null;
        try { descriptor = Object.getOwnPropertyDescriptor(value, key); } catch (_) {}
        if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value")) continue;
        const next = cloneBounded(descriptor.value, level + 1, walk);
        if (next !== undefined) out[key] = next;
      }
      return out;
    }
    return undefined;
  }

  function stableJson(value) {
    function sort(v) {
      if (v == null || typeof v !== "object") return v;
      if (Array.isArray(v)) return v.map(sort);
      const out = {};
      for (const key of Object.keys(v).sort()) out[key] = sort(v[key]);
      return out;
    }
    return JSON.stringify(sort(value));
  }

  function smallHash(value) {
    const text = stableJson(value);
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }

  function publicBoothState() {
    const api = boothApi();
    return safeCall(api && api.getState && api.getState.bind(api), null);
  }

  function diagnosticBoothState() {
    const api = boothApi();
    return safeCall(api && api.getDiagnosticState && api.getDiagnosticState.bind(api), null);
  }

  function sanitizedBootstrap() {
    const api = bootstrapApi();
    const raw = safeCall(api && api.getState && api.getState.bind(api), null);
    if (!raw) return null;
    return {
      featureId: raw.featureId || null,
      version: raw.version || null,
      build: raw.build || null,
      enabled: !!raw.enabled,
      persistenceEnabled: !!raw.persistenceEnabled,
      sessionBoothRequested: !!raw.sessionBoothRequested,
      nativeBoothReady: !!raw.nativeBoothReady,
      stableCount: Number(raw.stableCount) || 0,
      stableRequired: Number(raw.stableRequired) || 0,
      inFlight: !!raw.inFlight,
      attempts: Number(raw.attempts) || 0,
      bootstrapCount: Number(raw.bootstrapCount) || 0,
      lastTrigger: raw.lastTrigger || null,
      lastMode: raw.lastMode || null,
      lastSignals: Array.isArray(raw.lastSignals) ? raw.lastSignals.slice(0, 30) : [],
      lastHeroForgeVersion: raw.lastHeroForgeVersion || null,
      lastScriptPath: raw.lastScriptPath ? sanitizeUrl(raw.lastScriptPath) : null,
      lastScriptUrl: raw.lastScriptUrl ? sanitizeUrl(raw.lastScriptUrl) : null,
      loaderStrategy: raw.loaderStrategy || null,
      matchingBoothScriptCount: Number(raw.matchingBoothScriptCount) || 0,
      duplicateBoothScriptCount: Number(raw.duplicateBoothScriptCount) || 0,
      boothScripts: Array.isArray(raw.boothScripts) ? raw.boothScripts.slice(0, 10).map(function (row) {
        return {
          source: row && row.srcAttribute ? sanitizeUrl(row.srcAttribute) : null,
          status: row && row.status || null,
          bootstrapOwned: !!(row && row.bootstrapOwned),
          parent: row && row.parent || null
        };
      }) : [],
      lastStartedAt: Number(raw.lastStartedAt) || 0,
      lastCompletedAt: Number(raw.lastCompletedAt) || 0,
      lastError: cloneBounded(raw.lastError),
      directSessionRequests: Number(raw.directSessionRequests) || 0,
      lastDirectSessionRequestAt: Number(raw.lastDirectSessionRequestAt) || 0,
      btPresent: !!raw.btPresent,
      btSetBoothMode: !!raw.btSetBoothMode
    };
  }

  function nativeRuntime() {
    const BT = safeValue(function () { return UW.BT || null; }, null);
    const engine = BT && (BT.liveEngine || BT.maker) || null;
    const display = BT && BT.display || null;
    return {
      btPresent: !!BT,
      setBoothModeAvailable: !!(BT && typeof BT.setBoothMode === "function"),
      currentMode: BT ? (BT.currentMode || BT._boothMode || null) : null,
      enginePresent: !!engine,
      engineType: engine && engine.constructor ? engine.constructor.name || null : null,
      engineEnabled: !!(engine && engine.enabled === true),
      engineEnabledFor: engine && engine._enabledFor != null ? sanitizeText(engine._enabledFor, 200) : null,
      capabilities: {
        composeDisplayState: !!(engine && typeof engine.composeDisplayState === "function"),
        loadPortrait: !!(engine && typeof engine.loadPortrait === "function"),
        savePortrait: !!(engine && typeof engine.savePortrait === "function"),
        takeScreenshot: !!(engine && typeof engine.takeScreenshot === "function"),
        pushDisplayState: !!(engine && typeof engine.pushDisplayState === "function")
      },
      displayPresent: !!display,
      environmentPresent: !!(display && display.environment),
      environmentMeshPresent: !!(display && display.environment && display.environment.mesh),
      overlaysPresent: !!(display && display.overlays),
      lightingPresent: !!(display && display.lighting),
      displayStatePresent: !!(display && display.state)
    };
  }

  function settingsState() {
    const BT = safeValue(function () { return UW.BT || null; }, null);
    const engine = BT && (BT.liveEngine || BT.maker) || null;
    let composed = null;
    let error = null;
    if (engine && typeof engine.composeDisplayState === "function") {
      try { composed = engine.composeDisplayState(); }
      catch (e) { error = sanitizeText(e && e.message ? e.message : e, 800); }
    }
    if (!composed || typeof composed !== "object") {
      return {
        available: false,
        reason: error ? "compose-display-state-failed" : "compose-display-state-unavailable",
        error: error
      };
    }

    const allowed = {};
    for (const key of ["camera", "cameraSave", "filters", "selected", "lighting", "effects", "aspect", "mode"]) {
      if (Object.prototype.hasOwnProperty.call(composed, key)) allowed[key] = cloneBounded(composed[key]);
    }
    return {
      available: true,
      currentMode: BT && (BT.currentMode || BT._boothMode) || null,
      sourceKeys: Object.keys(composed).sort().slice(0, 100),
      capturedKeys: Object.keys(allowed).sort(),
      domains: allowed,
      hash: smallHash(allowed),
      modelExcluded: Object.prototype.hasOwnProperty.call(composed, "model")
    };
  }

  function canvasState() {
    const CK = safeValue(function () { return UW.CK || null; }, null);
    const renderer = CK && CK.renderManager && CK.renderManager.renderer || null;
    const canvas = renderer && renderer.domElement || null;
    if (!canvas) return { available: false, reason: "renderer-canvas-unavailable" };
    let rect = null;
    try {
      const r = canvas.getBoundingClientRect();
      rect = {
        width: Number(r.width) || 0,
        height: Number(r.height) || 0,
        left: Number(r.left) || 0,
        top: Number(r.top) || 0
      };
    } catch (_) {}
    return {
      available: true,
      pixelWidth: Number(canvas.width) || 0,
      pixelHeight: Number(canvas.height) || 0,
      clientWidth: Number(canvas.clientWidth) || 0,
      clientHeight: Number(canvas.clientHeight) || 0,
      rect: rect,
      inlineBackground: canvas.style ? (canvas.style.background || canvas.style.backgroundColor || null) : null
    };
  }

  function presentationState(diag) {
    const BT = safeValue(function () { return UW.BT || null; }, null);
    const display = BT && BT.display || null;
    const overlays = display && display.overlays || null;
    return {
      boothActive: !!(diag && diag.boothOn),
      blackCanvasExpected: !!(diag && diag.blackCanvasOn),
      blackCanvasApplied: diag && typeof diag.blackCanvasApplied === "boolean" ? diag.blackCanvasApplied : null,
      canvasLayoutKey: diag && diag.canvasLayoutKey || null,
      boothFrameHidden: !!(diag && diag.boothFrameHidden),
      shaderFrameHidden: !!(diag && diag.shaderFrameHidden),
      hasEnvironmentMesh: !!(diag && diag.hasEnvironmentMesh),
      hasCapturedBackdrop: !!(diag && diag.hasCapturedBackdrop),
      hasCapturedTokenBg: !!(diag && diag.hasCapturedTokenBg),
      overlayKeys: overlays && typeof overlays === "object" ? Object.keys(overlays).sort().slice(0, 80) : [],
      canvas: canvasState()
    };
  }

  function componentsState(diag, settings) {
    const components = diag && diag.components || {};
    const enabledPasses = safeValue(function () {
      const passes = settings && settings.domains && settings.domains.effects &&
        settings.domains.effects.effects && settings.domains.effects.effects.enabledPasses;
      return Array.isArray(passes) ? passes.slice(0, 80) : [];
    }, []);
    return {
      lighting: !!components.lighting,
      effects: !!components.effects,
      overlays: !!components.overlays,
      background: !!components.background,
      captured: {
        backdrop: !!(diag && diag.hasCapturedBackdrop),
        tokenBackground: !!(diag && diag.hasCapturedTokenBg),
        lighting: !!(diag && diag.hasCapturedLighting),
        effects: !!(diag && diag.hasCapturedEffects)
      },
      selectedTokenBackground: diag && diag.capturedTokenBgSelected != null ? diag.capturedTokenBgSelected : null,
      enabledEffectPasses: enabledPasses,
      settingsHash: settings && settings.hash || null
    };
  }

  function trueResolutionState() {
    const svc = trueResApi();
    const readiness = readinessApi();
    const ready = safeCall(readiness && readiness.getState && readiness.getState.bind(readiness), null);
    const last = svc ? safeValue(function () { return svc.lastCapture; }, null) : null;
    return {
      servicePresent: !!svc,
      build: svc && svc.build || null,
      enabled: svc ? !!svc.enabled : null,
      providerInstalled: svc ? !!svc.providerInstalled : null,
      providerLost: svc ? !!svc.providerLost : null,
      busy: svc ? !!svc.busy : null,
      status: svc ? svc.status || null : null,
      error: svc ? sanitizeText(svc.lastError, 800) : null,
      readiness: cloneBounded(ready),
      lastCapture: last ? {
        build: last.build || null,
        source: last.source || null,
        requestedWidth: Number(last.requestedWidth) || null,
        requestedHeight: Number(last.requestedHeight) || null,
        sourceSize: Number(last.sourceSize) || null,
        maxTextureSize: Number(last.maxTextureSize) || null,
        maxRenderbufferSize: Number(last.maxRenderbufferSize) || null,
        startedAt: last.startedAt || null,
        completedAt: last.completedAt || null,
        status: last.status || null,
        captureMode: last.captureMode || null,
        nativeTrueResolutionDetected: !!last.nativeTrueResolutionDetected,
        boothMode: last.boothMode || null,
        boothAspect: Number.isFinite(Number(last.boothAspect)) ? Number(last.boothAspect) : null,
        tileSize: Number(last.tileSize) || null,
        grid: Number(last.grid) || null,
        expectedPhases: Number(last.expectedPhases) || null,
        suppliedPhaseCount: Number(last.suppliedPhaseCount) || 0,
        uniquePhaseCount: Number(last.uniquePhaseCount) || 0,
        expectedSourceGroups: Number(last.expectedSourceGroups) || null,
        sourceGroupsRendered: Number(last.sourceGroupsRendered) || 0,
        sourceGroupsReleased: Number(last.sourceGroupsReleased) || 0,
        result: cloneBounded(last.result),
        effectsRestored: !!last.effectsRestored,
        error: sanitizeText(last.error, 800)
      } : null
    };
  }

  function spinnyState() {
    const svc = spinnyApi();
    if (!svc) return { servicePresent: false };
    const diag = svc.diagnostics || {};
    const last = safeValue(function () { return svc.lastCapture; }, null);
    return {
      servicePresent: true,
      version: svc.version || null,
      build: svc.build || null,
      busy: !!svc.busy,
      paused: !!svc.paused,
      pauseRequested: !!svc.pauseRequested,
      activeMode: svc.activeMode || null,
      statusText: svc.statusText || null,
      statusError: !!svc.statusError,
      progressFraction: Number(svc.progressFraction) || 0,
      selectedProfile: cloneBounded(diag.selectedProfile),
      capability: cloneBounded(diag.capability),
      activeTiming: diag.activeTiming ? {
        timingKey: diag.activeTiming.timingKey || null,
        completedFrames: Number(diag.activeTiming.completedFrames) || 0,
        pauseCount: Number(diag.activeTiming.pauseCount) || 0,
        pausedTotalMs: Number(diag.activeTiming.pausedTotalMs) || 0
      } : null,
      lastGuardAttempt: cloneBounded(svc.lastGuardAttempt),
      lastCapture: last ? {
        version: last.version || null,
        build: last.build || null,
        mode: last.mode || null,
        status: last.status || null,
        startedAt: last.startedAt || null,
        completedAt: last.completedAt || null,
        requested: cloneBounded(last.requested),
        frameSource: last.frameSource || null,
        frameSourceDiagnosticCount: Array.isArray(last.frameSourceDiagnostics) ? last.frameSourceDiagnostics.length : 0,
        framesRendered: Number(last.framesRendered) || 0,
        framesEncoded: Number(last.framesEncoded) || 0,
        encodedFrameBytes: Number(last.encodedFrameBytes) || 0,
        outputBytes: Number(last.outputBytes) || null,
        parsed: cloneBounded(last.parsed),
        downloadMethod: last.downloadMethod || null,
        downloadConfirmed: !!last.downloadConfirmed,
        elapsedMs: Number(last.elapsedMs) || null,
        activeElapsedMs: Number(last.activeElapsedMs) || null,
        timing: cloneBounded(last.timing),
        paused: !!last.paused,
        pauseCount: Number(last.pauseCount) || 0,
        pausedTotalMs: Number(last.pausedTotalMs) || 0,
        cancellationCause: last.cancellationCause || null,
        guardedAction: cloneBounded(last.guardedAction),
        rotationRestored: !!last.rotationRestored,
        error: sanitizeText(last.error, 800)
      } : null
    };
  }

  function mediaState() {
    return {
      trueResolution: trueResolutionState(),
      spinny: spinnyState()
    };
  }

  function freeze() {
    const diag = diagnosticBoothState();
    return {
      booth: publicBoothState(),
      diagnostic: diag,
      bootstrap: sanitizedBootstrap(),
      native: nativeRuntime(),
      presentation: presentationState(diag),
      media: mediaState()
    };
  }

  function warning(code, message, phase, expected, actual) {
    return {
      provider: PROVIDER_ID,
      code: code,
      phase: phase || null,
      severity: "warning",
      message: message || null,
      expected: expected || null,
      actual: actual || null
    };
  }

  function capture(context, frozenSeed) {
    const frozen = frozenSeed || freeze();
    const booth = frozen.booth || publicBoothState();
    const diag = frozen.diagnostic || diagnosticBoothState();
    const bootstrap = frozen.bootstrap || sanitizedBootstrap();
    const native = frozen.native || nativeRuntime();
    const presentation = frozen.presentation || presentationState(diag);
    const settings = settingsState();
    const settingsIo = diag && Array.isArray(diag.settingsIo) ? cloneBounded(diag.settingsIo) : [];
    const components = componentsState(diag, settings);
    const media = frozen.media || mediaState();

    const warnings = [];
    if (bootstrap && bootstrap.lastError) {
      warnings.push(warning("BOOTH_BOOTSTRAP_FAILED", "The latest Booth bootstrap attempt recorded an error.", "bootstrap", null, bootstrap.lastError));
    }
    if (bootstrap && bootstrap.duplicateBoothScriptCount > 0) {
      warnings.push(warning("BOOTH_NATIVE_SCRIPT_DUPLICATE", "More than one matching native Booth script is present.", "bootstrap", 0, bootstrap.duplicateBoothScriptCount));
    }
    if (booth && booth.sessionBoothView && bootstrap && !bootstrap.nativeBoothReady && !bootstrap.inFlight) {
      warnings.push(warning("BOOTH_NATIVE_RUNTIME_UNAVAILABLE", "Booth View is requested but the native Booth runtime is not ready.", "runtime", true, false));
    }
    if (presentation && presentation.blackCanvasExpected && presentation.blackCanvasApplied === false) {
      warnings.push(warning("BOOTH_PRESENTATION_MISMATCH", "Black Canvas is expected but the current presentation does not read back as applied.", "presentation", true, false));
    }

    const tr = media && media.trueResolution;
    if (tr && tr.readiness && tr.servicePresent && tr.enabled && tr.providerInstalled &&
        tr.readiness.makerEnabled && tr.readiness.ready === false) {
      warnings.push(warning("BOOTH_MEDIA_READINESS_MISMATCH", "TRUE-resolution service is installed with Booth active but readiness is false.", "media", true, false));
    }
    if (tr && tr.lastCapture && tr.lastCapture.status === "failed") {
      warnings.push(warning("BOOTH_MEDIA_CAPTURE_FAILED", tr.lastCapture.error || "TRUE-resolution capture failed.", "media", null, tr.lastCapture.status));
    }

    const spinny = media && media.spinny;
    if (spinny && spinny.lastCapture && spinny.lastCapture.status === "failed") {
      warnings.push(warning("BOOTH_MEDIA_CAPTURE_FAILED", spinny.lastCapture.error || "Spinny capture failed.", "media", null, spinny.lastCapture.status));
    }
    const lastSettingsIo = Array.isArray(settingsIo) && settingsIo.length ? settingsIo[settingsIo.length - 1] : null;
    if (lastSettingsIo && lastSettingsIo.result === "failed") {
      warnings.push(warning(lastSettingsIo.code || "BOOTH_SETTINGS_LOAD_FAILED", lastSettingsIo.message || "The latest Booth settings file operation failed.", "settings-io", "success", "failed"));
    }

    if (spinny && spinny.lastCapture && spinny.lastCapture.status &&
        spinny.lastCapture.status !== "running" && spinny.lastCapture.rotationRestored === false &&
        spinny.lastCapture.framesRendered > 0) {
      warnings.push(warning("BOOTH_MEDIA_RESTORE_FAILED", "Spinny capture did not confirm display rotation restoration.", "media", true, false));
    }

    const failureContext = {
      bootstrap: bootstrap && bootstrap.lastError || null,
      trueResolution: tr && tr.error ? { error: tr.error, lastCapture: tr.lastCapture && tr.lastCapture.status === "failed" ? tr.lastCapture : null } : null,
      spinny: spinny && (spinny.statusError || spinny.lastCapture && spinny.lastCapture.status === "failed")
        ? { statusText: spinny.statusText || null, lastCapture: spinny.lastCapture || null }
        : null,
      settingsIo: lastSettingsIo && lastSettingsIo.result === "failed" ? lastSettingsIo : null,
      retainedSettingsIoAvailable: !!lastSettingsIo,
      retainedPresentationAvailable: false,
      limitation: "presentation-retained-failure-ring-not-yet-implemented"
    };

    const sections = {
      state: {
        public: booth,
        diagnostic: diag
      },
      bootstrap: bootstrap,
      "native-runtime": native,
      settings: settings,
      "settings-io": settingsIo,
      presentation: presentation,
      components: components,
      media: media,
      "failure-context": failureContext,
      events: []
    };

    const coverage = [
      { sectionName: "state", status: booth || diag ? "captured" : "unavailable", reason: booth || diag ? null : "booth-state-unavailable" },
      { sectionName: "bootstrap", status: bootstrap ? "captured" : "unavailable", reason: bootstrap ? null : "booth-bootstrap-unavailable" },
      { sectionName: "native-runtime", status: "captured", reason: null },
      { sectionName: "settings", status: settings && settings.available ? "captured-bounded" : "unavailable", reason: settings && settings.available ? "allowlisted-display-state-domains" : settings && settings.reason || "settings-unavailable" },
      { sectionName: "settings-io", status: "captured-bounded", reason: "bounded-user-settings-file-operations-no-file-content" },
      { sectionName: "presentation", status: "captured-bounded", reason: "bounded-presentation-descriptors" },
      { sectionName: "components", status: "captured-bounded", reason: "bounded-component-state" },
      { sectionName: "media", status: "captured-bounded", reason: "media-bytes-and-filenames-excluded" },
      { sectionName: "failure-context", status: "partial", reason: failureContext.limitation },
      { sectionName: "events", status: "not-captured", reason: "stable-booth-event-normalization-not-yet-implemented" }
    ];

    const summary = {
      runtimeAvailable: !!(native && native.btPresent),
      runtimeReady: !!(bootstrap && bootstrap.nativeBoothReady),
      nativeMode: native && native.currentMode || null,
      sessionBoothView: !!(booth && booth.sessionBoothView),
      sessionBlackCanvas: !!(booth && booth.sessionBlackCanvas),
      blackCanvasApplied: presentation ? presentation.blackCanvasApplied : null,
      savedBoothSetupDetected: !!(booth && booth.savedBoothSetupDetected),
      savedBoothMode: booth && booth.savedBoothMode || null,
      components: components ? {
        lighting: components.lighting,
        effects: components.effects,
        overlays: components.overlays,
        background: components.background
      } : null,
      bootstrapInFlight: !!(bootstrap && bootstrap.inFlight),
      bootstrapAttempts: bootstrap ? bootstrap.attempts : null,
      bootstrapCount: bootstrap ? bootstrap.bootstrapCount : null,
      boothScriptCount: bootstrap ? bootstrap.matchingBoothScriptCount : null,
      duplicateBoothScriptCount: bootstrap ? bootstrap.duplicateBoothScriptCount : null,
      settingsHash: settings && settings.hash || null,
      settingsIoCount: Array.isArray(settingsIo) ? settingsIo.length : 0,
      lastSettingsIoOperation: lastSettingsIo ? lastSettingsIo.operation : null,
      lastSettingsIoResult: lastSettingsIo ? lastSettingsIo.result : null,
      lastSettingsIoCode: lastSettingsIo ? lastSettingsIo.code : null,
      trueResolutionReady: tr && tr.readiness ? !!tr.readiness.ready : null,
      trueResolutionBusy: tr ? tr.busy : null,
      trueResolutionLastStatus: tr && tr.lastCapture ? tr.lastCapture.status : null,
      spinnyReady: spinny && spinny.capability ? !!spinny.capability.ok : null,
      spinnyBusy: spinny ? spinny.busy : null,
      spinnyPaused: spinny ? spinny.paused : null,
      spinnyLastStatus: spinny && spinny.lastCapture ? spinny.lastCapture.status : null,
      warningCodes: warnings.map(function (row) { return row.code; }),
      retainedSettingsPresentationFailureContextAvailable: false
    };

    return {
      summary: summary,
      sections: sections,
      coverage: coverage,
      warnings: warnings,
      events: []
    };
  }

  function register() {
    if (registered) return true;
    const svc = core();
    if (!svc || typeof svc.registerProvider !== "function") return false;

    svc.registerProvider({
      providerId: PROVIDER_ID,
      providerSchemaVersion: PROVIDER_SCHEMA_VERSION,
      version: VERSION,
      build: BUILD,
      modes: ["snapshot", "failure"],
      capabilities: {
        snapshot: true,
        comparison: false,
        retainedSettingsPresentationFailureContext: false
      },
      freeze: freeze,
      capture: capture
    });

    registered = true;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    return true;
  }

  function dispose() {
    const svc = core();
    if (registered && svc && typeof svc.unregisterProvider === "function") {
      try { svc.unregisterProvider(PROVIDER_ID); } catch (_) {}
    }
    registered = false;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    return true;
  }

  UW.KWBoothDiagnosticProvider = Object.freeze({
    featureId: FEATURE_ID,
    providerId: PROVIDER_ID,
    providerSchemaVersion: PROVIDER_SCHEMA_VERSION,
    version: VERSION,
    build: BUILD,
    getState: function () {
      return {
        featureId: FEATURE_ID,
        providerId: PROVIDER_ID,
        providerSchemaVersion: PROVIDER_SCHEMA_VERSION,
        version: VERSION,
        build: BUILD,
        registered: registered,
        registerTries: registerTries,
        boothAvailable: !!boothApi(),
        bootstrapAvailable: !!bootstrapApi(),
        readinessAvailable: !!readinessApi(),
        trueResolutionAvailable: !!trueResApi(),
        spinnyAvailable: !!spinnyApi(),
        coreAvailable: !!core()
      };
    },
    dispose: dispose
  });

  if (!register()) {
    timer = setInterval(function () {
      registerTries += 1;
      if (register() || registerTries >= MAX_REGISTER_TRIES) {
        if (timer) clearInterval(timer);
        timer = null;
      }
    }, 100);
  }
})();
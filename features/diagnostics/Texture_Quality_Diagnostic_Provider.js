(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const FEATURE_ID = "texture-quality-diagnostic-provider";
  const PROVIDER_ID = "texture-quality";
  const PROVIDER_SCHEMA_VERSION = 1;
  const VERSION = "0.2.0";
  const BUILD = "0.2.0-retained-lifecycle-evidence";
  const MAX_REGISTER_TRIES = 120;

  if (UW.KWTextureQualityDiagnosticProvider &&
      UW.KWTextureQualityDiagnosticProvider.build === BUILD) return;

  let registered = false;
  let registerTries = 0;
  let timer = null;

  function legacy() {
    return UW.KWTextureQualityDiagnostics || null;
  }

  function nativeService() {
    return UW.KWTextureQualityNativeReconcile || null;
  }

  function core() {
    return UW.KWWitchDockDiagnostics || null;
  }

  function safeCall(fn, fallback) {
    try {
      return typeof fn === "function" ? fn() : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function warningRows(rows) {
    return Array.isArray(rows) ? rows.map(function (row) {
      if (!row || typeof row !== "object") return null;
      return {
        provider: PROVIDER_ID,
        code: row.code || "TEXTURE_QUALITY_WARNING",
        phase: row.phase || null,
        severity: row.severity || "warning",
        message: row.message || row.reason || null,
        expected: row.expected || null,
        actual: row.actual || null
      };
    }).filter(Boolean) : [];
  }

  function countAaidFallbacks(resources) {
    if (!Array.isArray(resources)) return 0;
    let count = 0;
    for (const row of resources) {
      if (!row || typeof row !== "object") continue;
      const roles = Array.isArray(row.roles) ? row.roles : [];
      const size = Array.isArray(row.size) ? row.size : null;
      if (!roles.some(function (role) { return /aaid/i.test(String(role || "")); })) continue;
      if (size && Number(size[0]) === 1 && Number(size[1]) === 1) count += 1;
    }
    return count;
  }

  function coverage(sectionName, value, options) {
    const opts = options || {};
    if (opts.status) {
      return {
        sectionName: sectionName,
        status: opts.status,
        reason: opts.reason || null
      };
    }
    return {
      sectionName: sectionName,
      status: value == null ? "unavailable" : (opts.bounded ? "captured-bounded" : "captured"),
      reason: value == null ? (opts.reason || "legacy-section-unavailable") : (opts.reason || null)
    };
  }

  function freeze() {
    const hr = nativeService();
    const diag = legacy();
    return {
      nativeState: safeCall(hr && hr.getDiagnosticState && hr.getDiagnosticState.bind(hr), null),
      legacyState: safeCall(diag && diag.getState && diag.getState.bind(diag), null),
      lifecycle: safeCall(hr && hr.getDiagnosticLifecycle && hr.getDiagnosticLifecycle.bind(hr), null),
      failureContext: safeCall(hr && hr.getRetainedFailureContext && hr.getRetainedFailureContext.bind(hr), null)
    };
  }

  function capture(context, frozenSeed) {
    const diag = legacy();
    if (!diag || typeof diag.captureCurrent !== "function" || typeof diag.getLatestSection !== "function") {
      throw new Error("High Res Diagnostic Capture v0.1.3 is unavailable.");
    }

    const result = diag.captureCurrent();
    if (!result || result.ok !== true) {
      throw new Error(result && result.error ? result.error : "High Res diagnostic snapshot failed.");
    }

    const figures = diag.getLatestSection("figures");
    const paintState = diag.getLatestSection("paintState");
    const atlas = diag.getLatestSection("atlas");
    const materials = diag.getLatestSection("materials");
    const resources = diag.getLatestSection("resources");
    const colorBake = diag.getLatestSection("colorBake");
    const verification = diag.getLatestSection("verification");
    const legacyLifecycle = diag.getLatestSection("lifecycle");
    const legacyFailureContext = diag.getLatestSection("failureContext");
    const warnings = diag.getLatestSection("warnings");
    const events = diag.getLatestSection("events");
    const legacySummary = diag.getLatestSection("summary");
    const latestState = safeCall(diag.getState && diag.getState.bind(diag), null);
    const currentNative = safeCall(function () {
      const hr = nativeService();
      return hr && typeof hr.getDiagnosticState === "function" ? hr.getDiagnosticState() : null;
    }, null);
    const currentLifecycle = safeCall(function () {
      const hr = nativeService();
      return hr && typeof hr.getDiagnosticLifecycle === "function" ? hr.getDiagnosticLifecycle() : null;
    }, legacyLifecycle);
    const currentFailureContext = safeCall(function () {
      const hr = nativeService();
      return hr && typeof hr.getRetainedFailureContext === "function" ? hr.getRetainedFailureContext() : null;
    }, legacyFailureContext);

    const frozenState = frozenSeed ? {
      nativeState: frozenSeed.nativeState || null,
      legacyState: frozenSeed.legacyState || null,
      lifecycle: frozenSeed.lifecycle ? {
        activeAttemptId: frozenSeed.lifecycle.active && frozenSeed.lifecycle.active.attemptId || null,
        activeOperation: frozenSeed.lifecycle.active && frozenSeed.lifecycle.active.operation || null,
        recentAttemptCount: Array.isArray(frozenSeed.lifecycle.recentAttempts) ? frozenSeed.lifecycle.recentAttempts.length : 0
      } : null,
      failureContext: frozenSeed.failureContext ? {
        available: !!frozenSeed.failureContext.available,
        count: Number(frozenSeed.failureContext.count) || 0,
        reason: frozenSeed.failureContext.reason || null
      } : null
    } : null;

    const state = {
      frozen: frozenState,
      current: {
        diagnostics: latestState,
        native: currentNative
      }
    };

    const lifecycle = frozenSeed && frozenSeed.lifecycle || currentLifecycle || legacyLifecycle || null;
    const failureContext = frozenSeed && frozenSeed.failureContext || currentFailureContext || legacyFailureContext || {
      semantics: {
        evidenceType: "retained-pre-cleanup-runtime-evidence",
        analysisStatus: "not-analyzed",
        causalityClaimed: false
      },
      available: false,
      reason: "native-retained-failure-context-unavailable",
      count: 0,
      records: []
    };

    const sections = {
      state: state,
      figures: figures,
      "paint-state": paintState,
      atlas: atlas,
      materials: materials,
      resources: resources,
      "color-bake": colorBake,
      verification: verification,
      lifecycle: lifecycle,
      "failure-context": failureContext,
      events: events
    };

    const coverageRows = [
      coverage("state", state),
      coverage("figures", figures),
      coverage("paint-state", paintState),
      coverage("atlas", atlas),
      coverage("materials", materials),
      coverage("resources", resources),
      coverage("color-bake", colorBake),
      coverage("verification", verification),
      coverage("lifecycle", lifecycle, {
        status: lifecycle ? "captured-bounded" : "unavailable",
        reason: lifecycle ? "bounded-native-lifecycle-attempts" : "native-lifecycle-evidence-unavailable"
      }),
      coverage("failure-context", failureContext, {
        status: failureContext && failureContext.available ? "captured-bounded" : "not-applicable",
        reason: failureContext && failureContext.available ? "bounded-retained-pre-cleanup-failures" : (failureContext && failureContext.reason || "no-retained-texture-quality-failure")
      }),
      coverage("events", events, {
        bounded: true,
        reason: "legacy-high-res-event-ring"
      })
    ];

    const warningList = warningRows(warnings);
    const nativeAtFreeze = frozenSeed && frozenSeed.nativeState || null;
    const summary = {
      legacy: legacySummary || null,
      highResEnabled: nativeAtFreeze ? !!nativeAtFreeze.enabled : (currentNative ? !!currentNative.enabled : null),
      highResBusy: nativeAtFreeze ? !!nativeAtFreeze.busy : (currentNative ? !!currentNative.busy : null),
      persistent: nativeAtFreeze ? !!nativeAtFreeze.persistent : (currentNative ? !!currentNative.persistent : null),
      figureCount: Array.isArray(figures) ? figures.length : null,
      warningCodes: warningList.map(function (row) { return row.code; }),
      aaidFallback1x1Count: countAaidFallbacks(resources),
      lifecycleAttemptCount: lifecycle && Array.isArray(lifecycle.recentAttempts) ? lifecycle.recentAttempts.length : 0,
      retainedFailureContextAvailable: !!(failureContext && failureContext.available),
      retainedFailureCount: failureContext && Number(failureContext.count) || 0,
      evidenceType: "observational-runtime-evidence",
      analysisStatus: "not-analyzed",
      causalityClaimed: false,
      legacyCaptureId: result.captureId || null
    };

    return {
      summary: summary,
      sections: sections,
      coverage: coverageRows,
      warnings: warningList,
      events: Array.isArray(events) ? events : []
    };
  }

  function compare(context, comparisonMode) {
    const diag = legacy();
    if (!diag || typeof diag.compareNativeOffToHighRes !== "function") {
      return { ok: false, error: "High Res comparison service is unavailable." };
    }
    const mode = String(comparisonMode || "native-off-to-high-res");
    if (mode !== "native-off-to-high-res") {
      return { ok: false, error: "Unsupported Texture Quality comparison mode: " + mode };
    }
    return diag.compareNativeOffToHighRes();
  }

  function register() {
    if (registered) return true;
    const svc = core();
    const diag = legacy();
    if (!svc || typeof svc.registerProvider !== "function" || !diag) return false;

    svc.registerProvider({
      providerId: PROVIDER_ID,
      providerSchemaVersion: PROVIDER_SCHEMA_VERSION,
      version: VERSION,
      build: BUILD,
      modes: ["snapshot", "comparison", "failure"],
      capabilities: {
        snapshot: true,
        comparison: ["native-off-to-high-res"],
        retainedFailureContext: true,
        lifecycleEvidence: ["before", "during", "failure-pre-cleanup", "after"],
        evidenceSemantics: "observational-not-analyzed",
        legacyDiagnosticVersion: diag.version || null,
        legacyDiagnosticBuild: diag.build || null
      },
      freeze: freeze,
      capture: capture,
      compare: compare
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

  UW.KWTextureQualityDiagnosticProvider = Object.freeze({
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
        legacyAvailable: !!legacy(),
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

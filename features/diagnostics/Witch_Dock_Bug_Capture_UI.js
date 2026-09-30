(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const FEATURE_ID = "witch-dock-bug-capture-ui";
  const VERSION = "0.4.1";
  const BUILD = "0.4.1-refined-shared-intake";
  const TOOL_ID = "bug-capture";
  const GLOBAL = "KWWitchDockBugReporter";
  const OVERLAY_ID = "kwBugReporterOverlay";
  const RESTORE_ID = "kwBugReporterRestore";
  const STYLE_ID = "kw-bug-reporter-style";

  if (UW[GLOBAL] && UW[GLOBAL].build === BUILD) return;

  const SECTION_CONTEXT = Object.freeze({
    "body-editor:arms": { productId: "witch-dock", groupId: "wd-body-editor", featureId: "body-extra-arms-sync" },
    "body-editor:breast": { productId: "witch-dock", groupId: "wd-body-editor", featureId: "body-breast-mirror" },
    "body-editor:butt": { productId: "witch-dock", groupId: "wd-body-editor", featureId: "body-butt-mirror" },
    "pose-tool:swap-main-extra": { productId: "witch-dock", groupId: "wd-pose", featureId: "pose-main-extra-swap" },
    "json-tool:json-bulk-backup": { productId: "witch-dock", groupId: "wd-json", featureId: "json-tool" },
    "booth-tool:booth-json": { productId: "witch-dock", groupId: "wd-booth", featureId: "booth-json" },
    "booth-tool:booth": { productId: "witch-dock", groupId: "wd-booth" },
    "utilities:witch-dock": { productId: "witch-dock", groupId: "wd-utilities", featureId: "dock-reset-size" },
    "utilities:script-status": { productId: "witch-dock", groupId: "wd-utilities", featureId: "script-status" },
    "utilities:booth-features": { productId: "witch-dock", groupId: "wd-booth" },
    "utilities:bound-decal-gizmo": { productId: "witch-dock", groupId: "wd-decals", featureId: "bound-decal-gizmo" },
    "utilities:heroforge-ui": { productId: "witch-dock", groupId: "wd-utilities" }
  });

  const TOOL_CONTEXT = Object.freeze({
    "body-editor": { productId: "witch-dock", groupId: "wd-body-editor" },
    "pose-tool": { productId: "witch-dock", groupId: "wd-pose" },
    "decals-dev": { productId: "witch-dock", groupId: "wd-decals" },
    "booth-tool": { productId: "witch-dock", groupId: "wd-booth" },
    "json-tool": { productId: "witch-dock", groupId: "wd-json", featureId: "json-tool" },
    "utilities": { productId: "witch-dock", groupId: "wd-utilities" }
  });

  const SCRIPT_COMPAT_FEATURES = new Set([
    "kitbash-capacity",
    "kitbash-scale-range",
    "kitbash-asymmetric-scaling",
    "extra-mini-slots"
  ]);
  const SCRIPT_COMPAT_SCRIPTS = new Set(["lob-2000-kitbash-parts", "lob-extra-slots"]);
  const JSON_COMPAT_FEATURES = new Set(["reck-json-compatibility", "character-local-import", "character-local-export"]);
  const JSON_COMPAT_SCRIPTS = new Set(["reck-for-hero-forge"]);

  let state = null;
  let overlay = null;
  let contextualObserver = null;
  let dockHideState = null;

  function client() { return UW.KWWitchDockReporterClient || null; }
  function diagnostics() { return UW.KWWitchDockDiagnostics || null; }
  function nowIso() { return new Date().toISOString(); }
  function clone(value) { try { return JSON.parse(JSON.stringify(value)); } catch (_) { return null; } }
  function clean(value) { const text = String(value == null ? "" : value).trim(); return text || ""; }
  function uuid() {
    const svc = client();
    if (svc && typeof svc.uuid === "function") return svc.uuid();
    return globalThis.crypto && typeof globalThis.crypto.randomUUID === "function" ? globalThis.crypto.randomUUID() : "wd-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  }
  function sourceClientVersion() {
    try {
      const dev = UW.KWWitchDockDevChannel;
      if (dev && dev.version) return String(dev.version);
    } catch (_) {}
    try {
      const core = UW.WitchDock && typeof UW.WitchDock.getState === "function" ? UW.WitchDock.getState() : null;
      if (core && core.version) return String(core.version);
    } catch (_) {}
    return VERSION;
  }
  function sourceScope(productId) {
    if (productId === "witch-dock") return "witch-scripts";
    if (productId === "lob-hf-json") return "hf-json-scripts";
    if (productId === "ecosystem-compatibility") return "ecosystem-compatibility";
    return "unknown";
  }

  function iconSvg(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const paths = name === "bug"
      ? ["M8 2l1.4 2.1M16 2l-1.4 2.1M4 9H2M22 9h-2M4 15H2M22 15h-2M7 19l-2 2M17 19l2 2", "M8 7a4 4 0 0 1 8 0v1H8V7zM6 10h12v5a6 6 0 0 1-12 0v-5zM12 10v10"]
      : name === "eye-off"
        ? ["M3 3l18 18", "M10.6 10.7a2 2 0 0 0 2.7 2.7", "M9.9 4.2A10.6 10.6 0 0 1 21 12a12.8 12.8 0 0 1-3.2 4.1M6.2 6.2A12.7 12.7 0 0 0 3 12s3.4 6 9 6c1 0 1.9-.2 2.8-.5"]
        : ["M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"];
    for (const data of paths) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", data);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "currentColor");
      path.setAttribute("stroke-width", "1.8");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      svg.appendChild(path);
    }
    return svg;
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
#${OVERLAY_ID}{position:fixed;z-index:2147483000;top:7vh;right:22px;width:min(560px,calc(100vw - 32px));max-height:86vh;background:rgba(18,18,22,.985);border:1px solid rgba(255,255,255,.18);border-radius:12px;box-shadow:0 18px 65px rgba(0,0,0,.55);color:#ececf1;font:12px/1.25 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;overflow:hidden;display:flex;flex-direction:column}
#${OVERLAY_ID}[data-minimized="1"]{width:330px;max-height:none}
#${OVERLAY_ID}[data-minimized="1"] .kwbr-body{display:none}
.kwbr-head{display:flex;gap:10px;align-items:center;padding:10px 11px;border-bottom:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.035);cursor:grab;user-select:none;touch-action:none}.kwbr-head:active{cursor:grabbing}
.kwbr-head-main{min-width:0;flex:1}.kwbr-kicker{font-size:9px;text-transform:uppercase;letter-spacing:.09em;opacity:.52;font-weight:600}.kwbr-title{font-size:14px;font-weight:600;letter-spacing:.65px;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kwbr-head-actions{display:flex;gap:5px}.kwbr-iconbtn{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.07);color:#eee;border-radius:7px;cursor:pointer;font-weight:600;width:30px;height:28px;display:inline-flex;align-items:center;justify-content:center}.kwbr-iconbtn svg{width:16px;height:16px;pointer-events:none}.kwbr-iconbtn:hover{background:rgba(255,255,255,.14)}
.kwbr-body{overflow:auto;padding:10px;display:flex;flex-direction:column;gap:8px}.kwbr-service{display:flex;align-items:center;gap:7px;padding:7px 8px;border-radius:7px;background:rgba(255,255,255,.04);font-size:10px;opacity:.82}.kwbr-dot{width:7px;height:7px;border-radius:50%;background:#777}.kwbr-dot[data-state="ready"]{background:#78d49a}.kwbr-dot[data-state="warn"]{background:#e4bc6c}.kwbr-dot[data-state="busy"]{background:#8db8e8}
.kwbr-steps{display:flex;flex-direction:column;gap:6px}.kwbr-step{border:1px solid rgba(255,255,255,.10);border-radius:8px;background:rgba(255,255,255,.025);overflow:hidden}.kwbr-step-head{display:flex;align-items:center;gap:8px;padding:8px 9px;cursor:pointer;user-select:none}.kwbr-num{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.10);font-size:10px;font-weight:700}.kwbr-step-title{font-weight:600;letter-spacing:.65px;text-transform:uppercase;flex:1}.kwbr-step-summary{max-width:48%;font-size:10px;opacity:.55;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kwbr-chevron{opacity:.5}.kwbr-step[data-open="0"] .kwbr-step-body{display:none}.kwbr-step[data-open="0"] .kwbr-chevron{transform:rotate(-90deg)}.kwbr-step-body{padding:0 9px 10px;display:flex;flex-direction:column;gap:8px}
.kwbr-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.kwbr-field{display:flex;flex-direction:column;gap:4px}.kwbr-field>span,.kwbr-label{font-size:10px;font-weight:800;opacity:.68}.kwbr-field input,.kwbr-field textarea,.kwbr-field select{width:100%;box-sizing:border-box;background:#111217;color:#ececf1;border:1px solid rgba(255,255,255,.15);border-radius:6px;padding:7px 8px;font:inherit}.kwbr-field textarea{resize:vertical;min-height:66px}.kwbr-field select:disabled,.kwbr-field input:disabled{opacity:.55}.kwbr-help{font-size:10px;opacity:.58;line-height:1.35}.kwbr-warning{padding:7px 8px;border:1px solid rgba(236,184,94,.33);background:rgba(236,184,94,.08);border-radius:7px;font-size:10px}.kwbr-error{padding:7px 8px;border:1px solid rgba(255,115,115,.38);background:rgba(255,90,90,.08);border-radius:7px;font-size:10px}.kwbr-ok{padding:7px 8px;border:1px solid rgba(116,210,151,.28);background:rgba(116,210,151,.07);border-radius:7px;font-size:10px}
.kwbr-actions{display:flex;gap:7px;align-items:center;flex-wrap:wrap}.kwbr-btn{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.09);color:#eee;border-radius:7px;padding:7px 10px;cursor:pointer;font-weight:800;font-size:11px}.kwbr-btn:hover{background:rgba(255,255,255,.15)}.kwbr-btn.primary{background:rgba(127,95,190,.42);border-color:rgba(174,137,239,.55)}.kwbr-btn.danger{background:rgba(170,65,65,.20)}.kwbr-btn:disabled{opacity:.45;cursor:not-allowed}.kwbr-spacer{flex:1}
.kwbr-known{display:flex;flex-direction:column;gap:5px}.kwbr-known-item{padding:7px;border-radius:7px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}.kwbr-known-item strong{display:block}.kwbr-known-actions{display:flex;gap:6px;margin-top:5px}.kwbr-pill{display:inline-flex;align-items:center;gap:4px;border-radius:999px;background:rgba(255,255,255,.08);padding:3px 7px;font-size:9px}.kwbr-save,.kwbr-target{display:flex;flex-direction:column;gap:7px;padding:8px;border:1px solid rgba(255,255,255,.10);border-radius:7px;background:rgba(255,255,255,.025)}.kwbr-target{background:rgba(0,0,0,.12)}.kwbr-save-head,.kwbr-target-head{display:flex;align-items:center;gap:8px}.kwbr-save-head strong,.kwbr-target-head strong{flex:1;font-weight:600}.kwbr-evidence{display:flex;flex-direction:column;gap:5px}.kwbr-evidence-row{display:flex;gap:8px;align-items:flex-start;padding:7px;border:1px solid rgba(255,255,255,.09);border-radius:7px}.kwbr-evidence-main{min-width:0;flex:1}.kwbr-evidence-name{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kwbr-evidence-meta{font-size:9px;opacity:.55}.kwbr-remove{border:0;background:transparent;color:#ffb2b2;cursor:pointer}.kwbr-review{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.kwbr-review-cell{padding:7px;border:1px solid rgba(255,255,255,.09);border-radius:7px}.kwbr-review-cell span{display:block;font-size:9px;opacity:.55;text-transform:uppercase;letter-spacing:.04em}.kwbr-review-cell strong{display:block;margin-top:2px;word-break:break-word}
.kwbr-footer{position:sticky;bottom:0;display:flex;gap:7px;padding-top:8px;background:linear-gradient(transparent,#121216 16%)}
#${RESTORE_ID}{position:fixed;z-index:2147483001;right:18px;bottom:18px;width:44px;height:44px;border:1px solid rgba(255,255,255,.2);background:#17171d;color:#f1f1f5;border-radius:999px;padding:0;box-shadow:0 8px 30px rgba(0,0,0,.45);cursor:pointer;display:inline-flex;align-items:center;justify-content:center}#${RESTORE_ID} svg{width:21px;height:21px;pointer-events:none}
.kwbr-report-icon{border:0;background:transparent;color:rgba(255,255,255,.72);width:22px;height:22px;padding:2px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto}.kwbr-report-icon svg{width:16px;height:16px;pointer-events:none}.kwbr-report-icon:hover{color:#fff;background:rgba(255,255,255,.08);border-radius:4px}.kwWDSectionHeader .kwbr-report-icon{margin-left:auto}.kwWDSectionHeader .kwbr-report-icon+.kwWDDragHandle{margin-left:0}.kwbr-tool-icon{position:absolute;right:30px;top:4px;z-index:2}.kwbr-tool-host{position:relative}
@media(max-width:650px){#${OVERLAY_ID}{top:10px;right:10px;left:10px;width:auto;max-height:92vh}.kwbr-grid,.kwbr-review{grid-template-columns:1fr}.kwbr-step-summary{display:none}}
`;
    document.head.appendChild(style);
  }

  function makeEmptyState(sourceContext) {
    const now = nowIso();
    const source = clone(sourceContext) || {};
    const contextual = source.launchMethod === "contextual-action";
    const initialFeature = contextual ? (source.featureId || "") : "";
    return {
      draftId: uuid(),
      draftCreatedAt: now,
      clientSubmissionId: uuid(),
      sourceContext: source,
      context: null,
      contextError: "",
      capabilities: null,
      capabilityError: "",
      classification: {
        productId: source.productId || "witch-dock",
        groupId: source.groupId || "",
        featureId: initialFeature,
        scriptId: source.scriptId || "",
        reportedFeatureText: ""
      },
      report: {
        summary: "",
        actualBehavior: "",
        expectedBehavior: "",
        reproductionSteps: "",
        frequency: "unknown",
        affectedScope: "unknown",
        workedBefore: "unknown",
        lastKnownWorking: "",
        firstNoticed: "",
        workaround: "",
        additionalNotes: "",
        affectedSaves: [makeAffectedSave(true)]
      },
      contact: {
        allowContact: false,
        discordUsername: "",
        email: "",
        contactNote: "",
        notifyOnResolved: false
      },
      preflight: null,
      knownIssueReview: {},
      diagnosticsConsent: true,
      evidence: [],
      diagnosticCaptures: [],
      originalCapturePromise: null,
      originalCaptureState: contextual ? "starting" : "not-requested",
      originalCaptureError: "",
      activeStep: 1,
      minimized: false,
      submitting: false,
      submitError: "",
      receipt: null,
      message: "",
      resumed: false,
      overlayPosition: null
    };
  }

  function makeAffectedTarget(hint) {
    const safeHint = hint && typeof hint === "object" ? hint : null;
    return {
      targetId: uuid(),
      kind: safeHint && safeHint.kind || "unknown",
      ...(safeHint && safeHint.figure ? { figure: clone(safeHint.figure) } : {}),
      ...(safeHint && safeHint.object ? { object: clone(safeHint.object) } : {}),
      note: ""
    };
  }

  function currentFigureTargetHint() {
    try {
      const character = UW.CK && UW.CK.character;
      const meta = character && character.data && character.data.meta;
      if (!character || !meta || typeof meta !== "object") return null;
      const rawType = clean(meta.character_type || meta.characterType || meta.figure_type || meta.figureType).toLowerCase();
      const typeMap = {
        humanoid: "humanoid",
        human: "humanoid",
        anthro: "anthro-beastfolk",
        beastfolk: "anthro-beastfolk",
        animal: "animal",
        familiar: "familiar"
      };
      const figureType = typeMap[rawType] || "unknown";
      const slot = meta.is_familiar === true || rawType === "familiar" ? "familiar" : (meta.is_extra === false || meta.figure_slot === "main" ? "main" : "");
      if (!slot) return null;
      return { kind: "figure", figure: { slot: slot, figureType: slot === "familiar" ? "familiar" : figureType } };
    } catch (_) { return null; }
  }

  function makeAffectedSave(useCurrentHint) {
    return {
      saveId: uuid(),
      heroForgeUrl: useCurrentHint ? currentHeroForgeSaveUrl() : "",
      jsonAttachmentId: "",
      note: "",
      targets: [makeAffectedTarget(useCurrentHint ? currentFigureTargetHint() : null)]
    };
  }

  function validHeroForgeSaveUrl(value) {
    try {
      const url = new URL(clean(value));
      if (!/^https:\/\/(www\.)?heroforge\.com$/i.test(url.origin)) return "";
      return /(?:^|\/)load_config(?:=|%3d|\/)/i.test(url.pathname + url.search) ? url.href : "";
    } catch (_) { return ""; }
  }

  function currentHeroForgeSaveUrl() {
    return validHeroForgeSaveUrl(location.href);
  }

  function providerIdsFor(classification) {
    const result = [];
    const featureId = classification && classification.featureId || "";
    const groupId = classification && classification.groupId || "";
    const scriptId = classification && classification.scriptId || "";
    if (featureId === "texture-quality") result.push("texture-quality");
    if (groupId === "wd-booth" || featureId === "booth-json") result.push("booth");
    if (featureId === "json-tool" || JSON_COMPAT_FEATURES.has(featureId) || JSON_COMPAT_SCRIPTS.has(scriptId)) result.push("json");
    if (SCRIPT_COMPAT_FEATURES.has(featureId) || SCRIPT_COMPAT_SCRIPTS.has(scriptId)) result.push("script-compat");
    return Array.from(new Set(result));
  }

  function diagnosticFilename(capture) {
    const stamp = String(capture && capture.capturedAt || nowIso()).replace(/[:.]/g, "-");
    const id = capture && capture.captureId || "unknown";
    return "WitchDock_Bug_Diagnostic_" + stamp + "_" + id + ".json";
  }

  function addDiagnosticEvidence(capture, evidenceSession, evidencePurpose) {
    if (!state || !capture) return null;
    const json = JSON.stringify(capture, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const item = {
      clientAttachmentId: uuid(),
      kind: "diagnostic-json",
      fileName: diagnosticFilename(capture),
      mediaType: "application/json",
      sizeBytes: blob.size,
      origin: evidenceSession === "original" ? "witch-dock-auto-capture" : "witch-dock-user-capture",
      capturedAt: capture.capturedAt || nowIso(),
      evidenceRole: evidenceSession === "original" ? "before" : "additional",
      evidencePurpose: evidencePurpose || "primary-reproduction",
      evidenceSession: evidenceSession,
      persistence: "inline",
      needsReattach: false,
      blob: blob,
      diagnosticPayload: clone(capture)
    };
    state.evidence.push(item);
    state.diagnosticCaptures.push({
      capturedAt: item.capturedAt,
      evidenceSession: evidenceSession === "original" ? "original" : "current",
      payload: clone(capture)
    });
    return item;
  }

  function beginOriginalCapture() {
    if (!state || state.sourceContext.launchMethod !== "contextual-action") return null;
    const svc = diagnostics();
    if (!svc || typeof svc.captureCurrent !== "function") {
      state.originalCaptureState = "unavailable";
      state.originalCaptureError = "Diagnostic service unavailable at report open.";
      return null;
    }
    const providers = providerIdsFor(state.classification);
    state.originalCaptureState = "capturing";
    const promise = svc.captureCurrent({ captureMode: "snapshot", providerIds: providers });
    state.originalCapturePromise = promise;
    promise.then(function (result) {
      if (!state || state.originalCapturePromise !== promise) return;
      if (result && result.ok && result.capture) {
        addDiagnosticEvidence(result.capture, "original", "primary-reproduction");
        state.originalCaptureState = "captured";
        state.originalCaptureError = "";
      } else {
        state.originalCaptureState = "failed";
        state.originalCaptureError = result && result.error || "Original diagnostic capture failed.";
      }
      render();
    }).catch(function (error) {
      if (!state || state.originalCapturePromise !== promise) return;
      state.originalCaptureState = "failed";
      state.originalCaptureError = error && error.message ? error.message : String(error);
      render();
    });
    return promise;
  }

  function makeSourceContext(input) {
    const raw = input && typeof input === "object" ? input : {};
    const productId = raw.productId || "witch-dock";
    return Object.freeze({
      surface: "witch-dock",
      launchMethod: raw.launchMethod || "direct",
      launchedAt: nowIso(),
      ...(productId ? { productId: String(productId) } : {}),
      ...(raw.groupId ? { groupId: String(raw.groupId) } : {}),
      ...(raw.toolId ? { toolId: String(raw.toolId) } : {}),
      ...(raw.featureId ? { featureId: String(raw.featureId) } : {}),
      ...(raw.scriptId ? { scriptId: String(raw.scriptId) } : {}),
      scopeHint: raw.scopeHint || sourceScope(productId),
      sourceClientVersion: sourceClientVersion()
    });
  }

  function createOverlay() {
    injectStyle();
    let root = document.getElementById(OVERLAY_ID);
    if (root) return root;
    root = document.createElement("div");
    root.id = OVERLAY_ID;
    root.dataset.minimized = "0";
    document.body.appendChild(root);
    return root;
  }

  function productById(id) { return state && state.context && state.context.products.find(function (x) { return x.id === id; }); }
  function groupById(id) { return state && state.context && state.context.groups.find(function (x) { return x.id === id; }); }
  function featureById(id) { return state && state.context && state.context.features.find(function (x) { return x.id === id; }); }
  function scriptById(id) { return state && state.context && state.context.scripts.find(function (x) { return x.id === id; }); }
  function productGroups() {
    if (!state || !state.context) return [];
    return state.context.groups.filter(function (x) { return x.productId === state.classification.productId; }).sort(function (a, b) { return (a.sortOrder || 0) - (b.sortOrder || 0); });
  }
  function productFeatures() {
    if (!state || !state.context) return [];
    const productId = state.classification.productId;
    const groupId = state.classification.groupId;
    return state.context.features.filter(function (x) {
      if (x.productId !== productId) return false;
      if (productId === "witch-dock" && groupId) {
        return x.groupId === groupId || (Array.isArray(x.reporterPlacements) && x.reporterPlacements.some(function (p) { return p.productId === productId && p.groupId === groupId && p.active !== false; }));
      }
      return true;
    }).sort(function (a, b) { return (a.sortOrder || 0) - (b.sortOrder || 0) || a.label.localeCompare(b.label); });
  }
  function featureScripts() {
    if (!state || !state.context) return [];
    const feature = featureById(state.classification.featureId);
    if (!feature || !Array.isArray(feature.scriptIds)) return [];
    const set = new Set(feature.scriptIds);
    return state.context.scripts.filter(function (x) { return set.has(x.id); });
  }
  function sourceLabel() {
    const product = productById(state.classification.productId);
    return product && product.sourceHint || state.sourceContext.scopeHint || sourceScope(state.classification.productId);
  }

  function versionCatalogEntry() {
    if (!state || !state.context) return null;
    const catalog = Array.isArray(state.context.versionCatalog) ? state.context.versionCatalog : [];
    if (state.classification.scriptId) return catalog.find(function (x) { return x.targetType === "script" && x.targetId === state.classification.scriptId; }) || null;
    return catalog.find(function (x) { return x.targetType === "product" && x.targetId === state.classification.productId; }) || null;
  }

  function installedVersionInfo() {
    if (!state) return { version: null, method: "not-detected", dev: false };
    if (state.classification.productId === "witch-dock") {
      try {
        const dev = UW.KWWitchDockDevChannel;
        if (dev && dev.version) return { version: String(dev.version), method: "direct-version", dev: true };
      } catch (_) {}
      try {
        const core = UW.WitchDock && typeof UW.WitchDock.getState === "function" ? UW.WitchDock.getState() : null;
        if (core && core.version) return { version: String(core.version), method: "direct-version", dev: false };
      } catch (_) {}
    }
    if (state.classification.scriptId && (SCRIPT_COMPAT_SCRIPTS.has(state.classification.scriptId) || JSON_COMPAT_SCRIPTS.has(state.classification.scriptId))) {
      return { version: null, method: "runtime-capability", dev: false };
    }
    return { version: null, method: "not-detected", dev: false };
  }

  function refreshPreflight() {
    if (!state) return;
    const entry = versionCatalogEntry();
    const installed = installedVersionInfo();
    const latest = entry && entry.latestKnownVersion || null;
    let versionStatus = "unknown";
    if (!state.context) versionStatus = "unknown";
    else if (installed.version && latest && !installed.dev) versionStatus = installed.version === latest ? "current" : "outdated";
    state.preflight = {
      ...(state.classification.productId ? { productId: state.classification.productId } : {}),
      ...(state.classification.groupId ? { groupId: state.classification.groupId } : {}),
      ...(state.sourceContext.toolId ? { toolId: state.sourceContext.toolId } : {}),
      ...(state.classification.featureId ? { featureId: state.classification.featureId } : {}),
      ...(state.classification.scriptId ? { scriptId: state.classification.scriptId } : {}),
      ...(installed.version ? { installedVersion: installed.version } : {}),
      ...(latest ? { latestKnownVersion: latest } : {}),
      versionStatus: versionStatus,
      detectionMethod: state.context ? installed.method : "lookup-unavailable",
      lookupState: state.context ? "available" : "degraded",
      ...(entry && entry.updateSource ? { updateSource: clone(entry.updateSource) } : {}),
      checkedAt: nowIso(),
      continuedDespiteUpdate: false,
      knownIssueReview: Object.keys(state.knownIssueReview).map(function (id) { return { publicStatusId: id, response: state.knownIssueReview[id] }; })
    };
  }

  function knownIssues() {
    if (!state || !state.context || !state.classification.featureId) return [];
    return (state.context.knownIssues || []).filter(function (item) { return Array.isArray(item.featureIds) && item.featureIds.includes(state.classification.featureId); });
  }

  async function loadRemoteContext() {
    if (!state) return;
    const svc = client();
    if (!svc) {
      state.contextError = "HF.Status reporter client unavailable.";
      state.capabilityError = state.contextError;
      render();
      return;
    }
    const contextPromise = svc.getReporterContext().then(function (value) {
      if (!state) return;
      state.context = value;
      state.contextError = "";
      reconcileClassification();
      refreshPreflight();
      render();
    }).catch(function (error) {
      if (!state) return;
      state.contextError = error && error.message ? error.message : "Reporter metadata unavailable.";
      refreshPreflight();
      render();
    });
    const capabilityPromise = svc.getCapabilities().then(function (value) {
      if (!state) return;
      state.capabilities = value;
      state.capabilityError = "";
      render();
    }).catch(function (error) {
      if (!state) return;
      state.capabilityError = error && error.message ? error.message : "Submission service unavailable.";
      render();
    });
    await Promise.allSettled([contextPromise, capabilityPromise]);
  }

  function reconcileClassification() {
    if (!state || !state.context) return;
    const products = new Set(state.context.products.map(function (x) { return x.id; }));
    if (!products.has(state.classification.productId)) state.classification.productId = "witch-dock";
    const groups = new Set(state.context.groups.filter(function (x) { return x.productId === state.classification.productId; }).map(function (x) { return x.id; }));
    if (state.classification.groupId && !groups.has(state.classification.groupId)) state.classification.groupId = "";
    const feature = featureById(state.classification.featureId);
    if (state.classification.featureId && (!feature || feature.productId !== state.classification.productId)) state.classification.featureId = "";
    const script = scriptById(state.classification.scriptId);
    if (state.classification.scriptId && !script) state.classification.scriptId = "";
  }

  function openReporter(context) {
    const sourceContext = makeSourceContext(context || {});
    state = makeEmptyState(sourceContext);
    overlay = createOverlay();
    overlay.style.display = "flex";
    overlay.dataset.minimized = "0";
    removeRestore();
    render();
    beginOriginalCapture();
    loadRemoteContext().catch(function () {});
    return clone(sourceContext);
  }

  function closeReporter() {
    if (overlay) overlay.style.display = "none";
    showDockIfReporterHidIt();
    removeRestore();
  }

  function minimizeReporter() {
    if (!state || !overlay) return;
    state.minimized = !state.minimized;
    overlay.dataset.minimized = state.minimized ? "1" : "0";
    render();
  }

  function hideReporterAndDock() {
    if (!overlay) return;
    const interactions = UW.KWWitchDockInteractions;
    const dock = document.getElementById("kwWitchDock");
    dockHideState = { minimizedByReporter: false, compactBefore: !!document.getElementById("kwWDCompact") && dock && dock.style.display === "none" };
    if (dockHideState.compactBefore && interactions && typeof interactions.expandFromCompact === "function") interactions.expandFromCompact();
    if (interactions && typeof interactions.toggleMinimize === "function" && dock && !dock.classList.contains("kwWDMinimized")) {
      interactions.toggleMinimize();
      dockHideState.minimizedByReporter = true;
    }
    overlay.style.display = "none";
    let restore = document.getElementById(RESTORE_ID);
    if (!restore) {
      restore = document.createElement("button");
      restore.id = RESTORE_ID;
      restore.type = "button";
      restore.title = "Restore Bug Report & Witch Dock";
      restore.setAttribute("aria-label", "Restore Bug Report & Witch Dock");
      restore.appendChild(iconSvg("eye"));
      restore.addEventListener("click", function () {
        showDockIfReporterHidIt();
        if (overlay) overlay.style.display = "flex";
        removeRestore();
      });
      document.body.appendChild(restore);
    }
  }

  function showDockIfReporterHidIt() {
    if (!dockHideState) return;
    const interactions = UW.KWWitchDockInteractions;
    const dock = document.getElementById("kwWitchDock");
    if (dock && dock.style.display === "none" && interactions && typeof interactions.expandFromCompact === "function") interactions.expandFromCompact();
    if (dock && dock.classList.contains("kwWDMinimized") && interactions && typeof interactions.toggleMinimize === "function") interactions.toggleMinimize();
    dockHideState = null;
  }
  function removeRestore() { const el = document.getElementById(RESTORE_ID); if (el) el.remove(); }

  function startOverlayDrag(event) {
    if (!overlay || event.button !== 0 || event.target.closest(".kwbr-head-actions")) return;
    const rect = overlay.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const originLeft = rect.left;
    const originTop = rect.top;
    const move = function (next) {
      const left = Math.max(8, Math.min(window.innerWidth - overlay.offsetWidth - 8, originLeft + next.clientX - startX));
      const top = Math.max(8, Math.min(window.innerHeight - 44, originTop + next.clientY - startY));
      overlay.style.left = left + "px";
      overlay.style.top = top + "px";
      overlay.style.right = "auto";
      state.overlayPosition = { left: left, top: top };
    };
    const up = function () {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    event.preventDefault();
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    const a = attrs || {};
    for (const key of Object.keys(a)) {
      const value = a[key];
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else if (key === "html") node.innerHTML = value;
      else if (key === "on") {
        for (const eventName of Object.keys(value)) node.addEventListener(eventName, value[eventName]);
      } else if (key === "checked") node.checked = !!value;
      else if (key === "value") node.value = value == null ? "" : value;
      else if (value !== null && value !== undefined) node.setAttribute(key, String(value));
    }
    for (const child of (Array.isArray(children) ? children : (children ? [children] : []))) {
      if (child == null) continue;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    }
    return node;
  }

  function field(labelText, input) {
    return el("label", { class: "kwbr-field" }, [el("span", { text: labelText }), input]);
  }
  function textInput(value, onInput, attrs) {
    const input = el("input", Object.assign({ type: "text", value: value || "" }, attrs || {}));
    input.addEventListener("input", function () { onInput(input.value); });
    return input;
  }
  function textarea(value, onInput, attrs) {
    const input = el("textarea", Object.assign({}, attrs || {}));
    input.value = value || "";
    input.addEventListener("input", function () { onInput(input.value); });
    return input;
  }
  function selectInput(options, value, onChange, placeholder) {
    const select = el("select");
    select.appendChild(el("option", { value: "", text: placeholder || "Not sure / not selected" }));
    for (const row of options) select.appendChild(el("option", { value: row.id, text: row.label }));
    select.value = value || "";
    select.addEventListener("change", function () { onChange(select.value); });
    return select;
  }
  function button(text, handler, className, disabled) {
    const btn = el("button", { type: "button", class: "kwbr-btn" + (className ? " " + className : ""), text: text });
    btn.disabled = !!disabled;
    btn.addEventListener("click", handler);
    return btn;
  }

  function setClassification(patch) {
    if (!state) return;
    Object.assign(state.classification, patch || {});
    refreshPreflight();
    state.clientSubmissionId = uuid();
    state.submitError = "";
    render();
  }

  function step(number, title, summary, body) {
    const root = el("div", { class: "kwbr-step", "data-open": state.activeStep === number ? "1" : "0" });
    const head = el("div", { class: "kwbr-step-head" }, [
      el("div", { class: "kwbr-num", text: String(number) }),
      el("div", { class: "kwbr-step-title", text: title }),
      summary ? el("div", { class: "kwbr-step-summary", text: summary }) : null,
      el("div", { class: "kwbr-chevron", text: "▾" })
    ]);
    head.addEventListener("click", function () { state.activeStep = state.activeStep === number ? 0 : number; render(); });
    root.append(head, el("div", { class: "kwbr-step-body" }, body));
    return root;
  }

  function classificationSummary() {
    if (!state) return "";
    const parts = [];
    const product = productById(state.classification.productId);
    const group = groupById(state.classification.groupId);
    const feature = featureById(state.classification.featureId);
    const script = scriptById(state.classification.scriptId);
    if (product) parts.push(product.label);
    if (group) parts.push(group.label);
    if (feature) parts.push(feature.label);
    else if (state.classification.reportedFeatureText) parts.push(state.classification.reportedFeatureText);
    if (script) parts.push(script.label);
    return parts.join(" · ") || "Not classified";
  }

  function renderQuickCheck() {
    const rows = [];
    if (state.contextError) rows.push(el("div", { class: "kwbr-warning", text: "Reporter metadata unavailable. You can still describe and save the report; submission can be retried when HF.Status returns." }));
    if (state.context) {
      const products = state.context.products.filter(function (p) { return p.selectionMode !== "context-only"; });
      const productSelect = selectInput(products, state.classification.productId, function (value) {
        const product = state.context.products.find(function (x) { return x.id === value; });
        setClassification({ productId: value, groupId: "", featureId: "", scriptId: "", reportedFeatureText: "" });
      }, "Not sure");
      rows.push(field("Script / product", productSelect));

      if (state.classification.productId === "witch-dock") {
        rows.push(field("Area", selectInput(productGroups(), state.classification.groupId, function (value) {
          setClassification({ groupId: value, featureId: "", scriptId: "", reportedFeatureText: "" });
        }, "Area not sure")));
        rows.push(field("Tool / feature", selectInput(productFeatures(), state.classification.featureId, function (value) {
          setClassification({ featureId: value, scriptId: "", reportedFeatureText: "" });
        }, "Feature not sure")));
      } else {
        rows.push(field("Function / feature", selectInput(productFeatures(), state.classification.featureId, function (value) {
          const feature = state.context.features.find(function (x) { return x.id === value; });
          const placement = feature && Array.isArray(feature.reporterPlacements) ? feature.reporterPlacements.find(function (p) { return p.productId === state.classification.productId && p.active !== false; }) : null;
          setClassification({ featureId: value, groupId: placement && placement.groupId || feature && feature.groupId || "", scriptId: "", reportedFeatureText: "" });
        }, "Function not sure")));
        const scripts = featureScripts();
        if (scripts.length) rows.push(field("Associated script (optional)", selectInput(scripts, state.classification.scriptId, function (value) { setClassification({ scriptId: value }); }, "Script not sure")));
      }
    } else {
      rows.push(field("Feature / function (metadata lookup unavailable)", textInput(state.classification.reportedFeatureText, function (value) { state.classification.reportedFeatureText = value; }, { maxlength: 160 })));
    }

    const pre = state.preflight;
    if (pre) {
      const entry = versionCatalogEntry();
      const details = [];
      if (pre.installedVersion) details.push("Installed: " + pre.installedVersion + (installedVersionInfo().dev ? " (Dev)" : ""));
      if (pre.latestKnownVersion) details.push("Latest known: " + pre.latestKnownVersion);
      details.push("Status: " + pre.versionStatus);
      rows.push(el("div", { class: pre.versionStatus === "outdated" ? "kwbr-warning" : "kwbr-ok", text: details.join(" · ") }));
      if (pre.versionStatus === "outdated" && entry && entry.updateSource && entry.updateSource.url) {
        rows.push(el("div", { class: "kwbr-actions" }, [
          button("Update First", function () { window.open(entry.updateSource.url, "_blank", "noopener"); }, ""),
          button("Continue Anyway", function () { state.preflight.continuedDespiteUpdate = true; render(); }, "primary")
        ]));
      }
    }

    const issues = knownIssues();
    if (issues.length) {
      const box = el("div", { class: "kwbr-known" });
      box.appendChild(el("div", { class: "kwbr-label", text: "Possibly related known issues" }));
      for (const issue of issues) {
        const item = el("div", { class: "kwbr-known-item" }, [
          el("strong", { text: issue.title }),
          el("div", { class: "kwbr-help", text: issue.summary || "" })
        ]);
        const actions = el("div", { class: "kwbr-known-actions" });
        for (const response of [["matches", "Looks like this"], ["different", "Different problem"]]) {
          const btn = button(response[1], function () {
            state.knownIssueReview[issue.id] = response[0];
            refreshPreflight();
            render();
          }, state.knownIssueReview[issue.id] === response[0] ? "primary" : "");
          actions.appendChild(btn);
        }
        const firstLink = Array.isArray(issue.links) && issue.links[0];
        if (firstLink && firstLink.url) actions.appendChild(button("View", function () { window.open(firstLink.url, "_blank", "noopener"); }));
        item.appendChild(actions);
        box.appendChild(item);
      }
      rows.push(box);
    }
    return rows;
  }

  function renderWhatHappened() {
    return [
      field("Short summary", textInput(state.report.summary, function (v) { state.report.summary = v; }, { maxlength: 180, placeholder: "What broke?" })),
      field("What actually happened?", textarea(state.report.actualBehavior, function (v) { state.report.actualBehavior = v; }, { maxlength: 6000, rows: 4 })),
      field("What did you expect?", textarea(state.report.expectedBehavior, function (v) { state.report.expectedBehavior = v; }, { maxlength: 4000, rows: 3 }))
    ];
  }

  function renderReproduction() {
    const frequency = selectInput([
      { id: "once", label: "Once" }, { id: "intermittent", label: "Sometimes" }, { id: "often", label: "Often" }, { id: "always", label: "Always" }, { id: "unknown", label: "Not sure" }
    ], state.report.frequency, function (v) { state.report.frequency = v || "unknown"; render(); });
    const scope = selectInput([
      { id: "single-save", label: "One save" }, { id: "some-saves", label: "Some saves" }, { id: "all-tried", label: "Every save tried" }, { id: "not-save-specific", label: "Not save-specific" }, { id: "unknown", label: "Not sure" }
    ], state.report.affectedScope, function (v) { state.report.affectedScope = v || "unknown"; render(); });
    const worked = selectInput([
      { id: "yes", label: "Yes" }, { id: "no", label: "No" }, { id: "unknown", label: "Not sure" }
    ], state.report.workedBefore, function (v) { state.report.workedBefore = v || "unknown"; render(); });
    return [
      field("Steps to reproduce (one per line)", textarea(state.report.reproductionSteps, function (v) { state.report.reproductionSteps = v; }, { maxlength: 12000, rows: 5 })),
      el("div", { class: "kwbr-grid" }, [field("How often?", frequency), field("Affected scope", scope)]),
      field("Did this work before?", worked),
      el("div", { class: "kwbr-grid" }, [
        field("Last known working", textInput(state.report.lastKnownWorking, function (v) { state.report.lastKnownWorking = v; }, { maxlength: 500, placeholder: "Optional" })),
        field("First noticed", textInput(state.report.firstNoticed, function (v) { state.report.firstNoticed = v; }, { maxlength: 500, placeholder: "Optional" }))
      ]),
      field("Workaround (optional)", textarea(state.report.workaround, function (v) { state.report.workaround = v; }, { maxlength: 1500, rows: 2 }))
    ];
  }

  function figureReferenceFields(reference, onChange, labelPrefix) {
    const ref = reference || { slot: "main", figureType: "unknown" };
    const rows = [el("div", { class: "kwbr-grid" }, [
      field((labelPrefix || "Figure") + " slot", selectInput([
        { id: "main", label: "Main figure" }, { id: "extra", label: "Extra figure" }, { id: "familiar", label: "Familiar" }
      ], ref.slot, function (value) {
        ref.slot = value || "main";
        if (ref.slot !== "extra") delete ref.extraIndex;
        if (ref.slot === "familiar") ref.figureType = "familiar";
        else { delete ref.familiarPlacement; delete ref.holder; }
        onChange(ref); render();
      })),
      field("Figure type", selectInput([
        { id: "humanoid", label: "Humanoid" }, { id: "anthro-beastfolk", label: "Anthro / beastfolk" }, { id: "animal", label: "Animal" },
        { id: "familiar", label: "Familiar" }, { id: "other", label: "Other" }, { id: "unknown", label: "Not sure" }
      ], ref.slot === "familiar" ? "familiar" : (ref.figureType || "unknown"), function (value) { ref.figureType = ref.slot === "familiar" ? "familiar" : (value || "unknown"); onChange(ref); }, ref.slot === "familiar" ? "Familiar" : "Not sure"))
    ])];
    if (ref.slot === "extra") rows.push(field("Extra figure number", textInput(String(ref.extraIndex || 1), function (value) { ref.extraIndex = Math.max(1, Math.min(64, Number(value) || 1)); onChange(ref); }, { type: "number", min: 1, max: 64 })));
    if (ref.slot === "familiar") {
      rows.push(field("Familiar placement", selectInput([
        { id: "on-build", label: "On build" }, { id: "handheld", label: "Handheld" }, { id: "unknown", label: "Not sure" }
      ], ref.familiarPlacement || "unknown", function (value) {
        ref.familiarPlacement = value || "unknown";
        if (ref.familiarPlacement !== "handheld") delete ref.holder;
        else if (!ref.holder) ref.holder = { slot: "main", hand: "unknown", armSet: 1 };
        onChange(ref); render();
      })));
      if (ref.familiarPlacement === "handheld") {
        const holder = ref.holder || (ref.holder = { slot: "main", hand: "unknown", armSet: 1 });
        rows.push(el("div", { class: "kwbr-grid" }, [
          field("Holder", selectInput([{ id: "main", label: "Main figure" }, { id: "extra", label: "Extra figure" }], holder.slot, function (value) { holder.slot = value || "main"; if (holder.slot !== "extra") delete holder.extraIndex; onChange(ref); render(); })),
          field("Hand", selectInput([{ id: "left", label: "Left" }, { id: "right", label: "Right" }, { id: "unknown", label: "Not sure" }], holder.hand || "unknown", function (value) { holder.hand = value || "unknown"; onChange(ref); }))
        ]));
        rows.push(el("div", { class: "kwbr-grid" }, [
          holder.slot === "extra" ? field("Holder extra number", textInput(String(holder.extraIndex || 1), function (value) { holder.extraIndex = Math.max(1, Math.min(64, Number(value) || 1)); onChange(ref); }, { type: "number", min: 1, max: 64 })) : el("div"),
          field("Arm set", textInput(String(holder.armSet || 1), function (value) { holder.armSet = Math.max(1, Math.min(6, Number(value) || 1)); onChange(ref); }, { type: "number", min: 1, max: 6 }))
        ]));
      }
    }
    return rows;
  }

  function renderAffectedTarget(save, target, targetIndex) {
    const root = el("div", { class: "kwbr-target" });
    root.appendChild(el("div", { class: "kwbr-target-head" }, [
      el("strong", { text: "Target " + (targetIndex + 1) }),
      button("Remove", function () { save.targets.splice(targetIndex, 1); if (!save.targets.length) save.targets.push(makeAffectedTarget()); render(); }, "danger")
    ]));
    root.appendChild(field("Affected target", selectInput([
      { id: "all-figures", label: "All figures" }, { id: "figure", label: "A figure" }, { id: "object", label: "An object / item" }, { id: "unknown", label: "Not sure" }
    ], target.kind, function (value) {
      target.kind = value || "unknown";
      delete target.figure; delete target.object;
      if (target.kind === "figure") target.figure = { slot: "main", figureType: "unknown" };
      if (target.kind === "object") target.object = { objectType: "unknown" };
      render();
    })));
    if (target.kind === "figure") {
      figureReferenceFields(target.figure, function (value) { target.figure = value; }, "Figure").forEach(function (row) { root.appendChild(row); });
    }
    if (target.kind === "object") {
      const object = target.object || (target.object = { objectType: "unknown" });
      root.appendChild(field("Object type", selectInput([
        { id: "kitbash-object", label: "Kitbash object" }, { id: "equipped-item-clothing", label: "Equipped item / clothing" }, { id: "other", label: "Other" }, { id: "unknown", label: "Not sure" }
      ], object.objectType, function (value) {
        object.objectType = value || "unknown";
        if (object.objectType !== "equipped-item-clothing") delete object.wearer;
        else if (!object.wearer) object.wearer = { slot: "main", figureType: "unknown" };
        render();
      })));
      if (object.objectType === "equipped-item-clothing") {
        figureReferenceFields(object.wearer, function (value) { object.wearer = value; }, "Wearer").forEach(function (row) { root.appendChild(row); });
      }
    }
    root.appendChild(field("Target notes (optional)", textarea(target.note, function (value) { target.note = value; }, { maxlength: 1000, rows: 2 })));
    return root;
  }

  function renderAffectedSaveCard(save, saveIndex) {
    const root = el("div", { class: "kwbr-save" });
    root.appendChild(el("div", { class: "kwbr-save-head" }, [
      el("strong", { text: "Affected save " + (saveIndex + 1) }),
      button("Remove", function () { state.report.affectedSaves.splice(saveIndex, 1); render(); }, "danger", state.report.affectedSaves.length <= 1)
    ]));
    const urlInput = textInput(save.heroForgeUrl, function (value) { save.heroForgeUrl = value; if (clean(value)) save.jsonAttachmentId = ""; }, { maxlength: 2000, placeholder: "https://www.heroforge.com/load_config=…" });
    root.appendChild(field("Share Link or library save URL", urlInput));
    const jsonInput = el("input", { type: "file", accept: ".json,application/json" });
    jsonInput.style.display = "none";
    jsonInput.addEventListener("change", function () {
      const file = jsonInput.files && jsonInput.files[0];
      if (file) addFile(file, { forceKind: "figure-json", onAdded: function (item) { save.jsonAttachmentId = item.clientAttachmentId; save.heroForgeUrl = ""; render(); } });
      jsonInput.value = "";
    });
    root.appendChild(el("div", { class: "kwbr-actions" }, [
      button("Use Open Save Link", function () {
        const current = currentHeroForgeSaveUrl();
        if (current) { save.heroForgeUrl = current; save.jsonAttachmentId = ""; state.message = "Open save link attached."; }
        else state.message = "This page is not a shareable save link. In HeroForge use Share > Share Link, then paste that link here.";
        render();
      }),
      button(save.jsonAttachmentId ? "Replace Figure JSON" : "Attach Figure JSON", function () { jsonInput.click(); }),
      save.jsonAttachmentId ? button("Remove Figure JSON", function () { const id = save.jsonAttachmentId; save.jsonAttachmentId = ""; state.evidence = state.evidence.filter(function (item) { return item.clientAttachmentId !== id; }); render(); }, "danger") : null,
      jsonInput
    ]));
    if (save.jsonAttachmentId) root.appendChild(el("div", { class: "kwbr-ok", text: "Figure JSON attached for this save." }));
    root.appendChild(el("div", { class: "kwbr-help", text: "Use either a HeroForge library/load_config URL or figure JSON. The Editor root page is never attached. Generate a safe link with Share > Share Link." }));
    root.appendChild(field("Save notes (optional)", textarea(save.note, function (value) { save.note = value; }, { maxlength: 1500, rows: 2 })));
    save.targets.forEach(function (target, index) { root.appendChild(renderAffectedTarget(save, target, index)); });
    root.appendChild(button("Add Target", function () { save.targets.push(makeAffectedTarget()); render(); }, "", save.targets.length >= 30));
    return root;
  }

  function renderAffectedSave() {
    const rows = [];
    state.report.affectedSaves.forEach(function (save, index) { rows.push(renderAffectedSaveCard(save, index)); });
    rows.push(el("div", { class: "kwbr-actions" }, [button("Add Another Save", function () { state.report.affectedSaves.push(makeAffectedSave(false)); render(); }, "primary", state.report.affectedSaves.length >= 10)]));
    if (state.message) rows.push(el("div", { class: state.message.includes("not a shareable") ? "kwbr-warning" : "kwbr-help", text: state.message }));
    return rows;
  }

  function evidenceLabel(item) {
    return item.evidencePurpose + " · " + item.evidenceSession + (item.evidenceRole ? " · " + item.evidenceRole : "");
  }

  function renderEvidenceList(kindFilter) {
    const box = el("div", { class: "kwbr-evidence" });
    const shown = state.evidence.map(function (item, index) { return { item: item, index: index }; }).filter(function (row) { return kindFilter === "diagnostic" ? row.item.kind === "diagnostic-json" : row.item.kind !== "diagnostic-json"; });
    if (!shown.length) box.appendChild(el("div", { class: "kwbr-help", text: kindFilter === "diagnostic" ? "No diagnostic captures attached yet." : "No evidence files attached yet." }));
    shown.forEach(function (entry) {
      const item = entry.item;
      const row = el("div", { class: "kwbr-evidence-row" });
      row.appendChild(el("div", { class: "kwbr-evidence-main" }, [
        el("div", { class: "kwbr-evidence-name", text: item.fileName }),
        el("div", { class: "kwbr-evidence-meta", text: item.kind + " · " + Number(item.sizeBytes || 0).toLocaleString() + " bytes · " + evidenceLabel(item) + (item.needsReattach ? " · reattach required" : "") })
      ]));
      row.appendChild(el("button", { type: "button", class: "kwbr-remove", text: "Remove", on: { click: function () {
        state.evidence.splice(entry.index, 1);
        if (item.kind === "figure-json") state.report.affectedSaves.forEach(function (save) { if (save.jsonAttachmentId === item.clientAttachmentId) save.jsonAttachmentId = ""; });
        if (item.kind === "diagnostic-json" && item.diagnosticPayload) {
          const captureId = item.diagnosticPayload.captureId;
          state.diagnosticCaptures = state.diagnosticCaptures.filter(function (capture) { return !(capture.payload && capture.payload.captureId === captureId); });
        }
        render();
      } } }));
      box.appendChild(row);
    });
    return box;
  }

  function addFile(file, options) {
    if (!file) return;
    const opts = options && typeof options === "object" ? options : {};
    let kind = "other";
    const type = String(file.type || "").split(";", 1)[0];
    if (opts.forceKind) kind = opts.forceKind;
    else if (/^image\/(jpeg|png|webp)$/.test(type)) kind = "screenshot";
    else if (type === "video/mp4") kind = "video";
    else if (/json/i.test(type) || /\.json$/i.test(file.name)) kind = "figure-json";
    const base = {
      clientAttachmentId: uuid(), kind: kind, fileName: file.name || "evidence", mediaType: type || (kind === "figure-json" ? "application/json" : "application/octet-stream"), sizeBytes: file.size,
      origin: "manual-upload", capturedAt: nowIso(), evidenceRole: "additional", evidencePurpose: "user-supplied", evidenceSession: "user-supplied", persistence: "metadata-only", needsReattach: false, blob: file
    };
    if (kind === "figure-json") {
      file.text().then(function (text) {
        try {
          const parsed = JSON.parse(text);
          if (parsed && parsed.diagnosticContractVersion && parsed.captureId) {
            base.kind = "diagnostic-json";
            base.diagnosticPayload = parsed;
            base.persistence = "inline";
            base.evidencePurpose = "user-supplied";
          }
        } catch (_) {}
        state.evidence.push(base);
        if (typeof opts.onAdded === "function") opts.onAdded(base);
        render();
      }).catch(function () { state.evidence.push(base); if (typeof opts.onAdded === "function") opts.onAdded(base); render(); });
      return;
    }
    state.evidence.push(base);
    if (typeof opts.onAdded === "function") opts.onAdded(base);
    render();
  }

  async function captureHeroForge2K() {
    try {
      const maker = UW.BT && UW.BT.maker;
      if (!maker || maker.enabled !== true || typeof maker.takeScreenshot !== "function") throw new Error("HeroForge's native screenshot capture is not available right now.");
      state.message = "Capturing native HeroForge 2K screenshot…";
      render();
      const canvas = maker.takeScreenshot(2048, 2048);
      if (!canvas || typeof canvas.toBlob !== "function") throw new Error("HeroForge did not return a screenshot canvas.");
      const blob = await new Promise(function (resolve, reject) { canvas.toBlob(function (value) { value ? resolve(value) : reject(new Error("HeroForge returned an empty screenshot.")); }, "image/png"); });
      const file = new File([blob], "HeroForge_2K_" + nowIso().replace(/[:.]/g, "-") + ".png", { type: "image/png" });
      addFile(file, { forceKind: "screenshot" });
      state.message = "Native HeroForge 2K screenshot attached.";
      render();
    } catch (error) {
      state.message = error && error.message ? error.message : String(error);
      render();
    }
  }

  function renderEvidence() {
    const input = el("input", { type: "file", multiple: "multiple", accept: "image/png,image/jpeg,image/webp,video/mp4" });
    input.style.display = "none";
    input.addEventListener("change", function () { Array.from(input.files || []).forEach(addFile); input.value = ""; });
    const actions = el("div", { class: "kwbr-actions" }, [button("Upload Existing", function () { input.click(); }), button("Capture HeroForge 2K", captureHeroForge2K, "primary"), input]);
    return [
      actions,
      el("div", { class: "kwbr-help", text: "Evidence accepts JPEG, PNG, WEBP, and MP4. Normal screenshots use HeroForge's native 2K capture. Use the dedicated 4K, 8K, or Spinny tools when those special outputs are needed; this action does not imitate or replace them." }),
      state.message ? el("div", { class: "kwbr-help", text: state.message }) : null,
      renderEvidenceList("evidence")
    ];
  }

  async function captureDiagnosticsNow() {
    const svc = diagnostics();
    if (!svc || typeof svc.captureCurrent !== "function") {
      state.message = "Diagnostic service unavailable.";
      render();
      return;
    }
    state.message = "Capturing diagnostics…";
    render();
    try {
      const result = await svc.captureCurrent({ captureMode: "snapshot", providerIds: providerIdsFor(state.classification) });
      if (!result || !result.ok || !result.capture) throw new Error(result && result.error || "Diagnostic capture failed.");
      addDiagnosticEvidence(result.capture, "current", "primary-reproduction");
      state.message = "Fresh diagnostic capture attached.";
    } catch (error) {
      state.message = error && error.message ? error.message : String(error);
    }
    render();
  }

  function renderDiagnostics() {
    const providers = providerIdsFor(state.classification);
    const original = state.originalCaptureState;
    const input = el("input", { type: "file", multiple: "multiple", accept: ".json,application/json" });
    input.style.display = "none";
    input.addEventListener("change", function () { Array.from(input.files || []).forEach(addFile); input.value = ""; });
    const rows = [
      el("div", { class: "kwbr-help", text: providers.length ? ("Selected feature will capture General + " + providers.join(", ") + ".") : "General diagnostics are available for this classification; no feature-specific provider is currently mapped." }),
      el("div", { class: original === "failed" ? "kwbr-warning" : "kwbr-help", text: "Original context capture: " + original + (state.originalCaptureError ? " — " + state.originalCaptureError : "") }),
      el("div", { class: "kwbr-actions" }, [button("Capture Now", captureDiagnosticsNow, "primary"), button("Attach Diagnostic JSON", function () { input.click(); }), input])
    ];
    if (state.message) rows.push(el("div", { class: "kwbr-help", text: state.message }));
    rows.push(el("div", { class: "kwbr-help", text: "Opening from a contextual bug icon freezes the original source context and starts its T0 diagnostic capture immediately. Later captures are kept as fresh/current evidence rather than replacing the original." }));
    rows.push(renderEvidenceList("diagnostic"));
    return rows;
  }

  function renderFollowup() {
    const diagnosticsBox = el("input", { type: "checkbox" });
    diagnosticsBox.checked = !!state.diagnosticsConsent;
    diagnosticsBox.addEventListener("change", function () { state.diagnosticsConsent = diagnosticsBox.checked; render(); });
    const contactBox = el("input", { type: "checkbox" });
    contactBox.checked = !!state.contact.allowContact;
    contactBox.addEventListener("change", function () { state.contact.allowContact = contactBox.checked; render(); });
    const notifyBox = el("input", { type: "checkbox" });
    notifyBox.checked = !!state.contact.notifyOnResolved;
    notifyBox.addEventListener("change", function () { state.contact.notifyOnResolved = notifyBox.checked; });
    const rows = [
      el("div", { class: "kwbr-ok", text: "A random private reporter key is included so a later Witch Dock follow-up client can securely match this HFBR without exposing identity in public URLs." }),
      el("label", { class: "kwbr-actions" }, [diagnosticsBox, el("span", { text: "Include attached Witch Dock diagnostics as private report evidence" })]),
      el("label", { class: "kwbr-actions" }, [contactBox, el("span", { text: "Allow HF.Status maintainers to contact me directly about this report" })])
    ];
    if (state.contact.allowContact) {
      rows.push(el("div", { class: "kwbr-grid" }, [
        field("Discord username", textInput(state.contact.discordUsername, function (value) { state.contact.discordUsername = value; }, { maxlength: 80, placeholder: "Optional if email is supplied" })),
        field("Email", textInput(state.contact.email, function (value) { state.contact.email = value; }, { type: "email", maxlength: 254, placeholder: "Optional if Discord is supplied" }))
      ]));
      rows.push(field("Private contact note (optional)", textarea(state.contact.contactNote, function (value) { state.contact.contactNote = value; }, { maxlength: 300, rows: 2 })));
      rows.push(el("label", { class: "kwbr-actions" }, [notifyBox, el("span", { text: "Notify me when this report is resolved" })]));
      rows.push(el("div", { class: "kwbr-help", text: "Discord, email, and the note are private reporter contact fields. They are not published with the report." }));
    }
    return rows;
  }

  function labelFor(id, lookup) { const value = lookup(id); return value ? value.label : (id || "Not selected"); }

  function renderReview() {
    const grid = el("div", { class: "kwbr-review" }, [
      reviewCell("Script Source", sourceLabel() || "unknown"),
      reviewCell("Product", labelFor(state.classification.productId, productById)),
      reviewCell("Area", labelFor(state.classification.groupId, groupById)),
      reviewCell("Feature", featureById(state.classification.featureId) ? featureById(state.classification.featureId).label : (state.classification.reportedFeatureText || "Not selected")),
      reviewCell("Script", labelFor(state.classification.scriptId, scriptById)),
      reviewCell("Evidence", String(state.evidence.filter(function (item) { return item.kind !== "diagnostic-json"; }).length) + " attachment(s)"),
      reviewCell("Diagnostics", String(state.evidence.filter(function (item) { return item.kind === "diagnostic-json"; }).length) + " capture(s)")
    ]);
    const rows = [grid, field("Anything else?", textarea(state.report.additionalNotes, function (v) { state.report.additionalNotes = v; }, { maxlength: 3000, rows: 3 }))];
    if (state.submitError) rows.push(el("div", { class: "kwbr-error", text: state.submitError }));
    rows.push(el("div", { class: "kwbr-footer" }, [
      button("Save Draft", saveCurrentDraft),
      el("div", { class: "kwbr-spacer" }),
      button(state.submitting ? "Submitting…" : "Submit Bug Report", submitReport, "primary", state.submitting)
    ]));
    return rows;
  }
  function reviewCell(label, value) { return el("div", { class: "kwbr-review-cell" }, [el("span", { text: label }), el("strong", { text: value || "Not selected" })]); }

  function stepsForReport() {
    const affectedCount = state.report.affectedSaves.filter(function (save) { return clean(save.heroForgeUrl) || clean(save.jsonAttachmentId); }).length;
    const evidenceCount = state.evidence.filter(function (item) { return item.kind !== "diagnostic-json"; }).length;
    return [
      step(1, "Quick Check", classificationSummary(), renderQuickCheck()),
      step(2, "What Happened", state.report.summary || "Describe the problem", renderWhatHappened()),
      step(3, "Reproduction", state.report.frequency || "unknown", renderReproduction()),
      step(4, "Affected Saves", affectedCount ? affectedCount + " save(s)" : "Optional", renderAffectedSave()),
      step(5, "Evidence", evidenceCount + " attachment(s)", renderEvidence()),
      step(6, "Diagnostics", state.diagnosticCaptures.length + " capture(s)", renderDiagnostics()),
      step(7, "Follow-up & Privacy", state.contact.allowContact ? "Private follow-up allowed" : (state.diagnosticsConsent ? "Diagnostics allowed" : "Diagnostics excluded"), renderFollowup()),
      step(8, "Review & Submit", "Ready when required fields are complete", renderReview())
    ];
  }

  function validateRequired() {
    if (clean(state.report.summary).length < 3) return "Add a short summary (at least 3 characters).";
    if (clean(state.report.actualBehavior).length < 3) return "Describe what actually happened.";
    if (clean(state.report.expectedBehavior).length < 3) return "Describe what you expected to happen.";
    if (!state.report.frequency) return "Choose how often the problem occurs.";
    if (!state.report.workedBefore) return "Choose whether this worked before.";
    for (let saveIndex = 0; saveIndex < state.report.affectedSaves.length; saveIndex += 1) {
      const save = state.report.affectedSaves[saveIndex];
      const rawUrl = clean(save.heroForgeUrl);
      if (rawUrl && !validHeroForgeSaveUrl(rawUrl)) return "Affected save " + (saveIndex + 1) + " needs a HeroForge library/load_config URL or Share > Share Link; the Editor root is not valid.";
      if (rawUrl && clean(save.jsonAttachmentId)) return "Affected save " + (saveIndex + 1) + " must use either a save link or figure JSON, not both.";
      if (clean(save.jsonAttachmentId)) {
        const figureJson = state.evidence.find(function (item) { return item.clientAttachmentId === save.jsonAttachmentId && item.kind === "figure-json"; });
        if (!figureJson || figureJson.needsReattach || !(figureJson.blob instanceof Blob)) return "Reattach the figure JSON for affected save " + (saveIndex + 1) + ".";
      }
      if (!rawUrl && !clean(save.jsonAttachmentId) && (clean(save.note) || save.targets.some(function (target) { return target.kind !== "unknown" || clean(target.note); }))) return "Affected save " + (saveIndex + 1) + " needs a save link or attached figure JSON.";
      for (let targetIndex = 0; targetIndex < save.targets.length; targetIndex += 1) {
        const target = save.targets[targetIndex];
        if (target.kind === "figure" && (!target.figure || !target.figure.slot)) return "Choose the figure slot for affected save " + (saveIndex + 1) + ".";
        if (target.kind === "object" && (!target.object || !target.object.objectType)) return "Choose the object type for affected save " + (saveIndex + 1) + ".";
      }
    }
    if (state.contact.allowContact && !clean(state.contact.discordUsername) && !clean(state.contact.email)) return "Add a Discord username or email, or turn off direct follow-up.";
    if (clean(state.contact.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(state.contact.email))) return "Enter a valid email address for follow-up.";
    return "";
  }

  function cleanFigureReference(reference) {
    const source = reference && typeof reference === "object" ? reference : {};
    const slot = ["main", "extra", "familiar"].includes(source.slot) ? source.slot : "main";
    const result = { slot: slot };
    if (slot === "extra") result.extraIndex = Math.max(1, Math.min(64, Number(source.extraIndex) || 1));
    result.figureType = slot === "familiar" ? "familiar" : (["humanoid", "anthro-beastfolk", "animal", "other", "unknown"].includes(source.figureType) ? source.figureType : "unknown");
    if (slot === "familiar") {
      result.familiarPlacement = ["on-build", "handheld", "unknown"].includes(source.familiarPlacement) ? source.familiarPlacement : "unknown";
      if (result.familiarPlacement === "handheld") {
        const holder = source.holder && typeof source.holder === "object" ? source.holder : {};
        result.holder = {
          slot: holder.slot === "extra" ? "extra" : "main",
          ...(holder.slot === "extra" ? { extraIndex: Math.max(1, Math.min(64, Number(holder.extraIndex) || 1)) } : {}),
          hand: ["left", "right", "unknown"].includes(holder.hand) ? holder.hand : "unknown",
          armSet: Math.max(1, Math.min(6, Number(holder.armSet) || 1))
        };
      }
    }
    return result;
  }

  function cleanAffectedTarget(target) {
    const kind = ["all-figures", "figure", "object", "unknown"].includes(target.kind) ? target.kind : "unknown";
    const result = { targetId: target.targetId || uuid(), kind: kind };
    if (kind === "figure") result.figure = cleanFigureReference(target.figure);
    if (kind === "object") {
      const source = target.object && typeof target.object === "object" ? target.object : {};
      const objectType = ["kitbash-object", "equipped-item-clothing", "other", "unknown"].includes(source.objectType) ? source.objectType : "unknown";
      result.object = { objectType: objectType };
      if (objectType === "equipped-item-clothing") result.object.wearer = cleanFigureReference(source.wearer);
    }
    if (clean(target.note)) result.note = clean(target.note);
    return result;
  }

  function cleanAffectedSaves() {
    return state.report.affectedSaves.filter(function (save) { return validHeroForgeSaveUrl(save.heroForgeUrl) || clean(save.jsonAttachmentId); }).map(function (save) {
      return {
        saveId: save.saveId || uuid(),
        ...(validHeroForgeSaveUrl(save.heroForgeUrl) ? { heroForgeUrl: validHeroForgeSaveUrl(save.heroForgeUrl) } : { jsonAttachmentId: clean(save.jsonAttachmentId) }),
        ...(clean(save.note) ? { note: clean(save.note) } : {}),
        targets: (save.targets.length ? save.targets : [makeAffectedTarget()]).map(cleanAffectedTarget)
      };
    });
  }

  function attachmentPayload(item) {
    return {
      clientAttachmentId: item.clientAttachmentId,
      kind: item.kind,
      fileName: item.fileName,
      mediaType: item.mediaType,
      sizeBytes: item.sizeBytes,
      origin: item.origin,
      ...(item.capturedAt ? { capturedAt: item.capturedAt } : {}),
      ...(item.evidenceRole ? { evidenceRole: item.evidenceRole } : {}),
      ...(item.evidencePurpose ? { evidencePurpose: item.evidencePurpose } : {}),
      ...(item.evidenceSession ? { evidenceSession: item.evidenceSession } : {})
    };
  }

  function buildReport() {
    refreshPreflight();
    const feature = featureById(state.classification.featureId);
    const steps = state.report.reproductionSteps.split("\n").map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 30);
    const attached = state.evidence.filter(function (item) { return !item.needsReattach && item.blob instanceof Blob && (state.diagnosticsConsent || item.kind !== "diagnostic-json"); });
    const reporterToken = client() && client().getOrCreateReporterToken ? client().getOrCreateReporterToken() : null;
    const affectedSaves = cleanAffectedSaves();
    const reporter = {
      ...(reporterToken ? { opaqueReporterToken: reporterToken } : {}),
      ...(state.contact.allowContact && clean(state.contact.discordUsername) ? { discordUsername: clean(state.contact.discordUsername) } : {}),
      ...(state.contact.allowContact && clean(state.contact.email) ? { email: clean(state.contact.email) } : {}),
      ...(state.contact.allowContact && clean(state.contact.contactNote) ? { contactNote: clean(state.contact.contactNote) } : {}),
      ...(state.contact.allowContact ? { notifyOnResolved: !!state.contact.notifyOnResolved } : {})
    };
    const report = {
      schemaVersion: "1.3",
      clientSubmissionId: state.clientSubmissionId,
      source: "witch-dock",
      sourceClientVersion: sourceClientVersion(),
      sourceContext: clone(state.sourceContext),
      preflight: clone(state.preflight),
      reportedScriptSource: sourceLabel() || "unknown",
      ...(state.classification.productId ? { reportedProductId: state.classification.productId } : {}),
      ...(state.classification.groupId ? { reportedGroupId: state.classification.groupId } : {}),
      ...(state.classification.scriptId ? { reportedScriptId: state.classification.scriptId } : {}),
      ...(feature ? { categoryId: feature.categoryId, featureId: feature.id } : {}),
      ...(!feature && clean(state.classification.reportedFeatureText) ? { reportedFeatureText: clean(state.classification.reportedFeatureText) } : {}),
      summary: clean(state.report.summary),
      actualBehavior: clean(state.report.actualBehavior),
      expectedBehavior: clean(state.report.expectedBehavior),
      frequency: state.report.frequency || "unknown",
      affectedScope: state.report.affectedScope || "unknown",
      workedBefore: state.report.workedBefore || "unknown",
      ...(clean(state.report.lastKnownWorking) ? { lastKnownWorking: clean(state.report.lastKnownWorking) } : {}),
      ...(clean(state.report.firstNoticed) ? { firstNoticed: clean(state.report.firstNoticed) } : {}),
      ...(steps.length ? { reproductionSteps: steps } : {}),
      ...(clean(state.report.workaround) ? { workaround: clean(state.report.workaround) } : {}),
      ...(clean(state.report.additionalNotes) ? { additionalNotes: clean(state.report.additionalNotes) } : {}),
      ...(affectedSaves.length ? { affectedSaves: affectedSaves } : {}),
      ...(attached.length ? { attachments: attached.map(attachmentPayload) } : {}),
      ...(Object.keys(reporter).length ? { reporter: reporter } : {}),
      privacy: { diagnosticsConsent: !!state.diagnosticsConsent, contactConsent: !!state.contact.allowContact, policyVersion: "1.0" }
    };
    return { report: report, evidence: attached };
  }

  async function submitReport() {
    if (!state || state.submitting) return;
    state.submitError = validateRequired();
    if (state.submitError) { state.activeStep = 8; render(); return; }
    const svc = client();
    if (!svc || typeof svc.submitReport !== "function") { state.submitError = "HF.Status reporter client unavailable. Save this as a draft and retry later."; render(); return; }
    if (!state.capabilities) { state.submitError = "HF.Status submission capabilities are unavailable. Save the draft and retry when the service is reachable."; render(); return; }

    const payload = buildReport();
    state.submitting = true;
    state.submitError = "";
    render();
    try {
      const receipt = await svc.submitReport({ report: payload.report, evidence: payload.evidence, capabilities: state.capabilities });
      state.receipt = receipt;
      try { svc.discardDraft(state.draftId); } catch (_) {}
      render();
    } catch (error) {
      state.submitError = error && error.message ? error.message : "The report could not be submitted. Your form is still here.";
      state.submitting = false;
      render();
    }
  }

  function draftEvidenceMetadata(item) {
    const generatedDiagnostic = item.kind === "diagnostic-json" && (item.origin === "witch-dock-auto-capture" || item.origin === "witch-dock-user-capture");
    return {
      clientAttachmentId: item.clientAttachmentId,
      kind: item.kind,
      fileName: item.fileName,
      mediaType: item.mediaType,
      sizeBytes: item.sizeBytes,
      origin: item.origin,
      ...(item.capturedAt ? { capturedAt: item.capturedAt } : {}),
      ...(item.evidenceRole ? { evidenceRole: item.evidenceRole } : {}),
      evidencePurpose: item.evidencePurpose || "user-supplied",
      evidenceSession: item.evidenceSession || "user-supplied",
      persistence: generatedDiagnostic ? "inline" : "metadata-only",
      needsReattach: !generatedDiagnostic,
      ...(generatedDiagnostic ? { note: "Generated diagnostic bytes can be reconstructed from the retained diagnostic capture." } : { note: "Reattach this local file after resuming the draft." })
    };
  }

  function saveCurrentDraft() {
    const svc = client();
    if (!svc || typeof svc.saveDraft !== "function") { state.message = "Draft storage unavailable."; render(); return; }
    const now = nowIso();
    const draft = {
      draftSchemaVersion: "1.0",
      draftId: state.draftId,
      createdAt: state.draftCreatedAt,
      updatedAt: now,
      expiresAt: new Date(Date.now() + Number(svc.draftRetentionMs || 14 * 24 * 60 * 60 * 1000)).toISOString(),
      sourceContext: clone(state.sourceContext),
      classification: {
        reportedScriptSource: sourceLabel() || "unknown",
        ...(state.classification.productId ? { productId: state.classification.productId } : {}),
        ...(state.classification.groupId ? { groupId: state.classification.groupId } : {}),
        ...(state.sourceContext.toolId ? { toolId: state.sourceContext.toolId } : {}),
        ...(state.classification.featureId ? { featureId: state.classification.featureId } : {}),
        ...(state.classification.scriptId ? { scriptId: state.classification.scriptId } : {}),
        ...(clean(state.classification.reportedFeatureText) ? { reportedFeatureText: clean(state.classification.reportedFeatureText) } : {})
      },
      report: {
        summary: state.report.summary,
        actualBehavior: state.report.actualBehavior,
        expectedBehavior: state.report.expectedBehavior,
        reproductionSteps: state.report.reproductionSteps.split("\n").map(function (x) { return x.trim(); }).filter(Boolean),
        frequency: state.report.frequency,
        affectedScope: state.report.affectedScope,
        workedBefore: state.report.workedBefore,
        lastKnownWorking: state.report.lastKnownWorking,
        firstNoticed: state.report.firstNoticed,
        workaround: state.report.workaround,
        additionalNotes: state.report.additionalNotes,
        affectedSaves: clone(state.report.affectedSaves) || []
      },
      preflight: clone(state.preflight),
      evidence: state.evidence.map(draftEvidenceMetadata),
      diagnostics: {
        includeDiagnostics: !!state.diagnosticsConsent,
        selectedProviderIds: providerIdsFor(state.classification),
        captures: clone(state.diagnosticCaptures) || []
      },
      contact: {
        allowContact: !!state.contact.allowContact,
        ...(clean(state.contact.discordUsername) ? { discordUsername: clean(state.contact.discordUsername) } : {}),
        ...(clean(state.contact.email) ? { email: clean(state.contact.email) } : {}),
        ...(clean(state.contact.contactNote) ? { contactNote: clean(state.contact.contactNote) } : {}),
        notifyOnResolved: !!state.contact.notifyOnResolved
      },
      ui: { activeStep: state.activeStep, maxReached: 8 }
    };
    try {
      svc.saveDraft(draft);
      state.message = "Draft saved locally for 14 days.";
    } catch (error) {
      state.message = error && error.message ? error.message : "Draft could not be saved.";
    }
    render();
  }

  function resumeDraft(draft) {
    const sourceContext = clone(draft.sourceContext) || makeSourceContext({ launchMethod: "direct" });
    state = makeEmptyState(sourceContext);
    state.draftId = draft.draftId;
    state.draftCreatedAt = draft.createdAt;
    state.resumed = true;
    Object.assign(state.classification, {
      productId: draft.classification && draft.classification.productId || sourceContext.productId || "witch-dock",
      groupId: draft.classification && draft.classification.groupId || "",
      featureId: draft.classification && draft.classification.featureId || "",
      scriptId: draft.classification && draft.classification.scriptId || "",
      reportedFeatureText: draft.classification && draft.classification.reportedFeatureText || ""
    });
    const rep = draft.report || {};
    Object.assign(state.report, {
      summary: rep.summary || "", actualBehavior: rep.actualBehavior || "", expectedBehavior: rep.expectedBehavior || "",
      reproductionSteps: Array.isArray(rep.reproductionSteps) ? rep.reproductionSteps.join("\n") : "",
      frequency: rep.frequency || "unknown", affectedScope: rep.affectedScope || "unknown", workedBefore: rep.workedBefore || "unknown",
      lastKnownWorking: rep.lastKnownWorking || "", firstNoticed: rep.firstNoticed || "", workaround: rep.workaround || "", additionalNotes: rep.additionalNotes || "",
      affectedSaves: Array.isArray(rep.affectedSaves) && rep.affectedSaves.length ? clone(rep.affectedSaves) : [makeAffectedSave(false)]
    });
    Object.assign(state.contact, draft.contact || {});
    state.preflight = clone(draft.preflight);
    state.diagnosticsConsent = !!(draft.diagnostics && draft.diagnostics.includeDiagnostics);
    const captures = draft.diagnostics && Array.isArray(draft.diagnostics.captures) ? draft.diagnostics.captures : [];
    for (const row of captures) {
      if (!row || !row.payload) continue;
      addDiagnosticEvidence(row.payload, row.evidenceSession === "current" ? "current" : "original", "primary-reproduction");
    }
    const knownIds = new Set(state.evidence.map(function (e) { return e.clientAttachmentId; }));
    for (const meta of (draft.evidence || [])) {
      if (!meta || knownIds.has(meta.clientAttachmentId)) continue;
      if (meta.kind === "diagnostic-json" && (meta.origin === "witch-dock-auto-capture" || meta.origin === "witch-dock-user-capture")) continue;
      state.evidence.push(Object.assign({}, clone(meta), { blob: null, needsReattach: true }));
    }
    state.activeStep = draft.ui && Number(draft.ui.activeStep) || 1;
    overlay = createOverlay();
    overlay.style.display = "flex";
    removeRestore();
    render();
    loadRemoteContext().catch(function () {});
  }

  function discardDraft(draftId) {
    const svc = client();
    if (svc && typeof svc.discardDraft === "function") svc.discardDraft(draftId);
    render();
  }

  function renderDraftChooser() {
    const svc = client();
    if (!svc || typeof svc.listDrafts !== "function") return null;
    const drafts = svc.listDrafts();
    if (!drafts.length) return null;
    const box = el("div", { class: "kwbr-step", "data-open": "1" });
    box.appendChild(el("div", { class: "kwbr-step-head" }, [el("div", { class: "kwbr-step-title", text: "Saved Drafts" }), el("div", { class: "kwbr-step-summary", text: drafts.length + " saved" })]));
    const body = el("div", { class: "kwbr-step-body" });
    for (const draft of drafts) {
      const row = el("div", { class: "kwbr-evidence-row" });
      row.appendChild(el("div", { class: "kwbr-evidence-main" }, [el("div", { class: "kwbr-evidence-name", text: draft.report && draft.report.summary || "Untitled report" }), el("div", { class: "kwbr-evidence-meta", text: "Saved " + new Date(draft.updatedAt).toLocaleString() })]));
      row.append(button("Resume", function () { resumeDraft(draft); }, "primary"));
      row.append(button("Discard", function () { discardDraft(draft.draftId); render(); }, "danger"));
      body.appendChild(row);
    }
    box.appendChild(body);
    return box;
  }

  function renderReceipt() {
    const receipt = state.receipt;
    const root = el("div", { class: "kwbr-step", "data-open": "1" });
    root.appendChild(el("div", { class: "kwbr-step-body" }, [
      el("div", { class: "kwbr-ok" }, [el("strong", { text: "Report received" }), document.createElement("br"), document.createTextNode("HF.Status returned " + receipt.reportId + ". This ID has been saved locally for the later reporter-sync client.")]),
      el("div", { class: "kwbr-review" }, [reviewCell("HFBR", receipt.reportId), reviewCell("State", receipt.state || "received"), reviewCell("Received", receipt.receivedAt || ""), reviewCell("Duplicate", receipt.duplicate ? "yes" : "no")]),
      el("div", { class: "kwbr-actions" }, [button("Copy HFBR", function () { navigator.clipboard && navigator.clipboard.writeText(receipt.reportId).catch(function () {}); }), button("Close", closeReporter, "primary")])
    ]));
    return root;
  }

  function render() {
    if (!state) return;
    overlay = createOverlay();
    overlay.dataset.minimized = state.minimized ? "1" : "0";
    overlay.replaceChildren();
    if (state.overlayPosition) {
      overlay.style.left = state.overlayPosition.left + "px";
      overlay.style.top = state.overlayPosition.top + "px";
      overlay.style.right = "auto";
    } else {
      overlay.style.left = "";
      overlay.style.top = "";
      overlay.style.right = "";
    }

    const head = el("div", { class: "kwbr-head" }, [
      el("div", { class: "kwbr-head-main" }, [el("div", { class: "kwbr-kicker", text: "Witch Dock · HF.Status" }), el("div", { class: "kwbr-title", text: state.receipt ? "Bug Report Submitted" : "Report a Bug" })]),
      el("div", { class: "kwbr-head-actions" }, [
        el("button", { class: "kwbr-iconbtn", type: "button", title: "Minimize", text: state.minimized ? "▢" : "—", on: { click: minimizeReporter } }),
        el("button", { class: "kwbr-iconbtn", type: "button", title: "Hide Bug Report & Witch Dock temporarily so you can take an image snapshot/capture or screenshot for your report.", "aria-label": "Hide Bug Report & Witch Dock temporarily so you can take an image snapshot/capture or screenshot for your report.", on: { click: hideReporterAndDock } }, [iconSvg("eye-off")]),
        el("button", { class: "kwbr-iconbtn", type: "button", title: "Close", text: "×", on: { click: closeReporter } })
      ])
    ]);
    head.addEventListener("pointerdown", startOverlayDrag);
    overlay.appendChild(head);

    const body = el("div", { class: "kwbr-body" });
    if (state.receipt) {
      body.appendChild(renderReceipt());
      overlay.appendChild(body);
      return;
    }

    const serviceReady = !!state.capabilities;
    const serviceText = serviceReady ? "HF.Status submission service ready" : (state.capabilityError ? "HF.Status unavailable — drafts remain local" : "Checking HF.Status submission service…");
    body.appendChild(el("div", { class: "kwbr-service" }, [el("span", { class: "kwbr-dot", "data-state": serviceReady ? "ready" : (state.capabilityError ? "warn" : "busy") }), el("span", { text: serviceText })]));

    const chooser = renderDraftChooser();
    if (chooser && !state.resumed && !state.report.summary && state.sourceContext.launchMethod === "direct") body.appendChild(chooser);
    const steps = el("div", { class: "kwbr-steps" });
    stepsForReport().forEach(function (node) { steps.appendChild(node); });
    body.appendChild(steps);
    overlay.appendChild(body);
  }

  function reportIcon(context, title) {
    const btn = el("button", { type: "button", class: "kwbr-report-icon", title: title || "Report a bug in this feature", "aria-label": title || "Report a bug in this feature" }, [iconSvg("bug")]);
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openReporter(Object.assign({ launchMethod: "contextual-action" }, context));
    });
    return btn;
  }

  function attachContextualActions() {
    injectStyle();
    const containers = Array.from(document.querySelectorAll("[data-tool-id]"));
    for (const container of containers) {
      const toolId = container.getAttribute("data-tool-id") || "";
      if (toolId === TOOL_ID) continue;
      const sections = Array.from(new Set(Array.from(container.querySelectorAll(":scope > .kwWDSection, .kwWDSection"))));
      let exactCount = 0;
      for (const section of sections) {
        const sectionId = section.getAttribute("data-section-id") || "";
        const mapping = SECTION_CONTEXT[toolId + ":" + sectionId];
        if (!mapping) continue;
        exactCount += 1;
        const header = section.querySelector(":scope > .kwWDSectionHeader");
        if (!header) continue;
        const existing = Array.from(header.querySelectorAll(":scope > .kwbr-report-icon"));
        existing.slice(1).forEach(function (node) { node.remove(); });
        if (existing[0]) continue;
        const icon = reportIcon(Object.assign({ toolId: toolId }, mapping));
        const handle = header.querySelector(":scope > .kwWDDragHandle");
        header.insertBefore(icon, handle || null);
      }
      const fallback = container.querySelector(":scope > .kwbr-tool-icon");
      if (exactCount && fallback) fallback.remove();
      if (exactCount) container.classList.remove("kwbr-tool-host");
      if (!exactCount && TOOL_CONTEXT[toolId] && !container.querySelector(":scope > .kwbr-tool-icon")) {
        container.classList.add("kwbr-tool-host");
        const btn = reportIcon(Object.assign({ toolId: toolId }, TOOL_CONTEXT[toolId]), "Report a bug in this tool");
        btn.classList.add("kwbr-tool-icon");
        container.appendChild(btn);
      }
    }
  }

  function startContextualObserver() {
    if (contextualObserver) return;
    attachContextualActions();
    let scheduled = false;
    contextualObserver = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () { scheduled = false; attachContextualActions(); });
    });
    contextualObserver.observe(document.documentElement, { childList: true, subtree: true });
  }

  function compareVersions(left, right) {
    const leftParts = String(left || "0").split(".").map(function (part) { return Number.parseInt(part, 10) || 0; });
    const rightParts = String(right || "0").split(".").map(function (part) { return Number.parseInt(part, 10) || 0; });
    const length = Math.max(leftParts.length, rightParts.length);
    for (let index = 0; index < length; index += 1) {
      const delta = (leftParts[index] || 0) - (rightParts[index] || 0);
      if (delta) return delta;
    }
    return 0;
  }

  function publishApi(api) {
    const descriptor = Object.getOwnPropertyDescriptor(UW, GLOBAL);
    if (descriptor && typeof descriptor.set === "function") {
      UW[GLOBAL] = api;
      return;
    }
    if (descriptor && descriptor.configurable === false) {
      UW[GLOBAL] = api;
      return;
    }
    let current = api;
    Object.defineProperty(UW, GLOBAL, {
      configurable: true,
      enumerable: true,
      get: function () { return current; },
      set: function (candidate) {
        if (!candidate || compareVersions(candidate.version, current && current.version) < 0) return;
        current = candidate;
      }
    });
  }

  function renderSection(container, api) {
    injectStyle();
    const section = api.ui.createSection({ id: "bug-capture", title: "Bug Capture", defaultCollapsed: false });
    const card = el("div", { class: "kwbr-step", "data-open": "1" });
    const body = el("div", { class: "kwbr-step-body" }, [
      el("div", { class: "kwbr-help", text: "Open the integrated reporter to classify the problem, freeze diagnostics, attach evidence, save a local draft, and submit directly to HF.Status. Diagnostic capture remains available even if HF.Status is offline." }),
      el("div", { class: "kwbr-actions" }, [
        button("Report a Bug", function () { openReporter({ launchMethod: "direct", productId: "witch-dock", groupId: "wd-utilities", toolId: TOOL_ID }); }, "primary"),
        button("Capture Diagnostic Only", async function () {
          const svc = diagnostics();
          if (!svc || typeof svc.captureAndDownload !== "function") return;
          await svc.captureAndDownload({ captureMode: "snapshot", providerIds: [] });
        })
      ])
    ]);
    card.appendChild(body);
    section.body.appendChild(card);
    container.appendChild(section.root);
  }

  publishApi(Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    renderSection: renderSection,
    open: openReporter,
    close: closeReporter,
    getSourceContext: function () { return state ? clone(state.sourceContext) : null; },
    getState: function () { return state ? { open: !!(overlay && overlay.style.display !== "none"), minimized: !!state.minimized, sourceContext: clone(state.sourceContext), classification: clone(state.classification), evidenceCount: state.evidence.length, diagnosticCaptureCount: state.diagnosticCaptures.length, receipt: clone(state.receipt) } : { open: false }; },
    attachContextualActions: attachContextualActions
  }));

  startContextualObserver();
})();

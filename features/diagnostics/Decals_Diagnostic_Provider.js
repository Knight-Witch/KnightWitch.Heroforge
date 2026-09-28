(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const FEATURE_ID = "decals-diagnostic-provider";
  const PROVIDER_ID = "decals";
  const PROVIDER_SCHEMA_VERSION = 1;
  const VERSION = "0.1.0";
  const BUILD = "0.1.0-model-render-gizmo-state";
  const MAX_REGISTER_TRIES = 120;
  const MAX_SLOT_RECORDS = 128;
  const TRANSFORM_KEYS = Object.freeze(["h","v","d","s","sy","a","i","u","sz"]);

  if (UW.KWDecalsDiagnosticProvider && UW.KWDecalsDiagnosticProvider.build === BUILD) return;

  let registered = false;
  let registerTries = 0;
  let timer = null;

  function core() {
    return UW.KWWitchDockDiagnostics || null;
  }

  function gizmoApi() {
    return UW.KW_HeroForgeUI && UW.KW_HeroForgeUI.correctedBoundDecalGizmo || null;
  }

  function expandedApi() {
    return UW.KW_HeroForgeUI && UW.KW_HeroForgeUI.expandedDecalSlots || null;
  }

  function slotBridgeApi() {
    return UW.KW_HeroForgeUI && UW.KW_HeroForgeUI.slotBridge || null;
  }

  function safeCall(fn, fallback) {
    try { return typeof fn === "function" ? fn() : fallback; }
    catch (_) { return fallback; }
  }

  function boundedText(value, max) {
    if (value == null) return null;
    const text = String(value);
    const limit = Number(max) || 300;
    return text.length > limit ? text.slice(0, limit) + "…" : text;
  }

  function normalizeSmall(value, depth, state) {
    const level = Number(depth) || 0;
    const walk = state || { seen: new WeakSet(), nodes: 0 };
    if (value == null || typeof value === "boolean" || typeof value === "number") return value;
    if (typeof value === "string") return boundedText(value, 300);
    if (typeof value === "function" || typeof value === "symbol") return undefined;
    if (walk.nodes > 1200) return { __truncated: "node-limit" };
    if (level >= 4) return { __truncated: "depth-limit" };

    if (Array.isArray(value)) {
      if (walk.seen.has(value)) return "[Circular]";
      walk.seen.add(value);
      walk.nodes += 1;
      const limit = Math.min(value.length, 40);
      const out = [];
      for (let i = 0; i < limit; i += 1) out.push(normalizeSmall(value[i], level + 1, walk));
      if (value.length > limit) out.push({ __truncatedItems: value.length - limit });
      return out;
    }

    if (typeof value === "object") {
      if (walk.seen.has(value)) return "[Circular]";
      walk.seen.add(value);
      walk.nodes += 1;
      const out = {};
      const keys = Object.keys(value).sort().slice(0, 80);
      for (const key of keys) {
        if (/^(model|character|children|parts|sliders|transforms|decals)$/i.test(key)) continue;
        let descriptor = null;
        try { descriptor = Object.getOwnPropertyDescriptor(value, key); } catch (_) {}
        if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value")) continue;
        const next = normalizeSmall(descriptor.value, level + 1, walk);
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

  function transform(record) {
    const out = {};
    const present = [];
    if (!record || typeof record !== "object") return { values: out, present, hash: smallHash(out) };
    for (const key of TRANSFORM_KEYS) {
      if (!Object.prototype.hasOwnProperty.call(record, key)) continue;
      present.push(key);
      const value = Number(record[key]);
      if (Number.isFinite(value)) out[key] = value;
    }
    return { values: out, present, hash: smallHash(out) };
  }

  function normalizedRecord(record) {
    if (!record || typeof record !== "object") return null;
    const tx = transform(record);
    const extra = {};
    const keys = Object.keys(record).sort().slice(0, 80);
    for (const key of keys) {
      if (key === "id" || key === "forceProjectedScript" || TRANSFORM_KEYS.includes(key)) continue;
      let descriptor = null;
      try { descriptor = Object.getOwnPropertyDescriptor(record, key); } catch (_) {}
      if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value")) continue;
      const value = descriptor.value;
      if (value == null || ["string","number","boolean"].includes(typeof value) ||
          Array.isArray(value) || (value && typeof value === "object")) {
        const next = normalizeSmall(value, 0);
        if (next !== undefined) extra[key] = next;
      }
    }

    const normalized = {
      id: record.id != null ? record.id : null,
      forceProjectedScript: typeof record.forceProjectedScript === "boolean" ? record.forceProjectedScript : null,
      transform: tx.values,
      transformFields: tx.present,
      transformHash: tx.hash,
      state: extra
    };
    normalized.recordHash = smallHash(normalized);
    return normalized;
  }

  function primaryContext() {
    const CK = UW.CK || null;
    const character = CK && CK.character || null;
    const data = character && character.data || null;
    const display = character && character.display || null;
    return { CK, character, data, display };
  }

  function orderedSplatter(display) {
    const ordered = display && display.modded && display.modded.orderedDecals &&
      display.modded.orderedDecals.splatter;
    if (!Array.isArray(ordered)) return [];
    return ordered.slice(0, MAX_SLOT_RECORDS).map(function (entry, sourceLayer) {
      const slot = entry && entry.decalSlotData || null;
      const mapping = entry && entry.mapping != null
        ? String(entry.mapping)
        : (slot && slot.mapping != null ? String(slot.mapping) : null);
      return {
        sourceLayer,
        mapping,
        id: entry && entry.id != null ? entry.id : (entry && entry.decal && entry.decal.id != null ? entry.decal.id : null),
        label: slot && slot.label != null ? boundedText(slot.label, 160) : null,
        name: slot && slot.name != null ? boundedText(slot.name, 160) : null
      };
    });
  }

  function modelFigures(ctx) {
    const sources = [];
    if (ctx.data) sources.push({ key: "primary", primary: true, data: ctx.data });

    const children = ctx.data && ctx.data.children;
    if (children && typeof children === "object") {
      for (const [key, value] of Object.entries(children).slice(0, 24)) {
        if (!value || typeof value !== "object" || value === ctx.data) continue;
        if (value.decals && typeof value.decals === "object") {
          sources.push({ key: "child:" + key, primary: false, data: value });
        }
      }
    }

    return sources.map(function (source) {
      const splatter = source.data && source.data.decals && source.data.decals.splatter;
      const rows = [];
      if (splatter && typeof splatter === "object") {
        for (const [mapping, record] of Object.entries(splatter).slice(0, MAX_SLOT_RECORDS)) {
          if (!record || typeof record !== "object") continue;
          rows.push({
            mapping: String(mapping),
            record: normalizedRecord(record)
          });
        }
      }
      return {
        figureKey: source.key,
        primary: source.primary,
        decalDataAvailable: !!(source.data && source.data.decals),
        occupiedCount: rows.length,
        records: rows,
        truncated: !!(splatter && typeof splatter === "object" && Object.keys(splatter).length > rows.length)
      };
    });
  }

  function selectionState(ctx, ordered, primaryRows) {
    const uiState = UW.UIState || null;
    const selectedLabel = uiState && uiState.editorMenu_color_decals_decals != null
      ? String(uiState.editorMenu_color_decals_decals)
      : null;

    if (!ordered.length) {
      return {
        available: false,
        reason: "no-ordered-splatter-decals",
        selectedLabel
      };
    }

    const candidates = [];
    if (selectedLabel != null) {
      for (const row of ordered) {
        if (row.label === selectedLabel || row.name === selectedLabel) candidates.push(row);
      }
    } else if (ordered.length === 1) {
      candidates.push(ordered[0]);
    }

    if (!candidates.length) {
      return {
        available: false,
        reason: selectedLabel == null ? "selected-decal-label-unavailable" : "selected-label-not-mapped",
        selectedLabel,
        candidateCount: 0
      };
    }
    if (candidates.length > 1) {
      return {
        available: false,
        reason: "selected-label-ambiguous",
        selectedLabel,
        candidateCount: candidates.length,
        candidates: candidates.slice(0, 10)
      };
    }

    const chosen = candidates[0];
    const recordRow = primaryRows.find(function (row) {
      return String(row.mapping) === String(chosen.mapping);
    }) || null;

    return {
      available: true,
      selectedLabel,
      sourceLayer: chosen.sourceLayer,
      mapping: chosen.mapping,
      decalId: recordRow && recordRow.record ? recordRow.record.id : chosen.id,
      record: recordRow ? recordRow.record : null,
      recordFound: !!recordRow,
      candidateCount: 1
    };
  }

  function matrixElements(value) {
    const elements = value && value.elements;
    if (!elements || typeof elements.length !== "number" || elements.length < 16) return null;
    const out = Array.from(elements).slice(0, 16).map(Number);
    return out.every(Number.isFinite) ? out : null;
  }

  function renderedBinding(ctx, selection) {
    if (!selection || !selection.available) {
      return { available: false, reason: "selection-unavailable", matches: [] };
    }

    const modded = ctx.display && ctx.display.modded;
    const displayDecals = modded && modded.displayDecals;
    const meshes = ctx.display && ctx.display.meshes;
    if (!displayDecals || !meshes) {
      return { available: false, reason: "rendered-decal-structures-unavailable", matches: [] };
    }

    const matches = [];
    for (const [target, list] of Object.entries(displayDecals)) {
      if (!Array.isArray(list)) continue;
      for (let index = 0; index < list.length && matches.length < 32; index += 1) {
        const item = list[index];
        if (!item || item.sourceSlot !== "splatter" || Number(item.sourceLayer) !== Number(selection.sourceLayer)) continue;
        const currentId = item.id != null ? item.id : (item.decal && item.decal.id != null ? item.decal.id : null);
        if (selection.decalId != null && currentId != null && Number(currentId) !== Number(selection.decalId)) continue;

        const mesh = meshes[target];
        const material = mesh && mesh.bakeMaterials && mesh.bakeMaterials.colorDecals &&
          mesh.bakeMaterials.colorDecals[index];
        const project = material && material.uniforms && material.uniforms.l0_project &&
          material.uniforms.l0_project.value;
        const matrix = matrixElements(project);

        matches.push({
          target: boundedText(target, 180),
          materialIndex: index,
          sourceLayer: item.sourceLayer,
          decalId: currentId,
          meshUuid: mesh && mesh.uuid ? String(mesh.uuid) : null,
          materialUuid: material && material.uuid ? String(material.uuid) : null,
          projectMatrix: matrix,
          projectMatrixHash: matrix ? smallHash(matrix) : null
        });
      }
    }

    return {
      available: true,
      matchCount: matches.length,
      matches,
      truncated: matches.length >= 32
    };
  }

  function gizmoState() {
    const api = gizmoApi();
    if (!api) return { available: false, reason: "corrected-gizmo-unavailable" };
    const diagnostic = safeCall(api.getDiagnosticState && api.getDiagnosticState.bind(api), null);
    const publicState = safeCall(api.getState && api.getState.bind(api), null);
    return {
      available: !!(diagnostic || publicState),
      public: publicState,
      diagnostic
    };
  }

  function partDecalCount(options, id) {
    const part = options && options.parts && options.parts[id];
    const decals = part && part.decals;
    return decals && typeof decals === "object" ? Object.keys(decals).length : 0;
  }

  function slotCountSummary(options, slotName) {
    const slot = options && options.partsBySlot && options.partsBySlot[slotName];
    const entries = Array.isArray(slot) ? slot : Object.values(slot || {});
    const counts = [];
    for (const entry of entries.slice(0, 200)) {
      const id = entry && entry.id;
      if (id == null) continue;
      counts.push(partDecalCount(options, id));
    }
    return {
      slot: slotName,
      partCount: counts.length,
      minDecalCount: counts.length ? Math.min.apply(null, counts) : null,
      maxDecalCount: counts.length ? Math.max.apply(null, counts) : null,
      partsAtOrAbove96: counts.filter(function (count) { return count >= 96; }).length,
      partsTruncated: entries.length > 200
    };
  }

  function expandedSlotsState() {
    const api = expandedApi();
    const bridge = slotBridgeApi();
    const options = UW.CK && UW.CK.Options || null;
    const bridgeEnabled = safeCall(bridge && bridge.isEnabled && bridge.isEnabled.bind(bridge), null);
    const corePart = options && options.parts && options.parts[21022] || null;
    const coreDecals = corePart && corePart.decals || null;
    const coreSignature = !!(
      corePart &&
      corePart.displayFilename === "KOMIKA.ttf" &&
      coreDecals && coreDecals[0] && coreDecals[0].name === "splatterzero" &&
      coreDecals[1] && coreDecals[1].label === "Splatter 1"
    );

    return {
      slotBridge: {
        available: !!bridge,
        loaded: !!(bridge && bridge.loaded),
        enabled: bridgeEnabled
      },
      expanded: api ? {
        loaded: !!api.loaded,
        applied: !!api.applied,
        status: api.status || null,
        reason: api.reason || null,
        tries: Number(api.tries) || 0,
        maxTries: Number(api.maxTries) || null,
        delayMs: Number(api.delayMs) || null,
        target: Number(api.target) || null
      } : null,
      coreTweaksSignature: coreSignature,
      primarySlots: options ? [
        slotCountSummary(options, "bodyUpper"),
        slotCountSummary(options, "bodyLower"),
        slotCountSummary(options, "face")
      ] : [],
      specialParts: options ? [
        { id: 21022, decalCount: partDecalCount(options, 21022) },
        { id: 3139, decalCount: partDecalCount(options, 3139) },
        { id: 20091, decalCount: partDecalCount(options, 20091) }
      ] : []
    };
  }

  function freeze() {
    const ctx = primaryContext();
    const figures = modelFigures(ctx);
    const primary = figures.find(function (row) { return row.primary; }) || {
      records: [], occupiedCount: 0
    };
    const ordered = orderedSplatter(ctx.display);
    const selection = selectionState(ctx, ordered, primary.records || []);
    const rendered = renderedBinding(ctx, selection);
    const gizmo = gizmoState();
    const expanded = expandedSlotsState();

    return {
      characterAvailable: !!ctx.character,
      figureKey: "primary",
      figures,
      ordered,
      orderedHash: smallHash(ordered),
      orderedTruncated: !!(
        ctx.display && ctx.display.modded && ctx.display.modded.orderedDecals &&
        Array.isArray(ctx.display.modded.orderedDecals.splatter) &&
        ctx.display.modded.orderedDecals.splatter.length > ordered.length
      ),
      selection,
      rendered,
      gizmo,
      expanded
    };
  }

  function warning(code, message, phase, expected, actual) {
    return {
      provider: PROVIDER_ID,
      code,
      phase: phase || null,
      severity: "warning",
      message: message || null,
      expected: expected == null ? null : expected,
      actual: actual == null ? null : actual
    };
  }

  function capture(context, frozenSeed) {
    const seed = frozenSeed || freeze();
    const figures = Array.isArray(seed.figures) ? seed.figures : [];
    const primary = figures.find(function (row) { return row && row.primary; }) || null;
    const selection = seed.selection || { available: false, reason: "selection-unavailable" };
    const rendered = seed.rendered || { available: false, reason: "rendered-binding-unavailable", matches: [] };
    const gizmo = seed.gizmo || { available: false };
    const gd = gizmo.diagnostic || null;
    const expanded = seed.expanded || null;

    const projector = gd ? {
      native: gd.native || null,
      projector: gd.projector || null,
      renderedMatches: Array.isArray(gd.renderedMatches) ? gd.renderedMatches : [],
      selected: gd.selected || null
    } : {
      available: false,
      reason: "corrected-gizmo-diagnostic-state-unavailable"
    };

    const gizmoSection = gd ? {
      build: gd.build || null,
      enabledByUser: !!gd.enabledByUser,
      active: !!gd.active,
      mode: gd.mode || null,
      status: gd.status || null,
      error: !!gd.error,
      activeBinding: gd.activeBinding || null,
      native: gd.native || null,
      drag: gd.drag || null,
      lastForward: gd.lastForward || null
    } : {
      available: false,
      public: gizmo.public || null
    };

    const preservation = gd && gd.preservation ? gd.preservation : {
      installed: null,
      mapping: selection.available ? selection.mapping : null,
      known: null,
      pending: null,
      recentActions: [],
      lastFailure: null,
      limitation: "corrected-gizmo-diagnostic-state-unavailable"
    };

    const failures = [];
    if (preservation && preservation.lastFailure) {
      failures.push({ source: "preservation", detail: preservation.lastFailure });
    }
    if (gizmoSection.error) {
      failures.push({ source: "gizmo", detail: { status: gizmoSection.status } });
    }

    const events = preservation && Array.isArray(preservation.recentActions)
      ? preservation.recentActions.slice(-12)
      : [];

    const warnings = [];
    if (selection.reason === "selected-label-ambiguous") {
      warnings.push(warning("DECAL_SELECTION_AMBIGUOUS", "The selected decal label resolves to more than one ordered decal.", "selection", 1, selection.candidateCount));
    } else if (seed.ordered && seed.ordered.length && !selection.available) {
      warnings.push(warning("DECAL_SELECTION_UNRESOLVED", "Ordered decals exist but the current UI selection could not be resolved.", "selection", true, selection.reason));
    }
    if (selection.available && rendered.available && rendered.matchCount === 0) {
      warnings.push(warning("DECAL_RENDER_BINDING_MISSING", "The selected model decal has no matching rendered decal material.", "rendered-binding", ">=1", 0));
    }
    if (gd && gd.active && gd.native && Number(gd.native.scanCount) !== 1) {
      warnings.push(warning("DECAL_NATIVE_GIZMO_AMBIGUOUS", "Corrected gizmo is active without exactly one native decal transformer.", "gizmo", 1, gd.native.scanCount));
    }
    if (gd && gd.projector && Number.isFinite(Number(gd.projector.maxSpread)) &&
        Number.isFinite(Number(gd.projector.tolerance)) &&
        Number(gd.projector.maxSpread) > Number(gd.projector.tolerance)) {
      warnings.push(warning("DECAL_PROJECTOR_SPREAD_EXCEEDED", "Projector spread exceeds the correction tolerance.", "projector", gd.projector.tolerance, gd.projector.maxSpread));
    }
    if (expanded && expanded.slotBridge && expanded.slotBridge.enabled === true &&
        expanded.expanded && expanded.expanded.applied === false &&
        expanded.expanded.status === "stopped") {
      warnings.push(warning("DECAL_EXPANDED_SLOTS_NOT_APPLIED", "Expanded Decal Slots stopped before applying.", "expanded-slots", "applied", expanded.expanded.reason));
    }

    const noDecals = !(primary && primary.occupiedCount) && !(seed.ordered && seed.ordered.length);
    const selectionCoverage = noDecals
      ? { sectionName: "selection", status: "not-applicable", reason: "no-splatter-decals" }
      : selection.available
        ? { sectionName: "selection", status: "captured", reason: null }
        : { sectionName: "selection", status: "partial", reason: selection.reason || "selection-unresolved" };

    const renderedCoverage = !selection.available
      ? { sectionName: "rendered-binding", status: "not-applicable", reason: "selection-unavailable" }
      : rendered.available
        ? { sectionName: "rendered-binding", status: "captured-bounded", reason: "selected-decal-only" }
        : { sectionName: "rendered-binding", status: "unavailable", reason: rendered.reason || "rendered-binding-unavailable" };

    const projectorCoverage = gd && gd.projector
      ? { sectionName: "projector", status: "captured-bounded", reason: "active-corrected-gizmo-projector" }
      : { sectionName: "projector", status: "not-applicable", reason: "corrected-gizmo-not-active-or-projector-unavailable" };

    const failureCoverage = failures.length
      ? { sectionName: "failure-context", status: "captured-bounded", reason: "recent-provider-failure-state" }
      : { sectionName: "failure-context", status: "not-applicable", reason: "no-retained-provider-failure" };

    const sections = {
      state: {
        characterAvailable: !!seed.characterAvailable,
        figureCount: figures.length,
        occupiedDecalCount: figures.reduce(function (sum, row) { return sum + (Number(row.occupiedCount) || 0); }, 0),
        orderedLayerCount: Array.isArray(seed.ordered) ? seed.ordered.length : 0,
        selectedLabel: selection.selectedLabel || null,
        selectedMapping: selection.available ? selection.mapping : null,
        selectedDecalId: selection.available ? selection.decalId : null,
        gizmoAvailable: !!gizmo.available,
        expandedSlotsAvailable: !!expanded,
        slotBridgeAvailable: !!(expanded && expanded.slotBridge && expanded.slotBridge.available)
      },
      slots: {
        figures,
        primaryOrder: Array.isArray(seed.ordered) ? seed.ordered : [],
        orderedHash: seed.orderedHash || null,
        orderedTruncated: !!seed.orderedTruncated
      },
      selection,
      "rendered-binding": rendered,
      projector,
      gizmo: gizmoSection,
      preservation,
      "expanded-slots": expanded,
      "failure-context": {
        failures,
        limitation: gd ? null : "corrected-gizmo-diagnostic-state-unavailable"
      },
      events
    };

    const coverage = [
      { sectionName: "state", status: "captured", reason: null },
      { sectionName: "slots", status: "captured-bounded", reason: "occupied-splatter-records-capped-at-" + MAX_SLOT_RECORDS },
      selectionCoverage,
      renderedCoverage,
      projectorCoverage,
      { sectionName: "gizmo", status: gizmo.available ? "captured" : "unavailable", reason: gizmo.available ? null : gizmo.reason || "corrected-gizmo-unavailable" },
      { sectionName: "preservation", status: gd && gd.preservation ? "captured-bounded" : "partial", reason: gd && gd.preservation ? "recent-preservation-ring" : "diagnostic-preservation-state-unavailable" },
      { sectionName: "expanded-slots", status: expanded ? "captured-bounded" : "unavailable", reason: expanded ? "slot-count-summary-only" : "expanded-slot-state-unavailable" },
      failureCoverage,
      { sectionName: "events", status: "captured-bounded", reason: "preservation-actions-only-v1" }
    ];

    const selectedRecord = selection.available && selection.record ? selection.record : null;
    const summary = {
      figureCountWithDecalData: figures.filter(function (row) { return row.decalDataAvailable; }).length,
      occupiedDecalCount: figures.reduce(function (sum, row) { return sum + (Number(row.occupiedCount) || 0); }, 0),
      orderedLayerCount: Array.isArray(seed.ordered) ? seed.ordered.length : 0,
      selectedMapping: selection.available ? selection.mapping : null,
      selectedDecalId: selection.available ? selection.decalId : null,
      selectedProjectState: selectedRecord ? selectedRecord.forceProjectedScript : null,
      selectedTransformHash: selectedRecord ? selectedRecord.transformHash : null,
      selectedRecordHash: selectedRecord ? selectedRecord.recordHash : null,
      selectionResolved: !!selection.available,
      renderedMatchCount: rendered.available ? Number(rendered.matchCount) || 0 : null,
      selectedModelWithoutRenderedMatch: !!(selection.available && rendered.available && rendered.matchCount === 0),
      correctedGizmoEnabled: !!(gd && gd.enabledByUser),
      correctedGizmoActive: !!(gd && gd.active),
      correctedGizmoMode: gd && gd.mode || null,
      correctedGizmoError: !!(gd && gd.error),
      nativeGizmoCount: gd && gd.native ? gd.native.scanCount : null,
      projectorSpread: gd && gd.projector ? gd.projector.maxSpread : null,
      projectorOverTolerance: !!(gd && gd.projector &&
        Number.isFinite(Number(gd.projector.maxSpread)) &&
        Number.isFinite(Number(gd.projector.tolerance)) &&
        Number(gd.projector.maxSpread) > Number(gd.projector.tolerance)),
      preservationKnown: !!(preservation && preservation.known),
      preservationPending: !!(preservation && preservation.pending),
      expandedSlotsApplied: !!(expanded && expanded.expanded && expanded.expanded.applied),
      expandedSlotsStatus: expanded && expanded.expanded ? expanded.expanded.status : null,
      expandedSlotsTarget: expanded && expanded.expanded ? expanded.expanded.target : null,
      warningCodes: warnings.map(function (row) { return row.code; })
    };

    return {
      summary,
      sections,
      coverage,
      warnings,
      events
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
        maxSlotRecords: MAX_SLOT_RECORDS,
        preservationActionRing: true
      },
      freeze,
      capture
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

  UW.KWDecalsDiagnosticProvider = Object.freeze({
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
        registered,
        registerTries,
        gizmoAvailable: !!gizmoApi(),
        expandedSlotsAvailable: !!expandedApi(),
        slotBridgeAvailable: !!slotBridgeApi(),
        coreAvailable: !!core()
      };
    },
    dispose
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
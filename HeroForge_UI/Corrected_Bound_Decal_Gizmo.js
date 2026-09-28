(function () {
  "use strict";

  const UW = Function("return typeof unsafeWindow !== 'undefined' ? unsafeWindow : window")();
  const BASE = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/HeroForge_UI/corrected-bound-decal-gizmo/";
  const PARTS = [
    "part-00.jsfrag",
    "part-01.jsfrag",
    "part-02.jsfrag",
    "part-03.jsfrag",
    "part-04.jsfrag"
  ];

  function replaceExactlyOnce(source, before, after, label) {
    const first = source.indexOf(before);
    if (first < 0) throw new Error(`Stable source fix missing expected ${label} anchor.`);
    if (source.indexOf(before, first + before.length) >= 0) {
      throw new Error(`Stable source fix found ambiguous ${label} anchors.`);
    }
    return source.slice(0, first) + after + source.slice(first + before.length);
  }

  function applyAcceptedV042Rules(source) {
    // Accepted v0.3.1 geometry/orientation rules.
    source = replaceExactlyOnce(
      source,
      'const BUILD = "1.0.1-dev-native-transformer-visual";',
      'const BUILD = "1.2.0-diagnostic-state-seam";',
      "build marker"
    );
    source = replaceExactlyOnce(
      source,
      "const localCenters = worldToCanonical.map(inverse => normalizeHomogeneous(mat4MulVec4(inverse, [0, 0, 0, 1])));",
      "const localCenters = worldToCanonical.map(inverse => normalizeHomogeneous(mat4MulVec4(inverse, [0.5, 0.5, 0.5, 1])));",
      "projector midpoint"
    );
    source = replaceExactlyOnce(
      source,
      "proxy.quaternion.copy(mode === 'translate' ? parentWorld.quaternion : locatorWorld.quaternion);",
      "proxy.quaternion.copy(locatorWorld.quaternion);",
      "Move sync orientation"
    );
    source = replaceExactlyOnce(
      source,
      'proxy.quaternion.copy(mode === "translate" ? parentWorld.quaternion : locatorWorld.quaternion);',
      "proxy.quaternion.copy(locatorWorld.quaternion);",
      "Move initial orientation"
    );

    // CK.activeTweak() records an undo point on every pointermove.
    // Apply the same data change + refresh without history during the live drag;
    // passiveChangeFinish() remains the single commit on release.
    const activeTweakBlock = `    CK.activeTweak({
      decals: {
        ...decals,
        splatter: {
          ...splatter,
          [activeBinding.mapping]: nextRecord
        }
      }
    });`;

    const noHistoryBlock = `    if (!CK.character || !CK.character.data ||
        typeof CK.character.data.change !== 'function' ||
        typeof CK.character.refresh !== 'function') {
      throw new Error('No-history character update path unavailable.');
    }

    CK.character.data.change({
      decals: {
        ...decals,
        splatter: {
          ...splatter,
          [activeBinding.mapping]: nextRecord
        }
      }
    });
    CK.character.refresh();`;

    source = replaceExactlyOnce(
      source,
      activeTweakBlock,
      noHistoryBlock,
      "Move live-update undo path"
    );

    // Cancel/interrupted drags restore state without manufacturing an undo entry.
    source = replaceExactlyOnce(
      source,
      "      applyRawMove(drag.startRaw, true);\n      setStatus('Move cancelled; start position restored.');",
      "      applyRawMove(drag.startRaw, false);\n      setStatus('Move cancelled; start position restored.');",
      "Move cancel history suppression"
    );
    source = replaceExactlyOnce(
      source,
      "      try { applyRawMove(activeMoveDrag.startRaw, true); } catch (_) {}",
      "      try { applyRawMove(activeMoveDrag.startRaw, false); } catch (_) {}",
      "interrupted overlay Move history suppression"
    );
    source = replaceExactlyOnce(
      source,
      "      try { applyRawMove(nativeMoveDrag.startRaw, true); } catch (_) {}",
      "      try { applyRawMove(nativeMoveDrag.startRaw, false); } catch (_) {}",
      "interrupted native Move history suppression"
    );

    const selectedInfoAnchor = "  function selectedSplatterInfo(CK) {";
    const transformPreserver = `  const BOUND_TRANSFORM_FIELDS = Object.freeze(['h','v','d','s','sy','a','i','u','sz']);
  const BOGUS_BOUND_DEFAULTS = Object.freeze([
    Object.freeze({
      v: 1.5039421170949936,
      s: 1.768586891036554,
      sy: 1.768586891036554
    }),
    Object.freeze({
      v: 1.56,
      s: 1.82,
      sy: 1.82
    })
  ]);
  const BOGUS_BOUND_TOLERANCE = 0.025;
  const PENDING_BOUND_PRESERVE_MS = 1800;
  const pendingBoundTransforms = new Map();
  const knownBoundTransforms = new Map();
  let boundTransformPreserverInstalled = false;
  const DIAGNOSTIC_PRESERVATION_LIMIT = 12;
  const diagnosticPreservationActions = [];
  let diagnosticPreservationFailure = null;

  function boundedDiagnosticRecord(record) {
    if (!record || typeof record !== 'object') return null;
    return {
      id: record.id != null ? record.id : null,
      forceProjectedScript: record.forceProjectedScript,
      transform: finiteTransformSnapshot(record)
    };
  }

  function boundedPendingDiagnostic(pending) {
    if (!pending) return null;
    return {
      id: pending.id != null ? pending.id : null,
      freshBind: !!pending.freshBind,
      expiresInMs: Number.isFinite(Number(pending.expiresAt))
        ? Math.max(0, Number(pending.expiresAt) - Date.now())
        : null,
      transform: pending.transform ? { ...pending.transform } : null
    };
  }

  function recordPreservationAction(action, mapping, previous, patchRecord, effective, pending, extra = null) {
    diagnosticPreservationActions.push({
      at: Date.now(),
      action: String(action || 'unknown'),
      mapping: mapping != null ? String(mapping) : null,
      previous: boundedDiagnosticRecord(previous),
      incomingFields: patchRecord && typeof patchRecord === 'object' ? Object.keys(patchRecord).sort().slice(0, 40) : [],
      effective: boundedDiagnosticRecord(effective),
      pending: boundedPendingDiagnostic(pending),
      extra
    });
    while (diagnosticPreservationActions.length > DIAGNOSTIC_PRESERVATION_LIMIT) {
      diagnosticPreservationActions.shift();
    }
  }

  function recordPreservationFailure(phase, error, mapping = null) {
    diagnosticPreservationFailure = {
      at: Date.now(),
      phase: String(phase || 'unknown'),
      mapping: mapping != null ? String(mapping) : null,
      message: error && error.message ? String(error.message) : String(error || 'unknown')
    };
  }

  function finiteTransformSnapshot(record) {
    const out = {};
    if (!record || typeof record !== 'object') return out;
    for (const key of BOUND_TRANSFORM_FIELDS) {
      const value = Number(record[key]);
      if (Number.isFinite(value)) out[key] = value;
    }
    return out;
  }

  function copyTransformInto(target, transform) {
    if (!target || typeof target !== 'object' || !transform) return;
    for (const key of BOUND_TRANSFORM_FIELDS) {
      const value = Number(transform[key]);
      if (Number.isFinite(value)) target[key] = value;
    }
  }

  function nearValue(value, target, tolerance = BOGUS_BOUND_TOLERANCE) {
    const n = Number(value);
    return Number.isFinite(n) && Math.abs(n - target) <= tolerance;
  }

  function isKnownBogusBoundDefault(record) {
    if (!record || record.forceProjectedScript !== false) return false;
    const neutralish = ['h','d','a','i','u'].every(key => {
      const value = record[key];
      return value == null || (Number.isFinite(Number(value)) && Math.abs(Number(value)) <= 0.08);
    });
    return neutralish && BOGUS_BOUND_DEFAULTS.some(signature =>
      nearValue(record.v, signature.v) &&
      nearValue(record.s, signature.s) &&
      nearValue(record.sy, signature.sy)
    );
  }

  function onCharacterEnterChange(character, update) {
    try {
      if (!featureEnabled || !character || !update || typeof update !== 'object') return;
      const patchSplatter = update.decals && update.decals.splatter;
      const currentSplatter = character.data && character.data.decals && character.data.decals.splatter;
      if (!patchSplatter || typeof patchSplatter !== 'object' || !currentSplatter) return;

      const now = Date.now();

      for (const [mapping, patchRecord] of Object.entries(patchSplatter)) {
        if (!patchRecord || typeof patchRecord !== 'object' || Array.isArray(patchRecord)) continue;

        const previous = currentSplatter[mapping];
        if (!previous || typeof previous !== 'object') continue;

        const key = String(mapping);
        let pending = pendingBoundTransforms.get(key);

        if (pending && pending.expiresAt < now) {
          recordPreservationAction('expire-pending', key, previous, null, previous, pending);
          pendingBoundTransforms.delete(key);
          pending = null;
        }

        const effective = { ...previous, ...patchRecord };
        const previousBound = previous.forceProjectedScript === false;
        const nextBound = effective.forceProjectedScript === false;
        const idChanged = String(previous.id) !== String(effective.id);
        const becameBound = !previousBound && nextBound;
        const changedArtworkWhileBound = previousBound && nextBound && idChanged;

        // Only real Project-OFF state is authoritative for future restoration.
        // Never treat a projected decal's s/sy fields as a valid bound baseline.
        if (previousBound && !(pending && String(pending.id) === String(previous.id))) {
          knownBoundTransforms.set(key, {
            id: previous.id,
            transform: finiteTransformSnapshot(previous)
          });
        }

        if (becameBound) {
          const known = knownBoundTransforms.get(key);
          const knownMatches = Boolean(
            known &&
            String(known.id) === String(effective.id) &&
            known.transform &&
            Object.keys(known.transform).length
          );

          pending = {
            id: effective.id,
            transform: knownMatches ? { ...known.transform } : null,
            freshBind: !knownMatches,
            expiresAt: now + PENDING_BOUND_PRESERVE_MS
          };
          pendingBoundTransforms.set(key, pending);
          recordPreservationAction('pending-bound-transition', key, previous, patchRecord, effective, pending);
        }

        if (changedArtworkWhileBound) {
          const preserved = finiteTransformSnapshot(previous);
          copyTransformInto(patchRecord, preserved);
          knownBoundTransforms.set(key, {
            id: effective.id,
            transform: preserved
          });
          recordPreservationAction('preserve-on-artwork-change', key, previous, patchRecord, { ...effective, ...patchRecord }, null);
          pendingBoundTransforms.delete(key);
          continue;
        }

        pending = pendingBoundTransforms.get(key);
        const pendingMatches = Boolean(
          pending &&
          nextBound &&
          String(pending.id) === String(effective.id)
        );

        if (pendingMatches && isKnownBogusBoundDefault(effective)) {
          if (pending.transform && Object.keys(pending.transform).length) {
            copyTransformInto(patchRecord, pending.transform);
            knownBoundTransforms.set(key, {
              id: effective.id,
              transform: { ...pending.transform }
            });
          } else if (pending.freshBind) {
            // First-ever Project-OFF state for this slot: projected transform values
            // are not a valid bound baseline. Normalize only recognized untouched
            // HeroForge initializer profiles to a sane starting position/size.
            patchRecord.h = 0;
            patchRecord.v = 0;
            patchRecord.s = -1.5;
            patchRecord.sy = -1.5;

            const normalized = {
              ...effective,
              ...patchRecord
            };
            knownBoundTransforms.set(key, {
              id: effective.id,
              transform: finiteTransformSnapshot(normalized)
            });
          }

          recordPreservationAction(
            pending.transform && Object.keys(pending.transform).length ? 'restore-known-bound' : 'normalize-fresh-bind',
            key,
            previous,
            patchRecord,
            { ...effective, ...patchRecord },
            pending
          );
          pendingBoundTransforms.delete(key);
          continue;
        }

        // Once a non-transitional bound update is seen, remember the resulting
        // bound state for later Project ON/OFF restoration.
        if (nextBound && !pendingMatches) {
          knownBoundTransforms.set(key, {
            id: effective.id,
            transform: finiteTransformSnapshot(effective)
          });
        }
      }
    } catch (error) {
      recordPreservationFailure('characterEnterChange', error);
      console.warn('[Witch Dock] Bound decal transform preservation skipped:', error);
    }
  }

  function installBoundTransformPreserver() {
    if (boundTransformPreserverInstalled) return true;
    const CK = getCK();
    if (!CK || !CK.Events || typeof CK.Events.on !== 'function' || typeof CK.Events.off !== 'function') {
      return false;
    }

    // Seed only records that are already genuinely bound at install time.
    try {
      const splatter = CK.character && CK.character.data && CK.character.data.decals && CK.character.data.decals.splatter;
      if (splatter && typeof splatter === 'object') {
        for (const [mapping, record] of Object.entries(splatter)) {
          if (record && typeof record === 'object' && record.forceProjectedScript === false) {
            knownBoundTransforms.set(String(mapping), {
              id: record.id,
              transform: finiteTransformSnapshot(record)
            });
          }
        }
      }
    } catch (_) {}

    CK.Events.on('characterEnterChange', onCharacterEnterChange);
    boundTransformPreserverInstalled = true;
    return true;
  }

  function removeBoundTransformPreserver() {
    if (!boundTransformPreserverInstalled) return;
    const CK = getCK();
    try {
      if (CK && CK.Events && typeof CK.Events.off === 'function') {
        CK.Events.off('characterEnterChange', onCharacterEnterChange);
      }
    } catch (_) {}
    boundTransformPreserverInstalled = false;
    pendingBoundTransforms.clear();
    knownBoundTransforms.clear();
  }

`;

    source = replaceExactlyOnce(
      source,
      selectedInfoAnchor,
      transformPreserver + selectedInfoAnchor,
      "bound transform preservation hook"
    );

    source = replaceExactlyOnce(
      source,
      "  function mount() {\n    if (refreshTimer !== null) return;",
      "  function mount() {\n    if (refreshTimer !== null) return;\n    installBoundTransformPreserver();",
      "transform preserver mount"
    );

    source = replaceExactlyOnce(
      source,
      "  function dispose() {\n    if (disposed) return;\n    disposed = true;",
      "  function dispose() {\n    if (disposed) return;\n    disposed = true;\n    removeBoundTransformPreserver();",
      "transform preserver dispose"
    );

    const diagnosticSeam = `  function diagnosticState() {
    const CK = getCK();
    let selected = null;
    try { selected = selectedSplatterInfo(CK); }
    catch (error) {
      selected = { ok: false, reason: error && error.message ? error.message : String(error) };
    }

    const mapping = activeBinding && activeBinding.mapping != null
      ? String(activeBinding.mapping)
      : (selected && selected.ok && selected.mapping != null ? String(selected.mapping) : null);
    const known = mapping != null ? knownBoundTransforms.get(mapping) : null;
    const pending = mapping != null ? pendingBoundTransforms.get(mapping) : null;
    const current = latest && latest.ok ? latest : null;
    const scan = current && current.nativeScan ? current.nativeScan : null;
    const projector = current && current.projector && current.projector.ok ? current.projector : null;
    const rendered = current && current.rendered && Array.isArray(current.rendered.matches)
      ? current.rendered.matches.slice(0, 16).map(match => ({
          target: match.target,
          materialIndex: match.index,
          decalId: match.item && match.item.id != null
            ? match.item.id
            : (match.item && match.item.decal ? match.item.decal.id : null),
          sourceLayer: match.item ? match.item.sourceLayer : null,
          materialUuid: match.material && match.material.uuid ? String(match.material.uuid) : null,
          projectMatrix: Array.isArray(match.matrix) ? match.matrix.slice(0, 16) : null
        }))
      : [];

    return {
      featureId: FEATURE_ID,
      build: BUILD,
      enabledByUser: featureEnabled,
      active: enabled,
      mode,
      status: statusText,
      error: statusError,
      selected: selected && selected.ok ? {
        label: selected.selectedLabel,
        sourceLayer: selected.sourceLayer,
        mapping: selected.mapping,
        decalId: selected.record ? selected.record.id : null,
        forceProjectedScript: selected.record ? selected.record.forceProjectedScript : null,
        transform: selected.record ? finiteTransformSnapshot(selected.record) : null
      } : {
        available: false,
        reason: selected && selected.reason ? String(selected.reason) : 'selection-unavailable'
      },
      activeBinding: activeBinding ? { ...activeBinding } : null,
      native: {
        transformerPresent: !!nativeTransformer,
        locatorPresent: !!nativeLocator,
        nativeVisibleBefore,
        nativeSuppressed: Boolean(enabled && nativeTransformer && nativeTransformer.visible === false),
        mode: readNativeMode(nativeTransformer),
        scanCount: scan && Array.isArray(scan.matches) ? scan.matches.length : null,
        scanVisited: scan ? scan.visited : null,
        scanTruncated: scan ? !!scan.truncated : null,
        locator: nativeLocator ? {
          position: vec3Array(nativeLocator.position),
          quaternion: quatArray(nativeLocator.quaternion),
          scale: vec3Array(nativeLocator.scale),
          parentName: nativeLocator.parent && nativeLocator.parent.name ? String(nativeLocator.parent.name) : null
        } : null
      },
      projector: projector ? {
        frameLabel: projector.frameLabel || null,
        center: projector.center ? projector.center.slice(0, 3) : null,
        maxSpread: Number.isFinite(Number(projector.maxSpread)) ? Number(projector.maxSpread) : null,
        tolerance: PROJECTOR_SPREAD_TOLERANCE,
        worldFrame: Array.isArray(projector.worldFrame) ? projector.worldFrame.slice(0, 16) : null
      } : null,
      renderedMatches: rendered,
      drag: {
        overlay: activeMoveDrag ? {
          axisIndex: activeMoveDrag.axisIndex,
          startRaw: activeMoveDrag.startRaw ? activeMoveDrag.startRaw.slice(0, 3) : null,
          currentRaw: activeMoveDrag.currentRaw ? activeMoveDrag.currentRaw.slice(0, 3) : null
        } : null,
        native: nativeMoveDrag ? {
          startRaw: nativeMoveDrag.startRaw ? nativeMoveDrag.startRaw.slice(0, 3) : null,
          currentRaw: nativeMoveDrag.currentRaw ? nativeMoveDrag.currentRaw.slice(0, 3) : null,
          finalized: !!nativeMoveDrag.finalized
        } : null,
        transformerDragging: !!(transformer && transformer.dragging)
      },
      preservation: {
        installed: !!boundTransformPreserverInstalled,
        mapping,
        known: known ? {
          id: known.id != null ? known.id : null,
          transform: known.transform ? { ...known.transform } : null
        } : null,
        pending: boundedPendingDiagnostic(pending),
        recentActions: diagnosticPreservationActions.map(row => ({ ...row })),
        lastFailure: diagnosticPreservationFailure ? { ...diagnosticPreservationFailure } : null
      },
      lastForward: lastForward ? { ...lastForward } : null
    };
  }

`;

    source = replaceExactlyOnce(
      source,
      "  function installStyle() {",
      diagnosticSeam + "  function installStyle() {",
      "diagnostic state seam"
    );

    source = replaceExactlyOnce(
      source,
      "    getState: publicState\n  };",
      "    getState: publicState,\n    getDiagnosticState: diagnosticState\n  };",
      "diagnostic API seam"
    );

    return source;
  }

  async function load() {
    try {
      const sources = await Promise.all(PARTS.map(async path => {
        const response = await fetch(BASE + path, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status} loading ${path}`);
        return response.text();
      }));

      const source = applyAcceptedV042Rules(sources.join(""));
      new Function("unsafeWindow", `${source}\n//# sourceURL=${BASE}Corrected_Bound_Decal_Gizmo.js`)(UW);
      console.info("[Witch Dock] Corrected bound decal gizmo DEV v1.2.0 loaded: diagnostic state + preservation evidence + existing transform behavior.");
    } catch (error) {
      console.error("[Witch Dock] Corrected bound decal gizmo DEV v1.2.0 failed closed:", error);
    }
  }

  load();
})();

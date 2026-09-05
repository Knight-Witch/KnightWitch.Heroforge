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
      'const BUILD = "1.1.0-stable-undo-transform-preserve";',
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
  const BOGUS_BOUND_DEFAULT = Object.freeze({
    v: 1.5039421170949936,
    s: 1.768586891036554,
    sy: 1.768586891036554
  });
  const BOGUS_BOUND_TOLERANCE = 0.035;
  const PENDING_BOUND_PRESERVE_MS = 1800;
  const pendingBoundTransforms = new Map();
  const knownBoundTransforms = new Map();
  let boundTransformPreserverInstalled = false;

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
    return neutralish &&
      nearValue(record.v, BOGUS_BOUND_DEFAULT.v) &&
      nearValue(record.s, BOGUS_BOUND_DEFAULT.s) &&
      nearValue(record.sy, BOGUS_BOUND_DEFAULT.sy);
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
        }

        if (changedArtworkWhileBound) {
          const preserved = finiteTransformSnapshot(previous);
          copyTransformInto(patchRecord, preserved);
          knownBoundTransforms.set(key, {
            id: effective.id,
            transform: preserved
          });
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
            // First-ever Project-OFF state for this slot: projected s/sy are not
            // a valid baseline. Neutralize only the confirmed bad initializer.
            patchRecord.v = 0;
            patchRecord.s = 0;
            patchRecord.sy = 0;

            const normalized = {
              ...effective,
              ...patchRecord
            };
            knownBoundTransforms.set(key, {
              id: effective.id,
              transform: finiteTransformSnapshot(normalized)
            });
          }

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
      console.info("[Witch Dock] Corrected bound decal gizmo stable v1.1.0 loaded: undo transaction + bound-state preservation + fresh-slot normalization.");
    } catch (error) {
      console.error("[Witch Dock] Corrected bound decal gizmo stable v1.1.0 failed closed:", error);
    }
  }

  load();
})();

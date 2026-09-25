// ==UserScript==
// @name         Witch Dock DEV - Texture Quality Native Reconcile
// @namespace    KnightWitch
// @version      0.4.0
// @description  Dev-only native HeroForge texture-quality service validated from HFC alpha.3.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const GLOBAL = 'KWTextureQualityNativeReconcile';
  if (UW[GLOBAL]) {
    console.warn('[Witch Dock texture quality] Service already loaded; refresh the page to replace it.');
    return;
  }
  const VERSION = '0.4.0';
  const BUILD = '0.4.0-diagnostic-state-seam';
  const PERSIST_KEY = 'kw.witchDock.textureQuality.persistent';
  const AUTO_READY_TIMEOUT = 30000;
  const AUTO_STABLE_MS = 1200;
  const SETTLE_TIMEOUT = 120000;
  const TARGETS = ['bodyLower', 'bodyUpper', 'face'];
  const BODIES = ['bodyLower', 'bodyUpper'];
  const SCALE = 4;
  const BAKE = 2048;
  const USED = 1024; // minimum source seed; body masks use the native supported size up to 1024px
  const OWNER = 82042049;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let session = null;
  let busy = false;
  let enabled = false;
  let lastError = null;
  let lastVerification = null;
  let lastRestoreVerification = null;
  let statusText = 'OFF';
  let statusError = false;
  let persistent = readPersistent();
  let sessionSuppressed = false;
  let autoPromise = null;
  let sceneSyncPromise = null;
  let autoAttemptedIdentity = null;
  const listeners = new Set();

  const own = (o, k) => ({
    o,
    k,
    had: Object.prototype.hasOwnProperty.call(o, k),
    d: Object.getOwnPropertyDescriptor(o, k),
    v: o[k]
  });

  function restore(snapshot) {
    if (!snapshot || !snapshot.o) return;
    try {
      if (snapshot.had && snapshot.d) Object.defineProperty(snapshot.o, snapshot.k, snapshot.d);
      else delete snapshot.o[snapshot.k];
    } catch (_) {
      try { snapshot.o[snapshot.k] = snapshot.v; } catch (_) {}
    }
  }

  const partId = (part) => part ? [part.id ?? '', part.baseName ?? '', part.name ?? ''].join('|') : null;
  const texSize = (texture) => texture && texture.image
    ? [Number(texture.image.width) || 0, Number(texture.image.height) || 0]
    : [0, 0];
  const atlasSize = (atlas) => atlas ? [Number(atlas.width), Number(atlas.height)] : null;

  function allocation(atlas, slot) {
    if (!atlas || typeof atlas.getUV !== 'function') return null;
    try {
      const uv = atlas.getUV(slot);
      return uv ? [Math.round(uv.z * atlas.width), Math.round(uv.w * atlas.height)] : null;
    } catch (_) {
      return null;
    }
  }

  function readPersistent() {
    try {
      const raw = UW.localStorage.getItem(PERSIST_KEY);
      return raw === 'true' || raw === '1';
    } catch (_) {
      return false;
    }
  }

  function writePersistent(value) {
    try { UW.localStorage.setItem(PERSIST_KEY, value ? 'true' : 'false'); } catch (_) {}
  }

  function collectFigureDisplays(c) {
    if (!c) return [];
    const rows = [];
    const seen = new Set();
    const add = (key, display) => {
      if (!display || typeof display !== 'object' || seen.has(display)) return;
      const d = display.data || (display === c.display ? c.data : null);
      const m = display.modded;
      if (!d || !m || !m.parts || !display.meshes) return;
      seen.add(display);
      rows.push({
        key: String(key || ''),
        primary: display === c.display || d.primary === true,
        d,
        display,
        m,
        parts: m.parts,
        meshes: display.meshes
      });
    };

    add('', c.display);
    const registry = c.allDisplays;
    if (registry && typeof registry === 'object') {
      for (const [key, display] of Object.entries(registry)) add(key, display);
    }
    return rows;
  }

  function currentIdentity() {
    const CK = UW && UW.CK;
    const c = CK && CK.character;
    return {
      c: c || null,
      d: c && c.data ? c.data : null,
      figures: c ? collectFigureDisplays(c).map((row) => row.d) : []
    };
  }

  function sameIdentity(a, b) {
    if (!a || !b || a.c !== b.c || a.d !== b.d || a.figures.length !== b.figures.length) return false;
    return a.figures.every((d, index) => d === b.figures[index]);
  }

  function resetAutoAttempt() {
    autoAttemptedIdentity = null;
  }

  function autoAlreadyAttemptedForCurrent() {
    return sameIdentity(autoAttemptedIdentity, currentIdentity());
  }

  function markAutoAttempted() {
    autoAttemptedIdentity = currentIdentity();
  }

  function capabilities() {
    const CK = UW && UW.CK;
    const c = CK && CK.character;
    const R = CK && CK.Resources;

    if (!CK || !c || !c.data || !c.display) {
      return { ok: false, reason: 'HeroForge renderer is not ready.' };
    }
    if (typeof c.refresh !== 'function') {
      return { ok: false, reason: 'Required native lifecycle API is unavailable.' };
    }
    if (!R || typeof R.getResource !== 'function' || typeof R.getNow !== 'function') {
      return { ok: false, reason: 'Texture resource loader is unavailable.' };
    }

    const pipelines = collectFigureDisplays(c);
    if (!pipelines.length) return { ok: false, reason: 'No HeroForge figure displays are ready.' };

    for (let index = 0; index < pipelines.length; index += 1) {
      const row = pipelines[index];
      const label = row.primary ? 'primary figure' : (row.key || `figure ${index + 1}`);
      if (!row.d.atlasScale || typeof row.d.change !== 'function' || typeof row.m.buildAtlas !== 'function') {
        return { ok: false, reason: `${label} native lifecycle API is unavailable.` };
      }
      for (const key of TARGETS) {
        if (!row.parts[key]) return { ok: false, reason: `${label} ${key} part is unavailable.` };
      }
      for (const key of BODIES) {
        if (!row.meshes[key] || typeof row.parts[key].getMaskPath !== 'function') {
          return { ok: false, reason: `${label} ${key} mask capability is unavailable.` };
        }
      }
    }

    return { ok: true, CK, c, R, pipelines };
  }

  function sameCharacter(s) {
    const CK = UW && UW.CK;
    const c = CK && CK.character;
    return !!s && c === s.c && c.data === s.primaryD;
  }

  function findCurrentRow(s, p) {
    if (!sameCharacter(s)) return null;
    const rows = collectFigureDisplays(s.c);
    let row = rows.find((entry) => entry.d === p.d) || null;
    if (!row && p.primary) row = rows.find((entry) => entry.primary && entry.d === s.c.data) || null;
    if (!row && p.key) row = rows.find((entry) => entry.key === p.key) || null;
    return row;
  }

  function adoptPipeline(s, p) {
    const row = findCurrentRow(s, p);
    if (!row) return false;
    if (!TARGETS.every((key) => partId(row.parts[key]) === p.ids[key])) return false;
    if (row.display !== p.display || row.m !== p.m) {
      p.display = row.display;
      p.m = row.m;
      p.adoptions += 1;
    }
    p.key = row.key;
    p.primary = row.primary;
    return true;
  }

  function sameFigureSet(s) {
    if (!sameCharacter(s)) return false;
    const rows = collectFigureDisplays(s.c);
    if (rows.length !== s.pipelines.length) return false;
    return rows.every((row) => {
      const p = s.pipelines.find((entry) => entry.d === row.d);
      return !!p && TARGETS.every((key) => partId(row.parts[key]) === p.ids[key]);
    });
  }

  function adoptAll(s) {
    return sameFigureSet(s) && s.pipelines.every((p) => adoptPipeline(s, p));
  }

  function rememberScale(p) {
    const o = p.d.atlasScale;
    if (!p.scales.some((entry) => entry.o === o)) {
      p.scales.push({ o, rows: TARGETS.map((key) => own(o, key)) });
    }
  }

  function partSnapshot(s, part) {
    return s && s.partSnapshots ? s.partSnapshots.find((entry) => entry.o === part) || null : null;
  }

  function rememberPart(s, p, part) {
    let snapshot = partSnapshot(s, part);
    if (!snapshot) {
      snapshot = { o: part, bakeSize: part.bakeSize, used: part._usedTextureSize };
      s.partSnapshots.push(snapshot);
    }
    if (!p.partsSeen.some((entry) => entry.o === part)) p.partsSeen.push(snapshot);
  }

  function rememberMesh(p, mesh) {
    if (!p.meshesSeen.some((entry) => entry.o === mesh)) {
      p.meshesSeen.push({ o: mesh, mask: own(mesh, 'masksMapOverride') });
    }
  }

  function supportedMaskSize(part, s) {
    const snapshot = partSnapshot(s, part);
    const nativeBake = Number(snapshot ? snapshot.bakeSize : part && part.bakeSize);
    return Number.isFinite(nativeBake) && nativeBake > 0 ? Math.min(USED, nativeBake) : USED;
  }

  function resolveMaskPath(part, hi, size) {
    const usedSnapshot = own(part, '_usedTextureSize');
    try {
      // HeroForge's getMaskPath only promotes _usedTextureSize; it will not lower a
      // previously promoted source. Resolve against the exact native-supported body
      // mask size for this part, then restore the part byte-for-byte.
      part._usedTextureSize = size;
      return part.getMaskPath(hi, size);
    } finally {
      restore(usedSnapshot);
    }
  }

  function requestTexture(R, path) {
    try {
      const pending = R.getResource(path, 'webp', OWNER);
      if (pending && typeof pending.catch === 'function') pending.catch(() => {});
    } catch (_) {}
  }

  async function loadMasks(row, R, s = null) {
    const hi = !!(row.m.settings && row.m.settings.hiRez);
    const sizes = Object.fromEntries(BODIES.map((key) => [key, supportedMaskSize(row.parts[key], s)]));
    const paths = BODIES.map((key) => resolveMaskPath(row.parts[key], hi, sizes[key]));
    if (!paths[0] || !paths[1]) throw new Error('Could not resolve supported body masks.');

    paths.forEach((path) => requestTexture(R, path));
    const end = Date.now() + 5000;
    while (Date.now() < end) {
      const ready = paths.every((path, index) => {
        const dims = texSize(R.getNow(path));
        const size = sizes[BODIES[index]];
        return dims[0] === size && dims[1] === size;
      });
      if (ready) break;
      await sleep(100);
    }

    const textures = paths.map((path) => R.getNow(path));
    for (let index = 0; index < BODIES.length; index += 1) {
      const key = BODIES[index];
      const size = sizes[key];
      const dims = texSize(textures[index]);
      if (dims[0] !== size || dims[1] !== size) {
        throw new Error(`Valid ${size}px ${key} body mask did not load.`);
      }
    }
    return { bodyLower: textures[0], bodyUpper: textures[1], paths, sizes };
  }

  function createPipeline(row) {
    return {
      key: row.key,
      primary: row.primary,
      d: row.d,
      display: row.display,
      m: row.m,
      ids: Object.fromEntries(TARGETS.map((key) => [key, partId(row.parts[key])])),
      scales: [],
      partsSeen: [],
      meshesSeen: [],
      adoptions: 0,
      restoreColorBakeRefreshes: 0,
      nativeSources: Object.fromEntries(TARGETS.map((key) => [key, {
        bakeSize: row.parts[key].bakeSize,
        usedTextureSize: row.parts[key]._usedTextureSize
      }])),
      baseline: {
        atlas: atlasSize(row.display.atlas),
        allocations: Object.fromEntries(TARGETS.map((key) => [key, allocation(row.display.atlas, key)]))
      },
      masks: null
    };
  }

  function currentPipeline(s, p) {
    if (!adoptPipeline(s, p)) throw new Error('HeroForge figure/data/target parts changed; refusing stale mutation.');
    return { parts: p.m.parts, meshes: p.display.meshes };
  }

  function applyPolicy(s, p) {
    const currentState = currentPipeline(s, p);
    rememberScale(p);
    for (const key of TARGETS) p.d.atlasScale[key] = SCALE;

    for (const key of TARGETS) {
      const part = currentState.parts[key];
      const nativeUsed = Number(part._usedTextureSize);
      rememberPart(s, p, part);
      part.bakeSize = BAKE;
      // USED is a floor, not a forced value. Preserve HeroForge's native promotion
      // when the current generation is already above the protected 1024px minimum.
      part._usedTextureSize = Number.isFinite(nativeUsed) && nativeUsed > 0
        ? Math.min(BAKE, Math.max(USED, nativeUsed))
        : USED;
    }

    for (const key of BODIES) {
      rememberMesh(p, currentState.meshes[key]);
      currentState.meshes[key].masksMapOverride = p.masks[key];
    }
  }

  function restorePolicy(p) {
    for (const scaleSnapshot of p.scales) {
      for (const row of scaleSnapshot.rows) restore(row);
    }
    for (const partSnapshot of p.partsSeen) {
      try {
        partSnapshot.o.bakeSize = partSnapshot.bakeSize;
        partSnapshot.o._usedTextureSize = partSnapshot.used;
      } catch (_) {}
    }
    for (const meshSnapshot of p.meshesSeen) restore(meshSnapshot.mask);
  }

  async function syncMembership(s, R) {
    if (!sameCharacter(s)) throw new Error('HeroForge character/data changed before figure sync.');
    const cap = capabilities();
    if (!cap.ok) throw new Error(cap.reason);
    if (cap.c !== s.c || cap.c.data !== s.primaryD) throw new Error('HeroForge character/data changed before figure sync.');

    const existing = new Map(s.pipelines.map((p) => [p.d, p]));
    const next = [];

    for (const row of cap.pipelines) {
      let p = existing.get(row.d) || null;
      const ids = Object.fromEntries(TARGETS.map((key) => [key, partId(row.parts[key])]));
      if (!p) {
        p = createPipeline(row);
        p.masks = await loadMasks(row, R || cap.R, s);
      } else {
        p.key = row.key;
        p.primary = row.primary;
        p.display = row.display;
        p.m = row.m;
        const changedParts = TARGETS.some((key) => p.ids[key] !== ids[key]);
        if (changedParts) {
          p.ids = ids;
          p.nativeSources = Object.fromEntries(TARGETS.map((key) => [key, {
            bakeSize: row.parts[key].bakeSize,
            usedTextureSize: row.parts[key]._usedTextureSize
          }]));
          p.masks = await loadMasks(row, R || cap.R, s);
        }
      }
      next.push(p);
      existing.delete(row.d);
    }

    for (const retired of existing.values()) restorePolicy(retired);
    s.pipelines = next;
    return cap;
  }

  function setupColorMaterials(display) {
    const paints = display && display.colorBake && display.colorBake.paints;
    if (!paints || typeof paints.setupMaterials !== 'function') {
      throw new Error('HeroForge color-bake material setup is unavailable.');
    }
    paints.setupMaterials('color');
  }

  function nativeReconcile(s) {
    if (!adoptAll(s)) throw new Error('HeroForge figure set changed before reconcile.');
    for (const p of s.pipelines) {
      if (p.primary) {
        p.d.change({}, p.d.settings || s.c.settings);
        if (!adoptPipeline(s, p)) throw new Error('HeroForge figure changed during native reconcile.');
      }
      applyPolicy(s, p);
      setupColorMaterials(p.display);
      p.m.buildAtlas();
    }
    s.c.refresh();
  }

  function nativeRestore(s) {
    if (!sameCharacter(s)) throw new Error('HeroForge character/data changed before restore.');
    const active = collectFigureDisplays(s.c);
    for (const p of s.pipelines) {
      const row = active.find((entry) => entry.d === p.d);
      if (!row) continue;
      p.display = row.display;
      p.m = row.m;
      if (p.primary) {
        p.d.change({}, p.d.settings || s.c.settings);
        if (!adoptPipeline(s, p)) throw new Error('HeroForge figure changed during native restore.');
      }
      setupColorMaterials(p.display);
    }
    s.c.refresh();
  }

  function restoreAdoptedNativeSources(s) {
    if (!adoptAll(s)) throw new Error('HeroForge figure set changed before native source adoption.');
    for (const p of s.pipelines) {
      const currentState = currentPipeline(s, p);
      for (const key of TARGETS) {
        const native = p.nativeSources[key];
        if (!native) throw new Error(`${key} native source snapshot is unavailable.`);
        currentState.parts[key].bakeSize = native.bakeSize;
        currentState.parts[key]._usedTextureSize = native.usedTextureSize;
      }
      // Native restore can adopt a replacement display after the first policy
      // rollback. Re-apply the exact source sizes to that adopted generation,
      // then rebuild its color materials so they no longer retain the pinned
      // High Res masks or HeroForge's 1x1 fallback texture.
      setupColorMaterials(p.display);
    }
    s.c.refresh();
  }

  async function refreshAdoptedNativeColorBakes(s) {
    if (!adoptAll(s)) throw new Error('HeroForge figure set changed before native color-bake refresh.');
    for (const p of s.pipelines) {
      const colorBake = p.display && p.display.colorBake;
      if (
        !colorBake ||
        typeof colorBake.invalidateCache !== 'function' ||
        typeof colorBake.refresh !== 'function'
      ) {
        throw new Error(`${p.primary ? 'Primary figure' : (p.key || 'Figure')} color-bake refresh is unavailable.`);
      }
      colorBake.invalidateCache();
      const pending = colorBake.refresh(true);
      if (pending && typeof pending.then === 'function') await pending;
      p.restoreColorBakeRefreshes += 1;
    }
  }

  function sceneReady(cap) {
    return !!(
      cap && cap.ok &&
      !cap.c._needsUpdating &&
      !cap.c._inUpdate &&
      cap.pipelines.every((row) => (
        row.display.resourcesReady !== false &&
        row.display.finished !== false &&
        row.display.atlas &&
        row.display.atlas === row.m.resourceAtlas
      ))
    );
  }

  function sceneSignature(cap) {
    if (!cap || !cap.ok) return '';
    return JSON.stringify(cap.pipelines.map((row) => [
      row.key,
      row.primary,
      atlasSize(row.display.atlas),
      Object.keys(row.parts).sort().map((key) => [key, partId(row.parts[key])]),
      TARGETS.map((key) => allocation(row.display.atlas, key))
    ]));
  }

  function sameReadyState(a, cap, signature) {
    return !!(
      a && cap && cap.ok &&
      a.c === cap.c &&
      a.d === cap.c.data &&
      a.signature === signature &&
      a.rows.length === cap.pipelines.length &&
      cap.pipelines.every((row, index) => (
        row.d === a.rows[index].d &&
        row.display === a.rows[index].display &&
        row.m === a.rows[index].m &&
        row.display.atlas === a.rows[index].atlas
      ))
    );
  }

  async function waitForStableScene(timeout = AUTO_READY_TIMEOUT) {
    const end = Date.now() + timeout;
    let cap = null;
    let readyState = null;
    let readySince = 0;

    while (Date.now() < end) {
      cap = capabilities();
      if (!sceneReady(cap)) {
        readyState = null;
        readySince = 0;
        await sleep(150);
        continue;
      }

      const signature = sceneSignature(cap);
      if (!sameReadyState(readyState, cap, signature)) {
        readyState = {
          c: cap.c,
          d: cap.c.data,
          signature,
          rows: cap.pipelines.map((row) => ({ d: row.d, display: row.display, m: row.m, atlas: row.display.atlas }))
        };
        readySince = Date.now();
      } else if (Date.now() - readySince >= AUTO_STABLE_MS) {
        return cap;
      }
      await sleep(150);
    }
    return null;
  }

  async function settle(s) {
    const end = Date.now() + SETTLE_TIMEOUT;
    let lastSignature = '';
    let stable = 0;
    let expiredReadyChecks = 0;

    while (true) {
      if (!sameCharacter(s)) throw new Error('HeroForge character/data changed during reconcile.');
      if (!sameFigureSet(s)) throw new Error('HeroForge figure set changed during reconcile.');
      if (!s.pipelines.every((p) => adoptPipeline(s, p))) {
        throw new Error('HeroForge target parts changed during reconcile.');
      }

      const signature = JSON.stringify([
        !s.c._needsUpdating,
        !s.c._inUpdate,
        s.pipelines.map((p) => [
          p.key,
          p.display.resourcesReady,
          p.display.finished,
          p.display.atlas === p.m.resourceAtlas,
          atlasSize(p.display.atlas),
          TARGETS.map((key) => allocation(p.display.atlas, key))
        ])
      ]);
      const ready = !!(
        !s.c._needsUpdating &&
        !s.c._inUpdate &&
        s.pipelines.every((p) => (
          p.display.resourcesReady !== false &&
          p.display.finished !== false &&
          p.display.atlas &&
          p.display.atlas === p.m.resourceAtlas
        ))
      );

      if (ready) {
        stable = signature === lastSignature ? stable + 1 : 1;
        if (stable >= 3) return;
      } else {
        stable = 0;
      }
      lastSignature = signature;

      if (Date.now() >= end) {
        if (!ready) break;
        expiredReadyChecks += 1;
        if (expiredReadyChecks >= 6) break;
      } else {
        expiredReadyChecks = 0;
      }
      await sleep(150);
    }

    throw new Error('Timed out waiting for native reconciliation to settle.');
  }

  function verifyPipeline(s, p, index) {
    if (!adoptPipeline(s, p)) return { ok: false, reason: 'HeroForge figure/data/target parts changed.' };
    const currentState = currentPipeline(s, p);
    const atlas = p.display.atlas;
    const resourceAtlas = p.m.resourceAtlas;
    const out = {
      ok: true,
      key: p.key,
      label: p.primary ? 'primary' : (p.key || `figure-${index + 1}`),
      primary: p.primary,
      atlas: atlasSize(atlas),
      sameAtlas: atlas === resourceAtlas,
      adoptedGenerations: p.adoptions,
      allocations: {},
      scale: {},
      bakeSize: {},
      usedTextureSize: {},
      nativePromoted: {},
      masks: {}
    };

    if (!out.sameAtlas) return { ...out, ok: false, reason: 'Display/resource atlas objects differ.' };

    for (const key of TARGETS) {
      out.allocations[key] = allocation(atlas, key);
      out.scale[key] = p.d.atlasScale[key];
      out.bakeSize[key] = currentState.parts[key].bakeSize;
      out.usedTextureSize[key] = currentState.parts[key]._usedTextureSize;
      const used = Number(out.usedTextureSize[key]);
      out.nativePromoted[key] = used > USED;
      const packed = out.allocations[key];
      if (
        Number(out.scale[key]) !== SCALE ||
        Number(out.bakeSize[key]) !== BAKE ||
        !Number.isFinite(used) || used < USED || used > BAKE ||
        !packed || packed[0] < USED || packed[1] < USED || packed[0] > BAKE || packed[1] > BAKE
      ) {
        return { ...out, ok: false, reason: `${key} high-resolution source/allocation verification failed.` };
      }
    }

    for (const key of BODIES) {
      const mesh = currentState.meshes[key];
      const mat = mesh.bakeMaterials && mesh.bakeMaterials.color;
      const actual = mat && typeof mat.getUniform === 'function' ? mat.getUniform('masksMap') : null;
      out.masks[key] = {
        expected: texSize(p.masks[key]),
        actual: texSize(actual),
        overrideSame: mesh.masksMapOverride === p.masks[key]
      };
      const maskSize = Number(p.masks && p.masks.sizes && p.masks.sizes[key]) || USED;
      if (
        out.masks[key].expected[0] !== maskSize || out.masks[key].expected[1] !== maskSize ||
        out.masks[key].actual[0] !== maskSize || out.masks[key].actual[1] !== maskSize ||
        !out.masks[key].overrideSame
      ) {
        return { ...out, ok: false, reason: `${key} color-bake mask is not the pinned ${maskSize}px supported texture.` };
      }
    }

    return out;
  }

  function verify(s) {
    if (!adoptAll(s)) return { ok: false, reason: 'HeroForge character/figure set changed.' };
    const figures = s.pipelines.map((p, index) => verifyPipeline(s, p, index));
    const failed = figures.find((figure) => !figure.ok);
    const primary = figures.find((figure) => figure.primary) || figures[0] || null;
    const out = {
      ok: !failed,
      version: VERSION,
      build: BUILD,
      figureCount: figures.length,
      figures,
      atlas: primary ? primary.atlas : null,
      sameAtlas: figures.every((figure) => figure.sameAtlas === true),
      adoptedGenerations: figures.reduce((sum, figure) => sum + (Number(figure.adoptedGenerations) || 0), 0),
      allocations: primary ? primary.allocations : {},
      scale: primary ? primary.scale : {},
      bakeSize: primary ? primary.bakeSize : {},
      usedTextureSize: primary ? primary.usedTextureSize : {},
      nativePromoted: primary ? primary.nativePromoted : {},
      masks: primary ? primary.masks : {}
    };
    if (failed) out.reason = `${failed.label}: ${failed.reason}`;
    return out;
  }

  function samePair(actual, expected) {
    return !!(
      actual && expected &&
      Number(actual[0]) === Number(expected[0]) &&
      Number(actual[1]) === Number(expected[1])
    );
  }

  function verifyNativeRestorePipeline(s, p, index) {
    if (!adoptPipeline(s, p)) return { ok: false, reason: 'HeroForge figure/data/target parts changed.' };
    const currentState = currentPipeline(s, p);
    const atlas = p.display.atlas;
    const out = {
      ok: true,
      key: p.key,
      label: p.primary ? 'primary' : (p.key || `figure-${index + 1}`),
      primary: p.primary,
      atlas: atlasSize(atlas),
      sameAtlas: atlas === p.m.resourceAtlas,
      allocations: {},
      bakeSize: {},
      usedTextureSize: {},
      masks: {},
      colorBakeRefreshes: p.restoreColorBakeRefreshes
    };

    if (!out.sameAtlas) return { ...out, ok: false, reason: 'Display/resource atlas objects differ after restore.' };
    if (out.colorBakeRefreshes < 1) {
      return { ...out, ok: false, reason: 'Native color-bake cache was not refreshed after restore.' };
    }
    if (!samePair(out.atlas, p.baseline.atlas)) {
      return { ...out, ok: false, reason: 'Native atlas dimensions were not restored.' };
    }

    for (const key of TARGETS) {
      const part = currentState.parts[key];
      const native = p.nativeSources[key];
      out.allocations[key] = allocation(atlas, key);
      out.bakeSize[key] = part.bakeSize;
      out.usedTextureSize[key] = part._usedTextureSize;
      if (
        !native ||
        !samePair(out.allocations[key], p.baseline.allocations[key]) ||
        Number(out.bakeSize[key]) !== Number(native.bakeSize) ||
        Number(out.usedTextureSize[key]) !== Number(native.usedTextureSize)
      ) {
        return { ...out, ok: false, reason: `${key} native source/allocation was not restored.` };
      }
    }

    for (const key of BODIES) {
      const mesh = currentState.meshes[key];
      const mat = mesh.bakeMaterials && mesh.bakeMaterials.color;
      const actual = mat && typeof mat.getUniform === 'function' ? mat.getUniform('masksMap') : null;
      const expectedSize = Number(p.nativeSources[key].usedTextureSize);
      out.masks[key] = {
        expected: [expectedSize, expectedSize],
        actual: texSize(actual),
        highResOverrideRetained: !!(p.masks && mesh.masksMapOverride === p.masks[key])
      };
      if (
        !Number.isFinite(expectedSize) || expectedSize <= 0 ||
        out.masks[key].actual[0] !== expectedSize ||
        out.masks[key].actual[1] !== expectedSize ||
        out.masks[key].highResOverrideRetained
      ) {
        return { ...out, ok: false, reason: `${key} native color-bake mask was not adopted.` };
      }
    }

    return out;
  }

  function verifyNativeRestore(s) {
    if (!adoptAll(s)) return { ok: false, reason: 'HeroForge character/figure set changed during restore verification.' };
    const figures = s.pipelines.map((p, index) => verifyNativeRestorePipeline(s, p, index));
    const failed = figures.find((figure) => !figure.ok);
    const primary = figures.find((figure) => figure.primary) || figures[0] || null;
    const out = {
      ok: !failed,
      phase: 'native-restore',
      version: VERSION,
      build: BUILD,
      figureCount: figures.length,
      figures,
      atlas: primary ? primary.atlas : null,
      sameAtlas: figures.every((figure) => figure.sameAtlas === true),
      allocations: primary ? primary.allocations : {},
      bakeSize: primary ? primary.bakeSize : {},
      usedTextureSize: primary ? primary.usedTextureSize : {},
      masks: primary ? primary.masks : {}
    };
    if (failed) out.reason = `${failed.label}: ${failed.reason}`;
    return out;
  }

  async function restoreSession(s) {
    for (const p of s.pipelines) restorePolicy(p);
    nativeRestore(s);
    let settled = await waitForStableScene(SETTLE_TIMEOUT);
    if (!settled) throw new Error('Timed out waiting for native reconciliation to settle.');

    restoreAdoptedNativeSources(s);
    settled = await waitForStableScene(SETTLE_TIMEOUT);
    if (!settled) throw new Error('Timed out waiting for restored native materials to settle.');

    await refreshAdoptedNativeColorBakes(s);
    settled = await waitForStableScene(SETTLE_TIMEOUT);
    if (!settled) throw new Error('Timed out waiting for refreshed native color bake to settle.');

    const verification = verifyNativeRestore(s);
    if (!verification.ok) throw new Error(verification.reason);
    return verification;
  }

  function baselineState(s) {
    if (!s) return null;
    return {
      figureCount: s.pipelines.length,
      figures: s.pipelines.map((p) => ({ key: p.key, primary: p.primary, ...p.baseline }))
    };
  }


  function diagnosticTextureRef(texture) {
    if (!texture || typeof texture !== 'object') return null;
    let source = null;
    try {
      const image = texture.image;
      source = image && (image.currentSrc || image.src) || texture.path || texture.url || null;
    } catch (_) {}
    return {
      uuid: typeof texture.uuid === 'string' ? texture.uuid : null,
      name: typeof texture.name === 'string' ? texture.name : null,
      size: texSize(texture),
      source: typeof source === 'string' ? source.slice(0, 1000) : null
    };
  }

  function diagnosticSessionState() {
    if (!session) return { available: false, reason: 'No active High Res session.' };
    return {
      available: true,
      figureCount: session.pipelines.length,
      partSnapshots: (session.partSnapshots || []).map((snapshot) => ({
        part: partId(snapshot.o),
        bakeSize: snapshot.bakeSize,
        usedTextureSize: snapshot.used
      })),
      figures: session.pipelines.map((p) => ({
        key: p.key,
        primary: p.primary,
        targetIds: { ...p.ids },
        baseline: {
          atlas: p.baseline && Array.isArray(p.baseline.atlas) ? p.baseline.atlas.slice() : null,
          allocations: p.baseline && p.baseline.allocations
            ? Object.fromEntries(Object.entries(p.baseline.allocations).map(([key, value]) => [key, Array.isArray(value) ? value.slice() : value]))
            : {}
        },
        nativeSources: Object.fromEntries(TARGETS.map((key) => {
          const native = p.nativeSources && p.nativeSources[key];
          return [key, native ? {
            bakeSize: native.bakeSize,
            usedTextureSize: native.usedTextureSize
          } : null];
        })),
        masks: p.masks ? {
          paths: Array.isArray(p.masks.paths) ? p.masks.paths.slice() : [],
          sizes: p.masks.sizes ? { ...p.masks.sizes } : {},
          bodyLower: diagnosticTextureRef(p.masks.bodyLower),
          bodyUpper: diagnosticTextureRef(p.masks.bodyUpper)
        } : null,
        adoptedGenerations: Number(p.adoptions) || 0,
        restoreColorBakeRefreshes: Number(p.restoreColorBakeRefreshes) || 0,
        trackedSnapshots: {
          scales: Array.isArray(p.scales) ? p.scales.length : 0,
          parts: Array.isArray(p.partsSeen) ? p.partsSeen.length : 0,
          meshes: Array.isArray(p.meshesSeen) ? p.meshesSeen.length : 0
        }
      }))
    };
  }

  function getDiagnosticState() {
    return {
      version: VERSION,
      build: BUILD,
      enabled,
      busy,
      persistent,
      sessionSuppressed,
      autoPending: !!autoPromise,
      sceneSyncPending: !!sceneSyncPromise,
      statusText,
      statusError,
      lastError,
      session: diagnosticSessionState()
    };
  }

  function snapshotState() {
    const cap = capabilities();
    const primary = cap.ok ? (cap.pipelines.find((row) => row.primary) || cap.pipelines[0]) : null;
    return {
      version: VERSION,
      build: BUILD,
      enabled,
      busy,
      persistent,
      sessionSuppressed,
      autoPending: !!autoPromise,
      sceneSyncPending: !!sceneSyncPromise,
      lastError,
      statusText,
      statusError,
      lastVerification,
      lastRestoreVerification,
      baseline: baselineState(session),
      capability: cap.ok
        ? {
            ok: true,
            figureCount: cap.pipelines.length,
            atlas: primary ? atlasSize(primary.display.atlas) : null,
            sameAtlas: cap.pipelines.every((row) => row.display.atlas === row.m.resourceAtlas)
          }
        : { ok: false, reason: cap.reason }
    };
  }

  function emit() {
    const state = snapshotState();
    for (const listener of listeners) {
      try { listener(state); } catch (_) {}
    }
  }

  function setStatus(text, error = false) {
    statusText = text;
    statusError = !!error;
    emit();
  }

  function onStatusText(v) {
    if (!v || !v.figureCount) return 'ON';
    if (v.figureCount === 1) return `ON — ${v.atlas ? v.atlas.join('×') : 'native atlas'}`;
    return `ON — ${v.figureCount} figures · native atlases verified`;
  }

  function handleStaleFigure() {
    if (!session || sameCharacter(session)) return false;
    session = null;
    enabled = false;
    lastVerification = null;
    lastRestoreVerification = null;
    lastError = null;
    resetAutoAttempt();
    if (persistent && !sessionSuppressed) setStatus('Persistent High Res — waiting for the new figure…', false);
    else setStatus('OFF — figure changed; enable again for this figure.', false);
    return true;
  }

  async function enable(options = {}) {
    handleStaleFigure();
    const automatic = !!options.automatic;
    if (automatic && (!persistent || sessionSuppressed)) return false;
    if (!automatic) {
      sessionSuppressed = false;
      resetAutoAttempt();
    }
    if (busy || enabled) return enabled;
    busy = true;
    lastError = null;
    lastRestoreVerification = null;
    setStatus('Preparing native reconcile…', false);
    let s = null;

    try {
      const cap = capabilities();
      if (!cap.ok) throw new Error(cap.reason);
      s = {
        c: cap.c,
        primaryD: cap.c.data,
        pipelines: cap.pipelines.map(createPipeline),
        partSnapshots: []
      };

      await Promise.all(s.pipelines.map(async (p) => {
        const row = cap.pipelines.find((entry) => entry.d === p.d);
        p.masks = await loadMasks(row, cap.R, s);
      }));
      if (!adoptAll(s)) throw new Error('HeroForge changed while masks loaded.');
      for (const p of s.pipelines) applyPolicy(s, p);
      session = s;
      nativeReconcile(s);
      await settle(s);
      lastVerification = verify(s);
      if (!lastVerification.ok) throw new Error(lastVerification.reason);
      enabled = true;
      setStatus(onStatusText(lastVerification), false);
      return true;
    } catch (error) {
      lastError = String(error && error.message || error);
      enabled = false;
      if (persistent) markAutoAttempted();
      const policyTouched = !!(s && s.pipelines.some((p) => p.scales.length || p.partsSeen.length || p.meshesSeen.length));
      if (policyTouched && sameCharacter(s)) {
        try {
          lastRestoreVerification = await restoreSession(s);
        } catch (restoreError) {
          lastError += ` | restore: ${String(restoreError && restoreError.message || restoreError)}`;
        }
      }
      if (session === s) session = null;
      setStatus(`FAILED — ${lastError}`, true);
      console.error('[Witch Dock texture quality]', error);
      return false;
    } finally {
      busy = false;
      emit();
    }
  }

  async function disable() {
    handleStaleFigure();
    if (busy) return false;
    if (persistent) sessionSuppressed = true;
    if (!session) {
      enabled = false;
      lastVerification = null;
      setStatus(persistent ? 'OFF for this session — Persistent High Res will return after reload.' : 'OFF', false);
      return true;
    }

    busy = true;
    setStatus('Restoring source policy…', false);
    const s = session;

    try {
      if (!sameCharacter(s)) throw new Error('HeroForge character/data changed; stale snapshots not restored.');
      lastRestoreVerification = await restoreSession(s);
      enabled = false;
      session = null;
      lastVerification = null;
      lastError = null;
      setStatus(persistent
        ? 'OFF for this session — Persistent High Res will return after reload.'
        : 'OFF — source values restored; native atlases retained.', false);
      return true;
    } catch (error) {
      lastError = String(error && error.message || error);
      enabled = false;
      session = null;
      setStatus(`OFF / restore warning — ${lastError}`, true);
      console.error('[Witch Dock texture quality]', error);
      return false;
    } finally {
      busy = false;
      emit();
    }
  }

  function setPersistent(value) {
    persistent = !!value;
    writePersistent(persistent);
    if (persistent) {
      sessionSuppressed = false;
      resetAutoAttempt();
      if (!enabled) setStatus('Persistent High Res — waiting for HeroForge renderer…', false);
      queuePersistentEnable();
    } else {
      resetAutoAttempt();
      if (!enabled && !busy) setStatus('OFF', false);
      emit();
    }
    return persistent;
  }

  function queuePersistentEnable() {
    if (!persistent || sessionSuppressed || enabled || busy || autoPromise || autoAlreadyAttemptedForCurrent()) return false;
    if (document.hidden || document.visibilityState !== 'visible') return false;

    autoPromise = (async () => {
      while (persistent && !sessionSuppressed && !enabled) {
        if (document.hidden || document.visibilityState !== 'visible') return false;
        const cap = await waitForStableScene(AUTO_READY_TIMEOUT);
        if (!persistent || sessionSuppressed || enabled) return false;
        if (!cap) {
          markAutoAttempted();
          lastError = 'HeroForge renderer did not become ready for Persistent High Res.';
          setStatus(`Persistent High Res failed — ${lastError}`, true);
          return false;
        }
        markAutoAttempted();
        setStatus(`Persistent High Res — enabling for ${cap.pipelines.length} figure${cap.pipelines.length === 1 ? '' : 's'}…`, false);
        return enable({ automatic: true });
      }
      return false;
    })().finally(() => {
      autoPromise = null;
      emit();
    });

    emit();
    return true;
  }

  function queueSceneSync() {
    if (!enabled || !session || busy || sceneSyncPromise || sameFigureSet(session)) return false;
    if (document.hidden || document.visibilityState !== 'visible') return false;

    sceneSyncPromise = (async () => {
      const cap = await waitForStableScene(AUTO_READY_TIMEOUT);
      if (!enabled || !session || !cap) return false;
      if (sameFigureSet(session)) return true;
      return reconcile({ sceneSync: true });
    })().finally(() => {
      sceneSyncPromise = null;
      emit();
    });

    emit();
    return true;
  }

  async function reconcile(options = {}) {
    handleStaleFigure();
    if (busy || !enabled || !session) return false;
    busy = true;
    lastError = null;
    setStatus(options.sceneSync ? 'Updating High Res for scene figures…' : 'Reconciling natively…', false);

    try {
      await syncMembership(session);
      for (const p of session.pipelines) applyPolicy(session, p);
      nativeReconcile(session);
      await settle(session);
      lastVerification = verify(session);
      if (!lastVerification.ok) throw new Error(lastVerification.reason);
      setStatus(onStatusText(lastVerification), false);
      return true;
    } catch (error) {
      lastError = String(error && error.message || error);
      setStatus(`${options.sceneSync ? 'Scene sync' : 'Reconcile'} failed — ${lastError}`, true);
      return false;
    } finally {
      busy = false;
      emit();
    }
  }

  function refresh() {
    handleStaleFigure();
    queuePersistentEnable();
    queueSceneSync();
    return snapshotState();
  }

  function handleVisibilityChange() {
    if (document.hidden || document.visibilityState !== 'visible') return;
    if (persistent && !sessionSuppressed && !enabled && !busy) {
      setStatus('Persistent High Res — waiting for HeroForge renderer…', false);
      queuePersistentEnable();
    } else if (enabled && session && !busy) {
      queueSceneSync();
    }
  }

  function onChange(listener) {
    if (typeof listener !== 'function') return () => {};
    listeners.add(listener);
    try { listener(snapshotState()); } catch (_) {}
    return () => listeners.delete(listener);
  }

  async function dispose() {
    try {
      if (session && sameCharacter(session)) await disable();
    } catch (_) {}
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    listeners.clear();
    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }
    return true;
  }

  UW[GLOBAL] = {
    version: VERSION,
    build: BUILD,
    enable,
    disable,
    setPersistent,
    reconcile,
    refresh,
    onChange,
    getState: snapshotState,
    getDiagnosticState,
    verify: () => session ? verify(session) : { ok: false, reason: 'No active session.' },
    capabilities: () => {
      const cap = capabilities();
      if (!cap.ok) return cap;
      const primary = cap.pipelines.find((row) => row.primary) || cap.pipelines[0];
      return {
        ok: true,
        figureCount: cap.pipelines.length,
        atlas: primary ? atlasSize(primary.display.atlas) : null,
        sameAtlas: cap.pipelines.every((row) => row.display.atlas === row.m.resourceAtlas)
      };
    },
    dispose,
    get enabled() { return enabled; },
    get busy() { return busy; },
    get persistent() { return persistent; },
    get sessionSuppressed() { return sessionSuppressed; },
    get lastError() { return lastError; },
    get lastVerification() { return lastVerification; },
    get lastRestoreVerification() { return lastRestoreVerification; },
    get statusText() { return statusText; },
    get statusError() { return statusError; }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  emit();
  queuePersistentEnable();
})();

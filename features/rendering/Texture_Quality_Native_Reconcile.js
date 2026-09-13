// ==UserScript==
// @name         Witch Dock DEV - Texture Quality Native Reconcile
// @namespace    KnightWitch
// @version      0.2.1
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
  const VERSION = '0.2.1';
  const BUILD = '0.2.1-dev-visible-auto-enable';
  const PERSIST_KEY = 'kw.witchDock.textureQuality.persistent';
  const AUTO_READY_TIMEOUT = 30000;
  const TARGETS = ['bodyLower', 'bodyUpper', 'face'];
  const BODIES = ['bodyLower', 'bodyUpper'];
  const SCALE = 4;
  const BAKE = 2048;
  const USED = 1024; // minimum source seed; body masks stay exactly 1024px
  const OWNER = 82042049;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let session = null;
  let busy = false;
  let enabled = false;
  let lastError = null;
  let lastVerification = null;
  let statusText = 'OFF';
  let statusError = false;
  let persistent = readPersistent();
  let sessionSuppressed = false;
  let autoPromise = null;
  let autoAttemptedC = null;
  let autoAttemptedD = null;
  let autoAttemptedWithoutIdentity = false;
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

  function currentIdentity() {
    const CK = UW && UW.CK;
    const c = CK && CK.character;
    return { c: c || null, d: c && c.data ? c.data : null };
  }

  function resetAutoAttempt() {
    autoAttemptedC = null;
    autoAttemptedD = null;
    autoAttemptedWithoutIdentity = false;
  }

  function autoAlreadyAttemptedForCurrent() {
    const identity = currentIdentity();
    if (identity.c && identity.d) return identity.c === autoAttemptedC && identity.d === autoAttemptedD;
    return autoAttemptedWithoutIdentity;
  }

  function capabilities() {
    const CK = UW && UW.CK;
    const c = CK && CK.character;
    const d = c && c.data;
    const display = c && c.display;
    const m = display && display.modded;
    const parts = m && m.parts;
    const meshes = display && display.meshes;
    const R = CK && CK.Resources;

    if (!CK || !c || !d || !display || !m || !parts || !meshes) {
      return { ok: false, reason: 'HeroForge renderer is not ready.' };
    }
    if (!d.atlasScale || typeof d.change !== 'function' || typeof c.refresh !== 'function' || typeof m.buildAtlas !== 'function') {
      return { ok: false, reason: 'Required native lifecycle API is unavailable.' };
    }
    if (!R || typeof R.getResource !== 'function' || typeof R.getNow !== 'function') {
      return { ok: false, reason: 'Texture resource loader is unavailable.' };
    }
    for (const key of TARGETS) {
      if (!parts[key]) return { ok: false, reason: `${key} part is unavailable.` };
    }
    for (const key of BODIES) {
      if (!meshes[key] || typeof parts[key].getMaskPath !== 'function') {
        return { ok: false, reason: `${key} mask capability is unavailable.` };
      }
    }
    return { ok: true, CK, c, d, display, m, parts, meshes, R };
  }

  function sameCharacter(s) {
    const CK = UW && UW.CK;
    const c = CK && CK.character;
    return !!s && c === s.c && c.data === s.d;
  }

  function adoptCurrent(s) {
    if (!sameCharacter(s)) return false;
    const display = s.c.display;
    const m = display && display.modded;
    if (!display || !m || !m.parts || !display.meshes) return false;
    if (!TARGETS.every((key) => partId(m.parts[key]) === s.ids[key])) return false;
    if (display !== s.display || m !== s.m) {
      s.display = display;
      s.m = m;
      s.adoptions += 1;
    }
    return true;
  }

  function rememberScale(s) {
    const o = s.d.atlasScale;
    if (!s.scales.some((entry) => entry.o === o)) {
      s.scales.push({ o, rows: TARGETS.map((key) => own(o, key)) });
    }
  }

  function rememberPart(s, part) {
    if (!s.partsSeen.some((entry) => entry.o === part)) {
      s.partsSeen.push({ o: part, bakeSize: part.bakeSize, used: part._usedTextureSize });
    }
  }

  function rememberMesh(s, mesh) {
    if (!s.meshesSeen.some((entry) => entry.o === mesh)) {
      s.meshesSeen.push({ o: mesh, mask: own(mesh, 'masksMapOverride') });
    }
  }

  async function loadMasks(cap) {
    const hi = !!(cap.m.settings && cap.m.settings.hiRez);
    const paths = BODIES.map((key) => cap.parts[key].getMaskPath(hi, USED));
    if (!paths[0] || !paths[1]) throw new Error('Could not resolve supported 1024px body masks.');

    await Promise.all(paths.map((path) => Promise.resolve(cap.R.getResource(path, 'webp', OWNER))));
    const end = Date.now() + 5000;
    while (Date.now() < end && (!cap.R.getNow(paths[0]) || !cap.R.getNow(paths[1]))) {
      await sleep(100);
    }

    const textures = paths.map((path) => cap.R.getNow(path));
    if (textures.some((texture) => texSize(texture)[0] !== USED || texSize(texture)[1] !== USED)) {
      throw new Error('Valid 1024px body masks did not load.');
    }
    return { bodyLower: textures[0], bodyUpper: textures[1], paths };
  }

  function current(s) {
    if (!adoptCurrent(s)) throw new Error('HeroForge character/data/target parts changed; refusing stale mutation.');
    return { parts: s.m.parts, meshes: s.display.meshes };
  }

  function applyPolicy(s) {
    const currentState = current(s);
    rememberScale(s);
    for (const key of TARGETS) s.d.atlasScale[key] = SCALE;

    for (const key of TARGETS) {
      rememberPart(s, currentState.parts[key]);
      currentState.parts[key].bakeSize = BAKE;
      currentState.parts[key]._usedTextureSize = USED;
    }

    for (const key of BODIES) {
      rememberMesh(s, currentState.meshes[key]);
      currentState.meshes[key].masksMapOverride = s.masks[key];
    }
  }

  function restorePolicy(s) {
    for (const scaleSnapshot of s.scales) {
      for (const row of scaleSnapshot.rows) restore(row);
    }
    for (const partSnapshot of s.partsSeen) {
      try {
        partSnapshot.o.bakeSize = partSnapshot.bakeSize;
        partSnapshot.o._usedTextureSize = partSnapshot.used;
      } catch (_) {}
    }
    for (const meshSnapshot of s.meshesSeen) restore(meshSnapshot.mask);
  }

  function nativeReconcile(s) {
    if (!adoptCurrent(s)) throw new Error('HeroForge character/data changed before reconcile.');
    s.d.change({}, s.c.settings);
    applyPolicy(s);
    s.m.buildAtlas();
    s.c.refresh();
  }

  function nativeRestore(s) {
    if (!adoptCurrent(s)) throw new Error('HeroForge character/data changed before restore.');
    s.d.change({}, s.c.settings);
    s.c.refresh();
  }

  async function settle(s) {
    const end = Date.now() + 12000;
    let lastSignature = '';
    let stable = 0;

    while (Date.now() < end) {
      if (!sameCharacter(s)) throw new Error('HeroForge character/data changed during reconcile.');
      const display = s.c.display;
      const m = display && display.modded;
      if (!display || !m || !m.parts || !display.meshes) {
        await sleep(150);
        continue;
      }
      if (!TARGETS.every((key) => partId(m.parts[key]) === s.ids[key])) {
        throw new Error('HeroForge target parts changed during reconcile.');
      }
      if (display !== s.display || m !== s.m) {
        s.display = display;
        s.m = m;
        s.adoptions += 1;
      }

      const atlas = display.atlas;
      const resourceAtlas = m.resourceAtlas;
      const signature = JSON.stringify([
        !s.c._needsUpdating,
        !s.c._inUpdate,
        display.resourcesReady,
        display.finished,
        atlas === resourceAtlas,
        atlasSize(atlas),
        TARGETS.map((key) => allocation(atlas, key))
      ]);

      if (!s.c._needsUpdating && !s.c._inUpdate && display.resourcesReady !== false && display.finished !== false && atlas && atlas === resourceAtlas) {
        stable = signature === lastSignature ? stable + 1 : 1;
        if (stable >= 3) return;
      } else {
        stable = 0;
      }
      lastSignature = signature;
      await sleep(150);
    }

    throw new Error('Timed out waiting for native reconciliation to settle.');
  }

  function verify(s) {
    if (!adoptCurrent(s)) return { ok: false, reason: 'HeroForge character/data/target parts changed.' };
    const currentState = current(s);
    const atlas = s.display.atlas;
    const resourceAtlas = s.m.resourceAtlas;
    const out = {
      ok: true,
      version: VERSION,
      build: BUILD,
      atlas: atlasSize(atlas),
      sameAtlas: atlas === resourceAtlas,
      adoptedGenerations: s.adoptions,
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
      out.scale[key] = s.d.atlasScale[key];
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
        expected: texSize(s.masks[key]),
        actual: texSize(actual),
        overrideSame: mesh.masksMapOverride === s.masks[key]
      };
      if (
        out.masks[key].expected[0] !== USED || out.masks[key].expected[1] !== USED ||
        out.masks[key].actual[0] !== USED || out.masks[key].actual[1] !== USED ||
        !out.masks[key].overrideSame
      ) {
        return { ...out, ok: false, reason: `${key} color-bake mask is not the pinned 1024px texture.` };
      }
    }

    return out;
  }

  function snapshotState() {
    const cap = capabilities();
    return {
      version: VERSION,
      build: BUILD,
      enabled,
      busy,
      persistent,
      sessionSuppressed,
      autoPending: !!autoPromise,
      lastError,
      statusText,
      statusError,
      lastVerification,
      baseline: session && session.baseline ? session.baseline : null,
      capability: cap.ok
        ? { ok: true, atlas: atlasSize(cap.display.atlas), sameAtlas: cap.display.atlas === cap.m.resourceAtlas }
        : { ok: false, reason: cap.reason }
    };
  }

  function emit() {
    const state = snapshotState();
    for (const listener of Array.from(listeners)) {
      try { listener(state); } catch (_) {}
    }
  }

  function setStatus(text, error) {
    statusText = String(text || '');
    statusError = !!error;
    emit();
  }

  function handleStaleFigure() {
    if (!session || sameCharacter(session)) return false;
    session = null;
    enabled = false;
    lastVerification = null;
    lastError = null;
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
    setStatus('Preparing native reconcile…', false);
    let s = null;

    try {
      const cap = capabilities();
      if (!cap.ok) throw new Error(cap.reason);
      s = {
        c: cap.c,
        d: cap.d,
        display: cap.display,
        m: cap.m,
        ids: Object.fromEntries(TARGETS.map((key) => [key, partId(cap.parts[key])])),
        scales: [],
        partsSeen: [],
        meshesSeen: [],
        adoptions: 0,
        baseline: {
          atlas: atlasSize(cap.display.atlas),
          allocations: Object.fromEntries(TARGETS.map((key) => [key, allocation(cap.display.atlas, key)]))
        },
        masks: null
      };

      s.masks = await loadMasks(cap);
      if (!adoptCurrent(s)) throw new Error('HeroForge changed while masks loaded.');
      applyPolicy(s);
      session = s;
      nativeReconcile(s);
      await settle(s);
      lastVerification = verify(s);
      if (!lastVerification.ok) throw new Error(lastVerification.reason);
      enabled = true;
      setStatus(`ON — ${lastVerification.atlas.join('×')}`, false);
      return true;
    } catch (error) {
      lastError = String(error && error.message || error);
      enabled = false;
      if (persistent) {
        const identity = currentIdentity();
        if (identity.c && identity.d) {
          autoAttemptedC = identity.c;
          autoAttemptedD = identity.d;
          autoAttemptedWithoutIdentity = false;
        }
      }
      if (s && adoptCurrent(s)) {
        try {
          restorePolicy(s);
          nativeRestore(s);
          await settle(s);
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
      if (!adoptCurrent(s)) throw new Error('HeroForge character/data/target parts changed; stale snapshots not restored.');
      restorePolicy(s);
      nativeRestore(s);
      await settle(s);
      enabled = false;
      session = null;
      lastVerification = null;
      lastError = null;
      setStatus(persistent
        ? 'OFF for this session — Persistent High Res will return after reload.'
        : 'OFF — source values restored; native atlas retained.', false);
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
      const end = Date.now() + AUTO_READY_TIMEOUT;
      let cap = null;

      while (Date.now() < end) {
        if (!persistent || sessionSuppressed || enabled) return false;
        cap = capabilities();
        if (cap.ok) break;
        await sleep(150);
      }

      if (!cap || !cap.ok) {
        const identity = currentIdentity();
        if (identity.c && identity.d) {
          autoAttemptedC = identity.c;
          autoAttemptedD = identity.d;
        } else {
          autoAttemptedWithoutIdentity = true;
        }
        lastError = 'HeroForge renderer did not become ready for Persistent High Res.';
        setStatus(`Persistent High Res failed — ${lastError}`, true);
        return false;
      }

      autoAttemptedC = cap.c;
      autoAttemptedD = cap.d;
      autoAttemptedWithoutIdentity = false;
      setStatus('Persistent High Res — enabling for this figure…', false);
      return enable({ automatic: true });
    })().finally(() => {
      autoPromise = null;
      emit();
    });

    emit();
    return true;
  }

  async function reconcile() {
    handleStaleFigure();
    if (busy || !enabled || !session) return false;
    busy = true;
    lastError = null;
    setStatus('Reconciling natively…', false);

    try {
      applyPolicy(session);
      nativeReconcile(session);
      await settle(session);
      lastVerification = verify(session);
      if (!lastVerification.ok) throw new Error(lastVerification.reason);
      setStatus(`ON — ${lastVerification.atlas.join('×')}`, false);
      return true;
    } catch (error) {
      lastError = String(error && error.message || error);
      setStatus(`Reconcile failed — ${lastError}`, true);
      return false;
    } finally {
      busy = false;
      emit();
    }
  }

  function refresh() {
    handleStaleFigure();
    queuePersistentEnable();
    return snapshotState();
  }

  function handleVisibilityChange() {
    if (document.hidden || document.visibilityState !== 'visible') return;
    if (persistent && !sessionSuppressed && !enabled && !busy) {
      setStatus('Persistent High Res — waiting for HeroForge renderer…', false);
      queuePersistentEnable();
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
    verify: () => session ? verify(session) : { ok: false, reason: 'No active session.' },
    capabilities: () => {
      const cap = capabilities();
      return cap.ok
        ? { ok: true, atlas: atlasSize(cap.display.atlas), sameAtlas: cap.display.atlas === cap.m.resourceAtlas }
        : cap;
    },
    dispose,
    get enabled() { return enabled; },
    get busy() { return busy; },
    get persistent() { return persistent; },
    get sessionSuppressed() { return sessionSuppressed; },
    get lastError() { return lastError; },
    get lastVerification() { return lastVerification; },
    get statusText() { return statusText; },
    get statusError() { return statusError; }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  emit();
  queuePersistentEnable();
})();
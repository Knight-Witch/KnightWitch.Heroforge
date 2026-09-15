// ==UserScript==
// @name         Witch Dock DEV - Texture Quality Active Decal Priority
// @namespace    KnightWitch
// @version      0.1.0
// @description  Dev-only adaptive atlas policy for textures that actually carry decals.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const GLOBAL = 'KWTextureQualityActiveDecalPriority';
  if (UW[GLOBAL]) return;

  const VERSION = '0.1.0';
  const BUILD = '0.1.0-dev-active-decal-scale-policy';
  const CORE_TARGETS = new Set(['bodyLower', 'bodyUpper', 'face']);
  const SCALE = 4;
  const ATLAS_WIDTH = 8192;
  const ATLAS_HEIGHT = 4096;

  let service = null;
  let originals = null;
  let settingsState = null;
  let hardwareLimit = null;
  let reconcilePromise = null;
  let policyDirty = false;
  let disposed = false;
  let lastError = null;
  const figures = new Map();

  const own = (o, k) => ({
    o,
    k,
    had: Object.prototype.hasOwnProperty.call(o, k),
    d: Object.getOwnPropertyDescriptor(o, k),
    v: o[k],
    applied: undefined
  });

  function restoreIfOwned(snapshot) {
    if (!snapshot || !snapshot.o) return false;
    try {
      if (snapshot.applied !== undefined && snapshot.o[snapshot.k] !== snapshot.applied) return false;
      if (snapshot.had && snapshot.d) Object.defineProperty(snapshot.o, snapshot.k, snapshot.d);
      else delete snapshot.o[snapshot.k];
      return true;
    } catch (_) {
      try {
        if (snapshot.applied !== undefined && snapshot.o[snapshot.k] !== snapshot.applied) return false;
        snapshot.o[snapshot.k] = snapshot.v;
        return true;
      } catch (_) {
        return false;
      }
    }
  }

  function detectTextureLimit() {
    if (hardwareLimit !== null) return hardwareLimit;
    let canvas = null;
    let gl = null;
    try {
      canvas = document.createElement('canvas');
      gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      const value = gl ? Number(gl.getParameter(gl.MAX_TEXTURE_SIZE)) : 0;
      hardwareLimit = Number.isFinite(value) && value > 0 ? value : 0;
    } catch (_) {
      hardwareLimit = 0;
    } finally {
      try { gl?.getExtension('WEBGL_lose_context')?.loseContext(); } catch (_) {}
      canvas = null;
      gl = null;
    }
    return hardwareLimit;
  }

  function collectRows() {
    const CK = UW && UW.CK;
    const c = CK && CK.character;
    if (!CK || !c) return [];
    const rows = [];
    const seen = new Set();
    const add = (key, display) => {
      if (!display || typeof display !== 'object' || seen.has(display)) return;
      const d = display.data || (display === c.display ? c.data : null);
      const m = display.modded;
      if (!d || !d.atlasScale || !m || !m.parts) return;
      seen.add(display);
      rows.push({ key: String(key || ''), primary: display === c.display || d.primary === true, d, display, m, parts: m.parts });
    };
    add('', c.display);
    if (c.allDisplays && typeof c.allDisplays === 'object') {
      for (const [key, display] of Object.entries(c.allDisplays)) add(key, display);
    }
    return rows;
  }

  function hasAppliedDecals(value) {
    if (!value) return false;
    if (value instanceof Map || value instanceof Set) return value.size > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  }

  function activeAccessoryKeys(row) {
    const decals = row && row.d && row.d.decals;
    if (!decals || typeof decals !== 'object') return [];
    return Object.keys(decals).filter((key) => (
      row.parts[key] && !CORE_TARGETS.has(key) && hasAppliedDecals(decals[key])
    ));
  }

  function ensureSettings() {
    const CK = UW && UW.CK;
    const S = CK && CK.Settings;
    if (!S) return false;
    if (!settingsState || settingsState.o !== S) {
      if (settingsState) restoreSettings();
      settingsState = {
        o: S,
        width: own(S, 'textureWidthMax'),
        height: own(S, 'textureHeightMax')
      };
    }

    const limit = detectTextureLimit();
    const currentWidth = Number(S.textureWidthMax) || 0;
    const currentHeight = Number(S.textureHeightMax) || 0;
    // Fail closed if a reliable GPU limit cannot be read. Never raise HeroForge's
    // texture maxima on unknown hardware; keep the current native/outside setting.
    const supportedWidth = limit > 0 ? Math.min(ATLAS_WIDTH, limit) : currentWidth;
    const supportedHeight = limit > 0 ? Math.min(ATLAS_HEIGHT, limit) : currentHeight;
    const desiredWidth = Math.max(currentWidth, supportedWidth);
    const desiredHeight = Math.max(currentHeight, supportedHeight);
    let changed = false;

    if (currentWidth !== desiredWidth) {
      S.textureWidthMax = desiredWidth;
      settingsState.width.applied = Number(S.textureWidthMax);
      changed = true;
    }
    if (currentHeight !== desiredHeight) {
      S.textureHeightMax = desiredHeight;
      settingsState.height.applied = Number(S.textureHeightMax);
      changed = true;
    }
    return changed;
  }

  function restoreSettings() {
    if (!settingsState) return false;
    // Only restore maxima this module actually changed. If HeroForge or another
    // owner changed a value afterward, restoreIfOwned also leaves that value alone.
    const restoredWidth = settingsState.width.applied !== undefined ? restoreIfOwned(settingsState.width) : false;
    const restoredHeight = settingsState.height.applied !== undefined ? restoreIfOwned(settingsState.height) : false;
    settingsState = null;
    return restoredWidth || restoredHeight;
  }

  function ensureFigure(row) {
    let state = figures.get(row.d) || null;
    if (!state || state.scale !== row.d.atlasScale) {
      if (state) restoreFigure(state);
      state = { d: row.d, scale: row.d.atlasScale, snapshots: new Map(), active: new Set(), key: row.key, primary: row.primary };
      figures.set(row.d, state);
    }

    state.key = row.key;
    state.primary = row.primary;
    const desired = new Set(activeAccessoryKeys(row));
    let changed = false;

    for (const [key, snapshot] of Array.from(state.snapshots.entries())) {
      if (desired.has(key)) continue;
      changed = restoreIfOwned(snapshot) || changed;
      state.snapshots.delete(key);
    }

    for (const key of desired) {
      let snapshot = state.snapshots.get(key) || null;
      if (!snapshot) {
        snapshot = own(state.scale, key);
        state.snapshots.set(key, snapshot);
      }
      if (Number(state.scale[key]) !== SCALE) {
        state.scale[key] = SCALE;
        changed = true;
      }
      snapshot.applied = state.scale[key];
    }

    state.active = desired;
    return changed;
  }

  function restoreFigure(state) {
    if (!state) return false;
    let changed = false;
    for (const snapshot of state.snapshots.values()) changed = restoreIfOwned(snapshot) || changed;
    state.snapshots.clear();
    state.active.clear();
    return changed;
  }

  function ensurePolicy() {
    let changed = ensureSettings();
    const rows = collectRows();
    const live = new Set(rows.map((row) => row.d));
    for (const [d, state] of Array.from(figures.entries())) {
      if (live.has(d)) continue;
      changed = restoreFigure(state) || changed;
      figures.delete(d);
    }
    for (const row of rows) changed = ensureFigure(row) || changed;
    return changed;
  }

  function restorePolicy() {
    let changed = false;
    for (const state of figures.values()) changed = restoreFigure(state) || changed;
    figures.clear();
    changed = restoreSettings() || changed;
    return changed;
  }

  function queuePolicyReconcile() {
    if (disposed || reconcilePromise || !policyDirty || !service || !service.enabled || service.busy) return false;
    reconcilePromise = Promise.resolve()
      .then(async () => {
        if (disposed || !service || !service.enabled || service.busy) return false;
        const ok = await originals.reconcile.call(service);
        if (ok) policyDirty = false;
        return ok;
      })
      .catch((error) => {
        lastError = String(error && error.message || error);
        console.warn('[Witch Dock texture quality active decals] Reconcile failed:', error);
        return false;
      })
      .finally(() => { reconcilePromise = null; });
    return true;
  }

  function safeEnsurePolicy() {
    try {
      lastError = null;
      const changed = ensurePolicy();
      if (changed) policyDirty = true;
      return changed;
    } catch (error) {
      lastError = String(error && error.message || error);
      console.warn('[Witch Dock texture quality active decals] Policy update skipped:', error);
      return false;
    }
  }

  function attach() {
    if (disposed || service) return !!service;
    const candidate = UW && UW.KWTextureQualityNativeReconcile;
    if (!candidate || typeof candidate.enable !== 'function' || typeof candidate.disable !== 'function' ||
        typeof candidate.reconcile !== 'function' || typeof candidate.refresh !== 'function' ||
        typeof candidate.setPersistent !== 'function') return false;

    service = candidate;
    originals = {
      enable: candidate.enable,
      disable: candidate.disable,
      reconcile: candidate.reconcile,
      refresh: candidate.refresh,
      setPersistent: candidate.setPersistent,
      dispose: typeof candidate.dispose === 'function' ? candidate.dispose : null
    };

    candidate.enable = async (...args) => {
      safeEnsurePolicy();
      const ok = await originals.enable.apply(candidate, args);
      if (ok) policyDirty = false;
      else if (!candidate.enabled) {
        restorePolicy();
        policyDirty = false;
      }
      return ok;
    };

    candidate.reconcile = async (...args) => {
      safeEnsurePolicy();
      const ok = await originals.reconcile.apply(candidate, args);
      if (ok) policyDirty = false;
      return ok;
    };

    candidate.disable = async (...args) => {
      restorePolicy();
      policyDirty = false;
      return originals.disable.apply(candidate, args);
    };

    candidate.setPersistent = (value) => {
      if (!value && !candidate.enabled) {
        restorePolicy();
        policyDirty = false;
      }
      return originals.setPersistent.call(candidate, value);
    };

    candidate.refresh = (...args) => {
      // Do not pre-mutate a merely desired persistent session. The enable wrapper
      // applies this policy immediately before the core service performs its rebuild.
      if (candidate.enabled && !candidate.busy) safeEnsurePolicy();
      else if (!candidate.enabled && !candidate.busy && figures.size) {
        restorePolicy();
        policyDirty = false;
      }
      const state = originals.refresh.apply(candidate, args);
      if (state && state.enabled && !state.busy && policyDirty) queuePolicyReconcile();
      return state;
    };

    if (candidate.enabled && !candidate.busy) {
      safeEnsurePolicy();
      queuePolicyReconcile();
    }
    return true;
  }

  function state() {
    const CK = UW && UW.CK;
    return {
      version: VERSION,
      build: BUILD,
      attached: !!service,
      hardwareTextureLimit: detectTextureLimit(),
      requestedAtlasBudget: [ATLAS_WIDTH, ATLAS_HEIGHT],
      activeBudget: CK && CK.Settings ? [Number(CK.Settings.textureWidthMax), Number(CK.Settings.textureHeightMax)] : null,
      figures: Array.from(figures.values()).map((entry) => ({
        key: entry.key,
        primary: entry.primary,
        activeAccessorySlots: Array.from(entry.active)
      })),
      reconcilePending: !!reconcilePromise,
      policyDirty,
      lastError
    };
  }

  function dispose() {
    disposed = true;
    restorePolicy();
    policyDirty = false;
    if (service && originals) {
      if (service.enable !== originals.enable) service.enable = originals.enable;
      if (service.disable !== originals.disable) service.disable = originals.disable;
      if (service.reconcile !== originals.reconcile) service.reconcile = originals.reconcile;
      if (service.refresh !== originals.refresh) service.refresh = originals.refresh;
      if (service.setPersistent !== originals.setPersistent) service.setPersistent = originals.setPersistent;
    }
    service = null;
    originals = null;
    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }
    return true;
  }

  UW[GLOBAL] = {
    version: VERSION,
    build: BUILD,
    attach,
    refresh: () => {
      if (!service) attach();
      if (service && service.enabled && !service.busy) {
        safeEnsurePolicy();
        if (policyDirty) queuePolicyReconcile();
      }
      return state();
    },
    getState: state,
    dispose
  };

  if (!attach()) {
    const timer = window.setInterval(() => {
      if (disposed || attach()) window.clearInterval(timer);
    }, 100);
  }
})();

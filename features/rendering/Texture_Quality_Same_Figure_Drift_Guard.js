// ==UserScript==
// @name         Witch Dock DEV - Texture Quality Same-Figure Drift Guard
// @namespace    KnightWitch
// @version      0.1.0
// @description  Dev-only stable-scene repair for same-figure HeroForge texture-policy drift.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const GLOBAL = 'KWTextureQualitySameFigureDriftGuard';
  if (UW[GLOBAL]) return;

  const VERSION = '0.1.0';
  const BUILD = '0.1.0-dev-stable-same-figure-repair';
  const TARGETS = ['bodyLower', 'bodyUpper', 'face'];
  const SCALE = 4;
  const BAKE = 2048;
  const MIN_USED = 1024;
  const MIN_ALLOC = 1024;
  const READY_TIMEOUT = 30000;
  const STABLE_MS = 1200;
  const POLL_MS = 150;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let service = null;
  let originalRefresh = null;
  let refreshWrapper = null;
  let repairPromise = null;
  let disposed = false;
  let lastError = null;
  let lastResult = null;
  let lastReason = null;
  let repairs = 0;

  const partId = (part) => part ? [part.id ?? '', part.baseName ?? '', part.name ?? ''].join('|') : null;
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

  function collectRows() {
    const CK = UW && UW.CK;
    const c = CK && CK.character;
    if (!c) return [];
    const rows = [];
    const seen = new Set();
    const add = (key, display) => {
      if (!display || typeof display !== 'object' || seen.has(display)) return;
      const d = display.data || (display === c.display ? c.data : null);
      const m = display.modded;
      if (!d || !d.atlasScale || !m || !m.parts) return;
      seen.add(display);
      rows.push({
        key: String(key || ''),
        primary: display === c.display || d.primary === true,
        d,
        display,
        m,
        parts: m.parts
      });
    };
    add('', c.display);
    if (c.allDisplays && typeof c.allDisplays === 'object') {
      for (const [key, display] of Object.entries(c.allDisplays)) add(key, display);
    }
    return rows;
  }

  function serviceState() {
    try {
      return service && typeof service.getState === 'function' ? service.getState() : null;
    } catch (_) {
      return null;
    }
  }

  function expectedFigureCount(state) {
    return Number(state && state.lastVerification && state.lastVerification.figureCount) || 0;
  }

  function inspectDrift() {
    const CK = UW && UW.CK;
    const c = CK && CK.character;
    const state = serviceState();
    if (!service || !service.enabled || service.busy || !c || !c.data || !state || state.sceneSyncPending) {
      return { eligible: false, drift: false, reason: null, rows: [] };
    }

    const rows = collectRows();
    const expected = expectedFigureCount(state);
    if (!expected || rows.length !== expected) {
      return { eligible: false, drift: false, reason: null, rows };
    }

    const failures = [];
    for (const row of rows) {
      for (const key of TARGETS) {
        const part = row.parts[key];
        if (!part) return { eligible: false, drift: false, reason: null, rows };
        const packed = allocation(row.display.atlas, key);
        const used = Number(part._usedTextureSize);
        if (Number(row.d.atlasScale[key]) !== SCALE) failures.push(`${row.key || 'primary'}:${key}:scale`);
        if (Number(part.bakeSize) !== BAKE) failures.push(`${row.key || 'primary'}:${key}:bake`);
        if (!Number.isFinite(used) || used < MIN_USED) failures.push(`${row.key || 'primary'}:${key}:source`);
        if (!packed || packed[0] < MIN_ALLOC || packed[1] < MIN_ALLOC) failures.push(`${row.key || 'primary'}:${key}:alloc`);
      }
    }

    return {
      eligible: true,
      drift: failures.length > 0,
      reason: failures.length ? failures.join(',') : null,
      rows
    };
  }

  function readySnapshot() {
    const CK = UW && UW.CK;
    const c = CK && CK.character;
    const state = serviceState();
    if (!service || !service.enabled || service.busy || !c || !c.data || !state || state.sceneSyncPending ||
        c._needsUpdating || c._inUpdate) return null;

    const rows = collectRows();
    const expected = expectedFigureCount(state);
    if (!expected || rows.length !== expected) return null;
    if (!rows.every((row) => (
      row.display.resourcesReady !== false &&
      row.display.finished !== false &&
      row.display.atlas &&
      row.display.atlas === row.m.resourceAtlas &&
      TARGETS.every((key) => row.parts[key])
    ))) return null;

    return {
      c,
      d: c.data,
      signature: JSON.stringify(rows.map((row) => [
        row.key,
        row.primary,
        atlasSize(row.display.atlas),
        Object.keys(row.parts).sort().map((key) => [key, partId(row.parts[key])]),
        TARGETS.map((key) => allocation(row.display.atlas, key))
      ])),
      rows: rows.map((row) => ({
        d: row.d,
        display: row.display,
        m: row.m,
        atlas: row.display.atlas
      }))
    };
  }

  function sameReadySnapshot(a, b) {
    return !!(
      a && b &&
      a.c === b.c &&
      a.d === b.d &&
      a.signature === b.signature &&
      a.rows.length === b.rows.length &&
      b.rows.every((row, index) => (
        row.d === a.rows[index].d &&
        row.display === a.rows[index].display &&
        row.m === a.rows[index].m &&
        row.atlas === a.rows[index].atlas
      ))
    );
  }

  async function waitForStableScene(timeout = READY_TIMEOUT) {
    const end = Date.now() + timeout;
    let previous = null;
    let stableSince = 0;

    while (!disposed && service && service.enabled && Date.now() < end) {
      const current = readySnapshot();
      if (!current) {
        previous = null;
        stableSince = 0;
        await sleep(POLL_MS);
        continue;
      }

      if (!sameReadySnapshot(previous, current)) {
        previous = current;
        stableSince = Date.now();
      } else if (Date.now() - stableSince >= STABLE_MS) {
        return current;
      }
      await sleep(POLL_MS);
    }
    return null;
  }

  function queueRepair(reason) {
    if (disposed || repairPromise || !service || !service.enabled || service.busy) return false;
    const initial = inspectDrift();
    if (!initial.eligible || !initial.drift) return false;
    lastReason = reason || initial.reason;

    repairPromise = (async () => {
      const stable = await waitForStableScene();
      if (!stable || disposed || !service || !service.enabled || service.busy) return false;

      const current = inspectDrift();
      if (!current.eligible || !current.drift) {
        lastResult = true;
        lastError = null;
        return true;
      }

      lastReason = current.reason || lastReason;
      repairs += 1;
      const ok = await service.reconcile({ sceneSync: true });
      lastResult = !!ok;
      lastError = ok ? null : 'Same-figure drift reconcile returned false.';
      return !!ok;
    })()
      .catch((error) => {
        lastResult = false;
        lastError = String(error && error.message || error);
        console.warn('[Witch Dock texture quality drift guard] Repair failed:', error);
        return false;
      })
      .finally(() => {
        repairPromise = null;
      });
    return true;
  }

  function attach() {
    if (disposed || service) return !!service;
    const candidate = UW && UW.KWTextureQualityNativeReconcile;
    if (!candidate || typeof candidate.refresh !== 'function' || typeof candidate.reconcile !== 'function' ||
        typeof candidate.getState !== 'function') return false;

    service = candidate;
    originalRefresh = candidate.refresh;
    refreshWrapper = (...args) => {
      const state = originalRefresh.apply(candidate, args);
      if (candidate.enabled && !candidate.busy) {
        const drift = inspectDrift();
        if (drift.eligible && drift.drift) queueRepair(drift.reason);
      }
      return state;
    };
    candidate.refresh = refreshWrapper;

    if (candidate.enabled && !candidate.busy) {
      const drift = inspectDrift();
      if (drift.eligible && drift.drift) queueRepair(drift.reason);
    }
    return true;
  }

  function state() {
    const drift = inspectDrift();
    return {
      version: VERSION,
      build: BUILD,
      attached: !!service,
      pending: !!repairPromise,
      driftEligible: drift.eligible,
      drift: drift.drift,
      driftReason: drift.reason,
      repairs,
      lastReason,
      lastResult,
      lastError
    };
  }

  function dispose() {
    if (service && refreshWrapper && service.refresh !== refreshWrapper) {
      lastError = 'Cannot dispose drift guard while a downstream refresh wrapper is attached.';
      return false;
    }
    disposed = true;
    if (service && refreshWrapper && service.refresh === refreshWrapper) service.refresh = originalRefresh;
    service = null;
    originalRefresh = null;
    refreshWrapper = null;
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
        const drift = inspectDrift();
        if (drift.eligible && drift.drift) queueRepair(drift.reason);
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

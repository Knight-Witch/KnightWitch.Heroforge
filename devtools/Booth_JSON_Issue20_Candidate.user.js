// ==UserScript==
// @name         WITCH DOCK DEV — Booth JSON #20 Candidate
// @namespace    KnightWitch
// @version      0.1.0
// @description  Temporary issue #20 live-validation harness for Booth JSON state round trips.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/wd/20-booth-json-repair/devtools/Booth_JSON_Issue20_Candidate.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/wd/20-booth-json-repair/devtools/Booth_JSON_Issue20_Candidate.user.js
// @grant        unsafeWindow
// ==/UserScript==

(() => {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const API_KEY = 'KWBoothJsonIssue20Candidate';
  const FORMAT = 'witch-dock.photo-booth';
  const VERSION = 1;
  let memory = null;

  function copy(value) {
    try {
      const CK = UW.CK;
      if (CK?.Helpers?.deepCopy) return CK.Helpers.deepCopy(value);
    } catch {}
    return JSON.parse(JSON.stringify(value));
  }

  function objectRecord(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value);
  }

  function maker() {
    const BT = UW.BT;
    return BT && (BT.liveEngine || BT.maker) || null;
  }

  function looksLikeConfig(value) {
    return objectRecord(value) && ['camera','filters','selected','lighting','effects','aspect','model']
      .some(key => Object.prototype.hasOwnProperty.call(value, key));
  }

  function legacyEffects(value) {
    if (!objectRecord(value)) return false;
    if (value.filters || value.selected || value.camera || value.lighting || value.aspect !== undefined) return false;
    return !!(value.effects && (value.colorCurve || value.environmentGen || value.id !== undefined || value.name !== undefined || value.version !== undefined));
  }

  function decode(value) {
    if (typeof value === 'string') value = JSON.parse(value);
    if (!objectRecord(value)) throw new Error('not a Booth settings object');
    if (value.format === FORMAT) {
      if (Number(value.version) > VERSION) throw new Error('newer unsupported Booth file');
      if (!objectRecord(value.booth) || !looksLikeConfig(value.booth)) throw new Error('missing Booth payload');
      return { kind: 'witch-dock', mode: value.mode || null, config: copy(value.booth) };
    }
    if (legacyEffects(value)) return { kind: 'legacy-effects', mode: null, config: { effects: copy(value) } };
    if (looksLikeConfig(value)) return { kind: 'raw-config', mode: null, config: copy(value) };
    throw new Error('unrecognized Booth file');
  }

  function capture() {
    const BT = UW.BT;
    const m = maker();
    if (!BT || !m || typeof m.savePortrait !== 'function') throw new Error('Booth runtime unavailable');
    try { m.cameras?.saveCamera?.(); } catch {}
    try { m.effectsPersistence?.save?.(); } catch {}
    const saved = m.savePortrait();
    if (!looksLikeConfig(saved)) throw new Error('Hero Forge did not return a Booth config');
    return { format: FORMAT, version: VERSION, mode: BT.currentMode || null, savedAt: new Date().toISOString(), booth: copy(saved) };
  }

  function apply(value) {
    const m = maker();
    if (!m || typeof m.loadPortrait !== 'function') throw new Error('Booth runtime unavailable');
    const decoded = decode(value);
    const currentMode = UW.BT?.currentMode ? String(UW.BT.currentMode) : null;
    if (decoded.mode && currentMode && String(decoded.mode) !== currentMode) {
      throw new Error(`mode mismatch: ${decoded.mode} != ${currentMode}`);
    }
    const config = decoded.config;
    m.loadPortrait(copy(config), { commit: true, apply: true });
    if (config.camera && m.cameras?.loadCameraSave) m.cameras.loadCameraSave(copy(config.camera));
    if (Object.prototype.hasOwnProperty.call(config, 'effects') && m.loadEffectsFromConfig) m.loadEffectsFromConfig();
    try { UW.CK?.GameLoop?.requestRenderRefresh?.(); } catch {}
    return { ok: true, kind: decoded.kind, mode: decoded.mode || currentMode, legacyEffectsOnly: decoded.kind === 'legacy-effects' };
  }

  const api = Object.freeze({
    version: '0.1.0',
    capture,
    apply,
    captureToMemory() {
      memory = capture();
      return {
        ok: true,
        mode: memory.mode,
        keys: Object.keys(memory.booth || {}),
        hasCamera: !!memory.booth?.camera,
        hasLighting: !!memory.booth?.lighting,
        hasEffects: !!memory.booth?.effects
      };
    },
    applyMemory() {
      if (!memory) throw new Error('no captured memory');
      return apply(memory);
    },
    memorySummary() {
      return memory ? {
        mode: memory.mode,
        keys: Object.keys(memory.booth || {}),
        hasCamera: !!memory.booth?.camera,
        hasLighting: !!memory.booth?.lighting,
        hasEffects: !!memory.booth?.effects
      } : null;
    },
    clearMemory() { memory = null; return true; },
    dispose() {
      memory = null;
      try { delete UW[API_KEY]; } catch {}
      return true;
    }
  });

  Object.defineProperty(UW, API_KEY, { configurable: true, enumerable: false, value: api });
  console.log('[Witch Dock #20] Booth JSON candidate harness ready');
})();

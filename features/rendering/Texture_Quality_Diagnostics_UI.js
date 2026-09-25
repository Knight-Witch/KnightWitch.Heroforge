// ==UserScript==
// @name         Witch Dock DEV - High Res Diagnostic Capture UI
// @namespace    KnightWitch
// @version      0.1.0
// @description  Dev-only Witch Dock controls for High Res diagnostic capture.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const GLOBAL = 'KWTextureQualityDiagnosticsUI';
  if (UW[GLOBAL]) return;

  const TOOL_ID = 'texture-quality-diagnostics-ui';
  const VERSION = '0.1.0';
  const BUILD = '0.1.0-hr-capture-v1-ui';
  const STYLE_ID = 'kwTextureQualityDiagnosticsUIStyle';

  let registerTimer = null;
  let refreshTimer = null;
  let unsubscribe = null;
  let root = null;
  let statusEl = null;
  let summaryEl = null;
  let captureBtn = null;
  let compareBtn = null;
  let downloadBtn = null;

  function service() {
    return UW && UW.KWTextureQualityDiagnostics || null;
  }

  function highRes() {
    return UW && UW.KWTextureQualityNativeReconcile || null;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.kwHRDiagRoot{display:flex;flex-direction:column;gap:8px;padding:2px 0;color-scheme:dark;}',
      '.kwHRDiagIntro{font-size:10px;line-height:1.4;color:rgba(255,255,255,.68);}',
      '.kwHRDiagActions{display:flex;flex-direction:column;gap:6px;}',
      '.kwHRDiagActions button{border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:7px 8px;background:rgba(255,255,255,.06);color:inherit;font-size:11px;font-weight:800;cursor:pointer;}',
      '.kwHRDiagActions button:hover:not(:disabled){background:rgba(170,85,255,.24);border-color:rgba(190,130,255,.72);}',
      '.kwHRDiagActions button:disabled{opacity:.42;cursor:default;}',
      '.kwHRDiagStatus{font-size:10px;line-height:1.4;font-weight:700;overflow-wrap:anywhere;}',
      '.kwHRDiagStatus[data-error="1"]{color:#ff8a8a;}',
      '.kwHRDiagSummary{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:9px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere;padding:7px;border:1px solid rgba(255,255,255,.10);border-radius:6px;background:rgba(0,0,0,.14);}',
      '.kwHRDiagNote{font-size:9px;line-height:1.35;color:rgba(220,195,255,.88);}'
    ].join('');
    document.head.appendChild(style);
  }

  function formatSummary(state) {
    if (!state || !state.latestSummary) return 'No diagnostic captured yet.';
    const s = state.latestSummary;
    const lines = [];
    if (state.latestKind === 'comparison') {
      lines.push('Comparison: ' + (s.comparisonId || '—'));
      lines.push('Result: ' + (s.ok ? 'complete' : 'incomplete'));
      lines.push('Figures: ' + (s.figureCount == null ? '—' : s.figureCount));
      lines.push('Changed paths: ' + (s.changedPathCount == null ? '—' : s.changedPathCount) + (s.diffLimitReached ? ' (limit reached)' : ''));
      lines.push('Paints hash: ' + (s.nativePaintsHash || '—') + ' → ' + (s.highResPaintsHash || '—'));
      lines.push('paintByIntent: ' + (s.nativePaintByIntentHash || '—') + ' → ' + (s.highResPaintByIntentHash || '—'));
      lines.push('Original state restored: ' + (s.restorationOk === true ? 'yes' : s.restorationOk === false ? 'NO' : '—'));
      if (s.error) lines.push('Error: ' + s.error);
    } else {
      lines.push('Capture: ' + (s.captureId || '—'));
      lines.push('Figures: ' + (s.figureCount == null ? '—' : s.figureCount));
      lines.push('High Res: ' + (s.highResEnabled ? 'ON' : 'OFF') + (s.highResBusy ? ' / busy' : ''));
      lines.push('Atlas: ' + (Array.isArray(s.atlas) ? s.atlas.join('×') : '—') + ' · coherent ' + (s.sameAtlas === true ? 'yes' : s.sameAtlas === false ? 'no' : '—'));
      lines.push('Paints hash: ' + (s.primaryPaintsHash || '—'));
      lines.push('paintByIntent: ' + (s.primaryPaintByIntentHash || '—'));
      lines.push('Referenced resources: ' + (s.referencedResourceCount == null ? '—' : s.referencedResourceCount));
      if (Array.isArray(s.warningCodes) && s.warningCodes.length) lines.push('Warnings: ' + s.warningCodes.join(', '));
    }
    return lines.join('\n');
  }

  function refresh() {
    if (!root) return false;
    const svc = service();
    const hr = highRes();
    if (!svc) {
      statusEl.textContent = 'High Res diagnostic service unavailable.';
      statusEl.dataset.error = '1';
      captureBtn.disabled = true;
      compareBtn.disabled = true;
      downloadBtn.disabled = true;
      return false;
    }

    let state = null;
    try { state = svc.getState(); } catch (error) { state = { lastError: String(error), operationBusy: false }; }
    const hrBusy = !!(hr && hr.busy);
    captureBtn.disabled = !!state.operationBusy;
    compareBtn.disabled = !!state.operationBusy || hrBusy;
    downloadBtn.disabled = !!state.operationBusy || (!state.lastCaptureId && !state.lastComparisonId);

    statusEl.dataset.error = state.lastError ? '1' : '0';
    statusEl.textContent = state.operationBusy
      ? 'Capturing diagnostic…'
      : state.lastError
        ? 'Diagnostic warning — ' + state.lastError
        : state.lastComparisonId
          ? 'Comparison captured.'
          : state.lastCaptureId
            ? 'Snapshot captured.'
            : 'Ready. Current-state capture is read-only.';

    summaryEl.textContent = formatSummary(state);
    return true;
  }

  async function runAction(button, fn) {
    if (!button || button.disabled) return;
    const old = button.textContent;
    button.disabled = true;
    button.textContent = 'Working…';
    try { await fn(); }
    catch (error) {
      if (statusEl) {
        statusEl.textContent = 'Diagnostic action failed — ' + String(error && error.message || error);
        statusEl.dataset.error = '1';
      }
    } finally {
      button.textContent = old;
      refresh();
    }
  }

  function buildUI(container, api) {
    ensureStyles();
    const section = api.ui.createSection({ id: 'texture-quality-diagnostics', title: 'High Res Diagnostics — DEV' });
    container.appendChild(section.root);

    root = document.createElement('div');
    root.className = 'kwHRDiagRoot';

    const intro = document.createElement('div');
    intro.className = 'kwHRDiagIntro';
    intro.textContent = 'Captures structured High Res / HeroForge state without guessing root cause. The comparison button uses the normal Texture Quality lifecycle and then restores the original ON/OFF state.';

    const actions = document.createElement('div');
    actions.className = 'kwHRDiagActions';

    captureBtn = document.createElement('button');
    captureBtn.type = 'button';
    captureBtn.textContent = 'Capture Current State';

    compareBtn = document.createElement('button');
    compareBtn.type = 'button';
    compareBtn.textContent = 'Run Native OFF → High Res ON Comparison';

    downloadBtn = document.createElement('button');
    downloadBtn.type = 'button';
    downloadBtn.textContent = 'Download Last Diagnostic';

    actions.append(captureBtn, compareBtn, downloadBtn);

    statusEl = document.createElement('div');
    statusEl.className = 'kwHRDiagStatus';
    statusEl.dataset.error = '0';

    summaryEl = document.createElement('div');
    summaryEl.className = 'kwHRDiagSummary';

    const note = document.createElement('div');
    note.className = 'kwHRDiagNote';
    note.textContent = 'DEV v1: no raw texture pixels, auth/session data, full character JSON, or global network history are captured. Coverage records those omissions explicitly.';

    root.append(intro, actions, statusEl, summaryEl, note);
    section.body.appendChild(root);

    captureBtn.addEventListener('click', () => runAction(captureBtn, async () => {
      const svc = service();
      if (svc) await svc.captureCurrent();
    }));

    compareBtn.addEventListener('click', () => runAction(compareBtn, async () => {
      const svc = service();
      if (svc) await svc.compareNativeOffToHighRes();
    }));

    downloadBtn.addEventListener('click', () => {
      const svc = service();
      if (!svc) return;
      const result = svc.downloadLatest();
      if (!result || !result.ok) {
        statusEl.textContent = 'Download failed — ' + (result && result.error || 'unknown error');
        statusEl.dataset.error = '1';
      } else {
        statusEl.textContent = 'Downloaded ' + result.filename;
        statusEl.dataset.error = '0';
      }
      refresh();
    });

    const svc = service();
    if (svc && typeof svc.onChange === 'function' && !unsubscribe) unsubscribe = svc.onChange(refresh);
    if (!refreshTimer) refreshTimer = window.setInterval(refresh, 500);
    refresh();
  }

  function registerTool() {
    const WD = UW && UW.WitchDock;
    const svc = service();
    if (!WD || typeof WD.registerTool !== 'function' || !svc) return false;

    const def = {
      id: TOOL_ID,
      title: 'High Res Diagnostics',
      tab: 'Utilities',
      version: VERSION,
      build: BUILD,
      render: (container, api) => buildUI(container, api)
    };

    const dev = UW && UW.KWDeveloperMode;
    if (dev && typeof dev.registerToolMeta === 'function') {
      try { dev.registerToolMeta(def); } catch (_) {}
    }

    WD.registerTool(def);
    return true;
  }

  function initialize() {
    if (registerTool()) return true;
    if (!registerTimer) {
      registerTimer = window.setInterval(() => {
        if (registerTool()) {
          window.clearInterval(registerTimer);
          registerTimer = null;
        }
      }, 200);
    }
    return true;
  }

  function dispose() {
    if (registerTimer) window.clearInterval(registerTimer);
    registerTimer = null;
    if (refreshTimer) window.clearInterval(refreshTimer);
    refreshTimer = null;
    if (unsubscribe) {
      try { unsubscribe(); } catch (_) {}
      unsubscribe = null;
    }
    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }
    return true;
  }

  UW[GLOBAL] = {
    version: VERSION,
    build: BUILD,
    initialize,
    dispose
  };

  initialize();
})();

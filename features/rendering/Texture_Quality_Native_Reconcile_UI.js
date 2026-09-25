// ==UserScript==
// @name         Witch Dock DEV - Texture Quality Native Reconcile UI
// @namespace    KnightWitch
// @version      0.3.0
// @description  Witch Dock controls for the Dev native texture-quality reconcile service.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const GLOBAL = 'KWTextureQualityNativeReconcileUI';
  if (UW[GLOBAL]) return;
  const TOOL_ID = 'texture-quality-native-reconcile';
  const VERSION = '0.3.0';
  const BUILD = '0.3.0-ui-consistency';
  const STYLE_ID = 'kwTextureQualityNativeReconcileUIStyle';

  let registerTimer = null;
  let refreshTimer = null;
  let unsubscribe = null;
  let root = null;
  let statusEl = null;
  let capabilityEl = null;
  let detailEl = null;
  let enableButton = null;
  let persistentCheckbox = null;
  let reconcileButton = null;

  function getService() {
    return UW && UW.KWTextureQualityNativeReconcile ? UW.KWTextureQualityNativeReconcile : null;
  }

  function getDeveloperMode() {
    return UW && UW.KWDeveloperMode ? UW.KWDeveloperMode : null;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .kwTextureQualityRoot{display:flex;flex-direction:column;gap:8px;padding:2px 0;color-scheme:dark;}
      .kwTextureQualityIntro{font-size:11px;line-height:1.4;opacity:.82;}
      .kwTextureQualityActions{display:flex;flex-direction:column;gap:7px;}
      .kwTextureQualityActions button,.kwTextureQualityAdvanced button{border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:0 10px;min-height:30px;background:rgba(255,255,255,.06);color:inherit;font-size:12px;font-weight:600;cursor:pointer;}
      .kwTextureQualityActions button:hover:not(:disabled),.kwTextureQualityAdvanced button:hover:not(:disabled){background:rgba(170,85,255,.24);border-color:rgba(190,130,255,.72);}
      .kwTextureQualityActions button:disabled,.kwTextureQualityAdvanced button:disabled{opacity:.42;cursor:default;}
      .kwTextureQualityPersistentRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px;border:1px solid rgba(255,255,255,.10);border-radius:6px;background:rgba(255,255,255,.035);}
      .kwTextureQualityPersistentMain{min-width:0;display:flex;flex-direction:column;gap:4px;}
      .kwTextureQualityPersistentName{font-size:12px;font-weight:600;color:rgba(255,255,255,.92);}
      .kwTextureQualityPersistentDesc{font-size:11px;line-height:1.3;color:rgba(255,255,255,.68);}
      .kwTextureQualityPersistentToggle{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:600;color:rgba(255,255,255,.82);}
      .kwTextureQualityPersistentToggle input{transform:translateY(1px);}
      .kwTextureQualityStatus{min-height:16px;font-size:11px;line-height:1.35;font-weight:700;overflow-wrap:anywhere;}
      .kwTextureQualityStatus[data-error="1"]{color:#ff8a8a;}
      .kwTextureQualityCapability{font-size:10px;line-height:1.35;opacity:.68;overflow-wrap:anywhere;}
      .kwTextureQualityDetails{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere;padding:7px;border:1px solid rgba(255,255,255,.10);border-radius:6px;background:rgba(0,0,0,.14);}
      .kwTextureQualityDevNote{font-size:9px;line-height:1.35;color:rgba(220,195,255,.88);border-top:1px dashed rgba(190,130,255,.22);padding-top:6px;}
      .kwTextureQualityDevNote[hidden]{display:none!important;}
      .kwTextureQualityAdvanced{border-top:1px solid rgba(255,255,255,.10);padding-top:7px;}
      .kwTextureQualityAdvanced summary{cursor:pointer;font-size:11px;font-weight:800;color:rgba(255,255,255,.78);user-select:none;}
      .kwTextureQualityAdvancedBody{display:flex;flex-direction:column;gap:7px;padding-top:7px;}
      .kwTextureQualityAdvancedDesc{font-size:10px;line-height:1.4;color:rgba(255,255,255,.62);}
    `;
    document.head.appendChild(style);
  }

  function pair(value) {
    return Array.isArray(value) && value.length >= 2 ? `${value[0]}×${value[1]}` : '—';
  }

  function formatVerification(v) {
    if (!v) return 'No active verification yet.';
    const lines = [];
    lines.push(`Atlas: ${pair(v.atlas)} · coherent: ${v.sameAtlas === true ? 'yes' : 'no'}`);
    lines.push(`Generation adoptions: ${Number(v.adoptedGenerations) || 0}`);
    for (const key of ['bodyLower', 'bodyUpper', 'face']) {
      const allocation = v.allocations && v.allocations[key];
      const used = v.usedTextureSize && v.usedTextureSize[key];
      const promoted = v.nativePromoted && v.nativePromoted[key];
      lines.push(`${key}: ${pair(allocation)} · used ${used ?? '—'}${promoted ? ' · native 2048 promotion' : ''}`);
    }
    for (const key of ['bodyLower', 'bodyUpper']) {
      const mask = v.masks && v.masks[key];
      if (!mask) continue;
      lines.push(`${key} mask: ${pair(mask.actual)} · pinned ${mask.overrideSame ? 'yes' : 'no'}`);
    }
    return lines.join('\n');
  }

  function refreshDeveloperVisibility() {
    if (!root) return;
    const note = root.querySelector('.kwTextureQualityDevNote');
    const dev = getDeveloperMode();
    if (note) note.hidden = !(dev && dev.enabled);
  }

  function refresh() {
    const service = getService();
    if (!root) return false;
    if (!service) {
      if (statusEl) {
        statusEl.textContent = 'Texture-quality service unavailable.';
        statusEl.dataset.error = '1';
      }
      if (enableButton) enableButton.disabled = true;
      if (persistentCheckbox) persistentCheckbox.disabled = true;
      if (reconcileButton) reconcileButton.disabled = true;
      return false;
    }

    let state;
    try { state = service.refresh(); }
    catch (error) {
      state = { enabled: false, busy: false, statusText: String(error), statusError: true, capability: { ok: false, reason: String(error) } };
    }

    if (statusEl) {
      statusEl.textContent = state.statusText || (state.enabled ? 'ON' : 'OFF');
      statusEl.dataset.error = state.statusError ? '1' : '0';
    }
    if (capabilityEl) {
      capabilityEl.textContent = state.capability && state.capability.ok
        ? `HeroForge capability ready · native atlas ${pair(state.capability.atlas)}`
        : (state.capability && state.capability.reason) || 'HeroForge capability unavailable.';
    }
    if (detailEl) detailEl.textContent = formatVerification(state.lastVerification);

    if (persistentCheckbox) {
      persistentCheckbox.disabled = false;
      persistentCheckbox.checked = !!state.persistent;
    }
    if (enableButton) {
      const persistentAutoOwnsEnable = !!state.persistent && !state.enabled && !state.sessionSuppressed && !state.lastError;
      enableButton.disabled = !!state.busy || !(state.capability && state.capability.ok) || persistentAutoOwnsEnable;
      enableButton.textContent = state.busy ? 'Working…' : state.enabled ? 'Disable High Res' : 'Enable High Res';
    }
    if (reconcileButton) reconcileButton.disabled = !!state.busy || !state.enabled;
    refreshDeveloperVisibility();
    return true;
  }

  function buildUI(container, api) {
    ensureStyles();
    const section = api.ui.createSection({ id: 'texture-quality-native-reconcile', title: 'Texture Quality' });
    container.appendChild(section.root);

    root = document.createElement('div');
    root.className = 'kwTextureQualityRoot';
    root.innerHTML = `
      <div class="kwTextureQualityIntro">High-resolution body/head textures using HeroForge's own native atlas rebuild. No persistent custom atlas ownership.</div>
      <div class="kwTextureQualityActions">
        <button type="button" class="kwTextureQualityEnable">Enable High Res</button>
        <div class="kwTextureQualityPersistentRow">
          <div class="kwTextureQualityPersistentMain">
            <div class="kwTextureQualityPersistentName">Persistent High Res</div>
            <div class="kwTextureQualityPersistentDesc">Automatically enables High Res after reloads and figure changes. Disable remains a temporary override until you enable it again or reload the page.</div>
          </div>
          <label class="kwTextureQualityPersistentToggle"><input type="checkbox" class="kwTextureQualityPersistent"><span>Enabled</span></label>
        </div>
      </div>
      <div class="kwTextureQualityStatus" data-error="0">OFF</div>
      <div class="kwTextureQualityCapability"></div>
      <div class="kwTextureQualityDetails">No active verification yet.</div>
      <div class="kwTextureQualityDevNote" hidden>DEV: 1024 source seed, native promotion up to 2048, exact 1024 body-mask pinning.</div>
      <details class="kwTextureQualityAdvanced">
        <summary>Advanced</summary>
        <div class="kwTextureQualityAdvancedBody">
          <div class="kwTextureQualityAdvancedDesc">Reconcile Now re-applies the current High Res source policy, asks HeroForge to rebuild the active figure natively, then verifies the resulting atlas and masks. Usually unnecessary unless textures appear to have reverted or become inconsistent.</div>
          <button type="button" class="kwTextureQualityReconcile">Reconcile Now</button>
        </div>
      </details>`;

    section.body.appendChild(root);
    enableButton = root.querySelector('.kwTextureQualityEnable');
    persistentCheckbox = root.querySelector('.kwTextureQualityPersistent');
    reconcileButton = root.querySelector('.kwTextureQualityReconcile');
    statusEl = root.querySelector('.kwTextureQualityStatus');
    capabilityEl = root.querySelector('.kwTextureQualityCapability');
    detailEl = root.querySelector('.kwTextureQualityDetails');

    enableButton.addEventListener('click', async () => {
      const service = getService();
      if (!service || service.busy) return;
      if (service.enabled) await service.disable();
      else await service.enable();
      refresh();
    });

    persistentCheckbox.addEventListener('change', () => {
      const service = getService();
      if (!service || typeof service.setPersistent !== 'function') return;
      service.setPersistent(persistentCheckbox.checked);
      refresh();
    });

    reconcileButton.addEventListener('click', async () => {
      const service = getService();
      if (!service || service.busy || !service.enabled) return;
      await service.reconcile();
      refresh();
    });

    const service = getService();
    if (service && typeof service.onChange === 'function' && !unsubscribe) {
      unsubscribe = service.onChange(() => refresh());
    }
    if (!refreshTimer) refreshTimer = window.setInterval(refresh, 250);
    refresh();
  }

  function registerTool() {
    const WD = UW && UW.WitchDock;
    const service = getService();
    if (!WD || typeof WD.registerTool !== 'function' || !service) return false;

    const def = {
      id: TOOL_ID,
      title: 'Texture Quality',
      tab: 'Utilities',
      version: VERSION,
      build: BUILD,
      render: (container, api) => buildUI(container, api)
    };

    const dev = getDeveloperMode();
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
    document.getElementById(STYLE_ID)?.remove();
    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }
    return true;
  }

  UW[GLOBAL] = {
    version: VERSION,
    build: BUILD,
    initialize,
    refresh,
    dispose
  };

  initialize();
})();

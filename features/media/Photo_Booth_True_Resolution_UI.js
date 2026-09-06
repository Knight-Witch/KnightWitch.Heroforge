// ==UserScript==
// @name         Witch Dock DEV - High Res Image Capture UI
// @namespace    KnightWitch
// @version      0.2.0
// @description  Dev UI adapter for Witch Dock's validated 4K/8K Photo Booth capture service, with Developer Mode diagnostics.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

/*
 * Witch Dock Dev UI adapter for media.screenshot-resolution.
 * Presentation-only host for the already-validated true-resolution capture service.
 * Capture math/provider ownership remains in Photo_Booth_True_Resolution.js.
 */
(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const GLOBAL = 'KWPhotoBoothTrueResolutionUI';
  const TOOL_ID = 'photo-booth-true-resolution';
  const BUILD = '0.2.0-dev-developer-mode';
  const STYLE_ID = 'kwPBTrueResolutionCompactUIStyle';

  let registerTimer = null;
  let refreshTimer = null;
  let statusEl = null;
  let button4K = null;
  let button8K = null;
  let developerRoot = null;
  let developerEnabled = null;
  let developerMeta = null;
  let activity = null;

  function getService() {
    return UW && UW.KWPhotoBoothTrueResolution ? UW.KWPhotoBoothTrueResolution : null;
  }

  function getReadiness() {
    return UW && UW.KWPhotoBoothTrueResolutionReadiness
      ? UW.KWPhotoBoothTrueResolutionReadiness
      : null;
  }

  function getDeveloperMode() {
    return UW && UW.KWDeveloperMode ? UW.KWDeveloperMode : null;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .kwPBResCompactRoot{display:flex;flex-direction:column;gap:8px;padding:2px 0;}
      .kwPBResCompactCapture{display:grid;grid-template-columns:auto 1fr 1fr;gap:8px;align-items:center;}
      .kwPBResCompactLabel{font-size:12px;font-weight:700;opacity:.88;white-space:nowrap;}
      .kwPBResCompactRoot .kwPBResBtn{border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:7px 10px;background:rgba(255,255,255,.06);color:inherit;font-size:12px;font-weight:800;cursor:pointer;transition:background 120ms ease,border-color 120ms ease;}
      .kwPBResCompactRoot .kwPBResBtn:hover:not(:disabled){background:rgba(170,85,255,.24);border-color:rgba(190,130,255,.72);}
      .kwPBResCompactRoot .kwPBResBtn:disabled{opacity:.45;cursor:default;}
      .kwPBResCompactStatus{min-height:15px;font-size:11px;line-height:1.35;opacity:.85;overflow-wrap:anywhere;}
      .kwPBResCompactStatus[data-error="1"]{color:#ff8a8a;opacity:1;}
      .kwPBResCompactDev{display:flex;flex-direction:column;gap:6px;margin-top:3px;padding-top:8px;border-top:1px solid rgba(255,255,255,.10);font-size:11px;line-height:1.35;}
      .kwPBResCompactDev[hidden]{display:none!important;}
      .kwPBResCompactDevToggle{display:flex;align-items:center;gap:7px;font-weight:700;}
      .kwPBResCompactDevMeta{white-space:pre-line;opacity:.72;overflow-wrap:anywhere;}
      .kwPBResCompactDevNote{opacity:.58;}
    `;
    document.head.appendChild(style);
  }

  function captureLabel(size) {
    return size === 8192 ? '8K' : '4K';
  }

  function isPhotoBoothOpen() {
    try {
      return !!(UW.BT && UW.BT.maker && UW.BT.maker.enabled === true);
    } catch (_) {
      return false;
    }
  }

  function setStatus(text, isError) {
    if (!statusEl) return;
    statusEl.textContent = String(text || '');
    statusEl.dataset.error = isError ? '1' : '0';
  }

  function refreshStatus() {
    const service = getService();

    if (activity && activity.kind === 'running') {
      setStatus(`Capturing ${captureLabel(activity.size)} image…`, false);
      return;
    }
    if (activity && activity.kind === 'error') {
      setStatus(activity.message || 'Image capture failed.', true);
      return;
    }
    if (activity && activity.kind === 'success') {
      setStatus(`${captureLabel(activity.size)} image capture complete.`, false);
      return;
    }

    if (!service) {
      setStatus('Waiting for high-resolution capture service…', false);
      return;
    }
    if (!service.enabled) {
      setStatus('High-resolution capture is disabled. Enable the repair provider in Developer Mode.', true);
      return;
    }
    if (service.providerLost) {
      setStatus('Capture provider changed unexpectedly — reload before using 4K/8K.', true);
      return;
    }
    if (!service.providerInstalled) {
      setStatus('Preparing high-resolution capture…', false);
      return;
    }
    if (!isPhotoBoothOpen()) {
      setStatus('Open Photo Booth to use 4K/8K image capture.', false);
      return;
    }

    const last = service.lastCapture;
    if (last && last.status === 'running') {
      setStatus(`Capturing ${captureLabel(Number(last.requestedWidth))} image…`, false);
      return;
    }
    if (last && last.status === 'failed' && last.error) {
      setStatus(`Image capture failed: ${last.error}`, true);
      return;
    }

    setStatus('Active — click 4K or 8K to begin image capture', false);
  }

  function syncButtons() {
    const readiness = getReadiness();
    if (readiness && typeof readiness.sync === 'function') {
      try {
        readiness.sync();
        return;
      } catch (_) {}
    }

    const service = getService();
    const last = service && service.lastCapture;
    const disabled = !(
      service
      && service.enabled
      && service.providerInstalled
      && !service.providerLost
      && (!last || last.status !== 'running')
      && isPhotoBoothOpen()
    );
    if (button4K) button4K.disabled = disabled;
    if (button8K) button8K.disabled = disabled;
  }

  function providerStateLabel(service) {
    if (!service) return 'service unavailable';
    if (!service.enabled) return 'disabled';
    if (service.providerLost) return 'DEGRADED / ownership lost';
    if (service.providerInstalled) return 'active';
    return 'not installed';
  }

  function refreshDeveloperDetails() {
    if (!developerRoot) return;
    const dev = getDeveloperMode();
    const show = !!(dev && dev.enabled);
    developerRoot.hidden = !show;
    if (!show) return;

    const service = getService();
    const readiness = getReadiness();
    if (developerEnabled) developerEnabled.checked = !!(service && service.enabled);
    if (developerEnabled) developerEnabled.disabled = !service || !!(service.lastCapture && service.lastCapture.status === 'running');
    if (developerMeta) {
      developerMeta.textContent = [
        `UI: ${BUILD}`,
        `Service: ${service && service.build ? service.build : 'unreported'}`,
        `Readiness: ${readiness && readiness.build ? readiness.build : 'unreported'}`,
        `Provider: ${providerStateLabel(service)}`
      ].join('\n');
    }
  }

  function refresh() {
    refreshStatus();
    syncButtons();
    refreshDeveloperDetails();
  }

  async function capture(size) {
    const service = getService();
    const method = size === 8192 ? 'capture8192' : 'capture4096';
    if (!service || typeof service[method] !== 'function') {
      activity = { kind: 'error', message: 'High-resolution capture service is unavailable.' };
      refresh();
      return false;
    }

    activity = { kind: 'running', size };
    refresh();
    try {
      await service[method]();
      activity = { kind: 'success', size };
      refresh();
      window.setTimeout(() => {
        if (activity && activity.kind === 'success' && activity.size === size) {
          activity = null;
          refresh();
        }
      }, 3000);
      return true;
    } catch (error) {
      activity = {
        kind: 'error',
        size,
        message: error && error.message ? error.message : String(error)
      };
      refresh();
      return false;
    }
  }

  function setProviderEnabled(next) {
    const service = getService();
    if (!service) return false;
    try {
      if (next) service.enable();
      else service.disable();
      refresh();
      return true;
    } catch (error) {
      activity = { kind: 'error', message: error && error.message ? error.message : String(error) };
      refresh();
      return false;
    }
  }

  function buildUI(container, api) {
    ensureStyles();
    const section = api.ui.createSection({
      id: 'high-resolution-capture',
      title: 'High Res Image Capture'
    });
    container.appendChild(section.root);

    const root = document.createElement('div');
    root.className = 'kwPBResCompactRoot';
    section.body.appendChild(root);

    const captureRow = document.createElement('div');
    captureRow.className = 'kwPBResCompactCapture';

    const label = document.createElement('div');
    label.className = 'kwPBResCompactLabel';
    label.textContent = 'Capture:';

    button4K = document.createElement('button');
    button4K.type = 'button';
    button4K.className = 'kwPBResBtn';
    button4K.textContent = '4K';
    button4K.title = 'Capture true 4096px image';

    button8K = document.createElement('button');
    button8K.type = 'button';
    button8K.className = 'kwPBResBtn';
    button8K.textContent = '8K';
    button8K.title = 'Capture true 8192px image';

    captureRow.appendChild(label);
    captureRow.appendChild(button4K);
    captureRow.appendChild(button8K);
    root.appendChild(captureRow);

    statusEl = document.createElement('div');
    statusEl.className = 'kwPBResCompactStatus';
    statusEl.dataset.error = '0';
    root.appendChild(statusEl);

    developerRoot = document.createElement('div');
    developerRoot.className = 'kwPBResCompactDev';
    developerRoot.hidden = true;

    const devToggle = document.createElement('label');
    devToggle.className = 'kwPBResCompactDevToggle';
    developerEnabled = document.createElement('input');
    developerEnabled.type = 'checkbox';
    const devToggleText = document.createElement('span');
    devToggleText.textContent = 'Repair provider enabled';
    devToggle.appendChild(developerEnabled);
    devToggle.appendChild(devToggleText);
    developerRoot.appendChild(devToggle);

    developerMeta = document.createElement('div');
    developerMeta.className = 'kwPBResCompactDevMeta';
    developerRoot.appendChild(developerMeta);

    const devNote = document.createElement('div');
    devNote.className = 'kwPBResCompactDevNote';
    devNote.textContent = 'When enabled, HeroForge/Lob square 4096 and 8192 screenshot requests route through the maintained Witch Dock repair provider.';
    developerRoot.appendChild(devNote);
    root.appendChild(developerRoot);

    button4K.addEventListener('click', () => { capture(4096); });
    button8K.addEventListener('click', () => { capture(8192); });
    developerEnabled.addEventListener('change', () => { setProviderEnabled(developerEnabled.checked); });

    refresh();
    if (!refreshTimer) refreshTimer = window.setInterval(refresh, 500);
  }

  function registerTool() {
    const WD = UW && UW.WitchDock;
    if (!WD || typeof WD.registerTool !== 'function' || !getService()) return false;

    const def = {
      id: TOOL_ID,
      title: 'High Res Image Capture',
      tab: 'Booth',
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
    document.getElementById(STYLE_ID)?.remove();
    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }
    return true;
  }

  if (UW[GLOBAL] && typeof UW[GLOBAL].dispose === 'function') {
    try { UW[GLOBAL].dispose(); } catch (_) {}
  }

  UW[GLOBAL] = {
    build: BUILD,
    initialize,
    refresh,
    dispose
  };

  initialize();
})();

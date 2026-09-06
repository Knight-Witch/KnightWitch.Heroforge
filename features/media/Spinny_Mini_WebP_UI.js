// ==UserScript==
// @name         Witch Dock - Spinny Mini WebP UI
// @namespace    KnightWitch
// @version      0.1.1
// @description  Docked + draggable popout UI for the validated Witch Dock Spinny Mini WebP service.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const GLOBAL = 'KWSpinnyMiniWebPUI';
  const TOOL_ID = 'spinny-mini-webp';
  const VERSION = '0.1.1';
  const BUILD = '0.1.1-stable-download-ux';
  const STYLE_ID = 'kwSpinnyMiniWebPUIStyle';
  const POPOUT_ID = 'kwSpinnyMiniWebPPopout';
  const STORE_POS = 'kw.spinnyMiniWebP.popoutPosition.v1';

  let registerTimer = null;
  let refreshTimer = null;
  let developerUnsubscribe = null;
  let dockBody = null;
  let controlsRoot = null;
  let dockPlaceholder = null;
  let popout = null;
  let popoutBody = null;
  let capabilityEl = null;
  let resolutionSelect = null;
  let speedSelect = null;
  let captureButton = null;
  let shortButton = null;
  let pauseButton = null;
  let cancelButton = null;
  let progressTrack = null;
  let progressFill = null;
  let statusEl = null;
  let successEl = null;
  let timingEl = null;
  let metaEl = null;
  let successTimer = null;
  let lastSuccessKey = null;
  let popoutButton = null;
  let returnButton = null;
  let dragState = null;

  function getService() {
    return UW && UW.KWSpinnyMiniWebP ? UW.KWSpinnyMiniWebP : null;
  }

  function getDeveloperMode() {
    return UW && UW.KWDeveloperMode ? UW.KWDeveloperMode : null;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .kwSpinnyRoot{display:flex;flex-direction:column;gap:8px;padding:2px 0;color-scheme:dark;}
      .kwSpinnyToolbar{display:flex;align-items:center;justify-content:space-between;gap:8px;}
      .kwSpinnyToolbarLabel{font-size:11px;font-weight:700;opacity:.72;}
      .kwSpinnyPopBtn,.kwSpinnyReturnBtn{border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:5px 8px;background:rgba(255,255,255,.06);color:inherit;font-size:11px;font-weight:800;cursor:pointer;}
      .kwSpinnyPopBtn:hover,.kwSpinnyReturnBtn:hover{background:rgba(170,85,255,.24);border-color:rgba(190,130,255,.72);}
      .kwSpinnyPopBtn{flex:0 0 30px;width:30px;height:30px;padding:5px;display:inline-flex;align-items:center;justify-content:center;}
      .kwSpinnyPopBtn svg{width:15px;height:15px;display:block;pointer-events:none;}
      .kwSpinnyGrid{display:grid;grid-template-columns:82px 1fr;gap:6px 8px;align-items:center;}
      .kwSpinnyGrid label{font-size:11px;font-weight:700;opacity:.82;}
      .kwSpinnyGrid select{width:100%;border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:6px 7px;background:#29292d;color:#fff;font-size:11px;color-scheme:dark;}
      .kwSpinnyGrid select option{background:#29292d;color:#fff;}
      .kwSpinnyCapability{font-size:10px;line-height:1.3;opacity:.68;overflow-wrap:anywhere;}
      .kwSpinnyActions{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:6px;}
      .kwSpinnyActions button,.kwSpinnyDevRow button{border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:7px 8px;background:rgba(255,255,255,.06);color:inherit;font-size:11px;font-weight:800;cursor:pointer;}
      .kwSpinnyActions button:hover:not(:disabled),.kwSpinnyDevRow button:hover:not(:disabled){background:rgba(170,85,255,.24);border-color:rgba(190,130,255,.72);}
      .kwSpinnyActions button:disabled,.kwSpinnyDevRow button:disabled,.kwSpinnyGrid select:disabled{opacity:.42;cursor:default;}
      .kwSpinnyPause[data-paused="1"]{border-color:rgba(105,190,130,.72);}
      .kwSpinnyCancel{border-color:rgba(205,120,120,.55)!important;}
      .kwSpinnyDevRow{display:flex;gap:6px;padding-top:2px;border-top:1px dashed rgba(190,130,255,.22);}
      .kwSpinnyDevRow[hidden]{display:none!important;}
      .kwSpinnyDevTag{align-self:center;font-size:9px;font-weight:900;letter-spacing:.04em;color:rgba(220,195,255,.88);}
      .kwSpinnyProgress{height:8px;overflow:hidden;border:1px solid rgba(255,255,255,.15);border-radius:999px;background:rgba(255,255,255,.07);}
      .kwSpinnyProgressFill{height:100%;width:0%;border-radius:999px;background:rgba(225,225,232,.86);transition:width .14s linear;}
      .kwSpinnySuccess{max-height:0;opacity:0;overflow:hidden;transform:translateY(-2px);color:#9fe2b5;font-size:11px;font-weight:800;line-height:1.35;transition:opacity .22s ease,transform .22s ease,max-height .22s ease;}
      .kwSpinnySuccess[data-show="1"]{max-height:24px;opacity:1;transform:translateY(0);}
      .kwSpinnyStatus{min-height:15px;font-size:11px;line-height:1.35;overflow-wrap:anywhere;}
      .kwSpinnyStatus[data-error="1"]{color:#ff8a8a;}
      .kwSpinnyTiming{min-height:15px;font-size:10px;line-height:1.35;opacity:.76;overflow-wrap:anywhere;}
      .kwSpinnyMeta{font-size:9px;line-height:1.3;opacity:.56;overflow-wrap:anywhere;}
      .kwSpinnyDockPlaceholder{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px;line-height:1.35;opacity:.82;padding:4px 0;}
      .kwSpinnyDockPlaceholder[hidden]{display:none!important;}
      #${POPOUT_ID}{position:fixed;z-index:2147483638;width:390px;max-width:calc(100vw - 24px);border:1px solid rgba(255,255,255,.22);border-radius:9px;background:rgba(18,18,21,.97);color:#eee;box-shadow:0 12px 36px rgba(0,0,0,.52);font:12px/1.35 Arial,sans-serif;overflow:hidden;}
      #${POPOUT_ID}[hidden]{display:none!important;}
      #${POPOUT_ID} .kwSpinnyPopHeader{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 9px;background:rgba(255,255,255,.055);border-bottom:1px solid rgba(255,255,255,.10);cursor:move;user-select:none;touch-action:none;}
      #${POPOUT_ID} .kwSpinnyPopTitle{font-size:12px;font-weight:900;}
      #${POPOUT_ID} .kwSpinnyPopHeaderActions{display:flex;gap:5px;}
      #${POPOUT_ID} .kwSpinnyPopHeader button{border:1px solid rgba(255,255,255,.17);border-radius:5px;padding:3px 7px;background:rgba(255,255,255,.06);color:inherit;font-size:10px;font-weight:800;cursor:pointer;}
      #${POPOUT_ID} .kwSpinnyPopHeader button:hover{background:rgba(170,85,255,.24);}
      #${POPOUT_ID} .kwSpinnyPopClose{font-size:14px!important;line-height:1;padding:2px 7px!important;}
      #${POPOUT_ID} .kwSpinnyPopBody{padding:10px;}
    `;
    document.head.appendChild(style);
  }

  function optionMarkup(collection) {
    return Object.values(collection || {}).map((item) => `<option value="${item.id}">${item.label}</option>`).join('');
  }

  function readStoredPosition() {
    try {
      const raw = UW.localStorage.getItem(STORE_POS);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!Number.isFinite(parsed.left) || !Number.isFinite(parsed.top)) return null;
      return parsed;
    } catch (_) { return null; }
  }

  function savePosition() {
    if (!popout || popout.hidden) return;
    try {
      UW.localStorage.setItem(STORE_POS, JSON.stringify({
        left: parseFloat(popout.style.left) || 12,
        top: parseFloat(popout.style.top) || 72
      }));
    } catch (_) {}
  }

  function clampPopout(left, top) {
    if (!popout) return { left, top };
    const width = popout.offsetWidth || 390;
    const height = popout.offsetHeight || 360;
    const maxLeft = Math.max(8, window.innerWidth - width - 8);
    const maxTop = Math.max(8, window.innerHeight - height - 8);
    return {
      left: Math.max(8, Math.min(maxLeft, left)),
      top: Math.max(8, Math.min(maxTop, top))
    };
  }

  function positionPopout() {
    if (!popout) return;
    const stored = readStoredPosition();
    const target = stored || { left: Math.max(12, window.innerWidth - 420), top: 72 };
    const pos = clampPopout(target.left, target.top);
    popout.style.left = `${pos.left}px`;
    popout.style.top = `${pos.top}px`;
  }

  function onDragMove(event) {
    if (!dragState || !popout) return;
    const next = clampPopout(
      dragState.startLeft + event.clientX - dragState.startX,
      dragState.startTop + event.clientY - dragState.startY
    );
    popout.style.left = `${next.left}px`;
    popout.style.top = `${next.top}px`;
  }

  function endDrag(event) {
    if (!dragState) return;
    try { dragState.header.releasePointerCapture(event.pointerId); } catch (_) {}
    dragState = null;
    savePosition();
    window.removeEventListener('pointermove', onDragMove, true);
    window.removeEventListener('pointerup', endDrag, true);
    window.removeEventListener('pointercancel', endDrag, true);
  }

  function beginDrag(event) {
    if (!popout || event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest('button')) return;
    const header = event.currentTarget;
    const rect = popout.getBoundingClientRect();
    dragState = {
      header,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top
    };
    try { header.setPointerCapture(event.pointerId); } catch (_) {}
    event.preventDefault();
    window.addEventListener('pointermove', onDragMove, true);
    window.addEventListener('pointerup', endDrag, true);
    window.addEventListener('pointercancel', endDrag, true);
  }

  function ensurePopout() {
    if (popout && popout.isConnected) return popout;
    popout = document.createElement('div');
    popout.id = POPOUT_ID;
    popout.hidden = true;
    popout.dataset.kwSpinnyOwned = '1';
    popout.innerHTML = `
      <div class="kwSpinnyPopHeader">
        <div class="kwSpinnyPopTitle">Spinny Mini WebP</div>
        <div class="kwSpinnyPopHeaderActions">
          <button type="button" class="kwSpinnyPopDock" title="Return controls to Witch Dock">Dock</button>
          <button type="button" class="kwSpinnyPopClose" title="Close popout and return controls to Witch Dock">×</button>
        </div>
      </div>
      <div class="kwSpinnyPopBody"></div>`;
    document.body.appendChild(popout);
    popoutBody = popout.querySelector('.kwSpinnyPopBody');
    const header = popout.querySelector('.kwSpinnyPopHeader');
    header.addEventListener('pointerdown', beginDrag);
    popout.querySelector('.kwSpinnyPopDock').addEventListener('click', closePopout);
    popout.querySelector('.kwSpinnyPopClose').addEventListener('click', closePopout);
    positionPopout();
    return popout;
  }

  function openPopout() {
    if (!controlsRoot || !dockBody) return false;
    ensurePopout();
    positionPopout();
    popoutBody.appendChild(controlsRoot);
    if (dockPlaceholder) dockPlaceholder.hidden = false;
    popout.hidden = false;
    refresh();
    return true;
  }

  function closePopout() {
    if (!controlsRoot || !dockBody) return false;
    if (popout) savePosition();
    dockBody.insertBefore(controlsRoot, dockPlaceholder || null);
    if (dockPlaceholder) dockPlaceholder.hidden = true;
    if (popout) popout.hidden = true;
    refresh();
    return true;
  }

  function buildControls() {
    const service = getService();
    controlsRoot = document.createElement('div');
    controlsRoot.className = 'kwSpinnyRoot';
    controlsRoot.dataset.kwSpinnyOwned = '1';
    controlsRoot.innerHTML = `
      <div class="kwSpinnyToolbar">
        <div class="kwSpinnyToolbarLabel">Animated WebP spin capture</div>
        <button type="button" class="kwSpinnyPopBtn" title="Pop out into free-floating window" aria-label="Pop out into free-floating window"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 3h7v7M13 11l8-8M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>
      <div class="kwSpinnyGrid">
        <label>Resolution</label><select class="kwSpinnyResolution">${optionMarkup(service && service.resolutions)}</select>
        <label>Rotation</label><select class="kwSpinnySpeed">${optionMarkup(service && service.speeds)}</select>
      </div>
      <div class="kwSpinnyCapability"></div>
      <div class="kwSpinnyActions">
        <button type="button" class="kwSpinnyCapture">Capture WebP</button>
        <button type="button" class="kwSpinnyPause" data-paused="0">Pause</button>
        <button type="button" class="kwSpinnyCancel">Cancel</button>
      </div>
      <div class="kwSpinnyDevRow" hidden>
        <span class="kwSpinnyDevTag">DEV</span>
        <button type="button" class="kwSpinnyShort">Short Test (16f)</button>
      </div>
      <div class="kwSpinnySuccess" data-show="0" role="status" aria-live="polite"></div>
      <div class="kwSpinnyStatus" data-error="0"></div>
      <div class="kwSpinnyProgress" role="progressbar" aria-label="Spinny capture progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="kwSpinnyProgressFill"></div></div>
      <div class="kwSpinnyTiming"></div>
      <div class="kwSpinnyMeta"></div>`;

    popoutButton = controlsRoot.querySelector('.kwSpinnyPopBtn');
    resolutionSelect = controlsRoot.querySelector('.kwSpinnyResolution');
    speedSelect = controlsRoot.querySelector('.kwSpinnySpeed');
    capabilityEl = controlsRoot.querySelector('.kwSpinnyCapability');
    captureButton = controlsRoot.querySelector('.kwSpinnyCapture');
    pauseButton = controlsRoot.querySelector('.kwSpinnyPause');
    cancelButton = controlsRoot.querySelector('.kwSpinnyCancel');
    shortButton = controlsRoot.querySelector('.kwSpinnyShort');
    progressTrack = controlsRoot.querySelector('.kwSpinnyProgress');
    progressFill = controlsRoot.querySelector('.kwSpinnyProgressFill');
    statusEl = controlsRoot.querySelector('.kwSpinnyStatus');
    successEl = controlsRoot.querySelector('.kwSpinnySuccess');
    timingEl = controlsRoot.querySelector('.kwSpinnyTiming');
    metaEl = controlsRoot.querySelector('.kwSpinnyMeta');

    popoutButton.addEventListener('click', openPopout);
    resolutionSelect.addEventListener('change', () => {
      const svc = getService();
      if (svc) svc.setResolution(resolutionSelect.value);
      refresh();
    });
    speedSelect.addEventListener('change', () => {
      const svc = getService();
      if (svc) svc.setSpeed(speedSelect.value);
      refresh();
    });
    captureButton.addEventListener('click', () => {
      const svc = getService();
      if (svc) svc.capture();
      refresh();
    });
    shortButton.addEventListener('click', () => {
      const svc = getService();
      if (svc) svc.captureShortTest();
      refresh();
    });
    pauseButton.addEventListener('click', () => {
      const svc = getService();
      if (svc) svc.togglePause();
      refresh();
    });
    cancelButton.addEventListener('click', () => {
      const svc = getService();
      if (svc) svc.cancel('user');
      refresh();
    });

    return controlsRoot;
  }

  function showDownloadSuccess(last) {
    if (!successEl || !last || last.status !== 'downloaded' || last.downloadConfirmed !== true) return;
    const key = `${last.completedAt || ''}:${last.outputBytes || ''}:${last.downloadFilename || ''}`;
    if (key === lastSuccessKey) return;
    lastSuccessKey = key;
    const size = last.requested && Number(last.requested.size);
    successEl.textContent = `✓ Download complete${Number.isFinite(size) ? ` — ${size}px WebP` : ''}`;
    successEl.dataset.show = '1';
    if (successTimer) window.clearTimeout(successTimer);
    successTimer = window.setTimeout(() => {
      if (successEl) successEl.dataset.show = '0';
      successTimer = null;
    }, 1800);
  }

  function refreshDeveloperVisibility() {
    if (!controlsRoot) return;
    const devRow = controlsRoot.querySelector('.kwSpinnyDevRow');
    const dev = getDeveloperMode();
    if (devRow) devRow.hidden = !(dev && dev.enabled);
  }

  function installDeveloperSubscription() {
    if (developerUnsubscribe) return;
    const dev = getDeveloperMode();
    if (!dev || typeof dev.onChange !== 'function') return;
    developerUnsubscribe = dev.onChange(() => {
      refreshDeveloperVisibility();
      refresh();
    });
  }

  function refresh() {
    const service = getService();
    if (!service || !controlsRoot) return false;
    try { service.refresh(); } catch (_) {}
    installDeveloperSubscription();
    refreshDeveloperVisibility();

    const profile = service.getSelectedProfile();
    const diagnostics = service.diagnostics || {};
    const capability = diagnostics.capability || service.readCapabilities(profile);
    const busy = !!service.busy;

    if (resolutionSelect && document.activeElement !== resolutionSelect) resolutionSelect.value = profile.resolutionId;
    if (speedSelect && document.activeElement !== speedSelect) speedSelect.value = profile.speedId;
    if (resolutionSelect) resolutionSelect.disabled = busy;
    if (speedSelect) speedSelect.disabled = busy;

    if (capabilityEl) capabilityEl.textContent = capability && capability.reason ? capability.reason : 'Capability status unavailable';
    if (captureButton) captureButton.disabled = busy || !(capability && capability.ok);
    if (shortButton) shortButton.disabled = busy || !(capability && capability.ok);
    if (pauseButton) {
      pauseButton.disabled = !busy || !!service.pauseRequested;
      pauseButton.textContent = service.paused ? 'Resume' : service.pauseRequested ? 'Pausing…' : 'Pause';
      pauseButton.dataset.paused = service.paused ? '1' : '0';
    }
    if (cancelButton) cancelButton.disabled = !busy;

    const fraction = Math.max(0, Math.min(1, Number(service.progressFraction) || 0));
    if (progressFill) progressFill.style.width = `${(fraction * 100).toFixed(1)}%`;
    if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(Math.round(fraction * 100)));
    if (statusEl) {
      statusEl.textContent = service.statusText || (capability && capability.reason) || '';
      statusEl.dataset.error = service.statusError ? '1' : '0';
    }
    showDownloadSuccess(service.lastCapture);
    if (timingEl) timingEl.textContent = service.timingText || '';
    if (metaEl) {
      const source = profile.frameSource === 'true3k-phase-feed' ? 'TRUE-3K phase-feed' : 'native frame source';
      metaEl.textContent = `${profile.size}px · ${profile.frames} frames · ${profile.fps.toFixed(0)} FPS · ${(profile.durationMs / 1000).toFixed(1)} s · ${profile.workloadMultiplier.toFixed(1)}× baseline · ${source}`;
    }
    return true;
  }

  function buildUI(container, api) {
    ensureStyles();
    const section = api.ui.createSection({ id: 'spinny-mini-webp', title: 'Spinny Mini WebP' });
    container.appendChild(section.root);
    dockBody = section.body;
    dockBody.dataset.kwSpinnyOwned = '1';

    buildControls();
    dockBody.appendChild(controlsRoot);

    dockPlaceholder = document.createElement('div');
    dockPlaceholder.className = 'kwSpinnyDockPlaceholder';
    dockPlaceholder.hidden = true;
    dockPlaceholder.dataset.kwSpinnyOwned = '1';
    const placeholderText = document.createElement('span');
    placeholderText.textContent = 'Spinny controls are open in the movable popout.';
    returnButton = document.createElement('button');
    returnButton.type = 'button';
    returnButton.className = 'kwSpinnyReturnBtn';
    returnButton.textContent = 'Return to Dock';
    returnButton.addEventListener('click', closePopout);
    dockPlaceholder.appendChild(placeholderText);
    dockPlaceholder.appendChild(returnButton);
    dockBody.appendChild(dockPlaceholder);

    ensurePopout();
    refresh();
    if (!refreshTimer) refreshTimer = window.setInterval(refresh, 250);
  }

  function registerTool() {
    const WD = UW && UW.WitchDock;
    if (!WD || typeof WD.registerTool !== 'function' || !getService()) return false;
    const def = {
      id: TOOL_ID,
      title: 'Spinny Mini WebP',
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
    if (successTimer) window.clearTimeout(successTimer);
    successTimer = null;
    if (developerUnsubscribe) {
      try { developerUnsubscribe(); } catch (_) {}
      developerUnsubscribe = null;
    }
    if (dragState) {
      dragState = null;
      window.removeEventListener('pointermove', onDragMove, true);
      window.removeEventListener('pointerup', endDrag, true);
      window.removeEventListener('pointercancel', endDrag, true);
    }
    if (popout) popout.remove();
    popout = null;
    popoutBody = null;
    document.getElementById(STYLE_ID)?.remove();
    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }
    return true;
  }

  if (UW[GLOBAL] && typeof UW[GLOBAL].dispose === 'function') {
    try { UW[GLOBAL].dispose(); } catch (_) {}
  }

  UW[GLOBAL] = {
    version: VERSION,
    build: BUILD,
    initialize,
    refresh,
    openPopout,
    closePopout,
    dispose,
    get poppedOut() { return !!(popout && !popout.hidden); }
  };

  initialize();
})();

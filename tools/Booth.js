(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  const TOOL_ID = 'booth-tool';
  const BUILD_TAG = 'v27.0.3';

  const STORE_CONSENT = 'kw.witchDock.booth.consent.v1';
  const STORE_DIR_HIDDEN = 'kw.witchDock.booth.directionsHidden.v1';
  const STORE_COMPONENTS = 'kw.witchDock.booth.components.v1';
  const STORE_BLACK_DEFAULT = 'kw.witchDock.booth.blackCanvasDefault.v1';
  const BOOTH_API_KEY = 'KW_WD_BOOTH';

  const state = {
    consent: false,
    directionsHidden: false,

    boothOn: false,
    userBoothOn: false,
    bgOn: false,
    defaultBlackCanvas: false,
    defaultSessionBooth: false,
    savedBoothMissingTicks: 0,
    startupBlackKicks: 0,
    persistLightingOn: true,
    persistEffectsOn: true,
    persistOverlaysOn: true,
    persistBackgroundOn: true,

    autoApplied: false,
    seenBooth: false,
    lastDetectAt: 0,
    lastTickAt: 0,
    lastRuntimeEnableAt: 0,

    characterDataRef: null,
    characterRootKey: null,
    characterChangedAt: 0,

    capturedMaterial: null,
    capturedUniformValues: null,
    capturedTextureUniforms: null,
    hookedMesh: null,

    capturedTokenBg: null,
    capturedTokenBgSelected: null,
    editorTokenBg: null,
    editorTokenBgSelected: null,

    btCanvasVisualSnapshot: null,
    btCanvasLayoutKey: null,

    blackCanvasMatteRoot: null,
    blackCanvasMatteBars: null,
    blackCanvasMatteParent: null,
    blackCanvasMatteLayoutKey: null,

    originalMaterial: null,
    originalUniformValues: null,
    originalTextureUniforms: null,
    originalMesh: null,

    lastDesiredMaterial: null,
    lastDesiredUniformValues: null,
    lastDesiredTextureUniforms: null,

    editorMaterial: null,
    editorUniformValues: null,
    editorTextureUniforms: null,

    tokenizerHooked: false,
    originalTokenizerDisable: null,

    capturedEffectState: null,
    capturedLightingState: null,

    wrapMap: new WeakMap(),
    wrappedDisableObjs: new Set(),

    boothPendingTeardown: false,

    boothFrameEls: new Set(),
    boothFrameHidden: false,

    shaderFramePlane: null,
    shaderFramePrev: null,
    shaderMaskObj: null,
    shaderMaskPrev: null,
    shaderFrameHidden: false,

    lastTokenizerMode: null,

    exitRearmTimer: null,

    oneShotBackdropRearmArmed: false,

    _suppressUI: false,
    prevInBooth: false,
    silentCycleTimer: null,
    silentCycleInProgress: false,

    debugLog: [],

    allowTokenizerDisableOnce: false,
    loopActive: false,

    ui: {
      root: null,
      boothToggle: null,
      lightingToggle: null,
      effectsToggle: null,
      overlaysToggle: null,
      backgroundToggle: null,
      bgToggle: null,
      dirWrap: null,
      dirText: null,
      dirBtn: null,
      status: null
    }
  };


  function gmGet(key, fallback) {
    try {
      if (typeof GM_getValue === 'function') {
        const v = GM_getValue(key, null);
        if (v !== null && v !== undefined) return v;
      }
    } catch {}
    try {
      const v = localStorage.getItem(key);
      if (v !== null) return JSON.parse(v);
    } catch {}
    return fallback;
  }

  function gmSet(key, val) {
    try {
      if (typeof GM_setValue === 'function') {
        GM_setValue(key, val);
        return;
      }
    } catch {}
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }

  function loadPersistentDefaults() {
    state.consent = !!gmGet(STORE_CONSENT, false);
    state.defaultBlackCanvas = !!gmGet(STORE_BLACK_DEFAULT, false);
    state.bgOn = !!state.defaultBlackCanvas;
  }

  let btRuntimeFacade = null;

  function resolveRuntime() {
    try {
      if (UW.TN && UW.TN.tokenizer) return UW.TN;
      const BT = UW.BT;
      if (!BT) return null;
      if (!btRuntimeFacade) btRuntimeFacade = { __kwBT: true };
      const engine = BT.liveEngine || BT.maker || null;
      btRuntimeFacade.source = BT;
      btRuntimeFacade.tokenizer = engine && typeof engine === 'object' ? engine : null;
      btRuntimeFacade.lighting = BT.display && BT.display.lighting ? BT.display.lighting : null;
      btRuntimeFacade.shader = BT.display || null;
      btRuntimeFacade.currentMode = BT.currentMode || BT._boothMode || null;
      return btRuntimeFacade;
    } catch {
      return null;
    }
  }

  function runtimeNow(fallback) {
    return resolveRuntime() || fallback || null;
  }

  function cloneJson(value) {
    try { return JSON.parse(JSON.stringify(value)); } catch { return null; }
  }

  function readBTTokenBg() {
    try {
      const display = UW.BT && UW.BT.display;
      const displayState = display && display.state;
      const filters = displayState && displayState.filters;
      if (!filters || !filters.tokenBg) return null;
      return {
        filter: cloneJson(filters.tokenBg),
        selected: displayState.selected ? displayState.selected.tokenBg : null
      };
    } catch {
      return null;
    }
  }

  function captureBTBoothCanvas() {
    const snap = readBTTokenBg();
    if (!snap || !snap.filter) return false;
    state.capturedTokenBg = snap.filter;
    state.capturedTokenBgSelected = snap.selected;
    return true;
  }

  function applyBTTokenBg(filter, selected) {
    try {
      const maker = UW.BT && (UW.BT.liveEngine || UW.BT.maker);
      if (!maker || !filter) return false;
      const next = cloneJson(filter);
      if (!next) return false;

      // Black Canvas is explicitly black even if the captured Booth background
      // used tintable colors or a nonzero blur value.
      const count = Math.max(3, Number(next.numColors) || 0);
      next.numColors = count;
      next.colors = Array.from({ length: count }, () => [0, 0, 0]);

      if (selected !== null && selected !== undefined && typeof maker._tweakSaved === 'function') {
        try { maker._tweakSaved({ selected: { tokenBg: selected } }); } catch {}
      }
      if (typeof maker.tweakFilters === 'function') maker.tweakFilters({ tokenBg: next }, false);
      else if (typeof maker._tweakSaved === 'function') maker._tweakSaved({ filters: { tokenBg: next } });
      if (typeof maker.pushDisplayState === 'function') maker.pushDisplayState();
      return true;
    } catch {
      return false;
    }
  }

  function isBTCanvasApplied(selected) {
    try {
      const snap = readBTTokenBg();
      if (!snap || !snap.filter || !Array.isArray(snap.filter.colors)) return false;
      if (selected !== null && selected !== undefined && snap.selected !== selected) return false;
      return snap.filter.colors.length > 0 && snap.filter.colors.every((c) =>
        Array.isArray(c) && Number(c[0]) === 0 && Number(c[1]) === 0 && Number(c[2]) === 0
      );
    } catch {
      return false;
    }
  }

  function restoreBTTokenBg() {
    try {
      const maker = UW.BT && (UW.BT.liveEngine || UW.BT.maker);
      if (!maker || !state.editorTokenBg) return false;
      if (state.editorTokenBgSelected !== null && state.editorTokenBgSelected !== undefined && typeof maker._tweakSaved === 'function') {
        try { maker._tweakSaved({ selected: { tokenBg: state.editorTokenBgSelected } }); } catch {}
      }
      if (typeof maker.tweakFilters === 'function') maker.tweakFilters({ tokenBg: cloneJson(state.editorTokenBg) }, false);
      else if (typeof maker._tweakSaved === 'function') maker._tweakSaved({ filters: { tokenBg: cloneJson(state.editorTokenBg) } });
      if (typeof maker.pushDisplayState === 'function') maker.pushDisplayState();
      return true;
    } catch {
      return false;
    }
  }

  function captureBTCanvasVisualState() {
    if (state.btCanvasVisualSnapshot) return state.btCanvasVisualSnapshot;
    try {
      const BT = UW.BT;
      const overlays = BT && BT.display ? BT.display.overlays : null;
      const canvas = UW.CK && UW.CK.renderManager && UW.CK.renderManager.renderer
        ? UW.CK.renderManager.renderer.domElement
        : null;
      const holder = canvas && canvas.parentElement ? canvas.parentElement : null;
      if (!overlays || !canvas) return null;
      state.btCanvasVisualSnapshot = {
        backgroundVisible: overlays.backgroundPlane ? !!overlays.backgroundPlane.visible : null,
        frameVisible: overlays.framePlane ? !!overlays.framePlane.visible : null,
        shadowVisible: overlays.shadowPlane ? !!overlays.shadowPlane.visible : null,
        maskVisible: overlays.mask && 'visible' in overlays.mask ? !!overlays.mask.visible : null,
        canvasBackground: canvas.style.backgroundColor || '',
        holderBackground: holder ? (holder.style.backgroundColor || '') : ''
      };
      return state.btCanvasVisualSnapshot;
    } catch {
      return null;
    }
  }

  function syncBTCanvasLayout(overlays, canvas) {
    try {
      const q = (value) => Math.round((Number(value) || 0) * 4) / 4;
      const rect = typeof canvas.getBoundingClientRect === 'function' ? canvas.getBoundingClientRect() : null;
      const holder = canvas.parentElement || null;
      const holderRect = holder && typeof holder.getBoundingClientRect === 'function'
        ? holder.getBoundingClientRect()
        : null;
      const key = [
        canvas.width,
        canvas.height,
        canvas.clientWidth,
        canvas.clientHeight,
        rect ? q(rect.left) : 0,
        rect ? q(rect.top) : 0,
        rect ? q(rect.width) : 0,
        rect ? q(rect.height) : 0,
        holderRect ? q(holderRect.left) : 0,
        holderRect ? q(holderRect.top) : 0,
        holderRect ? q(holderRect.width) : 0,
        holderRect ? q(holderRect.height) : 0,
        UW.innerWidth || 0,
        UW.innerHeight || 0,
        UW.devicePixelRatio || 1
      ].join(':');
      if (state.btCanvasLayoutKey === key) return false;

      if (typeof overlays.resize === 'function') overlays.resize();
      if (typeof overlays.refresh === 'function') overlays.refresh();
      if (typeof overlays.applyVisibility === 'function') overlays.applyVisibility();

      state.btCanvasLayoutKey = key;
      return true;
    } catch {
      return false;
    }
  }


  function disposeBlackCanvasMatte() {
    try {
      const root = state.blackCanvasMatteRoot;
      if (root && root.parentElement) root.parentElement.removeChild(root);
    } catch {}
    state.blackCanvasMatteRoot = null;
    state.blackCanvasMatteBars = null;
    state.blackCanvasMatteParent = null;
    state.blackCanvasMatteLayoutKey = null;
    return true;
  }

  function hideBlackCanvasMatte(remove) {
    if (remove) return disposeBlackCanvasMatte();
    try {
      if (state.blackCanvasMatteRoot) state.blackCanvasMatteRoot.style.display = 'none';
    } catch {}
    return true;
  }

  function setMatteRect(el, left, top, width, height) {
    if (!el) return;
    const w = Math.max(0, Number(width) || 0);
    const h = Math.max(0, Number(height) || 0);
    if (w <= 0.01 || h <= 0.01) {
      el.style.display = 'none';
      return;
    }
    el.style.display = 'block';
    el.style.left = left + 'px';
    el.style.top = top + 'px';
    el.style.width = w + 'px';
    el.style.height = h + 'px';
  }

  function ensureBlackCanvasMatte() {
    try {
      const BT = UW.BT;
      const CK = UW.CK;
      const maker = BT && BT.maker;
      const canvas = CK && CK.renderManager && CK.renderManager.renderer
        ? CK.renderManager.renderer.domElement
        : null;
      const parent = canvas && canvas.parentElement ? canvas.parentElement : null;
      if (!maker || typeof maker.getTokenViewOffset !== 'function' || !canvas || !parent) return false;

      const view = maker.getTokenViewOffset();
      if (!view || !(Number(view.fullWidth) > 0) || !(Number(view.fullHeight) > 0)) return false;
      if (!(Number(view.width) > 0) || !(Number(view.height) > 0)) return false;

      let root = state.blackCanvasMatteRoot;
      if (!root || state.blackCanvasMatteParent !== parent || !root.isConnected) {
        disposeBlackCanvasMatte();
        root = document.createElement('div');
        root.id = 'kwBoothBlackCanvasMatte';
        root.setAttribute('aria-hidden', 'true');
        Object.assign(root.style, {
          position: 'absolute',
          pointerEvents: 'none',
          overflow: 'hidden',
          background: 'transparent',
          zIndex: '1',
          display: 'none'
        });

        const bars = {};
        ['top', 'bottom', 'left', 'right'].forEach((name) => {
          const el = document.createElement('div');
          el.dataset.kwBoothMatte = name;
          Object.assign(el.style, {
            position: 'absolute',
            pointerEvents: 'none',
            background: '#000000'
          });
          root.appendChild(el);
          bars[name] = el;
        });

        parent.appendChild(root);
        state.blackCanvasMatteRoot = root;
        state.blackCanvasMatteBars = bars;
        state.blackCanvasMatteParent = parent;
        state.blackCanvasMatteLayoutKey = null;
      }

      const canvasRect = canvas.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const cssWidth = Number(canvasRect.width) || Number(canvas.clientWidth) || 0;
      const cssHeight = Number(canvasRect.height) || Number(canvas.clientHeight) || 0;
      if (!(cssWidth > 0) || !(cssHeight > 0)) return false;

      const scaleX = cssWidth / Number(view.fullWidth);
      const scaleY = cssHeight / Number(view.fullHeight);
      const cropLeft = clamp(Number(view.offsetX) * scaleX, 0, cssWidth);
      const cropTop = clamp(Number(view.offsetY) * scaleY, 0, cssHeight);
      const cropRight = clamp(cropLeft + Number(view.width) * scaleX, cropLeft, cssWidth);
      const cropBottom = clamp(cropTop + Number(view.height) * scaleY, cropTop, cssHeight);
      const localLeft = canvas.offsetParent === parent
        ? Number(canvas.offsetLeft) || 0
        : (Number(canvasRect.left) - Number(parentRect.left) - (Number(parent.clientLeft) || 0) + (Number(parent.scrollLeft) || 0));
      const localTop = canvas.offsetParent === parent
        ? Number(canvas.offsetTop) || 0
        : (Number(canvasRect.top) - Number(parentRect.top) - (Number(parent.clientTop) || 0) + (Number(parent.scrollTop) || 0));

      const q = (value) => Math.round((Number(value) || 0) * 4) / 4;
      const key = [
        q(localLeft), q(localTop), q(cssWidth), q(cssHeight),
        q(cropLeft), q(cropTop), q(cropRight), q(cropBottom)
      ].join(':');

      root.style.left = localLeft + 'px';
      root.style.top = localTop + 'px';
      root.style.width = cssWidth + 'px';
      root.style.height = cssHeight + 'px';
      root.style.display = 'block';

      if (state.blackCanvasMatteLayoutKey !== key) {
        const bars = state.blackCanvasMatteBars || {};
        setMatteRect(bars.top, 0, 0, cssWidth, cropTop);
        setMatteRect(bars.bottom, 0, cropBottom, cssWidth, cssHeight - cropBottom);
        setMatteRect(bars.left, 0, cropTop, cropLeft, cropBottom - cropTop);
        setMatteRect(bars.right, cropRight, cropTop, cssWidth - cropRight, cropBottom - cropTop);
        state.blackCanvasMatteLayoutKey = key;
      }
      return true;
    } catch {
      hideBlackCanvasMatte(false);
      return false;
    }
  }

  function isNativePhotoBoothForPresentation() {
    try {
      const rt = runtimeNow(null);
      const tokenizer = rt && rt.tokenizer ? rt.tokenizer : null;
      const mode = tokenizer && typeof tokenizer.currentMode === 'string'
        ? tokenizer.currentMode
        : (rt && typeof rt.currentMode === 'string' ? rt.currentMode : null);
      if (mode && mode.toLowerCase().includes('booth')) return true;
    } catch {}
    return inPhotoBoothUI();
  }

  function enforceBTBlackCanvas(options) {
    try {
      const BT = UW.BT;
      const CK = UW.CK;
      const display = BT && BT.display;
      const env = display && display.environment;
      const overlays = display && display.overlays;
      const canvas = CK && CK.renderManager && CK.renderManager.renderer
        ? CK.renderManager.renderer.domElement
        : null;
      if (!env || !overlays || !canvas) return false;

      captureBTCanvasVisualState();
      syncBTCanvasLayout(overlays, canvas);

      const allowEditorFallback = options && Object.prototype.hasOwnProperty.call(options, 'allowEditorFallback')
        ? !!options.allowEditorFallback
        : !isNativePhotoBoothForPresentation();
      const wantsEditorFallback = !!(state.userBoothOn && !state.persistBackgroundOn && allowEditorFallback);
      const matteReady = wantsEditorFallback ? ensureBlackCanvasMatte() : false;

      if (matteReady) {
        ensureEditorEnvironmentBehindBooth({ allowBlackCanvas: true });
      } else {
        hideBlackCanvasMatte(false);
        if (typeof env.setDefaultEnvironmentVisibility === 'function') {
          env.setDefaultEnvironmentVisibility(false);
        }
      }

      if (overlays.backgroundPlane) overlays.backgroundPlane.visible = !!state.persistBackgroundOn;
      if (overlays.framePlane) overlays.framePlane.visible = false;
      if (overlays.shadowPlane) overlays.shadowPlane.visible = false;
      if (overlays.mask && 'visible' in overlays.mask) overlays.mask.visible = false;

      canvas.style.backgroundColor = '#000000';
      if (canvas.parentElement) canvas.parentElement.style.backgroundColor = '#000000';
      return true;
    } catch {
      return false;
    }
  }

  function restoreBTCanvasVisualState() {
    const snap = state.btCanvasVisualSnapshot;
    try {
      disposeBlackCanvasMatte();
      const BT = UW.BT;
      const CK = UW.CK;
      const display = BT && BT.display;
      const env = display && display.environment;
      const overlays = display && display.overlays;
      const canvas = CK && CK.renderManager && CK.renderManager.renderer
        ? CK.renderManager.renderer.domElement
        : null;
      if (env && typeof env.setDefaultEnvironmentVisibility === 'function') {
        env.setDefaultEnvironmentVisibility(true);
      }
      if (snap && overlays) {
        if (overlays.backgroundPlane && snap.backgroundVisible !== null) overlays.backgroundPlane.visible = snap.backgroundVisible;
        if (overlays.framePlane && snap.frameVisible !== null) overlays.framePlane.visible = snap.frameVisible;
        if (overlays.shadowPlane && snap.shadowVisible !== null) overlays.shadowPlane.visible = snap.shadowVisible;
        if (overlays.mask && snap.maskVisible !== null && 'visible' in overlays.mask) overlays.mask.visible = snap.maskVisible;
      }
      if (canvas) {
        canvas.style.backgroundColor = snap ? snap.canvasBackground : '';
        if (canvas.parentElement) canvas.parentElement.style.backgroundColor = snap ? snap.holderBackground : '';
      }
      state.btCanvasVisualSnapshot = null;
      state.btCanvasLayoutKey = null;
      return true;
    } catch {
      disposeBlackCanvasMatte();
      state.btCanvasVisualSnapshot = null;
      state.btCanvasLayoutKey = null;
      return false;
    }
  }

  function ensureEditorEnvironmentBehindBooth(options) {
    try {
      const allowBlackCanvas = !!(options && options.allowBlackCanvas);
      if (!state.userBoothOn || (state.bgOn && !allowBlackCanvas)) return false;
      const BT = UW.BT;
      const CK = UW.CK;
      const display = BT && BT.display;
      const env = display && display.environment;
      const background = CK && CK.environment ? CK.environment.background : null;
      if (!env || typeof env.setDefaultEnvironmentVisibility !== 'function') return false;
      if (!background || background.visible !== false) return false;
      env.setDefaultEnvironmentVisibility(true);
      return true;
    } catch {
      return false;
    }
  }

  function ensureStyles() {
    if (document.getElementById('kwBoothToolStyle')) return;
    const st = document.createElement('style');
    st.id = 'kwBoothToolStyle';
    st.textContent = `
      .kwBoothTool{display:flex;flex-direction:column;gap:10px;padding:10px;}
      .kwBoothRow{display:flex;align-items:center;justify-content:space-between;gap:10px;}
      .kwBoothSubRow{padding-left:22px;}
      .kwBoothSubRow .kwBoothToggle{width:36px;height:20px;}
      .kwBoothSubRow .kwBoothSlider{border-radius:10px;}
      .kwBoothSubRow .kwBoothSlider:before{width:14px;height:14px;top:3px;left:3px;}
      .kwBoothSubRow .kwBoothToggle input:checked + .kwBoothSlider:before{transform:translateX(16px);}
      .kwBoothLeft{display:flex;align-items:center;gap:10px;}
      .kwBoothToggle{position:relative;display:inline-block;width:44px;height:24px;flex:0 0 auto;}
      .kwBoothToggle input{opacity:0;width:0;height:0;}
      .kwBoothSlider{position:absolute;cursor:pointer;inset:0;border-radius:12px;background:rgba(255,255,255,0.18);transition:200ms;}
      .kwBoothSlider:before{content:"";position:absolute;height:18px;width:18px;left:3px;top:3px;border-radius:50%;background:rgba(255,255,255,0.85);transition:200ms;}
      .kwBoothToggle input:checked + .kwBoothSlider{background:rgba(120,255,200,0.35);}
      .kwBoothToggle input:checked + .kwBoothSlider:before{transform:translateX(20px);}
      .kwBoothToggle input:disabled + .kwBoothSlider{cursor:not-allowed;opacity:0.5;}
      .kwBoothLabel{font-size:12px;opacity:0.95;}
      .kwBoothConsent{display:flex;align-items:center;gap:8px;font-size:12px;}
      .kwBoothConsent input{transform:translateY(0.5px);}
      .kwBoothBox{border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:10px;background:rgba(0,0,0,0.18);}
      .kwBoothBox .kwBoothRow + .kwBoothRow{margin-top:10px;}
      .kwBoothDirTitle{font-weight:700;font-size:12px;opacity:0.95;}
      .kwBoothNotesTitle{font-weight:700;margin-top:10px;margin-bottom:6px;}
      .kwBoothOl{margin:0 0 0 18px;padding:0;}
      .kwBoothOl li{margin:0 0 10px 0;}
      .kwBoothUl{margin:0 0 0 18px;padding:0;list-style:disc;}
      .kwBoothUl li{margin:0 0 10px 0;}
      .kwBoothDirHeader{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;}
      .kwBoothBtn{border:1px solid rgba(255,255,255,0.18);border-radius:6px;padding:6px 10px;background:rgba(255,255,255,0.06);color:inherit;font-size:12px;cursor:pointer;}
      .kwBoothBtn:active{transform:translateY(1px);}
      .kwBoothDirText{white-space:pre-line;font-size:12px;line-height:1.35;opacity:0.95;}
      .kwBoothStatus{font-size:11px;opacity:0.85;padding-top:2px;}
      .kwBoothPersistNote{font-size:11px;line-height:1.35;opacity:.78;padding:0 2px;}
      .kwBoothPersistLink{border:0;padding:0;margin:0;background:none;color:#d9b8ff;font:inherit;font-weight:750;text-decoration:underline;cursor:pointer;}
      .kwBoothPersistLink:hover{color:#ead8ff;}
    `;
    document.head.appendChild(st);
  }

  function buildUI(container, api) {
    ensureStyles();

    const sec = api.ui.createSection({ id: 'booth', title: 'Persistent Booth' });
    container.appendChild(sec.root);

    const root = document.createElement('div');
    root.className = 'kwBoothTool';
    sec.body.appendChild(root);

    const persistenceNote = document.createElement('div');
    persistenceNote.className = 'kwBoothPersistNote';
    persistenceNote.appendChild(document.createTextNode('To enable automatic persistence across sessions, see '));

    const utilitiesLink = document.createElement('button');
    utilitiesLink.type = 'button';
    utilitiesLink.className = 'kwBoothPersistLink';
    utilitiesLink.textContent = 'Utilities';
    utilitiesLink.title = 'Open Utilities';
    utilitiesLink.addEventListener('click', (e) => {
      e.preventDefault();
      const dock = UW.WitchDock;
      if (dock && typeof dock.activateTab === 'function' && dock.activateTab('Utilities')) return;
      const fallback = document.querySelector('.kwWDTab[data-tab-name="Utilities"]');
      if (fallback && typeof fallback.click === 'function') fallback.click();
    });

    persistenceNote.appendChild(utilitiesLink);
    persistenceNote.appendChild(document.createTextNode('.'));
    root.appendChild(persistenceNote);

    const togglesBox = document.createElement('div');
    togglesBox.className = 'kwBoothBox';
    root.appendChild(togglesBox);

    function mkToggle(labelText) {
      const row = document.createElement('div');
      row.className = 'kwBoothRow';

      const left = document.createElement('div');
      left.className = 'kwBoothLeft';

      const wrap = document.createElement('label');
      wrap.className = 'kwBoothToggle';

      const input = document.createElement('input');
      input.type = 'checkbox';

      const slider = document.createElement('span');
      slider.className = 'kwBoothSlider';

      wrap.appendChild(input);
      wrap.appendChild(slider);

      const label = document.createElement('div');
      label.className = 'kwBoothLabel';
      label.textContent = labelText;

      left.appendChild(wrap);
      left.appendChild(label);

      row.appendChild(left);
      return { row, input, label };
    }

    const boothT = mkToggle('Booth View');
    const lightingT = mkToggle('Lighting');
    const effectsT = mkToggle('Effects');
    const overlaysT = mkToggle('Overlays');
    const backgroundT = mkToggle('Background');
    const bgT = mkToggle('Black Canvas');

    lightingT.row.classList.add('kwBoothSubRow');
    effectsT.row.classList.add('kwBoothSubRow');
    overlaysT.row.classList.add('kwBoothSubRow');
    backgroundT.row.classList.add('kwBoothSubRow');

    togglesBox.appendChild(boothT.row);
    togglesBox.appendChild(lightingT.row);
    togglesBox.appendChild(effectsT.row);
    togglesBox.appendChild(overlaysT.row);
    togglesBox.appendChild(backgroundT.row);
    togglesBox.appendChild(bgT.row);

    const dirBox = document.createElement('div');
    dirBox.className = 'kwBoothBox';
    root.appendChild(dirBox);

    const dirHeader = document.createElement('div');
    dirHeader.className = 'kwBoothDirHeader';

    const dirTitle = document.createElement('div');
    dirTitle.className = 'kwBoothDirTitle';
    dirTitle.textContent = 'Directions';

    const dirBtn = document.createElement('button');
    dirBtn.type = 'button';
    dirBtn.className = 'kwBoothBtn';

    dirHeader.appendChild(dirTitle);
    dirHeader.appendChild(dirBtn);

    const dirText = document.createElement('div');
    dirText.className = 'kwBoothDirText';

    const ol = document.createElement('ol');
    ol.className = 'kwBoothOl';
    const li1 = document.createElement('li');
    li1.textContent = 'Open photo booth';
    const li2 = document.createElement('li');
    li2.textContent = 'Edit your scene, or if you have already done so, it will capture that automatically.';
    const li3 = document.createElement('li');
    li3.textContent = 'Exit the booth';
    const li4 = document.createElement('li');
    li4.textContent = 'Use Booth View and Black Canvas above for session-only overrides. Automatic defaults live in Utilities.';
    ol.appendChild(li1);
    ol.appendChild(li2);
    ol.appendChild(li3);
    ol.appendChild(li4);

    const notesTitle = document.createElement('div');
    notesTitle.className = 'kwBoothNotesTitle';
    notesTitle.textContent = 'Notes:';

    const ul = document.createElement('ul');
    ul.className = 'kwBoothUl';
    const n1 = document.createElement('li');
    n1.textContent = 'Toggle the booth view on/off at any time';
    const n2 = document.createElement('li');
    n2.textContent = "If the black background doesn't disappear when you toggle it off, just click the canvas and zoom or move the camera and it will turn white. Toggle black background back on for dark mode.";
    const n3 = document.createElement('li');
    n3.textContent = 'Currently, you will need to reload the page to revert back to the original fantasy background in the main UI editor. I will work to patch this when I can.';
    ul.appendChild(n1);
    ul.appendChild(n2);
    ul.appendChild(n3);

    dirText.appendChild(ol);
    dirText.appendChild(notesTitle);
    dirText.appendChild(ul);

    dirBox.appendChild(dirHeader);
    dirBox.appendChild(dirText);

    const status = document.createElement('div');
    status.className = 'kwBoothStatus';
    root.appendChild(status);

    state.ui.root = root;
    state.ui.boothToggle = boothT.input;
    state.ui.lightingToggle = lightingT.input;
    state.ui.effectsToggle = effectsT.input;
    state.ui.overlaysToggle = overlaysT.input;
    state.ui.backgroundToggle = backgroundT.input;
    state.ui.bgToggle = bgT.input;
    state.ui.dirWrap = dirBox;
    state.ui.dirText = dirText;
    state.ui.dirBtn = dirBtn;
    state.ui.status = status;

    state.consent = !!gmGet(STORE_CONSENT, false);
    state.directionsHidden = !!gmGet(STORE_DIR_HIDDEN, false);
    const components = gmGet(STORE_COMPONENTS, null);
    if (components && typeof components === 'object') {
      state.persistLightingOn = components.lighting !== false;
      state.persistEffectsOn = components.effects !== false;
      state.persistOverlaysOn = components.overlays !== false;
      state.persistBackgroundOn = components.background !== false;
    }

    boothT.input.addEventListener('change', () => onUserBoothToggle(!!boothT.input.checked));
    lightingT.input.addEventListener('change', () => onComponentToggle('lighting', !!lightingT.input.checked));
    effectsT.input.addEventListener('change', () => onComponentToggle('effects', !!effectsT.input.checked));
    overlaysT.input.addEventListener('change', () => onComponentToggle('overlays', !!overlaysT.input.checked));
    backgroundT.input.addEventListener('change', () => onComponentToggle('background', !!backgroundT.input.checked));
    bgT.input.addEventListener('change', () => onUserBgToggle(!!bgT.input.checked));

    dirBtn.addEventListener('click', (e) => {
      e.preventDefault();
      state.directionsHidden = !state.directionsHidden;
      gmSet(STORE_DIR_HIDDEN, !!state.directionsHidden);
      updateUI();
    });

    updateUI();
  }

  function updateUI() {
    const ui = state.ui;
    if (!ui || !ui.root) return;


    const suppress = !!state._suppressUI;

    if (!suppress && ui.boothToggle) {
      ui.boothToggle.disabled = false;
      ui.boothToggle.checked = !!state.userBoothOn;
    }

    const componentsDisabled = !state.userBoothOn;
    if (!suppress && ui.lightingToggle) {
      ui.lightingToggle.disabled = componentsDisabled;
      ui.lightingToggle.checked = !!state.persistLightingOn;
    }
    if (!suppress && ui.effectsToggle) {
      ui.effectsToggle.disabled = componentsDisabled;
      ui.effectsToggle.checked = !!state.persistEffectsOn;
    }
    if (!suppress && ui.overlaysToggle) {
      ui.overlaysToggle.disabled = componentsDisabled;
      ui.overlaysToggle.checked = !!state.persistOverlaysOn;
    }
    if (!suppress && ui.backgroundToggle) {
      ui.backgroundToggle.disabled = componentsDisabled;
      ui.backgroundToggle.checked = !!state.persistBackgroundOn;
    }

    if (!suppress && ui.bgToggle) {
      ui.bgToggle.disabled = false;
      ui.bgToggle.checked = !!state.bgOn;
    }

    if (!suppress && ui.dirText) ui.dirText.style.display = state.directionsHidden ? 'none' : '';
    if (!suppress && ui.dirBtn) ui.dirBtn.textContent = state.directionsHidden ? 'Show' : 'Hide';

    if (ui.status) {
      const tok = state.tokenizerHooked ? 'HOOKED' : '—';
      const booth = state.userBoothOn ? 'ON' : 'OFF';
      const bg = state.bgOn ? 'ON' : 'OFF';
      ui.status.textContent = `Tokenizer: ${tok} | Booth: ${booth} | Black Canvas: ${bg}`;
      try { ui.status.textContent += ` | Booth ${BUILD_TAG}`; } catch {}
    }
  }

  function applyUniformSnapshot(material, snap) {
    if (!material || !snap) return;
    const u = material.uniforms;
    if (!u || typeof u !== 'object') return;
    const keys = Object.keys(snap);
    let changed = false;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const entry = u[k];
      if (!entry || typeof entry !== 'object' || !('value' in entry)) continue;
      const desired = snap[k];
      if (entry.value !== desired) {
        entry.value = desired;
        changed = true;
      }
    }
    if (changed) markMaterialDirty(material);
  }

  function applyTextureSnapshot(material, snap) {
    if (!material || !snap) return;
    const u = material.uniforms;
    if (!u || typeof u !== 'object') return;
    const keys = Object.keys(snap);
    let changed = false;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const s = snap[k];
      if (!s || !s.texture) continue;
      const entry = u[k];
      if (!entry || typeof entry !== 'object' || !('value' in entry)) continue;
      const cur = entry.value;
      const curTex = isTextureLike(cur) ? cur : null;
      const curSrc = curTex ? getTextureSrc(curTex) : null;
      const desiredTex = s.texture;
      const desiredSrc = s.src || null;
      const curMissingImage = curTex && (!curTex.image || (!curSrc && curTex.image));
      const curWrong = !curTex || (desiredSrc && curSrc && desiredSrc !== curSrc);
      if (curWrong || curMissingImage) {
        entry.value = desiredTex;
        changed = true;
      }
      markTextureDirty(entry.value);
    }
    if (changed) markMaterialDirty(material);
  }

  function captureOriginalBackdrop() {
    const bg = getBackground();
    const mesh = getMesh(bg);
    const mat = mesh && mesh.material ? mesh.material : null;
    if (!bg || !mesh || !mat) return false;
    if (state.originalMesh === mesh && state.originalMaterial) return true;
    state.originalMesh = mesh;
    state.originalMaterial = mat;
    state.originalUniformValues = snapshotUniformValues(mat);
    state.originalTextureUniforms = snapshotTextureUniforms(mat);
    return true;
  }

  function restoreOriginalBackdrop() {
    const bg = getBackground();
    const mesh = state.originalMesh || getMesh(bg);
    if (!mesh) return;

    try {
      if (mesh.__kw_boothBackdrop__) {
        try { delete mesh.material; } catch {}
        try { delete mesh.__kw_boothBackdrop__; } catch {}
      }
    } catch {}

    const mat = state.editorMaterial || state.lastDesiredMaterial || state.originalMaterial;
    if (mat) {
      try { mesh.material = mat; } catch {}

      const uv =
        mat === state.editorMaterial
          ? state.editorUniformValues
          : mat === state.lastDesiredMaterial
            ? state.lastDesiredUniformValues
            : state.originalUniformValues;
      const tu =
        mat === state.editorMaterial
          ? state.editorTextureUniforms
          : mat === state.lastDesiredMaterial
            ? state.lastDesiredTextureUniforms
            : state.originalTextureUniforms;
      applyUniformSnapshot(mat, uv);
      applyTextureSnapshot(mat, tu);

      markMaterialDirty(mat);
    }

    state.hookedMesh = null;
    state.originalMaterial = null;
    state.originalUniformValues = null;
    state.originalTextureUniforms = null;
    state.originalMesh = null;
    state.lastDesiredMaterial = null;

    state.lastDesiredUniformValues = null;
    state.lastDesiredTextureUniforms = null;
  }

  function hasAnyTextureSrc(snap) {
    if (!snap || typeof snap !== 'object') return false;
    const keys = Object.keys(snap);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const v = snap[k];
      if (v && v.texture && v.src) return true;
    }
    return false;
  }

  function maybeCaptureEditorBaseline() {
    if (!state.bgOn) return;
    if (inPhotoBoothUI()) return;
    const mat = state.lastDesiredMaterial;
    if (!mat) return;
    const tu = snapshotTextureUniforms(mat);
    if (!hasAnyTextureSrc(tu)) return;
    state.editorMaterial = mat;
    state.editorUniformValues = snapshotUniformValues(mat);
    state.editorTextureUniforms = tu;
  }

  function teardownBoothNow(TN) {
    captureEffectState(TN);
    try {
      const rt = runtimeNow(TN);
      const t = rt && rt.tokenizer ? rt.tokenizer : null;
      if (t && typeof t.disable === 'function') t.disable();
      else if (t && typeof state.originalTokenizerDisable === 'function') state.originalTokenizerDisable.call(t);
    } catch {}

    try {
      state.wrappedDisableObjs.forEach((obj) => {
        const rec = state.wrapMap.get(obj);
        if (!rec || typeof rec.original !== 'function') return;
        try { rec.original.call(obj); } catch {}
      });
    } catch {}
  }

  function captureEffectState(TN) {
    try {
      const rt = runtimeNow(TN);
      const t = rt && rt.tokenizer ? rt.tokenizer : null;

      // BT.maker.effectState() no longer exposes the saved Photo Booth state.
      // The current runtime keeps the authoritative state in composeDisplayState().
      if (rt && rt.__kwBT && t && typeof t.composeDisplayState === 'function') {
        const composed = t.composeDisplayState();
        if (composed && composed.effects) {
          state.capturedEffectState = copyBTLighting(composed.effects);
          return state.capturedEffectState;
        }
      }

      const accessor = t && t.effectState ? t.effectState : null;
      const effects = typeof accessor === 'function' ? accessor.call(t) : accessor;
      if (!effects) return state.capturedEffectState;
      if (typeof effects.toJson === 'function') {
        state.capturedEffectState = effects.toJson();
      }
      return state.capturedEffectState;
    } catch {
      return state.capturedEffectState;
    }
  }

  function restoreEffectState(TN) {
    const snap = state.capturedEffectState;
    if (!snap) return false;
    try {
      const rt = runtimeNow(TN);
      const t = rt && rt.tokenizer ? rt.tokenizer : null;
      const accessor = t && t.effectState ? t.effectState : null;
      const effects = typeof accessor === 'function' ? accessor.call(t) : accessor;
      if (!effects) return false;

      if (typeof effects.fromJson === 'function') effects.fromJson(snap);
      else if (typeof effects.load === 'function') effects.load(snap);
      else return false;

      // Lob's current Shader Fix owns this function. Calling it reapplies its
      // required passes without replacing or fighting the non-configurable patch.
      if (t && typeof t.enableOverlayEffects === 'function') {
        try { t.enableOverlayEffects(); } catch {}
      }
      return true;
    } catch {
      return false;
    }
  }

  const BT_OVERLAY_PASSES = new Set(['Highlights', 'TransparencyOverlay']);

  function capturedEffectPasses() {
    try {
      const passes = state.capturedEffectState &&
        state.capturedEffectState.effects &&
        state.capturedEffectState.effects.enabledPasses;
      return Array.isArray(passes) ? passes.slice() : [];
    } catch {
      return [];
    }
  }

  function setBTEffectPass(pass, enabled) {
    try {
      const effects = UW.CK && UW.CK.Effects;
      if (!effects || typeof effects.enablePass !== 'function') return false;
      effects.enablePass(pass, !!enabled);
      return true;
    } catch {
      return false;
    }
  }

  function applyBTComponentEffectState(TN) {
    const rt = runtimeNow(TN);
    if (!rt || !rt.__kwBT) return restoreEffectState(rt);

    if (!capturedEffectPasses().length) captureEffectState(rt);

    if (state.persistEffectsOn || state.persistOverlaysOn) {
      restoreEffectState(rt);
    }

    const passes = capturedEffectPasses();
    for (let i = 0; i < passes.length; i++) {
      const pass = passes[i];
      const overlayPass = BT_OVERLAY_PASSES.has(pass);
      setBTEffectPass(pass, overlayPass ? state.persistOverlaysOn : state.persistEffectsOn);
    }

    setBTEffectPass('Highlights', state.persistOverlaysOn);
    setBTEffectPass('TransparencyOverlay', state.persistOverlaysOn);
    return true;
  }

  function copyBTLighting(value) {
    try {
      const CK = UW.CK;
      if (CK && CK.Helpers && typeof CK.Helpers.deepCopy === 'function') {
        return CK.Helpers.deepCopy(value);
      }
    } catch {}
    return cloneJson(value);
  }

  function captureBTLightingState() {
    try {
      const BT = UW.BT;
      const maker = BT && (BT.liveEngine || BT.maker);
      if (!maker || typeof maker.composeDisplayState !== 'function') return false;
      const composed = maker.composeDisplayState();
      if (!composed || !composed.lighting) return false;
      state.capturedLightingState = copyBTLighting(composed.lighting);
      return !!state.capturedLightingState;
    } catch {
      return false;
    }
  }

  function restoreBTLightingState() {
    if (!state.persistLightingOn) return false;
    if (!state.capturedLightingState) captureBTLightingState();
    const captured = state.capturedLightingState;
    if (!captured) return false;
    try {
      const BT = UW.BT;
      const lighting = BT && BT.display ? BT.display.lighting : null;
      if (!lighting || typeof lighting.apply !== 'function') return false;

      // Hero Forge refreshes the entire character when sphere-light state differs
      // from the previous value passed to lighting.apply(). This is a replay of an
      // already-captured state, so pass that same state as the comparison value.
      // Live bridge validation confirmed this restores the state without invoking
      // CK.character.refresh().
      const next = copyBTLighting(captured);
      lighting.apply(next, copyBTLighting(captured));
      return true;
    } catch {
      return false;
    }
  }

  function resetBTLightingState() {
    try {
      const lighting = UW.BT && UW.BT.display ? UW.BT.display.lighting : null;
      if (!lighting) return false;
      if (typeof lighting.reset === 'function') lighting.reset();
      else if (typeof lighting.apply === 'function') lighting.apply(null);
      else return false;
      return true;
    } catch {
      return false;
    }
  }

  function applyBTComponentPlanes() {
    try {
      const overlays = UW.BT && UW.BT.display ? UW.BT.display.overlays : null;
      if (!overlays) return false;
      if (overlays.backgroundPlane) {
        overlays.backgroundPlane.visible = !!state.persistBackgroundOn;
      }
      if (!state.persistOverlaysOn && overlays.framePlane) {
        overlays.framePlane.visible = false;
      }
      return true;
    } catch {
      return false;
    }
  }

  function refreshBTComponentRender() {
    try {
      const BT = UW.BT;
      const overlays = BT && BT.display ? BT.display.overlays : null;

      if (overlays) {
        if (typeof overlays.resize === 'function') overlays.resize();
        if (typeof overlays.refresh === 'function') overlays.refresh();
        if (typeof overlays.applyVisibility === 'function') overlays.applyVisibility();
      }

      applyBTComponentPlanes();
      if (state.bgOn) enforceBTBlackCanvas();

      requestAnimationFrame(() => {
        try {
          if (overlays) {
            if (typeof overlays.resize === 'function') overlays.resize();
            if (typeof overlays.refresh === 'function') overlays.refresh();
            if (typeof overlays.applyVisibility === 'function') overlays.applyVisibility();
          }
          applyBTComponentPlanes();
          if (state.bgOn) enforceBTBlackCanvas();
        } catch {}
      });
      return true;
    } catch {
      return false;
    }
  }

  function saveComponentPreferences() {
    gmSet(STORE_COMPONENTS, {
      lighting: !!state.persistLightingOn,
      effects: !!state.persistEffectsOn,
      overlays: !!state.persistOverlaysOn,
      background: !!state.persistBackgroundOn
    });
  }

  function handleToggleChange(kind, nextVal, TN) {
    if (kind === 'bg') {
      const prev = state.bgOn;
      state.bgOn = !!nextVal;
      if (state.bgOn) {
        if (!state.capturedMaterial) tryCaptureBackdropFromScene();
        captureOriginalBackdrop();
      } else if (prev) {
        restoreOriginalBackdrop();
      }
      updateUI();
      return;
    }

    if (kind === 'booth') {
      const prevUser = !!state.userBoothOn;

      state.userBoothOn = !!nextVal;
      state.boothOn = state.userBoothOn;

      if (!state.userBoothOn && prevUser) state.boothPendingTeardown = true;
      if (state.userBoothOn && !prevUser) {
        try {
          const rt = runtimeNow(TN);
          const t = rt && rt.tokenizer ? rt.tokenizer : null;
          dbg('silentCycle.on', {});
          if (t && typeof t.enable === 'function') t.enable();
        } catch {}
      }
      updateUI();
    }
  }

  function dbg(tag, data) {
    try {
      const rec = { t: Date.now(), tag, data: data === undefined ? null : data };
      state.debugLog.push(rec);
      if (state.debugLog.length > 200) state.debugLog.shift();
      try {
        const c = localStorage.getItem('kw.witchDock.booth.debugConsole');
        if (c === 'true') console.log('[BoothDBG]', tag, data);
      } catch {}
    } catch {}
  }

  try { dbg('init', { build: BUILD_TAG }); } catch {}

  function waitForRuntime(cb) {
    const rt = resolveRuntime();
    if (rt) return cb(rt);
    setTimeout(() => waitForRuntime(cb), 50);
  }

  function jparse(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function inPhotoBoothUI() {
    try {
      const p = (location && location.pathname ? location.pathname : '').toLowerCase();
      const h = (location && location.hash ? location.hash : '').toLowerCase();
      if (p.includes('photobooth') || p.includes('photo-booth') || h.includes('photobooth') || h.includes('photo-booth')) return true;
    } catch {}
    const dialogs = document.querySelectorAll('[role="dialog"], .modal, .Modal, .hf-modal, .hfModal');
    for (let i = 0; i < dialogs.length; i++) {
      const el = dialogs[i];
      const txt = (el.innerText || '').toLowerCase();
      if (txt.includes('photo booth') || txt.includes('photobooth')) return true;
    }
    const t = document.title ? document.title.toLowerCase() : '';
    if (t.includes('photo booth') || t.includes('photobooth')) return true;
    return false;
  }

  function getTokenizerMode(TN) {
    try {
      const t = TN && TN.tokenizer ? TN.tokenizer : null;
      const m = t && typeof t.currentMode === 'string' ? t.currentMode : null;
      if (m) return m;
      if (TN && typeof TN.currentMode === 'string' && TN.currentMode) return TN.currentMode;
      const BT = UW.BT;
      return BT && typeof BT.currentMode === 'string' ? BT.currentMode : null;
    } catch {
      return null;
    }
  }

  function isInBooth(TN) {
    try {
      if (TN && TN.__kwBT && TN.tokenizer) return !!TN.tokenizer.enabled;
    } catch {}
    const mode = getTokenizerMode(TN);
    try {
      if (mode && mode.toLowerCase().includes('booth')) return true;
    } catch {}
    return inPhotoBoothUI();
  }

  function scheduleSilentBackdropRearm(TN) {
    if (!state.userBoothOn) return;
    if (state.exitRearmTimer) return;
    state.exitRearmTimer = setTimeout(() => {
      state.exitRearmTimer = null;
      const tn = runtimeNow(TN);
      if (!tn || !state.userBoothOn) return;
      if (isInBooth(tn)) return;

      state.boothOn = false;
      try {
        dbg('silentCycle.off', {});
        teardownBoothNow(tn);
      } catch {}

      setTimeout(() => {
        const tn2 = runtimeNow(tn);
        if (!tn2 || !state.userBoothOn) return;
        if (isInBooth(tn2)) return;
        state.boothOn = true;
        try {
          const t = tn2 && tn2.tokenizer ? tn2.tokenizer : null;
          if (t && typeof t.enable === 'function') t.enable();
        } catch {}
      }, 150);
    }, 1000);
  }

  function isLikelyBoothFrameEl(el) {
    if (!el || el === document.documentElement || el === document.body) return false;
    if (el === state.dock || (state.dock && state.dock.contains(el))) return false;
    const id = (el.id || '').toLowerCase();
    const cls = (typeof el.className === 'string' ? el.className : '').toLowerCase();
    if (!id && !cls) return false;
    if (!id.includes('booth') && !id.includes('photo') && !cls.includes('booth') && !cls.includes('photo')) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    if (cs.position !== 'absolute' && cs.position !== 'fixed') return false;
    const r = el.getBoundingClientRect();
    if (!r || r.width < 200 || r.height < 200) return false;
    const aspect = r.width / r.height;
    if (aspect < 0.92 || aspect > 1.08) return false;
    if (r.width > window.innerWidth * 0.98 || r.height > window.innerHeight * 0.98) return false;
    const bg = (cs.backgroundColor || '').toLowerCase();
    const hasOverlayBg = bg.includes('rgba') || bg.includes('rgb');
    const pe = (cs.pointerEvents || '').toLowerCase();
    const likelyOverlay = pe === 'none' || hasOverlayBg;
    if (!likelyOverlay) return false;
    return true;
  }

  function findBoothFrameEls() {
    const out = [];
    const candidates = document.querySelectorAll('[id*="booth"],[id*="photo"],[class*="booth"],[class*="photo"]');
    for (let i = 0; i < candidates.length; i++) {
      const el = candidates[i];
      try {
        if (isLikelyBoothFrameEl(el)) out.push(el);
      } catch {}
    }
    return out;
  }

  function setBoothFrameHidden(hidden) {
    if (hidden === state.boothFrameHidden) return;
    state.boothFrameHidden = hidden;
    if (hidden) {
      const els = findBoothFrameEls();
      for (let i = 0; i < els.length; i++) state.boothFrameEls.add(els[i]);
      state.boothFrameEls.forEach((el) => {
        try {
          if (!el.dataset.kwBoothPrevDisplay) el.dataset.kwBoothPrevDisplay = el.style.display || '';
          el.style.display = 'none';
        } catch {}
      });
      return;
    }

    state.boothFrameEls.forEach((el) => {
      try {
        const prev = el.dataset.kwBoothPrevDisplay;
        if (prev != null) el.style.display = prev;
        delete el.dataset.kwBoothPrevDisplay;
      } catch {}
    });
    state.boothFrameEls.clear();
  }

  function getShaderFramePlane(TN) {
    try {
      if (state.shaderFramePlane) return state.shaderFramePlane;
      const shader = TN && TN.shader ? TN.shader : null;
      const overlays = shader && shader.overlays ? shader.overlays : null;
      const plane = shader ? (shader.framePlane || (overlays && overlays.framePlane)) : null;
      if (!plane || typeof plane !== 'object') return null;
      state.shaderFramePlane = plane;
      return plane;
    } catch {
      return null;
    }
  }

  function getShaderMaskObj(TN) {
    try {
      if (state.shaderMaskObj) return state.shaderMaskObj;
      const obj = TN && TN.shader ? TN.shader.mask : null;
      if (!obj || typeof obj !== 'object') return null;
      state.shaderMaskObj = obj;
      return obj;
    } catch {
      return null;
    }
  }

  function snapshotPlaneVisual(plane) {
    if (!plane || typeof plane !== 'object') return null;
    const mats = plane.material ? (Array.isArray(plane.material) ? plane.material : [plane.material]) : [];
    const matSnap = mats.map((m) => {
      if (!m || typeof m !== 'object') return null;
      return {
        transparent: !!m.transparent,
        opacity: typeof m.opacity === 'number' ? m.opacity : null
      };
    });
    return { visible: !!plane.visible, mat: matSnap };
  }

  function restorePlaneVisual(plane, snap) {
    if (!plane || typeof plane !== 'object' || !snap) return;
    try { plane.visible = !!snap.visible; } catch {}
    const mats = plane.material ? (Array.isArray(plane.material) ? plane.material : [plane.material]) : [];
    for (let i = 0; i < mats.length; i++) {
      const m = mats[i];
      const s = snap.mat ? snap.mat[i] : null;
      if (!m || typeof m !== 'object' || !s) continue;
      try { m.transparent = !!s.transparent; } catch {}
      try { if (typeof s.opacity === 'number') m.opacity = s.opacity; } catch {}
    }
  }

  function setShaderFrameHidden(hidden, TN) {
    const plane = getShaderFramePlane(TN);
    const mask = getShaderMaskObj(TN);
    if (!plane && !mask) return;

    if (hidden) {
      state.shaderFrameHidden = true;
      if (plane) {
        if (!state.shaderFramePrev) state.shaderFramePrev = snapshotPlaneVisual(plane);
        try { plane.visible = false; } catch {}
        const mats = plane.material ? (Array.isArray(plane.material) ? plane.material : [plane.material]) : [];
        for (let i = 0; i < mats.length; i++) {
          const m = mats[i];
          if (!m || typeof m !== 'object') continue;
          try { m.transparent = true; } catch {}
          try { m.opacity = 0; } catch {}
        }
      }

      if (mask) {
        if (!state.shaderMaskPrev) state.shaderMaskPrev = snapshotPlaneVisual(mask);
        try { mask.visible = false; } catch {}
        const mats = mask.material ? (Array.isArray(mask.material) ? mask.material : [mask.material]) : [];
        for (let i = 0; i < mats.length; i++) {
          const m = mats[i];
          if (!m || typeof m !== 'object') continue;
          try { m.transparent = true; } catch {}
          try { m.opacity = 0; } catch {}
        }
      }
      return;
    }

    if (!state.shaderFrameHidden) return;
    state.shaderFrameHidden = false;

    if (plane) restorePlaneVisual(plane, state.shaderFramePrev);
    if (mask) restorePlaneVisual(mask, state.shaderMaskPrev);
    state.shaderFramePrev = null;
    state.shaderMaskPrev = null;
  }

  function getRoot() {
    try {
      const TN = UW.TN;
      const g = TN && TN.helper && TN.helper._debugGroup;
      return g && g.parent && g.parent.children && g.parent.children[0] ? g.parent.children[0] : null;
    } catch {
      return null;
    }
  }

  function getBackground() {
    try {
      const env = UW.BT && UW.BT.display ? UW.BT.display.environment : null;
      if (env && env.mesh) return env;
    } catch {}
    const root = getRoot();
    return root && root.background ? root.background : null;
  }

  function getMesh(bg) {
    try { return bg && bg.mesh ? bg.mesh : null; } catch { return null; }
  }

  function isTextureLike(v) {
    return !!v && typeof v === 'object' && typeof v.isTexture === 'boolean' && v.isTexture === true;
  }

  function getTextureSrc(tex) {
    try {
      const img = tex && tex.image ? tex.image : null;
      if (!img) return null;
      return img.currentSrc || img.src || null;
    } catch {
      return null;
    }
  }

  function snapshotUniformValues(material) {
    const out = {};
    const u = material && material.uniforms;
    if (!u || typeof u !== 'object') return out;

    const keys = Object.keys(u);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const entry = u[k];
      if (!entry || typeof entry !== 'object') continue;
      if (!('value' in entry)) continue;
      out[k] = entry.value;
    }
    return out;
  }

  function snapshotTextureUniforms(material) {
    const out = {};
    const u = material && material.uniforms;
    if (!u || typeof u !== 'object') return out;

    const keys = Object.keys(u);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const entry = u[k];
      if (!entry || typeof entry !== 'object') continue;
      if (!('value' in entry)) continue;

      const v = entry.value;
      if (!isTextureLike(v)) continue;

      let clone = null;
      try { clone = typeof v.clone === 'function' ? v.clone() : v; } catch { clone = v; }
      out[k] = { texture: clone, src: getTextureSrc(v), uuid: v && v.uuid ? v.uuid : null };
    }
    return out;
  }

  function markTextureDirty(tex) {
    try { if (tex && typeof tex.needsUpdate === 'boolean') tex.needsUpdate = true; } catch {}
  }

  function markMaterialDirty(mat) {
    try {
      if (!mat) return;
      if (typeof mat.uniformsNeedUpdate === 'boolean') mat.uniformsNeedUpdate = true;
      if (typeof mat.needsUpdate === 'boolean') mat.needsUpdate = true;
    } catch {}
  }

  function ensureHook() {
    const bg = getBackground();
    const mesh = getMesh(bg);
    if (!mesh) return;

    if (mesh !== state.hookedMesh) {
      state.hookedMesh = mesh;
      hookMeshMaterial(mesh);
    }
  }

  function hookMeshMaterial(mesh) {
    if (!mesh || mesh.__kw_boothBackdrop__) return;

    let _mat = mesh.material;

    Object.defineProperty(mesh, 'material', {
      get() { return _mat; },
      set(v) {
        if (state.bgOn && state.capturedMaterial) {
          if (v && v !== state.capturedMaterial) {
            state.lastDesiredMaterial = v;
            state.lastDesiredUniformValues = snapshotUniformValues(v);
            state.lastDesiredTextureUniforms = snapshotTextureUniforms(v);
          }
          _mat = state.capturedMaterial;
          return;
        }
        _mat = v;
      },
      configurable: true
    });

    mesh.__kw_boothBackdrop__ = true;
  }

  function applyCapturedMaterial() {
    if (!state.bgOn) return;
    if (!state.capturedMaterial) return;

    const bg = getBackground();
    const mesh = getMesh(bg);
    if (!mesh) return;

    if (mesh.material !== state.capturedMaterial) {
      try { mesh.material = state.capturedMaterial; } catch {}
    }
  }

  function enforceAllUniformValues() {
    if (!state.bgOn) return;
    if (!state.capturedMaterial) return;
    if (!state.capturedUniformValues) return;

    const mat = state.capturedMaterial;
    const u = mat.uniforms;
    if (!u || typeof u !== 'object') return;

    const keys = Object.keys(state.capturedUniformValues);
    let changed = false;

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const entry = u[k];
      if (!entry || typeof entry !== 'object') continue;
      if (!('value' in entry)) continue;

      const desired = state.capturedUniformValues[k];
      if (entry.value !== desired) {
        entry.value = desired;
        changed = true;
      }
    }

    if (changed) markMaterialDirty(mat);
  }

  function enforceTextureUniforms() {
    if (!state.bgOn) return;
    if (!state.capturedMaterial) return;
    if (!state.capturedTextureUniforms) return;

    const mat = state.capturedMaterial;
    const u = mat.uniforms;
    if (!u || typeof u !== 'object') return;

    const keys = Object.keys(state.capturedTextureUniforms);
    let changed = false;

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const snap = state.capturedTextureUniforms[k];
      if (!snap || !snap.texture) continue;

      const entry = u[k];
      if (!entry || typeof entry !== 'object' || !('value' in entry)) continue;

      const cur = entry.value;
      const curTex = isTextureLike(cur) ? cur : null;
      const curSrc = curTex ? getTextureSrc(curTex) : null;

      const desiredTex = snap.texture;
      const desiredSrc = snap.src || null;

      const curMissingImage = curTex && (!curTex.image || (!curSrc && curTex.image));
      const curWrong = !curTex || (desiredSrc && curSrc && desiredSrc !== curSrc);

      if (curWrong || curMissingImage) {
        entry.value = desiredTex;
        changed = true;
      }

      markTextureDirty(entry.value);
    }

    if (changed) markMaterialDirty(mat);
  }

  function tryCaptureBackdropFromScene() {
    const bg = getBackground();
    const mesh = getMesh(bg);
    const mat = mesh && mesh.material ? mesh.material : null;
    if (!bg || !mesh || !mat) return false;

    state.capturedMaterial = mat;
    state.capturedUniformValues = snapshotUniformValues(mat);
    state.capturedTextureUniforms = snapshotTextureUniforms(mat);
    return true;
  }

  function hookTokenizerDisable(TN) {
    const t = TN && TN.tokenizer;
    if (!t || typeof t.disable !== 'function') return;
    if (state.tokenizerHooked) return;

    state.originalTokenizerDisable = t.disable;

    t.disable = function () {
      if (state.boothOn) return;
      return state.originalTokenizerDisable.apply(this, arguments);
    };

    state.tokenizerHooked = true;
  }

  function wrapDisable(obj) {
    if (!obj || typeof obj.disable !== 'function') return;
    if (state.wrapMap.has(obj)) return;

    const original = obj.disable;
    const wrapped = function () {
      try {
        let name = '';
        try {
          const rt = resolveRuntime();
          if (rt && rt.tokenizer && obj === rt.tokenizer) name = rt.__kwBT ? 'BT.maker' : 'TN.tokenizer';
          else if (rt && rt.lighting && obj === rt.lighting) name = rt.__kwBT ? 'BT.display.lighting' : 'TN.lighting';
        } catch {}
        dbg('disable.call', { name, boothOn: !!state.boothOn, allowOnce: !!state.allowTokenizerDisableOnce });
      } catch {}
      try {
        const tn = resolveRuntime();
        const tok = tn && tn.tokenizer;
        const isTokenizer = tok && obj === tok;

        // Hero Forge's new Booth runtime exposes BT.maker instead of TN.tokenizer.
        // Its real disable() call is the booth-exit signal. Allow that teardown
        // exactly once, then re-enable after the new display state has committed.
        if (tn && tn.__kwBT && isTokenizer && state.boothOn && state.userBoothOn) {
          if (state.oneShotBackdropRearmArmed) return true;
          state.oneShotBackdropRearmArmed = true;
          captureEffectState(tn);
          dbg('bt.exit.disable', {});

          state.allowTokenizerDisableOnce = true;
          let result = true;
          try { result = original.apply(this, arguments); } catch {}
          state.allowTokenizerDisableOnce = false;

          setTimeout(() => {
            try {
              const rt2 = resolveRuntime();
              const maker = rt2 && rt2.tokenizer;
              if (!maker || !state.userBoothOn) return;
              if (typeof maker.enable === 'function') maker.enable();
              applyBTComponentEffectState(rt2);
              restoreBTLightingState();
              dbg('bt.reenabled', { enabled: !!maker.enabled });
            } catch {}
          }, 300);

          setTimeout(() => {
            try {
              const rt3 = resolveRuntime();
              if (rt3 && state.userBoothOn) {
                if (rt3.tokenizer && typeof rt3.tokenizer.enable === 'function') rt3.tokenizer.enable();
                applyBTComponentEffectState(rt3);
                restoreBTLightingState();
              }
            } catch {}
            state.oneShotBackdropRearmArmed = false;
          }, 1200);

          return result;
        }

        if (state.boothOn) {
          try {
            const tn2 = resolveRuntime();
            const tok2 = tn2 && tn2.tokenizer ? tn2.tokenizer : null;
            if (tok2 && obj === tok2 && state.userBoothOn && tn2 && !isInBooth(tn2)) {
              dbg('exit.detect.disable', {});
              scheduleSilentBackdropCycle(tn2);
            }
          } catch {}

          if (isTokenizer && state.allowTokenizerDisableOnce) {
            return original.apply(this, arguments);
          }
          return true;
        }

        if (isTokenizer && state.userBoothOn && !isInBooth(tn) && !state.oneShotBackdropRearmArmed) {
          state.oneShotBackdropRearmArmed = true;
          state.allowTokenizerDisableOnce = true;
          try { original.apply(this, arguments); } catch {}
          state.allowTokenizerDisableOnce = false;

          setTimeout(() => {
            state.oneShotBackdropRearmArmed = false;
            try {
              const rt2 = resolveRuntime();
              const t2 = rt2 && rt2.tokenizer;
              if (t2 && typeof t2.enable === 'function') t2.enable();
            } catch {}
          }, 200);

          setTimeout(() => {
            try {
              const tn2 = resolveRuntime();
              if (!tn2 || !state.userBoothOn) return;
              if (isInBooth(tn2)) return;
              const t3 = tn2.tokenizer;
              if (t3 && typeof t3.enable === 'function') t3.enable();
            } catch {}
          }, 1100);

          return true;
        }
      } catch {}

      return original.apply(this, arguments);
    };

    obj.disable = wrapped;
    state.wrapMap.set(obj, { original });
    state.wrappedDisableObjs.add(obj);
  }

  function enforceLightingPersistence(TN) {
    if (!TN) return;
    const L = TN.lighting;
    if (!L) return;

    wrapDisable(L);

    const keys = Object.keys(L);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      let v;
      try { v = L[k]; } catch { continue; }
      if (!v) continue;
      if (typeof v === 'object') wrapDisable(v);
    }
  }

  function savedBoothModeCandidates(TN) {
    const out = [];
    const add = (value) => {
      if (typeof value !== 'string' || !value || out.includes(value)) return;
      out.push(value);
    };
    try {
      const BT = UW.BT;
      add(BT && BT.currentMode);
      add(BT && BT._boothMode);
      add(TN && TN.currentMode);
      const custom = UW.CK && UW.CK.data ? UW.CK.data.custom : null;
      if (custom && custom.portrait && custom.portrait.camera) add(custom.portrait.camera.tokenizerMode);
      if (custom && custom.token && custom.token.camera) add(custom.token.camera.tokenizerMode);
      if (custom && custom.portrait) add('portrait');
      if (custom && custom.token) add('token');
    } catch {}
    return out;
  }

  function readSavedBoothConfig(TN) {
    try {
      const isBT = !!((TN && TN.__kwBT) || UW.BT);
      if (isBT) {
        const CK = UW.CK;
        const custom = CK && CK.data && CK.data.custom;
        if (!custom || typeof custom !== 'object') return null;

        const modes = savedBoothModeCandidates(TN);
        for (let i = 0; i < modes.length; i++) {
          const mode = modes[i];
          const cfg = custom[mode];
          if (!cfg || typeof cfg !== 'object') continue;

          const filters = cfg.filters && typeof cfg.filters === 'object' ? cfg.filters : null;
          const selected = cfg.selected && typeof cfg.selected === 'object' ? cfg.selected : null;
          const signals = [];
          if (cfg.cameraSave) signals.push('cameraSave');
          // Bare camera state is not a saved Booth signal. Fresh/new figures
          // can carry ordinary camera data without ever having a Booth setup.
          if (cfg.lighting) signals.push('lighting');
          if (cfg.effects) signals.push('effects');
          if (filters && filters.tokenBg) signals.push('filters.tokenBg');
          if (filters && filters.tokenFrame) signals.push('filters.tokenFrame');
          if (selected && selected.tokenBg !== undefined && selected.tokenBg !== null) signals.push('selected.tokenBg');
          if (selected && selected.tokenFrame !== undefined && selected.tokenFrame !== null) signals.push('selected.tokenFrame');
          if (!signals.length) continue;
          return { mode, signals, config: cfg };
        }
        return null;
      }

      const t = TN && TN.tokenizer ? TN.tokenizer : null;
      if (t && t.savedCamera) {
        return { mode: getTokenizerMode(TN) || 'legacy', signals: ['savedCamera'], config: null };
      }
    } catch {}
    return null;
  }

  function seedCapturedBoothState(saved) {
    const cfg = saved && saved.config;
    if (!cfg || typeof cfg !== 'object') return;
    try {
      if (!state.capturedEffectState && cfg.effects) {
        state.capturedEffectState = copyBTLighting(cfg.effects);
      }
      if (!state.capturedLightingState && cfg.lighting) {
        state.capturedLightingState = copyBTLighting(cfg.lighting);
      }
      const filters = cfg.filters && typeof cfg.filters === 'object' ? cfg.filters : null;
      if (!state.capturedTokenBg && filters && filters.tokenBg) {
        state.capturedTokenBg = cloneJson(filters.tokenBg);
        state.capturedTokenBgSelected = cfg.selected ? cfg.selected.tokenBg : null;
      }
    } catch {}
  }

  function hasSavedBoothSetup(TN) {
    return !!readSavedBoothConfig(TN);
  }

  function detectExistingBooth(TN) {
    const t = TN && TN.tokenizer;
    if (!t) return false;
    if (TN.__kwBT) return !!t.enabled || !!t._enabledFor;
    return !!(t.savedCamera || t.currentCamera);
  }

  function currentCharacterGeneration() {
    try {
      const CK = UW.CK;
      return {
        data: CK && CK.data ? CK.data : null,
        rootKey: CK && CK.character && CK.character.uuid ? String(CK.character.uuid) : null
      };
    } catch {
      return { data: null, rootKey: null };
    }
  }

  function clearFigureScopedSnapshots() {
    try { disposeBlackCanvasMatte(); } catch {}
    state.capturedMaterial = null;
    state.capturedUniformValues = null;
    state.capturedTextureUniforms = null;
    state.hookedMesh = null;
    state.capturedTokenBg = null;
    state.capturedTokenBgSelected = null;
    state.editorTokenBg = null;
    state.editorTokenBgSelected = null;
    state.originalMaterial = null;
    state.originalUniformValues = null;
    state.originalTextureUniforms = null;
    state.originalMesh = null;
    state.lastDesiredMaterial = null;
    state.lastDesiredUniformValues = null;
    state.lastDesiredTextureUniforms = null;
    state.editorMaterial = null;
    state.editorUniformValues = null;
    state.editorTextureUniforms = null;
    state.capturedEffectState = null;
    state.capturedLightingState = null;
    state.btCanvasLayoutKey = null;
    state.oneShotBackdropRearmArmed = false;
    state.prevInBooth = false;
    state.lastTokenizerMode = null;
  }

  function observeCharacterGeneration() {
    const current = currentCharacterGeneration();
    if (!current.data && !current.rootKey) return false;

    if (!state.characterDataRef && !state.characterRootKey) {
      state.characterDataRef = current.data;
      state.characterRootKey = current.rootKey;
      return false;
    }

    const dataChanged = !!(current.data && state.characterDataRef && current.data !== state.characterDataRef);
    const rootChanged = !!(current.rootKey && state.characterRootKey && current.rootKey !== state.characterRootKey);
    if (!dataChanged && !rootChanged) {
      if (current.data) state.characterDataRef = current.data;
      if (current.rootKey) state.characterRootKey = current.rootKey;
      return false;
    }

    const previousRootKey = state.characterRootKey;
    state.characterDataRef = current.data;
    state.characterRootKey = current.rootKey;
    state.characterChangedAt = Date.now();
    state.autoApplied = false;
    state.seenBooth = false;
    state.savedBoothMissingTicks = 0;
    clearFigureScopedSnapshots();
    dbg('character.changed', { dataChanged, rootChanged, previousRootKey, rootKey: current.rootKey });
    return true;
  }

  function maybeAutoApply(TN) {
    if (!state.consent) return;
    const now = Date.now();
    if (now - state.lastDetectAt < 350) return;
    state.lastDetectAt = now;
    if (state.autoApplied) return;

    const saved = readSavedBoothConfig(TN);
    if (saved) {
      seedCapturedBoothState(saved);
      if (!state.userBoothOn) {
        onUserBoothToggle(true, { source: 'default', runtime: TN, reason: 'saved-figure-config' });
      }
      state.autoApplied = true;
      state.savedBoothMissingTicks = 0;
      dbg('default.booth.autoApply', { reason: 'saved-figure-config', mode: saved.mode, signals: saved.signals });
      updateUI();
      return;
    }

    // Preserve the established first-use behavior for a figure that did not
    // already contain a saved Booth setup: after the user actually enters the
    // Photo Booth, persistence may arm from the live Booth runtime.
    if (!state.seenBooth || !detectExistingBooth(TN)) return;
    onUserBoothToggle(true, { source: 'default', runtime: TN, reason: 'booth-visit' });
    state.autoApplied = true;
    state.savedBoothMissingTicks = 0;
    dbg('default.booth.autoApply', { reason: 'booth-visit' });
    updateUI();
  }

  function ensureDesiredBTRuntime(TN) {
    if (!state.userBoothOn) return false;
    const rt = runtimeNow(TN);
    if (!rt || !rt.__kwBT) return false;
    const engine = rt.tokenizer || (UW.BT && (UW.BT.liveEngine || UW.BT.maker)) || null;
    if (!engine || typeof engine.enable !== 'function') return false;
    if (engine.enabled) return true;

    const now = Date.now();
    if (now - state.lastRuntimeEnableAt < 750) return false;
    state.lastRuntimeEnableAt = now;
    try {
      engine.enable();
      dbg('bt.ensureEnabled', { enabled: !!engine.enabled, mode: UW.BT ? UW.BT.currentMode : null });
      return !!engine.enabled;
    } catch {
      return false;
    }
  }

  function scheduleSilentBackdropCycle(TN) {
    if (!state.userBoothOn) return;
    if (state.silentCycleInProgress) return;
    if (state.silentCycleTimer) return;

    state.silentCycleTimer = setTimeout(() => {
      state.silentCycleTimer = null;

      const tn = runtimeNow(TN);
      if (!tn) return;
      if (isInBooth(tn)) return;
      if (!state.userBoothOn) return;

      state.silentCycleInProgress = true;
      state._suppressUI = true;

      dbg('silentCycle.start', {});

      const uiToggle = state.ui && state.ui.boothToggle ? state.ui.boothToggle : null;

      try { if (uiToggle) uiToggle.disabled = true; } catch {}

      // Keep the visible switch frozen while the internal one-shot teardown runs.
      // v16 also clicked the checkbox after dispatching change, which inverted the
      // requested value a second time and left persistence in the wrong state.
      try { onUserBoothToggle(false, { source: 'internal', preserveSource: true }); } catch {}

      setTimeout(() => {
        try { onUserBoothToggle(true, { source: 'internal', preserveSource: true }); } catch {}

        setTimeout(() => {
          try {
            if (!state.capturedMaterial) tryCaptureBackdropFromScene();
          } catch {}
          try { if (state.capturedMaterial) applyCapturedMaterial(); } catch {}
          try {
            if (state.capturedMaterial && state.capturedUniformValues) {
              applyUniformSnapshot(state.capturedMaterial, state.capturedUniformValues);
            }
          } catch {}
          try {
            if (state.capturedMaterial && state.capturedTextureUniforms) {
              applyTextureSnapshot(state.capturedMaterial, state.capturedTextureUniforms);
            }
          } catch {}
          try { applyBTComponentEffectState(runtimeNow(tn)); } catch {}
          try { restoreBTLightingState(); } catch {}

          // Hero Forge's booth teardown can finish in more than one pass. Restore
          // again after it settles so effect toggles do not remain reset to OFF.
          setTimeout(() => {
            try { applyBTComponentEffectState(runtimeNow(tn)); } catch {}
            try { restoreBTLightingState(); } catch {}
          }, 700);

          state._suppressUI = false;
          state.silentCycleInProgress = false;

          try {
            if (uiToggle) {
              uiToggle.checked = true;
              uiToggle.disabled = false;
            }
          } catch {}

          dbg('silentCycle.done', {});
          updateUI();
        }, 900);
      }, 450);
    }, 1200);
  }

  function tick(TN) {
    if (!state.loopActive) return;
    const now = performance.now();
    if (now - state.lastTickAt < 110) return requestAnimationFrame(() => tick(TN));
    state.lastTickAt = now;

    TN = runtimeNow(TN);
    observeCharacterGeneration();

    const tokenizerMode = (() => {
      try {
        const t = TN && TN.tokenizer ? TN.tokenizer : null;
        const m = t && typeof t.currentMode === 'string' ? t.currentMode : null;
        if (m) return m;
        if (TN && typeof TN.currentMode === 'string') return TN.currentMode;
        return UW.BT && typeof UW.BT.currentMode === 'string' ? UW.BT.currentMode : null;
      } catch {
        return null;
      }
    })();

    const inBooth = (() => {
      try {
        if (tokenizerMode && tokenizerMode.toLowerCase().includes('booth')) return true;
      } catch {}
      return inPhotoBoothUI();
    })();

    if (TN && TN.__kwBT && !inBooth && !state.bgOn && !state.editorTokenBg) {
      try {
        const editor = readBTTokenBg();
        if (editor) {
          state.editorTokenBg = editor.filter;
          state.editorTokenBgSelected = editor.selected;
        }
      } catch {}
    }

    if (inBooth) {
      state.seenBooth = true;
      state.btCanvasLayoutKey = null;

      if (TN && TN.__kwBT && state.userBoothOn) {
        try { captureBTLightingState(); } catch {}
        try { captureEffectState(TN); } catch {}
      }

      if (!state.prevInBooth || !state.capturedTokenBg) {
        try { captureBTBoothCanvas(); } catch {}
      }

      // Capture the actual booth backdrop while it exists, independently of
      // whether persistence or Black Canvas is currently enabled. Previously
      // Black Canvas only captured while already ON, so toggling it in the
      // editor could merely capture/reapply the editor background and do nothing.
      if (!state.prevInBooth || !state.capturedMaterial) {
        try { tryCaptureBackdropFromScene(); } catch {}
      }
    }

    if (state.prevInBooth && !inBooth) {
      dbg('booth.exit', { mode: tokenizerMode });
      try { dbg('silentCycle.schedule', {}); } catch {}
      scheduleSilentBackdropCycle(TN);
    }

    if (state.lastTokenizerMode == null) state.lastTokenizerMode = tokenizerMode;

    const wasBooth = (() => {
      try {
        const prev = state.lastTokenizerMode;
        if (prev && typeof prev === 'string' && prev.toLowerCase().includes('booth')) return true;
      } catch {}
      return false;
    })();

    state.lastTokenizerMode = tokenizerMode;

    if (wasBooth && !inBooth && state.userBoothOn) {
      state.oneShotBackdropRearmArmed = false;
    }

    const savedBoothConfig = readSavedBoothConfig(TN);
    if (savedBoothConfig) seedCapturedBoothState(savedBoothConfig);
    const figureSettling = !!state.characterChangedAt && (Date.now() - state.characterChangedAt < 1800);
    if (state.defaultSessionBooth && state.userBoothOn && state.consent && !inBooth) {
      if (savedBoothConfig) {
        state.savedBoothMissingTicks = 0;
      } else if (figureSettling) {
        state.savedBoothMissingTicks = 0;
      } else {
        state.savedBoothMissingTicks += 1;
        if (state.savedBoothMissingTicks >= 10) {
          dbg('default.booth.savedConfigMissing', { action: 'disable-default-session' });
          onUserBoothToggle(false, { source: 'default', runtime: TN, reason: 'saved-config-missing' });
          state.autoApplied = false;
          state.seenBooth = false;
          state.savedBoothMissingTicks = 0;
        }
      }
    } else if (savedBoothConfig || inBooth) {
      state.savedBoothMissingTicks = 0;
    }

    maybeAutoApply(TN);
    ensureDesiredBTRuntime(TN);

    const hideFrame = !!state.userBoothOn && !inBooth;
    setBoothFrameHidden(hideFrame);
    setShaderFrameHidden(hideFrame, TN);

    if (state.boothOn && TN) {
      hookTokenizerDisable(TN);
      if (!TN.__kwBT) enforceLightingPersistence(TN);
      wrapDisable(TN && TN.tokenizer ? TN.tokenizer : null);
    }

    if (state.boothPendingTeardown && !inBooth) {
      state.boothPendingTeardown = false;
      teardownBoothNow(TN);
      updateUI();
    }

    if (state.bgOn && TN && TN.__kwBT) {
      try { enforceBTBlackCanvas({ allowEditorFallback: !inBooth }); } catch {}
    } else if (state.bgOn) {
      if (!state.capturedMaterial) tryCaptureBackdropFromScene();
      if (!state.originalMaterial) captureOriginalBackdrop();
      maybeCaptureEditorBaseline();
      ensureHook();
      applyCapturedMaterial();
      enforceAllUniformValues();
      enforceTextureUniforms();
    }

    if (TN && TN.__kwBT && state.boothOn && !inBooth) {
      try { applyBTComponentPlanes(); } catch {}
      if (!state.bgOn) {
        try { ensureEditorEnvironmentBehindBooth(); } catch {}
      }
    }

    state.prevInBooth = inBooth;

    requestAnimationFrame(() => tick(TN));
  }

  function setDefaultBoothPersistence(v) {
    try { dbg('default.boothPersistence', { v: !!v }); } catch {}
    state.consent = !!v;
    state.autoApplied = false;
    gmSet(STORE_CONSENT, !!state.consent);

    if (state.consent) {
      startLoop();
      const rt = resolveRuntime();
      const saved = readSavedBoothConfig(rt);
      if (saved) {
        seedCapturedBoothState(saved);
        onUserBoothToggle(true, { source: 'default', runtime: rt, reason: 'utilities-enable' });
        state.autoApplied = true;
        state.savedBoothMissingTicks = 0;
      } else if (rt && isInBooth(rt)) {
        state.seenBooth = true;
      }
    } else {
      // Turning off the saved default does not stomp the current Booth View
      // session. It merely converts any default-owned active session into a
      // normal session override until reload/user action.
      state.defaultSessionBooth = false;
      state.savedBoothMissingTicks = 0;
      reconcileLoop();
    }

    updateUI();
    return state.consent;
  }

  function onUserBoothToggle(v, options) {
    const opts = options && typeof options === 'object' ? options : {};
    const previousDefaultSource = !!state.defaultSessionBooth;
    try { dbg('ui.boothToggle', { v: !!v, source: opts.source || 'manual', reason: opts.reason || null }); } catch {}
    const TN = opts.runtime || resolveRuntime();
    state.userBoothOn = !!v;

    if (opts.preserveSource) {
      state.defaultSessionBooth = previousDefaultSource;
    } else if (opts.source === 'default') {
      state.defaultSessionBooth = !!v;
    } else {
      state.defaultSessionBooth = false;
    }
    if (!state.userBoothOn) state.savedBoothMissingTicks = 0;

    const prev = !!state.boothOn;
    state.boothOn = state.userBoothOn;

    if (!state.userBoothOn && prev) {
      state.boothPendingTeardown = true;
      try { teardownBoothNow(TN); } catch {}

      // A real/manual/default Booth shutdown must restore the ordinary editor
      // environment when Black Canvas is already OFF. Internal silent cycles
      // intentionally skip this so their validated rearm sequencing is unchanged.
      if (!state.bgOn && opts.source !== 'internal') {
        try { restoreBTCanvasVisualState(); } catch {}
      }
    }

    if (state.userBoothOn && !prev) {
      try {
        const rt = runtimeNow(TN);
        const t = rt && rt.tokenizer ? rt.tokenizer : null;
        if (t && typeof t.enable === 'function') {
          state.lastRuntimeEnableAt = Date.now();
          t.enable();
        }
      } catch {}
    }

    reconcileLoop();
    updateUI();
  }

  function onComponentToggle(kind, value) {
    const next = !!value;
    const rt = resolveRuntime();

    if (kind === 'lighting') {
      state.persistLightingOn = next;
      if (next) {
        if (!state.capturedLightingState) captureBTLightingState();
        restoreBTLightingState();
      } else {
        if (!state.capturedLightingState) captureBTLightingState();
        resetBTLightingState();
      }
    } else if (kind === 'effects') {
      state.persistEffectsOn = next;
      if (!capturedEffectPasses().length) captureEffectState(rt);
      applyBTComponentEffectState(rt);
    } else if (kind === 'overlays') {
      state.persistOverlaysOn = next;
      if (!capturedEffectPasses().length) captureEffectState(rt);
      applyBTComponentEffectState(rt);
      applyBTComponentPlanes();
    } else if (kind === 'background') {
      state.persistBackgroundOn = next;
      if (state.bgOn && rt && rt.__kwBT) {
        state.btCanvasLayoutKey = null;
        enforceBTBlackCanvas();
      } else {
        applyBTComponentPlanes();
      }
    } else {
      return;
    }

    refreshBTComponentRender();
    saveComponentPreferences();
    updateUI();
  }

  function onUserBgToggle(v) {
    state.bgOn = !!v;

    const rt = resolveRuntime();
    if (rt && rt.__kwBT) {
      if (state.bgOn) {
        state.btCanvasLayoutKey = null;
        enforceBTBlackCanvas();
      } else {
        restoreBTCanvasVisualState();
      }
      reconcileLoop();
      updateUI();
      return;
    }

    if (!state.bgOn) {
      try { restoreOriginalBackdrop(); } catch {}
    } else {
      try { if (!state.capturedMaterial) tryCaptureBackdropFromScene(); } catch {}
      try { captureOriginalBackdrop(); } catch {}
    }
    reconcileLoop();
    updateUI();
  }

  function setDefaultBlackCanvas(v) {
    state.defaultBlackCanvas = !!v;
    gmSet(STORE_BLACK_DEFAULT, !!state.defaultBlackCanvas);
    // A Utilities default change is immediately reflected in the current
    // session; the Booth-tab Black Canvas switch can override it afterward
    // without rewriting the saved default.
    onUserBgToggle(state.defaultBlackCanvas);
    return state.defaultBlackCanvas;
  }

  function kickStartupBlackCanvas(attempt) {
    if (!state.defaultBlackCanvas || !state.bgOn) return;
    const n = Number(attempt) || 0;
    const rt = resolveRuntime();
    if (rt) {
      try { onUserBgToggle(true); } catch {}
      state.startupBlackKicks = Math.max(state.startupBlackKicks, n + 1);
      dbg('default.blackCanvas.startupKick', { attempt: n + 1, runtime: rt.__kwBT ? 'BT' : 'TN' });
    }

    // Hero Forge finishes display setup in delayed passes. Reassert only the
    // Black Canvas display state during that short startup window. v26 replayed
    // the broad component-refresh path here, which in turn refreshed the whole
    // character repeatedly and could reset unrelated figure state.
    const delays = [150, 350, 700, 1400, 2600];
    if (n < delays.length && state.defaultBlackCanvas && state.bgOn) {
      setTimeout(() => {
        if (state.defaultBlackCanvas && state.bgOn) kickStartupBlackCanvas(n + 1);
      }, delays[n]);
    }
  }

  function applyStartupDefaults() {
    if (state.defaultBlackCanvas && state.bgOn) kickStartupBlackCanvas(0);
    if (state.consent) maybeAutoApply(resolveRuntime());
  }

  function startLoop() {
    if (!state.loopActive) {
      state.loopActive = true;
      requestAnimationFrame(() => tick(resolveRuntime()));
    }
  }

  function stopLoop() {
    state.loopActive = false;
  }

  function reconcileLoop() {
    const need = !!state.consent || !!state.userBoothOn || !!state.bgOn;
    if (need) startLoop();
    else stopLoop();
  }

  function teardownBoothOnly() {
    state.boothOn = false;
    state.userBoothOn = false;
    state.autoApplied = false;
    state.boothPendingTeardown = false;
    state.oneShotBackdropRearmArmed = false;
    try { setShaderFrameHidden(false, resolveRuntime()); } catch {}
    try { setBoothFrameHidden(false); } catch {}
    try { teardownBoothNow(resolveRuntime()); } catch {}
    updateUI();
  }

  function boothPublicState() {
    const rt = resolveRuntime();
    const saved = readSavedBoothConfig(rt);
    return {
      featureId: 'booth.persistence',
      version: '27.0.3',
      build: BUILD_TAG,
      defaultBoothPersistence: !!state.consent,
      defaultBlackCanvas: !!state.defaultBlackCanvas,
      sessionBoothView: !!state.userBoothOn,
      sessionBlackCanvas: !!state.bgOn,
      defaultSessionBooth: !!state.defaultSessionBooth,
      savedBoothSetupDetected: !!saved,
      savedBoothMode: saved ? saved.mode : null,
      savedBoothSignals: saved ? saved.signals.slice() : [],
      startupBlackKicks: state.startupBlackKicks,
      seenBooth: !!state.seenBooth,
      autoApplied: !!state.autoApplied,
      loopActive: !!state.loopActive,
      runtimeReady: !!rt,
      runtimeEngineReady: !!(rt && rt.tokenizer),
      characterRootKey: state.characterRootKey
    };
  }

  function reassertBlackCanvasPresentation() {
    try {
      if (!state.bgOn) return false;
      const rt = resolveRuntime();
      if (!rt || !rt.__kwBT) return false;
      return !!enforceBTBlackCanvas();
    } catch {
      return false;
    }
  }

  function installBoothApi() {
    UW[BOOTH_API_KEY] = {
      featureId: 'booth.persistence',
      version: '27.0.3',
      build: BUILD_TAG,
      getState: boothPublicState,
      setDefaultBoothPersistence,
      setDefaultBlackCanvas,
      setSessionBooth: onUserBoothToggle,
      setSessionBlackCanvas: onUserBgToggle,
      reassertBlackCanvasPresentation
    };
  }

  function registerTool() {
    const WD = UW.WitchDock;
    if (!WD || typeof WD.registerTool !== 'function') return false;
    WD.registerTool({
      id: TOOL_ID,
      title: 'Booth',
      tab: 'Booth',
      render: (container, api) => buildUI(container, api)
    });
    return true;
  }

  function boot() {
    if (!registerTool()) setTimeout(boot, 200);
  }

  try {
    UW.KW_WD_BOOTH_DEBUG_DUMP = function () {
      try { return JSON.stringify(state.debugLog, null, 2); } catch { return '[]'; }
    };
    UW.KW_WD_BOOTH_DIAG = function () {
      try {
        const rt = resolveRuntime();
        const env = UW.BT && UW.BT.display ? UW.BT.display.environment : null;
        return JSON.stringify({
          build: BUILD_TAG,
          runtime: rt ? (rt.__kwBT ? 'BT' : 'TN') : null,
          mode: rt ? rt.currentMode : null,
          makerEnabled: !!(rt && rt.tokenizer && rt.tokenizer.enabled),
          makerEnabledFor: rt && rt.tokenizer ? rt.tokenizer._enabledFor : null,
          tokenizerHooked: !!state.tokenizerHooked,
          boothOn: !!state.boothOn,
          userBoothOn: !!state.userBoothOn,
          blackCanvasOn: !!state.bgOn,
          defaultBoothPersistence: !!state.consent,
          defaultBlackCanvas: !!state.defaultBlackCanvas,
          defaultSessionBooth: !!state.defaultSessionBooth,
          savedBoothSetup: (() => {
            try {
              const s = readSavedBoothConfig(rt);
              return s ? { mode: s.mode, signals: s.signals } : null;
            } catch { return null; }
          })(),
          startupBlackKicks: state.startupBlackKicks,
          components: {
            lighting: !!state.persistLightingOn,
            effects: !!state.persistEffectsOn,
            overlays: !!state.persistOverlaysOn,
            background: !!state.persistBackgroundOn
          },
          hasCapturedBackdrop: !!state.capturedMaterial,
          hasCapturedTokenBg: !!state.capturedTokenBg,
          capturedTokenBgSelected: state.capturedTokenBgSelected,
          hasCapturedLighting: !!state.capturedLightingState,
          hasCapturedEffects: !!state.capturedEffectState,
          canvasLayoutKey: state.btCanvasLayoutKey,
          hasEnvironmentMesh: !!(env && env.mesh),
          characterRootKey: state.characterRootKey,
          characterChangedAt: state.characterChangedAt,
          runtimeReady: !!rt,
          runtimeEngineReady: !!(rt && rt.tokenizer),
          loopActive: !!state.loopActive
        }, null, 2);
      } catch (e) {
        return JSON.stringify({ build: BUILD_TAG, error: String(e) }, null, 2);
      }
    };
    UW.KW_WD_BOOTH_BUILD = BUILD_TAG;
    try { console.log('[Booth] build', BUILD_TAG); } catch {}
  } catch {}

  loadPersistentDefaults();
  installBoothApi();
  startLoop();
  applyStartupDefaults();
  boot();
})();

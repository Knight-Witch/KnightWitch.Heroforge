(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const FEATURE_ID = 'booth.black-canvas-display-replay';
  const VERSION = '0.1.1';
  const BUILD = '0.1.1-stable-v24-state-fallback';
  const API_KEY = 'KW_WD_BOOTH_BLACK_REPLAY';
  const POLL_MS = 250;

  const state = {
    enabled: true,
    display: null,
    originalUpdate: null,
    wrappedUpdate: null,
    semanticBackground: null,
    semanticBackgroundVisible: null,
    lastBlackCanvasOn: false,
    pollTimer: null,
    wrapCount: 0,
    replayCount: 0,
    lastReplayAt: 0,
    lastError: null
  };

  function recordError(where, error) {
    state.lastError = {
      where,
      message: String(error && error.message ? error.message : error),
      at: Date.now()
    };
  }

  function isBlackCanvasOn() {
    try {
      const api = UW.KW_WD_BOOTH;
      if (api && typeof api.getState === 'function') {
        const s = api.getState();
        if (s && Object.prototype.hasOwnProperty.call(s, 'sessionBlackCanvas')) {
          return !!s.sessionBlackCanvas;
        }
      }
    } catch (error) {
      recordError('isBlackCanvasOn.api', error);
    }

    try {
      const diag = UW.KW_WD_BOOTH_DIAG;
      if (typeof diag !== 'function') return false;
      const raw = diag();
      const s = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return !!(s && s.blackCanvasOn);
    } catch (error) {
      recordError('isBlackCanvasOn.diag', error);
      return false;
    }
  }

  function currentDisplay() {
    try {
      const CK = UW.CK;
      const display = CK && CK.character ? CK.character.display : null;
      return display && typeof display.update === 'function' ? display : null;
    } catch {
      return null;
    }
  }

  function rendererCanvas() {
    try {
      const CK = UW.CK;
      return CK && CK.renderManager && CK.renderManager.renderer
        ? CK.renderManager.renderer.domElement || null
        : null;
    } catch {
      return null;
    }
  }

  function namedChild(root, name) {
    if (!root || !name) return null;
    const wanted = String(name).toLowerCase();
    try {
      const children = Array.isArray(root.children) ? root.children : [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child && typeof child.name === 'string' && child.name.toLowerCase() === wanted) return child;
      }
    } catch {}
    try {
      if (typeof root.getObjectByName === 'function') {
        const found = root.getObjectByName(name);
        if (found) return found;
      }
    } catch {}
    return null;
  }

  function discoverSemanticBackground() {
    try {
      const BT = UW.BT;
      const overlays = BT && BT.display ? BT.display.overlays : null;
      const scene = overlays && overlays.backgroundPlane ? overlays.backgroundPlane.parent : null;
      if (!scene) return null;

      const environmentRoot = namedChild(scene, 'environment');
      if (!environmentRoot) return null;
      return namedChild(environmentRoot, 'background');
    } catch (error) {
      recordError('discoverSemanticBackground', error);
      return null;
    }
  }

  function restoreSemanticBackground() {
    const node = state.semanticBackground;
    if (!node) return false;
    try {
      if (state.semanticBackgroundVisible !== null) node.visible = !!state.semanticBackgroundVisible;
      state.semanticBackground = null;
      state.semanticBackgroundVisible = null;
      return true;
    } catch (error) {
      recordError('restoreSemanticBackground', error);
      state.semanticBackground = null;
      state.semanticBackgroundVisible = null;
      return false;
    }
  }

  function hideSemanticBackground() {
    try {
      const node = discoverSemanticBackground();
      if (!node) return false;

      if (node !== state.semanticBackground) {
        restoreSemanticBackground();
        state.semanticBackground = node;
        state.semanticBackgroundVisible = 'visible' in node ? !!node.visible : null;
      }

      if ('visible' in node) node.visible = false;
      return true;
    } catch (error) {
      recordError('hideSemanticBackground', error);
      return false;
    }
  }

  function replayBlackCanvas(reason) {
    if (!state.enabled || !isBlackCanvasOn()) return false;

    let applied = false;
    try {
      const BT = UW.BT;
      const display = BT && BT.display ? BT.display : null;
      const env = display ? display.environment : null;
      const overlays = display ? display.overlays : null;

      if (env && typeof env.setDefaultEnvironmentVisibility === 'function') {
        env.setDefaultEnvironmentVisibility(false);
        applied = true;
      }

      if (overlays) {
        if (overlays.framePlane) overlays.framePlane.visible = false;
        if (overlays.shadowPlane) overlays.shadowPlane.visible = false;
        if (overlays.mask && 'visible' in overlays.mask) overlays.mask.visible = false;
        applied = true;
      }

      // Booth.js remains the owner of overlays.backgroundPlane visibility.
      if (hideSemanticBackground()) applied = true;

      const canvas = rendererCanvas();
      if (canvas) {
        canvas.style.backgroundColor = '#000000';
        if (canvas.parentElement) canvas.parentElement.style.backgroundColor = '#000000';
        applied = true;
      }

      if (applied) {
        state.replayCount += 1;
        state.lastReplayAt = Date.now();
      }
      return applied;
    } catch (error) {
      recordError('replayBlackCanvas:' + String(reason || 'unknown'), error);
      return false;
    }
  }

  function unwrapDisplay() {
    const display = state.display;
    const wrapped = state.wrappedUpdate;
    const original = state.originalUpdate;
    try {
      if (display && wrapped && original && display.update === wrapped) display.update = original;
    } catch (error) {
      recordError('unwrapDisplay', error);
    }
    state.display = null;
    state.originalUpdate = null;
    state.wrappedUpdate = null;
  }

  function ensureWrapped() {
    if (!state.enabled) return false;
    const display = currentDisplay();
    if (!display) return false;

    if (display === state.display && display.update === state.wrappedUpdate) return true;
    unwrapDisplay();

    const original = display.update;
    if (typeof original !== 'function') return false;

    const wrapped = function () {
      try {
        return original.apply(this, arguments);
      } finally {
        if (this === display) replayBlackCanvas('display.update');
      }
    };

    try {
      display.update = wrapped;
      if (display.update !== wrapped) return false;
      state.display = display;
      state.originalUpdate = original;
      state.wrappedUpdate = wrapped;
      state.wrapCount += 1;
      return true;
    } catch (error) {
      recordError('ensureWrapped', error);
      return false;
    }
  }

  function poll() {
    if (!state.enabled) return;
    try {
      ensureWrapped();
      const blackOn = isBlackCanvasOn();

      if (blackOn) {
        hideSemanticBackground();
        if (!state.lastBlackCanvasOn) replayBlackCanvas('black-canvas-enabled');
      } else if (state.lastBlackCanvasOn || state.semanticBackground) {
        restoreSemanticBackground();
      }

      state.lastBlackCanvasOn = blackOn;
    } catch (error) {
      recordError('poll', error);
    }
    state.pollTimer = setTimeout(poll, POLL_MS);
  }

  function getState() {
    return {
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      enabled: !!state.enabled,
      wrapped: !!(state.display && state.wrappedUpdate && state.display.update === state.wrappedUpdate),
      blackCanvasOn: isBlackCanvasOn(),
      semanticBackgroundFound: !!state.semanticBackground,
      semanticBackgroundHidden: !!(state.semanticBackground && state.semanticBackground.visible === false),
      wrapCount: state.wrapCount,
      replayCount: state.replayCount,
      lastReplayAt: state.lastReplayAt,
      lastError: state.lastError
    };
  }

  function dispose() {
    state.enabled = false;
    if (state.pollTimer) {
      clearTimeout(state.pollTimer);
      state.pollTimer = null;
    }
    unwrapDisplay();
    restoreSemanticBackground();
    return true;
  }

  try {
    const previous = UW[API_KEY];
    if (previous && typeof previous.dispose === 'function') previous.dispose();
  } catch {}

  UW[API_KEY] = {
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    getState,
    replay: () => replayBlackCanvas('api'),
    dispose
  };

  ensureWrapped();
  if (isBlackCanvasOn()) replayBlackCanvas('install');
  state.lastBlackCanvasOn = isBlackCanvasOn();
  state.pollTimer = setTimeout(poll, POLL_MS);

  try { console.log('[Booth Black Canvas Replay]', VERSION, BUILD); } catch {}
})();
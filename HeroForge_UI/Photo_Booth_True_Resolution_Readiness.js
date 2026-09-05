/*
 * Witch Dock public UI readiness adapter for media.screenshot-resolution.
 * Keeps the direct TRUE 4K / TRUE 8K buttons synchronized with Photo Booth
 * readiness after the capture provider has already installed before Booth opens.
 */
(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const GLOBAL = 'KWPhotoBoothTrueResolutionReadiness';
  const BUILD = '1.0.0-public-readiness';
  const BUTTON_SELECTOR = '.kwPBResBtn';
  const SOURCE_SIZE = 4096;
  let timer = null;

  function rendererSupportsSource() {
    try {
      const CK = UW.CK;
      const renderer = (CK && CK.renderManager && CK.renderManager.renderer)
        || (CK && CK.Capture && CK.Capture.renderer)
        || null;
      const maxTexture = renderer && renderer.capabilities
        ? Number(renderer.capabilities.maxTextureSize) || null
        : null;
      if (maxTexture !== null && maxTexture < SOURCE_SIZE) return false;
      if (renderer && typeof renderer.getContext === 'function') {
        const gl = renderer.getContext();
        if (gl) {
          const maxRenderbuffer = Number(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)) || null;
          if (maxRenderbuffer !== null && maxRenderbuffer < SOURCE_SIZE) return false;
        }
      }
      return true;
    } catch (_) {
      return false;
    }
  }

  function isReady() {
    try {
      const service = UW.KWPhotoBoothTrueResolution;
      const CK = UW.CK;
      const BT = UW.BT;
      const last = service && service.lastCapture;
      return !!(
        service
        && service.enabled
        && service.providerInstalled
        && !service.providerLost
        && (!last || last.status !== 'running')
        && BT && BT.maker && BT.maker.enabled === true
        && typeof BT.maker.takeScreenshot === 'function'
        && CK && CK.Effects && typeof CK.Effects.renderToCanvas === 'function'
        && rendererSupportsSource()
      );
    } catch (_) {
      return false;
    }
  }

  function sync() {
    const disabled = !isReady();
    const buttons = document.querySelectorAll(BUTTON_SELECTOR);
    for (const button of buttons) {
      try { button.disabled = disabled; } catch (_) {}
    }
    return !disabled;
  }

  function initialize() {
    if (timer) return true;
    sync();
    timer = window.setInterval(sync, 500);
    return true;
  }

  function dispose() {
    if (timer) window.clearInterval(timer);
    timer = null;
    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }
    return true;
  }

  UW[GLOBAL] = { build: BUILD, sync, initialize, dispose };
  initialize();
})();

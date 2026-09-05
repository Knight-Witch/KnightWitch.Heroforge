// ==UserScript==
// @name         Witch Dock - Photo Resolution DEV Loader
// @namespace    KnightWitch
// @version      0.1.0
// @description  Loads the WITCH_DEV_PHOTO high-resolution Photo Booth module into the installed Witch Dock for integration testing.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const MODULE_URL = 'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_PHOTO/features/media/Photo_Booth_True_Resolution.js';
  const EXPECTED_BUILD = '0.7.0-witch-dock-dev-provider';
  const GLOBAL = 'KWPhotoBoothTrueResolution';

  function loadText(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { 'Cache-Control': 'no-cache' },
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) resolve(res.responseText || '');
          else reject(new Error(`HTTP ${res.status} loading Photo Resolution DEV module.`));
        },
        onerror: () => reject(new Error('Network error loading Photo Resolution DEV module.')),
        ontimeout: () => reject(new Error('Timeout loading Photo Resolution DEV module.'))
      });
    });
  }

  async function boot() {
    try {
      const existing = UW[GLOBAL];
      if (existing && existing.build === EXPECTED_BUILD) {
        if (typeof existing.initialize === 'function') existing.initialize();
        return;
      }

      const code = await loadText(MODULE_URL);
      if (!code) throw new Error('Photo Resolution DEV module was empty.');
      new Function(code)();

      const loaded = UW[GLOBAL];
      if (!loaded || loaded.build !== EXPECTED_BUILD) {
        throw new Error(`Photo Resolution DEV module did not expose expected build ${EXPECTED_BUILD}.`);
      }
      try { console.log('[Witch Dock][Photo Resolution DEV] loaded', EXPECTED_BUILD); } catch (_) {}
    } catch (error) {
      try { console.error('[Witch Dock][Photo Resolution DEV Loader]', error); } catch (_) {}
    }
  }

  boot();
})();

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const FEATURE_ID = 'booth.runtime-bootstrap';
  const VERSION = '0.1.1';
  const BUILD = '0.1.1-dev-native-loader-coordination';
  const API_KEY = 'KW_WD_BOOTH_BOOTSTRAP';
  const STORE_CONSENT = 'kw.witchDock.booth.consent.v1';
  const POLL_MS = 200;
  const STABLE_REQUIRED = 4;
  const RUNTIME_TIMEOUT_MS = 12000;

  const state = {
    enabled: true,
    timer: null,
    stableDataRef: null,
    stableMode: null,
    stableSignature: '',
    stableCount: 0,
    activeDataRef: null,
    inFlight: false,
    completedForDataRef: null,
    attempts: 0,
    bootstrapCount: 0,
    lastMode: null,
    lastSignals: [],
    lastVersion: null,
    lastScriptPath: null,
    lastScriptUrl: null,
    loaderStrategy: null,
    lastStartedAt: 0,
    lastCompletedAt: 0,
    lastError: null
  };

  function recordError(where, error) {
    state.lastError = {
      where,
      message: String(error && error.message ? error.message : error),
      at: Date.now()
    };
  }

  function readStoredBoolean(key, fallback) {
    try {
      if (typeof GM_getValue === 'function') {
        const value = GM_getValue(key, null);
        if (value !== null && value !== undefined) return !!value;
      }
    } catch {}
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return !!JSON.parse(raw);
    } catch {}
    return !!fallback;
  }

  function persistenceEnabled() {
    return readStoredBoolean(STORE_CONSENT, false);
  }

  function currentDataRef() {
    try {
      return UW.CK && UW.CK.data ? UW.CK.data : null;
    } catch {
      return null;
    }
  }

  function addSignal(out, name, value) {
    if (value !== null && value !== undefined && value !== false) out.push(name);
  }

  function strongSavedConfig() {
    try {
      const CK = UW.CK;
      const data = CK && CK.data ? CK.data : null;
      const custom = data && data.custom && typeof data.custom === 'object' ? data.custom : null;
      if (!data || !custom) return null;

      const preferred = ['portrait', 'token'];
      const extra = Object.keys(custom).filter((key) => !preferred.includes(key));
      const modes = preferred.concat(extra);

      for (let i = 0; i < modes.length; i += 1) {
        const key = modes[i];
        const cfg = custom[key];
        if (!cfg || typeof cfg !== 'object') continue;

        const filters = cfg.filters && typeof cfg.filters === 'object' ? cfg.filters : null;
        const selected = cfg.selected && typeof cfg.selected === 'object' ? cfg.selected : null;
        const signals = [];

        addSignal(signals, 'cameraSave', cfg.cameraSave);
        addSignal(signals, 'lighting', cfg.lighting);
        addSignal(signals, 'effects', cfg.effects);
        addSignal(signals, 'filters.tokenBg', filters && filters.tokenBg);
        addSignal(signals, 'filters.tokenFrame', filters && filters.tokenFrame);
        if (selected && selected.tokenBg !== undefined && selected.tokenBg !== null) signals.push('selected.tokenBg');
        if (selected && selected.tokenFrame !== undefined && selected.tokenFrame !== null) signals.push('selected.tokenFrame');

        // Bare camera state is intentionally not enough. Fresh/new figures can
        // have ordinary camera data without ever having a saved Photo Booth setup.
        if (!signals.length) continue;

        let mode = key;
        try {
          const candidate = cfg.camera && typeof cfg.camera.tokenizerMode === 'string'
            ? cfg.camera.tokenizerMode
            : (cfg.cameraSave && typeof cfg.cameraSave.tokenizerMode === 'string'
                ? cfg.cameraSave.tokenizerMode
                : null);
          if (candidate) mode = candidate;
        } catch {}

        return {
          dataRef: data,
          mode,
          signals,
          signature: mode + '|' + signals.slice().sort().join(',')
        };
      }
    } catch (error) {
      recordError('strongSavedConfig', error);
    }
    return null;
  }

  function deriveHeroForgeVersion() {
    const candidates = [];
    try {
      const scripts = Array.from(document.scripts || []);
      for (let i = 0; i < scripts.length; i += 1) {
        if (scripts[i] && scripts[i].src) candidates.push(scripts[i].src);
      }
    } catch {}
    try {
      const resources = performance.getEntriesByType ? performance.getEntriesByType('resource') : [];
      for (let i = 0; i < resources.length; i += 1) {
        if (resources[i] && resources[i].name) candidates.push(resources[i].name);
      }
    } catch {}

    for (let i = 0; i < candidates.length; i += 1) {
      try {
        const url = new URL(candidates[i], location.href);
        const version = url.searchParams.get('version');
        if (version && /^heroforge/i.test(version)) return version;
      } catch {}
    }

    const direct = [
      () => UW.HF_VERSION,
      () => UW.CK && UW.CK.version,
      () => UW.CK && UW.CK.VERSION
    ];
    for (let i = 0; i < direct.length; i += 1) {
      try {
        const value = direct[i]();
        if (typeof value === 'string' && /^heroforge/i.test(value)) return value;
      } catch {}
    }
    return null;
  }

  function boothScriptPath() {
    const version = deriveHeroForgeVersion();
    state.lastVersion = version;
    const path = '/gated/booth.js' + (version ? '?version=' + encodeURIComponent(version) : '');
    state.lastScriptPath = path;
    try { state.lastScriptUrl = new URL(path, location.origin).href; }
    catch { state.lastScriptUrl = path; }
    return path;
  }

  function matchingBoothScripts(path) {
    let wanted = null;
    try { wanted = new URL(path, location.href).href; } catch {}
    if (!wanted) return [];
    try {
      return Array.from(document.scripts || []).filter((script) => {
        try {
          const raw = script.getAttribute('src') || script.src || '';
          return new URL(raw, location.href).href === wanted;
        } catch {
          return false;
        }
      });
    } catch {
      return [];
    }
  }

  function scriptDiagnostics(path) {
    const scripts = matchingBoothScripts(path || state.lastScriptPath || boothScriptPath());
    return {
      count: scripts.length,
      duplicateCount: Math.max(0, scripts.length - 1),
      scripts: scripts.map((script) => ({
        srcAttribute: script.getAttribute('src') || '',
        status: script.getAttribute('data-status') || null,
        bootstrapOwned: script.getAttribute('data-kw-booth-runtime-bootstrap') === '1',
        parent: script.parentElement ? script.parentElement.tagName : null
      }))
    };
  }

  function waitFor(predicate, timeoutMs, intervalMs) {
    const started = Date.now();
    const delay = Math.max(25, Number(intervalMs) || 50);
    return new Promise((resolve, reject) => {
      const step = () => {
        let value = null;
        try { value = predicate(); } catch {}
        if (value) return resolve(value);
        if (Date.now() - started >= timeoutMs) return reject(new Error('Timed out waiting for HeroForge Booth runtime.'));
        setTimeout(step, delay);
      };
      step();
    });
  }

  function waitForNativeBoothCore() {
    return waitFor(
      () => UW.BT && typeof UW.BT.setBoothMode === 'function' ? UW.BT : null,
      RUNTIME_TIMEOUT_MS,
      50
    );
  }

  function loadNativeBoothCore() {
    try {
      if (UW.BT && typeof UW.BT.setBoothMode === 'function') {
        state.loaderStrategy = 'reuse-live-bt';
        return Promise.resolve(UW.BT);
      }
    } catch {}

    return new Promise((resolve, reject) => {
      try {
        const path = boothScriptPath();
        const existing = matchingBoothScripts(path);
        if (existing.length) {
          state.loaderStrategy = existing.some((script) => script.getAttribute('data-kw-booth-runtime-bootstrap') === '1')
            ? 'reuse-bootstrap-script'
            : 'reuse-heroforge-script';
          waitForNativeBoothCore().then(resolve, reject);
          return;
        }

        // Match HeroForge's own lazy-script contract exactly enough for its
        // loader to recognize this request later: relative src attribute,
        // BODY ownership, async execution, and data-status lifecycle.
        const script = document.createElement('script');
        script.setAttribute('src', path);
        script.async = true;
        script.setAttribute('data-status', 'loading');
        script.dataset.kwBoothRuntimeBootstrap = '1';
        state.loaderStrategy = 'hero-forge-compatible-script';
        script.onload = () => {
          try { script.setAttribute('data-status', 'loaded'); } catch {}
          waitForNativeBoothCore().then(resolve, reject);
        };
        script.onerror = () => {
          try { script.setAttribute('data-status', 'error'); } catch {}
          reject(new Error('HeroForge native booth.js failed to load.'));
        };
        (document.body || document.head || document.documentElement).appendChild(script);
      } catch (error) {
        reject(error);
      }
    });
  }

  async function reconcileWitchDockDefaults() {
    try {
      const api = await waitFor(
        () => UW.KW_WD_BOOTH && typeof UW.KW_WD_BOOTH.getState === 'function' ? UW.KW_WD_BOOTH : null,
        5000,
        50
      );
      const current = api.getState() || {};
      if (current.defaultBoothPersistence && !current.sessionBoothView && typeof api.setSessionBooth === 'function') {
        api.setSessionBooth(true, { source: 'default', reason: 'runtime-bootstrap' });
      }
      const afterBooth = api.getState() || current;
      if (afterBooth.defaultBlackCanvas && !afterBooth.sessionBlackCanvas && typeof api.setSessionBlackCanvas === 'function') {
        api.setSessionBlackCanvas(true);
      }
      return true;
    } catch (error) {
      recordError('reconcileWitchDockDefaults', error);
      return false;
    }
  }

  async function bootstrap(saved) {
    if (!saved || state.inFlight || !state.enabled) return false;
    state.inFlight = true;
    state.attempts += 1;
    state.lastStartedAt = Date.now();
    state.lastMode = saved.mode;
    state.lastSignals = saved.signals.slice();
    state.lastError = null;

    try {
      const BT = await loadNativeBoothCore();
      if (!BT || typeof BT.setBoothMode !== 'function') throw new Error('BT.setBoothMode unavailable after native Booth load.');

      const result = BT.setBoothMode(saved.mode);
      if (result && typeof result.then === 'function') await result;

      await waitFor(() => {
        try {
          const engine = UW.BT && (UW.BT.liveEngine || UW.BT.maker);
          return engine && engine.enabled ? engine : null;
        } catch {
          return null;
        }
      }, RUNTIME_TIMEOUT_MS, 50);

      const topology = scriptDiagnostics(state.lastScriptPath);
      if (topology.duplicateCount > 0) {
        throw new Error('Duplicate HeroForge Booth script detected after bootstrap; refusing to mark bootstrap complete.');
      }

      await reconcileWitchDockDefaults();
      state.completedForDataRef = saved.dataRef;
      state.bootstrapCount += 1;
      state.lastCompletedAt = Date.now();
      return true;
    } catch (error) {
      recordError('bootstrap', error);
      return false;
    } finally {
      state.inFlight = false;
    }
  }

  function resetStable() {
    state.stableDataRef = null;
    state.stableMode = null;
    state.stableSignature = '';
    state.stableCount = 0;
  }

  function poll() {
    if (!state.enabled) return;
    try {
      const dataRef = currentDataRef();
      if (dataRef !== state.activeDataRef) {
        state.activeDataRef = dataRef;
        resetStable();
      }

      if (!persistenceEnabled()) {
        resetStable();
      } else {
        const saved = strongSavedConfig();
        if (!saved) {
          resetStable();
        } else {
          const same = saved.dataRef === state.stableDataRef &&
            saved.mode === state.stableMode &&
            saved.signature === state.stableSignature;
          if (same) {
            state.stableCount += 1;
          } else {
            state.stableDataRef = saved.dataRef;
            state.stableMode = saved.mode;
            state.stableSignature = saved.signature;
            state.stableCount = 1;
          }

          if (state.stableCount >= STABLE_REQUIRED &&
              state.completedForDataRef !== saved.dataRef &&
              !state.inFlight) {
            bootstrap(saved);
          }
        }
      }
    } catch (error) {
      recordError('poll', error);
    }
    state.timer = setTimeout(poll, POLL_MS);
  }

  function getState() {
    const topology = scriptDiagnostics(state.lastScriptPath || undefined);
    return {
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      enabled: !!state.enabled,
      persistenceEnabled: persistenceEnabled(),
      stableCount: state.stableCount,
      stableRequired: STABLE_REQUIRED,
      inFlight: !!state.inFlight,
      attempts: state.attempts,
      bootstrapCount: state.bootstrapCount,
      lastMode: state.lastMode,
      lastSignals: state.lastSignals.slice(),
      lastHeroForgeVersion: state.lastVersion,
      lastScriptPath: state.lastScriptPath,
      lastScriptUrl: state.lastScriptUrl,
      loaderStrategy: state.loaderStrategy,
      matchingBoothScriptCount: topology.count,
      duplicateBoothScriptCount: topology.duplicateCount,
      boothScripts: topology.scripts,
      lastStartedAt: state.lastStartedAt,
      lastCompletedAt: state.lastCompletedAt,
      lastError: state.lastError,
      btPresent: !!UW.BT,
      btSetBoothMode: !!(UW.BT && typeof UW.BT.setBoothMode === 'function')
    };
  }

  function dispose() {
    state.enabled = false;
    if (state.timer) {
      clearTimeout(state.timer);
      state.timer = null;
    }
    resetStable();
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
    dispose
  };

  state.timer = setTimeout(poll, POLL_MS);
  try { console.log('[Booth Runtime Bootstrap]', VERSION, BUILD); } catch {}
})();

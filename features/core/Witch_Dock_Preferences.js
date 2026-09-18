(function () {
  "use strict";

  const FEATURE_ID = "witch-dock-preferences";
  const VERSION = "0.1.0";
  const BUILD = "0.1.0-main-store-host";
  const STORE_KEY = "kw.witchDock.v1";
  const DEFAULTS = Object.freeze({
    x: null,
    y: null,
    width: 380,
    height: 520,
    minimized: false,
    closed: false,
    lastOpenWidth: 380,
    lastOpenHeight: 520,
    lastOpenX: null,
    lastOpenY: null,
    lastOpenAnchored: true,
    activeTab: null,
    compactX: 16,
    compactY: null,
    firstRun: false
  });

  let STORAGE = null;
  const STATE = {
    configured: false,
    loads: 0,
    saves: 0,
    lastLoadFirstRun: null,
    lastLoaded: null,
    lastSaved: null,
    lastError: null
  };

  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_) { return value; }
  }

  function configure(options) {
    const opts = options && typeof options === "object" ? options : {};
    const storage = opts.storage;
    if (!storage || typeof storage.get !== "function" || typeof storage.set !== "function") {
      throw new Error("Witch Dock Preferences requires bounded storage.get/storage.set.");
    }
    STORAGE = storage;
    STATE.configured = true;
    STATE.lastError = null;
    return true;
  }

  function requireStorage() {
    if (!STORAGE) throw new Error("Witch Dock Preferences is not configured.");
    return STORAGE;
  }

  function recordLoaded(value) {
    STATE.loads += 1;
    STATE.lastLoadFirstRun = !!(value && value.firstRun);
    STATE.lastLoaded = clone(value);
    return value;
  }

  function firstRunDefaults() {
    return { ...DEFAULTS, firstRun: true };
  }

  function load() {
    try {
      const raw = requireStorage().get(STORE_KEY, null);
      if (!raw) {
        STATE.lastError = null;
        return recordLoaded(firstRunDefaults());
      }
      const obj = JSON.parse(raw);
      if (!obj || typeof obj !== "object") {
        STATE.lastError = null;
        return recordLoaded(firstRunDefaults());
      }
      STATE.lastError = null;
      return recordLoaded({ ...DEFAULTS, ...obj, firstRun: false });
    } catch (error) {
      STATE.lastError = error && error.message ? error.message : String(error || "preference load failed");
      return recordLoaded(firstRunDefaults());
    }
  }

  function save(prefs) {
    try {
      requireStorage().set(STORE_KEY, JSON.stringify(prefs));
      STATE.saves += 1;
      STATE.lastSaved = clone(prefs);
      STATE.lastError = null;
      return true;
    } catch (error) {
      STATE.lastError = error && error.message ? error.message : String(error || "preference save failed");
      return false;
    }
  }

  function getState() {
    return {
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      storeKey: STORE_KEY,
      configured: STATE.configured,
      loads: STATE.loads,
      saves: STATE.saves,
      lastLoadFirstRun: STATE.lastLoadFirstRun,
      lastLoaded: clone(STATE.lastLoaded),
      lastSaved: clone(STATE.lastSaved),
      lastError: STATE.lastError
    };
  }

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  UW.KWWitchDockPreferences = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    storeKey: STORE_KEY,
    defaults: DEFAULTS,
    configure,
    load,
    save,
    getState
  });
})();
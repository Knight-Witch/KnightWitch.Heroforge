(function () {
  "use strict";

  const FEATURE_ID = "witch-dock-preferences";
  const VERSION = "0.3.0";
  const BUILD = "0.3.0-tool-enablement-store";
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
  let PAGE_STORAGE = null;
  const STATE = {
    configured: false,
    loads: 0,
    saves: 0,
    lastLoadFirstRun: null,
    lastLoaded: null,
    lastSaved: null,
    sectionCollapsedReads: 0,
    sectionCollapsedWrites: 0,
    sectionOrderReads: 0,
    sectionOrderWrites: 0,
    lastSectionKey: null,
    lastSectionOrderKey: null,
    toolEnableHostReads: 0,
    toolEnablePageReads: 0,
    toolEnablePageWrites: 0,
    toolEnableHostWrites: 0,
    lastToolEnableKey: null,
    lastToolEnableSource: null,
    lastError: null
  };

  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_) { return value; }
  }

  function configure(options) {
    const opts = options && typeof options === "object" ? options : {};
    const storage = opts.storage;
    const pageStorage = opts.pageStorage;
    if (!storage || typeof storage.get !== "function" || typeof storage.set !== "function") {
      throw new Error("Witch Dock Preferences requires bounded storage.get/storage.set.");
    }
    if (!pageStorage || typeof pageStorage.getItem !== "function" || typeof pageStorage.setItem !== "function") {
      throw new Error("Witch Dock Preferences requires bounded pageStorage.getItem/pageStorage.setItem.");
    }
    STORAGE = storage;
    PAGE_STORAGE = pageStorage;
    STATE.configured = true;
    STATE.lastError = null;
    return true;
  }

  function requireStorage() {
    if (!STORAGE) throw new Error("Witch Dock Preferences is not configured.");
    return STORAGE;
  }

  function requirePageStorage() {
    if (!PAGE_STORAGE) throw new Error("Witch Dock Preferences page storage is not configured.");
    return PAGE_STORAGE;
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


  function sectionCollapsedKey(toolId, sectionId) {
    return `kw.witchDock.ui.${toolId}.${sectionId}.collapsed`;
  }

  function getSectionCollapsed(toolId, sectionId, defaultCollapsed) {
    const key = sectionCollapsedKey(toolId, sectionId);
    STATE.sectionCollapsedReads += 1;
    STATE.lastSectionKey = key;
    try {
      const value = requireStorage().get(key, null);
      STATE.lastError = null;
      if (value === null || value === undefined) return !!defaultCollapsed;
      return !!value;
    } catch (error) {
      STATE.lastError = error && error.message ? error.message : String(error || "section collapsed read failed");
      return !!defaultCollapsed;
    }
  }

  function setSectionCollapsed(toolId, sectionId, collapsed) {
    const key = sectionCollapsedKey(toolId, sectionId);
    STATE.lastSectionKey = key;
    try {
      requireStorage().set(key, !!collapsed);
      STATE.sectionCollapsedWrites += 1;
      STATE.lastError = null;
      return true;
    } catch (error) {
      STATE.lastError = error && error.message ? error.message : String(error || "section collapsed write failed");
      return false;
    }
  }

  function sectionOrderKey(toolId) {
    return `kw.witchDock.sectionOrder.${toolId}`;
  }

  function getSectionOrder(toolId) {
    const key = sectionOrderKey(toolId);
    STATE.sectionOrderReads += 1;
    STATE.lastSectionOrderKey = key;
    try {
      const raw = requireStorage().get(key, null);
      STATE.lastError = null;
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
    } catch (error) {
      STATE.lastError = error && error.message ? error.message : String(error || "section order read failed");
      return [];
    }
  }

  function setSectionOrder(toolId, order) {
    const key = sectionOrderKey(toolId);
    STATE.lastSectionOrderKey = key;
    try {
      requireStorage().set(key, JSON.stringify(order));
      STATE.sectionOrderWrites += 1;
      STATE.lastError = null;
      return true;
    } catch (error) {
      STATE.lastError = error && error.message ? error.message : String(error || "section order write failed");
      return false;
    }
  }


  function toolEnabledKey(toolId) {
    return `kw.witchDock.toolEnabled.${toolId}`;
  }

  function getToolEnabledFromHost(toolId, enabledByDefault) {
    const key = toolEnabledKey(toolId);
    STATE.toolEnableHostReads += 1;
    STATE.lastToolEnableKey = key;
    STATE.lastToolEnableSource = "host";
    try {
      const value = requireStorage().get(key, null);
      STATE.lastError = null;
      if (value === null || value === undefined) return !!enabledByDefault;
      return !!value;
    } catch (error) {
      STATE.lastError = error && error.message ? error.message : String(error || "tool enable host read failed");
      return !!enabledByDefault;
    }
  }

  function getToolEnabledFromPage(toolId, enabledByDefault) {
    const key = toolEnabledKey(toolId);
    STATE.toolEnablePageReads += 1;
    STATE.lastToolEnableKey = key;
    STATE.lastToolEnableSource = "page";
    try {
      const raw = requirePageStorage().getItem(key);
      STATE.lastError = null;
      if (raw !== null && raw !== undefined && raw !== "") return raw === "true" || raw === "1";
      return !!enabledByDefault;
    } catch (error) {
      STATE.lastError = error && error.message ? error.message : String(error || "tool enable page read failed");
      return !!enabledByDefault;
    }
  }

  function getToolEnabled(toolId, enabledByDefault) {
    const key = toolEnabledKey(toolId);
    STATE.toolEnablePageReads += 1;
    STATE.lastToolEnableKey = key;
    STATE.lastToolEnableSource = "page";
    try {
      const raw = requirePageStorage().getItem(key);
      if (raw !== null && raw !== undefined && raw !== "") {
        STATE.lastError = null;
        return raw === "true" || raw === "1";
      }
    } catch (error) {
      STATE.lastError = error && error.message ? error.message : String(error || "tool enable page read failed");
    }
    STATE.toolEnableHostReads += 1;
    STATE.lastToolEnableSource = "host";
    try {
      const value = requireStorage().get(key, null);
      STATE.lastError = null;
      if (value !== null && value !== undefined) return !!value;
    } catch (error) {
      STATE.lastError = error && error.message ? error.message : String(error || "tool enable host read failed");
    }
    return !!enabledByDefault;
  }

  function setToolEnabled(toolId, value) {
    const key = toolEnabledKey(toolId);
    const enabled = !!value;
    const errors = [];
    STATE.lastToolEnableKey = key;
    try {
      requirePageStorage().setItem(key, enabled ? "true" : "false");
      STATE.toolEnablePageWrites += 1;
    } catch (error) {
      errors.push(error && error.message ? error.message : String(error || "tool enable page write failed"));
    }
    try {
      requireStorage().set(key, enabled);
      STATE.toolEnableHostWrites += 1;
    } catch (error) {
      errors.push(error && error.message ? error.message : String(error || "tool enable host write failed"));
    }
    STATE.lastToolEnableSource = "page+host";
    STATE.lastError = errors.length ? errors.join("; ") : null;
    return errors.length === 0;
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
      sectionCollapsedReads: STATE.sectionCollapsedReads,
      sectionCollapsedWrites: STATE.sectionCollapsedWrites,
      sectionOrderReads: STATE.sectionOrderReads,
      sectionOrderWrites: STATE.sectionOrderWrites,
      lastSectionKey: STATE.lastSectionKey,
      lastSectionOrderKey: STATE.lastSectionOrderKey,
      toolEnableHostReads: STATE.toolEnableHostReads,
      toolEnablePageReads: STATE.toolEnablePageReads,
      toolEnablePageWrites: STATE.toolEnablePageWrites,
      toolEnableHostWrites: STATE.toolEnableHostWrites,
      lastToolEnableKey: STATE.lastToolEnableKey,
      lastToolEnableSource: STATE.lastToolEnableSource,
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
    sectionCollapsedKey,
    getSectionCollapsed,
    setSectionCollapsed,
    sectionOrderKey,
    getSectionOrder,
    setSectionOrder,
    toolEnabledKey,
    getToolEnabledFromHost,
    getToolEnabledFromPage,
    getToolEnabled,
    setToolEnabled,
    getState
  });
})();
// ==UserScript==
// @name         WITCH DOCK - DEV
// @namespace    KnightWitch
// @version      1.4.10
// @description  Witch Dock issue #10 architecture task channel.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/wd/10-modular-bootstrap/Witch_Dock_DEV.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/wd/10-modular-bootstrap/Witch_Dock_DEV.user.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const DEV_VERSION = "1.4.10";
  const DEV_SCRIPT_NAME = "WITCH DOCK - DEV";
  const DEV_NAME = `${DEV_SCRIPT_NAME} v${DEV_VERSION}`;
  const DEV_BRANCH = "wd/10-modular-bootstrap";
  const REPO_RAW = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge";
  const CORE_URL = `${REPO_RAW}/${DEV_BRANCH}/Witch_Dock.user.js`;
  const DEV_MANIFEST_URL = `${REPO_RAW}/${DEV_BRANCH}/manifest.json`;
  const CORE_STYLES_VERSION = "0.1.0";
  const CORE_STYLES_BUILD = "0.1.0-extracted-core-css";
  const CORE_STYLES_URL = `${REPO_RAW}/${DEV_BRANCH}/features/core/Witch_Dock_Styles.css?v=${CORE_STYLES_VERSION}-${CORE_STYLES_BUILD}`;
  const CORE_MODALS_VERSION = "0.1.1";
  const CORE_MODALS_BUILD = "0.1.1-lazy-about-open";
  const CORE_MODALS_URL = `${REPO_RAW}/${DEV_BRANCH}/features/core/Witch_Dock_Modals.js?v=${CORE_MODALS_VERSION}-${CORE_MODALS_BUILD}`;
  const CORE_BONE_HUD_VERSION = "0.1.0";
  const CORE_BONE_HUD_BUILD = "0.1.0-extracted-bone-hud";
  const CORE_BONE_HUD_URL = `${REPO_RAW}/${DEV_BRANCH}/features/core/Witch_Dock_Bone_HUD.js?v=${CORE_BONE_HUD_VERSION}-${CORE_BONE_HUD_BUILD}`;
  const CORE_PREFERENCES_VERSION = "0.3.0";
  const CORE_PREFERENCES_BUILD = "0.3.0-tool-enablement-store";
  const CORE_PREFERENCES_URL = `${REPO_RAW}/${DEV_BRANCH}/features/core/Witch_Dock_Preferences.js?v=${CORE_PREFERENCES_VERSION}-${CORE_PREFERENCES_BUILD}`;
  const CORE_REGISTRY_VERSION = "0.1.0";
  const CORE_REGISTRY_BUILD = "0.1.0-tab-tool-state-containers";
  const CORE_REGISTRY_URL = `${REPO_RAW}/${DEV_BRANCH}/features/core/Witch_Dock_Registry.js?v=${CORE_REGISTRY_VERSION}-${CORE_REGISTRY_BUILD}`;
  const CORE_SHELL_VERSION = "0.2.0";
  const CORE_SHELL_BUILD = "0.2.0-main-and-compact-dom";
  const CORE_SHELL_URL = `${REPO_RAW}/${DEV_BRANCH}/features/core/Witch_Dock_Shell.js?v=${CORE_SHELL_VERSION}-${CORE_SHELL_BUILD}`;
  const CORE_INTERACTIONS_VERSION = "0.4.0";
  const CORE_INTERACTIONS_BUILD = "0.4.0-compact-drag-click";
  const CORE_INTERACTIONS_URL = `${REPO_RAW}/${DEV_BRANCH}/features/core/Witch_Dock_Interactions.js?v=${CORE_INTERACTIONS_VERSION}-${CORE_INTERACTIONS_BUILD}`;
  const GITHUB_REPO_URL = "https://github.com/Knight-Witch/KnightWitch.Heroforge";
  const KOFI_URL = "https://ko-fi.com/knightwitch";
  const STABLE_MANIFEST_DECL = 'const MANIFEST_URL = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/manifest.json";';
  const DEV_MANIFEST_DECL = `const MANIFEST_URL = "${DEV_MANIFEST_URL}";`;
  const INLINE_EMBLEM_DECL_RE = /^const COMPACT_EMBLEM_URL = "data:image\/png;base64,[A-Za-z0-9+/=]+";$/m;
  const STYLE_FUNCTION_START = '  function addStyles() {\n    GM_addStyle(`\n';
  const STYLE_FUNCTION_END = '\n`);\n  }\n\n  function el(';
  const INLINE_COMPACT_ICON_RULE = '#kwWDCompactIcon{\n  width: 40px;\n  height: 40px;';
  const EXTRACTED_COMPACT_ICON_RULE = '#kwWDCompactIcon{\n  width: 48px;\n  height: 48px;';
  const MODAL_BLOCK_START = '  function closeAboutModal() {';
  const MODAL_BLOCK_END = '\nfunction buildUI() {';
  const MODAL_FUNCTION_NAMES = Object.freeze([
    "closeAboutModal",
    "openAboutModal",
    "ensureAboutModal",
    "closeDisclaimerModal",
    "openDisclaimerModal",
    "ensureDisclaimerModal"
  ]);
  const BONE_BLOCK_START = 'function initBoneFooterAndDetection() {';
  const BONE_BLOCK_END = '\n\n  function closeAboutModal() {';
  const PREFS_DECL_START = '  const STORE_KEY = "kw.witchDock.v1";';
  const PREFS_DECL_END = '\n\n  const state = {';
  const PREFS_IO_START = '  function loadPrefs() {';
  const PREFS_IO_END = '\n\n  const prefs = loadPrefs();';
  const SECTION_COLLAPSE_STORAGE_START = 'function toolSectionKey(toolId, sectionId) {';
  const SECTION_COLLAPSE_STORAGE_END = '\n\n  function createSection(toolId, opts) {';
  const SECTION_ORDER_STORAGE_START = 'const SECTION_ORDER_PREFIX = "kw.witchDock.sectionOrder.";';
  const SECTION_ORDER_STORAGE_END = '\n\nfunction saveSectionOrderFromDom(toolId, container) {';
  const TOOL_ENABLE_STORAGE_START = 'function getToolEnabled(toolId, enabledByDefault) {';
  const TOOL_ENABLE_STORAGE_END = '\n\nasync function loadManifestAndTools() {';
  const REGISTRY_STATE_BLOCK = '    tabs: new Map(),\n    toolsById: new Map(),\n    pending: [],';
  const SHELL_ROOT_START = '    state.root = el("div", { id: "kwWitchDock" }, [';
  const SHELL_ROOT_END = '\n\n    initBoneFooterAndDetection();';
  const COMPACT_DOM_START = '    state.compact = el("div", { id: "kwWDCompact", title: "Open Witch Dock", onpointerdown: startCompactDrag }, [';
  const COMPACT_DOM_END = '\n    state.compactExpandBtn = null;';
  const DOCK_DRAG_START = '  function startDockDrag(e) {';
  const DOCK_DRAG_END = '\n\n  function startResizeCorner(e) {';
  const DOCK_RESIZE_START = '  function startResizeCorner(e) {';
  const DOCK_RESIZE_END = '\n\n  function toggleMinimize() {';
  const DOCK_LIFECYCLE_START = '  function toggleMinimize() {';
  const DOCK_LIFECYCLE_END = '\n\n  function startCompactDrag(e) {';
  const COMPACT_DRAG_START = '  function startCompactDrag(e) {';
  const COMPACT_DRAG_END = '\n\n  function isEditableTarget(t) {';
  const DOCK_SNAPSHOT_START = '  function snapshotCurrentDockPositionToPrefs() {';
  const DOCK_SNAPSHOT_END = '\n\n  function applyPositionAndSize() {';
  const HOST_API_VERSION = "0.1.0";
  const STORAGE_PREFIX = "kw.";
  const REPO_RAW_PREFIX = `${REPO_RAW}/`;
  const COMPACT_ICON_SIZE_PX = 48;

  const state = {
    channel: "dev",
    version: DEV_VERSION,
    branch: DEV_BRANCH,
    name: DEV_NAME,
    coreUrl: CORE_URL,
    manifestUrl: DEV_MANIFEST_URL,
    compactEmblemUrl: "inline:data-url-from-core",
    compactIconSizePx: COMPACT_ICON_SIZE_PX,
    coreStylesUrl: CORE_STYLES_URL,
    coreStylesVersion: CORE_STYLES_VERSION,
    coreStylesBuild: CORE_STYLES_BUILD,
    coreStylesMode: "external-bootstrap-css",
    coreStylesApplied: false,
    coreModalsUrl: CORE_MODALS_URL,
    coreModalsVersion: CORE_MODALS_VERSION,
    coreModalsBuild: CORE_MODALS_BUILD,
    coreModalsMode: "external-bootstrap-module",
    coreModalsApplied: false,
    coreBoneHudUrl: CORE_BONE_HUD_URL,
    coreBoneHudVersion: CORE_BONE_HUD_VERSION,
    coreBoneHudBuild: CORE_BONE_HUD_BUILD,
    coreBoneHudMode: "external-bootstrap-module",
    coreBoneHudApplied: false,
    corePreferencesUrl: CORE_PREFERENCES_URL,
    corePreferencesVersion: CORE_PREFERENCES_VERSION,
    corePreferencesBuild: CORE_PREFERENCES_BUILD,
    corePreferencesMode: "external-bootstrap-module",
    corePreferencesApplied: false,
    coreRegistryUrl: CORE_REGISTRY_URL,
    coreRegistryVersion: CORE_REGISTRY_VERSION,
    coreRegistryBuild: CORE_REGISTRY_BUILD,
    coreRegistryMode: "external-bootstrap-module",
    coreRegistryApplied: false,
    coreShellUrl: CORE_SHELL_URL,
    coreShellVersion: CORE_SHELL_VERSION,
    coreShellBuild: CORE_SHELL_BUILD,
    coreShellMode: "external-bootstrap-module",
    coreShellApplied: false,
    coreInteractionsUrl: CORE_INTERACTIONS_URL,
    coreInteractionsVersion: CORE_INTERACTIONS_VERSION,
    coreInteractionsBuild: CORE_INTERACTIONS_BUILD,
    coreInteractionsMode: "external-bootstrap-module",
    coreInteractionsApplied: false,
    bootstrapTransport: "host.requestText",
    presentationAssetMode: "inline-core-emblem-restored",
    status: "initializing",
    error: null
  };

  function createPrivilegedHost() {
    function requireStorageKey(key) {
      const normalized = String(key || "");
      if (!normalized.startsWith(STORAGE_PREFIX)) {
        throw new Error(`Witch Dock host refused non-namespaced storage key: ${normalized || "(empty)"}`);
      }
      return normalized;
    }

    function requireRepoRawUrl(url) {
      const normalized = String(url || "");
      if (!normalized.startsWith(REPO_RAW_PREFIX)) {
        throw new Error(`Witch Dock host refused non-repository request: ${normalized || "(empty)"}`);
      }
      return normalized;
    }

    function requestText(url, options) {
      const target = requireRepoRawUrl(url);
      const opts = options && typeof options === "object" ? options : {};
      const headers = { "Cache-Control": opts.cacheControl || "no-cache" };

      return new Promise((resolve, reject) => {
        try {
          GM_xmlhttpRequest({
            method: "GET",
            url: target,
            headers,
            timeout: Number.isFinite(opts.timeoutMs) && opts.timeoutMs > 0 ? opts.timeoutMs : undefined,
            onload: (res) => {
              if (res.status >= 200 && res.status < 300) resolve(res.responseText || "");
              else reject(new Error(`HTTP ${res.status || "unknown"} for ${target}`));
            },
            onerror: () => reject(new Error(`Request failed for ${target}`)),
            ontimeout: () => reject(new Error(`Request timed out for ${target}`))
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    function download(url, filename, options) {
      const target = String(url || "");
      const name = String(filename || "download.bin");
      const opts = options && typeof options === "object" ? options : {};
      if (!target) return Promise.reject(new Error("Witch Dock host download requires a URL."));

      return new Promise((resolve, reject) => {
        try {
          GM_download({
            url: target,
            name,
            saveAs: !!opts.saveAs,
            conflictAction: "uniquify",
            onload: () => resolve({ ok: true, filename: name }),
            onerror: (error) => reject(error instanceof Error ? error : new Error(String(error && (error.error || error.message) || "download failed"))),
            ontimeout: () => reject(new Error("Witch Dock host download timed out."))
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    const storage = Object.freeze({
      get(key, fallback) {
        return GM_getValue(requireStorageKey(key), fallback);
      },
      set(key, value) {
        GM_setValue(requireStorageKey(key), value);
        return true;
      }
    });

    const clipboard = Object.freeze({
      writeText(text) {
        GM_setClipboard(String(text == null ? "" : text), { type: "text", mimetype: "text/plain" });
        return true;
      }
    });

    const styles = Object.freeze({
      add(cssText) {
        return GM_addStyle(String(cssText == null ? "" : cssText));
      }
    });

    function scriptMeta() {
      try {
        const info = typeof GM_info !== "undefined" ? GM_info : null;
        const script = info && info.script ? info.script : null;
        return Object.freeze({
          name: script && typeof script.name === "string" ? script.name : DEV_SCRIPT_NAME,
          version: script && typeof script.version === "string" ? script.version : DEV_VERSION,
          description: script && typeof script.description === "string" ? script.description : ""
        });
      } catch {
        return Object.freeze({ name: DEV_SCRIPT_NAME, version: DEV_VERSION, description: "" });
      }
    }

    return Object.freeze({
      apiVersion: HOST_API_VERSION,
      requestText,
      download,
      storage,
      clipboard,
      styles,
      scriptMeta
    });
  }

  const PRIVILEGED_HOST = createPrivilegedHost();

  UW.KWWitchDockHostInfo = Object.freeze({
    apiVersion: HOST_API_VERSION,
    exposure: "diagnostic-only",
    rawPrivilegesExposed: false,
    storageNamespace: STORAGE_PREFIX,
    requestScope: REPO_RAW_PREFIX,
    bootstrapTransport: "host.requestText",
    capabilities: Object.freeze({
      requestText: typeof GM_xmlhttpRequest === "function",
      download: typeof GM_download === "function",
      storageGet: typeof GM_getValue === "function",
      storageSet: typeof GM_setValue === "function",
      clipboardWrite: typeof GM_setClipboard === "function",
      addStyle: typeof GM_addStyle === "function",
      scriptMeta: typeof GM_info !== "undefined"
    })
  });

  UW.KWWitchDockDevChannel = {
    channel: state.channel,
    version: state.version,
    branch: state.branch,
    name: state.name,
    coreUrl: state.coreUrl,
    manifestUrl: state.manifestUrl,
    compactEmblemUrl: state.compactEmblemUrl,
    compactIconSizePx: state.compactIconSizePx,
    coreStylesUrl: state.coreStylesUrl,
    coreStylesVersion: state.coreStylesVersion,
    coreStylesBuild: state.coreStylesBuild,
    coreModalsUrl: state.coreModalsUrl,
    coreModalsVersion: state.coreModalsVersion,
    coreModalsBuild: state.coreModalsBuild,
    coreBoneHudUrl: state.coreBoneHudUrl,
    coreBoneHudVersion: state.coreBoneHudVersion,
    coreBoneHudBuild: state.coreBoneHudBuild,
    corePreferencesUrl: state.corePreferencesUrl,
    corePreferencesVersion: state.corePreferencesVersion,
    corePreferencesBuild: state.corePreferencesBuild,
    coreRegistryUrl: state.coreRegistryUrl,
    coreRegistryVersion: state.coreRegistryVersion,
    coreRegistryBuild: state.coreRegistryBuild,
    coreShellUrl: state.coreShellUrl,
    coreShellVersion: state.coreShellVersion,
    coreShellBuild: state.coreShellBuild,
    coreInteractionsUrl: state.coreInteractionsUrl,
    coreInteractionsVersion: state.coreInteractionsVersion,
    coreInteractionsBuild: state.coreInteractionsBuild,
    hostApiVersion: HOST_API_VERSION,
    getState: () => ({ ...state })
  };

  function applyDevIdentity() {
    const title = document.getElementById("kwWDTitle");
    if (!title) return false;
    title.textContent = DEV_NAME;
    title.setAttribute("data-kw-channel", "dev");
    title.title = `Dev source · ${DEV_BRANCH}`;
    return true;
  }

  const identityObserver = new MutationObserver(() => {
    if (applyDevIdentity()) identityObserver.disconnect();
  });
  identityObserver.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(() => identityObserver.disconnect(), 30000);

  function showBootError(error) {
    const message = error && error.message ? error.message : String(error || "unknown Dev bootstrap error");
    state.status = "error";
    state.error = message;
    try { console.error("[Witch Dock Dev] Bootstrap failed:", error); } catch {}

    const existing = document.getElementById("kwWitchDockDevBootError");
    if (existing) existing.remove();
    const box = document.createElement("div");
    box.id = "kwWitchDockDevBootError";
    box.textContent = `WITCH DOCK - DEV failed to start: ${message}`;
    Object.assign(box.style, {
      position: "fixed",
      right: "16px",
      bottom: "16px",
      zIndex: "2147483647",
      maxWidth: "520px",
      padding: "10px 12px",
      border: "1px solid rgba(255,90,90,0.65)",
      borderRadius: "8px",
      background: "rgba(24,12,14,0.96)",
      color: "#fff",
      font: "12px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
      boxShadow: "0 10px 30px rgba(0,0,0,0.55)"
    });
    document.body.appendChild(box);
  }

  function normalizeStyleText(text) {
    return String(text == null ? "" : text).replace(/\r\n/g, "\n").replace(/\n+$/, "");
  }

  async function boot() {
    state.status = "fetching-core-components";
    const nonce = `${encodeURIComponent(DEV_VERSION)}-${Date.now()}`;
    const coreRequestUrl = `${CORE_URL}?kwdev=${nonce}`;
    const styleRequestUrl = `${CORE_STYLES_URL}&kwdev=${nonce}`;
    const modalRequestUrl = `${CORE_MODALS_URL}&kwdev=${nonce}`;
    const boneHudRequestUrl = `${CORE_BONE_HUD_URL}&kwdev=${nonce}`;
    const preferencesRequestUrl = `${CORE_PREFERENCES_URL}&kwdev=${nonce}`;
    const registryRequestUrl = `${CORE_REGISTRY_URL}&kwdev=${nonce}`;
    const shellRequestUrl = `${CORE_SHELL_URL}&kwdev=${nonce}`;
    const interactionsRequestUrl = `${CORE_INTERACTIONS_URL}&kwdev=${nonce}`;
    const [source, coreStyles, coreModals, coreBoneHud, corePreferences, coreRegistry, coreShell, coreInteractions] = await Promise.all([
      PRIVILEGED_HOST.requestText(coreRequestUrl, { cacheControl: "no-cache" }),
      PRIVILEGED_HOST.requestText(styleRequestUrl, { cacheControl: "no-cache" }),
      PRIVILEGED_HOST.requestText(modalRequestUrl, { cacheControl: "no-cache" }),
      PRIVILEGED_HOST.requestText(boneHudRequestUrl, { cacheControl: "no-cache" }),
      PRIVILEGED_HOST.requestText(preferencesRequestUrl, { cacheControl: "no-cache" }),
      PRIVILEGED_HOST.requestText(registryRequestUrl, { cacheControl: "no-cache" }),
      PRIVILEGED_HOST.requestText(shellRequestUrl, { cacheControl: "no-cache" }),
      PRIVILEGED_HOST.requestText(interactionsRequestUrl, { cacheControl: "no-cache" })
    ]);
    if (!source) throw new Error("core fetch returned empty source");
    if (!coreStyles) throw new Error("core stylesheet fetch returned empty source");
    if (!coreModals) throw new Error("core modal module fetch returned empty source");
    if (!coreBoneHud) throw new Error("core bone HUD module fetch returned empty source");
    if (!corePreferences) throw new Error("core preferences module fetch returned empty source");
    if (!coreRegistry) throw new Error("core registry module fetch returned empty source");
    if (!coreShell) throw new Error("core shell module fetch returned empty source");
    if (!coreInteractions) throw new Error("core interactions module fetch returned empty source");

    const manifestMatches = source.split(STABLE_MANIFEST_DECL).length - 1;
    if (manifestMatches !== 1) {
      throw new Error(`expected exactly one Stable manifest seam in core; found ${manifestMatches}`);
    }

    const emblemMatches = source.match(INLINE_EMBLEM_DECL_RE) || [];
    if (emblemMatches.length !== 1) {
      throw new Error(`expected exactly one inline compact emblem declaration in core; found ${emblemMatches.length}`);
    }

    const styleStart = source.indexOf(STYLE_FUNCTION_START);
    const duplicateStyleStart = styleStart >= 0 ? source.indexOf(STYLE_FUNCTION_START, styleStart + STYLE_FUNCTION_START.length) : -1;
    if (styleStart < 0 || duplicateStyleStart >= 0) {
      throw new Error(`expected exactly one legacy addStyles seam in core; found ${styleStart < 0 ? 0 : 2}`);
    }
    const styleEnd = source.indexOf(STYLE_FUNCTION_END, styleStart + STYLE_FUNCTION_START.length);
    if (styleEnd < 0) throw new Error("legacy addStyles seam end was not found");

    const inlineStyles = source.slice(styleStart + STYLE_FUNCTION_START.length, styleEnd);
    const compactRuleMatches = inlineStyles.split(INLINE_COMPACT_ICON_RULE).length - 1;
    if (compactRuleMatches !== 1) {
      throw new Error(`expected exactly one 40px compact-icon rule in legacy core styles; found ${compactRuleMatches}`);
    }
    const expectedExtractedStyles = inlineStyles.replace(INLINE_COMPACT_ICON_RULE, EXTRACTED_COMPACT_ICON_RULE);
    if (normalizeStyleText(coreStyles) !== normalizeStyleText(expectedExtractedStyles)) {
      throw new Error("extracted core stylesheet does not match the guarded legacy CSS contract");
    }

    PRIVILEGED_HOST.styles.add(coreStyles);
    state.coreStylesApplied = true;
    UW.KWWitchDockStylesInfo = Object.freeze({
      version: CORE_STYLES_VERSION,
      build: CORE_STYLES_BUILD,
      url: CORE_STYLES_URL,
      applied: true,
      owner: "privileged-bootstrap",
      parity: "legacy-core-css-plus-48px-compact-icon"
    });

    state.status = "loading-core-modals";
    eval(`${coreModals}\n//# sourceURL=${CORE_MODALS_URL}`);
    const modalApi = UW.KWWitchDockModals;
    if (!modalApi || modalApi.version !== CORE_MODALS_VERSION || modalApi.build !== CORE_MODALS_BUILD) {
      throw new Error("external core modal module did not register the expected API/version");
    }
    if (typeof modalApi.configure !== "function" || typeof modalApi.ensureAbout !== "function" || typeof modalApi.openDisclaimer !== "function") {
      throw new Error("external core modal module is missing required methods");
    }
    modalApi.configure({
      scriptMeta: PRIVILEGED_HOST.scriptMeta(),
      githubRepoUrl: GITHUB_REPO_URL,
      kofiUrl: KOFI_URL
    });
    state.coreModalsApplied = true;
    UW.KWWitchDockModalsInfo = Object.freeze({
      version: CORE_MODALS_VERSION,
      build: CORE_MODALS_BUILD,
      url: CORE_MODALS_URL,
      applied: true,
      owner: "bootstrap-module",
      contract: "legacy-about-disclaimer-dom-and-behavior"
    });

    state.status = "loading-core-bone-hud";
    eval(`${coreBoneHud}\n//# sourceURL=${CORE_BONE_HUD_URL}`);
    const boneApi = UW.KWWitchDockBoneHUD;
    if (!boneApi || boneApi.version !== CORE_BONE_HUD_VERSION || boneApi.build !== CORE_BONE_HUD_BUILD) {
      throw new Error("external core bone HUD module did not register the expected API/version");
    }
    if (typeof boneApi.configure !== "function" || typeof boneApi.init !== "function" || typeof boneApi.getState !== "function") {
      throw new Error("external core bone HUD module is missing required methods");
    }
    boneApi.configure({
      scriptMeta: PRIVILEGED_HOST.scriptMeta(),
      copyText: PRIVILEGED_HOST.clipboard.writeText
    });
    state.coreBoneHudApplied = true;
    UW.KWWitchDockBoneHUDInfo = Object.freeze({
      version: CORE_BONE_HUD_VERSION,
      build: CORE_BONE_HUD_BUILD,
      url: CORE_BONE_HUD_URL,
      applied: true,
      owner: "bootstrap-module",
      contract: "legacy-bone-footer-detection-and-copy"
    });

    state.status = "loading-core-preferences";
    eval(`${corePreferences}\n//# sourceURL=${CORE_PREFERENCES_URL}`);
    const preferencesApi = UW.KWWitchDockPreferences;
    if (!preferencesApi || preferencesApi.version !== CORE_PREFERENCES_VERSION || preferencesApi.build !== CORE_PREFERENCES_BUILD) {
      throw new Error("external core preferences module did not register the expected API/version");
    }
    if (
      typeof preferencesApi.configure !== "function" ||
      typeof preferencesApi.load !== "function" ||
      typeof preferencesApi.save !== "function" ||
      typeof preferencesApi.getSectionCollapsed !== "function" ||
      typeof preferencesApi.setSectionCollapsed !== "function" ||
      typeof preferencesApi.getSectionOrder !== "function" ||
      typeof preferencesApi.setSectionOrder !== "function" ||
      typeof preferencesApi.getToolEnabledFromHost !== "function" ||
      typeof preferencesApi.getToolEnabledFromPage !== "function" ||
      typeof preferencesApi.getToolEnabled !== "function" ||
      typeof preferencesApi.setToolEnabled !== "function" ||
      typeof preferencesApi.getState !== "function"
    ) {
      throw new Error("external core preferences module is missing required methods");
    }
    preferencesApi.configure({
      storage: PRIVILEGED_HOST.storage,
      pageStorage: Object.freeze({
        getItem: (key) => UW.localStorage.getItem(key),
        setItem: (key, value) => UW.localStorage.setItem(key, String(value))
      })
    });
    state.corePreferencesApplied = true;
    UW.KWWitchDockPreferencesInfo = Object.freeze({
      version: CORE_PREFERENCES_VERSION,
      build: CORE_PREFERENCES_BUILD,
      url: CORE_PREFERENCES_URL,
      applied: true,
      owner: "bootstrap-module",
      contract: "kw.witchDock-main-section-tool-preferences"
    });

    state.status = "loading-core-registry";
    eval(`${coreRegistry}\n//# sourceURL=${CORE_REGISTRY_URL}`);
    const registryApi = UW.KWWitchDockRegistry;
    if (!registryApi || registryApi.version !== CORE_REGISTRY_VERSION || registryApi.build !== CORE_REGISTRY_BUILD) {
      throw new Error("external core registry module did not register the expected API/version");
    }
    if (
      !(registryApi.tabs instanceof Map) ||
      !(registryApi.toolsById instanceof Map) ||
      !Array.isArray(registryApi.pending) ||
      typeof registryApi.getState !== "function"
    ) {
      throw new Error("external core registry module is missing required state containers");
    }
    state.coreRegistryApplied = true;
    UW.KWWitchDockRegistryInfo = Object.freeze({
      version: CORE_REGISTRY_VERSION,
      build: CORE_REGISTRY_BUILD,
      url: CORE_REGISTRY_URL,
      applied: true,
      owner: "bootstrap-module",
      contract: "legacy-tab-tool-pending-state-containers"
    });

    state.status = "loading-core-shell";
    eval(`${coreShell}\n//# sourceURL=${CORE_SHELL_URL}`);
    const shellApi = UW.KWWitchDockShell;
    if (!shellApi || shellApi.version !== CORE_SHELL_VERSION || shellApi.build !== CORE_SHELL_BUILD) {
      throw new Error("external core shell module did not register the expected API/version");
    }
    if (typeof shellApi.createRoot !== "function" || typeof shellApi.createCompact !== "function" || typeof shellApi.getState !== "function") {
      throw new Error("external core shell module is missing required methods");
    }
    state.coreShellApplied = true;
    UW.KWWitchDockShellInfo = Object.freeze({
      version: CORE_SHELL_VERSION,
      build: CORE_SHELL_BUILD,
      url: CORE_SHELL_URL,
      applied: true,
      owner: "bootstrap-module",
      contract: "legacy-main-root-dom-factory"
    });

    state.status = "loading-core-interactions";
    eval(`${coreInteractions}\n//# sourceURL=${CORE_INTERACTIONS_URL}`);
    const interactionsApi = UW.KWWitchDockInteractions;
    if (!interactionsApi || interactionsApi.version !== CORE_INTERACTIONS_VERSION || interactionsApi.build !== CORE_INTERACTIONS_BUILD) {
      throw new Error("external core interactions module did not register the expected API/version");
    }
    if (
      typeof interactionsApi.configure !== "function" ||
      typeof interactionsApi.startDockDrag !== "function" ||
      typeof interactionsApi.startResizeCorner !== "function" ||
      typeof interactionsApi.startResizeBottom !== "function" ||
      typeof interactionsApi.startCompactDrag !== "function" ||
      typeof interactionsApi.toggleMinimize !== "function" ||
      typeof interactionsApi.closeDock !== "function" ||
      typeof interactionsApi.expandFromCompact !== "function" ||
      typeof interactionsApi.getState !== "function"
    ) {
      throw new Error("external core interactions module is missing required methods");
    }
    state.coreInteractionsApplied = true;
    UW.KWWitchDockInteractionsInfo = Object.freeze({
      version: CORE_INTERACTIONS_VERSION,
      build: CORE_INTERACTIONS_BUILD,
      url: CORE_INTERACTIONS_URL,
      applied: true,
      owner: "bootstrap-module",
      contract: "legacy-dock-interactions-through-compact-drag"
    });

    const styleReplacement = '  function addStyles() {\n    // Core CSS is injected by the privileged bootstrap before UI construction.\n  }\n\n  function el(';
    let devSource = source.slice(0, styleStart) + styleReplacement + source.slice(styleEnd + STYLE_FUNCTION_END.length);

    const prefsDeclStart = devSource.indexOf(PREFS_DECL_START);
    const duplicatePrefsDeclStart = prefsDeclStart >= 0 ? devSource.indexOf(PREFS_DECL_START, prefsDeclStart + PREFS_DECL_START.length) : -1;
    if (prefsDeclStart < 0 || duplicatePrefsDeclStart >= 0) {
      throw new Error(`expected exactly one legacy preference declaration block; found ${prefsDeclStart < 0 ? 0 : 2}`);
    }
    const prefsDeclEnd = devSource.indexOf(PREFS_DECL_END, prefsDeclStart + PREFS_DECL_START.length);
    if (prefsDeclEnd < 0) throw new Error("legacy preference declaration block end was not found");
    const legacyPrefsDecl = devSource.slice(prefsDeclStart, prefsDeclEnd);
    for (const required of ["width: 380", "height: 520", "lastOpenAnchored: true", "compactX: 16", "firstRun: false"]) {
      if (!legacyPrefsDecl.includes(required)) throw new Error(`legacy preference defaults contract changed: missing ${required}`);
    }
    const prefsDeclReplacement = [
      '  const STORE_KEY = UW.KWWitchDockPreferences.storeKey;',
      '  const DEFAULTS = UW.KWWitchDockPreferences.defaults;',
      '',
      '  const state = {'
    ].join('\n');
    devSource = devSource.slice(0, prefsDeclStart) + prefsDeclReplacement + devSource.slice(prefsDeclEnd + PREFS_DECL_END.length);

    const registryStateMatches = devSource.split(REGISTRY_STATE_BLOCK).length - 1;
    if (registryStateMatches !== 1) {
      throw new Error(`expected exactly one legacy registry state block; found ${registryStateMatches}`);
    }
    devSource = devSource.replace(REGISTRY_STATE_BLOCK, [
      '    tabs: UW.KWWitchDockRegistry.tabs,',
      '    toolsById: UW.KWWitchDockRegistry.toolsById,',
      '    pending: UW.KWWitchDockRegistry.pending,'
    ].join('\n'));

    const shellRootStart = devSource.indexOf(SHELL_ROOT_START);
    const duplicateShellRootStart = shellRootStart >= 0 ? devSource.indexOf(SHELL_ROOT_START, shellRootStart + SHELL_ROOT_START.length) : -1;
    if (shellRootStart < 0 || duplicateShellRootStart >= 0) {
      throw new Error(`expected exactly one legacy shell-root block; found ${shellRootStart < 0 ? 0 : 2}`);
    }
    const shellRootEnd = devSource.indexOf(SHELL_ROOT_END, shellRootStart + SHELL_ROOT_START.length);
    if (shellRootEnd < 0) throw new Error("legacy shell-root block end was not found");
    const legacyShellRoot = devSource.slice(shellRootStart, shellRootEnd);
    for (const required of [
      'id: "kwWDHeader", onpointerdown: startDockDrag',
      'id: "kwWDDisclaimerBtn"',
      'id: "kwWDAboutBtn"',
      'title: "Minimize / Expand"',
      'title: "Collapse to icon"',
      'id: "kwWDUndoBtn"',
      'id: "kwWDRedoBtn"',
      'id: "kwWDResizeHandleBottom", onpointerdown: startResizeBottom',
      'id: "kwWDResizeHandleCorner", onpointerdown: startResizeCorner',
      'state.footer = state.root.querySelector("#kwWDFooter");'
    ]) {
      if (!legacyShellRoot.includes(required)) throw new Error(`legacy shell-root contract changed: missing ${required}`);
    }
    const shellRootReplacement = [
      '    const dockShell = UW.KWWitchDockShell.createRoot({',
      '      el,',
      '      handlers: Object.freeze({',
      '        startDockDrag,',
      '        openDisclaimerModal,',
      '        ensureAboutModal,',
      '        openAboutModal,',
      '        toggleMinimize,',
      '        closeDock,',
      '        triggerUndo,',
      '        triggerRedo,',
      '        startResizeBottom,',
      '        startResizeCorner',
      '      })',
      '    });',
      '    state.root = dockShell.root;',
      '    state.header = dockShell.header;',
      '    state.aboutBtn = dockShell.aboutBtn;',
      '    state.tabsContainer = dockShell.tabsContainer;',
      '    state.tabsBar = dockShell.tabsBar;',
      '    state.tabsBarRight = dockShell.tabsBarRight;',
      '    state.footer = dockShell.footer;',
      '    state.undoBtn = dockShell.undoBtn;',
      '    state.redoBtn = dockShell.redoBtn;',
      '    state.body = dockShell.body;',
      '    state.resizeBottom = dockShell.resizeBottom;',
      '    state.resizeCorner = dockShell.resizeCorner;',
      '    state.minimizeBtn = dockShell.minimizeBtn;',
      '    state.closeBtn = dockShell.closeBtn;'
    ].join('\n');
    devSource = devSource.slice(0, shellRootStart) + shellRootReplacement + devSource.slice(shellRootEnd);

    const compactDomStart = devSource.indexOf(COMPACT_DOM_START);
    const duplicateCompactDomStart = compactDomStart >= 0 ? devSource.indexOf(COMPACT_DOM_START, compactDomStart + COMPACT_DOM_START.length) : -1;
    if (compactDomStart < 0 || duplicateCompactDomStart >= 0) {
      throw new Error(`expected exactly one legacy compact-DOM block; found ${compactDomStart < 0 ? 0 : 2}`);
    }
    const compactDomEnd = devSource.indexOf(COMPACT_DOM_END, compactDomStart + COMPACT_DOM_START.length);
    if (compactDomEnd < 0) throw new Error("legacy compact-DOM block end was not found");
    const legacyCompactDom = devSource.slice(compactDomStart, compactDomEnd);
    for (const required of [
      'id: "kwWDCompact"',
      'title: "Open Witch Dock"',
      'onpointerdown: startCompactDrag',
      'id: "kwWDCompactIcon"',
      'src: COMPACT_EMBLEM_URL',
      'alt: "Witch Dock"',
      'draggable: "false"'
    ]) {
      if (!legacyCompactDom.includes(required)) throw new Error(`legacy compact-DOM contract changed: missing ${required}`);
    }
    const compactDomReplacement = [
      '    state.compact = UW.KWWitchDockShell.createCompact({',
      '      el,',
      '      emblemUrl: COMPACT_EMBLEM_URL,',
      '      onPointerDown: startCompactDrag',
      '    });'
    ].join('\n');
    devSource = devSource.slice(0, compactDomStart) + compactDomReplacement + devSource.slice(compactDomEnd);

    const dockSnapshotStart = devSource.indexOf(DOCK_SNAPSHOT_START);
    const duplicateDockSnapshotStart = dockSnapshotStart >= 0 ? devSource.indexOf(DOCK_SNAPSHOT_START, dockSnapshotStart + DOCK_SNAPSHOT_START.length) : -1;
    if (dockSnapshotStart < 0 || duplicateDockSnapshotStart >= 0) {
      throw new Error(`expected exactly one Dock snapshot block; found ${dockSnapshotStart < 0 ? 0 : 2}`);
    }
    const dockSnapshotEnd = devSource.indexOf(DOCK_SNAPSHOT_END, dockSnapshotStart + DOCK_SNAPSHOT_START.length);
    if (dockSnapshotEnd < 0) throw new Error("Dock snapshot block end was not found");
    const legacyDockSnapshot = devSource.slice(dockSnapshotStart, dockSnapshotEnd);
    for (const required of [
      'const r = state.root.getBoundingClientRect();',
      'prefs.lastOpenWidth = Math.round(r.width);',
      'prefs.lastOpenHeight = Math.round(r.height);',
      'savePrefs(prefs);'
    ]) {
      if (!legacyDockSnapshot.includes(required)) throw new Error(`Dock snapshot contract changed: missing ${required}`);
    }
    const stableDockSnapshot = legacyDockSnapshot
      .replace(
        'prefs.lastOpenWidth = Math.round(r.width);',
        [
          'const computed = getComputedStyle(state.root);',
          '    const cssWidth = Number.parseFloat(computed.width);',
          '    prefs.lastOpenWidth = Number.isFinite(cssWidth) ? Math.round(cssWidth) : Math.round(r.width);'
        ].join('\n')
      )
      .replace(
        'prefs.lastOpenHeight = Math.round(r.height);',
        [
          'const cssHeight = Number.parseFloat(computed.height);',
          '    prefs.lastOpenHeight = Number.isFinite(cssHeight) ? Math.round(cssHeight) : Math.round(r.height);'
        ].join('\n')
      );
    devSource = devSource.slice(0, dockSnapshotStart) + stableDockSnapshot + devSource.slice(dockSnapshotEnd);

    const prefsIoStart = devSource.indexOf(PREFS_IO_START);
    const duplicatePrefsIoStart = prefsIoStart >= 0 ? devSource.indexOf(PREFS_IO_START, prefsIoStart + PREFS_IO_START.length) : -1;
    if (prefsIoStart < 0 || duplicatePrefsIoStart >= 0) {
      throw new Error(`expected exactly one legacy preference IO block; found ${prefsIoStart < 0 ? 0 : 2}`);
    }
    const prefsIoEnd = devSource.indexOf(PREFS_IO_END, prefsIoStart + PREFS_IO_START.length);
    if (prefsIoEnd < 0) throw new Error("legacy preference IO block end was not found");
    const legacyPrefsIo = devSource.slice(prefsIoStart, prefsIoEnd + PREFS_IO_END.length);
    if ((legacyPrefsIo.split("GM_getValue(STORE_KEY").length - 1) !== 1 || (legacyPrefsIo.split("GM_setValue(STORE_KEY").length - 1) !== 1) {
      throw new Error("legacy main preference GM storage contract changed");
    }
    const prefsIoReplacement = [
      '  function loadPrefs() { return UW.KWWitchDockPreferences.load(); }',
      '  function savePrefs(p) { UW.KWWitchDockPreferences.save(p); }',
      '',
      '  const prefs = loadPrefs();',
      '  UW.KWWitchDockInteractions.configure({',
      '    state,',
      '    prefs,',
      '    defaults: DEFAULTS,',
      '    savePrefs,',
      '    snapshotCurrentDockPositionToPrefs,',
      '    getViewport,',
      '    enforceSizeConstraints,',
      '    applyMinimizedState,',
      '    showClosedCompact,',
      '    clamp,',
      '    computeMinDockHeightCollapsed',
      '  });'
    ].join('\n');
    devSource = devSource.slice(0, prefsIoStart) + prefsIoReplacement + devSource.slice(prefsIoEnd + PREFS_IO_END.length);

    const toolEnableStart = devSource.indexOf(TOOL_ENABLE_STORAGE_START);
    const duplicateToolEnableStart = toolEnableStart >= 0 ? devSource.indexOf(TOOL_ENABLE_STORAGE_START, toolEnableStart + TOOL_ENABLE_STORAGE_START.length) : -1;
    if (toolEnableStart < 0 || duplicateToolEnableStart >= 0) {
      throw new Error(`expected exactly one legacy tool-enablement storage block; found ${toolEnableStart < 0 ? 0 : 2}`);
    }
    const toolEnableEnd = devSource.indexOf(TOOL_ENABLE_STORAGE_END, toolEnableStart + TOOL_ENABLE_STORAGE_START.length);
    if (toolEnableEnd < 0) throw new Error("legacy tool-enablement storage block end was not found");
    const legacyToolEnable = devSource.slice(toolEnableStart, toolEnableEnd);
    for (const required of [
      'GM_getValue(TOOL_ENABLE_PREFIX + toolId, null)',
      'if (v === null || v === undefined) return !!enabledByDefault',
      'return !!v'
    ]) {
      if (!legacyToolEnable.includes(required)) throw new Error(`legacy tool-enablement storage contract changed: missing ${required}`);
    }
    const toolEnableReplacement = [
      'function getToolEnabled(toolId, enabledByDefault) {',
      '  return UW.KWWitchDockPreferences.getToolEnabledFromHost(toolId, enabledByDefault);',
      '}',
      '',
      'async function loadManifestAndTools() {'
    ].join('\n');
    devSource = devSource.slice(0, toolEnableStart) + toolEnableReplacement + devSource.slice(toolEnableEnd + TOOL_ENABLE_STORAGE_END.length);

    const sectionCollapseStart = devSource.indexOf(SECTION_COLLAPSE_STORAGE_START);
    const duplicateSectionCollapseStart = sectionCollapseStart >= 0 ? devSource.indexOf(SECTION_COLLAPSE_STORAGE_START, sectionCollapseStart + SECTION_COLLAPSE_STORAGE_START.length) : -1;
    if (sectionCollapseStart < 0 || duplicateSectionCollapseStart >= 0) {
      throw new Error(`expected exactly one legacy section-collapse storage block; found ${sectionCollapseStart < 0 ? 0 : 2}`);
    }
    const sectionCollapseEnd = devSource.indexOf(SECTION_COLLAPSE_STORAGE_END, sectionCollapseStart + SECTION_COLLAPSE_STORAGE_START.length);
    if (sectionCollapseEnd < 0) throw new Error("legacy section-collapse storage block end was not found");
    const legacySectionCollapse = devSource.slice(sectionCollapseStart, sectionCollapseEnd);
    for (const required of [
      'kw.witchDock.ui.${toolId}.${sectionId}.collapsed',
      'GM_getValue(toolSectionKey(toolId, sectionId), null)',
      'GM_setValue(toolSectionKey(toolId, sectionId), !!collapsed)'
    ]) {
      if (!legacySectionCollapse.includes(required)) throw new Error(`legacy section-collapse storage contract changed: missing ${required}`);
    }
    const sectionCollapseReplacement = [
      'function toolSectionKey(toolId, sectionId) { return UW.KWWitchDockPreferences.sectionCollapsedKey(toolId, sectionId); }',
      '  function getSectionCollapsed(toolId, sectionId, defaultCollapsed) { return UW.KWWitchDockPreferences.getSectionCollapsed(toolId, sectionId, defaultCollapsed); }',
      '  function setSectionCollapsed(toolId, sectionId, collapsed) { UW.KWWitchDockPreferences.setSectionCollapsed(toolId, sectionId, collapsed); }',
      '',
      '  function createSection(toolId, opts) {'
    ].join('\n');
    devSource = devSource.slice(0, sectionCollapseStart) + sectionCollapseReplacement + devSource.slice(sectionCollapseEnd + SECTION_COLLAPSE_STORAGE_END.length);

    const sectionOrderStart = devSource.indexOf(SECTION_ORDER_STORAGE_START);
    const duplicateSectionOrderStart = sectionOrderStart >= 0 ? devSource.indexOf(SECTION_ORDER_STORAGE_START, sectionOrderStart + SECTION_ORDER_STORAGE_START.length) : -1;
    if (sectionOrderStart < 0 || duplicateSectionOrderStart >= 0) {
      throw new Error(`expected exactly one legacy section-order storage block; found ${sectionOrderStart < 0 ? 0 : 2}`);
    }
    const sectionOrderEnd = devSource.indexOf(SECTION_ORDER_STORAGE_END, sectionOrderStart + SECTION_ORDER_STORAGE_START.length);
    if (sectionOrderEnd < 0) throw new Error("legacy section-order storage block end was not found");
    const legacySectionOrder = devSource.slice(sectionOrderStart, sectionOrderEnd);
    for (const required of [
      'kw.witchDock.sectionOrder.',
      'GM_getValue(sectionOrderKey(toolId), null)',
      'GM_setValue(sectionOrderKey(toolId), JSON.stringify(order))'
    ]) {
      if (!legacySectionOrder.includes(required)) throw new Error(`legacy section-order storage contract changed: missing ${required}`);
    }
    const sectionOrderReplacement = [
      'const SECTION_ORDER_PREFIX = "kw.witchDock.sectionOrder.";',
      'function sectionOrderKey(toolId) { return UW.KWWitchDockPreferences.sectionOrderKey(toolId); }',
      'function getSectionOrder(toolId) { return UW.KWWitchDockPreferences.getSectionOrder(toolId); }',
      'function setSectionOrder(toolId, order) { UW.KWWitchDockPreferences.setSectionOrder(toolId, order); }',
      '',
      'function saveSectionOrderFromDom(toolId, container) {'
    ].join('\n');
    devSource = devSource.slice(0, sectionOrderStart) + sectionOrderReplacement + devSource.slice(sectionOrderEnd + SECTION_ORDER_STORAGE_END.length);

    const boneStart = devSource.indexOf(BONE_BLOCK_START);
    const duplicateBoneStart = boneStart >= 0 ? devSource.indexOf(BONE_BLOCK_START, boneStart + BONE_BLOCK_START.length) : -1;
    if (boneStart < 0 || duplicateBoneStart >= 0) {
      throw new Error(`expected exactly one legacy bone HUD block start; found ${boneStart < 0 ? 0 : 2}`);
    }
    const boneEnd = devSource.indexOf(BONE_BLOCK_END, boneStart + BONE_BLOCK_START.length);
    if (boneEnd < 0) throw new Error("legacy bone HUD block end was not found");
    const legacyBoneBlock = devSource.slice(boneStart, boneEnd);
    if ((legacyBoneBlock.split("function initBoneFooterAndDetection(").length - 1) !== 1) {
      throw new Error("legacy bone HUD init function contract changed");
    }
    if ((legacyBoneBlock.split("function getScriptMeta(").length - 1) !== 1) {
      throw new Error("legacy bone HUD script-meta seam contract changed");
    }

    const boneReplacement = [
      'function initBoneFooterAndDetection() {',
      '  if (state.boneInit) return;',
      '  if (!state.footer) return;',
      '  state.boneInit = true;',
      '  const handle = UW.KWWitchDockBoneHUD.init({ footer: state.footer, hotkeyText: BONE_FOOTER_HOTKEY_TEXT });',
      '  state.__kwBoneDetect = handle || null;',
      '}',
      '',
      '  function closeAboutModal() {'
    ].join('\n');
    devSource = devSource.slice(0, boneStart) + boneReplacement + devSource.slice(boneEnd + BONE_BLOCK_END.length);

    const dockDragStart = devSource.indexOf(DOCK_DRAG_START);
    const duplicateDockDragStart = dockDragStart >= 0 ? devSource.indexOf(DOCK_DRAG_START, dockDragStart + DOCK_DRAG_START.length) : -1;
    if (dockDragStart < 0 || duplicateDockDragStart >= 0) {
      throw new Error(`expected exactly one Dock drag block; found ${dockDragStart < 0 ? 0 : 2}`);
    }
    const dockDragEnd = devSource.indexOf(DOCK_DRAG_END, dockDragStart + DOCK_DRAG_START.length);
    if (dockDragEnd < 0) throw new Error("Dock drag block end was not found");
    const legacyDockDrag = devSource.slice(dockDragStart, dockDragEnd);
    for (const required of [
      'function startDockDrag(e) {',
      'target.closest("#kwWDControls")',
      'const startLeft = rect.left;',
      'window.addEventListener("pointermove", move);',
      'window.addEventListener("pointerup", up);',
      'prefs.x = Math.round(left);',
      'prefs.y = Math.round(top);',
      'savePrefs(prefs);'
    ]) {
      if (!legacyDockDrag.includes(required)) throw new Error(`Dock drag contract changed: missing ${required}`);
    }
    const dockDragReplacement = '  function startDockDrag(e) { return UW.KWWitchDockInteractions.startDockDrag(e); }';
    devSource = devSource.slice(0, dockDragStart) + dockDragReplacement + devSource.slice(dockDragEnd);

    const dockResizeStart = devSource.indexOf(DOCK_RESIZE_START);
    const duplicateDockResizeStart = dockResizeStart >= 0 ? devSource.indexOf(DOCK_RESIZE_START, dockResizeStart + DOCK_RESIZE_START.length) : -1;
    if (dockResizeStart < 0 || duplicateDockResizeStart >= 0) {
      throw new Error(`expected exactly one Dock resize block; found ${dockResizeStart < 0 ? 0 : 2}`);
    }
    const dockResizeEnd = devSource.indexOf(DOCK_RESIZE_END, dockResizeStart + DOCK_RESIZE_START.length);
    if (dockResizeEnd < 0) throw new Error("Dock resize block end was not found");
    const legacyDockResize = devSource.slice(dockResizeStart, dockResizeEnd);
    for (const required of [
      'function startResizeCorner(e) {',
      'state.resizeStart = { x: e.clientX, y: e.clientY, w: rect.width, h: rect.height, mode: "corner" };',
      'prefs.lastOpenWidth = prefs.width;',
      'prefs.lastOpenHeight = prefs.height;',
      'function startResizeBottom(e) {',
      'state.resizeStart = { x: e.clientX, y: e.clientY, w: rect.width, h: rect.height, mode: "bottom" };',
      'enforceSizeConstraints();'
    ]) {
      if (!legacyDockResize.includes(required)) throw new Error(`Dock resize contract changed: missing ${required}`);
    }
    const dockResizeReplacement = [
      '  function startResizeCorner(e) { return UW.KWWitchDockInteractions.startResizeCorner(e); }',
      '  function startResizeBottom(e) { return UW.KWWitchDockInteractions.startResizeBottom(e); }'
    ].join('\n\n');
    devSource = devSource.slice(0, dockResizeStart) + dockResizeReplacement + devSource.slice(dockResizeEnd);

    const dockLifecycleStart = devSource.indexOf(DOCK_LIFECYCLE_START);
    const duplicateDockLifecycleStart = dockLifecycleStart >= 0 ? devSource.indexOf(DOCK_LIFECYCLE_START, dockLifecycleStart + DOCK_LIFECYCLE_START.length) : -1;
    if (dockLifecycleStart < 0 || duplicateDockLifecycleStart >= 0) {
      throw new Error(`expected exactly one Dock lifecycle block; found ${dockLifecycleStart < 0 ? 0 : 2}`);
    }
    const dockLifecycleEnd = devSource.indexOf(DOCK_LIFECYCLE_END, dockLifecycleStart + DOCK_LIFECYCLE_START.length);
    if (dockLifecycleEnd < 0) throw new Error("Dock lifecycle block end was not found");
    const legacyDockLifecycle = devSource.slice(dockLifecycleStart, dockLifecycleEnd);
    for (const required of [
      'function toggleMinimize() {',
      'if (!prefs.minimized) snapshotCurrentDockPositionToPrefs();',
      'function closeDock() {',
      'prefs.closed = true;',
      'function expandFromCompact() {',
      'prefs.closed = false;',
      'showClosedCompact();',
      'enforceSizeConstraints();',
      'applyMinimizedState();'
    ]) {
      if (!legacyDockLifecycle.includes(required)) throw new Error(`Dock lifecycle contract changed: missing ${required}`);
    }
    const dockLifecycleReplacement = [
      '  function toggleMinimize() { return UW.KWWitchDockInteractions.toggleMinimize(); }',
      '  function closeDock() { return UW.KWWitchDockInteractions.closeDock(); }',
      '  function expandFromCompact() { return UW.KWWitchDockInteractions.expandFromCompact(); }'
    ].join('\n\n');
    devSource = devSource.slice(0, dockLifecycleStart) + dockLifecycleReplacement + devSource.slice(dockLifecycleEnd);

    const compactDragStart = devSource.indexOf(COMPACT_DRAG_START);
    const duplicateCompactDragStart = compactDragStart >= 0 ? devSource.indexOf(COMPACT_DRAG_START, compactDragStart + COMPACT_DRAG_START.length) : -1;
    if (compactDragStart < 0 || duplicateCompactDragStart >= 0) {
      throw new Error(`expected exactly one compact drag block; found ${compactDragStart < 0 ? 0 : 2}`);
    }
    const compactDragEnd = devSource.indexOf(COMPACT_DRAG_END, compactDragStart + COMPACT_DRAG_START.length);
    if (compactDragEnd < 0) throw new Error("compact drag block end was not found");
    const legacyCompactDrag = devSource.slice(compactDragStart, compactDragEnd);
    for (const required of [
      'function startCompactDrag(e) {',
      'if (e.isPrimary === false) return;',
      'Math.hypot(dx, dy) <= 5',
      'state.compact.setPointerCapture(pointerId)',
      'prefs.compactX = Math.round(left);',
      'prefs.compactY = Math.round(top);',
      'window.addEventListener("pointermove", move, true);',
      'window.addEventListener("pointercancel", cancel, true);',
      'if (!dragging) expandFromCompact();'
    ]) {
      if (!legacyCompactDrag.includes(required)) throw new Error(`compact drag contract changed: missing ${required}`);
    }
    const compactDragReplacement = '  function startCompactDrag(e) { return UW.KWWitchDockInteractions.startCompactDrag(e); }';
    devSource = devSource.slice(0, compactDragStart) + compactDragReplacement + devSource.slice(compactDragEnd);

    const modalStart = devSource.indexOf(MODAL_BLOCK_START);
    const duplicateModalStart = modalStart >= 0 ? devSource.indexOf(MODAL_BLOCK_START, modalStart + MODAL_BLOCK_START.length) : -1;
    if (modalStart < 0 || duplicateModalStart >= 0) {
      throw new Error(`expected exactly one legacy modal block start; found ${modalStart < 0 ? 0 : 2}`);
    }
    const modalEnd = devSource.indexOf(MODAL_BLOCK_END, modalStart + MODAL_BLOCK_START.length);
    if (modalEnd < 0) throw new Error("legacy modal block end was not found");
    const legacyModalBlock = devSource.slice(modalStart, modalEnd);
    for (const functionName of MODAL_FUNCTION_NAMES) {
      const count = legacyModalBlock.split(`function ${functionName}(`).length - 1;
      if (count !== 1) throw new Error(`expected exactly one ${functionName} in legacy modal block; found ${count}`);
    }

    const modalReplacement = [
      '  function closeAboutModal() { return UW.KWWitchDockModals.closeAbout(); }',
      '  function openAboutModal() { return UW.KWWitchDockModals.openAbout(); }',
      '  function ensureAboutModal() { return UW.KWWitchDockModals.ensureAbout(); }',
      '  function closeDisclaimerModal() { return UW.KWWitchDockModals.closeDisclaimer(); }',
      '  function openDisclaimerModal() { return UW.KWWitchDockModals.openDisclaimer(); }',
      '  function ensureDisclaimerModal() { return UW.KWWitchDockModals.ensureDisclaimer(); }',
      '',
      'function buildUI() {'
    ].join('\n');
    devSource = devSource.slice(0, modalStart) + modalReplacement + devSource.slice(modalEnd + MODAL_BLOCK_END.length);
    devSource = devSource.replace(STABLE_MANIFEST_DECL, DEV_MANIFEST_DECL);

    state.status = "loading-core";

    // Temporary bounded migration seam for issue #19/#10. The fetched core executes
    // inside this userscript sandbox so its existing GM_* contracts remain intact.
    // CSS, modal, bone-HUD, main/section/tool preferences, tab/tool registry containers, shell DOM, minimize/compact lifecycle, main Dock drag, Dock resize, and compact drag/click ownership have moved to bootstrap-hosted GitHub components while
    // hotkey/undo-redo and other legacy application responsibilities remain in the Stable-derived core.
    eval(`${devSource}\n//# sourceURL=${CORE_URL}?channel=dev&v=${DEV_VERSION}`);

    UW.KWWitchDockManifestURL = DEV_MANIFEST_URL;
    applyDevIdentity();
    state.status = "running";
  }

  boot().catch(showBootError);
})();
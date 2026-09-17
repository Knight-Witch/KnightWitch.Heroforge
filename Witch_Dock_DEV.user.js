// ==UserScript==
// @name         WITCH DOCK - DEV
// @namespace    KnightWitch
// @version      1.3.8
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
  const DEV_VERSION = "1.3.8";
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
    state.status = "fetching-core-styles-and-modals";
    const nonce = `${encodeURIComponent(DEV_VERSION)}-${Date.now()}`;
    const coreRequestUrl = `${CORE_URL}?kwdev=${nonce}`;
    const styleRequestUrl = `${CORE_STYLES_URL}&kwdev=${nonce}`;
    const modalRequestUrl = `${CORE_MODALS_URL}&kwdev=${nonce}`;
    const [source, coreStyles, coreModals] = await Promise.all([
      PRIVILEGED_HOST.requestText(coreRequestUrl, { cacheControl: "no-cache" }),
      PRIVILEGED_HOST.requestText(styleRequestUrl, { cacheControl: "no-cache" }),
      PRIVILEGED_HOST.requestText(modalRequestUrl, { cacheControl: "no-cache" })
    ]);
    if (!source) throw new Error("core fetch returned empty source");
    if (!coreStyles) throw new Error("core stylesheet fetch returned empty source");
    if (!coreModals) throw new Error("core modal module fetch returned empty source");

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

    const styleReplacement = '  function addStyles() {\n    // Core CSS is injected by the privileged bootstrap before UI construction.\n  }\n\n  function el(';
    let devSource = source.slice(0, styleStart) + styleReplacement + source.slice(styleEnd + STYLE_FUNCTION_END.length);

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
    // CSS and modal ownership have moved to bootstrap-hosted GitHub components while
    // other legacy application responsibilities remain in the Stable-derived core.
    eval(`${devSource}\n//# sourceURL=${CORE_URL}?channel=dev&v=${DEV_VERSION}`);

    UW.KWWitchDockManifestURL = DEV_MANIFEST_URL;
    applyDevIdentity();
    state.status = "running";
  }

  boot().catch(showBootError);
})();
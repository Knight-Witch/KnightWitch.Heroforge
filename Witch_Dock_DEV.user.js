// ==UserScript==
// @name         WITCH DOCK - DEV
// @namespace    KnightWitch
// @version      1.3.3
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
  const DEV_VERSION = "1.3.3";
  const DEV_SCRIPT_NAME = "WITCH DOCK - DEV";
  const DEV_NAME = `${DEV_SCRIPT_NAME} v${DEV_VERSION}`;
  const DEV_BRANCH = "wd/10-modular-bootstrap";
  const REPO_RAW = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge";
  const CORE_URL = `${REPO_RAW}/${DEV_BRANCH}/Witch_Dock.user.js`;
  const DEV_MANIFEST_URL = `${REPO_RAW}/${DEV_BRANCH}/manifest.json`;
  const COMPACT_EMBLEM_ASSET_URL = `${REPO_RAW}/${DEV_BRANCH}/ASSETS/emblem.png?kwasset=4a9fb6d772adbf884ed29cd1234999ba6e4e0db5`;
  const STABLE_MANIFEST_DECL = 'const MANIFEST_URL = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/manifest.json";';
  const DEV_MANIFEST_DECL = `const MANIFEST_URL = "${DEV_MANIFEST_URL}";`;
  const INLINE_EMBLEM_DECL_RE = /^const COMPACT_EMBLEM_URL = "data:image\/png;base64,[A-Za-z0-9+/=]+";$/m;
  const HOST_API_VERSION = "0.1.0";
  const STORAGE_PREFIX = "kw.";
  const REPO_RAW_PREFIX = `${REPO_RAW}/`;

  const state = {
    channel: "dev",
    version: DEV_VERSION,
    branch: DEV_BRANCH,
    name: DEV_NAME,
    coreUrl: CORE_URL,
    manifestUrl: DEV_MANIFEST_URL,
    compactEmblemUrl: COMPACT_EMBLEM_ASSET_URL,
    bootstrapTransport: "host.requestText",
    presentationAssetMode: "external-compact-emblem",
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

  async function boot() {
    state.status = "fetching-core";
    const coreRequestUrl = `${CORE_URL}?kwdev=${encodeURIComponent(DEV_VERSION)}-${Date.now()}`;
    const source = await PRIVILEGED_HOST.requestText(coreRequestUrl, { cacheControl: "no-cache" });
    if (!source) throw new Error("core fetch returned empty source");

    const manifestMatches = source.split(STABLE_MANIFEST_DECL).length - 1;
    if (manifestMatches !== 1) {
      throw new Error(`expected exactly one Stable manifest seam in core; found ${manifestMatches}`);
    }

    const emblemMatches = source.match(/^const COMPACT_EMBLEM_URL = "data:image\/png;base64,[A-Za-z0-9+/=]+";$/gm) || [];
    if (emblemMatches.length !== 1) {
      throw new Error(`expected exactly one inline compact emblem seam in core; found ${emblemMatches.length}`);
    }

    let devSource = source.replace(STABLE_MANIFEST_DECL, DEV_MANIFEST_DECL);
    devSource = devSource.replace(
      INLINE_EMBLEM_DECL_RE,
      `const COMPACT_EMBLEM_URL = ${JSON.stringify(COMPACT_EMBLEM_ASSET_URL)};`
    );

    state.status = "loading-core";

    // Temporary bounded migration seam for issue #19/#10. The fetched core executes
    // inside this userscript sandbox so its existing GM_* contracts remain intact.
    // PRIVILEGED_HOST remains launcher-local; presentation payload ownership is being
    // migrated in bounded source seams before the legacy monolith is retired.
    eval(`${devSource}\n//# sourceURL=${CORE_URL}?channel=dev&v=${DEV_VERSION}`);

    UW.KWWitchDockManifestURL = DEV_MANIFEST_URL;
    applyDevIdentity();
    state.status = "running";
  }

  boot().catch(showBootError);
})();

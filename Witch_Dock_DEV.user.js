// ==UserScript==
// @name         WITCH DOCK - DEV
// @namespace    KnightWitch
// @version      1.10.2
// @description  Witch Dock modular Dev bootstrap.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_MAIN/Witch_Dock_DEV.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_MAIN/Witch_Dock_DEV.user.js
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
  const DEV_VERSION = "1.10.2";
  const DEV_BUILD = "1.10.2-user-release-copy";
  const DEV_SCRIPT_NAME = "WITCH DOCK - DEV";
  const DEV_NAME = `WITCH DOCK - DEV v${DEV_VERSION}`;
  const DEV_BRANCH = "WITCH_DEV_MAIN";
  const PAYLOAD_REF = "f474c0fc057ed05e574348c87d4e11546786af70";
  const REPO_RAW = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge";
  const PAYLOAD_ROOT = `${REPO_RAW}/${PAYLOAD_REF}/`;
  const MANIFEST_URL = `${PAYLOAD_ROOT}manifest.json`;
  const HOST_API_VERSION = "0.1.0";
  const STORAGE_PREFIX = "kw.";
  const REPO_RAW_PREFIX = `${REPO_RAW}/`;
  const GITHUB_REPO_URL = "https://github.com/Knight-Witch/KnightWitch.Heroforge";
  const KOFI_URL = "https://ko-fi.com/knightwitch";

  const COMPONENTS = Object.freeze([
    ["styles", "features/core/Witch_Dock_Styles.css", "text"],
    ["modals", "features/core/Witch_Dock_Modals.js", "js"],
    ["boneHud", "features/core/Witch_Dock_Bone_HUD.js", "js"],
    ["preferences", "features/core/Witch_Dock_Preferences.js", "js"],
    ["registry", "features/core/Witch_Dock_Registry.js", "js"],
    ["shell", "features/core/Witch_Dock_Shell.js", "js"],
    ["interactions", "features/core/Witch_Dock_Interactions.js", "js"],
    ["history", "features/core/Witch_Dock_History.js", "js"],
    ["application", "features/core/Witch_Dock_Application.js", "js"],
    ["assets", "features/core/Witch_Dock_Assets.js", "js"],
    ["core", "features/core/Witch_Dock_Core.js", "js"],
    ["loader", "features/core/Witch_Dock_Module_Loader.js", "js"]
  ]);

  const EXPECTED = Object.freeze({
    KWWitchDockModals: ["0.2.0", "0.2.0-disclaimer-in-about"],
    KWWitchDockBoneHUD: ["0.1.0", "0.1.0-extracted-bone-hud"],
    KWWitchDockPreferences: ["0.3.0", "0.3.0-tool-enablement-store"],
    KWWitchDockRegistry: ["0.1.0", "0.1.0-tab-tool-state-containers"],
    KWWitchDockShell: ["0.5.1", "0.5.1-inline-version-title-alignment"],
    KWWitchDockInteractions: ["0.6.0", "0.6.0-dock-size-reset"],
    KWWitchDockHistory: ["0.1.0", "0.1.0-undo-redo-owner"],
    KWWitchDockApplication: ["0.1.0", "0.1.0-shell-registry-orchestration"],
    KWWitchDockAssets: ["0.2.0", "0.2.0-polymorph-display-fonts"],
    KWWitchDockCore: ["2.3.0", "2.3.0-branded-title-meta"],
    KWModuleLoader: ["0.2.0", "0.2.0-immutable-payload-root"]
  });

  const state = {
    channel: "dev",
    version: DEV_VERSION,
    build: DEV_BUILD,
    branch: DEV_BRANCH,
    name: DEV_NAME,
    payloadRef: PAYLOAD_REF,
    payloadRoot: PAYLOAD_ROOT,
    manifestUrl: MANIFEST_URL,
    immutablePayload: true,
    bootstrapTransport: "host.requestText",
    legacyMonolithFetched: false,
    legacySourceTransforms: false,
    status: "initializing",
    error: null,
    componentCount: COMPONENTS.length,
    fetchedComponents: 0,
    evaluatedComponents: 0
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
      get(key, fallback) { return GM_getValue(requireStorageKey(key), fallback); },
      set(key, value) { GM_setValue(requireStorageKey(key), value); return true; }
    });

    const pageStorage = Object.freeze({
      getItem(key) { return UW.localStorage.getItem(requireStorageKey(key)); },
      setItem(key, value) { UW.localStorage.setItem(requireStorageKey(key), String(value)); return true; }
    });

    const clipboard = Object.freeze({
      writeText(text) {
        GM_setClipboard(String(text == null ? "" : text), { type: "text", mimetype: "text/plain" });
        return true;
      }
    });

    const styles = Object.freeze({
      add(cssText) { return GM_addStyle(String(cssText == null ? "" : cssText)); }
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
      } catch (_) {
        return Object.freeze({ name: DEV_SCRIPT_NAME, version: DEV_VERSION, description: "" });
      }
    }

    return Object.freeze({
      apiVersion: HOST_API_VERSION,
      requestText,
      download,
      storage,
      pageStorage,
      clipboard,
      styles,
      scriptMeta
    });
  }

  const HOST = createPrivilegedHost();

  UW.KWWitchDockDevChannel = {
    channel: state.channel,
    version: state.version,
    build: state.build,
    branch: state.branch,
    payloadRef: state.payloadRef,
    payloadRoot: state.payloadRoot,
    manifestUrl: state.manifestUrl,
    immutablePayload: true,
    hostApiVersion: HOST_API_VERSION,
    getState: () => ({ ...state })
  };

  function showBootError(error) {
    const message = error && error.message ? error.message : String(error || "unknown Dev bootstrap error");
    state.status = "error";
    state.error = message;
    try { console.error("[Witch Dock Dev] Bootstrap failed:", error); } catch (_) {}
    const existing = document.getElementById("kwWitchDockDevBootError");
    if (existing) existing.remove();
    const box = document.createElement("div");
    box.id = "kwWitchDockDevBootError";
    box.textContent = `WITCH DOCK - DEV failed to start: ${message}`;
    Object.assign(box.style, {
      position: "fixed", right: "16px", bottom: "16px", zIndex: "2147483647",
      maxWidth: "520px", padding: "10px 12px",
      border: "1px solid rgba(255,90,90,0.65)", borderRadius: "8px",
      background: "rgba(24,12,14,0.96)", color: "#fff",
      font: "12px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
      boxShadow: "0 10px 30px rgba(0,0,0,0.55)"
    });
    document.body.appendChild(box);
  }

  function validateApi(name) {
    const api = UW[name];
    const expected = EXPECTED[name];
    if (!api || !expected || api.version !== expected[0] || api.build !== expected[1]) {
      throw new Error(`${name} did not register expected ${expected ? expected.join(" / ") : "API"}.`);
    }
    return api;
  }

  async function boot() {
    state.status = "fetching-immutable-payload";

    const fetched = await Promise.all(COMPONENTS.map(async ([id, path, kind]) => {
      const url = `${PAYLOAD_ROOT}${path}`;
      const source = await HOST.requestText(url, { cacheControl: "no-cache" });
      if (!source) throw new Error(`Empty Stage E payload component: ${id}`);
      state.fetchedComponents += 1;
      return { id, path, kind, url, source };
    }));

    const byId = new Map(fetched.map((item) => [item.id, item]));
    const styleText = byId.get("styles").source;
    if (!styleText.includes("#kwWitchDock") || !styleText.includes("#kwWDCompactIcon") || !styleText.includes("width: 48px") || !styleText.includes("height: 48px")) {
      throw new Error("Immutable core stylesheet failed Stage E contract validation.");
    }

    state.status = "loading-modular-core";
    for (const id of ["modals","boneHud","preferences","registry","shell","interactions","history","application","assets","core"]) {
      const item = byId.get(id);
      eval(`${item.source}\n//# sourceURL=${item.url}`);
      state.evaluatedComponents += 1;
    }

    for (const name of Object.keys(EXPECTED)) {
      if (name === "KWModuleLoader") continue;
      validateApi(name);
    }

    UW.KWWitchDockManifestURL = MANIFEST_URL;
    UW.KWWitchDockPayloadRef = PAYLOAD_REF;
    UW.KWWitchDockPayloadRoot = PAYLOAD_ROOT;

    state.status = "starting-core";
    UW.KWWitchDockCore.start({
      host: HOST,
      styleText,
      channel: "dev",
      displayName: DEV_NAME,
      sourceLabel: `Dev payload · ${PAYLOAD_REF.slice(0, 12)}`,
      payloadRef: PAYLOAD_REF,
      manifestUrl: MANIFEST_URL,
      githubRepoUrl: GITHUB_REPO_URL,
      kofiUrl: KOFI_URL
    });

    state.status = "starting-module-loader";
    const loader = byId.get("loader");
    eval(`${loader.source}\n//# sourceURL=${loader.url}`);
    state.evaluatedComponents += 1;
    validateApi("KWModuleLoader");

    state.status = "running";
    state.error = null;
  }

  boot().catch(showBootError);
})();

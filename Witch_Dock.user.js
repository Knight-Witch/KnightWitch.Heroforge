// ==UserScript==
// @name         Witch Dock v2.3.0
// @namespace    KnightWitch
// @version      2.3.0
// @description  UI for all Witch Scripts - The official release!
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/Witch_Dock.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/Witch_Dock.user.js
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      raw.githubusercontent.com
// @connect      api.github.com
// ==/UserScript==

(async function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const VERSION = "2.3.0";
  const BUILD = "2.3.0-notifications-polymorph";
  const SCRIPT_NAME = "Witch Dock v2.3.0";
  const DISPLAY_NAME = "WITCH DOCK";
  const CHANNEL_BRANCH = "Witch_Scripts";
  const PAYLOAD_REF = "08429de8fe1c3b43dbd223a686ce643b2f34320f";
  const REPO_RAW = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge";
  const PAYLOAD_ROOT = `${REPO_RAW}/${PAYLOAD_REF}/`;
  const MANIFEST_URL = `${PAYLOAD_ROOT}manifest.json`;
  const HOST_API_VERSION = "0.1.0";
  const STORAGE_PREFIX = "kw.";
  const REPO_RAW_PREFIX = `${REPO_RAW}/`;
  const GITHUB_REPO_URL = "https://github.com/Knight-Witch/KnightWitch.Heroforge";
  const KOFI_URL = "https://ko-fi.com/knightwitch";

  const STABLE_HOST_VERSION = "1.0.0";
  const STABLE_HOST_ACTIVE_KEY = "__KW_WD_STABLE_SELF_HOST_ACTIVE__";
  const STABLE_RESOLVED_GUARD_KEY = "__KW_WD_STABLE_RESOLVED_LAUNCHER__";
  const STABLE_REF_URL = `https://api.github.com/repos/Knight-Witch/KnightWitch.Heroforge/git/ref/heads/${CHANNEL_BRANCH}`;
  const STABLE_LAUNCHER_PATH = "Witch_Dock.user.js";
  const STABLE_HEAD_CACHE_KEY = "kw.witchDock.stableHost.head.v1";
  const STABLE_HEAD_CACHE_TTL_MS = 5 * 60 * 1000;
  const STABLE_MAX_SOURCE_CHARS = 180000;
  const STABLE_ALLOWED_GRANTS = new Set([
    "unsafeWindow",
    "GM_info",
    "GM_addStyle",
    "GM_setClipboard",
    "GM_getValue",
    "GM_setValue",
    "GM_xmlhttpRequest",
    "GM_download"
  ]);
  const STABLE_REQUIRED_GRANTS = Object.freeze(Array.from(STABLE_ALLOWED_GRANTS));
  const STABLE_ALLOWED_CONNECTS = new Set(["raw.githubusercontent.com", "api.github.com"]);
  const STABLE_RESOLVED_EXECUTION = !!(UW[STABLE_RESOLVED_GUARD_KEY] && UW[STABLE_RESOLVED_GUARD_KEY].active);

  function stableHostRequest(url, headers) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: headers || { "Cache-Control": "no-cache" },
        responseType: "text",
        timeout: 20000,
        anonymous: true,
        onload: response => {
          if (response.status < 200 || response.status >= 300) {
            reject(new Error(`Stable host request failed: HTTP ${response.status}`));
            return;
          }
          resolve(String(response.responseText || ""));
        },
        onerror: () => reject(new Error("Stable host request failed: network error")),
        ontimeout: () => reject(new Error("Stable host request failed: timeout"))
      });
    });
  }

  function stableHostReadCachedHead() {
    try {
      const value = GM_getValue(STABLE_HEAD_CACHE_KEY, null);
      if (!value || typeof value !== "object") return null;
      const sha = typeof value.sha === "string" ? value.sha.trim().toLowerCase() : "";
      const checkedAt = Number(value.checkedAt || 0);
      if (!/^[0-9a-f]{40}$/.test(sha) || !Number.isFinite(checkedAt) || checkedAt <= 0) return null;
      return { sha, checkedAt };
    } catch (_) {
      return null;
    }
  }

  function stableHostCacheHead(sha) {
    try {
      GM_setValue(STABLE_HEAD_CACHE_KEY, { sha, checkedAt: Date.now() });
    } catch (_) {}
  }

  async function stableHostResolveHead(hostState) {
    const cached = stableHostReadCachedHead();
    if (cached && Date.now() - cached.checkedAt < STABLE_HEAD_CACHE_TTL_MS) {
      hostState.headSource = "fresh-cache";
      return cached.sha;
    }

    try {
      hostState.status = "resolving-branch-head";
      const source = await stableHostRequest(
        `${STABLE_REF_URL}?kwStableHost=${encodeURIComponent(STABLE_HOST_VERSION)}-${Date.now()}`,
        {
          "Accept": "application/vnd.github+json",
          "Cache-Control": "no-cache",
          "X-GitHub-Api-Version": "2022-11-28"
        }
      );
      const payload = JSON.parse(source);
      const sha = payload && payload.object && typeof payload.object.sha === "string"
        ? payload.object.sha.trim().toLowerCase()
        : "";
      if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error("GitHub ref response did not contain a commit SHA");
      stableHostCacheHead(sha);
      hostState.headSource = "github-api";
      return sha;
    } catch (error) {
      if (cached) {
        hostState.headSource = "stale-cache";
        hostState.deliveryWarning = error && error.message ? error.message : String(error);
        return cached.sha;
      }
      throw error;
    }
  }

  function stableHostParseMetadata(source) {
    if (typeof source !== "string" || !source.trim()) throw new Error("Stable launcher fetch returned empty source");
    if (source.length > STABLE_MAX_SOURCE_CHARS) throw new Error("Stable launcher exceeds self-host source limit");
    const blockMatch = source.match(/^\/\/ ==UserScript==\s*\n([\s\S]*?)^\/\/ ==\/UserScript==\s*$/m);
    if (!blockMatch) throw new Error("Stable launcher userscript metadata is missing");
    const values = new Map();
    for (const line of blockMatch[1].split(/\r?\n/)) {
      const match = line.match(/^\/\/\s+@(\S+)\s+(.+?)\s*$/);
      if (!match) continue;
      const list = values.get(match[1]) || [];
      list.push(match[2]);
      values.set(match[1], list);
    }
    const one = key => (values.get(key) || [])[0] || "";
    const version = one("version");
    const expectedName = `Witch Dock v${version}`;
    if (one("name") !== expectedName) throw new Error(`Unexpected Stable launcher name: ${one("name") || "missing"}`);
    if (one("namespace") !== "KnightWitch") throw new Error("Unexpected Stable launcher namespace");
    if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version)) throw new Error("Invalid Stable launcher version");

    const grants = values.get("grant") || [];
    const connects = values.get("connect") || [];
    for (const grant of grants) {
      if (!STABLE_ALLOWED_GRANTS.has(grant)) throw new Error(`Stable launcher requests unsupported grant: ${grant}`);
    }
    for (const grant of STABLE_REQUIRED_GRANTS) {
      if (!grants.includes(grant)) throw new Error(`Stable launcher is missing expected grant: ${grant}`);
    }
    for (const host of connects) {
      if (!STABLE_ALLOWED_CONNECTS.has(host)) throw new Error(`Stable launcher requests unsupported connect host: ${host}`);
    }
    for (const host of STABLE_ALLOWED_CONNECTS) {
      if (!connects.includes(host)) throw new Error(`Stable launcher is missing expected connect host: ${host}`);
    }
    if (values.has("require") || values.has("resource")) throw new Error("Stable launcher cannot add @require or @resource through the self-host");

    const declaredVersion = source.match(/\bconst\s+VERSION\s*=\s*["']([^"']+)["']\s*;/);
    const declaredBuild = source.match(/\bconst\s+BUILD\s*=\s*["']([^"']+)["']\s*;/);
    const declaredBranch = source.match(/\bconst\s+CHANNEL_BRANCH\s*=\s*["']([^"']+)["']\s*;/);
    const declaredPayload = source.match(/\bconst\s+PAYLOAD_REF\s*=\s*["']([0-9a-f]{40})["']\s*;/i);
    if (!declaredVersion || declaredVersion[1] !== version) throw new Error("Stable launcher metadata/runtime version mismatch");
    if (!declaredBuild) throw new Error("Stable launcher build identifier is missing");
    if (!declaredBranch || declaredBranch[1] !== CHANNEL_BRANCH) throw new Error("Stable launcher targets an unexpected branch");
    if (!declaredPayload) throw new Error("Stable launcher immutable payload ref is missing");
    return Object.freeze({
      name: one("name"),
      namespace: one("namespace"),
      version,
      description: one("description"),
      build: declaredBuild[1],
      payloadRef: declaredPayload[1].toLowerCase()
    });
  }

  function stableHostCompareVersions(a, b) {
    const parse = value => {
      const match = String(value || "").match(/^(\d+)\.(\d+)\.(\d+)(?:[-+]([0-9A-Za-z.-]+))?$/);
      if (!match) return null;
      return {
        numbers: [Number(match[1]), Number(match[2]), Number(match[3])],
        suffix: match[4] || ""
      };
    };
    const left = parse(a);
    const right = parse(b);
    if (!left || !right) return 0;
    for (let i = 0; i < 3; i += 1) {
      if (left.numbers[i] !== right.numbers[i]) return left.numbers[i] > right.numbers[i] ? 1 : -1;
    }
    if (left.suffix === right.suffix) return 0;
    if (!left.suffix) return 1;
    if (!right.suffix) return -1;
    return left.suffix > right.suffix ? 1 : -1;
  }

  function stableHostPayloadInfo(meta) {
    const baseInfo = typeof GM_info === "object" && GM_info ? GM_info : {};
    const baseScript = baseInfo.script && typeof baseInfo.script === "object" ? baseInfo.script : {};
    return Object.freeze({
      ...baseInfo,
      script: Object.freeze({
        ...baseScript,
        name: meta.name,
        namespace: meta.namespace,
        version: meta.version,
        description: meta.description
      })
    });
  }

  async function stableHostFetchLauncher(headSha, hostState) {
    hostState.status = "fetching-immutable-launcher";
    const immutableUrl = `${REPO_RAW}/${headSha}/${STABLE_LAUNCHER_PATH}`;
    hostState.resolvedHeadSha = headSha;
    hostState.resolvedLauncherUrl = immutableUrl;
    const source = await stableHostRequest(
      `${immutableUrl}?kwStableHost=${encodeURIComponent(STABLE_HOST_VERSION)}-${Date.now()}`,
      { "Cache-Control": "no-cache" }
    );
    return { source, immutableUrl };
  }

  function stableHostExecuteLauncher(source, meta, headSha, hostState) {
    hostState.status = "executing-resolved-launcher";
    UW[STABLE_RESOLVED_GUARD_KEY] = Object.freeze({ active: true, headSha, version: meta.version });
    try {
      const run = new Function(
        "unsafeWindow",
        "GM_info",
        "GM_addStyle",
        "GM_setClipboard",
        "GM_getValue",
        "GM_setValue",
        "GM_xmlhttpRequest",
        "GM_download",
        `"use strict";\n${source}\n//# sourceURL=${hostState.resolvedLauncherUrl}?executedBy=stable-self-host&v=${encodeURIComponent(meta.version)}`
      );
      run(
        UW,
        stableHostPayloadInfo(meta),
        GM_addStyle,
        GM_setClipboard,
        GM_getValue,
        GM_setValue,
        GM_xmlhttpRequest,
        GM_download
      );
      hostState.status = "resolved-launcher-dispatched";
      hostState.resolvedLauncherVersion = meta.version;
      hostState.resolvedLauncherBuild = meta.build;
      hostState.resolvedPayloadRef = meta.payloadRef;
      hostState.executedAt = new Date().toISOString();
    } finally {
      try { delete UW[STABLE_RESOLVED_GUARD_KEY]; } catch (_) { UW[STABLE_RESOLVED_GUARD_KEY] = undefined; }
    }
  }

  if (!STABLE_RESOLVED_EXECUTION) {
    if (UW[STABLE_HOST_ACTIVE_KEY]) return;
    UW[STABLE_HOST_ACTIVE_KEY] = true;

    const stableHostState = {
      hostVersion: STABLE_HOST_VERSION,
      installedWrapperVersion: VERSION,
      targetBranch: CHANNEL_BRANCH,
      targetRefUrl: STABLE_REF_URL,
      resolvedHeadSha: null,
      resolvedLauncherUrl: null,
      resolvedLauncherVersion: null,
      resolvedLauncherBuild: null,
      resolvedPayloadRef: null,
      headSource: null,
      status: "starting",
      checkedAt: null,
      executedAt: null,
      deliveryWarning: null,
      error: null
    };

    UW.KWWitchDockStableHost = Object.freeze({
      version: STABLE_HOST_VERSION,
      getState: () => ({ ...stableHostState })
    });

    try {
      const headSha = await stableHostResolveHead(stableHostState);
      stableHostState.checkedAt = new Date().toISOString();
      const fetched = await stableHostFetchLauncher(headSha, stableHostState);
      const meta = stableHostParseMetadata(fetched.source);
      stableHostState.resolvedLauncherVersion = meta.version;
      stableHostState.resolvedLauncherBuild = meta.build;
      stableHostState.resolvedPayloadRef = meta.payloadRef;

      const versionOrder = stableHostCompareVersions(meta.version, VERSION);
      const localIsCurrent =
        meta.version === VERSION &&
        meta.build === BUILD &&
        meta.payloadRef === PAYLOAD_REF;

      if (versionOrder < 0) {
        stableHostState.status = "local-wrapper-newer-than-branch";
        stableHostState.deliveryWarning = `Resolved branch launcher v${meta.version} is older than installed wrapper v${VERSION}; refusing downgrade.`;
      } else if (!localIsCurrent) {
        stableHostExecuteLauncher(fetched.source, meta, headSha, stableHostState);
        return;
      } else {
        stableHostState.status = "local-wrapper-current";
      }
    } catch (error) {
      stableHostState.status = "local-fallback";
      stableHostState.error = error && error.message ? error.message : String(error || "stable self-host failure");
      try { console.warn("[Witch Dock Stable Host] Latest-launcher resolution failed; using installed wrapper.", error); } catch (_) {}
    }
  }


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
    channel: "stable",
    version: VERSION,
    build: BUILD,
    branch: CHANNEL_BRANCH,
    name: SCRIPT_NAME,
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
          name: script && typeof script.name === "string" ? script.name : SCRIPT_NAME,
          version: script && typeof script.version === "string" ? script.version : VERSION,
          description: script && typeof script.description === "string" ? script.description : ""
        });
      } catch (_) {
        return Object.freeze({ name: SCRIPT_NAME, version: VERSION, description: "" });
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

  UW.KWWitchDockChannel = {
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
    const message = error && error.message ? error.message : String(error || "unknown Stable bootstrap error");
    state.status = "error";
    state.error = message;
    try { console.error("[Witch Dock] Bootstrap failed:", error); } catch (_) {}
    const existing = document.getElementById("kwWitchDockBootError");
    if (existing) existing.remove();
    const box = document.createElement("div");
    box.id = "kwWitchDockBootError";
    box.textContent = `WITCH DOCK failed to start: ${message}`;
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
      channel: "stable",
      displayName: DISPLAY_NAME,
      sourceLabel: `Stable payload · ${PAYLOAD_REF.slice(0, 12)}`,
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

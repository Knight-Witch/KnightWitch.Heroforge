// ==UserScript==
// @name         WITCH DOCK - DEV AUTO HOST
// @namespace    KnightWitch
// @version      0.1.1
// @description  Loads the current Witch Dock Dev launcher on every HeroForge page load.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/wd/dev-auto-host/devtools/Witch_Dock_DEV_Auto_Host.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/wd/dev-auto-host/devtools/Witch_Dock_DEV_Auto_Host.user.js
// @grant        unsafeWindow
// @grant        GM_info
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

  const HOST_VERSION = "0.1.1";
  const TARGET_NAME = "WITCH DOCK - DEV";
  const TARGET_NAMESPACE = "KnightWitch";
  const TARGET_BRANCH = "WITCH_DEV_MAIN";
  const TARGET_URL = `https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/${TARGET_BRANCH}/Witch_Dock_DEV.user.js`;
  const MAX_SOURCE_CHARS = 160000;
  const REQUIRED_GRANTS = Object.freeze([
    "unsafeWindow",
    "GM_addStyle",
    "GM_setClipboard",
    "GM_getValue",
    "GM_setValue",
    "GM_xmlhttpRequest",
    "GM_download"
  ]);
  const ALLOWED_GRANTS = new Set([...REQUIRED_GRANTS, "GM_info"]);
  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

  if (UW.__KW_WD_DEV_AUTO_HOST_ACTIVE__) return;
  UW.__KW_WD_DEV_AUTO_HOST_ACTIVE__ = true;

  const state = {
    hostVersion: HOST_VERSION,
    targetBranch: TARGET_BRANCH,
    targetUrl: TARGET_URL,
    payloadVersion: null,
    status: "starting",
    attempts: 0,
    fetchedAt: null,
    executedAt: null,
    error: null
  };

  UW.KWWitchDockDevAutoHost = Object.freeze({
    version: HOST_VERSION,
    getState: () => ({ ...state })
  });

  function showHostError(error) {
    const message = error && error.message ? error.message : String(error || "unknown auto-host error");
    state.status = "error";
    state.error = message;
    try { console.error("[Witch Dock Dev Auto Host] Failed:", error); } catch {}

    const existing = document.getElementById("kwWitchDockDevAutoHostError");
    if (existing) existing.remove();
    const box = document.createElement("div");
    box.id = "kwWitchDockDevAutoHostError";
    box.textContent = `WITCH DOCK - DEV AUTO HOST failed: ${message}`;
    Object.assign(box.style, {
      position: "fixed",
      right: "16px",
      bottom: "16px",
      zIndex: "2147483647",
      maxWidth: "560px",
      padding: "10px 12px",
      border: "1px solid rgba(255,90,90,0.65)",
      borderRadius: "8px",
      background: "rgba(24,12,14,0.96)",
      color: "#fff",
      font: "12px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
      boxShadow: "0 10px 30px rgba(0,0,0,0.55)"
    });
    (document.body || document.documentElement).appendChild(box);
  }

  function parseMetadata(source) {
    if (typeof source !== "string" || !source.trim()) throw new Error("Dev launcher fetch returned empty source");
    if (source.length > MAX_SOURCE_CHARS) throw new Error("Dev launcher exceeds the auto-host source limit");
    const blockMatch = source.match(/^\/\/ ==UserScript==\s*\n([\s\S]*?)^\/\/ ==\/UserScript==\s*$/m);
    if (!blockMatch) throw new Error("Dev launcher userscript metadata is missing");
    const values = new Map();
    for (const line of blockMatch[1].split(/\r?\n/)) {
      const match = line.match(/^\/\/\s+@(\S+)\s+(.+?)\s*$/);
      if (!match) continue;
      const list = values.get(match[1]) || [];
      list.push(match[2]);
      values.set(match[1], list);
    }
    const one = key => (values.get(key) || [])[0] || "";
    const grants = values.get("grant") || [];
    const connects = values.get("connect") || [];
    if (one("name") !== TARGET_NAME) throw new Error(`Unexpected Dev launcher name: ${one("name") || "missing"}`);
    if (one("namespace") !== TARGET_NAMESPACE) throw new Error("Unexpected Dev launcher namespace");
    if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(one("version"))) throw new Error("Invalid Dev launcher version");
    for (const grant of grants) {
      if (!ALLOWED_GRANTS.has(grant)) throw new Error(`Dev launcher requests unsupported grant: ${grant}`);
    }
    for (const grant of REQUIRED_GRANTS) {
      if (!grants.includes(grant)) throw new Error(`Dev launcher is missing expected grant: ${grant}`);
    }
    if (values.has("require") || values.has("resource")) throw new Error("Dev launcher cannot add @require or @resource through the auto host");
    if (!connects.includes("raw.githubusercontent.com")) throw new Error("Dev launcher is missing the expected @connect host");
    if (connects.some(host => host !== "raw.githubusercontent.com")) throw new Error("Dev launcher requests an unsupported @connect host");
    const declaredVersion = source.match(/\bconst\s+DEV_VERSION\s*=\s*["']([^"']+)["']\s*;/);
    const declaredBranch = source.match(/\bconst\s+DEV_BRANCH\s*=\s*["']([^"']+)["']\s*;/);
    if (!declaredVersion || declaredVersion[1] !== one("version")) throw new Error("Dev launcher metadata/runtime version mismatch");
    if (!declaredBranch || declaredBranch[1] !== TARGET_BRANCH) throw new Error("Dev launcher targets an unexpected branch");
    return Object.freeze({
      name: one("name"),
      namespace: one("namespace"),
      version: one("version"),
      description: one("description")
    });
  }

  function requestLauncher(attempt) {
    state.attempts = attempt;
    state.status = "fetching-launcher";
    const url = `${TARGET_URL}?kwDevAutoHost=${encodeURIComponent(HOST_VERSION)}-${Date.now()}-${attempt}`;
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: { "Cache-Control": "no-cache" },
        responseType: "text",
        timeout: 20000,
        anonymous: true,
        onload: response => {
          if (response.status < 200 || response.status >= 300) {
            reject(new Error(`Dev launcher fetch failed: HTTP ${response.status}`));
            return;
          }
          resolve(String(response.responseText || ""));
        },
        onerror: () => reject(new Error("Dev launcher fetch failed: network error")),
        ontimeout: () => reject(new Error("Dev launcher fetch failed: timeout"))
      });
    });
  }

  async function fetchWithRetry() {
    let lastError = null;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try { return await requestLauncher(attempt); }
      catch (error) {
        lastError = error;
        if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 300));
      }
    }
    throw lastError || new Error("Dev launcher fetch failed");
  }

  function payloadInfo(meta) {
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

  function executeLauncher(source, meta) {
    if (UW.KWWitchDockDevChannel) {
      throw new Error("The direct WITCH DOCK - DEV userscript is also enabled; disable it before using the auto host");
    }
    state.status = "executing-launcher";
    state.payloadVersion = meta.version;
    const run = new Function(
      "unsafeWindow",
      "GM_info",
      "GM_addStyle",
      "GM_setClipboard",
      "GM_getValue",
      "GM_setValue",
      "GM_xmlhttpRequest",
      "GM_download",
      `"use strict";\n${source}\n//# sourceURL=${TARGET_URL}?executedBy=dev-auto-host&v=${encodeURIComponent(meta.version)}`
    );
    run(
      UW,
      payloadInfo(meta),
      GM_addStyle,
      GM_setClipboard,
      GM_getValue,
      GM_setValue,
      GM_xmlhttpRequest,
      GM_download
    );
    state.status = "launcher-executed";
    state.executedAt = new Date().toISOString();
  }

  async function boot() {
    const source = await fetchWithRetry();
    const meta = parseMetadata(source);
    state.fetchedAt = new Date().toISOString();
    executeLauncher(source, meta);
  }

  boot().catch(showHostError);
})();

// ==UserScript==
// @name         WITCH DOCK - DEV v1.2.2
// @namespace    KnightWitch
// @version      1.2.2
// @description  Witch Dock canonical development channel. Loads WITCH_DEV_MAIN only.
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
  const DEV_VERSION = "1.2.2";
  const DEV_NAME = `WITCH DOCK - DEV v${DEV_VERSION}`;
  const DEV_BRANCH = "WITCH_DEV_MAIN";
  const REPO_RAW = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge";
  const CORE_URL = `${REPO_RAW}/${DEV_BRANCH}/Witch_Dock.user.js`;
  const DEV_MANIFEST_URL = `${REPO_RAW}/${DEV_BRANCH}/manifest.json`;
  const STABLE_MANIFEST_DECL = 'const MANIFEST_URL = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/manifest.json";';
  const DEV_MANIFEST_DECL = `const MANIFEST_URL = "${DEV_MANIFEST_URL}";`;

  const state = {
    channel: "dev",
    version: DEV_VERSION,
    branch: DEV_BRANCH,
    name: DEV_NAME,
    coreUrl: CORE_URL,
    manifestUrl: DEV_MANIFEST_URL,
    status: "initializing",
    error: null
  };

  UW.KWWitchDockDevChannel = {
    channel: state.channel,
    version: state.version,
    branch: state.branch,
    name: state.name,
    coreUrl: state.coreUrl,
    manifestUrl: state.manifestUrl,
    getState: () => ({ ...state })
  };

  function applyDevIdentity() {
    const title = document.getElementById("kwWDTitle");
    if (!title) return false;
    title.textContent = DEV_NAME;
    title.setAttribute("data-kw-channel", "dev");
    title.title = `Canonical Dev · ${DEV_BRANCH}`;
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

  function fetchCore() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `${CORE_URL}?kwdev=${encodeURIComponent(DEV_VERSION)}-${Date.now()}`,
        headers: { "Cache-Control": "no-cache" },
        onload: (res) => {
          if (res.status >= 200 && res.status < 300 && res.responseText) resolve(res.responseText);
          else reject(new Error(`core fetch HTTP ${res.status || "unknown"}`));
        },
        onerror: () => reject(new Error("core fetch connection error")),
        ontimeout: () => reject(new Error("core fetch timed out"))
      });
    });
  }

  async function boot() {
    const source = await fetchCore();
    const matches = source.split(STABLE_MANIFEST_DECL).length - 1;
    if (matches !== 1) {
      throw new Error(`expected exactly one Stable manifest seam in core; found ${matches}`);
    }

    const devSource = source.replace(STABLE_MANIFEST_DECL, DEV_MANIFEST_DECL);
    state.status = "loading-core";

    // Temporary bounded migration seam for issue #19/#10. The fetched core executes
    // inside this userscript sandbox so its existing GM_* contracts remain intact.
    eval(`${devSource}\n//# sourceURL=${CORE_URL}?channel=dev&v=${DEV_VERSION}`);

    UW.KWWitchDockManifestURL = DEV_MANIFEST_URL;
    applyDevIdentity();
    state.status = "running";
  }

  boot().catch(showBootError);
})();

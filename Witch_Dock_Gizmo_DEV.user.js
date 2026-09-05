// ==UserScript==
// @name         Witch Dock — Bound Decal Gizmo DEV
// @namespace    KnightWitch
// @version      0.3.1
// @description  DEV add-on: corrected bound decal gizmo with native HeroForge Transformer visuals.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV/Witch_Dock_Gizmo_DEV.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV/Witch_Dock_Gizmo_DEV.user.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const BASE = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV/";
  const GIZMO_PARTS = [
    "HeroForge_UI/dev-gizmo/part-00.jsfrag",
    "HeroForge_UI/dev-gizmo/part-01.jsfrag",
    "HeroForge_UI/dev-gizmo/part-02.jsfrag",
    "HeroForge_UI/dev-gizmo/part-03.jsfrag",
    "HeroForge_UI/dev-gizmo/part-04.jsfrag"
  ];
  const UI_MODULE = "tools/Decals.js";
  const MAX_WAIT_MS = 10000;
  const POLL_MS = 250;

  function gmGetText(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: { "Cache-Control": "no-cache" },
        onload: res => {
          if (res.status >= 200 && res.status < 300) resolve(res.responseText || "");
          else reject(new Error(`HTTP ${res.status} for ${url}`));
        },
        onerror: () => reject(new Error(`Network error for ${url}`))
      });
    });
  }

  function execute(code, label) {
    if (!code) throw new Error(`Empty module: ${label}`);
    const fn = new Function("unsafeWindow", `${code}\n//# sourceURL=${label}`);
    fn(UW);
  }

  function waitForDock() {
    return new Promise((resolve, reject) => {
      const started = Date.now();
      const tick = () => {
        if (UW.WitchDock && typeof UW.WitchDock.registerTool === "function") return resolve();
        if (Date.now() - started >= MAX_WAIT_MS) {
          return reject(new Error("Witch Dock was not detected. Keep the normal Witch Dock userscript enabled while testing this DEV add-on."));
        }
        setTimeout(tick, POLL_MS);
      };
      tick();
    });
  }

  async function fetchFresh(path) {
    return gmGetText(`${BASE}${path}?dev=${Date.now()}-${Math.random()}`);
  }

  function replaceExactlyOnce(source, before, after, label) {
    const first = source.indexOf(before);
    if (first < 0) throw new Error(`DEV source fix missing expected ${label} anchor.`);
    if (source.indexOf(before, first + before.length) >= 0) {
      throw new Error(`DEV source fix found ambiguous ${label} anchors.`);
    }
    return source.slice(0, first) + after + source.slice(first + before.length);
  }

  function restoreValidatedV041Rules(source) {
    // DEV-only extraction regression repair. v0.4.1 was validated with the
    // normalized projector midpoint [0.5,0.5,0.5] and the locator world
    // quaternion in every transform mode. Remove these source repairs when the
    // maintained fragments are consolidated for public promotion.
    source = replaceExactlyOnce(
      source,
      "const BUILD = \"1.0.1-dev-native-transformer-visual\";",
      "const BUILD = \"1.0.2-dev-native-transformer-center-frame\";",
      "build marker"
    );
    source = replaceExactlyOnce(
      source,
      "const localCenters = worldToCanonical.map(inverse => normalizeHomogeneous(mat4MulVec4(inverse, [0, 0, 0, 1])));",
      "const localCenters = worldToCanonical.map(inverse => normalizeHomogeneous(mat4MulVec4(inverse, [0.5, 0.5, 0.5, 1])));",
      "projector midpoint"
    );
    source = replaceExactlyOnce(
      source,
      "proxy.quaternion.copy(mode === 'translate' ? parentWorld.quaternion : locatorWorld.quaternion);",
      "proxy.quaternion.copy(locatorWorld.quaternion);",
      "Move sync orientation"
    );
    source = replaceExactlyOnce(
      source,
      "proxy.quaternion.copy(mode === \"translate\" ? parentWorld.quaternion : locatorWorld.quaternion);",
      "proxy.quaternion.copy(locatorWorld.quaternion);",
      "Move initial orientation"
    );
    return source;
  }

  async function start() {
    try {
      await waitForDock();
      const parts = [];
      for (const path of GIZMO_PARTS) parts.push(await fetchFresh(path));
      const gizmoSource = restoreValidatedV041Rules(parts.join(""));
      execute(gizmoSource, `${BASE}HeroForge_UI/Corrected_Bound_Decal_Gizmo.js`);
      execute(await fetchFresh(UI_MODULE), `${BASE}${UI_MODULE}`);
      console.info("[Witch Dock DEV] Corrected bound decal gizmo v0.3.1 loaded with restored v0.4.1 center/orientation rules.");
    } catch (error) {
      console.error("[Witch Dock DEV] Bound decal gizmo load failed:", error);
    }
  }

  start();
})();

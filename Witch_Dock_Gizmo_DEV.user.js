// ==UserScript==
// @name         Witch Dock — Bound Decal Gizmo DEV
// @namespace    KnightWitch
// @version      0.3.2
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

  function prepareDevGizmoSource(source) {
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

    // Native EX.Transformer Translate proved visually displaced/misoriented for
    // this corrected world-space proxy. Restore the v0.4.1 Move presentation:
    // custom screen-projected axes at the validated projector center, while
    // retaining native EX.Transformer visuals for Rotate and Scale.
    source = replaceExactlyOnce(
      source,
      "if (!enabled || !proxy || !transformer) return;\n    if (mode === 'translate') {\n      forwardNativeMoveProxy(finalize);\n      return;\n    }",
      "if (!enabled || mode === 'translate' || !proxy || !transformer) return;",
      "disable native Translate forwarding"
    );

    source = replaceExactlyOnce(
      source,
      "if (transformer) {\n      transformer.visible = true;\n      transformer.setMode(nextMode);\n      if (typeof transformer.setSpace === \"function\") transformer.setSpace(\"local\");\n      if (latest && latest.ok) syncProxyFromCurrent(latest);\n    }",
      "if (transformer) {\n      if (nextMode === \"translate\") {\n        transformer.visible = false;\n      } else {\n        transformer.visible = true;\n        transformer.setMode(nextMode);\n        if (typeof transformer.setSpace === \"function\") transformer.setSpace(\"local\");\n        if (latest && latest.ok) syncProxyFromCurrent(latest);\n      }\n    }",
      "mode-specific Transformer visibility"
    );

    source = replaceExactlyOnce(
      source,
      "transformer.visible = true;\n      transformer.setMode(mode);\n      if (typeof transformer.setSpace === \"function\") transformer.setSpace(\"local\");",
      "transformer.visible = mode !== \"translate\";\n      if (mode !== \"translate\") {\n        transformer.setMode(mode);\n        if (typeof transformer.setSpace === \"function\") transformer.setSpace(\"local\");\n      }",
      "initial Transformer visibility"
    );

    source = replaceExactlyOnce(
      source,
      "installMovePointerHandlers(knob, def.axis);",
      "installMovePointerHandlers(line, def.axis);\n      installMovePointerHandlers(knob, def.axis);",
      "Move shaft pointer handling"
    );

    source = replaceExactlyOnce(
      source,
      "function mount() {\n    if (refreshTimer !== null) return;\n    // Move now uses HeroForge's own EX.Transformer visual at the corrected anchor.\n    // The legacy DOM overlay remains unmounted as a rollback reference during DEV.\n    refreshTimer = window.setInterval(refreshFeature, REFRESH_MS);\n    refreshFeature();\n  }",
      "function mount() {\n    if (refreshTimer !== null) return;\n    installStyle();\n    createMoveOverlay();\n    refreshTimer = window.setInterval(refreshFeature, REFRESH_MS);\n    refreshFeature();\n    if (rafId === null) rafId = window.requestAnimationFrame(updateOverlayFrame);\n  }",
      "validated Move overlay mount"
    );

    // HeroForge-style visual treatment for the validated custom Move handles.
    source = replaceExactlyOnce(
      source,
      "#${OVERLAY_ID} .hfc-move-center{position:absolute;left:0;top:0;transform:translate(-50%,-50%);width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(15,15,18,.78);border:2px solid white;color:white;font:700 15px Arial;cursor:move;pointer-events:auto;box-shadow:0 1px 4px #000}\n      #${OVERLAY_ID} .hfc-move-axis{position:absolute;left:0;top:0;transform-origin:0 0;height:0;pointer-events:none}\n      #${OVERLAY_ID} .hfc-move-axis-line{position:absolute;left:10px;top:-2px;height:4px;border-radius:2px;background:currentColor;opacity:.86}\n      #${OVERLAY_ID} .hfc-move-axis-knob{position:absolute;left:${AXIS_VISUAL_LENGTH_PX}px;top:0;transform:translate(-50%,-50%);width:23px;height:23px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#1b1b1f;border:2px solid currentColor;color:currentColor;font:700 11px Arial;cursor:grab;pointer-events:auto;box-shadow:0 1px 4px #000}\n      #${OVERLAY_ID} .hfc-axis-h{color:#ff4e4e}\n      #${OVERLAY_ID} .hfc-axis-v{color:#47e56a}\n      #${OVERLAY_ID} .hfc-axis-d{color:#4d8dff}",
      "#${OVERLAY_ID} .hfc-move-center{position:absolute;left:0;top:0;transform:translate(-50%,-50%) rotate(45deg);width:18px;height:18px;box-sizing:border-box;background:rgba(135,190,245,.78);border:1px solid rgba(220,240,255,.8);color:transparent;font-size:0;cursor:move;pointer-events:auto;box-shadow:0 1px 3px rgba(0,0,0,.55)}\n      #${OVERLAY_ID} .hfc-move-axis{position:absolute;left:0;top:0;transform-origin:0 0;height:0;pointer-events:none}\n      #${OVERLAY_ID} .hfc-move-axis-line{position:absolute;left:7px;top:-2.5px;height:5px;border-radius:1px;background:currentColor;opacity:.72;pointer-events:auto;cursor:grab}\n      #${OVERLAY_ID} .hfc-move-axis-knob{position:absolute;left:${AXIS_VISUAL_LENGTH_PX}px;top:0;transform:translate(-3px,-50%);width:0;height:0;border-top:9px solid transparent;border-bottom:9px solid transparent;border-left:16px solid currentColor;background:transparent;color:transparent;font-size:0;cursor:grab;pointer-events:auto;filter:drop-shadow(0 1px 1px rgba(0,0,0,.45))}\n      #${OVERLAY_ID} .hfc-axis-h{color:#d91f1f}\n      #${OVERLAY_ID} .hfc-axis-v{color:#25b83c}\n      #${OVERLAY_ID} .hfc-axis-d{color:#233fc9}",
      "HeroForge-style Move CSS"
    );

    return source;
  }

  async function start() {
    try {
      await waitForDock();
      const parts = [];
      for (const path of GIZMO_PARTS) parts.push(await fetchFresh(path));
      const gizmoSource = prepareDevGizmoSource(parts.join(""));
      execute(gizmoSource, `${BASE}HeroForge_UI/Corrected_Bound_Decal_Gizmo.js`);
      execute(await fetchFresh(UI_MODULE), `${BASE}${UI_MODULE}`);
      console.info("[Witch Dock DEV] Corrected bound decal gizmo v0.3.2 loaded: validated custom Move geometry with HeroForge-style visuals; native Rotate/Scale retained.");
    } catch (error) {
      console.error("[Witch Dock DEV] Bound decal gizmo load failed:", error);
    }
  }

  start();
})();

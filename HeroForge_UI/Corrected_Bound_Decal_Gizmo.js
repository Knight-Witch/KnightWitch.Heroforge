(function () {
  "use strict";

  const UW = Function("return typeof unsafeWindow !== 'undefined' ? unsafeWindow : window")();
  const BASE = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/HeroForge_UI/corrected-bound-decal-gizmo/";
  const PARTS = [
    "part-00.jsfrag",
    "part-01.jsfrag",
    "part-02.jsfrag",
    "part-03.jsfrag",
    "part-04.jsfrag"
  ];

  function replaceExactlyOnce(source, before, after, label) {
    const first = source.indexOf(before);
    if (first < 0) throw new Error(`Stable source fix missing expected ${label} anchor.`);
    if (source.indexOf(before, first + before.length) >= 0) {
      throw new Error(`Stable source fix found ambiguous ${label} anchors.`);
    }
    return source.slice(0, first) + after + source.slice(first + before.length);
  }

  function applyAcceptedV031Rules(source) {
    source = replaceExactlyOnce(
      source,
      'const BUILD = "1.0.1-dev-native-transformer-visual";',
      'const BUILD = "1.0.2-stable-native-transformer-center-frame";',
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
      'proxy.quaternion.copy(mode === "translate" ? parentWorld.quaternion : locatorWorld.quaternion);',
      "proxy.quaternion.copy(locatorWorld.quaternion);",
      "Move initial orientation"
    );
    return source;
  }

  async function load() {
    try {
      const sources = await Promise.all(PARTS.map(async (path) => {
        const response = await fetch(BASE + path, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status} loading ${path}`);
        return response.text();
      }));
      const source = applyAcceptedV031Rules(sources.join(""));
      new Function("unsafeWindow", `${source}\n//# sourceURL=${BASE}Corrected_Bound_Decal_Gizmo.js`)(UW);
      console.info("[Witch Dock] Corrected bound decal gizmo stable module loaded.");
    } catch (error) {
      console.error("[Witch Dock] Corrected bound decal gizmo failed closed:", error);
    }
  }

  load();
})();

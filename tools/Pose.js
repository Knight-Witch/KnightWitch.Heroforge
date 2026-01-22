(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getUndoQueue() {
    const CK = UW.CK;
    const u = CK && CK.UndoQueue ? CK.UndoQueue : null;
    if (!u || !Array.isArray(u.queue) || typeof u.currentIndex !== "number") return null;
    return u;
  }

  function getCurrentCharacterJson() {
    const CK = UW.CK;
    const u = getUndoQueue();
    if (u && u.queue && u.queue[u.currentIndex]) return deepClone(u.queue[u.currentIndex]);

    const candidates = [
      "getCurrentCharacterJson",
      "getCharacterJson",
      "getSaveCharacterJson",
      "getSaveData",
      "getCharacterData",
      "getJson",
    ];

    for (const k of candidates) {
      if (CK && typeof CK[k] === "function") {
        try {
          const v = CK[k]();
          if (v && typeof v === "object") return deepClone(v);
        } catch (_) {}
      }
    }

    return null;
  }

  function tryLoadCharacter(json) {
    const CK = UW.CK;
    if (!CK || typeof CK.tryLoadCharacter !== "function") return false;
    try {
      CK.tryLoadCharacter(deepClone(json), "Witch Dock", function () {});
      return true;
    } catch (_) {
      return false;
    }
  }

  function ensureObj(root, key) {
    if (!root || typeof root !== "object") return null;
    const v = root[key];
    if (!v || typeof v !== "object") {
      root[key] = {};
      return root[key];
    }
    return v;
  }

  function extractPinned(main) {
    const pinned = {
      environment: main && typeof main.environment === "object" ? deepClone(main.environment) : undefined,
      fx: main && typeof main.fx === "object" ? deepClone(main.fx) : undefined,
      usedCollections: main && typeof main.usedCollections === "object" ? deepClone(main.usedCollections) : undefined,
      baseParts: {},
      basePaints: {},
      basePaintByIntent: {},
      baseDecals: {},
      baseSliders: {},
    };

    const parts = main && typeof main.parts === "object" ? main.parts : null;
    if (parts) {
      for (const k of ["base", "baseRim", "label"]) {
        if (k in parts) pinned.baseParts[k] = deepClone(parts[k]);
      }
    }

    const paints = main && typeof main.paints === "object" ? main.paints : null;
    if (paints && "baseRim" in paints) pinned.basePaints.baseRim = deepClone(paints.baseRim);

    const paintByIntent = main && typeof main.paintByIntent === "object" ? main.paintByIntent : null;
    if (paintByIntent && "baseRim" in paintByIntent) pinned.basePaintByIntent.baseRim = deepClone(paintByIntent.baseRim);

    const sliders = main && typeof main.sliders === "object" ? main.sliders : null;
    if (sliders && "initiative_base_width" in sliders) pinned.baseSliders.initiative_base_width = deepClone(sliders.initiative_base_width);

    const decals = main && typeof main.decals === "object" ? main.decals : null;
    if (decals && typeof decals === "object") {
      for (const [k, v] of Object.entries(decals)) {
        if (!v || typeof v !== "object") continue;
        const f = v.filter;
        if (f && typeof f === "object" && Object.prototype.hasOwnProperty.call(f, "baseRim")) {
          pinned.baseDecals[k] = deepClone(v);
        }
      }
    }

    return pinned;
  }

  function reapplyPinned(main, extra, pinned) {
    if (!pinned || typeof pinned !== "object") return;

    if (pinned.environment !== undefined) main.environment = deepClone(pinned.environment);
    if (pinned.fx !== undefined) main.fx = deepClone(pinned.fx);
    if (pinned.usedCollections !== undefined) main.usedCollections = deepClone(pinned.usedCollections);

    const mainParts = ensureObj(main, "parts");
    const extraParts = ensureObj(extra, "parts");

    for (const k of ["base", "baseRim", "label"]) {
      if (pinned.baseParts && Object.prototype.hasOwnProperty.call(pinned.baseParts, k)) {
        mainParts[k] = deepClone(pinned.baseParts[k]);
      } else {
        if (mainParts && Object.prototype.hasOwnProperty.call(mainParts, k)) delete mainParts[k];
      }
      if (extraParts && Object.prototype.hasOwnProperty.call(extraParts, k)) delete extraParts[k];
    }

    const mainPaints = ensureObj(main, "paints");
    const extraPaints = ensureObj(extra, "paints");
    if (pinned.basePaints && Object.prototype.hasOwnProperty.call(pinned.basePaints, "baseRim")) {
      mainPaints.baseRim = deepClone(pinned.basePaints.baseRim);
    }
    if (extraPaints && Object.prototype.hasOwnProperty.call(extraPaints, "baseRim")) delete extraPaints.baseRim;

    const mainPBI = ensureObj(main, "paintByIntent");
    const extraPBI = ensureObj(extra, "paintByIntent");
    if (pinned.basePaintByIntent && Object.prototype.hasOwnProperty.call(pinned.basePaintByIntent, "baseRim")) {
      mainPBI.baseRim = deepClone(pinned.basePaintByIntent.baseRim);
    }
    if (extraPBI && Object.prototype.hasOwnProperty.call(extraPBI, "baseRim")) delete extraPBI.baseRim;

    const mainSliders = ensureObj(main, "sliders");
    const extraSliders = ensureObj(extra, "sliders");
    if (pinned.baseSliders && Object.prototype.hasOwnProperty.call(pinned.baseSliders, "initiative_base_width")) {
      mainSliders.initiative_base_width = deepClone(pinned.baseSliders.initiative_base_width);
    }
    if (extraSliders && Object.prototype.hasOwnProperty.call(extraSliders, "initiative_base_width")) delete extraSliders.initiative_base_width;

    const mainDecals = ensureObj(main, "decals");
    const extraDecals = ensureObj(extra, "decals");
    if (pinned.baseDecals && typeof pinned.baseDecals === "object") {
      for (const [k, v] of Object.entries(pinned.baseDecals)) {
        mainDecals[k] = deepClone(v);
        if (extraDecals && Object.prototype.hasOwnProperty.call(extraDecals, k)) delete extraDecals[k];
      }
    }
  }

  function swapMainExtra(json) {
    if (!json || typeof json !== "object") return null;
    if (!json.children || typeof json.children !== "object") return null;
    const extra = json.children.baseItem;
    if (!extra || typeof extra !== "object") return null;

    const pinned = extractPinned(json);

    const exclude = new Set(["children", "config_id", "usedCollections", "environment", "fx"]);
    const keys = Object.keys(json).filter((k) => !exclude.has(k) && Object.prototype.hasOwnProperty.call(extra, k));

    for (const k of keys) {
      const tmp = json[k];
      json[k] = extra[k];
      extra[k] = tmp;
    }

    reapplyPinned(json, extra, pinned);
    return json;
  }

  function renderTool(container, api) {
    const section = api.ui.createSection({ id: "swap-main-extra", title: "Figure Swap" });

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "8px";
    row.style.alignItems = "center";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Figure Swap";

    btn.addEventListener("click", () => {
      const current = getCurrentCharacterJson();
      if (!current) return;

      const next = swapMainExtra(current);
      if (!next) return;

      tryLoadCharacter(next);
    });

    row.appendChild(btn);
    section.body.appendChild(row);
    container.appendChild(section.root);
  }

  function register() {
    const WD = UW.WitchDock;
    if (!WD || typeof WD.registerTool !== "function") {
      setTimeout(register, 250);
      return;
    }

    WD.registerTool({
      id: "pose-tool",
      tab: "Pose",
      render: renderTool,
    });
  }

  register();
})();

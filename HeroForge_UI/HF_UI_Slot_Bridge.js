(function () {
  "use strict";

  const UW = Function("return typeof " + "unsafeWindow" + " !== 'undefined' ? " + "unsafeWindow" + " : window")();
  const UTILITY_ID = "hf-ui-slot-bridge";
  const STORE_PREFIX = "kw.witchDock.toolEnabled.";
  const url = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/HeroForge_UI/Expanded_" + "Decal" + "_Slots.js";

  UW.KW_HeroForgeUI = UW.KW_HeroForgeUI || {};

  function storedEnabled() {
    try {
      const raw = UW.localStorage.getItem(STORE_PREFIX + UTILITY_ID);
      if (raw === null || raw === undefined || raw === "") return true;
      return raw === "true" || raw === "1";
    } catch (e) {
      return true;
    }
  }

  function run(code) {
    if (!code) return;
    new Function(code)();
  }

  function load() {
    if (!storedEnabled()) {
      UW.KW_HeroForgeUI.expandedDecalSlots = UW.KW_HeroForgeUI.expandedDecalSlots || {
        loaded: false,
        applied: false,
        status: "disabled",
        reason: "disabled by Utilities"
      };
      return Promise.resolve(false);
    }

    return fetch(url, { cache: "no-store" })
      .then((res) => res.ok ? res.text() : "")
      .then((code) => {
        run(code);
        return true;
      })
      .catch(() => false);
  }

  UW.KW_HeroForgeUI.slotBridge = {
    loaded: true,
    load,
    isEnabled: storedEnabled
  };

  load();
})();

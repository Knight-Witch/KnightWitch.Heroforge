(function () {
  "use strict";

  const UW = Function("return typeof " + "unsafeWindow" + " !== 'undefined' ? " + "unsafeWindow" + " : window")();
  const UTILITY_ID = "hf-ui-slot-bridge";
  const STORE_PREFIX = "kw.witchDock.toolEnabled.";
  const RELATIVE_PATH = "HeroForge_UI/Expanded_Decal_Slots.js";
  // Resolve the child through the channel's immutable payload, not public
  // Stable source when this bridge is executing in canonical Dev.
  function getChildURL() {
    const root = UW.KWWitchDockPayloadRoot;
    if (typeof root === "string" &&
        /^https:\/\/witchdock\.knightwitch\.dev\/payloads\/[a-f0-9]{40}\/$/.test(root)) {
      return root + RELATIVE_PATH;
    }
    // Legacy standalone bridge fallback, retained for compatibility.
    return "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/" + RELATIVE_PATH;
  }

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

    return fetch(getChildURL(), { cache: "no-store" })
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

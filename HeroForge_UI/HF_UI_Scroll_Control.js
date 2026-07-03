(function () {
  "use strict";

  const UW = Function("return typeof " + "unsafeWindow" + " !== 'undefined' ? " + "unsafeWindow" + " : window")();
  const UTILITY_ID = "expanded-ui-scroll-guards";
  const STORE_PREFIX = "kw.witchDock.toolEnabled.";
  const url = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/HeroForge_UI/Expanded_UI_Scroll_Guards.js";

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
      if (UW.KW_HeroForgeUI.scrollGuards && typeof UW.KW_HeroForgeUI.scrollGuards.disable === "function") {
        UW.KW_HeroForgeUI.scrollGuards.disable();
      }
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

  UW.KW_HeroForgeUI.scrollControl = {
    loaded: true,
    load,
    isEnabled: storedEnabled
  };

  load();
})();

(function () {
  "use strict";

  const url = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/HeroForge_UI/Expanded_" + "Decal" + "_Slots.js";

  function run(code) {
    if (!code) return;
    new Function(code)();
  }

  if (typeof GM_xmlhttpRequest === "function") {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      headers: { "Cache-Control": "no-cache" },
      onload: (res) => {
        if (res.status >= 200 && res.status < 300) run(res.responseText || "");
      }
    });
  }
})();

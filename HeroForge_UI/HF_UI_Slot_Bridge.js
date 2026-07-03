(function () {
  "use strict";

  const url = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/HeroForge_UI/Expanded_" + "Decal" + "_Slots.js";

  function run(code) {
    if (!code) return;
    new Function(code)();
  }

  fetch(url, { cache: "no-store" })
    .then((res) => res.ok ? res.text() : "")
    .then(run)
    .catch(() => {});
})();

(function () {
  "use strict";

  const STYLE_ID = "kwHeroForgeUiScrollSplitSafe";

  function installStyle() {
    if (!document.head) return;

    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
#menuD.kwHFDecalSlotMenu.kwHFDecalSlotMenuSplit {
  resize: none !important;
  max-height: none !important;
  min-height: 0 !important;
}
`;

    if (style.parentNode && style.parentNode.lastChild !== style) {
      style.parentNode.appendChild(style);
    }
  }

  function apply() {
    installStyle();
  }

  apply();
  window.setTimeout(apply, 150);
  window.setTimeout(apply, 500);
  window.setInterval(apply, 1500);
})();

(function () {
  "use strict";

  const STYLE_ID = "kwHeroForgeUiScrollGuards";

  function installStyle() {
    if (!document.head || document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
#menuC,
#menuD {
  overflow-y: auto !important;
  overflow-x: hidden !important;
  overscroll-behavior: contain !important;
  scrollbar-gutter: stable !important;
  padding-right: 6px !important;
  resize: vertical !important;
}

#menuC {
  max-height: min(22vh, 230px) !important;
  min-height: 72px !important;
}

#menuD {
  max-height: min(26vh, 280px) !important;
  min-height: 88px !important;
}

#menuC::-webkit-scrollbar,
#menuD::-webkit-scrollbar {
  width: 10px !important;
}
`;
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installStyle, { once: true });
  } else {
    installStyle();
  }
})();

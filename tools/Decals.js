(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const TOOL_ID = "decals-dev";
  const STYLE_ID = "kw-decals-dev-style";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .kwdecals-placeholder{
        color:rgba(255,255,255,.76);
        font:600 12px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
        text-align:center;
        padding:18px 12px;
        border:1px dashed rgba(255,255,255,.16);
        border-radius:7px;
        background:rgba(255,255,255,.025);
      }
    `;
    document.documentElement.appendChild(style);
  }

  function renderTool(container) {
    injectStyle();
    const placeholder = document.createElement("div");
    placeholder.className = "kwdecals-placeholder";
    placeholder.textContent = "New decal tools coming shortly!";
    container.appendChild(placeholder);
  }

  function register() {
    const WD = UW.WitchDock;
    if (!WD || typeof WD.registerTool !== "function") {
      window.setTimeout(register, 250);
      return;
    }
    WD.registerTool({ id: TOOL_ID, tab: "Decals", render: renderTool });
  }

  register();
})();

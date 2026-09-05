(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const TOOL_ID = "decals-dev";
  const SERVICE_ROOT = "KW_HeroForgeUI";
  const SERVICE_KEY = "correctedBoundDecalGizmo";
  const STYLE_ID = "kw-decals-dev-style";

  function service() {
    return UW[SERVICE_ROOT] && UW[SERVICE_ROOT][SERVICE_KEY]
      ? UW[SERVICE_ROOT][SERVICE_KEY]
      : null;
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = `
      .kwdecals{color:#e8e8e8;font:12px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
      .kwdecals .kwd-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
      .kwdecals .kwd-modes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:8px}
      .kwdecals button{background:rgba(255,255,255,.10);color:#e8e8e8;border:1px solid rgba(255,255,255,.14);border-radius:7px;padding:6px 8px;cursor:pointer}
      .kwdecals button:hover{background:rgba(255,255,255,.16)}
      .kwdecals button[data-active="1"]{background:rgba(255,255,255,.22);border-color:rgba(255,255,255,.42);font-weight:700}
      .kwdecals button:disabled{opacity:.42;cursor:not-allowed}
      .kwdecals label{display:flex;align-items:center;gap:7px;font-weight:650}
      .kwdecals .kwd-status{margin-top:9px;padding:7px 8px;border-radius:6px;background:rgba(0,0,0,.20);font-size:11px;line-height:1.4;word-break:break-word}
      .kwdecals .kwd-status[data-error="1"]{border:1px solid rgba(255,120,120,.45)}
      .kwdecals .kwd-meta{opacity:.7;margin-top:5px;font-size:10px;font-variant-numeric:tabular-nums}
      .kwdecals .kwd-note{opacity:.72;margin-top:8px;font-size:11px}
    `;
    document.documentElement.appendChild(el);
  }

  function renderTool(container, api) {
    injectStyle();

    const section = api.ui.createSection({
      id: "bound-decal-gizmo",
      title: "Bound Decal Gizmo"
    });

    const root = document.createElement("div");
    root.className = "kwdecals";

    const top = document.createElement("div");
    top.className = "kwd-row";

    const label = document.createElement("label");
    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    label.append(toggle, document.createTextNode("Correct bound decal gizmo"));
    top.appendChild(label);
    root.appendChild(top);

    const modes = document.createElement("div");
    modes.className = "kwd-modes";
    const modeButtons = new Map();
    for (const [mode, title] of [["translate", "Move"], ["rotate", "Rotate"], ["scale", "Scale"]]) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = title;
      btn.addEventListener("click", () => {
        const svc = service();
        if (!svc || typeof svc.setMode !== "function") return;
        svc.setMode(mode, true);
        if (typeof svc.refresh === "function") svc.refresh();
      });
      modeButtons.set(mode, btn);
      modes.appendChild(btn);
    }
    root.appendChild(modes);

    const status = document.createElement("div");
    status.className = "kwd-status";
    status.textContent = "Waiting for corrected gizmo service...";
    root.appendChild(status);

    const meta = document.createElement("div");
    meta.className = "kwd-meta";
    root.appendChild(meta);

    const note = document.createElement("div");
    note.className = "kwd-note";
    note.textContent = "Correction activates only for a bound / Project-OFF decal while HeroForge's native decal gizmo is enabled.";
    root.appendChild(note);

    toggle.addEventListener("change", () => {
      const svc = service();
      if (!svc) return;
      if (toggle.checked && typeof svc.enable === "function") svc.enable();
      if (!toggle.checked && typeof svc.disable === "function") svc.disable();
    });

    function update() {
      if (!root.isConnected) return false;
      const svc = service();
      if (!svc || typeof svc.getState !== "function") {
        toggle.checked = false;
        toggle.disabled = true;
        for (const btn of modeButtons.values()) btn.disabled = true;
        status.dataset.error = "1";
        status.textContent = "Corrected gizmo service unavailable.";
        meta.textContent = "";
        return true;
      }

      const state = svc.getState() || {};
      toggle.disabled = false;
      toggle.checked = Boolean(state.enabledByUser);
      status.dataset.error = state.error ? "1" : "0";
      status.textContent = state.status || (state.active ? "Active" : "Waiting");

      for (const [mode, btn] of modeButtons) {
        btn.disabled = !state.enabledByUser;
        btn.dataset.active = state.mode === mode ? "1" : "0";
      }

      const parts = [`build ${state.build || "unknown"}`];
      if (state.selectedMapping !== null && state.selectedMapping !== undefined) parts.push(`mapping ${state.selectedMapping}`);
      if (state.selectedDecalId !== null && state.selectedDecalId !== undefined) parts.push(`decal ${state.selectedDecalId}`);
      parts.push(state.nativeSuppressed ? "native floor gizmo hidden" : "native gizmo untouched");
      meta.textContent = parts.join(" • ");
      return true;
    }

    update();
    const timer = window.setInterval(() => {
      if (!update()) window.clearInterval(timer);
    }, 500);

    section.body.appendChild(root);
    container.appendChild(section.root);
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

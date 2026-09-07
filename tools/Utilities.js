(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const STORE_PREFIX = "kw.witchDock.toolEnabled.";
  const RAW_ROOT = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/";
  const SCROLL_URL = RAW_ROOT + "HeroForge_UI/Expanded_UI_Scroll_Guards.js";
  const SLOT_URL = RAW_ROOT + "HeroForge_UI/HF_UI_Slot_Bridge.js";
  const GIZMO_SERVICE_ROOT = "KW_HeroForgeUI";
  const GIZMO_SERVICE_KEY = "correctedBoundDecalGizmo";
  const UTILITIES = [
    {
      id: "expanded-ui-scroll-guards",
      label: "Decals Scroll Guards",
      description: "Adds scoped scroll and resize behavior to the Decals source panel and slot grid."
    },
    {
      id: "hf-ui-slot-bridge",
      label: "Expanded Decal Slots",
      description: "Expands decal slots when compatible HF Core Tweaks data is detected."
    }
  ];

  function injectStyle() {
    const id = "kw-utilities-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent =
      ".kwu{color:#e8e8e8;font:12px/1.25 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;}" +
      ".kwu .row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px;border:1px solid rgba(255,255,255,0.10);border-radius:6px;background:rgba(255,255,255,0.035);}" +
      ".kwu .main{min-width:0;display:flex;flex-direction:column;gap:4px;}" +
      ".kwu .name{font-weight:800;font-size:12px;color:rgba(255,255,255,0.92);}" +
      ".kwu .desc{font-size:11px;line-height:1.3;color:rgba(255,255,255,0.68);}" +
      ".kwu .status{font-size:10px;line-height:1.25;color:rgba(255,255,255,0.55);}" +
      ".kwu .toggle{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;font-weight:800;font-size:11px;color:rgba(255,255,255,0.82);}" +
      ".kwu input[type='checkbox']{transform:translateY(1px);}" +
      ".kwu .hint{font-size:11px;line-height:1.35;color:rgba(255,255,255,0.62);}" +
      ".kwu .gizmo-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}" +
      ".kwu .gizmo-row label{display:flex;align-items:center;gap:7px;font-weight:650;}" +
      ".kwu .gizmo-modes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:8px;}" +
      ".kwu .gizmo-modes button{background:rgba(255,255,255,.10);color:#e8e8e8;border:1px solid rgba(255,255,255,.14);border-radius:7px;padding:6px 8px;cursor:pointer;}" +
      ".kwu .gizmo-modes button:hover{background:rgba(255,255,255,.16);}" +
      ".kwu .gizmo-modes button[data-active='1']{background:rgba(255,255,255,.22);border-color:rgba(255,255,255,.42);font-weight:700;}" +
      ".kwu .gizmo-modes button:disabled{opacity:.42;cursor:not-allowed;}" +
      ".kwu .gizmo-status{margin-top:9px;padding:7px 8px;border-radius:6px;background:rgba(0,0,0,.20);font-size:11px;line-height:1.4;word-break:break-word;}" +
      ".kwu .gizmo-status[data-error='1']{border:1px solid rgba(255,120,120,.45);}" +
      ".kwu .gizmo-meta{opacity:.7;margin-top:5px;font-size:10px;font-variant-numeric:tabular-nums;}" +
      ".kwu .gizmo-note{opacity:.72;margin-top:8px;font-size:11px;}";
    document.head.appendChild(style);
  }

  function storageKey(id) {
    return STORE_PREFIX + id;
  }

  function readEnabled(id, fallback) {
    try {
      const raw = UW.localStorage.getItem(storageKey(id));
      if (raw !== null && raw !== undefined && raw !== "") return raw === "true" || raw === "1";
    } catch (e) {}

    try {
      if (typeof GM_getValue === "function") {
        const value = GM_getValue(storageKey(id), null);
        if (value !== null && value !== undefined) return !!value;
      }
    } catch (e) {}

    return !!fallback;
  }

  function writeEnabled(id, value) {
    try {
      UW.localStorage.setItem(storageKey(id), value ? "true" : "false");
    } catch (e) {}

    try {
      if (typeof GM_setValue === "function") GM_setValue(storageKey(id), !!value);
    } catch (e) {}
  }

  function loadScript(url) {
    return fetch(url, { cache: "no-store" })
      .then((res) => res.ok ? res.text() : "")
      .then((code) => {
        if (code) new Function(code)();
      })
      .catch(() => {});
  }

  function scrollApi() {
    return UW.KW_HeroForgeUI && UW.KW_HeroForgeUI.scrollGuards ? UW.KW_HeroForgeUI.scrollGuards : null;
  }

  function decalStatus() {
    return UW.KW_HeroForgeUI && UW.KW_HeroForgeUI.expandedDecalSlots ? UW.KW_HeroForgeUI.expandedDecalSlots : null;
  }

  function gizmoService() {
    return UW[GIZMO_SERVICE_ROOT] && UW[GIZMO_SERVICE_ROOT][GIZMO_SERVICE_KEY]
      ? UW[GIZMO_SERVICE_ROOT][GIZMO_SERVICE_KEY]
      : null;
  }

  function setStatus(el, text) {
    if (el) el.textContent = text || "";
  }

  function applyScroll(value, statusEl) {
    const api = scrollApi();
    if (value) {
      if (api && typeof api.enable === "function") {
        api.enable();
        setStatus(statusEl, "Enabled for this session.");
        return;
      }
      loadScript(SCROLL_URL).then(() => {
        const next = scrollApi();
        if (next && typeof next.enable === "function") next.enable();
        setStatus(statusEl, "Enabled for this session.");
      });
      return;
    }

    if (api && typeof api.disable === "function") api.disable();
    const style = document.getElementById("kwHeroForgeUiScrollGuards");
    if (style && style.parentNode) style.parentNode.removeChild(style);
    for (const el of document.querySelectorAll(".kwHFDecalSourceMenu,.kwHFDecalSlotMenu")) {
      el.classList.remove("kwHFDecalSourceMenu", "kwHFDecalSlotMenu");
    }
    setStatus(statusEl, "Disabled for this session.");
  }

  function applySlots(value, statusEl) {
    if (value) {
      const current = decalStatus();
      if (current && current.applied) {
        setStatus(statusEl, "Enabled and already applied.");
        return;
      }
      loadScript(SLOT_URL).then(() => {
        const next = decalStatus();
        setStatus(statusEl, next && next.applied ? "Enabled and applied." : "Enabled. Refresh may be required.");
      });
      return;
    }

    const current = decalStatus();
    if (current && current.applied) setStatus(statusEl, "Disabled after refresh. Already applied this session.");
    else setStatus(statusEl, "Disabled. Refresh to keep unloaded.");
  }

  function applyUtility(id, value, statusEl) {
    if (id === "expanded-ui-scroll-guards") applyScroll(value, statusEl);
    if (id === "hf-ui-slot-bridge") applySlots(value, statusEl);
  }

  function renderUtility(body, item) {
    const row = document.createElement("div");
    row.className = "row";

    const main = document.createElement("div");
    main.className = "main";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = item.label;

    const desc = document.createElement("div");
    desc.className = "desc";
    desc.textContent = item.description;

    const status = document.createElement("div");
    status.className = "status";

    const label = document.createElement("label");
    label.className = "toggle";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = readEnabled(item.id, true);

    const labelText = document.createElement("span");
    labelText.textContent = "Enabled";

    input.addEventListener("change", function () {
      writeEnabled(item.id, input.checked);
      applyUtility(item.id, input.checked, status);
    });

    main.appendChild(name);
    main.appendChild(desc);
    main.appendChild(status);
    label.appendChild(input);
    label.appendChild(labelText);
    row.appendChild(main);
    row.appendChild(label);
    body.appendChild(row);

    applyUtility(item.id, input.checked, status);
  }

  function renderGizmoSection(root, api) {
    const section = api.ui.createSection({
      id: "bound-decal-gizmo",
      title: "Bound Decal Gizmo",
      defaultCollapsed: false
    });

    const body = section.body;
    const controls = document.createElement("div");

    const top = document.createElement("div");
    top.className = "gizmo-row";

    const label = document.createElement("label");
    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    label.append(toggle, document.createTextNode("Correct bound decal gizmo"));
    top.appendChild(label);
    controls.appendChild(top);

    const modes = document.createElement("div");
    modes.className = "gizmo-modes";
    const modeButtons = new Map();
    for (const [mode, title] of [["translate", "Move"], ["rotate", "Rotate"], ["scale", "Scale"]]) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = title;
      btn.addEventListener("click", () => {
        const svc = gizmoService();
        if (!svc || typeof svc.setMode !== "function") return;
        svc.setMode(mode, true);
        if (typeof svc.refresh === "function") svc.refresh();
      });
      modeButtons.set(mode, btn);
      modes.appendChild(btn);
    }
    controls.appendChild(modes);

    const status = document.createElement("div");
    status.className = "gizmo-status";
    status.textContent = "Waiting for corrected gizmo service...";
    controls.appendChild(status);

    const meta = document.createElement("div");
    meta.className = "gizmo-meta";
    controls.appendChild(meta);

    const note = document.createElement("div");
    note.className = "gizmo-note";
    note.textContent = "Correction activates only for a bound / Project-OFF decal while HeroForge's native decal gizmo is enabled.";
    controls.appendChild(note);

    toggle.addEventListener("change", () => {
      const svc = gizmoService();
      if (!svc) return;
      if (toggle.checked && typeof svc.enable === "function") svc.enable();
      if (!toggle.checked && typeof svc.disable === "function") svc.disable();
    });

    function update() {
      if (!controls.isConnected) return false;
      const svc = gizmoService();
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

    body.appendChild(controls);
    root.appendChild(section.root);
  }

  function renderTool(container, api) {
    injectStyle();
    const root = document.createElement("div");
    root.className = "kwu";
    container.appendChild(root);

    renderGizmoSection(root, api);

    const section = api.ui.createSection({ id: "heroforge-ui", title: "HeroForge UI Patches", defaultCollapsed: false });
    const body = section.body;

    for (const item of UTILITIES) renderUtility(body, item);

    const hint = document.createElement("div");
    hint.className = "hint";
    hint.textContent = "Some utilities can be removed live. Utilities that modify HeroForge data may require a page refresh to fully unload.";
    body.appendChild(hint);

    root.appendChild(section.root);
  }

  function registerIntoWitchDock() {
    const dock = UW.WitchDock || (UW.unsafeWindow ? UW.unsafeWindow.WitchDock : null);
    const wd = dock || UW.WitchDock;
    if (!wd || typeof wd.registerTool !== "function") return false;

    wd.registerTool({
      id: "utilities",
      tab: "Utilities",
      title: "Utilities",
      render: function (container, api) {
        renderTool(container, api);
      }
    });

    return true;
  }

  (function boot() {
    let tries = 0;
    const timer = setInterval(function () {
      tries += 1;
      if (registerIntoWitchDock() || tries > 80) clearInterval(timer);
    }, 100);
  })();
})();

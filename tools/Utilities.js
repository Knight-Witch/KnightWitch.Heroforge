(function () {
  "use strict";

  const UW = Function("return typeof " + "unsafeWindow" + " !== 'undefined' ? " + "unsafeWindow" + " : window")();
  const STORE_PREFIX = "kw.witchDock.toolEnabled.";
  const RAW_ROOT = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/";
  const SCROLL_URL = RAW_ROOT + "HeroForge_UI/Expanded_UI_Scroll_Guards.js";
  const SLOT_URL = RAW_ROOT + "HeroForge_UI/HF_UI_Slot_Bridge.js";
  const UTILITIES = [
    {
      id: "expanded-ui-scroll-guards",
      label: "Decals Scroll Guards",
      description: "Adds scoped scroll and resize behavior to the Decals source panel and slot grid.",
      live: true
    },
    {
      id: "hf-ui-slot-bridge",
      label: "Expanded Decal Slots",
      description: "Expands decal slots when compatible HF Core Tweaks data is detected.",
      live: false
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
      ".kwu .hint{font-size:11px;line-height:1.35;color:rgba(255,255,255,0.62);}";
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

  function renderTool(container, api) {
    injectStyle();
    const root = document.createElement("div");
    root.className = "kwu";
    container.appendChild(root);

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
    const wd = UW.WitchDock || null;
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

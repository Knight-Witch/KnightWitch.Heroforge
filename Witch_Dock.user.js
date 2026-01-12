// ==UserScript==
// @name         Witch Dock
// @namespace    KnightWitch
// @version      0.1.0-wd1
// @description  Core dock + tab system for Knight Witch tools
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Witch_Dock.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Witch_Dock.user.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

  const STORE_KEY = "kw.witchDock.v1";
  const DEFAULTS = {
    x: null,
    y: null,
    width: 380,
    height: 520,
    minimized: false,
    closed: false,
    lastOpenWidth: 380,
    lastOpenHeight: 520,
    activeTab: null,
    compactX: 16,
    compactY: null
  };

  const state = {
    uiReady: false,
    root: null,
    header: null,
    tabsBar: null,
    body: null,
    resizeHandle: null,
    compact: null,
    tabs: new Map(),
    toolsById: new Map(),
    pending: [],
    activeTab: null,
    isResizing: false,
    resizeStart: null,
    minBodyHeight: 0,
    minWidth: 260
  };

  function loadPrefs() {
    try {
      const raw = GM_getValue(STORE_KEY, null);
      if (!raw) return { ...DEFAULTS };
      const obj = JSON.parse(raw);
      if (!obj || typeof obj !== "object") return { ...DEFAULTS };
      return { ...DEFAULTS, ...obj };
    } catch {
      return { ...DEFAULTS };
    }
  }

  function savePrefs(prefs) {
    try {
      GM_setValue(STORE_KEY, JSON.stringify(prefs));
    } catch {}
  }

  const prefs = loadPrefs();

  function addStyles() {
    GM_addStyle(`
#kwWitchDock{
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 380px;
  height: 520px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  background: rgba(20,20,22,0.92);
  color: #eee;
  font: 12px/1.25 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;
  z-index: 999999;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  overflow: hidden;
}
#kwWitchDock *{ box-sizing: border-box; }
#kwWDHeader{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 8px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  user-select: none;
  cursor: move;
}
#kwWDTitle{
  font-weight: 800;
  letter-spacing: 0.25px;
}
#kwWDControls{
  display: inline-flex;
  gap: 6px;
}
.kwWDBtn{
  width: 34px;
  height: 30px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 900;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: #eee;
  cursor: pointer;
}
.kwWDBtn:hover{
  background: rgba(255,255,255,0.14);
}
#kwWDTabs{
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 6px 8px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  user-select: none;
}
.kwWDTab{
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: #eee;
  border-radius: 10px;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: 700;
}
.kwWDTab[aria-selected="true"]{
  background: rgba(255,255,255,0.14);
}
#kwWDBody{
  flex: 1 1 auto;
  overflow: auto;
  padding: 8px;
}
.kwWDPanel{
  display: none;
}
.kwWDPanel[aria-hidden="false"]{
  display: block;
}
#kwWDResizeHandle{
  position: absolute;
  right: 0;
  bottom: 0;
  width: 18px;
  height: 18px;
  cursor: nwse-resize;
  background:
    linear-gradient(135deg, rgba(255,255,255,0) 50%, rgba(255,255,255,0.18) 50%),
    linear-gradient(135deg, rgba(255,255,255,0) 70%, rgba(255,255,255,0.12) 70%);
  opacity: 0.8;
}
#kwWDResizeHandle:hover{ opacity: 1; }
.kwWDMinimized #kwWDBody{ display: none; }
.kwWDMinimized #kwWDResizeHandle{ display: none; }

#kwWDCompact{
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 999999;
  display: none;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(20,20,22,0.92);
  color: #eee;
  font: 12px/1.25 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  user-select: none;
  cursor: move;
}
#kwWDCompactTitle{
  font-weight: 800;
  letter-spacing: 0.25px;
}
#kwWDCompactExpand{
  width: 34px;
  height: 30px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 900;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: #eee;
  cursor: pointer;
}
#kwWDCompactExpand:hover{ background: rgba(255,255,255,0.14); }
    `);
  }

  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (k === "class") n.className = v;
        else if (k === "text") n.textContent = v;
        else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
        else n.setAttribute(k, String(v));
      }
    }
    if (children) {
      for (const c of children) {
        if (c == null) continue;
        if (typeof c === "string") n.appendChild(document.createTextNode(c));
        else n.appendChild(c);
      }
    }
    return n;
  }

  function clamp(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  function applyPositionAndSize() {
    if (!state.root) return;

    const rect = state.root.getBoundingClientRect();
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    let left = prefs.x;
    let top = prefs.y;

    if (left == null || top == null) {
      state.root.style.left = "";
      state.root.style.top = "";
      state.root.style.right = "16px";
      state.root.style.bottom = "16px";
    } else {
      const w = prefs.width || rect.width;
      const h = prefs.height || rect.height;
      left = clamp(left, 0, Math.max(0, vw - w));
      top = clamp(top, 0, Math.max(0, vh - h));
      state.root.style.right = "";
      state.root.style.bottom = "";
      state.root.style.left = `${left}px`;
      state.root.style.top = `${top}px`;
    }

    state.root.style.width = `${prefs.width}px`;
    state.root.style.height = `${prefs.height}px`;
  }

  function applyMinimizedState() {
    if (!state.root) return;
    if (prefs.minimized) state.root.classList.add("kwWDMinimized");
    else state.root.classList.remove("kwWDMinimized");
    if (prefs.minimized) {
      const minH = computeMinDockHeightCollapsed();
      state.root.style.height = `${minH}px`;
    } else {
      state.root.style.height = `${prefs.height}px`;
    }
  }

  function showClosedCompact() {
    if (!state.root || !state.compact) return;

    if (prefs.closed) {
      state.root.style.display = "none";
      state.compact.style.display = "flex";

      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

      const compactRect = state.compact.getBoundingClientRect();
      let x = prefs.compactX != null ? prefs.compactX : 16;
      let y = prefs.compactY != null ? prefs.compactY : (vh - compactRect.height - 16);

      x = clamp(x, 0, Math.max(0, vw - compactRect.width));
      y = clamp(y, 0, Math.max(0, vh - compactRect.height));

      state.compact.style.left = `${x}px`;
      state.compact.style.top = `${y}px`;
      state.compact.style.right = "";
      state.compact.style.bottom = "";
    } else {
      state.compact.style.display = "none";
      state.root.style.display = "";
    }
  }

  function computeMinDockHeightCollapsed() {
    const headerH = state.header ? state.header.getBoundingClientRect().height : 52;
    const tabsH = state.tabsBar ? state.tabsBar.getBoundingClientRect().height : 40;
    return Math.ceil(headerH + tabsH);
  }

  function computeMinDockWidthForActiveTab() {
    const baseMin = 260;
    const tab = state.tabs.get(state.activeTab);
    if (!tab || !tab.panel) return baseMin;

    const panel = tab.panel;
    const child = panel.firstElementChild;
    if (!child) return baseMin;

    const prev = panel.style.display;
    const prevHidden = panel.getAttribute("aria-hidden");
    panel.style.display = "block";
    panel.setAttribute("aria-hidden", "false");

    const needed = Math.ceil(child.scrollWidth + 16);
    if (prev != null) panel.style.display = prev;
    if (prevHidden != null) panel.setAttribute("aria-hidden", prevHidden);

    return Math.max(baseMin, needed);
  }

  function setActiveTab(name) {
    state.activeTab = name;
    prefs.activeTab = name;
    savePrefs(prefs);

    for (const [tabName, tab] of state.tabs) {
      const active = tabName === name;
      tab.btn.setAttribute("aria-selected", active ? "true" : "false");
      tab.panel.setAttribute("aria-hidden", active ? "false" : "true");
    }

    state.minWidth = computeMinDockWidthForActiveTab();
    enforceSizeConstraints();
  }

  function enforceSizeConstraints() {
    if (!state.root) return;

    const minH = computeMinDockHeightCollapsed();
    const maxW = Math.max(320, (document.documentElement.clientWidth || window.innerWidth || 0) - 16);
    const maxH = Math.max(minH, (document.documentElement.clientHeight || window.innerHeight || 0) - 16);

    const minW = Math.max(260, state.minWidth || 260);

    let w = prefs.width;
    let h = prefs.height;

    if (prefs.minimized) {
      prefs.width = clamp(w, minW, maxW);
      prefs.height = minH;
      savePrefs(prefs);
      applyPositionAndSize();
      applyMinimizedState();
      return;
    }

    prefs.width = clamp(w, minW, maxW);
    prefs.height = clamp(h, minH, maxH);
    savePrefs(prefs);
    applyPositionAndSize();
  }

  function ensureTab(name) {
    if (state.tabs.has(name)) return state.tabs.get(name);

    const btn = el("button", { class: "kwWDTab", type: "button", text: name, "aria-selected": "false" });
    const panel = el("div", { class: "kwWDPanel", "aria-hidden": "true" });

    btn.addEventListener("click", () => setActiveTab(name));

    state.tabsBar.appendChild(btn);
    state.body.appendChild(panel);

    const tab = { name, btn, panel };
    state.tabs.set(name, tab);

    if (!prefs.activeTab) prefs.activeTab = name;
    if (!state.activeTab) state.activeTab = prefs.activeTab || name;

    setActiveTab(state.activeTab);
    return tab;
  }

  function mountTool(def) {
    const tabName = def.tab || "Misc Tools";
    const tab = ensureTab(tabName);

    if (state.toolsById.has(def.id)) {
      const existing = state.toolsById.get(def.id);
      if (existing && existing.container && existing.container.parentNode) existing.container.remove();
      state.toolsById.delete(def.id);
    }

    const container = document.createElement("div");
    tab.panel.appendChild(container);

    state.toolsById.set(def.id, { def, container, tab: tabName });

    try {
      def.render(container, {});
    } catch {
      container.textContent = "Tool failed to render.";
    }

    state.minWidth = computeMinDockWidthForActiveTab();
    enforceSizeConstraints();
  }

  function registerTool(def) {
    if (!def || typeof def !== "object") return;
    if (!def.id || typeof def.id !== "string") return;
    if (typeof def.render !== "function") return;

    if (!state.uiReady) state.pending.push(def);
    else mountTool(def);
  }

  function startDockDrag(e) {
    if (!state.root || prefs.closed) return;
    const target = e.target;
    if (target && (target.closest("#kwWDControls") || target.closest("#kwWDResizeHandle"))) return;

    const rect = state.root.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = rect.left;
    const startTop = rect.top;

    state.root.style.right = "";
    state.root.style.bottom = "";
    state.root.style.left = `${startLeft}px`;
    state.root.style.top = `${startTop}px`;

    function move(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

      const w = state.root.getBoundingClientRect().width;
      const h = state.root.getBoundingClientRect().height;

      const left = clamp(startLeft + dx, 0, Math.max(0, vw - w));
      const top = clamp(startTop + dy, 0, Math.max(0, vh - h));

      state.root.style.left = `${left}px`;
      state.root.style.top = `${top}px`;

      prefs.x = left;
      prefs.y = top;
      savePrefs(prefs);
    }

    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startResize(e) {
    if (!state.root || prefs.closed || prefs.minimized) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = state.root.getBoundingClientRect();
    state.isResizing = true;
    state.resizeStart = {
      x: e.clientX,
      y: e.clientY,
      w: rect.width,
      h: rect.height
    };

    function move(ev) {
      if (!state.isResizing || !state.resizeStart) return;

      const dx = ev.clientX - state.resizeStart.x;
      const dy = ev.clientY - state.resizeStart.y;

      const minW = Math.max(260, state.minWidth || 260);
      const minH = computeMinDockHeightCollapsed();

      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

      const maxW = Math.max(minW, vw - 8);
      const maxH = Math.max(minH, vh - 8);

      const newW = clamp(state.resizeStart.w + dx, minW, maxW);
      const newH = clamp(state.resizeStart.h + dy, minH, maxH);

      state.root.style.width = `${newW}px`;
      state.root.style.height = `${newH}px`;

      prefs.width = Math.round(newW);
      prefs.height = Math.round(newH);
      prefs.lastOpenWidth = prefs.width;
      prefs.lastOpenHeight = prefs.height;
      savePrefs(prefs);
    }

    function up() {
      state.isResizing = false;
      state.resizeStart = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function toggleMinimize() {
    prefs.minimized = !prefs.minimized;

    if (!prefs.minimized) {
      prefs.width = prefs.lastOpenWidth || prefs.width || DEFAULTS.width;
      prefs.height = prefs.lastOpenHeight || prefs.height || DEFAULTS.height;
    } else {
      prefs.lastOpenWidth = prefs.width;
      prefs.lastOpenHeight = prefs.height;
    }

    savePrefs(prefs);
    enforceSizeConstraints();
    applyMinimizedState();
  }

  function closeDock() {
    prefs.closed = true;
    prefs.minimized = true;

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    prefs.compactX = 16;
    prefs.compactY = vh - 56;

    savePrefs(prefs);
    applyMinimizedState();
    showClosedCompact();
  }

  function expandFromCompact() {
    prefs.closed = false;
    prefs.minimized = false;

    prefs.width = prefs.lastOpenWidth || prefs.width || DEFAULTS.width;
    prefs.height = prefs.lastOpenHeight || prefs.height || DEFAULTS.height;

    savePrefs(prefs);

    if (state.root) {
      state.root.style.display = "";
      state.root.style.right = "16px";
      state.root.style.bottom = "16px";
      state.root.style.left = "";
      state.root.style.top = "";
      prefs.x = null;
      prefs.y = null;
      savePrefs(prefs);
    }

    showClosedCompact();
    enforceSizeConstraints();
    applyMinimizedState();
  }

  function startCompactDrag(e) {
    if (!state.compact) return;
    const target = e.target;
    if (target && target.closest("#kwWDCompactExpand")) return;

    const rect = state.compact.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = rect.left;
    const startTop = rect.top;

    function move(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

      const w = state.compact.getBoundingClientRect().width;
      const h = state.compact.getBoundingClientRect().height;

      const left = clamp(startLeft + dx, 0, Math.max(0, vw - w));
      const top = clamp(startTop + dy, 0, Math.max(0, vh - h));

      state.compact.style.left = `${left}px`;
      state.compact.style.top = `${top}px`;

      prefs.compactX = left;
      prefs.compactY = top;
      savePrefs(prefs);
    }

    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function buildUI() {
    if (state.uiReady) return;
    state.uiReady = true;

    addStyles();

    state.root = el("div", { id: "kwWitchDock" }, [
      el("div", { id: "kwWDHeader", onpointerdown: startDockDrag }, [
        el("div", { id: "kwWDTitle", text: "WITCH DOCK" }),
        el("div", { id: "kwWDControls" }, [
          el("button", { class: "kwWDBtn", type: "button", text: "–", title: "Minimize / Expand", onclick: toggleMinimize }),
          el("button", { class: "kwWDBtn", type: "button", text: "×", title: "Close (compact)", onclick: closeDock })
        ])
      ]),
      el("div", { id: "kwWDTabs" }),
      el("div", { id: "kwWDBody" }),
      el("div", { id: "kwWDResizeHandle", onpointerdown: startResize })
    ]);

    state.header = state.root.querySelector("#kwWDHeader");
    state.tabsBar = state.root.querySelector("#kwWDTabs");
    state.body = state.root.querySelector("#kwWDBody");
    state.resizeHandle = state.root.querySelector("#kwWDResizeHandle");

    document.body.appendChild(state.root);

    state.compact = el("div", { id: "kwWDCompact", onpointerdown: startCompactDrag }, [
      el("div", { id: "kwWDCompactTitle", text: "WITCH DOCK" }),
      el("button", { id: "kwWDCompactExpand", type: "button", text: "▣", title: "Expand", onclick: expandFromCompact })
    ]);
    document.body.appendChild(state.compact);

    if (prefs.width != null) state.root.style.width = `${prefs.width}px`;
    if (prefs.height != null) state.root.style.height = `${prefs.height}px`;

    applyPositionAndSize();
    state.activeTab = prefs.activeTab || null;

    if (prefs.minimized) {
      prefs.lastOpenWidth = prefs.lastOpenWidth || prefs.width;
      prefs.lastOpenHeight = prefs.lastOpenHeight || prefs.height;
    }

    applyMinimizedState();
    showClosedCompact();

    for (const def of state.pending.splice(0)) mountTool(def);

    if (state.tabs.size && (prefs.activeTab == null || !state.tabs.has(prefs.activeTab))) {
      const first = state.tabs.keys().next().value;
      if (first) setActiveTab(first);
    } else if (prefs.activeTab && state.tabs.has(prefs.activeTab)) {
      setActiveTab(prefs.activeTab);
    }

    state.minWidth = computeMinDockWidthForActiveTab();
    enforceSizeConstraints();

    window.addEventListener("resize", () => {
      showClosedCompact();
      enforceSizeConstraints();
    });
  }

  UW.WitchDock = UW.WitchDock || {};
  UW.WitchDock.registerTool = registerTool;
  UW.WitchDock.ensureDock = buildUI;

  buildUI();
})();

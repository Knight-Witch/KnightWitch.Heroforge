// ==UserScript==
// @name         Witch Dock
// @namespace    KnightWitch
// @version      0.2.4
// @description  Core dock + tab system for Knight Witch tools
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/Witch_Dock.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/Witch_Dock.user.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

const MANIFEST_URL = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/manifest.json";
const TOOL_ENABLE_PREFIX = "kw.witchDock.toolEnabled.";

function gmGetText(url) {
  return new Promise((resolve, reject) => {
    try {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: { "Cache-Control": "no-cache" },
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) resolve(res.responseText || "");
          else reject(new Error(`HTTP ${res.status} for ${url}`));
        },
        onerror: () => reject(new Error(`Request failed for ${url}`))
      });
    } catch (e) {
      reject(e);
    }
  });
}

function getToolEnabled(toolId, enabledByDefault) {
  try {
    const v = GM_getValue(TOOL_ENABLE_PREFIX + toolId, null);
    if (v === null || v === undefined) return !!enabledByDefault;
    return !!v;
  } catch {
    return !!enabledByDefault;
  }
}

async function loadManifestAndTools() {
  let manifest;
  try {
    const raw = await gmGetText(MANIFEST_URL);
    manifest = JSON.parse(raw);
  } catch (e) {
    return;
  }

  if (!manifest || typeof manifest !== "object") return;
  const tools = Array.isArray(manifest.tools) ? manifest.tools : [];
  for (const t of tools) {
    if (!t || typeof t !== "object") continue;
    const id = typeof t.id === "string" ? t.id : "";
    const url = typeof t.url === "string" ? t.url : "";
    const enabledByDefault = !!t.enabledByDefault;
    if (!id || !url) continue;
    if (!getToolEnabled(id, enabledByDefault)) continue;

    try {
      const code = await gmGetText(url);
      if (!code) continue;
      new Function(code)();
    } catch (e) {}
  }
}


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
    lastOpenX: null,
    lastOpenY: null,
    lastOpenAnchored: true,
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
    resizeCorner: null,
    resizeBottom: null,
    compact: null,
    compactExpandBtn: null,
    minimizeBtn: null,
    closeBtn: null,
    tabs: new Map(),
    toolsById: new Map(),
    pending: [],
    activeTab: null,
    isResizing: false,
    resizeStart: null,
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

  function savePrefs(p) {
    try {
      GM_setValue(STORE_KEY, JSON.stringify(p));
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
  position: relative;
}
.kwWDBtn:hover{
  background: rgba(255,255,255,0.14);
}
.kwWDBtn[data-tooltip]:hover::after{
  content: attr(data-tooltip);
  position: absolute;
  right: 0;
  top: 36px;
  white-space: nowrap;
  padding: 6px 8px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(20,20,22,0.96);
  color: #eee;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.45);
  pointer-events: none;
  z-index: 1000000;
}
.kwWDBtn[data-tooltip]:hover::before{
  content: "";
  position: absolute;
  right: 14px;
  top: 31px;
  width: 10px;
  height: 10px;
  background: rgba(20,20,22,0.96);
  border-left: 1px solid rgba(255,255,255,0.14);
  border-top: 1px solid rgba(255,255,255,0.14);
  transform: rotate(45deg);
  z-index: 1000001;
  pointer-events: none;
}

#kwWDTabs{
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  user-select: none;
}
#kwWDTabsLeft{
  flex: 1 1 auto;
  display: flex;
  gap: 6px;
  overflow: auto;
  scrollbar-width: thin;
}
#kwWDTabsLeft::-webkit-scrollbar{ height: 8px; }
#kwWDTabsLeft::-webkit-scrollbar-thumb{
  background: rgba(255,255,255,0.18);
  border-radius: 10px;
}
#kwWDTabsRight{
  flex: 0 0 auto;
  display: inline-flex;
  gap: 6px;
  align-items: center;
}
.kwWDActionBtn{
  width: 34px;
  height: 30px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 900;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: #eee;
  cursor: pointer;
  position: relative;
}
.kwWDActionBtn:hover{ background: rgba(255,255,255,0.14); }

#kwWDFooter{
  flex: 0 0 auto;
  padding: 8px 10px;
  border-top: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.78);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  user-select: none;
}
#kwWDFooterLeft, #kwWDFooterRight{
  display: inline-flex;
  gap: 12px;
  align-items: center;
  white-space: nowrap;
}
.kwWDKey{
  font-weight: 900;
  color: rgba(255,255,255,0.9);
}
.kwWDMinimized #kwWDFooter{ display: none; }
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

#kwWDResizeHandleCorner{
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
#kwWDResizeHandleCorner:hover{ opacity: 1; }

#kwWDResizeHandleBottom{
  position: absolute;
  left: 0;
  right: 18px;
  bottom: 0;
  height: 10px;
  cursor: ns-resize;
}

.kwWDMinimized #kwWDBody{ display: none; }
.kwWDMinimized #kwWDResizeHandleCorner{ display: none; }
.kwWDMinimized #kwWDResizeHandleBottom{ display: none; }

#kwWDCompact{
  position: fixed;
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

.kwWDSection{
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  overflow: hidden;
  margin-bottom: 8px;
}
.kwWDSectionHeader{
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
  user-select: none;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.kwWDSectionHeader:hover{ background: rgba(255,255,255,0.06); }
.kwWDSectionHeaderBox{
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(0,0,0,0.20);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
  opacity: 0.95;
}
.kwWDSectionHeaderName{
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.2px;
}
.kwWDSectionBody{
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.kwWDSection[data-collapsed="1"] .kwWDSectionBody{ display: none; }
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

  function computeMinDockHeightCollapsed() {
    const headerH = state.header ? state.header.getBoundingClientRect().height : 52;
    const tabsH = state.tabsBar ? state.tabsBar.getBoundingClientRect().height : 40;
    return Math.ceil(headerH + tabsH);
  }

  function getViewport() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    return { vw, vh };
  }

  function isAnchored() {
    return prefs.x == null || prefs.y == null;
  }

  function snapshotCurrentDockPositionToPrefs() {
    if (!state.root) return;
    const r = state.root.getBoundingClientRect();
    prefs.lastOpenAnchored = isAnchored();
    if (prefs.lastOpenAnchored) {
      prefs.lastOpenX = null;
      prefs.lastOpenY = null;
    } else {
      prefs.lastOpenX = Math.round(r.left);
      prefs.lastOpenY = Math.round(r.top);
    }
    prefs.lastOpenWidth = Math.round(r.width);
    prefs.lastOpenHeight = Math.round(r.height);
    savePrefs(prefs);
  }

  function applyPositionAndSize() {
    if (!state.root) return;

    const { vw, vh } = getViewport();
    const w = prefs.width || DEFAULTS.width;
    const h = prefs.height || DEFAULTS.height;

    if (prefs.x == null || prefs.y == null) {
      state.root.style.left = "";
      state.root.style.top = "";
      state.root.style.right = "16px";
      state.root.style.bottom = "16px";
    } else {
      const left = clamp(prefs.x, 0, Math.max(0, vw - w));
      const top = clamp(prefs.y, 0, Math.max(0, vh - h));
      state.root.style.right = "";
      state.root.style.bottom = "";
      state.root.style.left = `${left}px`;
      state.root.style.top = `${top}px`;
      prefs.x = left;
      prefs.y = top;
      savePrefs(prefs);
    }

    state.root.style.width = `${w}px`;
    state.root.style.height = `${h}px`;
  }

  function applyMinimizedState() {
    if (!state.root) return;

    if (prefs.minimized) state.root.classList.add("kwWDMinimized");
    else state.root.classList.remove("kwWDMinimized");

    if (state.minimizeBtn) state.minimizeBtn.textContent = prefs.minimized ? "▣" : "–";

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

      const { vw, vh } = getViewport();
      const cr = state.compact.getBoundingClientRect();

      let x = prefs.compactX != null ? prefs.compactX : 16;
      let y = prefs.compactY != null ? prefs.compactY : (vh - cr.height - 16);

      x = clamp(x, 0, Math.max(0, vw - cr.width));
      y = clamp(y, 0, Math.max(0, vh - cr.height));

      state.compact.style.right = "";
      state.compact.style.bottom = "";
      state.compact.style.left = `${x}px`;
      state.compact.style.top = `${y}px`;
    } else {
      state.compact.style.display = "none";
      state.root.style.display = "";
    }
  }

  function computeMinDockWidthForActiveTab() {
    const baseMin = 260;
    const tab = state.tabs.get(state.activeTab);
    if (!tab || !tab.panel) return baseMin;

    const panel = tab.panel;
    const child = panel.firstElementChild;
    if (!child) return baseMin;

    const prevDisplay = panel.style.display;
    const prevHidden = panel.getAttribute("aria-hidden");
    panel.style.display = "block";
    panel.setAttribute("aria-hidden", "false");

    const needed = Math.ceil(child.scrollWidth + 16);

    panel.style.display = prevDisplay;
    if (prevHidden != null) panel.setAttribute("aria-hidden", prevHidden);

    return Math.max(baseMin, needed);
  }

  function enforceSizeConstraints() {
    if (!state.root) return;

    const { vw, vh } = getViewport();
    const minH = computeMinDockHeightCollapsed();
    const minW = Math.max(260, state.minWidth || 260);
    const maxW = Math.max(minW, vw - 8);
    const maxH = Math.max(minH, vh - 8);

    if (prefs.minimized) {
      prefs.width = clamp(prefs.width, minW, maxW);
      prefs.height = minH;
      savePrefs(prefs);
      applyPositionAndSize();
      applyMinimizedState();
      return;
    }

    prefs.width = clamp(prefs.width, minW, maxW);
    prefs.height = clamp(prefs.height, minH, maxH);
    savePrefs(prefs);
    applyPositionAndSize();
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


  function toolSectionKey(toolId, sectionId) {
    return `kw.witchDock.ui.${toolId}.${sectionId}.collapsed`;
  }

  function getSectionCollapsed(toolId, sectionId, defaultCollapsed) {
    try {
      const v = GM_getValue(toolSectionKey(toolId, sectionId), null);
      if (v === null || v === undefined) return !!defaultCollapsed;
      return !!v;
    } catch {
      return !!defaultCollapsed;
    }
  }

  function setSectionCollapsed(toolId, sectionId, collapsed) {
    try {
      GM_setValue(toolSectionKey(toolId, sectionId), !!collapsed);
    } catch {}
  }

  function createSection(toolId, opts) {
    const sectionId = opts && typeof opts.id === "string" ? opts.id : "";
    const title = opts && typeof opts.title === "string" ? opts.title : "";
    const defaultCollapsed = !!(opts && opts.defaultCollapsed);

    const root = el("div", { class: "kwWDSection", "data-collapsed": "0" });
    const header = el("div", { class: "kwWDSectionHeader" }, [
      el("div", { class: "kwWDSectionHeaderBox", text: "–" }),
      el("div", { class: "kwWDSectionHeaderName", text: title })
    ]);
    const body = el("div", { class: "kwWDSectionBody" });

    const box = header.querySelector(".kwWDSectionHeaderBox");

    function apply(collapsed) {
      root.setAttribute("data-collapsed", collapsed ? "1" : "0");
      if (box) box.textContent = collapsed ? "+" : "–";
    }

    const initial = getSectionCollapsed(toolId, sectionId, defaultCollapsed);
    apply(initial);

    header.addEventListener("click", () => {
      const now = root.getAttribute("data-collapsed") !== "1";
      apply(now);
      if (sectionId) setSectionCollapsed(toolId, sectionId, now);
    });

    root.appendChild(header);
    root.appendChild(body);

    return { root, body, setCollapsed: (v) => apply(!!v), getCollapsed: () => root.getAttribute("data-collapsed") === "1" };
  }

  function buildToolApi(def) {
    const toolId = def && typeof def.id === "string" ? def.id : "unknown";
    return {
      toolId,
      ui: {
        el,
        createSection: (opts) => createSection(toolId, opts)
      }
    };
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
      def.render(container, buildToolApi(def));
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
    if (target && (target.closest("#kwWDControls") || target.closest("#kwWDResizeHandleCorner") || target.closest("#kwWDResizeHandleBottom"))) return;

    const rect = state.root.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = rect.left;
    const startTop = rect.top;

    state.root.style.right = "";
    state.root.style.bottom = "";
    state.root.style.left = `${startLeft}px`;
    state.root.style.top = `${startTop}px`;

    prefs.x = Math.round(startLeft);
    prefs.y = Math.round(startTop);
    savePrefs(prefs);

    function move(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      const { vw, vh } = getViewport();
      const w = state.root.getBoundingClientRect().width;
      const h = state.root.getBoundingClientRect().height;

      const left = clamp(startLeft + dx, 0, Math.max(0, vw - w));
      const top = clamp(startTop + dy, 0, Math.max(0, vh - h));

      state.root.style.left = `${left}px`;
      state.root.style.top = `${top}px`;

      prefs.x = Math.round(left);
      prefs.y = Math.round(top);
      savePrefs(prefs);
    }

    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startResizeCorner(e) {
    if (!state.root || prefs.closed || prefs.minimized) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = state.root.getBoundingClientRect();
    state.isResizing = true;
    state.resizeStart = { x: e.clientX, y: e.clientY, w: rect.width, h: rect.height, mode: "corner" };

    function move(ev) {
      if (!state.isResizing || !state.resizeStart) return;

      const dx = ev.clientX - state.resizeStart.x;
      const dy = ev.clientY - state.resizeStart.y;

      const minW = Math.max(260, state.minWidth || 260);
      const minH = computeMinDockHeightCollapsed();

      const { vw, vh } = getViewport();
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
      enforceSizeConstraints();
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startResizeBottom(e) {
    if (!state.root || prefs.closed || prefs.minimized) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = state.root.getBoundingClientRect();
    state.isResizing = true;
    state.resizeStart = { x: e.clientX, y: e.clientY, w: rect.width, h: rect.height, mode: "bottom" };

    function move(ev) {
      if (!state.isResizing || !state.resizeStart) return;

      const dy = ev.clientY - state.resizeStart.y;
      const minH = computeMinDockHeightCollapsed();

      const { vh } = getViewport();
      const maxH = Math.max(minH, vh - 8);

      const newH = clamp(state.resizeStart.h + dy, minH, maxH);

      state.root.style.height = `${newH}px`;

      prefs.height = Math.round(newH);
      prefs.lastOpenHeight = prefs.height;
      savePrefs(prefs);
    }

    function up() {
      state.isResizing = false;
      state.resizeStart = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      enforceSizeConstraints();
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function toggleMinimize() {
    if (!prefs.minimized) snapshotCurrentDockPositionToPrefs();

    prefs.minimized = !prefs.minimized;

    if (!prefs.minimized) {
      prefs.width = prefs.lastOpenWidth || prefs.width || DEFAULTS.width;
      prefs.height = prefs.lastOpenHeight || prefs.height || DEFAULTS.height;
    } else {
      prefs.lastOpenWidth = prefs.width;
      prefs.lastOpenHeight = prefs.height;
    }


  function dispatchKeyCombo({ key, code, ctrl, shift }) {
    const evDown = new KeyboardEvent("keydown", {
      key,
      code,
      bubbles: true,
      cancelable: true,
      ctrlKey: !!ctrl,
      shiftKey: !!shift
    });
    const evUp = new KeyboardEvent("keyup", {
      key,
      code,
      bubbles: true,
      cancelable: true,
      ctrlKey: !!ctrl,
      shiftKey: !!shift
    });
    document.dispatchEvent(evDown);
    window.dispatchEvent(evDown);
    document.dispatchEvent(evUp);
    window.dispatchEvent(evUp);
  }

  function triggerUndo() {
    dispatchKeyCombo({ key: "z", code: "KeyZ", ctrl: true, shift: false });
  }

  function triggerRedo() {
    dispatchKeyCombo({ key: "z", code: "KeyZ", ctrl: true, shift: true });
  }

    savePrefs(prefs);
    enforceSizeConstraints();
    applyMinimizedState();
  }

  function closeDock() {
    snapshotCurrentDockPositionToPrefs();

    prefs.closed = true;
    prefs.minimized = true;

    const { vh } = getViewport();
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

    if (prefs.lastOpenAnchored) {
      prefs.x = null;
      prefs.y = null;
    } else {
      prefs.x = prefs.lastOpenX != null ? prefs.lastOpenX : prefs.x;
      prefs.y = prefs.lastOpenY != null ? prefs.lastOpenY : prefs.y;
    }

    savePrefs(prefs);

    if (state.root) {
      state.root.style.display = "";
      if (prefs.x == null || prefs.y == null) {
        state.root.style.left = "";
        state.root.style.top = "";
        state.root.style.right = "16px";
        state.root.style.bottom = "16px";
      } else {
        state.root.style.right = "";
        state.root.style.bottom = "";
        state.root.style.left = `${prefs.x}px`;
        state.root.style.top = `${prefs.y}px`;
      }
    }

    showClosedCompact();
    enforceSizeConstraints();
    applyMinimizedState();
  }

  function startCompactDrag(e) {
    if (!state.compact) return;
    const target = e.target;
    if (target && target.closest("#kwWDCompactExpand")) return;

    state.compact.style.right = "";
    state.compact.style.bottom = "";

    const rect = state.compact.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = rect.left;
    const startTop = rect.top;

    function move(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      const { vw, vh } = getViewport();
      const w = state.compact.getBoundingClientRect().width;
      const h = state.compact.getBoundingClientRect().height;

      const left = clamp(startLeft + dx, 0, Math.max(0, vw - w));
      const top = clamp(startTop + dy, 0, Math.max(0, vh - h));

      state.compact.style.left = `${left}px`;
      state.compact.style.top = `${top}px`;

      prefs.compactX = Math.round(left);
      prefs.compactY = Math.round(top);
      savePrefs(prefs);
    }

    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  
  function isEditableTarget(t) {
    if (!t) return false;
    const tag = (t.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (t.isContentEditable) return true;
    return false;
  }

  function installDockHotkey() {
    document.addEventListener("keydown", (e) => {
      if (e.repeat) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (isEditableTarget(e.target)) return;
      if (e.code !== "Backquote") return;

      e.preventDefault();

      if (prefs.closed) {
        expandFromCompact();
      } else {
        closeDock();
      }
    }, true);
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
          el("button", { class: "kwWDBtn", type: "button", text: "×", title: "Close", "data-tooltip": "Closes to small icon", onclick: closeDock })
        ])
      ]),
      el("div", { id: "kwWDTabs" }, [
        el("div", { id: "kwWDTabsLeft" }),
        el("div", { id: "kwWDTabsRight" }, [
          el("button", { id: "kwWDUndoBtn", class: "kwWDActionBtn", type: "button", title: "Undo (Ctrl+Z)", text: "↶", onclick: triggerUndo }),
          el("button", { id: "kwWDRedoBtn", class: "kwWDActionBtn", type: "button", title: "Redo (Ctrl+Shift+Z)", text: "↷", onclick: triggerRedo })
        ])
      ]),
      el("div", { id: "kwWDBody" }),
      el("div", { id: "kwWDResizeHandleBottom", onpointerdown: startResizeBottom }),
      el("div", { id: "kwWDResizeHandleCorner", onpointerdown: startResizeCorner })
    ]);

    state.header = state.root.querySelector("#kwWDHeader");
    state.tabsBar = state.root.querySelector("#kwWDTabsLeft");
    state.tabsBarRight = state.root.querySelector("#kwWDTabsRight");
    state.footer = state.root.querySelector("#kwWDFooter");
    state.undoBtn = state.root.querySelector("#kwWDUndoBtn");
    state.redoBtn = state.root.querySelector("#kwWDRedoBtn");
    state.body = state.root.querySelector("#kwWDBody");
    state.resizeBottom = state.root.querySelector("#kwWDResizeHandleBottom");
    state.resizeCorner = state.root.querySelector("#kwWDResizeHandleCorner");
    state.minimizeBtn = state.root.querySelector("#kwWDControls .kwWDBtn:nth-child(1)");
    state.closeBtn = state.root.querySelector("#kwWDControls .kwWDBtn:nth-child(2)");

    document.body.appendChild(state.root);

    state.compact = el("div", { id: "kwWDCompact", onpointerdown: startCompactDrag }, [
      el("div", { id: "kwWDCompactTitle", text: "WITCH DOCK" }),
      el("button", { id: "kwWDCompactExpand", type: "button", text: "▣", title: "Expand", onclick: expandFromCompact })
    ]);
    state.compactExpandBtn = state.compact.querySelector("#kwWDCompactExpand");
    document.body.appendChild(state.compact);

    prefs.width = prefs.width || DEFAULTS.width;
    prefs.height = prefs.height || DEFAULTS.height;

    applyPositionAndSize();

    state.activeTab = prefs.activeTab || null;

    if (prefs.minimized) {
      prefs.lastOpenWidth = prefs.lastOpenWidth || prefs.width;
      prefs.lastOpenHeight = prefs.lastOpenHeight || prefs.height;
      savePrefs(prefs);
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
    installDockHotkey();
loadManifestAndTools();
})();



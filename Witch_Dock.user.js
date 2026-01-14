// ==UserScript==
// @name         Witch Dock - GPT DEV FILE
// @namespace    KnightWitch
// @version      0.1.0
// @description  Witch Dock DEVELOPMENT FILE ONLY
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/GPT_DEV/Witch_Dock.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/GPT_DEV/Witch_Dock.user.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
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
    
    boneBar: null,
    boneText: null,
    boneCopyBtn: null,
    lastBoneName: "",
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
    minWidth: 260,
    draggingTool: null,
    draggingSectionId: null,
    draggingSectionTool: null
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getUndoQueue() {
    const CK = UW.CK;
    const u = CK && CK.UndoQueue ? CK.UndoQueue : null;
    if (!u || !Array.isArray(u.queue) || typeof u.currentIndex !== "number") return null;
    return u;
  }

  function tryLoadCharacter(json) {
    const CK = UW.CK;
    if (!CK || typeof CK.tryLoadCharacter !== "function") return false;
    try {
      CK.tryLoadCharacter(deepClone(json), "Witch Dock: invalid character data", function () {});
      return true;
    } catch (e) {
      return false;
    }
  }

  function updateDockUndoRedoButtons() {
    if (!state.uiReady || !state.undoBtn || !state.redoBtn) return;
    const u = getUndoQueue();
    const canUndo = !!u && u.currentIndex > 0;
    const canRedo = !!u && u.currentIndex < u.queue.length - 1;
    state.undoBtn.disabled = !canUndo;
    state.redoBtn.disabled = !canRedo;
  }

  function triggerUndo() {
    const u = getUndoQueue();
    if (!u || !UW.CK) return;

    if (typeof u.undo === "function") {
      try {
        u.undo();
      } catch (e) {}
      updateDockUndoRedoButtons();
      return;
    }

    if (u.currentIndex <= 0) return;
    u.currentIndex -= 1;
    const json = u.queue[u.currentIndex];
    if (json) tryLoadCharacter(json);
    updateDockUndoRedoButtons();
  }

  function triggerRedo() {
    const u = getUndoQueue();
    if (!u || !UW.CK) return;

    if (typeof u.redo === "function") {
      try {
        u.redo();
      } catch (e) {}
      updateDockUndoRedoButtons();
      return;
    }

    if (u.currentIndex >= u.queue.length - 1) return;
    u.currentIndex += 1;
    const json = u.queue[u.currentIndex];
    if (json) tryLoadCharacter(json);
    updateDockUndoRedoButtons();
  }

  function hookUndoQueueForDockButtons() {
    const u = getUndoQueue();
    if (!u) return;

    function wrap(obj, key) {
      const fn = obj && typeof obj[key] === "function" ? obj[key] : null;
      if (!fn || fn.__kwDockWrapped) return;
      obj[key] = function () {
        const r = fn.apply(this, arguments);
        try {
          updateDockUndoRedoButtons();
        } catch (e) {}
        return r;
      };
      obj[key].__kwDockWrapped = true;
    }

    wrap(u, "push");
    wrap(u, "enqueue");
    wrap(u, "add");
    wrap(u, "record");
    wrap(u, "undo");
    wrap(u, "redo");
  }

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

  function copyToClipboard(text) {
    if (!text) return;
    try {
      if (typeof GM_setClipboard === "function") {
        GM_setClipboard(text);
        return;
      }
    } catch (e) {}
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
        return;
      }
    } catch (e) {}
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      ta.remove();
    } catch (e) {}
  }

  function isProbableBoneName(name) {
    if (!name || typeof name !== "string") return false;
    if (!name.includes("_bind_jnt")) return false;
    const bad = ["Kitbash_Bone_Container", "Kitbash Helpers", "KitbashHelpers", "Kitbash"];
    if (bad.some((b) => name.includes(b))) return false;
    return true;
  }

  function setLastBoneName(name) {
    if (!state.boneBar || !state.boneText || !state.boneCopyBtn) return;
    if (!name || typeof name !== "string") return;

    state.lastBoneName = name;
    state.boneText.textContent = name;
    state.boneText.title = name;
    state.boneCopyBtn.disabled = false;

    // show only when dock is expanded (not minimized/collapsed)
    state.boneBar.style.display = prefs.minimized ? "none" : "flex";
  }

  function ensureBoneBarVisibility() {
    if (!state.boneBar) return;
    if (prefs.minimized) {
      state.boneBar.style.display = "none";
      return;
    }
    // Only show if we have something to show
    state.boneBar.style.display = state.lastBoneName ? "flex" : "none";
  }

  function getHFSelectionName() {
    try {
      const HF = window.HF;
      const rig = HF?.summonCircle?.parent?.parent?.parent?.children?.[5];
      const name = rig?.object?.name;
      return name;
    } catch (e) {
      return null;
    }
  }

  function installBoneSelectionWatcher() {
    let lastSeen = null;

    const handler = (ev) => {
      if (!state.root) return;
      if (!prefs || prefs.minimized) return;

      // Ignore clicks inside Witch Dock UI itself.
      if (ev && ev.target && state.root.contains(ev.target)) return;

      // Let HF update its selection state.
      setTimeout(() => {
        const name = getHFSelectionName();
        if (!isProbableBoneName(name)) return;
        if (name === lastSeen) return;
        lastSeen = name;
        setLastBoneName(name);
      }, 0);
    };

    window.addEventListener("pointerup", handler, true);
    window.addEventListener("click", handler, true);
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
  cursor: default;
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
  cursor: default;
  position: relative;
}
.kwWDActionBtn:hover{ background: rgba(255,255,255,0.14); }

.kwWDMinimized #kwWDFooter{ display: none; }

  #kwWDBoneNameBar{
    display:flex;
    align-items:center;
    gap:6px;
    padding:4px 8px 2px 8px;
    font-size:11px;
    font-weight:400;
    color:rgba(255,255,255,0.78);
    user-select:text;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  #kwWDBoneNameText{
    flex:1 1 auto;
    min-width:0;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  #kwWDBoneCopyBtn{
    flex:0 0 auto;
    width:22px;
    height:18px;
    border-radius:6px;
    border:1px solid rgba(255,255,255,0.14);
    background:rgba(255,255,255,0.05);
    color:rgba(255,255,255,0.86);
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    padding:0;
  }
  #kwWDBoneCopyBtn:hover{
    background:rgba(255,255,255,0.09);
    border-color:rgba(255,255,255,0.22);
  }
  #kwWDBoneCopyBtn[disabled]{
    opacity:0.45;
    cursor:default;
  }
  .kwWDMinimized #kwWDBoneNameBar{ display:none; }
.kwWDTab{
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: #eee;
  border-radius: 10px;
  padding: 5px 10px;
  cursor: default;
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
#kwWDFooter{
  flex: 0 0 auto;
  padding: 6px 10px;
  border-top: 1px solid rgba(255,255,255,0.08);
  background: rgba(0,0,0,0.18);
  color: rgba(255,255,255,0.65);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
}
.kwWDPanel{
  display: none;
}
.kwWDToolList{
  display: flex;
  flex-direction: column;
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
  cursor: default;
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
  cursor: default;
  user-select: none;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.kwWDSectionHeader:active{ cursor: grabbing; }
.kwWDSection.dragging{ opacity: 0.65; }
.kwWDSection.drag-over-top{ box-shadow: inset 0 3px 0 rgba(170,85,255,0.85); }
.kwWDSection.drag-over-bottom{ box-shadow: inset 0 -3px 0 rgba(170,85,255,0.85); }
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
  opacity: 0.95;
}
.kwWDSectionHeaderBox svg{
  display: block;
}

.kwWDSectionHeaderBox svg{
  width: 12px;
  height: 12px;
  display: block;
  fill: currentColor;
  color: rgba(255,255,255,0.90);
}

.kwWDDragHandle{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;font-size:18px;opacity:0.75;cursor:grab;user-select:none;margin-left:auto;}
.kwWDSectionHeader.dragging .kwWDDragHandle{cursor:grabbing;opacity:0.95;}
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
.kwWDTool{
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 10px;
  background: rgba(255,255,255,0.03);
  overflow: hidden;
  margin-bottom: 8px;
}
.kwWDToolHeader{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  user-select: none;
  cursor: default;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.kwWDToolHeader:active{ cursor: grabbing; }
.kwWDToolTitle{
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.2px;
}
.kwWDToolBody{
  padding: 0;
}
.kwWDTool.drag-over-top{ box-shadow: inset 0 3px 0 rgba(170,85,255,0.85); }
.kwWDTool.drag-over-bottom{ box-shadow: inset 0 -3px 0 rgba(170,85,255,0.85); }
.kwWDToolList.drag-over-empty{ box-shadow: inset 0 0 0 2px rgba(170,85,255,0.55); border-radius: 10px; }
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
  
    ensureBoneBarVisibility();
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

    hookUndoQueueForDockButtons();
    updateDockUndoRedoButtons();
  }

  function ensureTab(name) {
    if (state.tabs.has(name)) return state.tabs.get(name);

    const btn = el("button", { class: "kwWDTab", type: "button", text: name, "aria-selected": "false" });
    const panel = el("div", { class: "kwWDPanel", "aria-hidden": "true" });
    const list = el("div", { class: "kwWDToolList" });
    panel.appendChild(list);

    btn.addEventListener("click", () => setActiveTab(name));

    state.tabsBar.appendChild(btn);
    state.body.appendChild(panel);

    const tab = { name, btn, panel, list };
    state.tabs.set(name, tab);

    if (!prefs.activeTab) prefs.activeTab = name;
    if (!state.activeTab) state.activeTab = prefs.activeTab || name;

    setActiveTab(state.activeTab);
    return tab;
  }



function makeIconBase() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", "12");
  svg.setAttribute("height", "12");
  return svg;
}

function makeIconMinus() {
  const svg = makeIconBase();
  const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
  l.setAttribute("x1", "3");
  l.setAttribute("y1", "8");
  l.setAttribute("x2", "13");
  l.setAttribute("y2", "8");
  l.setAttribute("stroke", "currentColor");
  l.setAttribute("stroke-width", "2");
  l.setAttribute("stroke-linecap", "round");
  l.setAttribute("vector-effect", "non-scaling-stroke");
  svg.appendChild(l);
  return svg;
}

function makeIconPlus() {
  const svg = makeIconBase();
  const h = document.createElementNS("http://www.w3.org/2000/svg", "line");
  h.setAttribute("x1", "3");
  h.setAttribute("y1", "8");
  h.setAttribute("x2", "13");
  h.setAttribute("y2", "8");
  h.setAttribute("stroke", "currentColor");
  h.setAttribute("stroke-width", "2");
  h.setAttribute("stroke-linecap", "round");
  h.setAttribute("vector-effect", "non-scaling-stroke");
  const v = document.createElementNS("http://www.w3.org/2000/svg", "line");
  v.setAttribute("x1", "8");
  v.setAttribute("y1", "3");
  v.setAttribute("x2", "8");
  v.setAttribute("y2", "13");
  v.setAttribute("stroke", "currentColor");
  v.setAttribute("stroke-width", "2");
  v.setAttribute("stroke-linecap", "round");
  v.setAttribute("vector-effect", "non-scaling-stroke");
  svg.appendChild(h);
  svg.appendChild(v);
  return svg;
}
function setCollapseIcon(boxEl, collapsed) {
  while (boxEl.firstChild) boxEl.removeChild(boxEl.firstChild);
  boxEl.appendChild(collapsed ? makeIconPlus() : makeIconMinus());
}

function slugify(str) {
  return String(str || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
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
    let sectionId = opts && typeof opts.id === "string" ? opts.id : "";
    const title = opts && typeof opts.title === "string" ? opts.title : "";
    if (!sectionId) sectionId = slugify(title) || "section";
    const defaultCollapsed = !!(opts && opts.defaultCollapsed);

    const root = el("div", { class: "kwWDSection", "data-collapsed": "0", "data-section-id": sectionId });
    const headerBox = el("div", { class: "kwWDSectionHeaderBox" });
    const header = el("div", { class: "kwWDSectionHeader" }, [
      headerBox,
      el("div", { class: "kwWDSectionHeaderName", text: title })
    ]);
    const body = el("div", { class: "kwWDSectionBody" });

    const box = headerBox;

    function apply(collapsed) {
      root.setAttribute("data-collapsed", collapsed ? "1" : "0");
      if (box) setCollapseIcon(box, collapsed);
    }

    const initial = getSectionCollapsed(toolId, sectionId, defaultCollapsed);
    apply(initial);

    header.addEventListener("click", (e) => {
      if (header.__kwDraggedRecently) return;
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
const SECTION_ORDER_PREFIX = "kw.witchDock.sectionOrder.";

function sectionOrderKey(toolId) {
  return SECTION_ORDER_PREFIX + toolId;
}

function getSectionOrder(toolId) {
  try {
    const raw = GM_getValue(sectionOrderKey(toolId), null);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function setSectionOrder(toolId, order) {
  try {
    GM_setValue(sectionOrderKey(toolId), JSON.stringify(order));
  } catch {}
}

function saveSectionOrderFromDom(toolId, container) {
  if (!container) return;
  const ids = Array.from(container.children)
    .filter((n) => n && n.classList && n.classList.contains("kwWDSection"))
    .map((n) => n.getAttribute("data-section-id"))
    .filter(Boolean);
  if (ids.length) setSectionOrder(toolId, ids);
}

function applySectionOrder(toolId, container) {
  if (!container) return;
  const sections = Array.from(container.children).filter((n) => n.classList && n.classList.contains("kwWDSection"));
  if (!sections.length) return;

  const saved = getSectionOrder(toolId);
  if (!saved.length) return;

  const map = new Map();
  for (const s of sections) {
    const id = s.getAttribute("data-section-id");
    if (id) map.set(id, s);
  }

  const ordered = [];
  for (const id of saved) {
    const el = map.get(id);
    if (el) ordered.push(el);
  }

  for (const s of sections) {
    const id = s.getAttribute("data-section-id");
    if (!id || !saved.includes(id)) ordered.push(s);
  }

  for (const el of ordered) container.appendChild(el);
}

function clearSectionDragIndicators(container) {
  if (!container) return;
  for (const s of Array.from(container.querySelectorAll(":scope > .kwWDSection"))) {
    if (s.classList) {
      s.classList.remove("drag-over-top");
      s.classList.remove("drag-over-bottom");
      s.classList.remove("dragging");
    }
  }
}

function getSectionAtY(container, y) {
  const sections = Array.from(container.children).filter((n) => n && n.classList && n.classList.contains("kwWDSection"));
  for (const s of sections) {
    const r = s.getBoundingClientRect();
    if (y >= r.top && y <= r.bottom) return s;
  }
  return null;
}

function startSectionPointerDrag(toolId, sectionRoot, header, container, e) {
  if (!e.isPrimary) return;
  const sectionId = sectionRoot.getAttribute("data-section-id");
  if (!sectionId) return;

  const pointerId = e.pointerId;
  try { header.setPointerCapture(pointerId); } catch {}
  const startX = e.clientX;
  const startY = e.clientY;

  let dragging = false;
  let dragEl = null;

  function onMove(ev) {
    if (ev.pointerId !== pointerId) return;

    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;

    if (!dragging) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      dragging = true;

      state.draggingSectionId = sectionId;
      state.draggingSectionTool = toolId;

      sectionRoot.classList.add("dragging");

      header.__kwDraggedRecently = true;
      setTimeout(() => { header.__kwDraggedRecently = false; }, 0);
    }

    ev.preventDefault();

    clearSectionDragIndicators(container);

    const target = getSectionAtY(container, ev.clientY);
    if (!target || target === sectionRoot) return;

    const r = target.getBoundingClientRect();
    const before = ev.clientY < r.top + r.height / 2;

    target.classList.add(before ? "drag-over-top" : "drag-over-bottom");
  }

  function onUp(ev) {
    if (ev.pointerId !== pointerId) return;

    window.removeEventListener("pointermove", onMove, true);
    window.removeEventListener("pointerup", onUp, true);
    window.removeEventListener("pointercancel", onUp, true);

    if (!dragging) return;

    const dropTarget = getSectionAtY(container, ev.clientY);
    if (dropTarget && dropTarget !== sectionRoot) {
      const r = dropTarget.getBoundingClientRect();
      const before = ev.clientY < r.top + r.height / 2;
      if (before) container.insertBefore(sectionRoot, dropTarget);
      else container.insertBefore(sectionRoot, dropTarget.nextSibling);
      saveSectionOrderFromDom(toolId, container);
    }

    clearSectionDragIndicators(container);

    sectionRoot.classList.remove("dragging");
    state.draggingSectionId = null;
    state.draggingSectionTool = null;
  }

  window.addEventListener("pointermove", onMove, true);
  window.addEventListener("pointerup", onUp, true);
  window.addEventListener("pointercancel", onUp, true);
}

function bindSectionPointerDrag(toolId, sectionRoot, container) {
  const header = sectionRoot.querySelector(".kwWDSectionHeader");
  if (!header) return;
  const handle = header.querySelector(".kwWDDragHandle") || header;
  if (handle.__kwPointerDragBound) return;
  handle.__kwPointerDragBound = true;

  handle.style.touchAction = "none";

  handle.addEventListener(
    "pointerdown",
    (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      startSectionPointerDrag(toolId, sectionRoot, handle, container, e);
    },
    true
  );
}

function ensureSectionDragHandle(sectionRoot) {
  const header = sectionRoot.querySelector(".kwWDSectionHeader");
  if (!header) return;
  if (header.querySelector(".kwWDDragHandle")) return;
  const h = document.createElement("span");
  h.className = "kwWDDragHandle";
  h.textContent = "≡";
  header.appendChild(h);
}

function finalizeToolSections(toolId, toolContainer) {
  if (!toolContainer) return;

  const sections = Array.from(toolContainer.querySelectorAll(".kwWDSection"));
  if (!sections.length) return;

  const parents = new Map();
  for (const s of sections) {
    const p = s.parentElement;
    if (!p) continue;
    if (!parents.has(p)) parents.set(p, []);
    parents.get(p).push(s);
  }

  for (const [parent, secs] of parents.entries()) {
    applySectionOrder(toolId, parent);
    for (const sec of secs) {
      ensureSectionDragHandle(sec);
      bindSectionPointerDrag(toolId, sec, parent);
    }
  }
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
  container.setAttribute("data-tool-id", def.id);

  tab.list.appendChild(container);

  state.toolsById.set(def.id, { def, container, tab: tabName });

  try {
    def.render(container, buildToolApi(def));
  } catch {
    container.textContent = "Tool failed to render.";
  }

  finalizeToolSections(def.id, container);

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
      el("div", { id: "kwWDBoneNameBar" }, [
        el("span", { id: "kwWDBoneNameText", text: "" }),
        el("button", { id: "kwWDBoneCopyBtn", class: "kwWDIconBtn", type: "button", title: "Copy bone name", text: "⧉" })
      ]),
      el("div", { id: "kwWDFooter", text: "Dock Hotkey: `~ (Grave Key)  |  Undo: Ctrl+Z  |  Redo: Ctrl+Shift+Z" }),
      el("div", { id: "kwWDResizeHandleBottom", onpointerdown: startResizeBottom }),
      el("div", { id: "kwWDResizeHandleCorner", onpointerdown: startResizeCorner })
    ]);

    state.header = state.root.querySelector("#kwWDHeader");
    state.tabsBar = state.root.querySelector("#kwWDTabsLeft");
    state.tabsBarRight = state.root.querySelector("#kwWDTabsRight");
    state.footer = state.root.querySelector("#kwWDFooter");
state.boneBar = state.root.querySelector("#kwWDBoneNameBar");
  state.boneText = state.root.querySelector("#kwWDBoneNameText");
  state.boneCopyBtn = state.root.querySelector("#kwWDBoneCopyBtn");
  if (state.boneCopyBtn) {
    state.boneCopyBtn.disabled = true;
    state.boneCopyBtn.addEventListener("click", () => {
      if (!state.lastBoneName) return;
      copyToClipboard(state.lastBoneName);
    });
  }
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
    installBoneSelectionWatcher();
    installDockHotkey();
loadManifestAndTools();
})();




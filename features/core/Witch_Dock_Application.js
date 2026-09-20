(function () {
  "use strict";

  const FEATURE_ID = "witch-dock-application";
  const VERSION = "0.1.0";
  const BUILD = "0.1.0-shell-registry-orchestration";
  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

  let state = null;
  let prefs = null;
  let DEFAULTS = null;
  let savePrefs = null;
  let preferences = null;
  let history = null;

  const STATE = {
    configured: false,
    registerToolCalls: 0,
    mountToolCalls: 0,
    ensureTabCalls: 0,
    setActiveTabCalls: 0,
    createSectionCalls: 0,
    sectionDragStarts: 0,
    sectionDragDrops: 0,
    lastError: null
  };

  function configure(options) {
    const opts = options && typeof options === "object" ? options : {};
    if (!opts.state || typeof opts.state !== "object") throw new Error("Witch Dock Application requires state.");
    if (!opts.prefs || typeof opts.prefs !== "object") throw new Error("Witch Dock Application requires prefs.");
    if (!opts.defaults || typeof opts.defaults !== "object") throw new Error("Witch Dock Application requires defaults.");
    if (typeof opts.savePrefs !== "function") throw new Error("Witch Dock Application requires savePrefs().");
    if (!opts.preferences || typeof opts.preferences.getSectionCollapsed !== "function" || typeof opts.preferences.getSectionOrder !== "function") {
      throw new Error("Witch Dock Application requires the Preferences API.");
    }
    if (!opts.history || typeof opts.history.hookUndoQueueForDockButtons !== "function" || typeof opts.history.updateDockUndoRedoButtons !== "function") {
      throw new Error("Witch Dock Application requires the History API.");
    }

    state = opts.state;
    prefs = opts.prefs;
    DEFAULTS = opts.defaults;
    savePrefs = opts.savePrefs;
    preferences = opts.preferences;
    history = opts.history;
    STATE.configured = true;
    STATE.lastError = null;
    return true;
  }

  function requireConfigured() {
    if (!STATE.configured) {
      STATE.lastError = "not configured";
      throw new Error("Witch Dock Application is not configured.");
    }
  }

  function hookUndoQueueForDockButtons() {
    return history.hookUndoQueueForDockButtons();
  }

  function updateDockUndoRedoButtons() {
    return history.updateDockUndoRedoButtons();
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
    const tabsH = state.tabsContainer ? state.tabsContainer.getBoundingClientRect().height : 40;
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
    const computed = getComputedStyle(state.root);
    const cssWidth = Number.parseFloat(computed.width);
    prefs.lastOpenWidth = Number.isFinite(cssWidth) ? Math.round(cssWidth) : Math.round(r.width);
    const cssHeight = Number.parseFloat(computed.height);
    prefs.lastOpenHeight = Number.isFinite(cssHeight) ? Math.round(cssHeight) : Math.round(r.height);
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
    STATE.setActiveTabCalls += 1;
    state.activeTab = name;
    prefs.activeTab = name;
    savePrefs(prefs);

    for (const [tabName, tab] of state.tabs) {
      const active = tabName === name;
      tab.btn.setAttribute("aria-selected", active ? "true" : "false");
      tab.panel.setAttribute("aria-hidden", active ? "false" : "true");
    }

    state.minWidth = computeMinDockWidthForActiveTab();
    if (prefs.firstRun) {
      prefs.width = Math.max(260, state.minWidth || 260);
      prefs.lastOpenWidth = prefs.width;
      prefs.firstRun = false;
      savePrefs(prefs);
      applyPositionAndSize();
    }
    enforceSizeConstraints();

    hookUndoQueueForDockButtons();
    updateDockUndoRedoButtons();
  }

  const TAB_ORDER_RANK = new Map([
    ["Body Editor", 0],
    ["Body", 0],
    ["Pose", 10],
    ["Decals", 20],
    ["Booth", 30],
    ["JSON", 40],
    ["Utilities", 1000]
  ]);

  function tabDisplayName(name) {
    return name === "Body Editor" ? "Body" : name;
  }

  function tabRank(name) {
    return TAB_ORDER_RANK.has(name) ? TAB_ORDER_RANK.get(name) : 900;
  }

  function makeTabCogIcon() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    const ring = document.createElementNS(ns, "circle");
    ring.setAttribute("cx", "12");
    ring.setAttribute("cy", "12");
    ring.setAttribute("r", "6.25");
    ring.setAttribute("fill", "none");
    ring.setAttribute("stroke", "currentColor");
    ring.setAttribute("stroke-width", "2");

    const hub = document.createElementNS(ns, "circle");
    hub.setAttribute("cx", "12");
    hub.setAttribute("cy", "12");
    hub.setAttribute("r", "2.25");
    hub.setAttribute("fill", "currentColor");

    svg.appendChild(ring);
    svg.appendChild(hub);

    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", String(12 + Math.cos(angle) * 7.25));
      line.setAttribute("y1", String(12 + Math.sin(angle) * 7.25));
      line.setAttribute("x2", String(12 + Math.cos(angle) * 10));
      line.setAttribute("y2", String(12 + Math.sin(angle) * 10));
      line.setAttribute("stroke", "currentColor");
      line.setAttribute("stroke-width", "2.4");
      line.setAttribute("stroke-linecap", "round");
      svg.appendChild(line);
    }

    return svg;
  }

  function reorderTabButtons() {
    if (!state.tabsBar) return;
    const buttons = Array.from(state.tabsBar.children).filter(
      (node) => node && node.classList && node.classList.contains("kwWDTab")
    );
    const originalIndex = new Map(buttons.map((button, index) => [button, index]));

    buttons.sort((a, b) => {
      const aName = a.getAttribute("data-tab-name") || "";
      const bName = b.getAttribute("data-tab-name") || "";
      const rankDelta = tabRank(aName) - tabRank(bName);
      if (rankDelta) return rankDelta;
      return originalIndex.get(a) - originalIndex.get(b);
    });

    for (const button of buttons) state.tabsBar.appendChild(button);
    if (state.updateTabsCue) state.updateTabsCue();
  }

  function ensureTab(name) {
    STATE.ensureTabCalls += 1;
    if (state.tabs.has(name)) return state.tabs.get(name);

    const iconOnly = name === "Utilities";
    const btn = el("button", {
      class: iconOnly ? "kwWDTab kwWDTabIconOnly" : "kwWDTab",
      type: "button",
      "aria-selected": "false"
    });
    btn.setAttribute("data-tab-name", name);

    if (iconOnly) {
      btn.title = "Utilities";
      btn.setAttribute("aria-label", "Utilities");
      btn.appendChild(makeTabCogIcon());
    } else {
      btn.textContent = tabDisplayName(name);
      btn.setAttribute("aria-label", tabDisplayName(name));
    }

    const panel = el("div", { class: "kwWDPanel", "aria-hidden": "true" });
    const list = el("div", { class: "kwWDToolList" });
    panel.appendChild(list);

    btn.addEventListener("click", () => setActiveTab(name));

    state.tabsBar.appendChild(btn);
    state.body.appendChild(panel);

    const tab = { name, btn, panel, list };
    state.tabs.set(name, tab);
    reorderTabButtons();

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

function toolSectionKey(toolId, sectionId) { return preferences.sectionCollapsedKey(toolId, sectionId); }
  function getSectionCollapsed(toolId, sectionId, defaultCollapsed) { return preferences.getSectionCollapsed(toolId, sectionId, defaultCollapsed); }
  function setSectionCollapsed(toolId, sectionId, collapsed) { return preferences.setSectionCollapsed(toolId, sectionId, collapsed); }

  function createSection(toolId, opts) {
    STATE.createSectionCalls += 1;
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
function sectionOrderKey(toolId) { return preferences.sectionOrderKey(toolId); }
function getSectionOrder(toolId) { return preferences.getSectionOrder(toolId); }
function setSectionOrder(toolId, order) { return preferences.setSectionOrder(toolId, order); }

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
  STATE.sectionDragStarts += 1;
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
      STATE.sectionDragDrops += 1;
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
  STATE.mountToolCalls += 1;
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
    STATE.registerToolCalls += 1;
    if (!def || typeof def !== "object") return;
    if (!def.id || typeof def.id !== "string") return;
    if (typeof def.render !== "function") return;

    if (!state.uiReady) state.pending.push(def);
    else mountTool(def);
  }

  function getState() {
    requireConfigured();
    return {
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      configured: STATE.configured,
      activeTab: state.activeTab,
      tabCount: state.tabs ? state.tabs.size : null,
      toolCount: state.toolsById ? state.toolsById.size : null,
      pendingCount: state.pending ? state.pending.length : null,
      registerToolCalls: STATE.registerToolCalls,
      mountToolCalls: STATE.mountToolCalls,
      ensureTabCalls: STATE.ensureTabCalls,
      setActiveTabCalls: STATE.setActiveTabCalls,
      createSectionCalls: STATE.createSectionCalls,
      sectionDragStarts: STATE.sectionDragStarts,
      sectionDragDrops: STATE.sectionDragDrops,
      lastError: STATE.lastError
    };
  }

  UW.KWWitchDockApplication = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    configure,
    el,
    clamp,
    computeMinDockHeightCollapsed,
    getViewport,
    isAnchored,
    snapshotCurrentDockPositionToPrefs,
    applyPositionAndSize,
    applyMinimizedState,
    showClosedCompact,
    computeMinDockWidthForActiveTab,
    enforceSizeConstraints,
    setActiveTab,
    mountTool,
    registerTool,
    getState
  });
})();

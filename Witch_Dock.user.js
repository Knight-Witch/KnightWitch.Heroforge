// ==UserScript==
// @name         Witch Dock (REQUIRED)
// @namespace    knight-witch-dock
// @version      0.1.0
// @description  Required shared UI dock for Knight Witch HeroForge userscripts.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        unsafeWindow
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Witch_Dock.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Witch_Dock.user.js
// ==/UserScript==

(() => {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  const STORE_KEY = 'kw.witchDock.v1';
  const DOCK_ID = 'kw-witch-dock';
  const PILL_ID = 'kw-witch-dock-pill';
  const STYLE_ID = 'kw-witch-dock-style';

  const state = {
    visible: true,
    minimized: false,
    pos: { left: 16, top: 120 },
    size: { w: 420, h: 620 },
    activeTab: 'sync',
    collapsed: {},
    order: {},
  };

  const registry = {
    tabs: new Map(),
    sections: new Map(),
  };

  function loadState() {
    try {
      const raw = UW.localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object') return;

      if (typeof saved.visible === 'boolean') state.visible = saved.visible;
      if (typeof saved.minimized === 'boolean') state.minimized = saved.minimized;

      if (saved.pos && typeof saved.pos === 'object') {
        if (typeof saved.pos.left === 'number') state.pos.left = saved.pos.left;
        if (typeof saved.pos.top === 'number') state.pos.top = saved.pos.top;
      }

      if (saved.size && typeof saved.size === 'object') {
        if (typeof saved.size.w === 'number') state.size.w = saved.size.w;
        if (typeof saved.size.h === 'number') state.size.h = saved.size.h;
      }

      if (typeof saved.activeTab === 'string') state.activeTab = saved.activeTab;

      if (saved.collapsed && typeof saved.collapsed === 'object') state.collapsed = saved.collapsed;
      if (saved.order && typeof saved.order === 'object') state.order = saved.order;
    } catch {}
  }

  function saveState() {
    try {
      UW.localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          visible: state.visible,
          minimized: state.minimized,
          pos: state.pos,
          size: state.size,
          activeTab: state.activeTab,
          collapsed: state.collapsed,
          order: state.order,
        })
      );
    } catch {}
  }

  function ensureDefaultTabs() {
    addTab({ id: 'sync', title: 'Sync', order: 10 });
    addTab({ id: 'bone', title: 'Bones', order: 20 });
    addTab({ id: 'decal', title: 'Decals', order: 30 });
    addTab({ id: 'booth', title: 'Booth', order: 40 });
  }

  function addTab({ id, title, order = 100 }) {
    if (!id) return;
    const tabId = String(id);
    if (!registry.tabs.has(tabId)) registry.tabs.set(tabId, { id: tabId, title: title || tabId, order });
    else {
      const t = registry.tabs.get(tabId);
      t.title = title || t.title;
      t.order = order ?? t.order;
    }
  }

  function registerSection({ id, tab, title, order = 100, render, onShow, onHide }) {
    if (!id || typeof render !== 'function') return;
    const secId = String(id);
    const tabId = tab ? String(tab) : 'misc';

    if (!registry.tabs.has(tabId)) addTab({ id: tabId, title: tabId, order: 999 });

    registry.sections.set(secId, {
      id: secId,
      tab: tabId,
      title: title || secId,
      order,
      render,
      onShow: typeof onShow === 'function' ? onShow : null,
      onHide: typeof onHide === 'function' ? onHide : null,
    });

    queueRender();
  }

  function unregisterSection(id) {
    const secId = String(id);
    const sec = registry.sections.get(secId);
    if (!sec) return;
    registry.sections.delete(secId);
    queueRender();
  }

  function isTypingTarget(el) {
    if (!el) return false;
    const tag = String(el.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
    if (el.isContentEditable) return true;
    return false;
  }

  function injectStyle() {
    const css = `
#${DOCK_ID}{
  position:fixed;
  z-index:2147483647;
  left:${state.pos.left}px;
  top:${state.pos.top}px;
  width:${state.size.w}px;
  height:${state.size.h}px;
  background:rgba(14,14,14,0.92);
  color:#e8e8e8;
  border:1px solid rgba(255,255,255,0.14);
  border-radius:12px;
  box-shadow:0 10px 30px rgba(0,0,0,0.45);
  font:12px/1.25 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  display:${state.visible ? 'block' : 'none'};
  overflow:hidden;
}
#${DOCK_ID}[data-min="1"] .kw-body{ display:none; }
#${DOCK_ID} .kw-head{
  cursor:move;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:8px 10px;
  user-select:none;
  border-bottom:1px solid rgba(255,255,255,0.10);
}
#${DOCK_ID} .kw-title{ font-weight:700; letter-spacing:0.2px; }
#${DOCK_ID} .kw-btns{ display:flex; gap:6px; align-items:center; }
#${DOCK_ID} button{
  background:rgba(255,255,255,0.10);
  color:#e8e8e8;
  border:1px solid rgba(255,255,255,0.12);
  border-radius:8px;
  padding:4px 8px;
  cursor:pointer;
}
#${DOCK_ID} button:hover{ background:rgba(255,255,255,0.16); }
#${DOCK_ID} button:disabled{ opacity:0.45; cursor:not-allowed; }

#${DOCK_ID} .kw-tabs{
  display:flex;
  gap:6px;
  padding:8px 10px;
  border-bottom:1px solid rgba(255,255,255,0.10);
  overflow-x:auto;
  overflow-y:hidden;
  scrollbar-width:thin;
}
#${DOCK_ID} .kw-tabs::-webkit-scrollbar{ height:8px; }
#${DOCK_ID} .kw-tabs::-webkit-scrollbar-thumb{ background:rgba(255,255,255,0.18); border-radius:999px; }
#${DOCK_ID} .kw-tab{
  flex:0 0 auto;
  padding:6px 10px;
  border-radius:10px;
  white-space:nowrap;
}
#${DOCK_ID} .kw-tab[data-a="1"]{ background:rgba(255,255,255,0.20); }

#${DOCK_ID} .kw-body{
  height:calc(100% - 34px - 44px);
  overflow:auto;
  padding:10px;
}

#${DOCK_ID} .kw-sec{
  border:1px solid rgba(255,255,255,0.10);
  border-radius:12px;
  overflow:hidden;
  margin-bottom:10px;
  background:rgba(0,0,0,0.18);
}
#${DOCK_ID} .kw-sec:last-child{ margin-bottom:0; }
#${DOCK_ID} .kw-sec-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  padding:8px 10px;
  background:rgba(255,255,255,0.04);
  user-select:none;
}
#${DOCK_ID} .kw-sec-left{
  display:flex;
  align-items:center;
  gap:8px;
  min-width:0;
}
#${DOCK_ID} .kw-grab{
  cursor:grab;
  opacity:0.75;
  padding:2px 6px;
  border-radius:8px;
  border:1px solid rgba(255,255,255,0.10);
  background:rgba(255,255,255,0.06);
}
#${DOCK_ID} .kw-sec-title{
  font-weight:650;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
#${DOCK_ID} .kw-sec-actions{
  display:flex;
  gap:6px;
  align-items:center;
}
#${DOCK_ID} .kw-sec-body{
  padding:10px;
}
#${DOCK_ID} .kw-sec[data-collapsed="1"] .kw-sec-body{ display:none; }

#${DOCK_ID} .kw-resize{
  position:absolute;
  right:0;
  bottom:0;
  width:14px;
  height:14px;
  cursor:nwse-resize;
  background:linear-gradient(135deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.0) 50%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.22) 60%, rgba(255,255,255,0.0) 60%);
}
#${PILL_ID}{
  position:fixed;
  z-index:2147483647;
  left:${state.pos.left}px;
  top:${state.pos.top}px;
  background:rgba(14,14,14,0.92);
  color:#e8e8e8;
  border:1px solid rgba(255,255,255,0.14);
  border-radius:999px;
  padding:6px 10px;
  font:12px/1.25 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  cursor:pointer;
  display:${state.visible ? 'none' : 'block'};
  user-select:none;
}
`;
    let el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = css;
  }

  function mountUI() {
    if (document.getElementById(DOCK_ID)) return;

    const dock = document.createElement('div');
    dock.id = DOCK_ID;
    dock.setAttribute('data-min', state.minimized ? '1' : '0');

    const head = document.createElement('div');
    head.className = 'kw-head';

    const title = document.createElement('div');
    title.className = 'kw-title';
    title.textContent = 'Witch Dock';

    const btns = document.createElement('div');
    btns.className = 'kw-btns';

    const minBtn = document.createElement('button');
    minBtn.textContent = '_';
    minBtn.addEventListener('click', () => {
      state.minimized = !state.minimized;
      saveState();
      renderVisibility();
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'x';
    closeBtn.addEventListener('click', () => {
      state.visible = false;
      saveState();
      renderVisibility();
    });

    btns.appendChild(minBtn);
    btns.appendChild(closeBtn);

    head.appendChild(title);
    head.appendChild(btns);

    const tabs = document.createElement('div');
    tabs.className = 'kw-tabs';

    tabs.addEventListener('wheel', (e) => {
      if (!e.shiftKey && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        tabs.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });

    const body = document.createElement('div');
    body.className = 'kw-body';

    const res = document.createElement('div');
    res.className = 'kw-resize';

    dock.appendChild(head);
    dock.appendChild(tabs);
    dock.appendChild(body);
    dock.appendChild(res);

    document.body.appendChild(dock);

    const pill = document.createElement('div');
    pill.id = PILL_ID;
    pill.textContent = 'Witch Dock';
    pill.addEventListener('click', () => {
      state.visible = true;
      state.minimized = false;
      saveState();
      renderVisibility();
      queueRender(true);
    });
    document.body.appendChild(pill);

    setupDragDock(head, dock);
    setupResize(res, dock);
    document.addEventListener('keydown', onHotkey, true);

    injectStyle();
    renderVisibility();
    queueRender(true);
  }

  function renderVisibility() {
    const dock = document.getElementById(DOCK_ID);
    const pill = document.getElementById(PILL_ID);
    if (!dock || !pill) return;

    dock.style.display = state.visible ? 'block' : 'none';
    pill.style.display = state.visible ? 'none' : 'block';

    dock.style.left = `${state.pos.left}px`;
    dock.style.top = `${state.pos.top}px`;
    pill.style.left = `${state.pos.left}px`;
    pill.style.top = `${state.pos.top}px`;

    dock.style.width = `${state.size.w}px`;
    dock.style.height = `${state.size.h}px`;

    dock.setAttribute('data-min', state.minimized ? '1' : '0');
    injectStyle();
  }

  function onHotkey(e) {
    if (e.defaultPrevented) return;
    if (isTypingTarget(e.target)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.code !== 'Backquote') return;

    if (!state.visible) {
      state.visible = true;
      state.minimized = false;
      saveState();
      renderVisibility();
      queueRender(true);
      return;
    }

    state.minimized = !state.minimized;
    saveState();
    renderVisibility();
  }

  function setupDragDock(handle, dock) {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    handle.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = state.pos.left;
      startTop = state.pos.top;
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      state.pos.left = Math.max(0, startLeft + dx);
      state.pos.top = Math.max(0, startTop + dy);

      dock.style.left = `${state.pos.left}px`;
      dock.style.top = `${state.pos.top}px`;

      const pill = document.getElementById(PILL_ID);
      if (pill) {
        pill.style.left = `${state.pos.left}px`;
        pill.style.top = `${state.pos.top}px`;
      }
    });

    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      saveState();
      renderVisibility();
    });
  }

  function setupResize(handle, dock) {
    let resizing = false;
    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startH = 0;

    handle.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      resizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startW = state.size.w;
      startH = state.size.h;
      e.preventDefault();
      e.stopPropagation();
    });

    window.addEventListener('mousemove', (e) => {
      if (!resizing) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      state.size.w = Math.max(280, startW + dx);
      state.size.h = Math.max(220, startH + dy);
      dock.style.width = `${state.size.w}px`;
      dock.style.height = `${state.size.h}px`;
      injectStyle();
    });

    window.addEventListener('mouseup', () => {
      if (!resizing) return;
      resizing = false;
      saveState();
      renderVisibility();
    });
  }

  function getTabsSorted() {
    return Array.from(registry.tabs.values()).sort((a, b) => (a.order - b.order) || a.title.localeCompare(b.title));
  }

  function getSectionsForTab(tabId) {
    const secs = [];
    for (const sec of registry.sections.values()) if (sec.tab === tabId) secs.push(sec);
    const userOrder = state.order[tabId] || [];
    const idx = new Map();
    userOrder.forEach((id, i) => idx.set(id, i));

    secs.sort((a, b) => {
      const ai = idx.has(a.id) ? idx.get(a.id) : null;
      const bi = idx.has(b.id) ? idx.get(b.id) : null;
      if (ai != null && bi != null) return ai - bi;
      if (ai != null) return -1;
      if (bi != null) return 1;
      return (a.order - b.order) || a.title.localeCompare(b.title);
    });

    return secs;
  }

  function setSectionOrder(tabId, ids) {
    state.order[tabId] = ids.slice();
    saveState();
  }

  function toggleCollapsed(secId) {
    state.collapsed[secId] = !state.collapsed[secId];
    saveState();
    queueRender();
  }

  let renderQueued = false;
  let lastActiveTab = null;

  function queueRender(forceShowCallbacks = false) {
    if (renderQueued) return;
    renderQueued = true;
    queueMicrotask(() => {
      renderQueued = false;
      render(forceShowCallbacks);
    });
  }

  function render(forceShowCallbacks = false) {
    const dock = document.getElementById(DOCK_ID);
    if (!dock) return;

    const tabsEl = dock.querySelector('.kw-tabs');
    const bodyEl = dock.querySelector('.kw-body');
    if (!tabsEl || !bodyEl) return;

    tabsEl.innerHTML = '';
    const tabs = getTabsSorted();

    if (!tabs.length) {
      const b = document.createElement('div');
      b.textContent = 'No tabs registered.';
      bodyEl.innerHTML = '';
      bodyEl.appendChild(b);
      return;
    }

    if (!registry.tabs.has(state.activeTab)) state.activeTab = tabs[0].id;

    for (const t of tabs) {
      const btn = document.createElement('button');
      btn.className = 'kw-tab';
      btn.textContent = t.title;
      btn.setAttribute('data-a', t.id === state.activeTab ? '1' : '0');
      btn.addEventListener('click', () => {
        if (state.activeTab === t.id) return;
        state.activeTab = t.id;
        saveState();
        queueRender(true);
      });
      tabsEl.appendChild(btn);
    }

    const activeTab = state.activeTab;
    const secs = getSectionsForTab(activeTab);

    if (forceShowCallbacks || lastActiveTab !== activeTab) {
      if (lastActiveTab && lastActiveTab !== activeTab) {
        const prevSecs = getSectionsForTab(lastActiveTab);
        for (const s of prevSecs) if (s.onHide) try { s.onHide(); } catch {}
      }
      for (const s of secs) if (s.onShow) try { s.onShow(); } catch {}
      lastActiveTab = activeTab;
    }

    bodyEl.innerHTML = '';

    if (!secs.length) {
      const m = document.createElement('div');
      m.textContent = 'No tools installed for this tab.';
      bodyEl.appendChild(m);
      return;
    }

    const orderIds = secs.map(s => s.id);

    for (const sec of secs) {
      const wrapper = document.createElement('div');
      wrapper.className = 'kw-sec';
      wrapper.dataset.secId = sec.id;
      wrapper.setAttribute('data-collapsed', state.collapsed[sec.id] ? '1' : '0');

      const head = document.createElement('div');
      head.className = 'kw-sec-head';

      const left = document.createElement('div');
      left.className = 'kw-sec-left';

      const grab = document.createElement('div');
      grab.className = 'kw-grab';
      grab.textContent = '☰';
      grab.draggable = true;

      const title = document.createElement('div');
      title.className = 'kw-sec-title';
      title.textContent = sec.title;

      left.appendChild(grab);
      left.appendChild(title);

      const actions = document.createElement('div');
      actions.className = 'kw-sec-actions';

      const collapseBtn = document.createElement('button');
      collapseBtn.textContent = state.collapsed[sec.id] ? '+' : '–';
      collapseBtn.addEventListener('click', () => toggleCollapsed(sec.id));

      actions.appendChild(collapseBtn);

      head.appendChild(left);
      head.appendChild(actions);

      const body = document.createElement('div');
      body.className = 'kw-sec-body';
      try {
        sec.render(body);
      } catch (e) {
        const err = document.createElement('div');
        err.textContent = 'Tool render error.';
        body.appendChild(err);
      }

      wrapper.appendChild(head);
      wrapper.appendChild(body);

      setupSectionDnd(grab, wrapper, activeTab, orderIds);

      bodyEl.appendChild(wrapper);
    }
  }

  function setupSectionDnd(handle, wrapper, tabId, currentOrder) {
    handle.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', wrapper.dataset.secId || '');
      e.dataTransfer.effectAllowed = 'move';
    });

    wrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    wrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      const fromId = e.dataTransfer.getData('text/plain');
      const toId = wrapper.dataset.secId;
      if (!fromId || !toId || fromId === toId) return;

      const order = (state.order[tabId] && state.order[tabId].length) ? state.order[tabId].slice() : currentOrder.slice();
      const fromIdx = order.indexOf(fromId);
      const toIdx = order.indexOf(toId);
      if (fromIdx === -1 || toIdx === -1) return;

      order.splice(fromIdx, 1);
      order.splice(toIdx, 0, fromId);
      setSectionOrder(tabId, order);
      queueRender();
    });
  }

  function exposeAPI() {
    const api = {
      version: state ? '0.1.0' : '0.0.0',
      addTab,
      registerSection,
      unregisterSection,
      render: () => queueRender(true),
      show: () => {
        state.visible = true;
        state.minimized = false;
        saveState();
        renderVisibility();
        queueRender(true);
      },
      hide: () => {
        state.visible = false;
        saveState();
        renderVisibility();
      },
    };

    UW.WitchDock = api;
  }

  loadState();
  ensureDefaultTabs();
  injectStyle();
  mountUI();
  exposeAPI();
})();

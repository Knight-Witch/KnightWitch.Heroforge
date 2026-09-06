// ==UserScript==
// @name         Witch Dock DEV - Developer Mode
// @namespace    KnightWitch
// @version      0.1.0
// @description  Shared Witch Dock developer-mode toggle, tool build registry, and developer-only diagnostics host.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const GLOBAL = 'KWDeveloperMode';
  const BUILD = '0.1.0-dev-registry-about-toggle';
  const STORE_KEY = 'kw.witchDock.developerMode.v1';
  const STYLE_ID = 'kwWDDeveloperModeStyle';
  const ABOUT_ROW_ID = 'kwWDDeveloperModeRow';
  const EVENT_NAME = 'kw:witchdock-developer-mode';

  let enabled = false;
  let timer = null;
  let registerTimer = null;
  let originalRegisterTool = null;
  let wrappedRegisterTool = null;
  const listeners = new Set();
  const toolRegistry = new Map();

  function readEnabled() {
    try { return UW.localStorage.getItem(STORE_KEY) === 'true'; }
    catch (_) { return false; }
  }

  function saveEnabled() {
    try { UW.localStorage.setItem(STORE_KEY, enabled ? 'true' : 'false'); } catch (_) {}
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${ABOUT_ROW_ID}{margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.10);}
      #${ABOUT_ROW_ID} .kwWDDevModeToggle{display:flex;align-items:center;gap:8px;font-weight:800;}
      #${ABOUT_ROW_ID} .kwWDDevModeHint{margin-top:4px;font-size:11px;line-height:1.35;opacity:.68;}
      .kwWDDevToolMeta{margin:0 0 7px 0;padding:5px 7px;border:1px dashed rgba(190,130,255,.36);border-radius:5px;background:rgba(170,85,255,.07);color:rgba(220,195,255,.88);font-size:10px;line-height:1.3;overflow-wrap:anywhere;}
      .kwWDDevToolMeta[hidden]{display:none!important;}
    `;
    document.head.appendChild(style);
  }

  function normalizeMeta(def) {
    const id = def && typeof def.id === 'string' ? def.id : '';
    if (!id) return null;
    const build = def && def.build != null ? String(def.build) : '';
    const version = def && def.version != null ? String(def.version) : '';
    return {
      id,
      title: def && typeof def.title === 'string' ? def.title : '',
      tab: def && typeof def.tab === 'string' ? def.tab : '',
      build,
      version,
      updatedAt: new Date().toISOString()
    };
  }

  function registerToolMeta(def) {
    const meta = normalizeMeta(def);
    if (!meta) return false;
    const prior = toolRegistry.get(meta.id);
    toolRegistry.set(meta.id, {
      ...(prior || {}),
      ...meta,
      build: meta.build || (prior && prior.build) || '',
      version: meta.version || (prior && prior.version) || ''
    });
    renderToolMeta();
    return true;
  }

  function seedRegistryFromDom() {
    const containers = document.querySelectorAll('#kwWitchDock [data-tool-id]');
    for (const container of containers) {
      const id = container.getAttribute('data-tool-id');
      if (!id || toolRegistry.has(id)) continue;
      toolRegistry.set(id, { id, title: '', tab: '', build: '', version: '', updatedAt: null });
    }
  }

  function metaLabel(meta) {
    if (!meta) return 'build unreported';
    if (meta.build) return `build ${meta.build}`;
    if (meta.version) return `version ${meta.version}`;
    return 'build unreported';
  }

  function renderToolMeta() {
    seedRegistryFromDom();
    const containers = document.querySelectorAll('#kwWitchDock [data-tool-id]');
    for (const container of containers) {
      const id = container.getAttribute('data-tool-id');
      if (!id) continue;
      let line = container.querySelector(':scope > .kwWDDevToolMeta');
      if (!line) {
        line = document.createElement('div');
        line.className = 'kwWDDevToolMeta';
        container.insertBefore(line, container.firstChild || null);
      }
      const meta = toolRegistry.get(id) || { id };
      line.textContent = `DEV · ${id} · ${metaLabel(meta)}`;
      line.hidden = !enabled;
    }
  }

  function ensureAboutToggle() {
    const body = document.getElementById('kwWDAboutBody');
    if (!body) return false;
    let row = document.getElementById(ABOUT_ROW_ID);
    if (!row) {
      row = document.createElement('div');
      row.id = ABOUT_ROW_ID;

      const label = document.createElement('label');
      label.className = 'kwWDDevModeToggle';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'kwWDDevModeInput';
      const text = document.createElement('span');
      text.textContent = 'Developer Mode';
      label.appendChild(input);
      label.appendChild(text);

      const hint = document.createElement('div');
      hint.className = 'kwWDDevModeHint';
      hint.textContent = 'Shows tool IDs/builds and troubleshooting controls intended for development or recovery.';

      row.appendChild(label);
      row.appendChild(hint);
      body.appendChild(row);

      input.addEventListener('change', () => setEnabled(input.checked));
    }

    const input = row.querySelector('.kwWDDevModeInput');
    if (input) input.checked = enabled;
    return true;
  }

  function dispatchChange() {
    try {
      const EventCtor = UW.CustomEvent || CustomEvent;
      UW.dispatchEvent(new EventCtor(EVENT_NAME, { detail: { enabled } }));
    } catch (_) {}
    for (const listener of Array.from(listeners)) {
      try { listener(enabled); } catch (_) {}
    }
  }

  function applyState(emit) {
    ensureStyles();
    const root = document.getElementById('kwWitchDock');
    if (root) root.classList.toggle('kwWDDeveloperMode', enabled);
    ensureAboutToggle();
    renderToolMeta();
    if (emit) dispatchChange();
  }

  function setEnabled(value) {
    const next = !!value;
    if (enabled === next) {
      applyState(false);
      return enabled;
    }
    enabled = next;
    saveEnabled();
    applyState(true);
    return enabled;
  }

  function toggle() {
    return setEnabled(!enabled);
  }

  function onChange(listener) {
    if (typeof listener !== 'function') return () => {};
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function registrySnapshot() {
    return Array.from(toolRegistry.values()).map((item) => ({ ...item }));
  }

  function installRegisterWrapper() {
    const WD = UW && UW.WitchDock;
    if (!WD || typeof WD.registerTool !== 'function') return false;
    if (wrappedRegisterTool && WD.registerTool === wrappedRegisterTool) return true;
    if (WD.registerTool && WD.registerTool.__kwDeveloperModeWrapped) return true;

    originalRegisterTool = WD.registerTool;
    wrappedRegisterTool = function (def) {
      registerToolMeta(def);
      return originalRegisterTool.apply(this, arguments);
    };
    wrappedRegisterTool.__kwDeveloperModeWrapped = true;
    wrappedRegisterTool.__kwDeveloperModeOriginal = originalRegisterTool;
    WD.registerTool = wrappedRegisterTool;
    return true;
  }

  function initialize() {
    enabled = readEnabled();
    ensureStyles();
    installRegisterWrapper();
    if (!registerTimer && !(UW.WitchDock && UW.WitchDock.registerTool && UW.WitchDock.registerTool.__kwDeveloperModeWrapped)) {
      registerTimer = window.setInterval(() => {
        if (installRegisterWrapper()) {
          window.clearInterval(registerTimer);
          registerTimer = null;
        }
      }, 200);
    }
    applyState(false);
    if (!timer) timer = window.setInterval(() => applyState(false), 500);
    return true;
  }

  function dispose() {
    if (timer) window.clearInterval(timer);
    timer = null;
    if (registerTimer) window.clearInterval(registerTimer);
    registerTimer = null;

    const WD = UW && UW.WitchDock;
    if (WD && wrappedRegisterTool && WD.registerTool === wrappedRegisterTool && originalRegisterTool) {
      WD.registerTool = originalRegisterTool;
    }
    originalRegisterTool = null;
    wrappedRegisterTool = null;

    document.getElementById(STYLE_ID)?.remove();
    document.getElementById(ABOUT_ROW_ID)?.remove();
    for (const line of document.querySelectorAll('.kwWDDevToolMeta')) line.remove();
    const root = document.getElementById('kwWitchDock');
    if (root) root.classList.remove('kwWDDeveloperMode');
    listeners.clear();
    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }
    return true;
  }

  if (UW[GLOBAL] && typeof UW[GLOBAL].dispose === 'function') {
    try { UW[GLOBAL].dispose(); } catch (_) {}
  }

  UW[GLOBAL] = {
    build: BUILD,
    setEnabled,
    toggle,
    onChange,
    registerToolMeta,
    registrySnapshot,
    initialize,
    dispose,
    get enabled() { return enabled; }
  };

  initialize();
})();

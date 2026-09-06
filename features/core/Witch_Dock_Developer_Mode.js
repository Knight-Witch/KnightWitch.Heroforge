// ==UserScript==
// @name         Witch Dock DEV - Developer Mode
// @namespace    KnightWitch
// @version      0.2.0
// @description  Shared Witch Dock developer-mode toggle, canonical module version registry, and developer-only diagnostics host.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const GLOBAL = 'KWDeveloperMode';
  const BUILD = '0.2.0-dev-module-version-registry';
  const STORE_KEY = 'kw.witchDock.developerMode.v1';
  const STYLE_ID = 'kwWDDeveloperModeStyle';
  const ABOUT_ROW_ID = 'kwWDDeveloperModeRow';
  const EVENT_NAME = 'kw:witchdock-developer-mode';
  const REGISTRY_URL = 'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/manifest.json';

  let enabled = false;
  let timer = null;
  let registerTimer = null;
  let originalRegisterTool = null;
  let wrappedRegisterTool = null;
  let registryLoaded = false;
  let registryError = null;
  const listeners = new Set();
  const toolRegistry = new Map();
  const moduleRegistry = new Map();

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
      #${ABOUT_ROW_ID} .kwWDDevModuleVersions{margin-top:9px;font-size:11px;line-height:1.35;}
      #${ABOUT_ROW_ID} .kwWDDevModuleVersions[hidden]{display:none!important;}
      #${ABOUT_ROW_ID} .kwWDDevModuleVersions summary{cursor:pointer;font-weight:800;}
      #${ABOUT_ROW_ID} .kwWDDevModuleList{margin-top:6px;padding:7px;border:1px solid rgba(255,255,255,.10);border-radius:6px;background:rgba(0,0,0,.16);max-height:240px;overflow:auto;}
      #${ABOUT_ROW_ID} .kwWDDevModuleLine{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px;overflow-wrap:anywhere;margin:3px 0;}
      #${ABOUT_ROW_ID} .kwWDDevRegistryError{color:#ff9b9b;}
      .kwWDDevToolMeta{margin:0 0 7px 0;padding:5px 7px;border:1px dashed rgba(190,130,255,.36);border-radius:5px;background:rgba(170,85,255,.07);color:rgba(220,195,255,.88);font-size:10px;line-height:1.3;overflow-wrap:anywhere;}
      .kwWDDevToolMeta[hidden]{display:none!important;}
    `;
    document.head.appendChild(style);
  }

  function clean(value) {
    return value === null || value === undefined ? '' : String(value);
  }

  function normalizeModuleMeta(meta) {
    if (!meta || typeof meta !== 'object') return null;
    const id = clean(meta.id);
    if (!id) return null;
    return {
      id,
      title: clean(meta.title),
      path: clean(meta.path),
      kind: clean(meta.kind),
      load: clean(meta.load),
      version: clean(meta.version),
      build: clean(meta.build),
      versionOrigin: clean(meta.versionOrigin),
      source: clean(meta.source) || 'registry',
      updatedAt: meta.updatedAt || null
    };
  }

  function registerModuleMeta(meta) {
    const next = normalizeModuleMeta(meta);
    if (!next) return false;
    const prior = moduleRegistry.get(next.id) || {};
    moduleRegistry.set(next.id, {
      ...prior,
      ...next,
      version: next.version || prior.version || '',
      build: next.build || prior.build || '',
      title: next.title || prior.title || '',
      path: next.path || prior.path || '',
      kind: next.kind || prior.kind || '',
      load: next.load || prior.load || '',
      versionOrigin: next.versionOrigin || prior.versionOrigin || '',
      updatedAt: next.updatedAt || prior.updatedAt || null
    });
    renderModuleInventory();
    renderToolMeta();
    return true;
  }

  function normalizeToolMeta(def) {
    const id = def && typeof def.id === 'string' ? def.id : '';
    if (!id) return null;
    return {
      id,
      title: def && typeof def.title === 'string' ? def.title : '',
      tab: def && typeof def.tab === 'string' ? def.tab : '',
      build: def && def.build != null ? String(def.build) : '',
      version: def && def.version != null ? String(def.version) : '',
      updatedAt: new Date().toISOString()
    };
  }

  function registerToolMeta(def) {
    const meta = normalizeToolMeta(def);
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

  async function loadModuleRegistry() {
    registryError = null;
    try {
      const response = await fetch(REGISTRY_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const manifest = await response.json();
      const entries = Array.isArray(manifest && manifest.moduleRegistry) ? manifest.moduleRegistry : [];
      if (!entries.length) throw new Error('manifest.moduleRegistry is empty or unavailable');
      moduleRegistry.clear();
      for (const entry of entries) registerModuleMeta({ ...entry, source: 'manifest' });
      registryLoaded = true;
    } catch (error) {
      registryLoaded = false;
      registryError = error && error.message ? error.message : String(error);
    }
    renderModuleInventory();
    renderToolMeta();
    return registryLoaded;
  }

  function seedRegistryFromDom() {
    const containers = document.querySelectorAll('#kwWitchDock [data-tool-id]');
    for (const container of containers) {
      const id = container.getAttribute('data-tool-id');
      if (!id || toolRegistry.has(id)) continue;
      toolRegistry.set(id, { id, title: '', tab: '', build: '', version: '', updatedAt: null });
    }
  }

  function displayMetaForTool(id) {
    const runtime = toolRegistry.get(id) || null;
    const canonical = moduleRegistry.get(id) || null;
    const version = (runtime && runtime.version) || (canonical && canonical.version) || '';
    const build = (runtime && runtime.build) || (canonical && canonical.build) || '';
    return { version, build };
  }

  function metaLabel(id) {
    const meta = displayMetaForTool(id);
    if (!meta.version && !meta.build) return 'version unreported';
    const parts = [];
    if (meta.version) parts.push(`v${meta.version}`);
    if (meta.build && meta.build !== meta.version && meta.build !== `v${meta.version}`) parts.push(`build ${meta.build}`);
    return parts.join(' · ');
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
      line.textContent = `DEV · ${id} · ${metaLabel(id)}`;
      line.hidden = !enabled;
    }
  }

  function moduleLine(meta) {
    const parts = [meta.id];
    if (meta.version) parts.push(`v${meta.version}`);
    else parts.push('version unreported');
    if (meta.build && meta.build !== meta.version && meta.build !== `v${meta.version}`) parts.push(`build ${meta.build}`);
    if (meta.load) parts.push(meta.load);
    return parts.join(' · ');
  }

  function renderModuleInventory() {
    const details = document.querySelector(`#${ABOUT_ROW_ID} .kwWDDevModuleVersions`);
    if (!details) return;
    details.hidden = !enabled;
    const list = details.querySelector('.kwWDDevModuleList');
    if (!list) return;
    list.textContent = '';

    if (registryError) {
      const error = document.createElement('div');
      error.className = 'kwWDDevRegistryError';
      error.textContent = `Module registry unavailable: ${registryError}`;
      list.appendChild(error);
    }

    const entries = Array.from(moduleRegistry.values()).sort((a, b) => a.id.localeCompare(b.id));
    if (!entries.length && !registryError) {
      const empty = document.createElement('div');
      empty.textContent = registryLoaded ? 'No modules registered.' : 'Loading module registry…';
      list.appendChild(empty);
      return;
    }

    for (const meta of entries) {
      const line = document.createElement('div');
      line.className = 'kwWDDevModuleLine';
      line.textContent = moduleLine(meta);
      if (meta.path) line.title = meta.path;
      list.appendChild(line);
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
      hint.textContent = 'Shows canonical module versions, tool IDs/builds, and troubleshooting controls intended for development or recovery.';

      const details = document.createElement('details');
      details.className = 'kwWDDevModuleVersions';
      const summary = document.createElement('summary');
      summary.textContent = 'Module Versions';
      const list = document.createElement('div');
      list.className = 'kwWDDevModuleList';
      details.appendChild(summary);
      details.appendChild(list);

      row.appendChild(label);
      row.appendChild(hint);
      row.appendChild(details);
      body.appendChild(row);

      input.addEventListener('change', () => setEnabled(input.checked));
    }

    const input = row.querySelector('.kwWDDevModeInput');
    if (input) input.checked = enabled;
    renderModuleInventory();
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
    renderModuleInventory();
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

  function moduleRegistrySnapshot() {
    return Array.from(moduleRegistry.values()).map((item) => ({ ...item }));
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
    loadModuleRegistry();
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
    toolRegistry.clear();
    moduleRegistry.clear();
    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }
    return true;
  }

  if (UW[GLOBAL] && typeof UW[GLOBAL].dispose === 'function') {
    try { UW[GLOBAL].dispose(); } catch (_) {}
  }

  UW[GLOBAL] = {
    build: BUILD,
    version: '0.2.0',
    setEnabled,
    toggle,
    onChange,
    registerToolMeta,
    registerModuleMeta,
    registrySnapshot,
    moduleRegistrySnapshot,
    reloadModuleRegistry: loadModuleRegistry,
    initialize,
    dispose,
    get enabled() { return enabled; },
    get registryLoaded() { return registryLoaded; },
    get registryError() { return registryError; }
  };

  initialize();
})();

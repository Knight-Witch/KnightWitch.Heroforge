(function () {
  "use strict";

  const FEATURE_ID = "witch-dock-core";
  const VERSION = "2.1.0";
  const BUILD = "2.1.0-title-version-render";
  const DEFAULTS = Object.freeze({
    x: null, y: null, width: 380, height: 520,
    minimized: false, closed: false,
    lastOpenWidth: 380, lastOpenHeight: 520,
    lastOpenX: null, lastOpenY: null, lastOpenAnchored: true,
    activeTab: null, compactX: 16, compactY: null, firstRun: false
  });
  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  let runtime = null;

  function requireApi(name, methods) {
    const api = UW[name];
    if (!api || typeof api !== "object") throw new Error(`Witch Dock Core requires ${name}.`);
    for (const method of methods || []) {
      if (typeof api[method] !== "function") throw new Error(`Witch Dock Core requires ${name}.${method}().`);
    }
    return api;
  }

  function requireHost(host) {
    if (!host || typeof host !== "object") throw new Error("Witch Dock Core requires bounded host capabilities.");
    if (!host.storage || typeof host.storage.get !== "function" || typeof host.storage.set !== "function") throw new Error("Witch Dock Core requires host.storage.");
    if (!host.pageStorage || typeof host.pageStorage.getItem !== "function" || typeof host.pageStorage.setItem !== "function") throw new Error("Witch Dock Core requires host.pageStorage.");
    if (!host.styles || typeof host.styles.add !== "function") throw new Error("Witch Dock Core requires host.styles.add().");
    if (!host.clipboard || typeof host.clipboard.writeText !== "function") throw new Error("Witch Dock Core requires host.clipboard.writeText().");
    if (typeof host.download !== "function") throw new Error("Witch Dock Core requires host.download().");
    if (typeof host.scriptMeta !== "function") throw new Error("Witch Dock Core requires host.scriptMeta().");
    return host;
  }

  function createState(registry) {
    return {
      uiReady: false,
      root: null, header: null, tabsContainer: null, tabsBar: null, tabsBarRight: null,
      body: null, footer: null, undoBtn: null, redoBtn: null,
      resizeCorner: null, resizeBottom: null, compact: null, compactExpandBtn: null,
      minimizeBtn: null, closeBtn: null,
      tabs: registry.tabs, toolsById: registry.toolsById, pending: registry.pending,
      activeTab: null, isResizing: false, resizeStart: null, minWidth: 260,
      draggingTool: null, draggingSectionId: null, draggingSectionTool: null,
      aboutBtn: null, aboutOverlay: null, aboutModal: null,
      disclaimerBtn: null, disclaimerOverlay: null, disclaimerModal: null,
      tabsLeft: null, tabsShade: null, tabsCue: null, tabsRight: null,
      tabsOverflowPrev: false, tabsCueHideTimer: null, updateTabsCue: null,
      boneInit: false, status: "initializing"
    };
  }

  function formatDownloadError(error) {
    if (error == null) return "unknown error";
    if (typeof error === "string" || typeof error === "number" || typeof error === "boolean") return String(error);
    if (typeof error.message === "string" && error.message) return error.message;
    if (typeof error.error === "string" && error.error) return error.error;
    try {
      const text = JSON.stringify(error);
      return text && text !== "{}" ? text : String(error);
    } catch (_) {
      return String(error);
    }
  }

  function createDownloadBlob(host) {
    return function downloadBlob(blob, filename) {
      if (!(blob instanceof Blob)) return Promise.reject(new Error("Witch Dock download requires a Blob."));
      const name = String(filename || "download.bin");
      const objectUrl = URL.createObjectURL(blob);
      return Promise.resolve()
        .then(() => host.download(objectUrl, name, { saveAs: false }))
        .then(() => ({ ok: true, method: "GM_download", filename: name }))
        .catch((error) => { throw new Error(`Witch Dock download failed: ${formatDownloadError(error)}`); })
        .finally(() => { try { URL.revokeObjectURL(objectUrl); } catch (_) {} });
    };
  }

  function start(options) {
    if (runtime && runtime.started) return getState();

    const opts = options && typeof options === "object" ? options : {};
    const host = requireHost(opts.host);
    const preferences = requireApi("KWWitchDockPreferences", ["configure", "load", "save"]);
    const registry = requireApi("KWWitchDockRegistry", ["getState"]);
    const shell = requireApi("KWWitchDockShell", ["createRoot", "createCompact"]);
    const application = requireApi("KWWitchDockApplication", [
      "configure","el","clamp","computeMinDockHeightCollapsed","getViewport",
      "snapshotCurrentDockPositionToPrefs","applyPositionAndSize","applyMinimizedState",
      "showClosedCompact","computeMinDockWidthForActiveTab","enforceSizeConstraints",
      "setActiveTab","mountTool","registerTool"
    ]);
    const interactions = requireApi("KWWitchDockInteractions", [
      "configure","startDockDrag","startResizeCorner","startResizeBottom","startCompactDrag",
      "toggleMinimize","closeDock","expandFromCompact","installDockHotkey"
    ]);
    const history = requireApi("KWWitchDockHistory", [
      "configure","updateDockUndoRedoButtons","triggerUndo","triggerRedo","hookUndoQueueForDockButtons"
    ]);
    const modals = requireApi("KWWitchDockModals", ["configure","ensureAbout","openAbout","openDisclaimer"]);
    const boneHud = requireApi("KWWitchDockBoneHUD", ["configure","init"]);
    const assets = requireApi("KWWitchDockAssets", ["getState"]);

    const styleText = String(opts.styleText || "");
    if (!styleText.includes("#kwWitchDock") || !styleText.includes("#kwWDCompactIcon")) {
      throw new Error("Witch Dock Core refused invalid core stylesheet.");
    }
    if (!assets.compactEmblemUrl || !String(assets.compactEmblemUrl).startsWith("data:image/png;base64,")) {
      throw new Error("Witch Dock Core requires the known-good compact emblem asset.");
    }

    preferences.configure({ storage: host.storage, pageStorage: host.pageStorage });

    const state = createState(registry);
    const prefs = preferences.load();
    const savePrefs = (value) => preferences.save(value);
    const scriptMeta = host.scriptMeta();

    history.configure({ state });
    application.configure({ state, prefs, defaults: DEFAULTS, savePrefs, preferences, history });
    interactions.configure({
      state, prefs, defaults: DEFAULTS, savePrefs,
      snapshotCurrentDockPositionToPrefs: application.snapshotCurrentDockPositionToPrefs,
      getViewport: application.getViewport,
      enforceSizeConstraints: application.enforceSizeConstraints,
      applyMinimizedState: application.applyMinimizedState,
      showClosedCompact: application.showClosedCompact,
      clamp: application.clamp,
      computeMinDockHeightCollapsed: application.computeMinDockHeightCollapsed
    });
    modals.configure({
      scriptMeta,
      githubRepoUrl: String(opts.githubRepoUrl || ""),
      kofiUrl: String(opts.kofiUrl || "")
    });
    boneHud.configure({ scriptMeta, copyText: (text) => host.clipboard.writeText(text) });
    host.styles.add(styleText);

    function updateTabsCue() {
      if (!state.tabsLeft || !state.tabsCue || !state.tabsShade) return;
      const overflow = state.tabsLeft.scrollWidth > state.tabsLeft.clientWidth + 2;
      state.tabsShade.style.right = state.tabsRight ? (state.tabsRight.offsetWidth + 7) + "px" : "0px";
      state.tabsShade.classList.toggle("kwShow", overflow);

      const prev = !!state.tabsOverflowPrev;
      state.tabsOverflowPrev = overflow;
      if (overflow && !prev) {
        state.tabsCue.classList.add("kwShow");
        state.tabsCue.classList.remove("kwPulse");
        void state.tabsCue.offsetWidth;
        state.tabsCue.classList.add("kwPulse");
        clearTimeout(state.tabsCueHideTimer);
        state.tabsCueHideTimer = setTimeout(() => {
          state.tabsCue.classList.remove("kwShow");
          state.tabsCue.classList.remove("kwPulse");
        }, 1600);
      }
      if (!overflow) {
        state.tabsCue.classList.remove("kwShow");
        state.tabsCue.classList.remove("kwPulse");
        clearTimeout(state.tabsCueHideTimer);
        state.tabsCueHideTimer = null;
      }
    }

    function buildUI() {
      if (state.uiReady) return state.root;
      state.uiReady = true;

      Object.assign(state, shell.createRoot({
        el: application.el,
        handlers: {
          startDockDrag: interactions.startDockDrag,
          ensureAboutModal: modals.ensureAbout,
          openAboutModal: modals.openAbout,
          toggleMinimize: interactions.toggleMinimize,
          closeDock: interactions.closeDock,
          triggerUndo: history.triggerUndo,
          triggerRedo: history.triggerRedo,
          startResizeBottom: interactions.startResizeBottom,
          startResizeCorner: interactions.startResizeCorner
        }
      }));

      const title = state.root && state.root.querySelector("#kwWDTitle");
      const titleVersion = state.root && state.root.querySelector("#kwWDTitleVersion");
      if (title && opts.displayName) {
        const displayName = String(opts.displayName);
        title.textContent = displayName;
        if (opts.channel) title.setAttribute("data-kw-channel", String(opts.channel));
        if (opts.sourceLabel) title.title = String(opts.sourceLabel);
        const metaVersion = scriptMeta && scriptMeta.version ? String(scriptMeta.version) : "";
        const displayAlreadyHasVersion = !!(metaVersion && displayName.includes(metaVersion));
        if (titleVersion) {
          titleVersion.textContent = metaVersion && !displayAlreadyHasVersion ? `v${metaVersion}` : "";
          titleVersion.hidden = !titleVersion.textContent;
        }
      }

      boneHud.init(state);
      document.body.appendChild(state.root);

      state.tabsLeft = state.root.querySelector("#kwWDTabsLeft");
      state.tabsShade = state.root.querySelector("#kwWDTabsShade");
      state.tabsCue = state.root.querySelector("#kwWDTabsCue");
      state.tabsRight = state.root.querySelector("#kwWDTabsRight");
      state.updateTabsCue = updateTabsCue;

      state.tabsLeft.addEventListener("wheel", (e) => {
        if (state.tabsLeft.scrollWidth <= state.tabsLeft.clientWidth + 2) return;
        const dx = e.deltaX || 0;
        const dy = e.deltaY || 0;
        state.tabsLeft.scrollLeft += Math.abs(dx) > Math.abs(dy) ? dx : dy;
        e.preventDefault();
      }, { passive: false });
      state.tabsLeft.addEventListener("scroll", updateTabsCue, { passive: true });
      window.addEventListener("resize", updateTabsCue);
      setTimeout(updateTabsCue, 0);
      setTimeout(updateTabsCue, 350);

      state.compact = shell.createCompact({
        el: application.el,
        emblemUrl: assets.compactEmblemUrl,
        onPointerDown: interactions.startCompactDrag
      });
      state.compactExpandBtn = null;
      document.body.appendChild(state.compact);

      prefs.width = prefs.width || DEFAULTS.width;
      prefs.height = prefs.height || DEFAULTS.height;
      application.applyPositionAndSize();
      state.activeTab = prefs.activeTab || null;

      if (prefs.minimized) {
        prefs.lastOpenWidth = prefs.lastOpenWidth || prefs.width;
        prefs.lastOpenHeight = prefs.lastOpenHeight || prefs.height;
        savePrefs(prefs);
      }

      application.applyMinimizedState();
      application.showClosedCompact();

      for (const def of state.pending.splice(0)) application.mountTool(def);

      if (state.tabs.size && (prefs.activeTab == null || !state.tabs.has(prefs.activeTab))) {
        const first = state.tabs.keys().next().value;
        if (first) application.setActiveTab(first);
      } else if (prefs.activeTab && state.tabs.has(prefs.activeTab)) {
        application.setActiveTab(prefs.activeTab);
      }

      state.minWidth = application.computeMinDockWidthForActiveTab();
      application.enforceSizeConstraints();

      window.addEventListener("resize", () => {
        application.showClosedCompact();
        application.enforceSizeConstraints();
      });

      return state.root;
    }

    UW.WitchDock = UW.WitchDock || {};
    UW.WitchDock.registerTool = application.registerTool;
    UW.WitchDock.ensureDock = buildUI;
    UW.WitchDock.downloadBlob = createDownloadBlob(host);

    buildUI();
    interactions.installDockHotkey();

    state.status = "running";
    runtime = {
      started: true, state, prefs, host,
      channel: String(opts.channel || ""),
      displayName: String(opts.displayName || "WITCH DOCK"),
      payloadRef: String(opts.payloadRef || ""),
      manifestUrl: String(opts.manifestUrl || "")
    };
    return getState();
  }

  function getState() {
    if (!runtime) return { featureId: FEATURE_ID, version: VERSION, build: BUILD, started: false, status: "idle" };
    const state = runtime.state;
    return {
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      started: !!runtime.started,
      status: state.status,
      channel: runtime.channel,
      payloadRef: runtime.payloadRef,
      manifestUrl: runtime.manifestUrl,
      uiReady: !!state.uiReady,
      activeTab: state.activeTab,
      tabCount: state.tabs.size,
      toolCount: state.toolsById.size,
      pendingCount: state.pending.length,
      rootConnected: !!(state.root && state.root.isConnected),
      compactConnected: !!(state.compact && state.compact.isConnected)
    };
  }

  UW.KWWitchDockCore = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    start,
    getState
  });
})();

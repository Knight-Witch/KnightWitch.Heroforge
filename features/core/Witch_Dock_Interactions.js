(function () {
  "use strict";

  const FEATURE_ID = "witch-dock-interactions";
  const VERSION = "0.1.0";
  const BUILD = "0.1.0-minimize-compact-lifecycle";

  let CONTEXT = null;
  const STATE = {
    configured: false,
    toggleMinimizeCalls: 0,
    closeDockCalls: 0,
    expandFromCompactCalls: 0,
    lastError: null
  };

  function requireFunction(options, name) {
    const fn = options && options[name];
    if (typeof fn !== "function") throw new Error(`Witch Dock Interactions requires ${name}().`);
    return fn;
  }

  function configure(options) {
    const opts = options && typeof options === "object" ? options : {};
    if (!opts.state || typeof opts.state !== "object") throw new Error("Witch Dock Interactions requires state.");
    if (!opts.prefs || typeof opts.prefs !== "object") throw new Error("Witch Dock Interactions requires prefs.");
    if (!opts.defaults || typeof opts.defaults !== "object") throw new Error("Witch Dock Interactions requires defaults.");

    CONTEXT = {
      state: opts.state,
      prefs: opts.prefs,
      defaults: opts.defaults,
      savePrefs: requireFunction(opts, "savePrefs"),
      snapshotCurrentDockPositionToPrefs: requireFunction(opts, "snapshotCurrentDockPositionToPrefs"),
      getViewport: requireFunction(opts, "getViewport"),
      enforceSizeConstraints: requireFunction(opts, "enforceSizeConstraints"),
      applyMinimizedState: requireFunction(opts, "applyMinimizedState"),
      showClosedCompact: requireFunction(opts, "showClosedCompact")
    };

    STATE.configured = true;
    STATE.lastError = null;
    return true;
  }

  function requireContext() {
    if (!CONTEXT) {
      STATE.lastError = "not configured";
      throw new Error("Witch Dock Interactions is not configured.");
    }
    return CONTEXT;
  }

  function toggleMinimize() {
    const ctx = requireContext();
    const { prefs, defaults } = ctx;
    STATE.toggleMinimizeCalls += 1;

    if (!prefs.minimized) ctx.snapshotCurrentDockPositionToPrefs();

    prefs.minimized = !prefs.minimized;

    if (!prefs.minimized) {
      prefs.width = prefs.lastOpenWidth || prefs.width || defaults.width;
      prefs.height = prefs.lastOpenHeight || prefs.height || defaults.height;
    } else {
      prefs.lastOpenWidth = prefs.width;
      prefs.lastOpenHeight = prefs.height;
    }

    ctx.savePrefs(prefs);
    ctx.enforceSizeConstraints();
    ctx.applyMinimizedState();
    STATE.lastError = null;
  }

  function closeDock() {
    const ctx = requireContext();
    const { prefs } = ctx;
    STATE.closeDockCalls += 1;

    ctx.snapshotCurrentDockPositionToPrefs();

    prefs.closed = true;
    prefs.minimized = true;

    const { vh } = ctx.getViewport();
    if (prefs.compactX == null) prefs.compactX = 16;
    if (prefs.compactY == null) prefs.compactY = vh - 70;

    ctx.savePrefs(prefs);
    ctx.applyMinimizedState();
    ctx.showClosedCompact();
    STATE.lastError = null;
  }

  function expandFromCompact() {
    const ctx = requireContext();
    const { state, prefs, defaults } = ctx;
    STATE.expandFromCompactCalls += 1;

    prefs.closed = false;
    prefs.minimized = false;

    prefs.width = prefs.lastOpenWidth || prefs.width || defaults.width;
    prefs.height = prefs.lastOpenHeight || prefs.height || defaults.height;

    if (prefs.lastOpenAnchored) {
      prefs.x = null;
      prefs.y = null;
    } else {
      prefs.x = prefs.lastOpenX != null ? prefs.lastOpenX : prefs.x;
      prefs.y = prefs.lastOpenY != null ? prefs.lastOpenY : prefs.y;
    }

    ctx.savePrefs(prefs);

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

    ctx.showClosedCompact();
    ctx.enforceSizeConstraints();
    ctx.applyMinimizedState();
    STATE.lastError = null;
  }

  function getState() {
    return {
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      configured: STATE.configured,
      toggleMinimizeCalls: STATE.toggleMinimizeCalls,
      closeDockCalls: STATE.closeDockCalls,
      expandFromCompactCalls: STATE.expandFromCompactCalls,
      lastError: STATE.lastError
    };
  }

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  UW.KWWitchDockInteractions = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    configure,
    toggleMinimize,
    closeDock,
    expandFromCompact,
    getState
  });
})();

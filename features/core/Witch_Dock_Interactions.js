(function () {
  "use strict";

  const FEATURE_ID = "witch-dock-interactions";
  const VERSION = "0.3.0";
  const BUILD = "0.3.0-dock-resize";

  let CONTEXT = null;
  const STATE = {
    configured: false,
    toggleMinimizeCalls: 0,
    closeDockCalls: 0,
    expandFromCompactCalls: 0,
    startDockDragCalls: 0,
    dockDragMoveCalls: 0,
    dockDragEndCalls: 0,
    startResizeCornerCalls: 0,
    resizeCornerMoveCalls: 0,
    resizeCornerEndCalls: 0,
    startResizeBottomCalls: 0,
    resizeBottomMoveCalls: 0,
    resizeBottomEndCalls: 0,
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
      showClosedCompact: requireFunction(opts, "showClosedCompact"),
      clamp: requireFunction(opts, "clamp"),
      computeMinDockHeightCollapsed: requireFunction(opts, "computeMinDockHeightCollapsed")
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

  function startDockDrag(e) {
    const ctx = requireContext();
    const { state, prefs } = ctx;
    STATE.startDockDragCalls += 1;

    if (!state.root || prefs.closed) return;
    const target = e && e.target;
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
    ctx.savePrefs(prefs);

    function move(ev) {
      STATE.dockDragMoveCalls += 1;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      const { vw, vh } = ctx.getViewport();
      const w = state.root.getBoundingClientRect().width;
      const h = state.root.getBoundingClientRect().height;

      const left = ctx.clamp(startLeft + dx, 0, Math.max(0, vw - w));
      const top = ctx.clamp(startTop + dy, 0, Math.max(0, vh - h));

      state.root.style.left = `${left}px`;
      state.root.style.top = `${top}px`;

      prefs.x = Math.round(left);
      prefs.y = Math.round(top);
      ctx.savePrefs(prefs);
    }

    function up() {
      STATE.dockDragEndCalls += 1;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    STATE.lastError = null;
  }

  function startResizeCorner(e) {
    const ctx = requireContext();
    const { state, prefs } = ctx;
    STATE.startResizeCornerCalls += 1;

    if (!state.root || prefs.closed || prefs.minimized) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = state.root.getBoundingClientRect();
    state.isResizing = true;
    state.resizeStart = { x: e.clientX, y: e.clientY, w: rect.width, h: rect.height, mode: "corner" };

    function move(ev) {
      if (!state.isResizing || !state.resizeStart) return;
      STATE.resizeCornerMoveCalls += 1;

      const dx = ev.clientX - state.resizeStart.x;
      const dy = ev.clientY - state.resizeStart.y;

      const minW = Math.max(260, state.minWidth || 260);
      const minH = ctx.computeMinDockHeightCollapsed();

      const { vw, vh } = ctx.getViewport();
      const maxW = Math.max(minW, vw - 8);
      const maxH = Math.max(minH, vh - 8);

      const newW = ctx.clamp(state.resizeStart.w + dx, minW, maxW);
      const newH = ctx.clamp(state.resizeStart.h + dy, minH, maxH);

      state.root.style.width = `${newW}px`;
      state.root.style.height = `${newH}px`;

      prefs.width = Math.round(newW);
      prefs.height = Math.round(newH);
      prefs.lastOpenWidth = prefs.width;
      prefs.lastOpenHeight = prefs.height;
      ctx.savePrefs(prefs);
    }

    function up() {
      STATE.resizeCornerEndCalls += 1;
      state.isResizing = false;
      state.resizeStart = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      ctx.enforceSizeConstraints();
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    STATE.lastError = null;
  }

  function startResizeBottom(e) {
    const ctx = requireContext();
    const { state, prefs } = ctx;
    STATE.startResizeBottomCalls += 1;

    if (!state.root || prefs.closed || prefs.minimized) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = state.root.getBoundingClientRect();
    state.isResizing = true;
    state.resizeStart = { x: e.clientX, y: e.clientY, w: rect.width, h: rect.height, mode: "bottom" };

    function move(ev) {
      if (!state.isResizing || !state.resizeStart) return;
      STATE.resizeBottomMoveCalls += 1;

      const dy = ev.clientY - state.resizeStart.y;
      const minH = ctx.computeMinDockHeightCollapsed();

      const { vh } = ctx.getViewport();
      const maxH = Math.max(minH, vh - 8);

      const newH = ctx.clamp(state.resizeStart.h + dy, minH, maxH);

      state.root.style.height = `${newH}px`;

      prefs.height = Math.round(newH);
      prefs.lastOpenHeight = prefs.height;
      ctx.savePrefs(prefs);
    }

    function up() {
      STATE.resizeBottomEndCalls += 1;
      state.isResizing = false;
      state.resizeStart = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      ctx.enforceSizeConstraints();
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    STATE.lastError = null;
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
      startDockDragCalls: STATE.startDockDragCalls,
      dockDragMoveCalls: STATE.dockDragMoveCalls,
      dockDragEndCalls: STATE.dockDragEndCalls,
      startResizeCornerCalls: STATE.startResizeCornerCalls,
      resizeCornerMoveCalls: STATE.resizeCornerMoveCalls,
      resizeCornerEndCalls: STATE.resizeCornerEndCalls,
      startResizeBottomCalls: STATE.startResizeBottomCalls,
      resizeBottomMoveCalls: STATE.resizeBottomMoveCalls,
      resizeBottomEndCalls: STATE.resizeBottomEndCalls,
      lastError: STATE.lastError
    };
  }

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  UW.KWWitchDockInteractions = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    configure,
    startDockDrag,
    startResizeCorner,
    startResizeBottom,
    toggleMinimize,
    closeDock,
    expandFromCompact,
    getState
  });
})();

(function () {
  "use strict";

  const FEATURE_ID = "witch-dock-history";
  const VERSION = "0.1.0";
  const BUILD = "0.1.0-undo-redo-owner";
  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

  let CONTEXT = null;
  const STATE = {
    configured: false,
    updateCalls: 0,
    triggerUndoCalls: 0,
    triggerRedoCalls: 0,
    hookCalls: 0,
    wrappedMethodCount: 0,
    fallbackLoadCalls: 0,
    lastError: null
  };

  function configure(options) {
    const opts = options && typeof options === "object" ? options : {};
    if (!opts.state || typeof opts.state !== "object") throw new Error("Witch Dock History requires state.");
    CONTEXT = { state: opts.state };
    STATE.configured = true;
    STATE.lastError = null;
    return true;
  }

  function requireContext() {
    if (!CONTEXT) {
      STATE.lastError = "not configured";
      throw new Error("Witch Dock History is not configured.");
    }
    return CONTEXT;
  }

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
      STATE.fallbackLoadCalls += 1;
      return true;
    } catch (e) {
      STATE.lastError = String(e && e.message || e);
      return false;
    }
  }

  function updateDockUndoRedoButtons() {
    const { state } = requireContext();
    STATE.updateCalls += 1;
    if (!state.uiReady || !state.undoBtn || !state.redoBtn) return;
    const u = getUndoQueue();
    const canUndo = !!u && u.currentIndex > 0;
    const canRedo = !!u && u.currentIndex < u.queue.length - 1;
    state.undoBtn.disabled = !canUndo;
    state.redoBtn.disabled = !canRedo;
    STATE.lastError = null;
  }

  function triggerUndo() {
    STATE.triggerUndoCalls += 1;
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
    STATE.triggerRedoCalls += 1;
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
    requireContext();
    STATE.hookCalls += 1;
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
      STATE.wrappedMethodCount += 1;
    }

    wrap(u, "push");
    wrap(u, "enqueue");
    wrap(u, "add");
    wrap(u, "record");
    wrap(u, "undo");
    wrap(u, "redo");
    STATE.lastError = null;
  }

  function getState() {
    const u = getUndoQueue();
    return {
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      configured: STATE.configured,
      queueAvailable: !!u,
      queueLength: u ? u.queue.length : null,
      currentIndex: u ? u.currentIndex : null,
      canUndo: !!u && u.currentIndex > 0,
      canRedo: !!u && u.currentIndex < u.queue.length - 1,
      updateCalls: STATE.updateCalls,
      triggerUndoCalls: STATE.triggerUndoCalls,
      triggerRedoCalls: STATE.triggerRedoCalls,
      hookCalls: STATE.hookCalls,
      wrappedMethodCount: STATE.wrappedMethodCount,
      fallbackLoadCalls: STATE.fallbackLoadCalls,
      lastError: STATE.lastError
    };
  }

  UW.KWWitchDockHistory = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    configure,
    updateDockUndoRedoButtons,
    triggerUndo,
    triggerRedo,
    hookUndoQueueForDockButtons,
    getState
  });
})();

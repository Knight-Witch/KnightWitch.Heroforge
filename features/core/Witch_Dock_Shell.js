(function () {
  "use strict";

  const FEATURE_ID = "witch-dock-shell";
  const VERSION = "0.1.0";
  const BUILD = "0.1.0-main-root-dom";

  const STATE = {
    createCalls: 0,
    lastError: null
  };

  function createRoot(options) {
    const opts = options && typeof options === "object" ? options : {};
    const el = opts.el;
    const handlers = opts.handlers && typeof opts.handlers === "object" ? opts.handlers : {};

    if (typeof el !== "function") {
      STATE.lastError = "missing el helper";
      throw new Error("Witch Dock Shell requires the legacy el helper.");
    }

    for (const name of [
      "startDockDrag",
      "openDisclaimerModal",
      "ensureAboutModal",
      "openAboutModal",
      "toggleMinimize",
      "closeDock",
      "triggerUndo",
      "triggerRedo",
      "startResizeBottom",
      "startResizeCorner"
    ]) {
      if (typeof handlers[name] !== "function") {
        STATE.lastError = `missing handler ${name}`;
        throw new Error(`Witch Dock Shell requires handler: ${name}`);
      }
    }

    STATE.createCalls += 1;
    STATE.lastError = null;

    const root = el("div", { id: "kwWitchDock" }, [
      el("div", { id: "kwWDHeader", onpointerdown: handlers.startDockDrag }, [
        el("div", { id: "kwWDTitleWrap" }, [
          el("div", { id: "kwWDTitle", text: "WITCH DOCK" }),
          el("button", {
            id: "kwWDDisclaimerBtn",
            type: "button",
            title: "Disclaimer",
            text: "Disclaimer",
            onclick: () => { handlers.openDisclaimerModal(); }
          })
        ]),
        el("div", { id: "kwWDControls" }, [
          el("button", {
            id: "kwWDAboutBtn",
            class: "kwWDBtn",
            type: "button",
            text: "?",
            title: "About",
            onclick: () => { handlers.ensureAboutModal(); handlers.openAboutModal(); }
          }),
          el("button", {
            class: "kwWDBtn",
            type: "button",
            text: "–",
            title: "Minimize / Expand",
            onclick: handlers.toggleMinimize
          }),
          el("button", {
            class: "kwWDBtn",
            type: "button",
            text: "×",
            title: "Collapse to icon",
            onclick: handlers.closeDock
          })
        ])
      ]),
      el("div", { id: "kwWDTabs" }, [
        el("div", { id: "kwWDTabsLeft" }),
        el("div", { id: "kwWDTabsShade" }),
        el("div", { id: "kwWDTabsRight" }, [
          el("div", {
            id: "kwWDTabsCue",
            title: "Scroll tabs",
            html: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
          }),
          el("button", {
            id: "kwWDUndoBtn",
            class: "kwWDActionBtn",
            type: "button",
            title: "Undo (Ctrl+Z)",
            text: "↶",
            onclick: handlers.triggerUndo
          }),
          el("button", {
            id: "kwWDRedoBtn",
            class: "kwWDActionBtn",
            type: "button",
            title: "Redo (Ctrl+Shift+Z)",
            text: "↷",
            onclick: handlers.triggerRedo
          })
        ])
      ]),
      el("div", { id: "kwWDBody" }),
      el("div", { id: "kwWDFooter" }),
      el("div", { id: "kwWDResizeHandleBottom", onpointerdown: handlers.startResizeBottom }),
      el("div", { id: "kwWDResizeHandleCorner", onpointerdown: handlers.startResizeCorner })
    ]);

    return {
      root,
      header: root.querySelector("#kwWDHeader"),
      aboutBtn: root.querySelector("#kwWDAboutBtn"),
      tabsContainer: root.querySelector("#kwWDTabs"),
      tabsBar: root.querySelector("#kwWDTabsLeft"),
      tabsBarRight: root.querySelector("#kwWDTabsRight"),
      footer: root.querySelector("#kwWDFooter"),
      undoBtn: root.querySelector("#kwWDUndoBtn"),
      redoBtn: root.querySelector("#kwWDRedoBtn"),
      body: root.querySelector("#kwWDBody"),
      resizeBottom: root.querySelector("#kwWDResizeHandleBottom"),
      resizeCorner: root.querySelector("#kwWDResizeHandleCorner"),
      minimizeBtn: root.querySelector("#kwWDControls .kwWDBtn:nth-child(2)"),
      closeBtn: root.querySelector("#kwWDControls .kwWDBtn:nth-child(3)")
    };
  }

  function getState() {
    return {
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      createCalls: STATE.createCalls,
      lastError: STATE.lastError
    };
  }

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  UW.KWWitchDockShell = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    createRoot,
    getState
  });
})();

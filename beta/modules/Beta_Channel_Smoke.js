(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const host = UW.KWWitchDockBetaTester;
  if (!host || typeof host.registerModule !== "function") {
    throw new Error("Witch Dock Beta Tester host is unavailable.");
  }

  const ID = "beta-channel-smoke";
  const VERSION = "0.1.0";
  const BUILD = "0.1.0-public-beta-smoke";
  const state = {
    active: false,
    activationCount: 0,
    deactivationCount: 0,
    activatedAt: null,
    deactivatedAt: null,
    smokeMarks: 0
  };

  function nowIso() {
    return new Date().toISOString();
  }

  function activate() {
    state.active = true;
    state.activationCount += 1;
    state.activatedAt = nowIso();
    return true;
  }

  function deactivate() {
    state.active = false;
    state.deactivationCount += 1;
    state.deactivatedAt = nowIso();
    return true;
  }

  function render(container) {
    const note = document.createElement("div");
    note.style.fontSize = "11px";
    note.style.lineHeight = "1.4";
    note.textContent =
      "Beta module loaded successfully. Toggle this module OFF and ON to verify live reversible lifecycle.";
    container.appendChild(note);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Mark Smoke Check";
    button.style.marginTop = "7px";
    button.style.padding = "5px 8px";
    button.style.borderRadius = "6px";
    button.style.border = "1px solid rgba(255,255,255,.15)";
    button.style.background = "rgba(255,255,255,.07)";
    button.style.color = "inherit";
    button.style.cursor = "pointer";

    const result = document.createElement("span");
    result.style.marginLeft = "7px";
    result.style.fontSize = "10px";
    result.style.opacity = ".72";

    function update() {
      result.textContent = state.smokeMarks
        ? "Smoke marks: " + state.smokeMarks
        : "Not marked yet";
    }

    button.addEventListener("click", function () {
      state.smokeMarks += 1;
      update();
    });

    update();
    container.append(button, result);
  }

  function getState() {
    return {
      active: state.active,
      activationCount: state.activationCount,
      deactivationCount: state.deactivationCount,
      activatedAt: state.activatedAt,
      deactivatedAt: state.deactivatedAt,
      smokeMarks: state.smokeMarks
    };
  }

  function dispose() {
    state.active = false;
    return true;
  }

  host.registerModule({
    id: ID,
    version: VERSION,
    build: BUILD,
    activate,
    deactivate,
    render,
    getState,
    dispose
  });
})();

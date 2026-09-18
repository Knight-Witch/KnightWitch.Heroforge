(function () {
  "use strict";

  const FEATURE_ID = "witch-dock-registry";
  const VERSION = "0.1.0";
  const BUILD = "0.1.0-tab-tool-state-containers";

  const tabs = new Map();
  const toolsById = new Map();
  const pending = [];

  function getState() {
    return {
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      tabCount: tabs.size,
      toolCount: toolsById.size,
      pendingCount: pending.length,
      tabNames: Array.from(tabs.keys()),
      toolIds: Array.from(toolsById.keys())
    };
  }

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  UW.KWWitchDockRegistry = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    tabs,
    toolsById,
    pending,
    getState
  });
})();

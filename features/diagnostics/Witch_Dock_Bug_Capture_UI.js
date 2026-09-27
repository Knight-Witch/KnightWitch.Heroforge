(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const FEATURE_ID = "witch-dock-bug-capture-ui";
  const VERSION = "0.1.0";
  const BUILD = "0.1.0-general-capture-ui";
  const TOOL_ID = "bug-capture";

  function diagnostics() {
    return UW.KWWitchDockDiagnostics || null;
  }

  function injectStyle() {
    const id = "kw-bug-capture-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent =
      ".kwbug{color:#e8e8e8;font:12px/1.3 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;}" +
      ".kwbug .kwbug-card{display:flex;flex-direction:column;gap:8px;padding:10px;border:1px solid rgba(255,255,255,.10);border-radius:6px;background:rgba(255,255,255,.035);}" +
      ".kwbug .kwbug-title{font-weight:800;font-size:12px;color:rgba(255,255,255,.92);}" +
      ".kwbug .kwbug-desc{font-size:11px;line-height:1.35;color:rgba(255,255,255,.68);}" +
      ".kwbug .kwbug-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}" +
      ".kwbug .kwbug-btn{background:rgba(255,255,255,.10);color:#e8e8e8;border:1px solid rgba(255,255,255,.14);border-radius:7px;padding:7px 10px;cursor:pointer;font-weight:750;}" +
      ".kwbug .kwbug-btn:hover{background:rgba(255,255,255,.16);}" +
      ".kwbug .kwbug-btn:disabled{opacity:.45;cursor:not-allowed;}" +
      ".kwbug .kwbug-status{font-size:11px;line-height:1.35;color:rgba(255,255,255,.72);word-break:break-word;}" +
      ".kwbug .kwbug-status[data-error='1']{color:#ffb3b3;}" +
      ".kwbug .kwbug-meta{font-size:10px;line-height:1.3;color:rgba(255,255,255,.52);font-variant-numeric:tabular-nums;}";
    document.head.appendChild(style);
  }

  function renderTool(container, api) {
    injectStyle();
    const root = document.createElement("div");
    root.className = "kwbug";
    container.appendChild(root);

    const section = api.ui.createSection({
      id: "bug-capture",
      title: "Bug Capture",
      defaultCollapsed: false
    });

    const card = document.createElement("div");
    card.className = "kwbug-card";

    const title = document.createElement("div");
    title.className = "kwbug-title";
    title.textContent = "HeroForge / Witch Dock Diagnostic";

    const desc = document.createElement("div");
    desc.className = "kwbug-desc";
    desc.textContent = "Captures the current diagnostic state to a local JSON file. Nothing is uploaded automatically.";

    const actions = document.createElement("div");
    actions.className = "kwbug-actions";

    const captureButton = document.createElement("button");
    captureButton.type = "button";
    captureButton.className = "kwbug-btn";
    captureButton.textContent = "Capture & Download";

    const status = document.createElement("div");
    status.className = "kwbug-status";
    status.textContent = "Ready.";

    const meta = document.createElement("div");
    meta.className = "kwbug-meta";

    actions.appendChild(captureButton);
    card.append(title, desc, actions, status, meta);
    section.body.appendChild(card);
    root.appendChild(section.root);

    function update(state) {
      const svc = diagnostics();
      if (!svc || typeof svc.getState !== "function") {
        captureButton.disabled = true;
        status.dataset.error = "1";
        status.textContent = "Diagnostic service unavailable.";
        meta.textContent = "Bug Capture UI v" + VERSION;
        return;
      }
      const next = state || svc.getState();
      captureButton.disabled = !!next.busy;
      if (next.busy) {
        status.dataset.error = "0";
        status.textContent = "Capturing current state…";
      } else if (next.lastError) {
        status.dataset.error = "1";
        status.textContent = next.lastError;
      } else if (next.lastCaptureId) {
        status.dataset.error = "0";
        status.textContent = "Last capture: " + next.lastCaptureId;
      } else {
        status.dataset.error = "0";
        status.textContent = "Ready.";
      }
      meta.textContent =
        "Diagnostics v" + (next.version || "?") +
        " • General schema v" + (next.generalSchemaVersion || "?") +
        " • Providers " + (next.providerCount || 0);
    }

    captureButton.addEventListener("click", async function () {
      const svc = diagnostics();
      if (!svc || typeof svc.captureAndDownload !== "function") {
        update(null);
        return;
      }
      captureButton.disabled = true;
      status.dataset.error = "0";
      status.textContent = "Capturing current state…";
      try {
        const result = await svc.captureAndDownload({ captureMode: "snapshot", providerIds: [] });
        if (!result || !result.ok) {
          status.dataset.error = "1";
          status.textContent = result && result.error ? result.error : "Diagnostic capture failed.";
          return;
        }
        status.dataset.error = "0";
        status.textContent = "Downloaded " + result.filename + " (" + Number(result.sizeBytes || 0).toLocaleString() + " bytes).";
      } catch (error) {
        status.dataset.error = "1";
        status.textContent = error && error.message ? error.message : String(error);
      } finally {
        try { update(svc.getState()); } catch (_) {}
      }
    });

    const svc = diagnostics();
    if (svc && typeof svc.onChange === "function") svc.onChange(update);
    update(svc && typeof svc.getState === "function" ? svc.getState() : null);
  }

  function register() {
    const WD = UW.WitchDock;
    const svc = diagnostics();
    if (!WD || typeof WD.registerTool !== "function" || !svc) return false;
    WD.registerTool({
      id: TOOL_ID,
      tab: "Utilities",
      title: "Bug Capture",
      version: VERSION,
      build: BUILD,
      render: renderTool
    });
    return true;
  }

  let tries = 0;
  const timer = setInterval(function () {
    tries += 1;
    if (register() || tries >= 120) clearInterval(timer);
  }, 100);
})();
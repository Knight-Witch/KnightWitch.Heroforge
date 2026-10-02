(function () {
  "use strict";

  const GLOBAL = "KWWitchDockPublicStatusUI";
  const VERSION = "0.2.0";
  const BUILD = "0.2.0-utilities-section";
  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

  function service() {
    const svc = UW.KWWitchDockPublicStatus;
    return svc && typeof svc.getState === "function" ? svc : null;
  }

  function addStyles() {
    if (document.getElementById("kwHFStatusPublicStyles")) return;
    const style = document.createElement("style");
    style.id = "kwHFStatusPublicStyles";
    style.textContent = [
      ".kwHFStatus{display:grid;gap:10px;padding:2px;color:rgba(255,255,255,.9);font:12px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}",
      ".kwHFStatusTop{display:flex;align-items:center;justify-content:space-between;gap:8px}",
      ".kwHFStatusMeta{display:flex;align-items:center;gap:7px;min-width:0}",
      ".kwHFStatusDot{width:8px;height:8px;border-radius:50%;background:#777;box-shadow:0 0 0 3px rgba(255,255,255,.04)}",
      ".kwHFStatusDot[data-state='live']{background:#62d38b}.kwHFStatusDot[data-state='cached']{background:#d7b65a}.kwHFStatusDot[data-state='offline']{background:#d76b6b}",
      ".kwHFStatusMetaText{display:grid;gap:1px;min-width:0}.kwHFStatusMetaText strong{font-size:12px;font-weight:700}.kwHFStatusMetaText span{font-size:10px;color:rgba(255,255,255,.52);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".kwHFStatusRefresh{height:28px;padding:0 9px;border:1px solid rgba(255,255,255,.14);border-radius:6px;background:rgba(255,255,255,.06);color:#eee;font-size:11px;font-weight:650;cursor:pointer}",
      ".kwHFStatusRefresh:hover{background:rgba(255,255,255,.12)}.kwHFStatusRefresh:disabled{opacity:.48;cursor:default}",
      ".kwHFStatusGrid{display:grid;gap:8px}",
      ".kwHFStatusCard{display:grid;gap:6px;padding:9px;border:1px solid rgba(255,255,255,.10);border-radius:7px;background:rgba(255,255,255,.035)}",
      ".kwHFStatusCardHead{display:flex;align-items:center;justify-content:space-between;gap:8px}.kwHFStatusCardHead strong{font-size:11px;letter-spacing:.35px;text-transform:uppercase}.kwHFStatusCount{font-size:10px;color:rgba(255,255,255,.5)}",
      ".kwHFStatusEmpty{color:rgba(255,255,255,.58);font-size:11px}",
      ".kwHFStatusList{display:grid;gap:5px}.kwHFStatusItem{display:grid;gap:1px}.kwHFStatusItem strong{font-size:11px;font-weight:650}.kwHFStatusItem span{font-size:10px;color:rgba(255,255,255,.58)}",
      ".kwHFStatusRelease{display:grid;gap:3px}.kwHFStatusRelease strong{font-size:12px}.kwHFStatusRelease span{font-size:10px;color:rgba(255,255,255,.58)}",
      ".kwHFStatusActions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.kwHFStatusAction{min-width:0;padding:7px 6px;border:1px solid rgba(170,85,255,.30);border-radius:6px;background:rgba(170,85,255,.08);color:#eee;font-size:10px;font-weight:650;text-align:center;text-decoration:none;cursor:pointer}.kwHFStatusAction:hover{background:rgba(170,85,255,.16)}",
      ".kwHFStatusNote{font-size:9px;color:rgba(255,255,255,.42)}"
    ].join("");
    document.head.appendChild(style);
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = String(text);
    return node;
  }

  function shortText(value, limit) {
    const text = String(value == null ? "" : value).trim();
    if (text.length <= limit) return text;
    return text.slice(0, Math.max(0, limit - 1)).trimEnd() + "…";
  }

  function formatChecked(value) {
    if (!value) return "Not checked yet";
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "Last check unavailable";
    return "Checked " + date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function stateLabel(next) {
    if (next && next.available && !next.lastError) return { key: "live", label: next.source === "cache" ? "Cached status" : "Status current" };
    if (next && next.available) return { key: "cached", label: "Offline — cached status" };
    return { key: "offline", label: "Status unavailable" };
  }

  function openExternal(url) {
    if (!url) return;
    try {
      const opened = window.open(String(url), "_blank", "noopener,noreferrer");
      if (opened) opened.opener = null;
    } catch (_) {}
  }

  function renderItems(container, items, emptyText, limit) {
    clear(container);
    const list = Array.isArray(items) ? items : [];
    if (!list.length) {
      container.appendChild(el("div", "kwHFStatusEmpty", emptyText));
      return;
    }
    const visible = list.slice(0, limit);
    const wrap = el("div", "kwHFStatusList");
    for (const item of visible) {
      const row = el("div", "kwHFStatusItem");
      row.appendChild(el("strong", "", shortText(item && item.title, 90)));
      if (item && item.summary) row.appendChild(el("span", "", shortText(item.summary, 180)));
      wrap.appendChild(row);
    }
    if (list.length > visible.length) {
      wrap.appendChild(el("div", "kwHFStatusEmpty", "+" + (list.length - visible.length) + " more on HF.Status"));
    }
    container.appendChild(wrap);
  }

  function renderStatusContent(container) {
    addStyles();
    clear(container);

    const root = el("div", "kwHFStatus");
    const top = el("div", "kwHFStatusTop");
    const meta = el("div", "kwHFStatusMeta");
    const dot = el("span", "kwHFStatusDot");
    const metaText = el("span", "kwHFStatusMetaText");
    const metaStrong = el("strong", "", "HF.Status");
    const metaSub = el("span", "", "Loading cached status…");
    metaText.append(metaStrong, metaSub);
    meta.append(dot, metaText);
    const refreshButton = el("button", "kwHFStatusRefresh", "Refresh");
    refreshButton.type = "button";
    top.append(meta, refreshButton);
    root.appendChild(top);

    const grid = el("div", "kwHFStatusGrid");

    const criticalCard = el("section", "kwHFStatusCard");
    const criticalHead = el("div", "kwHFStatusCardHead");
    criticalHead.append(el("strong", "", "Critical Alerts"), el("span", "kwHFStatusCount", "0"));
    const criticalBody = el("div");
    criticalCard.append(criticalHead, criticalBody);

    const breakageCard = el("section", "kwHFStatusCard");
    const breakageHead = el("div", "kwHFStatusCardHead");
    breakageHead.append(el("strong", "", "Open / Investigating"), el("span", "kwHFStatusCount", "0"));
    const breakageBody = el("div");
    breakageCard.append(breakageHead, breakageBody);

    const releaseCard = el("section", "kwHFStatusCard");
    const releaseHead = el("div", "kwHFStatusCardHead");
    releaseHead.append(el("strong", "", "Latest Release"), el("span", "kwHFStatusCount", ""));
    const releaseBody = el("div", "kwHFStatusRelease");
    releaseCard.append(releaseHead, releaseBody);

    grid.append(criticalCard, breakageCard, releaseCard);
    root.appendChild(grid);

    const actions = el("div", "kwHFStatusActions");
    const statusAction = el("button", "kwHFStatusAction", "Status Hub");
    const reportAction = el("button", "kwHFStatusAction", "Report a Bug");
    const trackAction = el("button", "kwHFStatusAction", "Track Report");
    for (const button of [statusAction, reportAction, trackAction]) button.type = "button";
    actions.append(statusAction, reportAction, trackAction);
    root.appendChild(actions);

    const note = el("div", "kwHFStatusNote", "HF.Status is optional support infrastructure. Witch Dock keeps working if it is offline.");
    root.appendChild(note);
    container.appendChild(root);

    let latestState = null;

    function apply(next) {
      latestState = next || null;
      const label = stateLabel(next);
      dot.dataset.state = label.key;
      metaStrong.textContent = label.label;
      metaSub.textContent = next && next.refreshing ? "Refreshing…" : formatChecked(next && next.checkedAt);
      refreshButton.disabled = !!(next && next.refreshing);

      const payload = next && next.payload;
      const critical = payload && Array.isArray(payload.criticalAlerts) ? payload.criticalAlerts : [];
      const active = payload && payload.monthlyBreakage && Array.isArray(payload.monthlyBreakage.active) ? payload.monthlyBreakage.active : [];
      criticalHead.lastChild.textContent = String(critical.length);
      breakageHead.lastChild.textContent = String(active.length);
      renderItems(criticalBody, critical, "No active critical alerts.", 2);
      renderItems(breakageBody, active, payload ? "No open reviewed issues." : "No cached status yet.", 4);

      clear(releaseBody);
      const patch = payload && payload.latestPatch;
      if (patch && patch.version) {
        releaseHead.lastChild.textContent = "v" + String(patch.version);
        releaseBody.appendChild(el("strong", "", "Witch Dock " + String(patch.version)));
        releaseBody.appendChild(el("span", "", shortText(patch.summary || "", 240)));
      } else {
        releaseHead.lastChild.textContent = "";
        releaseBody.appendChild(el("span", "", payload ? "No reviewed release published." : "No cached status yet."));
      }
    }

    refreshButton.addEventListener("click", function () {
      const svc = service();
      if (!svc || typeof svc.refresh !== "function") return;
      svc.refresh({ force: true }).catch(function () {});
    });

    function siteBase() {
      const base = latestState && typeof latestState.siteBase === "string" ? latestState.siteBase.replace(/\/+$/, "") : "";
      return base;
    }

    statusAction.addEventListener("click", function () {
      const base = siteBase();
      if (base) openExternal(base + "/status");
    });
    reportAction.addEventListener("click", function () {
      const reporter = UW.KWWitchDockBugReporter;
      if (reporter && typeof reporter.open === "function") {
        reporter.open({ launchMethod: "direct", productId: "witch-dock", groupId: "wd-utilities", toolId: "utilities" });
        return;
      }
      const base = siteBase();
      if (base) openExternal(base + "/report?scope=witch-scripts");
    });
    trackAction.addEventListener("click", function () {
      const base = siteBase();
      if (base) openExternal(base + "/report-status");
    });

    const svc = service();
    if (svc && typeof svc.onChange === "function") svc.onChange(apply);
    apply(svc && typeof svc.getState === "function" ? svc.getState() : null);
  }

  function renderSection(root, api) {
    if (!root || !api || !api.ui || typeof api.ui.createSection !== "function") return false;
    const section = api.ui.createSection({ id: "script-status", title: "Script Status", defaultCollapsed: false });
    renderStatusContent(section.body);
    root.appendChild(section.root);
    return true;
  }

  UW[GLOBAL] = Object.freeze({
    version: VERSION,
    build: BUILD,
    renderSection: renderSection
  });
})();

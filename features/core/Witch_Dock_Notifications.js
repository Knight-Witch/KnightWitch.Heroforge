(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const GLOBAL = "KWWitchDockNotifications";
  const FEATURE_ID = "witch-dock-notifications";
  const VERSION = "0.2.0";
  const BUILD = "0.2.0-expandable-release-details";
  const OVERLAY_ID = "kwWDNoticeOverlay";
  const DEFAULT_PRIORITY = 0;

  if (UW[GLOBAL] && UW[GLOBAL].version === VERSION && UW[GLOBAL].build === BUILD) return;

  const state = {
    configured: false,
    registeredIds: [],
    shownIds: [],
    activeId: null,
    showCount: 0,
    closeCount: 0,
    lastCloseReason: null,
    lastError: null
  };

  let pageStorage = null;
  let emblemUrl = "";
  let queue = [];
  let active = null;
  let activeKeydownHandler = null;
  let scheduled = false;

  function cloneState() {
    return JSON.parse(JSON.stringify(state));
  }

  function normalizeId(value) {
    const id = String(value || "").trim();
    if (!/^[A-Za-z0-9._:-]{1,120}$/.test(id)) {
      throw new Error("Witch Dock notice id must be 1-120 safe identifier characters.");
    }
    return id;
  }

  function keyFor(id) {
    return `kw.witchDock.notice.${normalizeId(id)}.shown.v1`;
  }

  function isShown(id) {
    if (!pageStorage) return false;
    try { return !!pageStorage.getItem(keyFor(id)); }
    catch (_) { return false; }
  }

  function markShown(id) {
    if (!pageStorage) return false;
    try {
      pageStorage.setItem(keyFor(id), new Date().toISOString());
      return true;
    } catch (_) {
      return false;
    }
  }

  function configure(options) {
    const opts = options && typeof options === "object" ? options : {};
    if (!opts.pageStorage || typeof opts.pageStorage.getItem !== "function" || typeof opts.pageStorage.setItem !== "function") {
      throw new Error("Witch Dock Notifications requires pageStorage.");
    }
    pageStorage = opts.pageStorage;
    emblemUrl = typeof opts.emblemUrl === "string" ? opts.emblemUrl : "";
    state.configured = true;
    state.lastError = null;
    return true;
  }

  function normalizeNotice(definition) {
    const def = definition && typeof definition === "object" ? definition : {};
    const id = normalizeId(def.id);
    const title = String(def.title || "").trim();
    if (!title) throw new Error(`Witch Dock notice ${id} requires a title.`);

    const paragraphs = Array.isArray(def.paragraphs)
      ? def.paragraphs.map((value) => String(value || "").trim()).filter(Boolean)
      : [];
    if (!paragraphs.length && def.message) paragraphs.push(String(def.message).trim());
    if (!paragraphs.length) throw new Error(`Witch Dock notice ${id} requires message text.`);

    const overview = def.overview && typeof def.overview === "object" ? {
      title: String(def.overview.title || "Release overview").trim(),
      items: Array.isArray(def.overview.items) ? def.overview.items.map((item) => String(item || "").trim()).filter(Boolean) : []
    } : null;
    const details = Array.isArray(def.details) ? def.details.filter((section) => section && typeof section === "object").map((section) => ({
      title: String(section.title || "").trim(),
      items: Array.isArray(section.items) ? section.items.filter((item) => item && typeof item === "object").map((item) => ({
        label: String(item.label || "").trim(),
        text: String(item.text || "").trim(),
        notes: Array.isArray(item.notes) ? item.notes.map((note) => String(note || "").trim()).filter(Boolean) : []
      })).filter((item) => item.label || item.text) : []
    })).filter((section) => section.title && section.items.length) : [];

    const action = def.action && typeof def.action === "object" ? {
      label: String(def.action.label || "").trim(),
      href: String(def.action.href || "").trim(),
      newTab: def.action.newTab !== false
    } : null;

    if (action && (!action.label || !action.href)) {
      throw new Error(`Witch Dock notice ${id} action requires label and href.`);
    }

    const acknowledgeWhen = ["show", "dismiss", "action"].includes(def.acknowledgeWhen)
      ? def.acknowledgeWhen
      : "show";

    return Object.freeze({
      id,
      title,
      paragraphs,
      overview,
      details,
      action,
      acknowledgeWhen,
      priority: Number.isFinite(def.priority) ? Number(def.priority) : DEFAULT_PRIORITY,
      eyebrow: String(def.eyebrow || "").trim(),
      closeLabel: String(def.closeLabel || "Close").trim() || "Close"
    });
  }

  function removeOverlay() {
    const node = document.getElementById(OVERLAY_ID);
    if (node) node.remove();
  }

  function acknowledgeActive(reason) {
    if (!active) return;
    if (active.acknowledgeWhen === "show") return;
    if (active.acknowledgeWhen === "dismiss" && reason === "dismiss") markShown(active.id);
    if (active.acknowledgeWhen === "action" && reason === "action") markShown(active.id);
  }

  function closeActive(reason) {
    if (!active) return false;
    acknowledgeActive(reason || "dismiss");
    removeOverlay();
    if (activeKeydownHandler) {
      document.removeEventListener("keydown", activeKeydownHandler, true);
      activeKeydownHandler = null;
    }
    active = null;
    state.activeId = null;
    state.closeCount += 1;
    state.lastCloseReason = reason || "dismiss";
    window.setTimeout(showNext, 80);
    return true;
  }

  function buildOverlay(notice, options) {
    const opts = options && typeof options === "object" ? options : {};
    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "kwWDNoticeTitle");

    const card = document.createElement("div");
    card.className = "kwWDNoticeCard";

    const header = document.createElement("div");
    header.className = "kwWDNoticeHeader";

    if (emblemUrl) {
      const emblem = document.createElement("img");
      emblem.className = "kwWDNoticeEmblem";
      emblem.src = emblemUrl;
      emblem.alt = "";
      emblem.addEventListener("error", () => { emblem.style.display = "none"; }, { once: true });
      header.appendChild(emblem);
    }

    const heading = document.createElement("div");
    heading.className = "kwWDNoticeHeading";
    if (notice.eyebrow) {
      const eyebrow = document.createElement("div");
      eyebrow.className = "kwWDNoticeEyebrow";
      eyebrow.textContent = notice.eyebrow;
      heading.appendChild(eyebrow);
    }
    const title = document.createElement("div");
    title.id = "kwWDNoticeTitle";
    title.className = "kwWDNoticeTitle";
    title.textContent = notice.title;
    heading.appendChild(title);
    header.appendChild(heading);

    const close = document.createElement("button");
    close.type = "button";
    close.className = "kwWDNoticeClose";
    close.title = notice.closeLabel;
    close.setAttribute("aria-label", notice.closeLabel);
    close.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M5 5L19 19M19 5L5 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    close.addEventListener("click", () => closeActive("dismiss"));
    header.appendChild(close);

    const body = document.createElement("div");
    body.className = "kwWDNoticeBody";
    for (const text of notice.paragraphs) {
      const p = document.createElement("p");
      p.textContent = text;
      body.appendChild(p);
    }

    const hasDetails = notice.details.length > 0;
    const detailBody = document.createElement("div");
    detailBody.className = "kwWDNoticeBody kwWDNoticeDetails";
    detailBody.hidden = true;
    let detailsToggle = null;
    let detailsLink = null;
    const setDetailsOpen = (open) => {
      body.hidden = open;
      detailBody.hidden = !open;
      card.classList.toggle("kwWDNoticeExpanded", open);
      detailsToggle.textContent = open ? "Back to overview" : "See details";
      if (detailsLink) detailsLink.setAttribute("aria-expanded", String(open));
      detailsToggle.setAttribute("aria-expanded", String(open));
      (open ? detailBody : body).scrollTop = 0;
      detailsToggle.focus();
    };

    if (notice.overview && notice.overview.items.length) {
      const section = document.createElement("section");
      section.className = "kwWDNoticeSection";
      const heading = document.createElement("h3");
      heading.textContent = notice.overview.title;
      section.appendChild(heading);
      if (hasDetails) {
        detailsLink = document.createElement("button");
        detailsLink.type = "button";
        detailsLink.className = "kwWDNoticeDetailsLink";
        detailsLink.textContent = "See details";
        detailsLink.setAttribute("aria-expanded", "false");
        detailsLink.addEventListener("click", () => setDetailsOpen(true));
        section.appendChild(detailsLink);
      }
      const list = document.createElement("ul");
      for (const item of notice.overview.items) {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      }
      section.appendChild(list);
      body.appendChild(section);
    }

    if (hasDetails) {
      for (const section of notice.details) {
        const group = document.createElement("section");
        group.className = "kwWDNoticeDetailSection";
        const heading = document.createElement("h3");
        heading.textContent = section.title;
        group.appendChild(heading);
        const list = document.createElement("ul");
        for (const item of section.items) {
          const li = document.createElement("li");
          if (item.label) {
            const label = document.createElement("strong");
            label.textContent = item.label;
            li.appendChild(label);
          }
          if (item.text) li.appendChild(document.createTextNode(`${item.label ? " — " : ""}${item.text}`));
          if (item.notes.length) {
            const notes = document.createElement("ul");
            notes.className = "kwWDNoticeNotes";
            for (const note of item.notes) {
              const sub = document.createElement("li");
              sub.textContent = note;
              notes.appendChild(sub);
            }
            li.appendChild(notes);
          }
          list.appendChild(li);
        }
        group.appendChild(list);
        detailBody.appendChild(group);
      }
    }

    const footer = document.createElement("div");
    footer.className = "kwWDNoticeFooter";
    if (hasDetails) {
      detailsToggle = document.createElement("button");
      detailsToggle.type = "button";
      detailsToggle.className = "kwWDNoticeDetailsButton";
      detailsToggle.textContent = "See details";
      detailsToggle.setAttribute("aria-expanded", "false");
      detailsToggle.addEventListener("click", () => setDetailsOpen(!card.classList.contains("kwWDNoticeExpanded")));
      footer.appendChild(detailsToggle);
    }
    let primary = null;
    if (notice.action) {
      primary = document.createElement("a");
      primary.className = "kwWDNoticeAction";
      primary.href = notice.action.href;
      primary.textContent = notice.action.label;
      if (notice.action.newTab) {
        primary.target = "_blank";
        primary.rel = "noopener noreferrer";
      }
      primary.addEventListener("click", () => {
        if (notice.acknowledgeWhen === "action") markShown(notice.id);
        window.setTimeout(() => closeActive("action"), 0);
      });
      footer.appendChild(primary);
    }

    card.appendChild(header);
    card.appendChild(body);
    if (hasDetails) card.appendChild(detailBody);
    if (notice.action || hasDetails) card.appendChild(footer);
    overlay.appendChild(card);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeActive("dismiss");
    });

    const onKeyDown = (event) => {
      if (event.code !== "Escape" || state.activeId !== notice.id) return;
      event.preventDefault();
      closeActive("dismiss");
    };
    activeKeydownHandler = onKeyDown;
    document.addEventListener("keydown", onKeyDown, true);

    document.body.appendChild(overlay);

    if (notice.acknowledgeWhen === "show" && !opts.skipAcknowledge) markShown(notice.id);
    state.shownIds.push(notice.id);
    state.showCount += 1;
    state.activeId = notice.id;
    active = notice;

    window.setTimeout(() => {
      try { (primary || close).focus(); } catch (_) {}
    }, 0);

    return true;
  }

  function showNext() {
    scheduled = false;
    if (!state.configured || active || !document.body) return false;

    queue.sort((a, b) => b.priority - a.priority);
    while (queue.length) {
      const notice = queue.shift();
      if (isShown(notice.id)) continue;
      try {
        return buildOverlay(notice);
      } catch (error) {
        state.lastError = error && error.message ? error.message : String(error);
      }
    }
    return false;
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(showNext, 180);
  }

  function register(definition) {
    if (!state.configured) throw new Error("Witch Dock Notifications is not configured.");
    const notice = normalizeNotice(definition);
    if (state.registeredIds.includes(notice.id)) return false;
    state.registeredIds.push(notice.id);
    queue.push(notice);
    schedule();
    return true;
  }

  function preview(definition) {
    if (!state.configured) throw new Error("Witch Dock Notifications is not configured.");
    if (active) closeActive("preview-replaced");
    const notice = normalizeNotice({
      ...definition,
      id: `${normalizeId(definition.id)}:preview:${Date.now()}`,
      acknowledgeWhen: "show"
    });
    return buildOverlay(notice, { skipAcknowledge: true });
  }

  function dispose() {
    queue = [];
    scheduled = false;
    removeOverlay();
    if (activeKeydownHandler) {
      document.removeEventListener("keydown", activeKeydownHandler, true);
      activeKeydownHandler = null;
    }
    active = null;
    state.activeId = null;
    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }
    return true;
  }

  UW[GLOBAL] = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    configure,
    register,
    preview,
    isShown,
    closeActive,
    getState: cloneState,
    dispose
  });

  const defaultPageStorage = Object.freeze({
    getItem(key) {
      try { return UW.localStorage.getItem(String(key)); }
      catch (_) { return null; }
    },
    setItem(key, value) {
      try {
        UW.localStorage.setItem(String(key), String(value));
        return true;
      } catch (_) {
        return false;
      }
    }
  });
  const assets = UW.KWWitchDockAssets;
  configure({
    pageStorage: defaultPageStorage,
    emblemUrl: assets && typeof assets.compactEmblemUrl === "string" ? assets.compactEmblemUrl : ""
  });
})();

// ==UserScript==
// @name         Witch Dock v1.0.6 - DEV TEST
// @namespace    KnightWitch
// @version      1.0.6
// @description  DEV TEST SCRIPT
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/DEV_TEST/Witch_Dock.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/DEV_TEST/Witch_Dock.user.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// ==/UserScript==


    }
  }
}

function getSectionAtY(container, y) {
  const sections = Array.from(container.children).filter((n) => n && n.classList && n.classList.contains("kwWDSection"));
  for (const s of sections) {
    const r = s.getBoundingClientRect();
    if (y >= r.top && y <= r.bottom) return s;
  }
  return null;
}

function startSectionPointerDrag(toolId, sectionRoot, header, container, e) {
  if (!e.isPrimary) return;
  const sectionId = sectionRoot.getAttribute("data-section-id");
  if (!sectionId) return;

  const pointerId = e.pointerId;
  try { header.setPointerCapture(pointerId); } catch {}
  const startX = e.clientX;
  const startY = e.clientY;

  let dragging = false;
  let dragEl = null;

  function onMove(ev) {
    if (ev.pointerId !== pointerId) return;

    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;

    if (!dragging) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      dragging = true;

      state.draggingSectionId = sectionId;
      state.draggingSectionTool = toolId;

      sectionRoot.classList.add("dragging");

      header.__kwDraggedRecently = true;
      setTimeout(() => { header.__kwDraggedRecently = false; }, 0);
    }

    ev.preventDefault();

    clearSectionDragIndicators(container);

    const target = getSectionAtY(container, ev.clientY);
    if (!target || target === sectionRoot) return;

    const r = target.getBoundingClientRect();
    const before = ev.clientY < r.top + r.height / 2;

    target.classList.add(before ? "drag-over-top" : "drag-over-bottom");
  }

  function onUp(ev) {
    if (ev.pointerId !== pointerId) return;

    window.removeEventListener("pointermove", onMove, true);
    window.removeEventListener("pointerup", onUp, true);
    window.removeEventListener("pointercancel", onUp, true);

    if (!dragging) return;

    const dropTarget = getSectionAtY(container, ev.clientY);
    if (dropTarget && dropTarget !== sectionRoot) {
      const r = dropTarget.getBoundingClientRect();
      const before = ev.clientY < r.top + r.height / 2;
      if (before) container.insertBefore(sectionRoot, dropTarget);
      else container.insertBefore(sectionRoot, dropTarget.nextSibling);
      saveSectionOrderFromDom(toolId, container);
    }

    clearSectionDragIndicators(container);

    sectionRoot.classList.remove("dragging");
    state.draggingSectionId = null;
    state.draggingSectionTool = null;
  }

  window.addEventListener("pointermove", onMove, true);
  window.addEventListener("pointerup", onUp, true);
  window.addEventListener("pointercancel", onUp, true);
}

function bindSectionPointerDrag(toolId, sectionRoot, container) {
  const header = sectionRoot.querySelector(".kwWDSectionHeader");
  if (!header) return;
  const handle = header.querySelector(".kwWDDragHandle") || header;
  if (handle.__kwPointerDragBound) return;
  handle.__kwPointerDragBound = true;

  handle.style.touchAction = "none";

  handle.addEventListener(
    "pointerdown",
    (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      startSectionPointerDrag(toolId, sectionRoot, handle, container, e);
    },
    true
  );
}

function ensureSectionDragHandle(sectionRoot) {
  const header = sectionRoot.querySelector(".kwWDSectionHeader");
  if (!header) return;
  if (header.querySelector(".kwWDDragHandle")) return;
  const h = document.createElement("span");
  h.className = "kwWDDragHandle";
  h.textContent = "≡";
  header.appendChild(h);
}

function finalizeToolSections(toolId, toolContainer) {
  if (!toolContainer) return;

  const sections = Array.from(toolContainer.querySelectorAll(".kwWDSection"));
  if (!sections.length) return;

  const parents = new Map();
  for (const s of sections) {
    const p = s.parentElement;
    if (!p) continue;
    if (!parents.has(p)) parents.set(p, []);
    parents.get(p).push(s);
  }

  for (const [parent, secs] of parents.entries()) {
    applySectionOrder(toolId, parent);
    for (const sec of secs) {
      ensureSectionDragHandle(sec);
      bindSectionPointerDrag(toolId, sec, parent);
    }
  }
}

function mountTool(def) {
  const tabName = def.tab || "Misc Tools";
  const tab = ensureTab(tabName);

  if (state.toolsById.has(def.id)) {
    const existing = state.toolsById.get(def.id);
    if (existing && existing.container && existing.container.parentNode) existing.container.remove();
    state.toolsById.delete(def.id);
  }

  const container = document.createElement("div");
  container.setAttribute("data-tool-id", def.id);

  tab.list.appendChild(container);

  state.toolsById.set(def.id, { def, container, tab: tabName });

  try {
    def.render(container, buildToolApi(def));
  } catch {
    container.textContent = "Tool failed to render.";
  }

  finalizeToolSections(def.id, container);

  state.minWidth = computeMinDockWidthForActiveTab();
  enforceSizeConstraints();
}

  function registerTool(def) {
    if (!def || typeof def !== "object") return;
    if (!def.id || typeof def.id !== "string") return;
    if (typeof def.render !== "function") return;

    if (!state.uiReady) state.pending.push(def);
    else mountTool(def);
  }

  function startDockDrag(e) {
    if (!state.root || prefs.closed) return;
    const target = e.target;
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
    savePrefs(prefs);

    function move(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      const { vw, vh } = getViewport();
      const w = state.root.getBoundingClientRect().width;
      const h = state.root.getBoundingClientRect().height;

      const left = clamp(startLeft + dx, 0, Math.max(0, vw - w));
      const top = clamp(startTop + dy, 0, Math.max(0, vh - h));

      state.root.style.left = `${left}px`;
      state.root.style.top = `${top}px`;

      prefs.x = Math.round(left);
      prefs.y = Math.round(top);
      savePrefs(prefs);
    }

    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startResizeCorner(e) {
    if (!state.root || prefs.closed || prefs.minimized) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = state.root.getBoundingClientRect();
    state.isResizing = true;
    state.resizeStart = { x: e.clientX, y: e.clientY, w: rect.width, h: rect.height, mode: "corner" };

    function move(ev) {
      if (!state.isResizing || !state.resizeStart) return;

      const dx = ev.clientX - state.resizeStart.x;
      const dy = ev.clientY - state.resizeStart.y;

      const minW = Math.max(260, state.minWidth || 260);
      const minH = computeMinDockHeightCollapsed();

      const { vw, vh } = getViewport();
      const maxW = Math.max(minW, vw - 8);
      const maxH = Math.max(minH, vh - 8);

      const newW = clamp(state.resizeStart.w + dx, minW, maxW);
      const newH = clamp(state.resizeStart.h + dy, minH, maxH);

      state.root.style.width = `${newW}px`;
      state.root.style.height = `${newH}px`;

      prefs.width = Math.round(newW);
      prefs.height = Math.round(newH);
      prefs.lastOpenWidth = prefs.width;
      prefs.lastOpenHeight = prefs.height;
      savePrefs(prefs);
    }

    function up() {
      state.isResizing = false;
      state.resizeStart = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      enforceSizeConstraints();
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startResizeBottom(e) {
    if (!state.root || prefs.closed || prefs.minimized) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = state.root.getBoundingClientRect();
    state.isResizing = true;
    state.resizeStart = { x: e.clientX, y: e.clientY, w: rect.width, h: rect.height, mode: "bottom" };

    function move(ev) {
      if (!state.isResizing || !state.resizeStart) return;

      const dy = ev.clientY - state.resizeStart.y;
      const minH = computeMinDockHeightCollapsed();

      const { vh } = getViewport();
      const maxH = Math.max(minH, vh - 8);

      const newH = clamp(state.resizeStart.h + dy, minH, maxH);

      state.root.style.height = `${newH}px`;

      prefs.height = Math.round(newH);
      prefs.lastOpenHeight = prefs.height;
      savePrefs(prefs);
    }

    function up() {
      state.isResizing = false;
      state.resizeStart = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      enforceSizeConstraints();
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function toggleMinimize() {
    if (!prefs.minimized) snapshotCurrentDockPositionToPrefs();

    prefs.minimized = !prefs.minimized;

    if (!prefs.minimized) {
      prefs.width = prefs.lastOpenWidth || prefs.width || DEFAULTS.width;
      prefs.height = prefs.lastOpenHeight || prefs.height || DEFAULTS.height;
    } else {
      prefs.lastOpenWidth = prefs.width;
      prefs.lastOpenHeight = prefs.height;
    }


  function dispatchKeyCombo({ key, code, ctrl, shift }) {
    const evDown = new KeyboardEvent("keydown", {
      key,
      code,
      bubbles: true,
      cancelable: true,
      ctrlKey: !!ctrl,
      shiftKey: !!shift
    });
    const evUp = new KeyboardEvent("keyup", {
      key,
      code,
      bubbles: true,
      cancelable: true,
      ctrlKey: !!ctrl,
      shiftKey: !!shift
    });
    document.dispatchEvent(evDown);
    window.dispatchEvent(evDown);
    document.dispatchEvent(evUp);
    window.dispatchEvent(evUp);
  }

  function triggerUndo() {
    dispatchKeyCombo({ key: "z", code: "KeyZ", ctrl: true, shift: false });
  }

  function triggerRedo() {
    dispatchKeyCombo({ key: "z", code: "KeyZ", ctrl: true, shift: true });
  }

    savePrefs(prefs);
    enforceSizeConstraints();
    applyMinimizedState();
  }

  function closeDock() {
    snapshotCurrentDockPositionToPrefs();

    prefs.closed = true;
    prefs.minimized = true;

    const { vh } = getViewport();
    prefs.compactX = 16;
    prefs.compactY = vh - 56;

    savePrefs(prefs);
    applyMinimizedState();
    showClosedCompact();
  }

  function expandFromCompact() {
    prefs.closed = false;
    prefs.minimized = false;

    prefs.width = prefs.lastOpenWidth || prefs.width || DEFAULTS.width;
    prefs.height = prefs.lastOpenHeight || prefs.height || DEFAULTS.height;

    if (prefs.lastOpenAnchored) {
      prefs.x = null;
      prefs.y = null;
    } else {
      prefs.x = prefs.lastOpenX != null ? prefs.lastOpenX : prefs.x;
      prefs.y = prefs.lastOpenY != null ? prefs.lastOpenY : prefs.y;
    }

    savePrefs(prefs);

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

    showClosedCompact();
    enforceSizeConstraints();
    applyMinimizedState();
  }

  function startCompactDrag(e) {
    if (!state.compact) return;
    const target = e.target;
    if (target && target.closest("#kwWDCompactExpand")) return;

    state.compact.style.right = "";
    state.compact.style.bottom = "";

    const rect = state.compact.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = rect.left;
    const startTop = rect.top;

    function move(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      const { vw, vh } = getViewport();
      const w = state.compact.getBoundingClientRect().width;
      const h = state.compact.getBoundingClientRect().height;

      const left = clamp(startLeft + dx, 0, Math.max(0, vw - w));
      const top = clamp(startTop + dy, 0, Math.max(0, vh - h));

      state.compact.style.left = `${left}px`;
      state.compact.style.top = `${top}px`;

      prefs.compactX = Math.round(left);
      prefs.compactY = Math.round(top);
      savePrefs(prefs);
    }

    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }


  function isEditableTarget(t) {
    if (!t) return false;
    const tag = (t.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (t.isContentEditable) return true;
    return false;
  }

  function installDockHotkey() {
    document.addEventListener("keydown", (e) => {
      if (e.repeat) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (isEditableTarget(e.target)) return;
      if (e.code !== "Backquote") return;

      e.preventDefault();

      if (prefs.closed) {
        expandFromCompact();
      } else {
        closeDock();
      }
    }, true);
  }

  const BONE_FOOTER_HOTKEY_TEXT = "Dock Hotkey: `~ (Grave Key)  |  Undo: Ctrl+Z  |  Redo: Ctrl+Shift+Z";

  function initBoneFooterAndDetection() {
  if (state.boneInit) return;
  if (!state.footer) return;
  state.boneInit = true;

  const makeEl = (tag, attrs = {}, text = "") => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else el.setAttribute(k, v);
    }
    if (text) el.textContent = text;
    return el;
  };

  const meta = (typeof getScriptMeta === "function" ? getScriptMeta() : { name: "Witch Dock", version: "" });
  const DETECT_NS = "kw.witchDock.boneDetect";
  const DETECT_VER = meta && meta.version ? String(meta.version) : "";

  const row = makeEl("div", { class: "kwWDBoneRow" });
  const label = makeEl("span", { class: "kwWDBoneLabel" }, "Bone:");
  const value = makeEl("span", { class: "kwWDBoneValue" }, "(click a bone)");
  const infoBtn = makeEl("button", { type: "button", tabindex: "-1", title: `${DETECT_NS}${DETECT_VER ? " v" + DETECT_VER : ""}` }, "?");
  infoBtn.style.height = "18px";
  infoBtn.style.width = "18px";
  infoBtn.style.padding = "0";
  infoBtn.style.marginLeft = "2px";
  infoBtn.style.borderRadius = "50%";
  infoBtn.style.border = "1px solid rgba(255,255,255,0.16)";
  infoBtn.style.background = "rgba(0,0,0,0.18)";
  infoBtn.style.color = "rgba(255,255,255,0.70)";
  infoBtn.style.fontSize = "10px";
  infoBtn.style.fontWeight = "800";
  infoBtn.style.lineHeight = "1";
  infoBtn.style.cursor = "default";

  const copyBtn = makeEl("button", { class: "kwWDBoneCopy", type: "button", title: "Copy bone name", disabled: "disabled" });
  copyBtn.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z"></path>
    </svg>
  `;

  row.appendChild(label);
  row.appendChild(value);
  row.appendChild(infoBtn);
  row.appendChild(copyBtn);

  const hotkeyLine = makeEl("div", { class: "kwWDFooterLine" }, BONE_FOOTER_HOTKEY_TEXT);

  state.footer.textContent = "";
  state.footer.appendChild(row);
  row.style.display = "none";
  state.footer.appendChild(hotkeyLine);

  const u = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

  const STATE = {
    ns: DETECT_NS,
    version: DETECT_VER,
    baseline: null,
    lastBoneName: "",
    delayMs: 35,
    candidates: null,
    attached: false,
    failed: false,
    stopped: false,
    tries: 0,
    maxTries: 60,
    retryTimer: null
  };

  function setBoneName(name) {
    STATE.lastBoneName = name || "";
    if (!STATE.lastBoneName) {
      value.textContent = "(click a bone)";
      value.title = "";
      copyBtn.setAttribute("disabled", "disabled");
      return;
    }
    value.textContent = STATE.lastBoneName;
    value.title = STATE.lastBoneName;
    copyBtn.removeAttribute("disabled");
  }

  function toast(msg) {
    let t = document.getElementById("kwBoneHudToast");
    if (!t) {
      t = makeEl("div", { id: "kwBoneHudToast" });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 900);
  }

  function copyToClipboard(text) {
    if (!text) return false;

    try {
      if (typeof GM_setClipboard === "function") {
        GM_setClipboard(text, { type: "text", mimetype: "text/plain" });
        toast("Copied bone name");
        return true;
      }
    } catch (_) {}

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => toast("Copied bone name"),
        () => toast("Copy failed")
      );
      return true;
    }

    toast("Copy failed");
    return false;
  }

  copyBtn.addEventListener("click", () => {
    if (!STATE.lastBoneName) return toast("Nothing to copy yet");
    copyToClipboard(STATE.lastBoneName);
  });

  function safeGet(obj, path) {
    try {
      const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
      let cur = obj;
      for (const p of parts) {
        if (cur == null) return undefined;
        cur = cur[p];
      }
      return cur;
    } catch (_) {
      return undefined;
    }
  }

  function getSummonCircle() {
    const tries = [
      () => u?.HF?.summonCircle,
      () => u?.HF?.app?.summonCircle,
      () => u?.HF?.scene?.summonCircle,
      () => u?.HF?.render?.summonCircle,
      () => u?.summonCircle
    ];
    for (const fn of tries) {
      let sc = null;
      try { sc = fn(); } catch (_) { sc = null; }
      if (sc) return sc;
    }
    return null;
  }

  function anchorBases() {
    return [
      "parent.parent.parent.children[5].object",
      "parent.parent.parent.children[4].object",
      "parent.parent.parent.children[6].object",
      "parent.parent.children[5].object",
      "parent.parent.children[4].object",
      "parent.children[5].object",
      "parent.children[4].object"
    ];
  }

  function buildCandidates(sc) {
    const out = [];
    const bases = anchorBases();

    for (const base of bases) {
      const node = safeGet(sc, base);
      if (!node) continue;

      out.push(`summonCircle.${base}.name`);
      out.push(`summonCircle.${base}.parent.name`);

      for (let i = 0; i < 16; i++) out.push(`summonCircle.${base}.children[${i}].name`);
      for (let i = 0; i < 16; i++) out.push(`summonCircle.${base}.object.children[${i}].name`);
    }

    const seen = new Set();
    return out.filter((p) => (seen.has(p) ? false : (seen.add(p), true)));
  }

  function snapshot(sc, paths) {
    const snap = [];
    for (const path of paths) {
      const v = safeGet({ summonCircle: sc }, path.replace(/^summonCircle\./, "summonCircle."));
      if (typeof v === "string" && v.length) snap.push({ path, value: v });
    }
    return snap;
  }

  function diffSnapshots(baseline, now) {
    const base = new Set((baseline || []).map((x) => `${x.path}::${x.value}`));
    const added = [];
    for (const x of now) {
      const k = `${x.path}::${x.value}`;
      if (!base.has(k)) added.push(x);
    }
    return added;
  }

  function scoreName(name) {
    let s = 0;
    if (!name) return -999;
    if (name.includes("_bind_jnt")) s += 50;
    if (name.includes("main_")) s += 12;
    if (name.includes("_kitbash_")) s += 8;
    if (/(clav|shoulder|deltoid|arm|hand|finger|spine|neck|head|leg|thigh|calf|foot)/i.test(name)) s += 6;
    if (/(thickness|fat|scaleOffset|offset|helper)/i.test(name)) s -= 10;
    return s;
  }

  function pickBest(delta) {
    if (!delta?.length) return null;

    const bind = delta.filter((d) => d.value.includes("_bind_jnt"));
    const pool = bind.length ? bind : delta;

    let best = null;
    let bestS = -Infinity;
    for (const d of pool) {
      const s = scoreName(d.value);
      if (s > bestS) {
        bestS = s;
        best = d;
      }
    }
    return best;
  }

  function shouldIgnoreClick(e) {
    const t = e && e.target;
    if (!t || !t.closest) return false;
    if (t.closest("#kwWitchDock") || t.closest("#kwWDCompact")) return true;
    if (t.closest("button, input, textarea, select, [role='button']")) return true;
    return false;
  }

  function detach() {
    if (!STATE.attached) return;
    document.removeEventListener("pointerup", handleEvent, true);
    document.removeEventListener("click", handleEvent, true);
    STATE.attached = false;
  }

  function resetState() {
    STATE.baseline = null;
    STATE.candidates = null;
    STATE.lastBoneName = "";
    STATE.failed = false;
    STATE.stopped = false;
    STATE.tries = 0;
    setBoneName("");
    copyBtn.setAttribute("disabled", "disabled");
    setIdle();
  }

  const BONE_IDLE_TEXT = "No bone detected (click a body bone)";
  const BONE_DETECTING_TEXT = "Detecting…";
  const BONE_FAILED_TEXT = "Bone detection failed. Restart detection:";

  function setIdle() {
    row.style.display = "flex";
    if (STATE.lastBoneName) return;
    value.textContent = BONE_IDLE_TEXT;
    value.title = "";
    copyBtn.setAttribute("disabled", "disabled");
  }

  function setDetecting() {
    if (STATE.failed) return;
    row.style.display = "flex";
    if (STATE.lastBoneName) return;
    value.textContent = BONE_DETECTING_TEXT;
    value.title = "";
    copyBtn.setAttribute("disabled", "disabled");
  }

  function setFailed(msg) {
    row.style.display = "flex";
    const t = (msg || BONE_FAILED_TEXT);
    value.innerHTML = `${t} <span class="kwWDBoneRetryChip">Click Here</span>`;
    value.title = "";
    copyBtn.setAttribute("disabled", "disabled");
    const chip = value.querySelector(".kwWDBoneRetryChip");
    if (chip) {
      chip.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        retry();
      }, { once: true });
    }
  }


  function ensureReady(sc) {
    if (!sc) return false;
    if (!STATE.candidates || !STATE.candidates.length) {
      const c = buildCandidates(sc);
      if (!c || !c.length) return false;
      STATE.candidates = c;
      STATE.baseline = snapshot(sc, STATE.candidates);
      return true;
    }
    if (!STATE.baseline) {
      STATE.baseline = snapshot(sc, STATE.candidates);
    }
    return true;
  }

  function forceRebuild(sc) {
    if (!sc) return false;
    const c = buildCandidates(sc);
    if (!c || !c.length) return false;
    STATE.candidates = c;
    STATE.baseline = snapshot(sc, STATE.candidates);
    return true;
  }

  function handleEvent(e) {
    try {
      if (shouldIgnoreClick(e)) return;

      const sc = getSummonCircle();
      if (!ensureReady(sc)) return;

      const handlerSc = sc;
      setTimeout(() => {
        try {
          const now = snapshot(handlerSc, STATE.candidates);
          const delta = diffSnapshots(STATE.baseline, now);
          const best = pickBest(delta);

          if (best && best.value && best.value.includes("_bind_jnt") && best.value !== STATE.lastBoneName) {
            setBoneName(best.value);
          }

          STATE.baseline = now;
        } catch (err) {
          detach();
          STATE.failed = true;
          setFailed();
          try { console.error("[Witch Dock] Bone detection error:", err); } catch (_) {}
        }
      }, STATE.delayMs);
    } catch (err) {
      detach();
      STATE.failed = true;
      setFailed();
      try { console.error("[Witch Dock] Bone detection error:", err); } catch (_) {}
    }
  }

  function scheduleStart(delayMs) {
    if (STATE.retryTimer) return;
    const d = (typeof delayMs === "number" ? delayMs : 250);
    STATE.retryTimer = setTimeout(() => {
      STATE.retryTimer = null;
      startWhenReady();
    }, d);
  }

  function startWhenReady() {
    const sc = getSummonCircle();
    if (!ensureReady(sc)) {
      STATE.tries += 1;
      if (STATE.tries >= STATE.maxTries) {
        STATE.stopped = true;
        STATE.tries = 0;
        setIdle();
        scheduleStart(1000);
        return;
      }
      scheduleStart(250);
      return;
    }

    STATE.stopped = false;
    STATE.tries = 0;
    row.style.display = "flex";

    if (!STATE.attached) {
      document.addEventListener("pointerup", handleEvent, true);
      document.addEventListener("click", handleEvent, true);
      STATE.attached = true;
    }

    setTimeout(() => {
      const sc2 = getSummonCircle();
      if (!sc2) return;
      if (!STATE.candidates || !STATE.candidates.length || !STATE.baseline || !STATE.baseline.length) {
        forceRebuild(sc2);
      }
    }, 750);
  }

  function retry() {
    detach();
    resetState();
    row.style.display = "flex";
    row.style.display = "flex";
    value.textContent = "Initializing bone detection…";
    value.title = "";
    startWhenReady();
  }

  row.addEventListener("click", (e) => {
    if (!(STATE.failed || STATE.stopped)) return;
    e.preventDefault();
    e.stopPropagation();
    retry();
  }, true);

  startWhenReady();

  state.__kwBoneDetect = {
    ns: STATE.ns,
    version: STATE.version,
    retry
  };
}


  function getScriptMeta() {
    try {
      const gi = typeof GM_info !== "undefined" ? GM_info : null;
      const name = gi && gi.script && typeof gi.script.name === "string" ? gi.script.name : "Witch Dock";
      const version = gi && gi.script && typeof gi.script.version === "string" ? gi.script.version : "";
      return { name, version };
    } catch {
      return { name: "Witch Dock", version: "" };
    }
  }

  function closeAboutModal() {
    if (!state.aboutOverlay) return;
    state.aboutOverlay.setAttribute("aria-hidden", "true");
  }

  function openAboutModal() {
    if (!state.aboutOverlay || !state.aboutModal) return;
    closeDisclaimerModal();
    state.aboutOverlay.setAttribute("aria-hidden", "false");
  }

  function ensureAboutModal() {
    if (state.aboutOverlay && state.aboutModal) return;

    const meta = getScriptMeta();

    const overlay = document.createElement("div");
    overlay.id = "kwWDAboutOverlay";
    overlay.setAttribute("aria-hidden", "true");

    const modal = document.createElement("div");
    modal.id = "kwWDAbout";

    const header = document.createElement("div");
    header.id = "kwWDAboutHeader";

    const title = document.createElement("div");
    title.id = "kwWDAboutTitle";
    title.textContent = meta.name;

    const closeBtn = document.createElement("button");
    closeBtn.id = "kwWDAboutClose";
    closeBtn.type = "button";
    closeBtn.title = "Close";
    closeBtn.textContent = "×";

    header.appendChild(title);
    header.appendChild(closeBtn);

    const body = document.createElement("div");
    body.id = "kwWDAboutBody";
    body.innerHTML = `
      <p>Witch Dock is a fan-created tool that is designed to help you create with some QoL updates meant to simplify tedious things like symmetrical proportions, tweaking paints for photo booth lighting, &amp; more!</p>
      <p>With this tool, you can:</p>
      <ul>
        <li>Get even proportions / sync body parts with a click of a button</li>
        <li>Save booth presets to make capturing media faster / smoother</li>
        <li>Make kitbash editing easier</li>
      </ul>
      <p><strong>Helpful Tool Tips:</strong></p>
      <ul>
        <li>Press the <code>\`~</code> (grave/tilde) hotkey to expand/minimize Witch Dock</li>
        <li>Drag/drop the tool tabs (Body Editor, Booth, etc) left/right to rearrange the order</li>
        <li>Drag/drop toolset tabs' internal tool sections to reorder to your preferred setup</li>
        <li>Resize the UI's window</li>
        <li>Collapse / hide the UI as needed</li>
        <li>Drag &amp; reorder your tools for your preferred flow</li>
        <li>Soon to come: Quick Access Toolbar, popout windows, &amp; more!</li>
      </ul>
      <p>If you'd like to support my work, feel free to donate to my KoFi!</p>
      <div class="kwWDAboutBtns">
        <a class="kwWDAboutLinkBtn" href="${GITHUB_REPO_URL}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        <a class="kwWDAboutLinkBtn" href="${KOFI_URL}" target="_blank" rel="noopener noreferrer">Support on Ko-fi</a>
      </div>
    `;

    const footer = document.createElement("div");
    footer.id = "kwWDAboutFooter";
    footer.textContent = meta.version ? `Version: ${meta.version}` : "";

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);

    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAboutModal();
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeAboutModal();
    });

    document.addEventListener(
      "keydown",
      (e) => {
        if (e.code === "Escape" && overlay.getAttribute("aria-hidden") === "false") {
          e.preventDefault();
          closeAboutModal();
        }
      },
      true
    );

    document.body.appendChild(overlay);

    state.aboutOverlay = overlay;
    state.aboutModal = modal;
  }

  function closeDisclaimerModal() {
    if (!state.disclaimerOverlay) return;
    state.disclaimerOverlay.setAttribute("aria-hidden", "true");
  }

  function openDisclaimerModal() {
    ensureDisclaimerModal();
    closeAboutModal();
    state.disclaimerOverlay.setAttribute("aria-hidden", "false");
  }

  function ensureDisclaimerModal() {
    if (state.disclaimerOverlay && state.disclaimerModal) return;

    const meta = getScriptMeta();

    const overlay = document.createElement("div");
    overlay.id = "kwWDDisclaimerOverlay";
    overlay.setAttribute("aria-hidden", "true");

    const modal = document.createElement("div");
    modal.id = "kwWDDisclaimer";

    const header = document.createElement("div");
    header.id = "kwWDDisclaimerHeader";

    const title = document.createElement("div");
    title.id = "kwWDDisclaimerTitle";
    title.textContent = "Disclaimer";

    const closeBtn = document.createElement("button");
    closeBtn.id = "kwWDDisclaimerClose";
    closeBtn.type = "button";
    closeBtn.title = "Close";
    closeBtn.textContent = "×";

    header.appendChild(title);
    header.appendChild(closeBtn);

    const body = document.createElement("div");
    body.id = "kwWDDisclaimerBody";
    body.innerHTML = `
      <p>This is a fan-created tool by an artist who adores Heroforge &amp; dedicated a lot of time to solving some common UI obstacles. This tool is not created with the intent of undermining Heroforge's work, but rather just some basic QoL tools.</p>
      <p><strong>This tool does NOT and CANNOT:</strong></p>
      <ul>
        <li>Give free users access to Pro content or features</li>
        <li>Add in new content like meshes/textures, etc</li>
        <li>Cut into Skycastle's bottom line</li>
      </ul>
      <p>I love this platform and <strong>HIGHLY ENCOURAGE users to subscribe to Heroforge Pro.</strong> It is well worth the very reasonable monthly price, &amp; by upgrading, you gain access to a myriad of features (including features that are effectively useless to free users on this tool). You also help keep our beloved shared hobby / engine &amp; the team at Heroforge going strong!</p>
      <p>Pro content requires an API token to access, or the Heroforge server simply will NOT serve this content to you. There is no way around this, no script that can 'hack' it, nor would I build such a thing.</p>
      <p>Skycastle LLC owns the rights to Heroforge &amp; I fully support their engine's creation. As a massive fan, I am happy to share tools I've created with the SC dev team any time. Us script-writers are your biggest fans, &amp; scripts are a fantastic way to test ideas, get user-feedback, solve many pain-points &amp; bugs—allowing your devs to spend more time growing the platform's features, &amp; less time doubling back on content.</p>
      <p>Please don't come for me. I just love you guys / the work you've done, &amp; as an artist with some tech skills, I implemented some UI features that make my life a little easier so I can do what I do best: show the world how awesome Heroforge is, what it is capable of, &amp; inspire more users to create with it—and subscribe to Pro, because I have been since the very beginning, for a reason!</p>
      <p>With love,<br/>A Witch</p>
    `;

    const footer = document.createElement("div");
    footer.id = "kwWDDisclaimerFooter";
    footer.textContent = meta.version ? `Version: ${meta.version}` : "";

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    state.disclaimerOverlay = overlay;
    state.disclaimerModal = modal;

    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeDisclaimerModal();
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeDisclaimerModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.getAttribute("aria-hidden") === "false") closeDisclaimerModal();
    }, true);
  }

function buildUI() {
    if (state.uiReady) return;
    state.uiReady = true;

    addStyles();

    state.root = el("div", { id: "kwWitchDock" }, [
      el("div", { id: "kwWDHeader", onpointerdown: startDockDrag }, [
        el("div", { id: "kwWDTitleWrap" }, [
          el("div", { id: "kwWDTitle", text: "WITCH DOCK" }),
          el("button", { id: "kwWDDisclaimerBtn", type: "button", title: "Disclaimer", text: "Disclaimer", onclick: () => { openDisclaimerModal(); } })
        ]),
        el("div", { id: "kwWDControls" }, [
          el("button", { id: "kwWDAboutBtn", class: "kwWDBtn", type: "button", text: "?", title: "About", onclick: () => { ensureAboutModal(); openAboutModal(); } }),
          el("button", { class: "kwWDBtn", type: "button", text: "–", title: "Minimize / Expand", onclick: toggleMinimize }),
          el("button", { class: "kwWDBtn", type: "button", text: "×", title: "Collapse to icon", onclick: closeDock })
        ])
      ]),
      el("div", { id: "kwWDTabs" }, [
        el("div", { id: "kwWDTabsLeft" }),
        el("div", { id: "kwWDTabsShade" }),
        el("div", { id: "kwWDTabsRight" }, [
          el("div", { id: "kwWDTabsCue", title: "Scroll tabs", html: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` }),
          el("button", { id: "kwWDUndoBtn", class: "kwWDActionBtn", type: "button", title: "Undo (Ctrl+Z)", text: "↶", onclick: triggerUndo }),
          el("button", { id: "kwWDRedoBtn", class: "kwWDActionBtn", type: "button", title: "Redo (Ctrl+Shift+Z)", text: "↷", onclick: triggerRedo })
        ])
      ]),
      el("div", { id: "kwWDBody" }),
      el("div", { id: "kwWDFooter" }),
      el("div", { id: "kwWDResizeHandleBottom", onpointerdown: startResizeBottom }),
      el("div", { id: "kwWDResizeHandleCorner", onpointerdown: startResizeCorner })
    ]);

    state.header = state.root.querySelector("#kwWDHeader");
    state.aboutBtn = state.root.querySelector("#kwWDAboutBtn");
    state.tabsContainer = state.root.querySelector("#kwWDTabs");
    state.tabsBar = state.root.querySelector("#kwWDTabsLeft");
    state.tabsBarRight = state.root.querySelector("#kwWDTabsRight");
    state.footer = state.root.querySelector("#kwWDFooter");

    initBoneFooterAndDetection();
    state.undoBtn = state.root.querySelector("#kwWDUndoBtn");
    state.redoBtn = state.root.querySelector("#kwWDRedoBtn");
    state.body = state.root.querySelector("#kwWDBody");
    state.resizeBottom = state.root.querySelector("#kwWDResizeHandleBottom");
    state.resizeCorner = state.root.querySelector("#kwWDResizeHandleCorner");
    state.minimizeBtn = state.root.querySelector("#kwWDControls .kwWDBtn:nth-child(2)");
    state.closeBtn = state.root.querySelector("#kwWDControls .kwWDBtn:nth-child(3)");

    document.body.appendChild(state.root);

    state.tabsLeft = state.root.querySelector("#kwWDTabsLeft");
    state.tabsShade = state.root.querySelector("#kwWDTabsShade");
    state.tabsCue = state.root.querySelector("#kwWDTabsCue");
    state.tabsRight = state.root.querySelector("#kwWDTabsRight");

    const updateTabsCue = () => {
      if (!state.tabsLeft || !state.tabsCue || !state.tabsShade) return;

      const overflow = state.tabsLeft.scrollWidth > state.tabsLeft.clientWidth + 2;

      if (state.tabsRight) {
        state.tabsShade.style.right = (state.tabsRight.offsetWidth + 7) + "px";
      } else {
        state.tabsShade.style.right = "0px";
      }

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
    };
    state.updateTabsCue = updateTabsCue;
    state.tabsLeft.addEventListener("wheel", (e) => {
      if (!state.tabsLeft) return;
      if (state.tabsLeft.scrollWidth <= state.tabsLeft.clientWidth + 2) return;

      const dx = e.deltaX || 0;
      const dy = e.deltaY || 0;
      const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;

      state.tabsLeft.scrollLeft += delta;
      e.preventDefault();
    }, { passive: false });

    state.tabsLeft.addEventListener("scroll", updateTabsCue, { passive: true });
    window.addEventListener("resize", updateTabsCue);
    setTimeout(updateTabsCue, 0);
    setTimeout(updateTabsCue, 350);

    state.compact = el("div", { id: "kwWDCompact", onpointerdown: startCompactDrag }, [
      el("div", { id: "kwWDCompactTitle", text: "WITCH DOCK" }),
      el("button", { id: "kwWDCompactExpand", type: "button", text: "▣", title: "Expand", onclick: expandFromCompact })
    ]);
    state.compactExpandBtn = state.compact.querySelector("#kwWDCompactExpand");
    document.body.appendChild(state.compact);

    prefs.width = prefs.width || DEFAULTS.width;
    prefs.height = prefs.height || DEFAULTS.height;

    applyPositionAndSize();

    state.activeTab = prefs.activeTab || null;

    if (prefs.minimized) {
      prefs.lastOpenWidth = prefs.lastOpenWidth || prefs.width;
      prefs.lastOpenHeight = prefs.lastOpenHeight || prefs.height;
      savePrefs(prefs);
    }

    applyMinimizedState();
    showClosedCompact();

    for (const def of state.pending.splice(0)) mountTool(def);

    if (state.tabs.size && (prefs.activeTab == null || !state.tabs.has(prefs.activeTab))) {
      const first = state.tabs.keys().next().value;
      if (first) setActiveTab(first);
    } else if (prefs.activeTab && state.tabs.has(prefs.activeTab)) {
      setActiveTab(prefs.activeTab);
    }

    state.minWidth = computeMinDockWidthForActiveTab();
    enforceSizeConstraints();

    window.addEventListener("resize", () => {
      showClosedCompact();
      enforceSizeConstraints();
    });
  }

  UW.WitchDock = UW.WitchDock || {};
  UW.WitchDock.registerTool = registerTool;
  UW.WitchDock.ensureDock = buildUI;

  buildUI();
    installDockHotkey();
loadManifestAndTools();
})();

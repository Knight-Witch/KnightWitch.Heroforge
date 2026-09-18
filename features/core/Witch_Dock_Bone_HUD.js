(function () {
  "use strict";

  const FEATURE_ID = "witch-dock-bone-hud";
  const VERSION = "0.1.0";
  const BUILD = "0.1.0-extracted-bone-hud";
  const CONFIG = {
    scriptMeta: { name: "Witch Dock", version: "" },
    hotkeyText: "",
    copyText: null
  };
  let RUNTIME = null;

  function configure(options) {
    const opts = options && typeof options === "object" ? options : {};
    if (opts.scriptMeta && typeof opts.scriptMeta === "object") {
      CONFIG.scriptMeta = {
        name: typeof opts.scriptMeta.name === "string" ? opts.scriptMeta.name : "Witch Dock",
        version: typeof opts.scriptMeta.version === "string" ? opts.scriptMeta.version : ""
      };
    }
    if (typeof opts.copyText === "function") CONFIG.copyText = opts.copyText;
    return true;
  }

  function initLegacyBoneFooter(state) {
  if (state.boneInit) return state.__kwBoneDetect || null;
  if (!state.footer) return null;
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

  const meta = CONFIG.scriptMeta || { name: "Witch Dock", version: "" };
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

  const hotkeyLine = makeEl("div", { class: "kwWDFooterLine" }, CONFIG.hotkeyText || "");

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
      if (typeof CONFIG.copyText === "function") {
        CONFIG.copyText(text);
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
    retry,
    dispose() {
      detach();
      if (STATE.retryTimer) {
        clearTimeout(STATE.retryTimer);
        STATE.retryTimer = null;
      }
      try { row.remove(); } catch (_) {}
      try { hotkeyLine.remove(); } catch (_) {}
      const toastEl = document.getElementById("kwBoneHudToast");
      if (toastEl) try { toastEl.remove(); } catch (_) {}
    }
  };
  RUNTIME = { state, detector: STATE, row, value, copyBtn, hotkeyLine };
  return state.__kwBoneDetect;
}


  function init(options) {
    const opts = options && typeof options === "object" ? options : {};
    const footer = opts.footer || null;
    if (!footer) return null;
    if (typeof opts.hotkeyText === "string") CONFIG.hotkeyText = opts.hotkeyText;
    if (RUNTIME && RUNTIME.state && RUNTIME.state.footer === footer && RUNTIME.state.__kwBoneDetect) {
      return RUNTIME.state.__kwBoneDetect;
    }
    if (RUNTIME && RUNTIME.state && RUNTIME.state.__kwBoneDetect && typeof RUNTIME.state.__kwBoneDetect.dispose === "function") {
      try { RUNTIME.state.__kwBoneDetect.dispose(); } catch (_) {}
    }
    RUNTIME = null;
    const localState = { boneInit: false, footer, __kwBoneDetect: null };
    return initLegacyBoneFooter(localState);
  }

  function retry() {
    const handle = RUNTIME && RUNTIME.state ? RUNTIME.state.__kwBoneDetect : null;
    if (!handle || typeof handle.retry !== "function") return false;
    handle.retry();
    return true;
  }

  function getState() {
    const detector = RUNTIME && RUNTIME.detector ? RUNTIME.detector : null;
    const row = RUNTIME && RUNTIME.row ? RUNTIME.row : null;
    const value = RUNTIME && RUNTIME.value ? RUNTIME.value : null;
    const copyBtn = RUNTIME && RUNTIME.copyBtn ? RUNTIME.copyBtn : null;
    return {
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      configured: typeof CONFIG.copyText === "function",
      initialized: !!RUNTIME,
      rowConnected: !!(row && row.isConnected),
      rowVisible: !!(row && row.style.display !== "none"),
      valueText: value ? value.textContent : "",
      copyDisabled: !!(copyBtn && copyBtn.disabled),
      detectorAttached: !!(detector && detector.attached),
      failed: !!(detector && detector.failed),
      stopped: !!(detector && detector.stopped),
      tries: detector ? detector.tries : 0,
      lastBoneName: detector ? detector.lastBoneName : ""
    };
  }

  function dispose() {
    const handle = RUNTIME && RUNTIME.state ? RUNTIME.state.__kwBoneDetect : null;
    if (handle && typeof handle.dispose === "function") {
      try { handle.dispose(); } catch (_) {}
    }
    RUNTIME = null;
    return true;
  }

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  try {
    const previous = UW.KWWitchDockBoneHUD;
    if (previous && typeof previous.dispose === "function") previous.dispose();
  } catch (_) {}

  UW.KWWitchDockBoneHUD = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    configure,
    init,
    retry,
    getState,
    dispose
  });
})();
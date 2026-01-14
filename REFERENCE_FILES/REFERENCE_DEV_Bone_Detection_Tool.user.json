// ==UserScript==
// @name         BONE DETECTION TOOL - REFERENCE TOOL ONLY
// @version      0.1.0
// @description  Shows last clicked HF bone name (persist), with copy button. Standalone - INTENDED TO GRAFT INTO WITCH DOCK - REFERENCE FILE ONLY
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
  "use strict";

  const u = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

  const CSS = `
#kwBoneHud {
  position: fixed;
  left: 12px;
  bottom: 12px;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(18,18,20,0.92);
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: 0 12px 40px rgba(0,0,0,0.45);
  color: rgba(255,255,255,0.86);
  font: 11px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  max-width: min(920px, calc(100vw - 24px));
}
#kwBoneHudLabel { opacity: 0.85; white-space: nowrap; }
#kwBoneHudValue {
  opacity: 0.95;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: min(720px, calc(100vw - 220px));
}
#kwBoneHudBtns {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}
.kwBoneHudBtn {
  width: 34px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(0,0,0,0.22);
  color: rgba(255,255,255,0.85);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
}
.kwBoneHudBtn:hover { background: rgba(255,255,255,0.06); }
.kwBoneHudBtn:active { transform: translateY(1px); }
#kwBoneHudToast {
  position: fixed;
  left: 12px;
  bottom: 56px;
  z-index: 2147483647;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(18,18,20,0.95);
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: 0 10px 30px rgba(0,0,0,0.45);
  color: rgba(255,255,255,0.86);
  font: 11px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  opacity: 0;
  pointer-events: none;
  transition: opacity 140ms ease;
}
#kwBoneHudToast.show { opacity: 1; }
`;

  const STATE = {
    baseline: null,
    lastBoneName: "",
    delayMs: 35,
    candidates: null,
  };

  function addStyle() {
    if (typeof GM_addStyle === "function") GM_addStyle(CSS);
    else {
      const s = document.createElement("style");
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  }

  function makeEl(tag, attrs = {}, text = "") {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else el.setAttribute(k, v);
    }
    if (text) el.textContent = text;
    return el;
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

  function getHF() {
    return u?.HF || null;
  }

  function getSummonCircle() {
    const HF = getHF();
    return HF?.summonCircle || null;
  }

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

  // Multiple anchor paths (more forgiving than the last version).
  // These represent "places HF commonly stores the active rig object tree"
  // around summonCircle. We try several and keep whichever exist.
  function anchorBases() {
    return [
      "parent.parent.parent.children[5].object",
      "parent.parent.parent.children[4].object",
      "parent.parent.parent.children[6].object",
      "parent.parent.children[5].object",
      "parent.parent.children[4].object",
      "parent.children[5].object",
      "parent.children[4].object",
    ];
  }

  function buildCandidates(sc) {
    const out = [];
    const bases = anchorBases();

    for (const base of bases) {
      const node = safeGet(sc, base);
      if (!node) continue;

      // Direct name
      out.push(`summonCircle.${base}.name`);
      // Parent name
      out.push(`summonCircle.${base}.parent.name`);

      // children names
      for (let i = 0; i < 16; i++) out.push(`summonCircle.${base}.children[${i}].name`);

      // object children names (matches your probe logs)
      for (let i = 0; i < 16; i++) out.push(`summonCircle.${base}.object.children[${i}].name`);
    }

    // de-dupe
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

    // Prefer bind joints
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

  function setBone(elValue, name) {
    STATE.lastBoneName = name || "";
    if (!STATE.lastBoneName) {
      elValue.textContent = "(click a bone)";
      elValue.title = "";
      return;
    }
    elValue.textContent = STATE.lastBoneName;
    elValue.title = STATE.lastBoneName;
  }

  function buildUI() {
    const hud = makeEl("div", { id: "kwBoneHud" });
    const label = makeEl("div", { id: "kwBoneHudLabel" }, "Bone:");
    const value = makeEl("div", { id: "kwBoneHudValue" }, "(click a bone)");
    const btns = makeEl("div", { id: "kwBoneHudBtns" });

    const btnCopy = makeEl("button", { class: "kwBoneHudBtn", type: "button", title: "Copy bone name" });
    btnCopy.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M4 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
    btnCopy.addEventListener("click", () => {
      if (!STATE.lastBoneName) return toast("Nothing to copy yet");
      copyToClipboard(STATE.lastBoneName);
    });

    const btnX = makeEl("button", { class: "kwBoneHudBtn", type: "button", title: "Hide" }, "×");
    btnX.style.fontSize = "18px";
    btnX.style.lineHeight = "1";
    btnX.addEventListener("click", () => hud.remove());

    btns.appendChild(btnCopy);
    btns.appendChild(btnX);

    hud.appendChild(label);
    hud.appendChild(value);
    hud.appendChild(btns);

    document.body.appendChild(hud);
    return { value };
  }

  function ensureReady(sc) {
    if (!STATE.candidates || !STATE.candidates.length) {
      STATE.candidates = buildCandidates(sc);
      STATE.baseline = snapshot(sc, STATE.candidates);
    }
  }

  function captureEvent(elValue) {
    const sc = getSummonCircle();
    if (!sc) return;

    ensureReady(sc);

    const now = snapshot(sc, STATE.candidates);
    const delta = diffSnapshots(STATE.baseline, now);
    const best = pickBest(delta);

    // Only update when we got a real joint name
    if (best && best.value.includes("_bind_jnt")) {
      setBone(elValue, best.value);
    }

    // Always re-baseline
    STATE.baseline = now;
  }

  function main() {
    addStyle();
    const { value: elValue } = buildUI();
    setBone(elValue, "");

    const boot = setInterval(() => {
      const sc = getSummonCircle();
      if (!sc) return;
      clearInterval(boot);

      ensureReady(sc);

      const handler = () => setTimeout(() => captureEvent(elValue), STATE.delayMs);

      // HF selection often finalizes on pointerup; click is a backup
      document.addEventListener("pointerup", handler, true);
      document.addEventListener("click", handler, true);

      toast("Bone HUD ready");
    }, 250);
  }

  main();
})();

// ==UserScript==
// @name         Witch Dock Bone Selection Probe - DEV REFERENCE FILE ONLY
// @namespace    KnightWitch
// @version      0.1.0-probe3
// @description  Targeted selection probe: watches HF summonCircle rig node + local candidate diff to determine main bone user has selected.
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
#kwSelProbe{
  position: fixed;
  right: 12px;
  bottom: 12px;
  width: 560px;
  max-height: 60vh;
  z-index: 2147483647;
  background: rgba(18,18,20,0.94);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  color: rgba(255,255,255,0.86);
  font: 12px/1.25 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  box-shadow: 0 12px 40px rgba(0,0,0,0.45);
  overflow: hidden;
}
#kwSelProbeHeader{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 10px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.10);
}
#kwSelProbeTitle{
  font-weight: 650;
  letter-spacing: 0.3px;
  opacity: 0.95;
}
#kwSelProbeBtns{
  display:flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.kwSelProbeBtn{
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(0,0,0,0.28);
  color: rgba(255,255,255,0.82);
  border-radius: 8px;
  padding: 6px 8px;
  cursor: pointer;
  line-height: 1;
  font-size: 12px;
}
.kwSelProbeBtn:hover{ background: rgba(255,255,255,0.06); }
.kwSelProbeBtn:active{ transform: translateY(1px); }
.kwSelProbeBtnOn{
  border-color: rgba(140,200,255,0.55);
  background: rgba(140,200,255,0.10);
  color: rgba(220,240,255,0.92);
}
#kwSelProbeBody{
  padding: 10px;
  overflow: auto;
  max-height: calc(60vh - 44px);
}
#kwSelProbeStatus{
  opacity: 0.70;
  padding: 0 2px 8px 2px;
  font-size: 11px;
  display:flex;
  justify-content: space-between;
  gap: 10px;
}
#kwSelProbeStatusLeft{ overflow:hidden; text-overflow: ellipsis; white-space: nowrap; }
#kwSelProbeStatusRight{ flex: 0 0 auto; font-variant-numeric: tabular-nums; }
#kwSelProbeSelected{
  padding: 8px 10px;
  border: 1px solid rgba(140,200,255,0.22);
  background: rgba(140,200,255,0.06);
  border-radius: 10px;
  margin-bottom: 10px;
}
#kwSelProbeSelectedTop{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
}
#kwSelProbeSelectedName{
  font-weight: 650;
  word-break: break-all;
}
#kwSelProbeSelectedMeta{
  opacity: 0.55;
  font-size: 11px;
  margin-top: 4px;
  word-break: break-all;
}
.kwSelProbeCopy{
  flex: 0 0 auto;
  opacity: 0.85;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.25);
}
.kwSelProbeCopy:hover{ background: rgba(255,255,255,0.06); }

.kwSelProbeRow{
  display:flex;
  gap: 8px;
  align-items:flex-start;
  padding: 6px 8px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
  margin-bottom: 8px;
}
.kwSelProbeScore{
  width: 34px;
  flex: 0 0 34px;
  text-align: right;
  opacity: 0.65;
  font-variant-numeric: tabular-nums;
}
.kwSelProbeVal{
  flex: 1;
  min-width: 0;
  word-break: break-all;
  user-select: text;
}
.kwSelProbeMeta{
  flex: 0 0 240px;
  min-width: 0;
  word-break: break-all;
  opacity: 0.55;
  font-size: 11px;
  user-select: text;
}
.kwSelProbeFlash{
  animation: kwSelProbeFlash 240ms ease-out 1;
}
@keyframes kwSelProbeFlash{
  0% { background: rgba(140,200,255,0.20); border-color: rgba(140,200,255,0.55); }
  100% { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
}
`;

  GM_addStyle(CSS);

  const root = document.createElement("div");
  root.id = "kwSelProbe";
  root.innerHTML = `
    <div id="kwSelProbeHeader">
      <div id="kwSelProbeTitle">Selection Probe (Targeted)</div>
      <div id="kwSelProbeBtns">
        <button class="kwSelProbeBtn" id="kwSelProbePause">Pause</button>
        <button class="kwSelProbeBtn" id="kwSelProbeBaseline">Baseline</button>
        <button class="kwSelProbeBtn kwSelProbeBtnOn" id="kwSelProbeAutoClick">AutoClick: On</button>
        <button class="kwSelProbeBtn" id="kwSelProbeCapture">Capture</button>
        <button class="kwSelProbeBtn" id="kwSelProbeClear">Clear</button>
        <button class="kwSelProbeBtn" id="kwSelProbeLog">Log: Off</button>
        <button class="kwSelProbeBtn" id="kwSelProbeClose">×</button>
      </div>
    </div>
    <div id="kwSelProbeBody">
      <div id="kwSelProbeStatus">
        <div id="kwSelProbeStatusLeft"></div>
        <div id="kwSelProbeStatusRight"></div>
      </div>
      <div id="kwSelProbeSelected">
        <div id="kwSelProbeSelectedTop">
          <div id="kwSelProbeSelectedName">Selected: (none)</div>
          <div class="kwSelProbeCopy" id="kwSelProbeSelectedCopy" title="Copy selected">⧉</div>
        </div>
        <div id="kwSelProbeSelectedMeta"></div>
      </div>
      <div id="kwSelProbeList"></div>
    </div>
  `;
  document.body.appendChild(root);

  const elList = root.querySelector("#kwSelProbeList");
  const elStatusLeft = root.querySelector("#kwSelProbeStatusLeft");
  const elStatusRight = root.querySelector("#kwSelProbeStatusRight");
  const elSelName = root.querySelector("#kwSelProbeSelectedName");
  const elSelMeta = root.querySelector("#kwSelProbeSelectedMeta");
  const btnSelCopy = root.querySelector("#kwSelProbeSelectedCopy");

  const btnPause = root.querySelector("#kwSelProbePause");
  const btnBaseline = root.querySelector("#kwSelProbeBaseline");
  const btnAutoClick = root.querySelector("#kwSelProbeAutoClick");
  const btnCapture = root.querySelector("#kwSelProbeCapture");
  const btnClear = root.querySelector("#kwSelProbeClear");
  const btnLog = root.querySelector("#kwSelProbeLog");
  const btnClose = root.querySelector("#kwSelProbeClose");

  let paused = false;
  let autoClick = true;
  let logging = false;

  btnPause.addEventListener("click", () => {
    paused = !paused;
    btnPause.textContent = paused ? "Resume" : "Pause";
  });

  btnAutoClick.addEventListener("click", () => {
    autoClick = !autoClick;
    btnAutoClick.textContent = autoClick ? "AutoClick: On" : "AutoClick: Off";
    btnAutoClick.classList.toggle("kwSelProbeBtnOn", autoClick);
  });

  btnLog.addEventListener("click", () => {
    logging = !logging;
    btnLog.textContent = logging ? "Log: On" : "Log: Off";
    btnLog.classList.toggle("kwSelProbeBtnOn", logging);
  });

  btnClose.addEventListener("click", () => {
    root.remove();
    paused = true;
    window.removeEventListener("pointerup", onPointerUp, true);
  });

  function copyText(text) {
    try {
      if (typeof GM_setClipboard === "function") {
        GM_setClipboard(text, "text");
        return true;
      }
    } catch {}
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Heuristics: prefer "real" bones over helper bones
  const RX_GOOD = /(bind_jnt)/i;
  const RX_BAD = /(thickness|fat|stretch|posture|offset|helpers|container)/i;
  const RX_KINDOF = /(deltoid|clav|arm|forearm|hand|finger|thumb|wrist|shoulder)/i;

  function scoreName(name) {
    if (!name || typeof name !== "string") return -999;
    let s = 0;
    if (RX_GOOD.test(name)) s += 12;
    if (RX_KINDOF.test(name)) s += 6;
    if (name.startsWith("main_")) s += 3;
    if (/_\d{2,}_/.test(name) || /_\d{2,}/.test(name)) s += 1;
    if (RX_BAD.test(name)) s -= 14;
    if (name.length > 140) s -= 3;
    return s;
  }

  function isObj(v) {
    return v && (typeof v === "object" || typeof v === "function");
  }

  function getRigNode() {
    try {
      if (!u || !u.HF) return null;
      const HF = u.HF;
      const sc = HF.summonCircle;
      if (!sc) return null;

      // Your paths consistently show: summonCircle.parent.parent.parent.children[5]
      const node =
        sc?.parent?.parent?.parent?.children?.[5] ??
        null;

      if (!node) return null;
      if (!node.object) return null;
      return node;
    } catch {
      return null;
    }
  }

  function pushCandidate(out, srcPath, obj) {
    try {
      const nm = obj && obj.name;
      if (!nm || typeof nm !== "string") return;
      out.push({ name: nm, where: srcPath, obj });
    } catch {}
  }

  function collectCandidates() {
    const node = getRigNode();
    const out = [];
    if (!node) return { node: null, candidates: out };

    const o = node.object;
    pushCandidate(out, "node.object.name", o);
    if (o && o.parent) pushCandidate(out, "node.object.parent.name", o.parent);

    // children of the object (captures your deltoid: object.children[2].name)
    if (o && Array.isArray(o.children)) {
      const max = Math.min(12, o.children.length);
      for (let i = 0; i < max; i++) pushCandidate(out, `node.object.children[${i}].name`, o.children[i]);
    }

    // siblings via parent children (helps when HF selects a helper but the real one is adjacent)
    if (o && o.parent && Array.isArray(o.parent.children)) {
      const max = Math.min(12, o.parent.children.length);
      for (let i = 0; i < max; i++) pushCandidate(out, `node.object.parent.children[${i}].name`, o.parent.children[i]);
    }

    // de-dupe by name+where
    const seen = new Set();
    const deduped = [];
    for (let i = 0; i < out.length; i++) {
      const k = `${out[i].where}::${out[i].name}`;
      if (seen.has(k)) continue;
      seen.add(k);
      deduped.push(out[i]);
    }

    return { node, candidates: deduped };
  }

  function renderCandidates(rows, flashSet) {
    elList.innerHTML = "";
    const flash = flashSet || new Set();

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const row = document.createElement("div");
      row.className = "kwSelProbeRow";
      if (flash.has(r._k)) row.classList.add("kwSelProbeFlash");

      row.innerHTML = `
        <div class="kwSelProbeScore">${r.sc}</div>
        <div class="kwSelProbeVal">${escapeHtml(r.name)}</div>
        <div class="kwSelProbeMeta">${escapeHtml(r.where)}</div>
        <div class="kwSelProbeCopy" title="Copy">⧉</div>
      `;

      const btn = row.querySelector(".kwSelProbeCopy");
      const isLogging = logging;
      const payload = { value: r.name, src: "HF", path: `summonCircle.parent.parent.parent.children[5].${r.where}` };

      btn.addEventListener("click", () => {
        copyText(r.name);
        if (isLogging) console.log("[SelectionProbe OWNER-ish]", payload, { owner: r.obj });
        btn.textContent = "✓";
        setTimeout(() => (btn.textContent = "⧉"), 450);
      });

      elList.appendChild(row);
    }
  }

  let baselineSet = null;
  let prevSet = null;
  let lastSelected = null;

  function pickSelected(cands, changedNames) {
    // 1) If something new appeared/changed this capture, prefer that (unless it's a known bad helper)
    if (changedNames && changedNames.size) {
      let best = null;
      let bestSc = -9999;

      for (const c of cands) {
        if (!changedNames.has(c.name)) continue;
        const sc = scoreName(c.name);
        if (sc > bestSc) { bestSc = sc; best = c; }
      }

      if (best) return { ...best, sc: bestSc, reason: "delta" };
    }

    // 2) Otherwise just pick best-scoring overall
    let best = null;
    let bestSc = -9999;
    for (let i = 0; i < cands.length; i++) {
      const sc = scoreName(cands[i].name);
      if (sc > bestSc) { bestSc = sc; best = cands[i]; }
    }
    if (best) return { ...best, sc: bestSc, reason: "best" };

    return null;
  }

  function setSelected(sel, node) {
    lastSelected = sel;

    if (!sel) {
      elSelName.textContent = "Selected: (none)";
      elSelMeta.textContent = "";
      return;
    }

    elSelName.textContent = `Selected: ${sel.name}`;
    elSelMeta.textContent = `via ${sel.reason} | ${sel.where}`;

    if (logging) {
      console.log("[SelectionProbe SELECTED]", {
        value: sel.name,
        src: "HF",
        path: `summonCircle.parent.parent.parent.children[5].${sel.where}`,
        reason: sel.reason,
        nodeObjectName: node && node.object ? node.object.name : null
      }, { owner: sel.obj });
    }
  }

  btnSelCopy.addEventListener("click", () => {
    if (!lastSelected) return;
    copyText(lastSelected.name);
    btnSelCopy.textContent = "✓";
    setTimeout(() => (btnSelCopy.textContent = "⧉"), 450);
  });

  btnBaseline.addEventListener("click", () => {
    const { node, candidates } = collectCandidates();
    baselineSet = new Set(candidates.map(c => c.name));
    elStatusLeft.textContent = "Baseline captured";
    elStatusRight.textContent = `cands ${candidates.length}`;
    if (logging) console.log("[SelectionProbe] baseline", { candidates: candidates.map(c => c.name) });
    renderCandidates(
      candidates
        .map(c => ({ ...c, sc: scoreName(c.name), _k: `${c.where}::${c.name}` }))
        .sort((a,b) => b.sc - a.sc),
      new Set()
    );
    setSelected(null, node);
    prevSet = new Set(candidates.map(c => c.name));
  });

  btnCapture.addEventListener("click", () => captureOnce("manual"));

  btnClear.addEventListener("click", () => {
    baselineSet = null;
    prevSet = null;
    lastSelected = null;
    elList.innerHTML = "";
    setSelected(null, null);
    elStatusLeft.textContent = "Cleared";
    elStatusRight.textContent = "";
  });

  function captureOnce(reason) {
    if (paused) return;

    const { node, candidates } = collectCandidates();
    const names = new Set(candidates.map(c => c.name));

    const base = baselineSet || prevSet;
    const changed = new Set();
    if (base) {
      for (const nm of names) if (!base.has(nm)) changed.add(nm);
    } else {
      for (const nm of names) changed.add(nm);
    }

    const flash = new Set();
    for (const c of candidates) {
      if (changed.has(c.name)) flash.add(`${c.where}::${c.name}`);
    }

    const rows = candidates
      .map(c => ({ ...c, sc: scoreName(c.name), _k: `${c.where}::${c.name}` }))
      .sort((a,b) => b.sc - a.sc);

    const sel = pickSelected(candidates, changed);
    setSelected(sel, node);

    elStatusLeft.textContent = `Capture (${reason})`;
    elStatusRight.textContent = `cands ${candidates.length} | new ${changed.size}`;

    renderCandidates(rows, flash);

    prevSet = names;
  }

  function onPointerUp(e) {
    if (!autoClick) return;
    const t = e.target;
    if (t && t.closest && t.closest("#kwSelProbe")) return;
    captureOnce("click");
  }

  window.addEventListener("pointerup", onPointerUp, true);

  // initial tick so it doesn't look dead
  setTimeout(() => captureOnce("init"), 800);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      paused = !paused;
      btnPause.textContent = paused ? "Resume" : "Pause";
    }
  });
})();

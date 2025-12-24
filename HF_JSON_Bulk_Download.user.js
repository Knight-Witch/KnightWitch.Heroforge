// ==UserScript==
// @name         HF Backup My Library (Bulk JSON)
// @namespace    hf-bulk-backup
// @version      0.4.1
// @description  Backup your entire Hero Forge library locally with one click. Keeps projects organized by your save folders. Depending on library size, this may take a while; let it finish. Progress is shown in the dock.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-end
// @grant        none
// @updateURL   https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/HF_JSON_Bulk_Download.user.js
// @downloadURL https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/HF_JSON_Bulk_Download.user.js
// ==/UserScript==

(function () {
  "use strict";

  const ROOT = location.origin;
  const PAGE_SIZE = 750;
  const CONCURRENCY = 5;

  const JSZIP_URL = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
  const POS_KEY = "hf_bulk_backup_dock_pos_v1";

  const state = {
    running: false,
    zip: null,
    failures: [],
    markNameById: new Map(),
    configsTotal: 0,
    configsDone: 0,
    ui: {
      dock: null,
      header: null,
      title: null,
      btn: null,
      pauseBtn: null,
      hideBtn: null,
      status: null,
      barWrap: null,
      bar: null,
      log: null,
    },
    paused: false,
  };

  function safeName(s) {
    const x = String(s || "").trim() || "Unnamed";
    return x.replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_").replace(/\s+/g, " ").trim();
  }

  function el(tag, style, text) {
    const n = document.createElement(tag);
    if (style) Object.assign(n.style, style);
    if (text != null) n.textContent = text;
    return n;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function loadDockPos() {
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw);
      if (typeof p?.x !== "number" || typeof p?.y !== "number") return null;
      return p;
    } catch {
      return null;
    }
  }

  function saveDockPos(x, y) {
    localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
  }

  function setStatus(s) {
    state.ui.status.textContent = s;
  }

  function setProgress(done, total) {
    state.configsDone = done;
    state.configsTotal = total;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    state.ui.bar.style.width = `${pct}%`;
  }

  function logLine(s) {
    state.ui.log.textContent = (s + "\n" + state.ui.log.textContent).slice(0, 25000);
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function waitIfPaused() {
    while (state.paused) await sleep(150);
  }

  async function loadScript(url) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = url;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("script load failed: " + url));
      document.documentElement.appendChild(s);
    });
  }

  async function fetchJson(url, init) {
    const r = await fetch(url, init);
    const ct = (r.headers.get("content-type") || "").toLowerCase();
    const text = await r.text();
    if (!r.ok) throw new Error(`${r.status} ${r.statusText} ${url}`);
    if (!ct.includes("json")) {
      const t = text.trim();
      if (t.startsWith("{") || t.startsWith("[")) return JSON.parse(t);
      throw new Error("non-json response: " + url);
    }
    return JSON.parse(text);
  }

  async function waitForHFReady() {
    const start = Date.now();
    const hardTimeoutMs = 20000;
    const stableMs = 1200;

    let lastChange = Date.now();
    let lastDomCount = document.getElementsByTagName("*").length;

    for (;;) {
      const now = Date.now();
      if (now - start > hardTimeoutMs) return;

      const domCount = document.getElementsByTagName("*").length;
      if (domCount !== lastDomCount) {
        lastDomCount = domCount;
        lastChange = now;
      }

      const hasHF = typeof window.HF !== "undefined";
      const hasCK = typeof window.CK !== "undefined";

      if ((hasHF || hasCK) && now - lastChange > stableMs) return;

      await sleep(150);
    }
  }

  async function getAllConfigMeta() {
    const all = [];
    let offset = 0;

    for (;;) {
      await waitIfPaused();
      const url = `${ROOT}/config-service/all_user_config/?offset=${offset}&meta_only=true`;
      setStatus(`Fetching library index… offset=${offset}`);
      const data = await fetchJson(url, { credentials: "include" });
      const chunk = Array.isArray(data?.configs) ? data.configs : [];
      if (!chunk.length) break;
      all.push(...chunk);
      offset += chunk.length;
      if (chunk.length < PAGE_SIZE) break;
      await sleep(50);
    }

    return all;
  }

  async function loadMarks() {
    const url = `${ROOT}/config-service/save_config_mark/`;
    setStatus("Reading folder names…");
    const data = await fetchJson(url, { credentials: "include" });
    const m = new Map();
    const marks = Array.isArray(data?.marks) ? data.marks : [];
    for (const it of marks) {
      const id = it?.id;
      const name = it?.mark_name;
      if (id && name) m.set(String(id), String(name));
    }
    state.markNameById = m;
    logLine(`Folder marks loaded: ${m.size}`);
  }

  function folderPathForConfig(cfg) {
    const mark = cfg?.mark ? String(cfg.mark) : null;
    if (!mark) return "Unsorted";
    const name = state.markNameById.get(mark);
    return safeName(name || `mark_${mark}`);
  }

  async function pMap(items, worker, concurrency) {
    const out = new Array(items.length);
    let i = 0;

    async function runOne() {
      for (;;) {
        const idx = i++;
        if (idx >= items.length) return;
        out[idx] = await worker(items[idx], idx);
      }
    }

    const runners = [];
    for (let k = 0; k < concurrency; k++) runners.push(runOne());
    await Promise.all(runners);
    return out;
  }

  async function runBackup() {
    if (state.running) return;
    state.running = true;
    state.failures = [];
    setProgress(0, 0);

    state.ui.btn.disabled = true;
    state.ui.btn.style.opacity = "0.6";

    try {
      setStatus("Loading ZIP engine…");
      if (!window.JSZip) await loadScript(JSZIP_URL);
      state.zip = new window.JSZip();

      const configs = await getAllConfigMeta();
      logLine(`Configs indexed: ${configs.length}`);

      await loadMarks();

      state.zip.file("meta/all_user_config_meta.json", JSON.stringify({ configs }, null, 2));
      state.zip.file(
        "meta/marks.json",
        JSON.stringify([...state.markNameById.entries()].map(([id, mark_name]) => ({ id, mark_name })), null, 2)
      );

      setProgress(0, configs.length);
      setStatus("Downloading configs…");

      let done = 0;
      await pMap(
        configs,
        async (cfg) => {
          await waitIfPaused();

          const id = cfg?.config_id;
          const folder = folderPathForConfig(cfg);
          const name = safeName(cfg?.meta?.character_name || `config_${id}`);
          const file = `${folder}/${name}__${id}.json`;
          const url = `${ROOT}/config-service/user_config/${encodeURIComponent(String(id))}`;

          try {
            const data = await fetchJson(url, { credentials: "include" });
            const payload = data?.config ?? data;
            state.zip.file(`configs/${file}`, JSON.stringify(payload, null, 2));
          } catch (e) {
            const err = String(e.message || e);
            state.failures.push({ url, error: err, config_id: id });
            state.zip.file(`configs_failed/${file}`, JSON.stringify({ error: err, url }, null, 2));
          }

          done++;
          setProgress(done, configs.length);
          if (done % 25 === 0) setStatus(`Downloading configs… ${done}/${configs.length}`);
        },
        CONCURRENCY
      );

      setStatus("Building ZIP…");
      const blob = await state.zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });

      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `heroforge-json-backup_${stamp}${state.failures.length ? "_WITH_FAILURES" : ""}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (state.failures.length) {
        logLine(`Failures: ${state.failures.length}`);
        logLine(JSON.stringify(state.failures.slice(0, 50), null, 2));
        setStatus(`Done. ZIP downloaded. Failures: ${state.failures.length}.`);
      } else {
        setStatus("Done. ZIP downloaded.");
      }
    } finally {
      state.running = false;
      state.ui.btn.disabled = false;
      state.ui.btn.style.opacity = "1";
    }
  }

  function setupDock() {
    if (state.ui.dock) return;

    const dock = el("div", {
      position: "fixed",
      zIndex: "2147483647",
      width: "360px",
      maxWidth: "calc(100vw - 24px)",
      background: "rgba(18,18,22,0.96)",
      border: "1px solid rgba(255,255,255,0.14)",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 10px 34px rgba(0,0,0,0.38)",
      font: "12px/1.35 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      color: "#eee",
      userSelect: "none",
    });

    const header = el("div", {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px",
      borderBottom: "1px solid rgba(255,255,255,0.10)",
      background: "rgba(255,255,255,0.04)",
      cursor: "grab",
    });

    const title = el("div", { fontWeight: "700", flex: "1 1 auto" }, "Backup My Library");

    const btn = el(
      "button",
      {
        flex: "0 0 auto",
        padding: "7px 10px",
        borderRadius: "9px",
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(0,0,0,0.25)",
        color: "#eee",
        cursor: "pointer",
        userSelect: "none",
      },
      "Download All"
    );

    const pauseBtn = el(
      "button",
      {
        flex: "0 0 auto",
        padding: "7px 10px",
        borderRadius: "9px",
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(0,0,0,0.25)",
        color: "#eee",
        cursor: "pointer",
        userSelect: "none",
      },
      "Pause"
    );

    const hideBtn = el(
      "button",
      {
        flex: "0 0 auto",
        padding: "7px 10px",
        borderRadius: "9px",
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(0,0,0,0.25)",
        color: "#eee",
        cursor: "pointer",
        userSelect: "none",
      },
      "Hide"
    );

    header.appendChild(title);
    header.appendChild(btn);
    header.appendChild(pauseBtn);
    header.appendChild(hideBtn);

    const status = el(
      "div",
      {
        padding: "8px 10px",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        userSelect: "text",
      },
      "Ready."
    );

    const barWrap = el("div", {
      padding: "10px",
      borderBottom: "1px solid rgba(255,255,255,0.10)",
    });

    const track = el("div", {
      width: "100%",
      height: "10px",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.10)",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.10)",
    });

    const bar = el("div", {
      width: "0%",
      height: "100%",
      background: "rgba(255,255,255,0.65)",
    });

    track.appendChild(bar);
    barWrap.appendChild(track);

    const log = el("div", {
      padding: "8px 10px",
      maxHeight: "220px",
      overflow: "auto",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      userSelect: "text",
    }, "");

    dock.appendChild(header);
    dock.appendChild(status);
    dock.appendChild(barWrap);
    dock.appendChild(log);
    document.documentElement.appendChild(dock);

    const pos = loadDockPos();
    const startX = pos?.x ?? (window.innerWidth - 12 - 360);
    const startY = pos?.y ?? (window.innerHeight - 12 - 260);
    dock.style.left = `${clamp(startX, 12, window.innerWidth - 12 - dock.offsetWidth)}px`;
    dock.style.top = `${clamp(startY, 12, window.innerHeight - 12 - dock.offsetHeight)}px`;

    let dragging = false;
    let grabX = 0;
    let grabY = 0;

    header.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      dragging = true;
      header.style.cursor = "grabbing";
      grabX = e.clientX - dock.getBoundingClientRect().left;
      grabY = e.clientY - dock.getBoundingClientRect().top;
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const x = clamp(e.clientX - grabX, 12, window.innerWidth - 12 - dock.offsetWidth);
      const y = clamp(e.clientY - grabY, 12, window.innerHeight - 12 - dock.offsetHeight);
      dock.style.left = `${x}px`;
      dock.style.top = `${y}px`;
      saveDockPos(x, y);
    });

    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      header.style.cursor = "grab";
    });

    btn.addEventListener("click", () => runBackup());

    pauseBtn.addEventListener("click", () => {
      state.paused = !state.paused;
      pauseBtn.textContent = state.paused ? "Resume" : "Pause";
      if (state.paused) setStatus("Paused.");
      else setStatus(state.running ? `Resumed. Downloading… ${state.configsDone}/${state.configsTotal}` : "Ready.");
    });

    hideBtn.addEventListener("click", () => {
      dock.style.display = "none";
      window.__hfBackupDockShow = () => (dock.style.display = "block");
    });

    state.ui.dock = dock;
    state.ui.header = header;
    state.ui.title = title;
    state.ui.btn = btn;
    state.ui.pauseBtn = pauseBtn;
    state.ui.hideBtn = hideBtn;
    state.ui.status = status;
    state.ui.barWrap = barWrap;
    state.ui.bar = bar;
    state.ui.log = log;
  }

  (async () => {
    await waitForHFReady();
    setupDock();
  })();
})();

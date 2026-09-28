(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

  const TOOL_ID = "json-tool";
  const VERSION = "1.1.1";
  const BUILD = "1.1.1-diagnostic-uw-init";
  const DIAG_EVENT_LIMIT = 20;
  const DIAG_FAILURE_LIMIT = 20;

  function safeName(s) {
    const x = String(s || "").trim() || "Unnamed";
    return x.replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_").replace(/\s+/g, " ").trim();
  }

  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === "class") n.className = v;
        else if (k === "text") n.textContent = v;
        else if (k === "html") n.innerHTML = v;
        else n.setAttribute(k, v);
      }
    }
    if (children != null) {
      const arr = Array.isArray(children) ? children : [children];
      for (const c of arr) {
        if (c == null) continue;
        n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      }
    }
    return n;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
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

  function copyText(text) {
    if (!text) return false;

    try {
      if (typeof GM_setClipboard === "function") {
        GM_setClipboard(text, { type: "text", mimetype: "text/plain" });
        return true;
      }
    } catch {}

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      return true;
    }

    return false;
  }

  function downloadBlob(blob, filename) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  function ensureStyles() {
    if (document.getElementById("kwWDJsonToolStyles")) return;

    const css = `
#kwWDJsonToolRoot{ display:flex; flex-direction:column; gap:10px; }
#kwWDJsonToolTop{ display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
#kwWDJsonToolTop .kwWDJsonBtn{
  height: 24px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: #eee;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15px;
  cursor: default;
}
#kwWDJsonToolTop .kwWDJsonBtn:hover{ background: rgba(255,255,255,0.12); }
#kwWDJsonToolTop .kwWDJsonBtn:disabled{ opacity: 0.5; cursor: default; }
#kwWDJsonToolStatus{
  padding: 8px 10px;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 6px;
  background: rgba(0,0,0,0.20);
  color: rgba(255,255,255,0.86);
  font-size: 11px;
  line-height: 1.25;
  white-space: pre-wrap;
  word-break: break-word;
  user-select: text;
}
#kwWDJsonToolBarWrap{
  padding: 8px 10px;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 6px;
  background: rgba(0,0,0,0.18);
}
#kwWDJsonToolTrack{
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.10);
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.10);
}
#kwWDJsonToolBar{
  width: 0%;
  height: 100%;
  background: rgba(255,255,255,0.65);
}
#kwWDJsonToolLog{
  padding: 8px 10px;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 6px;
  background: rgba(0,0,0,0.18);
  max-height: 220px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  user-select: text;
  color: rgba(255,255,255,0.82);
  font-size: 11px;
  line-height: 1.25;
}
`;
    const style = document.createElement("style");
    style.id = "kwWDJsonToolStyles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildTool() {
    ensureStyles();

    const ROOT = location.origin;
    const PAGE_SIZE = 750;
    const CONCURRENCY = 5;
    const JSZIP_URL = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";

    const state = {
      running: false,
      paused: false,
      zip: null,
      failures: [],
      markNameById: new Map(),
      configsTotal: 0,
      configsDone: 0,
      diagnostics: {
        stage: "idle", operationStartedAt: 0, lastProgressAt: 0, pagesFetched: 0,
        indexComplete: false, marksComplete: false, transferSuccess: 0, transferFailures: 0,
        archiveStartedAt: 0, archiveCompletedAt: 0, archiveBytes: null,
        downloadAttempted: false, downloadSucceeded: false, recentFailures: [], events: []
      },
      ui: {
        downloadBtn: null,
        pauseBtn: null,
        status: null,
        bar: null,
        log: null
      }
    };


    function diagEvent(type, detail) {
      const row = { at: Date.now(), type: String(type || "unknown"), detail: detail && typeof detail === "object" ? { ...detail } : (detail == null ? null : String(detail).slice(0, 300)) };
      state.diagnostics.events.push(row);
      while (state.diagnostics.events.length > DIAG_EVENT_LIMIT) state.diagnostics.events.shift();
      state.diagnostics.lastProgressAt = row.at;
    }
    function diagFailure(stage, error, httpStatus) {
      const message = String(error && error.message ? error.message : error || "unknown");
      const safe = message.replace(/https?:\/\/[^\s]+/gi, "[url]").replace(/\b\d{5,}\b/g, "[id]").slice(0, 700);
      const row = { at: Date.now(), stage: String(stage || "unknown"), httpStatus: Number.isFinite(Number(httpStatus)) ? Number(httpStatus) : null, message: safe };
      state.diagnostics.recentFailures.push(row);
      while (state.diagnostics.recentFailures.length > DIAG_FAILURE_LIMIT) state.diagnostics.recentFailures.shift();
      diagEvent("failure", { stage: row.stage, httpStatus: row.httpStatus });
    }
    function setDiagStage(stage) {
      state.diagnostics.stage = String(stage || "idle");
      state.diagnostics.lastProgressAt = Date.now();
    }
    function diagnosticState() {
      const d = state.diagnostics;
      return {
        featureId: "json-tool", version: VERSION, build: BUILD,
        running: !!state.running, paused: !!state.paused, stage: d.stage,
        configsTotal: Number(state.configsTotal) || 0, configsDone: Number(state.configsDone) || 0,
        progress: state.configsTotal > 0 ? state.configsDone / state.configsTotal : 0,
        pageSize: PAGE_SIZE, concurrency: CONCURRENCY, jsZipPresent: !!window.JSZip,
        zipInitialized: !!state.zip, markCount: state.markNameById ? state.markNameById.size : 0,
        failureCount: Array.isArray(state.failures) ? state.failures.length : 0,
        operationStartedAt: d.operationStartedAt || 0, lastProgressAt: d.lastProgressAt || 0,
        pagesFetched: d.pagesFetched || 0, indexComplete: !!d.indexComplete, marksComplete: !!d.marksComplete,
        transferSuccess: d.transferSuccess || 0, transferFailures: d.transferFailures || 0,
        archive: { startedAt: d.archiveStartedAt || 0, completedAt: d.archiveCompletedAt || 0, sizeBytes: d.archiveBytes, downloadAttempted: !!d.downloadAttempted, downloadSucceeded: !!d.downloadSucceeded },
        recentFailures: d.recentFailures.map((row) => ({ ...row })),
        events: d.events.map((row) => ({ ...row }))
      };
    }

    function setStatus(s) {
      state.ui.status.textContent = s;
    }

    function setProgress(done, total) {
      state.configsDone = done;
      state.configsTotal = total;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      state.ui.bar.style.width = `${clamp(pct, 0, 100)}%`;
    }

    function logLine(s) {
      state.ui.log.textContent = (s + "\n" + state.ui.log.textContent).slice(0, 25000);
    }

    async function waitIfPaused() {
      while (state.paused) await sleep(150);
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
        state.diagnostics.pagesFetched += 1;
        diagEvent("index-page", { count: chunk.length, offset });
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
      state.diagnostics.marksComplete = true;
      diagEvent("marks-complete", { count: m.size });
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
      state.diagnostics = {
        stage: "starting", operationStartedAt: Date.now(), lastProgressAt: Date.now(), pagesFetched: 0,
        indexComplete: false, marksComplete: false, transferSuccess: 0, transferFailures: 0,
        archiveStartedAt: 0, archiveCompletedAt: 0, archiveBytes: null,
        downloadAttempted: false, downloadSucceeded: false, recentFailures: [], events: []
      };
      diagEvent("backup-requested", null);
      setProgress(0, 0);

      state.ui.downloadBtn.disabled = true;

      try {
        await waitForHFReady();

        setDiagStage("dependency");
        setStatus("Loading ZIP engine…");
        diagEvent("jszip-load-start", { alreadyPresent: !!window.JSZip });
        try { if (!window.JSZip) await loadScript(JSZIP_URL); }
        catch (error) { diagFailure("dependency", error); throw error; }
        state.zip = new window.JSZip();
        diagEvent("jszip-load-complete", null);

        setDiagStage("index");
        let configs;
        try {
          configs = await getAllConfigMeta();
          state.diagnostics.indexComplete = true;
          diagEvent("index-complete", { count: configs.length });
        } catch (error) { diagFailure("index", error); throw error; }
        logLine(`Configs indexed: ${configs.length}`);

        setDiagStage("marks");
        try { await loadMarks(); }
        catch (error) { diagFailure("marks", error); throw error; }

        state.zip.file("meta/all_user_config_meta.json", JSON.stringify({ configs }, null, 2));
        state.zip.file(
          "meta/marks.json",
          JSON.stringify([...state.markNameById.entries()].map(([id, mark_name]) => ({ id, mark_name })), null, 2)
        );

        setProgress(0, configs.length);
        setDiagStage("transfer");
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
              state.diagnostics.transferSuccess += 1;
            } catch (e) {
              const err = String(e.message || e);
              state.failures.push({ url, error: err, config_id: id });
              state.zip.file(`configs_failed/${file}`, JSON.stringify({ error: err, url }, null, 2));
              state.diagnostics.transferFailures += 1;
              diagFailure("config-fetch", e);
            }

            done++;
            setProgress(done, configs.length);
            if (done === configs.length || done % 25 === 0) diagEvent("transfer-progress", { done, total: configs.length });
            if (done % 25 === 0) setStatus(`Downloading configs… ${done}/${configs.length}`);
          },
          CONCURRENCY
        );

        setDiagStage("archive");
        setStatus("Building ZIP…");
        state.diagnostics.archiveStartedAt = Date.now();
        diagEvent("archive-start", { compression: "DEFLATE", level: 6 });
        let blob;
        try {
          blob = await state.zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
          state.diagnostics.archiveCompletedAt = Date.now();
          state.diagnostics.archiveBytes = Number(blob && blob.size) || 0;
          diagEvent("archive-complete", { sizeBytes: state.diagnostics.archiveBytes });
        } catch (error) { diagFailure("archive-generate", error); throw error; }

        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `heroforge-json-backup_${stamp}${state.failures.length ? "_WITH_FAILURES" : ""}.zip`;
        setDiagStage("download");
        state.diagnostics.downloadAttempted = true;
        try {
          downloadBlob(blob, filename);
          state.diagnostics.downloadSucceeded = true;
          diagEvent("download-complete", { sizeBytes: Number(blob && blob.size) || 0 });
        } catch (error) { diagFailure("download", error); throw error; }

        if (state.failures.length) {
          logLine(`Failures: ${state.failures.length}`);
          logLine(JSON.stringify(state.failures.slice(0, 50), null, 2));
          setStatus(`Done. ZIP downloaded. Failures: ${state.failures.length}.`);
        } else {
          setStatus("Done. ZIP downloaded.");
        }
        setDiagStage(state.failures.length ? "complete-with-failures" : "complete");
      } finally {
        state.running = false;
        state.ui.downloadBtn.disabled = false;
      }
    }

    function buildUI(api, mount) {
      const section = api.ui.createSection({ id: "json-bulk-backup", title: "Backup My Library (Bulk JSON)" });

      const root = el("div", { id: "kwWDJsonToolRoot" });

      const top = el("div", { id: "kwWDJsonToolTop" });
      const downloadBtn = el("button", { class: "kwWDJsonBtn", type: "button", text: "Download All" });
      const pauseBtn = el("button", { class: "kwWDJsonBtn", type: "button", text: "Pause" });
      const copyFailuresBtn = el("button", { class: "kwWDJsonBtn", type: "button", text: "Copy Failures" });
      top.appendChild(downloadBtn);
      top.appendChild(pauseBtn);
      top.appendChild(copyFailuresBtn);

      const status = el("div", { id: "kwWDJsonToolStatus", text: "Ready." });

      const barWrap = el("div", { id: "kwWDJsonToolBarWrap" });
      const track = el("div", { id: "kwWDJsonToolTrack" });
      const bar = el("div", { id: "kwWDJsonToolBar" });
      track.appendChild(bar);
      barWrap.appendChild(track);

      const log = el("div", { id: "kwWDJsonToolLog" }, "");

      root.appendChild(top);
      root.appendChild(status);
      root.appendChild(barWrap);
      root.appendChild(log);

      section.body.appendChild(root);
      mount.appendChild(section.root);

      state.ui.downloadBtn = downloadBtn;
      state.ui.pauseBtn = pauseBtn;
      state.ui.status = status;
      state.ui.bar = bar;
      state.ui.log = log;

      downloadBtn.addEventListener("click", () => runBackup());

      pauseBtn.addEventListener("click", () => {
        state.paused = !state.paused;
        pauseBtn.textContent = state.paused ? "Resume" : "Pause";
        if (state.paused) setStatus("Paused.");
        else setStatus(state.running ? `Resumed. Downloading… ${state.configsDone}/${state.configsTotal}` : "Ready.");
      });

      copyFailuresBtn.addEventListener("click", () => {
        const payload = state.failures && state.failures.length ? JSON.stringify(state.failures, null, 2) : "";
        if (!payload) return;
        copyText(payload);
      });
    }

    return { buildUI, getDiagnosticState: diagnosticState };
  }

  function register() {
    if (!window.WitchDock || typeof window.WitchDock.registerTool !== "function") return false;

    const tool = buildTool();
    UW.KWJSONToolDiagnostics = Object.freeze({
      featureId: "json-tool", version: VERSION, build: BUILD, getDiagnosticState: tool.getDiagnosticState
    });

    window.WitchDock.registerTool({
      id: TOOL_ID,
      title: "JSON",
      tab: "JSON",
      render: (container, api) => tool.buildUI(api, container)
    });

    return true;
  }

  (function boot() {
    if (register()) return;
    setTimeout(boot, 250);
  })();
})();

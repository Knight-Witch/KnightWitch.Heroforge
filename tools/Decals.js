(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const TOOL_ID = "decals-dev";
  const VERSION = "1.2.3";
  const BUILD = "1.2.3-native-rgb-vector-compat";
  const STYLE_ID = "kw-decals-dev-style";
  const TARGET_PART = 1963;
  const TARGET_DECAL = 1195;
  const TARGET_MAPPINGS = Object.freeze([7, 8]);
  const MAX_PREVIEW_MS = 120000;
  const STATE = { preview: null, attempts: 0, lastError: null, lastResult: null, viewer: null };

  // Only native decal-bake material uniforms are modified during preview.
  // Character.data, CK.activeTweak, save/load, external scripts, and module-owned caches are not touched.
  function finite(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function uniformValue(layer, key) {
    return layer && layer.uniforms && layer.uniforms[key] && layer.uniforms[key].value;
  }

  function reconstructCenter(t, m) {
    const determinant = m.x * m.w - m.y * m.z;
    if (!finite(determinant) || Math.abs(determinant) < 1e-6) throw Error("Unsupported or singular native decal UV matrix.");
    const x = 0.5 - t.x;
    const y = 0.5 - t.y;
    return {
      x: (x * m.w - y * m.y) / determinant,
      y: (m.x * y - m.z * x) / determinant
    };
  }

  function plannedUniforms(t, m, opts) {
    if (!t || !m || ![t.x, t.y, m.x, m.y, m.z, m.w].every(finite)) {
      throw Error("Missing or invalid native UV shader uniforms.");
    }
    const scale = opts.scale;
    if (!finite(scale) || scale < 0.9 || scale > 1.05) throw Error("Preview scale is outside the bounded range.");
    if (![opts.pivotU, opts.pivotV, opts.nudgeU, opts.nudgeV].every(finite) ||
      Math.abs(opts.nudgeU) > 0.05 || Math.abs(opts.nudgeV) > 0.05 ||
      opts.pivotU < 0 || opts.pivotU > 1 || opts.pivotV < 0 || opts.pivotV > 1) {
      throw Error("Preview UV pivot or nudge is outside the bounded range.");
    }
    const oldCenter = reconstructCenter(t, m);
    const center = {
      x: opts.pivotU + scale * (oldCenter.x - opts.pivotU) + opts.nudgeU,
      y: opts.pivotV + scale * (oldCenter.y - opts.pivotV) + opts.nudgeV
    };
    const matrix = { x: m.x / scale, y: m.y / scale, z: m.z / scale, w: m.w / scale };
    const translate = {
      x: 0.5 - matrix.x * center.x - matrix.y * center.y,
      y: 0.5 - matrix.z * center.x - matrix.w * center.y
    };
    if (![center.x, center.y, ...Object.values(matrix), ...Object.values(translate)].every(finite)) {
      throw Error("Nonfinite UV preview result.");
    }
    return { oldCenter, center, translate, matrix, scale };
  }

  function context() {
    const CK = UW.CK;
    const display = CK && CK.character && CK.character.display;
    const data = display && display.data;
    const body = data && data.parts && data.parts.bodyUpper;
    if (!display || body !== TARGET_PART) throw Error("Preview requires a loaded humanoid torso part 1963.");
    const mesh = display.meshes && display.meshes.bodyUpper;
    const bake = display.colorBake;
    if (!mesh || !bake || !bake.atlasBaker || typeof bake.getBakeMeshes !== "function" ||
      typeof bake.atlasBaker.bakeAtlas !== "function") {
      throw Error("Native torso color atlas/bake capability is unavailable.");
    }
    const records = data.decals && data.decals.bodyUpper;
    const ordered = display.modded && display.modded.orderedDecals && display.modded.orderedDecals.bodyUpper;
    if (!records || !Array.isArray(ordered)) throw Error("Native ordered decal slots unavailable.");
    return { CK, display, mesh, bake, records, ordered };
  }

  function eligible(ctx) {
    return ctx.ordered.map((entry, index) => ({ entry, index })).filter(({ entry, index }) => {
      const mapping = Number(entry && entry.mapping);
      if (!TARGET_MAPPINGS.includes(mapping) || entry.id !== TARGET_DECAL) return false;
      const rec = ctx.records[mapping];
      if (!rec || rec.id !== TARGET_DECAL || rec.forceProjectedScript === true) return false;
      const layer = ctx.mesh.bakeMaterials && ctx.mesh.bakeMaterials.colorDecals && ctx.mesh.bakeMaterials.colorDecals[index];
      const projected = uniformValue(layer, "l0_projected");
      const uvSet2 = uniformValue(layer, "l0_uvSet2");
      const t = uniformValue(layer, "l0_uvTranslate");
      const m = uniformValue(layer, "l0_uvRotateScale");
      return !!(layer && typeof layer.setUniform === "function" && t && m && projected === 0 && uvSet2 === 0);
    }).map(({ entry, index }) => ({ mapping: Number(entry.mapping), index }));
  }

  function nativeRebake(ctx) {
    // Bypasses paints.setDecalColors, which would reconstruct the original uniforms.
    // Run the native atlas compositor against the existing mesh/material graph.
    const atlas = ctx.bake.atlasBaker;
    const meshes = ctx.bake.getBakeMeshes("color");
    if (!meshes || !meshes.bodyUpper) throw Error("Torso color-bake mesh is not currently available.");
    atlas.bakeAtlas("color", meshes);
    if (typeof atlas.dilate === "function") atlas.dilate("color");
  }

  function releaseTimer(p) {
    if (p && p.timer) { clearTimeout(p.timer); p.timer = null; }
  }

  function revert() {
    const p = STATE.preview;
    if (!p) return { ok: true, restored: false, reason: "no-preview" };
    STATE.preview = null;
    releaseTimer(p);
    let restored = 0;
    for (const item of p.items) {
      if (item.layer.uniforms.l0_uvTranslate && item.layer.uniforms.l0_uvRotateScale) {
        item.layer.setUniform("l0_uvTranslate", item.originalTranslation);
        item.layer.setUniform("l0_uvRotateScale", item.originalMatrix);
        if (item.contrastApplied) item.layer.setUniform("colors0", item.originalColors);
        restored++;
      }
    }
    const current = UW.CK && UW.CK.character && UW.CK.character.display;
    if (current === p.ctx.display) {
      try { nativeRebake(p.ctx); } catch (error) {
        STATE.lastError = "Preview uniforms restored, but native rebake failed: " + String(error.message || error);
        return { ok: false, restored, reason: STATE.lastError };
      }
    }
    STATE.lastError = null;
    STATE.lastResult = { mode: "reverted", restored, at: Date.now() };
    updateStatus();
    return { ok: true, restored };
  }

  function preview(opts, mappings) {
    STATE.attempts++;
    revert();
    if (opts.highContrast !== undefined && typeof opts.highContrast !== "boolean") throw Error("Invalid preview diagnostic contrast flag.");
    const ctx = context();
    const available = eligible(ctx);
    const selections = [...new Set(mappings.map(Number))];
    if (!selections.length || selections.some(mapping => !TARGET_MAPPINGS.includes(mapping))) {
      throw Error("Select either legacy circle 7 or 8, or both.");
    }
    const active = available.filter(x => selections.includes(x.mapping));
    if (active.length !== selections.length) throw Error("The selected native UV circle decal layer is unavailable or not eligible.");
    const items = active.map(({ mapping, index }) => {
      const layer = ctx.mesh.bakeMaterials.colorDecals[index];
      const t = uniformValue(layer, "l0_uvTranslate");
      const m = uniformValue(layer, "l0_uvRotateScale");
      return {
        mapping, layer, originalTranslation: t, originalMatrix: m,
        originalColors: uniformValue(layer, "colors0"), contrastApplied: false,
        planned: plannedUniforms(t, m, opts)
      };
    });
    const p = { ctx, items, startedAt: Date.now(), timer: null };
    try {
      for (const item of items) {
        const { translate, matrix } = item.planned;
        item.layer.setUniform("l0_uvTranslate", new UW.RK.Vec2(translate.x, translate.y));
        item.layer.setUniform("l0_uvRotateScale", new UW.RK.Vec4(matrix.x, matrix.y, matrix.z, matrix.w));
        if (opts.highContrast === true) {
          const oldColors = item.originalColors;
          if (!Array.isArray(oldColors) || oldColors.length !== 4 ||
              oldColors.some((c, i) => !c || ![c.x, c.y, c.z, ...(i === 3 ? [c.w] : [])].every(finite))) {
            throw Error("Native gradient palette is incompatible with contrast preview.");
          }
          const contrastColors = oldColors.map((c, i) => i === 3 ? new UW.RK.Vec4(0, 1, 0, 1) : new UW.RK.Vec3(0, 1, 0));
          item.layer.setUniform("colors0", contrastColors);
          item.contrastApplied = true;
        }
      }
      nativeRebake(ctx);
    } catch (error) {
      for (const item of items) {
        item.layer.setUniform("l0_uvTranslate", item.originalTranslation);
        item.layer.setUniform("l0_uvRotateScale", item.originalMatrix);
        if (item.contrastApplied) item.layer.setUniform("colors0", item.originalColors);
      }
      try { nativeRebake(ctx); } catch (_) {}
      throw error;
    }
    STATE.preview = p;
    p.timer = setTimeout(() => { if (STATE.preview === p) revert(); }, MAX_PREVIEW_MS);
    STATE.lastError = null;
    STATE.lastResult = {
      mode: "preview", mappings: items.map(x => x.mapping),
      highContrast: opts.highContrast === true,
      sample: items.map(x => ({ mapping: x.mapping, oldCenter: x.planned.oldCenter, newCenter: x.planned.center })),
      at: p.startedAt
    };
    updateStatus();
    return STATE.lastResult;
  }

  // DEV diagnostic only. Compare *actual GPU color atlas* bytes before, during and after
  // a reversible preview. No character/snapshot data leaves the browser; only aggregates.
  function readTorsoAtlas(ctx) {
    const atlas = ctx.bake.atlasBaker;
    const rt = atlas.getRGBATarget("color");
    const uv = ctx.display.atlas.getUV("bodyUpper");
    const renderer = ctx.CK.renderManager && ctx.CK.renderManager.renderer;
    if (!rt || !uv || !renderer || typeof renderer.readRenderTargetPixels !== "function" ||
        ![uv.x, uv.y, uv.z, uv.w].every(finite)) {
      throw Error("GPU color atlas readback is unavailable.");
    }
    const x = Math.round(uv.x * rt.width), y = Math.round(uv.y * rt.height);
    const w = Math.round(uv.z * rt.width), h = Math.round(uv.w * rt.height);
    if (w <= 0 || h <= 0 || w > 1024 || h > 1024 ||
        x < 0 || y < 0 || x + w > rt.width || y + h > rt.height) {
      throw Error("Atlas readback rectangle is outside bounded torso slot.");
    }
    const bytes = new Uint8Array(w * h * 4);
    renderer.readRenderTargetPixels(rt, x, y, w, h, bytes);
    let nonzero = 0, checksum = 2166136261;
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i]) nonzero++;
      checksum = Math.imul(checksum ^ bytes[i], 16777619) >>> 0;
    }
    if (!nonzero) throw Error("GPU torso readback is empty/unavailable.");
    return { bytes, checksum, nonzero, w, h };
  }

  function compareReadbacks(a, b) {
    if (a.w !== b.w || a.h !== b.h) throw Error("Color atlas dimensions changed during probe.");
    let changedPixels = 0, maxDelta = 0, totalDelta = 0;
    let minX = a.w, minY = a.h, maxX = -1, maxY = -1;
    for (let i = 0; i < a.bytes.length; i += 4) {
      let changed = false;
      for (let c = 0; c < 4; c++) {
        const d = Math.abs(a.bytes[i + c] - b.bytes[i + c]);
        if (d) changed = true;
        totalDelta += d;
        if (d > maxDelta) maxDelta = d;
      }
      if (changed) {
        changedPixels++;
        const index = i / 4, x = index % a.w, y = Math.floor(index / a.w);
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
    return {
      changedPixels, maxDelta, totalDelta,
      bbox: changedPixels ? { minX, minY, maxX, maxY } : null,
      checksumBefore: a.checksum, checksumAfter: b.checksum
    };
  }

  function probePixels(opts, mappings) {
    if (STATE.preview) throw Error("Revert the active preview before pixel probe.");
    const ctx = context();
    const originalKey = String((ctx.bake.atlasBaker.atlasTargetKeys.color || {}).bodyUpper || "");
    const original = readTorsoAtlas(ctx);
    let during = null, duringKey = "", rollback = null, final = null;
    try {
      preview(opts, mappings);
      during = readTorsoAtlas(ctx);
      duringKey = String((ctx.bake.atlasBaker.atlasTargetKeys.color || {}).bodyUpper || "");
    } finally {
      rollback = revert();
      final = readTorsoAtlas(ctx);
    }
    const out = {
      previewVsOriginal: compareReadbacks(original, during),
      restoredVsOriginal: compareReadbacks(original, final),
      cacheKeyChanged: originalKey !== duringKey,
      cacheKeyRestored: originalKey === String((ctx.bake.atlasBaker.atlasTargetKeys.color || {}).bodyUpper || ""),
      rollback, width: original.w, height: original.h,
      originalNonzero: original.nonzero, duringNonzero: during.nonzero,
      noSavedDataTouched: true
    };
    STATE.lastResult = { mode: "pixel-probe", ...out };
    return out;
  }

  function getState() {
    return {
      id: TOOL_ID, version: VERSION, build: BUILD, attempts: STATE.attempts,
      previewActive: !!STATE.preview,
      activeMappings: STATE.preview ? STATE.preview.items.map(x => x.mapping) : [],
      lastError: STATE.lastError, lastResult: STATE.lastResult
    };
  }

  UW.KWLegacyTorsoUVPreview = Object.freeze({ version: VERSION, build: BUILD, plannedUniforms, getState, preview, revert, probePixels });

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .kwuv{color:#e8e8e8;font:12px/1.4 system-ui,sans-serif;display:flex;flex-direction:column;gap:9px}
      .kwuv .note{color:rgba(255,255,255,.7);line-height:1.5}
      .kwuv .ctrl{display:flex;align-items:center;justify-content:space-between;gap:12px}
      .kwuv label{display:flex;gap:7px;align-items:center}
      .kwuv input[type=number]{width:77px;color:inherit;border:1px solid #616161;background:#222;padding:4px;border-radius:4px}
      .kwuv button{cursor:pointer;padding:7px 10px;border-radius:5px;color:inherit;background:#333;border:1px solid #6a6a6a}
      .kwuv button:disabled{opacity:.5;cursor:not-allowed}
      .kwuv .buttons{display:flex;gap:9px;flex-wrap:wrap}
      .kwuv .status{white-space:pre-wrap;word-break:break-word;font-size:11px;background:#161616;padding:8px;border-radius:5px}
    `;
    document.head.appendChild(style);
  }

  function updateStatus() {
    const view = STATE.viewer;
    if (!view || !view.isConnected) return;
    const result = STATE.lastResult;
    view.textContent = STATE.lastError || (STATE.preview ?
      "Preview ACTIVE (auto-reverts in 2 minutes). No saved decal coordinates were changed." :
      result && result.mode === "reverted" ? "Preview reverted. Native shader values restored." :
      "No preview active. Select the original legacy circle layers below.");
  }

  function renderTool(container) {
    injectStyle();
    const root = document.createElement("section");
    root.className = "kwuv";
    const heading = document.createElement("strong");
    heading.textContent = "Legacy torso UV correction — experimental preview";
    root.appendChild(heading);
    const warning = document.createElement("div");
    warning.className = "note";
    warning.textContent = "Dev only. This previews existing UV-bound circle decal layers 7 and 8 on torso part 1963. Optional green contrast makes subtle gradients obvious. It does not update saved JSON or apply a permanent migration. Restores automatically after two minutes.";
    root.appendChild(warning);

    const slots = document.createElement("div");
    slots.className = "ctrl";
    const picks = new Map();
    for (const mapping of TARGET_MAPPINGS) {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox"; input.checked = true;
      picks.set(mapping, input);
      label.append(input, document.createTextNode("Circle " + mapping));
      slots.appendChild(label);
    }
    root.appendChild(slots);
    const contrastLabel = document.createElement("label");
    contrastLabel.className = "note";
    const contrast = document.createElement("input");
    contrast.type = "checkbox";
    contrast.checked = false;
    contrastLabel.append(contrast, document.createTextNode("Temporary vivid-green decal highlight (diagnostic only)"));
    root.appendChild(contrastLabel);

    const fields = {};
    for (const [key, title, initial, min, max, step] of [
      ["scale", "UV chart scale", 0.94, 0.9, 1.05, 0.005],
      ["pivotU", "Atlas pivot U", 0.5, 0, 1, 0.01],
      ["pivotV", "Atlas pivot V", 0.5, 0, 1, 0.01],
      ["nudgeU", "Fine offset U", 0, -0.05, 0.05, 0.001],
      ["nudgeV", "Fine offset V", 0, -0.05, 0.05, 0.001]
    ]) {
      const label = document.createElement("label"); label.className = "ctrl";
      const name = document.createElement("span"); name.textContent = title;
      const input = document.createElement("input");
      input.type = "number"; input.value = String(initial); input.min = String(min); input.max = String(max); input.step = String(step);
      fields[key] = input;
      label.append(name, input);
      root.appendChild(label);
    }

    const row = document.createElement("div"); row.className = "buttons";
    const go = document.createElement("button"); go.type = "button"; go.textContent = "Preview correction (2 min)";
    const stop = document.createElement("button"); stop.type = "button"; stop.textContent = "Revert preview";
    go.addEventListener("click", () => {
      try {
        const opts = Object.fromEntries(Object.entries(fields).map(([k, el]) => [k, Number(el.value)]));
        opts.highContrast = contrast.checked;
        const mappings = Array.from(picks).filter(([, el]) => el.checked).map(([mapping]) => mapping);
        preview(opts, mappings);
      } catch (error) {
        STATE.lastError = String(error && error.message || error);
        updateStatus();
      }
    });
    stop.addEventListener("click", () => { revert(); updateStatus(); });
    row.append(go, stop); root.appendChild(row);
    const note = document.createElement("div");note.className = "note";
    note.textContent = "Preview only: do not save or change figures while active. Revert before making other edits. The 0.94 scale is a measured starting estimate, not an approved correction.";
    root.appendChild(note);
    const status = document.createElement("div");status.className = "status";
    root.appendChild(status);
    STATE.viewer = status;
    container.appendChild(root);
    updateStatus();
  }

  function register() {
    const WD = UW.WitchDock;
    if (!WD || typeof WD.registerTool !== "function") { window.setTimeout(register, 250); return; }
    WD.registerTool({ id: TOOL_ID, tab: "Decals", render: renderTool });
  }

  register();
})();

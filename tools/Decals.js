(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const TOOL_ID = "decals-dev";
  const VERSION = "1.4.0";
  const BUILD = "1.4.0-five-circle-id-colors";
  const STYLE_ID = "kw-decals-dev-style";
  const TARGET_PART = 1963;
  const TARGET_DECAL = 1178;
  const TARGET_MAPPINGS = Object.freeze([13, 14]);
  // The five other native UV-bound bodyUpper circles, distinct from M/N ID1178.
  // Each identifier gets a stable, owner-readable diagnostic hue.
  const REFERENCE_DECAL_ID = 1195;
  const REFERENCE_CIRCLES = Object.freeze([
    { mapping: 7, name: "Cyan", hex: "#00e5ff", rgb: [0, 0.9, 1] },
    { mapping: 8, name: "Yellow", hex: "#ffff00", rgb: [1, 1, 0] },
    { mapping: 9, name: "Magenta", hex: "#ff00e6", rgb: [1, 0, 0.9] },
    { mapping: 10, name: "Orange", hex: "#ff8c00", rgb: [1, 0.55, 0] },
    { mapping: 12, name: "Blue", hex: "#3478ff", rgb: [0.2, 0.47, 1] }
  ]);
  // Never expire a preview by time. Lightweight monitoring only reapplies after native overwrites.
  const STATE = { preview: null, attempts: 0, lastError: null, lastResult: null, viewer: null, refreshes: 0 };

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

  function eligible(ctx, targets = TARGET_MAPPINGS, decalId = TARGET_DECAL) {
    return ctx.ordered.map((entry, index) => ({ entry, index })).filter(({ entry, index }) => {
      const mapping = Number(entry && entry.mapping);
      if (!targets.includes(mapping) || entry.id !== decalId) return false;
      const rec = ctx.records[mapping];
      if (!rec || rec.id !== decalId || rec.forceProjectedScript === true) return false;
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


  function revert() {
    const p = STATE.preview;
    if (!p) return { ok: true, restored: false, reason: "no-preview" };
    STATE.preview = null;
    if (p.maintenance) { window.clearInterval(p.maintenance); p.maintenance = null; }
    let restored = 0;
    for (const item of p.items) {
      // Native edits may replace shaders during a long-lived preview.
      // Restore only preview-owned values; preserve later native changes.
      let changed = false;
      if (item.role !== "reference" && uniformValue(item.layer, "l0_uvTranslate") === item.appliedTranslation) {
        item.layer.setUniform("l0_uvTranslate", item.originalTranslation);
        changed = true;
      }
      if (item.role !== "reference" && uniformValue(item.layer, "l0_uvRotateScale") === item.appliedMatrix) {
        item.layer.setUniform("l0_uvRotateScale", item.originalMatrix);
        changed = true;
      }
      if (item.contrastApplied && uniformValue(item.layer, "colors0") === item.appliedColors) {
        item.layer.setUniform("colors0", item.originalColors);
        changed = true;
      }
      if (changed) restored++;
    }
    const current = UW.CK && UW.CK.character && UW.CK.character.display;
    if (restored && current === p.ctx.display) {
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
    if (opts.colorCodeOtherCircles !== undefined && typeof opts.colorCodeOtherCircles !== "boolean") {
      throw Error("Invalid circle identification flag.");
    }
    // Calibrate each distinct UV decal separately; never assume mirrored
    // screen-space displacement implies a shared UV-space translation.
    for (const key of ["mNudgeU", "mNudgeV", "nNudgeU", "nNudgeV"]) {
      if (opts[key] !== undefined && (!finite(opts[key]) || Math.abs(opts[key]) > 0.05)) {
        throw Error("Per-decal UV calibration offset is outside the bounded range.");
      }
    }
    const ctx = context();
    const available = eligible(ctx);
    const selections = [...new Set(mappings.map(Number))];
    if ((!selections.length && opts.colorCodeOtherCircles !== true) || selections.some(mapping => !TARGET_MAPPINGS.includes(mapping))) {
      throw Error("Select either verified decal M (13) or N (14), or both.");
    }
    const active = available.filter(x => selections.includes(x.mapping));
    if (active.length !== selections.length) throw Error("The selected native UV circle decal layer is unavailable or not eligible.");
    const referenceActive = opts.colorCodeOtherCircles === true ?
      eligible(ctx, REFERENCE_CIRCLES.map(x => x.mapping), REFERENCE_DECAL_ID) : [];
    if (opts.colorCodeOtherCircles === true &&
      (referenceActive.length !== REFERENCE_CIRCLES.length ||
        REFERENCE_CIRCLES.some(color => !referenceActive.some(x => x.mapping === color.mapping)))) {
      throw Error("Five distinct ID1195 native UV circle layers are required for identification.");
    }
    const items = active.map(({ mapping, index }) => {
      const layer = ctx.mesh.bakeMaterials.colorDecals[index];
      const t = uniformValue(layer, "l0_uvTranslate");
      const m = uniformValue(layer, "l0_uvRotateScale");
      return {
        mapping, index, decalId: TARGET_DECAL, role: "calibration", layer, originalTranslation: t, originalMatrix: m,
        originalColors: uniformValue(layer, "colors0"), contrastApplied: false,
        planned: plannedUniforms(t, m, {
          ...opts,
          nudgeU: opts.nudgeU + (opts[mapping === 13 ? "mNudgeU" : "nNudgeU"] ?? 0),
          nudgeV: opts.nudgeV + (opts[mapping === 13 ? "mNudgeV" : "nNudgeV"] ?? 0)
        })
      };
    });
    for (const { mapping, index } of referenceActive) {
      const layer = ctx.mesh.bakeMaterials.colorDecals[index];
      const color = REFERENCE_CIRCLES.find(c => c.mapping === mapping);
      items.push({
        mapping, index, decalId: REFERENCE_DECAL_ID, role: "reference", color,
        layer, originalTranslation: uniformValue(layer, "l0_uvTranslate"),
        originalMatrix: uniformValue(layer, "l0_uvRotateScale"),
        originalColors: uniformValue(layer, "colors0"), contrastApplied: false
      });
    }
    const p = { ctx, items, selectedMappings: selections, startedAt: Date.now(),
      data: ctx.display.data, opts: { ...opts }, maintenance: null };
    try {
      for (const item of items) {
        if (item.role === "reference") {
          const colors = item.originalColors;
          if (!Array.isArray(colors) || colors.length !== 4 ||
              colors.some((c, i) => !c || ![c.x, c.y, c.z, ...(i === 3 ? [c.w] : [])].every(finite))) {
            throw Error("Native ID1195 circle palette is incompatible with color ID preview.");
          }
          const [r, g, b] = item.color.rgb;
          const applied = colors.map((c, i) => i === 3 ?
            new UW.RK.Vec4(r, g, b, 1) : new UW.RK.Vec3(r, g, b));
          item.layer.setUniform("colors0", applied);
          item.appliedColors = applied;
          item.contrastApplied = true;
          continue; // Reference circles are recolored only; position/scale unchanged.
        }
        const { translate, matrix } = item.planned;
        item.appliedTranslation = new UW.RK.Vec2(translate.x, translate.y);
        item.appliedMatrix = new UW.RK.Vec4(matrix.x, matrix.y, matrix.z, matrix.w);
        item.layer.setUniform("l0_uvTranslate", item.appliedTranslation);
        item.layer.setUniform("l0_uvRotateScale", item.appliedMatrix);
        if (opts.highContrast === true) {
          const oldColors = item.originalColors;
          if (!Array.isArray(oldColors) || oldColors.length !== 4 ||
              oldColors.some((c, i) => !c || ![c.x, c.y, c.z, ...(i === 3 ? [c.w] : [])].every(finite))) {
            throw Error("Native gradient palette is incompatible with contrast preview.");
          }
          const contrastColors = oldColors.map((c, i) => i === 3 ? new UW.RK.Vec4(0, 1, 0, 1) : new UW.RK.Vec3(0, 1, 0));
          item.layer.setUniform("colors0", contrastColors);
          item.appliedColors = contrastColors;
          item.contrastApplied = true;
        }
      }
      nativeRebake(ctx);
    } catch (error) {
      for (const item of items) {
        if (item.role !== "reference") {
          item.layer.setUniform("l0_uvTranslate", item.originalTranslation);
          item.layer.setUniform("l0_uvRotateScale", item.originalMatrix);
        }
        if (item.contrastApplied) item.layer.setUniform("colors0", item.originalColors);
      }
      try { nativeRebake(ctx); } catch (_) {}
      throw error;
    }
    STATE.preview = p;
    // Lightweight active-only reconciliation. Native paint/color bakes can
    // overwrite a temporary shader while leaving our logical preview active.
    // Rebase on the current native values and restore the preview only when
    // the same figure, mesh, decal identities, and layer objects still exist.
    p.maintenance = window.setInterval(() => {
      if (STATE.preview !== p) return;
      try {
        const d = UW.CK && UW.CK.character && UW.CK.character.display;
        if (!d || d !== ctx.display || d.data !== p.data ||
          !d.meshes || d.meshes.bodyUpper !== ctx.mesh ||
          !d.data.parts || d.data.parts.bodyUpper !== TARGET_PART ||
          !d.data.decals || d.data.decals.bodyUpper !== ctx.records ||
          p.items.some(item => {
            const record = ctx.records[item.mapping];
            const order = d.modded && d.modded.orderedDecals && d.modded.orderedDecals.bodyUpper;
            return !record || record.id !== item.decalId ||
              !Array.isArray(order) || !order[item.index] ||
              Number(order[item.index].mapping) !== item.mapping ||
              order[item.index].id !== item.decalId ||
              d.meshes.bodyUpper.bakeMaterials.colorDecals[item.index] !== item.layer;
          })) {
          window.clearInterval(p.maintenance);
          STATE.preview = null;
          // Restore only values still owned by this preview on abandoned layers.
          for (const item of p.items) {
            if (item.role !== "reference" && uniformValue(item.layer, "l0_uvTranslate") === item.appliedTranslation) item.layer.setUniform("l0_uvTranslate", item.originalTranslation);
            if (item.role !== "reference" && uniformValue(item.layer, "l0_uvRotateScale") === item.appliedMatrix) item.layer.setUniform("l0_uvRotateScale", item.originalMatrix);
            if (item.contrastApplied && uniformValue(item.layer, "colors0") === item.appliedColors) item.layer.setUniform("colors0", item.originalColors);
          }
          STATE.lastError = "Preview ended because the figure or native decal layers changed. No saved coordinates modified.";
          updateStatus();
          return;
        }
        const overwritten = p.items.some(item =>
          (item.role !== "reference" && uniformValue(item.layer, "l0_uvTranslate") !== item.appliedTranslation) ||
          (item.role !== "reference" && uniformValue(item.layer, "l0_uvRotateScale") !== item.appliedMatrix) ||
          (item.contrastApplied && uniformValue(item.layer, "colors0") !== item.appliedColors));
        if (!overwritten) return;
        // At most one rebake per interval; preserve new native assignments
        // through the existing ownership-aware revert before reapplying.
        STATE.refreshes++;
        preview(p.opts, p.selectedMappings);
      } catch (error) {
        if (STATE.preview === p) {
          window.clearInterval(p.maintenance);
          p.maintenance = null;
          STATE.lastError = "Native refresh displaced the preview: " + String(error.message || error);
          updateStatus();
        }
      }
    }, 2000);
    STATE.lastError = null;
    STATE.lastResult = {
      mode: "preview", mappings: items.map(x => x.mapping),
      highContrast: opts.highContrast === true,
      sample: items.filter(x => x.role === "calibration").map(x => ({
        mapping: x.mapping, oldCenter: x.planned.oldCenter, newCenter: x.planned.center
      })),
      circleColors: items.filter(x => x.role === "reference").map(x => ({
        mapping: x.mapping, name: x.color.name, hex: x.color.hex
      })),
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
      colorIdentifications: STATE.preview ? STATE.preview.items.filter(x => x.role === "reference")
        .map(x => ({ mapping: x.mapping, name: x.color.name })) : [],
      lastError: STATE.lastError, lastResult: STATE.lastResult, refreshes: STATE.refreshes
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
      .kwuv .id-legend{display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:6px;padding:6px 0}
      .kwuv .id-legend span{display:flex;align-items:center;gap:6px}
      .kwuv .id-swatch{display:inline-block;width:12px;height:12px;border:1px solid #888;border-radius:3px;flex:none}
    `;
    document.head.appendChild(style);
  }

  function updateStatus() {
    const view = STATE.viewer;
    if (!view || !view.isConnected) return;
    const result = STATE.lastResult;
    view.textContent = STATE.lastError || (STATE.preview ?
      "Preview ACTIVE — no expiry timer; native paint resets are reconciled. Click Revert preview when finished." :
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
    warning.textContent = "Dev only. The independent M/N nipple calibration (ID1178) is separate from optional color identifiers for the five other upper-body circles (ID1195). Neither option edits saved figure JSON or applies a permanent migration. Preview stays active until manually reverted or replaced.";
    root.appendChild(warning);

    const slots = document.createElement("div");
    slots.className = "ctrl";
    const picks = new Map();
    for (const mapping of TARGET_MAPPINGS) {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox"; input.checked = true;
      picks.set(mapping, input);
      label.append(input, document.createTextNode("Decal " + (mapping === 13 ? "M" : "N") + " (mapping " + mapping + ")"));
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
      ["scale", "UV chart scale", 1, 0.9, 1.05, 0.005],
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

    const calibration = document.createElement("details");
    calibration.open = true;
    const calibrationHeading = document.createElement("summary");
    calibrationHeading.textContent = "Independent M / N decal calibration";
    calibration.appendChild(calibrationHeading);
    const calibrationNote = document.createElement("div");
    calibrationNote.className = "note";
    calibrationNote.textContent = "These offsets are in UV space (not screen left/right). Adjust M and N separately, then click Preview again. All adjustments are temporary.";
    calibration.appendChild(calibrationNote);
    for (const [key, title] of [
      ["mNudgeU", "Decal M — UV offset U"],
      ["mNudgeV", "Decal M — UV offset V"],
      ["nNudgeU", "Decal N — UV offset U"],
      ["nNudgeV", "Decal N — UV offset V"]
    ]) {
      const label = document.createElement("label"); label.className = "ctrl";
      const name = document.createElement("span"); name.textContent = title;
      const input = document.createElement("input");
      input.type = "number"; input.value = "0"; input.min = "-0.05"; input.max = "0.05"; input.step = "0.001";
      fields[key] = input;
      label.append(name, input);
      calibration.appendChild(label);
    }
    root.appendChild(calibration);

    const bodyCircles = document.createElement("details");
    bodyCircles.open = true;
    const bodyTitle = document.createElement("summary");
    bodyTitle.textContent = "Identify other upper-body circle decals (ID 1195)";
    bodyCircles.appendChild(bodyTitle);
    const identifyLabel = document.createElement("label");
    identifyLabel.className = "note";
    const identify = document.createElement("input");
    identify.type = "checkbox"; identify.checked = false;
    identifyLabel.append(identify, document.createTextNode(
      "Color-code five other torso circles (no position changes)"));
    bodyCircles.appendChild(identifyLabel);
    const legend = document.createElement("div");
    legend.className = "id-legend";
    for (const circle of REFERENCE_CIRCLES) {
      const entry = document.createElement("span");
      const swatch = document.createElement("i");
      swatch.className = "id-swatch";
      swatch.style.backgroundColor = circle.hex;
      entry.append(swatch, document.createTextNode("Mapping " + circle.mapping + " — " + circle.name));
      legend.appendChild(entry);
    }
    bodyCircles.appendChild(legend);
    const help = document.createElement("div"); help.className = "note";
    help.textContent = "Tick this and Preview to recolor ID1195 mappings 7/8/9/10/12. You may uncheck both M/N to identify only the other circles. Manual Revert restores native palettes.";
    bodyCircles.appendChild(help);
    root.appendChild(bodyCircles);

    const row = document.createElement("div"); row.className = "buttons";
    const go = document.createElement("button"); go.type = "button"; go.textContent = "Preview correction (no timer)";
    const stop = document.createElement("button"); stop.type = "button"; stop.textContent = "Revert preview";
    go.addEventListener("click", () => {
      try {
        const opts = Object.fromEntries(Object.entries(fields).map(([k, el]) => [k, Number(el.value)]));
        opts.highContrast = contrast.checked;
        opts.colorCodeOtherCircles = identify.checked;
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
    note.textContent = "Preview only: no timeout. Click Revert preview before saving or editing; reloading/replacing the figure discards temporary shader changes. Use scale 1.00 as an unchanged baseline. The earlier 0.94 shrink was visually disproved; independent M/N offsets are calibration only, not a proven migration.";
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

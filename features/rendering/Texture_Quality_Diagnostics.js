// ==UserScript==
// @name         Witch Dock DEV - High Res Diagnostic Capture
// @namespace    KnightWitch
// @version      0.1.3
// @description  Structured read-only diagnostics and controlled OFF-to-ON comparison for Texture Quality.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const GLOBAL = 'KWTextureQualityDiagnostics';
  if (UW[GLOBAL]) return;

  const VERSION = '0.1.3';
  const BUILD = '0.1.3-addressable-comparison-sections';
  const FORMAT = 'witch-dock.hr-diagnostic';
  const SCHEMA_VERSION = 1;
  const TARGETS = ['bodyLower', 'bodyUpper', 'face'];
  const BODIES = ['bodyLower', 'bodyUpper'];
  const EVENT_LIMIT = 120;
  const DIFF_LIMIT = 400;
  const IDLE_TIMEOUT = 20000;
  const IDLE_STABLE_MS = 600;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const SECTION_NAMES = [
    'environment', 'witchDock', 'highRes', 'scene', 'figures', 'paintState',
    'atlas', 'materials', 'colorBake', 'resources',
    'verification', 'warnings', 'events', 'coverage'
  ];

  let operationBusy = false;
  let lastError = null;
  let lastCapture = null;
  let lastComparison = null;
  let lastExportable = null;
  let captureCounter = 0;
  let objectCounter = 0;
  let unsubscribeHighRes = null;
  let lastEventSignature = '';
  const listeners = new Set();
  const events = [];
  const objectIds = new WeakMap();

  function nowIso() {
    return new Date().toISOString();
  }

  function cloneJson(value) {
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_) { return null; }
  }

  function deepFreeze(value, seen) {
    if (!value || typeof value !== 'object') return value;
    const visited = seen || new WeakSet();
    if (visited.has(value)) return value;
    visited.add(value);
    for (const key of Object.keys(value)) deepFreeze(value[key], visited);
    try { Object.freeze(value); } catch (_) {}
    return value;
  }

  function objectId(value) {
    if (!value || (typeof value !== 'object' && typeof value !== 'function')) return null;
    let id = objectIds.get(value);
    if (!id) {
      objectCounter += 1;
      id = 'obj-' + objectCounter;
      objectIds.set(value, id);
    }
    return id;
  }

  function boundedString(value, max) {
    if (value == null) return null;
    const text = String(value);
    const limit = Number(max) || 1000;
    return text.length > limit ? text.slice(0, limit) + '…' : text;
  }

  function isSensitiveKey(key) {
    return /^(password|passwd|token|accessToken|refreshToken|authorization|cookie|cookies|secret|sessionToken)$/i.test(String(key || ''));
  }

  function normalize(value, options, state, depth) {
    const opts = Object.assign({
      maxDepth: 8,
      maxKeys: 500,
      maxArray: 1000,
      maxString: 1000,
      maxNodes: 8000
    }, options || {});
    const walk = state || { seen: new WeakSet(), nodes: 0 };
    const level = Number(depth) || 0;

    if (value == null || typeof value === 'boolean' || typeof value === 'number') return value;
    if (typeof value === 'string') return boundedString(value, opts.maxString);
    if (typeof value === 'bigint') return String(value);
    if (typeof value === 'function' || typeof value === 'symbol') return undefined;
    if (walk.nodes >= opts.maxNodes) return { __truncated: 'node-limit' };
    if (level >= opts.maxDepth) return { __truncated: 'depth-limit', type: value && value.constructor ? value.constructor.name : typeof value };

    if (ArrayBuffer.isView(value)) {
      return {
        __typedArray: value.constructor && value.constructor.name || 'TypedArray',
        length: Number(value.length) || 0,
        byteLength: Number(value.byteLength) || 0
      };
    }

    if (Array.isArray(value)) {
      if (walk.seen.has(value)) return '[Circular]';
      walk.seen.add(value);
      walk.nodes += 1;
      const limit = Math.min(value.length, opts.maxArray);
      const out = [];
      for (let i = 0; i < limit; i += 1) out.push(normalize(value[i], opts, walk, level + 1));
      if (value.length > limit) out.push({ __truncatedItems: value.length - limit });
      return out;
    }

    if (typeof value === 'object') {
      if (walk.seen.has(value)) return '[Circular]';
      walk.seen.add(value);
      walk.nodes += 1;
      const out = {};
      const keys = Object.keys(value).sort();
      const limit = Math.min(keys.length, opts.maxKeys);
      for (let i = 0; i < limit; i += 1) {
        const key = keys[i];
        if (isSensitiveKey(key)) continue;
        let descriptor = null;
        try { descriptor = Object.getOwnPropertyDescriptor(value, key); } catch (_) {}
        if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) continue;
        const next = normalize(descriptor.value, opts, walk, level + 1);
        if (next !== undefined) out[key] = next;
      }
      if (keys.length > limit) out.__truncatedKeys = keys.length - limit;
      return out;
    }

    return undefined;
  }

  function stableHash(value) {
    let text = '';
    try { text = JSON.stringify(value); } catch (_) { text = String(value); }
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function pair(value) {
    return Array.isArray(value) && value.length >= 2
      ? [Number(value[0]) || 0, Number(value[1]) || 0]
      : null;
  }

  function texSize(texture) {
    try {
      const image = texture && texture.image;
      return image ? [Number(image.width) || 0, Number(image.height) || 0] : [0, 0];
    } catch (_) {
      return [0, 0];
    }
  }

  function textureSource(texture) {
    try {
      const image = texture && texture.image;
      const source = image && (image.currentSrc || image.src) || texture.path || texture.url || null;
      return typeof source === 'string' ? boundedString(source, 1200) : null;
    } catch (_) {
      return null;
    }
  }

  function makeContext() {
    return { resources: new Map(), coverageNotes: [] };
  }

  function textureDescriptor(texture, ctx, role, owner) {
    if (!texture || typeof texture !== 'object') return null;
    const descriptor = {
      objectId: objectId(texture),
      uuid: typeof texture.uuid === 'string' ? texture.uuid : null,
      name: typeof texture.name === 'string' ? boundedString(texture.name, 300) : null,
      size: texSize(texture),
      source: textureSource(texture)
    };

    if (ctx && descriptor.objectId) {
      let row = ctx.resources.get(descriptor.objectId);
      if (!row) {
        row = Object.assign({}, descriptor, { roles: [], owners: [] });
        ctx.resources.set(descriptor.objectId, row);
      }
      if (role && !row.roles.includes(role)) row.roles.push(role);
      if (owner && !row.owners.includes(owner)) row.owners.push(owner);
    }
    return descriptor;
  }

  function allocation(atlas, slot) {
    if (!atlas || typeof atlas.getUV !== 'function') return null;
    try {
      const uv = atlas.getUV(slot);
      if (!uv) return null;
      const out = [
        Math.round(Number(uv.z) * Number(atlas.width)),
        Math.round(Number(uv.w) * Number(atlas.height))
      ];
      return out[0] > 0 && out[1] > 0 ? out : null;
    } catch (_) {
      return null;
    }
  }

  function getHighRes() {
    return UW && UW.KWTextureQualityNativeReconcile || null;
  }

  function collectFigureDisplays() {
    const CK = UW && UW.CK;
    const c = CK && CK.character;
    if (!c) return [];
    const rows = [];
    const seen = new Set();

    function add(key, display) {
      if (!display || typeof display !== 'object' || seen.has(display)) return;
      const data = display.data || (display === c.display ? c.data : null);
      const modded = display.modded;
      if (!data || !modded || !modded.parts || !display.meshes) return;
      seen.add(display);
      rows.push({
        key: String(key || ''),
        primary: display === c.display || data.primary === true,
        data,
        display,
        modded,
        parts: modded.parts,
        meshes: display.meshes
      });
    }

    add('', c.display);
    if (c.allDisplays && typeof c.allDisplays === 'object') {
      for (const entry of Object.entries(c.allDisplays)) add(entry[0], entry[1]);
    }
    return rows;
  }

  function partIdentity(part) {
    if (!part || typeof part !== 'object') return null;
    return [part.id == null ? '' : part.id, part.baseName || '', part.name || ''].join('|');
  }

  function slotMetadata(CK, slot) {
    let def = null;
    try { def = CK && CK.Options && CK.Options.slots && CK.Options.slots[slot]; } catch (_) {}
    if (!def || typeof def !== 'object') return null;
    const fields = [
      'display_name', 'source', 'target_slot', 'skel', 'monsterGroup',
      'menu', 'subMenu', 'scheme_group', 'clear_group', 'monsterRootJoint',
      'addonJointParent', 'detach', 'allowMonsters', 'monsterSize'
    ];
    const out = {};
    for (const field of fields) {
      let descriptor = null;
      try { descriptor = Object.getOwnPropertyDescriptor(def, field); } catch (_) {}
      if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) continue;
      const value = descriptor.value;
      if (value == null || ['string', 'number', 'boolean'].includes(typeof value)) out[field] = value;
      else if (Array.isArray(value)) out[field] = value.slice(0, 40).map((item) => boundedString(item, 200));
    }
    return out;
  }

  function partDescriptor(CK, slot, part) {
    if (!part || typeof part !== 'object') return { slot, missing: true, slotMeta: slotMetadata(CK, slot) };
    return {
      slot,
      identity: partIdentity(part),
      objectId: objectId(part),
      id: part.id == null ? null : part.id,
      baseName: boundedString(part.baseName, 300),
      name: boundedString(part.name, 300),
      partSlot: boundedString(part.slot, 200),
      monsterGroup: boundedString(part.monsterGroup, 200),
      skel: boundedString(part.skel, 200),
      bakeSize: Number.isFinite(Number(part.bakeSize)) ? Number(part.bakeSize) : null,
      usedTextureSize: Number.isFinite(Number(part._usedTextureSize)) ? Number(part._usedTextureSize) : null,
      highResCoreTarget: TARGETS.includes(slot),
      slotMeta: slotMetadata(CK, slot)
    };
  }

  function describeUniformValue(value, ctx, role, owner) {
    if (value == null || typeof value === 'boolean' || typeof value === 'number') return value;
    if (typeof value === 'string') return boundedString(value, 500);
    if (typeof value === 'object' && (value.image || value.isTexture)) {
      return { texture: textureDescriptor(value, ctx, role, owner) };
    }
    if (ArrayBuffer.isView(value)) {
      return { typedArray: value.constructor && value.constructor.name || 'TypedArray', length: Number(value.length) || 0 };
    }
    if (Array.isArray(value)) {
      return value.slice(0, 32).map((item) => typeof item === 'number' || typeof item === 'string' || typeof item === 'boolean' ? item : null);
    }
    if (typeof value === 'object') {
      const out = {};
      for (const key of ['x', 'y', 'z', 'w', 'r', 'g', 'b', 'a']) {
        try {
          if (typeof value[key] === 'number') out[key] = value[key];
        } catch (_) {}
      }
      if (Object.keys(out).length) return out;
      return { objectId: objectId(value), type: value.constructor && value.constructor.name || 'Object' };
    }
    return null;
  }

  function materialDescriptor(material, ctx, owner) {
    if (!material || typeof material !== 'object') return null;
    const out = {
      objectId: objectId(material),
      uuid: typeof material.uuid === 'string' ? material.uuid : null,
      name: boundedString(material.name, 300),
      type: boundedString(material.type || material.constructor && material.constructor.name, 200),
      uniforms: {}
    };
    const uniforms = material.uniforms && typeof material.uniforms === 'object' ? material.uniforms : {};
    const keys = Object.keys(uniforms).sort().slice(0, 120);
    for (const key of keys) {
      const uniform = uniforms[key];
      if (!uniform || typeof uniform !== 'object') {
        out.uniforms[key] = describeUniformValue(uniform, ctx, 'uniform:' + key, owner);
        continue;
      }
      let type = null;
      let value = null;
      try { type = typeof uniform.type === 'string' ? uniform.type : null; } catch (_) {}
      try { value = Object.prototype.hasOwnProperty.call(uniform, 'value') ? uniform.value : uniform; } catch (_) { value = null; }
      out.uniforms[key] = {
        type,
        value: describeUniformValue(value, ctx, 'uniform:' + key, owner)
      };
    }
    if (Object.keys(uniforms).length > keys.length) out.uniforms.__truncatedKeys = Object.keys(uniforms).length - keys.length;

    if (typeof material.getUniform === 'function') {
      try {
        const masksMap = material.getUniform('masksMap');
        out.masksMap = textureDescriptor(masksMap, ctx, 'material:masksMap', owner);
      } catch (_) {}
    }
    return out;
  }

  function meshDescriptor(key, mesh, ctx, figureId) {
    if (!mesh || typeof mesh !== 'object') return { key, missing: true };
    const owner = figureId + ':' + key;
    const bake = {};
    const bakeMaterials = mesh.bakeMaterials && typeof mesh.bakeMaterials === 'object' ? mesh.bakeMaterials : {};
    for (const name of Object.keys(bakeMaterials).sort().slice(0, 30)) {
      bake[name] = materialDescriptor(bakeMaterials[name], ctx, owner + ':bake:' + name);
    }
    return {
      key,
      objectId: objectId(mesh),
      name: boundedString(mesh.name, 300),
      type: boundedString(mesh.type || mesh.constructor && mesh.constructor.name, 200),
      masksMapOverride: textureDescriptor(mesh.masksMapOverride, ctx, 'mesh:masksMapOverride', owner),
      material: materialDescriptor(mesh.material, ctx, owner + ':main'),
      bakeMaterials: bake
    };
  }

  function objectSurface(value, maxKeys) {
    if (!value || typeof value !== 'object') return null;
    const keys = Object.keys(value).sort();
    const out = {
      objectId: objectId(value),
      type: value.constructor && value.constructor.name || 'Object',
      keys: keys.slice(0, maxKeys || 120),
      scalars: {},
      collections: {}
    };
    for (const key of out.keys) {
      let descriptor = null;
      try { descriptor = Object.getOwnPropertyDescriptor(value, key); } catch (_) {}
      if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) continue;
      const item = descriptor.value;
      if (item == null || ['string', 'number', 'boolean'].includes(typeof item)) {
        out.scalars[key] = typeof item === 'string' ? boundedString(item, 500) : item;
      } else if (Array.isArray(item) || ArrayBuffer.isView(item)) {
        out.collections[key] = { type: item.constructor && item.constructor.name || 'Array', length: Number(item.length) || 0 };
      } else if (typeof item === 'object') {
        out.collections[key] = {
          type: item.constructor && item.constructor.name || 'Object',
          keyCount: Object.keys(item).length
        };
      }
    }
    if (keys.length > out.keys.length) out.truncatedKeys = keys.length - out.keys.length;
    return out;
  }

  function colorBakeDescriptor(display, ctx, figureId) {
    const colorBake = display && display.colorBake;
    if (!colorBake || typeof colorBake !== 'object') return null;
    const out = {
      objectId: objectId(colorBake),
      surface: objectSurface(colorBake, 140),
      paintsSurface: objectSurface(colorBake.paints, 140),
      targetGroups: {}
    };
    for (const key of Object.keys(colorBake).sort()) {
      if (!/^targets/i.test(key)) continue;
      let descriptor = null;
      try { descriptor = Object.getOwnPropertyDescriptor(colorBake, key); } catch (_) {}
      if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) continue;
      const group = descriptor.value;
      if (!group || typeof group !== 'object') continue;
      const entries = {};
      for (const target of Object.keys(group).sort().slice(0, 80)) {
        let value = null;
        try { value = group[target]; } catch (_) {}
        const texture = value && value.texture ? value.texture : value;
        if (texture && typeof texture === 'object' && (texture.image || texture.isTexture || typeof texture.width === 'number')) {
          entries[target] = textureDescriptor(texture, ctx, 'colorBake:' + key + ':' + target, figureId);
        } else {
          entries[target] = {
            objectId: objectId(value),
            type: value && value.constructor && value.constructor.name || typeof value
          };
        }
      }
      out.targetGroups[key] = entries;
    }
    return out;
  }

  function capturePaintState(row) {
    const paints = normalize(row.data && row.data.paints, { maxDepth: 10, maxKeys: 900, maxArray: 1800, maxNodes: 12000 });
    const paintByIntent = normalize(row.data && row.data.paintByIntent, { maxDepth: 10, maxKeys: 900, maxArray: 1800, maxNodes: 12000 });
    return {
      figureKey: row.key,
      primary: row.primary,
      paints,
      paintsHash: stableHash(paints),
      paintByIntent,
      paintByIntentHash: stableHash(paintByIntent),
      paintCount: paints && typeof paints === 'object' && !Array.isArray(paints) ? Object.keys(paints).length : Array.isArray(paints) ? paints.length : 0,
      intentCount: paintByIntent && typeof paintByIntent === 'object' && !Array.isArray(paintByIntent) ? Object.keys(paintByIntent).length : Array.isArray(paintByIntent) ? paintByIntent.length : 0
    };
  }

  function captureEnvironment(CK) {
    const out = {
      userAgent: boundedString(navigator.userAgent, 700),
      platform: boundedString(navigator.platform, 200),
      hardwareConcurrency: Number(navigator.hardwareConcurrency) || null,
      deviceMemory: Number(navigator.deviceMemory) || null,
      devicePixelRatio: Number(window.devicePixelRatio) || 1,
      viewport: [Number(window.innerWidth) || 0, Number(window.innerHeight) || 0],
      webgl: null
    };
    try {
      const renderer = CK && CK.renderManager && CK.renderManager.renderer;
      const gl = renderer && typeof renderer.getContext === 'function' ? renderer.getContext() : null;
      if (gl) {
        const debug = gl.getExtension && gl.getExtension('WEBGL_debug_renderer_info');
        out.webgl = {
          version: boundedString(gl.getParameter(gl.VERSION), 500),
          shadingLanguageVersion: boundedString(gl.getParameter(gl.SHADING_LANGUAGE_VERSION), 500),
          vendor: boundedString(debug ? gl.getParameter(debug.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR), 500),
          renderer: boundedString(debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER), 500)
        };
      }
    } catch (_) {}
    return out;
  }

  function captureWitchDock() {
    const out = {};
    try { out.devChannel = UW.KWWitchDockDevChannel && typeof UW.KWWitchDockDevChannel.getState === 'function' ? UW.KWWitchDockDevChannel.getState() : null; } catch (_) { out.devChannel = null; }
    try { out.loader = UW.KWModuleLoader && typeof UW.KWModuleLoader.getState === 'function' ? UW.KWModuleLoader.getState() : null; } catch (_) { out.loader = null; }
    try { out.registry = UW.KWWitchDockRegistry && typeof UW.KWWitchDockRegistry.getState === 'function' ? UW.KWWitchDockRegistry.getState() : null; } catch (_) { out.registry = null; }
    return normalize(out, { maxDepth: 7, maxKeys: 500, maxArray: 300, maxNodes: 4000 });
  }

  function warningCode(message) {
    const text = String(message || '');
    if (!text) return null;
    if (/native color-bake mask was not adopted/i.test(text)) return 'HR_RESTORE_MASK_NOT_ADOPTED';
    if (/high-resolution source\/allocation verification failed/i.test(text)) return 'HR_SOURCE_ALLOCATION_VERIFY_FAILED';
    if (/color-bake mask is not the pinned/i.test(text)) return 'HR_MASK_PIN_VERIFY_FAILED';
    if (/color-bake cache was not refreshed/i.test(text)) return 'HR_COLOR_BAKE_REFRESH_VERIFY_FAILED';
    return 'HR_STATUS_ERROR';
  }

  function captureWarnings(publicState) {
    const rows = [];
    if (publicState && publicState.statusError) {
      rows.push({
        code: warningCode(publicState.lastError || publicState.statusText),
        message: boundedString(publicState.lastError || publicState.statusText, 1200),
        source: 'texture-quality-status'
      });
    }
    const verification = publicState && publicState.lastVerification;
    if (verification && verification.ok === false) {
      rows.push({
        code: warningCode(verification.reason) || 'HR_VERIFICATION_FAILED',
        message: boundedString(verification.reason, 1200),
        source: 'lastVerification'
      });
    }
    const restore = publicState && publicState.lastRestoreVerification;
    if (restore && restore.ok === false) {
      rows.push({
        code: warningCode(restore.reason) || 'HR_RESTORE_VERIFICATION_FAILED',
        message: boundedString(restore.reason, 1200),
        source: 'lastRestoreVerification'
      });
    }
    return rows;
  }

  function captureScene(CK, rows) {
    const c = CK && CK.character;
    return {
      characterObjectId: objectId(c),
      dataObjectId: objectId(c && c.data),
      needsUpdating: !!(c && c._needsUpdating),
      inUpdate: !!(c && c._inUpdate),
      figureCount: rows.length,
      figures: rows.map((row) => ({
        key: row.key,
        primary: row.primary,
        dataObjectId: objectId(row.data),
        displayObjectId: objectId(row.display),
        moddedObjectId: objectId(row.modded),
        resourcesReady: row.display.resourcesReady !== false,
        finished: row.display.finished !== false
      }))
    };
  }

  function captureRows(CK, rows, ctx) {
    const figures = [];
    const paintState = [];
    const atlas = [];
    const materials = [];
    const colorBake = [];

    rows.forEach((row, index) => {
      const figureId = row.primary ? 'primary' : (row.key || 'figure-' + (index + 1));
      const partKeys = Object.keys(row.parts || {}).sort();
      const parts = partKeys.slice(0, 400).map((slot) => partDescriptor(CK, slot, row.parts[slot]));

      figures.push({
        figureId,
        key: row.key,
        primary: row.primary,
        dataObjectId: objectId(row.data),
        displayObjectId: objectId(row.display),
        moddedObjectId: objectId(row.modded),
        inferredMonsterGroups: Array.from(new Set(parts.map((part) => part.monsterGroup || part.slotMeta && part.slotMeta.monsterGroup).filter(Boolean))).sort(),
        coreTargets: Object.fromEntries(TARGETS.map((slot) => [slot, partDescriptor(CK, slot, row.parts[slot])])),
        partCount: partKeys.length,
        parts,
        partsTruncated: partKeys.length > parts.length ? partKeys.length - parts.length : 0
      });

      paintState.push(Object.assign({ figureId }, capturePaintState(row)));

      const currentAtlas = row.display && row.display.atlas;
      const resourceAtlas = row.modded && row.modded.resourceAtlas;
      const allocKeys = Array.from(new Set(TARGETS.concat(partKeys))).sort();
      const allocations = {};
      for (const slot of allocKeys) {
        const value = allocation(currentAtlas, slot);
        if (value) allocations[slot] = value;
      }
      const scales = {};
      const atlasScale = row.data && row.data.atlasScale;
      if (atlasScale && typeof atlasScale === 'object') {
        for (const slot of Object.keys(allocations)) {
          const value = Number(atlasScale[slot]);
          if (Number.isFinite(value)) scales[slot] = value;
        }
      }
      atlas.push({
        figureId,
        displayAtlasObjectId: objectId(currentAtlas),
        resourceAtlasObjectId: objectId(resourceAtlas),
        sameAtlas: !!currentAtlas && currentAtlas === resourceAtlas,
        size: currentAtlas ? [Number(currentAtlas.width) || 0, Number(currentAtlas.height) || 0] : null,
        resourceSize: resourceAtlas ? [Number(resourceAtlas.width) || 0, Number(resourceAtlas.height) || 0] : null,
        allocations,
        atlasScale: scales
      });

      const meshKeys = Object.keys(row.meshes || {}).sort();
      const meshRows = {};
      for (const key of meshKeys.slice(0, 220)) meshRows[key] = meshDescriptor(key, row.meshes[key], ctx, figureId);
      materials.push({
        figureId,
        meshCount: meshKeys.length,
        meshes: meshRows,
        meshesTruncated: meshKeys.length > 220 ? meshKeys.length - 220 : 0
      });

      colorBake.push({
        figureId,
        state: colorBakeDescriptor(row.display, ctx, figureId)
      });
    });

    return { figures, paintState, atlas, materials, colorBake };
  }

  function captureVerification(publicState) {
    return {
      lastVerification: normalize(publicState && publicState.lastVerification, { maxDepth: 8, maxKeys: 500, maxArray: 300, maxNodes: 4000 }),
      lastRestoreVerification: normalize(publicState && publicState.lastRestoreVerification, { maxDepth: 8, maxKeys: 500, maxArray: 300, maxNodes: 4000 })
    };
  }

  function finalizeResources(ctx) {
    return Array.from(ctx.resources.values()).map((row) => ({
      objectId: row.objectId,
      uuid: row.uuid,
      name: row.name,
      size: row.size,
      source: row.source,
      roles: row.roles.slice().sort(),
      owners: row.owners.slice().sort()
    })).sort((a, b) => String(a.objectId).localeCompare(String(b.objectId)));
  }

  function captureCoverage(rows, paintState, atlas, materials, colorBake, highResPrivate) {
    const paintMissing = paintState.filter((row) => row.paints == null && row.paintByIntent == null).map((row) => row.figureId);
    const colorMissing = colorBake.filter((row) => !row.state).map((row) => row.figureId);
    return [
      { area: 'highResPublicState', status: 'captured' },
      { area: 'highResPrivateSession', status: highResPrivate && highResPrivate.session && highResPrivate.session.available ? 'captured' : 'unavailable', detail: highResPrivate && highResPrivate.session && highResPrivate.session.reason || null },
      { area: 'figureInventory', status: rows.length ? 'captured' : 'unavailable', detail: rows.length + ' figure(s)' },
      { area: 'paintState', status: paintMissing.length ? 'partial' : 'captured', detail: paintMissing.length ? 'missing: ' + paintMissing.join(', ') : null },
      { area: 'atlasAllocations', status: atlas.length ? 'captured' : 'unavailable' },
      { area: 'materialBindings', status: materials.length ? 'captured-bounded' : 'unavailable', detail: 'Up to 220 display meshes per figure and 120 uniforms per material.' },
      { area: 'colorBake', status: colorMissing.length ? 'partial' : 'captured-bounded', detail: colorMissing.length ? 'missing: ' + colorMissing.join(', ') : 'Structural state and texture targets; raw pixels intentionally excluded.' },
      { area: 'resourceInventory', status: 'captured-referenced-only', detail: 'Resources referenced by captured materials, masks, and color-bake targets.' },
      { area: 'networkRequestHistory', status: 'not-captured' },
      { area: 'rawTexturePixels', status: 'not-captured' },
      { area: 'eventHistory', status: 'captured-from-diagnostic-module-load', detail: 'Does not reconstruct events before this module loaded.' }
    ];
  }

  function sectionManifest(pkg) {
    const sections = {};
    for (const name of SECTION_NAMES) {
      let chars = 0;
      try { chars = JSON.stringify(pkg[name]).length; } catch (_) {}
      sections[name] = {
        present: pkg[name] != null,
        approxJsonChars: chars,
        hash: stableHash(pkg[name])
      };
    }
    return {
      format: FORMAT,
      schemaVersion: SCHEMA_VERSION,
      captureId: pkg.metadata.captureId,
      captureMode: pkg.metadata.captureMode,
      sections,
      figureCount: pkg.scene && pkg.scene.figureCount || 0,
      warningCount: Array.isArray(pkg.warnings) ? pkg.warnings.length : 0,
      coverageWarnings: Array.isArray(pkg.coverage)
        ? pkg.coverage.filter((row) => row.status !== 'captured' && row.status !== 'captured-bounded' && row.status !== 'captured-referenced-only' && row.status !== 'captured-from-diagnostic-module-load').length
        : 0
    };
  }

  function summaryFor(pkg) {
    const primaryAtlas = Array.isArray(pkg.atlas) ? (pkg.atlas.find((row) => row.figureId === 'primary') || pkg.atlas[0]) : null;
    const primaryPaint = Array.isArray(pkg.paintState) ? (pkg.paintState.find((row) => row.figureId === 'primary') || pkg.paintState[0]) : null;
    const hr = pkg.highRes && pkg.highRes.public || {};
    return {
      captureId: pkg.metadata.captureId,
      captureMode: pkg.metadata.captureMode,
      figureCount: pkg.scene && pkg.scene.figureCount || 0,
      highResEnabled: !!hr.enabled,
      highResBusy: !!hr.busy,
      highResStatus: boundedString(hr.statusText, 500),
      highResVerificationOk: hr.lastVerification ? hr.lastVerification.ok === true : null,
      atlas: primaryAtlas && primaryAtlas.size || null,
      sameAtlas: primaryAtlas ? primaryAtlas.sameAtlas : null,
      primaryPaintsHash: primaryPaint && primaryPaint.paintsHash || null,
      primaryPaintByIntentHash: primaryPaint && primaryPaint.paintByIntentHash || null,
      warningCodes: (pkg.warnings || []).map((row) => row.code).filter(Boolean),
      referencedResourceCount: Array.isArray(pkg.resources) ? pkg.resources.length : 0
    };
  }

  function captureSnapshot(label, captureMode) {
    const started = performance.now();
    const CK = UW && UW.CK;
    const hr = getHighRes();
    const ctx = makeContext();
    const rows = collectFigureDisplays();

    let publicState = null;
    let privateState = null;
    try { publicState = hr && typeof hr.getState === 'function' ? hr.getState() : null; } catch (error) { publicState = { statusError: true, lastError: String(error) }; }
    try { privateState = hr && typeof hr.getDiagnosticState === 'function' ? hr.getDiagnosticState() : null; } catch (error) { privateState = { error: String(error) }; }

    const captured = captureRows(CK, rows, ctx);
    captureCounter += 1;
    const pkg = {
      format: FORMAT,
      schemaVersion: SCHEMA_VERSION,
      metadata: {
        captureId: 'hrd-' + Date.now().toString(36) + '-' + captureCounter.toString(36),
        timestamp: nowIso(),
        label: boundedString(label || 'Current State', 200),
        captureMode: boundedString(captureMode || 'current', 100),
        diagnosticVersion: VERSION,
        diagnosticBuild: BUILD,
        highResVersion: publicState && publicState.version || null,
        highResBuild: publicState && publicState.build || null,
        durationMs: null
      },
      manifest: null,
      summary: null,
      environment: captureEnvironment(CK),
      witchDock: captureWitchDock(),
      highRes: {
        public: normalize(publicState, { maxDepth: 10, maxKeys: 700, maxArray: 500, maxNodes: 7000 }),
        diagnostic: normalize(privateState, { maxDepth: 10, maxKeys: 700, maxArray: 500, maxNodes: 7000 })
      },
      scene: captureScene(CK, rows),
      figures: captured.figures,
      paintState: captured.paintState,
      atlas: captured.atlas,
      materials: captured.materials,
      colorBake: captured.colorBake,
      resources: finalizeResources(ctx),
      verification: captureVerification(publicState),
      warnings: captureWarnings(publicState),
      events: cloneJson(events),
      coverage: null
    };

    pkg.coverage = captureCoverage(rows, pkg.paintState, pkg.atlas, pkg.materials, pkg.colorBake, privateState);
    pkg.metadata.durationMs = Math.round((performance.now() - started) * 10) / 10;
    pkg.summary = summaryFor(pkg);
    pkg.manifest = sectionManifest(pkg);
    return deepFreeze(pkg);
  }

  function compactValue(value) {
    if (value == null || ['string', 'number', 'boolean'].includes(typeof value)) return value;
    if (Array.isArray(value)) {
      if (value.length <= 8 && value.every((item) => item == null || ['string', 'number', 'boolean'].includes(typeof item))) return value;
      return { type: 'array', length: value.length, hash: stableHash(value) };
    }
    if (typeof value === 'object') return { type: 'object', keyCount: Object.keys(value).length, hash: stableHash(value) };
    return String(value);
  }

  function diffValues(a, b, path, out) {
    if (out.length >= DIFF_LIMIT) return;
    if (a === b) return;
    const aObj = a && typeof a === 'object';
    const bObj = b && typeof b === 'object';
    if (!aObj || !bObj || Array.isArray(a) !== Array.isArray(b)) {
      out.push({ path, from: compactValue(a), to: compactValue(b) });
      return;
    }
    if (Array.isArray(a)) {
      if (stableHash(a) === stableHash(b)) return;
      if (a.length !== b.length) out.push({ path: path + '.length', from: a.length, to: b.length });
      const limit = Math.min(Math.max(a.length, b.length), 300);
      for (let i = 0; i < limit && out.length < DIFF_LIMIT; i += 1) diffValues(a[i], b[i], path + '[' + i + ']', out);
      if (Math.max(a.length, b.length) > limit && out.length < DIFF_LIMIT) {
        out.push({ path: path, from: { hash: stableHash(a), length: a.length }, to: { hash: stableHash(b), length: b.length }, truncated: true });
      }
      return;
    }
    const keys = Array.from(new Set(Object.keys(a).concat(Object.keys(b)))).sort();
    for (const key of keys) {
      if (out.length >= DIFF_LIMIT) break;
      diffValues(a[key], b[key], path ? path + '.' + key : key, out);
    }
  }

  function compareSnapshots(nativeOff, highResOn) {
    const sectionHashes = {};
    for (const name of ['figures', 'paintState', 'atlas', 'materials', 'colorBake', 'resources', 'verification']) {
      sectionHashes[name] = {
        nativeOff: stableHash(nativeOff[name]),
        highResOn: stableHash(highResOn[name]),
        changed: stableHash(nativeOff[name]) !== stableHash(highResOn[name])
      };
    }
    const changedPaths = [];
    for (const name of ['figures', 'paintState', 'atlas', 'materials', 'colorBake', 'resources', 'verification']) {
      diffValues(nativeOff[name], highResOn[name], name, changedPaths);
      if (changedPaths.length >= DIFF_LIMIT) break;
    }
    return {
      sectionHashes,
      changedPathCount: changedPaths.length,
      diffLimitReached: changedPaths.length >= DIFF_LIMIT,
      changedPaths
    };
  }

  function recordEvent(state) {
    if (!state || typeof state !== 'object') return;
    const compact = {
      t: nowIso(),
      enabled: !!state.enabled,
      busy: !!state.busy,
      persistent: !!state.persistent,
      sessionSuppressed: !!state.sessionSuppressed,
      statusText: boundedString(state.statusText, 600),
      statusError: !!state.statusError,
      lastError: boundedString(state.lastError, 800),
      verificationOk: state.lastVerification ? state.lastVerification.ok === true : null,
      restoreVerificationOk: state.lastRestoreVerification ? state.lastRestoreVerification.ok === true : null
    };
    const signature = stableHash(Object.assign({}, compact, { t: null }));
    if (signature === lastEventSignature) return;
    lastEventSignature = signature;
    events.push(compact);
    while (events.length > EVENT_LIMIT) events.shift();
  }

  function publicCaptureResult(pkg) {
    return pkg ? {
      ok: true,
      captureId: pkg.metadata.captureId,
      manifest: pkg.manifest,
      summary: pkg.summary
    } : { ok: false };
  }

  function latestDocument() {
    return lastExportable || lastComparison || lastCapture || null;
  }

  function stateSnapshot() {
    const latest = latestDocument();
    let latestSummary = null;
    if (latest && latest.kind === 'comparison') latestSummary = latest.summary || null;
    else if (latest && latest.summary) latestSummary = latest.summary;
    return {
      version: VERSION,
      build: BUILD,
      schemaVersion: SCHEMA_VERSION,
      operationBusy,
      lastError,
      eventCount: events.length,
      lastCaptureId: lastCapture && lastCapture.metadata && lastCapture.metadata.captureId || null,
      lastComparisonId: lastComparison && lastComparison.metadata && lastComparison.metadata.comparisonId || null,
      latestKind: latest && latest.kind || (latest && latest.format === FORMAT ? 'snapshot' : null),
      latestSummary
    };
  }

  function emit() {
    const state = stateSnapshot();
    for (const listener of listeners) {
      try { listener(state); } catch (_) {}
    }
  }

  function captureCurrent() {
    if (operationBusy) return { ok: false, error: 'Diagnostic capture is already running.' };
    operationBusy = true;
    lastError = null;
    emit();
    try {
      lastCapture = captureSnapshot('Current State', 'current');
      lastExportable = lastCapture;
      return publicCaptureResult(lastCapture);
    } catch (error) {
      lastError = String(error && error.message || error);
      return { ok: false, error: lastError };
    } finally {
      operationBusy = false;
      emit();
    }
  }

  function transitionLog(comparison, action, ok, detail) {
    comparison.transitions.push({
      t: nowIso(),
      action,
      ok: !!ok,
      detail: detail == null ? null : boundedString(detail, 800)
    });
  }

  async function waitForHighResIdle(hr, timeout) {
    const end = Date.now() + (Number(timeout) || IDLE_TIMEOUT);
    let idleSince = 0;
    while (Date.now() < end) {
      let state = null;
      try { state = hr.getState(); } catch (_) { state = null; }
      const idle = !!(state && !state.busy && !state.autoPending && !state.sceneSyncPending);
      if (idle) {
        if (!idleSince) idleSince = Date.now();
        if (Date.now() - idleSince >= IDLE_STABLE_MS) return state;
      } else {
        idleSince = 0;
      }
      await sleep(100);
    }
    return null;
  }

  function semanticValue(value) {
    if (value == null || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map(semanticValue);
    const out = {};
    for (const key of Object.keys(value).sort()) {
      if (key === 'uuid' || key === 'objectId' || /ObjectId$/.test(key)) continue;
      out[key] = semanticValue(value[key]);
    }
    return out;
  }

  function figureMap(rows) {
    return new Map((rows || []).map((row) => [row.figureId || (row.primary ? 'primary' : row.key), row]));
  }

  function resourceSemanticKey(row) {
    return JSON.stringify({
      source: row && row.source || null,
      size: row && row.size || null,
      name: row && row.name || null,
      roles: row && row.roles || [],
      owners: row && row.owners || []
    });
  }

  function buildComparisonFacts(nativeOff, highResOn) {
    const facts = {
      changedAreas: [],
      paintAssignments: [],
      partInventory: [],
      atlasTopology: [],
      resources: null,
      materials: [],
      colorBake: [],
      warnings: {
        nativeOff: (nativeOff.warnings || []).map((row) => row.code).filter(Boolean),
        highResOn: (highResOn.warnings || []).map((row) => row.code).filter(Boolean)
      }
    };

    const offPaint = figureMap(nativeOff.paintState);
    const onPaint = figureMap(highResOn.paintState);
    for (const id of Array.from(new Set([...offPaint.keys(), ...onPaint.keys()])).sort()) {
      const a = offPaint.get(id) || null;
      const b = onPaint.get(id) || null;
      facts.paintAssignments.push({
        figureId: id,
        paintsHash: { nativeOff: a && a.paintsHash || null, highResOn: b && b.paintsHash || null },
        paintByIntentHash: { nativeOff: a && a.paintByIntentHash || null, highResOn: b && b.paintByIntentHash || null },
        paintCount: { nativeOff: a && a.paintCount || 0, highResOn: b && b.paintCount || 0 },
        intentCount: { nativeOff: a && a.intentCount || 0, highResOn: b && b.intentCount || 0 },
        changed: !a || !b || a.paintsHash !== b.paintsHash || a.paintByIntentHash !== b.paintByIntentHash
      });
    }
    if (facts.paintAssignments.some((row) => row.changed)) facts.changedAreas.push('paintAssignments');

    const offFigures = figureMap(nativeOff.figures);
    const onFigures = figureMap(highResOn.figures);
    for (const id of Array.from(new Set([...offFigures.keys(), ...onFigures.keys()])).sort()) {
      const a = offFigures.get(id) || null;
      const b = onFigures.get(id) || null;
      const identityPayload = (row) => row ? {
        inferredMonsterGroups: row.inferredMonsterGroups,
        coreTargets: Object.fromEntries(Object.entries(row.coreTargets || {}).map(([key, value]) => [key, value && {
          identity: value.identity,
          id: value.id,
          baseName: value.baseName,
          name: value.name,
          slot: value.slot,
          partSlot: value.partSlot,
          monsterGroup: value.monsterGroup,
          skel: value.skel,
          slotMeta: value.slotMeta
        }])),
        parts: (row.parts || []).map((part) => ({
          slot: part.slot,
          identity: part.identity,
          id: part.id,
          baseName: part.baseName,
          name: part.name,
          partSlot: part.partSlot,
          monsterGroup: part.monsterGroup,
          skel: part.skel,
          slotMeta: part.slotMeta
        }))
      } : null;
      const ah = stableHash(identityPayload(a));
      const bh = stableHash(identityPayload(b));
      facts.partInventory.push({
        figureId: id,
        nativeOffHash: ah,
        highResOnHash: bh,
        nativeOffPartCount: a && a.partCount || 0,
        highResOnPartCount: b && b.partCount || 0,
        changed: ah !== bh
      });
    }
    if (facts.partInventory.some((row) => row.changed)) facts.changedAreas.push('partInventory');

    const offAtlas = figureMap(nativeOff.atlas);
    const onAtlas = figureMap(highResOn.atlas);
    for (const id of Array.from(new Set([...offAtlas.keys(), ...onAtlas.keys()])).sort()) {
      const a = offAtlas.get(id) || null;
      const b = onAtlas.get(id) || null;
      const offSemantic = a ? { size:a.size, resourceSize:a.resourceSize, sameAtlas:a.sameAtlas, allocations:a.allocations, atlasScale:a.atlasScale } : null;
      const onSemantic = b ? { size:b.size, resourceSize:b.resourceSize, sameAtlas:b.sameAtlas, allocations:b.allocations, atlasScale:b.atlasScale } : null;
      const ah = stableHash(offSemantic);
      const bh = stableHash(onSemantic);
      facts.atlasTopology.push({
        figureId:id,
        nativeOff:offSemantic,
        highResOn:onSemantic,
        changed:ah!==bh
      });
    }
    if (facts.atlasTopology.some((row) => row.changed)) facts.changedAreas.push('atlasTopology');

    const offResourceSet = new Set((nativeOff.resources || []).map(resourceSemanticKey));
    const onResourceSet = new Set((highResOn.resources || []).map(resourceSemanticKey));
    const added = Array.from(onResourceSet).filter((key) => !offResourceSet.has(key));
    const removed = Array.from(offResourceSet).filter((key) => !onResourceSet.has(key));
    facts.resources = {
      nativeOffCount: offResourceSet.size,
      highResOnCount: onResourceSet.size,
      addedCount: added.length,
      removedCount: removed.length,
      added: added.slice(0, 80).map((key) => JSON.parse(key)),
      removed: removed.slice(0, 80).map((key) => JSON.parse(key)),
      truncated: added.length > 80 || removed.length > 80,
      changed: added.length > 0 || removed.length > 0
    };
    if (facts.resources.changed) facts.changedAreas.push('resources');

    const offMaterials = figureMap(nativeOff.materials);
    const onMaterials = figureMap(highResOn.materials);
    for (const id of Array.from(new Set([...offMaterials.keys(), ...onMaterials.keys()])).sort()) {
      const ah = stableHash(semanticValue(offMaterials.get(id) || null));
      const bh = stableHash(semanticValue(onMaterials.get(id) || null));
      facts.materials.push({ figureId:id, nativeOffHash:ah, highResOnHash:bh, changed:ah!==bh });
    }
    if (facts.materials.some((row) => row.changed)) facts.changedAreas.push('materials');

    const offBake = figureMap(nativeOff.colorBake);
    const onBake = figureMap(highResOn.colorBake);
    for (const id of Array.from(new Set([...offBake.keys(), ...onBake.keys()])).sort()) {
      const ah = stableHash(semanticValue(offBake.get(id) || null));
      const bh = stableHash(semanticValue(onBake.get(id) || null));
      facts.colorBake.push({ figureId:id, nativeOffHash:ah, highResOnHash:bh, changed:ah!==bh });
    }
    if (facts.colorBake.some((row) => row.changed)) facts.changedAreas.push('colorBake');

    if (stableHash(facts.warnings.nativeOff) !== stableHash(facts.warnings.highResOn)) facts.changedAreas.push('warnings');
    facts.changedAreas = Array.from(new Set(facts.changedAreas));
    return facts;
  }

  async function runComparison(comparison, hr, original) {
    let persistentTemporarilyDisabled = false;
    try {
      comparison.snapshots.original = captureSnapshot('Original State', 'comparison-original');

      if (original.persistent) {
        hr.setPersistent(false);
        persistentTemporarilyDisabled = true;
        transitionLog(comparison, 'persistent-off-temporary', true, null);
      }

      if (original.enabled) {
        const idle = await waitForHighResIdle(hr);
        if (!idle) throw new Error('Texture Quality did not become idle before native-OFF transition.');
        const disabled = await hr.disable();
        transitionLog(comparison, 'disable-to-native-off', disabled, hr.lastError);
        if (!disabled) throw new Error('Could not reach a verified native OFF state: ' + (hr.lastError || 'disable returned false'));
      }

      if (!await waitForHighResIdle(hr)) throw new Error('Texture Quality did not settle in native OFF state.');
      comparison.snapshots.nativeOff = captureSnapshot('Native OFF', 'comparison-native-off');

      const enabled = await hr.enable();
      transitionLog(comparison, 'enable-high-res', enabled, hr.lastError);
      if (!enabled) throw new Error('Could not reach a verified High Res ON state: ' + (hr.lastError || 'enable returned false'));

      if (!await waitForHighResIdle(hr)) throw new Error('Texture Quality did not settle after High Res enable.');
      comparison.snapshots.highResOn = captureSnapshot('High Res ON', 'comparison-high-res-on');
      comparison.delta = compareSnapshots(comparison.snapshots.nativeOff, comparison.snapshots.highResOn);
      comparison.facts = buildComparisonFacts(comparison.snapshots.nativeOff, comparison.snapshots.highResOn);
    } catch (error) {
      comparison.error = String(error && error.message || error);
      lastError = comparison.error;
    } finally {
      comparison.restoration.attempted = true;
      try {
        const idleBeforeRestore = await waitForHighResIdle(hr);
        if (!idleBeforeRestore) throw new Error('Texture Quality remained busy before original-state restoration.');

        const current = hr.getState();
        let restoreOk = true;
        let detail = null;
        if (original.enabled && !current.enabled) {
          restoreOk = await hr.enable();
          transitionLog(comparison, 'restore-original-on', restoreOk, hr.lastError);
          if (!restoreOk) detail = hr.lastError || 'enable returned false during restoration';
        } else if (!original.enabled && current.enabled) {
          restoreOk = await hr.disable();
          transitionLog(comparison, 'restore-original-off', restoreOk, hr.lastError);
          if (!restoreOk) detail = hr.lastError || 'disable returned false during restoration';
        }

        if (restoreOk && !await waitForHighResIdle(hr)) {
          restoreOk = false;
          detail = 'Texture Quality did not settle after original-state restoration.';
        }

        if (persistentTemporarilyDisabled) {
          hr.setPersistent(true);
          transitionLog(comparison, 'restore-persistent-on', true, null);
        }

        comparison.restoration.ok = !!restoreOk;
        comparison.restoration.detail = detail;
      } catch (restoreError) {
        comparison.restoration.ok = false;
        comparison.restoration.detail = String(restoreError && restoreError.message || restoreError);
        if (!comparison.error) comparison.error = 'Restoration failed: ' + comparison.restoration.detail;
        lastError = comparison.error;
      }

      try { comparison.snapshots.restored = captureSnapshot('Restored Original State', 'comparison-restored'); } catch (_) {}

      const nativeSummary = comparison.snapshots.nativeOff && comparison.snapshots.nativeOff.summary || null;
      const onSummary = comparison.snapshots.highResOn && comparison.snapshots.highResOn.summary || null;
      comparison.summary = {
        comparisonId: comparison.metadata.comparisonId,
        ok: !comparison.error && comparison.restoration.ok !== false && !!comparison.delta,
        error: comparison.error,
        restorationOk: comparison.restoration.ok,
        restorationDetail: comparison.restoration.detail,
        nativeOffCaptureId: nativeSummary && nativeSummary.captureId || null,
        highResOnCaptureId: onSummary && onSummary.captureId || null,
        figureCount: nativeSummary && nativeSummary.figureCount || onSummary && onSummary.figureCount || 0,
        nativePaintsHash: nativeSummary && nativeSummary.primaryPaintsHash || null,
        highResPaintsHash: onSummary && onSummary.primaryPaintsHash || null,
        nativePaintByIntentHash: nativeSummary && nativeSummary.primaryPaintByIntentHash || null,
        highResPaintByIntentHash: onSummary && onSummary.primaryPaintByIntentHash || null,
        semanticChangedAreas: comparison.facts && comparison.facts.changedAreas || [],
        changedPathCount: comparison.delta && comparison.delta.changedPathCount || 0,
        diffLimitReached: comparison.delta && comparison.delta.diffLimitReached || false
      };

      lastComparison = deepFreeze(comparison);
      lastExportable = lastComparison;
      operationBusy = false;
      emit();
    }
  }

  function compareNativeOffToHighRes() {
    if (operationBusy) return { ok: false, error: 'Diagnostic capture is already running.' };
    const hr = getHighRes();
    if (!hr || typeof hr.enable !== 'function' || typeof hr.disable !== 'function') {
      return { ok: false, error: 'Texture Quality service is unavailable.' };
    }

    let original = null;
    try { original = hr.getState(); } catch (error) { return { ok: false, error: String(error) }; }
    if (!original || original.busy) return { ok: false, error: 'Texture Quality is currently busy.' };
    if (original.persistent && !original.enabled) {
      return { ok: false, error: 'OFF-to-ON comparison will not change a Persistent High Res OFF/suppressed state. Disable Persistent High Res first, or use Capture Current State.' };
    }

    const comparison = {
      kind: 'comparison',
      format: FORMAT,
      schemaVersion: SCHEMA_VERSION,
      metadata: {
        comparisonId: 'hrc-' + Date.now().toString(36) + '-' + (captureCounter + 1).toString(36),
        timestamp: nowIso(),
        diagnosticVersion: VERSION,
        diagnosticBuild: BUILD
      },
      originalState: {
        enabled: !!original.enabled,
        persistent: !!original.persistent,
        sessionSuppressed: !!original.sessionSuppressed
      },
      transitions: [],
      snapshots: {},
      delta: null,
      facts: null,
      restoration: { attempted: false, ok: null, detail: null },
      error: null,
      summary: null
    };

    operationBusy = true;
    lastError = null;
    emit();
    runComparison(comparison, hr, original).catch((error) => {
      lastError = String(error && error.message || error);
      operationBusy = false;
      emit();
    });

    return {
      ok: true,
      status: 'started',
      comparisonId: comparison.metadata.comparisonId
    };
  }

  function latestCaptureForSection() {
    if (lastExportable && lastExportable.kind === 'comparison' && lastComparison && lastComparison.snapshots) {
      return lastComparison.snapshots.highResOn || lastComparison.snapshots.nativeOff || lastComparison.snapshots.original || null;
    }
    if (lastCapture) return lastCapture;
    if (lastComparison && lastComparison.snapshots) {
      return lastComparison.snapshots.highResOn || lastComparison.snapshots.nativeOff || lastComparison.snapshots.original || null;
    }
    return null;
  }

  function getLatestManifest() {
    const capture = latestCaptureForSection();
    return cloneJson(capture && capture.manifest || null);
  }

  function getLatestSection(name) {
    const section = String(name || '');
    if (!SECTION_NAMES.includes(section) && section !== 'environment' && section !== 'summary' && section !== 'metadata') return null;
    const capture = latestCaptureForSection();
    return cloneJson(capture && capture[section]);
  }

  function getComparisonSnapshot(name) {
    const key = String(name || '');
    if (!lastComparison || !lastComparison.snapshots || !Object.prototype.hasOwnProperty.call(lastComparison.snapshots, key)) return null;
    return cloneJson(lastComparison.snapshots[key]);
  }
  function getComparisonSection(snapshotName, sectionName) {
    const snapshotKey = String(snapshotName || '');
    const sectionKey = String(sectionName || '');
    const allowedSections = SECTION_NAMES.concat(['manifest', 'summary', 'metadata']);
    if (!allowedSections.includes(sectionKey)) return null;
    if (!lastComparison || !lastComparison.snapshots || !Object.prototype.hasOwnProperty.call(lastComparison.snapshots, snapshotKey)) return null;
    const snapshot = lastComparison.snapshots[snapshotKey];
    return cloneJson(snapshot && snapshot[sectionKey]);
  }

  function getComparisonDelta() {
    return cloneJson(lastComparison && lastComparison.delta || null);
  }

  function downloadLatest() {
    const doc = latestDocument();
    if (!doc) return { ok: false, error: 'No diagnostic has been captured yet.' };
    try {
      const stamp = nowIso().replace(/[:.-]/g, '');
      const id = doc.kind === 'comparison' ? doc.metadata.comparisonId : doc.metadata.captureId;
      const filename = 'WitchDock_HR_Diagnostic_' + stamp + '_' + id + '.json';
      const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return { ok: true, filename };
    } catch (error) {
      return { ok: false, error: String(error && error.message || error) };
    }
  }

  function onChange(listener) {
    if (typeof listener !== 'function') return () => {};
    listeners.add(listener);
    try { listener(stateSnapshot()); } catch (_) {}
    return () => listeners.delete(listener);
  }

  function attachHighResEvents() {
    const hr = getHighRes();
    if (!hr || typeof hr.onChange !== 'function' || unsubscribeHighRes) return false;
    unsubscribeHighRes = hr.onChange((state) => {
      recordEvent(state);
      emit();
    });
    return true;
  }

  function dispose() {
    if (unsubscribeHighRes) {
      try { unsubscribeHighRes(); } catch (_) {}
      unsubscribeHighRes = null;
    }
    listeners.clear();
    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }
    return true;
  }

  UW[GLOBAL] = {
    version: VERSION,
    build: BUILD,
    schemaVersion: SCHEMA_VERSION,
    captureCurrent,
    compareNativeOffToHighRes,
    downloadLatest,
    getState: stateSnapshot,
    getLatestManifest,
    getLatestSection,
    getComparisonSnapshot,
    getComparisonSection,
    getComparisonDelta,
    getComparisonFacts: () => cloneJson(lastComparison && lastComparison.facts || null),
    getComparisonChangedPaths: (offset, limit) => {
      const rows = lastComparison && lastComparison.delta && lastComparison.delta.changedPaths || [];
      const start = Math.max(0, Number(offset) || 0);
      const count = Math.max(1, Math.min(100, Number(limit) || 40));
      return cloneJson(rows.slice(start, start + count));
    },
    onChange,
    dispose
  };

  attachHighResEvents();
  emit();
})();

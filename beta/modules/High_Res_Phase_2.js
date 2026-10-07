(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const host = UW.KWWitchDockBetaTester;
  if (!host || typeof host.registerModule !== "function") {
    throw new Error("Witch Dock Beta Tester host is unavailable.");
  }

  const ID = "high-res-phase-2";
  const VERSION = "0.1.1";
  const BUILD = "0.1.1-native-baseline-preflight";
  const EXPECTED = Object.freeze({
    core: Object.freeze({
      version: "0.3.8",
      build: "0.3.8-supported-body-aaid-binding"
    }),
    stablePriority: Object.freeze({
      version: "0.1.1",
      build: "0.1.1-dev-projected-host-lifecycle-coordination"
    }),
    betaPriority: Object.freeze({
      version: "0.1.2",
      build: "0.1.2-preserve-external-scales",
      sourceBlob: "24246a918e7132158941caee74ca6f5f3ff7d76d"
    }),
    allPart: Object.freeze({
      version: "0.1.13",
      build: "0.1.13-native-baseline-preflight",
      sourceBlob: "75e721560c50eccb6c56c92bef0272396f84ac1d"
    }),
    restorePriority: Object.freeze({
      version: "0.1.1",
      build: "0.1.1-dev-projected-host-lifecycle-coordination",
      sourceBlob: "a89c57e09cdaa2f4213f6b3a8eed95118f4c4d14"
    })
  });

  const BETA_PRIORITY_SOURCE = "// ==UserScript==\r\n// @name         Witch Dock DEV - Texture Quality Active Decal Priority\r\n// @namespace    KnightWitch\r\n// @version      0.1.2\r\n// @description  Dev-only adaptive atlas policy for textures that actually carry decals.\r\n// @match        https://www.heroforge.com/*\r\n// @match        https://heroforge.com/*\r\n// @grant        none\r\n// @run-at       document-idle\r\n// ==/UserScript==\r\n\r\n(function () {\r\n  'use strict';\r\n\r\n  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;\r\n  const GLOBAL = 'KWTextureQualityActiveDecalPriority';\r\n  if (UW[GLOBAL]) return;\r\n\r\n  const VERSION = '0.1.2';\r\n  const BUILD = '0.1.2-preserve-external-scales';\r\n  const CORE_TARGETS = new Set(['bodyLower', 'bodyUpper', 'face']);\r\n  const SCALE = 4;\r\n  const ATLAS_WIDTH = 8192;\r\n  const ATLAS_HEIGHT = 4096;\r\n\r\n  let service = null;\r\n  let originals = null;\r\n  let settingsState = null;\r\n  let hardwareLimit = null;\r\n  let reconcilePromise = null;\r\n  let policyDirty = false;\r\n  let disposed = false;\r\n  let lastError = null;\r\n  const figures = new Map();\r\n\r\n  const own = (o, k) => ({\r\n    o,\r\n    k,\r\n    had: Object.prototype.hasOwnProperty.call(o, k),\r\n    d: Object.getOwnPropertyDescriptor(o, k),\r\n    v: o[k],\r\n    applied: undefined\r\n  });\r\n\r\n  function restoreIfOwned(snapshot) {\r\n    if (!snapshot || !snapshot.o) return false;\r\n    try {\r\n      if (snapshot.applied !== undefined && snapshot.o[snapshot.k] !== snapshot.applied) return false;\r\n      if (snapshot.had && snapshot.d) Object.defineProperty(snapshot.o, snapshot.k, snapshot.d);\r\n      else delete snapshot.o[snapshot.k];\r\n      return true;\r\n    } catch (_) {\r\n      try {\r\n        if (snapshot.applied !== undefined && snapshot.o[snapshot.k] !== snapshot.applied) return false;\r\n        snapshot.o[snapshot.k] = snapshot.v;\r\n        return true;\r\n      } catch (_) {\r\n        return false;\r\n      }\r\n    }\r\n  }\r\n\r\n  function detectTextureLimit() {\r\n    if (hardwareLimit !== null) return hardwareLimit;\r\n    let canvas = null;\r\n    let gl = null;\r\n    try {\r\n      canvas = document.createElement('canvas');\r\n      gl = canvas.getContext('webgl2') || canvas.getContext('webgl');\r\n      const value = gl ? Number(gl.getParameter(gl.MAX_TEXTURE_SIZE)) : 0;\r\n      hardwareLimit = Number.isFinite(value) && value > 0 ? value : 0;\r\n    } catch (_) {\r\n      hardwareLimit = 0;\r\n    } finally {\r\n      try { gl?.getExtension('WEBGL_lose_context')?.loseContext(); } catch (_) {}\r\n      canvas = null;\r\n      gl = null;\r\n    }\r\n    return hardwareLimit;\r\n  }\r\n\r\n  function collectRows() {\r\n    const CK = UW && UW.CK;\r\n    const c = CK && CK.character;\r\n    if (!CK || !c) return [];\r\n    const rows = [];\r\n    const seen = new Set();\r\n    const add = (key, display) => {\r\n      if (!display || typeof display !== 'object' || seen.has(display)) return;\r\n      const d = display.data || (display === c.display ? c.data : null);\r\n      const m = display.modded;\r\n      if (!d || !d.atlasScale || !m || !m.parts) return;\r\n      seen.add(display);\r\n      rows.push({ key: String(key || ''), primary: display === c.display || d.primary === true, d, display, m, parts: m.parts });\r\n    };\r\n    add('', c.display);\r\n    if (c.allDisplays && typeof c.allDisplays === 'object') {\r\n      for (const [key, display] of Object.entries(c.allDisplays)) add(key, display);\r\n    }\r\n    return rows;\r\n  }\r\n\r\n  function hasAppliedDecals(value) {\r\n    if (!value) return false;\r\n    if (value instanceof Map || value instanceof Set) return value.size > 0;\r\n    if (Array.isArray(value)) return value.length > 0;\r\n    if (typeof value === 'object') return Object.keys(value).length > 0;\r\n    return true;\r\n  }\r\n\r\n  function projectedHostKeys(row, decals) {\r\n    const splatter = decals && decals.splatter;\r\n    if (!splatter || typeof splatter !== 'object') return [];\r\n    const out = new Set();\r\n    const entries = Array.isArray(splatter) ? splatter : Object.values(splatter);\r\n    for (const entry of entries) {\r\n      const filter = entry && entry.filter;\r\n      if (!filter || typeof filter !== 'object') continue;\r\n      for (const [key, selected] of Object.entries(filter)) {\r\n        if (selected === true && row.parts[key] && !CORE_TARGETS.has(key)) out.add(key);\r\n      }\r\n    }\r\n    return Array.from(out);\r\n  }\r\n\r\n  function activeAccessoryKeys(row) {\r\n    const decals = row && row.d && row.d.decals;\r\n    if (!decals || typeof decals !== 'object') return [];\r\n    const active = new Set(Object.keys(decals).filter((key) => (\r\n      key !== 'splatter' && row.parts[key] && !CORE_TARGETS.has(key) && hasAppliedDecals(decals[key])\r\n    )));\r\n    for (const key of projectedHostKeys(row, decals)) active.add(key);\r\n    return Array.from(active);\r\n  }\r\n\r\n  function ensureSettings() {\r\n    const CK = UW && UW.CK;\r\n    const S = CK && CK.Settings;\r\n    if (!S) return false;\r\n    if (!settingsState || settingsState.o !== S) {\r\n      if (settingsState) restoreSettings();\r\n      settingsState = {\r\n        o: S,\r\n        width: own(S, 'textureWidthMax'),\r\n        height: own(S, 'textureHeightMax')\r\n      };\r\n    }\r\n\r\n    const limit = detectTextureLimit();\r\n    const currentWidth = Number(S.textureWidthMax) || 0;\r\n    const currentHeight = Number(S.textureHeightMax) || 0;\r\n    // Fail closed if a reliable GPU limit cannot be read. Never raise HeroForge's\r\n    // texture maxima on unknown hardware; keep the current native/outside setting.\r\n    const supportedWidth = limit > 0 ? Math.min(ATLAS_WIDTH, limit) : currentWidth;\r\n    const supportedHeight = limit > 0 ? Math.min(ATLAS_HEIGHT, limit) : currentHeight;\r\n    const desiredWidth = Math.max(currentWidth, supportedWidth);\r\n    const desiredHeight = Math.max(currentHeight, supportedHeight);\r\n    let changed = false;\r\n\r\n    if (currentWidth !== desiredWidth) {\r\n      S.textureWidthMax = desiredWidth;\r\n      settingsState.width.applied = Number(S.textureWidthMax);\r\n      changed = true;\r\n    }\r\n    if (currentHeight !== desiredHeight) {\r\n      S.textureHeightMax = desiredHeight;\r\n      settingsState.height.applied = Number(S.textureHeightMax);\r\n      changed = true;\r\n    }\r\n    return changed;\r\n  }\r\n\r\n  function restoreSettings() {\r\n    if (!settingsState) return false;\r\n    // Only restore maxima this module actually changed. If HeroForge or another\r\n    // owner changed a value afterward, restoreIfOwned also leaves that value alone.\r\n    const restoredWidth = settingsState.width.applied !== undefined ? restoreIfOwned(settingsState.width) : false;\r\n    const restoredHeight = settingsState.height.applied !== undefined ? restoreIfOwned(settingsState.height) : false;\r\n    settingsState = null;\r\n    return restoredWidth || restoredHeight;\r\n  }\r\n\r\n  function ensureFigure(row) {\r\n    let state = figures.get(row.d) || null;\r\n    if (!state || state.scale !== row.d.atlasScale) {\r\n      if (state) restoreFigure(state);\r\n      state = { d: row.d, scale: row.d.atlasScale, snapshots: new Map(), active: new Set(), key: row.key, primary: row.primary };\r\n      figures.set(row.d, state);\r\n    }\r\n\r\n    state.key = row.key;\r\n    state.primary = row.primary;\r\n    const desired = new Set(activeAccessoryKeys(row));\r\n    let changed = false;\r\n\r\n    for (const [key, snapshot] of Array.from(state.snapshots.entries())) {\r\n      if (desired.has(key)) continue;\r\n      changed = restoreIfOwned(snapshot) || changed;\r\n      state.snapshots.delete(key);\r\n    }\r\n\r\n    for (const key of desired) {\r\n      let snapshot = state.snapshots.get(key) || null;\r\n      // An outside edit supersedes our last write; retain its new baseline.\r\n      if (snapshot && state.scale[key] !== snapshot.applied) {\r\n        state.snapshots.delete(key);\r\n        snapshot = null;\r\n      }\r\n      const current = Number(state.scale[key]);\r\n      // Priority is a floor. Do not downsize or claim a manual/native value.\r\n      if (Number.isFinite(current) && current >= SCALE) continue;\r\n      if (!snapshot) {\r\n        snapshot = own(state.scale, key);\r\n        state.snapshots.set(key, snapshot);\r\n      }\r\n      state.scale[key] = SCALE;\r\n      snapshot.applied = state.scale[key];\r\n      changed = true;\r\n    }\r\n\r\n    state.active = desired;\r\n    return changed;\r\n  }\r\n\r\n  function restoreFigure(state) {\r\n    if (!state) return false;\r\n    let changed = false;\r\n    for (const snapshot of state.snapshots.values()) changed = restoreIfOwned(snapshot) || changed;\r\n    state.snapshots.clear();\r\n    state.active.clear();\r\n    return changed;\r\n  }\r\n\r\n  function ensurePolicy() {\r\n    let changed = ensureSettings();\r\n    const rows = collectRows();\r\n    const live = new Set(rows.map((row) => row.d));\r\n    for (const [d, state] of Array.from(figures.entries())) {\r\n      if (live.has(d)) continue;\r\n      changed = restoreFigure(state) || changed;\r\n      figures.delete(d);\r\n    }\r\n    for (const row of rows) changed = ensureFigure(row) || changed;\r\n    return changed;\r\n  }\r\n\r\n  function restorePolicy() {\r\n    let changed = false;\r\n    for (const state of figures.values()) changed = restoreFigure(state) || changed;\r\n    figures.clear();\r\n    changed = restoreSettings() || changed;\r\n    return changed;\r\n  }\r\n\r\n  function lifecycleBlocked() {\r\n    let core = null;\r\n    let repair = null;\r\n    try { core = service && typeof service.getState === 'function' ? service.getState() : null; } catch (_) {}\r\n    try {\r\n      const guard = UW && UW.KWTextureQualitySameFigureDriftGuard;\r\n      repair = guard && typeof guard.getState === 'function' ? guard.getState() : null;\r\n    } catch (_) {}\r\n    return !!((core && core.sceneSyncPending) || (repair && repair.pending));\r\n  }\r\n\r\n  function queuePolicyReconcile() {\r\n    if (disposed || reconcilePromise || !policyDirty || !service || !service.enabled || service.busy || lifecycleBlocked()) return false;\r\n    reconcilePromise = Promise.resolve()\r\n      .then(async () => {\r\n        if (disposed || !service || !service.enabled || service.busy || lifecycleBlocked()) return false;\r\n        const ok = await originals.reconcile.call(service);\r\n        if (ok) policyDirty = false;\r\n        return ok;\r\n      })\r\n      .catch((error) => {\r\n        lastError = String(error && error.message || error);\r\n        console.warn('[Witch Dock texture quality active decals] Reconcile failed:', error);\r\n        return false;\r\n      })\r\n      .finally(() => { reconcilePromise = null; });\r\n    return true;\r\n  }\r\n\r\n  function safeEnsurePolicy() {\r\n    try {\r\n      lastError = null;\r\n      const changed = ensurePolicy();\r\n      if (changed) policyDirty = true;\r\n      return changed;\r\n    } catch (error) {\r\n      lastError = String(error && error.message || error);\r\n      console.warn('[Witch Dock texture quality active decals] Policy update skipped:', error);\r\n      return false;\r\n    }\r\n  }\r\n\r\n  function attach() {\r\n    if (disposed || service) return !!service;\r\n    const candidate = UW && UW.KWTextureQualityNativeReconcile;\r\n    if (!candidate || typeof candidate.enable !== 'function' || typeof candidate.disable !== 'function' ||\r\n        typeof candidate.reconcile !== 'function' || typeof candidate.refresh !== 'function' ||\r\n        typeof candidate.setPersistent !== 'function') return false;\r\n\r\n    service = candidate;\r\n    originals = {\r\n      enable: candidate.enable,\r\n      disable: candidate.disable,\r\n      reconcile: candidate.reconcile,\r\n      refresh: candidate.refresh,\r\n      setPersistent: candidate.setPersistent,\r\n      dispose: typeof candidate.dispose === 'function' ? candidate.dispose : null\r\n    };\r\n\r\n    candidate.enable = async (...args) => {\r\n      safeEnsurePolicy();\r\n      const ok = await originals.enable.apply(candidate, args);\r\n      if (ok) policyDirty = false;\r\n      else if (!candidate.enabled) {\r\n        restorePolicy();\r\n        policyDirty = false;\r\n      }\r\n      return ok;\r\n    };\r\n\r\n    candidate.reconcile = async (...args) => {\r\n      safeEnsurePolicy();\r\n      const ok = await originals.reconcile.apply(candidate, args);\r\n      if (ok) policyDirty = false;\r\n      return ok;\r\n    };\r\n\r\n    candidate.disable = async (...args) => {\r\n      restorePolicy();\r\n      policyDirty = false;\r\n      return originals.disable.apply(candidate, args);\r\n    };\r\n\r\n    candidate.setPersistent = (value) => {\r\n      if (!value && !candidate.enabled) {\r\n        restorePolicy();\r\n        policyDirty = false;\r\n      }\r\n      return originals.setPersistent.call(candidate, value);\r\n    };\r\n\r\n    candidate.refresh = (...args) => {\r\n      // Let the core and same-figure lifecycle guard inspect native state first. If a\r\n      // core lifecycle repair or scene-membership sync is pending, do not mutate\r\n      // accessory scale policy ahead of that stable reconcile.\r\n      const state = originals.refresh.apply(candidate, args);\r\n      const blocked = lifecycleBlocked();\r\n      if (candidate.enabled && !candidate.busy && !blocked) safeEnsurePolicy();\r\n      else if (!candidate.enabled && !candidate.busy && figures.size) {\r\n        restorePolicy();\r\n        policyDirty = false;\r\n      }\r\n      if (state && state.enabled && !state.busy && !blocked && policyDirty) queuePolicyReconcile();\r\n      return state;\r\n    };\r\n\r\n    if (candidate.enabled && !candidate.busy && !lifecycleBlocked()) {\r\n      safeEnsurePolicy();\r\n      queuePolicyReconcile();\r\n    }\r\n    return true;\r\n  }\r\n\r\n  function state() {\r\n    const CK = UW && UW.CK;\r\n    return {\r\n      version: VERSION,\r\n      build: BUILD,\r\n      attached: !!service,\r\n      hardwareTextureLimit: detectTextureLimit(),\r\n      requestedAtlasBudget: [ATLAS_WIDTH, ATLAS_HEIGHT],\r\n      activeBudget: CK && CK.Settings ? [Number(CK.Settings.textureWidthMax), Number(CK.Settings.textureHeightMax)] : null,\r\n      figures: Array.from(figures.values()).map((entry) => ({\r\n        key: entry.key,\r\n        primary: entry.primary,\r\n        activeAccessorySlots: Array.from(entry.active)\r\n      })),\r\n      reconcilePending: !!reconcilePromise,\r\n      policyDirty,\r\n      lifecycleBlocked: lifecycleBlocked(),\r\n      lastError\r\n    };\r\n  }\r\n\r\n  function dispose() {\r\n    disposed = true;\r\n    restorePolicy();\r\n    policyDirty = false;\r\n    if (service && originals) {\r\n      if (service.enable !== originals.enable) service.enable = originals.enable;\r\n      if (service.disable !== originals.disable) service.disable = originals.disable;\r\n      if (service.reconcile !== originals.reconcile) service.reconcile = originals.reconcile;\r\n      if (service.refresh !== originals.refresh) service.refresh = originals.refresh;\r\n      if (service.setPersistent !== originals.setPersistent) service.setPersistent = originals.setPersistent;\r\n    }\r\n    service = null;\r\n    originals = null;\r\n    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }\r\n    return true;\r\n  }\r\n\r\n  UW[GLOBAL] = {\r\n    version: VERSION,\r\n    build: BUILD,\r\n    attach,\r\n    refresh: () => {\r\n      if (!service) attach();\r\n      if (service && service.enabled && !service.busy && !lifecycleBlocked()) {\r\n        safeEnsurePolicy();\r\n        if (policyDirty) queuePolicyReconcile();\r\n      }\r\n      return state();\r\n    },\r\n    getState: state,\r\n    dispose\r\n  };\r\n\r\n  if (!attach()) {\r\n    const timer = window.setInterval(() => {\r\n      if (disposed || attach()) window.clearInterval(timer);\r\n    }, 100);\r\n  }\r\n})();\r\n";
  const ALL_PART_SOURCE = "// ==UserScript==\r\n// @name         Witch Dock DEV - Texture Quality All-Part Promotion\r\n// @namespace    KnightWitch\r\n// @version      0.1.13\r\n// @description  Dev-only independent normal-source and budgeted atlas-density promotion for eligible rendered parts.\r\n// @match        https://www.heroforge.com/*\r\n// @match        https://heroforge.com/*\r\n// @grant        none\r\n// @run-at       document-idle\r\n// ==/UserScript==\r\n\r\n(function () {\r\n  'use strict';\r\n\r\n  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;\r\n  const GLOBAL = 'KWTextureQualityAllPartPromotion';\r\n  if (UW[GLOBAL]) return;\r\n\r\n  const VERSION = '0.1.13';\r\n  const BUILD = '0.1.13-native-baseline-preflight';\r\n  const OWNER = 82042525;\r\n  const CORE_TARGETS = new Set(['bodyLower', 'bodyUpper', 'face']);\r\n  const DEFAULT_QUALITY_CEILING = 1024;\r\n  const MAX_OWNED_ATLAS_PIXELS = 8192 * 4096;\r\n  const LOAD_TIMEOUT = 5000;\r\n  const SETTLE_TIMEOUT = 15000;\r\n  const POLL_MS = 75;\r\n  const CHANGE_DEBOUNCE_MS = 600;\r\n  const PROBE_SIZES = [4096, 2048, 1024, 512, 256, 128, 64, 32];\r\n  const MAX_DIAGNOSTICS = 900;\r\n\r\n  let service = null;\r\n  let originals = null;\r\n  let wrappers = null;\r\n  let disposed = false;\r\n  let running = null;\r\n  let queued = null;\r\n  let active = null;\r\n  let qualityCeiling = DEFAULT_QUALITY_CEILING;\r\n  let changeSuppression = 0;\r\n  let changeDirty = false;\r\n  let changeDirtyAt = 0;\r\n  let changeDirtyReason = null;\r\n  let changeObservers = [];\r\n  let initialCoveragePending = true;\r\n  let lastError = null;\r\n  let lastRun = emptyRun('idle');\r\n  let lastRestored = [];\r\n  const positiveCache = new Map();\r\n  const negativeCache = new Map();\r\n  const inFlight = new Map();\r\n  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\r\n\r\n  function emptyRun(trigger) {\r\n    return {\r\n      trigger,\r\n      startedAt: null,\r\n      finishedAt: null,\r\n      selected: [],\r\n      densitySelected: [],\r\n      downgraded: [],\r\n      skipped: [],\r\n      failed: [],\r\n      restored: [],\r\n      displays: []\r\n    };\r\n  }\r\n\r\n  function boundedPush(list, row) {\r\n    if (list.length < MAX_DIAGNOSTICS) list.push(row);\r\n  }\r\n\r\n  function own(o, k) {\r\n    return {\r\n      o,\r\n      k,\r\n      had: Object.prototype.hasOwnProperty.call(o, k),\r\n      d: Object.getOwnPropertyDescriptor(o, k),\r\n      v: o[k],\r\n      applied: undefined\r\n    };\r\n  }\r\n\r\n  function restoreIfOwned(snapshot) {\r\n    if (!snapshot || !snapshot.o) return { restored: false, outside: false };\r\n    try {\r\n      if (snapshot.applied !== undefined && snapshot.o[snapshot.k] !== snapshot.applied) {\r\n        return { restored: false, outside: true };\r\n      }\r\n      if (snapshot.had && snapshot.d) Object.defineProperty(snapshot.o, snapshot.k, snapshot.d);\r\n      else delete snapshot.o[snapshot.k];\r\n      return { restored: true, outside: false };\r\n    } catch (_) {\r\n      try {\r\n        if (snapshot.applied !== undefined && snapshot.o[snapshot.k] !== snapshot.applied) {\r\n          return { restored: false, outside: true };\r\n        }\r\n        snapshot.o[snapshot.k] = snapshot.v;\r\n        return { restored: true, outside: false };\r\n      } catch (_) {\r\n        return { restored: false, outside: false };\r\n      }\r\n    }\r\n  }\r\n\r\n  function textureSource(texture) {\r\n    try {\r\n      const image = texture && texture.image;\r\n      const source = image && (image.currentSrc || image.src) || texture && (texture.path || texture.url) || null;\r\n      return typeof source === 'string' ? source : null;\r\n    } catch (_) {\r\n      return null;\r\n    }\r\n  }\r\n\r\n  function textureSize(texture) {\r\n    try {\r\n      const image = texture && texture.image;\r\n      const width = Number(image && image.width) || 0;\r\n      const height = Number(image && image.height) || 0;\r\n      return [width, height];\r\n    } catch (_) {\r\n      return [0, 0];\r\n    }\r\n  }\r\n\r\n  function squareTextureSize(texture) {\r\n    const size = textureSize(texture);\r\n    return size[0] > 0 && size[0] === size[1] ? size[0] : Math.max(size[0], size[1]);\r\n  }\r\n\r\n  function parseNormalSource(source) {\r\n    if (typeof source !== 'string' || !source || /^data:|^blob:/i.test(source)) return null;\r\n    const match = source.match(/^(.*(?:_nrml_|_normal_))(\\d+)(\\.[a-z0-9]+(?:[?#].*)?)$/i);\r\n    if (!match) return null;\r\n    const size = Number(match[2]);\r\n    if (!Number.isFinite(size) || size <= 0) return null;\r\n    return {\r\n      prefix: match[1],\r\n      size,\r\n      suffix: match[3],\r\n      key: `${match[1]}{size}${match[3]}`,\r\n      urlFor(nextSize) { return `${match[1]}${nextSize}${match[3]}`; }\r\n    };\r\n  }\r\n\r\n  function resourceType(url) {\r\n    const match = String(url || '').match(/\\.([a-z0-9]+)(?:[?#].*)?$/i);\r\n    return match ? match[1].toLowerCase() : 'webp';\r\n  }\r\n\r\n  function allocationRect(atlas, slot) {\r\n    if (!atlas || typeof atlas.getUV !== 'function') return null;\r\n    try {\r\n      const uv = atlas.getUV(slot);\r\n      if (!uv) return null;\r\n      const width = Math.round(Number(uv.z) * Number(atlas.width));\r\n      const height = Math.round(Number(uv.w) * Number(atlas.height));\r\n      if (!(width > 0 && height > 0)) return null;\r\n      return {\r\n        x: Math.round(Number(uv.x || 0) * Number(atlas.width)),\r\n        y: Math.round(Number(uv.y || 0) * Number(atlas.height)),\r\n        width,\r\n        height,\r\n        area: width * height\r\n      };\r\n    } catch (_) {\r\n      return null;\r\n    }\r\n  }\r\n\r\n  function partId(part) {\r\n    return part ? [part.baseName ?? '', part.name ?? '', part.slot ?? ''].join('|') : null;\r\n  }\r\n\r\n  function collectRows() {\r\n    const CK = UW && UW.CK;\r\n    const c = CK && CK.character;\r\n    if (!CK || !c) return [];\r\n    const rows = [];\r\n    const seen = new Set();\r\n\r\n    const add = (key, display) => {\r\n      if (!display || typeof display !== 'object' || seen.has(display)) return;\r\n      const d = display.data || (display === c.display ? c.data : null);\r\n      const m = display.modded;\r\n      if (!d || !d.atlasScale || !m || !m.parts || !display.meshes || !display.atlas) return;\r\n      seen.add(display);\r\n      rows.push({\r\n        key: String(key || ''),\r\n        primary: display === c.display || d.primary === true,\r\n        d,\r\n        display,\r\n        m,\r\n        parts: m.parts,\r\n        meshes: display.meshes\r\n      });\r\n    };\r\n\r\n    add('', c.display);\r\n    if (c.allDisplays && typeof c.allDisplays === 'object') {\r\n      for (const [key, display] of Object.entries(c.allDisplays)) add(key, display);\r\n    }\r\n    return rows;\r\n  }\r\n\r\n  async function withChangeSuppressed(task) {\r\n    changeSuppression += 1;\r\n    try {\r\n      return await task();\r\n    } finally {\r\n      changeSuppression = Math.max(0, changeSuppression - 1);\r\n    }\r\n  }\r\n\r\n  function markDataChange(reason = 'data-change') {\r\n    if (disposed || changeSuppression > 0) return false;\r\n    changeDirty = true;\r\n    changeDirtyAt = Date.now();\r\n    changeDirtyReason = reason;\r\n    return true;\r\n  }\r\n\r\n  function restoreChangeObserver(entry) {\r\n    if (!entry || !entry.snapshot) return { restored: false, outside: false };\r\n    return restoreIfOwned(entry.snapshot);\r\n  }\r\n\r\n  function syncChangeObservers() {\r\n    const rows = collectRows();\r\n    const live = new Set(rows.map((row) => row.d));\r\n\r\n    for (let index = changeObservers.length - 1; index >= 0; index -= 1) {\r\n      const entry = changeObservers[index];\r\n      if (live.has(entry.d) && entry.d.change === entry.wrapper) continue;\r\n      if (!live.has(entry.d)) restoreChangeObserver(entry);\r\n      changeObservers.splice(index, 1);\r\n    }\r\n\r\n    for (const row of rows) {\r\n      const d = row.d;\r\n      if (!d || typeof d.change !== 'function') continue;\r\n      if (changeObservers.some((entry) => entry.d === d && d.change === entry.wrapper)) continue;\r\n\r\n      const original = d.change;\r\n      const snapshot = own(d, 'change');\r\n      const wrapper = function (...args) {\r\n        const result = original.apply(this, args);\r\n        markDataChange('data-change');\r\n        return result;\r\n      };\r\n\r\n      try {\r\n        d.change = wrapper;\r\n        if (d.change === wrapper) {\r\n          snapshot.applied = wrapper;\r\n          changeObservers.push({ d, wrapper, snapshot });\r\n        }\r\n      } catch (_) {}\r\n    }\r\n    return changeObservers.length;\r\n  }\r\n\r\n  function queuePendingChange() {\r\n    syncChangeObservers();\r\n    if (!changeDirty || (Date.now() - changeDirtyAt) < CHANGE_DEBOUNCE_MS) return false;\r\n    const reason = changeDirtyReason || 'data-change';\r\n    if (!queueCoverage(reason)) return false;\r\n    changeDirty = false;\r\n    changeDirtyAt = 0;\r\n    changeDirtyReason = null;\r\n    return true;\r\n  }\r\n\r\n  function normalUniforms(mesh) {\r\n    const out = [];\r\n    const materials = Array.isArray(mesh && mesh.material) ? mesh.material : [mesh && mesh.material];\r\n    for (let index = 0; index < materials.length; index += 1) {\r\n      const material = materials[index];\r\n      const uniform = material && material.uniforms && material.uniforms.normalMap;\r\n      if (uniform && typeof uniform === 'object' && uniform.value) out.push({ materialIndex: index, uniform });\r\n    }\r\n    return out;\r\n  }\r\n\r\n  function normalizeTarget(value) {\r\n    const numeric = Number(value);\r\n    if (!(numeric > 0)) return 0;\r\n    for (const size of PROBE_SIZES) if (size <= numeric) return size;\r\n    return 0;\r\n  }\r\n\r\n  function ceilTarget(value) {\r\n    const numeric = Number(value);\r\n    if (!(numeric > 0)) return 0;\r\n    const ascending = PROBE_SIZES.slice().sort((a, b) => a - b);\r\n    for (const size of ascending) if (size >= numeric) return size;\r\n    return ascending[ascending.length - 1] || 0;\r\n  }\r\n\r\n  function nativeIdeal(part, fallback = 0) {\r\n    const values = [\r\n      part && part._idealTextureSize,\r\n      part && part.idealTextureSize,\r\n      part && part.idealTextureSizeLegacy,\r\n      part && part.textureSize\r\n    ].map(Number).filter((value) => Number.isFinite(value) && value > 0);\r\n    return values.length ? Math.max(...values) : Math.max(0, Number(fallback) || 0);\r\n  }\r\n\r\n  function detailFaces(part) {\r\n    const values = [\r\n      part && part.facesHiRez,\r\n      part && part.faces\r\n    ].map(Number).filter((value) => Number.isFinite(value) && value > 0);\r\n    return values.length ? Math.max(...values) : 0;\r\n  }\r\n\r\n  function detailPressure(part, effectiveDetail) {\r\n    const faces = detailFaces(part);\r\n    const edge = Math.max(1, Number(effectiveDetail) || 0);\r\n    return faces > 0 ? faces / (edge * edge) : 0;\r\n  }\r\n\r\n  function idealTarget(part, currentSource, allocation) {\r\n    const values = [\r\n      currentSource,\r\n      allocation ? Math.max(allocation.width, allocation.height) : 0,\r\n      part && part.bakeSize,\r\n      nativeIdeal(part, currentSource)\r\n    ].map(Number).filter((value) => Number.isFinite(value) && value > 0);\r\n    const declared = values.length ? Math.max(...values) : currentSource;\r\n    const normalized = normalizeTarget(declared) || currentSource;\r\n    return Math.max(currentSource, Math.min(qualityCeiling, normalized));\r\n  }\r\n\r\n  function collectHosts(row) {\r\n    const hosts = [];\r\n    for (const [key, mesh] of Object.entries(row.meshes || {})) {\r\n      if (CORE_TARGETS.has(key)) continue;\r\n      const part = row.parts[key];\r\n      if (!part) continue;\r\n      const allocation = allocationRect(row.display.atlas, key);\r\n      if (!allocation) continue;\r\n      const bindings = normalUniforms(mesh);\r\n\r\n      for (let bindingIndex = 0; bindingIndex < bindings.length; bindingIndex += 1) {\r\n        const binding = bindings[bindingIndex];\r\n        const texture = binding.uniform.value;\r\n        const source = textureSource(texture);\r\n        const parsed = parseNormalSource(source);\r\n        if (!parsed) continue;\r\n        const currentSource = squareTextureSize(texture) || parsed.size;\r\n        if (!(currentSource > 0)) continue;\r\n        hosts.push({\r\n          row,\r\n          key,\r\n          bindingIndex,\r\n          mesh,\r\n          part,\r\n          uniform: binding.uniform,\r\n          texture,\r\n          source,\r\n          parsed,\r\n          currentSource,\r\n          allocation,\r\n          ideal: idealTarget(part, currentSource, allocation),\r\n          scale: Number(row.d.atlasScale[key]),\r\n          usedTextureSize: Number(part._usedTextureSize)\r\n        });\r\n      }\r\n    }\r\n    return hosts;\r\n  }\r\n\r\n  function collectAllocations(row) {\r\n    const map = new Map();\r\n    const rects = new Set();\r\n    let occupied = 0;\r\n\r\n    for (const key of Object.keys(row.parts || {})) {\r\n      const rect = allocationRect(row.display.atlas, key);\r\n      if (!rect) continue;\r\n      map.set(key, rect);\r\n      const signature = `${rect.x}:${rect.y}:${rect.width}:${rect.height}`;\r\n      if (!rects.has(signature)) {\r\n        rects.add(signature);\r\n        occupied += rect.area;\r\n      }\r\n    }\r\n    return { map, occupied };\r\n  }\r\n\r\n  function displayBudget(row, occupied) {\r\n    const CK = UW && UW.CK;\r\n    const S = CK && CK.Settings;\r\n    const atlasArea = Math.max(0, Number(row.display.atlas.width) * Number(row.display.atlas.height));\r\n    const settingsArea = S\r\n      ? Math.max(0, Number(S.textureWidthMax) * Number(S.textureHeightMax))\r\n      : 0;\r\n    const ownedCeiling = settingsArea > 0 ? Math.min(settingsArea, MAX_OWNED_ATLAS_PIXELS) : 0;\r\n    const budget = Math.max(atlasArea, ownedCeiling, occupied);\r\n    return Number.isFinite(budget) && budget > 0 ? budget : occupied;\r\n  }\r\n\r\n  function baselinePackingOptions(baseline) {\r\n    const minimumSizes = {};\r\n    for (const [key, rect] of baseline.map.entries()) {\r\n      const edge = Math.max(Number(rect.width) || 0, Number(rect.height) || 0);\r\n      if (edge > 0) minimumSizes[key] = edge;\r\n    }\r\n    return { minimumSizes };\r\n  }\r\n\r\n  function desiredScaleForHost(host, target) {\r\n    const allocationEdge = Math.max(host.allocation.width, host.allocation.height);\r\n    if (!(target > allocationEdge) || !(allocationEdge > 0)) return null;\r\n    return target / allocationEdge;\r\n  }\r\n\r\n  function applySelectionScale(scale, selection) {\r\n    let changed = false;\r\n    for (const host of selection.group.hosts) {\r\n      const desiredScale = desiredScaleForHost(host, selection.target);\r\n      if (!(desiredScale > 0)) continue;\r\n      const currentScale = Number(scale[host.key]);\r\n      if (!Number.isFinite(currentScale) || currentScale < desiredScale) {\r\n        scale[host.key] = desiredScale;\r\n        changed = true;\r\n      }\r\n    }\r\n    return changed;\r\n  }\r\n\r\n  function nativePackingPreflight(row, baseline, selections) {\r\n    const densitySelections = selections.filter((selection) => (\r\n      selection.group.hosts.some((host) => (\r\n        selection.target > Math.max(host.allocation.width, host.allocation.height)\r\n      ))\r\n    ));\r\n    if (!densitySelections.length) {\r\n      return { ok: true, available: true, reason: 'source-only', atlas: null, regressions: [], selectedFailures: [] };\r\n    }\r\n\r\n    const CK = UW && UW.CK;\r\n    if (!CK || typeof CK.Atlas !== 'function' || !row.d || typeof row.d.isUHD !== 'function') {\r\n      return {\r\n        ok: false,\r\n        available: false,\r\n        reason: 'native-atlas-preflight-unavailable',\r\n        atlas: null,\r\n        regressions: [],\r\n        selectedFailures: []\r\n      };\r\n    }\r\n\r\n    const scale = Object.assign({}, row.d.atlasScale || {});\r\n    for (const selection of selections) applySelectionScale(scale, selection);\r\n\r\n    let atlas = null;\r\n    try {\r\n      atlas = new CK.Atlas(\r\n        Object.assign({}, row.parts),\r\n        undefined,\r\n        undefined,\r\n        undefined,\r\n        row.d.isUHD(),\r\n        scale,\r\n        baselinePackingOptions(baseline)\r\n      );\r\n    } catch (error) {\r\n      return {\r\n        ok: false,\r\n        available: true,\r\n        reason: 'native-atlas-preflight-error',\r\n        error: String(error && error.message || error),\r\n        atlas: null,\r\n        regressions: [],\r\n        selectedFailures: []\r\n      };\r\n    }\r\n\r\n    const atlasPixels = Math.max(0, Number(atlas.width) * Number(atlas.height));\r\n    if (!(atlasPixels > 0) || atlasPixels > MAX_OWNED_ATLAS_PIXELS) {\r\n      return {\r\n        ok: false,\r\n        available: true,\r\n        reason: 'native-atlas-area-ceiling',\r\n        atlas: [Number(atlas.width), Number(atlas.height)],\r\n        atlasPixels,\r\n        regressions: [],\r\n        selectedFailures: []\r\n      };\r\n    }\r\n\r\n    const selectedTargets = new Map();\r\n    for (const selection of selections) {\r\n      for (const host of selection.group.hosts) {\r\n        selectedTargets.set(host.key, Math.max(selectedTargets.get(host.key) || 0, selection.target));\r\n      }\r\n    }\r\n\r\n    const regressions = [];\r\n    for (const [key, base] of baseline.map.entries()) {\r\n      const current = allocationRect(atlas, key);\r\n      if (!current || current.width < base.width || current.height < base.height) {\r\n        regressions.push({\r\n          key,\r\n          baseline: [base.width, base.height],\r\n          current: current ? [current.width, current.height] : null\r\n        });\r\n      }\r\n    }\r\n\r\n    const selectedFailures = [];\r\n    for (const [key, target] of selectedTargets.entries()) {\r\n      const current = allocationRect(atlas, key);\r\n      if (!current || current.width < target || current.height < target) {\r\n        selectedFailures.push({\r\n          key,\r\n          target,\r\n          current: current ? [current.width, current.height] : null\r\n        });\r\n      }\r\n    }\r\n\r\n    return {\r\n      ok: regressions.length === 0 && selectedFailures.length === 0,\r\n      available: true,\r\n      reason: regressions.length\r\n        ? 'native-packing-regression'\r\n        : (selectedFailures.length ? 'native-packing-target-miss' : 'native-packing-safe'),\r\n      atlas: [Number(atlas.width), Number(atlas.height)],\r\n      atlasPixels,\r\n      regressions,\r\n      selectedFailures\r\n    };\r\n  }\r\n\r\n  function groupHosts(hosts) {\r\n    const groups = new Map();\r\n    for (const host of hosts) {\r\n      let group = groups.get(host.parsed.key);\r\n      if (!group) {\r\n        group = {\r\n          id: host.parsed.key,\r\n          parsed: host.parsed,\r\n          hosts: [],\r\n          existingBySize: new Map(),\r\n          desired: 0,\r\n          nativeIdeal: 0,\r\n          minEffectiveDetail: Number.POSITIVE_INFINITY,\r\n          maxDetailPressure: 0,\r\n          maxAllocation: 0,\r\n          uniqueKeys: new Set(),\r\n          sourceCeiling: 0,\r\n          sourceTexture: null,\r\n          sourceUrl: null,\r\n          failedUrls: []\r\n        };\r\n        groups.set(group.id, group);\r\n      }\r\n      group.hosts.push(host);\r\n      group.uniqueKeys.add(host.key);\r\n      group.desired = Math.max(group.desired, host.ideal);\r\n      group.nativeIdeal = Math.max(group.nativeIdeal, nativeIdeal(host.part, host.currentSource));\r\n      const allocationEdge = Math.max(host.allocation.width, host.allocation.height);\r\n      const effectiveDetail = Math.max(1, Math.min(host.currentSource, allocationEdge));\r\n      group.minEffectiveDetail = Math.min(group.minEffectiveDetail, effectiveDetail);\r\n      group.maxDetailPressure = Math.max(group.maxDetailPressure, detailPressure(host.part, effectiveDetail));\r\n      group.maxAllocation = Math.max(group.maxAllocation, host.allocation.width, host.allocation.height);\r\n      if (!group.existingBySize.has(host.currentSource)) {\r\n        group.existingBySize.set(host.currentSource, { texture: host.texture, url: host.source });\r\n      }\r\n    }\r\n    return Array.from(groups.values());\r\n  }\r\n\r\n  function groupPriorityTarget(group) {\r\n    const existing = Math.max(...Array.from(group.existingBySize.keys()));\r\n    return Math.max(\r\n      existing,\r\n      Math.min(group.desired || existing, group.sourceCeiling || existing, qualityCeiling)\r\n    );\r\n  }\r\n\r\n  function groupIntrinsicFloorTarget(group) {\r\n    const existingSource = Math.max(...Array.from(group.existingBySize.keys()));\r\n    const current = Math.max(existingSource, group.maxAllocation || 0);\r\n    const ceiling = groupPriorityTarget(group);\r\n    const intrinsic = ceilTarget(group.nativeIdeal || current) || current;\r\n    return Math.max(current, Math.min(ceiling, intrinsic));\r\n  }\r\n\r\n  function groupPriorityMetrics(group) {\r\n    const target = groupPriorityTarget(group);\r\n    const source = Math.max(1, Math.max(...Array.from(group.existingBySize.keys())));\r\n    const effective = Math.max(\r\n      1,\r\n      Number.isFinite(group.minEffectiveDetail) ? group.minEffectiveDetail : group.maxAllocation\r\n    );\r\n    const sourceGain = target / source;\r\n    const effectiveGain = target / effective;\r\n    const pressure = Math.max(0, Number(group.maxDetailPressure) || 0);\r\n    const hasBenefit = target > source || target > effective;\r\n    return {\r\n      target,\r\n      source,\r\n      effective,\r\n      sourceGain,\r\n      effectiveGain,\r\n      pressure,\r\n      score: hasBenefit\r\n        ? (pressure > 0 ? pressure * effectiveGain * Math.max(1, sourceGain) : effectiveGain * Math.max(1, sourceGain))\r\n        : 0\r\n    };\r\n  }\r\n\r\n  function groupPriority(a, b) {\r\n    const am = groupPriorityMetrics(a);\r\n    const bm = groupPriorityMetrics(b);\r\n    if (bm.score !== am.score) return bm.score - am.score;\r\n    if (bm.pressure !== am.pressure) return bm.pressure - am.pressure;\r\n    if (bm.sourceGain !== am.sourceGain) return bm.sourceGain - am.sourceGain;\r\n    if (b.nativeIdeal !== a.nativeIdeal) return b.nativeIdeal - a.nativeIdeal;\r\n    if (a.uniqueKeys.size !== b.uniqueKeys.size) return a.uniqueKeys.size - b.uniqueKeys.size;\r\n    if (bm.target !== am.target) return bm.target - am.target;\r\n    if (b.maxAllocation !== a.maxAllocation) return b.maxAllocation - a.maxAllocation;\r\n    return a.id.localeCompare(b.id);\r\n  }\r\n\r\n  function premiumPriority(a, b) {\r\n    if (b.nativeIdeal !== a.nativeIdeal) return b.nativeIdeal - a.nativeIdeal;\r\n    const am = groupPriorityMetrics(a);\r\n    const bm = groupPriorityMetrics(b);\r\n    if (bm.score !== am.score) return bm.score - am.score;\r\n    if (a.uniqueKeys.size !== b.uniqueKeys.size) return a.uniqueKeys.size - b.uniqueKeys.size;\r\n    if (bm.target !== am.target) return bm.target - am.target;\r\n    return a.id.localeCompare(b.id);\r\n  }\r\n\r\n  function nextStateTarget(state) {\r\n    if (!state || state.blockedReason) return 0;\r\n    while (\r\n      state.nextIndex < state.candidates.length &&\r\n      state.candidates[state.nextIndex] <= state.finalTarget\r\n    ) {\r\n      state.nextIndex += 1;\r\n    }\r\n    return state.nextIndex < state.candidates.length ? state.candidates[state.nextIndex] : 0;\r\n  }\r\n\r\n  function incrementPriorityMetrics(state, target = nextStateTarget(state)) {\r\n    const group = state && state.group;\r\n    if (!group || !(target > 0)) {\r\n      return {\r\n        target: 0,\r\n        priorTarget: 0,\r\n        incrementalCost: 0,\r\n        benefit: 0,\r\n        efficiency: 0,\r\n        free: false,\r\n        demandRatio: 0,\r\n        detailWeight: 0,\r\n        repeatBenefit: 0\r\n      };\r\n    }\r\n\r\n    const sourceBase = Math.max(1, state.finalTarget || state.currentMax || 1);\r\n    const priorCost = Math.max(0, Number(state.finalCost) || 0);\r\n    const totalCost = targetCost(group, target);\r\n    const incrementalCost = Math.max(0, totalCost - priorCost);\r\n    const nativeDemand = Math.max(1, Number(group.nativeIdeal) || sourceBase);\r\n    const demandRatio = Math.min(1, nativeDemand / Math.max(1, target));\r\n    const pressure = Math.max(0, Number(group.maxDetailPressure) || 0);\r\n    const detailWeight = 1 + Math.min(3, Math.sqrt(pressure));\r\n    const repeatBenefit = Math.sqrt(Math.max(1, group.uniqueKeys.size));\r\n    const qualityStep = Math.max(1, Math.log2(Math.max(1, target / sourceBase)));\r\n    const benefit =\r\n      nativeDemand * nativeDemand *\r\n      detailWeight *\r\n      repeatBenefit *\r\n      demandRatio * demandRatio *\r\n      qualityStep;\r\n\r\n    return {\r\n      target,\r\n      priorTarget: state.finalTarget || state.currentMax || 0,\r\n      incrementalCost,\r\n      benefit,\r\n      efficiency: incrementalCost > 0 ? benefit / incrementalCost : null,\r\n      free: incrementalCost === 0,\r\n      demandRatio,\r\n      detailWeight,\r\n      repeatBenefit\r\n    };\r\n  }\r\n\r\n  function compareStateIncrement(a, b) {\r\n    const am = incrementPriorityMetrics(a);\r\n    const bm = incrementPriorityMetrics(b);\r\n    if (am.free !== bm.free) return am.free ? -1 : 1;\r\n    if (!am.free && bm.efficiency !== am.efficiency) return bm.efficiency - am.efficiency;\r\n    if (bm.benefit !== am.benefit) return bm.benefit - am.benefit;\r\n    if (b.group.nativeIdeal !== a.group.nativeIdeal) return b.group.nativeIdeal - a.group.nativeIdeal;\r\n    if (a.group.uniqueKeys.size !== b.group.uniqueKeys.size) return a.group.uniqueKeys.size - b.group.uniqueKeys.size;\r\n    if (bm.target !== am.target) return bm.target - am.target;\r\n    return a.group.id.localeCompare(b.group.id);\r\n  }\r\n\r\n  async function loadVariant(url, expectedSize) {\r\n    if (positiveCache.has(url)) return positiveCache.get(url);\r\n    if (negativeCache.has(url)) return null;\r\n    if (inFlight.has(url)) return inFlight.get(url);\r\n\r\n    const promise = (async () => {\r\n      const CK = UW && UW.CK;\r\n      const R = CK && CK.Resources;\r\n      if (!R || typeof R.getResource !== 'function' || typeof R.getNow !== 'function') return null;\r\n\r\n      let loadError = null;\r\n      let settled = false;\r\n      let resolvedTexture = null;\r\n      try {\r\n        const pending = R.getResource(url, resourceType(url), OWNER);\r\n        if (pending && typeof pending.then === 'function') {\r\n          pending.then(\r\n            (value) => {\r\n              settled = true;\r\n              resolvedTexture = value || null;\r\n            },\r\n            (error) => {\r\n              settled = true;\r\n              loadError = String(error && error.message || error);\r\n            }\r\n          );\r\n        } else {\r\n          settled = true;\r\n          resolvedTexture = pending || null;\r\n        }\r\n      } catch (error) {\r\n        loadError = String(error && error.message || error);\r\n        settled = true;\r\n      }\r\n\r\n      const end = Date.now() + LOAD_TIMEOUT;\r\n      while (Date.now() < end) {\r\n        const resolvedSize = squareTextureSize(resolvedTexture);\r\n        if (resolvedTexture && resolvedSize === expectedSize) {\r\n          positiveCache.set(url, resolvedTexture);\r\n          return resolvedTexture;\r\n        }\r\n\r\n        let texture = null;\r\n        try { texture = R.getNow(url); } catch (_) {}\r\n        const size = squareTextureSize(texture);\r\n        if (texture && size === expectedSize) {\r\n          positiveCache.set(url, texture);\r\n          return texture;\r\n        }\r\n\r\n        if (settled) {\r\n          const wrongSize = resolvedTexture && resolvedSize > 0 && resolvedSize !== expectedSize;\r\n          negativeCache.set(\r\n            url,\r\n            loadError || (wrongSize ? `size-mismatch-${resolvedSize}-expected-${expectedSize}` : 'load-failed')\r\n          );\r\n          return null;\r\n        }\r\n        await sleep(POLL_MS);\r\n      }\r\n\r\n      // A timeout can be transient under a large scene/resource queue. Do not\r\n      // poison later reconciliation passes with a permanent negative result.\r\n      return null;\r\n    })().finally(() => inFlight.delete(url));\r\n\r\n    inFlight.set(url, promise);\r\n    return promise;\r\n  }\r\n\r\n  function candidateSizes(group) {\r\n    const currentMax = Math.max(...Array.from(group.existingBySize.keys()));\r\n    const upper = Math.max(currentMax, Math.min(qualityCeiling, group.desired));\r\n    return PROBE_SIZES.filter((size) => size > currentMax && size <= upper);\r\n  }\r\n\r\n  async function resolveSourceCeiling(group) {\r\n    const currentMax = Math.max(...Array.from(group.existingBySize.keys()));\r\n    group.sourceCeiling = currentMax;\r\n    const existing = group.existingBySize.get(currentMax);\r\n    group.sourceTexture = existing ? existing.texture : null;\r\n    group.sourceUrl = existing ? existing.url : null;\r\n\r\n    for (const size of candidateSizes(group)) {\r\n      const url = group.parsed.urlFor(size);\r\n      const texture = await loadVariant(url, size);\r\n      if (texture) {\r\n        group.sourceCeiling = size;\r\n        group.sourceTexture = texture;\r\n        group.sourceUrl = url;\r\n        return group;\r\n      }\r\n      group.failedUrls.push(url);\r\n    }\r\n    return group;\r\n  }\r\n\r\n  async function mapLimit(items, limit, worker) {\r\n    const out = new Array(items.length);\r\n    let cursor = 0;\r\n    const runners = new Array(Math.min(limit, items.length)).fill(null).map(async () => {\r\n      while (cursor < items.length) {\r\n        const index = cursor++;\r\n        out[index] = await worker(items[index], index);\r\n      }\r\n    });\r\n    await Promise.all(runners);\r\n    return out;\r\n  }\r\n\r\n  function targetCost(group, target) {\r\n    let cost = 0;\r\n    const seen = new Set();\r\n    for (const host of group.hosts) {\r\n      if (seen.has(host.key)) continue;\r\n      seen.add(host.key);\r\n      const currentArea = host.allocation.area;\r\n      const targetArea = target * target;\r\n      if (targetArea > currentArea) cost += targetArea - currentArea;\r\n    }\r\n    return cost;\r\n  }\r\n\r\n  async function textureForTarget(group, target) {\r\n    if (group.existingBySize.has(target)) return group.existingBySize.get(target);\r\n    if (target === group.sourceCeiling && group.sourceTexture) {\r\n      return { texture: group.sourceTexture, url: group.sourceUrl };\r\n    }\r\n    const url = group.parsed.urlFor(target);\r\n    const texture = await loadVariant(url, target);\r\n    return texture ? { texture, url } : null;\r\n  }\r\n\r\n  function selectionCandidateSizes(group) {\r\n    const upper = Math.max(\r\n      Math.max(...Array.from(group.existingBySize.keys())),\r\n      Math.min(group.sourceCeiling || 0, group.desired || 0, qualityCeiling)\r\n    );\r\n    return PROBE_SIZES.filter((size) => size <= upper && size > 0);\r\n  }\r\n\r\n  async function planDisplay(row, run) {\r\n    const hosts = collectHosts(row);\r\n    const groups = groupHosts(hosts);\r\n    await mapLimit(groups, 8, async (group) => {\r\n      try {\r\n        await resolveSourceCeiling(group);\r\n      } catch (error) {\r\n        group.resolveError = String(error && error.message || error);\r\n      }\r\n      return group;\r\n    });\r\n    groups.sort(groupPriority);\r\n\r\n    const baseline = collectAllocations(row);\r\n    const budget = displayBudget(row, baseline.occupied);\r\n    let remaining = Math.max(0, budget - baseline.occupied);\r\n    const selected = [];\r\n    const normalSelected = [];\r\n    const selectedByGroup = new Map();\r\n\r\n    const displayDiag = {\r\n      key: row.key,\r\n      primary: row.primary,\r\n      atlas: [Number(row.display.atlas.width), Number(row.display.atlas.height)],\r\n      occupiedPixels: baseline.occupied,\r\n      budgetPixels: budget,\r\n      remainingPixelsBefore: remaining,\r\n      eligibleBindings: hosts.length,\r\n      groups: groups.length\r\n    };\r\n    run.displays.push(displayDiag);\r\n\r\n    const states = groups.map((group) => {\r\n      if (group.resolveError) {\r\n        boundedPush(run.failed, {\r\n          display: row.key,\r\n          group: group.id,\r\n          reason: 'source-resolution-error',\r\n          error: group.resolveError\r\n        });\r\n      }\r\n      for (const url of group.failedUrls) {\r\n        boundedPush(run.failed, {\r\n          display: row.key,\r\n          group: group.id,\r\n          reason: 'source-variant-unavailable',\r\n          url\r\n        });\r\n      }\r\n\r\n      const currentMax = Math.max(...group.hosts.map((host) => host.currentSource));\r\n      const desiredUpper = Math.max(currentMax, Math.min(group.desired, group.sourceCeiling, qualityCeiling));\r\n      const normalTarget = desiredUpper;\r\n      const floorTarget = Math.max(currentMax, Math.min(desiredUpper, groupIntrinsicFloorTarget(group)));\r\n      const hasDensityBenefit = (target) => group.hosts.some((host) => (\r\n        target > Math.max(host.allocation.width, host.allocation.height)\r\n      ));\r\n      const candidates = selectionCandidateSizes(group)\r\n        .filter((size) => size <= desiredUpper && hasDensityBenefit(size))\r\n        .sort((a, b) => a - b);\r\n\r\n      return {\r\n        group,\r\n        currentMax,\r\n        desiredUpper,\r\n        normalTarget,\r\n        floorTarget,\r\n        candidates,\r\n        nextIndex: 0,\r\n        highestCandidate: candidates.length ? candidates[candidates.length - 1] : 0,\r\n        finalTarget: 0,\r\n        finalCost: 0,\r\n        packingRejected: [],\r\n        variantRejected: [],\r\n        blockedReason: null,\r\n        blockedPhase: null\r\n      };\r\n    });\r\n\r\n    // Normal-map source quality is independent from atlas density. The normal map\r\n    // is sampled directly by the rendered material, while atlasScale controls the\r\n    // paint/mask allocation. Bind the highest verified normal variant even when a\r\n    // larger atlas rectangle would be unsafe or unavailable; density remains under\r\n    // the existing budget + detached CK.Atlas no-collateral policy below.\r\n    for (const state of states) {\r\n      const { group, normalTarget } = state;\r\n      if (group.resolveError || !(normalTarget > 0)) continue;\r\n      if (!group.hosts.some((host) => normalTarget > host.currentSource)) continue;\r\n      const variant = await textureForTarget(group, normalTarget);\r\n      if (!variant) {\r\n        boundedPush(run.failed, {\r\n          display: row.key,\r\n          group: group.id,\r\n          reason: 'normal-source-target-unavailable',\r\n          target: normalTarget\r\n        });\r\n        continue;\r\n      }\r\n      normalSelected.push({\r\n        row,\r\n        group,\r\n        target: normalTarget,\r\n        texture: variant.texture,\r\n        url: variant.url\r\n      });\r\n    }\r\n    displayDiag.normalSourceGroups = normalSelected.length;\r\n    displayDiag.normalSourceBindings = normalSelected.reduce(\r\n      (sum, selection) => sum + selection.group.hosts.filter((host) => selection.target > host.currentSource).length,\r\n      0\r\n    );\r\n\r\n    async function advanceState(state, maxTarget, phase) {\r\n      const { group } = state;\r\n      if (group.resolveError || state.blockedReason || state.nextIndex >= state.candidates.length) return false;\r\n\r\n      let chosen = null;\r\n      while (state.nextIndex < state.candidates.length) {\r\n        const target = state.candidates[state.nextIndex];\r\n        if (target > maxTarget) break;\r\n        state.nextIndex += 1;\r\n        if (target <= state.finalTarget) continue;\r\n\r\n        const cost = targetCost(group, target);\r\n        const incrementalCost = Math.max(0, cost - state.finalCost);\r\n        if (incrementalCost > remaining) {\r\n          state.blockedReason = 'display-budget';\r\n          state.blockedPhase = phase;\r\n          break;\r\n        }\r\n\r\n        const prospective = { row, group, target, cost };\r\n        const prior = selectedByGroup.get(group);\r\n        const prospectiveSelected = prior\r\n          ? selected.map((entry) => entry === prior ? prospective : entry)\r\n          : selected.concat(prospective);\r\n        const packing = nativePackingPreflight(row, baseline, prospectiveSelected);\r\n        if (!packing.ok) {\r\n          state.packingRejected.push({\r\n            target,\r\n            phase,\r\n            reason: packing.reason,\r\n            atlas: packing.atlas,\r\n            regression: packing.regressions[0] || null,\r\n            selectedFailure: packing.selectedFailures[0] || null,\r\n            error: packing.error || null\r\n          });\r\n          displayDiag.nativePackingRejects = (displayDiag.nativePackingRejects || 0) + 1;\r\n          state.blockedReason = 'native-packing';\r\n          state.blockedPhase = phase;\r\n          break;\r\n        }\r\n\r\n        const variant = await textureForTarget(group, target);\r\n        if (!variant) {\r\n          state.variantRejected.push({ target, phase });\r\n          continue;\r\n        }\r\n\r\n        chosen = { target, cost, incrementalCost, variant, packing };\r\n        break;\r\n      }\r\n\r\n      if (!chosen) return false;\r\n\r\n      const entry = {\r\n        row,\r\n        group,\r\n        target: chosen.target,\r\n        texture: chosen.variant.texture,\r\n        url: chosen.variant.url,\r\n        cost: chosen.cost,\r\n        packingAtlas: chosen.packing.atlas\r\n      };\r\n      const prior = selectedByGroup.get(group);\r\n      if (prior) {\r\n        const index = selected.indexOf(prior);\r\n        if (index >= 0) selected[index] = entry;\r\n      } else {\r\n        selected.push(entry);\r\n      }\r\n      selectedByGroup.set(group, entry);\r\n      remaining -= chosen.incrementalCost;\r\n      state.finalTarget = chosen.target;\r\n      state.finalCost = chosen.cost;\r\n      return true;\r\n    }\r\n\r\n    // Spend atlas headroom one density increment at a time. Normal-source headroom\r\n    // is already handled independently above. Each round picks the currently\r\n    // highest-value density increment using HeroForge's native detail demand,\r\n    // geometry pressure, repeated-instance cost, and diminishing returns. Repeated\r\n    // groups remain atomic and every accepted density step still passes native CK.Atlas.\r\n    let allocationRounds = 0;\r\n    const maxAttempts = states.reduce((sum, state) => sum + state.candidates.length, 0) + states.length;\r\n    while (allocationRounds < maxAttempts) {\r\n      const eligible = states.filter((state) => (\r\n        !state.group.resolveError &&\r\n        !state.blockedReason &&\r\n        nextStateTarget(state) > 0\r\n      ));\r\n      if (!eligible.length) break;\r\n\r\n      eligible.sort(compareStateIncrement);\r\n      const state = eligible[0];\r\n      const beforeIndex = state.nextIndex;\r\n      const beforeTarget = state.finalTarget;\r\n      state.lastAttemptPriority = incrementPriorityMetrics(state);\r\n      await advanceState(state, state.highestCandidate, 'marginal-value');\r\n      allocationRounds += 1;\r\n\r\n      if (\r\n        state.nextIndex === beforeIndex &&\r\n        state.finalTarget === beforeTarget &&\r\n        !state.blockedReason\r\n      ) {\r\n        state.blockedReason = 'no-progress';\r\n        state.blockedPhase = 'marginal-value';\r\n      }\r\n    }\r\n\r\n    displayDiag.selectionPolicy = 'independent-normal+marginal-density-per-cost';\r\n    displayDiag.allocationRounds = allocationRounds;\r\n    displayDiag.progressiveRounds = allocationRounds;\r\n\r\n    for (const state of states) {\r\n      const { group, currentMax } = state;\r\n      if (group.resolveError) continue;\r\n\r\n      const chosen = selectedByGroup.get(group);\r\n      if (!state.highestCandidate) {\r\n        boundedPush(run.skipped, {\r\n          display: row.key,\r\n          group: group.id,\r\n          repeatCount: group.uniqueKeys.size,\r\n          hostKeys: Array.from(group.uniqueKeys).slice(0, 24),\r\n          currentSource: currentMax,\r\n          sourceCeiling: group.sourceCeiling,\r\n          desired: group.desired,\r\n          floorTarget: state.floorTarget,\r\n          blockedPhase: state.blockedPhase,\r\n          priority: groupPriorityMetrics(group),\r\n          remainingPixels: remaining,\r\n          failedUrls: group.failedUrls.slice(),\r\n          packingRejected: state.packingRejected.slice(0, 8),\r\n          reason: 'no-higher-source-or-density-benefit'\r\n        });\r\n        continue;\r\n      }\r\n\r\n      if (!chosen) {\r\n        boundedPush(run.skipped, {\r\n          display: row.key,\r\n          group: group.id,\r\n          repeatCount: group.uniqueKeys.size,\r\n          hostKeys: Array.from(group.uniqueKeys).slice(0, 24),\r\n          currentSource: currentMax,\r\n          sourceCeiling: group.sourceCeiling,\r\n          desired: group.desired,\r\n          floorTarget: state.floorTarget,\r\n          blockedPhase: state.blockedPhase,\r\n          priority: groupPriorityMetrics(group),\r\n          remainingPixels: remaining,\r\n          failedUrls: group.failedUrls.slice(),\r\n          packingRejected: state.packingRejected.slice(0, 8),\r\n          reason: state.blockedReason === 'native-packing'\r\n            ? 'native-packing-or-variant-unavailable'\r\n            : (state.variantRejected.length ? 'source-variant-unavailable' : 'display-budget-or-variant-unavailable')\r\n        });\r\n        continue;\r\n      }\r\n\r\n      if (chosen.target < state.highestCandidate) {\r\n        boundedPush(run.downgraded, {\r\n          display: row.key,\r\n          group: group.id,\r\n          from: state.highestCandidate,\r\n          to: chosen.target,\r\n          reason: state.packingRejected.length\r\n            ? 'native-packing'\r\n            : 'display-budget',\r\n          repeatCount: group.uniqueKeys.size,\r\n          hostKeys: Array.from(group.uniqueKeys).slice(0, 24),\r\n          floorTarget: state.floorTarget,\r\n          blockedPhase: state.blockedPhase,\r\n          priority: groupPriorityMetrics(group)\r\n        });\r\n      }\r\n    }\r\n\r\n    displayDiag.remainingPixelsAfter = remaining;\r\n    return { row, hosts, groups, selected, normalSelected, baseline, budget };\r\n  }\r\n\r\n  function findScaleSnapshot(policy, row, key) {\r\n    return policy.scaleSnapshots.find((entry) => entry.o === row.d.atlasScale && entry.k === key) || null;\r\n  }\r\n\r\n  function findUsedSnapshot(policy, part) {\r\n    return policy.usedSnapshots.find((entry) => entry.o === part) || null;\r\n  }\r\n\r\n  function rememberObservedUsed(policy, row, host) {\r\n    let snapshot = findUsedSnapshot(policy, host.part);\r\n    if (!snapshot) {\r\n      snapshot = own(host.part, '_usedTextureSize');\r\n      snapshot._diag = { display: row.key, key: host.key, kind: 'usedTextureSize' };\r\n      policy.usedSnapshots.push(snapshot);\r\n    }\r\n    return snapshot;\r\n  }\r\n\r\n  function restoreObservedUsed(snapshot) {\r\n    if (!snapshot || !snapshot.o) return { restored: false, outside: false };\r\n    try {\r\n      const current = snapshot.o[snapshot.k];\r\n      if (current === snapshot.v) return { restored: true, outside: false };\r\n      if (snapshot.applied !== undefined && current !== snapshot.applied) {\r\n        return { restored: false, outside: true };\r\n      }\r\n      if (snapshot.had && snapshot.d) Object.defineProperty(snapshot.o, snapshot.k, snapshot.d);\r\n      else delete snapshot.o[snapshot.k];\r\n      return { restored: true, outside: false };\r\n    } catch (_) {\r\n      return { restored: false, outside: false };\r\n    }\r\n  }\r\n\r\n  function applyNormalSelection(policy, selection, run) {\r\n    const { row, group, target } = selection;\r\n    const selectedHosts = [];\r\n\r\n    for (const host of group.hosts) {\r\n      if (!(target > host.currentSource)) continue;\r\n      selectedHosts.push({\r\n        displayData: row.d,\r\n        displayKey: row.key,\r\n        key: host.key,\r\n        bindingIndex: host.bindingIndex,\r\n        sourceKey: host.parsed.key,\r\n        baselineSource: host.source,\r\n        baselineSourceSize: host.currentSource,\r\n        baselineAllocation: [host.allocation.width, host.allocation.height],\r\n        target,\r\n        texture: selection.texture,\r\n        url: selection.url,\r\n        repeatCount: group.uniqueKeys.size\r\n      });\r\n\r\n      boundedPush(run.selected, {\r\n        display: row.key,\r\n        key: host.key,\r\n        bindingIndex: host.bindingIndex,\r\n        currentSource: host.currentSource,\r\n        currentAllocation: [host.allocation.width, host.allocation.height],\r\n        target,\r\n        source: selection.url,\r\n        repeatCount: group.uniqueKeys.size,\r\n        intrinsicFloorTarget: groupIntrinsicFloorTarget(group),\r\n        priority: groupPriorityMetrics(group),\r\n        needsDensity: false\r\n      });\r\n    }\r\n\r\n    policy.selected.push(...selectedHosts);\r\n  }\r\n\r\n  function applyDensitySelection(policy, selection, run) {\r\n    const { row, group, target } = selection;\r\n    const seen = new Set();\r\n\r\n    for (const host of group.hosts) {\r\n      if (seen.has(host.key)) continue;\r\n      seen.add(host.key);\r\n\r\n      const desiredScale = desiredScaleForHost(host, target);\r\n      const currentScale = Number(row.d.atlasScale[host.key]);\r\n      if (!(desiredScale > 0)) continue;\r\n\r\n      const selected = {\r\n        displayData: row.d,\r\n        displayKey: row.key,\r\n        key: host.key,\r\n        baselineAllocation: [host.allocation.width, host.allocation.height],\r\n        target,\r\n        repeatCount: group.uniqueKeys.size\r\n      };\r\n      policy.densitySelected.push(selected);\r\n      boundedPush(run.densitySelected, {\r\n        display: row.key,\r\n        key: host.key,\r\n        currentAllocation: selected.baselineAllocation,\r\n        target,\r\n        repeatCount: group.uniqueKeys.size,\r\n        intrinsicFloorTarget: groupIntrinsicFloorTarget(group),\r\n        priority: groupPriorityMetrics(group)\r\n      });\r\n\r\n      if (Number.isFinite(currentScale) && currentScale >= desiredScale) continue;\r\n\r\n      let snapshot = findScaleSnapshot(policy, row, host.key);\r\n      if (!snapshot) {\r\n        snapshot = own(row.d.atlasScale, host.key);\r\n        snapshot._diag = { display: row.key, key: host.key, kind: 'atlasScale' };\r\n        policy.scaleSnapshots.push(snapshot);\r\n      }\r\n      rememberObservedUsed(policy, row, host);\r\n      row.d.atlasScale[host.key] = desiredScale;\r\n      snapshot.applied = row.d.atlasScale[host.key];\r\n      policy.densityDisplays.add(row.d);\r\n    }\r\n  }\r\n\r\n  async function waitForStableRows(expectedData, timeout = SETTLE_TIMEOUT) {\r\n    const end = Date.now() + timeout;\r\n    while (Date.now() < end) {\r\n      const CK = UW && UW.CK;\r\n      const c = CK && CK.character;\r\n      const rows = collectRows();\r\n      const ready = !!(\r\n        c &&\r\n        !c._needsUpdating &&\r\n        !c._inUpdate &&\r\n        expectedData.every((d) => {\r\n          const row = rows.find((entry) => entry.d === d);\r\n          return !!row &&\r\n            row.display.resourcesReady !== false &&\r\n            row.display.finished !== false &&\r\n            row.display.atlas === row.m.resourceAtlas;\r\n        })\r\n      );\r\n      if (ready) return rows;\r\n      await sleep(POLL_MS);\r\n    }\r\n    return null;\r\n  }\r\n\r\n  async function waitForCoverageStable(timeout = SETTLE_TIMEOUT) {\r\n    const end = Date.now() + timeout;\r\n    while (Date.now() < end) {\r\n      const CK = UW && UW.CK;\r\n      const c = CK && CK.character;\r\n      const rows = collectRows();\r\n      const ready = !!(\r\n        c &&\r\n        !c._needsUpdating &&\r\n        !c._inUpdate &&\r\n        rows.every((row) => (\r\n          row.display.resourcesReady !== false &&\r\n          row.display.finished !== false &&\r\n          row.display.atlas === row.m.resourceAtlas\r\n        ))\r\n      );\r\n      if (ready) return rows;\r\n      await sleep(POLL_MS);\r\n    }\r\n    return null;\r\n  }\r\n\r\n  async function reconcileDensity(policy, captureObservedUsed = true) {\r\n    if (!policy || !policy.densityDisplays || !policy.densityDisplays.size) return collectRows();\r\n    if (!service || !originals || typeof originals.reconcile !== 'function') {\r\n      throw new Error('Owned Texture Quality reconcile seam is unavailable for all-part density.');\r\n    }\r\n\r\n    const ok = await withChangeSuppressed(() => originals.reconcile.call(service));\r\n    if (!ok) throw new Error('Owned Texture Quality reconcile rejected all-part density changes.');\r\n\r\n    // Reconcile may legitimately replace the active figure/display set. Wait on\r\n    // the current live display-data identities, not the prior policy's rows.\r\n    const expected = collectRows().map((row) => row.d);\r\n    const stable = await waitForStableRows(expected);\r\n    if (!stable) throw new Error('Timed out waiting for all-part density reconcile to settle.');\r\n\r\n    if (captureObservedUsed) {\r\n      for (const snapshot of policy.usedSnapshots) {\r\n        try { snapshot.applied = snapshot.o[snapshot.k]; } catch (_) {}\r\n      }\r\n    }\r\n    return stable;\r\n  }\r\n\r\n  function bindSelectedNormals(policy, rows, run) {\r\n    const byData = new Map(rows.map((row) => [row.d, row]));\r\n\r\n    for (const selected of policy.selected) {\r\n      const row = byData.get(selected.displayData);\r\n      const mesh = row && row.meshes[selected.key];\r\n      const bindings = normalUniforms(mesh);\r\n      const binding = bindings[selected.bindingIndex];\r\n      if (!binding || !binding.uniform) {\r\n        boundedPush(run.failed, {\r\n          display: selected.displayKey,\r\n          key: selected.key,\r\n          reason: 'normal-binding-missing-after-rebuild'\r\n        });\r\n        continue;\r\n      }\r\n\r\n      const currentTexture = binding.uniform.value;\r\n      const currentSource = textureSource(currentTexture);\r\n      const parsed = parseNormalSource(currentSource);\r\n      if (!parsed || parsed.key !== selected.sourceKey) {\r\n        boundedPush(run.skipped, {\r\n          display: selected.displayKey,\r\n          key: selected.key,\r\n          reason: 'outside-normal-binding-change',\r\n          currentSource\r\n        });\r\n        continue;\r\n      }\r\n\r\n      const currentSize = squareTextureSize(currentTexture);\r\n      if (currentSize >= selected.target) continue;\r\n\r\n      const snapshot = own(binding.uniform, 'value');\r\n      snapshot._diag = {\r\n        display: selected.displayKey,\r\n        key: selected.key,\r\n        bindingIndex: selected.bindingIndex,\r\n        kind: 'normal'\r\n      };\r\n      binding.uniform.value = selected.texture;\r\n      snapshot.applied = binding.uniform.value;\r\n      policy.normalSnapshots.push(snapshot);\r\n    }\r\n\r\n    try {\r\n      const loop = UW && UW.CK && UW.CK.GameLoop;\r\n      if (loop && typeof loop.requestRenderRefresh === 'function') loop.requestRenderRefresh();\r\n    } catch (_) {}\r\n  }\r\n\r\n  function collateralAfter(plan) {\r\n    const currentRows = collectRows();\r\n    const collateral = [];\r\n    const selectedByData = new Map();\r\n\r\n    for (const displayPlan of plan) {\r\n      const keys = new Set();\r\n      for (const selection of displayPlan.selected) {\r\n        for (const host of selection.group.hosts) keys.add(host.key);\r\n      }\r\n      selectedByData.set(displayPlan.row.d, keys);\r\n    }\r\n\r\n    for (const displayPlan of plan) {\r\n      const row = currentRows.find((entry) => entry.d === displayPlan.row.d);\r\n      if (!row) {\r\n        collateral.push({ display: displayPlan.row.key, key: null, reason: 'display-missing' });\r\n        continue;\r\n      }\r\n      const selectedKeys = selectedByData.get(displayPlan.row.d) || new Set();\r\n\r\n      for (const [key, baseline] of displayPlan.baseline.map.entries()) {\r\n        const current = allocationRect(row.display.atlas, key);\r\n        if (!current) continue;\r\n        if (current.width < baseline.width || current.height < baseline.height) {\r\n          collateral.push({\r\n            display: row.key,\r\n            key,\r\n            selected: selectedKeys.has(key),\r\n            baseline: [baseline.width, baseline.height],\r\n            current: [current.width, current.height],\r\n            reason: 'allocation-downsize'\r\n          });\r\n        }\r\n      }\r\n    }\r\n    return collateral;\r\n  }\r\n\r\n  function selectedVerification(policy) {\r\n    const rows = collectRows();\r\n    const failures = [];\r\n\r\n    for (const selected of policy.densitySelected) {\r\n      const row = rows.find((entry) => entry.d === selected.displayData);\r\n      const rect = row && allocationRect(row.display.atlas, selected.key);\r\n      if (!rect || rect.width < selected.target || rect.height < selected.target) {\r\n        failures.push({\r\n          display: selected.displayKey,\r\n          key: selected.key,\r\n          reason: 'selected-allocation-below-target',\r\n          target: selected.target,\r\n          allocation: rect ? [rect.width, rect.height] : null\r\n        });\r\n      }\r\n    }\r\n\r\n    for (const selected of policy.selected) {\r\n      const row = rows.find((entry) => entry.d === selected.displayData);\r\n      const binding = row && normalUniforms(row.meshes[selected.key])[selected.bindingIndex];\r\n      const size = binding ? squareTextureSize(binding.uniform.value) : 0;\r\n      if (selected.baselineSourceSize < selected.target && size < selected.target) {\r\n        failures.push({\r\n          display: selected.displayKey,\r\n          key: selected.key,\r\n          reason: 'selected-normal-below-target',\r\n          target: selected.target,\r\n          normalSize: size\r\n        });\r\n      }\r\n    }\r\n    return failures;\r\n  }\r\n\r\n  function releaseOwnedResources() {\r\n    try {\r\n      const R = UW && UW.CK && UW.CK.Resources;\r\n      if (R && typeof R.unregister === 'function') R.unregister(OWNER);\r\n    } catch (_) {}\r\n    positiveCache.clear();\r\n    inFlight.clear();\r\n  }\r\n\r\n  async function restoreActive(rebuild, reason) {\r\n    const policy = active;\r\n    if (!policy) {\r\n      releaseOwnedResources();\r\n      return [];\r\n    }\r\n\r\n    const restored = [];\r\n    for (let index = policy.normalSnapshots.length - 1; index >= 0; index -= 1) {\r\n      const snapshot = policy.normalSnapshots[index];\r\n      const result = restoreIfOwned(snapshot);\r\n      restored.push({ ...(snapshot._diag || { kind: 'normal' }), restored: result.restored, outside: result.outside });\r\n    }\r\n    for (let index = policy.scaleSnapshots.length - 1; index >= 0; index -= 1) {\r\n      const snapshot = policy.scaleSnapshots[index];\r\n      const result = restoreIfOwned(snapshot);\r\n      restored.push({ ...(snapshot._diag || { kind: 'atlasScale' }), restored: result.restored, outside: result.outside });\r\n    }\r\n\r\n    // Restore HeroForge's observed source-size metadata before rebuilding.\r\n    // buildAtlas() consults this sticky value for non-core parts; rebuilding first\r\n    // can preserve our promoted allocation even after atlasScale is restored.\r\n    for (let index = policy.usedSnapshots.length - 1; index >= 0; index -= 1) {\r\n      const snapshot = policy.usedSnapshots[index];\r\n      const result = restoreObservedUsed(snapshot);\r\n      restored.push({ ...(snapshot._diag || { kind: 'usedTextureSize' }), restored: result.restored, outside: result.outside });\r\n    }\r\n\r\n    if (rebuild && policy.densityDisplays && policy.densityDisplays.size) {\r\n      try { await reconcileDensity(policy, false); } catch (error) {\r\n        restored.push({ kind: 'densityReconcile', restored: false, outside: false, error: String(error && error.message || error) });\r\n      }\r\n    }\r\n\r\n    active = null;\r\n    lastRestored = restored.slice(-MAX_DIAGNOSTICS);\r\n    releaseOwnedResources();\r\n    return restored;\r\n  }\r\n\r\n  function lifecycleBlocked() {\r\n    let core = null;\r\n    let guard = null;\r\n    try { core = service && typeof service.getState === 'function' ? service.getState() : null; } catch (_) {}\r\n    try {\r\n      const drift = UW && UW.KWTextureQualitySameFigureDriftGuard;\r\n      guard = drift && typeof drift.getState === 'function' ? drift.getState() : null;\r\n    } catch (_) {}\r\n    return !!((core && core.sceneSyncPending) || (guard && guard.pending));\r\n  }\r\n\r\n  async function runCoverage(trigger) {\r\n    if (disposed || !service || !service.enabled || service.busy || lifecycleBlocked()) return false;\r\n    if (running) return running;\r\n\r\n    initialCoveragePending = false;\r\n    running = (async () => {\r\n      const run = emptyRun(trigger);\r\n      run.startedAt = Date.now();\r\n      lastError = null;\r\n\r\n      try {\r\n        await restoreActive(!!active, 'replan');\r\n        // Negative source probes are scoped to one coverage pass. A timeout or\r\n        // transient loader failure must not suppress a later valid scene pass.\r\n        negativeCache.clear();\r\n        const rows = collectRows();\r\n        if (!rows.length) {\r\n          run.finishedAt = Date.now();\r\n          lastRun = run;\r\n          return true;\r\n        }\r\n\r\n        const plans = [];\r\n        for (const row of rows) plans.push(await planDisplay(row, run));\r\n        const densitySelections = plans.flatMap((plan) => plan.selected);\r\n        const normalSelections = plans.flatMap((plan) => plan.normalSelected);\r\n\r\n        if (!densitySelections.length && !normalSelections.length) {\r\n          run.finishedAt = Date.now();\r\n          lastRun = run;\r\n          releaseOwnedResources();\r\n          return true;\r\n        }\r\n\r\n        const policy = {\r\n          createdAt: Date.now(),\r\n          scaleSnapshots: [],\r\n          usedSnapshots: [],\r\n          normalSnapshots: [],\r\n          selected: [],\r\n          densitySelected: [],\r\n          densityDisplays: new Set(),\r\n          plans\r\n        };\r\n        active = policy;\r\n\r\n        for (const selection of normalSelections) applyNormalSelection(policy, selection, run);\r\n        for (const selection of densitySelections) applyDensitySelection(policy, selection, run);\r\n        const stableRows = policy.densityDisplays.size\r\n          ? await reconcileDensity(policy)\r\n          : collectRows();\r\n        bindSelectedNormals(policy, stableRows, run);\r\n\r\n        const collateral = policy.densityDisplays.size ? collateralAfter(plans) : [];\r\n        const selectedFailures = selectedVerification(policy);\r\n        if (collateral.length || selectedFailures.length) {\r\n          for (const row of collateral) boundedPush(run.failed, row);\r\n          for (const row of selectedFailures) boundedPush(run.failed, row);\r\n          await restoreActive(true, 'verification-failed');\r\n          throw new Error(collateral.length\r\n            ? 'All-part promotion would downsize existing atlas allocations.'\r\n            : 'All-part promotion failed selected-host verification.');\r\n        }\r\n\r\n        run.finishedAt = Date.now();\r\n        run.restored = [];\r\n        lastRun = run;\r\n        syncChangeObservers();\r\n        return true;\r\n      } catch (error) {\r\n        lastError = String(error && error.message || error);\r\n        if (active) {\r\n          try {\r\n            run.restored = await restoreActive(true, 'failure');\r\n          } catch (_) {}\r\n        } else {\r\n          releaseOwnedResources();\r\n        }\r\n        run.finishedAt = Date.now();\r\n        boundedPush(run.failed, { reason: 'run-failed', error: lastError });\r\n        lastRun = run;\r\n        console.warn('[Witch Dock texture quality all-part] Coverage pass failed without disabling core High Res:', error);\r\n        return false;\r\n      }\r\n    })().finally(() => {\r\n      running = null;\r\n    });\r\n\r\n    return running;\r\n  }\r\n\r\n  function queueCoverage(trigger) {\r\n    if (disposed || queued || running || !service || !service.enabled || service.busy || lifecycleBlocked()) return false;\r\n    queued = Promise.resolve()\r\n      .then(() => runCoverage(trigger))\r\n      .catch((error) => {\r\n        lastError = String(error && error.message || error);\r\n        return false;\r\n      })\r\n      .finally(() => { queued = null; });\r\n    return true;\r\n  }\r\n\r\n  function attach() {\r\n    if (disposed || service) return !!service;\r\n    const candidate = UW && UW.KWTextureQualityNativeReconcile;\r\n    if (!candidate ||\r\n        typeof candidate.enable !== 'function' ||\r\n        typeof candidate.disable !== 'function' ||\r\n        typeof candidate.reconcile !== 'function' ||\r\n        typeof candidate.refresh !== 'function' ||\r\n        typeof candidate.setPersistent !== 'function') return false;\r\n\r\n    service = candidate;\r\n    originals = {\r\n      enable: candidate.enable,\r\n      disable: candidate.disable,\r\n      reconcile: candidate.reconcile,\r\n      refresh: candidate.refresh,\r\n      setPersistent: candidate.setPersistent,\r\n      dispose: typeof candidate.dispose === 'function' ? candidate.dispose : null\r\n    };\r\n\r\n    wrappers = {\r\n      enable: async (...args) => {\r\n        const ok = await withChangeSuppressed(() => originals.enable.apply(candidate, args));\r\n        syncChangeObservers();\r\n        if (ok && candidate.enabled && !candidate.busy) {\r\n          await runCoverage('enable');\r\n        }\r\n        return ok;\r\n      },\r\n      reconcile: async (...args) => {\r\n        const ok = await withChangeSuppressed(() => originals.reconcile.apply(candidate, args));\r\n        syncChangeObservers();\r\n        if (ok && candidate.enabled && !candidate.busy) {\r\n          await runCoverage('reconcile');\r\n        }\r\n        return ok;\r\n      },\r\n      disable: async (...args) => {\r\n        await restoreActive(false, 'disable');\r\n        initialCoveragePending = true;\r\n        const result = await withChangeSuppressed(() => originals.disable.apply(candidate, args));\r\n        releaseOwnedResources();\r\n        return result;\r\n      },\r\n      setPersistent: (value) => {\r\n        if (!value && !candidate.enabled && active) {\r\n          void restoreActive(false, 'persistent-off');\r\n        }\r\n        return originals.setPersistent.call(candidate, value);\r\n      },\r\n      refresh: (...args) => {\r\n        const state = originals.refresh.apply(candidate, args);\r\n        syncChangeObservers();\r\n        if (!candidate.enabled) {\r\n          initialCoveragePending = true;\r\n          if (active) void restoreActive(false, 'refresh-off');\r\n          return state;\r\n        }\r\n        if (candidate.enabled && !candidate.busy && !lifecycleBlocked()) {\r\n          if (initialCoveragePending) {\r\n            queueCoverage('attach-ready');\r\n          } else {\r\n            queuePendingChange();\r\n          }\r\n        }\r\n        return state;\r\n      }\r\n    };\r\n\r\n    candidate.enable = wrappers.enable;\r\n    candidate.reconcile = wrappers.reconcile;\r\n    candidate.disable = wrappers.disable;\r\n    candidate.setPersistent = wrappers.setPersistent;\r\n    candidate.refresh = wrappers.refresh;\r\n\r\n    syncChangeObservers();\r\n    if (candidate.enabled && !candidate.busy && !lifecycleBlocked()) {\r\n      queueCoverage('attach');\r\n    }\r\n    return true;\r\n  }\r\n\r\n  function setQualityCeiling(value) {\r\n    const numeric = normalizeTarget(value);\r\n    if (!numeric || numeric > 4096) return false;\r\n    qualityCeiling = numeric;\r\n    if (service && service.enabled && !service.busy && !lifecycleBlocked()) queueCoverage('quality-ceiling');\r\n    return true;\r\n  }\r\n\r\n  function state() {\r\n    return {\r\n      version: VERSION,\r\n      build: BUILD,\r\n      attached: !!service,\r\n      enabled: !!(service && service.enabled),\r\n      busy: !!running,\r\n      queued: !!queued,\r\n      qualityCeiling,\r\n      ownedAtlasPixelCeiling: MAX_OWNED_ATLAS_PIXELS,\r\n      positiveCache: positiveCache.size,\r\n      negativeCache: negativeCache.size,\r\n      inFlight: inFlight.size,\r\n      activeBindings: active ? active.selected.length : 0,\r\n      initialCoveragePending,\r\n      changePending: changeDirty,\r\n      changeObserverCount: changeObservers.length,\r\n      changeSuppressed: changeSuppression > 0,\r\n      lastError,\r\n      lastRun,\r\n      lastRestored\r\n    };\r\n  }\r\n\r\n  async function dispose() {\r\n    disposed = true;\r\n    try { await restoreActive(!!(service && service.enabled), 'dispose'); } catch (_) {}\r\n\r\n    if (service && originals && wrappers) {\r\n      if (service.enable === wrappers.enable) service.enable = originals.enable;\r\n      if (service.disable === wrappers.disable) service.disable = originals.disable;\r\n      if (service.reconcile === wrappers.reconcile) service.reconcile = originals.reconcile;\r\n      if (service.refresh === wrappers.refresh) service.refresh = originals.refresh;\r\n      if (service.setPersistent === wrappers.setPersistent) service.setPersistent = originals.setPersistent;\r\n    }\r\n\r\n    for (let index = changeObservers.length - 1; index >= 0; index -= 1) restoreChangeObserver(changeObservers[index]);\r\n    changeObservers = [];\r\n    initialCoveragePending = false;\r\n    changeDirty = false;\r\n    changeDirtyAt = 0;\r\n    changeDirtyReason = null;\r\n    changeSuppression = 0;\r\n    service = null;\r\n    originals = null;\r\n    wrappers = null;\r\n    releaseOwnedResources();\r\n    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }\r\n    return true;\r\n  }\r\n\r\n  UW[GLOBAL] = {\r\n    version: VERSION,\r\n    build: BUILD,\r\n    attach,\r\n    refresh: () => {\r\n      if (!service) attach();\r\n      syncChangeObservers();\r\n      if (service && service.enabled && !service.busy && !lifecycleBlocked()) {\r\n        if (initialCoveragePending) {\r\n          queueCoverage('attach-ready');\r\n        } else {\r\n          queuePendingChange();\r\n        }\r\n      }\r\n      return state();\r\n    },\r\n    reconcile: () => runCoverage('manual-reconcile'),\r\n    setQualityCeiling,\r\n    getState: state,\r\n    dispose,\r\n    __test: {\r\n      parseNormalSource,\r\n      normalizeTarget,\r\n      ceilTarget,\r\n      nativeIdeal,\r\n      detailFaces,\r\n      detailPressure,\r\n      idealTarget,\r\n      groupIntrinsicFloorTarget,\r\n      groupPriorityMetrics,\r\n      groupPriority,\r\n      premiumPriority,\r\n      incrementPriorityMetrics,\r\n      compareStateIncrement,\r\n      targetCost,\r\n      restoreIfOwned,\r\n      loadVariant,\r\n      collectRows,\r\n      syncChangeObservers,\r\n      markDataChange,\r\n      withChangeSuppressed,\r\n      collectHosts,\r\n      groupHosts,\r\n      displayBudget,\r\n      baselinePackingOptions,\r\n      planDisplay,\r\n      collateralAfter,\r\n      releaseOwnedResources,\r\n      get negativeCacheSize() { return negativeCache.size; },\r\n      get positiveCacheSize() { return positiveCache.size; }\r\n    }\r\n  };\r\n\r\n  if (!attach()) {\r\n    const timer = window.setInterval(() => {\r\n      if (disposed || attach()) window.clearInterval(timer);\r\n    }, 100);\r\n  }\r\n})();\r\n";
  const STABLE_PRIORITY_SOURCE = "// ==UserScript==\n// @name         Witch Dock DEV - Texture Quality Active Decal Priority\n// @namespace    KnightWitch\n// @version      0.1.1\n// @description  Dev-only adaptive atlas policy for textures that actually carry decals.\n// @match        https://www.heroforge.com/*\n// @match        https://heroforge.com/*\n// @grant        none\n// @run-at       document-idle\n// ==/UserScript==\n\n(function () {\n  'use strict';\n\n  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;\n  const GLOBAL = 'KWTextureQualityActiveDecalPriority';\n  if (UW[GLOBAL]) return;\n\n  const VERSION = '0.1.1';\n  const BUILD = '0.1.1-dev-projected-host-lifecycle-coordination';\n  const CORE_TARGETS = new Set(['bodyLower', 'bodyUpper', 'face']);\n  const SCALE = 4;\n  const ATLAS_WIDTH = 8192;\n  const ATLAS_HEIGHT = 4096;\n\n  let service = null;\n  let originals = null;\n  let settingsState = null;\n  let hardwareLimit = null;\n  let reconcilePromise = null;\n  let policyDirty = false;\n  let disposed = false;\n  let lastError = null;\n  const figures = new Map();\n\n  const own = (o, k) => ({\n    o,\n    k,\n    had: Object.prototype.hasOwnProperty.call(o, k),\n    d: Object.getOwnPropertyDescriptor(o, k),\n    v: o[k],\n    applied: undefined\n  });\n\n  function restoreIfOwned(snapshot) {\n    if (!snapshot || !snapshot.o) return false;\n    try {\n      if (snapshot.applied !== undefined && snapshot.o[snapshot.k] !== snapshot.applied) return false;\n      if (snapshot.had && snapshot.d) Object.defineProperty(snapshot.o, snapshot.k, snapshot.d);\n      else delete snapshot.o[snapshot.k];\n      return true;\n    } catch (_) {\n      try {\n        if (snapshot.applied !== undefined && snapshot.o[snapshot.k] !== snapshot.applied) return false;\n        snapshot.o[snapshot.k] = snapshot.v;\n        return true;\n      } catch (_) {\n        return false;\n      }\n    }\n  }\n\n  function detectTextureLimit() {\n    if (hardwareLimit !== null) return hardwareLimit;\n    let canvas = null;\n    let gl = null;\n    try {\n      canvas = document.createElement('canvas');\n      gl = canvas.getContext('webgl2') || canvas.getContext('webgl');\n      const value = gl ? Number(gl.getParameter(gl.MAX_TEXTURE_SIZE)) : 0;\n      hardwareLimit = Number.isFinite(value) && value > 0 ? value : 0;\n    } catch (_) {\n      hardwareLimit = 0;\n    } finally {\n      try { gl?.getExtension('WEBGL_lose_context')?.loseContext(); } catch (_) {}\n      canvas = null;\n      gl = null;\n    }\n    return hardwareLimit;\n  }\n\n  function collectRows() {\n    const CK = UW && UW.CK;\n    const c = CK && CK.character;\n    if (!CK || !c) return [];\n    const rows = [];\n    const seen = new Set();\n    const add = (key, display) => {\n      if (!display || typeof display !== 'object' || seen.has(display)) return;\n      const d = display.data || (display === c.display ? c.data : null);\n      const m = display.modded;\n      if (!d || !d.atlasScale || !m || !m.parts) return;\n      seen.add(display);\n      rows.push({ key: String(key || ''), primary: display === c.display || d.primary === true, d, display, m, parts: m.parts });\n    };\n    add('', c.display);\n    if (c.allDisplays && typeof c.allDisplays === 'object') {\n      for (const [key, display] of Object.entries(c.allDisplays)) add(key, display);\n    }\n    return rows;\n  }\n\n  function hasAppliedDecals(value) {\n    if (!value) return false;\n    if (value instanceof Map || value instanceof Set) return value.size > 0;\n    if (Array.isArray(value)) return value.length > 0;\n    if (typeof value === 'object') return Object.keys(value).length > 0;\n    return true;\n  }\n\n  function projectedHostKeys(row, decals) {\n    const splatter = decals && decals.splatter;\n    if (!splatter || typeof splatter !== 'object') return [];\n    const out = new Set();\n    const entries = Array.isArray(splatter) ? splatter : Object.values(splatter);\n    for (const entry of entries) {\n      const filter = entry && entry.filter;\n      if (!filter || typeof filter !== 'object') continue;\n      for (const [key, selected] of Object.entries(filter)) {\n        if (selected === true && row.parts[key] && !CORE_TARGETS.has(key)) out.add(key);\n      }\n    }\n    return Array.from(out);\n  }\n\n  function activeAccessoryKeys(row) {\n    const decals = row && row.d && row.d.decals;\n    if (!decals || typeof decals !== 'object') return [];\n    const active = new Set(Object.keys(decals).filter((key) => (\n      key !== 'splatter' && row.parts[key] && !CORE_TARGETS.has(key) && hasAppliedDecals(decals[key])\n    )));\n    for (const key of projectedHostKeys(row, decals)) active.add(key);\n    return Array.from(active);\n  }\n\n  function ensureSettings() {\n    const CK = UW && UW.CK;\n    const S = CK && CK.Settings;\n    if (!S) return false;\n    if (!settingsState || settingsState.o !== S) {\n      if (settingsState) restoreSettings();\n      settingsState = {\n        o: S,\n        width: own(S, 'textureWidthMax'),\n        height: own(S, 'textureHeightMax')\n      };\n    }\n\n    const limit = detectTextureLimit();\n    const currentWidth = Number(S.textureWidthMax) || 0;\n    const currentHeight = Number(S.textureHeightMax) || 0;\n    // Fail closed if a reliable GPU limit cannot be read. Never raise HeroForge's\n    // texture maxima on unknown hardware; keep the current native/outside setting.\n    const supportedWidth = limit > 0 ? Math.min(ATLAS_WIDTH, limit) : currentWidth;\n    const supportedHeight = limit > 0 ? Math.min(ATLAS_HEIGHT, limit) : currentHeight;\n    const desiredWidth = Math.max(currentWidth, supportedWidth);\n    const desiredHeight = Math.max(currentHeight, supportedHeight);\n    let changed = false;\n\n    if (currentWidth !== desiredWidth) {\n      S.textureWidthMax = desiredWidth;\n      settingsState.width.applied = Number(S.textureWidthMax);\n      changed = true;\n    }\n    if (currentHeight !== desiredHeight) {\n      S.textureHeightMax = desiredHeight;\n      settingsState.height.applied = Number(S.textureHeightMax);\n      changed = true;\n    }\n    return changed;\n  }\n\n  function restoreSettings() {\n    if (!settingsState) return false;\n    // Only restore maxima this module actually changed. If HeroForge or another\n    // owner changed a value afterward, restoreIfOwned also leaves that value alone.\n    const restoredWidth = settingsState.width.applied !== undefined ? restoreIfOwned(settingsState.width) : false;\n    const restoredHeight = settingsState.height.applied !== undefined ? restoreIfOwned(settingsState.height) : false;\n    settingsState = null;\n    return restoredWidth || restoredHeight;\n  }\n\n  function ensureFigure(row) {\n    let state = figures.get(row.d) || null;\n    if (!state || state.scale !== row.d.atlasScale) {\n      if (state) restoreFigure(state);\n      state = { d: row.d, scale: row.d.atlasScale, snapshots: new Map(), active: new Set(), key: row.key, primary: row.primary };\n      figures.set(row.d, state);\n    }\n\n    state.key = row.key;\n    state.primary = row.primary;\n    const desired = new Set(activeAccessoryKeys(row));\n    let changed = false;\n\n    for (const [key, snapshot] of Array.from(state.snapshots.entries())) {\n      if (desired.has(key)) continue;\n      changed = restoreIfOwned(snapshot) || changed;\n      state.snapshots.delete(key);\n    }\n\n    for (const key of desired) {\n      let snapshot = state.snapshots.get(key) || null;\n      if (!snapshot) {\n        snapshot = own(state.scale, key);\n        state.snapshots.set(key, snapshot);\n      }\n      if (Number(state.scale[key]) !== SCALE) {\n        state.scale[key] = SCALE;\n        changed = true;\n      }\n      snapshot.applied = state.scale[key];\n    }\n\n    state.active = desired;\n    return changed;\n  }\n\n  function restoreFigure(state) {\n    if (!state) return false;\n    let changed = false;\n    for (const snapshot of state.snapshots.values()) changed = restoreIfOwned(snapshot) || changed;\n    state.snapshots.clear();\n    state.active.clear();\n    return changed;\n  }\n\n  function ensurePolicy() {\n    let changed = ensureSettings();\n    const rows = collectRows();\n    const live = new Set(rows.map((row) => row.d));\n    for (const [d, state] of Array.from(figures.entries())) {\n      if (live.has(d)) continue;\n      changed = restoreFigure(state) || changed;\n      figures.delete(d);\n    }\n    for (const row of rows) changed = ensureFigure(row) || changed;\n    return changed;\n  }\n\n  function restorePolicy() {\n    let changed = false;\n    for (const state of figures.values()) changed = restoreFigure(state) || changed;\n    figures.clear();\n    changed = restoreSettings() || changed;\n    return changed;\n  }\n\n  function lifecycleBlocked() {\n    let core = null;\n    let repair = null;\n    try { core = service && typeof service.getState === 'function' ? service.getState() : null; } catch (_) {}\n    try {\n      const guard = UW && UW.KWTextureQualitySameFigureDriftGuard;\n      repair = guard && typeof guard.getState === 'function' ? guard.getState() : null;\n    } catch (_) {}\n    return !!((core && core.sceneSyncPending) || (repair && repair.pending));\n  }\n\n  function queuePolicyReconcile() {\n    if (disposed || reconcilePromise || !policyDirty || !service || !service.enabled || service.busy || lifecycleBlocked()) return false;\n    reconcilePromise = Promise.resolve()\n      .then(async () => {\n        if (disposed || !service || !service.enabled || service.busy || lifecycleBlocked()) return false;\n        const ok = await originals.reconcile.call(service);\n        if (ok) policyDirty = false;\n        return ok;\n      })\n      .catch((error) => {\n        lastError = String(error && error.message || error);\n        console.warn('[Witch Dock texture quality active decals] Reconcile failed:', error);\n        return false;\n      })\n      .finally(() => { reconcilePromise = null; });\n    return true;\n  }\n\n  function safeEnsurePolicy() {\n    try {\n      lastError = null;\n      const changed = ensurePolicy();\n      if (changed) policyDirty = true;\n      return changed;\n    } catch (error) {\n      lastError = String(error && error.message || error);\n      console.warn('[Witch Dock texture quality active decals] Policy update skipped:', error);\n      return false;\n    }\n  }\n\n  function attach() {\n    if (disposed || service) return !!service;\n    const candidate = UW && UW.KWTextureQualityNativeReconcile;\n    if (!candidate || typeof candidate.enable !== 'function' || typeof candidate.disable !== 'function' ||\n        typeof candidate.reconcile !== 'function' || typeof candidate.refresh !== 'function' ||\n        typeof candidate.setPersistent !== 'function') return false;\n\n    service = candidate;\n    originals = {\n      enable: candidate.enable,\n      disable: candidate.disable,\n      reconcile: candidate.reconcile,\n      refresh: candidate.refresh,\n      setPersistent: candidate.setPersistent,\n      dispose: typeof candidate.dispose === 'function' ? candidate.dispose : null\n    };\n\n    candidate.enable = async (...args) => {\n      safeEnsurePolicy();\n      const ok = await originals.enable.apply(candidate, args);\n      if (ok) policyDirty = false;\n      else if (!candidate.enabled) {\n        restorePolicy();\n        policyDirty = false;\n      }\n      return ok;\n    };\n\n    candidate.reconcile = async (...args) => {\n      safeEnsurePolicy();\n      const ok = await originals.reconcile.apply(candidate, args);\n      if (ok) policyDirty = false;\n      return ok;\n    };\n\n    candidate.disable = async (...args) => {\n      restorePolicy();\n      policyDirty = false;\n      return originals.disable.apply(candidate, args);\n    };\n\n    candidate.setPersistent = (value) => {\n      if (!value && !candidate.enabled) {\n        restorePolicy();\n        policyDirty = false;\n      }\n      return originals.setPersistent.call(candidate, value);\n    };\n\n    candidate.refresh = (...args) => {\n      // Let the core and same-figure lifecycle guard inspect native state first. If a\n      // core lifecycle repair or scene-membership sync is pending, do not mutate\n      // accessory scale policy ahead of that stable reconcile.\n      const state = originals.refresh.apply(candidate, args);\n      const blocked = lifecycleBlocked();\n      if (candidate.enabled && !candidate.busy && !blocked) safeEnsurePolicy();\n      else if (!candidate.enabled && !candidate.busy && figures.size) {\n        restorePolicy();\n        policyDirty = false;\n      }\n      if (state && state.enabled && !state.busy && !blocked && policyDirty) queuePolicyReconcile();\n      return state;\n    };\n\n    if (candidate.enabled && !candidate.busy && !lifecycleBlocked()) {\n      safeEnsurePolicy();\n      queuePolicyReconcile();\n    }\n    return true;\n  }\n\n  function state() {\n    const CK = UW && UW.CK;\n    return {\n      version: VERSION,\n      build: BUILD,\n      attached: !!service,\n      hardwareTextureLimit: detectTextureLimit(),\n      requestedAtlasBudget: [ATLAS_WIDTH, ATLAS_HEIGHT],\n      activeBudget: CK && CK.Settings ? [Number(CK.Settings.textureWidthMax), Number(CK.Settings.textureHeightMax)] : null,\n      figures: Array.from(figures.values()).map((entry) => ({\n        key: entry.key,\n        primary: entry.primary,\n        activeAccessorySlots: Array.from(entry.active)\n      })),\n      reconcilePending: !!reconcilePromise,\n      policyDirty,\n      lifecycleBlocked: lifecycleBlocked(),\n      lastError\n    };\n  }\n\n  function dispose() {\n    disposed = true;\n    restorePolicy();\n    policyDirty = false;\n    if (service && originals) {\n      if (service.enable !== originals.enable) service.enable = originals.enable;\n      if (service.disable !== originals.disable) service.disable = originals.disable;\n      if (service.reconcile !== originals.reconcile) service.reconcile = originals.reconcile;\n      if (service.refresh !== originals.refresh) service.refresh = originals.refresh;\n      if (service.setPersistent !== originals.setPersistent) service.setPersistent = originals.setPersistent;\n    }\n    service = null;\n    originals = null;\n    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }\n    return true;\n  }\n\n  UW[GLOBAL] = {\n    version: VERSION,\n    build: BUILD,\n    attach,\n    refresh: () => {\n      if (!service) attach();\n      if (service && service.enabled && !service.busy && !lifecycleBlocked()) {\n        safeEnsurePolicy();\n        if (policyDirty) queuePolicyReconcile();\n      }\n      return state();\n    },\n    getState: state,\n    dispose\n  };\n\n  if (!attach()) {\n    const timer = window.setInterval(() => {\n      if (disposed || attach()) window.clearInterval(timer);\n    }, 100);\n  }\n})();\n";
  const SETTLE_TIMEOUT_MS = 20000;
  const SETTLE_STEP_MS = 75;

  const state = {
    active: false,
    activationCount: 0,
    deactivationCount: 0,
    activatedAt: null,
    deactivatedAt: null,
    lifecycleRepairCount: 0,
    lastLifecycleReason: null,
    lastLifecycleAt: null,
    lastHandledDisplayCount: 0,
    lastError: null,
    ownsPriority: false,
    ownsAllPart: false
  };

  let unsubscribeCore = null;
  let repairTimer = null;
  let repairPromise = null;
  let pendingRepairReason = null;
  let pendingRepairForce = false;
  let lastStableEnabled = false;
  let lastHandledSignature = null;
  let displayIds = new WeakMap();
  let nextDisplayId = 1;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const nowIso = () => new Date().toISOString();

  function exactIdentity(value, expected) {
    return !!value &&
      value.version === expected.version &&
      value.build === expected.build;
  }

  function core() {
    return UW.KWTextureQualityNativeReconcile || null;
  }

  function priority() {
    return UW.KWTextureQualityActiveDecalPriority || null;
  }

  function allPart() {
    return UW.KWTextureQualityAllPartPromotion || null;
  }

  function objectId(value) {
    if (!value || (typeof value !== "object" && typeof value !== "function")) {
      return "0";
    }
    let id = displayIds.get(value);
    if (!id) {
      id = nextDisplayId++;
      displayIds.set(value, id);
    }
    return String(id);
  }

  function displaySignature() {
    const character = UW.CK && UW.CK.character;
    if (!character) return { signature: "", count: 0 };

    const rows = [];
    const seen = new Set();
    const add = (key, display) => {
      if (!display || typeof display !== "object" || seen.has(display)) return;
      seen.add(display);
      const data =
        display.data || (display === character.display ? character.data : null);
      const modded = display.modded || null;
      rows.push([
        String(key || ""),
        objectId(display),
        objectId(data),
        objectId(modded)
      ].join(":"));
    };

    add("", character.display);
    if (character.allDisplays && typeof character.allDisplays === "object") {
      for (const [key, display] of Object.entries(character.allDisplays)) {
        add(key, display);
      }
    }

    rows.sort();
    return {
      signature: rows.join("|"),
      count: rows.length
    };
  }

  function executeEmbedded(source, label) {
    try {
      const fn = new Function(
        "unsafeWindow",
        "window",
        "document",
        "console",
        "setInterval",
        "clearInterval",
        "setTimeout",
        "clearTimeout",
        source
      );
      fn(
        UW,
        UW,
        document,
        console,
        setInterval,
        clearInterval,
        setTimeout,
        clearTimeout
      );
    } catch (error) {
      throw new Error(
        label + " failed to load: " +
        (error && error.message ? error.message : String(error))
      );
    }
  }

  async function settleCore(timeoutMs = SETTLE_TIMEOUT_MS) {
    const started = Date.now();
    while ((Date.now() - started) < timeoutMs) {
      const svc = core();
      let snapshot = null;
      try {
        snapshot =
          svc && typeof svc.getState === "function" ? svc.getState() : null;
      } catch (_) {}

      if (snapshot &&
          !snapshot.busy &&
          !snapshot.autoPending &&
          !snapshot.sceneSyncPending) {
        return snapshot;
      }

      await sleep(SETTLE_STEP_MS);
    }

    throw new Error(
      "Stable High Res core did not settle before the Beta compatibility timeout."
    );
  }

  async function settlePriority(timeoutMs = SETTLE_TIMEOUT_MS) {
    const started = Date.now();
    while ((Date.now() - started) < timeoutMs) {
      const owner = priority();
      let snapshot = null;
      try {
        snapshot =
          owner && typeof owner.getState === "function"
            ? owner.getState()
            : null;
      } catch (_) {}

      const svc = core();
      if (snapshot &&
          !snapshot.reconcilePending &&
          !snapshot.lifecycleBlocked &&
          svc &&
          !svc.busy) {
        return snapshot;
      }

      await sleep(SETTLE_STEP_MS);
    }

    throw new Error(
      "Beta accessory-priority owner did not settle before the compatibility timeout."
    );
  }

  async function settleAllPart(timeoutMs = SETTLE_TIMEOUT_MS) {
    const started = Date.now();
    while ((Date.now() - started) < timeoutMs) {
      const owner = allPart();
      let snapshot = null;
      try {
        snapshot =
          owner && typeof owner.getState === "function"
            ? owner.getState()
            : null;
      } catch (_) {}

      if (snapshot &&
          !snapshot.busy &&
          !snapshot.queued &&
          !snapshot.inFlight) {
        return snapshot;
      }

      await sleep(SETTLE_STEP_MS);
    }

    throw new Error(
      "High Res Phase 2 coverage owner did not settle before the compatibility timeout."
    );
  }

  function runMarker(snapshot) {
    const run = snapshot && snapshot.lastRun;
    return run && run.finishedAt
      ? String(run.finishedAt) + "|" + String(run.trigger || "")
      : "";
  }

  async function runLifecycleRepair(reason, force) {
    if (!state.active) return false;

    if (repairPromise) {
      pendingRepairReason = reason || pendingRepairReason || "coalesced";
      pendingRepairForce = pendingRepairForce || !!force;
      return repairPromise;
    }

    repairPromise = (async () => {
      const coreState = await settleCore();
      if (!state.active) return false;

      if (!coreState.enabled) {
        lastStableEnabled = false;
        lastHandledSignature = null;
        return true;
      }

      const displays = displaySignature();
      if (!force &&
          displays.signature &&
          displays.signature === lastHandledSignature) {
        return true;
      }

      const betaPriority = priority();
      const phase2 = allPart();

      if (!exactIdentity(betaPriority, EXPECTED.betaPriority)) {
        throw new Error(
          "Beta accessory-priority owner identity changed unexpectedly."
        );
      }

      if (!exactIdentity(phase2, EXPECTED.allPart)) {
        throw new Error(
          "High Res Phase 2 owner identity changed unexpectedly."
        );
      }

      if (typeof betaPriority.refresh === "function") {
        betaPriority.refresh();
      }
      await settlePriority();

      const beforeMarker = runMarker(phase2.getState());
      if (typeof phase2.refresh === "function") {
        phase2.refresh();
      }
      let after = await settleAllPart();

      if (runMarker(after) === beforeMarker) {
        const ok = await Promise.resolve(phase2.reconcile());
        if (ok === false) {
          throw new Error(
            "High Res Phase 2 declined the lifecycle repair pass."
          );
        }
        after = await settleAllPart();
      }

      if (after.lastError) {
        throw new Error(
          "High Res Phase 2 coverage error: " + after.lastError
        );
      }

      const finalDisplays = displaySignature();
      lastHandledSignature = finalDisplays.signature;
      lastStableEnabled = true;
      state.lastHandledDisplayCount = finalDisplays.count;
      state.lifecycleRepairCount += 1;
      state.lastLifecycleReason = reason || "repair";
      state.lastLifecycleAt = nowIso();
      state.lastError = null;
      return true;
    })().catch((error) => {
      state.lastError =
        error && error.message ? error.message : String(error);
      console.warn(
        "[Witch Dock Beta High Res Phase 2] Lifecycle repair failed:",
        error
      );
      return false;
    }).finally(() => {
      repairPromise = null;
      if (state.active && pendingRepairReason) {
        const nextReason = pendingRepairReason;
        const nextForce = pendingRepairForce;
        pendingRepairReason = null;
        pendingRepairForce = false;
        scheduleLifecycleRepair(nextReason, nextForce);
      }
    });

    return repairPromise;
  }

  function scheduleLifecycleRepair(reason, force) {
    if (!state.active) return false;

    pendingRepairReason =
      reason || pendingRepairReason || "scheduled";
    pendingRepairForce =
      pendingRepairForce || !!force;

    if (repairTimer || repairPromise) return true;

    repairTimer = setTimeout(() => {
      repairTimer = null;
      const nextReason =
        pendingRepairReason || "scheduled";
      const nextForce = pendingRepairForce;
      pendingRepairReason = null;
      pendingRepairForce = false;
      void runLifecycleRepair(nextReason, nextForce);
    }, 60);

    return true;
  }

  function onCoreState(snapshot) {
    if (!state.active || !snapshot) return;
    if (snapshot.busy ||
        snapshot.autoPending ||
        snapshot.sceneSyncPending) {
      return;
    }

    if (repairPromise) {
      lastStableEnabled = !!snapshot.enabled;
      return;
    }

    const displays = displaySignature();

    if (!snapshot.enabled) {
      lastStableEnabled = false;
      lastHandledSignature = null;
      return;
    }

    if (!lastStableEnabled) {
      lastStableEnabled = true;
      if (displays.signature &&
          displays.signature === lastHandledSignature) {
        return;
      }
      scheduleLifecycleRepair("core-enabled", true);
      return;
    }

    if (displays.signature &&
        displays.signature !== lastHandledSignature) {
      scheduleLifecycleRepair("scene-display-change", true);
    }
  }

  function clearLifecycleHooks() {
    if (repairTimer) {
      clearTimeout(repairTimer);
      repairTimer = null;
    }

    pendingRepairReason = null;
    pendingRepairForce = false;

    if (unsubscribeCore) {
      try {
        unsubscribeCore();
      } catch (_) {}
      unsubscribeCore = null;
    }
  }

  async function maybeAwait(value) {
    if (value && typeof value.then === "function") {
      return value;
    }
    return value;
  }

  async function restoreStablePriority() {
    const existing = priority();

    if (exactIdentity(existing, EXPECTED.stablePriority)) {
      return true;
    }

    if (existing) {
      throw new Error(
        "Cannot restore Stable priority while an unexpected priority owner is present."
      );
    }

    executeEmbedded(
      STABLE_PRIORITY_SOURCE,
      "Stable accessory-priority restore"
    );

    const restored = priority();
    if (!exactIdentity(restored, EXPECTED.stablePriority)) {
      throw new Error(
        "Stable accessory-priority owner did not restore to the expected identity."
      );
    }

    return true;
  }

  async function rollbackOwnedOwners() {
    clearLifecycleHooks();

    if (repairPromise) {
      try {
        await repairPromise;
      } catch (_) {}
    }

    const phase2 = allPart();
    if (state.ownsAllPart &&
        exactIdentity(phase2, EXPECTED.allPart) &&
        typeof phase2.dispose === "function") {
      await maybeAwait(phase2.dispose());
    }
    state.ownsAllPart = false;

    const betaPriority = priority();
    if (state.ownsPriority &&
        exactIdentity(betaPriority, EXPECTED.betaPriority) &&
        typeof betaPriority.dispose === "function") {
      await maybeAwait(betaPriority.dispose());
    }
    state.ownsPriority = false;

    await restoreStablePriority();

    lastStableEnabled = false;
    lastHandledSignature = null;
    displayIds = new WeakMap();
    nextDisplayId = 1;
    return true;
  }

  async function activate() {
    if (state.active) return true;

    const svc = core();
    const stablePriority = priority();

    if (!exactIdentity(svc, EXPECTED.core)) {
      throw new Error(
        "High Res Phase 2 Beta requires Witch Dock Stable Texture Quality " +
        EXPECTED.core.version + " / " +
        EXPECTED.core.build + "."
      );
    }

    if (!exactIdentity(
      stablePriority,
      EXPECTED.stablePriority
    )) {
      throw new Error(
        "High Res Phase 2 Beta requires the expected Stable accessory-priority owner."
      );
    }

    if (allPart()) {
      throw new Error(
        "A High Res all-part owner is already present; refusing to stack Beta Phase 2."
      );
    }

    state.lastError = null;

    try {
      await maybeAwait(stablePriority.dispose());

      if (priority()) {
        throw new Error(
          "Stable accessory-priority owner did not release cleanly."
        );
      }

      executeEmbedded(
        BETA_PRIORITY_SOURCE,
        "Beta accessory-priority owner"
      );

      if (!exactIdentity(
        priority(),
        EXPECTED.betaPriority
      )) {
        throw new Error(
          "Beta accessory-priority owner did not attach with the expected identity."
        );
      }

      state.ownsPriority = true;

      executeEmbedded(
        ALL_PART_SOURCE,
        "High Res Phase 2 all-part owner"
      );

      if (!exactIdentity(
        allPart(),
        EXPECTED.allPart
      )) {
        throw new Error(
          "High Res Phase 2 all-part owner did not attach with the expected identity."
        );
      }

      state.ownsAllPart = true;
      state.active = true;
      state.activationCount += 1;
      state.activatedAt = nowIso();

      const repaired =
        await runLifecycleRepair("activation", true);

      if (!repaired) {
        throw new Error(
          state.lastError ||
          "Initial High Res Phase 2 compatibility pass failed."
        );
      }

      const currentCore = core();
      if (currentCore &&
          typeof currentCore.onChange === "function") {
        unsubscribeCore =
          currentCore.onChange(onCoreState);
      }

      return true;
    } catch (error) {
      state.lastError =
        error && error.message
          ? error.message
          : String(error);

      state.active = false;

      try {
        await rollbackOwnedOwners();
      } catch (rollbackError) {
        state.lastError +=
          " Rollback error: " +
          (rollbackError && rollbackError.message
            ? rollbackError.message
            : String(rollbackError));
      }

      throw new Error(state.lastError);
    }
  }

  async function deactivate() {
    if (!state.active) return true;

    state.lastError = null;

    try {
      await rollbackOwnedOwners();
      state.active = false;
      state.deactivationCount += 1;
      state.deactivatedAt = nowIso();
      return true;
    } catch (error) {
      state.lastError =
        error && error.message
          ? error.message
          : String(error);
      throw error;
    }
  }

  function summarizeAllPart() {
    const owner = allPart();
    if (!owner ||
        typeof owner.getState !== "function") {
      return null;
    }

    try {
      const snapshot = owner.getState();
      const run =
        snapshot && snapshot.lastRun || null;

      return {
        version: snapshot.version || null,
        build: snapshot.build || null,
        enabled: !!snapshot.enabled,
        busy: !!snapshot.busy,
        queued: !!snapshot.queued,
        activeBindings:
          Number(snapshot.activeBindings) || 0,
        lastError: snapshot.lastError || null,
        lastRun: run ? {
          trigger: run.trigger || null,
          finishedAt: run.finishedAt || null,
          selected:
            Array.isArray(run.selected)
              ? run.selected.length
              : 0,
          densitySelected:
            Array.isArray(run.densitySelected)
              ? run.densitySelected.length
              : 0,
          downgraded:
            Array.isArray(run.downgraded)
              ? run.downgraded.length
              : 0,
          skipped:
            Array.isArray(run.skipped)
              ? run.skipped.length
              : 0,
          failed:
            Array.isArray(run.failed)
              ? run.failed.length
              : 0,
          restored:
            Array.isArray(run.restored)
              ? run.restored.length
              : 0
        } : null
      };
    } catch (_) {
      return null;
    }
  }

  function getState() {
    const svc = core();
    const currentPriority = priority();
    let coreState = null;
    let priorityState = null;

    try {
      coreState =
        svc && typeof svc.getState === "function"
          ? svc.getState()
          : null;
    } catch (_) {}

    try {
      priorityState =
        currentPriority &&
        typeof currentPriority.getState === "function"
          ? currentPriority.getState()
          : null;
    } catch (_) {}

    return {
      active: state.active,
      activationCount: state.activationCount,
      deactivationCount: state.deactivationCount,
      activatedAt: state.activatedAt,
      deactivatedAt: state.deactivatedAt,
      lifecycleRepairCount:
        state.lifecycleRepairCount,
      lastLifecycleReason:
        state.lastLifecycleReason,
      lastLifecycleAt:
        state.lastLifecycleAt,
      lastHandledDisplayCount:
        state.lastHandledDisplayCount,
      lastError: state.lastError,
      compatibility: {
        expectedCore: EXPECTED.core,
        core: svc ? {
          version: svc.version || null,
          build: svc.build || null
        } : null,
        priority: currentPriority ? {
          version: currentPriority.version || null,
          build: currentPriority.build || null
        } : null,
        allPart: summarizeAllPart()
      },
      lifecycle: {
        coreEnabled:
          !!(coreState && coreState.enabled),
        coreBusy:
          !!(coreState && coreState.busy),
        persistent:
          !!(coreState && coreState.persistent),
        autoPending:
          !!(coreState && coreState.autoPending),
        sceneSyncPending:
          !!(coreState && coreState.sceneSyncPending),
        priorityReconcilePending:
          !!(
            priorityState &&
            priorityState.reconcilePending
          ),
        priorityPolicyDirty:
          !!(
            priorityState &&
            priorityState.policyDirty
          ),
        repairPending:
          !!repairPromise || !!repairTimer
      },
      embeddedSources: {
        betaPriority:
          EXPECTED.betaPriority,
        allPart:
          EXPECTED.allPart,
        stablePriorityRestore:
          EXPECTED.restorePriority
      }
    };
  }

  function render(container) {
    const note =
      document.createElement("div");
    note.style.fontSize = "11px";
    note.style.lineHeight = "1.4";
    note.textContent =
      "High Res Phase 2 runs as a Stable-compatible Beta overlay. " +
      "Turning this module OFF restores the Stable Texture Quality owner in-page.";
    container.appendChild(note);

    const snapshot = getState();
    const status =
      document.createElement("div");
    status.style.marginTop = "6px";
    status.style.fontSize = "10px";
    status.style.opacity = ".72";
    status.textContent =
      snapshot.active
        ? "Phase 2 active · lifecycle repairs: " +
          snapshot.lifecycleRepairCount +
          " · promoted bindings: " +
          (
            (
              snapshot.compatibility.allPart &&
              snapshot.compatibility.allPart.activeBindings
            ) || 0
          )
        : "Phase 2 inactive";
    container.appendChild(status);
  }

  async function dispose() {
    if (
      state.active ||
      state.ownsPriority ||
      state.ownsAllPart
    ) {
      await deactivate();
    } else {
      clearLifecycleHooks();
    }

    return true;
  }

  host.registerModule({
    id: ID,
    version: VERSION,
    build: BUILD,
    activate,
    deactivate,
    render,
    getState,
    dispose
  });
})();
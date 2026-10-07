// ==UserScript==
// @name         Witch Dock DEV - Texture Quality All-Part Promotion
// @namespace    KnightWitch
// @version      0.1.1
// @description  Dev-only budgeted normal-source and atlas-density promotion for eligible rendered parts.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const GLOBAL = 'KWTextureQualityAllPartPromotion';
  if (UW[GLOBAL]) return;

  const VERSION = '0.1.1';
  const BUILD = '0.1.1-owned-density-structural-sync';
  const OWNER = 82042525;
  const CORE_TARGETS = new Set(['bodyLower', 'bodyUpper', 'face']);
  const DEFAULT_QUALITY_CEILING = 1024;
  const MAX_OWNED_ATLAS_PIXELS = 8192 * 4096;
  const LOAD_TIMEOUT = 5000;
  const SETTLE_TIMEOUT = 15000;
  const POLL_MS = 75;
  const PROBE_SIZES = [4096, 2048, 1024, 512, 256, 128, 64, 32];
  const MAX_DIAGNOSTICS = 900;

  let service = null;
  let originals = null;
  let wrappers = null;
  let disposed = false;
  let running = null;
  let queued = null;
  let active = null;
  let qualityCeiling = DEFAULT_QUALITY_CEILING;
  let lastAppliedSignature = '';
  let lastError = null;
  let lastRun = emptyRun('idle');
  let lastRestored = [];
  const positiveCache = new Map();
  const negativeCache = new Map();
  const inFlight = new Map();
  const objectIds = new WeakMap();
  let objectIdCounter = 1;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function emptyRun(trigger) {
    return {
      trigger,
      startedAt: null,
      finishedAt: null,
      selected: [],
      downgraded: [],
      skipped: [],
      failed: [],
      restored: [],
      displays: []
    };
  }

  function boundedPush(list, row) {
    if (list.length < MAX_DIAGNOSTICS) list.push(row);
  }

  function objectId(value) {
    if (!value || (typeof value !== 'object' && typeof value !== 'function')) return null;
    let id = objectIds.get(value);
    if (!id) {
      id = objectIdCounter++;
      objectIds.set(value, id);
    }
    return id;
  }

  function own(o, k) {
    return {
      o,
      k,
      had: Object.prototype.hasOwnProperty.call(o, k),
      d: Object.getOwnPropertyDescriptor(o, k),
      v: o[k],
      applied: undefined
    };
  }

  function restoreIfOwned(snapshot) {
    if (!snapshot || !snapshot.o) return { restored: false, outside: false };
    try {
      if (snapshot.applied !== undefined && snapshot.o[snapshot.k] !== snapshot.applied) {
        return { restored: false, outside: true };
      }
      if (snapshot.had && snapshot.d) Object.defineProperty(snapshot.o, snapshot.k, snapshot.d);
      else delete snapshot.o[snapshot.k];
      return { restored: true, outside: false };
    } catch (_) {
      try {
        if (snapshot.applied !== undefined && snapshot.o[snapshot.k] !== snapshot.applied) {
          return { restored: false, outside: true };
        }
        snapshot.o[snapshot.k] = snapshot.v;
        return { restored: true, outside: false };
      } catch (_) {
        return { restored: false, outside: false };
      }
    }
  }

  function textureSource(texture) {
    try {
      const image = texture && texture.image;
      const source = image && (image.currentSrc || image.src) || texture && (texture.path || texture.url) || null;
      return typeof source === 'string' ? source : null;
    } catch (_) {
      return null;
    }
  }

  function textureSize(texture) {
    try {
      const image = texture && texture.image;
      const width = Number(image && image.width) || 0;
      const height = Number(image && image.height) || 0;
      return [width, height];
    } catch (_) {
      return [0, 0];
    }
  }

  function squareTextureSize(texture) {
    const size = textureSize(texture);
    return size[0] > 0 && size[0] === size[1] ? size[0] : Math.max(size[0], size[1]);
  }

  function parseNormalSource(source) {
    if (typeof source !== 'string' || !source || /^data:|^blob:/i.test(source)) return null;
    const match = source.match(/^(.*(?:_nrml_|_normal_))(\d+)(\.[a-z0-9]+(?:[?#].*)?)$/i);
    if (!match) return null;
    const size = Number(match[2]);
    if (!Number.isFinite(size) || size <= 0) return null;
    return {
      prefix: match[1],
      size,
      suffix: match[3],
      key: `${match[1]}{size}${match[3]}`,
      urlFor(nextSize) { return `${match[1]}${nextSize}${match[3]}`; }
    };
  }

  function resourceType(url) {
    const match = String(url || '').match(/\.([a-z0-9]+)(?:[?#].*)?$/i);
    return match ? match[1].toLowerCase() : 'webp';
  }

  function allocationRect(atlas, slot) {
    if (!atlas || typeof atlas.getUV !== 'function') return null;
    try {
      const uv = atlas.getUV(slot);
      if (!uv) return null;
      const width = Math.round(Number(uv.z) * Number(atlas.width));
      const height = Math.round(Number(uv.w) * Number(atlas.height));
      if (!(width > 0 && height > 0)) return null;
      return {
        x: Math.round(Number(uv.x || 0) * Number(atlas.width)),
        y: Math.round(Number(uv.y || 0) * Number(atlas.height)),
        width,
        height,
        area: width * height
      };
    } catch (_) {
      return null;
    }
  }

  function partId(part) {
    return part ? [part.id ?? '', part.baseName ?? '', part.name ?? ''].join('|') : null;
  }

  function collectRows() {
    const CK = UW && UW.CK;
    const c = CK && CK.character;
    if (!CK || !c) return [];
    const rows = [];
    const seen = new Set();

    const add = (key, display) => {
      if (!display || typeof display !== 'object' || seen.has(display)) return;
      const d = display.data || (display === c.display ? c.data : null);
      const m = display.modded;
      if (!d || !d.atlasScale || !m || !m.parts || !display.meshes || !display.atlas) return;
      seen.add(display);
      rows.push({
        key: String(key || ''),
        primary: display === c.display || d.primary === true,
        d,
        display,
        m,
        parts: m.parts,
        meshes: display.meshes
      });
    };

    add('', c.display);
    if (c.allDisplays && typeof c.allDisplays === 'object') {
      for (const [key, display] of Object.entries(c.allDisplays)) add(key, display);
    }
    return rows;
  }

  function normalUniforms(mesh) {
    const out = [];
    const materials = Array.isArray(mesh && mesh.material) ? mesh.material : [mesh && mesh.material];
    for (let index = 0; index < materials.length; index += 1) {
      const material = materials[index];
      const uniform = material && material.uniforms && material.uniforms.normalMap;
      if (uniform && typeof uniform === 'object' && uniform.value) out.push({ materialIndex: index, uniform });
    }
    return out;
  }

  function normalizeTarget(value) {
    const numeric = Number(value);
    if (!(numeric > 0)) return 0;
    for (const size of PROBE_SIZES) if (size <= numeric) return size;
    return 0;
  }

  function idealTarget(part, currentSource, allocation) {
    const values = [
      currentSource,
      allocation ? Math.max(allocation.width, allocation.height) : 0,
      part && part.bakeSize,
      part && part._idealTextureSize,
      part && part.idealTextureSize,
      part && part.idealTextureSizeLegacy,
      part && part.textureSize
    ].map(Number).filter((value) => Number.isFinite(value) && value > 0);
    const declared = values.length ? Math.max(...values) : currentSource;
    const normalized = normalizeTarget(declared) || currentSource;
    return Math.max(currentSource, Math.min(qualityCeiling, normalized));
  }

  function collectHosts(row) {
    const hosts = [];
    for (const [key, mesh] of Object.entries(row.meshes || {})) {
      if (CORE_TARGETS.has(key)) continue;
      const part = row.parts[key];
      if (!part) continue;
      const allocation = allocationRect(row.display.atlas, key);
      if (!allocation) continue;
      const bindings = normalUniforms(mesh);

      for (let bindingIndex = 0; bindingIndex < bindings.length; bindingIndex += 1) {
        const binding = bindings[bindingIndex];
        const texture = binding.uniform.value;
        const source = textureSource(texture);
        const parsed = parseNormalSource(source);
        if (!parsed) continue;
        const currentSource = squareTextureSize(texture) || parsed.size;
        if (!(currentSource > 0)) continue;
        hosts.push({
          row,
          key,
          bindingIndex,
          mesh,
          part,
          uniform: binding.uniform,
          texture,
          source,
          parsed,
          currentSource,
          allocation,
          ideal: idealTarget(part, currentSource, allocation),
          scale: Number(row.d.atlasScale[key]),
          usedTextureSize: Number(part._usedTextureSize),
          hostId: `${objectId(row.d)}:${key}:${bindingIndex}`
        });
      }
    }
    return hosts;
  }

  function collectAllocations(row) {
    const map = new Map();
    const rects = new Set();
    let occupied = 0;

    for (const key of Object.keys(row.parts || {})) {
      const rect = allocationRect(row.display.atlas, key);
      if (!rect) continue;
      map.set(key, rect);
      const signature = `${rect.x}:${rect.y}:${rect.width}:${rect.height}`;
      if (!rects.has(signature)) {
        rects.add(signature);
        occupied += rect.area;
      }
    }
    return { map, occupied };
  }

  function displayBudget(row, occupied) {
    const CK = UW && UW.CK;
    const S = CK && CK.Settings;
    const atlasArea = Math.max(0, Number(row.display.atlas.width) * Number(row.display.atlas.height));
    const settingsArea = S
      ? Math.max(0, Number(S.textureWidthMax) * Number(S.textureHeightMax))
      : 0;
    const ownedCeiling = settingsArea > 0 ? Math.min(settingsArea, MAX_OWNED_ATLAS_PIXELS) : 0;
    const budget = Math.max(atlasArea, ownedCeiling, occupied);
    return Number.isFinite(budget) && budget > 0 ? budget : occupied;
  }

  function groupHosts(hosts) {
    const groups = new Map();
    for (const host of hosts) {
      let group = groups.get(host.parsed.key);
      if (!group) {
        group = {
          id: host.parsed.key,
          parsed: host.parsed,
          hosts: [],
          existingBySize: new Map(),
          desired: 0,
          maxAllocation: 0,
          uniqueKeys: new Set(),
          sourceCeiling: 0,
          sourceTexture: null,
          sourceUrl: null,
          failedUrls: []
        };
        groups.set(group.id, group);
      }
      group.hosts.push(host);
      group.uniqueKeys.add(host.key);
      group.desired = Math.max(group.desired, host.ideal);
      group.maxAllocation = Math.max(group.maxAllocation, host.allocation.width, host.allocation.height);
      if (!group.existingBySize.has(host.currentSource)) {
        group.existingBySize.set(host.currentSource, { texture: host.texture, url: host.source });
      }
    }
    return Array.from(groups.values());
  }

  function groupPriority(a, b) {
    if (b.maxAllocation !== a.maxAllocation) return b.maxAllocation - a.maxAllocation;
    if (a.uniqueKeys.size !== b.uniqueKeys.size) return a.uniqueKeys.size - b.uniqueKeys.size;
    if (b.desired !== a.desired) return b.desired - a.desired;
    return a.id.localeCompare(b.id);
  }

  async function loadVariant(url, expectedSize) {
    if (positiveCache.has(url)) return positiveCache.get(url);
    if (negativeCache.has(url)) return null;
    if (inFlight.has(url)) return inFlight.get(url);

    const promise = (async () => {
      const CK = UW && UW.CK;
      const R = CK && CK.Resources;
      if (!R || typeof R.getResource !== 'function' || typeof R.getNow !== 'function') {
        negativeCache.set(url, 'resources-unavailable');
        return null;
      }

      let loadError = null;
      let settled = false;
      try {
        const pending = R.getResource(url, resourceType(url), OWNER);
        if (pending && typeof pending.then === 'function') {
          pending.then(
            () => { settled = true; },
            (error) => {
              settled = true;
              loadError = String(error && error.message || error);
            }
          );
        } else {
          settled = true;
        }
      } catch (error) {
        negativeCache.set(url, String(error && error.message || error));
        return null;
      }

      const end = Date.now() + LOAD_TIMEOUT;
      while (Date.now() < end) {
        let texture = null;
        try { texture = R.getNow(url); } catch (_) {}
        const size = squareTextureSize(texture);
        if (texture && size === expectedSize) {
          positiveCache.set(url, texture);
          return texture;
        }
        if (settled && loadError) {
          negativeCache.set(url, loadError);
          return null;
        }
        await sleep(POLL_MS);
      }

      negativeCache.set(url, loadError || 'load-timeout-or-size-mismatch');
      return null;
    })().finally(() => inFlight.delete(url));

    inFlight.set(url, promise);
    return promise;
  }

  function candidateSizes(group) {
    const currentMax = Math.max(...Array.from(group.existingBySize.keys()));
    const upper = Math.max(currentMax, Math.min(qualityCeiling, group.desired));
    return PROBE_SIZES.filter((size) => size > currentMax && size <= upper);
  }

  async function resolveSourceCeiling(group) {
    const currentMax = Math.max(...Array.from(group.existingBySize.keys()));
    group.sourceCeiling = currentMax;
    const existing = group.existingBySize.get(currentMax);
    group.sourceTexture = existing ? existing.texture : null;
    group.sourceUrl = existing ? existing.url : null;

    for (const size of candidateSizes(group)) {
      const url = group.parsed.urlFor(size);
      const texture = await loadVariant(url, size);
      if (texture) {
        group.sourceCeiling = size;
        group.sourceTexture = texture;
        group.sourceUrl = url;
        return group;
      }
      group.failedUrls.push(url);
    }
    return group;
  }

  async function mapLimit(items, limit, worker) {
    const out = new Array(items.length);
    let cursor = 0;
    const runners = new Array(Math.min(limit, items.length)).fill(null).map(async () => {
      while (cursor < items.length) {
        const index = cursor++;
        out[index] = await worker(items[index], index);
      }
    });
    await Promise.all(runners);
    return out;
  }

  function targetCost(group, target) {
    let cost = 0;
    const seen = new Set();
    for (const host of group.hosts) {
      if (seen.has(host.key)) continue;
      seen.add(host.key);
      const currentArea = host.allocation.area;
      const targetArea = target * target;
      if (targetArea > currentArea) cost += targetArea - currentArea;
    }
    return cost;
  }

  async function textureForTarget(group, target) {
    if (group.existingBySize.has(target)) return group.existingBySize.get(target);
    if (target === group.sourceCeiling && group.sourceTexture) {
      return { texture: group.sourceTexture, url: group.sourceUrl };
    }
    const url = group.parsed.urlFor(target);
    const texture = await loadVariant(url, target);
    return texture ? { texture, url } : null;
  }

  function selectionCandidateSizes(group) {
    const upper = Math.max(
      Math.max(...Array.from(group.existingBySize.keys())),
      Math.min(group.sourceCeiling || 0, group.desired || 0, qualityCeiling)
    );
    return PROBE_SIZES.filter((size) => size <= upper && size > 0);
  }

  async function planDisplay(row, run) {
    const hosts = collectHosts(row);
    const groups = groupHosts(hosts).sort(groupPriority);
    await mapLimit(groups, 8, async (group) => {
      try {
        await resolveSourceCeiling(group);
      } catch (error) {
        group.resolveError = String(error && error.message || error);
      }
      return group;
    });

    const baseline = collectAllocations(row);
    const budget = displayBudget(row, baseline.occupied);
    let remaining = Math.max(0, budget - baseline.occupied);
    const selected = [];

    const displayDiag = {
      key: row.key,
      primary: row.primary,
      atlas: [Number(row.display.atlas.width), Number(row.display.atlas.height)],
      occupiedPixels: baseline.occupied,
      budgetPixels: budget,
      remainingPixelsBefore: remaining,
      eligibleBindings: hosts.length,
      groups: groups.length
    };
    run.displays.push(displayDiag);

    for (const group of groups) {
      if (group.resolveError) {
        boundedPush(run.failed, {
          display: row.key,
          group: group.id,
          reason: 'source-resolution-error',
          error: group.resolveError
        });
        continue;
      }
      for (const url of group.failedUrls) {
        boundedPush(run.failed, {
          display: row.key,
          group: group.id,
          reason: 'source-variant-unavailable',
          url
        });
      }

      const currentMax = Math.max(...group.hosts.map((host) => host.currentSource));
      const desiredUpper = Math.max(currentMax, Math.min(group.desired, group.sourceCeiling, qualityCeiling));
      const candidates = selectionCandidateSizes(group).filter((size) => size <= desiredUpper);
      let chosen = null;
      let firstAvailable = null;

      for (const target of candidates) {
        const hasAnyBenefit = group.hosts.some((host) => (
          target > host.currentSource ||
          target > Math.max(host.allocation.width, host.allocation.height)
        ));
        if (!hasAnyBenefit) continue;

        const cost = targetCost(group, target);
        if (cost > remaining) continue;
        const variant = await textureForTarget(group, target);
        if (!variant) continue;
        if (!firstAvailable) firstAvailable = target;
        chosen = { target, cost, variant };
        break;
      }

      if (!chosen) {
        const reason = group.sourceCeiling <= currentMax
          ? 'no-higher-source-or-density-benefit'
          : 'display-budget-or-variant-unavailable';
        boundedPush(run.skipped, {
          display: row.key,
          group: group.id,
          repeatCount: group.uniqueKeys.size,
          currentSource: currentMax,
          sourceCeiling: group.sourceCeiling,
          desired: group.desired,
          remainingPixels: remaining,
          failedUrls: group.failedUrls.slice()
        });
        const last = run.skipped[run.skipped.length - 1];
        if (last) last.reason = reason;
        continue;
      }

      const highestCandidate = candidates.find((size) => size <= desiredUpper) || chosen.target;
      if (chosen.target < highestCandidate) {
        boundedPush(run.downgraded, {
          display: row.key,
          group: group.id,
          from: highestCandidate,
          to: chosen.target,
          reason: 'display-budget',
          repeatCount: group.uniqueKeys.size
        });
      }

      remaining -= chosen.cost;
      selected.push({
        row,
        group,
        target: chosen.target,
        texture: chosen.variant.texture,
        url: chosen.variant.url,
        cost: chosen.cost
      });
    }

    displayDiag.remainingPixelsAfter = remaining;
    return { row, hosts, groups, selected, baseline, budget };
  }

  function findScaleSnapshot(policy, row, key) {
    return policy.scaleSnapshots.find((entry) => entry.o === row.d.atlasScale && entry.k === key) || null;
  }

  function findUsedSnapshot(policy, part) {
    return policy.usedSnapshots.find((entry) => entry.o === part) || null;
  }

  function rememberObservedUsed(policy, row, host) {
    let snapshot = findUsedSnapshot(policy, host.part);
    if (!snapshot) {
      snapshot = own(host.part, '_usedTextureSize');
      snapshot._diag = { display: row.key, key: host.key, kind: 'usedTextureSize' };
      policy.usedSnapshots.push(snapshot);
    }
    return snapshot;
  }

  function restoreObservedUsed(snapshot) {
    if (!snapshot || !snapshot.o) return { restored: false, outside: false };
    try {
      const current = snapshot.o[snapshot.k];
      if (current === snapshot.v) return { restored: true, outside: false };
      if (snapshot.applied !== undefined && current !== snapshot.applied) {
        return { restored: false, outside: true };
      }
      if (snapshot.had && snapshot.d) Object.defineProperty(snapshot.o, snapshot.k, snapshot.d);
      else delete snapshot.o[snapshot.k];
      return { restored: true, outside: false };
    } catch (_) {
      return { restored: false, outside: false };
    }
  }

  function applySelection(policy, selection, run) {
    const { row, group, target } = selection;
    const selectedHosts = [];

    for (const host of group.hosts) {
      const allocationEdge = Math.max(host.allocation.width, host.allocation.height);
      const desiredScale = allocationEdge > 0 ? target / allocationEdge : 1;
      const currentScale = Number(row.d.atlasScale[host.key]);
      let needsDensity = false;
      if (target > allocationEdge && (!Number.isFinite(currentScale) || currentScale < desiredScale)) {
        let snapshot = findScaleSnapshot(policy, row, host.key);
        if (!snapshot) {
          snapshot = own(row.d.atlasScale, host.key);
          snapshot._diag = { display: row.key, key: host.key, kind: 'atlasScale' };
          policy.scaleSnapshots.push(snapshot);
        }
        rememberObservedUsed(policy, row, host);
        row.d.atlasScale[host.key] = desiredScale;
        snapshot.applied = row.d.atlasScale[host.key];
        needsDensity = true;
        policy.densityDisplays.add(row.d);
      }

      selectedHosts.push({
        displayData: row.d,
        displayKey: row.key,
        key: host.key,
        bindingIndex: host.bindingIndex,
        sourceKey: host.parsed.key,
        baselineSource: host.source,
        baselineSourceSize: host.currentSource,
        baselineAllocation: [host.allocation.width, host.allocation.height],
        target,
        texture: selection.texture,
        url: selection.url,
        repeatCount: group.uniqueKeys.size,
        needsDensity
      });

      boundedPush(run.selected, {
        display: row.key,
        key: host.key,
        bindingIndex: host.bindingIndex,
        currentSource: host.currentSource,
        currentAllocation: [host.allocation.width, host.allocation.height],
        target,
        source: selection.url,
        repeatCount: group.uniqueKeys.size,
        needsDensity
      });
    }

    policy.selected.push(...selectedHosts);
  }

  async function waitForStableRows(expectedData, timeout = SETTLE_TIMEOUT) {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      const CK = UW && UW.CK;
      const c = CK && CK.character;
      const rows = collectRows();
      const ready = !!(
        c &&
        !c._needsUpdating &&
        !c._inUpdate &&
        expectedData.every((d) => {
          const row = rows.find((entry) => entry.d === d);
          return !!row &&
            row.display.resourcesReady !== false &&
            row.display.finished !== false &&
            row.display.atlas === row.m.resourceAtlas;
        })
      );
      if (ready) return rows;
      await sleep(POLL_MS);
    }
    return null;
  }

  async function waitForCoverageStable(timeout = SETTLE_TIMEOUT) {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      const CK = UW && UW.CK;
      const c = CK && CK.character;
      const rows = collectRows();
      const ready = !!(
        c &&
        !c._needsUpdating &&
        !c._inUpdate &&
        rows.every((row) => (
          row.display.resourcesReady !== false &&
          row.display.finished !== false &&
          row.display.atlas === row.m.resourceAtlas
        ))
      );
      if (ready) return rows;
      await sleep(POLL_MS);
    }
    return null;
  }

  async function reconcileDensity(policy, captureObservedUsed = true) {
    if (!policy || !policy.densityDisplays || !policy.densityDisplays.size) return collectRows();
    if (!service || !originals || typeof originals.reconcile !== 'function') {
      throw new Error('Owned Texture Quality reconcile seam is unavailable for all-part density.');
    }

    const ok = await originals.reconcile.call(service);
    if (!ok) throw new Error('Owned Texture Quality reconcile rejected all-part density changes.');

    // Reconcile may legitimately replace the active figure/display set. Wait on
    // the current live display-data identities, not the prior policy's rows.
    const expected = collectRows().map((row) => row.d);
    const stable = await waitForStableRows(expected);
    if (!stable) throw new Error('Timed out waiting for all-part density reconcile to settle.');

    if (captureObservedUsed) {
      for (const snapshot of policy.usedSnapshots) {
        try { snapshot.applied = snapshot.o[snapshot.k]; } catch (_) {}
      }
    }
    return stable;
  }

  function bindSelectedNormals(policy, rows, run) {
    const byData = new Map(rows.map((row) => [row.d, row]));

    for (const selected of policy.selected) {
      const row = byData.get(selected.displayData);
      const mesh = row && row.meshes[selected.key];
      const bindings = normalUniforms(mesh);
      const binding = bindings[selected.bindingIndex];
      if (!binding || !binding.uniform) {
        boundedPush(run.failed, {
          display: selected.displayKey,
          key: selected.key,
          reason: 'normal-binding-missing-after-rebuild'
        });
        continue;
      }

      const currentTexture = binding.uniform.value;
      const currentSource = textureSource(currentTexture);
      const parsed = parseNormalSource(currentSource);
      if (!parsed || parsed.key !== selected.sourceKey) {
        boundedPush(run.skipped, {
          display: selected.displayKey,
          key: selected.key,
          reason: 'outside-normal-binding-change',
          currentSource
        });
        continue;
      }

      const currentSize = squareTextureSize(currentTexture);
      if (currentSize >= selected.target) continue;

      const snapshot = own(binding.uniform, 'value');
      snapshot._diag = {
        display: selected.displayKey,
        key: selected.key,
        bindingIndex: selected.bindingIndex,
        kind: 'normal'
      };
      binding.uniform.value = selected.texture;
      snapshot.applied = binding.uniform.value;
      policy.normalSnapshots.push(snapshot);
    }

    try {
      const loop = UW && UW.CK && UW.CK.GameLoop;
      if (loop && typeof loop.requestRenderRefresh === 'function') loop.requestRenderRefresh();
    } catch (_) {}
  }

  function collateralAfter(plan) {
    const currentRows = collectRows();
    const collateral = [];
    const selectedByData = new Map();

    for (const displayPlan of plan) {
      const keys = new Set();
      for (const selection of displayPlan.selected) {
        for (const host of selection.group.hosts) keys.add(host.key);
      }
      selectedByData.set(displayPlan.row.d, keys);
    }

    for (const displayPlan of plan) {
      const row = currentRows.find((entry) => entry.d === displayPlan.row.d);
      if (!row) {
        collateral.push({ display: displayPlan.row.key, key: null, reason: 'display-missing' });
        continue;
      }
      const selectedKeys = selectedByData.get(displayPlan.row.d) || new Set();

      for (const [key, baseline] of displayPlan.baseline.map.entries()) {
        const current = allocationRect(row.display.atlas, key);
        if (!current) continue;
        if (current.width < baseline.width || current.height < baseline.height) {
          collateral.push({
            display: row.key,
            key,
            selected: selectedKeys.has(key),
            baseline: [baseline.width, baseline.height],
            current: [current.width, current.height],
            reason: 'allocation-downsize'
          });
        }
      }
    }
    return collateral;
  }

  function selectedVerification(policy) {
    const rows = collectRows();
    const failures = [];
    for (const selected of policy.selected) {
      const row = rows.find((entry) => entry.d === selected.displayData);
      const rect = row && allocationRect(row.display.atlas, selected.key);
      if (!rect || rect.width < selected.target || rect.height < selected.target) {
        failures.push({
          display: selected.displayKey,
          key: selected.key,
          reason: 'selected-allocation-below-target',
          target: selected.target,
          allocation: rect ? [rect.width, rect.height] : null
        });
        continue;
      }
      const binding = row && normalUniforms(row.meshes[selected.key])[selected.bindingIndex];
      const size = binding ? squareTextureSize(binding.uniform.value) : 0;
      if (selected.baselineSourceSize < selected.target && size < selected.target) {
        failures.push({
          display: selected.displayKey,
          key: selected.key,
          reason: 'selected-normal-below-target',
          target: selected.target,
          normalSize: size
        });
      }
    }
    return failures;
  }

  function releaseOwnedResources() {
    try {
      const R = UW && UW.CK && UW.CK.Resources;
      if (R && typeof R.unregister === 'function') R.unregister(OWNER);
    } catch (_) {}
    positiveCache.clear();
    inFlight.clear();
  }

  async function restoreActive(rebuild, reason) {
    const policy = active;
    if (!policy) {
      releaseOwnedResources();
      return [];
    }

    const restored = [];
    for (let index = policy.normalSnapshots.length - 1; index >= 0; index -= 1) {
      const snapshot = policy.normalSnapshots[index];
      const result = restoreIfOwned(snapshot);
      restored.push({ ...(snapshot._diag || { kind: 'normal' }), restored: result.restored, outside: result.outside });
    }
    for (let index = policy.scaleSnapshots.length - 1; index >= 0; index -= 1) {
      const snapshot = policy.scaleSnapshots[index];
      const result = restoreIfOwned(snapshot);
      restored.push({ ...(snapshot._diag || { kind: 'atlasScale' }), restored: result.restored, outside: result.outside });
    }

    if (rebuild && policy.densityDisplays && policy.densityDisplays.size) {
      try { await reconcileDensity(policy, false); } catch (error) {
        restored.push({ kind: 'densityReconcile', restored: false, outside: false, error: String(error && error.message || error) });
      }
    }

    for (let index = policy.usedSnapshots.length - 1; index >= 0; index -= 1) {
      const snapshot = policy.usedSnapshots[index];
      const result = restoreObservedUsed(snapshot);
      restored.push({ ...(snapshot._diag || { kind: 'usedTextureSize' }), restored: result.restored, outside: result.outside });
    }

    active = null;
    lastAppliedSignature = '';
    lastRestored = restored.slice(-MAX_DIAGNOSTICS);
    releaseOwnedResources();
    return restored;
  }

  function sceneSignature() {
    const rows = collectRows();
    return JSON.stringify(rows.map((row) => ({
      d: objectId(row.d),
      key: row.key,
      // Structural identity only. Do not include display generations, atlas
      // allocations, normal bindings, scales, or used sizes: those are
      // rendering state this service/core reconcile may legitimately change.
      parts: Object.keys(row.parts).sort().map((key) => [
        key,
        partId(row.parts[key])
      ])
    })));
  }

  function lifecycleBlocked() {
    let core = null;
    let guard = null;
    try { core = service && typeof service.getState === 'function' ? service.getState() : null; } catch (_) {}
    try {
      const drift = UW && UW.KWTextureQualitySameFigureDriftGuard;
      guard = drift && typeof drift.getState === 'function' ? drift.getState() : null;
    } catch (_) {}
    return !!((core && core.sceneSyncPending) || (guard && guard.pending));
  }

  async function runCoverage(trigger) {
    if (disposed || !service || !service.enabled || service.busy || lifecycleBlocked()) return false;
    if (running) return running;

    running = (async () => {
      const run = emptyRun(trigger);
      run.startedAt = Date.now();
      lastError = null;

      try {
        await restoreActive(!!active, 'replan');
        const rows = collectRows();
        if (!rows.length) {
          run.finishedAt = Date.now();
          lastRun = run;
          return true;
        }

        const plans = [];
        for (const row of rows) plans.push(await planDisplay(row, run));
        const selections = plans.flatMap((plan) => plan.selected);

        if (!selections.length) {
          run.finishedAt = Date.now();
          lastRun = run;
          lastAppliedSignature = sceneSignature();
          releaseOwnedResources();
          return true;
        }

        const policy = {
          createdAt: Date.now(),
          scaleSnapshots: [],
          usedSnapshots: [],
          normalSnapshots: [],
          selected: [],
          densityDisplays: new Set(),
          plans
        };
        active = policy;

        for (const selection of selections) applySelection(policy, selection, run);
        const stableRows = policy.densityDisplays.size
          ? await reconcileDensity(policy)
          : collectRows();
        bindSelectedNormals(policy, stableRows, run);

        const collateral = policy.densityDisplays.size ? collateralAfter(plans) : [];
        const selectedFailures = selectedVerification(policy);
        if (collateral.length || selectedFailures.length) {
          for (const row of collateral) boundedPush(run.failed, row);
          for (const row of selectedFailures) boundedPush(run.failed, row);
          await restoreActive(true, 'verification-failed');
          throw new Error(collateral.length
            ? 'All-part promotion would downsize existing atlas allocations.'
            : 'All-part promotion failed selected-host verification.');
        }

        run.finishedAt = Date.now();
        run.restored = [];
        lastRun = run;
        lastAppliedSignature = sceneSignature();
        return true;
      } catch (error) {
        lastError = String(error && error.message || error);
        if (active) {
          try {
            run.restored = await restoreActive(true, 'failure');
          } catch (_) {}
        } else {
          releaseOwnedResources();
        }
        run.finishedAt = Date.now();
        boundedPush(run.failed, { reason: 'run-failed', error: lastError });
        lastRun = run;
        console.warn('[Witch Dock texture quality all-part] Coverage pass failed without disabling core High Res:', error);
        return false;
      }
    })().finally(() => {
      running = null;
    });

    return running;
  }

  function queueCoverage(trigger) {
    if (disposed || queued || running || !service || !service.enabled || service.busy || lifecycleBlocked()) return false;
    queued = Promise.resolve()
      .then(() => runCoverage(trigger))
      .catch((error) => {
        lastError = String(error && error.message || error);
        return false;
      })
      .finally(() => { queued = null; });
    return true;
  }

  function attach() {
    if (disposed || service) return !!service;
    const candidate = UW && UW.KWTextureQualityNativeReconcile;
    if (!candidate ||
        typeof candidate.enable !== 'function' ||
        typeof candidate.disable !== 'function' ||
        typeof candidate.reconcile !== 'function' ||
        typeof candidate.refresh !== 'function' ||
        typeof candidate.setPersistent !== 'function') return false;

    service = candidate;
    originals = {
      enable: candidate.enable,
      disable: candidate.disable,
      reconcile: candidate.reconcile,
      refresh: candidate.refresh,
      setPersistent: candidate.setPersistent,
      dispose: typeof candidate.dispose === 'function' ? candidate.dispose : null
    };

    wrappers = {
      enable: async (...args) => {
        const ok = await originals.enable.apply(candidate, args);
        if (ok && candidate.enabled && !candidate.busy) await runCoverage('enable');
        return ok;
      },
      reconcile: async (...args) => {
        const ok = await originals.reconcile.apply(candidate, args);
        if (ok && candidate.enabled && !candidate.busy) await runCoverage('reconcile');
        return ok;
      },
      disable: async (...args) => {
        await restoreActive(false, 'disable');
        const result = await originals.disable.apply(candidate, args);
        releaseOwnedResources();
        return result;
      },
      setPersistent: (value) => {
        if (!value && !candidate.enabled && active) {
          void restoreActive(false, 'persistent-off');
        }
        return originals.setPersistent.call(candidate, value);
      },
      refresh: (...args) => {
        const state = originals.refresh.apply(candidate, args);
        if (!candidate.enabled && active) {
          void restoreActive(false, 'refresh-off');
          return state;
        }
        if (candidate.enabled && !candidate.busy && !lifecycleBlocked()) {
          const signature = sceneSignature();
          if (signature !== lastAppliedSignature) queueCoverage('scene-change');
        }
        return state;
      }
    };

    candidate.enable = wrappers.enable;
    candidate.reconcile = wrappers.reconcile;
    candidate.disable = wrappers.disable;
    candidate.setPersistent = wrappers.setPersistent;
    candidate.refresh = wrappers.refresh;

    if (candidate.enabled && !candidate.busy && !lifecycleBlocked()) queueCoverage('attach');
    return true;
  }

  function setQualityCeiling(value) {
    const numeric = normalizeTarget(value);
    if (!numeric || numeric > 4096) return false;
    qualityCeiling = numeric;
    lastAppliedSignature = '';
    if (service && service.enabled && !service.busy && !lifecycleBlocked()) queueCoverage('quality-ceiling');
    return true;
  }

  function state() {
    return {
      version: VERSION,
      build: BUILD,
      attached: !!service,
      enabled: !!(service && service.enabled),
      busy: !!running,
      queued: !!queued,
      qualityCeiling,
      ownedAtlasPixelCeiling: MAX_OWNED_ATLAS_PIXELS,
      positiveCache: positiveCache.size,
      negativeCache: negativeCache.size,
      inFlight: inFlight.size,
      activeBindings: active ? active.selected.length : 0,
      lastError,
      lastRun,
      lastRestored
    };
  }

  async function dispose() {
    disposed = true;
    try { await restoreActive(!!(service && service.enabled), 'dispose'); } catch (_) {}

    if (service && originals && wrappers) {
      if (service.enable === wrappers.enable) service.enable = originals.enable;
      if (service.disable === wrappers.disable) service.disable = originals.disable;
      if (service.reconcile === wrappers.reconcile) service.reconcile = originals.reconcile;
      if (service.refresh === wrappers.refresh) service.refresh = originals.refresh;
      if (service.setPersistent === wrappers.setPersistent) service.setPersistent = originals.setPersistent;
    }

    service = null;
    originals = null;
    wrappers = null;
    releaseOwnedResources();
    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }
    return true;
  }

  UW[GLOBAL] = {
    version: VERSION,
    build: BUILD,
    attach,
    refresh: () => {
      if (!service) attach();
      if (service && service.enabled && !service.busy && !lifecycleBlocked()) {
        const signature = sceneSignature();
        if (signature !== lastAppliedSignature) queueCoverage('manual-refresh');
      }
      return state();
    },
    reconcile: () => runCoverage('manual-reconcile'),
    setQualityCeiling,
    getState: state,
    dispose,
    __test: {
      parseNormalSource,
      normalizeTarget,
      idealTarget,
      targetCost,
      restoreIfOwned,
      loadVariant,
      sceneSignature,
      collectRows,
      collectHosts,
      groupHosts,
      displayBudget,
      planDisplay,
      collateralAfter,
      releaseOwnedResources,
      get negativeCacheSize() { return negativeCache.size; },
      get positiveCacheSize() { return positiveCache.size; }
    }
  };

  if (!attach()) {
    const timer = window.setInterval(() => {
      if (disposed || attach()) window.clearInterval(timer);
    }, 100);
  }
})();

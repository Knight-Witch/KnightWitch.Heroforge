const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(
  path.join(__dirname, '../features/rendering/Texture_Quality_All_Part_Promotion.js'),
  'utf8'
);

function texture(url, size) {
  return { image: { src: url, width: size, height: size }, url };
}

function coreService({
  onReconcile = null,
  onDisable = null,
  initialEnabled = false,
  initialBusy = false
} = {}) {
  const core = {
    enabled: initialEnabled,
    busy: initialBusy,
    enable: async () => { core.enabled = true; return true; },
    disable: async () => {
      if (onDisable) await onDisable(core);
      core.enabled = false;
      return true;
    },
    reconcile: async () => onReconcile ? onReconcile(core) : true,
    refresh: () => ({ enabled: core.enabled, busy: core.busy }),
    setPersistent: (value) => value,
    getState: () => ({ enabled: core.enabled, busy: core.busy })
  };
  return core;
}

function harness({ character = null, resources = null, settings = null, coreOptions = null } = {}) {
  const core = coreService(coreOptions || {});
  const original = { ...core };
  const w = {
    KWTextureQualityNativeReconcile: core,
    CK: {
      character,
      Resources: resources || {
        getResource: () => Promise.reject(new Error('missing')),
        getNow: () => null,
        unregister() {}
      },
      Settings: settings || { textureWidthMax: 1024, textureHeightMax: 1024 },
      GameLoop: { requestRenderRefresh() {} }
    }
  };
  const context = {
    window: w,
    console,
    setTimeout: (fn) => { fn(); return 1; },
    clearTimeout() {}
  };
  vm.runInNewContext(source, context);
  return { w, core, original, api: w.KWTextureQualityAllPartPromotion };
}

function runState(trigger = 'test') {
  return {
    trigger,
    startedAt: Date.now(),
    finishedAt: null,
    selected: [],
    downgraded: [],
    skipped: [],
    failed: [],
    restored: [],
    displays: []
  };
}

function displayFixture({
  keys = ['a'],
  size = 128,
  allocationSize = size,
  sourceSize = size,
  usedSize = sourceSize,
  bakeSize = 512,
  atlasSize = 1024,
  sharedSource = 'asset'
} = {}) {
  const uv = {};
  const parts = {};
  const meshes = {};
  const atlasScale = {};
  keys.forEach((key, index) => {
    uv[key] = {
      x: (index * allocationSize) / atlasSize,
      y: 0,
      z: allocationSize / atlasSize,
      w: allocationSize / atlasSize
    };
    parts[key] = { id: index + 1, name: key, bakeSize, _usedTextureSize: usedSize };
    meshes[key] = {
      material: {
        uniforms: {
          normalMap: { value: texture(`/textures/${sharedSource}_nrml_${sourceSize}.webp`, sourceSize) }
        }
      }
    };
    atlasScale[key] = 1;
  });
  const data = {
    atlasScale,
    changeCalls: 0,
    change(...args) {
      data.changeCalls += 1;
      data.lastChangeArgs = args;
      return true;
    }
  };
  const atlas = {
    width: atlasSize,
    height: atlasSize,
    getUV(key) { return uv[key]; }
  };
  const modded = { parts, resourceAtlas: atlas, settings: {}, buildAtlas() {} };
  const display = { data, modded, meshes, atlas, resourcesReady: true, finished: true };
  return { data, display, modded, parts, meshes, atlas, uv };
}

test('normal URL parser is generic and rejects derived/non-URL targets', () => {
  const h = harness();
  const parsed = h.api.__test.parseNormalSource('/static/foo/bar_nrml_128.webp?v=7');
  assert.equal(parsed.size, 128);
  assert.equal(parsed.urlFor(512), '/static/foo/bar_nrml_512.webp?v=7');
  assert.equal(parsed.key, '/static/foo/bar_nrml_{size}.webp?v=7');
  assert.equal(h.api.__test.parseNormalSource('normalMapBlendedTarget'), null);
  assert.equal(h.api.__test.parseNormalSource('blob:abc'), null);
});

test('target calculation respects current source, ideal evidence, and quality ceiling', () => {
  const h = harness();
  const target = h.api.__test.idealTarget(
    { bakeSize: 2048, _idealTextureSize: 4096 },
    128,
    { width: 128, height: 128 }
  );
  assert.equal(target, 1024);
  assert.equal(h.api.setQualityCeiling(512), true);
  assert.equal(
    h.api.__test.idealTarget({ bakeSize: 4096 }, 1024, { width: 1024, height: 1024 }),
    1024,
    'never asks an already-higher source to shrink'
  );
});

test('positive and negative source caching avoid duplicate resource loads', async () => {
  const store = {};
  const calls = new Map();
  const resources = {
    getResource(url) {
      calls.set(url, (calls.get(url) || 0) + 1);
      if (url.includes('missing')) return Promise.reject(new Error('404'));
      const size = Number(url.match(/_(\d+)\.webp$/)[1]);
      store[url] = texture(url, size);
      return Promise.resolve(store[url]);
    },
    getNow(url) { return store[url] || null; },
    unregister() {}
  };
  const h = harness({ resources });
  const good = '/x/shared_nrml_512.webp';
  assert.equal(await h.api.__test.loadVariant(good, 512), store[good]);
  assert.equal(await h.api.__test.loadVariant(good, 512), store[good]);
  assert.equal(calls.get(good), 1);
  assert.equal(h.api.__test.positiveCacheSize, 1);

  const bad = '/x/missing_nrml_512.webp';
  assert.equal(await h.api.__test.loadVariant(bad, 512), null);
  assert.equal(await h.api.__test.loadVariant(bad, 512), null);
  assert.equal(calls.get(bad), 1);
  assert.equal(h.api.__test.negativeCacheSize, 1);
});

test('repeated instances are grouped atomically and charged per packed host', () => {
  const h = harness();
  const parsed = h.api.__test.parseNormalSource('/x/shared_nrml_128.webp');
  const hosts = ['a', 'b', 'c'].map((key) => ({
    key,
    parsed,
    ideal: 512,
    currentSource: 128,
    texture: {},
    source: '/x/shared_nrml_128.webp',
    allocation: { width: 128, height: 128, area: 128 * 128 }
  }));
  const groups = h.api.__test.groupHosts(hosts);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].uniqueKeys.size, 3);
  assert.equal(
    h.api.__test.targetCost(groups[0], 512),
    3 * ((512 * 512) - (128 * 128))
  );
});

test('budget planning downgrades a repeated class instead of exhausting a display', async () => {
  const fixture = displayFixture({ keys: ['a', 'b', 'c', 'd'], size: 128, atlasSize: 512 });
  const store = {};
  const resources = {
    getResource(url) {
      const size = Number(url.match(/_(\d+)\.webp$/)[1]);
      if (![256, 512].includes(size)) return Promise.reject(new Error('404'));
      store[url] = texture(url, size);
      return Promise.resolve(store[url]);
    },
    getNow(url) { return store[url] || null; },
    unregister() {}
  };
  const character = { data: fixture.data, display: fixture.display, allDisplays: {} };
  const h = harness({
    character,
    resources,
    settings: { textureWidthMax: 512, textureHeightMax: 512 }
  });
  const row = h.api.__test.collectRows()[0];
  const run = runState();
  const plan = await h.api.__test.planDisplay(row, run);
  assert.equal(plan.selected.length, 1);
  assert.equal(plan.selected[0].target, 256);
  assert.equal(plan.selected[0].group.uniqueKeys.size, 4);
  assert.equal(run.downgraded.length, 1);
  assert.equal(run.downgraded[0].from, 512);
  assert.equal(run.downgraded[0].to, 256);
});

test('collateral detection identifies an unrelated host that native packing downsized', () => {
  const fixture = displayFixture({ keys: ['selected', 'unrelated'], size: 128, atlasSize: 512 });
  const character = { data: fixture.data, display: fixture.display, allDisplays: {} };
  const h = harness({ character, settings: { textureWidthMax: 512, textureHeightMax: 512 } });
  const row = h.api.__test.collectRows()[0];
  const baseline = {
    map: new Map([
      ['selected', { width: 128, height: 128, area: 128 * 128 }],
      ['unrelated', { width: 128, height: 128, area: 128 * 128 }]
    ])
  };
  fixture.uv.unrelated.z = 64 / 512;
  fixture.uv.unrelated.w = 64 / 512;
  const plan = [{
    row,
    baseline,
    selected: [{ group: { hosts: [{ key: 'selected' }] } }]
  }];
  const collateral = h.api.__test.collateralAfter(plan);
  assert.equal(collateral.length, 1);
  assert.equal(collateral[0].key, 'unrelated');
  assert.equal(collateral[0].selected, false);
});

test('rollback restores exact descriptors but preserves outside edits', () => {
  const h = harness();
  const obj = {};
  const snap = { o: obj, k: 'x', had: false, d: undefined, v: undefined, applied: 4 };
  obj.x = 4;
  assert.deepEqual(
    JSON.parse(JSON.stringify(h.api.__test.restoreIfOwned(snap))),
    { restored: true, outside: false }
  );
  assert.equal(Object.hasOwn(obj, 'x'), false);

  const obj2 = { x: 2 };
  const descriptor = Object.getOwnPropertyDescriptor(obj2, 'x');
  const snap2 = { o: obj2, k: 'x', had: true, d: descriptor, v: 2, applied: 4 };
  obj2.x = 7;
  assert.deepEqual(
    JSON.parse(JSON.stringify(h.api.__test.restoreIfOwned(snap2))),
    { restored: false, outside: true }
  );
  assert.equal(obj2.x, 7);
});

test('optional density reconcile failure rolls back owned state without disabling core High Res', async () => {
  const fixture = displayFixture({ keys: ['a'], size: 128, atlasSize: 512 });
  const store = {};
  const resources = {
    getResource(url) {
      const size = Number(url.match(/_(\d+)\.webp$/)[1]);
      store[url] = texture(url, size);
      return Promise.resolve(store[url]);
    },
    getNow(url) { return store[url] || null; },
    unregister() {}
  };
  const character = { data: fixture.data, display: fixture.display, allDisplays: {} };
  const h = harness({
    character,
    resources,
    settings: { textureWidthMax: 512, textureHeightMax: 512 },
    coreOptions: {
      onReconcile: async () => { throw new Error('synthetic density reconcile failure'); }
    }
  });
  h.core.enabled = true;
  const baselineScale = fixture.data.atlasScale.a;
  const baselineUsed = fixture.parts.a._usedTextureSize;
  const baselineNormal = fixture.meshes.a.material.uniforms.normalMap.value;

  assert.equal(await h.api.reconcile(), false);
  assert.equal(h.core.enabled, true);
  assert.equal(fixture.data.atlasScale.a, baselineScale);
  assert.equal(fixture.parts.a._usedTextureSize, baselineUsed);
  assert.equal(fixture.meshes.a.material.uniforms.normalMap.value, baselineNormal);
  assert.match(h.api.getState().lastError, /synthetic density reconcile failure/);
});

test('source-only promotion skips density reconcile and leaves used texture size untouched', async () => {
  const fixture = displayFixture({
    keys: ['a'],
    allocationSize: 512,
    sourceSize: 128,
    usedSize: 128,
    bakeSize: 512,
    atlasSize: 1024
  });
  const store = {};
  let reconcileCalls = 0;
  const resources = {
    getResource(url) {
      const size = Number(url.match(/_(\d+)\.webp$/)[1]);
      if (size !== 512) return Promise.reject(new Error('404'));
      store[url] = texture(url, size);
      return Promise.resolve(store[url]);
    },
    getNow(url) { return store[url] || null; },
    unregister() {}
  };
  const character = { data: fixture.data, display: fixture.display, allDisplays: {} };
  const h = harness({
    character,
    resources,
    settings: { textureWidthMax: 1024, textureHeightMax: 1024 },
    coreOptions: {
      onReconcile: async () => { reconcileCalls += 1; return true; }
    }
  });
  h.core.enabled = true;

  assert.equal(await h.api.reconcile(), true);
  assert.equal(reconcileCalls, 0, 'source-only promotion must not repack the atlas');
  assert.equal(fixture.parts.a._usedTextureSize, 128);
  assert.equal(fixture.data.atlasScale.a, 1);
  assert.equal(fixture.uv.a.z * fixture.atlas.width, 512);
  assert.equal(fixture.meshes.a.material.uniforms.normalMap.value.image.width, 512);
  assert.equal(h.api.getState().activeBindings, 1);
});

test('attach while core is busy defers exactly one initial coverage pass until refresh-ready', async () => {
  const fixture = displayFixture({ keys: ['bodyLower'] });
  const character = { data: fixture.data, display: fixture.display, allDisplays: {} };
  const h = harness({
    character,
    coreOptions: { initialEnabled: true, initialBusy: true }
  });

  let state = h.api.getState();
  assert.equal(state.initialCoveragePending, true);
  assert.equal(state.lastRun.trigger, 'idle');

  h.core.busy = false;
  h.core.refresh();
  h.core.busy = true;
  await new Promise((resolve) => setTimeout(resolve, 0));

  state = h.api.getState();
  assert.equal(state.initialCoveragePending, true, 'queued pass must not consume the obligation before runCoverage starts');
  assert.equal(state.lastRun.trigger, 'idle');

  h.core.busy = false;
  h.core.refresh();
  await new Promise((resolve) => setTimeout(resolve, 0));

  state = h.api.getState();
  assert.equal(state.initialCoveragePending, false);
  assert.equal(state.lastRun.trigger, 'attach-ready');
  assert.equal(state.busy, false);
  assert.equal(state.queued, false);

  const startedAt = state.lastRun.startedAt;
  for (let i = 0; i < 8; i += 1) h.core.refresh();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(h.api.getState().lastRun.startedAt, startedAt);
});

test('external data.change is debounced into one coverage pass', async () => {
  const fixture = displayFixture({ keys: ['bodyLower'] });
  const character = { data: fixture.data, display: fixture.display, allDisplays: {} };
  const originalChange = fixture.data.change;
  const h = harness({ character });
  h.core.enabled = true;

  assert.notEqual(fixture.data.change, originalChange);
  assert.equal(h.api.getState().changeObserverCount, 1);
  fixture.data.change({ parts: { bodyLower: 'changed' } });
  assert.equal(fixture.data.changeCalls, 1);
  assert.equal(h.api.getState().changePending, true);

  h.core.refresh();
  await Promise.resolve();
  assert.equal(h.api.getState().changePending, true, 'debounce keeps the first refresh observational');

  await new Promise((resolve) => setTimeout(resolve, 625));
  h.core.refresh();
  await new Promise((resolve) => setTimeout(resolve, 0));

  const state = h.api.getState();
  assert.equal(state.changePending, false);
  assert.equal(state.lastRun.trigger, 'data-change');
  assert.equal(state.busy, false);
  assert.equal(state.queued, false);
});

test('owned core reconcile suppresses its native data.change signal', async () => {
  const fixture = displayFixture({ keys: ['bodyLower'] });
  const character = { data: fixture.data, display: fixture.display, allDisplays: {} };
  const h = harness({
    character,
    coreOptions: {
      onReconcile: async () => {
        fixture.data.change({});
        return true;
      }
    }
  });
  h.core.enabled = true;

  assert.equal(await h.core.reconcile(), true);
  assert.equal(fixture.data.changeCalls, 1);
  assert.equal(h.api.getState().changePending, false);
  assert.equal(h.api.getState().lastRun.trigger, 'reconcile');
});

test('figure replacement restores the old owned density/source state against the current live scene', async () => {
  const oldFixture = displayFixture({
    keys: ['a'],
    allocationSize: 128,
    sourceSize: 128,
    usedSize: 128,
    bakeSize: 512,
    atlasSize: 1024,
    sharedSource: 'old'
  });
  const newFixture = displayFixture({
    keys: ['b'],
    allocationSize: 512,
    sourceSize: 512,
    usedSize: 512,
    bakeSize: 512,
    atlasSize: 1024,
    sharedSource: 'new'
  });
  const oldChange = oldFixture.data.change;
  const newChange = newFixture.data.change;
  const character = { data: oldFixture.data, display: oldFixture.display, allDisplays: {} };
  const store = {};
  const resources = {
    getResource(url) {
      const size = Number(url.match(/_(\d+)\.webp$/)[1]);
      if (!url.includes('/old_') || size !== 512) return Promise.reject(new Error('404'));
      store[url] = texture(url, size);
      return Promise.resolve(store[url]);
    },
    getNow(url) { return store[url] || null; },
    unregister() {}
  };
  const h = harness({
    character,
    resources,
    coreOptions: {
      onReconcile: async () => {
        if (character.display === oldFixture.display) {
          oldFixture.uv.a.z = 512 / oldFixture.atlas.width;
          oldFixture.uv.a.w = 512 / oldFixture.atlas.height;
          oldFixture.parts.a._usedTextureSize = 512;
        }
        return true;
      }
    }
  });
  h.core.enabled = true;

  assert.notEqual(oldFixture.data.change, oldChange);
  assert.equal(await h.api.reconcile(), true);
  assert.equal(oldFixture.data.atlasScale.a, 4);
  assert.equal(oldFixture.parts.a._usedTextureSize, 512);
  assert.equal(oldFixture.meshes.a.material.uniforms.normalMap.value.image.width, 512);

  character.data = newFixture.data;
  character.display = newFixture.display;
  character.allDisplays = {};

  assert.equal(await h.core.reconcile(), true);
  assert.equal(oldFixture.data.change, oldChange, 'stale figure observer must restore exactly');
  assert.notEqual(newFixture.data.change, newChange, 'current figure must become observed');
  assert.equal(oldFixture.data.atlasScale.a, 1);
  assert.equal(oldFixture.parts.a._usedTextureSize, 128);
  assert.equal(oldFixture.meshes.a.material.uniforms.normalMap.value.image.width, 128);
  assert.equal(newFixture.data.atlasScale.b, 1);
  assert.equal(newFixture.parts.b._usedTextureSize, 512);
  assert.equal(newFixture.meshes.b.material.uniforms.normalMap.value.image.width, 512);
});

test('250ms core refresh polling does not retrigger coverage after owned rendering changes', async () => {
  const fixture = displayFixture({
    keys: ['a'],
    allocationSize: 512,
    sourceSize: 128,
    usedSize: 128,
    bakeSize: 512,
    atlasSize: 1024
  });
  const store = {};
  const resources = {
    getResource(url) {
      const size = Number(url.match(/_(\d+)\.webp$/)[1]);
      if (size !== 512) return Promise.reject(new Error('404'));
      store[url] = texture(url, size);
      return Promise.resolve(store[url]);
    },
    getNow(url) { return store[url] || null; },
    unregister() {}
  };
  const character = { data: fixture.data, display: fixture.display, allDisplays: {} };
  const h = harness({ character, resources });
  h.core.enabled = true;

  assert.equal(await h.api.reconcile(), true);
  const startedAt = h.api.getState().lastRun.startedAt;
  for (let i = 0; i < 8; i += 1) h.core.refresh();
  await Promise.resolve();
  await Promise.resolve();

  const state = h.api.getState();
  assert.equal(state.lastRun.startedAt, startedAt);
  assert.equal(state.busy, false);
  assert.equal(state.queued, false);
});

test('all live displays enumerate and disposal restores owned wrappers only', async () => {
  const a = displayFixture({ keys: ['a'] });
  const b = displayFixture({ keys: ['b'] });
  const aChange = a.data.change;
  const bChange = b.data.change;
  const character = { data: a.data, display: a.display, allDisplays: { child: b.display } };
  const h = harness({ character });
  assert.equal(h.api.__test.collectRows().length, 2);
  assert.notEqual(h.core.enable, h.original.enable);
  assert.notEqual(a.data.change, aChange);
  assert.notEqual(b.data.change, bChange);

  const outsideChange = function () { return 'outside'; };
  b.data.change = outsideChange;

  await h.api.dispose();
  assert.equal(h.core.enable, h.original.enable);
  assert.equal(h.core.disable, h.original.disable);
  assert.equal(a.data.change, aChange);
  assert.equal(b.data.change, outsideChange, 'outside replacement must survive disposal');
  assert.equal(h.w.KWTextureQualityAllPartPromotion, undefined);
});

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

function coreService() {
  const core = {
    enabled: false,
    busy: false,
    enable: async () => { core.enabled = true; return true; },
    disable: async () => { core.enabled = false; return true; },
    reconcile: async () => true,
    refresh: () => ({ enabled: core.enabled, busy: core.busy }),
    setPersistent: (value) => value,
    getState: () => ({ enabled: core.enabled, busy: core.busy })
  };
  return core;
}

function harness({ character = null, resources = null, settings = null } = {}) {
  const core = coreService();
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

function displayFixture({ keys = ['a'], size = 128, atlasSize = 1024, sharedSource = 'asset' } = {}) {
  const uv = {};
  const parts = {};
  const meshes = {};
  const atlasScale = {};
  keys.forEach((key, index) => {
    uv[key] = { x: (index * size) / atlasSize, y: 0, z: size / atlasSize, w: size / atlasSize };
    parts[key] = { id: index + 1, name: key, bakeSize: 512, _usedTextureSize: size };
    meshes[key] = {
      material: {
        uniforms: {
          normalMap: { value: texture(`/textures/${sharedSource}_nrml_${size}.webp`, size) }
        }
      }
    };
    atlasScale[key] = 1;
  });
  const data = { atlasScale };
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

test('optional promotion failure rolls back owned state without disabling core High Res', async () => {
  const fixture = displayFixture({ keys: ['a'], size: 128, atlasSize: 512 });
  fixture.modded.buildAtlas = () => { throw new Error('synthetic pack failure'); };
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
    settings: { textureWidthMax: 512, textureHeightMax: 512 }
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
  assert.match(h.api.getState().lastError, /synthetic pack failure/);
});

test('all live displays enumerate and disposal only removes this service wrappers', async () => {
  const a = displayFixture({ keys: ['a'] });
  const b = displayFixture({ keys: ['b'] });
  const character = { data: a.data, display: a.display, allDisplays: { child: b.display } };
  const h = harness({ character });
  assert.equal(h.api.__test.collectRows().length, 2);
  assert.notEqual(h.core.enable, h.original.enable);
  await h.api.dispose();
  assert.equal(h.core.enable, h.original.enable);
  assert.equal(h.core.disable, h.original.disable);
  assert.equal(h.w.KWTextureQualityAllPartPromotion, undefined);
});

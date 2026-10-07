const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");

const root = path.join(__dirname, "..");
const betaSource = fs.readFileSync(
  path.join(root, "beta/modules/High_Res_Phase_2.js"),
  "utf8"
);
const stablePrioritySource = execFileSync(
  "git",
  [
    "show",
    "origin/Witch_Scripts:features/rendering/Texture_Quality_Active_Decal_Priority.js"
  ],
  { cwd: root, encoding: "utf8" }
);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function makeDisplay() {
  const data = {
    atlasScale: {},
    decals: {},
    change() {}
  };
  return {
    data,
    modded: { parts: {} },
    meshes: {},
    atlas: {
      width: 4096,
      height: 4096,
      getUV() { return null; }
    },
    resourcesReady: true,
    finished: true
  };
}

function makeCore(enabled = false) {
  const listeners = new Set();
  const core = {
    version: "0.3.8",
    build: "0.3.8-supported-body-aaid-binding",
    enabled,
    busy: false,
    persistent: false,
    async enable() {
      core.enabled = true;
      core._emit();
      return true;
    },
    async disable() {
      core.enabled = false;
      core._emit();
      return true;
    },
    async reconcile() {
      core._emit();
      return true;
    },
    refresh() {
      return core.getState();
    },
    setPersistent(value) {
      core.persistent = !!value;
      return core.persistent;
    },
    getState() {
      return {
        version: core.version,
        build: core.build,
        enabled: core.enabled,
        busy: core.busy,
        persistent: core.persistent,
        autoPending: false,
        sceneSyncPending: false
      };
    },
    onChange(listener) {
      listeners.add(listener);
      listener(core.getState());
      return () => listeners.delete(listener);
    },
    _emit() {
      const snapshot = core.getState();
      for (const listener of listeners) listener(snapshot);
    }
  };
  return core;
}

function makeHarness({ enabled = false, wrongCore = false } = {}) {
  let definition = null;
  const host = {
    registerModule(value) {
      definition = value;
      return true;
    }
  };

  const display = makeDisplay();
  const core = makeCore(enabled);
  if (wrongCore) {
    core.version = "9.9.9";
    core.build = "wrong";
  }

  const window = {
    KWWitchDockBetaTester: host,
    KWTextureQualityNativeReconcile: core,
    CK: {
      Settings: {
        textureWidthMax: 4096,
        textureHeightMax: 4096
      },
      character: {
        display,
        data: display.data,
        allDisplays: {}
      }
    }
  };

  const gl = {
    MAX_TEXTURE_SIZE: 1,
    getParameter() { return 16384; },
    getExtension() {
      return { loseContext() {} };
    }
  };

  const document = {
    hidden: false,
    visibilityState: "visible",
    createElement() {
      return {
        style: {},
        getContext() { return gl; },
        appendChild() {},
        append() {}
      };
    }
  };

  const context = {
    unsafeWindow: window,
    window,
    document,
    console,
    setInterval,
    clearInterval,
    setTimeout,
    clearTimeout
  };

  if (!wrongCore) {
    vm.runInNewContext(stablePrioritySource, context);
  } else {
    let disposeCalls = 0;
    window.KWTextureQualityActiveDecalPriority = {
      version: "0.1.1",
      build: "0.1.1-dev-projected-host-lifecycle-coordination",
      dispose() {
        disposeCalls += 1;
        delete window.KWTextureQualityActiveDecalPriority;
        return true;
      },
      get disposeCalls() {
        return disposeCalls;
      }
    };
  }

  vm.runInNewContext(betaSource, context);

  return {
    window,
    core,
    get definition() {
      return definition;
    },
    replaceDisplay() {
      const next = makeDisplay();
      window.CK.character.display = next;
      window.CK.character.data = next.data;
      return next;
    }
  };
}

test("registration is inert and incompatible Stable fails closed", async () => {
  const h = makeHarness({ wrongCore: true });

  assert.equal(h.definition.id, "high-res-phase-2");
  assert.equal(h.window.KWTextureQualityActiveDecalPriority.version, "0.1.1");

  await assert.rejects(
    h.definition.activate(),
    /requires Witch Dock Stable Texture Quality/
  );

  assert.equal(h.window.KWTextureQualityActiveDecalPriority.version, "0.1.1");
  assert.equal(h.window.KWTextureQualityActiveDecalPriority.disposeCalls, 0);
  assert.equal(h.window.KWTextureQualityAllPartPromotion, undefined);
});

test("activation swaps only priority owner and OFF restores Stable in-page", async () => {
  const h = makeHarness();
  const coreIdentity = h.window.KWTextureQualityNativeReconcile;

  assert.equal(h.window.KWTextureQualityActiveDecalPriority.version, "0.1.1");
  assert.equal(await h.definition.activate(), true);

  assert.equal(h.window.KWTextureQualityNativeReconcile, coreIdentity);
  assert.equal(h.window.KWTextureQualityActiveDecalPriority.version, "0.1.2");
  assert.equal(h.window.KWTextureQualityAllPartPromotion.version, "0.1.12");

  assert.equal(await h.definition.deactivate(), true);

  assert.equal(h.window.KWTextureQualityNativeReconcile, coreIdentity);
  assert.equal(h.window.KWTextureQualityActiveDecalPriority.version, "0.1.1");
  assert.equal(
    h.window.KWTextureQualityActiveDecalPriority.build,
    "0.1.1-dev-projected-host-lifecycle-coordination"
  );
  assert.equal(h.window.KWTextureQualityAllPartPromotion, undefined);
});

test("lifecycle bridge ignores repeat emissions and repairs changed display once", async () => {
  const h = makeHarness({ enabled: true });

  assert.equal(await h.definition.activate(), true);

  const initial = h.definition.getState().lifecycleRepairCount;
  assert.equal(initial, 1);

  for (let index = 0; index < 5; index += 1) {
    h.core._emit();
  }
  await delay(160);

  assert.equal(
    h.definition.getState().lifecycleRepairCount,
    initial
  );

  h.replaceDisplay();
  h.core._emit();
  await delay(260);

  assert.equal(
    h.definition.getState().lifecycleRepairCount,
    initial + 1
  );
  assert.equal(
    h.definition.getState().lastLifecycleReason,
    "scene-display-change"
  );

  await h.definition.deactivate();
});

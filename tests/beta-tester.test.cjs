const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "../beta/Witch_Dock_Beta_Tester.user.js"),
  "utf8"
);

const SHA = "0123456789abcdef0123456789abcdef01234567";

function tick(ms = 5) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function harness({ manifest, moduleSources = {}, masterEnabled = false, stableVersion = "2.4.2" } = {}) {
  const store = new Map([["kw.betaTester.enabled.v1", masterEnabled]]);
  const requests = [];
  const reports = [];
  const providers = new Map();
  let registeredTool = null;

  const window = {
    WitchDock: {
      registerTool(def) {
        registeredTool = def;
      }
    },
    KWWitchDockStableHost: {
      getState() {
        return {
          installedWrapperVersion: stableVersion,
          resolvedLauncherVersion: stableVersion
        };
      }
    },
    KWWitchDockDiagnostics: {
      registerProvider(def) {
        providers.set(def.providerId, def);
        return true;
      },
      unregisterProvider(id) {
        return providers.delete(id);
      },
      getProviderInventory() {
        return Array.from(providers.values()).map((def) => ({ providerId: def.providerId }));
      },
      async captureAndDownload(options) {
        return { ok: true, options };
      }
    },
    KWWitchDockBugReporter: {
      open(context) {
        reports.push(context);
        return context;
      }
    }
  };

  function respond(url) {
    requests.push(url);
    const parsed = new URL(url);
    if (parsed.pathname === "/beta/manifest.json") {
      return JSON.stringify(manifest || {
        schemaVersion: 1,
        channel: "public-beta",
        revision: 1,
        minimumStableVersion: "2.4.2",
        reporting: {
          productId: "witch-dock",
          groupId: "wd-beta-qa",
          featureId: "public-beta-testing",
          diagnosticProviderId: "beta-tester"
        },
        modules: []
      });
    }
    const match = parsed.pathname.match(/^\/payloads\/([0-9a-f]{40})\/(.+)$/i);
    if (match) {
      const key = match[1] + "/" + match[2];
      if (Object.prototype.hasOwnProperty.call(moduleSources, key)) return moduleSources[key];
      throw new Error("missing module source: " + key);
    }
    throw new Error("unexpected request: " + url);
  }

  const context = {
    unsafeWindow: window,
    window,
    URL,
    console,
    setTimeout,
    clearTimeout,
    Promise,
    Date,
    Object,
    Array,
    Map,
    Set,
    JSON,
    Number,
    String,
    Boolean,
    RegExp,
    Error,
    GM_getValue(key, fallback) {
      return store.has(key) ? store.get(key) : fallback;
    },
    GM_setValue(key, value) {
      store.set(key, value);
    },
    GM_xmlhttpRequest(options) {
      setTimeout(() => {
        try {
          const text = respond(options.url);
          options.onload({ status: 200, responseText: text });
        } catch (error) {
          options.onerror(error);
        }
      }, 0);
    },
    document: {}
  };

  vm.runInNewContext(source, context, { filename: "Witch_Dock_Beta_Tester.user.js" });

  return {
    window,
    store,
    requests,
    reports,
    providers,
    get registeredTool() { return registeredTool; }
  };
}

function moduleSource(id, version, build, body = "") {
  return `
unsafeWindow.KWWitchDockBetaTester.registerModule({
  id: ${JSON.stringify(id)},
  version: ${JSON.stringify(version)},
  build: ${JSON.stringify(build)},
  activate: async function () {
    unsafeWindow.__betaActivations = (unsafeWindow.__betaActivations || 0) + 1;
    ${body}
    return true;
  },
  deactivate: async function () {
    unsafeWindow.__betaDeactivations = (unsafeWindow.__betaDeactivations || 0) + 1;
    return true;
  },
  getState: function () {
    return { activeMarker: unsafeWindow.__betaActivations || 0 };
  }
});
`;
}

test("empty beta manifest layers onto Stable without changing Stable startup", async () => {
  const h = harness();
  await tick(20);

  const state = h.window.KWWitchDockBetaTester.getState();
  assert.equal(state.status, "ready");
  assert.equal(state.enabled, false);
  assert.equal(state.hostReady, true);
  assert.equal(state.stableVersion, "2.4.2");
  assert.equal(state.manifestRevision, 1);
  assert.equal(state.moduleCount, 0);
  assert.equal(state.activeCount, 0);
  assert.equal(h.registeredTool.id, "beta-tester");
  assert.equal(h.registeredTool.tab, "Utilities");
  assert.ok(h.providers.has("beta-tester"));
});

test("active module is fetched only from immutable payload and deactivates live with master OFF", async () => {
  const manifest = {
    schemaVersion: 1,
    channel: "public-beta",
    revision: 4,
    minimumStableVersion: "2.4.2",
    reporting: {
      productId: "witch-dock",
      groupId: "wd-beta-qa",
      featureId: "public-beta-testing",
      diagnosticProviderId: "beta-tester"
    },
    modules: [{
      id: "example-beta",
      title: "Example Beta",
      version: "0.1.0",
      build: "0.1.0-beta",
      status: "active",
      defaultEnabled: true,
      payloadRef: SHA,
      path: "features/example/Example_Beta.js",
      diagnosticProviderIds: []
    }]
  };
  const key = SHA + "/features/example/Example_Beta.js";
  const h = harness({
    manifest,
    masterEnabled: true,
    moduleSources: { [key]: moduleSource("example-beta", "0.1.0", "0.1.0-beta") }
  });
  await tick(30);

  let state = h.window.KWWitchDockBetaTester.getState();
  assert.equal(state.activeCount, 1);
  assert.equal(state.modules[0].active, true);
  assert.equal(h.window.__betaActivations, 1);
  assert.ok(h.requests.some((url) => url.includes("/payloads/" + SHA + "/features/example/Example_Beta.js")));
  assert.equal(h.requests.some((url) => /github|WITCH_DEV_MAIN/i.test(url)), false);

  assert.equal(await h.window.KWWitchDockBetaTester.setEnabled(false), true);
  state = h.window.KWWitchDockBetaTester.getState();
  assert.equal(state.enabled, false);
  assert.equal(state.activeCount, 0);
  assert.equal(state.modules[0].active, false);
  assert.equal(h.window.__betaDeactivations, 1);
});

test("manifest refuses moving beta module refs before executing module code", async () => {
  const manifest = {
    schemaVersion: 1,
    channel: "public-beta",
    revision: 2,
    minimumStableVersion: "2.4.2",
    reporting: {},
    modules: [{
      id: "bad-beta",
      title: "Bad Beta",
      version: "0.1.0",
      build: "0.1.0-beta",
      status: "active",
      payloadRef: "WITCH_DEV_MAIN",
      path: "features/bad.js"
    }]
  };
  const h = harness({ manifest, masterEnabled: true });
  await tick(20);

  const state = h.window.KWWitchDockBetaTester.getState();
  assert.equal(state.status, "manifest-error");
  assert.match(state.manifestError, /immutable payload SHA/);
  assert.equal(state.activeCount, 0);
  assert.equal(h.requests.filter((url) => url.includes("/payloads/")).length, 0);
});

test("module registration identity must match manifest version and build", async () => {
  const manifest = {
    schemaVersion: 1,
    channel: "public-beta",
    revision: 3,
    minimumStableVersion: "2.4.2",
    reporting: {},
    modules: [{
      id: "identity-beta",
      title: "Identity Beta",
      version: "0.2.0",
      build: "0.2.0-beta",
      status: "active",
      payloadRef: SHA,
      path: "features/identity.js"
    }]
  };
  const key = SHA + "/features/identity.js";
  const h = harness({
    manifest,
    masterEnabled: true,
    moduleSources: { [key]: moduleSource("identity-beta", "0.1.0", "0.1.0-wrong") }
  });
  await tick(30);

  const state = h.window.KWWitchDockBetaTester.getState();
  assert.equal(state.activeCount, 0);
  assert.equal(state.modules[0].status, "error");
  assert.match(state.modules[0].error, /identity did not match/);
});

test("reload-required module does not pretend it was disabled live", async () => {
  const manifest = {
    schemaVersion: 1,
    channel: "public-beta",
    revision: 5,
    minimumStableVersion: "2.4.2",
    reporting: {},
    modules: [{
      id: "reload-beta",
      title: "Reload Beta",
      version: "0.1.0",
      build: "0.1.0-beta",
      status: "active",
      defaultEnabled: true,
      requiresReloadToDisable: true,
      payloadRef: SHA,
      path: "features/reload.js"
    }]
  };
  const key = SHA + "/features/reload.js";
  const h = harness({
    manifest,
    masterEnabled: true,
    moduleSources: { [key]: moduleSource("reload-beta", "0.1.0", "0.1.0-beta") }
  });
  await tick(30);

  assert.equal(await h.window.KWWitchDockBetaTester.setModuleEnabled("reload-beta", false), false);
  const state = h.window.KWWitchDockBetaTester.getState();
  assert.equal(state.modules[0].active, true);
  assert.equal(state.modules[0].status, "reload-required");
  assert.match(state.modules[0].error, /requires a Hero Forge reload/);
});

test("minimum Stable version blocks incompatible beta activation", async () => {
  const manifest = {
    schemaVersion: 1,
    channel: "public-beta",
    revision: 6,
    minimumStableVersion: "2.5.0",
    reporting: {},
    modules: [{
      id: "future-beta",
      title: "Future Beta",
      version: "0.1.0",
      build: "0.1.0-beta",
      status: "active",
      payloadRef: SHA,
      path: "features/future.js"
    }]
  };
  const h = harness({ manifest, masterEnabled: true, stableVersion: "2.4.2" });
  await tick(20);

  const state = h.window.KWWitchDockBetaTester.getState();
  assert.equal(state.activeCount, 0);
  assert.equal(state.modules[0].status, "incompatible-stable");
  assert.match(state.modules[0].error, /Requires Witch Dock Stable v2\.5\.0/);
  assert.equal(h.requests.filter((url) => url.includes("/payloads/")).length, 0);
});

test("Beta bug context remains distinct and requests targeted local diagnostics", async () => {
  const h = harness();
  await tick(20);

  assert.equal(h.window.KWWitchDockBetaTester.reportBetaBug({
    id: "sample-beta",
    diagnosticProviderIds: ["sample-provider"],
    reporting: { featureId: "public-beta-testing" }
  }), true);

  assert.equal(h.reports.length, 1);
  assert.equal(h.reports[0].groupId, "wd-beta-qa");
  assert.equal(h.reports[0].featureId, "public-beta-testing");
  assert.equal(h.reports[0].toolId, "beta-tester:sample-beta");
  assert.deepEqual(Array.from(h.reports[0].diagnosticProviderIds), ["beta-tester", "sample-provider"]);
  assert.equal(h.reports[0].scopeHint, "witch-dock-beta");
});

test("beta diagnostic provider reports bounded state, not module source bytes", async () => {
  const h = harness();
  await tick(20);
  const provider = h.providers.get("beta-tester");
  assert.ok(provider);
  const result = await provider.capture();
  assert.equal(result.coverage[0].status, "captured");
  assert.equal(result.coverage[1].status, "captured");
  assert.equal(JSON.stringify(result).includes("function activate"), false);
  assert.equal(result.summary.moduleCount, 0);
});

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const corePath = path.join(root, "features/diagnostics/Witch_Dock_Diagnostics_Core.js");

function makeRuntime() {
  const listeners = new Map();
  const document = {
    visibilityState: "visible",
    readyState: "complete",
    addEventListener(type, fn) { listeners.set("document:" + type, fn); },
    createElement() { return { click() {}, remove() {} }; },
    body: { appendChild() {} }
  };
  const window = {
    addEventListener(type, fn) { listeners.set("window:" + type, fn); },
    innerWidth: 1280,
    innerHeight: 720,
    devicePixelRatio: 1,
    CK: null,
    HF: null
  };
  Object.assign(window, {
    window,
    unsafeWindow: window,
    document,
    location: { href: "https://www.heroforge.com/", origin: "https://www.heroforge.com", pathname: "/", search: "" },
    navigator: { userAgent: "test", platform: "test", hardwareConcurrency: 4, deviceMemory: 8, onLine: true },
    URL,
    URLSearchParams,
    TextEncoder,
    Uint8Array,
    Blob,
    console,
    setTimeout,
    clearTimeout
  });
  return vm.createContext(window);
}

test("large provider sections cannot starve later addressable evidence", async () => {
  const context = makeRuntime();
  vm.runInContext(fs.readFileSync(corePath, "utf8"), context, { filename: corePath });

  const hugeMaterials = Array.from({ length: 6000 }, (_, index) => ({
    mesh: "mesh-" + index,
    bindings: { aaidMap: { ready: true, size: [2048, 2048] } }
  }));

  context.KWWitchDockDiagnostics.registerProvider({
    providerId: "budget-test",
    providerSchemaVersion: 1,
    version: "1.0.0",
    build: "1.0.0-test",
    modes: ["snapshot"],
    capture() {
      return {
        summary: { analysisStatus: "not-analyzed" },
        sections: {
          materials: hugeMaterials,
          resources: [{ role: "aaid", size: [2048, 2048], ready: true }],
          state: { nested: { decision: "runtime-evidence" }, token: "must-not-escape" },
          verification: { restored: true }
        },
        coverage: [],
        warnings: [],
        events: []
      };
    }
  });

  const result = await context.KWWitchDockDiagnostics.captureCurrent({
    captureMode: "snapshot",
    providerIds: ["budget-test"]
  });

  assert.equal(result.ok, true);
  const materials = context.KWWitchDockDiagnostics.getLatestSection("budget-test", "materials");
  const resources = context.KWWitchDockDiagnostics.getLatestSection("budget-test", "resources");
  const state = context.KWWitchDockDiagnostics.getLatestSection("budget-test", "state");
  const verification = context.KWWitchDockDiagnostics.getLatestSection("budget-test", "verification");

  assert.match(JSON.stringify(materials), /node-limit/);
  assert.equal(JSON.stringify(resources), JSON.stringify([{ ready: true, role: "aaid", size: [2048, 2048] }]));
  assert.equal(state.nested.decision, "runtime-evidence");
  assert.equal(Object.hasOwn(state, "token"), false);
  assert.equal(verification.restored, true);
});

test("diagnostics core manifest identity matches source", () => {
  const source = fs.readFileSync(corePath, "utf8");
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
  const entry = manifest.moduleRegistry.find((row) => row.id === "witch-dock-diagnostics-core");
  assert.ok(entry);
  assert.match(source, new RegExp(`const VERSION = ["']${entry.version.replace(/\./g, "\\.")}["']`));
  assert.match(source, new RegExp(`const BUILD = ["']${entry.build}["']`));
  assert.match(manifest.modules.find((row) => row.id === entry.id).url, new RegExp(entry.build + "$"));
});

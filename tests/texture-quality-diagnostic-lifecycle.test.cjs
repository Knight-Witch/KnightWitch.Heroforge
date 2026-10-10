const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const nativeSource = fs.readFileSync(
  path.join(root, "features/rendering/Texture_Quality_Native_Reconcile.js"),
  "utf8"
);
const captureSource = fs.readFileSync(
  path.join(root, "features/rendering/Texture_Quality_Diagnostics.js"),
  "utf8"
);
const providerSource = fs.readFileSync(
  path.join(root, "features/diagnostics/Texture_Quality_Diagnostic_Provider.js"),
  "utf8"
);
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));

function nativeHarness() {
  const storage = new Map();
  const context = {
    console: { warn() {}, error() {}, log() {} },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    document: {
      hidden: false,
      visibilityState: "visible",
      addEventListener() {},
      removeEventListener() {},
    },
    localStorage: {
      getItem(key) { return storage.has(key) ? storage.get(key) : null; },
      setItem(key, value) { storage.set(key, String(value)); },
    },
  };
  context.window = context;
  context.unsafeWindow = context;
  vm.runInNewContext(nativeSource, context, { filename: "Texture_Quality_Native_Reconcile.js" });
  return context.KWTextureQualityNativeReconcile;
}

test("native High Res failures retain bounded pre-cleanup before/failure/after evidence", async () => {
  const service = nativeHarness();
  assert.equal(service.version, "0.5.0");
  assert.equal(await service.enable(), false, "missing renderer should take the supported failure path");

  const retained = service.getRetainedFailureContext();
  assert.equal(retained.available, true);
  assert.equal(retained.semantics.analysisStatus, "not-analyzed");
  assert.equal(retained.records.length, 1);
  assert.equal(retained.records[0].outcome, "failed");
  assert.equal(retained.records[0].before.phase, "before");
  assert.equal(retained.records[0].failure.state.phase, "failure-pre-cleanup");
  assert.equal(retained.records[0].after.phase, "after");
  assert.equal(retained.records[0].failure.code, "HR_ENABLE_FAILED");

  const lifecycle = service.getDiagnosticLifecycle();
  assert.equal(lifecycle.recentAttempts.length, 1);
  assert.equal(lifecycle.recentAttempts[0].failure.message, "HeroForge renderer is not ready.");
});

test("failure context is captured before enable cleanup/restoration can erase it", () => {
  const enableStart = nativeSource.indexOf("  async function enable(options = {})");
  const disableStart = nativeSource.indexOf("  async function disable()", enableStart);
  const enableBlock = nativeSource.slice(enableStart, disableStart);
  const failureIndex = enableBlock.indexOf("failDiagnosticAttempt(diagnosticAttempt, error");
  const restoreIndex = enableBlock.indexOf("restoreSession(s, diagnosticAttempt)");
  assert.ok(failureIndex >= 0 && restoreIndex > failureIndex);

  const restoreVerification = nativeSource.indexOf("lastRestoreVerification = verification;");
  const restoreThrow = nativeSource.indexOf("if (!verification.ok) throw new Error(verification.reason);", restoreVerification);
  assert.ok(restoreVerification >= 0 && restoreThrow > restoreVerification);
});

test("generic Texture Quality provider exports lifecycle evidence without calling it analysis", () => {
  let definition = null;
  const failureContext = {
    semantics: {
      evidenceType: "retained-pre-cleanup-runtime-evidence",
      analysisStatus: "not-analyzed",
      causalityClaimed: false,
    },
    available: true,
    count: 1,
    records: [{
      attemptId: "tq-test-1",
      operation: "disable-restore",
      failure: { code: "HR_MASK_BINDING_VERIFY_FAILED", phase: "restore-verification-complete" },
    }],
  };
  const lifecycle = {
    semantics: { evidenceType: "observational-runtime-evidence", analysisStatus: "not-analyzed" },
    active: null,
    recentAttempts: [{ attemptId: "tq-test-1", before: {}, during: [], failure: {}, after: {} }],
  };
  const latest = {
    figures: [{ figureId: "primary" }],
    paintState: [], atlas: [], materials: [], colorBake: [],
    resources: [{ roles: ["material:aaidMap"], size: [1, 1] }],
    verification: {}, warnings: [{ code: "HR_MASK_BINDING_VERIFY_FAILED" }], events: [],
    summary: {}, lifecycle, failureContext,
  };
  const native = {
    getDiagnosticState() { return { enabled: false, busy: false, persistent: false }; },
    getDiagnosticLifecycle() { return lifecycle; },
    getRetainedFailureContext() { return failureContext; },
  };
  const diagnostic = {
    version: "0.2.0",
    build: "0.2.0-retained-lifecycle-evidence",
    captureCurrent() { return { ok: true, captureId: "hrd-test" }; },
    getLatestSection(name) { return latest[name] ?? null; },
    getState() { return { operationBusy: false }; },
    compareNativeOffToHighRes() { return { ok: true, status: "started" }; },
  };
  const context = {
    window: null,
    unsafeWindow: null,
    setInterval() { return 1; },
    clearInterval() {},
    KWTextureQualityNativeReconcile: native,
    KWTextureQualityDiagnostics: diagnostic,
    KWWitchDockDiagnostics: {
      registerProvider(value) { definition = value; },
      unregisterProvider() {},
    },
  };
  context.window = context;
  context.unsafeWindow = context;
  vm.runInNewContext(providerSource, context, { filename: "Texture_Quality_Diagnostic_Provider.js" });
  assert.ok(definition);

  const frozen = definition.freeze();
  const result = definition.capture({}, frozen);
  assert.equal(result.summary.retainedFailureContextAvailable, true);
  assert.equal(result.summary.retainedFailureCount, 1);
  assert.equal(result.summary.aaidFallback1x1Count, 1);
  assert.equal(result.summary.analysisStatus, "not-analyzed");
  assert.equal(result.summary.causalityClaimed, false);
  assert.deepEqual(result.sections.lifecycle, lifecycle);
  assert.deepEqual(result.sections["failure-context"], failureContext);
  assert.equal(
    result.coverage.find((row) => row.sectionName === "failure-context").status,
    "captured-bounded"
  );
});

test("module versions and standalone High Res sections stay synchronized", () => {
  const byId = Object.fromEntries(manifest.moduleRegistry.map((entry) => [entry.id, entry]));
  assert.equal(byId["texture-quality-native-reconcile"].version, "0.5.0");
  assert.equal(byId["texture-quality-native-reconcile"].build, "0.5.0-retained-diagnostic-lifecycle");
  assert.equal(byId["texture-quality-diagnostics"].version, "0.2.0");
  assert.equal(byId["texture-quality-diagnostic-provider"].version, "0.2.0");
  assert.match(captureSource, /'lifecycle', 'failureContext'/);
  assert.match(captureSource, /analysisStatus: 'not-analyzed'/);
  assert.match(providerSource, /retainedFailureContext: true/);
});

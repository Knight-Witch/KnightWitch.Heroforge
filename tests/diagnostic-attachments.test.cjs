const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const code = fs.readFileSync(path.join(__dirname, "../features/diagnostics/Witch_Dock_Bug_Capture_UI.js"), "utf8");
const start = code.indexOf("  function addFile(file, options) {");
const end = code.indexOf("  async function captureHeroForge2K()", start);
assert.ok(start >= 0 && end > start, "must test the real reporter attachment routine");
const source = code.slice(start, end);
const make = new Function("state", "render",
  "const uuid = () => 'test-id'; const nowIso = () => '2026-10-10T10:00:00Z'; " +
  source + ";return addFile;");
async function attach(payload, opts = {}, fileOverride = {}) {
  const state = { evidence: [], message: "" };
  const file = {
    name: "sample.json", type: "application/json", size: 128,
    text: () => Promise.resolve(JSON.stringify(payload)),
    ...fileOverride,
  };
  make(state, () => {})(file, opts);
  await new Promise((resolve) => setImmediate(resolve));
  return state;
}
test("manual current envelope is a diagnostic attachment", async () => {
  const result = await attach({ diagnosticContractVersion: 1, captureId: "cap-1" },
    { expectDiagnostic: true });
  assert.equal(result.evidence[0].kind, "diagnostic-json");
});
test("standalone High Res snapshot and comparison retain original payload and kind", async () => {
  for (const mode of ["snapshot", "comparison"]) {
    const original = {
      format: "witch-dock.hr-diagnostic", schemaVersion: 1,
      ...(mode === "comparison" ? { kind: "comparison" } : {}),
      metadata: mode === "comparison" ? { comparisonId: "hrc-1" } : { captureId: "hrd-1" },
      summary: { highResEnabled: true },
    };
    const result = await attach(original, { expectDiagnostic: true });
    assert.equal(result.evidence[0].kind, "diagnostic-json");
    assert.deepEqual(result.evidence[0].diagnosticPayload, original);
    assert.match(result.evidence[0].evidenceNote, /server normalization/);
  }
});
test("unsupported diagnostics and invalid JSON warn and are kept as non-indexed raw evidence", async () => {
  const unsupported = await attach({ format: "future-provider", schemaVersion: 99 },
    { expectDiagnostic: true });
  assert.equal(unsupported.evidence[0].kind, "figure-json");
  assert.match(unsupported.evidence[0].evidenceWarning, /NOT indexed/);
  assert.match(unsupported.message, /Unsupported/);
  const invalid = await attach(null, { expectDiagnostic: true },
    { text: () => Promise.resolve("{broken") });
  assert.equal(invalid.evidence[0].kind, "figure-json");
  assert.match(invalid.evidence[0].evidenceWarning, /Invalid JSON/);
  const unreadable = await attach(null, { expectDiagnostic: true },
    { text: () => Promise.reject(new Error("read failure")) });
  assert.equal(unreadable.evidence[0].kind, "figure-json");
  assert.match(unreadable.evidence[0].evidenceWarning, /could not be read/);
});
test("figure JSON remains figure evidence; forced affected-save classification is preserved", async () => {
  const figure = await attach({ character: {} });
  assert.equal(figure.evidence[0].kind, "figure-json");
  const forced = await attach({ diagnosticContractVersion: 1, captureId: "cap-1" },
    { forceKind: "figure-json" });
  assert.equal(forced.evidence[0].kind, "figure-json");
});
test("diagnostic picker explicitly distinguishes unsupported files in the diagnostic list", () => {
  assert.match(code, /addFile\(file, \{ expectDiagnostic: true \}\)/);
  assert.match(code, /row\.item\.manualDiagnostic/);
  assert.match(code, /WARNING:/);
});

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(
  path.join(__dirname, "../features/diagnostics/Witch_Dock_Bug_Capture_UI.js"),
  "utf8"
);

test("contextual diagnostic provider IDs remain local to reporter state", () => {
  assert.match(
    source,
    /state = makeEmptyState\(sourceContext, \{ diagnosticProviderIds: rawContext\.diagnosticProviderIds \}\);/
  );
  const makeSourceStart = source.indexOf("function makeSourceContext");
  const makeSourceEnd = source.indexOf("function createOverlay", makeSourceStart);
  assert.ok(makeSourceStart >= 0 && makeSourceEnd > makeSourceStart);
  const makeSource = source.slice(makeSourceStart, makeSourceEnd);
  assert.equal(
    makeSource.includes("diagnosticProviderIds"),
    false,
    "local diagnostic provider selection must not become submitted HF.Status sourceContext"
  );
});

test("contextual provider IDs participate in original and current diagnostic capture", () => {
  const occurrences = source.match(/providerIdsFor\(state\.classification, state\.diagnosticProviderIds\)/g) || [];
  assert.equal(occurrences.length, 3);
  assert.match(source, /diagnosticProviderIds: sanitizeProviderIds\(local\.diagnosticProviderIds\)/);
});

test("contextual provider IDs are slug-sanitized and bounded", () => {
  assert.match(source, /\^\[a-z0-9\]\[a-z0-9-\]\*\$/);
  assert.match(source, /if \(out\.length >= 20\) break;/);
});

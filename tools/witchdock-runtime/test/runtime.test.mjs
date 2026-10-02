import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

const base = "https://witchdock.knightwitch.dev";
const cases = [
  ["2000-kitbash-parts.user.js", "2000_kitbash_parts-0.4.user.js"],
  ["advanced-decal-posing.user.js", "Advanced_Decal_Posing-0.2.user.js"],
  ["camera-control-modifier.user.js", "Camera_Control_Modifier-2025-03-19.user.js"],
  ["full-res-decals.user.js", "FullResDecals.user.js"],
  ["hf-core-tweaks.user.js", "HF%20Core%20Tweaks.user.js"],
  ["extra-slots.user.js", "I_love_extra_slots-0.2.user.js"],
  ["photo-booth-shader-fix.user.js", "Shader_Fix_for_Photo_Booth-2025-03-20.user.js"],
];

test("health contract is unchanged", async () => {
  const response = await worker.fetch(new Request(`${base}/health`));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    service: "witchdock-runtime",
    primary: "github",
    recovery: "bitbucket",
    contract: "provider-independent",
  });
});

test("HFJSON root temporarily redirects to Lob GitGud", async () => {
  const response = await worker.fetch(new Request(`${base}/HFJSON/`));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "https://gitgud.io/GasStationTweaker/hf-scripts-public");
  assert.equal(response.headers.get("cache-control"), "no-store");
});

for (const [alias, upstreamFile] of cases) {
  test(`HFJSON ${alias} redirects to the current upstream script`, async () => {
    const response = await worker.fetch(new Request(`${base}/HFJSON/${alias}`), { redirect: "manual" });
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), `https://gitgud.io/GasStationTweaker/hf-scripts-public/-/raw/master/${upstreamFile}`);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-witchdock-origin"), "hfjson-gitgud");
  });
}

test("HFJSON aliases are case-insensitive and support HEAD", async () => {
  const response = await worker.fetch(new Request(`${base}/hfjson/FULL-RES-DECALS.USER.JS`, { method: "HEAD" }));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "https://gitgud.io/GasStationTweaker/hf-scripts-public/-/raw/master/FullResDecals.user.js");
  assert.equal(await response.text(), "");
});

test("unknown HFJSON aliases do not fall through into Witch Dock payload delivery", async () => {
  const response = await worker.fetch(new Request(`${base}/HFJSON/not-a-script.user.js`));
  assert.equal(response.status, 404);
});

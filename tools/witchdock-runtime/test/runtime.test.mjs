import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

const base = "https://witchdock.knightwitch.dev";
const cases = [
  ["2000-kitbash-parts.user.js", "https://gitgud.io/GasStationTweaker/hf-scripts-public/-/raw/master/2000_kitbash_parts-0.4.user.js?ref_type=heads&inline=false", "hfjson-gitgud"],
  ["advanced-decal-posing.user.js", "https://gitgud.io/GasStationTweaker/hf-scripts-public/-/raw/master/Advanced_Decal_Posing-0.2.user.js?ref_type=heads&inline=false", "hfjson-gitgud"],
  ["camera-control-modifier.user.js", "https://gitgud.io/GasStationTweaker/hf-scripts-public/-/raw/master/Camera_Control_Modifier-2025-03-19.user.js?ref_type=heads&inline=false", "hfjson-gitgud"],
  ["full-res-decals.user.js", "https://gitgud.io/GasStationTweaker/hf-scripts-public/-/raw/master/FullResDecals.user.js?ref_type=heads&inline=false", "hfjson-gitgud"],
  ["hf-core-tweaks.user.js", "https://gitgud.io/GasStationTweaker/hf-scripts-public/-/raw/master/HF%20Core%20Tweaks.user.js?ref_type=heads&inline=false", "hfjson-gitgud"],
  ["extra-slots.user.js", "https://gitgud.io/GasStationTweaker/hf-scripts-public/-/raw/master/I_love_extra_slots-0.2.user.js", "hfjson-gitgud"],
  ["photo-booth-shader-fix.user.js", "https://gitgud.io/GasStationTweaker/hf-scripts-public/-/raw/master/Shader_Fix_for_Photo_Booth-2025-03-20.user.js", "hfjson-gitgud"],
  ["reck-for-hero-forge.user.js", "https://github.com/arm32x/hero-forge-reck/releases/latest/download/hero-forge-reck.user.js", "hfjson-github"],
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

test("public beta ref resolves canonical WITCH_DEV_MAIN", async () => {
  const originalFetch = globalThis.fetch;
  const sha = "1111111111111111111111111111111111111111";
  globalThis.fetch = async (url) => {
    assert.equal(
      String(url),
      "https://api.github.com/repos/Knight-Witch/KnightWitch.Heroforge/git/ref/heads/WITCH_DEV_MAIN"
    );
    return new Response(JSON.stringify({
      ref: "refs/heads/WITCH_DEV_MAIN",
      object: { sha, type: "commit" }
    }), { status: 200, headers: { "content-type": "application/json" } });
  };
  try {
    const response = await worker.fetch(new Request(`${base}/beta/ref.json`));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.object.sha, sha);
    assert.equal(body.ref, "refs/heads/WITCH_DEV_MAIN");
    assert.equal(response.headers.get("cache-control"), "no-cache, max-age=0");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("public beta content is projected from the beta directory on canonical Dev", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.equal(
      String(url),
      "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_MAIN/beta/manifest.json"
    );
    return new Response('{"schemaVersion":1}', {
      status: 200,
      headers: { "content-type": "application/json; charset=utf-8", etag: '"beta-test"' }
    });
  };
  try {
    const response = await worker.fetch(new Request(`${base}/beta/manifest.json`));
    assert.equal(response.status, 200);
    assert.equal(await response.text(), '{"schemaVersion":1}');
    assert.equal(response.headers.get("x-witchdock-origin"), "github");
    assert.equal(response.headers.get("cache-control"), "no-cache, max-age=0");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("HFJSON root temporarily redirects to Lob GitGud", async () => {
  const response = await worker.fetch(new Request(`${base}/HFJSON/`));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "https://gitgud.io/GasStationTweaker/hf-scripts-public");
  assert.equal(response.headers.get("cache-control"), "no-store");
});

for (const [alias, upstreamUrl, expectedOrigin] of cases) {
  test(`HFJSON ${alias} redirects to the current upstream script`, async () => {
    const response = await worker.fetch(new Request(`${base}/HFJSON/${alias}`), { redirect: "manual" });
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), upstreamUrl);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-witchdock-origin"), expectedOrigin);
  });
}

test("HFJSON aliases are case-insensitive and support HEAD", async () => {
  const response = await worker.fetch(new Request(`${base}/hfjson/FULL-RES-DECALS.USER.JS`, { method: "HEAD" }));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "https://gitgud.io/GasStationTweaker/hf-scripts-public/-/raw/master/FullResDecals.user.js?ref_type=heads&inline=false");
  assert.equal(await response.text(), "");
});

test("unknown HFJSON aliases do not fall through into Witch Dock payload delivery", async () => {
  const response = await worker.fetch(new Request(`${base}/HFJSON/not-a-script.user.js`));
  assert.equal(response.status, 404);
});

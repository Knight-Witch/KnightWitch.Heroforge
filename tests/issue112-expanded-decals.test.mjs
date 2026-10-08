import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const slotsScript = readFileSync(new URL("../HeroForge_UI/Expanded_Decal_Slots.js", import.meta.url), "utf8");
const bridgeScript = readFileSync(new URL("../HeroForge_UI/HF_UI_Slot_Bridge.js", import.meta.url), "utf8");

function fixture({ coreTweaks = false, compatible = true } = {}) {
  const layers = {
    1: { label: coreTweaks ? "Splatter 1" : "splatter", name: "splatter", sources: [["*", "pattern"]], mapping: 1 },
    2: { label: coreTweaks ? "A" : "projected a", name: "projecteda", sources: [["*", "image"]], mapping: 2 },
    3: { label: "b", name: "b", sources: [["*", "image"]], mapping: 3 }
  };
  if (coreTweaks) layers[0] = { name: "splatterzero", label: "Splatter 0", sources: [], mapping: 0 };
  if (!compatible) layers[2].sources = null;
  const main = { id: 21022, _decals: layers, get decals() { return this._decals; } };
  if (coreTweaks) main.displayFilename = "KOMIKA.ttf";
  const body = { id: 100, _decals: { 1: { label: "Layer A", name: "A", sources: [], mapping: 1 } }, get decals() { return this._decals; } };
  const parts = { 21022: main, 100: body };
  const UW = { CK: { Options: { parts, partsBySlot: { bodyUpper: [{ id: 100 }], bodyLower: [], face: [] } } }, KW_HeroForgeUI: {} };
  const context = vm.createContext({ window: UW, unsafeWindow: UW, setTimeout() {} });
  vm.runInContext(slotsScript, context);
  return { UW, body, main, state: UW.KW_HeroForgeUI.expandedDecalSlots };
}

test("native 2026 decal backing expands without stale Core Tweaks signature", () => {
  const { body, main, state } = fixture();
  assert.equal(state.applied, true);
  assert.equal(state.sourceMode, "native");
  assert.equal(state.target, 96);
  assert.equal(body.decals[96].mapping, 96);
  assert.equal(main.decals[97].mapping, 97);
  assert.equal(main.decals[0], undefined, "must not invent Core Tweaks-only splatter zero");
});

test("legacy Core Tweaks path and existing zero-slot are preserved", () => {
  const { main, state } = fixture({ coreTweaks: true });
  assert.equal(state.applied, true);
  assert.equal(state.sourceMode, "core-tweaks");
  assert.equal(main.decals[0].name, "splatterzero");
  assert.equal(main.decals[97].mapping, 97);
});

test("unknown decal mapping refuses mutation", () => {
  const { body, state } = fixture({ compatible: false });
  assert.equal(state.applied, false);
  assert.equal(state.status, "waiting");
  assert.equal(body.decals[96], undefined);
});

test("slot bridge fetches child from immutable channel payload", async () => {
  const payload = "https://witchdock.knightwitch.dev/payloads/".concat("a".repeat(40), "/");
  const fetches = [];
  const UW = {
    KWWitchDockPayloadRoot: payload,
    KW_HeroForgeUI: {},
    localStorage: { getItem() { return null; } }
  };
  const context = vm.createContext({
    unsafeWindow: UW, window: UW,
    fetch(url) {
      fetches.push(url);
      return Promise.resolve({ ok: true, text: () => Promise.resolve("") });
    },
    Function: () => () => UW
  });
  vm.runInContext(bridgeScript, context);
  await Promise.resolve();
  await Promise.resolve();
  assert.deepEqual(fetches, [payload + "HeroForge_UI/Expanded_Decal_Slots.js"]);
});

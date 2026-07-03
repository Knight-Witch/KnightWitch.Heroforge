(function () {
  "use strict";

  const UW = globalThis["unsafe" + "Window"] || window;
  const TARGET = 96;
  const EGGS = [3139, 20091];
  const LABELS = Array.from({ length: TARGET }, (_, i) => i < 26 ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[i] : String(i - 25));
  const STATE = {
    applied: false,
    tries: 0,
    maxTries: 80,
    delayMs: 250
  };

  function getCK() {
    return UW && UW.CK ? UW.CK : null;
  }

  function getOptions() {
    const CK = getCK();
    return CK && CK.Options ? CK.Options : null;
  }

  function getPart(id) {
    const options = getOptions();
    return options && options.parts ? options.parts[id] : null;
  }

  function hasCoreTweaksSignature() {
    const part = getPart(21022);
    const decals = part && part.decals;
    if (!part || !decals) return false;
    if (part.displayFilename !== "KOMIKA.ttf") return false;
    if (!decals[0] || !decals[1] || !decals[2]) return false;
    if (decals[0].name !== "splatterzero") return false;
    if (decals[0].label !== "Splatter 0") return false;
    if (decals[1].label !== "Splatter 1") return false;
    return true;
  }

  function cloneDecal(source) {
    if (!source || typeof source !== "object") return null;
    return Object.assign({}, source);
  }

  function ensureDecal(item, index, sourceIndex, label) {
    if (!item || !item.decals) return;
    if (!item.decals[index]) {
      const source = cloneDecal(item.decals[sourceIndex]);
      if (!source) return;
      item.decals[index] = source;
    }
    item.decals[index].label = label;
    item.decals[index].name = label;
    item.decals[index].mapping = index;
  }

  function expandSlot(slotName) {
    const options = getOptions();
    const slot = options && options.partsBySlot ? options.partsBySlot[slotName] : null;
    const entries = Array.isArray(slot) ? slot : Object.values(slot || {});
    if (!entries.length) return;

    for (const entry of entries) {
      const item = entry && getPart(entry.id);
      if (!item || !item.decals) continue;

      for (let i = 1; i <= TARGET; i += 1) {
        ensureDecal(item, i, 1, LABELS[i - 1]);
      }

      if (item.decals[1]) {
        item.decals[1].label = "A";
        item.decals[1].name = "A";
        item.decals[1].mapping = 1;
      }
    }
  }

  function expandPrimarySlots() {
    expandSlot("bodyUpper");
    expandSlot("bodyLower");
    expandSlot("face");
  }

  function expandSplatterFontPart() {
    const item = getPart(21022);
    if (!item || !item.decals) return;

    for (let i = 3; i <= TARGET + 1; i += 1) {
      ensureDecal(item, i, 2, LABELS[i - 2]);
    }
  }

  function expandEggPart(id) {
    const item = getPart(id);
    if (!item || !item.decals) return;

    if (item.decals[1]) {
      item.decals[1].label = "Sp.A";
      item.decals[1].name = "Sp.A";
      item.decals[1].mapping = 1;
    }

    for (let i = 3; i <= 50; i += 1) {
      ensureDecal(item, i, 2, LABELS[i - 3]);
    }

    for (let i = 51; i <= 98; i += 1) {
      ensureDecal(item, i, 1, "Sp." + LABELS[i - 50]);
    }
  }

  function expandEggParts() {
    for (const id of EGGS) expandEggPart(id);
  }

  function apply() {
    if (STATE.applied) return true;
    if (!hasCoreTweaksSignature()) return false;

    expandPrimarySlots();
    expandSplatterFontPart();
    expandEggParts();

    STATE.applied = true;
    UW.KW_HeroForgeUI = UW.KW_HeroForgeUI || {};
    UW.KW_HeroForgeUI.expandedDecalSlots = {
      target: TARGET,
      applied: true
    };
    return true;
  }

  function tick() {
    if (apply()) return;
    STATE.tries += 1;
    if (STATE.tries >= STATE.maxTries) return;
    setTimeout(tick, STATE.delayMs);
  }

  tick();
})();

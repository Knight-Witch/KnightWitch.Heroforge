(function () {
  "use strict";

  const UW = Function("return typeof " + "unsafeWindow" + " !== 'undefined' ? " + "unsafeWindow" + " : window")();
  const TARGET = 96;
  const EGGS = [3139, 20091];
  const LABELS = Array.from({ length: TARGET }, (_, i) => i < 26 ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[i] : String(i - 25));
  const STATE = {
    loaded: true,
    applied: false,
    status: "loaded",
    reason: "waiting",
    tries: 0,
    maxTries: 80,
    delayMs: 250,
    version: "1.0.1",
    build: "1.0.1-native-decal-fallback",
    sourceMode: ""
  };

  UW.KW_HeroForgeUI = UW.KW_HeroForgeUI || {};
  UW.KW_HeroForgeUI.expandedDecalSlots = STATE;

  function setStatus(status, reason) {
    STATE.status = status;
    STATE.reason = reason || "";
  }

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

  // Core Tweaks' historical signature is not the only supported source.
  // The current native part exposes the same numbered decal layer backing data.
  // Only accept the observed native shape; do not synthesize Core Tweaks'
  // separate Splatter 0/font-source changes or alter an existing index 0.
  function compatibleDecalMode() {
    if (hasCoreTweaksSignature()) return "core-tweaks";
    const part = getPart(21022);
    const decals = part && part.decals;
    const splatter = decals && decals[1];
    const projected = decals && decals[2];
    if (!splatter || !projected ||
        !Array.isArray(splatter.sources) || !Array.isArray(projected.sources) ||
        Number(splatter.mapping) !== 1 || Number(projected.mapping) !== 2 ||
        !getOptions()?.partsBySlot) return "";
    return "native";
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
    if (!getCK()) {
      setStatus("waiting", "CK unavailable");
      return false;
    }
    if (!getOptions()) {
      setStatus("waiting", "CK.Options unavailable");
      return false;
    }
    const sourceMode = compatibleDecalMode();
    if (!sourceMode) {
      setStatus("waiting", "no compatible numbered-decal source");
      return false;
    }

    expandPrimarySlots();
    expandSplatterFontPart();
    expandEggParts();

    STATE.applied = true;
    STATE.target = TARGET;
    STATE.sourceMode = sourceMode;
    setStatus("applied", "");
    return true;
  }

  function tick() {
    if (apply()) return;
    STATE.tries += 1;
    if (STATE.tries >= STATE.maxTries) {
      setStatus("stopped", STATE.reason || "not applied");
      return;
    }
    setTimeout(tick, STATE.delayMs);
  }

  tick();
})();

(function () {
  "use strict";

  const UW = Function("return typeof " + "unsafeWindow" + " !== 'undefined' ? " + "unsafeWindow" + " : window")();
  const VERSION = "2026-07-03-layouts";
  const STYLE_ID = "kwHeroForgeUiScrollGuards";
  const SOURCE_CLASS = "kwHFDecalSourceMenu";
  const SLOT_CLASS = "kwHFDecalSlotMenu";
  const SLOT_VERTICAL_CLASS = "kwHFDecalSlotMenuVertical";
  const SLOT_SPLIT_CLASS = "kwHFDecalSlotMenuSplit";
  const SLOT_BOTTOM_CLASS = "kwHFDecalSlotMenuBottom";
  const BOTTOM_CLASS = "kwHFDecalLayoutBottom";

  UW.KW_HeroForgeUI = UW.KW_HeroForgeUI || {};
  if (UW.KW_HeroForgeUI.scrollGuards && UW.KW_HeroForgeUI.scrollGuards.loaded && UW.KW_HeroForgeUI.scrollGuards.version === VERSION) {
    UW.KW_HeroForgeUI.scrollGuards.enable();
    return;
  }

  let enabled = true;

  function installStyle() {
    if (!document.head) return;

    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `
#menuC.${SOURCE_CLASS},
#menuD.${SLOT_CLASS} {
  overscroll-behavior: contain !important;
  scrollbar-gutter: stable !important;
}

#menuC.${SOURCE_CLASS} {
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding-right: 6px !important;
  resize: vertical !important;
  max-height: min(22vh, 230px) !important;
  min-height: 72px !important;
}

#menuC.${SOURCE_CLASS}.${BOTTOM_CLASS} {
  overflow-x: auto !important;
  overflow-y: hidden !important;
  padding-right: 0 !important;
  resize: none !important;
  max-height: none !important;
}

#menuD.${SLOT_CLASS}.${SLOT_VERTICAL_CLASS} {
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding-right: 6px !important;
  resize: vertical !important;
  max-height: min(26vh, 280px) !important;
  min-height: 88px !important;
}

#menuD.${SLOT_CLASS}.${SLOT_SPLIT_CLASS} {
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding-right: 6px !important;
  resize: vertical !important;
  max-height: calc(100vh - 156px) !important;
  min-height: 88px !important;
}

#menuD.${SLOT_CLASS}.${SLOT_BOTTOM_CLASS} {
  overflow-x: auto !important;
  overflow-y: hidden !important;
  padding-right: 0 !important;
  resize: none !important;
  max-height: none !important;
  min-height: 88px !important;
}

#menuC.${SOURCE_CLASS}::-webkit-scrollbar,
#menuD.${SLOT_CLASS}::-webkit-scrollbar {
  width: 10px !important;
  height: 10px !important;
}
`;
  }

  function removeStyle() {
    const style = document.getElementById(STYLE_ID);
    if (style && style.parentNode) style.parentNode.removeChild(style);
  }

  function visible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function compactText(el) {
    return String(el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }

  function attributeText(el) {
    return Array.from(el.querySelectorAll("[aria-label], [title], [alt]"))
      .map((node) => node.getAttribute("aria-label") || node.getAttribute("title") || node.getAttribute("alt") || "")
      .filter(Boolean)
      .join(" ");
  }

  function sourceText(el) {
    return (compactText(el) + " " + attributeText(el)).replace(/\s+/g, " ").trim().toLowerCase();
  }

  function hasDecalSourceItems(el) {
    const text = sourceText(el);
    if (!text) return false;
    return text.includes("projection") || text.includes("projector") || text.includes("splatter") || text.includes("blood") || text.includes("decals");
  }

  function hasDecalSlotItems(el) {
    const tokens = new Set(compactText(el).split(/\s+/).filter(Boolean));
    let score = 0;
    for (const token of ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]) {
      if (tokens.has(token)) score += 1;
    }
    return score >= 6;
  }

  function clearTargets() {
    for (const el of document.querySelectorAll("#menuC, #menuD")) {
      el.classList.remove(SOURCE_CLASS, SLOT_CLASS, SLOT_VERTICAL_CLASS, SLOT_SPLIT_CLASS, SLOT_BOTTOM_CLASS, BOTTOM_CLASS);
    }
  }

  function overlapSize(a1, a2, b1, b2) {
    return Math.max(0, Math.min(a2, b2) - Math.max(a1, b1));
  }

  function isBottomLayout(sourceMenu, slotMenu) {
    const sourceRect = sourceMenu.getBoundingClientRect();
    const slotRect = slotMenu.getBoundingClientRect();
    const compactStack = sourceRect.height <= 140 && slotRect.height <= 140;
    const horizontalOverflow = slotMenu.scrollWidth > slotMenu.clientWidth + 16;
    const aligned = Math.abs(sourceRect.left - slotRect.left) <= 32 && Math.abs(sourceRect.width - slotRect.width) <= 96;
    return compactStack && horizontalOverflow && aligned;
  }

  function classifyPair(sourceMenu, slotMenu, type) {
    if (isBottomLayout(sourceMenu, slotMenu)) return "bottom";
    if (type === "side") return "split";
    return "vertical";
  }

  function findPairedSlot(sourceMenu) {
    const sourceRect = sourceMenu.getBoundingClientRect();
    const candidates = Array.from(document.querySelectorAll("#menuD")).filter(visible).filter(hasDecalSlotItems);
    let best = null;
    let bestScore = -Infinity;

    for (const candidate of candidates) {
      const rect = candidate.getBoundingClientRect();
      const horizontalOverlap = overlapSize(sourceRect.left, sourceRect.right, rect.left, rect.right);
      const verticalOverlap = overlapSize(sourceRect.top, sourceRect.bottom, rect.top, rect.bottom);
      const stacked = rect.top >= sourceRect.bottom - 12 && horizontalOverlap >= Math.min(sourceRect.width, rect.width) * 0.35;
      const side = rect.left >= sourceRect.right - 12 && verticalOverlap >= Math.min(sourceRect.height, rect.height) * 0.35;

      if (stacked) {
        const distance = Math.abs(rect.top - sourceRect.bottom);
        const score = 200000 - distance;
        if (score > bestScore) {
          best = { slotMenu: candidate, layout: classifyPair(sourceMenu, candidate, "stacked") };
          bestScore = score;
        }
      }

      if (side) {
        const distance = Math.abs(rect.left - sourceRect.right);
        const score = 100000 - distance;
        if (score > bestScore) {
          best = { slotMenu: candidate, layout: classifyPair(sourceMenu, candidate, "side") };
          bestScore = score;
        }
      }
    }

    return best;
  }

  function applyTarget(sourceMenu, slotMenu, layout) {
    sourceMenu.classList.add(SOURCE_CLASS);
    slotMenu.classList.add(SLOT_CLASS);

    if (layout === "bottom") {
      sourceMenu.classList.add(BOTTOM_CLASS);
      slotMenu.classList.add(SLOT_BOTTOM_CLASS);
      return;
    }

    if (layout === "split") {
      slotMenu.classList.add(SLOT_SPLIT_CLASS);
      return;
    }

    slotMenu.classList.add(SLOT_VERTICAL_CLASS);
  }

  function retarget() {
    if (!enabled) {
      clearTargets();
      removeStyle();
      return;
    }

    installStyle();
    clearTargets();

    const sourceMenus = Array.from(document.querySelectorAll("#menuC")).filter(visible).filter(hasDecalSourceItems);
    if (!sourceMenus.length) return;

    for (const sourceMenu of sourceMenus) {
      const match = findPairedSlot(sourceMenu);
      if (!match) continue;
      applyTarget(sourceMenu, match.slotMenu, match.layout);
    }
  }

  function scheduleRetarget() {
    window.setTimeout(retarget, 0);
    window.setTimeout(retarget, 150);
    window.setTimeout(retarget, 500);
  }

  function enable() {
    enabled = true;
    scheduleRetarget();
  }

  function disable() {
    enabled = false;
    clearTargets();
    removeStyle();
  }

  UW.KW_HeroForgeUI.scrollGuards = {
    loaded: true,
    version: VERSION,
    enable,
    disable,
    retarget,
    isEnabled: function () {
      return enabled;
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleRetarget, { once: true });
  } else {
    scheduleRetarget();
  }

  document.addEventListener("click", scheduleRetarget, true);
  document.addEventListener("pointerup", scheduleRetarget, true);
  window.setInterval(retarget, 1500);
})();

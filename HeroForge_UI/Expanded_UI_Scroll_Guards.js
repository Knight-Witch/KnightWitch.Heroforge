(function () {
  "use strict";

  const STYLE_ID = "kwHeroForgeUiScrollGuards";
  const SOURCE_CLASS = "kwHFDecalSourceMenu";
  const SLOT_CLASS = "kwHFDecalSlotMenu";

  function installStyle() {
    if (!document.head || document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
#menuC.${SOURCE_CLASS},
#menuD.${SLOT_CLASS} {
  overflow-y: auto !important;
  overflow-x: hidden !important;
  overscroll-behavior: contain !important;
  scrollbar-gutter: stable !important;
  padding-right: 6px !important;
  resize: vertical !important;
}

#menuC.${SOURCE_CLASS} {
  max-height: min(22vh, 230px) !important;
  min-height: 72px !important;
}

#menuD.${SLOT_CLASS} {
  max-height: min(26vh, 280px) !important;
  min-height: 88px !important;
}

#menuC.${SOURCE_CLASS}::-webkit-scrollbar,
#menuD.${SLOT_CLASS}::-webkit-scrollbar {
  width: 10px !important;
}
`;
    document.head.appendChild(style);
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

  function clearTargets() {
    for (const el of document.querySelectorAll("#menuC." + SOURCE_CLASS)) el.classList.remove(SOURCE_CLASS);
    for (const el of document.querySelectorAll("#menuD." + SLOT_CLASS)) el.classList.remove(SLOT_CLASS);
  }

  function findPairedSlot(sourceMenu) {
    const sourceRect = sourceMenu.getBoundingClientRect();
    const candidates = Array.from(document.querySelectorAll("#menuD")).filter(visible);
    let best = null;
    let bestDistance = Infinity;

    for (const candidate of candidates) {
      const rect = candidate.getBoundingClientRect();
      if (rect.top < sourceRect.bottom - 8) continue;
      const horizontalOverlap = Math.min(sourceRect.right, rect.right) - Math.max(sourceRect.left, rect.left);
      if (horizontalOverlap < Math.min(sourceRect.width, rect.width) * 0.4) continue;
      const distance = Math.abs(rect.top - sourceRect.bottom);
      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    }

    return best;
  }

  function retarget() {
    installStyle();
    clearTargets();

    const sourceMenus = Array.from(document.querySelectorAll("#menuC")).filter(visible).filter(hasDecalSourceItems);
    if (!sourceMenus.length) return;

    for (const sourceMenu of sourceMenus) {
      const slotMenu = findPairedSlot(sourceMenu);
      if (!slotMenu) continue;
      sourceMenu.classList.add(SOURCE_CLASS);
      slotMenu.classList.add(SLOT_CLASS);
    }
  }

  function scheduleRetarget() {
    window.setTimeout(retarget, 0);
    window.setTimeout(retarget, 150);
    window.setTimeout(retarget, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleRetarget, { once: true });
  } else {
    scheduleRetarget();
  }

  document.addEventListener("click", scheduleRetarget, true);
  document.addEventListener("pointerup", scheduleRetarget, true);
  window.setInterval(retarget, 1500);
})();

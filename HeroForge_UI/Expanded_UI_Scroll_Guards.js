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

  function hasDecalSlotLabels(el) {
    const labels = Array.from(el.querySelectorAll("li, span, div, button"))
      .map((n) => String(n.textContent || "").trim())
      .filter(Boolean);

    const set = new Set(labels);
    const required = ["A", "B", "C", "D", "E", "F", "G"];
    if (!required.every((label) => set.has(label))) return false;

    const text = compactText(el);
    return /A\s+B\s+C\s+D\s+E\s+F\s+G/.test(text) || required.every((label) => text.includes(label));
  }

  function hasDecalSourceItems(el) {
    const text = compactText(el).toLowerCase();
    if (!text) return false;
    return text.includes("projection") || text.includes("projector") || text.includes("splatter") || text.includes("blood");
  }

  function clearTargets() {
    for (const el of document.querySelectorAll("#menuC." + SOURCE_CLASS)) el.classList.remove(SOURCE_CLASS);
    for (const el of document.querySelectorAll("#menuD." + SLOT_CLASS)) el.classList.remove(SLOT_CLASS);
  }

  function findPairedSource(slotMenu) {
    const parent = slotMenu && slotMenu.parentElement;
    if (!parent) return null;

    const candidates = Array.from(parent.querySelectorAll("#menuC")).filter(visible);
    if (!candidates.length) return null;

    const slotRect = slotMenu.getBoundingClientRect();
    let best = null;
    let bestDistance = Infinity;

    for (const candidate of candidates) {
      const rect = candidate.getBoundingClientRect();
      if (rect.bottom > slotRect.top + 8) continue;
      if (!hasDecalSourceItems(candidate)) continue;
      const distance = Math.abs(slotRect.top - rect.bottom);
      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    }

    if (best) return best;

    return candidates.find(hasDecalSourceItems) || null;
  }

  function retarget() {
    installStyle();
    clearTargets();

    const slotMenus = Array.from(document.querySelectorAll("#menuD")).filter(visible).filter(hasDecalSlotLabels);
    if (!slotMenus.length) return;

    for (const slotMenu of slotMenus) {
      const sourceMenu = findPairedSource(slotMenu);
      if (!sourceMenu) continue;
      slotMenu.classList.add(SLOT_CLASS);
      sourceMenu.classList.add(SOURCE_CLASS);
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

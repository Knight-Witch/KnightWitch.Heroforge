# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-14-069 -- Add FRD warning guide and Witch Dock sign-off to Texture Quality notice

Date: 2026-09-14

### Summary

Refine only the Dev Texture Quality announcement popup after visual/copy review. The notice advances from v0.2.0 to v0.2.1 / build `0.2.1-frd-warning-assets-signoff`; Texture Quality service/UI behavior and public Stable remain unchanged.

### Notice changes

- changes the compatibility shorthand from `FRD/T` to the clearer `FRD` throughout the live popup;
- promotes the Full Res Decals compatibility note into a dedicated amber warning callout with `⚠️` framing on both sides of the header;
- adds a centered visual guide showing the three FRD `Decal Resolution` toggles that should be OFF;
- adds the white Knight Witch emblem centered beneath the Discord contact line as a sign-off;
- normalizes missing sentence-ending punctuation across the popup copy while preserving Amanda's wording and hierarchy;
- keeps supporting warning/instruction lines in the smaller secondary-text treatment;
- asset failures are isolated: missing guide/emblem images hide themselves without blocking or breaking the notice.

### Assets

- `features/rendering/assets/Texture_Quality_FRD_Decal_Resolution.webp` — lossless WebP version of Amanda's provided FRD settings screenshot;
- `features/rendering/assets/Witch_Dock_Emblem_White.webp` — compact lossless white emblem for the popup sign-off.

### Validation

`node --check` passes on the v0.2.1 notice candidate. The candidate manifest parses with unique module/tool IDs, and reconstructing the v0.2.0 notice metadata/cache key reproduces prior manifest blob `385738a55cc9dab62c1f5082a6021cd4a2c9f199` exactly. Both asset blob SHAs were verified against local Git hashes before commit.

Human visual review remains the gate; do not promote the notice to Stable until Amanda approves the rendered v0.2.1 popup.

**Runtime behavior changed:** yes -- Dev-only announcement UI/copy/assets. Texture Quality engine/service behavior and public Stable are untouched.

---

## DOCK-2026-09-14-068 -- Expand Texture Quality beta notice for release review

Date: 2026-09-14

### Summary

Revise only the Dev Texture Quality announcement popup for final human copy/layout review. The notice advances from v0.1.2 to v0.2.0 / build `0.2.0-expanded-release-copy`; Texture Quality service/UI behavior is unchanged.

### Notice changes

- expands the capability list with UV-seam, decal-clarity, lower VRAM/GPU demand, live enable/disable, persistence, forced-downgrade resistance, and graphics-recovery messaging;
- records the validated three-figure and ~1000% kitbash coverage while clearly marking 4+ figures and more extreme kitbash as untested/future work;
- keeps the FRD/T compatibility warning and moves supporting detail into smaller second-tier text;
- keeps the three sub-bullets under “Acheive higher-quality” at normal body size, while other nested explanatory bullets use smaller text;
- increases section-heading size and adds subtle dividers;
- changes the confirmation button from `OK` to `Hell Yeah!`;
- removes the now-obsolete copy that described ~1000% kitbash as merely a future target.

### Validation

`node --check` passes on the v0.2.0 notice candidate. Reconstructing the prior manifest from the candidate reproduces the current manifest blob `39daa7fb06e2a65415f5be131ef92f7762bf6f25`, confirming the manifest delta is limited to the notice registry identity and cache-keyed Dev URL.

Human visual/copy review is the next gate; do not promote this notice to Stable until Amanda approves the rendered popup.

**Runtime behavior changed:** yes -- Dev-only announcement UI/copy changes; Texture Quality service/UI and public Stable are untouched.

---

## DOCK-2026-09-14-067 -- Hand off Texture Quality to Stable promotion

Date: 2026-09-14

### Summary

Record the completed Dev phase and hand the next chat a narrow public Stable promotion task. Amanda explicitly approved beginning the public update in the next chat. No Stable or runtime files are changed by this entry.

### Promotion boundary

- do not restart the completed v0.3.4 multi-figure investigation;
- reconfirm both branch heads before writing;
- inspect only the exact Texture Quality service/UI files plus required `manifest.json` registry/cache entries on Dev and Stable;
- do not merge WITCH_DEV_UI wholesale or carry unrelated Dev work into Stable;
- follow `MODULE_VERSIONING.md`, run static/syntax checks, update release logs, then run a narrow `Witch_Scripts` smoke through HF-Chat-Bridge;
- if Stable differs from the validated Dev behavior, diagnose rather than widening scope or patching blindly.

### Accepted Dev source

Service v0.3.4 / `0.3.4-dev-native-color-material-setup` and UI v0.2.0 / `0.2.0-dev-persistence-advanced-controls` have passed committed-source smoke, non-primary Seya visual validation, dynamic multi-figure membership, shared-Part restore, and the 1030% three-detailed-figure stress gate.

### Deferred

Ultra-heavy / "insanity mode" remains a separate future phase and should not be mixed into this promotion.

**Runtime behavior changed:** no -- documentation-only release handoff.

---

## DOCK-2026-09-14-066 -- Accept Texture Quality multi-figure stress gate

Current Dev v0.3.4 passed the full multi-figure gate, including a 1030% three-detailed-figure scene. One pressured extra packed body allocations at the intentional 1024px High Res floor while other headline targets promoted to 2048px; Amanda visually confirmed all three figures' body textures and decals looked excellent. Heavy Disable/restore and final re-enable passed.

---

## DOCK-2026-09-14-065 -- Refresh pinned color-bake materials

Texture Quality v0.3.4 added HeroForge-owned `colorBake.paints.setupMaterials('color')` after pinned mask policy application and during restore. This fixed the Seya/shared-Part case where the correct 1024px override existed but an existing color-bake material retained a 512px mask. Exact committed-source smoke and Seya non-primary visual validation passed.

---

## DOCK-2026-09-14-064 -- Deduplicate shared HeroForge Part snapshots

Texture Quality v0.3.3 deduplicated first snapshots by shared Part object identity, fixing restore contamination across figures that share body Part instances. Repeated Enable/Disable and dynamic 3->2 / 2->3 membership validation passed.

---

## Prior active history

DOCK-2026-09-13-063 and earlier detailed entries remain preserved in Git history. Fetch only when a current task needs their specific evidence.

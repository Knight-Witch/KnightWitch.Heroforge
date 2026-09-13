# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-13-057 — Fix D4 promoted-mask retry failure

Date: 2026-09-13

### Summary

Fix a D4-specific Texture Quality failure where persistence saved correctly but both automatic and manual High Res enable could fail after HeroForge had promoted the body source size to 2048.

### Confirmed diagnosis

- Bridge #1783 confirmed `Persistent` stored `true`; the enable failure was `Valid 1024px body masks did not load.`
- #1785/#1786 confirmed D4 body parts can already have `_usedTextureSize=2048`, and HeroForge's `getMaskPath(hiRez, requestedSize)` only promotes that field; requesting 1024 does not lower an existing 2048 value and therefore resolves nonexistent `*_mask_2048` assets.
- #1787 proved a reversible exact-1024 clamp around mask-path resolution returns D4's real `humanToes_mask_1024.webp` and `human_mask_1024.webp`, both loading as genuine 1024x1024 textures, while restoring the original 2048 source state immediately.

### Changes

- bump `texture-quality-native-reconcile` to v0.2.2 / build `0.2.2-dev-mask-path-clamp`;
- resolve body mask paths under a temporary exact 1024 `_usedTextureSize` seed and restore the prior property descriptor/value immediately after path resolution;
- retain the existing real-1024 mask load and exact-object verification contract;
- avoid a native restore/rebuild when enable fails before Texture Quality has touched any owned policy state, preventing a pre-policy mask-load failure from needlessly regenerating HeroForge state;
- preserve persistence semantics, native atlas ownership, generation adoption, allocation verification, session suppression, and the existing UI/notice modules unchanged.

### Operational correction

An accidental documentation-only commit temporarily replaced `ACTIVE_CONTEXT.md` with a one-character placeholder while advancing Dev. The corrective merge restores the reviewed v0.2.2 candidate tree without force-rewriting branch history; no runtime file or Stable branch was changed by that accidental commit.

### Protected behavior

No custom atlas ownership, buildAtlas wrapping, direct atlas assignment, giant atlas forcing, stale cross-figure snapshots, UI contract, or notice behavior is introduced. Public Stable remains untouched.

**Runtime behavior changed:** yes, Dev Texture Quality service patch only.

---

## DOCK-2026-09-13-056 — Refine Texture Quality notice hierarchy

v0.1.2 centers all section headings, uses a lighter main-title font treatment, and splits the closing copy into two centered lines. Bridge #1779/#1781 validated the exact candidate and live rendered state; Amanda approved the appearance.

---

## DOCK-2026-09-12-055 — Polish Texture Quality beta announcement

v0.1.1 centered the expanded title, enlarged body/section typography, condensed the copy, and linked `@ Knight.Witch` directly to Amanda's Discord profile while preserving the Phase 1 acknowledgement contract. Bridge #1777/#1778 validated the exact candidate and live rendered values.

---

## DOCK-2026-09-12-054 — Add one-time Texture Quality Phase 1 announcement

The isolated v0.1.0 notice introduced one-time `OK` acknowledgement and the Phase 1 Texture Quality announcement without coupling the modal to the validated Texture Quality service/UI architecture.

---

## Prior active history

DOCK-2026-09-12-053 and earlier entries remain preserved in Git history. Fetch only when a current task needs their specific evidence.

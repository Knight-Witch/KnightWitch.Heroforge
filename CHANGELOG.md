# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-14-071 -- Add smart active-decal texture priority candidate

Date: 2026-09-14

### Summary

Open a new Texture Quality Dev phase for the verified heavy-figure regression where an actually-decaled accessory could remain at 1024px even while body/head targets were already 2048px.

- Texture Quality service advances to v0.3.5 / build `0.3.5-preserve-native-source-floor`; the 1024 source value is now a floor, preserving HeroForge native promotion up to the existing 2048 ceiling instead of forcing a higher native source back to 1024.
- New isolated hidden service `texture-quality-active-decal-priority` v0.1.0 / build `0.1.0-dev-active-decal-scale-policy` raises HeroForge's allowed atlas maxima to at least 8192×4096 only when hardware support is confirmed and applies scale 4 only to non-core atlas slots that currently contain decals in HeroForge figure data.
- Existing bodyLower/bodyUpper/face ownership remains in the accepted Texture Quality service; the extension owns only active accessory decal scales and its atlas-budget setting snapshots.
- Runtime probes on the current heavy figure confirmed six part-backed active decal slots versus 37 decal-capable parts. The active dress slot `k_9` (`clothVDress`) moved from 1024×1024 to 2048×2048 when selectively promoted, and remained 2048×2048 after returning from an 8192×8192 diagnostic ceiling to the intended 8192×4096 ceiling.
- The policy restores removed/stale accessory scale entries and only the atlas-max settings it actually changed; later outside changes win. Unknown hardware fails closed without raising the atlas maxima, and a dirty-policy retry prevents a transient core busy race from losing the required rebuild.

A broader opt-in all-object texture-quality mode remains a separate follow-on. Lob's FRD global multiplier improves arbitrary object textures as well as decal surfaces, but normal High Res will stay targeted until that heavier mode is separately designed and validated.

**Runtime behavior changed:** yes -- Dev only; no Stable promotion in this commit.

---

## DOCK-2026-09-14-070 -- Close Texture Quality beta notice public rollout

Date: 2026-09-14

### Summary

Close the completed Texture Quality announcement task after Amanda approved Dev v0.2.1 and the same presentation was narrowly published and smoke-tested on public `Witch_Scripts`.

- approved Dev notice commit: `bb73e05fcf8ff9f920fb6171d7777d84466c221b`;
- notice: v0.2.1 / build `0.2.1-frd-warning-assets-signoff`;
- public runtime promotion: `2e8662d9d55322aac0d64c67a279052e7de6df77`;
- public documentation closeout: `dcf53166a12321cc5bbe1d94133c3d1d29655e59`;
- Bridge #2215/#2216 confirmed actual Stable provenance, public notice identity, visible FRD warning, centered FRD guide, centered emblem, `Hell Yeah!` button, Stable asset URLs, and no Power error.

`ACTIVE_CONTEXT.md` now marks the Texture Quality service/UI and Phase 1 announcement rollout closed. The separate ultra-heavy / “insanity mode” phase remains deferred until explicitly requested or supported by new degradation evidence.

**Runtime behavior changed:** no -- documentation/router closeout only. Dev and Stable runtime files/manifests are unchanged by this commit.

---

## DOCK-2026-09-14-069 -- Add FRD warning guide and Witch Dock sign-off to Texture Quality notice

Dev notice v0.2.1 / build `0.2.1-frd-warning-assets-signoff` added the dual-`⚠️` FRD warning callout, centered FRD Decal Resolution guide, punctuation normalization, white emblem sign-off, and isolated asset failures. Amanda subsequently visually approved this exact committed state for Stable promotion.

---

## Prior active history

DOCK-2026-09-14-068 and earlier detailed entries remain preserved in Git history. Fetch only when a current task needs their specific evidence.

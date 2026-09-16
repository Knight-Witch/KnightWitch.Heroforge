# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-16-076 -- Close post-promotion Texture Quality regression matrix

Date: 2026-09-16

### Summary

Documentation-only closeout after the already-promoted Texture Quality lifecycle/projected-host patch passed the full post-promotion Dev regression matrix.

- 2-figure High Res baseline passed on D5/Seya + Demi.
- Real Demi kitbash drag triggered the expected brief native downgrade and one successful same-figure repair; D5 remained coherent.
- Third-figure add passed with Witch of the Wilds; `hairZ` provided an additional projected-host family.
- Real Witch kitbash drag advanced the guard from repair 1 -> 2 and recovered all three figures cleanly.
- Third-figure removal cleaned `baseItemB` / `hairZ` ownership without an extra repair.
- Deliberate D5 -> Demi -> D5 same-canvas switching preserved High Res and per-figure projected-host ownership.
- Canvas/scene round-trip with Persistence ON passed: projected decals were immediate; body atlases briefly rebuilt then returned automatically to verified High Res. Runtime confirmed persistence remained enabled and no extra guard repair/error occurred.
- Final default/unpainted third-figure inert control passed: core verified 3 figures while active-decal state reported `baseItemB.activeAccessorySlots: []`; D5 and Demi retained their own existing host sets.
- The prior muddy/green artifact remains closed absent reproduction.
- No additional Texture Quality runtime patch is required from this regression.
- Mandatory next work is HF-Chat-Bridge issue `#2580` before any unrelated Witch Dock backlog item: reduce trusted DEV workbench friction with a path-aware/broader named-path call design.

**Runtime behavior changed:** no. Documentation/housekeeping only; no runtime module, manifest, version, cache key, or public Stable behavior changes.

---

## Prior active history

DOCK-2026-09-15-075 and earlier detailed entries remain preserved in Git history.

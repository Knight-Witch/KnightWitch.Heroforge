# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-16-078 -- Reclassify connection toast and route JSON re-test

Date: 2026-09-16

### Summary

Documentation-only closeout/routing update after issue #7 diagnosis.

- Issue #7 is closed as upstream/not a confirmed Witch Dock-owned defect. No matching Witch Dock emitter/source string was found, and Witch Dock's own module loader silently catches its fetch failures.
- Hero Forge officially documents a native part-load network-error message and automatic retry on later changes, matching the observed transient/self-recovering behavior.
- No Witch Dock runtime patch is justified for #7. Reopen only if a controlled comparison proves a specific Dock module causes or materially increases the native failures.
- Backlog issue #8 now routes the first historical status re-check: JSON character import/export.
- JSON import/export remains diagnosis-first; the historical report is not assumed to reproduce on current HeroForge.

**Runtime behavior changed:** no. Documentation/housekeeping only; no JavaScript, manifest, module version, cache key, or public Stable behavior changes.

---

## DOCK-2026-09-16-077 -- Resume Witch Dock backlog after Bridge gate

Documentation-only routing update after HF-Chat-Bridge v0.3.2 was installed/live-validated. Issue #7 was selected for diagnosis and has now been resolved/reclassified by the entry above.

---

## DOCK-2026-09-16-076 -- Close post-promotion Texture Quality regression matrix

Texture Quality post-promotion hardening passed and closed with no additional runtime patch required.

---

## Prior active history

DOCK-2026-09-15-075 and earlier detailed entries remain preserved in Git history.

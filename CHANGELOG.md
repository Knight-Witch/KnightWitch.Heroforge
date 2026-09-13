# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-13-056 — Refine Texture Quality notice hierarchy

Date: 2026-09-13

### Summary

Apply the second visual polish pass to the isolated Texture Quality Phase 1 notice after Amanda approved the revised copy density.

### Changes

- bump `texture-quality-beta-notice` to v0.1.2 / build `0.1.2-centered-sleek-title`;
- center all section headings to separate the modal sections more clearly;
- change the main announcement title to a lighter, sleeker local system-font stack with reduced weight and slightly wider tracking;
- split the closing copy into two centered lines, with `If you run into issues...` on its own line beneath the optional/default-off statement;
- preserve the direct Discord link on `@ Knight.Witch` and the existing one-time acknowledgement key.

### Protected behavior

Texture Quality service v0.2.1, Texture Quality UI v0.2.0, persistence semantics, native atlas/mask ownership, Booth behavior, notice timing, and acknowledgement storage are unchanged.

**Runtime behavior changed:** yes, Dev announcement presentation only. Public Stable remains untouched.

---

## DOCK-2026-09-12-055 — Polish Texture Quality beta announcement

v0.1.1 centered the expanded title, enlarged body/section typography, condensed the copy, and linked `@ Knight.Witch` directly to Amanda's Discord profile while preserving the Phase 1 acknowledgement contract. Bridge #1777/#1778 validated the exact candidate and live rendered values.

---

## DOCK-2026-09-12-054 — Add one-time Texture Quality Phase 1 announcement

The isolated v0.1.0 notice introduced one-time `OK` acknowledgement and the Phase 1 Texture Quality announcement without coupling the modal to the validated Texture Quality service/UI architecture.

---

## DOCK-2026-09-12-053 — Gate persistent auto-enable on visible HeroForge runtime

Service v0.2.1 / build `0.2.1-dev-visible-auto-enable` prevents automatic persistence from starting in hidden HeroForge tabs and schedules the normal safe path on `visibilitychange`.

---

## Prior active history

DOCK-2026-09-12-052 and earlier entries remain preserved in Git history. Fetch only when a current task needs their specific evidence.

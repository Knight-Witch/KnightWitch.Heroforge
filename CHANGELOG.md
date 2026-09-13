# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-12-055 — Polish Texture Quality beta announcement

Date: 2026-09-12

### Summary

Refine the first-run Texture Quality announcement after Amanda's visual review without changing Texture Quality service behavior, persistence semantics, or the Utilities controls.

### Changes

- bump `texture-quality-beta-notice` to v0.1.1 / build `0.1.1-copy-layout-polish`;
- retitle the modal to `Nat 20! New Beta Unlocked: Texture Quality Upgrade Is Live!` and center the heading;
- increase body text size and strengthen section-heading hierarchy with larger type and wider letter spacing;
- shorten and consolidate the announcement copy while preserving Phase 1 scope, extreme-build limits, load-settle guidance, crash-state recovery, future optimization plans, and the FRD/T handoff warning;
- keep the actionable instruction to disable only FRD/T's three Decal Resolution toggles, not the rest of FRD/T;
- hyperlink the visible Discord contact `@ Knight.Witch` directly to Amanda's Discord user profile;
- keep the acknowledgement key unchanged so users who already dismissed this Phase 1 notice are not forced to acknowledge the copy-only revision again.

### Protected behavior

Texture Quality service v0.2.1, Texture Quality UI v0.2.0, persistence storage, temporary session suppression, native atlas ownership, mask policy, Booth behavior, and the notice acknowledgement contract are unchanged.

**Runtime behavior changed:** yes, Dev announcement presentation/copy only. Public Stable remains untouched.

---

## DOCK-2026-09-12-054 — Add one-time Texture Quality Phase 1 announcement

The isolated v0.1.0 notice introduced one-time `OK` acknowledgement and the Phase 1 Texture Quality announcement without coupling the modal to the validated Texture Quality service/UI architecture. Bridge #1766/#1767/#1768 validated syntax, first-show, acknowledgement, and no-repeat behavior.

---

## DOCK-2026-09-12-053 — Gate persistent auto-enable on visible HeroForge runtime

Service v0.2.1 / build `0.2.1-dev-visible-auto-enable` prevents automatic persistence from starting in hidden HeroForge tabs and schedules the normal safe path on `visibilitychange`. Bridge #1755/#1757/#1760 diagnosed the hidden-tab failure; #1761 confirmed the exact corrective service/manifest static PASS.

---

## DOCK-2026-09-12-052 — Texture Quality persistent preference Dev candidate

The approved boolean-only persistence model and Advanced reconcile UI were implemented on `WITCH_DEV_UI`. Public Stable was not changed.

---

## Prior active history

DOCK-2026-09-12-051 and earlier entries remain preserved in Git history. Fetch only when a current task needs their specific evidence.

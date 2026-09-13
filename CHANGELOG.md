# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-13-058 — Gate persistent Texture Quality on stable renderer readiness

Date: 2026-09-13

### Summary

Prevent Persistent High Res from starting against a still-changing HeroForge generation during heavy figure/library transitions.

### Confirmed diagnosis

- D4 cold-reload persistence passed on v0.2.2, and a normal library-save transition also looked correct.
- Heavy figures Seya and Twilight Soak could report a Persistent High Res failure while the figure was still settling.
- Bridge #1797 captured Twilight Soak failed with `Timed out waiting for native reconciliation to settle.`; an earlier verification on the same transition had bodyLower packed at only 512x512 despite scale 4 / bake 2048 / used seed 1024.
- #1798 then confirmed the post-failure native figure itself was fully idle, `finished=true`, `resourcesReady=true`, with coherent 4096x4096 display/resource atlases.
- One bounded manual High Res enable on that already-settled Twilight Soak succeeded in about 3.9 seconds and verified 2048x2048 bodyLower/bodyUpper/face allocations plus exact 1024 body masks (#1800).

Therefore Twilight Soak was not exceeding the Phase 1 atlas policy in this test. Automatic persistence was entering the existing reconcile path before the heavy figure generation had become quiescent.

### Changes

- bump `texture-quality-native-reconcile` to v0.2.3 / build `0.2.3-dev-stable-auto-readiness`;
- keep manual Enable unchanged;
- before automatic Persistent enable only, require HeroForge scheduler idle, display resources/finished not false, a coherent native display/resource atlas, and a stable character/data/display/modded/atlas/part signature for 1200 ms;
- reset the quiet window whenever the generation or part/target allocation signature changes;
- abandon an in-progress automatic wait if the document becomes hidden so the existing visibility handler can schedule a fresh foreground attempt;
- preserve the existing 30-second bounded readiness window.

### Protected behavior

The validated High Res transaction itself is unchanged: scale 4, bake 2048, used-size 1024 seed, exact real 1024 body masks, native generation/adoption, native atlas ownership, verifier, rollback, persistence storage semantics, manual Disable suppression, UI and Phase 1 notice remain unchanged. Public Stable remains untouched.

**Runtime behavior changed:** yes, Dev automatic-persistence readiness only.

---

## DOCK-2026-09-13-057 — Fix D4 promoted-mask retry failure

v0.2.2 fixed D4 mask-path resolution after native source promotion by temporarily resolving the real 1024 body-mask path under an exact 1024 used-size seed, restoring the prior value immediately, and avoiding unnecessary native restore when no policy state was touched. D4 manual/automatic enable and cold reload subsequently passed.

---

## DOCK-2026-09-13-056 — Refine Texture Quality notice hierarchy

v0.1.2 centers all section headings, uses a lighter main-title font treatment, and splits the closing copy into two centered lines. Amanda approved the appearance.

---

## Prior active history

DOCK-2026-09-12-055 and earlier entries remain preserved in Git history. Fetch only when a current task needs their specific evidence.

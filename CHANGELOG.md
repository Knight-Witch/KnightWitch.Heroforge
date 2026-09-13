# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-13-059 — Tolerate heavy native reconcile stalls

Date: 2026-09-13

### Summary

Prevent Texture Quality from declaring heavy HeroForge generations failed merely because native rebuild work blocks or outlives the old 12-second settle window.

### Confirmed diagnosis

- v0.2.3 fixed the early Persistent-start race, but Seya still exposed `Timed out waiting for native reconciliation to settle.` during the actual native rebuild.
- A normal Seya reconcile completed its Bridge call after about 35.4 seconds yet still returned the service timeout.
- A cleanup `disable()`/native restore took about 65.7 seconds and likewise returned a restore timeout warning.
- After that warning, HeroForge itself reached an idle, finished/resources-ready, coherent native 4096x4096 state, proving the restore had ultimately completed and the service had given up too early.
- The existing `settle()` loop used a fixed 12-second wall-clock bound. Heavy synchronous/native work can monopolize the page long enough that the deadline expires before the service gets another reliable observation.

### Changes

- bump `texture-quality-native-reconcile` to v0.2.4 / build `0.2.4-dev-heavy-native-settle`;
- expand the bounded native-settle budget to 120 seconds for enable, restore and manual reconcile paths;
- inspect the current renderer state before enforcing the expired deadline, with a short bounded confirmation allowance if the renderer is already coherent when control returns;
- keep the existing coherence requirements unchanged: scheduler idle, resources/finished not false, display/resource atlas identity and stable target allocations.

### Explicitly not included

The exploratory 8192 atlas, broader non-body scaling and projected/splatter source-ceiling probes are rejected as shipping changes at this stage. They are not present in v0.2.4. Texture policy, exact 1024 body masks, persistence semantics, verifier thresholds, native atlas ownership, UI and beta notice remain unchanged. Public Stable remains untouched.

**Runtime behavior changed:** yes, Dev native-settle timing only.

---

## DOCK-2026-09-13-058 — Gate persistent Texture Quality on stable renderer readiness

v0.2.3 waits for a stable visible HeroForge generation before automatic Persistent High Res starts. Manual Enable and the validated High Res recipe remained unchanged.

---

## DOCK-2026-09-13-057 — Fix D4 promoted-mask retry failure

v0.2.2 fixed D4 mask-path resolution after native source promotion by temporarily resolving the real 1024 body-mask path under an exact 1024 used-size seed, restoring the prior value immediately, and avoiding unnecessary native restore when no policy state was touched. D4 manual/automatic enable and cold reload subsequently passed.

---

## DOCK-2026-09-13-056 — Refine Texture Quality notice hierarchy

v0.1.2 centers all section headings, uses a lighter main-title font treatment, and splits the closing copy into two centered lines. Amanda approved the appearance.

---

## Prior active history

DOCK-2026-09-12-055 and earlier entries remain preserved in Git history. Fetch only when a current task needs their specific evidence.

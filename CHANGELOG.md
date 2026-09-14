# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-13-060 — Texture Quality multi-figure native reconcile

Date: 2026-09-13

### Summary

Extend Texture Quality from the primary HeroForge figure only to every current figure display registered by HeroForge, without changing the validated High Res texture recipe or native ownership model.

### Confirmed diagnosis

- `CK.character.display` / `CK.character.data` represent the primary figure targeted by Texture Quality v0.2.4.
- HeroForge exposes additional figure pipelines through `CK.character.allDisplays`.
- With two figures, `allDisplays.baseItem` is `data.primary=false`, owns its own `data`, `modded`, meshes and coherent native atlas/resourceAtlas, and has body/head part IDs distinct from the primary figure.
- With three figures, `allDisplays` contains `""`, `baseItem`, and `baseItemB`; both non-primary entries own independent coherent native render pipelines.
- This explains Seya's apparent contradiction: Texture Quality verified the scene's primary figure while Seya, loaded as figure 2, remained untouched.

### Changes

- bump `texture-quality-native-reconcile` to v0.3.0 / build `0.3.0-dev-multifigure-native-reconcile`;
- dynamically enumerate the primary display plus every unique compatible entry in `CK.character.allDisplays`;
- apply the existing scale 4 / bake 2048 / used-size seed 1024 / exact 1024 body-mask policy independently to each figure pipeline;
- keep one HeroForge-owned native lifecycle: per-figure `data.change()` + `modded.buildAtlas()`, followed by the normal root `CK.character.refresh()`;
- verify every figure's display/resource atlas identity, target allocations, source values and exact pinned body masks;
- retain backward-compatible primary verification fields while adding per-figure verification and figure counts;
- detect figure-registry membership changes while High Res is active and queue a stable, bounded native scene resync so newly added figures can inherit High Res without hardcoding a figure limit.

### Explicitly unchanged

No 8192 atlas forcing, global-4 texture pressure, projected/splatter source override, custom `CK.Atlas`, direct atlas assignment, persistent atlas ownership, persistence semantic change, UI module change, or beta-notice change is included. Public Stable remains untouched.

**Runtime behavior changed:** yes, Dev Texture Quality figure scope and dynamic scene reconciliation.

---

## DOCK-2026-09-13-059 — Tolerate heavy native reconcile stalls

v0.2.4 expanded the bounded native settle budget to 120 seconds and checks renderer coherence before enforcing an expired deadline. Heavy Seya native work no longer false-times out simply because HeroForge blocks the page longer than the old 12-second window.

---

## DOCK-2026-09-13-058 — Gate persistent Texture Quality on stable renderer readiness

v0.2.3 waits for a stable visible HeroForge generation before automatic Persistent High Res starts. Manual Enable and the validated High Res recipe remained unchanged.

---

## DOCK-2026-09-13-057 — Fix D4 promoted-mask retry failure

v0.2.2 fixed D4 mask-path resolution after native source promotion and passed D4 automatic/manual enable plus cold reload persistence.

---

## Prior active history

DOCK-2026-09-13-056 and earlier entries remain preserved in Git history. Fetch only when a current task needs their specific evidence.

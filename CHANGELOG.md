# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-13-061 — Bound multi-figure body-mask loading to native capability

Date: 2026-09-13

### Summary

Repair the v0.3.0 multi-figure Texture Quality mask prerequisite for valid HeroForge species whose body mask assets do not exist at 1024px, and prevent HeroForge resource promises from wedging the service indefinitely during mask preparation.

### Confirmed diagnosis

- Colliefolk figure 2 and raccoonfolk figure 3 both use bodyUpper part 11181 (`furryClaws`).
- That part reports native `bakeSize=512`; `furryClaws_mask_512.webp` exists and loads as 512×512, while the 1024 and 2048 variants are genuine 404s.
- v0.3.0 therefore failed before applying High Res because it required every body mask to resolve/load at exactly 1024px.
- A diagnostic using the native 512 mask then exposed a second issue: awaiting HeroForge's `CK.Resources.getResource()` promise can remain pending even while the renderer itself is idle, leaving Texture Quality stuck at `Preparing native reconcile…`.

### Changes

- bump `texture-quality-native-reconcile` to v0.3.1 / build `0.3.1-dev-bounded-mask-capability`;
- select each body mask at the native supported size up to the existing 1024px preference, using the part's pre-policy native bake ceiling;
- keep the source-quality policy itself unchanged at scale 4 / bake 2048 / used-size seed 1024;
- trigger HeroForge mask resource loading without awaiting the resource promise, then bounded-poll `getNow()` for up to five seconds;
- verify each pinned body mask against its exact selected supported size rather than hard-requiring 1024px for every species.

### Explicitly unchanged

No change to multi-figure enumeration, native atlas ownership, persistence semantics, 120s native settle behavior, UI, beta notice, global atlas size, projected-decal handling, or public Stable.

**Runtime behavior changed:** yes, Dev Texture Quality mask capability/loading and verification.

---

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

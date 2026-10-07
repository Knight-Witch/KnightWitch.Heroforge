# #25 — Counting Sheep BALLROOM heavy-build ceiling fixture, 2026-10-07

**Status:** primary heavy-build ceiling / Phase 2 recovery fixture. Private JSON; do not publish the fixture itself.

## Fixture identity

- Local/private fixture: `Counting Sheep_BALLROOM.json`
- SHA-256: `07f1f7ad8587ee5043f99241885f60c892cdbfccb115ee43a5c6587476a64501`
- Size: 1,111,478 bytes
- Amanda-reported kitbash usage: **1817%**
- Basis: the same two-character Counting Sheep build used by the accepted #25 control work, expanded into a full ballroom scene.
- Amanda's current visual observation: the heavy build shows a **full texture downgrade across the board**, unlike the ordinary Counting Sheep control where current Dev High Res performs very well.

The JSON remains outside the repository. The hash is the durable identity for future comparisons.

## Why this is now the primary ceiling fixture

The ordinary Counting Sheep fixture is already a strong positive control:

- its two-character scene has known good current Dev High Res behavior;
- the accepted pauldrons/circlet/shield/fan work has already established meaningful source + allocation improvements;
- current Public Beta Phase 2 passes its machine and human visual gates on that baseline.

The BALLROOM variant preserves the same underlying character basis while adding extreme kitbash/scene pressure. That sharply separates two questions that were previously easy to conflate:

1. **Native heavy-build regression ceiling** — Hero Forge may globally reduce texture allocations once scene/kitbash pressure crosses an internal threshold.
2. **Phase 2 recovery under regression** — after that native collapse, Witch Dock may recover some/all eligible hosts, or may itself need a new scene-ceiling policy.

Because the same base characters are already known-good, this fixture becomes the primary target for discovering and modeling the native ceiling before attributing residual misses to Phase 2 coverage.

## Static JSON census

The private JSON was parsed without publishing its contents.

Primary/root structure:

- `humanoidCount = 2`
- `kitbashed = true`
- 427 `kit` entries
- 431 transform hosts
- 55 explicit `atlasScale` entries
- kit keys extend through at least `k_468`
- explicit atlasScale values span approximately 0.07 → 12.17

Nested `children.baseItem` structure:

- `kitbashed = true`
- 20 `kit` entries
- 23 transform hosts
- 5 explicit `atlasScale` entries

These counts are structural evidence only; they do not establish the live packing/texture ceiling by themselves.

## Required test order

Do not begin by treating this as a Phase 2 bug.

### A. Native/Stable heavy-build baseline

Load the exact JSON and establish the live forced-downgrade state **with Phase 2 disabled** while preserving the normal Stable/High Res owner boundaries.

Capture, per display:

- atlas dimensions and occupied allocation;
- body/face/core allocations;
- representative object/clothing/hair/weapon/shield/prop allocations;
- displayed normal-map dimensions/source identities;
- mask/AAID source/allocation where relevant;
- Native Reconcile verification state;
- Active Decal Priority ownership;
- whether the downgrade is scene-wide or limited to selected displays/hosts.

The first goal is to locate the actual threshold/behavioral boundary Hero Forge enforces under this scene pressure.

### B. Phase 2 recovery pass

Only after the native heavy-build state is known, enable the current Phase 2 Beta package and compare the same hosts.

Classify each host as:

- recovered to expected Phase 2 target;
- source-limited;
- allocation/budget-limited;
- rejected by no-collateral packing;
- still suppressed by the native heavy-build ceiling;
- unexplained Phase 2 miss.

### C. Ceiling-model discriminator

Use the ordinary Counting Sheep control versus BALLROOM to determine whether the missing policy is primarily:

- a global native texture/atlas ceiling tied to aggregate scene complexity;
- a per-display packing ceiling;
- a kitbash-count/percentage threshold;
- a memory/resource readiness fallback;
- or another Hero Forge-owned downgrade seam.

Do not add a blanket atlas-size or scale override merely because this stress fixture is large. Preserve the existing bounded/no-collateral policy unless live evidence proves a separate ceiling-aware recovery is safe.

## Acceptance direction

This fixture becomes the main stress target for the **heavy-build ceiling** portion of High Res development.

Success does not require every ballroom prop to run at maximum source size. Success means:

- the native forced regression is explicitly detected/understood;
- important eligible hosts can be recovered without stealing quality from unrelated hosts;
- the ordinary Counting Sheep control stays unchanged;
- rollback returns the exact native heavy-build baseline;
- repeated ON/OFF, figure reload, and scene readiness do not loop or leak ownership;
- the result remains usable on an extreme 1817% build without unbounded memory growth.

If the native ceiling and Phase 2 coverage produce independent defects, record them as linked but separate ownership findings rather than one ambiguous Beta bug.

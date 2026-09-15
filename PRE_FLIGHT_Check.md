# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-15-073 -- Kitbash Texture Quality handoff

Date: 2026-09-15

### Scope

Documentation/router handoff only. No runtime module, manifest, UI, or Stable source changed in this commit.

### Exact current evidence

- Same-browser Chrome comparison against Lob's FullResDecals Extreme: Amanda judged Witch Dock slightly sharper on the tested body decals; skirt detail appeared the same; wing difference remained uncertain because the wing decals were very large. Treat this as figure-specific visual evidence only.
- Repeated 8192×4096 vs 8192×8192 visual A/B showed no visible body-decal improvement from square 8K. Do not adopt square 8K as the normal body-quality default without new evidence.
- Projected decal location was corrected to `CK.character.data.decals.splatter`. On D4-with-wings, 35 projected entries were present; 9 targeted `bodyLower`, 25 targeted `bodyUpper`, and 8 targeted wing slots through true filter keys. Current active-decal v0.1.0 does not correctly cover these projected hosts.
- Kitbash same-figure drift is confirmed. A kitbash move can clear High Res `atlasScale` policy and downgrade packed allocations while figure identity/part IDs remain unchanged. Earlier capture showed bodyLower/bodyUpper/face allocations 512/512/1024 and all four wings 512 after the reset; a normal core reconcile restored body/head to 2048×2048.
- Bridge #2491 captured a second clean potato state after Amanda touched the figure again: `_needsUpdating=false`, `_inUpdate=false`, resources ready/finished true, atlas 8192×4096, body/head scale entries missing, body `_usedTextureSize` still 2048, wing scale entries missing, wing `_usedTextureSize` still 1024.
- Immediately after #2491, Amanda reported that the figure briefly stayed potato and then fixed itself automatically. The human visual recovery is confirmed; the exact runtime mechanism is not yet proven by Bridge readback.
- A temporary drift-guard probe was installed only for diagnosis and then fully removed. It showed that triggering reconcile while HeroForge still reports an update in progress can hit the existing settle timeout. Existing readiness/settle behavior was not changed.
- No temporary helper remains installed from that drift-guard probe. No runtime source was committed from it.
- Muddy/greenish body-color patches around the right leg/thigh, torso, and one hand remain an unproven visual symptom and must not yet be conflated with the lifecycle bug.

### Next-chat startup / first actions

1. Read `PROJECT_CONTRACT.md` and `ACTIVE_CONTEXT.md`, then only files routed there.
2. Before any mutation, use HF-Chat-Bridge to capture the currently recovered D4-with-wings state: core state, body/head scale + packed allocation, wing scale/source/allocation, active-decal state, atlas dimensions.
3. Reproduce one controlled kitbash move and capture good → potato → automatic recovery. Determine the actual recovery signal/hook instead of inferring from elapsed time.
4. Fix projected `data.decals.splatter[*].filter` host selection in the active-decal service, excluding body/head ownership already handled by the core service.
5. Only after the stable lifecycle signal is proven, add a bounded same-figure drift repair that preserves current readiness checks, polling, retries, settle behavior, snapshots, rollback, and ownership boundaries.
6. Recheck the weird body-color patches after a clean recovery and keep that issue separate unless the evidence ties them together.
7. Run the still-missing real 2–3 figure active-decal extension regression before any Stable promotion.

### Promotion state

Not ready for Stable promotion. `Witch_Scripts` remains untouched. Human visual acceptance is partially positive, but projected-host coverage and same-figure kitbash lifecycle behavior remain open.

**Runtime behavior changed:** no -- documentation/router handoff only.

---

## PFC-2026-09-14-072 -- Smart active-decal live Dev validation

Date: 2026-09-14

### Scope

Documentation/router milestone after exact committed candidate `1da76212b352f6e4e03641d8e3e2c314eff5b111` passed the narrow live single-figure runtime regression. No runtime source or manifest changes in this commit.

### Exact live evidence

- Bridge #2324 failed before Power execution with a local Function `SyntaxError`; readback #2326 confirmed the active-decal extension was still absent and the core runtime remained unchanged before the corrected hot-load.
- Bridge #2327/#2328 hot-loaded the exact commit-pinned v0.1.0 source from `1da76212...`; fetched source size was 13031 bytes, hardware `MAX_TEXTURE_SIZE` was 16384, active atlas budget was 8192×4096, active accessory slots were `k_6`, `k_7`, and `k_9`, and `k_9` verified at scale 4 / used 2048 / baked 2048 / allocation 2048×2048. Core verification remained PASS with no runtime error.
- Bridge #2330/#2331 recreated the confirmed native absent-property baseline for `atlasScale.k_6`, `k_7`, and `k_9`, then reloaded the exact committed extension. All three active accessory slots were promoted to scale 4 and `k_9` returned to 2048×2048 with core verification PASS.
- Bridge #2332/#2333 disabled High Res through the wrapped core lifecycle. Extension ownership cleared and all three accessory `atlasScale` properties restored exactly to absent; core disabled cleanly with no error.
- Bridge #2334/#2335 re-enabled High Res. Session suppression cleared, accessory ownership repopulated, all three scale values returned to 4, and `k_9` returned to 2048×2048 with core verification PASS.
- Bridge #2336/#2337 performed a bounded reversible probe on the real `data.decals.k_9` collection. Temporarily removing the active decal removed `k_9` from policy ownership and dropped its allocation to 1024×1024; restoring the exact original decal property/object re-added policy ownership and returned allocation to 2048×2048. The original decal object identity was preserved and no error remained.
- Final live state is High Res ON, Persistent High Res ON, extension attached, `k_9` at 2048×2048, extension reconcile pending=false, policy dirty=false, and no extension/core runtime error.

### Remaining gates

- Amanda human visual confirmation of the current decal-bearing dress/accessories is still required.
- The new extension's multi-figure path is not yet live-validated because the current scene exposes only the primary figure to the policy. The accepted core multi-figure lifecycle remains protected and is not being reopened.
- Before Stable promotion, run one narrow active-decal extension smoke on a real 2–3 figure scene.
- Do not promote to `Witch_Scripts` without explicit approval after those gates pass.

**Runtime behavior changed:** no -- documentation/router only. Runtime candidate was committed in PFC-071.

---

## PFC-2026-09-14-071 -- Smart active-decal texture priority Dev candidate

Commit `1da76212b352f6e4e03641d8e3e2c314eff5b111` adds core v0.3.5 / `0.3.5-preserve-native-source-floor` and isolated active-decal policy v0.1.0 / `0.1.0-dev-active-decal-scale-policy`. Static validation passed; manifest load order is core service -> active-decal policy -> existing UI. The candidate remains Dev-only pending live/human gates.

---

## PFC-2026-09-14-070 -- Texture Quality beta notice public closeout

The approved notice v0.2.1 was published and Stable-smoke validated. Public Texture Quality service/UI remained the previously accepted v0.3.4 / v0.2.0 state at that closeout.

---

## Prior current preflight

PFC-2026-09-14-069 and earlier detailed records remain preserved in Git history.

# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-15-074 -- Same-figure repair + projected-host Dev candidate

Date: 2026-09-15

### Confirmed diagnosis

- Read-only recovered D4 baseline: High Res enabled/idle, 8192×4096 atlas, bodyLower/bodyUpper/face scale 4 with 2048 sources and 2048×2048 allocations; wing source ceiling remained 1024 with no owned wing scale entries before projected-host repair.
- A leftover temporary `__kwTqKitbashStableGuardProbe` was discovered. Source inspection showed it waited for stable same refs/readiness and then called `reconcile({sceneSync:true})` on persistent core drift.
- Programmatic persisted transform edits did not reproduce potato, narrowing the trigger to the interactive kitbash drag lifecycle.
- A bounded observer around a real human drag captured `character.change` with `transforms` + `atlasScale`, immediate loss of body/head scale policy, renderer transition, and the temporary guard's later `reconcile({sceneSync:true})`. Amanda simultaneously observed brief potato -> automatic recovery.
- Temporary observer and stable guard were removed through Bridge Power; readback confirmed both globals absent and the normal Dev wrapper chain restored.

### Candidate

- New hidden module `texture-quality-same-figure-drift-guard` v0.1.0 / `0.1.0-dev-stable-same-figure-repair`.
- `texture-quality-active-decal-priority` -> v0.1.1 / `0.1.1-dev-projected-host-lifecycle-coordination`.
- Projected selector admits only real current non-core atlas parts selected by literal `data.decals.splatter[*].filter[key] === true`.
- Lifecycle adapter does not own figure membership, does not weaken settle/readiness checks, and does not use HF-Chat-Bridge at runtime. It waits for 1200 ms stable c/data/display/modded/atlas references and renderer signature before a single existing-service reconcile.
- Active-decal policy defers while core scene sync or same-figure repair is pending, preventing projected-host scale writes from masking the drift signal or racing the repair.

### Static checks

- `node --check features/rendering/Texture_Quality_Same_Figure_Drift_Guard.js` -- PASS.
- `node --check features/rendering/Texture_Quality_Active_Decal_Priority.js` -- PASS.
- `python -m json.tool manifest.json` -- PASS.
- Manifest registry IDs unique; load order verified core -> drift guard -> active decal -> UI.
- Local mock regression verified projected host selection and confirmed active-decal policy defers while same-figure repair is pending.

### Remaining live gates

1. Hot-load/reload the exact committed Dev candidate on D4 with wings.
2. Verify the eight projected wing-target hits are represented by actual active wing host slots, without blanket promotion of unrelated parts.
3. Perform one real kitbash drag; confirm potato recovery occurs through the committed guard and ends with body/head 2048×2048, no errors, no repeated reconcile loop.
4. Human-check the previously observed leg/torso/hand muddy-color artifact after clean recovery.
5. Run the still-missing real 2–3 figure active-decal regression.

Stable `Witch_Scripts` is not authorized for promotion and remains untouched.

**Runtime behavior changed:** yes -- Dev candidate only.

---

## Prior current preflight

PFC-2026-09-15-073 and earlier detailed records remain preserved in Git history.

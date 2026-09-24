# Issue #24 Reopen Handoff — HR ON/OFF body visual paint tint change

**Date:** 2026-09-24  
**Status:** OPEN — public v2.0.2 promotion merged, Stable smoke FAILED  
**Canonical Dev:** `WITCH_DEV_MAIN` @ `49206661f6a7c9b155368d937ccb59a2754f3857`  
**Public Stable:** `Witch_Scripts` @ `1b7d45bad6a602ffe6a39d9457b64f7daeca72d8`  
**Public launcher:** v2.0.2 / `2.0.2-issue-24-texture-restore`  
**Texture Quality service:** v0.3.6 / `0.3.6-verify-native-restore-adoption`  
**Separate issue:** #32 — HR body paint zone collapse. Do not merge that scope into #24.

## TLDR

The v0.3.6 restore/adoption candidate passed an earlier Dev visual gate on two fixtures but failed broader public smoke and also reproduces on canonical Dev. #24 is therefore **not resolved**.

The strongest new evidence is not merely the restore warning. High Res activation itself causes HeroForge to request source textures that do not exist on the current runtime, including body mask/AAID and face normal paths at 2048, while Witch Dock's own body-mask preload can also fail on an assumed 1024 source. This can leave fallback/partial generations that later fail native restore/adoption and can visibly tint the body incorrectly.

Do not close #24 and do not delete the v2.0.2 promotion branch yet.

## Confirmed human observations

### Quinn — primary reproducer

- Public Stable v2.0.2 and canonical Dev both reproduce wrong/red body appearance around High Res lifecycle.
- High Res ON does not produce an obvious visible body-resolution improvement on Quinn; UV/body seams remain visibly coarse.
- Disable can report:
  - `primary: bodyLower native color-bake mask was not adopted.`
- Wrong body color can remain after disable even when that warning is not emitted.
- Re-enabling/disabling again can sometimes restore the correct visible body color.
- Turning Persistent on while Quinn is loading also produced a strange red body in one run.

### D4 — known-good/control figure

- High Res ON visibly increases body resolution.
- Disable has intermittently reported:
  - `primary: Native atlas dimensions were not restored.`
- A later reload/retry did not reproduce that exact atlas warning.
- After switching from Quinn while the per-session disable remained active, D4 once loaded with wrong pink upper/lower body color while face remained correct.
- A subsequent enable -> disable cycle restored D4's correct body color, while the bodyLower native color-bake warning could remain.

### Blood Moon / other controls

- Blood Moon reproduced the `bodyLower native color-bake mask was not adopted` warning on disable without an obvious visible skin-color change.
- Another ordinary-skintone curvy-body figure appeared to restore correctly.
- This is therefore fixture/generation sensitive rather than a universal visible failure.

## High-value console evidence

With High Res enabled either persistently on load or manually for the session, current HeroForge `heroforge08.1.10.5` produces a repeatable request/failure family:

- Witch Dock `loadMasks` path:
  - `Resource not loaded - /static/herobundles/bodyLower/humanToes/humanToes_mask_1024.webp`
- HeroForge native requests after High Res policy:
  - `humanToes_mask_2048.webp` -> 404
  - `humanToes_aaid_2048.png` -> 404
  - `human_mask_2048.webp` -> 404
  - `human_aaid_2048.png` -> 404
  - multiple face `*_nrml_2048.webp` -> 404
  - corresponding `Character0 Failed to load` messages

The same family occurs even on a plain default human figure when High Res is enabled.

When High Res is fully disabled and never toggled, the baseline can be near-clean. No-scripts testing produced only the ordinary browser/extension message-port noise.

Lob's HF Core Tweaks is a **separate** error source that can emit thousands of `Invalid decal id undefined` errors. Keep it disabled during #24. It remains tracked separately as low-priority issue #29.

## Code-level lead — investigate first, do not assume final root cause

Current v0.3.6 does two things that now deserve direct scrutiny against actual current HeroForge source availability:

1. `supportedMaskSize(part, s)` assumes the supported body mask source is `min(1024, native bakeSize)`.
   - Current console evidence shows at least `humanToes_mask_1024.webp` can itself fail to load.
   - Therefore native `bakeSize` is not proven to be a reliable proxy for an actually existing mask-source resolution/path.

2. `applyPolicy` forces target parts to `bakeSize = 2048` and promotes `_usedTextureSize` to at least 1024.
   - After High Res activation, HeroForge attempts multiple nonexistent `*_2048` source paths.
   - Determine whether those requests are expected harmless fallbacks or whether they create the partial/fallback generation that later causes the visible tint and restore-verification failures.

Supported inference: the failed source-resolution assumptions and restore/adoption failures may be the same lifecycle family. Do not treat this as proven until runtime snapshots tie the exact failed requests to the bad generation/material bindings.

## Important non-bug / noise

With Persistent enabled, clicking the per-session **Disable High Res** sets the session override and intentionally keeps High Res OFF across figure changes until the user explicitly enables it again or reloads the page. Do not investigate that behavior as a persistence bug.

# Next-session startup

Read only:

1. `PROJECT_CONTRACT.md`
2. `ACTIVE_CONTEXT.md`
3. issue #24 — **HR ON/OFF body visual paint tint change**
4. this handoff

Do not preload old Texture Quality history.

## Clean script isolation after Amanda's restart

Enable only:

- `WITCH DOCK - DEV`
- HF-Chat-Bridge runtime + workbench
- 2000 Kitbash Parts **only because Quinn/heavy fixtures may require it**

Keep OFF for the first diagnostic pass:

- public Stable Witch Dock
- HF Core Tweaks
- Active Decal Priority
- Full Res Decals / other texture tweaks
- ReCK
- slot/extra-slot scripts
- unrelated HeroForge userscripts

If a non-High-Res helper becomes necessary, add it one at a time and record it.

## First diagnostic target

Start with **Quinn**, then D4 as control. Use Amanda's freshly restarted browser state.

For Quinn:

A. Fresh load, Persistent OFF, High Res OFF, wait for native idle.  
B. Enable High Res once.  
C. Disable High Res once.  

For each state capture only a compact targeted snapshot:

- current figure/part IDs for bodyLower/bodyUpper/face;
- native `bakeSize` / `_usedTextureSize`;
- exact `getMaskPath` results at native/current policy state;
- whether each resolved source actually exists/loads and its dimensions;
- actual `masksMapOverride` and color-bake `masksMap` identity/dimensions;
- atlas dimensions and bodyLower/bodyUpper/face allocations;
- display/resource generation identity;
- first distinct failed resource URL(s), deduplicated;
- service state + last verification/restore verification.

Do not dump giant runtime objects.

Then run the same A/B/C matrix on D4 only far enough to explain why D4 usually succeeds while Quinn fails.

## Decision target before editing

Classify which of these is actually first:

1. Witch Dock resolves a nonexistent protected body mask path before the native rebuild.
2. Witch Dock's 2048 source policy causes HeroForge to request unavailable source assets and adopt a fallback/partial generation.
3. Source fallback is harmless, but disable verification races the eventual native material/atlas adoption.
4. Another generation/member transition is replacing the display after the current verification window.

Only after classification should runtime code change.

## Release state

Public v2.0.2 is already merged. Do **not** perform another Stable mutation until a corrected Dev candidate passes:
- Quinn visual restore;
- D4 visual restore;
- one additional control;
- targeted console/resource smoke.

Issue #24 remains open. The public v2.0.2 rollout janitorial closeout is intentionally incomplete because Stable smoke failed.

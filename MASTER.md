# Witch Dock Master

This file tracks the current active state. Detailed historical state remains preserved in Git history.

## Current Branches

- Public Stable: `Witch_Scripts`
- Current public repository head before this Dev change: `f218244b2a6010e4d299ca5641a8d4f6f56f38f9`
- Dev integration branch: `WITCH_DEV_UI`
- Dev parent before this change: `12383ca5a551acb1a6bf330f7cfad8ea68a82ad1`
- Target HeroForge build: `heroforge07.1.9.98`
- HF-Chat-Bridge: private development diagnostics only; never a public runtime dependency.

## Active Booth Runtime Bootstrap Candidate

Feature ID: `booth.runtime-bootstrap`.

Dev module v0.1.0 / build `0.1.0-dev-native-booth-bootstrap` closes the remaining fresh-page circular dependency in saved Booth persistence without modifying the validated Booth v27 tool.

Confirmed root cause:

- a fresh HeroForge page has no `BT` global before HeroForge's gated Booth core is loaded;
- Booth v27 `readSavedBoothConfig()` still gates `CK.data.custom` inspection behind an existing BT runtime;
- therefore saved Booth Persistence can be ON while v27 cannot see the saved figure configuration that would justify creating BT;
- the same missing runtime prevents saved Black Canvas from attaching to the Booth display path on that startup.

Dev bootstrap behavior:

- reads only the existing saved Booth Persistence default key;
- independently inspects character-owned `CK.data.custom` for strong saved Booth signals;
- bare camera data is explicitly insufficient, preserving `+ New Figure` exclusion;
- requires four consecutive 200 ms observations of the same `CK.data` object, mode, and strong-signal signature before acting;
- if BT is absent, loads HeroForge's own same-origin `/gated/booth.js` using the current HeroForge build version discovered from loaded resource URLs;
- requires named `BT.setBoothMode()` and calls the saved mode rather than using minified/runtime-private helpers;
- verifies the native Booth engine becomes enabled;
- reconciles the existing v27 Witch Dock API afterward so default-owned Booth View and saved Black Canvas become active;
- single-flights bootstrap work and exposes diagnostics/dispose through `KW_WD_BOOTH_BOOTSTRAP`;
- does not unload or replace HeroForge runtime code on dispose; disposal stops only module-owned polling.

Static gates passed:

- JavaScript syntax: PASS;
- saved-figure mock: PASS (`portrait` native mode bootstrap + Black Canvas reconciliation);
- fresh-camera-only figure mock: PASS (zero bootstrap attempts).

Live Dev gate remains required before Stable promotion.

Detailed record: `HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md`.

## Black Canvas Display Replay

Feature ID: `booth.black-canvas-display-replay`.

- Dev v0.1.0 was live validated: the formerly reliable white flash no longer reproduced and the user reported it worked perfectly.
- Public Stable contains replay v0.1.1 with the Stable-v24 state fallback; its rendering/replay behavior is unchanged from the validated Dev fix.
- HeroForge native `CK.character.display.update()` remains untouched and always runs; replay occurs immediately after the update.
- the real main-scene background is discovered semantically through named `environment -> background`.

## Booth / Utilities

- Dev Booth: v27.0.0 / build `v27`.
- Dev Utilities: v1.2.1.
- This bootstrap candidate does not edit either runtime file.
- Utilities continues to own saved defaults under `Booth Features`; Booth tab switches remain session overrides.

## Public Loader Cache Issue

A separate public-delivery defect is confirmed:

- `Witch_Dock.user.js` v1.2.0 requests branch-based raw GitHub manifest/module URLs with no durable cache key;
- a live public page remained on an intermediate Stable manifest for more than nine minutes after the branch advanced;
- hard refresh then loaded Booth v27 correctly, proving repository promotion was valid and the stale state was in the loader/cache path.

A public shell cache-busting repair is still required before the current Booth bootstrap candidate can be promoted. Do not confuse this delivery issue with Booth runtime persistence.

## Protected Validated Features

The following remain outside this Dev change:

- `media.screenshot-resolution` — Witch Dock Stable validated TRUE 4K/8K;
- `media.spinny-mini-webp` — validated public/Dev behavior unchanged;
- `decals.gizmo.bound-correction` — Stable validated Move/Rotate/Scale + undo/redo/state preservation;
- JSON, Developer Mode, Decals host, tab ordering, High Res UI/service — unchanged by this bootstrap change.

## Current Gate

1. Enable the Dev loader and disable public Stable for a clean test.
2. Load a figure that already has saved Photo Booth configuration with Utilities Booth Persistence and Black Canvas defaults ON.
3. Refresh HeroForge without opening Photo Booth manually.
4. Expected: saved Booth View activates and Black Canvas is visibly black.
5. Verify the known flash-causing action still does not flash.
6. Verify a fresh `+ New Figure` with no saved Booth configuration does not auto-bootstrap Booth.
7. Only after this passes should the bootstrap be considered for narrow Stable promotion together with the separate loader cache repair.

Historical master state through the prior Dev Black Canvas replay commit remains preserved at `12383ca5a551acb1a6bf330f7cfad8ea68a82ad1`.

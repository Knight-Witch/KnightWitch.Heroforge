# Witch Dock Master

This file tracks the current active state. Detailed historical state remains preserved in Git history.

## Current Branches

- Public Stable: `Witch_Scripts`
- Current public repository head before this Dev change: `f218244b2a6010e4d299ca5641a8d4f6f56f38f9`
- Dev integration branch: `WITCH_DEV_UI`
- Dev baseline before Black Canvas startup candidate: `6cf10845e394676344ebb8699c654009267c6c61`
- Target HeroForge build: `heroforge07.1.9.98`
- HF-Chat-Bridge: private development diagnostics only; never a public runtime dependency.

## Dev Loader Cache Repair

Dev loader v0.5.1 / userscript header 1.0.8.6 gives every page a unique manifest request key and every module a deterministic request key derived from the matching `moduleRegistry` ID/version/build/path plus raw URL. Existing module URL query parameters are preserved.

This repairs the stale branch-based raw GitHub delivery path in Dev without changing module execution order, enablement, or feature runtime code. Public Stable still uses shell v1.2.0 and remains unchanged until Dev live validation.

Static syntax/JSON/cache-identity/blob-preservation gates pass. Live delivery smoke remains required.

## Active Booth Runtime Bootstrap Candidate

Feature ID: `booth.runtime-bootstrap`.

Dev module v0.1.0 / build `0.1.0-dev-native-booth-bootstrap` closes the remaining fresh-page circular dependency in saved Booth persistence without modifying Booth v27.

Confirmed root cause:

- a fresh HeroForge page has no `BT` global before HeroForge's gated Booth core is loaded;
- Booth v27 `readSavedBoothConfig()` still gates `CK.data.custom` inspection behind an existing BT runtime;
- saved Booth Persistence can therefore be ON while v27 cannot see the saved figure configuration that would justify creating BT.

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
- does not unload or replace HeroForge runtime code on dispose.

Static gates passed:

- JavaScript syntax: PASS;
- saved-figure mock: PASS (`portrait` native mode bootstrap + Black Canvas reconciliation);
- fresh-camera-only figure mock: PASS (zero bootstrap attempts).

Live Dev gate remains required before Stable promotion.

Detailed record: `HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md`.

## Black Canvas Display Replay

Feature ID: `booth.black-canvas-display-replay`.

- Dev candidate is v0.1.2 / build `0.1.2-dev-stable-state-plus-pre-bt-background`.
- It preserves the already live-validated post-`CK.character.display.update()` replay that eliminated the reliable white flash.
- It carries forward Public Stable v0.1.1's diagnostic Black Canvas state fallback, so Dev no longer drops that Stable behavior.
- When BT already exists, the validated semantic named `environment -> background` scene path remains preferred.
- Before BT exists, the candidate may use only `CK.environment.background.mesh.visible` as the conservative regular-scene fallback; that exact fresh-start visual mapping is a supported inference pending live Dev validation.
- Black Canvas alone does not bootstrap or enable Booth View.
- HeroForge native `CK.character.display.update()` remains untouched and always runs; replay occurs immediately after the update.
- Black Canvas OFF/dispose restores only replay-owned background visibility.
- Public Stable remains on replay v0.1.1 pending the final Dev smoke.

## Integrated Booth Lifecycle Smoke — 2026-09-07

The first combined startup smoke closed two gates and exposed two downstream lifecycle bugs.

Confirmed PASS:
- saved Booth figure refresh automatically bootstraps/restores Booth View;
- saved Black Canvas restores;
- the validated white-flash fix remains effective;
- Booth lighting/effects/overlay/background component toggles still work.

Confirmed FAIL before this repair:
- `+ New Figure` remained in default-owned Booth because Booth v27 still treated bare camera data as saved Booth;
- with Booth and Black Canvas OFF, the ordinary fantasy editor background could remain hidden, leaving white.

Dev v27.0.1 / replay v0.1.3 are the surgical candidate fixes. Black Canvas remains a separate persistent default: if Black Canvas Across Sessions is ON, a fresh figure may remain black, but it must not remain in Booth View or show the checkerboard Booth backdrop.

## Booth / Utilities

- Dev Booth: v27.0.1 / build `v27.0.1`.
- Dev Utilities: v1.2.1.
- The Booth runtime bootstrap and Black Canvas replay remain separate hidden compatibility features.
- Utilities continues to own saved defaults under `Booth Features`; Booth tab switches remain session overrides.
- Black Canvas Across Sessions and Booth Persistence Across Sessions remain conceptually separate: Black Canvas alone must not force Booth activation.

## Public Loader Cache Issue

A separate public-delivery defect is confirmed:

- `Witch_Dock.user.js` v1.2.0 requests branch-based raw GitHub manifest/module URLs without durable cache keys;
- a live public page remained on an intermediate Stable manifest for more than nine minutes after the branch advanced;
- hard refresh then loaded Booth v27 correctly, proving repository promotion was valid and the stale state was in the loader/cache path.

The corresponding repair is implemented in Dev only. Public shell v1.2.0 still requires a separate narrow v1.2.1 promotion after Dev live validation. Do not confuse this delivery issue with Booth runtime persistence.

## Protected Validated Features

The following remain outside this Dev change:

- `media.screenshot-resolution` — Witch Dock Stable validated TRUE 4K/8K;
- `media.spinny-mini-webp` — validated public/Dev behavior unchanged;
- `decals.gizmo.bound-correction` — Stable validated Move/Rotate/Scale + undo/redo/state preservation;
- JSON, Developer Mode, Decals host, tab ordering, High Res UI/service — unchanged by this Black Canvas startup candidate.

## Current Gate

1. Update/reload the Dev loader with Public Stable disabled.
2. Saved Booth figure + Booth Persistence ON: refresh without opening Photo Booth manually; Booth must restore automatically.
3. `+ New Figure`: after the existing figure-settle window, default-owned Booth View must turn OFF because bare camera data is not a saved Booth setup. If the independent Black Canvas default is ON, the editor may remain black but must not show the Booth checkerboard.
4. Test both shutdown orders: Black Canvas OFF then Booth OFF, and Booth OFF then Black Canvas OFF. With both OFF, the ordinary HeroForge fantasy background must return.
5. Verify the known flash-causing action remains flash-free.
6. Verify Booth lighting/effects/overlays/background sub-toggles still work.
7. Only after this passes should the bootstrap/replay/loader repair be promoted narrowly to Public Stable.

Historical state through the loader cache repair remains preserved at Dev commit `6cf10845e394676344ebb8699c654009267c6c61`.

# Photo Booth True Resolution

Feature ID: `media.screenshot-resolution`  
Public status: Witch Dock Stable promotion 2026-09-05  
Last verified HeroForge build: `heroforge07.1.9.98`  
Source baseline: `Knight-Witch/HeroForge.Compatibility` standalone v0.6

## Purpose

Restore genuine 4096px and 8192px Photo Booth still-image detail while preserving HeroForge's native Booth camera, staging, effects, masks/frame/background, and final compositor.

## Public architecture

The public Witch Dock module wraps the named owning capture boundary `BT.maker.takeScreenshot` and only intercepts square 4096 or 8192 requests. All other resolutions pass directly to the upstream provider.

The visible model/color source is repaired temporarily through named `CK.Effects.renderToCanvas` during the explicit high-resolution capture. No HeroForge bundle patch, `CK.Settings.screenshotSize` mutation, or `CK.Capture.renderToImage` replacement is used.

### TRUE 4K

- Native final request remains 4096x4096.
- One genuine 4096x4096 Effects source is rendered while Booth staging is active.
- Its pixels are distributed into HeroForge's live native phase topology.
- Current tested normal topology is 4x4 / 16 phases at 1024px each.

### TRUE 8K

- Native final request remains 8192x8192.
- One-shot 8192 Effects rendering is deliberately not used for the maintained path because packaged tests repeatedly hit HeroForge's white renderer-reset / blank-output cliff.
- Four shifted 4096x4096 Effects sources cover the four parity groups of the final 8K sample lattice.
- Current tested normal topology is 8x8 / 64 phases at 1024px each.
- No 8192 WebGL Effects target is allocated by the repair.

## Lob coexistence

Current Lob/ADP can remain installed unchanged.

When Lob injects 4096 and 8192 choices into HeroForge's own Photo Booth UI, those choices still issue the native high-resolution screenshot request. Witch Dock intercepts that downstream request and supplies the repaired source data. Users therefore keep the existing HeroForge UI workflow without Lob owning the maintained rasterization repair.

When Lob is absent, Witch Dock's Booth tab provides direct TRUE 4K and TRUE 8K buttons. Injection of the same 4096/8192 choices into HeroForge's own resolution menu without Lob is a separate future UI-adapter task.

## Lifecycle and ownership

- Default state: enabled.
- Persistent provider: owns a reversible wrapper around `BT.maker.takeScreenshot` while enabled.
- Capture-time wrapper: `CK.Effects.renderToCanvas` is wrapped only during a repaired 4K/8K request and restored afterward.
- Concurrent high-resolution capture is blocked.
- Source canvases/pixel groups are released as their assigned phases complete.
- Disable restores the upstream `BT.maker.takeScreenshot` when ownership is still intact.
- If another script replaces the owning function after Witch Dock installs its provider, the feature reports degraded/lost ownership rather than blindly stacking another wrapper.

## Public readiness adapter

The Dev provider can install before Photo Booth opens. Its UI originally evaluated direct-button readiness while `BT.maker.enabled` was false; once provider ownership was healthy, the reconcile loop returned early and did not refresh those button disabled states when Booth later opened.

Public `HeroForge_UI/Photo_Booth_True_Resolution_Readiness.js` is deliberately narrow. It does not touch capture math or provider ownership. Every 500 ms it synchronizes only the direct `.kwPBResBtn` disabled state from current service state, Photo Booth readiness, named Effects availability, active-capture state, and 4096 renderer limits.

## Validation

Standalone baseline:

- TRUE 4K combined v0.6: user visual acceptance passed.
- grouped TRUE 8K combined v0.6: user visual acceptance passed perfectly; reported dramatically easier on GPU than one-shot 8192.

WITCH_DEV_PHOTO integration with current Lob/ADP present:

- Lob-injected HeroForge 4096 choice routed through Witch Dock provider: passed perfectly.
- Lob-injected HeroForge 8192 choice routed through Witch Dock provider: passed perfectly.
- Witch Dock direct TRUE 4K and TRUE 8K buttons: capture behavior passed after cycling the provider toggle.
- Public readiness adapter addresses only that initial stale-disabled-state caveat; syntax check passed before promotion.

## Revalidation triggers

Revalidate when:

- HeroForge build/fingerprint changes materially;
- `BT.maker.takeScreenshot` disappears or changes ownership/shape;
- `CK.Effects.renderToCanvas` disappears or changes shape;
- native tile topology becomes mixed, duplicate, incomplete, non-integral, or otherwise incompatible;
- HeroForge begins supplying a native true-resolution Effects path;
- Painterly/special effect profiles alter the phase geometry or render path;
- provider arbitration changes because Lob or another script adopts a new high-resolution implementation.

## Migration direction

The current public Witch Dock module is the Stable consumer copy of the validated Compatibility feature. When the planned Foundation/shared compatibility repository exists and has versioned stable releases, the capture service should move behind that shared module boundary. Public Witch Dock must depend on a pinned/versioned stable Foundation release rather than an unstable development head.

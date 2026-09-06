# Photo Booth True Resolution

Feature ID: `media.screenshot-resolution`  
Public status: **Witch Dock Stable validated** / 2026-09-05  
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

When Lob is absent, Witch Dock's Booth tab provides direct TRUE 4K and TRUE 8K buttons. Injection of the same 4096/8192 choices into HeroForge's own resolution menu without Lob remains a separate future UI-adapter task.

## Lifecycle and ownership

- Default state: enabled.
- Persistent provider: owns a reversible wrapper around `BT.maker.takeScreenshot` while enabled.
- Capture-time wrapper: `CK.Effects.renderToCanvas` is wrapped only during a repaired 4K/8K request and restored afterward.
- Concurrent high-resolution capture is blocked.
- Source canvases/pixel groups are released as their assigned phases complete.
- Disable restores the upstream `BT.maker.takeScreenshot` when ownership is still intact.
- If another script replaces the owning function after Witch Dock installs its provider, the feature reports degraded/lost ownership rather than blindly stacking another wrapper.

## Public readiness adapter

Public `HeroForge_UI/Photo_Booth_True_Resolution_Readiness.js` build `1.0.0-public-readiness` is deliberately narrow. It does not touch capture math or provider ownership. Every 500 ms it synchronizes direct `.kwPBResBtn` disabled state from current service state, Photo Booth readiness, named Effects availability, active-capture state, and 4096 renderer limits.

## Dev UI presentation adapter

Branch: `WITCH_DEV_UI`.

`features/media/Photo_Booth_True_Resolution_UI.js` build `0.2.0-dev-developer-mode` is a presentation-only candidate over the existing Stable service. It does not reproduce or alter high-resolution capture math.

Normal-user presentation:

- title `High Res Image Capture`;
- one row: `Capture: [4K] [8K]`;
- visible violet hover highlight on enabled buttons;
- idle status `Active — click 4K or 8K to begin image capture`;
- no provider enable/disable checkbox in normal mode;
- no provider/Lob implementation-status line in normal mode;
- no explanatory provider blurb in normal mode.

The adapter calls existing `KWPhotoBoothTrueResolution.capture4096()` / `capture8192()` service methods and reuses the existing `.kwPBResBtn` readiness helper.

### Developer Mode diagnostics

The adapter consumes the shared `KWDeveloperMode` module. While Developer Mode is enabled, the High Res panel additionally exposes:

- `Repair provider enabled` checkbox backed by existing service `enable()` / `disable()` lifecycle;
- UI adapter build;
- capture-service build;
- readiness-adapter build;
- provider state;
- note explaining that enabled HeroForge/Lob square 4096/8192 screenshot requests route through the maintained repair provider.

While Developer Mode is off, those troubleshooting controls/details are hidden and normal capture behavior remains unchanged.

Detailed Developer Mode architecture: `HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md`.

### Temporary Dev migration behavior

The current Stable service registers both behavior and its legacy UI. To avoid rewriting the validated capture engine merely for presentation testing, the Dev adapter re-registers the same `photo-booth-true-resolution` tool ID. Witch Dock removes the old visible container and mounts the compact adapter UI.

The service still retains references to detached legacy UI nodes until reload. This is acceptable for isolated Dev testing but is **not** the intended final Stable architecture. Before promotion, make ownership explicit by suppressing/removing legacy service UI registration or otherwise separating service and UI cleanly.

## Validation

Standalone baseline:

- TRUE 4K combined v0.6: user visual acceptance passed.
- grouped TRUE 8K combined v0.6: user visual acceptance passed perfectly; reported dramatically easier on GPU than one-shot 8192.

WITCH_DEV_PHOTO integration with current Lob/ADP present:

- Lob-injected HeroForge 4096 choice routed through Witch Dock provider: passed perfectly.
- Lob-injected HeroForge 8192 choice routed through Witch Dock provider: passed perfectly.
- Witch Dock direct TRUE 4K and TRUE 8K capture behavior passed.
- Initial direct-button disabled state was isolated to stale UI readiness, not capture behavior.

Public Witch Dock Stable smoke after promotion:

- temporary Dev/standalone test scripts disabled;
- public readiness adapter worked without cycling the repair toggle;
- public HeroForge/Lob 4K route: passed perfectly;
- public HeroForge/Lob 8K route: passed perfectly;
- public Witch Dock direct TRUE 4K route: passed perfectly;
- public Witch Dock direct TRUE 8K route: passed perfectly;
- user reported the public integration works perfectly.

Current Dev UI / Developer Mode candidate:

- High Res UI v0.2.0 local `node --check`: PASS.
- Developer Mode v0.1.0 local `node --check`: PASS.
- live UI/Developer Mode smoke: pending until the active 3072px Spinny capture completes.
- direct 4K/8K regression through compact adapter: pending.
- provider kill-switch disable/enable recovery under Developer Mode: pending.
- default Decals-before-JSON Dev manifest order: pending smoke when Dev manifest is loaded.

Public promotion commit: `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.

## Revalidation triggers

Revalidate when:

- HeroForge build/fingerprint changes materially;
- `BT.maker.takeScreenshot` disappears or changes ownership/shape;
- `CK.Effects.renderToCanvas` disappears or changes shape;
- native tile topology becomes mixed, duplicate, incomplete, non-integral, or otherwise incompatible;
- HeroForge begins supplying a native true-resolution Effects path;
- Painterly/special effect profiles alter the phase geometry or render path;
- provider arbitration changes because Lob or another script adopts a new high-resolution implementation;
- final public UI/service separation changes service initialization or provider registration order.

## Migration direction

The current public Witch Dock module is the Stable consumer copy of the validated Compatibility feature. When the planned Foundation/shared compatibility repository exists and has versioned stable releases, the capture service should move behind that shared module boundary.

Independently of that future Foundation move, Witch Dock UI ownership should be separated from the capture service before the compact Dev presentation is promoted. The UI should consume named service methods/state rather than making the renderer/provider layer own normal-user presentation.

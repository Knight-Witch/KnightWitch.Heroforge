## 2026-09-25 — Issue #83 Dev v1.10.0 launcher

- Dev launcher -> v1.10.0 / `1.10.0-reusable-notifications`.
- Pins immutable payload `a6e38936f30673528e7284127ed8bed42e808f3d`.
- Payload includes the release-ready #58 UI plus the loader-isolated notification service and v2.3.0 wrapper-update notice preview.
- Public Stable remains v2.2.2.

---

## 2026-09-25 — Issue #83 Dev v1.10.0 payload staging

- Dev launcher registry staged at v1.10.0 / `1.10.0-reusable-notifications`.
- Payload includes the accepted #58 typography/UI runtime plus Notifications v0.1.0, Release Notices v0.1.0, and Styles v0.7.0.
- Hidden module count is now 27 total runtime modules.
- Public Stable remains v2.2.2.

---

## 2026-09-25 — Issue #83 reusable notification architecture candidate

- Added `KWWitchDockNotifications` v0.1.0 / `0.1.0-reusable-one-time-notices` as an isolated hidden notification-service module.
- Added `Witch_Dock_Release_Notices.js` v0.1.0 / `0.1.0-v230-wrapper-update` as a hidden release-specific registration module.
- Styles -> v0.7.0 / `0.7.0-notification-overlay`; accepted #58 Core v2.3.0 remains unchanged.
- Generic notices support stable IDs, per-notice acknowledgement, priority queueing, close/Escape handling, optional primary links, and show/dismiss/action acknowledgement timing.
- First release notice targets Stable v2.3.0 and uses `KWWitchDockStableHost.getState().installedWrapperVersion` to distinguish an outdated installed Tampermonkey wrapper from the newer self-hosted runtime.
- The v2.3.0 notice acknowledges on first display and links directly to the canonical public userscript for the one-time installed-wrapper refresh.
- Dev gets a separate one-time preview notice for visual validation; Stable only triggers when installed wrapper < v2.3.0.
- #58 typography/UI is Dev-approved and will ship in the same public release; public Stable remains v2.2.2.

---

## 2026-09-25 — Issue #58 Dev v1.9.6 baseline live gate

- Dev Auto Host resolved canonical head `05425389d24e57b054d3118eeb7c8edf40808167` and executed v1.9.6 with no error.
- Loader passed 25/25 executed, 0 failed, 25 immutable, 0 fallback.
- Live geometry now reports both Polymorph title words ending at y=35.73 and `DEV · v1.9.6` ending at y=35.73: exact requested bottom alignment.
- Public Stable remains v2.2.2; final human visual approval remains pending.

---

## 2026-09-25 — Issue #58 Dev v1.9.6 launcher

- Dev launcher -> v1.9.6 / `1.9.6-title-version-baseline`.
- Pins immutable payload `4d7a92d183515fb59f93685632c2afeec0691a00`.
- Payload carries Styles v0.6.1 with the 3px title/version baseline correction; all other v1.9.5 UI consistency behavior is unchanged.
- Public Stable remains v2.2.2.

---

## 2026-09-25 — Issue #58 Dev v1.9.6 payload staging

- Dev launcher registry staged at v1.9.6 / `1.9.6-title-version-baseline`.
- Payload carries Styles v0.6.1 / `0.6.1-title-version-baseline` on top of the accepted v1.9.5 UI consistency candidate.
- Public Stable remains v2.2.2.

---

## 2026-09-25 — Issue #58 title/version baseline correction

- Witch Dock Styles -> v0.6.1 / `0.6.1-title-version-baseline`.
- Runtime geometry showed the Polymorph title glyphs ending at y=35.73 while `DEV · v1.9.5` ended at y=32.73.
- Moved the version metadata down exactly 3px so its bottom aligns with the title-glyph bottom without changing header height, font size, spacing, or title layout.
- Public Stable remains v2.2.2 pending the final Dev/human gate.

---

## 2026-09-25 — Issue #58 Dev v1.9.5 live UI gate

- Dev Auto Host resolved canonical head `23e003d03824d70d036f988ae00c854461f482b9` and executed v1.9.5 in one attempt with no error.
- Loader passed 25/25 executed, 0 failed, 25 immutable, 0 fallback.
- Bundled Polymorph Bold loaded from immutable payload `1f8333aa0b18bf9d880ccf9fa16ca03ef3102433`.
- Tool tabs render at fixed 30px height; decal-gizmo mode buttons and High Res primary action both render at 30px.
- High Res persistence label now reads `Enabled`; visible section headers render at ~36.9px after reduced vertical padding.
- Brand-title width contracted from ~216.6px to ~199.4px while keeping the 34px emblem box, confirming tighter WITCH/emblem/DOCK spacing.
- Shared dark-scrollbar / purple-hover / purple-checkbox styling is present in Styles v0.6.0; final appearance remains a human visual gate.
- Public Stable remains v2.2.2.

---

## 2026-09-25 — Issue #58 Dev v1.9.5 launcher

- Dev launcher -> v1.9.5 / `1.9.5-ui-standardization`.
- Pins immutable payload `1f8333aa0b18bf9d880ccf9fa16ca03ef3102433`.
- Shared Core/Shell API expectations remain unchanged; Styles v0.6.0 and Texture Quality UI v0.3.0 are payload-delivered.
- Public Stable remains v2.2.2.

---

## 2026-09-25 — Issue #58 Dev v1.9.5 payload staging

- Dev launcher registry staged at v1.9.5 / `1.9.5-ui-standardization`.
- Payload contains Styles v0.6.0 and Texture Quality UI v0.3.0 on top of Core v2.3.0, Shell v0.5.1, and Assets v0.2.0.
- Public Stable remains v2.2.2.

---

## 2026-09-25 — Issue #58 Dock UI consistency candidate

- Witch Dock Styles -> v0.6.0 / `0.6.0-shared-control-theme`.
- Texture Quality Native Reconcile UI -> v0.3.0 / `0.3.0-ui-consistency`.
- Tightened WITCH/emblem/DOCK spacing while retaining the large branded emblem.
- Standardized tool tabs to fixed-height flex centering and compacted section/tool header vertical padding.
- Standardized common text-button typography around 12px semibold system text and 30px control height for High Res, Utilities action buttons, and decal-gizmo mode buttons.
- Added shared purple checkbox accent and purple hover treatment for tabs/common tool buttons.
- Styled the main Dock scrollbar with a dark shell-matching track.
- Aligned High Res persistence row sizing with Utilities and renamed its checkbox label from `Persistent` to `Enabled`.
- Public Stable remains v2.2.2 pending live Dev and human visual gates.

---

## 2026-09-25 — Issue #58 Dev v1.9.4 live gate

- Dev Auto Host resolved canonical head `5ff9534dc152f68267b9db830152f9eae6480960` and executed v1.9.4 in one attempt with no error.
- Loader passed 25/25 executed, 0 failed, 25 immutable, 0 fallback.
- Bundled Polymorph Bold loaded from immutable payload `730794910cd23bb3e3d2fce4d52415b60fe52aeb`.
- Header height is now ~38.9px (previous candidate ~48.9px); title starts 10px from the Dock's left edge; emblem box is 34px; muted Dev/version metadata stays inline after DOCK.
- Tab and common tool-button boxes reflect the revised optical-centering rules.
- Public Stable remains v2.2.2; human visual approval remains pending.

---

## 2026-09-25 — Issue #58 Dev v1.9.4 launcher

- Dev launcher -> v1.9.4 / `1.9.4-compact-left-brand-header`.
- Pins immutable payload `730794910cd23bb3e3d2fce4d52415b60fe52aeb`.
- Shared runtime APIs remain Core v2.3.0 / Shell v0.5.1; visual change is carried by Styles v0.5.2.
- Public Stable remains v2.2.2.

---

## 2026-09-25 — Issue #58 Dev v1.9.4 payload staging

- Dev launcher registry staged at v1.9.4 / `1.9.4-compact-left-brand-header`.
- Payload contains Styles v0.5.2 with the compact left-aligned brand/header refinements on top of Core v2.3.0, Shell v0.5.1, and Assets v0.2.0.
- Public Stable remains v2.2.2.

---

## 2026-09-25 — Issue #58 compact left header refinement

- Witch Dock Styles -> v0.5.2 / `0.5.2-compact-left-brand-header`.
- Left-aligns the branded title with the Dock content instead of centering it.
- Enlarges the emblem box from 20px to 34px while using negative horizontal margins to keep WITCH/DOCK visually tighter rather than widening the title.
- Reduces header vertical padding from 10px/8px to 4px/4px so the larger emblem does not fatten the title bar.
- Pulls muted Dev/version metadata closer to the end of DOCK.
- Tightens global button line-height and adds optical vertical-padding corrections for tabs, Texture Quality buttons, and Utilities action/gizmo buttons.
- Public Stable remains v2.2.2 pending live Dev and human visual gates.

---

## 2026-09-25 — Issue #58 Dev v1.9.3 live gate

- Dev Auto Host resolved canonical head `024602202fc5a2bc77393529a57b30047ab3a54a` and executed v1.9.3 in one attempt with no error.
- Loader passed 25/25 executed, 0 failed, 25 immutable, 0 fallback.
- Bundled Polymorph Bold loaded from immutable payload `47208351d47baec3cc0fa08d6446b37e1b2261c4`.
- Header geometry confirms the 20px emblem, inline muted `DEV · v1.9.3`, vertically centered title row, and a 14px gap before the right-side window controls.
- Public Stable remains v2.2.2; human visual approval remains pending.

---

## 2026-09-25 — Issue #58 Dev v1.9.3 launcher

- Dev launcher -> v1.9.3 / `1.9.3-title-alignment-fix`.
- Pins immutable payload `47208351d47baec3cc0fa08d6446b37e1b2261c4`.
- Expected Shell updated to v0.5.1 / `0.5.1-inline-version-title-alignment`.
- Public Stable remains v2.2.2.

---

## 2026-09-25 — Issue #58 Dev v1.9.3 payload staging

- Dev launcher registry staged at v1.9.3 / `1.9.3-title-alignment-fix`.
- Payload contains Shell v0.5.1 and Styles v0.5.1 on top of Core v2.3.0 / Assets v0.2.0.
- Public Stable remains v2.2.2.

---

## 2026-09-25 — Issue #58 title/alignment refinement

- Witch Dock Shell -> v0.5.1 / `0.5.1-inline-version-title-alignment`.
- Witch Dock Styles -> v0.5.1 / `0.5.1-title-button-alignment`.
- Enlarged the embedded Witch Dock emblem from 14px to 20px.
- Moved Dev/version metadata from the lower line to immediately after the branded `WITCH [emblem] DOCK` title.
- Centered the title group within the header space left of the window controls to avoid overlap at the default Dock width.
- Applied shared inline-flex alignment and line-height to Dock buttons so text sits vertically centered.
- Public Stable remains v2.2.2 pending the live/human gate.

---

## 2026-09-25 — Issue #58 Dev v1.9.2 launcher

- Dev launcher -> v1.9.2 / `1.9.2-title-typography-refine`.
- Pins immutable payload `766641726eb785f51c8c6af342341b089cd46868`.
- Expected shared APIs updated to Shell v0.5.0 / `0.5.0-centered-brand-title-emblem` and Core v2.3.0 / `2.3.0-branded-title-meta`.
- Public Stable remains v2.2.2.

---

## 2026-09-25 — Issue #58 Dev v1.9.2 payload staging

- Dev launcher registry staged at v1.9.2 / `1.9.2-title-typography-refine`.
- Payload contains Core v2.3.0, Shell v0.5.0, Styles v0.5.0, and existing Assets v0.2.0 with bundled Polymorph Regular/Bold.
- No public Stable change.

---

## 2026-09-25 — Issue #58 typography refinement candidate

- Witch Dock Core -> v2.3.0 / `2.3.0-branded-title-meta`.
- Witch Dock Shell -> v0.5.0 / `0.5.0-centered-brand-title-emblem`.
- Witch Dock Styles -> v0.5.0 / `0.5.0-brand-title-readable-controls`.
- Main brand title now renders as centered, larger, letter-spaced `WITCH [emblem] DOCK` using Amanda's bundled Polymorph display face.
- Dev/version metadata moves to a small muted line under the brand title; the existing header height is preserved.
- Polymorph is removed from tabs/section/tool/modal headings. Those surfaces use the existing system stack at a lighter semibold weight, larger header sizing, modest letter spacing, and uniform uppercase.
- Text buttons and prominent labels receive system-font/lighter-weight overrides so existing tool-local 700/800 weights do not reproduce the heavy legacy look.
- Public Stable remains v2.2.2 pending live Dev and human visual gates.

---

## 2026-09-25 — Issue #32 public v2.2.2 closeout

- Public Stable v2.2.2 / `2.2.2-issue-32-body-aaid-binding` is live at `d2d2298e1949da71d64bb11e880f5af6868809f8`, payload `1a586ec3540138694b2342a5fd074b5ec4b1a8e5`.
- Stable loader smoke passed 23/23 with immutable=23, fallback=0, failed=0.
- Stable Half Dragon smoke verified real 1024 upper/lower body AAIDs with 2048 allocations under HR ON; native OFF restore passed and rebound real 512 body AAIDs.
- Human and Robot visual gates passed before promotion; Robot/Human/Canine structural Dev regressions passed.
- #32 divergence removed; Dev v0.4.1 remains the issue #35 diagnostic superset of shipped Stable v0.3.8.
- Issue #58 resumes as active Dev work. Exact #32 branch deletion is routed through `docs/BRANCH_DELETION_HANDOFF_ISSUE_32_2026-09-25.md`.

---

## 2026-09-25 — Issue #32 automated Dev structural gate

- Canonical Dev v1.9.1 / payload `9aed4edee07e9ca746b6e49a8a8bf071e50fd996`: loader PASS 25/25, failed=0, immutable=25, fallback=0.
- Robot `59568049`: HR ON verification PASS with 2048 body allocations, supported real body AAIDs, pinned masks, and coherent atlas ownership; HR OFF native restore PASS and native `paints.getAAID` ownership restored.
- Human `59567957`: HR ON verification PASS with bodyLower/bodyUpper/face 2048 allocations and real 1024/1024/2048 AAID bindings.
- Human remains HR ON for Amanda's visual paint-zone confirmation. Public Stable remains unchanged.

---

## 2026-09-25 — Issue #32 canonical Dev v1.9.1 pin

- Dev launcher advanced to v1.9.1 / `1.9.1-issue-32-body-aaid-binding`.
- Immutable payload pinned to `9aed4edee07e9ca746b6e49a8a8bf071e50fd996`.
- Payload requires Texture Quality Native Reconcile v0.4.1 / `0.4.1-supported-body-aaid-binding`.
- Public Stable remains v2.2.1; next gate is live Robot/Human AAID/allocation/restore validation and Amanda's visual paint-zone check.

---

## 2026-09-25 — Issue #32 Dev v1.9.1 payload staging

- Staged canonical Dev launcher registry v1.9.1 / `1.9.1-issue-32-body-aaid-binding`.
- Payload includes Texture Quality Native Reconcile v0.4.1 / `0.4.1-supported-body-aaid-binding` with supported body AAID selection while retaining 2048 destination allocations.
- Public Stable remains v2.2.1; #58 Polymorph assets/styles remain staged and unchanged.
- Next step is immutable launcher pin + live Robot/Human structural validation.

---

## 2026-09-25 — Issue #32 supported body AAID candidate

- Texture Quality Native Reconcile -> v0.4.1 / `0.4.1-supported-body-aaid-binding`.
- Preloads each body's supported AAID at its native body source ceiling (capped at 1024px) instead of allowing the protected 2048 atlas allocation to select unavailable 2048 body AAIDs.
- Wraps native `paints.getAAID` only while High Res owns the session; each body lookup temporarily reports its supported AAID size through `getTextureSize`, then restores that method synchronously.
- Keeps 2048 body bake/atlas allocations, supported mask pinning, native paint/channel data, and #24 restore ownership unchanged.
- Public Stable remains v2.2.1; #58 font assets/styles are untouched. Next gate is live Robot/Human structural validation plus Amanda's visual paint-zone check.

---

## 2026-09-25 — Issue #58 canonical Dev v1.9.0 pin

- Dev launcher advanced to v1.9.0 / `1.9.0-polymorph-display-fonts`.
- Immutable payload pinned to `858416a37a31df48454f71c5a2493ddc733b5e7b`.
- Launcher expectation advanced to Witch Dock Assets v0.2.0 / `0.2.0-polymorph-display-fonts`.
- Public Stable remains v2.2.1; next gate is live Dev font loading + Amanda visual approval.

---

## 2026-09-25 — Issue #58 Dev v1.9.0 payload staging

- Staged canonical Dev launcher registry v1.9.0 / `1.9.0-polymorph-display-fonts`.
- Payload contains full-source Polymorph Regular/Bold assets, Assets v0.2.0, and Styles v0.4.0.
- Body typography remains unchanged; Public Stable remains v2.2.1.
- Next step is immutable payload pin and live Dev font-load/visual validation.

---

## 2026-09-25 — Issue #58 Polymorph display-font candidate

- Recovered Amanda's full-source Polymorph Regular and Bold TTFs and verified them against Polymorph's recorded source SHA-256 identities.
- Bundled both faces under Witch Dock core assets; Bold is the initial display face and Regular remains available for a later weight switch.
- Assets -> v0.2.0 / `0.2.0-polymorph-display-fonts`; font-face URLs derive from the immutable channel payload root.
- Styles -> v0.4.0 / `0.4.0-polymorph-display-typography`; Polymorph applies only to Dock title, tab labels, section/tool headings, and About/Disclaimer titles.
- Existing body copy/system-font stack is unchanged.
- Public Stable remains v2.2.1; #32/#34 are untouched.

---

## 2026-09-25 — #41 deletion handoff finalized

- Added final temporary closeout ref `wd/41-release-closeout` @ `acb37dbbd4a7ef14cd8f8676d44a40ad1de4ee5d` to the #41 branch-deletion handoff.
- Documentation only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-25 — Issues #37/#41 release closeout

- Public Stable v2.2.1 is live at `50b22b3f9d8bf030f958b5372e008bca5404fa1d`, payload `d2be75fbab7a76a9833debe5145d7dd9e8e8b831`.
- Stable self-host resolved the current canonical head with `local-wrapper-current`, error=null; loader passed 23/23, failed=0, immutable=23, fallback=0.
- Canonical Dev v1.8.0 / payload `b4bd42695ab5280f723290525aa0b8f0e9b83dbf` passed through Dev Auto Host v0.2.0; loader passed 25/25, failed=0, immutable=25, fallback=0.
- Amanda visually passed the final RC Dock reset and resize-border double-click behavior; the exact RC head was promoted.
- Removed resolved #37/#41 entries from DEV_DIVERGENCES and advanced the Stable baseline.
- Added exact branch-deletion handoffs for #37 and #41; branch deletion remains mechanical janitorial work.
- #32/#34 remain untouched and #32 remains paused.

---

## 2026-09-25 — Issue #41 canonical Dev v1.8.0 pin

- Dev launcher advanced to v1.8.0 / `1.8.0-resize-border-reset`.
- Immutable payload pinned to `b4bd42695ab5280f723290525aa0b8f0e9b83dbf`.
- Launcher expectations now require Shell v0.4.0 and Core v2.2.0.
- Final live gate will verify normal drag-resize remains intact and both resize surfaces double-click through the existing reset behavior.

---

## 2026-09-25 — Issue #41 Dev v1.8.0 payload staging

- Staged canonical Dev launcher registry v1.8.0 / `1.8.0-resize-border-reset`.
- Payload includes Shell v0.4.0, Core v2.2.0, and Styles v0.3.0 for the double-click resize-border reset affordance.
- Interactions remains v0.6.0; the existing reset implementation is reused unchanged.
- Next step is to pin the Dev launcher to this immutable canonical payload.

---

## 2026-09-25 — Issue #41 resize-border reset affordance

- Added double-click reset behavior to both existing Dock resize surfaces: bottom edge and bottom-right corner.
- Both gestures call the existing `KWWitchDockInteractions.resetDockSize()` path used by Utilities Reset Size; reset semantics, persistence, position preservation, and telemetry remain single-owned by Interactions.
- Added the hover hint: `Double click border to reset dock size.`
- Shell -> v0.4.0 / `0.4.0-resize-border-reset`.
- Core -> v2.2.0 / `2.2.0-resize-border-reset`.
- Styles -> v0.3.0 / `0.3.0-resize-border-reset-tooltip`.
- Interactions remains v0.6.0 because its reset implementation is reused unchanged.
- #32/#34 High Res runtime and diagnostics remain untouched.

---


## 2026-09-25 — Issue #41 Dev live gate PASS

- Dev Auto Host v0.2.0 resolved canonical `WITCH_DEV_MAIN` head `4083e846691290da2288e1017f6d03777dd8dabf` through GitHub's ref API and fetched the launcher from that immutable SHA.
- WITCH DOCK - DEV v1.7.0 loaded payload `b38c7e4077cd0d10f6ee1aec27c541b8d4604d23`.
- Loader completed 25/25 executed, 0 failed, immutable=25, fallback=0.
- Core v2.1.0 is running; Dock geometry remains 380×520 CSS with one root/compact.
- Dev title remains `WITCH DOCK - DEV v1.7.0` without duplicate version text.
- Header Disclaimer button is absent. About contains a visible Disclaimer button and Version: 1.7.0; Disclaimer opens correctly from About.
- Reset Size remains present in Utilities.
- High Res issues #32/#34 remain untouched.

---

## 2026-09-25 — Issue #41 live-smoke handoff

- Canonical Dev launcher is v1.7.0, pinned to immutable payload `b38c7e4077cd0d10f6ee1aec27c541b8d4604d23`.
- Dev Auto Host v0.2.0 is published on `wd/dev-auto-host` with branch-head -> immutable-launcher resolution.
- Public RC PR #51 is v2.2.0 with self-refreshing Stable delivery, runtime version in the Stable title bar, and Disclaimer moved into About.
- Stable self-host static harness passed legacy-branch local fallback, compatible older-version downgrade refusal, and compatible newer-version remote dispatch.
- #32/#34 remain paused and untouched.

---

## 2026-09-25 — Issue #41 canonical Dev v1.7.0 pin

- Dev launcher advanced to v1.7.0 / `1.7.0-issue-41-delivery-header`.
- Immutable payload pinned to canonical commit `b38c7e4077cd0d10f6ee1aec27c541b8d4604d23`.
- Launcher expectations now require Modals v0.2.0, Shell v0.3.0, and Core v2.1.0.
- High Res runtime scope remains untouched.

---

## 2026-09-25 — Issue #41 Dev v1.7.0 payload staging

- Staged canonical Dev launcher registry v1.7.0 / `1.7.0-issue-41-delivery-header`.
- Payload contains Shell v0.3.0, Modals v0.2.0, Core v2.1.0, and Styles v0.2.0 for header-version visibility and Disclaimer-in-About behavior.
- High Res issue #32/#34 runtime files remain untouched.
- Next step is to pin the Dev launcher to this canonical immutable payload.

---

## 2026-09-25 — Issue #41 update-delivery/header maintenance candidate

- Added a dedicated compact runtime-version slot beside the Witch Dock title; Stable will show its version there while Dev keeps its existing versioned title without duplication.
- Removed the Disclaimer button from the Dock header and retained Disclaimer access inside About.
- Staged Shell v0.3.0, Modals v0.2.0, Core v2.1.0, and Styles v0.2.0.
- This maintenance is isolated from paused High Res issues #32/#34.
- Dev Auto Host immutable-head resolution and Stable self-refreshing launcher delivery are the remaining #41 implementation pieces.

---

## 2026-09-25 — Issue #37 canonical Dev v1.6.1 pin

- Dev launcher advanced to v1.6.1 / `1.6.1-issue-37-version-meta`.
- Immutable payload pinned to canonical commit `c050a600d878a834656fbb04fad747c24c50ec53`.
- Payload contains Utilities v1.3.1 and Reset Dock Size subtool v1.0.0 Developer Mode metadata.
- No High Res runtime files changed.

---

## 2026-09-25 — Issue #37 Dev v1.6.1 payload staging

- Staged canonical Dev launcher registry v1.6.1 / `1.6.1-issue-37-version-meta`.
- Payload includes Utilities v1.3.1 and Reset Dock Size subtool v1.0.0 metadata.
- No High Res runtime files changed.
- Next step is an immutable launcher pin to this canonical payload.

---

## 2026-09-25 — Issue #37 version metadata refinement

- Utilities now explicitly reports v1.3.1 / `1.3.1-dock-size-reset-version-meta` to Developer Mode instead of relying only on manifest fallback.
- Reset Dock Size carries subtool version v1.0.0, rendered inside Utilities only while Developer Mode is enabled.
- Normal Utilities presentation is unchanged while Developer Mode is off.
- This remains issue #37 scope only; repository-wide version-display normalization is deferred to issue #42.
- High Res issues #32/#34 are untouched.

---

## 2026-09-25 — Issue #37 Dev live gate PASS

- Dev Auto Host v0.1.1 loaded Witch Dock Dev v1.6.0 with Interactions v0.6.0 and Utilities v1.3.0.
- Seeded the prior bad persisted Dock state at 500×966 and verified the Reset Size control was visible in Utilities.
- Invoked the actual Reset Size button through HF-Chat-Bridge: live Dock returned to 380×520, persisted prefs returned to 380×520, and position remained x=954 / y=261.
- Interactions telemetry recorded one resetDockSize call.
- Reload persistence PASS: Dev returned at 380×520 with the reset button still present.
- Initial raw-branch propagation briefly served v1.5.9; a later Auto Host fetch resolved v1.6.0 without host changes.
- Public Stable remains unchanged pending explicit promotion.

---

## 2026-09-25 — Issue #37 canonical Dev launcher pin

- Canonical Dev launcher bumped to v1.6.0 / `1.6.0-issue-37-dock-size-reset`.
- Launcher now pins immutable payload `67f06a0e691c4a96a71c83258fac8130df73b950` containing Interactions v0.6.0 and Utilities v1.3.0.
- Launcher compatibility expectation updated for Witch Dock Interactions v0.6.0.
- Public Stable remains unchanged; live Dev smoke is the remaining gate.

---

## 2026-09-25 — Issue #37 dock default-size reset candidate

- Added a Utilities → Witch Dock → Reset Size control targeting the canonical 380×520 Dock dimensions.
- Added Interactions-owned reset logic so the live in-memory preferences and persisted size are updated together; Dock position is preserved.
- Reset clears the current computed minimum-width cache back to the 260px baseline so a stale oversized minimum cannot block the 380px reset.
- Bumped Witch Dock Interactions to v0.6.0 and Utilities to v1.3.0; staged Dev launcher v1.6.0 metadata for the immutable payload handoff.
- Public Stable unchanged; live Dev validation pending.

---

## 2026-09-24 — Issue #35 final canonical smoke / route back to #32

- Confirmed Dev Auto Host loaded canonical launcher v1.5.9 / `1.5.9-issue-35-integrated` from payload `c4fe7ef7f6307578823706de552b44b8a2a378dd`.
- Final loader smoke PASS: 25/25 executed, 0 failed, immutable=25, fallback=0.
- High Res Diagnostics v0.1.3 loaded successfully and its UI is registered under Utilities.
- #35 and superseded PR #36 are closed; `ACTIVE_CONTEXT.md` routes active work back to #32.
- Added exact cleanup handoff for temporary branch `wd/35-hr-diagnostic-capture`.
- Public Stable remains untouched.

---

## 2026-09-24 — Issue #35 final payload-sync correction

- Corrected the v1.5.9 Dev launcher payload pin from `904dd039d5e05511ab9d3737622991fd9970c5bb` to synchronized canonical payload `c4fe7ef7f6307578823706de552b44b8a2a378dd`.
- The corrected payload is the integrated runtime plus the matching v1.5.9 launcher registry metadata; diagnostic runtime code is unchanged.
- Public Stable remains untouched.

---

## 2026-09-24 — Issue #35 High Res Diagnostic Capture v1 complete

- Integrated High Res Diagnostic Capture v0.1.3 and its Utilities UI into canonical Dev.
- Texture Quality advanced to v0.4.0 only for the additive read-only diagnostic-state seam; rendering/reconcile behavior is unchanged by #35.
- Final integrated Dev launcher is v1.5.9, pinned to immutable payload `c4fe7ef7f6307578823706de552b44b8a2a378dd`.
- Final smoke PASS: loader 25/25, 0 failed, immutable=25, fallback=0; Diagnostics v0.1.3 and Utilities registration present.
- Standard Current State capture passed non-mutation verification.
- Controlled Native OFF → High Res ON comparison passed on #32 Robot fixture and restored the original OFF state.
- Added addressable comparison-section retrieval so Bridge/GPT can fetch targeted OFF/ON evidence without serializing an oversized full snapshot.
- #32 remains a separate active bug; Robot observations made during #35 validation are not a completed root-cause diagnosis.
- Public Stable remains untouched.

---

## 2026-09-24 — Canonical Dev launcher v1.5.9 for integrated High Res diagnostics

- Repinned Dev Auto Host to canonical-main payload `904dd039d5e05511ab9d3737622991fd9970c5bb` containing the validated #35 runtime integration.
- Launcher advanced to v1.5.9 / `1.5.9-issue-35-canonical-diagnostics`.
- This removes the temporary dependency on the task-branch payload; public Stable remains untouched.
- Final gate: one Auto Host reload with 25/25 modules and Diagnostics v0.1.3.

---

## 2026-09-24 — Canonical Dev launcher v1.5.8 for diagnostics v0.1.3

- Advanced canonical Dev launcher to v1.5.8 / 1.5.8-issue-35-hr-diagnostics-v013.
- Pinned exact immutable task payload ed32c18edfa5b16619870c1ef5cc07bff4786d49 containing High Res Diagnostics v0.1.3.
- v0.1.2 live gates already passed loader 25/25, Robot comparison, restoration, and read-only capture non-mutation.
- Next gate: reload via Dev Auto Host, then prove addressable Native OFF / High Res ON section retrieval.
- Public Stable remains untouched.

---
## 2026-09-24 — Canonical Dev launcher v1.5.7 for diagnostics v0.1.2

- Advanced canonical Dev launcher to v1.5.7 / `1.5.7-issue-35-hr-diagnostics-v012`.
- Pinned exact immutable task payload `e3ce6c5a344a883e6e8e0d1b2f1de1a02a794bff` containing High Res Diagnostics v0.1.2.
- Prior Robot state was restored OFF and native restore verification passed before this repin.
- Public Stable remains untouched.

---

## 2026-09-24 — Canonical Dev launcher v1.5.6 for diagnostics v0.1.1

- Advanced Dev Auto Host target launcher to v1.5.6 / `1.5.6-issue-35-hr-diagnostics-v011`.
- Pinned exact immutable task payload `5dbccc5fc6406f2838613eecb5aa572ff3f1f0fb` containing High Res Diagnostics v0.1.1.
- Prior v0.1.0 live startup gate passed 25/25 modules with zero failures; v0.1.1 corrects Bridge return/section selection only.
- Public Stable remains untouched.

---

## 2026-09-24 — Canonical Dev launcher v1.5.5 for issue #35 live validation

- Advanced the fixed-name Dev launcher to v1.5.5 / `1.5.5-issue-35-hr-diagnostics`.
- Pinned exact unmerged issue payload `25275c35ac8e54a691e2c3a4d152889700e51d79` so Dev Auto Host can live-validate the task branch before merge.
- Payload contains Texture Quality v0.4.0 plus High Res Diagnostics service/UI v0.1.0 and schedules 25 modules.
- Public Stable remains untouched; #32 remains a validation fixture rather than implementation scope.
- Next gate: reload through Dev Auto Host and require 25/25 immutable module execution with zero failures.

---

## 2026-09-24 — Issue #24 public v2.0.3 Stable smoke / Dev reconciliation

- Public Stable v2.0.3 is live from immutable payload `caef7c8b54c695934f26b1cc88ee2c79df7d65b1`; live loader smoke passed 23/23 executed, 0 failed, immutable=23, fallback=0.
- Texture Quality Native Reconcile is v0.3.7 / `0.3.7-refresh-native-color-bake`; Amanda confirmed the scoped Stable ON→OFF body-tint result is visually correct.
- Captured an intermittent post-disable native-mask adoption warning during smoke and split it to issue #34 rather than reopening resolved #24.
- Reconciliation PASS: Dev/Stable Texture Quality blob is identical; all 36 shared non-launcher runtime JS/CSS blobs match; normalized the Texture Quality registry provenance label; removed #24 from `DEV_DIVERGENCES.json`; Stable baseline advanced to v2.0.3.
- Added exact six-ref branch deletion handoff `docs/BRANCH_DELETION_HANDOFF_ISSUE_24_2026-09-24.md`.
- No runtime/module behavior changed by this closeout commit; manifest provenance metadata and project/release records only.

---

## 2026-09-24 — Canonical Dev launcher v1.5.4 for issue #24

- Advanced the fixed-name Dev launcher to v1.5.4 / `1.5.4-issue-24-colorbake-restore`.
- Pinned exact immutable payload `6aee7fd8716d986e39b7415cf8927fa7043e776b`, containing Texture Quality Native Reconcile v0.3.7 / `0.3.7-refresh-native-color-bake`.
- Public Stable and #32 remain untouched.
- Next gate: reload through Auto Host and run Quinn/D4 ON-to-OFF output-hash regression.

---

## 2026-09-24 — Issue #24 native color-bake restore repair

- Reproduced Quinn's intermittent wrong OFF body tint with native atlas, source sizes, masks, AAIDs, gradients, paint hashes, and restore verification all structurally correct.
- Isolated the remaining fault to HeroForge's body color-bake cache: `colorBake.invalidateCache()` plus `colorBake.refresh(true)` restored both body slots byte-for-byte to the fresh OFF baseline while face remained unchanged.
- Advanced Texture Quality Native Reconcile to v0.3.7 / `0.3.7-refresh-native-color-bake`; restore now forces that bounded color-bake refresh after native source/material adoption and verifies that every adopted figure completed it.
- Public Stable remains untouched; #32 remains separate.

---

## 2026-09-24 — #24 failed broader Stable smoke; reopen handoff

- Public v2.0.2 promotion remains merged, but broader human Stable smoke reproduced wrong body tint/restore failures on Quinn and intermittent restore warnings on D4/Blood Moon; #24 remains open.
- Canonical Dev was not changed by the public promotion and reproduces the Quinn failure family as well.
- Current HeroForge 08.1.10.5 High Res activation produces failed assumed 1024 body-mask loads plus native 2048 mask/AAID/normal 404s; this is now the first diagnostic lead.
- Added compact restart/new-chat handoff `docs/investigations/ISSUE_24_REOPEN_HANDOFF_2026-09-24.md` and routed ACTIVE_CONTEXT to it.
- #32 HR body paint zone collapse remains separate.
- Documentation only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-24 — Canonical Dev launcher v1.5.3 for issue #24

- Advanced the fixed-name Dev launcher to v1.5.3 / `1.5.3-issue-24-texture-restore`.
- Pinned exact immutable payload `74b8fc9c08cd816f4b50919aeee46f751fb1975c`, which contains the validated Texture Quality Native Reconcile v0.3.6 repair and otherwise preserves the canonical Dev baseline.
- Public Stable remains untouched.
- Next gate: merge this launcher integration, reload through Auto Host, and verify the live runtime reports launcher v1.5.3, payload `74b8fc9c08cd…`, Texture Quality v0.3.6, a healthy loader, and settled native OFF state.

---

## 2026-09-24 — Dev payload v1.5.3 prepared for issue #24

- Prepared the immutable Dev payload containing the validated Texture Quality Native Reconcile v0.3.6 / `0.3.6-verify-native-restore-adoption`.
- Amanda's human visual gate passed after all nine required fixtures passed static, mocked, and live Bridge validation.
- Advanced only the Dev launcher registry identity to v1.5.3 / `1.5.3-issue-24-texture-restore`; the canonical launcher pin follows in the next commit.
- Public Stable remains untouched.

---

## 2026-09-23 — Issue #24 native restore-adoption repair candidate

- Classified all required Robot, Human, Canine, Half Dragon, AAT75R, and Lob fixtures as a deterministic Texture Quality ON-to-OFF restore-generation failure: model hashes and native atlas allocations restore, while promoted `_usedTextureSize` values and body material masks remain stale.
- Added Texture Quality Native Reconcile v0.3.6 / `0.3.6-verify-native-restore-adoption`.
- Disable and failed-enable rollback now reapply captured native source sizes to the adopted native display generation, rebuild native color materials, and verify atlas, allocation, source-size, and body-mask invariants before reporting successful restoration.
- Added `lastRestoreVerification` to the service diagnostic state and recorded issue #24 as the current Dev runtime divergence pending live and human visual validation.
- Public Stable remains unchanged.

---

## 2026-09-23 — Add compact #24 stop-condition guard

- Added a short blocker-proof rule so Work does not stop on connector assumptions, OS focus, document visibility alone, one timeout, or transient renderer state.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-23 — Correct #24 background/visibility handling

- Clarified that HF-Chat-Bridge background capability is independent of which desktop app has OS focus.
- Document visibility is now treated as diagnostic renderer state, not a routine stop condition.
- Live background proof: while Amanda remained in Discord, Bridge readback recovered to coherent native state and timing probe #3109 reported visible document state with active animation-frame progression.
- Work must not ask Amanda to foreground HeroForge merely because another application has focus.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-22 — Correct Work HF-Chat-Bridge access model

- Clarified that HF-Chat-Bridge is a GitHub-mailbox transport, not a ChatGPT plugin/connector.
- Added binding Work instructions not to treat absence from the callable-tool/plugin inventory as a blocker.
- Live `bridge.ping` proof through `Knight-Witch/HF-Chat-Bridge#3049` passed on Bridge v0.4.0 with page context, DEV writes, workbench, and pump all healthy.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-22 — Add interruption-safe Work execution to issue #24

- Added bounded fixture phases and compact durable checkpoints so interrupted Work runs resume without repeating completed regression work.
- Added readback-before-retry rules for uncertain Bridge mutations.
- Added efficiency rules: reuse one compact snapshot, diff after baseline, deduplicate errors, avoid history preload, and avoid routine narration turns.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-22 — Clarify issue #24 fixture identity

- Added an explicit fixture-identity rule to the #24 Work plan: Amanda's URL + fixture label is authoritative for navigation; exported JSON metadata/config IDs are supporting channel-map evidence and may reflect reused/edited source figures.
- Updated `ACTIVE_CONTEXT.md` date to the current 2026-09-22 investigation state.
- Documentation-only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-22 — Expand issue #24 color-channel regression evidence and Work plan

- Added AAT75R anthro atlas-shift fixtures, controlled human/robot/canine/half-dragon channel fixtures, and Lob ON->OFF restore-drift cases to issue #24.
- Added `docs/investigations/ISSUE_24_TEXTURE_REGRESSION_PLAN_2026-09-22.md` with a staged, compact Bridge-first diagnostic matrix designed to distinguish model paint mutation, mask/channel rebake failure, stale display/material ownership, and disable-only restore sequencing.
- Robot is first priority because it supplies the highest channel-count signal; Human is the simplest explicit expected-color baseline.
- Created low-priority issue #29 for Lob Core Tweaks console-error flooding so external-script noise does not contaminate #24.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-22 — Complete issue #20 branch-deletion closeout

- Verified Work deleted exactly the four temporary issue #20 refs.
- Verified the repository now contains exactly the six protected branches.
- Removed the stale pending-deletion note from `ACTIVE_CONTEXT.md`.
- Marked the canonical issue #20 branch-deletion handoff COMPLETE and the earlier release-specific handoff historical/superseded.
- Issue #24 remains the active task.
- Documentation-only closeout; no runtime/module/manifest/public behavior changed.

---

## 2026-09-21 — Standardize completed-issue branch deletion handoffs

- Added `docs/BRANCH_DELETION_HANDOFF_ISSUE_20_2026-09-21.md` with the exact four-ref issue #20 DELETE set, six-ref protected KEEP set, reachability proof, expected final inventory, and ready-to-run Work prompt.
- Made branch deletion handoffs a binding closeout requirement whenever a completed issue leaves temporary refs and the current executor cannot delete them directly.
- Updated `DEV_WORKFLOW.md` with the reusable issue-closeout procedure and routed the current janitorial note to the handoff.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-21 — Standardize post-release branch deletion handoffs

- Added `docs/RELEASE_BRANCH_DELETION_HANDOFF_ISSUE_20_2026-09-21.md` with the exact four issue #20 DELETE refs and exact six-branch KEEP inventory for Work.
- Added reusable `docs/templates/RELEASE_BRANCH_DELETION_HANDOFF_TEMPLATE.md` so future public releases generate the same mechanical cleanup handoff whenever branch deletion is unavailable in the active chat/tool surface.
- Updated `PROJECT_CONTRACT.md` and `DEV_WORKFLOW.md` to make release-branch deletion handoffs part of mandatory post-promotion janitorial closeout.
- Routed the current #20 janitorial note to the durable handoff.
- Documentation/governance only; no runtime/module/manifest/public behavior changed.

---

## 2026-09-21 — Issue #20 public release closeout / Dev reconciliation COMPLETE

- Public v2.0.1 passed Stable smoke and Amanda's real-file Booth JSON export/import gate.
- Updated Stable baseline to `33ff83599951a896d4bfcec180081a9b400a7f0b`.
- Removed resolved issue #20 from `DEV_DIVERGENCES.json`; issue #19 Dev channel identity remains the only intentional runtime divergence.
- Verified all 39 shared runtime JS/CSS blobs are byte-identical between canonical Dev and Stable.
- Routed active work to issue #24 submitted High Res regressions, followed by issue #25 targeted host expansion/optimization.
- Four safely reachable short-lived #20 refs are queued for mechanical deletion via issue #14 because this connector has no delete-ref action.
- No runtime/module/manifest behavior changed by this reconciliation commit.

---

## 2026-09-21 — Issue #20 Dev acceptance complete

- Amanda passed the human visual gate for the new Booth Settings JSON block.
- Amanda independently confirmed real-file Booth JSON export and load both work.
- Issue #20 is now Dev-validated and ready for explicit narrow Stable promotion.
- Public Stable remains untouched pending that authorization.
- No additional runtime/module/manifest behavior changed in this documentation update.

---

## 2026-09-21 — Finalize exact v1.5.2 Booth JSON payload for live Dev

- Advanced the v1.5.2 launcher payload pin to exact commit `22d9f9e0bbf90675b52474eb736663fd8d5df7ea`, which includes the final Booth-mode mismatch guard.
- Removed the temporary isolated issue #20 harness from the canonical candidate tree; it was never registered in the manifest or required at runtime.
- The real Witch Dock Booth v27.1.0 module is now the exact code scheduled for Auto Host live validation.
- Public Stable remains untouched.

---

## 2026-09-21 — Canonical Dev launcher v1.5.2 for issue #20 live gate

- Dev launcher advances to v1.5.2 and pins immutable payload `0bb96bd18b735ddb458dc1fb4f20f8c82cb037ed`.
- Payload contains Booth tool v27.1.0 Booth JSON file I/O candidate.
- This is a Dev-only live-validation step; public Stable remains untouched.

---

## 2026-09-21 — Issue #20 immutable Dev payload v1.5.2

- Prepared the immutable Dev payload for Booth JSON repair validation.
- Payload includes Booth tool v27.1.0 / `v27.1.0-booth-json-file-io`.
- Dev launcher registry identity advances to v1.5.2 / `1.5.2-issue-20-booth-json`; launcher pinning happens in the following commit.
- Core/loader architecture and all unrelated module versions remain unchanged.
- Public Stable is untouched.

---

## 2026-09-21 — Issue #20 isolated live-validation harness

- Added temporary `devtools/Booth_JSON_Issue20_Candidate.user.js` on the issue branch only.
- Harness exposes bounded capture/apply/memory methods through `KWBoothJsonIssue20Candidate` so HF-Chat-Bridge can validate the exact current file-I/O state logic before canonical Dev integration.
- Added fail-closed current-mode validation for Witch Dock wrapper files.
- Harness is development infrastructure for #20 only; it is not in `manifest.json` and must not become a Stable/runtime dependency.

---

## 2026-09-21 — Canonical Dev launcher candidate v1.5.2 for Booth JSON

- Advanced Dev launcher identity to v1.5.2 / `1.5.2-issue-20-booth-json`.
- Pinned exact immutable payload `791320c49d1038ce0d8d7c311ab2dea8abd7d983`, which contains Booth v27.1.0 and the otherwise unchanged validated modular baseline.
- Auto Host remains on canonical `WITCH_DEV_MAIN`; no host-boundary change is required.
- Public Stable remains untouched.
- Next gate: fast-forward canonical Dev to this candidate, reload through Auto Host, then run the live Booth JSON round-trip and unaffected-media smoke.

---

## 2026-09-21 — Dev payload v1.5.2 prepared for issue #20

- Prepared the immutable Dev payload for Booth JSON v27.1.0.
- Advanced only the Dev launcher registry identity to v1.5.2 / `1.5.2-issue-20-booth-json` so the canonical launcher can pin this payload without registry/version mismatch.
- Runtime payload includes the issue #20 Booth JSON candidate and otherwise preserves the current validated modular Dev baseline.
- Public Stable remains untouched.

---

## 2026-09-21 — Issue #20 Booth JSON file I/O candidate

- Bumped `booth-tool` to v27.1.0 / `v27.1.0-booth-json-file-io`.
- Added Booth-tab Save/Load JSON controls using Hero Forge's current named `BT.maker.savePortrait/loadPortrait` ownership seam.
- Preserves current camera/effects application through Hero Forge's own `cameras.loadCameraSave` and `loadEffectsFromConfig` paths.
- Accepts Witch Dock full Booth files, raw current Booth configs, legacy Lob effect-only JSON files, and legacy nested JSON-string payloads.
- Flushes Hero Forge-owned camera/effects persistence hooks before export and updates the Booth module URL cache key to v27.1.0.
- Invalid/unrecognized JSON fails closed with visible status; unrelated Persistent Booth/Black Canvas behavior is unchanged.
- Public Stable is untouched; candidate lives only on `wd/20-booth-json-repair` pending live validation.

---

## 2026-09-21 — Normalize post-cleanup branch and task routing

- Confirmed retired `WITCH_DEV_UI` / `WITCH_DEV` refs are gone and `WITCH_DEV_MAIN` is the sole canonical Dev branch.
- Updated `PROJECT_CONTRACT.md` so deleted legacy branches are no longer described as usable reference sources.
- Routed `ACTIVE_CONTEXT.md` to issue #20 / `wd/20-booth-json-repair`, followed by High Res issues #24 and #25.
- Marked the branch-cleanup handoff as a completed historical execution record rather than current inventory.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-21 — Complete branch retirement / migration cleanup

- Deleted exactly the handoff's 49 obsolete branch refs.
- Verified the repository now contains exactly its six required branches: public Stable, canonical Dev, rollback archive, two immutable payload refs, and Dev Auto Host.
- Closed the completed branch-retirement and canonical-Dev migration/cleanup tracking issues.
- No runtime/module/manifest/public behavior changed.

---

# Changelog

## 2026-09-20 — Route current work to branch-retirement execution

- Updated `ACTIVE_CONTEXT.md` to issue #13 after completing the 55-branch audit and issue #12 harvest.
- Routed Work directly to `docs/BRANCH_CLEANUP_HANDOFF_2026-09-20.md`.
- Protected the exact six-branch keep set and recorded the external ChatGPT project-instruction prerequisite for deleting `WITCH_DEV_UI`.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-20 — Complete branch-retirement audit / harvest #12

- Audited all 55 repository branches against canonical Dev, public Stable, open Witch Dock issues, runtime payload refs, rollback state, and legacy migration rules.
- Classified 6 branches as currently required and 49 as obsolete after stated prerequisites.
- Harvested the only branch-specific open-bug evidence worth preserving: legacy bone-selection reference/probe files from `GPT_DEV` for issue #26.
- Confirmed current canonical lighting docs supersede the old lighting checkpoint branches for issue #23.
- Added `docs/BRANCH_CLEANUP_HANDOFF_2026-09-20.md` as the exact low-context deletion handoff for Work.
- No runtime/module/manifest/public behavior changed.

---

## 2026-09-20 — Issue #28 public v2.0.0 promotion COMPLETE

- Promoted exact tested RC `95b5cdae4c8840d950d984c73bce101ba887011e` to `Witch_Scripts` by non-forced fast-forward.
- Actual public Stable smoke PASS: launcher v2.0.0, Core v2.0.0, Loader v0.2.0, 23/23 executed, 0 failed, immutable=23/fallback=0, no legacy monolith/source transforms, one Dock/compact/icon.
- Reconciled canonical Dev after release: all promoted runtime/core/tool blobs match Stable exactly; non-launcher registry entries match; issue #28 removed from `DEV_DIVERGENCES.json`.
- Preserved intentional issue #19 Dev channel identity/routing, immutable public payload ref, and pre-modular rollback archive.
- No runtime behavior changed by this reconciliation commit.

**Runtime/module/manifest/public behavior changed:** no; post-release records/reconciliation only.

---

## 2026-09-20 — Issue #28 RC host gate prepared

- Added durable handoff state for temporary Public RC Host v0.1.0 at `wd/28-public-rc-host` commit `536b89c7747e0a2f1f0f31561b1194ea00f73f3f`.
- Recorded static PASS and healthy HF-Chat-Bridge v0.4.0 ping (#2961).
- Exact next step is now the one-time Tampermonkey RC-host install/disable switch followed by Bridge-driven live validation.
- No runtime/module/manifest/public Stable code changed on canonical Dev.

**Runtime/module/manifest/public behavior changed:** no; documentation/handoff only.

---

Rolling current Dev log. Older detail remains durable in Git history/issues.

## DOCK-2026-09-20-051 — Public promotion handoff checkpoint

Date: 2026-09-20

- Persisted issue #28 release state after canonical Dev PASS and public RC construction.
- Public RC is `wd/28-public-rc` @ `95b5cdae4c8840d950d984c73bce101ba887011e`.
- Public immutable payload is `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`.
- Stable remains `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`; rollback archive exists.
- Exact RC live gate remains pending.
- Recorded that HF-Chat-Bridge host lacks GM_addStyle/GM_setClipboard/GM_download and therefore cannot faithfully host the public launcher directly.
- Exact next action is a temporary isolated Public RC Host followed by the explicit Stable-promotion approval gate.

**Runtime/module/manifest/public behavior changed:** none; handoff/router only.

---

## DOCK-2026-09-20-049 — Canonical Dev v1.5.1 smoke PASS

Date: 2026-09-20

- Auto-host v0.1.1 successfully retargeted normal delivery to canonical `WITCH_DEV_MAIN`.
- Canonical launcher v1.5.1 / `1.5.1-canonical-dev-reconcile` ran from pinned payload `6603911658b426c6b95367697bedcc4c7acf67eb`.
- Core v2.0.0 running; Loader v0.2.0 completed 23/23 with 0 failures, immutable resolution=23, fallback=0.
- Legacy monolith fetch/source transforms remained false.
- One Dock/compact/icon and visible `WITCH DOCK - DEV v1.5.1` title confirmed.
- Evidence: `hf-20260920-wd28-canonical-dev-reload-069`, `hf-20260920-wd28-canonical-dev-smoke-070`.
- Public Stable remains untouched.

**Runtime/module/manifest/public behavior changed:** none; canonical smoke record only.

---

## DOCK-2026-09-19-048 — Canonical Dev reconciliation candidate v1.5.1

Date: 2026-09-19

- Release issue #28 begins; issue #10 remains closed.
- Canonical Dev candidate preserves the validated modular runtime while advancing only the Dev launcher/channel identity to v1.5.1 / build `1.5.1-canonical-dev-reconcile`.
- Launcher update/download URLs and runtime branch identity are normalized to `WITCH_DEV_MAIN`.
- Launcher pins immutable payload `6603911658b426c6b95367697bedcc4c7acf67eb`.
- Payload fallback URLs are canonicalized to `WITCH_DEV_MAIN`; normal Loader v0.2.0 resolution remains immutable-payload-root.
- Main-only `TASK_MODE_ROUTER.md` governance is preserved in the reconciliation merge.
- No feature/core/module source behavior changed from the validated architecture.
- Public Stable remains untouched.

**Runtime/module/manifest/public behavior changed:** Dev channel/release identity only; public Stable unchanged.

---

## DOCK-2026-09-19-045 — Issue #10 COMPLETE / final human visual PASS

Date: 2026-09-19

- Amanda reviewed the live v1.5.0 Dock after the complete Stage E automated regression and confirmed it looks normal.
- Stage E and issue #10 are complete.
- Validated architecture baseline: Dev launcher v1.5.0, Core v2.0.0, Loader v0.2.0, immutable payload commit `6cbc7c5530391d3b8611374ce051bde080ea1a2d`, 23/23 modules executed, 0 failed.
- The temporary Stable-monolith fetch/source-transform bootstrap is retired from Dev.
- Public Stable remains unchanged; no promotion is implied or authorized by closing #10.

**Runtime/module/manifest/public behavior changed:** documentation/acceptance state only in this commit; public Stable unchanged.

---

## DOCK-2026-09-19-044 — Stage E automated live PASS

Date: 2026-09-19

- Dev v1.5.0 loaded through the auto-host from immutable payload commit `6cbc7c5530391d3b8611374ce051bde080ea1a2d`.
- Launcher diagnostics: running/error-null, immutablePayload=true, legacyMonolithFetched=false, legacySourceTransforms=false.
- Core v2.0.0 running.
- Loader v0.2.0 completed 23/23 modules with 0 failures; immutableResolutionCount=23 and fallbackResolutionCount=0.
- Final bounded regressions passed for Dock lifecycle, drag, corner/bottom resize, compact threshold/click, hotkey guard/toggle, History boundary, modals, Bone HUD, public WitchDock seams, representative tools, and section-order persistence.
- Temporary test state was fully restored: Booth active, 380x520 Dock, compact hidden, Utilities order `booth-features, bound-decal-gizmo, heroforge-ui`, all three Utilities sections expanded.
- Automated Stage E is complete. One human visual gate remains before issue #10 closure.

**Runtime/module/manifest/public behavior changed:** Dev Stage E candidate validated; public Stable unchanged.

---

## DOCK-2026-09-19-043 — v1.5.0 immutable launcher activation candidate

Date: 2026-09-19

- Dev launcher advances to v1.5.0 / build `1.5.0-immutable-modular-bootstrap`.
- Launcher shrinks to a small channel/privilege/bootstrap host and pins payload commit `6cbc7c5530391d3b8611374ce051bde080ea1a2d` directly.
- Human-readable payload ref `wd/payload-1.5.0` points to that commit, but runtime compatibility depends on the immutable SHA.
- Launcher contains no legacy monolith fetch, `devSource` text surgery, or Stable-derived block sentinels.
- Bootstrap component versions/builds remain strict.
- Stage E live regression is still required before issue #10 can be called complete.

**Runtime/module/manifest/public behavior changed:** Dev Stage E activation candidate only; public Stable unchanged.

---

## DOCK-2026-09-19-042 — Stage E immutable payload candidate

Date: 2026-09-19

- Added `Witch_Dock_Core.js` v2.0.0 / build `2.0.0-modular-orchestrator` as the final composition/startup owner.
- Added `Witch_Dock_Assets.js` v0.1.0 preserving the exact known-good compact emblem data URL.
- Advanced Module Loader to v0.2.0 / build `0.2.0-immutable-payload-root`.
- Loader keeps concurrent fetch, deterministic manifest-order execution, cache-key behavior, and per-module failure isolation, but now prefers `KWWitchDockPayloadRoot + moduleRegistry.path` when an immutable payload root is supplied.
- Manifest remains 23 runtime modules and every runtime module has a registry path.
- This commit is the immutable Stage E payload candidate only; launcher activation and live regression follow in a separate commit so the Dev task branch cannot expose a half-migrated runtime.
- Public Stable and legacy `Witch_Dock.user.js` are unchanged.

**Runtime/module/manifest/public behavior changed:** isolated Stage E payload candidate; public Stable unchanged.

---

## DOCK-2026-09-19-041 — Stage D COMPLETE / v1.4.13 Application live PASS

Date: 2026-09-19

- Auto-host delivered v1.4.13 with Application v0.1.0 configured/error-null.
- Loader remained 23/23 / 0 failed.
- Preserved 6 tabs, 9 mounted tools, 12 sections, active-tab persistence, public `WitchDock.registerTool` / `ensureDock` / `downloadBlob` seams, and 380x520 Dock geometry at x=820/y=244.
- Real section drag persisted order `bound-decal-gizmo, booth-features, heroforge-ui`; inverse drag restored exact baseline `booth-features, bound-decal-gizmo, heroforge-ui`.
- Application telemetry after restore: sectionDragStarts=2, sectionDragDrops=2, lastError=null.
- Stage D application-shell extraction is complete. Stage E final bootstrap reduction begins next.
- Evidence: `hf-20260919-wd10-v1413-state-048`, `hf-20260919-wd10-v1413-section-reorder-real-050`, `hf-20260919-wd10-v1413-section-restore-051`.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-040 — v1.4.13 final Stage D Application Shell candidate

Date: 2026-09-19

- Launcher advances to v1.4.13.
- Added `witch-dock-application` v0.1.0 / build `0.1.0-shell-registry-orchestration`.
- Moves the remaining contiguous ordinary application-shell block: shared DOM/layout helpers, active-tab/tab creation/order, section creation/collapse/order/drag, tool API/mount/registration.
- Application uses existing Preferences + History APIs and Registry-owned containers; no raw GM capability is exposed.
- The validated v1.4.6 content-box geometry correction now lives physically in the Application module instead of launcher source transformation.
- Removed obsolete launcher source transforms for section collapse/order and Dock snapshot.
- Baseline: 6 canonical tabs, Booth active, 9 tools, 12 sections, one 380x520 Dock at 820/244, public WitchDock seams intact; Booth->Utilities->Booth selection persistence passed; Utilities section order is booth-features / bound-decal-gizmo / heroforge-ui.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-039 — v1.4.12 History live boundary PASS

Date: 2026-09-19

- Auto-host delivered v1.4.12 without Tampermonkey intervention.
- Launcher: running/error-null; History v0.1.0 configured/error-null; loader 23/23 / 0 failed.
- Genuine HeroForge UndoQueue remained length=1/currentIndex=0 with canUndo=false/canRedo=false.
- Undo and Redo buttons remained disabled; programmatic clicks were no-ops and did not alter queue/index.
- History telemetry remained clean: fallbackLoadCalls=0, lastError=null. Queue hooks were installed only on methods actually present.
- No synthetic HeroForge history was created merely to obtain a non-boundary test.
- Evidence: `hf-20260919-wd10-v1412-history-gate-043`.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-038 — v1.4.12 undo/redo History candidate

Date: 2026-09-19

- Launcher advances to v1.4.12.
- Added `witch-dock-history` v0.1.0 / build `0.1.0-undo-redo-owner`.
- Moves the live CK.UndoQueue-backed Dock undo/redo seam into a dedicated non-privileged module while preserving native undo/redo preference, fallback index/load behavior, button-state sync, queue wrapping, and `__kwDockWrapped`.
- Confirmed the later keyboard-dispatch duplicates are inside the legacy minimize block already removed by the lifecycle transform and are not the current live button implementation.
- Safe baseline at genuine queue boundary: length=1/index=0, both buttons disabled, clicks no-op; no synthetic HeroForge history created.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-037 — v1.4.11 Dock hotkey live PASS

Date: 2026-09-19

- Auto-host delivered v1.4.11 without Tampermonkey intervention.
- Launcher: running/error-null; interactions v0.5.0 configured/error-null; loader 23/23 / 0 failed.
- Ctrl+Backquote remained ignored.
- Plain Backquote closed the Dock to compact; a second plain Backquote restored exact 380x520 geometry.
- Hotkey telemetry: install calls=1, toggles=2, ignored=1, lastError=null.
- Evidence: `hf-20260919-wd10-v1411-hotkey-gate-039`.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-036 — v1.4.11 Dock hotkey candidate

Date: 2026-09-19

- Launcher advances to v1.4.11; interactions module advances to v0.5.0.
- Grave-key Dock hotkey ownership moves behind the interaction module with the exact legacy repeat/modifier/editable-target/code guards, capture-phase document listener, preventDefault, and close/expand dispatch.
- Undo/redo, loader contracts, storage keys, DOM/CSS, and Stable remain unchanged.
- Baseline: Ctrl+Backquote ignored; plain Backquote closes to compact; second plain Backquote restores the exact 380x520 Dock.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-035 — v1.4.10 compact drag/click live PASS

Date: 2026-09-19

- Auto-host delivered v1.4.10 without Tampermonkey intervention.
- Launcher: running/error-null; interactions v0.4.0 configured/error-null; loader 23/23 / 0 failed.
- Compact drag parity: x/y 16/907 -> 34/921 for +18/+14, Dock remained closed; inverse drag restored exact 16/907.
- No-drag pointerdown/up reopened the Dock at 380x520 and hid compact.
- Telemetry: startCompactDragCalls=3, compactDragMoveCalls=2, compactDragEndCalls=3, compactDragCancelCalls=0, compactClickExpandCalls=1, lastError=null.
- Evidence: `hf-20260919-wd10-v1410-compact-gate-036`.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-034 — v1.4.10 compact drag/click candidate

Date: 2026-09-19

- Launcher advances to v1.4.10; interactions module advances to v0.4.0.
- Compact icon pointer ownership moves behind the interaction module with the exact legacy primary/button guards, pointer capture, 5 px threshold, viewport clamping, compact position persistence, capture-phase listener cleanup/cancel, and no-drag reopen behavior.
- Shell DOM, hotkey/undo-redo, loader contracts, storage keys, and Stable remain unchanged.
- Baseline: compact 16/907 -> 34/921 on +18/+14 drag while Dock stays closed; inverse drag restores 16/907; no-drag release reopens 380x520 Dock and hides compact.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-033 — v1.4.9 Dock resize live PASS

Date: 2026-09-19

- Auto-host delivered v1.4.9 without Tampermonkey intervention.
- Launcher: running/error-null; interactions v0.3.0 configured/error-null; loader 23/23 / 0 failed.
- Corner resize parity: 380x520 -> 402x537 -> 380x520, with persisted width/height + last-open fields matching every DOM state.
- Bottom resize parity: 380x520 -> 380x547 -> 380x520, with width preserved and height + lastOpenHeight matching.
- Extracted telemetry: corner start/move/end 2/2/2; bottom start/move/end 2/2/2; lastError=null.
- Evidence: `hf-20260919-wd10-v149-resize-gate-032`, `hf-20260919-wd10-v149-resize-telemetry-033`.

**Runtime/module/manifest/public behavior changed:** Dev ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-032 — v1.4.9 Dock resize candidate

Date: 2026-09-19

- Launcher advances to v1.4.9; interactions module advances to v0.3.0.
- Corner and bottom resize ownership move together behind the interaction module with the exact legacy guards, clamps, width/height persistence, last-open updates, resize state lifecycle, listener cleanup, and final size-constraint enforcement.
- Compact drag mechanics, hotkey/undo-redo, loader contracts, storage keys, and Stable remain unchanged.
- Reversible baselines: corner 380x520 -> 402x537 -> 380x520; bottom 380x520 -> 380x547 -> 380x520.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-031 — v1.4.8 main Dock drag live PASS

Date: 2026-09-19

- Dev auto-host fetched launcher v1.4.8 on Bridge reload with no Tampermonkey update.
- Launcher reached running/error-null; interactions v0.2.0 configured/error-null; loader remained 23/23 / 0 failed.
- Reversible parity matched exactly: 820/244 -> 844/262 for +24/+18 pointer delta, then inverse drag restored both DOM and persisted prefs to 820/244.
- Interaction telemetry proved extracted ownership: 2 drag starts, 2 move callbacks, 2 end callbacks.
- Evidence: `hf-20260919-wd10-v148-state-025`, `hf-20260919-wd10-v148-drag-cycle-026`.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-030 — v1.4.8 main Dock drag candidate

Date: 2026-09-19

- Launcher advances to v1.4.8; interactions module advances to v0.2.0.
- Main Dock header drag ownership moves behind the existing interaction module with exact legacy exclusions, viewport clamp, x/y writes, and pointer listener cleanup.
- Resize, compact-drag mechanics, lifecycle behavior, hotkeys/undo-redo, loader contracts, storage keys, and Stable are unchanged.
- Reversible baseline: 820/244 -> 844/262 for +24/+18 pointer delta, then exact restore to 820/244.

**Runtime/module/manifest/public behavior changed:** Dev task-branch interaction ownership only; public Stable unchanged.

---

## DOCK-2026-09-19-029 — v1.4.7 lifecycle extraction live PASS

Date: 2026-09-19

- Dev auto-host fetched launcher v1.4.7 on a Bridge-driven reload with no Tampermonkey update.
- Launcher reached running/error-null; interactions v0.1.0 configured with lastError:null; loader remained 23/23 / 0 failed.
- Minimize/restore matched the v1.4.6 baseline exactly: 380x520 -> 380x92 -> 380x520 CSS.
- Collapse/reopen matched baseline exactly: Dock hidden + compact visible at x=16/y=907, then no-drag compact pointer cycle restored the Dock to 380x520 CSS / 382x522 rendered at x=820/y=244 with compact hidden.
- Module telemetry proved extracted ownership: 2 minimize calls, 1 close call, 1 expand call.
- Evidence: `hf-20260919-wd10-v147-state-021`, `hf-20260919-wd10-v147-cycle-022`.

**Runtime/module/manifest/public behavior changed:** ownership moved on Dev task branch only; public Stable unchanged.

---

## DOCK-2026-09-19-028 — v1.4.7 minimize / compact lifecycle candidate

Date: 2026-09-19

- Issue #10 Stage D resumed after the Bridge runtime-host and Dev auto-host gates passed.
- Added `witch-dock-interactions` v0.1.0 / build `0.1.0-minimize-compact-lifecycle`.
- Launcher advances to v1.4.7 / build `1.4.7-extracted-minimize-compact-lifecycle`.
- Only minimize, close-to-compact, and expand-from-compact lifecycle ownership moves; drag/resize, compact pointer mechanics, hotkeys/undo-redo, storage keys, loader behavior, and Stable remain unchanged.
- Pre-change live baseline captured the exact v1.4.6 minimize/restore/collapse/reopen transitions for parity comparison.

**Runtime/module/manifest/public behavior changed:** Dev task-branch ownership only; public Stable unchanged.

---

## DOCK-2026-09-18-027 — Close v1.4.6 geometry gate and pause issue #10

Date: 2026-09-18

### Live PASS

- Launcher v1.4.6 is running with `error:null`.
- Shell v0.2.0 / build `0.2.0-main-and-compact-dom` remains applied once with no shell error.
- Loader remains complete at 23 total / 23 enabled / 23 executed / 0 failed.
- Pre-cycle persisted Dock geometry is exactly 380x520 CSS width/height and last-open width/height; rendered outer box is 382x522 at unchanged x/y.
- Normal Collapse-to-icon kept the persisted geometry at 380x520 while hiding the Dock and showing the compact launcher.
- One no-drag compact reopen restored the Dock, hid the compact launcher, preserved one root/compact/icon only, and kept persisted geometry exactly 380x520 with rendered outer box exactly 382x522.
- The legacy +2 px growth is therefore fixed by the v1.4.6 snapshot correction.
- Evidence: `hf-20260918-wd10-v146-baseline-read-001`, `hf-20260918-wd10-v146-after-collapse-read-001`, `hf-20260918-wd10-v146-final-read-001`.

### Pause

- Issue #10 is intentionally PAUSED here for the planned HF-Chat-Bridge upgrade.
- Do not continue Stage D extraction, Stage E cleanup, integration, promotion, or Stable work until explicit resume after the Bridge upgrade.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit.

---

## DOCK-2026-09-18-026 — Stabilize compact close/open Dock geometry

Date: 2026-09-18

### v1.4.5 live finding

- Compact DOM extraction itself passed startup and interaction parity: one root/compact/icon, correct 54x54 / 48x48 structure, loader 23/23 / 0 failed, normal collapse and no-drag reopen both worked.
- The full gate exposed an existing lifecycle bug: 382x522 rendered outer geometry reopened as 384x524.
- Root CSS uses content-box sizing with a border. Legacy `snapshotCurrentDockPositionToPrefs()` saves border-inclusive `getBoundingClientRect()` dimensions into values later applied as CSS content-box width/height, producing +2 px growth each cycle.
- Test-induced persisted geometry was restored to the original 380x520 CSS values with position unchanged.

### Candidate

- Dev launcher -> v1.4.6 / build `1.4.6-compact-geometry-stability`.
- No shell-module version/API change.
- Guarded transform changes only last-open width/height snapshot math to use computed CSS dimensions, with bounding-box values retained only as fallback.
- No close/open, compact DOM, drag, minimize, size-enforcement, storage ownership, loader or public-seam logic moves.
- Checked-in `Witch_Dock.user.js` remains unchanged; normal manifest module count remains 23.
- After live PASS, pause issue #10 for the planned HF-Chat-Bridge upgrade.

**Runtime/module/manifest/public behavior changed:** task-branch legacy geometry snapshot correction + launcher version only; public Stable and canonical Dev unchanged.

---

## DOCK-2026-09-18-025 — Externalize compact launcher DOM factory

Date: 2026-09-18

### Diagnosis

- Compact launcher DOM construction is separable from its lifecycle and drag behavior.
- `showClosedCompact()`, `startCompactDrag()`, `closeDock()`, `expandFromCompact()`, hotkey behavior and compact position persistence remain legacy-owned.

### Candidate

- Dev launcher -> v1.4.5 / build `1.4.5-compact-dom-factory`.
- `witch-dock-shell` -> v0.2.0 / build `0.2.0-main-and-compact-dom`.
- Adds only a compact DOM factory using the existing legacy `el()` helper, inline emblem URL and legacy pointerdown callback.
- Launcher guards and replaces only the legacy compact constructor; append-to-body and all lifecycle consumers remain unchanged.
- Baseline: one 54x54 `#kwWDCompact`, one 48x48 `#kwWDCompactIcon`, inline PNG data URL, title/alt preserved, draggable false, hidden while Dock is open.
- Normal manifest-loaded module count remains 23. Checked-in `Witch_Dock.user.js` remains unchanged.

**Runtime/module/manifest/public behavior changed:** task-branch compact DOM ownership and launcher/shell versions changed; public Stable and canonical Dev unchanged.

---

## DOCK-2026-09-18-024 — Close v1.4.4 main-shell DOM live gate

Date: 2026-09-18

### Live PASS

- Dev launcher v1.4.4 is running with `error:null`.
- `witch-dock-shell` v0.1.0 / build `0.1.0-main-root-dom` is applied exactly once; shell diagnostics report one create call and no error.
- Loader remains complete at 23 total / 23 enabled / 23 started / 23 fetched / 23 executed / 0 failed.
- Exactly one `#kwWitchDock` root exists.
- Direct child order remains Header, Tabs, Body, Footer, Bottom Resize, Corner Resize.
- Header controls remain About, Minimize/Expand, Collapse-to-icon with unchanged ids/text/titles/classes.
- Tab frame remains Left/Shade/Right with unchanged cue, Undo and Redo controls.
- Body/footer and both resizer references remain present; compact launcher count remains one.
- Rendered root geometry remains exactly the baseline 382x522 box at the preserved position.
- Evidence: `hf-20260918-wd10-v144-live-gate-read-001`.

### Next bounded slice

- Diagnose compact/minimize/layout lifecycle ownership before editing. Keep drag/resize and hotkey/undo-redo behavior isolated until their own bounded extraction.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit.

---

## DOCK-2026-09-18-023 — Externalize main Dock root DOM factory

Date: 2026-09-18

### Diagnosis

- The safest next Stage D shell seam is the main `#kwWitchDock` root tree only.
- Compact launcher DOM and all position/size/minimize/close/expand/drag/resize behavior remain coupled and are intentionally not moved with this slice.
- Tabs/tools/sections remain under their existing legacy consumers; registry containers remain owned by the v1.4.3 registry module.

### Candidate

- Dev launcher -> v1.4.4 / build `1.4.4-main-shell-dom`.
- New `witch-dock-shell` -> v0.1.0 / build `0.1.0-main-root-dom`.
- Shell module creates the existing root/header/title/disclaimer/About/minimize/close/tab-frame/undo/redo/body/footer/resizer DOM using the existing legacy `el()` helper and injected legacy callbacks.
- Launcher guards the exact legacy root-construction + state-reference block before replacing only that block with `KWWitchDockShell.createRoot(...)`.
- Position/sizing, compact launcher creation, minimize/close/expand, drag/resize, tab overflow, hotkeys, undo/redo implementation, tabs/tools/sections and public `WitchDock` seams remain unchanged.
- Baseline `hf-20260918-wd10-v144-shell-baseline-read-001`: root children Header/Tabs/Body/Footer/BottomResize/CornerResize; legacy control/tab-frame IDs present; compact launcher present; current rendered box 382x522.
- Normal manifest-loaded module count remains 23. Checked-in `Witch_Dock.user.js` remains unchanged.

**Runtime/module/manifest/public behavior changed:** task-branch main-shell DOM ownership and launcher/module versions changed; public Stable and canonical Dev unchanged.

---

## DOCK-2026-09-18-022 — Close v1.4.3 registry-container live gate

Date: 2026-09-18

### Live PASS

- Dev launcher v1.4.3 is running with `error:null`.
- `witch-dock-registry` v0.1.0 / build `0.1.0-tab-tool-state-containers` is applied.
- Loader remains complete at 23 total / 23 enabled / 23 started / 23 fetched / 23 executed / 0 failed.
- Registry diagnostics report 6 tabs, 9 tools and 0 pending after startup.
- Rendered visual tab order remains Body Editor, Pose, Decals, Booth, JSON, Utilities with Pose active.
- Rendered mounted tool IDs remain the same nine baseline tools and section count remains 12.
- Public `WitchDock.registerTool`, `WitchDock.ensureDock`, and `WitchDock.downloadBlob` remain functions.
- Registry Map insertion order differs from visual tab order by design because visual order is still owned by the legacy tab reorder logic; this is not a regression.
- Evidence: `hf-20260918-wd10-v143-live-gate-read-001`.

### Next bounded slice

- Diagnose shell/layout ownership before editing. Do not move resize/drag/minimize/compact/hotkey/undo-redo behavior opportunistically.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit.

---

## DOCK-2026-09-18-021 — Externalize tab/tool registry backing state

Date: 2026-09-18

### Diagnosis

- Current core has no independent section registry. Sections are created through `api.ui.createSection(...)` and discovered from rendered DOM by `finalizeToolSections()`.
- The actual registry backing state is exactly `state.tabs`, `state.toolsById`, and pre-UI `state.pending`.
- Existing tab DOM/order/activation, tool mounting/rendering/replacement, section creation/finalization/order/drag, sizing and public `UW.WitchDock` seams remain coupled to the legacy core and are intentionally not moved in this slice.

### Candidate

- Dev launcher -> v1.4.3 / build `1.4.3-registry-state-containers`.
- New `witch-dock-registry` -> v0.1.0 / build `0.1.0-tab-tool-state-containers`.
- The bootstrap fetches and validates the registry module through the existing bounded repository-text transport.
- The guarded core transform replaces exactly three legacy allocations with the external backing containers; all consumers continue using `state.tabs`, `state.toolsById`, and `state.pending` exactly as before.
- Normal manifest-loaded module count remains 23. Checked-in `Witch_Dock.user.js` remains unchanged.
- Baseline Bridge evidence `hf-20260918-wd10-v143-registry-baseline-compact-read-001`: 23/23 / 0 failed; tabs Body Editor, Pose(active), Decals, Booth, JSON, Utilities; nine mounted tool IDs; 12 sections; all three public seams are functions.

**Runtime/module/manifest/public behavior changed:** task-branch registry backing-state ownership and launcher/module versions changed; public Stable and canonical Dev unchanged.

---

## DOCK-2026-09-18-020 — Close v1.4.2 tool-enablement live gate

Date: 2026-09-18

### Live PASS

- v1.4.2 launcher running / error null; preferences v0.3.0 configured; loader v0.1.2 started clean at 23/23 / 0 failed.
- Decals Scroll Guards OFF through the normal Utilities checkbox wrote `"false"` to `kw.witchDock.toolEnabled.expanded-ui-scroll-guards`, recorded one preference page write + one host write, and disabled the live scroll-guard style/classes.
- Reload while OFF produced 23 total / 22 enabled+executed / 0 failed; only `expanded-ui-scroll-guards` was marked `disabled`; Utilities restored the checkbox OFF.
- Normal checkbox ON restored page key `"true"`, mirrored page+host writes, and after async settle restored the scroll-guard API/style/status.
- Final reload restored 23/23 / 0 failed, checkbox ON, page key `"true"`.
- Evidence: `hf-20260917-wd10-v142-scrollguards-off-read-001`, `hf-20260917-wd10-v142-off-postreload-read-001`, `hf-20260917-wd10-v142-scrollguards-on-read-001`, `hf-20260917-wd10-v142-scrollguards-on-settle-read-001`, `hf-20260917-wd10-v142-final-snapshot-read-001`.

### Confirmed bootstrap hardening finding

- During installation, the page was still executing launcher v1.4.1 while its branch-relative preferences URL fetched current v0.3.0 source; v1.4.1 correctly rejected that newer build against its v0.2.0 expectation.
- A cache-busted v1.4.2 userscript install plus reload resolved the immediate mismatch.
- This is not a v1.4.2 preference API defect. It is a moving-task-branch bootstrap source skew hazard and remains an explicit issue #10 Stage E cleanup requirement.

**Runtime/module/manifest/public behavior changed:** none in this record-only commit; task-branch live evidence/routing only.

---

## DOCK-2026-09-17-019 — Centralize tool-enablement persistence without changing precedence

Date: 2026-09-17

### Prior gate closure

- v1.4.1 section collapse/order persistence PASS.
- Normal Booth header click recorded exactly one bounded write to `kw.witchDock.ui.booth-tool.booth.collapsed`; reload restored collapsed state; normal click restored expanded.
- Loader remained 23/23 / 0 failed and all 12 observed sections remained present in the same order.
- Evidence: `hf-20260917-wd10-v141-collapse-readback-001`, `hf-20260917-wd10-v141-postreload-001`, `hf-20260917-wd10-v141-restore-readback-001`.

### Candidate

- Dev launcher -> v1.4.2 / build `1.4.2-tool-enablement-preferences`.
- `witch-dock-preferences` -> v0.3.0 / build `0.3.0-tool-enablement-store`.
- `witch-dock-module-loader` -> v0.1.2 / build `0.1.2-preferences-enablement-read`.
- Utilities registry -> v1.2.2 / build `1.2.2-tool-enablement-preferences`.
- Centralizes only `kw.witchDock.toolEnabled.<id>` persistence. Existing precedence is preserved exactly: bootstrap host-only read; module loader page-only read; Utilities page-first then host fallback; Utility writes still mirror page string + host boolean.
- Module scheduling, fetch concurrency/order, execution order, enable/disable actions, and tool registration remain unchanged.
- Baseline before candidate: loader 23/23 / 0 failed; page keys for `expanded-ui-scroll-guards` and `hf-ui-slot-bridge` are `"true"`; both Utilities toggles are checked/enabled; module-loader page key is absent.
- Checked-in `Witch_Dock.user.js` remains unchanged. Public Stable and canonical Dev remain untouched.

**Runtime/module/manifest/public behavior changed:** task-branch persistence ownership and launcher/preferences/loader/Utilities registry versions changed; public Stable unchanged.

---

## DOCK-2026-09-17-018 — Route section collapse/order preferences through bounded host

Date: 2026-09-17

### Candidate

- Dev launcher -> v1.4.1 / build `1.4.1-section-preferences-host`.
- `witch-dock-preferences` -> v0.2.0 / build `0.2.0-section-state-host`.
- Adds bounded ownership for existing section-collapse keys `kw.witchDock.ui.<tool>.<section>.collapsed` and section-order keys `kw.witchDock.sectionOrder.<tool>`.
- Exact legacy fallback/serialization semantics are preserved: collapsed state defaults on null/undefined/read failure; section order returns [] on absent/invalid data and filters parsed values to strings; order writes remain JSON.
- Core `createSection()`, click handling, section drag logic, DOM ordering and drag indicators remain unchanged; only their persistence helpers become thin wrappers.
- Current Booth baseline before candidate: section `booth` present first and expanded; all 12 observed Dock sections report `data-collapsed="0"`.
- Tool enablement storage remains legacy and is not part of this slice.
- Checked-in `Witch_Dock.user.js` remains unchanged.
- Public Stable and canonical Dev remain untouched.

**Runtime/module/manifest/public behavior changed:** task-branch section preference ownership and module/launcher versions changed; public Stable unchanged.

---

## DOCK-2026-09-17-017 — Begin Stage D with bounded main preference store

Date: 2026-09-17

### Candidate

- Stage C is complete after v1.3.9 bone-footer human visual parity PASS.
- Dev launcher -> v1.4.0 / build `1.4.0-extracted-main-preferences`.
- Added `features/core/Witch_Dock_Preferences.js`, registry id `witch-dock-preferences`, v0.1.0 / build `0.1.0-main-store-host`.
- Moves only `kw.witchDock.v1` load/save/default orchestration out of the Stable-derived core and routes storage through the existing bounded host `storage.get/storage.set` capability.
- Preserves the exact storage key, defaults, JSON serialization, first-run fallback semantics, and existing mutable `prefs` object used by drag/resize/minimize/tab behavior.
- Core wrappers keep `loadPrefs()` / `savePrefs()` call sites unchanged; no drag/resize/minimize/compact/tab/section/undo/redo behavior moved in this slice.
- Existing section-collapse/order and manifest tool-enable storage are intentionally still legacy responsibilities for later bounded slices.
- Baseline before change: Dock open at left 368px / top 157px, width ~662px / height ~916px; compact launcher hidden; control set unchanged.
- Checked-in `Witch_Dock.user.js` remains unchanged.
- Public Stable and canonical Dev remain untouched.

### Live result

- v1.4.0 launcher running / error null; preferences v0.1.0 configured; loader 23/23 / 0 failed.
- Existing Dock geometry survived the update unchanged at startup: left 368 / top 157 / width 660 / height 914; compact launcher remained hidden.
- Controlled normal minimize action changed the Dock to minimized and advanced bounded preference saves with lastError null.
- Manual HeroForge reload then loaded the exact persisted startup snapshot with `minimized:true`, width 660, height 92, last-open width/height 660x914, active tab Booth, and firstRun false.
- Amanda visually confirmed the reloaded Dock looked good, then expanded/resized it normally; subsequent saves remained error-free.
- Main preference-store extraction PASS.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/bootstrap preference ownership and registry changed; public Stable unchanged.

---

## DOCK-2026-09-17-016 — Extract bone HUD/detection behind bounded bootstrap module

Date: 2026-09-17

### Prior gate closure

- v1.3.8 About modal human visual gate PASS.
- User completed a real 4K capture successfully after the Booth/media readiness repair; the control was not merely enabled.
- Booth remained returned to OFF after automated validation.

### Candidate

- Dev launcher -> v1.3.9 / build `1.3.9-extracted-bone-hud`.
- Added `features/core/Witch_Dock_Bone_HUD.js`, registry id `witch-dock-bone-hud`, v0.1.0 / build `0.1.0-extracted-bone-hud`.
- The module is derived directly from the guarded Stable-derived `initBoneFooterAndDetection()` body. Detection candidate paths, scoring, 35 ms click delay, 60-try readiness loop, retry timing, DOM classes/text, capture listeners, and navigator clipboard fallback are preserved.
- Raw bone-copy `GM_setClipboard` use is removed from the extracted feature; it receives only the bounded host clipboard capability plus script metadata.
- Launcher fetches core/CSS/modals/bone HUD concurrently, validates the external API/version, and replaces the exact legacy bone HUD + `getScriptMeta()` block with a thin wrapper. Checked-in `Witch_Dock.user.js` remains unchanged.
- Baseline before extraction: one visible `.kwWDBoneRow`, idle text `No bone detected (click a body bone)`, disabled copy button, and the existing Dock/Undo/Redo footer hotkey line.
- Public Stable and canonical Dev remain untouched.

### Live parity result

- v1.3.9 launcher is running/error-null with external bone HUD v0.1.0 applied; loader completed 23/23 with 0 failures.
- Footer DOM/text/layout matches the pre-extraction baseline: one bone row, exact idle label/value, disabled copy button, and unchanged Dock/Undo/Redo hotkey line.
- Functional detector validation exposed a **pre-existing HeroForge compatibility bug**, not an extraction regression: current `HF.summonCircle` exists/ready, but all seven legacy fixed anchor paths resolve missing, so the preserved legacy detector cannot build candidates or attach listeners.
- Tracked separately as #26 and queued after #10; v1.3.9 is therefore gated on exact legacy parity plus human visual parity, not on pretending the already-broken detector works.
- Human visual gate PASS: Amanda confirmed the extracted Bone footer looks normal/unchanged.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/bootstrap bone-HUD ownership and registry changed; public Stable unchanged.

---

## DOCK-2026-09-17-015 — Make media readiness follow explicit Booth transitions

Date: 2026-09-17

### Summary

- v1.3.8 modal repair passed fresh-page automated lifecycle validation: About lazy-creates on first open, About/Disclaimer remain single-instance and mutually exclusive, and close button/backdrop/Escape all pass.
- The accompanying Booth/media smoke exposed a separate timer-delivery defect: Booth reached native runtime/engine ready, but 4K/8K/WebP controls remained disabled after 6 seconds because their existing polling intervals did not refresh the UI.
- Capability diagnosis proved the media services themselves were healthy: `KWPhotoBoothTrueResolutionReadiness.sync()` returned true and immediately enabled 4K/8K; `KWSpinnyMiniWebP.readCapabilities()` returned Ready and `KWSpinnyMiniWebPUI.refresh()` immediately enabled WebP.
- Booth v27.0.6 now invokes those existing optional named readiness seams after each explicit/default Booth session transition, so OFF immediately refreshes media readiness without depending on timers.
- Booth Runtime Bootstrap v0.2.1 invokes the same optional named seams when asynchronous native Booth bootstrap completes or fails, so media controls refresh when the native runtime actually becomes ready.
- Existing timer polling remains unchanged as fallback. Optional media failures are isolated; no media module source or HeroForge private internals changed.
- Public Stable and canonical Dev remain untouched.
- Live manual-reload gate PASS: loader 23/23 / 0 failed in 221.9 ms; first Booth ON booted native runtime with one Booth script / zero duplicates and enabled 4K/8K/WebP without manual readiness calls; OFF disabled them; second ON reused live BT with one script / zero duplicates and re-enabled all three; final state returned Booth OFF.
- v1.3.8 About modal was then opened successfully for the remaining human visual gate.

**Runtime/module/manifest/public behavior changed:** task-branch Booth tool/bootstrap versions and deterministic cache keys changed; public Stable unchanged.

---

## DOCK-2026-09-17-014 — Fix fresh-page About lazy creation

Date: 2026-09-17

### Summary

- Booth v27.0.5 / runtime bootstrap v0.2.0 final live regression passed on a normal manually refreshed HeroForge page: cold activation completed once, one native Booth script loaded, native maker became ready, 4K/8K/WebP enabled, loader remained 23/23 with zero failures, and off/on reused live BT with zero duplicates. Booth was left OFF; defaults/persistence remained unchanged.
- The required fresh-page human modal gate exposed a separate v1.3.7 bug before visual review: `KWWitchDockModals.openAbout()` did not create the About overlay when it had not already been created.
- Root cause is confirmed in source: `openDisclaimer()` calls its `ensureDisclaimer()` lazy creator, while `openAbout()` omitted `ensureAbout()`. The earlier structural probe had explicitly called `ensureAbout()` first and therefore masked the fresh-page path.
- Modal module patched to v0.1.1 / build `0.1.1-lazy-about-open`; `openAbout()` now invokes `ensureAbout()` before opening.
- Dev launcher bumped to v1.3.8 / build `1.3.8-modal-lazy-about-fix` so the corrected modal module has a fresh deterministic cache identity.
- No Booth/runtime-bootstrap code changed in this patch. Public Stable and canonical Dev remain untouched.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/modal module and registry identity changed; public Stable unchanged.

---

## DOCK-2026-09-17-013 — Make explicit Booth activation independent of timer polling

Date: 2026-09-17

### Summary

- v1.3.7 modal extraction baseline passed: Dev running/error null, external modal module configured, lazy modal creation preserved, and loader 23/23 with 0 failures.
- About/Disclaimer structural lifecycle passed automated validation: one overlay each, correct Dev name/version/footer/links/content, no duplicate creation, and mutual exclusion preserved.
- A Booth regression check on the same page proved a separate reliability defect: an explicit session Booth request stayed pending for 10 seconds while `Booth_Runtime_Bootstrap` remained at attempts=0, showing its 200 ms timer-only trigger had not fired.
- Added a direct optional handoff from Booth v27.0.5 / build `v27.0.5-explicit-session-handoff` to Booth Runtime Bootstrap v0.2.0 when a Booth session is turned on.
- Synchronized Booth's source-local/public API version fields to 27.0.5 so runtime diagnostics match the manifest/build identity.
- Gave the corrected Booth candidate a fresh deterministic build/cache identity so a prior task-branch CDN response cannot survive the source-sync rewrite.
- The bootstrap still uses HeroForge-native `BT.setBoothMode()` and retains the existing polling path as fallback; no direct `maker.enable()` bypass was added.
- Direct handoff is failure-isolated: Booth continues normally if the optional bootstrap capability is absent.
- Public Stable and canonical Dev remain untouched; human modal visual gate and live direct-handoff regression are still required.

**Runtime/module/manifest/public behavior changed:** task-branch Booth tool/bootstrap integration and module/cache-key versions changed; public Stable unchanged.

---

## DOCK-2026-09-17-012 — Extract About/Disclaimer UI behind bootstrap module

Date: 2026-09-17

- Completed the Booth v0.1.2 blocker live gate after a normal manual HeroForge refresh: one version-matched native Booth script, native maker/runtime ready, 4K/8K/WebP enabled, no bootstrap error, and off/on cycle preserved one script plus existing persistence/default values.
- Bumped the task launcher to v1.3.7 / build `1.3.7-extracted-core-modals` while preserving fixed Tampermonkey `@name WITCH DOCK - DEV`.
- Added `features/core/Witch_Dock_Modals.js`, registry id `witch-dock-modals`, v0.1.0 / build `0.1.0-extracted-about-disclaimer`.
- Launcher now fetches core, CSS, and modal JS in parallel through bounded `PRIVILEGED_HOST.requestText`; modal JS receives only bounded script metadata and the existing GitHub/Ko-fi URLs.
- Added guarded runtime extraction for the exact legacy About/Disclaimer block: all six legacy modal functions must exist exactly once, then their implementations are replaced with thin wrappers to `UW.KWWitchDockModals`.
- `getScriptMeta()` remains in core because bone HUD still consumes it. Header handlers, modal DOM ids/classes/content, mutual exclusion, close/Escape/overlay behavior, links, and version display are preserved.
- Checked-in `Witch_Dock.user.js` remains unchanged/Stable-derived; no storage, registry, drag/minimize, hotkey, undo/redo, bone-HUD, loader, or unrelated feature ownership moved.
- The Bridge helper used for pre-install static fetch did not execute candidate code because its nested helper config JSON failed to parse; this is recorded as probe-transport failure, not candidate failure. Installed v1.3.7 is the required syntax/runtime gate.
- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched.

**Runtime/module/manifest/public behavior changed:** task-branch launcher/modal ownership and registry changed; public Stable unchanged.

---

## DOCK-2026-09-17-011 — Repair cold-page Booth activation during v1.3.6 validation

- Bumped `booth-runtime-bootstrap` to v0.1.2 / build `0.1.2-session-cold-start` with deterministic cache key.
- Current-session Booth View now cold-starts HeroForge's version-matched `/gated/booth.js` when native `BT` is absent, then delegates activation to native `BT.setBoothMode()`; no direct `maker.enable()` bypass remains.
- Final live PASS: native `BT.maker.enabled=true`, runtime/engine ready, one Booth script / zero duplicates, 4K/8K/WebP enabled, no error; off/on cycle preserved defaults and persistence. Bridge: `hf-20260917-wd10-booth-final-activate-001`, `hf-20260917-wd10-media-controls-final-001`, `hf-20260917-wd10-booth-cycle-final-001`.

---

## DOCK-2026-09-17-010 — Extract core Dock CSS behind privileged bootstrap

- v1.3.6 / build `1.3.6-extracted-core-css`; added `features/core/Witch_Dock_Styles.css` v0.1.0.
- Core + stylesheet fetched in parallel through the bounded host; guarded CSS parity permits only the approved compact-icon 40px→48px delta; legacy `addStyles()` is no-op'd at runtime to prevent duplicate insertion.
- Live automated and Amanda visual gates passed; one effective stylesheet, correct 48px emblem, normal Dock appearance, loader 23/23 / 0 failed.

---

## Current prior milestones

- **009:** enlarged correct compact emblem to 48px inside unchanged 54px button; human gate PASS.
- **008:** restored known-good inline emblem after external asset failed visual gate.
- **007:** stabilized Tampermonkey identity as fixed `WITCH DOCK - DEV`.
- **006:** external compact-emblem experiment; runtime pass / visual fail.
- **005:** v1.3.1 host-owned bootstrap core fetch.
- **004:** v1.3.0 bounded privileged-host seam.
- **003:** issue #10 core contract freeze.
- **002:** canonical Dev identity/routing and cleanup rules.
- **001:** clean Stable-derived `WITCH_DEV_MAIN` governance baseline.

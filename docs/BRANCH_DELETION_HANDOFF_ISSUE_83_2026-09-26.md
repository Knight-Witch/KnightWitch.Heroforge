# Branch Deletion Handoff — Issues #58/#83 combined public v2.3.1

**Status:** COMPLETE — 27 exact branch refs deleted, 29 KEEP refs verified
**Repository:** `Knight-Witch/KnightWitch.Heroforge`
**Prepared:** 2026-09-26 UTC
**Tracking:** issue #14; source issues #58 and #83

## Completed gates

- Amanda approved #58 typography and the #83 popup visual. The user-authored release text is retained, with the requested old-script removal instruction added in both views.
- Public v2.3.1 is live on `Witch_Scripts`: launcher payload `50405ca027e28227123f475c488538d214644b0d`; live Stable host on installed v2.3.0 dispatched v2.3.1; module loader 25/25, 0 failed/fallback.
- Canonical Dev v1.10.3 pins payload `a0fe5d89777877c90b2e5ffd7e17bb92f68d3abc`; promoted shared runtime files are byte-identical. Dev-only #35 diagnostic capture/UI/service seam and #19 channel routing remain intentional.
- No temporary test probes or adapters are present in promoted scope. Only this branch-ref cleanup remains.

## Reachability and classification

The combined RC head `327053785876bb8c7cd0a45876bc86c9b693c108` is an ancestor of public Stable. Other #58/#83 branch tips are isolated staging/live-gate snapshots, **not** ancestors of canonical refs. Their accepted runtime outcomes are present byte-for-byte in canonical Dev/Stable and their validation/decision trail is recorded on issues #58/#83 and in Git history; no unique runtime work needs to remain active under these temporary refs. Do not merge their isolated history into canonical branches for cleanup.

The live inventory at preparation contained 56 branch refs: DELETE 27, KEEP 29. Other issues' existing handoff refs are deliberately KEEP here and are outside this cleanup.

## DELETE exactly these 27 branch refs

- `wd/58-header-compact-launcher` @ `3e6ea7c6aa097786f1aef4df5e74326866fbed37`
- `wd/58-header-compact-left` @ `e067635e5d15beacc5cf91ef10fd24d033eca3b4`
- `wd/58-header-compact-payload` @ `7c34a99fecb58993a48e6751fb5bd237f231b119`
- `wd/58-live-gate-record-193` @ `c0f4cbfef3f5622f35e3bfe6b6d720bd304ecb50`
- `wd/58-live-gate-record-194` @ `b96fae38d64e5ae88adac744906fba8f1382c04a`
- `wd/58-live-gate-record-195` @ `96b7022a4b9e4d3a965f4f320bf8d6dd6046c12c`
- `wd/58-live-gate-record-196` @ `fbf717ca390eadc0979092f67e8b0664353a4ae2`
- `wd/58-polymorph-display-font` @ `b3a91a8b8e36b193d7746e08e6ece3c942dcec79`
- `wd/58-polymorph-display-font-launcher` @ `029fb45078848c6562b69bb7b2f0b9040e079387`
- `wd/58-polymorph-display-font-payload` @ `7f6432277ea45ee45116ff1fd66078f854ab28c2`
- `wd/58-title-alignment-fix` @ `db043adb0531296638666da6d6401ed7b0118b1a`
- `wd/58-title-alignment-launcher` @ `e9907d3f7ce7998406ba7ac9263bfe60252700c5`
- `wd/58-title-alignment-payload` @ `350336d91b2632064d771b7376fc6bc7bb7fc58e`
- `wd/58-title-typography-launcher` @ `10e251b989e3612b0f9be4411b1f281632ec3870`
- `wd/58-title-typography-payload` @ `54c575db6fbfd553cb731db7b8828fb9c7324d46`
- `wd/58-title-typography-refine` @ `0e51389bf8889fdd53c9ecf175a423373e86cd5f`
- `wd/58-ui-standardization-launcher` @ `f2a33a2dc8a61c5dfe61ba3df998f1d25ead3795`
- `wd/58-ui-standardization-pass` @ `2634d99487ba801b08caf87378940a3fb418dbe9`
- `wd/58-ui-standardization-payload` @ `283275a1fd5f18dc9c0fb70e5ac1943f76106644`
- `wd/58-version-baseline-align` @ `84f1ba8e4113af3bb74fc383060e57cb8f073e54`
- `wd/58-version-baseline-launcher` @ `9b94b3c223c46204f480b6515859ef67b46e45f5`
- `wd/58-version-baseline-payload` @ `3e27c64a2f174a1204d63adf9fcb72d5847c5136`
- `wd/83-58-public-rc` @ `327053785876bb8c7cd0a45876bc86c9b693c108`
- `wd/83-live-gate-record-1100` @ `bfca6dfbddcf881732ad7ec018b7b52c6decf92a`
- `wd/83-notifications-launcher` @ `ef97b917a4b95ecd77f2c027b3fef3d196d546e4`
- `wd/83-notifications-payload` @ `ab9d7adbf32a9e08c5c5efb5aacf7ff1eb9c62b7`
- `wd/83-reusable-notifications` @ `c1c86cd2e55adbe39602353c52cd278257897f72`

## KEEP exactly these 29 branch refs

These SHAs are the preparation snapshot. `WITCH_DEV_MAIN` advances when this handoff and release closeout documentation are committed; compare its current head to the final closeout commit before deletion. All other KEEP refs must remain unchanged.

- `WITCH_DEV_MAIN` @ `c74fba044fd570246380cef5878cb9dca84d0228`
- `Witch_Scripts` @ `303c56806d74b18338f866f601b904010356bf52`
- `archive/Witch_Scripts-pre-modular-20260920` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`
- `wd/28-public-payload-2.0.0` @ `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`
- `wd/32-body-aaid-binding` @ `4ccfd0d4c9807e3da84d58c329eabaef110144f7`
- `wd/32-public-rc` @ `d2d2298e1949da71d64bb11e880f5af6868809f8`
- `wd/35-hr-diagnostic-capture` @ `777862297f9549ce80985d4c7156e199a39f4c72`
- `wd/37-dock-size-reset` @ `4abbca9010b22b27e8e48277c6f3a620986a1d9f`
- `wd/37-dock-size-reset-launcher` @ `cff13d7db19b38967a67b7f52a859927fe951fbd`
- `wd/37-live-gate-record` @ `f30a9c1d926c0439106640bbc82702cb389f534b`
- `wd/37-public-rc` @ `407d9b6d46dd93a2e2818e59bbea7aa6333b6b20`
- `wd/37-version-meta` @ `a5a8ed20730fdf1f93e9810c9ffa672fd405537e`
- `wd/37-version-meta-launcher` @ `35b0a5e619df13e25b45d0f7e6ec78cda2dde97e`
- `wd/37-version-meta-payload` @ `3ce5687ef27390294098ffb9fbf2fb8f6cb166e3`
- `wd/41-dev-auto-host-head-resolve` @ `55596c5e9b47fa93b1820d84d640111b19ef3581`
- `wd/41-dev-launcher` @ `37da6119acd15b9da1c3bcc49d50346935c272d4`
- `wd/41-dev-live-pass` @ `8ca58aa4f0db07aecc34ae9d5a6a449e0cd18c2d`
- `wd/41-dev-payload` @ `f64839aed1fca6e0490223075f1b7745a51a2a41`
- `wd/41-dev-update-host` @ `82479269ee49cdfc37c7c10195aacabe61699f4d`
- `wd/41-public-rc` @ `50b22b3f9d8bf030f958b5372e008bca5404fa1d`
- `wd/41-release-closeout` @ `acb37dbbd4a7ef14cd8f8676d44a40ad1de4ee5d`
- `wd/41-resize-reset-affordance` @ `3e036857ecc0fd8e4cf7e3c72d4ebe6a198c3696`
- `wd/41-resize-reset-dev-launcher` @ `29a3e02051b1c1795db7165170a1a3978b31a83e`
- `wd/41-resize-reset-dev-payload` @ `74f46948407116dc97bc861d1bf0df6f9fc1bb0a`
- `wd/41-smoke-handoff` @ `278153969825959b3ddcf8dbc83664abadd769b7`
- `wd/88-diagnostic-capture-architecture` @ `5c421d459b73d89e0576326b04ccbe4e659a6d12`
- `wd/dev-auto-host` @ `40280f480c6d5019318e2af61e5a85186c135c66`
- `wd/payload-1.5.1` @ `6603911658b426c6b95367697bedcc4c7acf67eb`
- `wd/payload-1.5.4` @ `6aee7fd8716d986e39b7415cf8927fa7043e776b`

## Completed execution

GitHub branch UI deleted the 27 exact matching refs. A fresh live `ls-remote --heads` inventory contained exactly the 29 KEEP names listed below, zero DELETE names, unchanged KEEP SHAs except the documented canonical Dev closeout advance to `946362d95edc3ec3fd55416a50d1e2bde1bad27c`. No other refs were touched.

## Execution and verification

1. Read the live branch inventory. For each DELETE ref, require the exact SHA above; if absent, treat it as already deleted; if it moved, stop and report the mismatch.
2. Delete only exact matching DELETE refs. Never merge, rebase, retarget, rename, archive, or modify a KEEP ref.
3. If a deletion result is uncertain, read the live ref before any retry. Never blindly repeat an uncertain mutation.
4. Verify the final branch-name inventory equals the 29 KEEP refs listed above, with the latest documented canonical Dev head. Report completion on #14 and source issues #58/#83.
5. Mark this handoff complete, remove its temporary ACTIVE_CONTEXT routing note, and record the documentation-only closeout in CHANGELOG.md and PRE_FLIGHT_Check.md. No runtime/module/manifest/public behavior changes are authorized for that documentation step.

## Archived Work instruction (already executed)

Clean up the completed #58/#83 release branches in `Knight-Witch/KnightWitch.Heroforge`. The audit, classification, and exact branch inventory are complete. Do not repeat the audit unless live state contradicts the handoff. Read `WITCH_DEV_MAIN/docs/BRANCH_DELETION_HANDOFF_ISSUE_83_2026-09-26.md`. Delete exactly the 27 listed DELETE refs at their expected SHAs, preserve the 29 KEEP refs, verify the final inventory, report on issue #14, and perform only the narrow documentation closeout described above.

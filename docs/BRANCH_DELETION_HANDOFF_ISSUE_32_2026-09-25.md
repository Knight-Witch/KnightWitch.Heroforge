# Branch Deletion Handoff — Issue #32 — 2026-09-25

**Status:** READY FOR WORK — exact mechanical deletion only  
**Repository:** `Knight-Witch/KnightWitch.Heroforge`  
**Prepared:** 2026-09-25  
**Release:** public v2.2.2 — HR body paint zone collapse  
**Source issue:** #32  
**Janitorial tracking:** #14

## Purpose

Delete only the two short-lived issue #32 refs now that the validated repair is safely preserved on canonical Dev and public Stable. Do not re-audit or reinterpret the DELETE set unless live GitHub state directly contradicts this handoff.

## Preconditions — PASS

- Human and Robot visual paint-zone gates passed in Dev.
- Robot/Human/Canine structural AAID validation passed in Dev.
- Public Stable promotion completed at `d2d2298e1949da71d64bb11e880f5af6868809f8`.
- Stable v2.2.2 smoke passed: loader 23/23, immutable=23, fallback=0, failed=0.
- Stable Half Dragon HR ON bound real 1024 body AAIDs with 2048 body allocations; native OFF restore passed and returned real 512 body AAIDs.
- #32 runtime divergence is removed from `DEV_DIVERGENCES.json`; issue #35 remains the intentional Dev-only diagnostic owner for the additional Texture Quality diagnostic seam.
- `wd/32-body-aaid-binding` head is reachable from `WITCH_DEV_MAIN`.
- `wd/32-public-rc` head is exactly the current `Witch_Scripts` head.
- Promotion diff was limited to Texture Quality, manifest/cache identity, Stable launcher pin/version, and release records.

## DELETE exactly these branches

- `wd/32-body-aaid-binding` @ `4ccfd0d4c9807e3da84d58c329eabaef110144f7`
- `wd/32-public-rc` @ `d2d2298e1949da71d64bb11e880f5af6868809f8`

## KEEP exactly these currently live branches for this #32 handoff

- `WITCH_DEV_MAIN` @ `96954462a2cf29049247475ef0456eb55d4de6c0`
- `Witch_Scripts` @ `d2d2298e1949da71d64bb11e880f5af6868809f8`
- `archive/Witch_Scripts-pre-modular-20260920` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`
- `wd/28-public-payload-2.0.0` @ `aa54a3cdb6785c5bf78a7b04b5ddccf09cc37b2a`
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
- `wd/58-polymorph-display-font` @ `b3a91a8b8e36b193d7746e08e6ece3c942dcec79`
- `wd/58-polymorph-display-font-launcher` @ `029fb45078848c6562b69bb7b2f0b9040e079387`
- `wd/58-polymorph-display-font-payload` @ `7f6432277ea45ee45116ff1fd66078f854ab28c2`
- `wd/dev-auto-host` @ `40280f480c6d5019318e2af61e5a85186c135c66`
- `wd/payload-1.5.1` @ `6603911658b426c6b95367697bedcc4c7acf67eb`
- `wd/payload-1.5.4` @ `6aee7fd8716d986e39b7415cf8927fa7043e776b`

Some KEEP refs above are independently scheduled by existing #35/#37/#41 handoffs. This #32 handoff does not authorize touching them. If a sibling handoff has already deleted one of its own recorded refs before this handoff runs, that absence is not authorization to delete anything else; verify the two #32 DELETE refs against their exact SHAs and preserve every other then-live ref.

## Execution rules

- Delete only the two listed #32 DELETE branch refs.
- Do not merge, rebase, retarget, rename, archive, or modify any other branch.
- If either DELETE ref no longer matches its recorded SHA, stop and report the contradiction.
- If deletion execution is uncertain, read live state before retrying; never blindly replay.
- Do not create replacement/archive refs.
- Do not modify runtime code.

## Verification

After deletion:

1. fetch the live branch inventory;
2. verify both #32 DELETE refs are absent;
3. verify no other then-live ref was removed by this execution;
4. record completion on issue #14;
5. mark this handoff complete and perform only the required documentation-only CHANGELOG / PRE_FLIGHT / ACTIVE_CONTEXT cleanup.

## Paste-ready Work instruction

Clean up completed issue #32 branches in `Knight-Witch/KnightWitch.Heroforge`.

The audit, reachability checks, and branch classification are complete. Do not redo them unless live repository state directly contradicts the handoff.

Read and execute:

`WITCH_DEV_MAIN/docs/BRANCH_DELETION_HANDOFF_ISSUE_32_2026-09-25.md`

Delete exactly the two listed #32 branches only when their refs still match the recorded SHAs. Preserve every other then-live branch. Verify the two #32 refs are gone, record the result on issue #14, and make only the handoff/documentation closeout required by the file.

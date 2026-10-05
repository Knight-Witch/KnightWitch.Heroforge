# Pre-Flight Check

## 2026-10-05 — HFJSON public-edge restoration / upstream redirect correction

- PASS: canonical Dev source is synchronized at `eb5650aa20635b2f82648353f7d922b76ca7fbd2`; runtime alias-map commit is `159caea74078d2533bcdb1d238a5f68095b321fc`.
- PASS: `npm --prefix tools/witchdock-runtime test` passes 12/12 route-contract tests immediately before deployment.
- PASS: deployed public `witchdock-runtime` Worker version `7b50ece3-addb-4e82-a847-f2a64bb07e1c` on custom domain `witchdock.knightwitch.dev`.
- PASS: all eight `/HFJSON/*.user.js` aliases return HTTP 307, `Cache-Control: no-store`, expected `Location`, and correct upstream-origin metadata.
- PASS: browser-equivalent redirect follow-through returned HTTP 200 for Full Res Decals, Extra Slots, and ReCK; the exact Extra Slots alias previously shown returning 404 is now live and redirecting.
- PASS: `/health` and existing channel/ref behavior were preserved by the unchanged Worker contract tests.
- No Stable launcher/module/manifest bytes changed. Public behavior changed only by restoring/correcting the scoped HFJSON redirect namespace. HF.Status production was not promoted by this deployment.

# Changelog

## Latest repository change — 2026-10-05

- Canonical Dev runtime commit `159caea74078d2533bcdb1d238a5f68095b321fc` corrected the HFJSON alias map and added the ReCK alias; follow-up documentation recorded the pre-deploy edge drift.
- Amanda explicitly authorized making the public `/HFJSON/` aliases reroute users to their authoritative upstream script targets.
- Deployed `witchdock-runtime` Worker version `7b50ece3-addb-4e82-a847-f2a64bb07e1c` to `witchdock.knightwitch.dev`; no Stable launcher/module/manifest bytes changed.
- Production smoke: all eight semantic aliases return HTTP 307 with `Cache-Control: no-store` and the expected `Location`; Full Res, Extra Slots, and ReCK follow through to upstream HTTP 200 targets.
- The previously observed live HFJSON 404 namespace failure is resolved. The cause of the superseded deployment drift was not established.
- Paired HF.Status ReCK/resource metadata remains Dev-live; this deployment did not promote unrelated HF.Status production changes.

## Latest Stable context

Stable v2.4.2, payload `93c0de5cd0da1dece3ef286c5a9201c83f1addb7`; unchanged.

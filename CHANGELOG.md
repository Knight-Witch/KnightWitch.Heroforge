# Changelog

## Latest repository change — 2026-10-05

- Canonical Dev runtime commit `159caea74078d2533bcdb1d238a5f68095b321fc` corrected HFJSON targets for HF Core Tweaks, Full Res Decals, Advanced Decal Posing, 2000 kitbash parts, and Camera Control Modifier to Amanda's exact supplied GitGud install URLs while preserving stable semantic `/HFJSON/` aliases.
- Added `reck-for-hero-forge.user.js`, redirecting to the upstream ReCK GitHub latest-release userscript. Extra Slots and Photo Booth Shader Fix targets are unchanged.
- Local route-contract tests pass 12/12. Direct smoke confirmed all six supplied upstream targets return HTTP 200.
- Live-edge inspection found deployment `1d07135d-62f9-4b49-b593-3ad4c537e7bc` still serves `/health` and Stable refs but returns 404 for `/HFJSON/` and a known Full Res alias. The missing live alias namespace is confirmed; the cause of the deployment drift is not established.
- The public `witchdock-runtime` edge has not been redeployed during this task. Explicit approval remains required before restoring/correcting the live alias routes.
- This follow-up commit is documentation-only and changes no additional runtime/module/manifest/public behavior.

## Latest Stable context

Stable v2.4.2, payload `93c0de5cd0da1dece3ef286c5a9201c83f1addb7`; unchanged.

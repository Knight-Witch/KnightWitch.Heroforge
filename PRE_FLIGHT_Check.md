# Pre-Flight Check

## 2026-10-09 — #111 corrected Decals v1.2.4 payload stage

- PASS: Canonical project contract/router, #111 handoff, active branch registry/queue, module versioning and Dev workflow read.
- PASS: Live Bridge #4800 verified prior two-layer preview fully reverted, mapping 8 and mapping 9 both in live native orderedDecals, l0_projected=0, l0_uvSet2=0. Bridge #4801 confirmed both native four-vector color palettes/UV shaders available.
- PASS: Dev-only targeted code restricts eligible UV circle gradient id1195 to mappings 8 and 9; rejects mapping 7; no figure data writes, no change in timeouts/rollback/cache-key/rebake behavior.
- PASS: node --check tools/Decals.js, node --test tests/issue111-legacy-uv-preview.test.cjs (1 test, all subassertions including GPU-change/exact-revert), JSON manifest parse, git diff --check.
- Feature registry: no impact — existing Decals Dev tool path/id and reporter taxonomy unchanged.
- PENDING: launcher/payload pairing, live Dev two-circle GPU proof and Amanda human visual gate. Public Stable untouched.

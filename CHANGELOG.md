# Changelog

## Latest repository change — 2026-10-08

- Issue #117: Dev-only Booth Runtime Bootstrap v0.2.3 repairs the actual HeroForge gated-asset filename mismatch: native `ASSET_MANIFEST.booth` now selects the current hashed Booth script. Reuses native script ownership; only bootstrap-owned failed tags are cleared, with bounded retry cooldown. Dev launcher v1.17.16 pins immutable payload c3063ad0734b0e5ef37490f5c9b47a4912b5950c.
- Live pre-fix Bridge evidence: HeroForge manifest `booth.b9ab74dd25ad.js`; old bootstrap requested `/gated/booth.js?version=heroforge06.1.10.13`, script status `error`, native `BT` absent; 13 failed attempts. Bridge GitHub 401 separately repaired with refreshed encrypted relay credential; ping and workbench succeeded.
- Four isolated Booth bootstrap tests pass; **updated Dev live visual verification pending**. No public Stable change.

## Latest Stable release context

Stable v2.4.3 retired the Phase 1 notice. No public promotion of October Booth or decal repairs.

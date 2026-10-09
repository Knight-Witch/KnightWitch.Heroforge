# Changelog

## Latest repository change — 2026-10-09

- **#111 Dev Decals v1.3.0 — independent M/N UV calibration:** Correct ID1178 M/N highlighting and untimed native refresh preservation now passes human visual gate (owner screenshot). Both nipples are still spatially misplaced, asymmetrically, so the common .94 chart-scale estimate is explicitly rejected.
- Added four optional separate, bounded UV offsets (U/V for M, U/V for N), shown together in a collapsible calibration section. Each maps only to its own native UV shader layer, with existing global nudge, native part/ID restrictions, cache rebake and ownership-safe manual rollback unchanged. Default scale is now 1.00 (no unvalidated shrink).
- Node regression proves independent per-decal movements, invalid bound rejection, changed GPU atlas, native overwrite reapplication, manual-only preview with zero expiry, figure-change safety, exact rollback and saved data immutability.
- Dev launcher still pins previous payload until atomic versioned launcher follow-up. Stable unchanged; no permanent UV migration.

## Latest Stable release context

Public Stable v2.4.3 contains no #111 experimental preview.

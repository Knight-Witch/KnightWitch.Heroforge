# Changelog

## Latest repository change — 2026-10-10

- **#111 evidence-only lower-body HAR comparison:** four independent Jan7 Blood Moon private HARs show bodyLower humanToes ID25057 version62/uvArea=.691/no uvPadded/faces3660/14596; current Bridge #4835 shows v90/uvArea=.634/uvPadded=1/same face counts. Upper ID1963 changed from v45/.690/no uvPadded to v66/.606/padded, same counts. Both body UV metadata sets changed; lower-body decal drift and species coverage still unverified.
- Current router and focused investigation updated with confirmed metadata, supported inference and unresolved native decal/UV-set cases. Private HAR contents not committed. No code, manifest/module, saved figure, or Stable changes.

## Latest Stable release context

Public Stable v2.4.3 contains no #111 experimental preview.

## Oct 10 2026 - Diagnostic evidence integrity, #120 (Dev candidate)
Manual JSON now detects v1 envelopes and legacy High Res schema 1 snapshots/comparisons. Preserves bytes; visibly warns on unsupported/unreadable content; uses generic JSON transport for unsupported evidence rather than inventing invalid kind. Local tests 8/8 passing. Task branch is private and not deployed or promoted. Paired HF.Status #134 and coordination #24 are open; real HFBR attachment verification pending.

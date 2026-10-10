# Changelog

## Latest repository change — 2026-10-10

- **#111 evidence-only lower-body HAR comparison:** four independent Jan7 Blood Moon private HARs show bodyLower humanToes ID25057 version62/uvArea=.691/no uvPadded/faces3660/14596; current Bridge #4835 shows v90/uvArea=.634/uvPadded=1/same face counts. Upper ID1963 changed from v45/.690/no uvPadded to v66/.606/padded, same counts. Both body UV metadata sets changed; lower-body decal drift and species coverage still unverified.
- Current router and focused investigation updated with confirmed metadata, supported inference and unresolved native decal/UV-set cases. Private HAR contents not committed. No code, manifest/module, saved figure, or Stable changes.

## Latest Stable release context

Public Stable v2.4.3 contains no #111 experimental preview.

## Oct 10 2026 - Diagnostic evidence integrity, #120 (Dev candidate)
Manual JSON now detects v1 envelopes and legacy High Res schema 1 snapshots/comparisons. Preserves bytes; visibly warns on unsupported/unreadable content; uses generic JSON transport for unsupported evidence rather than inventing invalid kind. Local tests 8/8 passing. Task branch is private and not deployed or promoted. Paired HF.Status #134 and coordination #24 are open; real HFBR attachment verification pending.

## Issue #120 — Dev integration checkpoint
- Reporter module 0.4.7 / 0.4.7-manual-diagnostic-contract with paired manifest/build; no HF.Status feature registry change (existing reporter only), no Stable change. Exact original HFBR Dev files and sections verified by HF.Status #134; historical Dev indexed without rewriting R2. Live Witch Dock Dev launcher re-pairing and human UI smoke remain acceptance gates.

## 2026-10-10 — #120 Dev diagnostic evidence launcher pairing
- Dev launcher v1.17.27 / 1.17.27-manual-json-evidence pins immutable source payload `7c0e51f74360a1838d840bc740bae567e9899762`, including Bug Reporter UI v0.4.7, without changing Public Stable or #111 diagnostics.
- Local gates: module 8/8 focused tests, manifest version/build/fallback matched, launcher source syntax/identity consistent. Domain and live browser smoke separately verified as applicable; no human HeroForge visual confirmation assumed.

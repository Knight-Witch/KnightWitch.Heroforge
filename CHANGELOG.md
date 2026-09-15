# Changelog

This active Stable changelog is intentionally compact. Detailed prior Stable entries through `DOCK-2026-09-14-036` remain preserved in Git history at Stable head `dcf53166a12321cc5bbe1d94133c3d1d29655e59` and earlier.

## DOCK-2026-09-15-037 — Promote Texture Quality kitbash lifecycle and projected-host patch

Date: 2026-09-15

### Summary

Narrowly promote the human-validated Texture Quality patch from `WITCH_DEV_UI` commit `d0d198cea6f8d755b79ff667c1b3d550956ea0cb` into public `Witch_Scripts`.

- core service advances to v0.3.5 / build `0.3.5-preserve-native-source-floor`, exact Dev blob `f63665ebd34cdaee865de65b4b6ff973eb85b582`;
- new same-figure drift guard v0.1.0 / build `0.1.0-dev-stable-same-figure-repair`, exact Dev blob `830328fa2dd6405f9aec98cfa19b8868ad714b96`;
- active-decal policy advances to v0.1.1 / build `0.1.1-dev-projected-host-lifecycle-coordination`, exact Dev blob `a89c57e09cdaa2f4213f6b3a8eed95118f4c4d14`;
- the public manifest loads core -> same-figure guard -> active-decal policy -> existing Texture Quality UI, preserving the validated wrapper/lifecycle order;
- projected `data.decals.splatter[*].filter` hosts are now included only when the filter value is literally `true`, the target is a real atlas part, and the target is not bodyLower/bodyUpper/face already owned by the core service;
- same-figure kitbash policy loss is repaired only after HeroForge reaches the existing stable ready generation, reusing the accepted readiness/stability contract rather than a guessed delay;
- Amanda performed the committed Dev visual gate on D4 with wings: a real kitbash move completed with no visible issue after the repair candidate was loaded.

Static promotion checks: exact reconstruction of the prior Stable manifest matched blob `965aedcc68faff80e878a297c3237a0d2a470ef8`; candidate manifest parses with unique registry/tool IDs; all three promoted runtime blobs are the already syntax-checked Dev blobs; all new public loader URLs point only to `Witch_Scripts`.

**Runtime behavior changed:** yes — public Stable gains the projected-host texture policy and bounded same-figure kitbash lifecycle repair. No unrelated Dev modules are promoted.

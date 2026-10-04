# Pre-Flight Check

## 2026-10-04 — #25 ear restoration and Viper trial

- PASS: existing ACTIVE PROTECTED `wd/25-texture-coverage` used; no new branch. Shaelynn native identity and High Res ready/finished verified with `k_80` 512², `k_78` 256² and core bodyUpper 2048² (#4050/#4056). Amanda confirmed that the 512² ear looked sharper than its 256² control.
- PASS: D5 native identity read back with four 1024² wing placements at a 8192×4096 atlas (#4053/#4054); exact 1024 source triples returned HTTP 200 and 2048 variants HTTP 404. Shaelynn human-ear 512 triple returned 200 and 1024 triple 404. These URL results are source-specific.
- PASS: at-most-once Shaelynn restore wrote `k_80` scale 8→4 (#4060); same-request identity readback confirms native 256² ear packing, bodyUpper 2048², 4096² atlas and ready/finished (#4075).
- PASS: after the competing tab closed, sole-client Viper identity/ready state was confirmed (#4089). The 56-host 8192×4096 atlas occupies 33,096,704 pixels (98.64%); 13 selected targets and 25 exact source probes are recorded (#4099/#4105).
- PASS: CPU-only one-candidate repacks distinguish two collateral-free targets from four harmful transfers (#4113). Combined rapier 128→512 plus left gauntlet 256→512 changes only those rectangles at 99.95% occupancy (#4115); live readback preserves right gauntlet 256, cape 1024, bodyUpper 2048, atlas 8192×4096, ready/finished and High Res verification (#4119).
- PASS: Amanda accepted visible sharpness for Viper's 512² Snowforged rapier and remained unsure about the 512²/256² gauntlet comparison. At-most-once restore returned rapier to scale 0.51 / 128², deleted the temporary left-gauntlet scale, and restored both gauntlets to 256² with cape/body/atlas/readiness/verification intact (#4120–#4121).
- PENDING: continue Counting Sheep; Viper gauntlet visual benefit remains unresolved. Aowyn remains excluded; #7 still has no failed request URL.
- PASS: targeted CSV row/schema/count and matrix classification totals checked.
- No runtime/module/manifest/public behavior changed. No branch classification change or Stable change.

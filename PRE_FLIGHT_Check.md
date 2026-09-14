# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-14-066 -- Multi-figure stress acceptance

Date: 2026-09-14

### Scope

Close the current Dev validation gate for Texture Quality multi-figure support without changing runtime code, manifest data, ownership boundaries, timing, or public Stable.

### Confirmed findings

- exact committed v0.3.4 / `0.3.4-dev-native-color-material-setup` loaded from WITCH_DEV_UI after refresh;
- committed-source three-figure Seya Enable/Disable smoke passed and Seya visually upgraded as a non-primary figure;
- heavy follow-up used three detailed figures with a 1030% kitbash load;
- clean OFF baseline: primary body 512px / face 1024px; extra 1 body 512px / face 512px; extra 2 body 512px / face 1024px;
- heavy Enable PASS in ~4.05s, renderer idle, three native atlases verified;
- primary packed 2048px on bodyLower/bodyUpper/face;
- extra 1 packed 1024px bodyLower/bodyUpper and 2048px face under atlas pressure while its bake/used targets remained 2048;
- extra 2 packed 2048px on bodyLower/bodyUpper/face;
- 1024px is the deliberate High Res verification floor (`USED` source seed); native promotion to 2048 is opportunistic, so extra 1 remained within current feature guarantees;
- human visual gate PASS: all three body textures and decals looked high resolution / stellar;
- heavy Disable PASS in ~4.1s, root idle, non-primary `materialSim="color"` intact;
- Disable source-restore semantics intentionally retain the already-built native atlas allocations until HeroForge rebuilds them;
- final Enable PASS in ~3.49s; scene left High Res ON.

### Bridge evidence

- #2177 clean OFF / idle state;
- #2178/#2181 clean allocation baselines;
- #2182/#2183 heavy Enable result;
- #2184/#2185 per-extra post-enable allocations;
- #2186 confirms extra 1 retained 2048 bake/used targets;
- #2187/#2188 confirms verifier accepted the 1024 floor by design;
- #2189/#2190 heavy Disable/restore result;
- #2191/#2192 post-restore allocations/material sims;
- #2193/#2194 final re-enable result.

### Gate result

Current Texture Quality multi-figure Dev phase: PASS.

Remaining release step is procedural: public Stable remains untouched until Amanda gives explicit narrow promotion approval. Future ultra-heavy / "insanity mode" work is separate and should begin only when a target drops below the 1024px High Res floor or a verified state still looks visibly degraded.

**Runtime behavior changed:** no -- documentation-only validation record.

---

## PFC-2026-09-14-065 -- Native color-material refresh

v0.3.4 fixed shared-Part color-bake material refresh by invoking HeroForge-owned `setupMaterials('color')` after policy install and during restore. Candidate, committed-source smoke, and Seya visual gate passed.

---

## PFC-2026-09-14-064 -- Shared-Part snapshot ownership

v0.3.3 deduplicated Part snapshots by object identity and passed repeated Enable/Disable plus dynamic membership validation.

---

## Prior current preflight

PFC-2026-09-13-063 and earlier detailed entries remain preserved in Git history.

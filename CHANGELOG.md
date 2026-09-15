# Changelog

This active Stable changelog is intentionally compact. Detailed prior Stable entries through `DOCK-2026-09-12-032` remain preserved in Git history at promotion head `d2470ee7d1fbfe052326937a9ba9468ff5339fbf` and earlier.

## DOCK-2026-09-14-035 — Publish approved Texture Quality beta notice

Date: 2026-09-14

### Summary

Narrowly promote the human-approved Texture Quality Phase 1 announcement from `WITCH_DEV_UI` into public `Witch_Scripts` without changing the accepted Texture Quality service/UI runtime.

- notice v0.2.1 / build `0.2.1-frd-warning-assets-signoff`;
- approved Dev source commit: `bb73e05fcf8ff9f920fb6171d7777d84466c221b`;
- approved Dev notice blob: `9c575825179a97e0682caab3f508a21b512bf6ce`;
- Stable-equivalent notice differs only in public source labeling and the asset base moving from `WITCH_DEV_UI` to `Witch_Scripts`; Stable notice blob: `4802b536d00457d2580100792262cabbef73a5e5`;
- FRD guide asset blob: `b968a8d622e95ac1b1a42e397731e4be79c0c84d`;
- white emblem asset blob: `0615e1d888820677d60332618b6cca918a68b26a`;
- Amanda visually approved the Dev popup with the dual-warning FRD callout, centered FRD settings guide, normalized punctuation, centered emblem sign-off, and `Hell Yeah!` confirmation button.

The public manifest now registers the beta notice as a hidden enabled-by-default HeroForge UI module and loads it only from `Witch_Scripts` using the deterministic v0.2.1 cache key. The notice remains one-time via its existing acknowledgement key and does not change Texture Quality engine behavior.

Static pre-promotion checks passed: `node --check`, manifest JSON parsing, unique module/tool IDs, Stable-only notice URL, and exact reconstruction of the pre-change Stable manifest blob `094835946282e5e66552a31e18036f56804a7827`.

**Runtime behavior changed:** yes — public Stable gains the approved one-time Texture Quality announcement UI. Texture Quality service v0.3.4 / UI v0.2.0 behavior is unchanged.

---

## DOCK-2026-09-14-034 — Close public Stable multi-figure Texture Quality rollout

Date: 2026-09-14

### Final public Stable result

Public `Witch_Scripts` runtime commit `d2470ee7d1fbfe052326937a9ba9468ff5339fbf` passed the required post-promotion Stable smoke with the Dev loader disabled.

- Stable provenance was confirmed from `Witch_Scripts/manifest.json`, not `WITCH_DEV_UI`;
- service: v0.3.4 / build `0.3.4-dev-native-color-material-setup`;
- UI: v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`;
- Amanda toggled High Res ON in public Stable, visually confirmed all three figures looked correct with zero errors, refreshed the page, and confirmed High Res persisted across the reload;
- Bridge #2204 confirmed the reloaded Stable scene ON with 3 figures, coherent native 4096×4096 atlas output, bodyLower/bodyUpper/face allocations and used sizes at 2048, exact pinned 1024×1024 body masks, and an idle renderer;
- Bridge #2205 performed one controlled Disable; #2206 confirmed `OFF for this session — Persistent High Res will return after reload`, no Texture Quality error, and an idle renderer;
- Bridge #2207 performed one controlled final Enable; #2208 confirmed Stable provenance again, all 3 figures verified, coherent 4096×4096 atlas output, 2048 target allocations/used sizes, pinned 1024×1024 masks, no error, and renderer idle;
- High Res was left ON at the end of the smoke.

The persistence bug from public v0.1.0 is therefore closed in public Stable: the desired High Res preference survives reload while each page/figure receives a fresh readiness/reconcile cycle rather than stale session ownership.

No unrelated Dev feature, beta notice, public shell change, HeroForge.Compatibility dependency, or HF-Chat-Bridge runtime dependency was promoted.

**Runtime behavior changed by this checkpoint:** no. Documentation-only closeout; public runtime remains exactly commit `d2470ee7d1fbfe052326937a9ba9468ff5339fbf`.

---

## DOCK-2026-09-14-033 — Promote accepted multi-figure Texture Quality to public Stable

Date: 2026-09-14

### Summary

Narrowly promoted the accepted `WITCH_DEV_UI` Texture Quality service/UI into public `Witch_Scripts` without merging unrelated Dev work.

- service v0.3.4 / build `0.3.4-dev-native-color-material-setup`, exact accepted Dev blob `cf2f5974177a65bc6a5419ace824cc9565b79710`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`, exact accepted Dev blob `863b5ccb4f76ffac105f2e0f8d3f46ac8a37ff94`;
- public runtime promotion commit `d2470ee7d1fbfe052326937a9ba9468ff5339fbf`, parent `c93485d741fe9d1801b0f6924b7204a8d922792c`;
- changed-file whitelist was exactly the two Texture Quality runtime files, `manifest.json`, `CHANGELOG.md`, and `PRE_FLIGHT_Check.md`;
- both exact runtime blobs passed `node --check`, candidate manifest parsed with unique module/tool IDs, and public Texture Quality URLs pointed only to `Witch_Scripts` with deterministic cache keys.

The promoted runtime preserves native HeroForge ownership, dynamic three-figure membership handling, shared-Part snapshot/restore behavior, native color material setup, persistent High Res preference with fresh readiness per page/figure, owned-state restore, atlas scale 4, bake target 2048, and the accepted 1024 source/allocation floor with native promotion toward 2048 where atlas pressure permits.

**Runtime behavior changed:** yes — public Stable Texture Quality advanced from service/UI v0.1.0 to v0.3.4/v0.2.0.

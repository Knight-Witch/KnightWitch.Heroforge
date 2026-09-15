# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-15-073 -- Hand off kitbash Texture Quality lifecycle investigation

Date: 2026-09-15

### Summary

Record the current Texture Quality investigation state before chat handoff. Stable remains untouched and no runtime/module/manifest source changed in this commit.

- Same-browser Chrome visual comparison against Lob's FullResDecals Extreme favored Witch Dock slightly on the tested figure's body decals; skirt detail appeared equivalent; wing comparison remained inconclusive because the wing decals were very large.
- Repeated 8192×4096 vs 8192×8192 body-decal comparison showed no visible gain from square 8K, so square 8K is not justified as a normal body-quality default.
- Corrected projected-decal discovery: real projected entries live under `character.data.decals.splatter` and target host parts through true `filter` keys. D4-with-wings exposed 35 projected entries, including 8 wing-target hits. Current v0.1.0 active-decal policy does not correctly cover these projected hosts.
- Confirmed same-figure kitbash lifecycle drift: moving the figure can clear owned `atlasScale` policy and drop packed body/head allocations while figure identity and part IDs remain unchanged, so the existing `sameFigureSet` scene-sync gate can miss the reset. Manual core reconcile restores the intended 2048 body/head allocations.
- Bridge #2491 captured a second clean post-kitbash potato state with HeroForge already reporting idle/ready: atlas 8192×4096; body/head scale entries missing; body sources still 2048; wing scale entries missing; wing sources still 1024.
- Immediately after that capture, Amanda observed the figure briefly remain potato and then automatically recover. The recovery is visually confirmed but its exact runtime cause is not yet proven; the next chat must capture the good→potato→recovered lifecycle before implementing a durable fix.
- A temporary runtime drift-guard probe was tested and fully removed. Premature reconcile while HeroForge still reports an update in progress can hit the accepted settle timeout, so no readiness/settle timing was weakened or replaced with guessed delays.
- Weird muddy/greenish body-color patches after kitbash remain a separate unproven visual symptom pending controlled recovery comparison.

Next work is routed through `ACTIVE_CONTEXT.md`: read-only recovered-state capture first, then one controlled kitbash lifecycle trace, projected `splatter` host selector fix, and only then a bounded same-figure drift repair if the correct stable seam is proven.

**Runtime behavior changed:** no -- documentation/router handoff only. Stable unchanged.

---

## DOCK-2026-09-14-072 -- Live-validate smart active-decal texture priority

Date: 2026-09-14

### Summary

Complete the narrow live Dev technical validation for commit `1da76212b352f6e4e03641d8e3e2c314eff5b111` without touching Stable.

- Exact committed active-decal policy v0.1.0 hot-loaded against core v0.3.5; hardware texture limit read 16384 and active atlas budget stayed 8192×4096.
- Current applied accessory decal slots were exactly `k_6`, `k_7`, and `k_9`; `k_9` / `clothVDress` verified at scale 4, used 2048, baked 2048, allocation 2048×2048, with core verification PASS and no runtime error.
- Recreated a clean absent-property baseline for accessory scale entries. The policy promoted the three active slots to scale 4, then a High Res disable restored all three entries back to absent properties exactly. Re-enable repopulated the policy and returned `k_9` to 2048×2048.
- Bounded dynamic remove/restore probe on the real `k_9` decal collection proved the selector follows actual decal presence: removal dropped policy ownership and allocation to 1024×1024; restoring the exact original decal object restored policy ownership and 2048×2048 allocation. Original object identity was preserved.
- Bridge evidence: #2327/#2328 exact hot-load, #2330/#2331 clean baseline, #2332/#2333 disable restore, #2334/#2335 re-enable, #2336/#2337 dynamic decal remove/restore.
- The current scene exposes only one figure, so the new extension's multi-figure path remains a pre-promotion live gate. The already-accepted core multi-figure lifecycle is not reopened.

Human visual confirmation of the current figure is now the next gate; Stable remains unchanged.

**Runtime behavior changed:** no -- documentation/router update only. Runtime candidate was committed in DOCK-071.

---

## DOCK-2026-09-14-071 -- Add smart active-decal texture priority candidate

Dev candidate commit `1da76212b352f6e4e03641d8e3e2c314eff5b111` advances the core Texture Quality service to v0.3.5 / `0.3.5-preserve-native-source-floor` and adds isolated hidden service `texture-quality-active-decal-priority` v0.1.0 / `0.1.0-dev-active-decal-scale-policy`.

The core patch makes the 1024 source value a floor instead of lowering an already-promoted native source. The extension applies scale 4 only to non-core parts that actually carry decals in `figureData.decals`, raises allowed atlas maxima to at least 8192×4096 only when hardware support is confirmed, and restores only state it owns. A broader opt-in all-object texture mode remains a separate follow-on.

**Runtime behavior changed:** yes -- Dev only; no Stable promotion.

---

## DOCK-2026-09-14-070 -- Close Texture Quality beta notice public rollout

The approved notice v0.2.1 was published and Stable-smoke validated. Public service/UI state remained v0.3.4 / v0.2.0 at that closeout.

---

## Prior active history

DOCK-2026-09-14-069 and earlier detailed entries remain preserved in Git history. Fetch only when a current task needs their specific evidence.

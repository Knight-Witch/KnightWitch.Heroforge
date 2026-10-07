# Pre-Flight Check

## 2026-10-07 — #25 all-part High Res v0.1.11 marginal-value + clean replan baseline

- PASS: existing ACTIVE PROTECTED `wd/25-texture-coverage` remains the sole #25 task branch and is fast-forwarded from canonical Dev v1.17.10.
- CONFIRMED: current Counting Sheep runtime still fails the accepted 512 source+allocation control under v0.1.10.
- CONFIRMED: direct Bridge resource loading returns 512x512 textures for both absolute and relative Celestial Circlet 512 URLs; the `?42=pv` source suffix is valid.
- CONFIRMED DEFECT: negative source results persisted across later coverage passes even when the resource subsequently became loadable.
- CONFIRMED DEFECT: rollback restored all-part `atlasScale`, rebuilt, and only then restored observed non-core `_usedTextureSize`; a sticky promoted used-size could therefore survive into the rebuilt planning baseline.
- PASS: v0.1.11 scopes negative source probes to one coverage pass, consumes HeroForge's resolved resource texture directly, and restores observed used-size metadata before rollback rebuild.
- PASS: v0.1.11 replaces mandatory intrinsic-floor spending with dynamic one-increment-at-a-time marginal selection. Inputs are generic runtime evidence only: native ideal, detail pressure, repeated-host cost, source/density gain, and diminishing returns above native demand.
- PASS: repeated groups remain atomic; all density changes still pass detached native `CK.Atlas` baseline/no-collateral verification before live mutation.
- PASS: body/face ownership, exact outside-edit preservation, OFF->ON re-arm, event-driven observation, failure isolation, and disposal contracts remain intact.
- PASS: all-part + ownership regression suite passes 27/27.
- PASS: feature-registry impact = none.
- PASS: issue-branch checkpoint is committed/pushed at `516ec79898af8fec164ec47dc2251a3e672116d2` and fast-forward integrated into canonical Dev locally.
- PASS: Dev launcher header/runtime and manifest launcher registry are prepared at v1.17.11 / `1.17.11-marginal-value-replan-restore`; the prior payload pin is intentionally retained until the payload candidate commit exists.
- PENDING: pin the exact payload candidate SHA, verify recovery parity, live-prove Counting Sheep exact 512 source+allocation, then OFF->ON/anti-loop and the remaining required fixture/lifecycle matrix.
- No Stable/public promotion is authorized or performed.

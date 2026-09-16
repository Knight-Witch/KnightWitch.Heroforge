# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-16-076 -- Texture Quality post-promotion regression closeout

Date: 2026-09-16

### Scope

Documentation-only closeout for the already-promoted Texture Quality lifecycle/projected-host patch. No runtime source or public Stable change is included.

### Live regression evidence

- 2-figure High Res scene verified with D5/Seya + Demi at native 8192×4096 and core body/head 2048 policy.
- Real Demi kitbash drag: visible downgrade/recovery observed; guard repair count 0 -> 1; no collateral D5 failure.
- Third figure Witch of the Wilds: add verified at 3 figures; projected host `hairZ` discovered independently.
- Real Witch kitbash drag: guard repair count 1 -> 2 with `baseItemB` reason; final 3-figure state coherent.
- Remove Witch: returned to verified 2-figure state; `baseItemB` / `hairZ` active ownership disappeared; repair count remained 2.
- Same-canvas D5 -> Demi -> D5 switching: High Res stayed enabled; no new repair; host ownership remained isolated; HeroForge idle afterward.
- Canvas/scene round-trip with Persistence ON: visual reapply succeeded automatically. Decals were immediate; body atlases briefly rebuilt. Runtime afterward: `enabled:true`, `persistent:true`, `busy:false`, `sceneSyncPending:false`, no core error, status `ON — 2 figures · native atlases verified`; guard remained at exactly 2 repairs; active-decal module idle/no-error.
- Default/unpainted third-figure inert control: core status `ON — 3 figures · native atlases verified`; guard remained idle at exactly 2 repairs; active-decal state contained D5 wing hosts, Demi non-wing hosts, and `baseItemB.activeAccessorySlots: []`; HeroForge idle.
- Prior muddy/green artifact did not reproduce.

### Conclusion

Post-promotion Texture Quality regression hardening: **PASS / CLOSED**. No new Dev runtime fix or Stable promotion is required.

### Mandatory next gate

Do not begin another Witch Dock bug/feature. Move first to `Knight-Witch/HF-Chat-Bridge#2580` and improve trusted DEV workbench ergonomics/call scope. Validate that Bridge update and update Amanda's installed Bridge component(s) only as required before resuming the Witch Dock backlog.

### Validation for this commit

- Intended changed-file set: `ACTIVE_CONTEXT.md`, `CHANGELOG.md`, `PRE_FLIGHT_Check.md` only.
- No JavaScript, manifest, module version, cache key, or public Stable file is intentionally changed.
- Stable remains protected at `acaf18a0cfd2c751886e85a269b9427ddfaa5040`.

**Runtime behavior changed:** no. Documentation/housekeeping only.

---

## Prior current preflight

PFC-2026-09-15-075 and earlier detailed records remain preserved in Git history.

# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-12-054 — Texture Quality Phase 1 announcement

Date: 2026-09-12

### Scope

Add Amanda's requested one-time beta announcement while isolating it from the validated Texture Quality service and Utilities controls.

### Reviewed

- current `PROJECT_CONTRACT.md` and `ACTIVE_CONTEXT.md`;
- Texture Quality service v0.2.1 / build `0.2.1-dev-visible-auto-enable`;
- Texture Quality UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`;
- `MODULE_VERSIONING.md`;
- Witch Dock core About/Disclaimer overlay styling patterns;
- Bridge #1761 service static PASS, #1762/#1763 transport health, and #1764/#1765 clean-restart runtime state.

### Change

- new isolated module `texture-quality-beta-notice` v0.1.0 / build `0.1.0-phase1-announcement`;
- one-time modal title `Nat 20: New Beta Unlocked!`;
- explicit `OK` is the normal acknowledgement path;
- `OK` stores only `kw.witchDock.textureQuality.betaNotice.phase1.v1 = ack`;
- no renderer, figure, atlas, mask, service session, or persistence-preference state is stored by the notice;
- existing Texture Quality service/UI files remain unchanged by this update;
- manifest registry/tool entry and deterministic cache key added for the new module.

### Protected behavior

No source-policy values, native reconcile timing, hidden-tab gate, mask pinning, stale-figure refusal, Persistent behavior, temporary Disable semantics, or Advanced reconcile behavior changes here.

### Live observation to carry forward

After the Chrome restart, #1764 observed one transient automatic attempt fail because the exact 1024 body masks were not yet available; the final HeroForge figure identity then retriggered the bounded automatic path and #1765 verified the same runtime ON with no error, coherent 4096x4096 atlas, 2048 BL/BU/face allocations and 2048 used sizes. Treat this as a cold-start transition to recheck on the final reload, not as proof that the validated architecture needs another mutation.

### Required validation

Before Stable promotion: announcement syntax/manifest static PASS; first-run notice visible with marker absent; `OK` writes marker and dismisses; module reload does not repeat after acknowledgement; persistence temporary Disable/manual re-enable; final cold page reload with persistent preference; fresh-session figure change; atlas/mask verification; Booth topology smoke; Amanda visual/UX confirmation.

**Runtime behavior changed:** yes, Dev announcement only. Public Stable remains untouched.

---

## PFC-2026-09-12-053 — Persistent auto-enable visibility gate

Bridge #1755/#1757/#1760 confirmed the hidden-tab scheduler failure. Service v0.2.1 gates automatic persistence on visible HeroForge and #1761 confirmed exact syntax/manifest consistency PASS.

---

## Prior current preflight

PFC-2026-09-12-052 and earlier remain preserved in Git history. Fetch only when a current task needs their specific evidence.

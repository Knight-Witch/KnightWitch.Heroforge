# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-12-053 — Persistent auto-enable visibility gate

Date: 2026-09-12

### Scope

Correct the Dev-only Texture Quality v0.2.0 automatic persistence scheduler after live Bridge validation showed native HeroForge reconciliation does not reliably settle while the page is hidden/backgrounded.

### Confirmed failure

Bridge #1755 started persistent auto-enable while HeroForge was hidden. The native lifecycle remained mid-update; #1757 read back `_needsUpdating=true`, display/resource atlas identity mismatch, no active feature session after failure, and timeout errors from both reconcile and restore. Bridge #1760 confirmed `document.hidden=true`, `visibilityState="hidden"`, `hasFocus=false` during the failure.

### Change

- service v0.2.1 / build `0.2.1-dev-visible-auto-enable`;
- automatic persistence does not begin while HeroForge is hidden;
- a `visibilitychange` listener retries scheduling when the page becomes visible;
- manual enable, stale-figure refusal, native atlas ownership, mask pinning, restore, persistence boolean, and temporary session suppression remain otherwise unchanged;
- manifest registry/build/cache key updated.

### Required validation

Before any Stable promotion: syntax/static check, clean Dev load after Chrome restart, default/persisted startup behavior, visible-tab automatic enable, hidden-tab no-op, disable suppression, manual re-enable, figure-change fresh session, atlas/mask verification, Booth topology smoke, and Amanda visual/UX confirmation.

**Runtime behavior changed:** yes, Dev only. Public Stable remains untouched.

---

## PFC-2026-09-12-052 — Texture Quality persistence Dev implementation

The approved boolean-only persistence model and Advanced reconcile UI were implemented on WITCH_DEV_UI. The subsequent live hidden-tab failure is superseded by PFC-2026-09-12-053; no Stable mutation occurred.

---

## Prior current preflight

PFC-2026-09-12-051 and earlier remain preserved in Git history. Fetch only when a current task needs their specific evidence.
# Pre-Flight Check Log

Rolling current Dev pre-flight record. Older detail remains in Git history.

## PFC-2026-09-17-006 — External compact-emblem candidate

Date: 2026-09-17

### Scope

Issue #10 on `wd/10-modular-bootstrap`: first physical presentation/static ownership extraction after the privileged-host/bootstrap stages passed live validation.

### Stage C live evidence

- Dev v1.3.1 reported `bootstrapTransport: host.requestText`, `status: running`, `error: null`.
- Task-branch title/provenance was correct.
- `KWModuleLoader.getState()` reported 23 enabled / 23 started / 23 fetched / 23 executed / 0 failed, duration 458 ms.
- HF-Chat-Bridge request: `hf-20260917-wd10-stagec-verify-001`.

### Static evidence for v1.3.2

- `Witch_Dock_DEV.user.js` candidate v1.3.2 parses with `node --check`.
- Manifest launcher registry is synchronized at v1.3.2 / build `1.3.2-external-compact-emblem`; manifest structure remains 27 registry entries, 1 hidden bootstrap tool, 23 modules.
- Existing `ASSETS/emblem.png` is reused; no duplicate emblem asset is introduced.
- Launcher asserts exactly one inline base64 `COMPACT_EMBLEM_URL` declaration before replacing it with the task-branch asset URL. Unexpected seam counts go through the existing visible boot-error path.
- Existing core request cache-busting, manifest replacement, privilege boundary, storage keys, public `WitchDock` seams, loader order/concurrency/failure isolation, and Dock interactions are unchanged.
- No CSS is extracted in this commit.
- Checked-in `Witch_Dock.user.js` remains unchanged from the Stable-derived monolith.
- `DEV_DIVERGENCES.json` records the v1.3.2 acceptance scope.
- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched.

### Required live gate

1. Tampermonkey and title show `WITCH DOCK - DEV v1.3.2`.
2. Dev state reports `presentationAssetMode: external-compact-emblem`, expected task asset URL, `status: running`, `error: null`.
3. `#kwWDCompactIcon.src` resolves to the task-branch `ASSETS/emblem.png` URL.
4. Module loader remains 23/23 with zero failures.
5. Human visual gate: collapse to compact icon and confirm the emblem looks unchanged.

Do not begin CSS extraction until this gate passes.

**Runtime/module/manifest/public behavior changed:** task-branch compact-emblem ownership and launcher/manifest version changed; public Stable unchanged.

---

## Current prior pre-flights

- **PFC-2026-09-17-005:** v1.3.1 host-owned bootstrap core fetch candidate; later live-passed.
- **PFC-2026-09-17-004:** v1.3.0 privileged-host seam candidate; later live-passed.
- **PFC-2026-09-17-003:** issue #10 contract freeze; documentation only.
- **PFC-2026-09-17-002:** canonical Dev launcher/channel identity.
- **PFC-2026-09-17-001:** clean Stable-derived Dev governance baseline.

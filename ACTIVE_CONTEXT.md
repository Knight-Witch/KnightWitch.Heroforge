# Active Context — Dev Auto Host

**Updated:** 2026-09-28  
**Branch:** `wd/dev-auto-host`  
**Current host candidate:** v0.2.1  
**Target:** canonical `WITCH_DEV_MAIN`  
**Maintenance issue:** #41 — Dev/Stable update-delivery hardening (reopened for launcher permission compatibility)  
**Public Stable:** untouched.

## Current task

Dev launcher v1.14.0+ legitimately declares:

`@connect hf-status-dev.amanda-d5f.workers.dev`

for the optional #90 HF.Status public-status client.

Auto Host v0.2.0 correctly failed closed because its launcher metadata validator allowed only `raw.githubusercontent.com`. The dynamically executed launcher also receives Auto Host's privileged `GM_xmlhttpRequest`, so the installed Auto Host itself must declare the same HF.Status host permission.

## v0.2.1 change

Only the permission contract changes:

- Auto Host metadata adds `@connect hf-status-dev.amanda-d5f.workers.dev`.
- Launcher validator allows exactly:
  - `raw.githubusercontent.com` (required);
  - `hf-status-dev.amanda-d5f.workers.dev` (optional/allowed).
- `api.github.com` remains an Auto-Host-only permission for resolving canonical branch heads and is **not** accepted as a launcher-requested host.
- Any other launcher `@connect` still fails visibly.
- Existing immutable-head resolution, retries, grant validation, synthetic `GM_info`, duplicate protection, and direct-launcher conflict rejection remain unchanged.

## Required live gate

1. Update/install Auto Host v0.2.1 once from its raw branch URL.
2. Keep direct `WITCH DOCK - DEV` disabled.
3. Reload through HF-Chat-Bridge.
4. Require Auto Host `launcher-executed`, payload version v1.15.0, canonical Dev launcher running, and loader 35/35 / 0 failed / fallback=0.
5. Continue #59 JSON/script-compat live gates.

## Boundaries

- Development delivery infrastructure only.
- No public Stable mutation.
- No wildcard `@connect`.
- HF-Chat-Bridge remains development infrastructure only.

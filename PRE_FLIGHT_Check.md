# Pre-Flight Check Log

This is the rolling current Dev pre-flight log for `WITCH_DEV_MAIN`. Older Stable/legacy records remain durable in Git history.

## PFC-2026-09-17-005 — Host-owned bootstrap core fetch

Date: 2026-09-17

### Scope

Issue #10 Stage C on `wd/10-modular-bootstrap`: after Stage B passed live validation, make the bounded privileged host the actual owner of the Dev launcher core fetch without changing the monolithic application core.

### Stage B live evidence

- Human gate passed: Tampermonkey/Dock identity presented correctly and basic Dock behavior appeared normal.
- HF-Chat-Bridge v0.3.2 was healthy with page context available.
- `KWWitchDockDevChannel` reported branch `wd/10-modular-bootstrap`, correct task core/manifest URLs, and host API v0.1.0.
- `KWWitchDockHostInfo` reported `rawPrivilegesExposed: false` with all expected privileged capabilities available.
- Visible `#kwWDTitle` was `WITCH DOCK - DEV v1.3.0` with task-branch provenance.
- `KWModuleLoader.getState()` reported task-manifest provenance, 23 enabled / 23 started / 23 fetched / 23 executed / 0 failed, duration 505.7 ms.
- Dev state reported `running` with `error: null`.

### Static evidence for Stage C

- `Witch_Dock_DEV.user.js` v1.3.1 parses with `node --check`.
- Manifest launcher registry is synchronized at v1.3.1 / build `1.3.1-host-owned-core-fetch`.
- The launcher no longer has a second direct bootstrap `GM_xmlhttpRequest` path; core source is requested via `PRIVILEGED_HOST.requestText`.
- `KWWitchDockHostInfo` and Dev channel state expose diagnostic `bootstrapTransport: "host.requestText"` without exposing the privileged host itself page-globally.
- Existing cache-busting on the core request, manifest seam replacement, visible bootstrap failure handling, task-branch provenance, and current core execution behavior remain intact.
- `Witch_Dock.user.js` remains unchanged in Stage C.
- `DEV_DIVERGENCES.json` records the v1.3.1 host-owned-fetch acceptance criteria.
- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched.

### Required live gate

With the task-branch launcher updated/enabled and Stable disabled:

1. confirm Tampermonkey and Dock title show `WITCH DOCK - DEV v1.3.1`;
2. confirm Dev state is `running` / `error: null` and reports `bootstrapTransport: "host.requestText"`;
3. confirm `KWWitchDockHostInfo.bootstrapTransport === "host.requestText"`, `rawPrivilegesExposed === false`, and host capability flags remain present;
4. confirm `KWModuleLoader` still completes 23/23 with zero failures from the task manifest;
5. confirm basic Dock tabs/tools/interactions remain unchanged.

Do not begin physical monolith extraction until this gate passes.

**Runtime/module/manifest/public behavior changed:** task-branch Dev bootstrap ownership changed; monolithic core/public Stable unchanged.

---

## PFC-2026-09-17-004 — Privileged-host seam candidate

Date: 2026-09-17

### Scope

Issue #10 Stage B on `wd/10-modular-bootstrap`: introduce a bounded privileged-host seam in the Dev launcher while leaving the monolithic application core untouched.

### Static evidence

- `Witch_Dock_DEV.user.js` v1.3.0 parses with `node --check`.
- Manifest parses successfully with 27 unique registry entries, 23 modules, and one hidden bootstrap.
- `witch-dock-dev-launcher` is v1.3.0 / build `1.3.0-dev-privileged-host-seam`.
- Task-branch launcher metadata, core URL, manifest URL, bootstrap URL, and all 23 module URLs resolve to `wd/10-modular-bootstrap` for isolated testing.
- No task manifest runtime URL points to `Witch_Scripts`, `WITCH_DEV_UI`, legacy `WITCH_DEV`, or `WITCH_DEV_MAIN`.
- The privileged host object remains launcher-local. Page-visible `KWWitchDockHostInfo` contains diagnostic metadata only and explicitly reports `rawPrivilegesExposed: false`.
- Host storage methods reject keys outside `kw.*`; host repository requests reject URLs outside the repo raw prefix.
- `Witch_Dock.user.js` is unchanged from the Stage A/Stable-derived monolithic core.
- `DEV_DIVERGENCES.json` records #10 task-branch routing/host work and preserves #19 canonical-main requirements.
- Public `Witch_Scripts` is unchanged.

### Required live gate

With Stable disabled and the raw task-branch launcher installed/enabled:

1. confirm Tampermonkey and Dock title show `WITCH DOCK - DEV v1.3.0`;
2. confirm Dev channel/core/manifest provenance is `wd/10-modular-bootstrap`;
3. confirm `KWWitchDockHostInfo.apiVersion` is `0.1.0` and `rawPrivilegesExposed` is `false`;
4. confirm expected capability flags are present;
5. confirm `KWModuleLoader` completes normally with no unexpected failures;
6. confirm representative runtime module URLs come from the task branch;
7. confirm normal Dock tabs/tools and basic interactions remain unchanged.

Do not begin Stage C extraction until this gate passes.

**Runtime/module/manifest/public behavior changed:** task-branch Dev launcher/manifest behavior changed; monolithic core/public Stable unchanged.

---

## PFC-2026-09-17-003 — Issue #10 contract freeze

Date: 2026-09-17

### Scope

Documentation-only Stage A for issue #10 on `wd/10-modular-bootstrap`: record the current monolithic core responsibilities and protected behavioral contracts before moving runtime ownership.

### Acceptance

- Architecture baseline recorded in `ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md`.
- No runtime source, manifest, version/build, storage key, cache key, module order, module URL, or public Stable file changed.

**Runtime/module/manifest/public behavior changed:** no.

---

## PFC-2026-09-17-002 — Canonical Dev launcher/channel identity

Date: 2026-09-17

### Scope

Issue #19: establish an unmistakable installed Dev identity and route canonical Dev loading to `WITCH_DEV_MAIN`. Public Stable remains untouched.

### Acceptance

Canonical live gate remains tracked under #19; task-branch self-routing under #10 is temporary and must be normalized before integration.

**Runtime/module/manifest/public behavior changed:** Dev runtime/manifest behavior changed; public Stable unchanged.

---

## PFC-2026-09-17-001 — New Dev governance baseline

Date: 2026-09-17

### Scope

Documentation/governance only. Establish `WITCH_DEV_MAIN` as the canonical Stable-derived development lane and encode the rules required to prevent unexplained drift and branch clutter.

**Runtime/module/manifest/public behavior changed:** no.

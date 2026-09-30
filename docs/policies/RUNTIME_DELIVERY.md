# Runtime, Install, and Update Delivery

**Status:** Current detailed delivery authority. Source bytes remain in their channel; version/build synchronization belongs to [MODULE_VERSIONING.md](../../MODULE_VERSIONING.md). Current identities belong to [ACTIVE_CONTEXT.md](../../ACTIVE_CONTEXT.md).

## Exact-ref consumers

Repository: `Knight-Witch/KnightWitch.Heroforge`. Preserve each URL verbatim unless its own explicitly authorized migration validates every consumer.

| Channel | Permanent ref / source | Install, update, and download URL |
|---|---|---|
| Canonical direct Dev | `WITCH_DEV_MAIN` / `Witch_Dock_DEV.user.js` | https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_MAIN/Witch_Dock_DEV.user.js |
| Public Stable | `Witch_Scripts` / `Witch_Dock.user.js` | https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/Witch_Dock.user.js |
| Dev Auto Host | `wd/dev-auto-host` / `devtools/Witch_Dock_DEV_Auto_Host.user.js` | https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/wd/dev-auto-host/devtools/Witch_Dock_DEV_Auto_Host.user.js |

`Witch_Scripts` is also the repository default. `Witch_Dock.user.js` retained on canonical Dev is legacy/history, not the installed Dev entrypoint. Do not rewrite it merely to make Dev look like Stable.

## Immutable payload pairing

A moving channel head serves a launcher that pins its own `PAYLOAD_REF` commit. The channel head, resolved launcher commit, and payload commit are distinct; a documentation commit may advance Dev without changing the runtime at all.

- Launcher manifest/core/module bytes load from one immutable raw commit root. Payloads contain the paired manifest, Core orchestrator, extracted modules/assets, loader, and feature sources.
- `KWWitchDockPayloadRoot` is that immutable root. Loader resolves `moduleRegistry.path` under it; legacy `modules[].url` is fallback-only. Dev payloads derive from canonical Dev; any fallback resolves to `WITCH_DEV_MAIN`, never Stable or a retired task ref.
- Preserve strict component version/build validation. Compatibility comes from immutable pairing, never relaxed checks.
- Preserve deterministic cache keys from module id/version/build/path/url, no-store/bootstrap cache busting, concurrent fetch, manifest-order execution, enablement, telemetry, and isolated module failures. [Core contract](../../ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md) owns those detailed invariants.
- Keep launchers as narrow privileged hosts. GitHub modules own normal application/core behavior; raw GM APIs do not become a page-global API.
- Dev identity remains fixed `WITCH DOCK - DEV` / `KnightWitch`. Its version is synchronized separately and visibly identifiable; channel failure is visible, never silent Stable fallback. Stable's existing versioned name/self-host validation is a separate contract; do not apply Dev's fixed-name rule to Stable without an authorized migration.

## Auto Host operating contract

On each HeroForge page load the installed Auto Host resolves `WITCH_DEV_MAIN` through `https://api.github.com/repos/Knight-Witch/KnightWitch.Heroforge/git/ref/heads/WITCH_DEV_MAIN`, fetches `Witch_Dock_DEV.user.js` by that exact SHA, validates metadata/runtime identity/version/branch/grants/connect scope, and executes it at most once inside the userscript sandbox. Synthetic `GM_info.script` reports the fetched launcher, not the host version.

Preserve fresh request keys/no-cache, three bounded fetch attempts, duplicate-direct-launcher visible failure, and no autonomous polling/reloading. Pushes must not interrupt mutations or human gates. New privileges, `@require`, `@resource`, branch changes, or connection-boundary changes require deliberate host updates and their own live gate. The current v0.2.1 source allows the explicit HF.Status Dev connection; this is no Stable permission grant.

For an authorized install/switch: install the exact Auto Host URL, disable direct Dev and Stable during Dev validation, reload, then inspect `KWWitchDockDevAutoHost.getState()` plus normal channel/loader diagnostics. Rollback: disable Auto Host, re-enable direct Dev, reload. Do not modify Stable to roll back Dev delivery.

### Auto Host evidence disposition

At migration verification, source on `wd/dev-auto-host` at `b425e608b0dc932729cddbaaaa2aa60f68e1fe46` declares v0.2.1. Its [DEV_AUTO_HOST.md](https://github.com/Knight-Witch/KnightWitch.Heroforge/blob/b425e608b0dc932729cddbaaaa2aa60f68e1fe46/docs/DEV_AUTO_HOST.md) and [HANDOFF_DEV_AUTO_HOST.md](https://github.com/Knight-Witch/KnightWitch.Heroforge/blob/b425e608b0dc932729cddbaaaa2aa60f68e1fe46/docs/HANDOFF_DEV_AUTO_HOST.md) still describe the v0.2.0 gate. Treat that gate as dated evidence, not a command to reinstall v0.2.0 or bump Dev during this migration. Source inspection alone does not prove a live gate passed. This canonical policy reconciles authority without changing the permanent delivery branch; a future Auto Host maintenance task should align its local notes and retrieve the specific validation evidence.

## Stable self-host boundary

Stable's installed `Witch_Dock.user.js` resolves `Witch_Scripts` through the GitHub ref API, fetches/validates the launcher by immutable SHA, and preserves bounded privileged execution, synthetic metadata, duplicate/recursion guards, and source identity checks. Current source uses a five-minute head cache and permits an already cached head on API failure. Preserve its version-comparison and installed-launcher fallback behavior; Dev's freshness rules are not substitutes for this independently validated channel behavior.

Do not add permissions/endpoints or change cache, retries, fallback, or self-host semantics during documentation edits. Normal application behavior belongs to the paired payload. Neither channel may depend on Bridge or unstable Compatibility/Foundation heads; optional HF.Status clients must not block core startup.

## Release and delivery checks

For an actual runtime/delivery release, after [workflow](../../DEV_WORKFLOW.md) prerequisites:

1. Read live channel heads and exact launcher metadata/payload IDs; verify all exact-ref consumers before branch changes.
2. Apply version policy to affected module/launcher sources and manifest; verify channel manifest and pinned payload pairing. Keep unchanged modules byte-identical where practical, except open documented divergences.
3. Verify fixed Dev Tampermonkey name/namespace and matching version; visible header contains unmistakable Dev/version metadata (inline or separate row); runtime channel is `WITCH_DEV_MAIN`.
4. Inspect `KWWitchDockManifestURL`, payload root and loader requests for the same immutable payload; normal-path fallback count is zero, no silent Stable routing, no failed modules.
5. For Auto Host work, verify resolved head/URL and fetched launcher version, once-per-page behavior, normal Dock geometry, then the separately scoped newer-head reload gate. Route success does not certify pixels.
6. After explicit selective Stable promotion, run Stable smoke and automatic bounded Dev reconciliation. Do not pull temporary Dev endpoint configuration or diagnostics into Stable unintentionally.

Documentation-only migration verifies unchanged blobs for runtime, manifests, metadata, payload IDs, URLs, versions/builds, and automation. It does not trigger a release, bump, runtime mutation, or forced live smoke.

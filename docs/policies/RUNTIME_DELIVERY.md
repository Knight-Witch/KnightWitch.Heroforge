# Runtime, Install, and Update Delivery

**Status:** Current detailed delivery authority. Source bytes remain in their channel; version/build synchronization belongs to [MODULE_VERSIONING.md](../../MODULE_VERSIONING.md). Current identities belong to [ACTIVE_CONTEXT.md](../../ACTIVE_CONTEXT.md).

## Exact-ref consumers

Repository: `Knight-Witch/KnightWitch.Heroforge`. Preserve each URL verbatim unless its own explicitly authorized migration validates every consumer.

| Channel | Permanent ref / source | Install, update, and download URL |
|---|---|---|
| Canonical direct Dev | `WITCH_DEV_MAIN` / `Witch_Dock_DEV.user.js` | https://witchdock.knightwitch.dev/dev/Witch_Dock_DEV.user.js |
| Public Stable | `Witch_Scripts` / `Witch_Dock.user.js` | https://witchdock.knightwitch.dev/stable/Witch_Dock.user.js |
| Dev Auto Host | `wd/dev-auto-host` / `devtools/Witch_Dock_DEV_Auto_Host.user.js` | https://witchdock.knightwitch.dev/dev-auto/Witch_Dock_DEV_Auto_Host.user.js |

`Witch_Scripts` is also the repository default. `Witch_Dock.user.js` retained on canonical Dev is legacy/history, not the installed Dev entrypoint. Do not rewrite it merely to make Dev look like Stable.

The custom domain is the permanent provider-independent delivery boundary. Cloudflare Worker service `witchdock-runtime` resolves GitHub `Knight-Witch/KnightWitch.Heroforge` first and public Bitbucket `knightwitch/knightwitch.heroforge.recovery` second. Userscript metadata, ref discovery, launcher fetches, and immutable payload fetches stay behind `witchdock.knightwitch.dev`; never expose or restore raw-provider install/update URLs. Permanent channel and payload commits must exist in both providers. A recovery-maintained branch may have a different provider commit SHA only when the delivered bytes are verified identical and each provider's branch head is resolved independently.

## Immutable payload pairing

A moving channel head serves a launcher that pins its own `PAYLOAD_REF` commit. The channel head, resolved launcher commit, and payload commit are distinct; a documentation commit may advance Dev without changing the runtime at all.

- Launcher manifest/core/module bytes load from one immutable `https://witchdock.knightwitch.dev/payloads/<commit>/` root. Payloads contain the paired manifest, Core orchestrator, extracted modules/assets, loader, and feature sources.
- `KWWitchDockPayloadRoot` is that immutable root. Loader resolves `moduleRegistry.path` under it; legacy `modules[].url` is fallback-only. Dev payloads derive from canonical Dev; any fallback resolves to `WITCH_DEV_MAIN`, never Stable or a retired task ref.
- Preserve strict component version/build validation. Compatibility comes from immutable pairing, never relaxed checks.
- Preserve deterministic cache keys from module id/version/build/path/url, no-store/bootstrap cache busting, concurrent fetch, manifest-order execution, enablement, telemetry, and isolated module failures. [Core contract](../../ARCHITECTURE/WITCH_DOCK_CORE_CONTRACT.md) owns those detailed invariants.
- Keep launchers as narrow privileged hosts. GitHub modules own normal application/core behavior; raw GM APIs do not become a page-global API.
- Dev identity remains fixed `WITCH DOCK - DEV` / `KnightWitch`. Its version is synchronized separately and visibly identifiable; channel failure is visible, never silent Stable fallback. Stable's existing versioned name/self-host validation is a separate contract; do not apply Dev's fixed-name rule to Stable without an authorized migration.

## Auto Host operating contract

Installed Auto Host v0.2.3 uses only provider-independent paths. On each HeroForge page load it resolves canonical Dev through `https://witchdock.knightwitch.dev/dev/ref.json`, fetches the exact launcher through `https://witchdock.knightwitch.dev/payloads/<resolved-sha>/Witch_Dock_DEV.user.js`, validates metadata/runtime identity/version/branch/grants/connect scope, and executes it at most once inside the userscript sandbox. Its own `@updateURL` and `@downloadURL` are `https://witchdock.knightwitch.dev/dev-auto/Witch_Dock_DEV_Auto_Host.user.js`. Synthetic `GM_info.script` reports the fetched launcher, not the host version.

Preserve fresh request keys/no-cache, three bounded fetch attempts, duplicate-direct-launcher visible failure, and no autonomous polling/reloading. Pushes must not interrupt mutations or human gates. New privileges, `@require`, `@resource`, branch changes, or connection-boundary changes require deliberate host updates and their own live gate. Auto Host grants only `witchdock.knightwitch.dev` and the current Dev HF.Status host `status-dev.knightwitch.dev`; raw GitHub, GitHub API, retired workers.dev, and Stable HF.Status are outside its connection boundary.

For an authorized install/switch: install the custom-domain Auto Host URL, disable direct Dev and Stable during Dev validation, reload, then inspect `KWWitchDockDevAutoHost.getState()` plus normal channel/loader diagnostics. Rollback: disable Auto Host, re-enable direct Dev, reload. Do not modify Stable to roll back Dev delivery.

### Auto Host evidence disposition

The 2026-10-02 gate verified v0.2.3 live from the custom-domain install URL, exact update/download self-reference, custom-domain Dev ref/payload resolution, launcher v1.16.0, no Auto Host error surface, and no raw-GitHub or workers.dev dependency. GitHub head `736d261cfb33974aa78d9fe84bfd0b0572eee693` and Bitbucket recovery head `f98af09bfa73fc74699d1bae8109c3c0bf81888c` intentionally differ because the mirror connector authored the recovery commit; the delivered Auto Host bytes are SHA-256 identical. Canonical Dev and Stable launcher bytes are also identical across the live primary and direct recovery reads.
## Stable self-host boundary

Stable's installed `Witch_Dock.user.js` uses `https://witchdock.knightwitch.dev/stable/Witch_Dock.user.js` for install/update/download. Its self-host resolves `https://witchdock.knightwitch.dev/stable/ref.json`, fetches the exact launcher from the provider-independent `/payloads/<resolved-sha>/` route, and loads the launcher's immutable payload through that same boundary. The edge resolves GitHub first and Bitbucket recovery second while preserving bounded privileged execution, synthetic metadata, duplicate/recursion guards, and source identity checks. Current source uses a five-minute head cache and permits an already cached head on ref-resolution failure. Preserve its version-comparison and installed-launcher fallback behavior; Dev's freshness rules are not substitutes for this independently validated channel behavior.

The deployed v2.3.2 wrapper accepts the exact Stable connection metadata host `witchdock.knightwitch.dev`. Preserve that compatibility boundary until all older installed wrappers have transitioned; adding or substituting metadata hosts can make an older wrapper reject the fetched launcher before execution. Stable v2.4.2 keeps runtime ref, launcher, manifest, and module reads on the provider-independent Witch Dock domain and uses page `fetch` with CORS. Production HF.Status uses page `fetch` against `status.knightwitch.dev`; it does not require a provider URL or a new userscript `@connect` grant. The 2026-10-02 live gate proved that an actually installed v2.3.2 wrapper refreshed into v2.4.2, loaded 30/30 modules with zero fallback, and reached current production status.

Do not add permissions/endpoints or change cache, retries, fallback, or self-host semantics during documentation edits. Normal application behavior belongs to the paired payload. Neither channel may depend on Bridge or unstable Compatibility/Foundation heads; optional HF.Status clients must not block core startup.

## Release and delivery checks

For an actual runtime/delivery release, after [workflow](../../DEV_WORKFLOW.md) prerequisites:

1. Read live custom-domain channel refs and exact launcher metadata/payload IDs; verify GitHub primary, Bitbucket recovery, and all exact-ref consumers before branch changes.
2. Apply version policy to affected module/launcher sources and manifest; verify channel manifest and pinned payload pairing. Keep unchanged modules byte-identical where practical, except open documented divergences.
3. Verify fixed Dev Tampermonkey name/namespace and matching version; visible header contains unmistakable Dev/version metadata (inline or separate row); runtime channel is `WITCH_DEV_MAIN`.
4. Inspect `KWWitchDockManifestURL`, payload root and loader requests for the same immutable payload; normal-path fallback count is zero, no silent Stable routing, no failed modules.
5. For Auto Host work, verify the custom-domain install/update URL, `/dev-auto/ref.json`, `/dev/ref.json`, immutable payload URL, fetched launcher version, once-per-page behavior, normal Dock geometry, and primary/recovery byte parity, then the separately scoped newer-head reload gate. Route success does not certify pixels.
6. After explicit selective Stable promotion, run Stable smoke and automatic bounded Dev reconciliation. Do not pull temporary Dev endpoint configuration or diagnostics into Stable unintentionally.

Documentation-only migration verifies unchanged blobs for runtime, manifests, metadata, payload IDs, URLs, versions/builds, and automation. It does not trigger a release, bump, runtime mutation, or forced live smoke.

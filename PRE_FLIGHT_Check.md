# Pre-Flight Check Log

Rolling current Dev pre-flight record. Older detail remains in Git history.

## PFC-2026-09-17-008 — Restore compact emblem after failed visual gate

Date: 2026-09-17

### Scope

Issue #10 on `wd/10-modular-bootstrap`: roll back only the failed compact-emblem externalization while preserving the already-validated privileged-host/bootstrap architecture.

### Failure evidence

- Dev v1.3.3 runtime/provenance passed and the module loader completed 23/23 with 0 failures in 167.9 ms.
- Human compact-button visual gate failed: the button showed only a short white line on the dark square instead of the emblem.
- HF-Chat-Bridge `hf-20260917-wd10-emblem-diagnose-002` proved the external image was actually loaded: complete=true, natural size 256x256, rendered size 40x40, object-fit contain, opacity 1.
- HF-Chat-Bridge `hf-20260917-wd10-emblem-pixels-001` proved the external asset content is the problem: 156 non-transparent pixels, 154 bright pixels, bounds x=41..255 / y=23..24.
- This rules out a missing-resource/CSP/layout explanation and confirms `ASSETS/emblem.png` is not the intended compact emblem graphic.

### Static evidence for v1.3.4

- Task launcher version is v1.3.4; Tampermonkey `@name` remains the fixed `WITCH DOCK - DEV` identity.
- Manifest launcher registry is synchronized at v1.3.4 / build `1.3.4-restore-inline-compact-emblem`.
- The launcher still asserts exactly one legacy inline `COMPACT_EMBLEM_URL` declaration before executing the core.
- The launcher no longer replaces that declaration with `ASSETS/emblem.png`; the exact Stable-derived inline data URL is preserved.
- Dev diagnostics now report `presentationAssetMode: inline-core-emblem-restored` and `compactEmblemUrl: inline:data-url-from-core`.
- Existing host-owned core fetch, manifest seam, storage keys, public `WitchDock` seams, loader concurrency/order/cache behavior, and Dock interaction code are unchanged.
- No CSS is extracted in this repair.
- Checked-in `Witch_Dock.user.js` remains unchanged from the Stable-derived monolith.
- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched.

### Required live gate

1. Existing fixed-name Dev install updates in place to v1.3.4; visible Dock title is `WITCH DOCK - DEV v1.3.4`.
2. Dev state reports `presentationAssetMode: inline-core-emblem-restored`, `compactEmblemUrl: inline:data-url-from-core`, `status: running`, `error: null`.
3. `#kwWDCompactIcon.src` begins with `data:image/png;base64,` and loads at the expected native dimensions.
4. Module loader remains 23/23 with zero failures.
5. Human visual gate: fully collapse the Dock and confirm the original emblem is restored.
6. Do not begin CSS extraction until this compact-emblem repair passes.

**Runtime/module/manifest/public behavior changed:** task-branch compact-emblem source restored to the known-good inline core data URL and launcher/manifest version advanced to v1.3.4; public Stable unchanged.

---

## PFC-2026-09-17-007 — Stable Tampermonkey Dev identity

Date: 2026-09-17

### Scope

Issue #19 correction carried on the active issue #10 task branch: stop changing Tampermonkey script identity on every Dev version while preserving the versioned visible Dock identity and the existing v1.3.2 compact-emblem extraction.

### Static acceptance

- `Witch_Dock_DEV.user.js` is v1.3.3 and uses fixed `@name WITCH DOCK - DEV` with stable `@namespace KnightWitch`.
- The changing version remains synchronized through userscript `@version`, runtime `DEV_VERSION`, visible Dock title, and `manifest.json.moduleRegistry` launcher version/build.
- Manifest launcher registry is v1.3.3 / build `1.3.3-stable-tampermonkey-identity`.
- `PROJECT_CONTRACT.md` and `MODULE_VERSIONING.md` explicitly prohibit putting the changing version into Tampermonkey `@name`.
- `DEV_DIVERGENCES.json` and issue #19 acceptance criteria reflect fixed Tampermonkey identity plus versioned Dock title.
- v1.3.2 compact-emblem source seam and external `ASSETS/emblem.png` routing are otherwise unchanged.
- No CSS, storage, registry, drag/minimize, hotkey, bone-HUD, module-loader, or public Stable behavior moved in this correction.
- Public `Witch_Scripts` and canonical `WITCH_DEV_MAIN` remain untouched.

### Required live gate

1. Existing task-branch Dev install should update to v1.3.3 instead of producing another distinct Dev script entry.
2. Tampermonkey entry should display `WITCH DOCK - DEV`; visible Dock title should display `WITCH DOCK - DEV v1.3.3`.
3. Dev state remains `running` / `error: null`, reports `presentationAssetMode: external-compact-emblem`, and retains task-branch provenance.
4. `#kwWDCompactIcon.src` resolves to task `ASSETS/emblem.png` and the compact emblem looks unchanged.
5. Module loader remains 23/23 with zero failures.

Do not begin CSS extraction until this combined identity/emblem gate passes.

**Runtime/module/manifest/public behavior changed:** task-branch launcher metadata/version and identity contract changed; public Stable unchanged.

---

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

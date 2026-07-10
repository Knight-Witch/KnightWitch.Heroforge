# JSON and Library

HeroForge JSON, character library, backup, import/export, and stored-data behavior discoveries.

## Known Rules

- Preserve working reference behavior for JSON/library tools until a migrated version is tested.
- Document any import/export behavior that depends on HeroForge state, undo queue behavior, or character load timing.
- Treat HeroForge config-service endpoint assumptions as fragile and subject to change.

## Findings

### JSON Tool Uses HeroForge Config-Service Endpoints

Context:
- `tools/JSON_Tool.js` implements `Backup My Library (Bulk JSON)`.

Observed behavior:
- It calls `/config-service/all_user_config/?offset=...&meta_only=true` to page through config metadata.
- It calls `/config-service/save_config_mark/` to map folder/mark names.
- It calls `/config-service/user_config/{id}` to fetch individual config JSON.
- Requests use `credentials: "include"`.

Working approach:
- Preserve credentialed fetch behavior.
- Preserve pagination and mark/folder mapping unless endpoints are reverified.
- If the tool breaks, verify endpoint responses before changing backup logic.

Affected tools:
- `tools/JSON_Tool.js`

### JSON Tool Waits for HeroForge Readiness Before Bulk Backup

Context:
- Bulk backup can start before HeroForge has fully settled.

Observed behavior:
- `waitForHFReady()` watches DOM stability and waits for `window.HF` or `window.CK` before proceeding.
- It uses a hard timeout and stable DOM window before continuing.

Working approach:
- Preserve readiness wait logic unless live testing shows it is unnecessary.
- Do not start config-service backup immediately on button press without readiness handling.

Affected tools:
- `tools/JSON_Tool.js`

### JSON Tool Uses JSZip CDN and Failure Records

Context:
- Bulk backup generates a downloadable ZIP.

Observed behavior:
- JSZip loads from jsDelivr if `window.JSZip` is not already available.
- ZIP includes config JSON, metadata, marks, and failed download records.
- Failure records can be copied through the UI.

Working approach:
- Preserve failure recording and copy behavior for troubleshooting large library backups.
- Preserve safe filename/folder sanitization.

Affected tools:
- `tools/JSON_Tool.js`

## Entry Template

### Finding Title

Context:
- 

Observed behavior:
- 

Working approach:
- 

Affected tools:
- 

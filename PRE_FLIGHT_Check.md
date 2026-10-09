# Pre-Flight Check

## 2026-10-08 — #117 Booth native gated asset (Dev only)

- PASS: authoritative PROJECT_CONTRACT.md / ACTIVE_CONTEXT.md, module/version and runtime-delivery policy read. Existing Dev #59 Booth divergence retained, new #117 open owner added. Stable unaffected.
- PASS: HF-Chat-Bridge v0.4.0 live reads confirmed `ASSET_MANIFEST.booth = booth.b9ab74dd25ad.js`, old bootstrap `/gated/booth.js?version=heroforge06.1.10.13`, failed bootstrap-owned tag, zero native BT and repeated failed attempts.
- PASS: Bridge v0.3.0 GitHub relay 401 repaired from valid GitHub CLI session to Windows DPAPI. Pairing secret not rotated. Pending GitHub mailbox requests #4685/#4686 and subsequent read-only workbench completed.
- PASS: Booth Runtime Bootstrap v0.2.3 uses native manifest path, retains version fallback from CK.Settings.artVersionNumber, removes only failed bootstrap-owned tags, backs off retries while retaining rearm and error reporting; native tags are not overwritten.
- PASS: `node --check` for active Bootstrap and Dev launcher; `node --test tests/issue117-booth-bootstrap.test.cjs` (4/4 pass). Feature registry: no impact, same Booth feature identity/owner/UI.
- PENDING: immutable Dev launcher/payload pin; live Dev reload and Booth persistence + show-Booth-in-editor user visual gate, scene transitions. No Stable/public promotion.

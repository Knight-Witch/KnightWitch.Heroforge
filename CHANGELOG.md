# Changelog

## Latest repository change — 2026-10-07

- #107 real Stable + Beta Tester browser smoke passed.
- Public Stable v2.4.2 remained authoritative with Dev absent; Beta Tester v0.1.0 reached `ready`, loaded manifest revision 1 cleanly, registered bounded `beta-tester` diagnostics, and exposed the visible Beta controls.
- Beta master OFF then ON completed reversibly while Stable version/ref/payload/status remained unchanged.
- The current Beta manifest remains intentionally empty.
- HF.Status #112 owns the separate `wd-beta-qa` / `public-beta-testing` backend taxonomy and triage implementation.
- Automatic Beta-specific diagnostic-provider selection in the canonical Stable reporter remains separately gated on Bug Capture UI v0.4.6.
- No runtime/module/manifest/public behavior changed in this documentation-only update.

## Latest Dev delivery context

Canonical Dev remains v1.17.13 / `1.17.13-public-beta-channel`, paired to immutable payload `8b92fc76f6ed6715b103d026338da5b0694d5a21`. #107 client/runtime validation is complete; HF.Status #112 remains a separate workstream and no Stable promotion is authorized.

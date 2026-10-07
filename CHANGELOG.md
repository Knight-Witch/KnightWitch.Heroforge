# Changelog

## Latest repository change — 2026-10-07

- #107 Public Beta Tester infrastructure is paired into canonical Dev v1.17.13 / `1.17.13-public-beta-channel`.
- Immutable Dev payload candidate `8b92fc76f6ed6715b103d026338da5b0694d5a21` contains the standalone Beta Tester v0.1.0, empty Public Beta manifest, provider-independent `/beta` Worker route source/tests, Bug Capture UI v0.4.6 local contextual diagnostic-provider selection, and Public Beta lifecycle documentation.
- Beta modules remain explicit immutable payloads with reversible activate/deactivate contracts; Stable remains fully independent from the Beta layer.
- Beta reports reuse the canonical Witch Dock/HF.Status reporter. HF.Status issue #112 owns the new `wd-beta-qa` / `public-beta-testing` taxonomy and triage bucket.
- Validation is green: repository tests 39/39, Worker route tests 14/14, userscript/reporter/launcher syntax checks, JSON parses, and diff check.
- Public Stable remains v2.4.2 and unchanged. No Stable/public promotion is authorized.

## Latest Dev delivery context

Dev v1.17.13 / `1.17.13-public-beta-channel` is paired to immutable payload `8b92fc76f6ed6715b103d026338da5b0694d5a21`. Remaining #107 gates are remote/recovery parity, live custom-domain `/beta` deployment/proof, and Stable+Beta smoke.

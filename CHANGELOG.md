# Changelog

## Latest repository change — 2026-10-07

- #107 Public Beta Tester workstream opened and ACTIVE PROTECTED branch `wd/107-public-beta-tester` registered before implementation.
- Scope is a lightweight standalone Beta Tester userscript that layers explicitly allowlisted beta modules onto normal Public Stable without replacing the Stable launcher.
- Planned runtime shape keeps Stable startup independent: Beta Tester owns its own manifest fetch, module lifecycle, visible IN BETA labeling, local enable/disable state, and failure isolation.
- Beta module delivery will use versioned immutable payload references rather than executing arbitrary current-Dev code.
- Targeted Beta/QA reporting will reuse Witch Dock's existing reporter and diagnostics architecture rather than creating a second reporting backend; HF.Status taxonomy/backend changes remain owned by HF.Status.
- No Public Stable runtime/module behavior changed in this registration commit.

## Latest Dev delivery context

Canonical Dev remains v1.17.12 / `1.17.12-independent-normal-headroom`, paired to immutable payload `0eb197e36e4231c6dde23001f74eabf04179cc6b`.

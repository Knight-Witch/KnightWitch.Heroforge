# Changelog

This file is intentionally **not** a full historical changelog. Git history, issues, PRs, and focused investigations preserve older detail.

## Latest repository change — 2026-10-02

- Public Stable is Witch Dock v2.4.2 / `2.4.2-refresh-compatibility`, immutable payload `93c0de5cd0da1dece3ef286c5a9201c83f1addb7`, documentation head `b069d1057c3cf52414ed5365841058f0f43bdf31`.
- A normal Hero Forge refresh from the actually installed v2.3.2 wrapper now resolves and dispatches current Stable; Tampermonkey's updater is not required for Dock-version delivery.
- #90 Script Status and #97 integrated bug reporting remain released with production `https://status.knightwitch.dev` routing and Witch Dock-specific reporter capabilities.
- Release Notices v0.3.1 formats the Built-In Bug Reporting overview and expanded details with native headings and bullet lists.
- Stable install/update/ref/payload delivery remains provider-independent at `https://witchdock.knightwitch.dev`; GitHub is primary and Bitbucket is the exact recovery mirror.
- Live refresh smoke passed: self-host dispatched v2.4.2, bootstrap loaded 12/12, module loader completed 30/30 with zero failures/fallback, Script Status was network/current, and contextual reporter mapping remained Utilities → Bug Capture.
- Public delivery smoke passed for all 44 manifest source routes. The short-lived v2.4.1 metadata attempt was superseded by v2.4.2 after the deployed wrapper exposed the exact accepted host contract.
- Canonical Dev is v1.16.1 / `1.16.1-notice-formatting`, immutable payload `e431e26f7b3c4e4874c9238dd517015c71d824c1`.
- Feature-registry impact: **no registry impact**. Existing feature/group IDs and ownership remain unchanged.
- Completed `wd/97-integrated-bug-reporter` remains deleted from GitHub and Bitbucket; the deletion queue is empty.

## Latest Stable release — v2.4.2

- Public runtime source commit: `3236f9d754703c5ff1a709209c1c251cd644e6e6`; documentation head: `b069d1057c3cf52414ed5365841058f0f43bdf31`.
- Fresh pre-release HFBR E2E remains `HFBR-20261002-4897N4YJ`: attached diagnostic parsed/indexed, triage stored, and no automatic public projection was created.
- Actual post-release browser refresh and runtime readback passed on the installed public wrapper.

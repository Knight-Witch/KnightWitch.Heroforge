# Changelog

This file is intentionally **not** a full historical changelog. Git history, issues, PRs, and focused investigations preserve older detail.

## Latest repository change — 2026-10-02

- Public Stable is Witch Dock v2.4.0 / `2.4.0-integrated-bug-reporting`, immutable payload `15973ece42d42de1b9f794d63730d6815a5d484b`.
- #90 Script Status and #97 integrated bug reporting are released with production `https://status.knightwitch.dev` routing and Witch Dock-specific reporter capabilities.
- Release Notices v0.3.1 formats the Built-In Bug Reporting overview and expanded details with native headings and bullet lists.
- Stable install/update/ref/payload delivery uses `https://witchdock.knightwitch.dev`; GitHub is primary and Bitbucket is the exact recovery mirror.
- Public delivery smoke passed: ref/launcher/manifest/notice routes returned 200, identities matched, and all 43 registered immutable payload sources were available.
- Canonical Dev is v1.16.1 / `1.16.1-notice-formatting`, immutable payload `e431e26f7b3c4e4874c9238dd517015c71d824c1`.
- Feature-registry impact: **no registry impact**. Existing feature/group IDs and ownership remain unchanged.
- Completed `wd/97-integrated-bug-reporter` was deleted from GitHub and Bitbucket after exact-head verification; the deletion queue is empty.

## Latest Stable release — v2.4.0

- Public release source commit: `b9ade8afa623da465010fc0d81b301e2e84e38d5`; current documentation head: `88280df1832b7bfa0e5b2d9ff1aa9b8d97b21940`.
- Fresh pre-release Dev E2E remains `HFBR-20261002-4897N4YJ`: attached diagnostic parsed/indexed, triage stored, and no automatic public projection was created.
- Amanda explicitly waived an additional Dev smoke approval for this promotion.

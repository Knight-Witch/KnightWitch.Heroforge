# Pre-Flight Check Log

This is the rolling current Dev pre-flight log for `WITCH_DEV_MAIN`. Older Stable/legacy records remain durable in Git history.

## PFC-2026-09-17-001 — New Dev governance baseline

Date: 2026-09-17

### Scope

Documentation/governance only. Establish `WITCH_DEV_MAIN` as the canonical Stable-derived development lane and encode the rules required to prevent unexplained drift and branch clutter.

### Baseline evidence

- `WITCH_DEV_MAIN` was created directly from `Witch_Scripts` commit `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`.
- No legacy `WITCH_DEV_UI` or `WITCH_DEV` runtime code was merged.
- Initial `DEV_DIVERGENCES.json` contains zero runtime divergences.
- Legacy harvest is tracked separately in #12 before any old branch is retired.
- Branch retirement is deferred to #13 until New Dev validation and harvest are complete.
- Dev -> Stable cleanup requirements are tracked in #14 and mirrored in the project contract/workflow.

### Acceptance

This commit changes no userscript, feature/tool module, manifest entry, module version/build, cache key, or public Stable content. No live runtime test is required for this documentation-only baseline.

**Runtime/module/manifest/public behavior changed:** no.

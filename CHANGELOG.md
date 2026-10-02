# Changelog

This file is intentionally **not** a full historical changelog. Git history, issues, PRs, and focused investigations preserve older detail.

## Latest repository change - 2026-10-02

- Issue #104 started on registered branch `wd/104-hfjson-delivery`.
- Scope is limited to durable ownership of the existing `witchdock-runtime` edge source plus additive `/HFJSON/` delivery aliases for Lob standalone scripts.
- Existing `/dev`, `/stable`, `/dev-auto`, `/payloads`, GitHub-primary/Bitbucket-recovery, launcher, and self-host contracts are explicitly unchanged.
- Paired HF.Status work is tracked in Knight-Witch/HF.Status#89.
- Implementation has not started in this commit.
- Feature-registry impact: **no Witch Dock registry impact**; HF.Status #89 owns the external-script install-link registry update.
- This commit is documentation/governance-only; no application/runtime/public behavior changed.

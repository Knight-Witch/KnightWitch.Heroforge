# Changelog

This file is intentionally **not** a full historical changelog. Git history, issues, PRs, and focused investigations preserve older detail.

## Latest repository change - 2026-10-02

- Issue #104 now tracks canonical `witchdock-runtime` source in `tools/witchdock-runtime/` instead of relying on the recovered workstation-only copy.
- Added stable `/HFJSON/` aliases for seven active installable Lob/HF JSON scripts; aliases currently use temporary non-cached redirects to the existing GitGud raw scripts.
- Existing `/dev`, `/stable`, `/dev-auto`, `/payloads`, launcher projection, GitHub-primary, and Bitbucket-recovery logic remains unchanged.
- Local edge contract: 11/11 Node route tests PASS; Wrangler 4.146.0 dry-run PASS with no bindings.
- Paired HF.Status resource/UI work remains #89; the live edge has **not** been deployed in this commit.
- Feature-registry impact: **no Witch Dock registry impact**; HF.Status #89 owns the external-script install-link registry update.
- No Witch Dock application/module/public Stable behavior changed; this branch only stages the not-yet-deployed edge addition.

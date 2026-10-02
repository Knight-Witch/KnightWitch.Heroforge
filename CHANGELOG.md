# Changelog

This file is intentionally **not** a full historical changelog. Git history, issues, PRs, and focused investigations preserve older detail.

## Latest repository change - 2026-10-02

- Issue #104 HFJSON delivery aliases are live on the provider-independent `https://witchdock.knightwitch.dev/HFJSON/` namespace.
- Seven active installable Lob/HF JSON aliases use temporary `307` + `no-store` redirects to the current GitGud raw install targets; `/HFJSON/` redirects to the GitGud source repository.
- Live Worker version is `d301357a-44dd-4b3c-9d5f-55e4ac7497ca`. Existing `/dev`, `/stable`, `/dev-auto`, `/payloads`, launcher, and self-host delivery remain intact.
- Public Stable ref remained `b069d1057c3cf52414ed5365841058f0f43bdf31` throughout deployment and smoke.
- GitHub canonical Dev and Bitbucket recovery Dev have equivalent trees for the #104 result; GitHub remains primary and live edge resolution returned to GitHub after recovery reconciliation.
- Paired HF.Status #89 is deployed on Dev and rendered-browser smoke passed; Amanda visual approval is the remaining cross-repo gate.
- Feature-registry impact: **no Witch Dock registry impact**; HF.Status owns the external-script resource registry.
- This commit is documentation/governance-only; no Witch Dock application/runtime/public Stable behavior changed.

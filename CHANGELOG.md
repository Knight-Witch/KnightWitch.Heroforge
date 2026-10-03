# Changelog

This file is intentionally **not** a full historical changelog. Git history, issues, PRs, and focused investigations preserve older detail.

## Latest repository change - 2026-10-03

- Issue #104 is functionally complete: seven provider-independent HFJSON aliases are live on Worker `d301357a-44dd-4b3c-9d5f-55e4ac7497ca`, with existing Witch Dock delivery behavior preserved.
- Paired HF.Status #89 is now production-live; Amanda approved the final presentation and public smoke passed.
- Public Stable `Witch_Scripts` remains unchanged by #104.
- Useful #104 source/docs are merged into canonical Dev and mirrored as an equivalent recovery tree.
- Completed temporary branch `wd/104-hfjson-delivery` moved from ACTIVE PROTECTED to the exact-SHA deletion queue at `7af8245e63e6fbe359542e26885a6b2f61106c1e`; Bitbucket recovery does not carry that temporary ref.
- Feature-registry impact: **no Witch Dock registry impact**; HF.Status owns the external-script resource registry.
- This commit is documentation/governance-only; **no runtime/module/manifest/public behavior changed**.

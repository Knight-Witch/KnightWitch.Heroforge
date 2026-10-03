# Changelog

This file is intentionally **not** a full historical changelog. Git history, issues, PRs, and focused investigations preserve older detail.

## Latest repository change - 2026-10-03

- Issue #104 HFJSON delivery aliases are live and cross-repo validation with HF.Status #89 is complete.
- Seven provider-independent aliases continue serving temporary GitGud redirects on Worker `d301357a-44dd-4b3c-9d5f-55e4ac7497ca`; existing Witch Dock delivery and public Stable remain unchanged.
- Temporary branch `wd/104-hfjson-delivery` was deleted from GitHub at exact queued SHA `7af8245e63e6fbe359542e26885a6b2f61106c1e`; Bitbucket recovery never carried that temporary ref.
- Branch deletion queue is empty. #59 and #88 protected work plus permanent Dev/Stable/Dev Auto refs remain untouched.
- Feature-registry impact: **no Witch Dock registry impact**; HF.Status owns the external-script resource registry.
- This commit is documentation/governance-only; **no runtime/module/manifest/public behavior changed**.

# Pre-Flight Check

This file records only the validation state for the latest committed change/current head. Replace it on the next commit; do not accumulate historical PASS entries here.

## 2026-10-02 — #90/#97 custom-domain repair and Dev closeout gate

**PASS — implementation, static, delivery, live Dev, HF.Status E2E, diagnostic indexing, and failover checks complete; Amanda's final Dev smoke remains; Stable not approved or modified**

- Canonical Dev launcher v1.16.0 / `1.16.0-status-routing-notice` pins immutable payload `a45c4c809e9f16ff30157f2484cd3e83c075a01d`; runtime loaded 36/36 immutable modules with zero failure and used `https://status-dev.knightwitch.dev`.
- Script Status refreshed from network revision `2026-10-02-latest-fixes`, remained available/non-stale, and rendered current in Utilities.
- Reporter capabilities use `/api/v1/capabilities?source=witch-dock`. The `utilities:heroforge-ui` contextual action now freezes `witch-dock / wd-decals`; live prefill preserved immutable source context and captured one T0 diagnostic.
- Fresh custom-domain E2E passed at `HFBR-20261002-4897N4YJ`: real 21,133-byte Witch Dock diagnostic JSON → submission session → evidence upload → final report → HFBR receipt → exact D1 report/attachment/diagnostic/triage readback. Diagnostic parse state is `indexed`, evidence is `available`, source version is 1.16.0, and no reviewed public-status row was created.
- Dev Auto Host v0.2.3 installs and updates from `https://witchdock.knightwitch.dev/dev-auto/Witch_Dock_DEV_Auto_Host.user.js`, resolves Dev through the custom-domain ref/payload paths, and contains no raw-GitHub or workers.dev dependency.
- Cloudflare Worker `witchdock-runtime` version `bc489b50-5986-4ef0-96a3-fee8c28f2d81` serves Dev Auto Host, Dev, Stable, and immutable payload routes with GitHub primary and public Bitbucket recovery.
- Direct recovery reads are byte-identical to live primary delivery for Auto Host, Dev, and Stable launchers. Permanent Dev/Stable refs retain exact mirrored history; the connector-authored Auto Host recovery commit has a provider-specific SHA with identical delivered bytes.
- Public Stable remains `Witch_Scripts` v2.3.2 and was not modified or promoted. `Witch_Scripts` application/runtime source remains untouched.
- Feature-registry impact: **no registry impact**. Existing Witch Dock product/group/feature identities remain unchanged.
- Final gate: Amanda validates Dev Script Status, contextual reporter prefill, submission/receipt presentation, and the reusable built-in bug-reporting notice overlay.

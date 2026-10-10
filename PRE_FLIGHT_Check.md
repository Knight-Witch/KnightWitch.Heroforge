# Pre-Flight Check

## 2026-10-10 — #59/#35 private Dev v1.17.28 pairing

- PASS: Dev launcher `@version`, `DEV_VERSION`, `DEV_BUILD`, manifest launcher registry, and visible Dev version source are synchronized at v1.17.28 / `1.17.28-high-res-diagnostic-context`.
- PASS: launcher pins immutable payload `649d39004ee2dc8726713d75dc85bf5361f35826`; payload contains the paired manifest and diagnostic module versions/builds.
- PASS: fixed Tampermonkey identity, namespace, custom-domain update/download URLs, `WITCH_DEV_MAIN` channel, and custom-domain immutable payload routing are preserved.
- PASS: full repository Node test suite 63/63 after replacing the obsolete v1.17.16 hard-code with current manifest pairing checks; syntax, JSON parse, and `git diff --check` pass.
- PASS: no HF.Status feature-registry impact and no Beta-manifest impact.
- PASS: Public Beta, Public Stable, and deployment infrastructure are unchanged.
- PENDING: custom-domain/live Bridge loader, provider snapshot, and one bounded reversible comparison/failure-context gate.

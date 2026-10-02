# Pre-Flight Check

This file records only the validation state for the latest committed change/current head. Replace it on the next commit; do not accumulate historical PASS entries here.

## 2026-10-02 — #90/#97 public v2.4.0 release and Dev reconciliation

**PASS — formatted notice, selective Stable payload, custom-domain delivery, provider parity, and durable closeout checks complete**

- Canonical Dev v1.16.1 / `1.16.1-notice-formatting` pins immutable payload `e431e26f7b3c4e4874c9238dd517015c71d824c1`; Release Notices is v0.3.1 / `0.3.1-formatted-bug-reporting-notice`.
- Public Stable v2.4.0 / `2.4.0-integrated-bug-reporting` pins immutable payload `15973ece42d42de1b9f794d63730d6815a5d484b`.
- Launcher/notice syntax, manifest JSON, unique IDs, version/build/payload synchronization, production status routing, and custom-domain-only delivery checks passed.
- Notice-definition smoke confirmed native overview/details headings and bullet lists.
- Public custom-domain ref, launcher, manifest, and notice routes returned 200. All 43 non-launcher registry payload paths returned 200 with non-empty bytes.
- `https://status.knightwitch.dev/api/v1/public-status` and `/api/v1/capabilities?source=witch-dock` returned 200.
- GitHub and Bitbucket `Witch_Scripts` heads are exact at `88280df1832b7bfa0e5b2d9ff1aa9b8d97b21940`; payload commit `15973ece42d42de1b9f794d63730d6815a5d484b` exists in both providers.
- Carried-forward live Dev gates remain passed: Script Status network/current, contextual mapping/source preservation, reporter UI/typography, native 2K evidence, and HFBR diagnostic/triage E2E `HFBR-20261002-4897N4YJ`.
- Amanda explicitly waived an additional Dev smoke approval and authorized direct public promotion.
- Feature-registry impact: **no registry impact**.
- #90/#97 divergences are reconciled; #19/#35/#59 remain intentional. `wd/97-integrated-bug-reporter` is queued at its exact head for deletion.

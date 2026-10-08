# Pre-Flight Check

## 2026-10-07 — Dev launcher repin for retired Phase 1 popup

- PASS: `manifest.json` parses and `texture-quality-beta-notice` is absent from active `modules` and `moduleRegistry`.
- PASS: Dev launcher and manifest registry version/build are paired at v1.17.14 / `1.17.14-retire-phase1-notice`.
- PASS: launcher pins immutable manifest snapshot `39ddee76d6b49c36946c4cf99f73ad9c508ad300`, where the obsolete notice was removed. Channel identity and endpoint metadata were unchanged.
- PASS: existing High Res modules, notification framework, and Phase 2 Beta were not edited; HF.Status feature registry has no impact because this retires only a superseded announcement, not a reportable feature.
- PENDING: HeroForge live startup, no-popup fresh-install observation, and custom-domain/Bitbucket parity checks. GitHub source evidence is not live proof.

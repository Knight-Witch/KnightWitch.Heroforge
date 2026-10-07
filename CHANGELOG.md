# Changelog

## Latest repository change — 2026-10-07

- #25 Dev correction advances Texture Quality All-Part Promotion to v0.1.11 / `0.1.11-marginal-value-replan-restore`.
- Live v0.1.10 evidence exposed two implementation defects behind the failed 512 quality gate: transient source misses were retained in the negative cache across later passes, and all-part rollback rebuilt density before restoring HeroForge's observed `_usedTextureSize`, allowing prior promoted allocations to contaminate a later planning baseline.
- Direct HF-Chat-Bridge resource proof confirms both relative and absolute Celestial Circlet `starCirclet_nrml_512.webp?42=pv` URLs load as real 512x512 textures; URL/version construction is not the failure.
- v0.1.11 consumes the resolved texture returned by HeroForge's resource promise, scopes negative source results to one coverage pass, restores observed used-size metadata before rollback rebuilds, and replaces floor-first budgeting with one-increment-at-a-time marginal value selection.
- Marginal selection uses HeroForge native ideal, geometry detail pressure, repeated-instance cost, and diminishing returns above native demand. Source-only improvements cost zero; repeated families remain atomic; every density increment still requires the detached native `CK.Atlas` no-collateral proof.
- Focused regression suite passes 27/27 including transient source recovery, restored-baseline rebuild ordering, significant-part versus tiny-accessory marginal ordering, repeated-family starvation, packing safety, rollback, OFF->ON, failure isolation, and anti-loop behavior.
- Feature-registry impact: none. This remains internal selection/resource/rollback behavior inside the existing Texture Quality service.
- Public Stable remains v2.4.2 and is unchanged. No Stable/public promotion is authorized.

## Latest Dev delivery context

Dev v1.17.11 / `1.17.11-marginal-value-replan-restore` payload candidate is being prepared from the validated v0.1.11 tree. The launcher intentionally retains the prior v1.17.10 payload pin until the candidate commit exists.

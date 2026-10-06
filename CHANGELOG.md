# Changelog

## Latest repository change — 2026-10-06

- #25 Dev implementation: add hidden Texture Quality All-Part Promotion v0.1.0, dynamically enumerating rendered URL-backed normal bindings outside the specialized body/face path.
- Resolve verified higher normal variants with positive/negative caching and shared resources; plan density per display using source/quality ceilings, current allocations, repeated-instance group cost, and the existing bounded atlas budget.
- Apply only owned scale/_usedTextureSize/normal changes, reject any native repack that downsizes existing hosts, isolate optional failures, and restore exact owned state without overwriting later outside edits.
- Add focused VM regression coverage for parsing, target selection, cache reuse, repeated-instance budgeting/downgrade, collateral detection, rollback/outside edits, failure isolation, multi-display enumeration, and disposal. Focused suite passes 13/13.
- Branch was synchronized with current WITCH_DEV_MAIN (0e6717a2396106480adbc7c0c4c9dccb13704402) before implementation. HF.Status feature-registry check found no new reporter-facing feature ID/path; this remains internal support for existing Texture Quality.
- Dev delivery: launcher v1.17.0 / `1.17.0-all-part-promotion` is paired to immutable payload `69d7e4eecd371c0d36a49712f986c36a3073661a`, whose manifest contains the new all-part service and matching launcher metadata.
- Dev-only. No Stable launcher/module/manifest edit or public promotion.

## Latest Stable context

Stable v2.4.2, payload `93c0de5cd0da1dece3ef286c5a9201c83f1addb7`; unchanged.

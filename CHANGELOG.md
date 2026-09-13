# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-12-052 — Texture Quality persistent preference Dev candidate

Date: 2026-09-12

### Summary

Implement Amanda's approved Texture Quality persistence UX on `WITCH_DEV_UI` while preserving the validated native reconcile architecture and stale-figure safety boundary.

### Runtime/UI changes

- bump `texture-quality-native-reconcile` to v0.2.0 / build `0.2.0-dev-persistent-preference`;
- persist only the boolean `Persistent High Res` preference in local storage; no session, snapshot, mask, display/modded, atlas, or per-figure renderer object is persisted;
- when persistence is enabled, wait for HeroForge renderer readiness and run the existing safe `enable()` path once per figure; failures stay safely OFF for that figure instead of retry-looping;
- figure changes still discard the old active reconcile session before a fresh automatic enable is considered;
- manual Disable while persistence is checked suppresses High Res only for the current page session; manual Enable clears that temporary suppression, and reload naturally restores persistent behavior;
- unchecking persistence stops future automatic enables without forcing the currently active figure OFF;
- bump `texture-quality-native-reconcile-ui` to v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`;
- add a Utilities-style `Persistent` checkbox and move `Reconcile Now` into a collapsed in-tool `Advanced` section with an explanation;
- update manifest registry versions/builds and deterministic Dev cache keys.

### Validation state

JavaScript syntax and manifest JSON validation pass locally. Live `WITCH_DEV_UI` runtime validation and Amanda's visual/UX gate are still required before any Stable promotion.

**Runtime behavior changed:** yes, Dev only. Public `Witch_Scripts` Stable remains Texture Quality v0.1.0 and is untouched.

---

## DOCK-2026-09-12-051 — Adopt compact Witch Dock project governance

Date: 2026-09-12

### Summary

Align Witch Dock with the successful HeroForge.Compatibility context model so new chats can start from a tiny authoritative router instead of loading large historical files.

### Governance changes

- add binding `PROJECT_CONTRACT.md` for all active Witch Dock branches;
- add `ACTIVE_CONTEXT.md` as the authoritative current-task router;
- add `CHATGPT_PROJECT_INSTRUCTIONS.md` with paste-ready compact project rules;
- compact `MASTER.md` into a repo-wide architecture/navigation index rather than a running investigation transcript;
- compact this changelog and `PRE_FLIGHT_Check.md` into rolling recent logs, with prior detail preserved in Git history;
- compact the Texture Quality history record around the validated architecture, public acceptance, current persistence behavior, and next integration question;
- explicitly make HF-Chat-Bridge the normal development control plane while prohibiting any runtime dependency on it;
- explicitly treat HeroForge.Compatibility as upstream engine-investigation evidence, not mandatory Witch Dock startup context.

### Current task handoff

Public Texture Quality v0.1.0 is fully Stable accepted. Current behavior is confirmed: same-figure native renderer refreshes preserve ON, figure changes clear the active session OFF, and page reload starts OFF. The next conversation is waiting for Amanda's response to the proposed persistent **desired preference** model: remember user intent, but always create a fresh safe per-page/per-figure session instead of persisting snapshots or renderer objects.

**Runtime behavior changed:** no. No JavaScript, manifest, active module version, delivery URL, or public Stable runtime changed.

---

## DOCK-2026-09-12-050 — Native Texture Quality Dev acceptance complete

WITCH_DEV_UI Texture Quality v0.1.0 passed D4 body-color/glyph validation, D4 OFF -> ON ownership/lifecycle validation, Blood Moon accessory/material-channel validation, ordinary native-refresh survival, and the non-invasive Booth topology smoke. Dev acceptance closed PASS and the feature was subsequently promoted narrowly to Stable.

Public Stable promotion/acceptance is recorded on `Witch_Scripts` at commit `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`; Bridge evidence #1747/#1748/#1750 and Amanda's final visual PASS close the release gate.

---

## Prior active history

Detailed DOCK-2026-09-12-049 and earlier Dev entries remain preserved in Git history at `c8f8000d9562dbc315dc867af655358177e18d54` and its ancestors. Do not load them unless a current task specifically needs that evidence.
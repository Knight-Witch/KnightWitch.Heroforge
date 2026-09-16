# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-16-077 -- Resume Witch Dock backlog after Bridge gate

Date: 2026-09-16

### Summary

Documentation-only agenda/baton update after the mandatory HF-Chat-Bridge ergonomics gate completed successfully.

- HF-Chat-Bridge main userscript v0.3.2 is installed and live-validated; issue `HF-Chat-Bridge#2580` is closed.
- Direct trusted named-path calls and same-request call-result handles are now available for Witch Dock diagnostics; relay v0.2.2 and Power v0.1.0 are unchanged.
- Witch Dock backlog is resumed with issue `#7` — intermittent `Loading failed: connection error` toast — as the next active task.
- #7 remains diagnosis-first: emitter/request/trigger/retry behavior are unknown, so no runtime fix is assumed yet.
- Historical import/export/capture reports remain re-test items, not confirmed current failures.
- Texture Quality lifecycle/projected-host work remains CLOSED/PASS; broader Enhanced Object Textures remains a separate future feature track.

**Runtime behavior changed:** no. Documentation/housekeeping only; no JavaScript, manifest, module version, cache key, or public Stable behavior changes.

---

## DOCK-2026-09-16-076 -- Close post-promotion Texture Quality regression matrix

Documentation-only closeout after the already-promoted Texture Quality lifecycle/projected-host patch passed the full post-promotion Dev regression matrix. No additional runtime patch was required. The mandatory next gate was HF-Chat-Bridge issue `#2580`, now completed by the entry above.

---

## Prior active history

DOCK-2026-09-15-075 and earlier detailed entries remain preserved in Git history.

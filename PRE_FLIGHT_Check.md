# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-16-079 -- Reopen #7 / park JSON detour

Date: 2026-09-16

### Scope

Documentation-only routing correction. No Witch Dock runtime source or public Stable change is included.

### Corrected active state

- Issue #7 is OPEN again. The prior upstream-only closure was premature because Hero Forge's documented native network-error behavior was not tied to the exact observed popup by a captured failing request/emitter.
- The earlier 30-second trace is insufficient evidence: broad DOM text hooks saturated on ordinary UI churn and later network/error sections were truncated.
- Next diagnostic is a bounded low-noise failed-network/transient-notification capture during reproduction.
- No runtime patch should be made until the failing request/call path is isolated.

### Deferred JSON status preserved

- Current `tools/JSON_Tool.js` is bulk library backup/export only; no character import/restore path is present.
- `json-tool` v1.0.0 registered successfully on current Dev.
- Live smoke indexed 1,890 configs and 35 folder marks and downloaded at least 650 config JSONs with no reported failures before being manually paused.
- Pause/resume controls worked.
- Full ZIP completion was not required because JSON is not the active task.
- Amanda has additional bugs to add before JSON is resumed; do not infer their priority.

### Validation for this commit

- Intended changed-file set: `ACTIVE_CONTEXT.md`, `CHANGELOG.md`, `PRE_FLIGHT_Check.md` only.
- No JavaScript, manifest, module version, cache key, or public Stable file is intentionally changed.
- Stable remains protected at `acaf18a0cfd2c751886e85a269b9427ddfaa5040`.

**Runtime behavior changed:** no. Documentation/housekeeping only.

---

## PFC-2026-09-16-078 -- Close #7 / activate JSON status re-check

Superseded in part by PFC-2026-09-16-079: #7 is reopened and JSON is deferred.

---

## PFC-2026-09-16-077 -- Resume backlog / activate issue #7

Bridge gate completed and #7 was selected for diagnosis.

---

## PFC-2026-09-16-076 -- Texture Quality post-promotion regression closeout

Texture Quality lifecycle/projected-host hardening passed and closed with no additional runtime fix.

---

## Prior current preflight

PFC-2026-09-15-075 and earlier detailed records remain preserved in Git history.

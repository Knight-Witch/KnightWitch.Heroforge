# Changelog

This is the rolling current Dev changelog. Older detailed entries remain durable in Git history and should be fetched only when relevant.

## DOCK-2026-09-16-079 -- Reopen #7 and park JSON findings

Date: 2026-09-16

### Summary

Documentation-only routing correction after the connection-error diagnosis was closed too early and work briefly drifted into the JSON backlog item.

- Issue #7 is reopened. Hero Forge's documented native part-load network-error behavior remains a plausible explanation, but it is not accepted as the cause until the actual failing request/emitter is captured.
- The first broad runtime trace is explicitly insufficient because normal DOM churn saturated the retained text hooks and truncated later network/error evidence.
- Next #7 step is a low-noise failed-network/transient-notification capture; no Witch Dock runtime patch is justified yet.
- JSON findings are preserved as deferred status notes only: current `json-tool` v1.0.0 is a bulk library backup/export tool, not character import/restore; live smoke indexed 1,890 configs, loaded 35 folder marks, and downloaded at least 650 config JSONs with working pause/resume before being manually paused.
- Amanda has additional bugs to add before JSON work resumes. Their order is intentionally not inferred.

**Runtime behavior changed:** no. Documentation/housekeeping only; no JavaScript, manifest, module version, cache key, or public Stable behavior changes.

---

## DOCK-2026-09-16-078 -- Reclassify connection toast and route JSON re-test

Superseded in part by DOCK-2026-09-16-079: the upstream-only #7 closeout was premature and JSON is no longer the active task.

---

## DOCK-2026-09-16-077 -- Resume Witch Dock backlog after Bridge gate

Documentation-only routing update after HF-Chat-Bridge v0.3.2 was installed/live-validated.

---

## DOCK-2026-09-16-076 -- Close post-promotion Texture Quality regression matrix

Texture Quality post-promotion hardening passed and closed with no additional runtime patch required.

---

## Prior active history

DOCK-2026-09-15-075 and earlier detailed entries remain preserved in Git history.

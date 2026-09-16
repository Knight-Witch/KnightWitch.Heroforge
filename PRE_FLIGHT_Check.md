# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-16-077 -- Resume backlog / activate issue #7

Date: 2026-09-16

### Scope

Documentation-only routing update after the HF-Chat-Bridge stop gate completed. No Witch Dock runtime source or public Stable change is included.

### Confirmed state

- Texture Quality post-promotion regression hardening remains PASS/CLOSED.
- HF-Chat-Bridge issue `#2580` is closed after main userscript v0.3.2 was installed and live-validated.
- Bridge direct trusted named-path calls and same-request call-result handles are available for diagnostics; relay v0.2.2 / Power v0.1.0 remain unchanged.
- Backlog issue `#8` is free to resume.
- The first confirmed open Witch Dock bug is issue `#7`: repeated transient `Loading failed: connection error` toast on both Stable and Dev.

### Diagnosis gate for #7

Do not patch from the visible message alone. First identify the emitter/request and trigger path through current source search plus HF-Chat-Bridge runtime/DOM/network/event inspection. Preserve optional-feature isolation. If a runtime fix is required, read `MODULE_VERSIONING.md`, change only Dev, validate narrowly, and do not promote Stable without Amanda's explicit approval.

### Validation for this commit

- Intended changed-file set: `ACTIVE_CONTEXT.md`, `CHANGELOG.md`, `PRE_FLIGHT_Check.md` only.
- No JavaScript, manifest, module version, cache key, or public Stable file is intentionally changed.
- Stable remains protected at `acaf18a0cfd2c751886e85a269b9427ddfaa5040`.

**Runtime behavior changed:** no. Documentation/housekeeping only.

---

## PFC-2026-09-16-076 -- Texture Quality post-promotion regression closeout

Texture Quality lifecycle/projected-host hardening passed and closed with no additional runtime fix. Its mandatory follow-up Bridge gate is now completed by the entry above.

---

## Prior current preflight

PFC-2026-09-15-075 and earlier detailed records remain preserved in Git history.

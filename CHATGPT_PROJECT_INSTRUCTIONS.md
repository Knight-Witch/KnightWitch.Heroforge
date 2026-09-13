# ChatGPT Project Instructions — Witch Dock

Use this as the compact ChatGPT Project instruction set for Witch Dock work.

This project is `Knight-Witch/KnightWitch.Heroforge` / Witch Dock.

- Put TLDR first.
- Before material work, read `PROJECT_CONTRACT.md` and `ACTIVE_CONTEXT.md` on `WITCH_DEV_UI`, then only the files explicitly routed there or directly required by the task. Do not preload full history/changelog/preflight/session logs.
- Diagnose before editing. Do not guess HeroForge internals when source/runtime inspection can answer the question. Distinguish confirmed findings, supported inference, and hypothesis.
- Preserve known-working behavior, timing, polling, retries, readiness checks, snapshots, rollback, ownership boundaries, cache-key behavior, and module contracts unless testing proves a change is safe.
- Development flow is `WITCH_DEV_UI` -> live Dev validation -> human visual gate when relevant -> explicit narrow promotion -> `Witch_Scripts` Stable smoke. Public Stable is not an experimental branch.
- Use the connected GitHub account directly. Do not claim GitHub access is unavailable without actually trying the connector.
- Use `Knight-Witch/HF-Chat-Bridge` autonomously for runtime reads, diagnostics, reversible probes, bounded mutations, and verification so Amanda is not the console/probe middleman. Ask her only for genuinely human interaction or subjective visual confirmation.
- Bridge mutations are at-most-once. If execution is uncertain, read back before retrying. Never blindly replay uncertain mutations.
- HF-Chat-Bridge is development infrastructure only and must never become a Witch Dock runtime dependency.
- `Knight-Witch/HeroForge.Compatibility` is the upstream engine-investigation/reconstruction repo. Consult it only when a Witch Dock task needs unresolved HeroForge evidence or an existing validated compatibility implementation; do not load it by default for ordinary Witch Dock work.
- Keep optional feature failures isolated. Prefer named/capability runtime seams over private/minified internals; let HeroForge retain native ownership where possible.
- Follow `MODULE_VERSIONING.md` and `manifest.json.moduleRegistry` for active module versions. Runtime changes require appropriate version/build updates, syntax/static checks, and the narrowest meaningful live regression.
- Every committed repo update must update `CHANGELOG.md` and add a concise `PRE_FLIGHT_Check.md` record. Keep those logs rolling/compact; old detail belongs in Git history or targeted `HISTORY/BULLSHIT/*` files.
- `ACTIVE_CONTEXT.md` is the authoritative current-task router. `MASTER.md` is only a compact repo-wide index, not a transcript. Large history files are never mandatory startup reading.
- Continue autonomously through safe investigation/implementation steps instead of stopping at intermediate narration checkpoints.
- For GitHub userscripts, send raw update/install links instead of downloaded files unless Amanda explicitly asks for a file.

Current task state must come from `ACTIVE_CONTEXT.md`, not from old chat history.
# History

This folder stores durable project memory that should survive chat boundaries, context resets, model updates, and future development sessions.

## Files

- `SESSION_LOG.md`: chronological development and testing notes.
- `DECISIONS.md`: durable project decisions and why they were made.
- `STANDALONE_REFERENCES.md`: inventory of standalone scripts, external references, probes, deprecated scripts, and migration status.
- `Bullshit_Bible.md`: index of HeroForge engine weirdness and fragile rules.
- `BULLSHIT/`: topic-specific notes for recurring HeroForge behavior problems, including:
  - `LIGHTING_AND_EXTRA_LIGHTS.md` for the Advanced Lighting / Extra Lights sub-project.
  - `DEBUG_UI_AND_INTERNALS.md` for the archived native debug bundle and internal inspector references.
  - `SLOTS_JOINTS_AND_ATTACHMENTS.md` for historical slot catalogs, joint IDs, attachment anchors, and dataset caveats.
- `REFERENCES/README.md`: source manifest, hashes, provenance, and archive inventory for external historical reference files.

## Reference Storage Rules

- Keep obsolete or external executable userscripts out of `/tools/`, `/HeroForge_UI/`, and `manifest.json`.
- Prefer distilled technical notes plus a source manifest for large unstable archives.
- If raw copies are later committed, keep them under `HISTORY/REFERENCES/` with non-installing `.txt` filenames.
- Historical datasets and archived internal bundles are discovery aids, not current HeroForge contracts.

## Documentation Checkpoints

- Update the relevant files after meaningful validated findings, corrections, status changes, decisions, blockers, canonical-reference changes, or material probe milestones.
- Batch trivial repeated observations rather than logging every test click.
- Do not begin the next material probe/code stage while the current docs are knowingly stale.
- Correct or remove outdated active claims instead of appending contradictory active statements.
- Distinguish confirmed behavior from observations, inferences, and unproven hypotheses.

Keep entries concise enough for fast recovery, but complete enough that critical project state does not depend on chat memory.

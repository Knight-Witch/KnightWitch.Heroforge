# Decisions

Durable decisions that should guide future repo work.

## Active Decisions

### 2026-07-09 — Witch Dock Documentation Structure

Decision:
- Use root-level tracking docs plus segmented `HISTORY/BULLSHIT/` topic files.

Reason:
- Witch Dock needs durable project memory and HeroForge engine notes without turning one file into an unusable junk drawer.

Applies to:
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `STYLE_KEYS.md`
- `HISTORY/`

### 2026-07-09 — GitHub History as Default Diff Source

Decision:
- Do not require standalone diff files for normal updates.
- Use GitHub commit history, `CHANGELOG.md`, `MASTER.md`, and `PRE_FLIGHT_Check.md` as the primary rollback/reference system.
- Use `/DIFFS/` only for complex or risky changes that need a preserved standalone patch.

Reason:
- Direct repo access makes mandatory separate diff files redundant for routine changes.

Applies to:
- Routine repo updates
- Rollback/reference workflow
- `DIFFS/`

### 2026-07-09 — `Witch_Scripts` Is the Live Branch

Decision:
- Treat `Witch_Scripts` as the live operational branch for Witch Dock unless explicitly changed.
- `main` is not the active install branch.

Reason:
- The public install/update URLs and manifest raw URLs point at `Witch_Scripts`.

Applies to:
- `Witch_Dock.user.js`
- `manifest.json`
- README install instructions
- Future release edits

### 2026-07-09 — Manifest-Driven Tool Loading

Decision:
- Use `manifest.json` as the live module inventory.
- Visible tools belong in `/tools/`.
- Hidden HeroForge UI utilities belong in `/HeroForge_UI/`.
- Only update `manifest.json` when adding, removing, renaming, or changing live-loaded modules.

Reason:
- Witch Dock already uses a manifest loader, and keeping module roles separated reduces conflicts between global dock behavior and internal tool logic.

Applies to:
- `manifest.json`
- `/tools/`
- `/HeroForge_UI/`
- New tool migration

### 2026-07-09 — Standalone Tampermonkey References Can Be Canonical

Decision:
- A working standalone Tampermonkey script remains canonical until the Witch Dock-integrated version is tested and confirmed.
- Migration should preserve behavior first and clean structure second.

Reason:
- HeroForge behavior is unstable enough that working timing, probing, and state logic should not be reinterpreted during migration.

Applies to:
- Standalone probes
- Tool migration queue
- Reference-vs-integrated debugging

## Entry Template

### YYYY-MM-DD — Decision Title

Decision:
- 

Reason:
- 

Applies to:
- 

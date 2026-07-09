# Decisions

Durable decisions that should guide future repo work.

## Active Decisions

### 2026-07-09 — Witch Dock Documentation Structure

Decision:
- Use root-level tracking docs plus segmented `HISTORY/BULLSHIT/` topic files.

Reason:
- Witch Dock needs durable project memory and HeroForge engine notes without turning one file into an unusable junk drawer.

### 2026-07-09 — GitHub History as Default Diff Source

Decision:
- Do not require standalone diff files for normal updates.
- Use GitHub commit history, `CHANGELOG.md`, `MASTER.md`, and `PRE_FLIGHT_Check.md` as the primary rollback/reference system.
- Use `/DIFFS/` only for complex or risky changes that need a preserved standalone patch.

Reason:
- Direct repo access makes mandatory separate diff files redundant for routine changes.

## Entry Template

### YYYY-MM-DD — Decision Title

Decision:
- 

Reason:
- 

Applies to:
- 

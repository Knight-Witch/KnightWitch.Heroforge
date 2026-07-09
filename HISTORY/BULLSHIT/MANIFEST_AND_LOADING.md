# Manifest and Loading

Witch Dock manifest loading, module boot order, raw GitHub loading, and runtime registration behavior.

## Known Rules

- Visible tools load through `manifest.json` from `/tools/`.
- Hidden HeroForge UI utilities load through `manifest.json` from `/HeroForge_UI/`.
- Update `manifest.json` only when adding, removing, or changing live-loaded modules.
- Preserve module registration timing and retry loops unless a tested replacement exists.

## Findings

Add detailed findings here as they are recovered or discovered.

## Entry Template

### Finding Title

Context:
- 

Observed behavior:
- 

Working approach:
- 

Affected tools:
- 

# Timing and State

HeroForge timing/state discoveries that must be preserved across tools.

## Known Rules

- HeroForge state may update after `pointerup`, not immediately on `click`.
- Delayed snapshots and retry loops may be required to capture correct runtime state.
- Do not simplify timing behavior without testing against a working reference.

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

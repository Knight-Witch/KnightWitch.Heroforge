# Style Keys

Shared visual references for Witch Dock UI and future tool panels.

## Current UI Direction

- Dark translucent dock surface.
- Compact utility-first controls.
- System font stack.
- Rounded panels and buttons.
- Soft translucent borders.
- Minimal visual noise.
- Presentation should not change during functional fixes unless explicitly requested.

## Core References

| Element | Current Direction | Notes |
|---|---|---|
| Dock shell | Dark translucent panel | Defined in `Witch_Dock.user.js` under `#kwWitchDock`. |
| Font | System UI stack | Keep readable and compact. Current stack uses `system-ui`, `Segoe UI`, `Roboto`, `Ubuntu`, `Cantarell`, `Noto Sans`, and sans-serif fallbacks. |
| Borders | Low-opacity white | Used for dock, buttons, panels, separators, and modal UI. |
| Buttons | Compact rounded controls | Avoid expanding UI without explicit request. |
| Tool sections | Collapsible dock sections | Match existing Witch Dock tool style. |
| Footer | Compact status/hotkey area | Also hosts bone detection output. Preserve readability and do not crowd. |
| Tabs | Horizontal dock tabs | Support overflow/scroll cue behavior. Do not alter tab layout casually. |
| Modals | Dark dock-matched overlays | Used for About and Disclaimer surfaces. |

## Visual Rules

- Keep visible tool panels consistent with existing Witch Dock panel density.
- Avoid unnecessary glow, animation, large spacing, or decorative clutter.
- Functional fixes must not alter presentation unless the visual behavior itself is the bug.
- Shared/global presentation belongs in the dock shell where practical; internal tool UI should not duplicate global styling unless needed.
- New assets must go in `/ASSETS/` with clear names.

## Runtime / UX Constraints

- Witch Dock is an overlay inside HeroForge, so z-index, pointer behavior, scroll behavior, and focus behavior matter.
- Do not add UI that interferes with HeroForge interaction surfaces.
- Preserve compact/minimized/closed dock behavior unless explicitly changing dock UX.
- Preserve readable controls at small dock sizes.

## Assets

Assets belong in `/ASSETS/` with clear names and no duplicate clutter.

# DOM and Layout

HeroForge DOM/layout discoveries that affect Witch Dock tools and hidden UI utilities.

## Known Rules

- HeroForge reuses container IDs and UI shells across tabs.
- DOM targeting must be scoped to the active tool/context when possible.
- Layout detection should be tolerant and content-aware.
- Do not globally style reused HeroForge containers unless the active context is proven safe.
- Witch Dock UI presentation is frozen unless a UI/UX change is explicitly requested.

## Findings

### Decals Menus Reuse `#menuC` and `#menuD`

Context:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js` targets Decals source and slot menus.

Observed behavior:
- HeroForge uses reused containers such as `#menuC` and `#menuD`, so styling them globally can create empty resize/scroll zones on unrelated tabs.
- The scroll guard detects active Decals source menus through visible text and attributes, then pairs them with visible slot menus.

Working approach:
- Preserve scoped detection using visible container checks, source text/attribute matching, slot token scoring, and source/slot layout pairing.
- Do not replace this with a global `#menuC`/`#menuD` style rule.

Affected tools:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`
- `HeroForge_UI/HF_UI_Scroll_Split_Safe.js`
- `tools/Utilities.js`

### Scroll Guard Handles Multiple Layout Shapes

Context:
- Decals source/slot menus can appear stacked, side-by-side, or in a bottom compact layout.

Observed behavior:
- The scroll guard classifies layouts as `vertical`, `split`, or `bottom` based on bounding boxes, overlap, source/slot size, and horizontal overflow.

Working approach:
- Preserve layout classification and class-specific styling.
- Do not collapse the behavior into one layout assumption.

Affected tools:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`
- `HeroForge_UI/HF_UI_Scroll_Split_Safe.js`

### Witch Dock Overlay Must Avoid HeroForge Interaction Surfaces

Context:
- Witch Dock is an overlay inside HeroForge rather than a standalone app UI.

Observed behavior:
- Dock drag/resize, compact mode, modal overlays, footer detection, and tool panels all coexist with HeroForge's own interaction layer.

Working approach:
- Preserve dock compact/minimized/closed behavior and existing pointer/focus handling unless explicitly changing dock UX.
- Avoid new UI that intercepts HeroForge canvas/menu interactions unnecessarily.

Affected tools:
- `Witch_Dock.user.js`
- all visible tool panels

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

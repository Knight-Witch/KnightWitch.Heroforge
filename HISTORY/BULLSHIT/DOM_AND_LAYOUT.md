# DOM and Layout

HeroForge DOM/layout discoveries that affect Witch Dock tools and hidden UI utilities.

## Known Rules

- HeroForge reuses container IDs and UI shells across tabs.
- DOM targeting must be scoped to the active tool/context when possible.
- Layout detection should be tolerant and content-aware.
- Do not globally style reused HeroForge containers unless the active context is proven safe.
- Witch Dock UI presentation is frozen unless a UI/UX change is explicitly requested.
- Decals UI must support all three observed menu layouts: right-side grouped, right/left split, and bottom compact.

## Findings

### Decals Menus Reuse `#menuC` and `#menuD`

Context:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js` targets Decals source and slot menus.

Observed behavior:
- HeroForge uses reused containers such as `#menuC` and `#menuD`, so styling them globally can create empty resize/scroll zones on unrelated tabs.
- The scroll guard detects active Decals source menus through visible text and attributes, then pairs them with visible slot menus.
- A major regression path was treating `#menuC` / `#menuD` as globally safe just because they were correct while Decals was open.

Working approach:
- Preserve scoped detection using visible container checks, source text/attribute matching, slot token scoring, and source/slot layout pairing.
- Do not replace this with a global `#menuC`/`#menuD` style rule.
- Retarget after UI mutation points instead of assuming the first DOM state is final.

Affected tools:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`
- `HeroForge_UI/HF_UI_Scroll_Split_Safe.js`
- `tools/Utilities.js`

### Decals Has Three Observed UI Layouts

Context:
- HeroForge Decals UI changes layout depending on UI settings and viewport/menu arrangement.
- The scroll behavior was tied to the `Group Menus Right` setup and had to be adjusted after logs showed alternate layouts.

Observed behavior:
- Layout 1: right-side grouped/stacked menu. The source/object selector and decal slot grid are vertically grouped on the right side. This behaves like the original stacked/vertical assumption.
- Layout 2: right/left split. Logs showed `#menuC` as the visible source strip and `#menuD` as the visible slot grid side-by-side. The slot menu required split-specific handling so resize/max-height behavior did not create bad layout behavior.
- Layout 3: bottom compact menu. Logs showed `#menuD` with huge horizontal overflow, including `scrollWidth` around `5035`, `clientWidth` around `440`, and `overflowsX === true`. This layout needs horizontal scrolling and no vertical resize behavior.
- The same container IDs can appear in all three layouts, so container ID alone does not identify intended behavior.

Working approach:
- Keep all three layout classes/branches: `vertical`, `split`, and `bottom`.
- Use bounding boxes, overlap checks, size checks, horizontal overflow, and alignment to classify the active pair.
- For bottom compact layout, prefer horizontal scroll and no resize.
- For split layout, avoid unsafe inherited resize/max-height behavior; keep the split-safe override separate and narrow.
- For vertical layout, allow scoped vertical scroll/resize on the active source/slot pair.

Affected tools:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`
- `HeroForge_UI/HF_UI_Scroll_Split_Safe.js`

### Decals Source and Slot Menus Must Be Paired, Not Guessed

Context:
- Multiple visible menus can exist, and HeroForge can expose text through normal text content or attributes.

Observed behavior:
- Source menu detection needed both visible text and attribute text.
- Useful source labels included projection/projector/splatter/blood/decals.
- Slot menu detection used token scoring from visible A-J labels.
- Pairing had to account for stacked and side-by-side layouts using bounding-box overlap and distance.

Working approach:
- Preserve source detection via text + `aria-label` / `title` / `alt` attributes.
- Preserve slot grid scoring; do not assume all `#menuD` instances are slot grids.
- Preserve nearest-pair selection rather than selecting the first visible container.

Affected tools:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`

### Empty Resize Zones Were a Scope Bug

Context:
- Early scroll styling targeted reused HeroForge containers too broadly.

Observed behavior:
- Empty resizable zones appeared on non-Decals tabs when generic `#menuC` / `#menuD` styling leaked outside the active Decals UI.
- This confirmed that the scroll fix must be active-context aware.

Working approach:
- Only apply classes after Decals source and slot menus are both detected and paired.
- Clear classes from `#menuC` and `#menuD` before retargeting.
- On disable, remove styles and clear target classes.

Affected tools:
- `HeroForge_UI/Expanded_UI_Scroll_Guards.js`
- `tools/Utilities.js`

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

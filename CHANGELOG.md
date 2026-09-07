# Changelog

## DOCK-2026-09-07-026 — Promote Booth v27 and Utilities v1.2.1 to Stable

Date: 2026-09-07

### Summary

Complete the intended public Booth/Utilities promotion after the prior Black Canvas replay release exposed that Stable still loaded Booth v24 and Utilities v1.1.0.

### Public runtime changes

- `tools/Booth.js` advances from v24 to the exact Dev-tested v27 blob `434b5382c9e8b01e9f9e8bf53d772e72eaf53090`;
- `tools/Utilities.js` advances from v1.1.0 to the exact Dev-tested v1.2.1 blob `036fca4d7f68a1dee0f7d160777d453ac53274af`;
- Utilities gains `Booth Features` with saved Booth Persistence Across Sessions and Black Canvas Across Sessions defaults;
- Booth keeps Booth View / Black Canvas as session controls while exposing the v27 saved-default API used by Utilities;
- v27 saved-config/runtime stabilization, generation clearing, reduced refresh churn, lighting replay discipline, and broader Black Canvas layout invalidation are promoted intact;
- public Black Canvas replay v0.1.1 remains byte-unchanged and now uses its preferred v27 state API;
- public Witch Dock shell remains v1.2.0 because these are manifest-delivered module updates.

### Live evidence inherited from Dev

The successful white-flash smoke was run with Booth v27, Utilities v1.2.1, and the replay module loaded together. Black Canvas remained black through the formerly reliable flash-causing update and Amanda reported the result worked perfectly.

### Preserved boundaries

- no wholesale Dev merge;
- Black Canvas replay runtime unchanged;
- Corrected Bound Decal Gizmo runtime/fragments unchanged;
- Spinny Mini WebP unchanged;
- High Res Image Capture unchanged;
- JSON unchanged;
- Developer Mode unchanged;
- Decals host/tab shell unchanged;
- HF-Chat-Bridge remains development-only.

### Public gate

After refresh, verify:

1. Developer Mode reports Booth v27.0.0 and Utilities v1.2.1;
2. `Utilities -> Booth Features` is present;
3. Black Canvas is visibly black;
4. the formerly flash-causing action does not flash;
5. Black Canvas OFF restores the ordinary background.

**Runtime behavior changed:** yes — Booth v27 and Utilities v1.2.1 are now public Stable modules.

---

Historical public changelog through DOCK-2026-09-07-025 is preserved in Git history at commit `b0bc170af613fc31615cd4ce78e030db3012b426`.

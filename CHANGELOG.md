# Changelog

## DOCK-2026-09-08-029 — Promote fresh-slot bound decal normalization v1.1.1

Date: 2026-09-08

### Summary

Promote the exact Dev-validated Corrected Bound Decal Gizmo v1.1.1 runtime after live confirmation that HeroForge's untouched first Project-OFF initializer shifted from the previously recorded raw values.

### Confirmed runtime evidence

HF-Chat-Bridge read the untouched slot after first Project OFF as `h=-2.9802322387695313e-08`, `v=1.5633519738912582`, `s=1.818040788039411`, `sy=1.818040788039411`, `forceProjectedScript=false`. Those values fall outside the old v1.1.0 detector but inside the v1.1.1 current-profile matcher.

### Live Dev acceptance

Amanda confirmed all requested v1.1.1 behavior:

- fresh untouched slot -> first Project OFF normalizes H/V to `0/0` and S/SY to `-1.5/-1.5`;
- an already edited Project-OFF transform survives Project ON -> OFF;
- artwork swap while Project OFF preserves the bound transform.

Move/Rotate/Scale transform math and existing undo/redo code were not changed by this patch.

### Stable promotion

- `corrected-bound-decal-gizmo` `1.1.0 -> 1.1.1`;
- promote the exact validated Dev runtime blob;
- retain both the earlier confirmed bad-initializer profile and the current confirmed profile;
- preserve the existing `freshBind` + neutral-field gates so user-edited transforms are not broadly normalized;
- public module URL remains on `Witch_Scripts` with a v1.1.1 cache identity.

### Preserved boundaries

Booth/Black Canvas/bootstrap, Utilities, Spinny, High Res, JSON, Developer Mode, Decals host, Body, Pose, fragment sources, public shell v1.2.1, and all unrelated runtime modules are unchanged.

**Runtime behavior changed:** yes — public Corrected Bound Decal Gizmo fresh-slot normalization only.

---

## DOCK-2026-09-07-028 — Record final public Stable Booth acceptance

Date: 2026-09-07

### Summary

Documentation-only closeout recording Amanda's final public Stable acceptance of Witch Dock v1.2.1 with Booth v27.0.4, Black Canvas replay v0.1.5, Booth runtime bootstrap v0.1.0, and the cache-keyed manifest/module loader.

### Final public result

Amanda reported that everything looks great in the public build after the Stable promotion.

This closes the release gate for:

- public shell/module delivery at v1.2.1;
- saved Booth and Black Canvas startup restoration;
- Black Canvas ON/OFF restoration;
- the previously reliable white-flash regression remaining closed.

The approximately 1 px checkerboard seam remains a documented deferred cosmetic issue and is not treated as fixed.

### Runtime impact

**No runtime behavior changed.** No userscript, manifest, module, storage, version, or compatibility logic changed in this checkpoint.

### Touched files

- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABLE_ACCEPTANCE.md`

---

## DOCK-2026-09-07-027 — Promote validated Booth lifecycle and cache-keyed public loader

Date: 2026-09-07

### Summary

Promote the final Dev-validated Booth lifecycle/state repair to public Stable and repair the separate raw-GitHub loader caching defect. This is a narrow Stable promotion; it is not a wholesale Dev merge.

### Runtime changes

- public userscript shell `1.2.0 -> 1.2.1`;
- public loader now uses a unique per-page manifest cache key and deterministic registry-identity module cache keys, preserving existing query parameters and load order;
- Booth `27.0.0 -> 27.0.4`, exact validated Dev blob `d8e9b2fc4d1bf18d550193ed186168bae515ae91`;
- Black Canvas replay `0.1.1 -> 0.1.5`, exact validated Dev blob `3f663f8349830490d17b0d44aa42525b35c97b5f`; Stable's diagnostic state fallback is retained in that Dev-tested source;
- new hidden `booth.runtime-bootstrap` v0.1.0, exact validated Dev blob `3aaa110b4f09ab74df524e64056406b571357474`, loaded before Booth;
- Utilities remains v1.2.1 and byte-unchanged.

### Final Dev acceptance

Amanda reported PASS for:

1. full fantasy editor environment restoration;
2. Lighting / Effects / Overlays / Background toggle stability;
3. Black Canvas ON -> OFF full backdrop restoration;
4. Black Canvas ON + Background OFF fallthrough without the stranded-background failure.

Earlier integrated Dev validation remains inherited for saved Booth startup bootstrap, `+ New Figure` exclusion, and the established post-update white-flash suppression boundary.

### Deferred known issue

A roughly 1 px checkerboard seam can still appear at the 1:1 Booth edge, usually top/bottom and sometimes also the right edge after responsive resizing/maximization. It is cosmetic, non-blocking, and explicitly deferred to a later frame/mask geometry task.

### Preserved boundaries

- no wholesale Dev merge;
- Corrected Bound Decal Gizmo unchanged;
- Spinny Mini WebP unchanged;
- High Res Image Capture unchanged;
- JSON unchanged;
- Developer Mode unchanged;
- Decals host/tab shell behavior unchanged apart from the loader cache repair;
- HF-Chat-Bridge remains development-only and is not a public dependency.

**Runtime behavior changed:** yes — public loader cache repair plus validated Booth/replay/bootstrap promotion.

---

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

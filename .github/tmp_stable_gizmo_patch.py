from pathlib import Path
import json


def replace_once(text: str, before: str, after: str, label: str) -> str:
    count = text.count(before)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    return text.replace(before, after, 1)

# Stable manifest: version the exact Dev-validated gizmo blob and keep public URL on Witch_Scripts.
path = Path("manifest.json")
text = path.read_text(encoding="utf-8")
text = replace_once(
    text,
    '''    {
      "id": "corrected-bound-decal-gizmo",
      "title": "Corrected Bound Decal Gizmo",
      "path": "HeroForge_UI/Corrected_Bound_Decal_Gizmo.js",
      "kind": "heroForgeUI",
      "load": "manifest",
      "version": "1.1.0",
      "build": "1.1.0-stable-undo-transform-preserve",
      "versionOrigin": "existing"
    },''',
    '''    {
      "id": "corrected-bound-decal-gizmo",
      "title": "Corrected Bound Decal Gizmo",
      "path": "HeroForge_UI/Corrected_Bound_Decal_Gizmo.js",
      "kind": "heroForgeUI",
      "load": "manifest",
      "version": "1.1.1",
      "build": "1.1.1-dev-fresh-slot-normalization",
      "versionOrigin": "stable-promoted-dev-validated-2026-09-08"
    },''',
    "gizmo registry",
)
text = replace_once(
    text,
    '      "url": "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/HeroForge_UI/Corrected_Bound_Decal_Gizmo.js",',
    '      "url": "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/HeroForge_UI/Corrected_Bound_Decal_Gizmo.js?v=1.1.1-dev-fresh-slot-normalization",',
    "public gizmo URL",
)
json.loads(text)
path.write_text(text, encoding="utf-8")

# Stable changelog.
path = Path("CHANGELOG.md")
text = path.read_text(encoding="utf-8")
entry = '''## DOCK-2026-09-08-029 — Promote fresh-slot bound decal normalization v1.1.1

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

'''
text = replace_once(text, "# Changelog\n\n", "# Changelog\n\n" + entry, "changelog header")
path.write_text(text, encoding="utf-8")

# Stable pre-flight.
path = Path("PRE_FLIGHT_Check.md")
text = path.read_text(encoding="utf-8")
entry = '''## PFC-2026-09-08-029 — Promote validated fresh-slot gizmo repair to Stable

Date: 2026-09-08

### Scope

Promote only the validated Corrected Bound Decal Gizmo v1.1.1 fresh-slot initializer repair from `WITCH_DEV_UI` to public `Witch_Scripts`.

### Reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md`;
- Compatibility `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, and `TESTING.md`;
- current public `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, `manifest.json`, and gizmo history;
- Dev gizmo v1.1.1 candidate commit `08e776bfb276b281e9b337f3d3ccb866e23e2ca4`;
- Amanda's live Dev PASS for fresh-slot normalization, edited Project ON/OFF preservation, and Project-OFF artwork-swap preservation;
- bridge-confirmed current untouched raw initializer values.

### Confirmed findings

- v1.1.0 still matched only the earlier `v≈1.50394`, `s≈sy≈1.76859` profile;
- current untouched Project-OFF raw state is `v=1.5633519738912582`, `s=sy=1.818040788039411`, with H effectively zero;
- v1.1.1's `1.56 / 1.82 / 1.82` profile at ±0.025 correctly covers those confirmed raw values;
- v1.1.1 only normalizes on `freshBind` plus the existing neutral H/D/rotation gate;
- Move/Rotate/Scale and undo/redo runtime paths are unchanged;
- exact Dev runtime behavior has passed the human gate.

### Target files

- `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`

### Preservation requirements

- promote exact Dev gizmo blob;
- do not alter fragment sources;
- do not alter Booth, replay, bootstrap, Utilities, Spinny, High Res, JSON, Developer Mode, Decals, Body, Pose, or public shell;
- public URL must remain `Witch_Scripts`, never `WITCH_DEV_UI`;
- source + canonical manifest version + required tracking docs must land in one atomic Stable commit.

### Gate

JavaScript syntax, manifest JSON, exact Dev gizmo blob parity, exact six-file whitelist, protected unrelated runtime blob equality, `git diff --check`, and one-commit Stable candidate ancestry must pass before moving `Witch_Scripts`.

### Decision

Proceed with the narrow Stable promotion. One quick public fresh-slot smoke is sufficient afterward; no full gizmo regression matrix is required because the same runtime blob already passed Dev.

**Runtime behavior changed:** yes — public gizmo only.

---

'''
text = replace_once(text, "# Pre-Flight Check Log\n\n", "# Pre-Flight Check Log\n\n" + entry, "preflight header")
path.write_text(text, encoding="utf-8")

# Master current state.
path = Path("MASTER.md")
text = path.read_text(encoding="utf-8")
text = replace_once(
    text,
    "- Corrected Bound Decal Gizmo runtime: Stable validated and unchanged.",
    "- Corrected Bound Decal Gizmo runtime: v1.1.1 / build `1.1.1-dev-fresh-slot-normalization`, Dev validated and promoted to Stable. Fresh untouched first Project-OFF normalizes H/V to `0/0` and S/SY to `-1.5/-1.5`; edited Project state and artwork swaps preserve established bound transforms.",
    "master gizmo status",
)
path.write_text(text, encoding="utf-8")

# Gizmo history append.
path = Path("HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md")
text = path.read_text(encoding="utf-8").rstrip()
appendix = '''

## 2026-09-08 fresh-slot initializer drift repair — v1.1.1

HeroForge's untouched first Project-OFF initializer shifted from the earlier validated profile. A live HF-Chat-Bridge read confirmed the current raw record as:

- `h=-2.9802322387695313e-08` (effectively zero);
- `v=1.5633519738912582`;
- `s=1.818040788039411`;
- `sy=1.818040788039411`;
- `forceProjectedScript=false`.

This explains why v1.1.0 no longer normalized the new-slot case: the old detector was centered on `v≈1.50394`, `s≈sy≈1.76859` with ±0.035 tolerance.

v1.1.1 preserves that earlier profile and adds the current `1.56 / 1.82 / 1.82` profile with ±0.025 tolerance. The normalization remains restricted to a first `freshBind` matching the neutral H/D/rotation gate. The sane first-bound output is now `h=0`, `v=0`, `s=-1.5`, `sy=-1.5`; depth, rotation, `sz`, and unrelated fields remain untouched.

Amanda live-validated v1.1.1 in Dev: the fresh untouched slot normalized correctly, an edited Project-OFF transform survived Project ON/OFF, and artwork swap while Project OFF preserved the transform. Move/Rotate/Scale and their existing undo/redo paths were not changed.

The exact Dev runtime blob was then selected for narrow public Stable promotion. Fragment sources remain unchanged.
'''
if "## 2026-09-08 fresh-slot initializer drift repair — v1.1.1" in text:
    raise SystemExit("history section already present")
path.write_text(text + appendix + "\n", encoding="utf-8")

print("stable gizmo tracking patch applied")

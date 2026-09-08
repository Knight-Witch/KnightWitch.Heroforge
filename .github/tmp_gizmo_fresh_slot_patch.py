from pathlib import Path
import json


def replace_once(text: str, before: str, after: str, label: str) -> str:
    count = text.count(before)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    return text.replace(before, after, 1)

# Runtime module
path = Path("HeroForge_UI/Corrected_Bound_Decal_Gizmo.js")
text = path.read_text(encoding="utf-8")
text = replace_once(
    text,
    "      'const BUILD = \"1.1.0-stable-undo-transform-preserve\";',",
    "      'const BUILD = \"1.1.1-dev-fresh-slot-normalization\";',",
    "gizmo build marker",
)
text = replace_once(
    text,
    """  const BOGUS_BOUND_DEFAULT = Object.freeze({
    v: 1.5039421170949936,
    s: 1.768586891036554,
    sy: 1.768586891036554
  });
  const BOGUS_BOUND_TOLERANCE = 0.035;""",
    """  const BOGUS_BOUND_DEFAULTS = Object.freeze([
    Object.freeze({
      v: 1.5039421170949936,
      s: 1.768586891036554,
      sy: 1.768586891036554
    }),
    Object.freeze({
      v: 1.56,
      s: 1.82,
      sy: 1.82
    })
  ]);
  const BOGUS_BOUND_TOLERANCE = 0.025;""",
    "fresh-slot initializer profiles",
)
text = replace_once(
    text,
    """    return neutralish &&
      nearValue(record.v, BOGUS_BOUND_DEFAULT.v) &&
      nearValue(record.s, BOGUS_BOUND_DEFAULT.s) &&
      nearValue(record.sy, BOGUS_BOUND_DEFAULT.sy);""",
    """    return neutralish && BOGUS_BOUND_DEFAULTS.some(signature =>
      nearValue(record.v, signature.v) &&
      nearValue(record.s, signature.s) &&
      nearValue(record.sy, signature.sy)
    );""",
    "fresh-slot initializer matcher",
)
text = replace_once(
    text,
    """            // First-ever Project-OFF state for this slot: projected s/sy are not
            // a valid baseline. Neutralize only the confirmed bad initializer.
            patchRecord.v = 0;
            patchRecord.s = 0;
            patchRecord.sy = 0;""",
    """            // First-ever Project-OFF state for this slot: projected transform values
            // are not a valid bound baseline. Normalize only recognized untouched
            // HeroForge initializer profiles to a sane starting position/size.
            patchRecord.h = 0;
            patchRecord.v = 0;
            patchRecord.s = -1.5;
            patchRecord.sy = -1.5;""",
    "fresh-slot normalized values",
)
text = replace_once(
    text,
    'console.info("[Witch Dock] Corrected bound decal gizmo stable v1.1.0 loaded: undo transaction + bound-state preservation + fresh-slot normalization.");',
    'console.info("[Witch Dock] Corrected bound decal gizmo DEV v1.1.1 loaded: undo transaction + bound-state preservation + fresh-slot sane defaults.");',
    "gizmo load log",
)
text = replace_once(
    text,
    'console.error("[Witch Dock] Corrected bound decal gizmo stable v1.1.0 failed closed:", error);',
    'console.error("[Witch Dock] Corrected bound decal gizmo DEV v1.1.1 failed closed:", error);',
    "gizmo failure log",
)
path.write_text(text, encoding="utf-8")

# Dev manifest: version bump + actually load Dev gizmo source.
path = Path("manifest.json")
manifest = path.read_text(encoding="utf-8")
manifest = replace_once(
    manifest,
    """    {
      \"id\": \"corrected-bound-decal-gizmo\",
      \"title\": \"Corrected Bound Decal Gizmo\",
      \"path\": \"HeroForge_UI/Corrected_Bound_Decal_Gizmo.js\",
      \"kind\": \"heroForgeUI\",
      \"load\": \"manifest\",
      \"version\": \"1.1.0\",
      \"build\": \"1.1.0-stable-undo-transform-preserve\",
      \"versionOrigin\": \"existing\"
    },""",
    """    {
      \"id\": \"corrected-bound-decal-gizmo\",
      \"title\": \"Corrected Bound Decal Gizmo\",
      \"path\": \"HeroForge_UI/Corrected_Bound_Decal_Gizmo.js\",
      \"kind\": \"heroForgeUI\",
      \"load\": \"manifest\",
      \"version\": \"1.1.1\",
      \"build\": \"1.1.1-dev-fresh-slot-normalization\",
      \"versionOrigin\": \"dev-fresh-slot-normalization-2026-09-08\"
    },""",
    "gizmo registry entry",
)
manifest = replace_once(
    manifest,
    '      "url": "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/HeroForge_UI/Corrected_Bound_Decal_Gizmo.js",',
    '      "url": "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/HeroForge_UI/Corrected_Bound_Decal_Gizmo.js?v=1.1.1-dev-fresh-slot-normalization",',
    "gizmo Dev tool URL",
)
json.loads(manifest)
path.write_text(manifest, encoding="utf-8")

# Durable docs.
changelog = Path("CHANGELOG.md")
text = changelog.read_text(encoding="utf-8")
entry = """## DOCK-2026-09-08-046 — Repair fresh-slot Project-OFF decal normalization

Date: 2026-09-08

### Live report

A brand-new untouched projected decal currently shows Move `0 / 1.56 / 0` and Scale `1.82 / 1.82 / 2`; toggling Project OFF leaves those values unchanged instead of running the previously validated fresh-slot normalization.

### Diagnosis

- Public/Dev gizmo source still contains the v0.4.2 fresh-bind normalizer.
- Its bad-initializer detector is keyed to the previously observed raw profile `v≈1.50394`, `s≈sy≈1.76859` with ±0.035 tolerance.
- The current UI-observed initializer `v≈1.56`, `s≈sy≈1.82` lies outside that old detector envelope. Exact current raw floats remain unconfirmed because HF-Chat-Bridge request #752 did not return during this edit; the UI shift is therefore treated as supported inference pending live Dev validation.

### Dev change

- Corrected Bound Decal Gizmo `1.1.0 -> 1.1.1` / build `1.1.1-dev-fresh-slot-normalization`.
- Preserve the old confirmed initializer profile and add the current UI-observed profile with a tight ±0.025 matcher.
- Only a first-ever Project-OFF `freshBind` that matches a recognized untouched initializer is normalized.
- Fresh normalization now sets `h=0`, `v=0`, `s=-1.5`, `sy=-1.5`; depth/rotation/`sz` and unrelated fields remain untouched.
- Move/Rotate/Scale drag math, undo/redo, existing bound-transform preservation, artwork-swap preservation, and Project ON/OFF restoration are unchanged.
- Dev manifest now loads this gizmo from `WITCH_DEV_UI` rather than accidentally reusing the Stable gizmo URL.

### Gate

Dev only. Test a new untouched decal slot, then regression-check an already edited Project-OFF decal plus Project ON/OFF/artwork preservation before any Stable promotion.

**Runtime behavior changed:** yes — Dev corrected-gizmo fresh-slot normalization only. Public Stable unchanged.

---

"""
text = replace_once(text, "# Changelog\n\n", "# Changelog\n\n" + entry, "changelog header")
changelog.write_text(text, encoding="utf-8")

preflight = Path("PRE_FLIGHT_Check.md")
text = preflight.read_text(encoding="utf-8")
entry = """## PFC-2026-09-08-046 — Fresh-slot bound decal normalization repair

Date: 2026-09-08

### Reviewed

- binding HeroForge.Compatibility contract, MASTER, PRE_FLIGHT, CHANGELOG, ARCHITECTURE, FEATURE_INVENTORY, COMPATIBILITY, OWNERSHIP, and TESTING;
- current Witch Dock Dev MASTER/PRE_FLIGHT/CHANGELOG/MODULE_VERSIONING/manifest;
- Public and Dev `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js`;
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md` and its validated v0.4.2 fresh-slot behavior;
- Amanda's before/after screenshots of a new untouched projected slot.

### Confirmed

- the v0.4.2 normalizer remains present in both Public and Dev source;
- it normalizes only `freshBind` records matching a hard-coded bad initializer;
- the old detector targets `v≈1.50394`, `s≈sy≈1.76859` with ±0.035 tolerance;
- current UI shows approximately `v=1.56`, `s=sy=1.82` before and after first Project OFF, so the intended normalization is not taking effect;
- Dev manifest currently points the corrected-gizmo tool URL at `Witch_Scripts`, so Dev cannot validate a Dev-only gizmo source change without correcting that entry.

### Supported inference

The current HeroForge raw initializer shifted consistently with the visible 1.56/1.82 values and therefore falls outside the old raw detector. Bridge request #752 remained unanswered during preflight, so exact current raw floats are not promoted to confirmed evidence.

### Decision

Patch only the fresh-slot initializer matcher/output. Retain the old signature, add the current observed profile with tight tolerance, and normalize first untouched bind to `h=0`, `v=0`, `s=-1.5`, `sy=-1.5`. Do not change drag transforms, history sequencing, existing transform caches, Project restoration, artwork-swap preservation, or fragment source.

### Target files

- `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`

### Conflict risks

- false-positive normalization of a user-edited projected decal near the initializer values;
- regression to validated Move/Rotate/Scale undo/redo;
- overwriting an existing known Project-OFF transform;
- Dev accidentally loading Stable source instead of the candidate.

The `freshBind` gate, neutral H/D/rotation gate, recognized-profile matcher, exact changed-file whitelist, and Dev-only URL/version identity constrain those risks.

### Live gate

1. New untouched decal: Project OFF -> H/V `0/0`, S/SY `-1.5/-1.5`.
2. Existing edited Project-OFF decal retains its transform.
3. Project ON/OFF round-trip still retains established bound transform.
4. Artwork swap while Project OFF still retains transform.
5. Move/Rotate/Scale undo/redo remain unchanged if exercised.

**Runtime behavior changed:** yes, Dev only. Public Stable unchanged.

---

"""
text = replace_once(text, "# Pre-Flight Check Log\n\n", "# Pre-Flight Check Log\n\n" + entry, "preflight header")
preflight.write_text(text, encoding="utf-8")

master = Path("MASTER.md")
text = master.read_text(encoding="utf-8")
section = """## Corrected Bound Decal Gizmo fresh-slot repair — 2026-09-08

Feature ID: `decals.gizmo.bound-correction`.

Dev candidate v1.1.1 changes only first-ever untouched Project-OFF normalization. The previous v0.4.2 detector still exists but no longer recognizes the currently visible HeroForge initializer (`Move 0/1.56/0`, `Scale 1.82/1.82/2`). The candidate retains the old confirmed profile, adds the current UI-observed profile with a tight matcher, and normalizes a matching `freshBind` to H/V `0/0` and S/SY `-1.5/-1.5`.

Move/Rotate/Scale behavior, undo/redo, known bound-state restoration, artwork-swap preservation, and fragments are unchanged. Dev now loads the gizmo from `WITCH_DEV_UI` for this gate instead of reusing the Stable URL. Exact current raw initializer floats remain unconfirmed because bridge request #752 did not return during the edit; live Dev acceptance is therefore required before Stable promotion.

"""
text = replace_once(text, "## Dev Loader Cache Repair\n", section + "## Dev Loader Cache Repair\n", "master insertion")
master.write_text(text, encoding="utf-8")

history = Path("HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md")
text = history.read_text(encoding="utf-8")
appendix = """
## 2026-09-08 fresh-slot initializer drift follow-up

A new untouched projected decal was observed at Move `0 / 1.56 / 0` and Scale `1.82 / 1.82 / 2`; first Project OFF retained those values. The maintained v1.1.0 source still contained the validated v0.4.2 fresh-slot normalizer, but its detector remained keyed to the earlier `v≈1.50394`, `s≈sy≈1.76859` profile. The current visible values fall outside that old ±0.035 envelope.

Dev v1.1.1 retains the earlier confirmed signature and adds the current UI-observed `1.56 / 1.82 / 1.82` profile with ±0.025 tolerance. Only `freshBind` plus the existing neutral H/D/rotation gate may normalize. The new sane first-bind output is `h=0`, `v=0`, `s=-1.5`, `sy=-1.5`; depth, rotation, blue scale/depth-scale (`sz`), and unrelated fields are not reset.

Exact current raw floats were not available because HF-Chat-Bridge request #752 did not return during the edit, so the second signature remains a supported inference until the Dev human gate. Do not promote this patch merely from static tests.
"""
if "## 2026-09-08 fresh-slot initializer drift follow-up" in text:
    raise SystemExit("history section already present")
history.write_text(text.rstrip() + "\n" + appendix + "\n", encoding="utf-8")

print("fresh-slot gizmo patch applied")

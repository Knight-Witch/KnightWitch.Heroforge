# Script Compatibility Diagnostic Provider v1 — Design Specification

**Provider ID:** `script-compat`  
**Provider schema version:** 1  
**Owning runtime:** read-only HeroForge seams affected by allowlisted third-party userscripts  
**Modes:** snapshot  
**Comparison mode:** none

## Purpose

Capture whether a known external HeroForge userscript's **runtime effects are actually present** after a HeroForge update.

This provider exists because some important community workflows do not belong to Witch Dock. A healthy Witch Dock loader cannot prove that a separate userscript still patched HeroForge successfully.

Initial pressure targets:
- `2000 kitbash parts` family;
- `I love extra slots` / extra-figure-slot family.

Formal product bug issue IDs may be added later.

## Ownership rule

This provider is **not** a general userscript scanner.

It may inspect only:
- allowlisted named HeroForge runtime seams;
- bounded DOM/script signature booleans needed to prove a known patch effect;
- aggregate current model counts;
- function descriptors/fingerprints without exporting source.

It must not enumerate Tampermonkey data, browser extensions, arbitrary page scripts, or unrelated third-party globals.

Witch Dock must not require these scripts to be installed.

## Reference effects

### 2000 Kitbash Parts family

The inspected reference implementation attempts to:
- set `CK.Settings.kitPartCap = 5000`;
- set `CK.Settings.kitMinScale = -100`;
- set `CK.Settings.kitMaxScale = 100`;
- replace `CK.KitData.capKit` with a locked no-op;
- inject a modified HeroForge `extras.js` whose kit loops are expanded to 5000 and whose heat/cap check is bypassed.

These are reference signatures only. Do **not** claim the script is installed solely because one scalar matches.

### Extra Slots family

The inspected reference implementation attempts to:
- replace `CK.Options.doesConfigFit`;
- set every existing slot with a truthy `allowMonsters` value to `3`.

Report effect health, not assumed script identity.

## Immediate freeze

### `state`

- HeroForge art/runtime version;
- `CK.Settings`, `CK.KitData`, `CK.Options` availability;
- current figure count;
- provider limitations.

### `kitbash`

Settings:
- `kitPartCap`;
- `kitPartMaxPercent`;
- `kitPartMinPercent`;
- `kitMinScale`;
- `kitMaxScale`.

Named seam fingerprints:
- `CK.KitData.capKit` presence;
- property descriptor flags when available;
- function name/arity;
- function source length + deterministic hash only;
- same bounded fingerprint for `getKitPartHeat` and named kit-data seams useful on the current HeroForge build.

Read-only live facts:
- zero-argument `getKitPartHeat()` result when observational;
- call success/error;
- per-figure count of own kit records;
- highest numeric `k_N` index;
- hole count/range summary;
- total kit records across figures.

Do not include part IDs or transforms.

### `kitbash-patch-signatures`

Because the reference script injects a modified inline `extras.js` without a stable public global, bounded source-pattern verification is allowed:
- page script count scanned;
- inline candidate count;
- known expanded-loop signature present yes/no;
- known cap-bypass signature present yes/no when a robust pattern exists;
- scan truncated yes/no.

Never export inline script contents. Pattern checks return booleans/counts only.

If HeroForge minification changes make a pattern unverifiable, report **unverified**, not failed.

### `extra-slots`

- `CK.Options.doesConfigFit` presence;
- property descriptor flags;
- function name/arity/source-length/source-hash only;
- total slot definitions;
- count with `allowMonsters`;
- histogram of `allowMonsters` values;
- count with value `3`;
- max/min positive `allowMonsters`;
- count with `allowMonstersMin`;
- current figure/child count aggregate.

Do not dump complete `CK.Options.slots`.

## Deterministic summary

- HeroForge art version;
- kitbash current record count;
- current heat result/status;
- configured kitPartCap;
- configured scale min/max;
- capKit seam fingerprint present;
- expanded-extras patch signature: present / absent / unverified;
- kitbash override health: complete / partial / absent / indeterminate;
- slot count;
- allowMonsters histogram;
- doesConfigFit fingerprint present;
- extra-slot override health: complete / partial / absent / indeterminate;
- warning codes.

## Health classification

### Kitbash override

`complete` requires all verifiable reference effects that are still meaningful on the current HeroForge build.

`partial` means some expected effects are present and some verifiably are not.

`absent` means no expected effect is detected.

`indeterminate` means HeroForge changed enough that the old effect cannot be tested reliably.

A scalar such as `kitPartCap=5000` alone is insufficient for `complete`.

### Extra slots

`complete` requires both expected `doesConfigFit` override evidence and all applicable current slots reporting the expected expanded `allowMonsters` value.

If HeroForge introduces new slot semantics, classify partial/indeterminate rather than rewriting slot state.

## Warning/error codes

- `SCRIPT_COMPAT_HF_SEAM_CHANGED`
- `SCRIPT_COMPAT_KITBASH_OVERRIDE_PARTIAL`
- `SCRIPT_COMPAT_KITBASH_OVERRIDE_ABSENT`
- `SCRIPT_COMPAT_KITBASH_EXTRAS_PATCH_UNVERIFIED`
- `SCRIPT_COMPAT_KITBASH_HEAT_READ_FAILED`
- `SCRIPT_COMPAT_KITBASH_COUNT_LIMIT_MISMATCH`
- `SCRIPT_COMPAT_EXTRA_SLOTS_OVERRIDE_PARTIAL`
- `SCRIPT_COMPAT_EXTRA_SLOTS_OVERRIDE_ABSENT`

Do not warn merely because an external script is not installed unless the user explicitly selected this provider.

## Privacy exclusions

Never capture:
- raw character JSON;
- kitbash part IDs;
- kitbash transforms;
- full `CK.Options` tables;
- full function source;
- full inline script source;
- userscript-manager inventory;
- browser extension inventory;
- account/session/auth data.

## Non-mutating rule

Snapshot may not:
- call `capKit`;
- add/remove kitbash parts;
- change limits;
- invoke `doesConfigFit` with synthetic configurations;
- rewrite/reinject `extras.js`;
- change slot values;
- load/reload a character.

The zero-argument `getKitPartHeat()` read is permitted only while source/runtime validation shows it is observational; otherwise mark unavailable.

## Pressure case: high-kitbash load regression

For a report such as “models above roughly 375% kitbash no longer load,” one capture should tell triage:
1. HeroForge build/art version;
2. how many kit records the runtime exposes;
3. current heat value if safely readable;
4. configured cap/percent/scale values;
5. whether `capKit` still has the expected override fingerprint;
6. whether the modified-extras signature appears loaded;
7. whether the model count exceeds any currently observed effective boundary;
8. whether extra-slot overrides are independently healthy.

This distinguishes a model-size/heat limit change from a userscript patch-anchor failure without Witch Dock owning the external script.

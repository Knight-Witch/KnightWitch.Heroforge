# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-14-069 -- Texture Quality notice v0.2.1 FRD warning/assets candidate

Date: 2026-09-14

### Scope

Change only the Dev Texture Quality beta notice presentation/copy and add the two user-provided visual assets it now references. Do not alter Texture Quality service/UI behavior or public Stable.

### Reviewed

- binding `PROJECT_CONTRACT.md`, current `ACTIVE_CONTEXT.md`, and `MODULE_VERSIONING.md`;
- current Dev notice v0.2.0 / build `0.2.0-expanded-release-copy`;
- current notice registry/cache-key wiring in `manifest.json`;
- Amanda's FRD settings screenshot and white emblem asset;
- requested `FRD/T` -> `FRD` wording change, dual warning emoji header, centered screenshot, punctuation cleanup, and centered emblem sign-off.

### Version / candidate

- notice canonical/source version: v0.2.1;
- build: `0.2.1-frd-warning-assets-signoff`;
- PATCH bump because this is a focused presentation/copy/asset refinement of the v0.2 release-review notice;
- public Texture Quality service v0.3.4 and UI v0.2.0 are not modified.

### Asset identity

- FRD visual guide blob: `b968a8d622e95ac1b1a42e397731e4be79c0c84d`, verified against local Git hash of the lossless WebP conversion;
- white sign-off emblem blob: `0615e1d888820677d60332618b6cca918a68b26a`, verified against local Git hash of the compact lossless WebP conversion;
- both assets are display-only and the popup hides a failed image load rather than failing the notice.

### Static gate

- `node --check` passes on exact notice candidate blob `9c575825179a97e0682caab3f508a21b512bf6ce`;
- candidate manifest parses as JSON with 24 unique module registry IDs and 21 unique tool IDs;
- candidate notice registry/version/cache key all agree on v0.2.1 / `0.2.1-frd-warning-assets-signoff`;
- reconstructing the previous notice metadata/cache key from the candidate reproduces prior manifest blob `385738a55cc9dab62c1f5082a6021cd4a2c9f199` exactly.

### Live gate

Hot-load the exact committed Dev notice through HF-Chat-Bridge while preserving Amanda's acknowledgement state. Confirm v0.2.1/build identity, warning callout text, both `⚠️` markers, centered FRD guide image, centered emblem, and `Hell Yeah!` button are present. Amanda remains the subjective visual/copy gate.

Do not promote the notice to `Witch_Scripts` until she explicitly approves it.

**Runtime behavior changed:** yes -- Dev-only beta notice UI/copy/assets. No Texture Quality engine/service behavior and no Stable runtime changes.

---

## PFC-2026-09-14-068 -- Texture Quality beta notice v0.2.0 visual-review candidate

Date: 2026-09-14

### Scope

Change only the Dev Texture Quality beta notice presentation/copy plus its canonical manifest version/cache key and required rolling documentation/router records. Do not alter Texture Quality service/UI behavior or public Stable.

### Reviewed

- binding `PROJECT_CONTRACT.md` and current `ACTIVE_CONTEXT.md`;
- `MODULE_VERSIONING.md`;
- current Dev notice v0.1.2 / build `0.1.2-centered-sleek-title`;
- current `manifest.json` notice registry entry and loader URL;
- Amanda's requested release-copy hierarchy, nested text sizing, header/divider treatment, and confirmation-label change.

### Version / candidate

- notice canonical/source version: v0.2.0;
- build: `0.2.0-expanded-release-copy`;
- version bump is MINOR because this is a meaningful notice UI/copy expansion;
- public Texture Quality service v0.3.4 and UI v0.2.0 are not modified.

### Static gate

- `node --check` passes on `Texture_Quality_Beta_Notice.js`;
- candidate manifest parses as JSON;
- module and tool IDs remain unique;
- reconstructing the pre-change manifest from the candidate exactly reproduces blob `39daa7fb06e2a65415f5be131ef92f7762bf6f25`, proving the manifest delta is limited to the notice registry metadata and its Dev cache-keyed URL.

### Live gate

Hot-load the exact committed Dev notice through HF-Chat-Bridge with acknowledgement state preserved. Confirm the overlay, title, and `Hell Yeah!` button are visible, then leave subjective layout/copy acceptance to Amanda. Do not promote the notice to `Witch_Scripts` until she approves it.

**Runtime behavior changed:** yes -- Dev-only beta notice UI/copy. No Texture Quality engine/service behavior changes and no Stable runtime changes.

---

## PFC-2026-09-14-067 -- Stable promotion handoff

Date: 2026-09-14

### Scope

Prepare a fresh-chat handoff for the public Texture Quality update after Dev acceptance. This record is documentation-only; it does not alter runtime code, manifests, module versions, or `Witch_Scripts`.

### Confirmed release state

- WITCH_DEV_UI Texture Quality service v0.3.4 / `0.3.4-dev-native-color-material-setup` is accepted;
- UI v0.2.0 / `0.2.0-dev-persistence-advanced-controls` is the accepted Dev UI state;
- committed-source smoke, repeated Enable/Disable, dynamic multi-figure add/remove, shared-Part restore, non-primary material preservation, Seya visual validation, and the 1030% three-detailed-figure stress gate all passed;
- the heavy scene demonstrated valid native pressure scaling to the 1024px High Res floor without visible degradation;
- current Stable remains unchanged at `Witch_Scripts` head `c93485d741fe9d1801b0f6924b7204a8d922792c` with last Texture Quality runtime promotion commit `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`.

### Approval and next-chat procedure

Amanda explicitly approved beginning the public-update phase in the next chat.

1. Read `PROJECT_CONTRACT.md` and `ACTIVE_CONTEXT.md` first.
2. Read `MODULE_VERSIONING.md` before any runtime/version write.
3. Reconfirm Dev and Stable branch heads.
4. Compare only the exact Texture Quality service/UI files and required manifest registry/cache wiring between WITCH_DEV_UI and Witch_Scripts.
5. Build the smallest complete promotion; do not merge the Dev branch wholesale.
6. Preserve unrelated Stable behavior and all validated ownership/timing semantics.
7. Run syntax/static checks before moving Stable.
8. Update release changelog/preflight records with the promotion commit.
9. Load actual Witch_Scripts Stable and run a narrow HF-Chat-Bridge smoke; diagnose any mismatch instead of broadening scope.

### Deferred boundary

Ultra-heavy / "insanity mode" is not part of this release. It begins only if a targeted allocation falls below the validated 1024px High Res floor or a verified state is still visibly degraded.

**Runtime behavior changed:** no -- documentation-only handoff.

---

## PFC-2026-09-14-066 -- Multi-figure stress acceptance

Exact committed v0.3.4 passed Seya non-primary visual validation and a 1030% three-detailed-figure stress test. One pressured extra used the intentional 1024px High Res body floor while other headline targets promoted to 2048px; human visual quality passed. Heavy Disable/restore and final re-enable also passed.

---

## PFC-2026-09-14-065 -- Native color-material refresh

v0.3.4 fixed shared-Part color-bake material refresh by invoking HeroForge-owned `setupMaterials('color')` after policy install and during restore. Candidate, committed-source smoke, and Seya visual gate passed.

---

## PFC-2026-09-14-064 -- Shared-Part snapshot ownership

v0.3.3 deduplicated Part snapshots by object identity and passed repeated Enable/Disable plus dynamic membership validation.

---

## Prior current preflight

PFC-2026-09-13-063 and earlier detailed entries remain preserved in Git history.

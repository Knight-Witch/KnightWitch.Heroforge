# Active Context - WITCH_DEV_UI

**Updated:** 2026-09-14
**Current task:** Texture Quality beta announcement popup visual/copy review in Dev.
**Runtime posture:** Public Stable Texture Quality rollout is complete and accepted. Stable runtime promotion landed at `d2470ee7d1fbfe052326937a9ba9468ff5339fbf`; documentation closeout head is `38dbf8dc3d69c9ec6ab55f09f9a9185bd4b6d429`.
**Dev notice posture:** Texture Quality service v0.3.4 / UI v0.2.0 remain accepted and unchanged. Only the beta notice and its display assets are under current review.

## Minimum continuation set

Read only:

1. `PROJECT_CONTRACT.md`
2. this file
3. `MODULE_VERSIONING.md` before any notice runtime/version change
4. `features/rendering/Texture_Quality_Beta_Notice.js`
5. `manifest.json` for the notice registry/cache-key entry
6. `CHANGELOG.md` and `PRE_FLIGHT_Check.md` only when committing notice changes
7. `features/rendering/assets/Texture_Quality_FRD_Decal_Resolution.webp` and `features/rendering/assets/Witch_Dock_Emblem_White.webp` only when the current popup review needs their visual identity

Do not reopen the completed Texture Quality engine/multi-figure investigation, Compatibility history, MASTER, session logs, or unrelated Witch Dock modules.

## Protected accepted state

Do not change the accepted Texture Quality service/UI while working on the announcement popup:

- service v0.3.4 / build `0.3.4-dev-native-color-material-setup`;
- UI v0.2.0 / build `0.2.0-dev-persistence-advanced-controls`;
- persistence, three-figure handling, shared-Part restore, color-mask material refresh, and the validated 1024px floor / native promotion behavior are closed PASS;
- public Stable is already released and must not be used for popup experimentation.

## Current notice target

Dev beta notice target: v0.2.1 / build `0.2.1-frd-warning-assets-signoff`.

Current requested presentation includes:

- expanded release-capability bullets;
- normal-size nested bullets under “Acheive higher-quality”;
- smaller second-tier explanatory bullets elsewhere, especially under Important;
- larger section headers with subtle dividers;
- validated three-figure and ~1000% kitbash language;
- explicit 4+ and more-extreme coverage marked untested/future;
- a high-visibility FRD compatibility warning with `⚠️` on both sides of the header;
- terminology `FRD` rather than `FRD/T` in the live popup;
- a centered screenshot showing the three FRD Decal Resolution toggles to disable;
- normalized sentence-ending punctuation;
- the white Knight Witch emblem centered below the Discord line as a sign-off;
- confirmation button text `Hell Yeah!`.

## Next gate

Hot-load the exact committed Dev v0.2.1 notice through HF-Chat-Bridge while preserving the user's acknowledgement state. Amanda is the visual/copy gate. Iterate only this notice/assets in Dev until she explicitly approves it; do not promote the notice to Stable before that approval.

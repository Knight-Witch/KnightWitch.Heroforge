# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-14-071 -- Smart active-decal texture priority Dev candidate

Date: 2026-09-14

### Scope

Dev-only Texture Quality candidate. Preserve the accepted service/UI lifecycle while correcting the source-floor assignment and adding an isolated adaptive policy for accessory parts that actually carry decals.

### Confirmed investigation evidence

- Current HeroForge exposes actual per-figure applied decal slots through `figureData.decals`; the current heavy primary figure has six part-backed used slots (`bodyLower`, `bodyUpper`, `face`, `k_6`, `k_7`, `k_9`) versus 37 parts that merely support decals.
- `k_9` (`clothVDress`) has a 2048 baked ceiling but was allocated 1024×1024 under the prior body-only policy.
- Increasing only the atlas ceiling to 8192×8192 did not improve `k_9`; its scale-1 target remained 1024.
- Selectively setting scale 4 on actual used decal slots promoted `k_9` to used=2048 and allocation=2048×2048 with Texture Quality verification PASS.
- Returning the ceiling to 8192×4096 while retaining that selective scale policy kept `k_9` at 2048×2048 with verification PASS. A square 8K atlas is therefore unnecessary for this validated heavy figure.
- Bridge evidence: #2310-#2313 (8K-square ceiling alone), #2314-#2318 (selective active-decal scale 4), #2319-#2320 (8192×4096 optimization PASS).

### Candidate validation

- `Texture_Quality_Native_Reconcile.js` v0.3.5 source-floor patch preserves native `_usedTextureSize` above the protected 1024 minimum, clamped to the existing 2048 ceiling.
- `Texture_Quality_Active_Decal_Priority.js` v0.1.0 is an isolated hidden service; `node --check` passes.
- The policy uses named HeroForge seams (`character.data.decals`, `atlasScale`, `CK.Settings`) and does not depend on HF-Chat-Bridge at runtime.
- The policy snapshots only settings/slots it owns, restores removed/stale accessory slots, restores only atlas maxima it actually changed, avoids policy mutation while the core service is busy, and conservatively refuses to overwrite later outside changes during restore.
- Unknown hardware capability fails closed: if a reliable WebGL texture limit cannot be read, the module does not raise HeroForge's existing atlas maxima.
- Dynamic changes mark the policy dirty and retry the core reconcile after transient busy races instead of silently losing the required rebuild.
- Manifest candidate parses; module/tool IDs are unique; load order is core Texture Quality service -> active-decal policy -> existing Texture Quality UI.
- Existing Texture Quality UI v0.2.0 is unchanged; its existing 250ms service refresh loop supplies the dynamic add/remove observation cadence without adding a second polling loop.

### Next gate

Commit this exact Dev candidate atomically, hot-load the committed service + active-decal policy, verify provenance/state through the Bridge, then run the narrow live regression: current heavy figure, decal add/remove behavior, figure lifecycle, disable/restore, and human visual confirmation where useful. Do not promote to Stable before that gate passes.

The proposed broader all-object texture-quality toggle is explicitly deferred to a separate follow-on after this targeted path is validated.

**Runtime behavior changed:** yes -- Dev only.

---

## PFC-2026-09-14-070 -- Texture Quality beta notice public closeout

Date: 2026-09-14

### Scope

Documentation/router closeout only after the approved Dev Texture Quality Phase 1 notice was promoted and validated on public Stable. No module source, manifest, version, or runtime behavior changes in this Dev commit.

### Confirmed release evidence

- approved Dev notice commit: `bb73e05fcf8ff9f920fb6171d7777d84466c221b`;
- notice v0.2.1 / build `0.2.1-frd-warning-assets-signoff`;
- public notice promotion: `2e8662d9d55322aac0d64c67a279052e7de6df77`;
- public Stable closeout: `dcf53166a12321cc5bbe1d94133c3d1d29655e59`;
- Bridge #2215 hot-loaded the exact `Witch_Scripts` notice with acknowledgement state preserved;
- Bridge #2216 confirmed `Witch_Scripts/manifest.json` provenance, v0.2.1/build identity, visible popup, dual-warning FRD header, centered public FRD guide, centered public emblem, visible `Hell Yeah!` button, Power `complete`, and no Power error;
- both public image sources resolve from `Witch_Scripts/features/rendering/assets`;
- Amanda had already passed the subjective visual gate on the committed Dev candidate.

### Router decision

Texture Quality engine/service/UI and the Phase 1 public announcement are closed PASS. `ACTIVE_CONTEXT.md` no longer routes future chats into the completed popup review. Ultra-heavy Texture Quality testing remains a separate deferred phase.

**Runtime behavior changed:** no -- documentation/router only.

---

## PFC-2026-09-14-069 -- Texture Quality notice v0.2.1 FRD warning/assets candidate

Exact committed Dev v0.2.1 passed static validation and Bridge hot-load/readback; Amanda visually approved its FRD warning, centered guide, emblem sign-off, punctuation, and button before public promotion.

---

## Prior current preflight

PFC-2026-09-14-068 and earlier detailed records remain preserved in Git history.

# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

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

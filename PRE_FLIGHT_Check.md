# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-12-051 — Compact governance + Texture Quality handoff

Date: 2026-09-12

### Scope

Documentation/governance only. Establish the same low-context startup model already working well in HeroForge.Compatibility and hand the completed Texture Quality release into its next Witch Dock-owned product decision.

### Reviewed

- current WITCH_DEV_UI head `c8f8000d9562dbc315dc867af655358177e18d54`;
- current public Stable Texture Quality release/acceptance at `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`;
- current `MASTER.md`, `CHANGELOG.md`, `PRE_FLIGHT_Check.md`, `MODULE_VERSIONING.md`, Texture Quality service/UI, and Texture Quality history record;
- Stable Bridge evidence #1747, #1748, #1750 and Amanda's final public visual PASS;
- existing HeroForge.Compatibility contract/router model and Bridge operating rules.

### Confirmed state to preserve

- public Texture Quality v0.1.0 is released and accepted;
- same-figure native renderer refresh preserves ON;
- HeroForge figure change clears stale session bookkeeping OFF;
- page reload creates a fresh service OFF/inert;
- no persistent user preference exists in v0.1.0;
- no stale session/snapshot/mask/display/modded/atlas object may be carried across figures;
- public runtime has no HeroForge.Compatibility or HF-Chat-Bridge dependency;
- development still proceeds in `WITCH_DEV_UI` before any Stable update.

### Governance decision

Create:

- `PROJECT_CONTRACT.md` — binding repo-wide development/release rules;
- `ACTIVE_CONTEXT.md` — tiny current-task router;
- `CHATGPT_PROJECT_INSTRUCTIONS.md` — paste-ready project rules.

Compact:

- `MASTER.md` into a repo/status index;
- `CHANGELOG.md` and this preflight log into rolling current records;
- Texture Quality history into a durable current architecture/release/follow-up record.

Large history/session/reference files become opt-in only. HF-Chat-Bridge becomes the explicit normal development control plane; Amanda should not be used as the probe middleman when the Bridge can do the work.

### Next gate

The next chat should read only `PROJECT_CONTRACT.md` + `ACTIVE_CONTEXT.md` initially, then let Amanda give her already-prepared response to the proposed persistent desired-preference behavior. Do not implement persistence before that response.

If persistence is approved, implementation must be Dev-only first and should persist user intent—not old renderer/session state—then establish a fresh safe session after page/figure readiness.

### Risk

This commit intentionally changes documentation shape and startup procedure but no runtime behavior. Historical detail remains recoverable from Git history and targeted `HISTORY/` files.

**Runtime behavior changed:** no. No JavaScript, manifest, module version, delivery URL, or Stable behavior changes.

---

## Prior current preflight

PFC-2026-09-12-050 and earlier remain preserved in Git history at `c8f8000d9562dbc315dc867af655358177e18d54` and ancestors. Fetch only when a current task needs their specific evidence.
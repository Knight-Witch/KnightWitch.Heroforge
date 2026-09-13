# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-12-052 — Texture Quality persistence Dev implementation

Date: 2026-09-12

### Scope

Dev-only implementation of the approved Persistent High Res preference and Advanced reconcile UI. No Stable mutation.

### Confirmed design boundary

- first-time/default preference remains OFF;
- Persistent stores only a boolean desired preference;
- each page/figure still resolves fresh HeroForge capabilities, parts, masks, display/modded generations, and snapshots;
- old figure sessions are discarded, never restored into a replacement figure;
- automatic enable waits for renderer readiness, is single-flight, and is bounded to one failed automatic attempt per current figure identity;
- manual Disable with Persistent checked is a non-persisted page-session suppression; manual Enable clears it; reload clears it naturally;
- unchecking Persistent disables future automatic behavior but does not forcibly tear down an already-active High Res session;
- `Reconcile Now` remains available as a user recovery action but is collapsed under the in-tool `Advanced` section.

### Version/static checks

- `texture-quality-native-reconcile`: v0.2.0 / `0.2.0-dev-persistent-preference`;
- `texture-quality-native-reconcile-ui`: v0.2.0 / `0.2.0-dev-persistence-advanced-controls`;
- `manifest.json.moduleRegistry` and Dev cache-key URLs updated consistently;
- `node --check` passes for both changed JavaScript modules;
- `manifest.json` parses successfully.

### Protected behavior

The validated v0.1.0 source-policy/reconcile/settle/verify/restore path is otherwise unchanged: native HeroForge atlas ownership, exact 1024 body-mask pinning, generation adoption, and stale-state refusal remain the governing runtime contract.

### Next gate

Use HF-Chat-Bridge on live `WITCH_DEV_UI` to verify: default OFF, persistence toggle immediate enable, reload persistence, figure-change fresh-session re-enable, temporary Disable suppression, manual re-enable, persistence-off behavior, atlas/mask verification, and no Booth/runtime regression. Amanda then gives the visual/UX gate.

**Runtime behavior changed:** yes, Dev only. Public Stable remains untouched.

---

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
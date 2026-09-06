# Pre-Flight Check Log

## PFC-2026-09-06-022 — Promote validated Spinny Mini WebP to public Stable

Date: 2026-09-06

### Scope

Promote only the accepted `media.spinny-mini-webp` Witch Dock Dev delta into public `Witch_Scripts` after explicit user approval. Do not merge the diverged Dev branch wholesale.

### Required material reviewed

- binding `HeroForge.Compatibility/PROJECT_CONTRACT.md`;
- HFC `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- HFC Spinny feature specification and validated v0.5.0 architecture;
- public `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`;
- public `Witch_Dock.user.js`, `manifest.json`, and `features/media/Photo_Booth_True_Resolution.js`;
- public true-resolution history/ownership record;
- exact WITCH_DEV_UI Spinny v0.5.1 service and v0.1.1 UI that received the final integrated smoke.

### Confirmed live evidence

- standalone 1024/2048/TRUE-3K 3072 capture architecture was previously validated;
- full 3072 Standard and Slower production captures passed visual and runtime validation;
- integrated Dev placement, popout, Pause/Resume, cancel, ETA and interaction guards passed;
- final Dev hardening re-smoke: silent wheel/scroll block PASS;
- final Dev hardening re-smoke: WebP download PASS through the privileged userscript host;
- user reports all remaining integrated behavior works perfectly and explicitly approved public rollout;
- optional transient in-panel download-complete flash was not observed, but browser download confirmation and the successful privileged download boundary make it non-gating.

### Target files

- `Witch_Dock.user.js`
- `manifest.json`
- `features/media/Spinny_Mini_WebP.js` (new Stable consumer copy)
- `features/media/Spinny_Mini_WebP_UI.js` (new Stable UI host)
- `HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md` (new)
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Material conflict risks checked

- public 4096/8192 true-resolution still provider remains the owner of its existing `BT.maker.takeScreenshot` wrapper;
- Spinny does not replace that owner and 3072 operates below it at the bounded Effects seam;
- public shell change is limited to the tested `GM_download` host plus v1.1.0 metadata;
- Short Test remains hidden because public Stable does not promote Developer Mode;
- compact High Res UI, Developer Mode, module registry and unrelated Dev ordering changes are excluded;
- 4096 animated WebP remains deferred;
- no HF-Chat-Bridge or unstable HFC runtime dependency is introduced.

### Decision

Approved for a narrow Stable promotion candidate. Require syntax/manifest/static ownership checks before advancing `Witch_Scripts`.

**Runtime behavior changed:** yes — public v1.1.0 adds Spinny Mini WebP and the tested privileged download host.

---

Use this file before repo updates to record what was checked, what could conflict, and what action is recommended.

## PFC-2026-09-05-021 — Record public Photo Booth smoke acceptance

Date: 2026-09-05

### Target files

- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Required material reviewed

- current public `Witch_Scripts` promotion commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`
- current public Photo Booth true-resolution feature record
- current public `MASTER.md`, `PRE_FLIGHT_Check.md`, and `CHANGELOG.md`
- Amanda's clean public smoke result after disabling temporary standalone/Dev test scripts

### Confirmed findings

- The public readiness adapter fixed the initial Dev caveat: Witch Dock's direct TRUE 4K/TRUE 8K buttons became usable without cycling the repair toggle.
- Public HeroForge/Lob 4096 capture through Witch Dock passed perfectly.
- Public HeroForge/Lob 8192 grouped capture through Witch Dock passed perfectly.
- Public Witch Dock direct TRUE 4K capture passed perfectly.
- Public Witch Dock direct TRUE 8K capture passed perfectly.
- Amanda reported the public integration works perfectly.
- No runtime defect was reported in the promoted capture provider or readiness adapter.

### Material conflict risks

- This checkpoint must not change capture code, manifest delivery, Lob/ADP, Persistent Booth, or unrelated Witch Dock modules.
- Do not reintroduce one-shot 8192 Effects rendering.
- Lob-absent injection into HeroForge's own resolution selector remains a separate future adapter and is not required to close the Stable capture gate.

### Recommended action

Record the clean public acceptance as a documentation-only checkpoint. Mark `media.screenshot-resolution` as Witch Dock Stable validated and remove the completed public-smoke item from the near-term queue.

**Runtime behavior changed:** no.

---

Historical pre-flight records through PFC-2026-09-05-020 remain preserved in Git history at and before public promotion commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.

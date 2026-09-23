# Issue #24 — Texture Quality Regression Investigation Plan

**Status:** ACTIVE / ready for Work execution  
**Repository:** `Knight-Witch/KnightWitch.Heroforge`  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Primary issue:** #24  
**Follow-up coverage issue:** #25  
**External-script side investigation:** #29 (LOW; must not block #24)

## Objective

Classify and fix the submitted High Res body regressions with the smallest evidence-driven change possible.

Do **not** begin by redesigning Texture Quality. The existing body/decal native-reconcile architecture is validated and remains protected until current runtime evidence proves the fault is inside that architecture.

The primary questions are:

1. Does High Res mutate/remap HeroForge paint/channel data?
2. Does it preserve model paint data but feed the rebake the wrong mask/channel inputs?
3. Are the atlas inputs correct but the wrong/stale display/material generation shown?
4. Is the enable path correct while the **ON -> OFF** native restore/reconcile path is wrong?
5. Are reported decal/atlas shifts deterministic or an unrelated/unreproduced secondary issue?

## Startup / isolation

Read only:

1. `PROJECT_CONTRACT.md`
2. `ACTIVE_CONTEXT.md`
3. issue #24
4. this plan

Do **not** preload Texture Quality history. Consult `Knight-Witch/HeroForge.Compatibility` branch `feature/rendering-texture-quality` only if a live finding requires unresolved engine evidence or a validated prior implementation.

Primary reproduction should run with:
- canonical Witch Dock Dev active;
- public Stable disabled;
- legacy standalone Texture Quality scripts disabled;
- Lob High Res Decals disabled;
- Lob Core Tweaks disabled during #24 isolation if it is present, because its known console flood is tracked separately in #29.

Use HF-Chat-Bridge for all runtime reads, navigation, bounded reversible probes, and verification. Amanda should only be asked for Tampermonkey switching or subjective visual confirmation when Bridge cannot provide it.

## Work interruption / usage-efficiency discipline

This investigation is structured to survive interruptions without repeating expensive fixture work.

### Bounded phases

Execute in this order and write a compact durable checkpoint after each completed phase, then continue automatically:

1. Robot + Human baseline/classification.
2. Canine + Half Dragon confirmation.
3. AAT75R real-user validation.
4. Lob ON -> OFF restore investigation.
5. Cross-figure Lob atlas/decal case only if still needed.
6. Implementation + targeted regression if evidence warrants a Witch Dock change.

A checkpoint is not a request to stop or ask Amanda to continue.

### Compact checkpoint contents

Record only:
- fixtures completed;
- exact current Dev commit/build;
- first bad transition per fixture;
- decisive field diffs;
- current ownership/root-cause classification;
- any issue branch/commit created;
- exact next unfinished step.

Do not paste full Bridge responses, giant HeroForge objects, duplicate console output, or repetitive screenshots into the durable record.

### Resume rule after interruption

If Work is interrupted, times out, or resumes in another turn:
- read `PROJECT_CONTRACT.md`, `ACTIVE_CONTEXT.md`, this plan, and the latest durable #24 checkpoint;
- resume from the first unfinished phase;
- do not repeat completed fixtures or probes just to reconstruct context;
- if any mutation has uncertain execution state, read back live state before retrying;
- never blindly replay a Bridge mutation.

### Efficiency rules

- Reuse one compact Bridge diagnostic snapshot across fixtures.
- After the first full baseline, prefer hashes/diffs and changed keys over repeated complete objects.
- Capture the first distinct error signature/stack, then deduplicate repeats.
- Do not preload old Texture Quality history, unrelated issues, or Compatibility docs.
- Do not run #25 coverage/performance sweeps during #24 unless one specific host is required to explain #24.
- Do not escalate reasoning mode merely because the fixture matrix is long; escalate only for genuinely ambiguous causal evidence or an unresolved renderer seam.
- Do not spend separate turns on routine progress narration. Persist the checkpoint and keep working.

## HF-Chat-Bridge access model — binding for Work

HF-Chat-Bridge is **not** a ChatGPT plugin/connector and will not appear in Work's callable-tool or plugin inventory.

The transport is:

`Work / authorized development chat -> GitHub issues in Knight-Witch/HF-Chat-Bridge -> local relay -> HeroForge Bridge userscript -> live authenticated HeroForge page`

Therefore:

- GitHub access to `Knight-Witch/HF-Chat-Bridge` is the required Work-side transport capability.
- Do **not** search the plugin/connector directory for HF-Chat-Bridge.
- Do **not** stop because there is no tool literally named HF-Chat-Bridge.
- Use GitHub to create/read Bridge request/result mailbox issues using the existing protocol/pattern.
- A Bridge transport failure must be established by an actual mailbox request/result failure, not by absence from the connector list.

Live proof before this Work pass:
- Bridge request issue: `Knight-Witch/HF-Chat-Bridge#3049`
- request: `bridge.ping` / `hf-20260922-wd24-bridge-proof-001`
- result: SUCCESS
- Bridge v0.4.0
- `pageContextAvailable: true`
- `devWritesEnabled: true`
- `workbench: true`
- request pump running with zero consecutive errors

If a later Work run suspects Bridge failure:
1. issue one narrow fresh `bridge.ping` through the GitHub mailbox;
2. read the returned issue comment/result;
3. classify transport health from that actual round trip;
4. only stop for external access if the mailbox itself cannot be used or the live ping fails in a way that cannot be recovered safely.

Do not substitute cloud-browser HeroForge state for Amanda's authenticated local runtime.

## Background / visibility handling — do not make Amanda babysit the tab

HF-Chat-Bridge is validated for background operation. Another desktop application (for example Discord) having OS focus is **not** a Bridge blocker and is not a reason to ask Amanda to foreground HeroForge.

Interpret `document.visibilityState` narrowly:
- `visible` / `hidden` is browser document visibility state, not equivalent to OS foreground focus;
- a hidden state may occur when another browser tab is selected or the browser/minimized page is considered non-visible;
- it is a diagnostic input for HeroForge/native renderer scheduling, not proof that Bridge transport failed.

Current evidence:
- Work observed a transient Human-B stall while the document reported `hidden`;
- the explicit High Res enable eventually terminalized as a timeout and rolled back;
- a later Bridge readback while Amanda continued using Discord showed a coherent native state: `_needsUpdating=false`, `_inUpdate=false`, display/resource atlases equal at 4096x2048;
- a live timing probe through `HF-Chat-Bridge#3109` while Amanda remained in Discord reported `visibility=visible`, `hidden=false`, and 177 `requestAnimationFrame` callbacks over ~3.5 s.

Therefore:
- do **not** stop merely because a readback reports `visibilityState=hidden`;
- do **not** ask Amanda to foreground HeroForge merely because another desktop app has focus;
- continue with bounded readbacks and classify whether the native HeroForge transition itself is stalled, terminal, rolled back, or later recovered;
- if a mutation terminalizes and live state is known/coherent, record the result and continue from that known state;
- only request a visibility/tab-selection action if a controlled test specifically requires comparing visible-vs-hidden renderer behavior and that comparison cannot be performed safely through Bridge;
- human visual confirmation remains a valid separate reason to ask Amanda to inspect the page.

For the current Human fixture, the prior B enable request is terminal and must not be blindly replayed. Read current stable state first; any fresh logical re-test requires a new request ID and should be treated as a new controlled trial, not a retry of the uncertain request.

## Stop-condition guard

Do not stop for a guessed blocker.

These alone are **not blockers**: no named HF-Chat-Bridge connector, another desktop app has focus, `visibilityState=hidden`, one reconcile timeout, or one stale/intermediate renderer readback.

Before stopping or asking Amanda to act:
1. read back current live state;
2. use the GitHub Bridge mailbox if the needed action/read is Bridge-capable;
3. continue from the next safe unfinished step if state is known;
4. only stop if no safe autonomous step remains.

If stopping is genuinely required, record only: the proven blocker, the live evidence, and the exact human-only action needed.

## Fixture identity rule

Use Amanda's explicit **HeroForge URL + fixture label** as the authoritative navigation identity.

Some exported JSONs were created from reused/edited test figures and can retain metadata/config IDs that do not cleanly match the label/URL currently assigned to the test. Use the JSONs as evidence for expected part/paint/channel mappings, not as the authority for which URL represents Robot vs Canine vs Humanoid.

If an embedded JSON `config_id`, `meta.character_name`, or part taxonomy conflicts with the explicit fixture list below, record the mismatch and continue with the URL/label list rather than silently relabeling the test.

## Evidence bundle / fixture order

### Tier 1 — controlled channel fixtures

Run these first because the expected result is deliberately obvious.

1. **Robot — config 59568049**
   - highest diagnostic signal;
   - roughly 40 independent upper/lower body paint assignments before the head/cranium;
   - reported High Res result collapses the body to roughly two broad visible paint regions.

2. **Human — config 59567957**
   - known channel colors:
     - Arms #ff0000
     - Torso center #000075
     - Neck center #000000
     - Palms #43ff00
     - Fingernails #0056ff
     - Pelvis/groin #00fff7
     - Legs #ff00c8
     - Bottom of feet #5100d4
     - Toenails #ff5000
     - Face/head #ffffff
     - Right ear #00ffc2
     - Left ear #7b7b7b

3. **Canine — config 59568003**
   - anthro-specific body-channel variation;
   - useful for checking whether the failure follows body part/mask layout rather than human-only naming.

4. **Half dragon — config 59568332**
   - includes independently colorable dorsal/back scale regions;
   - use to determine whether extra species channels collapse with the common upper/lower body channels.

5. **Additional humanoid — config 59567973**
   - secondary human-like variation; use after the simpler human baseline.

### Tier 2 — AAT75R real anthro reports

- config 59378943
- config 58267857
- config 57615961

AAT75R supplied High Res OFF/ON comparisons showing broad body-region paint collapse. Use these to validate any controlled-fixture finding against real user models.

### Tier 3 — Lob ON -> OFF restore drift

1. config 537006038
2. config 537004396

Reported deterministic sequence:
- initial OFF can be correct;
- initial ON can be correct;
- enabling can remain visually correct;
- **disabling after High Res has been ON** produces a darker/wrong body appearance.

This sequence is more important than the startup state. Test the transition directly.

### Tier 4 — Lob cross-figure atlas/decal shift

Exact sequence:
1. load 537006038;
2. then load 537004396;
3. repeat with High Res OFF, ON, and ON -> OFF.

Amanda has not reproduced this case. Do not prioritize it above deterministic channel collapse or restore drift, and do not claim a decal regression without reproduction.

## Reusable compact diagnostic snapshot

Do not dump giant runtime objects on every state transition. Build one bounded read-only Bridge snapshot that returns only the diagnostic fields below and reuse it for each state.

For every figure/display row capture:

### Model/channel state
- config/character identity where available;
- `parts.bodyUpper/bodyLower/face` IDs plus species-specific body part IDs relevant to the fixture;
- `data.paints` for relevant body parts;
- `paintByIntent` for relevant body parts;
- referenced shader/paint IDs only, not full shader objects unless a referenced shader changes.

### Texture policy/source state
- `atlasScale` for relevant body parts;
- part `bakeSize`;
- part `_usedTextureSize`;
- mask source path from `getMaskPath` where available;
- current `masksMapOverride` identity, dimensions, and source identity/path where inspectable.

### Atlas/display ownership
- display/modded identity handles or stable diagnostic IDs;
- atlas object identity;
- atlas width/height;
- slot allocation for relevant body parts;
- whether display atlas equals modded resource atlas;
- resource-ready/finished flags relevant to lifecycle completion.

### Witch Dock state
- `KWTextureQualityNativeReconcile.getState()`;
- service enabled/busy/persistent/sessionSuppressed;
- lastVerification;
- lastError;
- Same-Figure Drift Guard state if loaded;
- Active Decal Priority state only when the fixture actually uses decals/projected hosts.

Prefer compact hashes/diffs for `paints` and `paintByIntent` after the first full baseline snapshot. Preserve exact changed keys/values when a diff appears.

## State matrix — every controlled fixture

Capture after native settle at each step:

A. fresh load / High Res OFF  
B. enable High Res / settle  
C. disable High Res / settle  
D. native idle/rebuild after disable  
E. reload OFF only when C/D differs from A or the reporter specifically described reload recovery

For Lob restore-drift fixtures also capture:

F. fresh load with persistent High Res ON, before any manual toggle

Do not combine state transitions into an uncertain mutation. Bridge mutations are at-most-once: submit one transition, read back, then continue.

## Immediate causal decision tree

### Case 1 — `paints` or `paintByIntent` changes

Treat as model-data/channel mutation.

Inspect which current Witch Dock/native call first changes it:
- policy application;
- `data.change({})`;
- `modded.change/buildAtlas`;
- `character.refresh/update`;
- display change/update;
- disable/restore sequence.

Do not patch rendering until the first mutating owner is known.

### Case 2 — model paint data stable, mask/atlas inputs change

Treat as rebake/mask/channel-composition failure.

Compare:
- native mask path vs pinned/override mask;
- source mask dimensions/content identity;
- body part ID / mask path resolution across species;
- atlas slot allocation and body source size.

The human/robot controlled fixtures should make a wrong region mask immediately visible.

### Case 3 — model + mask/atlas inputs stable, visual output wrong

Treat as display/material-generation ownership or stale-generation behavior.

Track:
- replacement display/modded generation adoption;
- resource atlas identity;
- material map texture identity;
- whether a later native refresh fixes the appearance without changing model data.

### Case 4 — enable correct, disable wrong

Prioritize restore/native-reconcile sequencing.

The current service restores source policy and invokes native restore/rebuild. Determine whether OFF settles on:
- the original native mask/source generation;
- a replacement generation built from stale/high-res inputs;
- a correct model state with stale material texture bindings.

Do not change enable behavior unless evidence shows it is also wrong.

## Eyedropper clue

On the current channel-collapse reports, the eyedropper selects the paint that is visibly shown in the collapsed region, while the other paints remain represented in the paint UI.

That differs from the older historical visual-only color error. Treat this as a discriminator, not proof of cause.

Where feasible, compare the runtime `data.paints` / `paintByIntent` mapping to the eyedropper result. If runtime model mapping remains correct while eyedropper follows the wrong visible region, determine what HeroForge's eyedropper actually samples before concluding that character paint data mutated.

## Wings / decals

- Wings have not yet been observed failing. Do not spend primary-pass time expanding into wings unless a controlled fixture shows it.
- Amanda currently sees decals as unaffected.
- Lob's cross-figure decal/atlas shift is unconfirmed locally.
- Active Decal Priority is therefore secondary in #24 unless reproduction makes decals part of the deterministic failure.

## Core Tweaks console flood

Tracked separately as #29.

Do not count thousands of Lob Core Tweaks console errors as Witch Dock evidence. During primary #24 reproduction either disable Core Tweaks or filter it out. If #24 is otherwise blocked by those errors, capture the **first distinct** Core Tweaks stack/signature and move on; do not ingest thousands of duplicates.

## When to consult HeroForge.Compatibility

Only after the compact state matrix identifies an unresolved engine seam, for example:
- native mask path selection differs by body part/species and current source is unclear;
- native atlas builder remaps paint/channel regions in a way not observable through public runtime objects;
- restore calls have ambiguous ownership/timing after evidence capture.

At that point read only the Compatibility files directly relevant to the seam. Do not preload the full history.

## Implementation gate

Do not edit runtime code until at least Robot + Human have a classified failure, unless one of them unexpectedly does not reproduce and another deterministic fixture provides equivalent evidence.

When a Witch Dock change is warranted:
1. create a short-lived issue-scoped branch from current `WITCH_DEV_MAIN`;
2. preserve the validated native-reconcile architecture unless the evidence directly disproves it;
3. fix the smallest proven owner/seam;
4. bump module/build versions per `MODULE_VERSIONING.md`;
5. update changelog/preflight;
6. retest Robot + Human first;
7. then Canine + Half Dragon + AAT real fixtures;
8. then Lob OFF restore sequence;
9. only then test the unconfirmed cross-figure atlas/decal case.

## Required deliverable before asking Amanda to inspect

Return a compact table/result set containing:
- fixture;
- reproduced/not reproduced;
- first bad transition;
- whether `paints` changed;
- whether `paintByIntent` changed;
- whether mask input changed;
- whether atlas allocation/source changed;
- whether display/material generation changed;
- ownership classification;
- candidate fix/seam if known;
- remaining human visual question, if any.

Do not send Amanda raw console dumps or make her run probes.

## Stop/report conditions for Work

Continue autonomously until one of these occurs:

1. root cause is classified and a bounded Dev fix is implemented + automated regression is ready for human visual gate;
2. runtime evidence reaches an engine seam that requires Extra High/Max reasoning before a safe implementation;
3. HeroForge/Tampermonkey state requires a genuinely human action that Bridge cannot perform;
4. the task hits an external access/tool limit.

Do not stop merely to narrate intermediate findings. Persist useful evidence to issue #24 or a concise investigation document before stopping.

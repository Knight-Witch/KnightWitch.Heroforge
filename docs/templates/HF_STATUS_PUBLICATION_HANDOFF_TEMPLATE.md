# HF.Status Publication Handoff Template

**Purpose:** factual cross-repository handoff generated after a validated Witch Dock Stable promotion. This is engineering/product source material for HF.Status review, not public copy and not publication authorization.

Use this template after **every passing Stable smoke**, including releases where the only result is a version-truth update, an internal/silent change, or no public-facing update at all.

## Rules

- Verify the handoff from the actual `Witch_Scripts` Stable source, channel manifest, owning issue/workstream, and Stable-smoke evidence.
- Witch Dock remains authoritative for shipped Stable version/source/runtime facts. This handoff does not create a second version authority.
- Report what changed and what users actually need to know. Do not convert internal implementation names into public headlines.
- Separate user-visible facts from internal-only/refactor/build/diagnostic detail.
- Do not choose HF.Status public wording, release grouping/prominence, notification class, or final public status. HF.Status owns that reviewed projection and Amanda approves publication.
- GitHub issue state alone does not determine HF.Status public state. State only the validated Witch Dock release/status facts.
- Prefer posting the completed handoff as a durable comment on the owning release/source issue before that issue is closed. Link exact commits/PRs/payloads instead of copying development history.
- HF.Status availability is never a Witch Dock runtime dependency. If HF.Status cannot be updated immediately, leave the completed factual handoff durable in the Witch Dock source issue and mark the cross-repo publication follow-up pending.

## Handoff

### Release identity

- **Stable version:**
- **Stable launcher/source commit:**
- **Stable immutable payload:**
- **Source issue/workstream:**
- **Release type:** `patch` | `bugfix` | `feature` | `maintenance` | `mixed`

### User-visible changes

List only changes a normal Witch Dock user could notice or benefit from understanding.

- 

### User action required

Use `None` when users do not need to do anything. Otherwise state the concrete action and who needs to take it.

- **Required:** `None` | `<action>`
- **Applies to:**
- **What happens afterward:**

### Status-impacting changes

Do not infer public status from issue closure. Record only validated release facts.

- **Fixed / released:**
- **Newly broken / investigating:**
- **No status impact:** `yes` | `no`

### Install / update behavior

- **Changed:** `yes` | `no`
- **Facts users may need:**
  - 

### Candidate publication importance

This is a Witch Dock factual signal for HF.Status editorial review, not the final publication decision. Choose the closest fit:

- `important user-facing change`
- `useful but can fold into current release`
- `version truth only`
- `internal / silent`

**Reason:**

### Internal-only / omit-from-public candidates

List real shipped changes that are useful for engineering traceability but probably meaningless or noisy to users.

- 

### HF.Status feature-registry impact

Choose one and include stable IDs/follow-up when relevant:

- `registry updated`
- `no registry impact`
- `registry follow-up required`

**Details:**

### Validation

- **Stable smoke:** `PASS` | `<state>`
- **Human visual/interaction gate:** `PASS` | `N/A` | `<state>`
- **Exact evidence / PR / commit links:**
  - 

### Ownership boundary

Witch Dock supplies verified Stable/runtime facts through this handoff. HF.Status owns public wording, update grouping/prominence, notification class, and the reviewed public projection. Amanda's approval is required before HF.Status publishes or materially changes reviewed public release/status copy.

# Task Mode Router

Purpose: keep model/mode selection proportional to the current Witch Dock task without re-evaluating it on every message.

## Default

Use **Chat / Sol High** unless a checkpoint below says otherwise. Do not recommend switching merely because a task is long or technical.

## Checkpoints

Evaluate mode only when one of these occurs:

1. the active GitHub issue/task changes;
2. the task moves into a materially different phase, e.g. discovery -> architecture -> repetitive fixture validation -> implementation -> final release review;
3. two evidence/diagnostic passes leave multiple plausible causal models unresolved;
4. work becomes a large repetitive multi-fixture / multi-app workflow that would benefit from autonomous execution;
5. unresolved HeroForge/minified-engine behavior becomes the primary blocker;
6. a final high-risk architecture or Stable-release review is beginning;
7. Amanda explicitly asks for a mode check.

Do **not** re-check on ordinary follow-up messages, routine edits, version bumps, normal Bridge reads, or each regression step.

When a checkpoint fires, compare the current mode to this file. Mention a switch only if it would materially improve the task. Otherwise continue silently.

## Mode meanings

- **Chat / Sol High** — default implementation, bounded diagnosis, ordinary code review, UI/CSS, manifests/versioning, GitHub bookkeeping, narrow Bridge regression.
- **Work / High** — long-running autonomous workflows with many files/apps/fixtures or repeated investigate -> test -> record cycles. Use for throughput, not because the reasoning itself is unusually hard.
- **Extra High** — ambiguous causal diagnosis, cross-system regressions, architecture decisions, undocumented ownership/lifecycle questions, or evidence that supports several plausible models.
- **Max / top reasoning** — reserve for unresolved engine reconstruction, nasty nondeterministic multi-layer failures after evidence collection, or final adversarial architecture/release review where a wrong conclusion is unusually expensive.

Prefer **evidence first, reasoning escalation second**. Max does not replace missing runtime/source evidence.

After the difficult phase is resolved, downgrade back to Chat / Sol High or Work / High rather than carrying expensive reasoning through mechanical implementation.

## Current task recommendations

| Task / issue | Default | Escalate when |
| --- | --- | --- |
| #10 modular userscript/core refactor | **Chat / Sol High** | **Extra High** for a genuinely ambiguous ownership boundary; **Max** once for final adversarial architecture/release review if warranted. |
| #7 intermittent connection-error toast | **Chat / Sol High** for targeted capture | **Extra High** if captured request/toast/runtime evidence still supports multiple causes. |
| #20 Booth JSON import/export | **Chat / Sol High** | **Extra High** only if legacy serialization depends on undocumented HeroForge internals. |
| #21 Kickstarter splash suppression | **Chat / Sol High** | Normally no escalation; inspect and suppress the specific promo lifecycle only. |
| #22 decal slot drag/reorder | **Chat / Sol High** | **Extra High** for the state-ownership design if paint/projected/persistence/undo/JSON interactions prove coupled. |
| #23 additional Photo Booth lights | **Chat / Sol High** | **Extra High** if native light/render lifecycle requires undocumented-engine investigation. |
| #24 submitted High Res regressions | **Work / High** | **Extra High** for conflicting fixture evidence / ownership classification; **Max** only for unresolved renderer reconstruction. |
| #25 objects / KB / tails / hair High Res expansion | **Work / High** | **Extra High** for generalized host/atlas architecture; **Max** for unresolved HeroForge renderer/texture-host reconstruction or final generalized design review. |
| Long-session Witch Dock module slowdown | **Chat / Sol High** for initial instrumentation | Move to **Work / Extra High** if first evidence passes do not isolate cause; **Max** if it remains a nondeterministic Chrome + Tampermonkey + HeroForge + Dock problem after evidence collection. |
| Extra Characters revamp | **Work / High** for inventory/reproduction | **Extra High/Max** if safe extension requires reconstruction of changed native multi-figure ownership. |
| Spin/WebP quality/FPS/resolution | **Chat / Sol High** | Extra High only if renderer limits/lifecycle are unclear after measurement. |
| In-app bug-report workflow | **Chat / Sol High** | No routine escalation. |
| #12 legacy harvest / #13 branch cleanup / #14 janitorial work | **Chat / Sol High** or **Work / High** for volume | Extra High only for an ambiguous legacy fragment with real runtime consequences. |
| Discord/backlog triage | **Chat / Sol High** | Work only if doing a large autonomous batch; no Extra High/Max. |

## Updating this router

When a substantial new task is added to the durable backlog, add or revise a row **only if** its recommended mode/trigger is not already obvious from an existing category. Keep this file compact; it is a routing table, not task history.

If later evidence changes a task's complexity, update its row at the same time the issue/backlog classification changes.

Mode recommendations are advisory. Never stop a safe in-progress mutation, capture, or regression solely to switch modes; finish the bounded step, record state, then recommend the switch at the next checkpoint.

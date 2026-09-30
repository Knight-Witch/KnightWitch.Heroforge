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

## Task categories (not active-task routing)

Current tasks and completion state belong exclusively in [ACTIVE_CONTEXT.md](ACTIVE_CONTEXT.md) and scoped issues.

| Work | Default | Escalate when |
|---|---|---|
| Scoped implementation, UI, ordinary review, versioning | Chat / Sol High | Evidence leaves a real ownership/architecture ambiguity. |
| Multi-fixture diagnostics or large repetitive workflows | Work / High | Conflicting causal evidence warrants Extra High; unresolved engine reconstruction may warrant Max. |
| Release reconciliation, branch governance, backlog triage | Chat / Sol High; Work / High for volume | High-risk release review or an ambiguous preserved fragment has real runtime consequences. |
| HeroForge/minified renderer reconstruction | Evidence first | Extra High/Max only after bounded source/runtime inspection leaves the seam unresolved. |
| Nondeterministic cross-layer slowdown | Chat / Sol High for instrumentation | Work / Extra High after initial passes fail; Max only after substantive evidence. |

## Updating this router

When a substantial new task is added to the durable backlog, add or revise a row **only if** its recommended mode/trigger is not already obvious from an existing category. Keep this file compact; it is a routing table, not task history.

If later evidence changes a task's complexity, update its row at the same time the issue/backlog classification changes.

Mode recommendations are advisory. Never stop a safe in-progress mutation, capture, or regression solely to switch modes; finish the bounded step, record state, then recommend the switch at the next checkpoint.

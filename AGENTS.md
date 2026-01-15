# Codex + GPT Development Workflow

This repository is edited locally using Codex CLI, not browser-based Codex.

## Tooling

- Node.js (LTS)
- Codex CLI installed globally:
  npm install -g @openai/codex
- Codex is authenticated via `codex login`

## Repository Rules

- Repo: Knight-Witch / KnightWitch.Heroforge
- All work is done locally
- GitHub is never edited directly
- Active development branch: GPT_DEV

Local path:
C:\Users\amand\OneDrive\Documents\GitHub\KnightWitch.Heroforge

## Codex Usage Model

Codex CLI:
- Reads files directly from disk
- Modifies files locally
- Does NOT auto-commit
- Does NOT auto-push
- Does NOT create PRs

All git actions are manual and explicit.

## Standard Workflow

1. cd into repo
2. Run `codex`
3. Ask Codex to modify files
4. Review changes with:
   git diff
5. If correct:
   git add .
   git commit -m "clear description"
   git push

Nothing is pushed unless explicitly done.

## Cross-GPT Synchronization

Codex does not share memory with browser GPT.

To sync context between GPT sessions:
- Run:
  codex "Summarize the current git diff. Focus on behavior changes. No code."
- Copy the output into the other GPT chat

Git is the source of truth.

## Mental Model

- GitHub = remote storage
- Local repo = working copy
- Codex CLI = editor
- Git = history + safety net
- Human = gatekeeper

# Active Context — WITCH_DEV_MAIN

**Updated:** 2026-09-17  
**Canonical Dev:** `WITCH_DEV_MAIN`  
**Stable baseline used to create this branch:** `Witch_Scripts` @ `273b2dc2bbb7a38ea1591abf7c7723d23800e4a4`  
**Current phase:** establish the clean Dev platform, harvest only still-relevant legacy work, then modularize the oversized userscript core.

## Current priorities

1. #12 — audit legacy `WITCH_DEV_UI` / `WITCH_DEV` for useful unfinished fragments without bulk-merging branch history.
2. #10 — reframe/implement the Dock architecture so Tampermonkey becomes a small privileged bootstrap/host and GitHub owns the application/core modules.
3. #7 / #8 — preserve open bug/backlog items and re-test them against the new Stable-derived Dev before migrating any old patch.
4. #13 — retire obsolete branches only after the harvest audit proves nothing useful is stranded there.
5. #14 — enforce Dev -> Stable post-rollout cleanup as part of release completion.

## Protected state

- Public `Witch_Scripts` remains untouched unless Amanda explicitly authorizes a narrow promotion.
- New Dev began byte-for-byte from the current public Stable runtime.
- Legacy Dev branches are evidence/reference only; newer-looking code is not automatically preferred.
- Closed/promoted legacy work should not be reintroduced merely because it exists in old branch history.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`;
2. this file;
3. `DEV_WORKFLOW.md`;
4. `DEV_DIVERGENCES.json`;
5. the active GitHub issue(s) named above;
6. only source files directly required by the current task.

Do not preload `MASTER.md`, full historical logs, unrelated `HISTORY/BULLSHIT/*`, or HeroForge.Compatibility unless current evidence specifically requires them.

## Immediate next technical sequence

1. Complete the legacy harvest classification for unresolved/open surfaces.
2. Establish a Dev-specific userscript/bootstrap from the Stable implementation without duplicating the old monolith.
3. Move non-privileged Dock core responsibilities out of the Tampermonkey entrypoint in bounded stages.
4. Validate New Dev independently through static checks, HF-Chat-Bridge runtime inspection, and human visual confirmation where appearance is involved.
5. Only after New Dev is healthy begin branch retirement #13.

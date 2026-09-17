# Pre-Flight Check Log

This is the compact operational preflight log. Older detailed records remain in Git history; they are not mandatory startup context.

## PFC-2026-09-16-080 -- Issue #9 Dev module-loader concurrency candidate

Date: 2026-09-16

### Scope

Dev-only module loading performance repair. Public Stable is not changed.

### Diagnosis

- Confirmed `Witch_Dock_DEV.user.js` performs raw-GitHub module requests strictly serially.
- Confirmed current Dev has 23 enabled module entries versus 18 on September 8.
- Confirmed the affected HeroForge page and HF-Chat-Bridge remain responsive/healthy.
- Supported inference: per-request slowdown is being multiplied by the serial request chain.

### Candidate behavior

- New `witch-dock-dev-module-loader` v0.1.0.
- Existing Dev shell source remains untouched.
- `manifest.tools` contains only the hidden bootstrap; the previous module inventory/order moves intact to `manifest.devModules`.
- Bootstrap starts all enabled requests immediately, then awaits/executes each promise in original order.
- Existing enablement prefix, cache-key identity, execution mechanism, and per-module failure isolation are preserved.
- No timeout/failure-policy change is bundled.

### Static validation

- `node --check features/core/Witch_Dock_DEV_Module_Loader.js` passed.
- `manifest.json` parsed successfully.
- `devModules` contains 23 unique IDs, first `witch-dock-developer-mode`, last `utilities`; every ID exists in `moduleRegistry`.
- Synthetic concurrency test passed: A/B/C requests started together, completed B/C/A, and executed A/B/C.

### Live gate after commit

- Refresh Dev HeroForge page in the currently degraded Chrome session.
- Bridge-read `KWDevModuleLoader.getState()`.
- Confirm enabled modules fetched/executed without bootstrap/module errors.
- Human-check normal Dock tabs/tools and startup speed.
- Stable promotion is prohibited until this gate passes and Amanda explicitly approves it.

**Runtime behavior changed:** yes, Dev-only network concurrency. Stable remains protected at `acaf18a0cfd2c751886e85a269b9427ddfaa5040`.

---

## PFC-2026-09-16-079 -- Reopen #7 / park JSON detour

Documentation-only routing correction. No Witch Dock runtime source or public Stable change.

---

## Prior current preflight

PFC-2026-09-16-078 and earlier detailed records remain preserved in Git history.

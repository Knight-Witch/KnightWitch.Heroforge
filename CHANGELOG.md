# Changelog

## Latest repository change — 2026-10-09

- **#111 Dev Decals v1.2.6 / 1.2.6-manual-lifetime-preview:** Removed all time-based auto-revert from the experimental ID1178 M/N UV preview. It stays active until explicit Revert or a replacement preview; page/figure rebuild discards renderer-only overlays. No saved JSON or character edits.
- Preserved native atlas rebake, exact snapshot/rollback, invalid input safeguards, GPU pixel diagnostics, native ID+slot restrictions. Manual revert now avoids overwriting shader values replaced by HeroForge during a longer-lived preview.
- Focused Node regression verifies no scheduled auto-expiry, explicit and replacement preview rollback, native ownership protection, GPU pixel restore, saved data immutability, and native bake failure.
- Launcher v1.17.22 remains on prior immutable payload until a source-pinned launcher follow-up commit. Public Stable unchanged.

## Latest Stable release context

Public Stable v2.4.3 contains no #111 experimental preview.

# Changelog

## Latest repository change — 2026-10-09

- **#111 Dev native paint overwrite repair:** Decals v1.2.7 / 1.2.7-native-repaint-reconcile adds active-only light 2-second checks. When HeroForge replaces the preview's temporary green shader colors but leaves the logical preview active, the tool safely re-bases/reapplies native materials and rebakes. No preview expiration.
- Manual Revert and replacement preview cleanly stop maintenance. Figure/mesh/data/decal changes stop without rebaking the new figure; original/changed saved coordinates untouched. Focused mock reproduces native overwrite, native edit ownership, rollback, GPU comparisons, figure switch and zero auto timeouts.
- **Dev launcher v1.17.24 / 1.17.24-uv-preview-native-refresh** pins immutable module payload **a223096d2c442000a80a27fb2b430059a77e76cc**. Updated current context, focused handoff and divergence record. Live/human gate still pending.
- No Stable changes or permanent UV migration.

## Latest Stable release context

Public Stable v2.4.3 contains no #111 preview.

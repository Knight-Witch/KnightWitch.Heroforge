# Changelog

## Latest repository change — 2026-10-09

- **#111 Dev Decals v1.2.7 / 1.2.7-native-repaint-reconcile:** Untimed ID1178 M/N UV preview can lose its temporary green shader uniforms when HeroForge/native paint updates them behind the still-active preview state. Added active-only 2-second light ownership monitoring; only when overwritten, reapply/rebase through the existing safe snapshot and native rebake path. No timeout or saved data writes.
- If figure/data/torso material/decals change, the monitor stops and abandons its old temporary shader overlays without rebaking a new figure. Explicit Revert and replacement preview continue to work; native replacement values remain owner-protected.
- Node regression verifies simulated post-preview native overwrite is visibly green again in materials, manual rollback, no expiry, GPU readback restore, and figure replacement cleanup. Dev launcher/payload pairing pending; no Stable changes.

## Latest Stable release context

Public Stable v2.4.3 contains no #111 experimental preview.

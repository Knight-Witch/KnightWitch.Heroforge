# Changelog

## Latest repository change — 2026-10-09

- **#111 correct distinct decal pair (Dev only):** The nipple decal pair is native bodyUpper decal ID 1178 at mappings 13/14, labeled M/N (two copies); prior ID 1195 mappings 7,8,9,10,12 is a separate five-copy circle. Owner confirmed previously highlighted 1195 overlays were not nipples.
- Bumped Decals **v1.2.5 / 1.2.5-unique-1178-uv-mappings-13-14** and restricted the temporary renderer-only high-contrast/UV preview to source-verified id1178 mappings 13/14. Old targets 7/8/9 are not eligible; native unprojected/UV eligibility, bounded scale, cache bake, saved-coordinate immutability and 2-minute rollback are retained.
- Focused mock regression now covers real native slot IDs, inverted/non-inverted UV matrices, unlike prior samples, high-contrast gradient alpha=0, negative eligibility, GPU pixel changes, failure restore and exact rollback.
- **Launcher v1.17.21 still pins prior payload while new Decals payload is staged.** Human-visible correction remains unconfirmed. No Stable changes.

## Latest Stable release context

Public Stable v2.4.3 contains no #111 experimental Decals preview. No Stable promotion authorized.

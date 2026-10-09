# Pre-Flight Check

## 2026-10-09 — #111 corrected unique ID 1178 pair / payload stage

- PASS: PROJECT_CONTRACT.md + ACTIVE_CONTEXT.md, focused #111 handoff and branch governance inspected; task branch wd/111-legacy-uv-preview remains ACTIVE PROTECTED.
- PASS: Live Bridge #4806 census found five ID1195 entries at 7/8/9/10/12 and exactly two ID1178 at mappings 13 and 14 (upperbody native M/N). Prior v1.2.4 preview had reverted 2/2; saved data unchanged. #4807 proved both ID1178 native l0_projected=0, l0_uvSet2=0, corresponding UV shader uniforms and compatible four-element palettes, original alpha=0.
- PASS: Existing Dev-only Decals module now v1.2.5, targets exactly ID1178 mappings 13/14 and explicitly rejects formerly tested ID1195 locations.
- PASS: Node syntax and focused regression including changed/restored GPU mock, exact palette/uniform identity restoration, native paint/atlas failure cleanup, projected rejection and immutable figure data.
- PASS: manifest registry module version/build matches source, JSON parse, git diff --check.
- PENDING: new immutable payload and Dev launcher pin, live native GPU proof, Amanda visual location confirmation.
- No public Stable changes. Feature registry no impact (same experimental Decals host tool id/path/ownership).

# Pre-Flight Check

## 2026-10-09 — #111 actual native color palette shape compatibility

- PASS: Live Bridge #4783 rejected inaccurate 4×Vec4 palette; #4784 confirms actual three RGB Vec3 plus one RGBA Vec4 (alpha 0.2117647). No user figure values modified; fail-closed/rollback successful.
- PASS: Renderer API RK.Vec3/RK.Vec4 present in #4785. Decals source/manifest synchronized to v1.2.3. No external script modified.
- PASS: JS syntax and mock GPU high-contrast proof, restoration, invalid-input rejection and saved-character immutability checks.
- HOLD: Real live color pixel readback; only after that ask owner to load all original D5 decals for visual gate.
- No Stable/public promotion or persistent migration.

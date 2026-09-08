# Booth v27 / Black Canvas Stable Acceptance

Date: 2026-09-07
Status: **Public Stable validated**
Target HeroForge build: `heroforge07.1.9.98`
Stable promotion commit: `91a78ebaba6e54ee143dbae0053d782495f252fa`

## Accepted public set

- Witch Dock shell v1.2.1 / `1.2.1-stable-cache-keyed-loader`;
- Booth v27.0.4 / `v27.0.4`;
- Black Canvas replay v0.1.5 / `0.1.5-dev-restore-before-booth-handoff`;
- Booth runtime bootstrap v0.1.0 / `0.1.0-dev-native-booth-bootstrap`;
- Utilities v1.2.1 unchanged.

## Final public smoke

After the narrow Stable promotion, Amanda updated/reloaded the public `Witch_Scripts` userscript and reported that everything looks great.

The public acceptance therefore closes the release gate for:

- correct public v1.2.1/module delivery;
- saved Booth startup restoration without first visiting native Photo Booth;
- saved Black Canvas restoration;
- Black Canvas ON/OFF presentation restoration;
- the previously reliable white-flash regression remaining closed.

The exact Booth/replay/bootstrap runtime blobs had already passed the combined Dev lifecycle/component smoke before promotion; this final smoke confirms the promoted public consumer path behaves as expected.

## Loader acceptance

The public shell's cache-keyed manifest/module loader is accepted in the live public path. The page obtained the intended current Stable module identities after the v1.2.1 update rather than remaining stranded on an older branch-based raw GitHub response.

## Deferred cosmetic issue

A thin approximately 1 px checkerboard seam can still appear between the 1:1 viewport and the outer canvas. Observed behavior:

- commonly top and bottom edges;
- can become top/bottom/right after maximizing or other responsive geometry changes;
- may take a short time to appear.

This is cosmetic and explicitly deferred. It is not a release blocker and must not be used as a reason to reopen the closed white-flash investigation or restore the rejected `getTokenViewOffset()` DOM-matte approach.

Future work should treat it as a separately scoped frame/mask viewport-geometry problem.

## Release disposition

Booth lifecycle/startup restoration, Black Canvas replay, and the loader cache repair are **public Stable validated** on the current target build. The current Booth investigation is closed except for the deferred checkerboard-seam task.

**Runtime behavior changed by this acceptance record:** no.

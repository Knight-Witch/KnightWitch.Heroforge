# Open Issue #26 — Legacy Bone Detection References

These files were harvested from obsolete branch `GPT_DEV` @ `291e477f1953a133ef8701128da8c42ba7d4b781` solely because they are relevant to open issue #26 (stale Bone HUD selection anchors).

They are **reference-only**, not runtime modules and not a recommendation to restore the old fixed-index approach.

The useful historical facts are:
- the prior detector watched `HF.summonCircle`-adjacent rig objects after pointer/click selection;
- it scored names containing `_bind_jnt` and preferred likely body-bone names;
- it tried several fixed scene-tree anchor paths, all of which are now confirmed stale on current HeroForge;
- the targeted probe shows the old candidate/delta strategy that may help compare behavior while reconstructing a current named/stable selection seam.

Once issue #26 is repaired and its replacement seam is documented, this reference folder can be removed in normal janitorial cleanup.

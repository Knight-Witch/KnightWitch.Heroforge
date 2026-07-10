# Kitbashing and Bones

HeroForge kitbashing, bone selection, scene graph, and transform behavior discoveries.

## Known Rules

- Scene graph probing must stay tolerant.
- If working code probes multiple possible paths, do not collapse it to one path.
- Bone detection may require baseline snapshots and delayed diffing after interaction.
- Do not assume one summon-circle path works across HeroForge runtime states.

## Findings

### Witch Dock Footer Bone Detection Probes Multiple Summon-Circle Paths

Context:
- `Witch_Dock.user.js` contains footer bone detection and copy behavior.

Observed behavior:
- It tries multiple summon-circle roots, including `HF.summonCircle`, `HF.app.summonCircle`, `HF.scene.summonCircle`, `HF.render.summonCircle`, and `summonCircle`.
- It then probes multiple anchor bases under `parent` / `children` paths.
- Candidate paths include node names, parent names, child names, and object child names.

Working approach:
- Preserve tolerant root probing and anchor base probing.
- Do not replace the path list with one hard-coded scene graph path.
- If detection fails, compare against current HeroForge scene graph before editing logic.

Affected tools:
- `Witch_Dock.user.js`

### Bone Detection Uses Baseline/Delta Selection

Context:
- Bone detection does not directly read one selected-bone API.

Observed behavior:
- It snapshots candidate paths, then diffs later snapshots after interaction.
- It scores candidate names, prioritizing `_bind_jnt`, `main_`, `_kitbash_`, and body-part terms.
- It ignores clicks inside Witch Dock and form/button controls.

Working approach:
- Preserve baseline/delta selection and ignore rules.
- Do not simplify detection into direct click target text or a single selected object assumption.

Affected tools:
- `Witch_Dock.user.js`

### Body Editor Uses Explicit Body Bone / Joint Key Lists

Context:
- `tools/Body_Editor.js` manipulates body-related character JSON and joint keys.

Observed behavior:
- Breast and butt workflows use explicit left/right joint key mappings and baseline storage.
- Butt baseline data uses `hfBodyEditorDock.buttBaselines.v1`.

Working approach:
- Treat these key lists as HeroForge-specific fragile data.
- Do not rename, collapse, or regenerate key mappings without a tested reference.

Affected tools:
- `tools/Body_Editor.js`

## Entry Template

### Finding Title

Context:
- 

Observed behavior:
- 

Working approach:
- 

Affected tools:
- 

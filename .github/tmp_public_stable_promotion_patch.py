from pathlib import Path
import json
import subprocess

STABLE_BASE = 'f218244b2a6010e4d299ca5641a8d4f6f56f38f9'
DEV_VALIDATED = 'cecfa43f3ca0096562bb3e9f472c39cbb1823f40'


def read(path):
    return Path(path).read_text(encoding='utf-8')


def write(path, text):
    Path(path).write_text(text, encoding='utf-8', newline='\n')


def git_show(ref, path):
    return subprocess.check_output(['git', 'show', f'{ref}:{path}']).decode('utf-8')


def replace_count_text(text, old, new, expected=1, label='text'):
    count = text.count(old)
    if count != expected:
        raise SystemExit(f'{label}: expected {expected} matches, got {count} for {old[:160]!r}')
    return text.replace(old, new, expected)


def replace_count(path, old, new, expected=1):
    text = read(path)
    write(path, replace_count_text(text, old, new, expected, path))


def replace_heading_section(path, heading, next_heading, replacement):
    text = read(path)
    start = text.find(heading)
    end = text.find(next_heading, start + len(heading))
    if start < 0 or end < 0:
        raise SystemExit(f'{path}: missing section boundary {heading!r} -> {next_heading!r}')
    write(path, text[:start] + replacement.rstrip() + '\n\n' + text[end:])


def prepend_entry(path, header, marker, entry):
    text = read(path)
    if marker in text:
        return
    if not text.startswith(header):
        raise SystemExit(f'{path}: unexpected header')
    write(path, header + entry.rstrip() + '\n\n---\n\n' + text[len(header):])


def append_once(path, marker, entry):
    text = read(path).rstrip()
    if marker in text:
        return
    write(path, text + '\n\n' + entry.strip() + '\n')


def blob(path):
    return subprocess.check_output(['git', 'hash-object', path], text=True).strip()


# ---------------------------------------------------------------------------
# Public userscript shell: port only the validated Dev cache-key loader logic.
# ---------------------------------------------------------------------------
public_shell = read('Witch_Dock.user.js')
dev_shell = git_show('origin/WITCH_DEV_UI', 'Witch_Dock_DEV.user.js')

public_shell = replace_count_text(public_shell, '// @name         Witch Dock v1.2.0', '// @name         Witch Dock v1.2.1', 1, 'Witch_Dock.user.js')
public_shell = replace_count_text(public_shell, '// @version      1.2.0', '// @version      1.2.1', 1, 'Witch_Dock.user.js')

if 'const LOADER_CACHE_SESSION =' in public_shell:
    raise SystemExit('Witch_Dock.user.js: cache-key loader already present unexpectedly')
cache_start = dev_shell.index('const LOADER_CACHE_SESSION = ')
cache_end = dev_shell.index('function gmGetText', cache_start)
cache_block = dev_shell[cache_start:cache_end]
marker = 'const TOOL_ENABLE_PREFIX = "kw.witchDock.toolEnabled.";\n\n'
public_shell = replace_count_text(public_shell, marker, marker + cache_block, 1, 'Witch_Dock.user.js')

public_shell = replace_count_text(
    public_shell,
    '    const raw = await gmGetText(MANIFEST_URL);',
    '    const raw = await gmGetText(kwManifestRequestUrl());',
    1,
    'Witch_Dock.user.js'
)

public_shell = replace_count_text(
    public_shell,
    '  if (!manifest || typeof manifest !== "object") return;\n  const tools = Array.isArray(manifest.tools) ? manifest.tools : [];',
    '  if (!manifest || typeof manifest !== "object") return;\n  const registryEntries = Array.isArray(manifest.moduleRegistry) ? manifest.moduleRegistry : [];\n  const registryById = new Map();\n  for (const entry of registryEntries) {\n    if (!entry || typeof entry !== "object" || typeof entry.id !== "string" || !entry.id) continue;\n    if (!registryById.has(entry.id)) registryById.set(entry.id, entry);\n  }\n  const tools = Array.isArray(manifest.tools) ? manifest.tools : [];',
    1,
    'Witch_Dock.user.js'
)

public_shell = replace_count_text(
    public_shell,
    '    const id = typeof t.id === "string" ? t.id : "";\n    const url = typeof t.url === "string" ? t.url : "";\n    const enabledByDefault = !!t.enabledByDefault;',
    '    const id = typeof t.id === "string" ? t.id : "";\n    const url = typeof t.url === "string" ? t.url : "";\n    const enabledByDefault = !!t.enabledByDefault;\n    const registryEntry = registryById.get(id) || null;',
    1,
    'Witch_Dock.user.js'
)

public_shell = replace_count_text(
    public_shell,
    '      const code = await gmGetText(url);',
    '      const code = await gmGetText(kwModuleRequestUrl(t, registryEntry));',
    1,
    'Witch_Dock.user.js'
)
write('Witch_Dock.user.js', public_shell)


# ---------------------------------------------------------------------------
# Manifest: narrow Stable identities/order only. Runtime source is copied
# byte-for-byte from the validated Dev commit by the workflow before this runs.
# ---------------------------------------------------------------------------
manifest = json.loads(read('manifest.json'))
registry = manifest['moduleRegistry']
tools = manifest['tools']

by_id = {entry['id']: entry for entry in registry}
core = by_id['witch-dock-core']
core['version'] = '1.2.1'
core['build'] = '1.2.1-stable-cache-keyed-loader'
core['versionOrigin'] = 'stable-loader-cache-repair-2026-09-07'

booth = by_id['booth-tool']
booth['version'] = '27.0.4'
booth['build'] = 'v27.0.4'
booth['versionOrigin'] = 'stable-promoted-dev-validated-2026-09-07'

replay = by_id['booth-black-canvas-display-replay']
replay['version'] = '0.1.5'
replay['build'] = '0.1.5-dev-restore-before-booth-handoff'
replay['versionOrigin'] = 'stable-promoted-dev-validated-2026-09-07'

if 'booth-runtime-bootstrap' in by_id:
    raise SystemExit('manifest.json: booth-runtime-bootstrap already exists unexpectedly')
bootstrap_registry = {
    'id': 'booth-runtime-bootstrap',
    'title': 'Booth Runtime Bootstrap',
    'path': 'features/booth/Booth_Runtime_Bootstrap.js',
    'kind': 'compatibility-feature',
    'load': 'manifest',
    'version': '0.1.0',
    'build': '0.1.0-dev-native-booth-bootstrap',
    'versionOrigin': 'stable-promoted-dev-validated-2026-09-07'
}
booth_index = next(i for i, entry in enumerate(registry) if entry.get('id') == 'booth-tool')
registry.insert(booth_index, bootstrap_registry)

tool_by_id = {entry['id']: entry for entry in tools}
tool_by_id['booth-tool']['url'] = 'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/tools/Booth.js?v=27.0.4-v27.0.4'
tool_by_id['booth-black-canvas-display-replay']['url'] = 'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/features/booth/Black_Canvas_Display_Replay.js?v=0.1.5-dev-restore-before-booth-handoff'

if 'booth-runtime-bootstrap' in tool_by_id:
    raise SystemExit('manifest.json tools: booth-runtime-bootstrap already exists unexpectedly')
bootstrap_tool = {
    'id': 'booth-runtime-bootstrap',
    'title': 'Booth Runtime Bootstrap',
    'tab': 'HeroForge UI',
    'url': 'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/features/booth/Booth_Runtime_Bootstrap.js?v=0.1.0-dev-native-booth-bootstrap',
    'enabledByDefault': True,
    'hidden': True,
    'type': 'heroForgeUI'
}
booth_tool_index = next(i for i, entry in enumerate(tools) if entry.get('id') == 'booth-tool')
tools.insert(booth_tool_index, bootstrap_tool)

write('manifest.json', json.dumps(manifest, indent=2) + '\n')

booth_blob = blob('tools/Booth.js')
replay_blob = blob('features/booth/Black_Canvas_Display_Replay.js')
bootstrap_blob = blob('features/booth/Booth_Runtime_Bootstrap.js')


# ---------------------------------------------------------------------------
# Durable public documentation.
# ---------------------------------------------------------------------------
master_booth = '''## Booth / Black Canvas

Public Booth: `tools/Booth.js` v27.0.4 / build `v27.0.4`.

Public Black Canvas replay: `features/booth/Black_Canvas_Display_Replay.js` v0.1.5 / build `0.1.5-dev-restore-before-booth-handoff`.

Public Booth runtime bootstrap: `features/booth/Booth_Runtime_Bootstrap.js` v0.1.0 / build `0.1.0-dev-native-booth-bootstrap`.

Validated Stable-target behavior inherited from the final Dev smoke:

- saved Booth figures can bootstrap HeroForge's native gated Booth runtime and restore Booth View without first visiting native Photo Booth;
- bare camera state is not a saved-Booth signal, preserving `+ New Figure` exclusion;
- Black Canvas persistence remains independent from Booth persistence;
- the post-`CK.character.display.update()` replay preserves the validated white-flash suppression boundary and always lets native update run;
- replay restores any pre-BT background visibility it owns before Booth takes presentation ownership;
- editor environment restoration checks the actual `CK.environment.background.mesh`/ground state instead of trusting the wrapper flag alone;
- Lighting, Effects, Overlays, and Background component toggles use narrow redraw/reassertion and no longer rerun the broad overlay visibility sequence that stranded the editor environment;
- Black Canvas ON -> OFF restores the full fantasy backdrop plus pedestal/ground;
- Black Canvas ON + Booth Background OFF no longer strands the fantasy background mesh hidden.

Final Dev v27.0.4 live state-repair smoke: **PASS** for full fantasy-background restoration, all four component toggles, Black Canvas ON/OFF restoration, and Black Canvas + Background-OFF fallthrough.

### Deferred cosmetic issue — not a release blocker

A thin approximately 1 px checkerboard seam can still appear between the 1:1 Booth viewport and outer canvas, typically top/bottom and sometimes top/bottom/right depending on window geometry/maximization. It may appear after a delay. This is explicitly deferred to a later separately scoped frame/mask geometry investigation. Do not reopen the rejected `getTokenViewOffset()` DOM matte or the closed white-flash investigation as a shortcut.

Detailed records:
- `HISTORY/BULLSHIT/BOOTH_V27_STABLE_PROMOTION.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`
- `HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md`
'''
replace_heading_section('MASTER.md', '## Booth / Black Canvas\n', '## Utilities\n', master_booth)

replace_count('MASTER.md', '- Current public shell version: **1.2.0**', '- Current public shell version: **1.2.1**')
replace_count(
    'MASTER.md',
    'The public shell remains v1.2.0. Booth v27 and Utilities v1.2.1 are manifest-delivered module promotions; no userscript-shell bump is required.',
    'Public shell v1.2.1 adds the validated cache-keyed manifest/module loader so branch-based raw GitHub caching cannot strand a page on an older manifest/module body. Module execution order and enablement are otherwise unchanged.'
)

master_queue = '''## Current queue

1. Final public Stable refresh/smoke: confirm shell v1.2.1, Booth v27.0.4, replay v0.1.5, bootstrap v0.1.0, saved Booth/Black Canvas startup restoration, full fantasy-background restoration, and the known flash action remaining flash-free.
2. The approximately 1 px checkerboard seam at the 1:1 edge is a documented deferred cosmetic issue, not a release blocker; investigate later against the actual frame/mask viewport geometry.
3. After that public smoke, move on to the next separately scoped project. Do not continue Black Canvas investigation merely because the deferred seam exists.
'''
replace_heading_section('MASTER.md', '## Current queue\n', '## Durable records\n', master_queue)

master = read('MASTER.md')
if '- `HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md`' not in master:
    master = master.replace('- `HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md`\n', '- `HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md`\n- `HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md`\n')
    write('MASTER.md', master)

changelog_entry = f'''## DOCK-2026-09-07-027 — Promote validated Booth lifecycle and cache-keyed public loader

Date: 2026-09-07

### Summary

Promote the final Dev-validated Booth lifecycle/state repair to public Stable and repair the separate raw-GitHub loader caching defect. This is a narrow Stable promotion; it is not a wholesale Dev merge.

### Runtime changes

- public userscript shell `1.2.0 -> 1.2.1`;
- public loader now uses a unique per-page manifest cache key and deterministic registry-identity module cache keys, preserving existing query parameters and load order;
- Booth `27.0.0 -> 27.0.4`, exact validated Dev blob `{booth_blob}`;
- Black Canvas replay `0.1.1 -> 0.1.5`, exact validated Dev blob `{replay_blob}`; Stable's diagnostic state fallback is retained in that Dev-tested source;
- new hidden `booth.runtime-bootstrap` v0.1.0, exact validated Dev blob `{bootstrap_blob}`, loaded before Booth;
- Utilities remains v1.2.1 and byte-unchanged.

### Final Dev acceptance

Amanda reported PASS for:

1. full fantasy editor environment restoration;
2. Lighting / Effects / Overlays / Background toggle stability;
3. Black Canvas ON -> OFF full backdrop restoration;
4. Black Canvas ON + Background OFF fallthrough without the stranded-background failure.

Earlier integrated Dev validation remains inherited for saved Booth startup bootstrap, `+ New Figure` exclusion, and the established post-update white-flash suppression boundary.

### Deferred known issue

A roughly 1 px checkerboard seam can still appear at the 1:1 Booth edge, usually top/bottom and sometimes also the right edge after responsive resizing/maximization. It is cosmetic, non-blocking, and explicitly deferred to a later frame/mask geometry task.

### Preserved boundaries

- no wholesale Dev merge;
- Corrected Bound Decal Gizmo unchanged;
- Spinny Mini WebP unchanged;
- High Res Image Capture unchanged;
- JSON unchanged;
- Developer Mode unchanged;
- Decals host/tab shell behavior unchanged apart from the loader cache repair;
- HF-Chat-Bridge remains development-only and is not a public dependency.

**Runtime behavior changed:** yes — public loader cache repair plus validated Booth/replay/bootstrap promotion.
'''
prepend_entry('CHANGELOG.md', '# Changelog\n\n', '## DOCK-2026-09-07-027', changelog_entry)

preflight_entry = f'''## PFC-2026-09-07-027 — Promote validated Booth lifecycle and cache-keyed public loader

Date: 2026-09-07

### Scope

Promote the final Dev-validated Booth v27.0.4/replay v0.1.5/runtime-bootstrap v0.1.0 set and port only the validated Dev loader cache-key mechanism into public shell v1.2.1. Record the remaining 1 px checkerboard seam as deferred and non-blocking.

### Reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md`;
- Compatibility `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- current Stable `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, `manifest.json`, shell v1.2.0, Booth v27.0.0, replay v0.1.1;
- Dev `HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md`, `BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`, `BOOTH_RUNTIME_BOOTSTRAP.md`;
- validated Dev head `{DEV_VALIDATED}`;
- final user live PASS for v27.0.4 environment/component restoration;
- user observation that the thin responsive checkerboard seam remains and is explicitly deferred.

### Confirmed findings

- Stable replay's v24 diagnostic fallback is present in Dev replay v0.1.5, so exact-blob promotion is monotonic;
- v27.0.4 live state repair passed all four requested environment/component tests;
- live bridge evidence showed `CK.environment.background.visible === true` while `CK.environment.background.mesh.visible === false`, confirming the explicit mesh restoration targets the observed failure;
- the rejected v27.0.3 `getTokenViewOffset()` DOM matte is not part of the promoted source;
- public fixed branch URLs have a confirmed delivery-cache defect; Dev's cache-keyed loader passed static validation and is ported surgically to the public shell rather than copying the Dev shell.

### Target files

Runtime / delivery:
- `Witch_Dock.user.js`
- `manifest.json`
- `tools/Booth.js`
- `features/booth/Black_Canvas_Display_Replay.js`
- `features/booth/Booth_Runtime_Bootstrap.js`

Documentation:
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABLE_PROMOTION.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`
- `HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md`
- `HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md`

### Conflict risks / preservation requirements

- candidate parent must be current Stable head `{STABLE_BASE}`;
- Booth/replay/bootstrap must equal the exact validated Dev blobs;
- do not modify Utilities, gizmo, Spinny, High Res, JSON, Developer Mode, Decals, or other unrelated modules;
- public shell must retain the existing emblem/UI bytes outside the cache-key/header delta;
- bootstrap must load before Booth;
- public raw URLs must point to `Witch_Scripts`, never `WITCH_DEV_UI`;
- no HF-Chat-Bridge/Compatibility-main public runtime dependency;
- deferred checkerboard seam must remain documented rather than silently treated as fixed.

### Gate

Before advancing `Witch_Scripts`:

- JavaScript syntax: shell, Booth, replay, bootstrap PASS;
- manifest JSON parse PASS;
- exact Dev blob parity PASS for Booth/replay/bootstrap;
- public cache helper block equals the validated Dev helper block;
- manifest/tool registry IDs resolve and bootstrap precedes Booth;
- public URLs contain no `WITCH_DEV_UI` for the promoted modules;
- exact changed-file whitelist PASS;
- protected unrelated runtime blobs PASS;
- `git diff --check` PASS.

### Decision

Proceed to a narrow Stable promotion candidate. After branch movement, require one final public refresh/smoke; the 1 px seam is not an acceptance blocker.

**Runtime behavior changed:** yes.
'''
prepend_entry('PRE_FLIGHT_Check.md', '# Pre-Flight Check Log\n\n', '## PFC-2026-09-07-027', preflight_entry)

append_once(
    'HISTORY/BULLSHIT/BOOTH_V27_STABLE_PROMOTION.md',
    '## 2026-09-07 v27.0.4 Stable lifecycle completion',
    f'''## 2026-09-07 v27.0.4 Stable lifecycle completion

The final Dev state-repair sequence is promoted after live acceptance. `tools/Booth.js` is now the exact Dev-tested v27.0.4 blob `{booth_blob}`. It removes the rejected v27.0.3 token-offset DOM matte, narrows component redraw so Lighting/Effects/Overlays/Background no longer replay broad native overlay visibility, and restores the actual regular background mesh when HeroForge's wrapper/mesh visibility disagrees.

Amanda's final Dev v27.0.4 smoke passed full fantasy-background restoration, all four component toggles, Black Canvas ON/OFF restoration, and Black Canvas + Background-OFF fallthrough.

The approximately 1 px checkerboard seam around the 1:1 boundary remains a known cosmetic issue. Its edge count/location changes with responsive geometry (commonly top/bottom, sometimes top/bottom/right after maximizing). It is deliberately deferred and does not block this Stable promotion.'''
)

append_once(
    'HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md',
    '## 2026-09-07 Stable promotion to replay v0.1.5',
    f'''## 2026-09-07 Stable promotion to replay v0.1.5

Public replay advances to the exact Dev-tested v0.1.5 blob `{replay_blob}`. The source retains Stable v0.1.1's `KW_WD_BOOTH` state preference plus diagnostic fallback, adds the pre-BT `CK.environment.background.mesh` compatibility path, preserves native `CK.character.display.update()` execution and the validated synchronous post-update replay timing, and restores replay-owned background visibility before handing presentation ownership to Booth.

This handoff repair corresponds to the live state where the environment wrapper reported visible while the actual background mesh remained hidden. The final Dev environment/component smoke passed before promotion.'''
)

bootstrap_doc = read('HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md')
bootstrap_doc = bootstrap_doc.replace('Status: Dev candidate', 'Status: Public Stable (Dev validated before promotion)', 1)
if '## 2026-09-07 Stable promotion' not in bootstrap_doc:
    bootstrap_doc = bootstrap_doc.rstrip() + f'''\n\n## 2026-09-07 Stable promotion

The exact validated Dev runtime blob `{bootstrap_blob}` is promoted as hidden public module `booth-runtime-bootstrap`, ordered before `booth-tool`. It remains gated by the saved Booth Persistence default and strong saved Photo Booth signals; bare camera state remains insufficient. The module uses HeroForge's own same-origin `/gated/booth.js` plus named `BT.setBoothMode()` and does not create a public dependency on HF-Chat-Bridge or HeroForge.Compatibility main.\n'''
write('HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md', bootstrap_doc)

append_once(
    'HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md',
    '## 2026-09-07 Public cache-keyed loader repair',
    '''## 2026-09-07 Public cache-keyed loader repair

A live public page remained on an older branch-based raw GitHub manifest/module body even after the repository had advanced; hard refresh then obtained the current files. `Cache-Control: no-cache` on `GM_xmlhttpRequest` was therefore insufficient as the sole delivery strategy.

Public shell v1.2.1 ports the validated Dev cache-key design:

- every page load requests `manifest.json` with a unique `kwcache` session key;
- each module request receives a deterministic `kwcache` key derived from its manifest registry ID/version/build/path plus raw URL;
- existing query parameters are preserved;
- module execution order, enablement, and failure isolation remain unchanged;
- the manifest registry is now part of delivery identity, so a module version/build change changes its request URL automatically.

This fixes delivery freshness without introducing an external runtime service or changing the `Witch_Scripts` branch contract.'''
)

print('PUBLIC STABLE PROMOTION PATCH COMPLETED')

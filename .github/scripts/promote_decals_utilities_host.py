from pathlib import Path
import json
import subprocess

ROOT = Path('.')
DEV_COMMIT = '40fa227f13a79c5283f989c23b82485a273a2c53'
PUBLIC_BASE = 'b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6'


def run(*args, text=True):
    return subprocess.check_output(args, text=text).strip()


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected exactly one match, found {count}')
    return text.replace(old, new, 1)

head = run('git', 'rev-parse', 'HEAD')
if head != PUBLIC_BASE:
    raise RuntimeError(f'Expected public base {PUBLIC_BASE}, got {head}')

protected = [
    'HeroForge_UI/Corrected_Bound_Decal_Gizmo.js',
    'HeroForge_UI/corrected-bound-decal-gizmo/part-00.jsfrag',
    'HeroForge_UI/corrected-bound-decal-gizmo/part-01.jsfrag',
    'HeroForge_UI/corrected-bound-decal-gizmo/part-02.jsfrag',
    'HeroForge_UI/corrected-bound-decal-gizmo/part-03.jsfrag',
    'HeroForge_UI/corrected-bound-decal-gizmo/part-04.jsfrag',
    'features/media/Spinny_Mini_WebP.js',
    'features/media/Spinny_Mini_WebP_UI.js',
    'features/media/Photo_Booth_True_Resolution.js',
    'features/media/Photo_Booth_True_Resolution_UI.js',
]
protected_before = {p: run('git', 'rev-parse', f'HEAD:{p}') for p in protected}

# Copy the exact user-validated Dev host modules.
for path in ('tools/Decals.js', 'tools/Utilities.js'):
    data = subprocess.check_output(['git', 'show', f'{DEV_COMMIT}:{path}'])
    Path(path).write_bytes(data)

# Canonical module registry bumps only; no userscript-shell bump required.
manifest_path = Path('manifest.json')
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
registry = {item['id']: item for item in manifest['moduleRegistry']}
for module_id in ('decals-dev', 'utilities'):
    if module_id not in registry:
        raise RuntimeError(f'missing registry module {module_id}')
    registry[module_id]['version'] = '1.1.0'
    registry[module_id]['versionOrigin'] = 'stable-promoted-host-relocation'
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')

# Stable MASTER: record new host ownership without changing the gizmo service status.
master_path = Path('MASTER.md')
master = master_path.read_text(encoding='utf-8')
master = replace_once(
    master,
    '- Decals host + corrected bound decal gizmo: live; validated undo/redo and transform-state preservation remain unchanged.\n- Booth persistence/Black Canvas: live and unchanged by v1.2.0.\n- JSON: live.\n- Utilities: live; its tab presentation is now the pinned cog.',
    '- Decals tab: live placeholder — `New decal tools coming shortly!`.\n- Booth persistence/Black Canvas: live and unchanged by v1.2.0.\n- JSON: live.\n- Utilities: live; its pinned cog now hosts the Bound Decal Gizmo controls. The corrected gizmo service/runtime remains unchanged and Stable validated.',
    'MASTER live tools block'
)
master = replace_once(
    master,
    '1. One clean public v1.2.0 smoke after update: tab presentation, Developer Mode toggle/registry, compact High Res presence, and a cheap Spinny/download sanity check.',
    '1. One clean public v1.2.0 smoke after the latest module refresh: tab presentation, Decals placeholder, Bound Decal Gizmo controls in Utilities, Developer Mode toggle/registry, compact High Res presence, and a cheap Spinny/download sanity check.',
    'MASTER queue item'
)
master_path.write_text(master, encoding='utf-8')

# Stable gizmo history: delivery/UI host changed; runtime did not.
bound_path = Path('HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md')
bound = bound_path.read_text(encoding='utf-8')
bound = replace_once(
    bound,
    'Public Witch Dock loads the corrected gizmo through `manifest.json` as hidden module `corrected-bound-decal-gizmo`, then loads `tools/Decals.js` as the visible `Decals` tab host.\n\n`Witch_Dock.user.js` remains v1.0.8. The v1.1.0 gizmo repair is module-only, so installed users receive it on page refresh without a Tampermonkey shell update.',
    'Public Witch Dock loads the corrected gizmo through `manifest.json` as hidden module `corrected-bound-decal-gizmo`. Its user controls are now hosted by `tools/Utilities.js` under `Bound Decal Gizmo`; `tools/Decals.js` remains the visible Decals-tab host and currently displays `New decal tools coming shortly!`.\n\nThe host relocation was live-validated in `WITCH_DEV_UI` before Stable promotion. The corrected gizmo runtime, its persisted enable key, Move/Rotate/Scale behavior, undo/redo, and transform-preservation logic were not changed. `Witch_Dock.user.js` remains v1.2.0 for this module-only update, so installed users receive the host change on page refresh without a Tampermonkey shell update.',
    'BOUND delivery block'
)
bound_path.write_text(bound, encoding='utf-8')

pre_path = Path('PRE_FLIGHT_Check.md')
pre = pre_path.read_text(encoding='utf-8')
pre_entry = '''## PFC-2026-09-06-024 — Promote validated Decals/Utilities host cleanup to Stable\n\nDate: 2026-09-06\n\n### Scope\n\nPromote the live-validated UI-host relocation that moves the Corrected Bound Decal Gizmo controls from the Decals tab to Utilities and leaves a Decals placeholder for upcoming tools.\n\n### Required material reviewed\n\n- binding HeroForge.Compatibility project contract and current HFC tracking;\n- public `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, `manifest.json`;\n- public `tools/Decals.js`, `tools/Utilities.js`;\n- public `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js` and all five source fragments;\n- exact Dev candidate commit `40fa227f13a79c5283f989c23b82485a273a2c53`;\n- user live validation that the Decals placeholder, Utilities gizmo controls, persisted checkbox state, and Move/Rotate/Scale controls all work correctly.\n\n### Confirmed findings\n\n- the gizmo service owns its persisted enable state and exposes `enable`, `disable`, `setMode`, `refresh`, and `getState`;\n- moving the UI host does not require runtime/service changes;\n- Dev live smoke passed with one gizmo control block in Utilities and no gizmo controls in Decals;\n- `tools/Decals.js` and `tools/Utilities.js` require canonical version bumps to v1.1.0;\n- `Witch_Dock.user.js` does not require a version change because this is a manifest-delivered module-only update.\n\n### Conflict risks\n\n- do not modify the validated corrected-gizmo runtime or fragment sources;\n- preserve the existing gizmo enable storage key and current state across the host move;\n- do not duplicate controls in Decals and Utilities;\n- do not merge unrelated Dev changes into Stable.\n\n### Decision\n\nPromote only the two validated host modules, their canonical registry bumps, and durable documentation. Require syntax/manifest/protected-runtime/static checks before advancing public Stable.\n\n**Runtime behavior changed:** UI host/presentation only. Corrected gizmo runtime behavior is unchanged.\n\n---\n\n'''
if not pre.startswith('# Pre-Flight Check Log\n\n'):
    raise RuntimeError('unexpected PRE_FLIGHT header')
pre = '# Pre-Flight Check Log\n\n' + pre_entry + pre[len('# Pre-Flight Check Log\n\n'):]
pre_path.write_text(pre, encoding='utf-8')

change_path = Path('CHANGELOG.md')
change = change_path.read_text(encoding='utf-8')
change_entry = '''## DOCK-2026-09-06-024 — Move Bound Decal Gizmo controls to Utilities\n\nDate: 2026-09-06\n\n### Summary\n\nPromote the user-validated Decals/Utilities host cleanup as a module-only Stable update on Witch Dock v1.2.0.\n\n### Public runtime changes\n\n- `tools/Decals.js` advances to v1.1.0 and now displays `New decal tools coming shortly!`;\n- `tools/Utilities.js` advances to v1.1.0 and now owns the full Bound Decal Gizmo control section;\n- the existing gizmo toggle state remains sourced from the unchanged corrected-gizmo service;\n- Move / Rotate / Scale controls continue to call the same service API;\n- `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js` and its source fragments are unchanged;\n- public Witch Dock shell remains v1.2.0 because this is a manifest-delivered module update.\n\n### Live validation inherited from Dev\n\n- Decals placeholder: PASS;\n- gizmo controls appear once in Utilities: PASS;\n- persisted checkbox state: PASS;\n- toggle OFF/ON: PASS;\n- Move / Rotate / Scale selection: PASS.\n\n### Gate\n\nRequire JavaScript syntax, manifest/version, exact Dev-host blob, protected corrected-gizmo/media runtime hashes, changed-file whitelist, and `git diff --check` before Stable commit.\n\n**Runtime behavior changed:** UI host/presentation only; validated corrected-gizmo behavior remains unchanged.\n\n---\n\n'''
if not change.startswith('# Changelog\n\n'):
    raise RuntimeError('unexpected CHANGELOG header')
change = '# Changelog\n\n' + change_entry + change[len('# Changelog\n\n'):]
change_path.write_text(change, encoding='utf-8')

# Static validation.
subprocess.check_call(['node', '--check', 'tools/Decals.js'])
subprocess.check_call(['node', '--check', 'tools/Utilities.js'])
json.loads(manifest_path.read_text(encoding='utf-8'))

if Path('tools/Decals.js').read_bytes() != subprocess.check_output(['git', 'show', f'{DEV_COMMIT}:tools/Decals.js']):
    raise RuntimeError('Decals host does not match validated Dev blob')
if Path('tools/Utilities.js').read_bytes() != subprocess.check_output(['git', 'show', f'{DEV_COMMIT}:tools/Utilities.js']):
    raise RuntimeError('Utilities host does not match validated Dev blob')

text_decals = Path('tools/Decals.js').read_text(encoding='utf-8')
text_utils = Path('tools/Utilities.js').read_text(encoding='utf-8')
if 'New decal tools coming shortly!' not in text_decals:
    raise RuntimeError('Decals placeholder missing')
if 'Correct bound decal gizmo' in text_decals:
    raise RuntimeError('old gizmo controls still present in Decals')
if text_utils.count('title: "Bound Decal Gizmo"') != 1:
    raise RuntimeError('Utilities must contain exactly one Bound Decal Gizmo section')
for token in ('Correct bound decal gizmo', '["translate", "Move"]', '["rotate", "Rotate"]', '["scale", "Scale"]'):
    if token not in text_utils:
        raise RuntimeError(f'Utilities gizmo token missing: {token}')

manifest2 = json.loads(manifest_path.read_text(encoding='utf-8'))
reg2 = {item['id']: item for item in manifest2['moduleRegistry']}
if reg2['decals-dev']['version'] != '1.1.0' or reg2['utilities']['version'] != '1.1.0':
    raise RuntimeError('module versions not bumped')
if reg2['corrected-bound-decal-gizmo']['version'] != '1.1.0':
    raise RuntimeError('gizmo runtime registry changed unexpectedly')

protected_after = {p: run('git', 'hash-object', p) for p in protected}
for p, before in protected_before.items():
    if protected_after[p] != before:
        raise RuntimeError(f'protected runtime changed: {p}')

expected_changed = {
    'CHANGELOG.md',
    'HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md',
    'MASTER.md',
    'PRE_FLIGHT_Check.md',
    'manifest.json',
    'tools/Decals.js',
    'tools/Utilities.js',
}
changed = set(run('git', 'diff', '--name-only').splitlines())
if changed != expected_changed:
    raise RuntimeError(f'unexpected changed files: {sorted(changed ^ expected_changed)}; actual={sorted(changed)}')
subprocess.check_call(['git', 'diff', '--check'])
print('Stable Decals/Utilities host promotion gate: PASS')

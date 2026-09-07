from pathlib import Path
import json
import shutil

ROOT = Path('.')
DEV = Path('../dev')


def copy_from_dev(rel):
    src = DEV / rel
    dst = ROOT / rel
    if not src.exists():
        raise RuntimeError(f'Missing validated Dev source: {rel}')
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dst)


# Promote only validated runtime modules needed by this release.
for rel in [
    'features/core/Witch_Dock_Developer_Mode.js',
    'features/media/Photo_Booth_True_Resolution.js',
    'features/media/Photo_Booth_True_Resolution_UI.js',
    'MODULE_VERSIONING.md',
]:
    copy_from_dev(rel)

# Public-facing comment cleanup only; capture/provider runtime remains the validated Dev implementation.
service_path = ROOT / 'features/media/Photo_Booth_True_Resolution.js'
service = service_path.read_text()
service = service.replace(' * Witch Dock Dev feature: media.screenshot-resolution', ' * Witch Dock feature: media.screenshot-resolution', 1)
service_path.write_text(service)

# ---- Public shell: v1.2.0 + active-manifest diagnostics + validated tab presentation ----
core_path = ROOT / 'Witch_Dock.user.js'
core = core_path.read_text()
if '// @name         Witch Dock v1.1.0' not in core or '// @version      1.1.0' not in core:
    raise RuntimeError('Unexpected public Witch Dock version baseline')
core = core.replace('// @name         Witch Dock v1.1.0', '// @name         Witch Dock v1.2.0', 1)
core = core.replace('// @version      1.1.0', '// @version      1.2.0', 1)

manifest_anchor = 'const MANIFEST_URL = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/manifest.json";\n'
if manifest_anchor not in core:
    raise RuntimeError('Public MANIFEST_URL anchor missing')
if 'UW.KWWitchDockManifestURL = MANIFEST_URL;' not in core:
    core = core.replace(manifest_anchor, manifest_anchor + 'UW.KWWitchDockManifestURL = MANIFEST_URL;\n', 1)

if '.kwWDTab.kwWDTabIconOnly{' not in core:
    css_anchor = '  white-space: nowrap;\n}\n\n.kwWDTab[aria-selected="true"]{'
    css_insert = '''  white-space: nowrap;\n}\n.kwWDTab.kwWDTabIconOnly{\n  width: 32px;\n  min-width: 32px;\n  height: 29px;\n  padding: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.kwWDTab.kwWDTabIconOnly svg{\n  width: 16px;\n  height: 16px;\n  display: block;\n  pointer-events: none;\n}\n\n.kwWDTab[aria-selected="true"]{'''
    if css_anchor not in core:
        raise RuntimeError('Public tab CSS anchor missing')
    core = core.replace(css_anchor, css_insert, 1)

# Copy the already-live-tested tab order/icon implementation from the Dev shell exactly.
dev_core = (DEV / 'Witch_Dock_DEV.user.js').read_text()
dev_start = dev_core.index('  const TAB_ORDER_RANK = new Map([')
dev_end = dev_core.index('\n\n\nfunction makeIconBase()', dev_start)
dev_tab_chunk = dev_core[dev_start:dev_end]

target_start = core.index('  function ensureTab(name) {')
target_end = core.index('\n\n\nfunction makeIconBase()', target_start)
core = core[:target_start] + dev_tab_chunk + core[target_end:]
core_path.write_text(core)

# ---- Public manifest: use the tested Dev inventory/order, but point exclusively at Stable ----
dev_manifest = json.loads((DEV / 'manifest.json').read_text())
registry = [dict(x) for x in dev_manifest.get('moduleRegistry', []) if x.get('id') != 'witch-dock-dev-loader']
reg = {x['id']: x for x in registry}
required_registry = {
    'witch-dock-core', 'witch-dock-developer-mode', 'photo-booth-true-resolution',
    'photo-booth-true-resolution-ui', 'photo-booth-true-resolution-readiness',
    'spinny-mini-webp', 'spinny-mini-webp-ui', 'body-editor', 'pose-tool',
    'decals-dev', 'booth-tool', 'json-tool', 'utilities'
}
missing = required_registry.difference(reg)
if missing:
    raise RuntimeError(f'Dev module registry missing required IDs: {sorted(missing)}')

reg['witch-dock-core'].update({
    'version': '1.2.0',
    'build': '1.2.0-stable-ui-devmode',
    'versionOrigin': 'stable-release'
})
reg['witch-dock-developer-mode']['versionOrigin'] = 'stable-promoted'
reg['photo-booth-true-resolution']['versionOrigin'] = 'stable-promoted-service-ui-split'
reg['photo-booth-true-resolution-ui']['versionOrigin'] = 'stable-promoted-service-ui-split'
# Spinny runtime is intentionally not copied from Dev in this release; keep actual Stable build identities.
reg['spinny-mini-webp'].update({
    'version': '0.5.1',
    'build': '0.5.1-witch-dock-stable-download-scroll-guard',
    'versionOrigin': 'validated-hfc-v0.5.0-stable'
})
reg['spinny-mini-webp-ui'].update({
    'version': '0.1.1',
    'build': '0.1.1-stable-download-ux',
    'versionOrigin': 'stable-promoted'
})

tools = []
for item in dev_manifest.get('tools', []):
    if item.get('id') == 'witch-dock-dev-loader':
        continue
    entry = dict(item)
    if isinstance(entry.get('url'), str):
        entry['url'] = entry['url'].replace('/WITCH_DEV_UI/', '/Witch_Scripts/')
    tools.append(entry)

manifest = {
    'version': 1,
    'moduleRegistry': registry,
    'tools': tools,
}
(ROOT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')

# ---- Durable public docs ----
master = '''# Witch Dock Master

This is the canonical high-level source for current public Witch Dock state. Historical detail remains available in Git history and the HISTORY records.

## Current Stable

- Repository: `Knight-Witch/KnightWitch.Heroforge`
- Production branch: `Witch_Scripts`
- Public userscript: `Witch_Dock.user.js`
- Current public version: **1.2.0**
- HeroForge validation target for the promoted media/tooling work: `heroforge07.1.9.98`
- Runtime dependencies on HeroForge.Compatibility unstable head or HF-Chat-Bridge: **none**

Witch Dock v1.2.0 is a narrow promotion of three separately live-tested Dev deltas on top of v1.1.0 Spinny Mini WebP. It is not a wholesale merge of `WITCH_DEV_UI`.

## Public tab presentation

Default/structural visible tab order:

`Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`

- The historical `Body Editor` internal tab key remains compatible while the visible label is `Body`.
- Utilities is an icon-only cog with tooltip/ARIA label `Utilities`.
- Utilities is structurally pinned last; future/unknown tabs are inserted before it.
- Persisted active-tab behavior was live tested in Dev before promotion.

## Developer Mode

Public Developer Mode: `features/core/Witch_Dock_Developer_Mode.js` v0.3.0 / build `0.3.0-public-ready-manifest-source`.

- optional and OFF by default for users without a saved preference;
- toggled only from the Witch Dock About section;
- persists the user's chosen state;
- exposes canonical module versions/runtime builds and tool IDs for troubleshooting;
- About includes a `Module Versions` inventory covering active core, visible, hidden, and conditional modules;
- Developer-only controls such as Spinny Short Test and High Res provider diagnostics appear only while enabled;
- registry failure is diagnostic-only and must not disable ordinary Witch Dock behavior;
- registry source follows the manifest URL advertised by the active Witch Dock host, with public Stable manifest as fallback.

`manifest.json.moduleRegistry` is now the canonical public active-module version registry. Versioning policy: `MODULE_VERSIONING.md`.

## Photo Booth true resolution

Feature ID: `media.screenshot-resolution`.

- Service: v0.8.0 / build `0.8.0-service-only-provider`.
- UI: v0.3.0 / build `0.3.0-service-ui-ownership`.
- Readiness adapter: v1.0.0 / build `1.0.0-public-readiness`.
- The service exclusively owns validated TRUE 4K/8K capture/provider behavior.
- The compact UI exclusively owns the visible `High Res Image Capture` Booth section.
- Normal presentation is `Capture: [4K] [8K]` with compact status.
- Developer Mode reveals provider enable/recovery and build diagnostics.
- The service/UI ownership split, provider disable/re-enable recovery, direct TRUE 4K, direct TRUE 8K, and Spinny coexistence all passed live Dev validation before promotion.
- Validated capture/provider function bodies were preserved across the service/UI ownership cleanup.

Detailed record: `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`.

## Spinny Mini WebP

Feature ID: `media.spinny-mini-webp`.

- Service remains public v0.5.1 / build `0.5.1-witch-dock-stable-download-scroll-guard`.
- UI remains public v0.1.1 / build `0.1.1-stable-download-ux`.
- This v1.2.0 promotion does **not** modify the validated Spinny capture engine or UI source.
- 1024/2048 native capture and repaired TRUE-3K 3072 remain available.
- Pause/Resume, cancel, ETA/progress, draggable popout, silent wheel block, other capture-continuity warnings, and privileged downloads remain unchanged.
- Short Test remains hidden in normal mode and becomes visible when Developer Mode is enabled.

Detailed record: `HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md`.

## Other live tools

- Body Editor / Body tab: live.
- Pose: live.
- Decals host + corrected bound decal gizmo: live; validated undo/redo and transform-state preservation remain unchanged.
- Booth persistence/Black Canvas: live and unchanged by v1.2.0.
- JSON: live.
- Utilities: live; its tab presentation is now the pinned cog.

## Active module version contract

Every active runtime module has one canonical numeric version in `manifest.json.moduleRegistry`. Runtime/UI/API/storage/compatibility changes require a matching registry bump in the same committed update. Source-local build tags remain supplemental diagnostics.

## Current integration rules

- `Witch_Scripts` is production; experiments validate separately before promotion.
- Promote accepted deltas only; do not merge diverged Dev branches wholesale.
- Preserve validated capture math, timing/state sequencing, lifecycle restoration, capability gates, and failure isolation.
- Public Stable must not depend on HF-Chat-Bridge or an unstable Compatibility/Foundation development head.

## Current queue

1. One clean public v1.2.0 smoke after update: tab presentation, Developer Mode toggle/registry, compact High Res presence, and a cheap Spinny/download sanity check.
2. Continue unrelated compatibility/reconstruction work only as separately scoped features.

The previously discussed 4096 animated-WebP expansion and Developer Mode hotkey are **not active roadmap items** and require no further work unless explicitly reopened later.

## Durable records

- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `MODULE_VERSIONING.md`
- `HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md`
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`
- `HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md`
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md`
'''
(ROOT / 'MASTER.md').write_text(master)


def prepend_after_title(path, title, block):
    p = ROOT / path
    text = p.read_text()
    marker = title + '\n\n'
    if not text.startswith(marker):
        raise RuntimeError(f'Unexpected {path} header')
    if block.strip() in text:
        return
    p.write_text(marker + block.rstrip() + '\n\n---\n\n' + text[len(marker):])


prepend_after_title(
    'CHANGELOG.md', '# Changelog',
    '''## DOCK-2026-09-06-023 — Release Witch Dock v1.2.0 UI/diagnostics cleanup

Date: 2026-09-06

### Summary

Promote the three independently live-tested `WITCH_DEV_UI` deltas approved by the user after the v1.1.0 Spinny release: tab presentation/order cleanup, compact High Res service/UI ownership separation, and public-ready Developer Mode. This is a narrow Stable promotion, not a Dev-branch merge.

### Public runtime changes

- Witch Dock userscript advances to v1.2.0.
- Visible tab order is structurally enforced as `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`.
- `Body Editor` displays as `Body` without changing its persisted/internal tab identity.
- Utilities is an SVG cog with `Utilities` tooltip/ARIA label and is structurally pinned last.
- High Res service advances to v0.8.0 service-only ownership; compact UI v0.3.0 becomes the sole presentation owner.
- Developer Mode v0.3.0 becomes a public hidden module, optional/default-OFF and toggled only from About.
- Public `manifest.json` gains the canonical active-module version registry required by Developer Mode diagnostics.
- Public shell advertises the manifest it actually loaded so diagnostics report Stable versions rather than Dev versions.
- Spinny service/UI source remains byte-for-byte untouched by this release; Developer Mode only reveals its existing Short Test control.

### Live validation inherited from Dev

- tab order/cog/correct tool routing/active-tab persistence: PASS;
- compact High Res UI/no duplicate legacy section: PASS;
- High Res provider disable -> enable recovery: PASS;
- direct TRUE 4K and TRUE 8K: PASS;
- Spinny coexistence: PASS;
- Developer Mode About toggle, persistence, active-manifest versions, per-tool diagnostics, module inventory, Spinny Short Test visibility, High Res developer controls, and OFF cleanup: PASS by final user acceptance (`everything works great`).

### Removed from active roadmap

- 4096 animated WebP expansion: no further work planned unless explicitly reopened;
- Developer Mode hotkey: no further work planned; About remains the intended control surface.

### Gate

Static syntax/manifest/ownership/hash checks must pass on the Stable candidate before `Witch_Scripts` advances. One clean public v1.2.0 smoke remains after release.

**Runtime behavior changed:** yes — public UI/diagnostic release; validated media capture math and Spinny runtime remain unchanged.'''
)

prepend_after_title(
    'PRE_FLIGHT_Check.md', '# Pre-Flight Check Log',
    '''## PFC-2026-09-06-023 — Promote validated Witch Dock UI/Developer Mode delta to Stable

Date: 2026-09-06

### Required material reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md`;
- HFC `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- public v1.1.0 `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `Witch_Dock.user.js`, `manifest.json`, High Res service, Spinny service/UI;
- validated `WITCH_DEV_UI` tab cleanup, High Res v0.8.0/v0.3.0 ownership split, Developer Mode v0.3.0, module registry and Dev loader manifest-source boundary.

### Confirmed live findings

- tab cleanup passed order, Utilities cog tooltip, correct tool routing, and persisted active-tab restoration;
- High Res ownership cleanup passed compact/no-duplicate presentation, developer diagnostics, provider disable/re-enable, TRUE 4K, TRUE 8K, Spinny coexistence, and prior tab behavior;
- Developer Mode public-readiness build passed the requested live gate by final user report that everything works great;
- user explicitly approved public rollout;
- user explicitly removed 4096 animated WebP and Developer Mode hotkey from the active to-do list.

### Target files

- `Witch_Dock.user.js`
- `manifest.json`
- `features/core/Witch_Dock_Developer_Mode.js`
- `features/media/Photo_Booth_True_Resolution.js`
- `features/media/Photo_Booth_True_Resolution_UI.js`
- `MODULE_VERSIONING.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- relevant HISTORY records

### Conflict risks

- do not merge `WITCH_DEV_UI` wholesale;
- do not modify public Spinny service/UI runtime source;
- preserve validated TRUE 4K/8K capture/provider function behavior and readiness adapter;
- Developer Mode must remain optional, default OFF, About-only, and diagnostic-failure isolated;
- public diagnostics must read the active public manifest rather than Dev registry state;
- Utilities-last behavior must be structural rather than manifest-timing-only;
- no HF-Chat-Bridge or unstable HFC runtime dependency may enter Stable.

### Decision

Build a Stable candidate from current v1.1.0, copy only the validated feature modules, port only the tested tab shell delta, create the public module registry, run syntax/manifest/hash/ownership gates, then fast-forward `Witch_Scripts` only on success.

**Runtime behavior changed:** yes — approved Stable UI/diagnostics promotion.'''
)

# Public Developer Mode durable record: promote the Dev history if available, then append Stable disposition.
dev_history = DEV / 'HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md'
if dev_history.exists():
    dst = ROOT / 'HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md'
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(dev_history, dst)
    text = dst.read_text().rstrip()
    text += '''\n\n## 2026-09-06 public Stable promotion\n\nDeveloper Mode v0.3.0 is approved for public Witch Dock v1.2.0. It remains optional/default-OFF and About-only. The active loader advertises its manifest URL, so module diagnostics follow the currently loaded Witch Dock build. The public-readiness live gate passed before promotion. The optional hotkey is not planned and has been removed from the active roadmap.\n'''
    dst.write_text(text + '\n')

for rel, block in [
    ('HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md', '''\n## 2026-09-06 Witch Dock v1.2.0 presentation ownership promotion\n\nThe live-validated v0.8.0 service-only / v0.3.0 compact-UI ownership split is promoted to Stable. The service owns capture/provider behavior; the UI owns the visible Booth presentation. Provider disable/re-enable, direct TRUE 4K, direct TRUE 8K, and Spinny coexistence passed in Dev before promotion. Validated capture/provider math was not intentionally changed.\n'''),
    ('HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md', '''\n## 2026-09-06 Witch Dock v1.2.0 Developer Mode visibility\n\nSpinny service/UI runtime source is unchanged from public v1.1.0. Public Developer Mode v0.3.0 now exposes the existing 16-frame Short Test while enabled; normal mode continues to hide it. The previously discussed 4096 animated-WebP expansion is not an active roadmap item.\n'''),
]:
    p = ROOT / rel
    if p.exists():
        text = p.read_text().rstrip()
        if block.strip() not in text:
            p.write_text(text + '\n' + block + '\n')

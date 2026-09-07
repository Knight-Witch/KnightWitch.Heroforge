from pathlib import Path
import json

core = Path('Witch_Dock.user.js').read_text()
devmode = Path('features/core/Witch_Dock_Developer_Mode.js').read_text()
high = Path('features/media/Photo_Booth_True_Resolution.js').read_text()
high_dev = Path('../dev/features/media/Photo_Booth_True_Resolution.js').read_text()
high_ui = Path('features/media/Photo_Booth_True_Resolution_UI.js').read_text()
high_ui_dev = Path('../dev/features/media/Photo_Booth_True_Resolution_UI.js').read_text()
devmode_dev = Path('../dev/features/core/Witch_Dock_Developer_Mode.js').read_text()
spin = Path('features/media/Spinny_Mini_WebP.js').read_text()
spin_ui = Path('features/media/Spinny_Mini_WebP_UI.js').read_text()
m = json.loads(Path('manifest.json').read_text())

assert '// @name         Witch Dock v1.2.0' in core
assert '// @version      1.2.0' in core
assert 'UW.KWWitchDockManifestURL = MANIFEST_URL;' in core
for needle in [
    'const TAB_ORDER_RANK = new Map([',
    '["Decals", 20]',
    '["Booth", 30]',
    '["Utilities", 1000]',
    'function reorderTabButtons()',
    'function makeTabCogIcon()',
    'name === "Body Editor" ? "Body" : name',
    'btn.title = "Utilities";',
    '.kwWDTab.kwWDTabIconOnly',
]:
    assert needle in core, needle

marker = '(function () {'
assert high[high.index(marker):] == high_dev[high_dev.index(marker):]
assert high_ui == high_ui_dev
assert devmode == devmode_dev
assert 'function registerTool()' not in high
assert 'function buildUI(' not in high
assert '0.8.0-service-only-provider' in high
assert '0.3.0-service-ui-ownership' in high_ui

assert "const BUILD = '0.3.0-public-ready-manifest-source';" in devmode
assert "return UW.localStorage.getItem(STORE_KEY) === 'true'" in devmode
assert 'KWWitchDockManifestURL' in devmode
assert 'WITCH_DEV_UI/manifest.json' not in devmode
assert 'Witch_Scripts/manifest.json' in devmode

assert '0.5.1-witch-dock-stable-download-scroll-guard' in spin
assert '0.1.1-stable-download-ux' in spin_ui
assert 'GM_download' in core

registry = m.get('moduleRegistry')
assert isinstance(registry, list) and registry
ids = [x['id'] for x in registry]
assert len(ids) == len(set(ids)), 'duplicate moduleRegistry IDs'
assert 'witch-dock-dev-loader' not in ids
reg = {x['id']: x for x in registry}
assert reg['witch-dock-core']['version'] == '1.2.0'
assert reg['witch-dock-developer-mode']['version'] == '0.3.0'
assert reg['photo-booth-true-resolution']['version'] == '0.8.0'
assert reg['photo-booth-true-resolution-ui']['version'] == '0.3.0'
assert reg['spinny-mini-webp']['build'] == '0.5.1-witch-dock-stable-download-scroll-guard'
assert reg['spinny-mini-webp-ui']['build'] == '0.1.1-stable-download-ux'

tools = m['tools']
tool_ids = [x['id'] for x in tools]
assert len(tool_ids) == len(set(tool_ids)), 'duplicate tool IDs'
order = ['body-editor', 'pose-tool', 'decals-dev', 'booth-tool', 'json-tool', 'utilities']
positions = [tool_ids.index(x) for x in order]
assert positions == sorted(positions), (order, positions)
assert tool_ids[-1] == 'utilities', tool_ids[-3:]
dev_entry = next(x for x in tools if x['id'] == 'witch-dock-developer-mode')
assert dev_entry.get('hidden') is True and dev_entry.get('enabledByDefault') is True
assert all('/WITCH_DEV_UI/' not in x.get('url', '') for x in tools)
assert all('/Witch_Scripts/' in x.get('url', '') for x in tools if x.get('url'))

runtime_text = '\n'.join([core, devmode, high, high_ui, Path('manifest.json').read_text()])
assert '/WITCH_DEV_UI/' not in runtime_text
assert '4096 animated-WebP expansion and Developer Mode hotkey are **not active roadmap items**' in Path('MASTER.md').read_text()
print('Witch Dock v1.2.0 Stable static gate: PASS')

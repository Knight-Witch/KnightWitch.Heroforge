from pathlib import Path
import json, re

service_path = Path('features/media/Photo_Booth_True_Resolution.js')
ui_path = Path('features/media/Photo_Booth_True_Resolution_UI.js')
manifest_path = Path('manifest.json')

service = service_path.read_text()
ui = ui_path.read_text()

# Preserve fingerprints of validated capture/provider functions. These must remain byte-identical.
def extract_function(text, name):
    marker = f'  function {name}('
    start = text.index(marker)
    brace = text.index('{', start)
    depth = 0
    i = brace
    while i < len(text):
        ch = text[i]
        if ch == '{': depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                return text[start:i+1]
        i += 1
    raise RuntimeError(f'Could not extract function {name}')

protected_names = [
    'classifyModelRender', 'phaseCoordinateFromOffset', 'withCameraOffsets',
    'makePhaseCanvas', 'runTrueResolutionCapture', 'providerStatusText',
    'installProvider', 'restoreProvider', 'reconcileProvider',
    'canvasToBlob', 'downloadBlob', 'captureAndDownload', 'setEnabled'
]
protected_before = {name: extract_function(service, name) for name in protected_names}

service = service.replace('Build: 0.7.0-witch-dock-dev-provider', 'Build: 0.8.0-service-only-provider')
service = service.replace("  const TOOL_ID = 'photo-booth-true-resolution';\n", '')
service = service.replace("  const BUILD = '0.7.0-witch-dock-dev-provider';", "  const BUILD = '0.8.0-service-only-provider';")
service = service.replace("  const STYLE_ID = 'kwPBTrueResolutionStyle';\n", '')
service = service.replace("    registerTimer: null,\n    toolRegistered: false,\n", '')
service = re.sub(r"    ui: \{\n      enabled: null,\n      button4K: null,\n      button8K: null,\n      provider: null,\n      status: null\n    \}\n", '', service)
# Remove dangling comma before close if state now has one after lastError.
service = service.replace("    lastStatus: 'Waiting for HeroForge Photo Booth runtime…',\n    lastError: null,\n  };", "    lastStatus: 'Waiting for HeroForge Photo Booth runtime…',\n    lastError: null\n  };")

# Replace the old DOM-bound UI block with a service-only state notification hook.
start = service.index('  function ensureStyles() {')
end = service.index('  function initialize() {', start)
replacement = '''  // Internal name retained to avoid rewriting validated provider/capture call sites.\n  // It no longer mutates DOM; the separate UI module is the sole presentation owner.\n  function updateUI() {\n    try {\n      window.dispatchEvent(new CustomEvent('kw:photo-booth-true-resolution-state', {\n        detail: { build: BUILD, enabled: state.enabled, busy: state.busy, providerInstalled: state.providerInstalled, providerLost: state.providerLost }\n      }));\n    } catch (_) {}\n  }\n\n'''
service = service[:start] + replacement + service[end:]

old_init = '''  function initialize() {\n    if (state.initialized) return true;\n    state.enabled = readStoredEnabled();\n    state.initialized = true;\n    installProvider();\n    if (!registerTool()) {\n      state.registerTimer = window.setInterval(() => {\n        if (!state.initialized || registerTool()) {\n          window.clearInterval(state.registerTimer);\n          state.registerTimer = null;\n        }\n      }, 200);\n    }\n    state.reconcileTimer = window.setInterval(reconcileProvider, 1000);\n    updateUI();\n    return true;\n  }\n'''
new_init = '''  function initialize() {\n    if (state.initialized) return true;\n    state.enabled = readStoredEnabled();\n    state.initialized = true;\n    installProvider();\n    state.reconcileTimer = window.setInterval(reconcileProvider, 1000);\n    updateUI();\n    return true;\n  }\n'''
if old_init not in service:
    raise RuntimeError('Expected initialize block not found')
service = service.replace(old_init, new_init)

old_dispose = '''    if (state.reconcileTimer) window.clearInterval(state.reconcileTimer);\n    state.reconcileTimer = null;\n    if (state.registerTimer) window.clearInterval(state.registerTimer);\n    state.registerTimer = null;\n    restoreProvider();\n    document.getElementById(STYLE_ID)?.remove();\n    state.initialized = false;\n    state.lastStatus = 'Disposed. Reload Witch Dock to remount the registered UI section.';\n'''
new_dispose = '''    if (state.reconcileTimer) window.clearInterval(state.reconcileTimer);\n    state.reconcileTimer = null;\n    restoreProvider();\n    state.initialized = false;\n    state.lastStatus = 'Disposed.';\n'''
if old_dispose not in service:
    raise RuntimeError('Expected dispose block not found')
service = service.replace(old_dispose, new_dispose)

service = service.replace("    get lastCapture() { return state.lastCapture; }\n", "    get lastCapture() { return state.lastCapture; },\n    get status() { return state.lastStatus; },\n    get lastError() { return state.lastError; },\n    get busy() { return state.busy; }\n")

# Verify capture/provider implementation bodies remain byte-identical.
for name, before in protected_before.items():
    after = extract_function(service, name)
    if after != before:
        raise RuntimeError(f'Protected validated function changed: {name}')

if 'registerTool' in service or 'buildUI' in service or 'kwPBResRoot' in service or 'kwPBResBtn' in service:
    raise RuntimeError('Service still contains presentation ownership')
if 'WitchDock.registerTool' in service:
    raise RuntimeError('Service still registers Witch Dock UI')

service_path.write_text(service)

# UI becomes the explicit sole presentation owner; no behavior change to capture math.
ui = ui.replace('// @name         Witch Dock DEV - High Res Image Capture UI', '// @name         Witch Dock - High Res Image Capture UI')
ui = ui.replace('// @version      0.2.0', '// @version      0.3.0')
ui = ui.replace('// @description  Dev UI adapter for Witch Dock\'s validated 4K/8K Photo Booth capture service, with Developer Mode diagnostics.', '// @description  Sole Witch Dock presentation owner for the validated 4K/8K Photo Booth capture service, with Developer Mode diagnostics.')
ui = ui.replace(' * Witch Dock Dev UI adapter for media.screenshot-resolution.\n * Presentation-only host for the already-validated true-resolution capture service.\n * Capture math/provider ownership remains in Photo_Booth_True_Resolution.js.', ' * Witch Dock UI owner for media.screenshot-resolution.\n * Presentation-only host for the already-validated true-resolution capture service.\n * Capture math/provider ownership remains exclusively in Photo_Booth_True_Resolution.js.')
ui = ui.replace("  const BUILD = '0.2.0-dev-developer-mode';", "  const BUILD = '0.3.0-service-ui-ownership';")
ui_path.write_text(ui)

manifest = json.loads(manifest_path.read_text())
for module in manifest['moduleRegistry']:
    if module['id'] == 'photo-booth-true-resolution':
        module['version'] = '0.8.0'
        module['build'] = '0.8.0-service-only-provider'
    elif module['id'] == 'photo-booth-true-resolution-ui':
        module['version'] = '0.3.0'
        module['build'] = '0.3.0-service-ui-ownership'

for tool in manifest['tools']:
    if tool['id'] == 'photo-booth-true-resolution':
        tool['title'] = 'High Res Image Capture Service'
        tool['tab'] = 'HeroForge UI'
        tool['hidden'] = True
        tool['type'] = 'heroForgeUI'
    elif tool['id'] == 'photo-booth-true-resolution-ui':
        tool['title'] = 'High Res Image Capture UI'
        tool['tab'] = 'HeroForge UI'
        tool['hidden'] = True
        tool['type'] = 'heroForgeUI'

manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')

# Durable tracking.
change = Path('CHANGELOG.md')
text = change.read_text()
entry = '''## DOCK-2026-09-06-031 — Separate High Res capture service and UI ownership\n\nDate: 2026-09-06\n\n### Changes\n\n- `Photo_Booth_True_Resolution.js` v0.8.0 is now service/provider-only and no longer creates DOM, styles, or registers the Booth tool.\n- The validated capture/provider function bodies are byte-identical to the prior v0.7.0 Dev service; only presentation ownership/lifecycle metadata changed.\n- `Photo_Booth_True_Resolution_UI.js` v0.3.0 is the sole Witch Dock presentation owner for `High Res Image Capture`.\n- The service is manifest-loaded as a hidden runtime service; the UI self-registers the visible Booth section after the service is available.\n- Readiness adapter remains unchanged and continues to synchronize `.kwPBResBtn` controls.\n- Compact normal UI and Developer-Mode provider diagnostics are preserved.\n\n### Gate\n\nStatic ownership/syntax/manifest checks pass. Live Dev regression required: compact UI, direct TRUE 4K, direct TRUE 8K, Developer Mode provider disable -> enable recovery, and existing Spinny/Booth coexistence.\n\n**Runtime behavior changed:** yes, Dev architecture/presentation ownership only. Validated 4K/8K capture math unchanged.\n\n---\n\n'''
marker = '# Changelog\n\n'
text = marker + entry + text[len(marker):] if text.startswith(marker) else entry + text
change.write_text(text)

pre = Path('PRE_FLIGHT_Check.md')
text = pre.read_text()
entry = '''## PFC-2026-09-06-031 — High Res service/UI ownership cleanup\n\nDate: 2026-09-06\n\n### Confirmed diagnosis\n\nThe Dev capture service still owned the legacy full Booth UI and registered `photo-booth-true-resolution`, while the compact presentation adapter later re-registered the same tool ID. This was the documented temporary migration technique and is no longer acceptable for Stable promotion.\n\n### Target files\n\n- `features/media/Photo_Booth_True_Resolution.js`\n- `features/media/Photo_Booth_True_Resolution_UI.js`\n- `manifest.json`\n- `MASTER.md`\n- `PRE_FLIGHT_Check.md`\n- `CHANGELOG.md`\n- `HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md`\n\n### Conflict risks\n\n- preserve validated 4K/8K Effects-source/phase-feed/provider functions byte-for-byte;\n- preserve `BT.maker.takeScreenshot` provider ownership and restore/reconcile sequencing;\n- preserve readiness adapter and compact button selectors;\n- preserve Developer Mode provider recovery controls;\n- do not modify Spinny or public Stable in this stage.\n\n### Decision\n\nMake the capture module service-only and the compact UI adapter the sole Witch Dock presentation owner. Require direct 4K/8K and disable/enable live regression before Stable promotion.\n\n**Runtime behavior changed:** yes, Dev ownership/lifecycle only.\n\n---\n\n'''
marker = '# Pre-Flight Check Log\n\n'
text = marker + entry + text[len(marker):] if text.startswith(marker) else entry + text
pre.write_text(text)

master = Path('MASTER.md')
text = master.read_text()
old = '`features/media/Photo_Booth_True_Resolution_UI.js` build `0.2.0-dev-developer-mode` is the compact presentation adapter over the Stable true-resolution service.'
new = '`features/media/Photo_Booth_True_Resolution_UI.js` v0.3.0 / build `0.3.0-service-ui-ownership` is the sole compact presentation owner over service-only `Photo_Booth_True_Resolution.js` v0.8.0 / build `0.8.0-service-only-provider`.'
text = text.replace(old, new)
text = text.replace('Standalone visual smoke: **PASS by user report**. Direct 4K/8K regression through the compact UI and provider disable/re-enable recovery remain separately unconfirmed.', 'Prior compact visual smoke: **PASS by user report**. Service/UI ownership cleanup is implemented in Dev; direct 4K/8K regression and provider disable/re-enable recovery are the current live gate.')
master.write_text(text)

follow = Path('HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md')
text = follow.read_text()
entry = '''\n## 2026-09-06 High Res ownership cleanup — Dev candidate implemented\n\nThe temporary same-ID UI replacement architecture has been removed in Dev. `Photo_Booth_True_Resolution.js` v0.8.0 is service/provider-only; `Photo_Booth_True_Resolution_UI.js` v0.3.0 is the sole compact Witch Dock presentation owner. The readiness adapter remains unchanged. Static gate verifies the validated capture/provider function bodies are byte-identical to the pre-cleanup service.\n\nLive gate: compact normal presentation, TRUE 4K, TRUE 8K, Developer Mode provider disable -> enable recovery, and coexistence with the Booth/Spinny tools.\n'''
if '## 2026-09-06 High Res ownership cleanup — Dev candidate implemented' not in text:
    text += entry
follow.write_text(text)

from pathlib import Path
import json

# ---- Developer Mode module ----
p = Path('features/core/Witch_Dock_Developer_Mode.js')
s = p.read_text()
repls = {
    '// @name         Witch Dock DEV - Developer Mode': '// @name         Witch Dock - Developer Mode',
    '// @version      0.2.0': '// @version      0.3.0',
    '// @description  Shared Witch Dock developer-mode toggle, canonical module version registry, and developer-only diagnostics host.': '// @description  Optional Witch Dock troubleshooting mode with module versions, runtime builds, and recovery diagnostics.',
    "  const BUILD = '0.2.0-dev-module-version-registry';": "  const BUILD = '0.3.0-public-ready-manifest-source';",
    "  const REGISTRY_URL = 'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/manifest.json';": "  const STABLE_REGISTRY_URL = 'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/manifest.json';",
    "    try {\n      const response = await fetch(REGISTRY_URL, { cache: 'no-store' });": "    try {\n      const sourceUrl = getRegistryUrl();\n      const response = await fetch(sourceUrl, { cache: 'no-store' });",
    "      hint.textContent = 'Shows canonical module versions, tool IDs/builds, and troubleshooting controls intended for development or recovery.';": "      hint.textContent = 'Shows module versions, runtime builds, and troubleshooting controls. Developer Mode is optional and off by default.';",
    "    version: '0.2.0',": "    version: '0.3.0',",
    "    reloadModuleRegistry: loadModuleRegistry,": "    reloadModuleRegistry: loadModuleRegistry,\n    getRegistryUrl,",
}
for old, new in repls.items():
    if old not in s:
        raise RuntimeError(f'Developer Mode expected text not found: {old[:80]}')
    s = s.replace(old, new, 1)

anchor = "  function registerToolMeta(def) {\n"
if anchor not in s:
    raise RuntimeError('Developer Mode insertion anchor missing')
registry_fn = """  function getRegistryUrl() {\n    try {\n      const runtimeUrl = UW && typeof UW.KWWitchDockManifestURL === 'string'\n        ? UW.KWWitchDockManifestURL.trim()\n        : '';\n      if (runtimeUrl) return runtimeUrl;\n    } catch (_) {}\n    return STABLE_REGISTRY_URL;\n  }\n\n"""
s = s.replace(anchor, registry_fn + anchor, 1)
if 'WITCH_DEV_UI/manifest.json' in s:
    raise RuntimeError('Developer Mode still hardcodes WITCH_DEV_UI manifest')
p.write_text(s)

# ---- Dev loader advertises the manifest it actually loaded ----
p = Path('Witch_Dock_DEV.user.js')
s = p.read_text()
if '// @version      1.0.8.3' not in s:
    raise RuntimeError('Dev loader version anchor missing')
s = s.replace('// @version      1.0.8.3', '// @version      1.0.8.4', 1)
anchor = 'const MANIFEST_URL = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/manifest.json";\n'
if anchor not in s:
    raise RuntimeError('Dev loader MANIFEST_URL anchor missing')
s = s.replace(anchor, anchor + 'UW.KWWitchDockManifestURL = MANIFEST_URL;\n', 1)
p.write_text(s)

# ---- Canonical module versions ----
p = Path('manifest.json')
m = json.loads(p.read_text())
reg = {x['id']: x for x in m['moduleRegistry']}
reg['witch-dock-developer-mode']['version'] = '0.3.0'
reg['witch-dock-developer-mode']['build'] = '0.3.0-public-ready-manifest-source'
reg['witch-dock-dev-loader']['version'] = '0.4.0'
reg['witch-dock-dev-loader']['build'] = '1.0.8.4-devmode-manifest-source'
p.write_text(json.dumps(m, indent=2) + '\n')

# ---- Durable docs for runtime candidate ----
def prepend_after_title(path, title, block):
    p = Path(path)
    text = p.read_text()
    marker = title + '\n\n'
    if block.strip() in text:
        return
    if not text.startswith(marker):
        raise RuntimeError(f'Unexpected {path} header')
    p.write_text(marker + block.rstrip() + '\n\n---\n\n' + text[len(marker):])

prepend_after_title(
    'CHANGELOG.md', '# Changelog',
    """## DOCK-2026-09-06-033 — Make Developer Mode public-ready in Dev

Date: 2026-09-06

### Changes

- Developer Mode advances to v0.3.0 / build `0.3.0-public-ready-manifest-source`.
- Product surface remains About-only, persistent, optional, and OFF by default.
- Developer Mode no longer hardcodes the `WITCH_DEV_UI` manifest. It resolves the module registry from the manifest URL advertised by the active Witch Dock host, with public `Witch_Scripts/manifest.json` only as a fallback.
- Dev loader now advertises its actual manifest URL through `KWWitchDockManifestURL` and advances to v0.4.0 / build `1.0.8.4-devmode-manifest-source` (`@version` 1.0.8.4).
- Troubleshooting UI continues to expose per-tool IDs/version/build rows, About `Module Versions`, Spinny Short Test visibility, and High Res recovery diagnostics only while Developer Mode is enabled.
- No hotkey or non-About activation surface is added.

### Gate

Static syntax/manifest/source assertions pass before commit. Live Dev smoke is required for default-off behavior, About toggle persistence, correct Dev registry versions, per-tool rows, module inventory, Spinny Short Test gating, High Res developer controls, and normal-mode cleanup.

**Runtime behavior changed:** yes, Dev diagnostics/host metadata only. Public Stable remains unchanged."""
)

prepend_after_title(
    'PRE_FLIGHT_Check.md', '# Pre-Flight Check Log',
    """## PFC-2026-09-06-033 — Developer Mode public-readiness

Date: 2026-09-06

### Required material reviewed

- binding HeroForge.Compatibility project contract, architecture/inventory/compatibility/ownership/testing state;
- Witch Dock `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, current `manifest.json`;
- `features/core/Witch_Dock_Developer_Mode.js` v0.2.0 behavior;
- Dev loader manifest ownership;
- validated tab cleanup and High Res service/UI cleanup;
- Spinny Developer-Mode Short Test consumer and High Res Developer-Mode recovery consumer.

### Confirmed finding

Developer Mode already satisfies the accepted product shape (About-only, persistent, default OFF), but its module registry URL is hardcoded to `WITCH_DEV_UI`. Shipping that source unchanged would make public users inspect Dev registry versions instead of the manifest actually loaded by their Witch Dock.

### Decision

Make the active loader advertise its manifest URL and make Developer Mode resolve its registry from that host-owned URL, with Stable fallback. Preserve all existing normal-mode behavior and Developer-only consumer contracts. Require live Dev smoke before any Stable promotion.

### Conflict risks

- Developer Mode failure must remain diagnostic-only;
- default OFF and existing storage key must not change;
- normal users must not see per-tool rows, Module Versions, Short Test, or provider recovery controls;
- no dependence on HF-Chat-Bridge or unstable Compatibility runtime heads;
- module versions must bump with runtime changes.

**Runtime behavior changed:** yes, Dev diagnostics/manifest-source boundary only."""
)

p = Path('MASTER.md')
text = p.read_text()
text = text.replace(
    '`features/core/Witch_Dock_Developer_Mode.js` build `0.2.0-dev-module-version-registry` is the current Dev candidate.',
    '`features/core/Witch_Dock_Developer_Mode.js` v0.3.0 / build `0.3.0-public-ready-manifest-source` is the current public-readiness Dev candidate.'
)
text = text.replace(
    '- canonical module-version registry read from `manifest.json`;',
    '- canonical module-version registry resolved from the manifest URL advertised by the active Witch Dock host, with public Stable fallback;'
)
text = text.replace(
    '- `witch-dock-developer-mode` | 0.2.0 | Dev registry candidate |',
    '- `witch-dock-developer-mode` | 0.3.0 | public-readiness Dev candidate |'
)
text = text.replace(
    '1. Make Developer Mode public-ready as an About-only, default-OFF troubleshooting feature whose version registry follows the manifest actually loaded by the current Witch Dock host.\n2. Live-smoke Developer Mode persistence, per-tool diagnostics, module inventory, Spinny Short Test visibility, and High Res developer controls.\n3. Prepare a narrow Stable promotion containing the already validated tab cleanup, compact High Res service/UI split, and Developer Mode only after that smoke passes.\n4. Keep 4096 animated WebP deferred until a clean frame-source ownership seam exists.',
    '1. Live-smoke Developer Mode v0.3.0: default OFF, About persistence, correct active-manifest versions, per-tool diagnostics, Module Versions inventory, Spinny Short Test visibility, and High Res developer controls.\n2. If that passes, prepare a narrow Stable promotion containing the validated tab cleanup, compact High Res service/UI split, and Developer Mode.\n3. Keep 4096 animated WebP deferred until a clean frame-source ownership seam exists.'
)
p.write_text(text)

p = Path('HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md')
text = p.read_text()
block = """\n## 2026-09-06 Developer Mode public-readiness — Dev candidate\n\nDeveloper Mode v0.3.0 keeps the accepted About-only/default-OFF product shape but removes its Dev-branch registry dependency. The active Witch Dock loader advertises its own manifest URL; Developer Mode reads canonical module versions from that URL and uses public Stable only as a fallback. Live gate: persistence, correct active-manifest versions, tool rows, Module Versions inventory, Spinny Short Test visibility, High Res diagnostics/recovery visibility, and complete cleanup when switched OFF.\n"""
if '## 2026-09-06 Developer Mode public-readiness — Dev candidate' not in text:
    p.write_text(text.rstrip() + '\n' + block + '\n')

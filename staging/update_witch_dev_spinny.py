from pathlib import Path
import json

stage = Path('/tmp/Spinny_Mini_WebP_UI.js')
if not stage.exists():
    raise SystemExit('staged Spinny UI missing')
ui_target = Path('features/media/Spinny_Mini_WebP_UI.js')
ui_target.parent.mkdir(parents=True, exist_ok=True)
ui_target.write_text(stage.read_text())

manifest_path = Path('manifest.json')
manifest = json.loads(manifest_path.read_text())
registry = manifest.setdefault('moduleRegistry', [])
registry = [x for x in registry if x.get('id') not in {'spinny-mini-webp','spinny-mini-webp-ui'}]
service_reg = {
    'id':'spinny-mini-webp','title':'Spinny Mini WebP Service','path':'features/media/Spinny_Mini_WebP.js',
    'kind':'feature-service','load':'manifest','version':'0.5.0','build':'0.5.0-witch-dock-dev-service','versionOrigin':'validated-hfc-v0.5.0'
}
ui_reg = {
    'id':'spinny-mini-webp-ui','title':'Spinny Mini WebP UI','path':'features/media/Spinny_Mini_WebP_UI.js',
    'kind':'feature-ui','load':'manifest','version':'0.1.0','build':'0.1.0-dev-dock-popout','versionOrigin':'new-dev-module'
}
insert_at = next((i+1 for i,x in enumerate(registry) if x.get('id')=='photo-booth-true-resolution-ui'), len(registry))
registry[insert_at:insert_at] = [service_reg, ui_reg]
manifest['moduleRegistry'] = registry

tools = [x for x in manifest.get('tools', []) if x.get('id') not in {'spinny-mini-webp','spinny-mini-webp-ui'}]
service_tool = {
    'id':'spinny-mini-webp','title':'Spinny Mini WebP Service','tab':'HeroForge UI',
    'url':'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/features/media/Spinny_Mini_WebP.js',
    'enabledByDefault':True,'hidden':True,'type':'heroForgeUI'
}
ui_tool = {
    'id':'spinny-mini-webp-ui','title':'Spinny Mini WebP UI','tab':'HeroForge UI',
    'url':'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/features/media/Spinny_Mini_WebP_UI.js',
    'enabledByDefault':True,'hidden':True,'type':'heroForgeUI'
}
tool_insert = next((i+1 for i,x in enumerate(tools) if x.get('id')=='photo-booth-true-resolution-ui'), len(tools))
tools[tool_insert:tool_insert] = [service_tool, ui_tool]
manifest['tools'] = tools
manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')

def prepend(path, block):
    p=Path(path)
    old=p.read_text()
    p.write_text(block.rstrip()+"\n\n---\n\n"+old)

prepend('CHANGELOG.md', '''# Changelog

## DOCK-2026-09-06-026 — Integrate Spinny Mini WebP into Witch Dock Dev

Date: 2026-09-06

### Summary

Integrated the validated `media.spinny-mini-webp` v0.5.0 capture service into `WITCH_DEV_UI` and added a Witch Dock Booth-tab presentation adapter.

### Runtime changes

- new `features/media/Spinny_Mini_WebP.js` service, adapted from the exact checksum-verified HFC v0.5.0 source;
- new `features/media/Spinny_Mini_WebP_UI.js` Dock UI;
- default placement after High Res Image Capture in the Booth tab;
- movable draggable popout using the same control DOM/service state as the docked host;
- closing/docking the popout restores controls to the Booth tab without losing settings;
- Short Test remains part of the service but is visible only when Developer Mode is enabled;
- Pause/Resume/Cancel/progress/ETA and interaction guards are exposed through the Witch Dock host;
- Spinny-owned dock/popout UI is exempt from capture guards; HeroForge/Booth interaction remains guarded;
- 4096 animated WebP remains deferred and the existing 4096/8192 still-image provider ownership is unchanged.

### Module versions

- `spinny-mini-webp`: v0.5.0 / build `0.5.0-witch-dock-dev-service`;
- `spinny-mini-webp-ui`: v0.1.0 / build `0.1.0-dev-dock-popout`.

### Gate

Static integration checks passed. Live `WITCH_DEV_UI` smoke is required before any Stable promotion.

**Runtime behavior changed:** yes, Dev branch only. Public `Witch_Scripts` unchanged.''')

prepend('PRE_FLIGHT_Check.md', '''# Pre-Flight Check Log

## PFC-2026-09-06-026 — Witch Dock Dev Spinny integration

Date: 2026-09-06

### Reviewed

- current `WITCH_DEV_UI` head and manifest/module registry;
- `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`;
- `HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md`;
- Developer Mode v0.2.0;
- compact High Res Image Capture UI and 0.7.0 provider service;
- exact validated HFC Spinny v0.5.0 source and standalone live validation results.

The Witch Dock repository has no separate `ARCHITECTURE.md` / `FEATURE_INVENTORY.md` at this Dev head; `MASTER.md`, module registry, module-version contract and durable HISTORY records are the active repo architecture/inventory sources.

### Target files

- `features/media/Spinny_Mini_WebP.js` (new)
- `features/media/Spinny_Mini_WebP_UI.js` (new)
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md`

### Material risks checked

- do not replace/displace High Res still provider ownership of `BT.maker.takeScreenshot`;
- preserve TRUE-3K phase-feed capture logic and validated timing/state sequencing;
- one service shared by dock and popout; no duplicate capture engine;
- popout drag must remain inside Spinny-owned guard surface;
- Developer Mode controls Short Test visibility only;
- 4K Spinny remains deferred;
- public Stable remains untouched.

### Decision

Proceed with Dev-only service/UI integration and require live user smoke before promotion.''')

master = Path('MASTER.md')
master.write_text(master.read_text().rstrip()+'''\n\n## Spinny Mini WebP — Active Dev Candidate\n\n`media.spinny-mini-webp` is now integrated into `WITCH_DEV_UI` as a two-module service/UI pair. Service v0.5.0 preserves the validated 1024/2048/TRUE-3K 3072 capture engine, Pause/Resume and interaction guards. UI v0.1.0 registers `Spinny Mini WebP` in the Booth tab directly after High Res Image Capture and supports a draggable movable popout that physically moves the same controls between hosts.\n\nNormal mode hides Short Test. Developer Mode reveals the 16-frame diagnostic control. 4K animated WebP remains deferred. Live Dev smoke is pending; public `Witch_Scripts` is unchanged.\n''')

follow = Path('HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md')
follow.write_text(follow.read_text().rstrip()+'''\n\n## 2026-09-06 implementation checkpoint\n\nThe standalone Spinny gate is now closed at v0.5.0 and the planned Witch Dock Dev UX has been implemented for live smoke:\n\n- Booth placement below High Res Image Capture: implemented in Dev manifest load order;\n- one shared Spinny service: implemented;\n- draggable popout: implemented;\n- close/Dock returns the same controls to the Booth section: implemented;\n- frame-boundary Pause/Resume: inherited from validated v0.5 service;\n- interaction guards: inherited from validated v0.5 service and updated to recognize Witch Dock Spinny-owned UI;\n- Short Test Developer-Mode-only visibility: implemented;\n- 4096 Spinny: still deferred.\n\nStatus: **implementation complete, integrated Dev smoke pending**. Public Stable remains untouched until user approval.\n''')

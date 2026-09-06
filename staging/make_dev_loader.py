from pathlib import Path
import json, sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.')
src_path=root/'Witch_Dock.user.js'
out_path=root/'Witch_Dock_DEV.user.js'
src=src_path.read_text()
replacements=[
('// @name         Witch Dock v1.0.8','// @name         Witch Dock DEV - Spinny Integration'),
('// @version      1.0.8','// @version      1.0.8.1'),
('// @description  UI for all Witch Scripts - The official release!','// @description  DEV test loader for Witch Dock WITCH_DEV_UI modules. Do not use as public Stable.'),
('// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/Witch_Dock.user.js','// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/Witch_Dock_DEV.user.js'),
('// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/Witch_Dock.user.js','// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/Witch_Dock_DEV.user.js'),
('const MANIFEST_URL = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/manifest.json";','const MANIFEST_URL = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/manifest.json";')]
for old,new in replacements:
    if old not in src:
        raise SystemExit('missing loader replacement: '+old)
    src=src.replace(old,new,1)
marker='(function () {'
banner='''/*\n * DEV TEST LOADER ONLY. Loads WITCH_DEV_UI/manifest.json.\n * Separate from public Witch_Dock.user.js.\n */\n\n'''
if marker not in src: raise SystemExit('loader wrapper marker missing')
src=src.replace(marker,banner+marker,1)
out_path.write_text(src)

mp=root/'manifest.json'
m=json.loads(mp.read_text())
reg=[x for x in m.get('moduleRegistry',[]) if x.get('id')!='witch-dock-dev-loader']
reg.insert(1,{'id':'witch-dock-dev-loader','title':'Witch Dock Dev Loader','path':'Witch_Dock_DEV.user.js','kind':'core','load':'userscript-dev','version':'0.1.0','build':'1.0.8.1-spinny-dev-loader','versionOrigin':'new-dev-harness'})
m['moduleRegistry']=reg
mp.write_text(json.dumps(m,indent=2,ensure_ascii=False)+'\n')

def prepend(name,text):
    p=root/name; p.write_text(text.rstrip()+'\n\n---\n\n'+p.read_text())
prepend('CHANGELOG.md','''# Changelog\n\n## DOCK-2026-09-06-027 - Add isolated WITCH_DEV_UI Tampermonkey loader\n\nDate: 2026-09-06\n\nAdded `Witch_Dock_DEV.user.js` as a Dev-only test harness. It loads `WITCH_DEV_UI/manifest.json` and uses Dev-branch update/download URLs, preventing the Spinny integration smoke from silently loading Stable.\n\nPublic `Witch_Dock.user.js` and `Witch_Scripts` remain unchanged.\n\nModule registry adds `witch-dock-dev-loader` v0.1.0 / build `1.0.8.1-spinny-dev-loader`.\n\n**Runtime behavior changed:** Dev test harness only.''')
prepend('PRE_FLIGHT_Check.md','''# Pre-Flight Check Log\n\n## PFC-2026-09-06-027 - Isolated Dev installer for Spinny smoke\n\nDate: 2026-09-06\n\nReviewed current Dev integration, public core loader, manifest URL ownership, module-version contract, and Stable/Dev separation.\n\nRisk: the public-named userscript loads Stable manifest/update URLs. Decision: create a distinct Dev userscript with WITCH_DEV_UI manifest/update/download URLs. No public core edit.''')
print(out_path)

from pathlib import Path

ENTRY_CHANGELOG = '''## DOCK-2026-09-06-030 — Validate Witch Dock Dev tab cleanup\n\nDate: 2026-09-06\n\nUser live smoke passed the Dev tab cleanup introduced at `cb973c983dfaa723d7e6cb6d7c4474a1c875682e`. Confirmed default/structural order is `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`, Utilities renders as the cog icon with `Utilities` tooltip and remains pinned last, each tab still opens the correct tool, and persisted active-tab selection restores after refresh.\n\n**Runtime behavior changed:** no. Documentation-only validation checkpoint.\n\n---\n\n'''

ENTRY_PREFLIGHT = '''## PFC-2026-09-06-030 — Record Dev tab cleanup live validation\n\nDate: 2026-09-06\n\n### Confirmed live results\n\n- `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`: PASS.\n- Utilities cog tooltip `Utilities`: PASS.\n- Correct tool opens from every tab: PASS.\n- Persisted active tab restores after refresh: PASS.\n\nThe Dev core ordering/presentation change is validated and may be considered for later narrow Stable promotion. No runtime files change in this checkpoint.\n\n**Runtime behavior changed:** no.\n\n---\n\n'''

for path, entry in [(Path('CHANGELOG.md'), ENTRY_CHANGELOG), (Path('PRE_FLIGHT_Check.md'), ENTRY_PREFLIGHT)]:
    text = path.read_text()
    marker = '# Changelog\n\n' if path.name == 'CHANGELOG.md' else '# Pre-Flight Check Log\n\n'
    if text.startswith(marker):
        text = marker + entry + text[len(marker):]
    else:
        text = entry + text
    path.write_text(text)

master = Path('MASTER.md')
text = master.read_text()
old = '### Default tab order candidate\n\nThe Dev manifest registers `Decals` after Booth-related modules and before `JSON`, yielding `... Booth -> Decals -> JSON -> Utilities` by default. Integrated Dev-manifest tab-order smoke remains pending.'
new = '### Default tab order — validated Dev candidate\n\nDev tab cleanup is live-smoke validated. Default/structural order is `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`. Utilities is pinned last by the Dev dock core rather than relying only on manifest timing, the cog tooltip reads `Utilities`, and persisted active-tab selection remains compatible.'
if old in text:
    text = text.replace(old, new)
else:
    text += '\n\n' + new + '\n'
master.write_text(text)

follow = Path('HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md')
text = follow.read_text()
entry = '''\n## 2026-09-06 tab-cleanup validation — PASS\n\nUser live smoke passed the Dev tab cleanup at `cb973c983dfaa723d7e6cb6d7c4474a1c875682e`:\n\n- `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)` order: PASS;\n- Utilities cog tooltip: PASS;\n- all tabs open the correct tool: PASS;\n- active-tab persistence across refresh: PASS.\n\nThe next UI stage is compact High Res Image Capture integration with explicit service/UI ownership cleanup, followed by public Developer Mode promotion work.\n'''
if '## 2026-09-06 tab-cleanup validation — PASS' not in text:
    text += entry
follow.write_text(text)

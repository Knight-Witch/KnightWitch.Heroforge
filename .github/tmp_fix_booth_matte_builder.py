from pathlib import Path
import sys

if len(sys.argv) != 2:
    raise SystemExit('usage: tmp_fix_booth_matte_builder.py <patch-script>')

path = Path(sys.argv[1])
text = path.read_text(encoding='utf-8')
start_marker = '# Manifest/cache identities.\n'
end_marker = "\nchangelog = r'''"
start = text.find(start_marker)
if start < 0:
    raise SystemExit('manifest/cache identity marker missing')
end = text.find(end_marker, start)
if end < 0:
    raise SystemExit('changelog marker missing')

replacement = """# Manifest/cache identities.
replace_count('manifest.json',
'''      \"version\": \"27.0.2\",
      \"build\": \"v27.0.2\",
      \"versionOrigin\": \"dev-booth-presentation-repair-2026-09-07\"''',
'''      \"version\": \"27.0.3\",
      \"build\": \"v27.0.3\",
      \"versionOrigin\": \"dev-booth-component-aware-black-canvas-2026-09-07\"''')
replace_count('manifest.json',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/tools/Booth.js?v=27.0.2-v27.0.2',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/tools/Booth.js?v=27.0.3-v27.0.3')
replace_count('manifest.json',
'''      \"version\": \"0.1.3\",
      \"build\": \"0.1.3-dev-editor-background-restore\",
      \"versionOrigin\": \"dev-booth-lifecycle-repair-2026-09-07\"''',
'''      \"version\": \"0.1.4\",
      \"build\": \"0.1.4-dev-component-aware-booth-reassert\",
      \"versionOrigin\": \"dev-booth-component-aware-black-canvas-2026-09-07\"''')
replace_count('manifest.json',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/features/booth/Black_Canvas_Display_Replay.js?v=0.1.3-dev-editor-background-restore',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/features/booth/Black_Canvas_Display_Replay.js?v=0.1.4-dev-component-aware-booth-reassert')
"""

fixed = text[:start] + replacement + text[end:]
old_master_fix = "m = m.replace('- Dev candidate is v0.1.3 / build `0.1.3-dev-editor-background-restore`.', '- Dev candidate is v0.1.4 / build `0.1.4-dev-component-aware-booth-reassert`.')"
new_master_fix = "m = m.replace('- Dev candidate is v0.1.2 / build `0.1.2-dev-stable-state-plus-pre-bt-background`.', '- Dev candidate is v0.1.4 / build `0.1.4-dev-component-aware-booth-reassert`.')"
count = fixed.count(old_master_fix)
if count != 1:
    raise SystemExit(f'expected one stale MASTER replacement in patch script, got {count}')
fixed = fixed.replace(old_master_fix, new_master_fix)

path.write_text(fixed, encoding='utf-8', newline='\n')
print('temporary matte builder literals/doc state repaired')

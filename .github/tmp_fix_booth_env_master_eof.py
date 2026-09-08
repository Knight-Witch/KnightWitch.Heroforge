from pathlib import Path
import sys

if len(sys.argv) != 2:
    raise SystemExit('usage: tmp_fix_booth_env_master_eof.py <patch-script>')

path = Path(sys.argv[1])
text = path.read_text(encoding='utf-8')
old = """def replace_heading_section(path, heading, replacement):
    text = read(path)
    start = text.find(heading)
    if start < 0:
        raise SystemExit(f'{path}: heading missing {heading!r}')
    next_heading = text.find('\\n## ', start + len(heading))
    if next_heading < 0:
        next_heading = len(text)
    write(path, text[:start] + replacement.rstrip() + '\\n\\n' + text[next_heading + (1 if next_heading < len(text) else 0):])
"""
new = """def replace_heading_section(path, heading, replacement):
    text = read(path)
    start = text.find(heading)
    if start < 0:
        raise SystemExit(f'{path}: heading missing {heading!r}')
    next_heading = text.find('\\n## ', start + len(heading))
    if next_heading < 0:
        write(path, text[:start] + replacement.rstrip() + '\\n')
    else:
        write(path, text[:start] + replacement.rstrip() + '\\n\\n' + text[next_heading + 1:])
"""
count = text.count(old)
if count != 1:
    raise SystemExit(f'expected one replace_heading_section helper, found {count}')
path.write_text(text.replace(old, new), encoding='utf-8', newline='\n')
print('temporary environment patch MASTER EOF helper repaired')

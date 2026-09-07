from pathlib import Path

for rel in [
    'MASTER.md',
    'PRE_FLIGHT_Check.md',
    'CHANGELOG.md',
    'MODULE_VERSIONING.md',
    'HISTORY/BULLSHIT/WITCH_DOCK_DEVELOPER_MODE.md',
    'HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md',
    'HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md',
]:
    p = Path(rel)
    if p.exists():
        lines = [line.rstrip() for line in p.read_text().splitlines()]
        p.write_text('\n'.join(lines).rstrip() + '\n')

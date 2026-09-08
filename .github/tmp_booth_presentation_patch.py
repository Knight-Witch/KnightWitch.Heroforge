from pathlib import Path


def read(path):
    return Path(path).read_text(encoding='utf-8')


def write(path, text):
    Path(path).write_text(text, encoding='utf-8', newline='\n')


def replace_count(path, old, new, expected=1):
    text = read(path)
    count = text.count(old)
    if count != expected:
        raise SystemExit(f'{path}: expected {expected} matches, got {count} for {old[:120]!r}')
    write(path, text.replace(old, new))


def prepend_after_header(path, header, entry):
    text = read(path)
    marker = entry.splitlines()[0]
    if marker in text:
        return
    if not text.startswith(header):
        raise SystemExit(f'{path}: unexpected header')
    write(path, header + entry.rstrip() + '\n\n---\n\n' + text[len(header):])


def append_once(path, marker, entry):
    text = read(path).rstrip()
    if marker in text:
        return
    write(path, text + '\n\n' + entry.strip() + '\n')


def replace_section(path, start_marker, end_marker, replacement):
    text = read(path)
    start = text.find(start_marker)
    if start < 0:
        raise SystemExit(f'{path}: start marker missing: {start_marker!r}')
    end = text.find(end_marker, start)
    if end < 0:
        raise SystemExit(f'{path}: end marker missing: {end_marker!r}')
    write(path, text[:start] + replacement.rstrip() + '\n\n' + text[end:])


# Booth v27.0.2 — presentation-only follow-up.
replace_count('tools/Booth.js',
              "  const BUILD_TAG = 'v27.0.1';",
              "  const BUILD_TAG = 'v27.0.2';")

replace_count('tools/Booth.js',
"""      const plane = TN && TN.shader ? TN.shader.framePlane : null;""",
"""      const shader = TN && TN.shader ? TN.shader : null;
      const overlays = shader && shader.overlays ? shader.overlays : null;
      const plane = shader ? (shader.framePlane || (overlays && overlays.framePlane)) : null;""")

editor_env_helper = """  function ensureEditorEnvironmentBehindBooth() {
    try {
      if (!state.userBoothOn || state.bgOn) return false;
      const BT = UW.BT;
      const CK = UW.CK;
      const display = BT && BT.display;
      const env = display && display.environment;
      const background = CK && CK.environment ? CK.environment.background : null;
      if (!env || typeof env.setDefaultEnvironmentVisibility !== 'function') return false;
      if (!background || background.visible !== false) return false;
      env.setDefaultEnvironmentVisibility(true);
      return true;
    } catch {
      return false;
    }
  }

"""
replace_count('tools/Booth.js',
              '  function ensureStyles() {',
              editor_env_helper + '  function ensureStyles() {')

replace_count('tools/Booth.js',
"""    if (TN && TN.__kwBT && state.boothOn && !inBooth) {
      try { applyBTComponentPlanes(); } catch {}
    }""",
"""    if (TN && TN.__kwBT && state.boothOn && !inBooth) {
      try { applyBTComponentPlanes(); } catch {}
      if (!state.bgOn) {
        try { ensureEditorEnvironmentBehindBooth(); } catch {}
      }
    }""")

replace_count('tools/Booth.js',
              "      version: '27.0.1',",
              "      version: '27.0.2',",
              expected=2)

# Manifest/cache identity.
replace_count('manifest.json',
"""      \"version\": \"27.0.1\",
      \"build\": \"v27.0.1\",
      \"versionOrigin\": \"dev-booth-lifecycle-repair-2026-09-07\"""",
"""      \"version\": \"27.0.2\",
      \"build\": \"v27.0.2\",
      \"versionOrigin\": \"dev-booth-presentation-repair-2026-09-07\"""")
replace_count('manifest.json',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/tools/Booth.js?v=27.0.1-v27.0.1',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/tools/Booth.js?v=27.0.2-v27.0.2')

changelog = """## DOCK-2026-09-07-043 — Repair Dev Booth frame and editor-environment fallthrough

Date: 2026-09-07

### Live acceptance entering this follow-up

Dev head `7b6e37562d5bba0d63d410e418f769a71857a87a` passed the integrated lifecycle smoke:

- saved Booth View + Black Canvas restored automatically on refresh;
- `+ New Figure` correctly dropped default-owned Booth while preserving the independent Black Canvas default;
- both Booth/Black Canvas OFF orders restored the fantasy editor background;
- the white-flash regression remained closed;
- Booth component toggles continued to work.

Two presentation defects remained while Booth View was active outside native Photo Booth with Black Canvas OFF: the gray 1:1 frame overlay remained visible, and a full saved Booth with Background OFF could expose checkerboard instead of the ordinary fantasy editor environment.

### Confirmed runtime diagnosis

HF-Chat-Bridge issues #721-#724 established the current runtime shape and state:

- `BT.display.framePlane` is absent while `BT.display.overlays.framePlane.visible` is `true`; Booth v27.0.1's frame helper therefore looks one level too high for the current BT facade;
- with Witch of the Wilds left in Booth View ON / Black Canvas OFF / Background OFF, `BT.display.overlays.backgroundPlane.visible` is correctly `false`, but `CK.environment.background.visible` and `CK.environment.groundGroup.visible` are also `false`, `CK.character.settings.hideGround` is `true`, and the ordinary editor environment is therefore still Booth-hidden;
- `BT.display.environment.setDefaultEnvironmentVisibility(true)` is a named native method whose source controls the regular environment visibility state;
- a reversible live probe changed background/ground to visible, `hideGround` to false, and summon-circle visibility to true while leaving the Booth background plane OFF, then cleanly restored the original hidden state.

### Changes

- Booth -> v27.0.2 / build `v27.0.2`;
- the existing shader/frame discovery now falls back from `TN.shader.framePlane` to `TN.shader.overlays.framePlane`, preserving the existing frame snapshot/hide/restore lifecycle;
- while Witch Dock Booth View is active outside native Photo Booth and Black Canvas is OFF, Booth conditionally restores HeroForge's ordinary editor environment only when `CK.environment.background.visible === false`;
- the environment setter is therefore not called every frame once the editor environment is already visible;
- Booth Background still owns only `BT.display.overlays.backgroundPlane`: Background OFF can now fall through to the fantasy editor environment instead of checkerboard;
- native Photo Booth and Black Canvas ON keep their existing behavior.

### Preserved boundaries

Black Canvas replay v0.1.3, Booth runtime bootstrap v0.1.0, Utilities v1.2.1, loader v0.5.1, white-flash post-update replay sequencing, silent-cycle timing, corrected decal gizmo, Spinny, High Res, JSON, Developer Mode, Decals host, tabs, and Public Stable are unchanged.

### Validation gate

Static syntax, manifest identity, helper behavior mocks, exact changed-file whitelist, protected-blob equality, and committed-candidate validation must pass before Dev moves. Live validation then checks the gray frame, Background OFF fallthrough, Black Canvas, `+ New`, editor restoration, and white-flash regression.

**Runtime behavior changed:** yes, Dev Booth presentation only. Public Stable remains unchanged.
"""
prepend_after_header('CHANGELOG.md', '# Changelog\n\n', changelog)

preflight = """## PFC-2026-09-07-043 — Booth frame and editor-environment fallthrough repair

Date: 2026-09-07

### Reviewed

- binding HeroForge.Compatibility contract/master/pre-flight/changelog/architecture/inventory/compatibility/ownership/testing state;
- current Witch Dock Dev master/pre-flight/changelog/manifest;
- Booth v27.0.1 source and `BOOTH_V27_STABILIZATION.md`;
- Black Canvas replay v0.1.3 and its history;
- Booth runtime bootstrap v0.1.0 and its history;
- Amanda's integrated Dev acceptance at head `7b6e37562d5bba0d63d410e418f769a71857a87a`;
- current screenshots showing the gray 1:1 frame and checkerboard fallthrough;
- live read-only/reversible HF-Chat-Bridge probes #721-#724.

### Confirmed findings

- lifecycle/startup/new-figure/editor-restoration/white-flash gates from v27.0.1 are live PASS;
- current BT facade uses `BT.display.overlays.framePlane`; `BT.display.framePlane` does not exist;
- the existing frame helper therefore misses the actual frame while Black Canvas is OFF;
- Background OFF correctly hides the Booth background plane, but the ordinary editor environment remains hidden by Booth state, exposing checkerboard;
- named `BT.display.environment.setDefaultEnvironmentVisibility(true)` restores the full ordinary environment state without changing the Booth background plane and can be reversed cleanly.

### Decision

Repair only Booth presentation ownership. Reuse the existing frame hide lifecycle with the correct current runtime fallback, and conditionally restore the ordinary editor environment behind persisted Booth only when Black Canvas is OFF and the editor background is actually hidden.

### Target files

- `tools/Booth.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md`

### Conflict risks / preservation requirements

- do not modify Black Canvas replay or its validated post-`display.update()` white-flash sequencing;
- do not modify Booth bootstrap timing or same-origin native runtime activation;
- do not modify silent-cycle timing/rearm behavior;
- do not force editor environment visibility inside native Photo Booth;
- do not restore editor environment while Black Canvas is ON;
- do not call the environment setter continuously when the environment is already visible;
- Booth Background remains an independent overlay-plane toggle;
- Public Stable remains untouched.

### Static gate

- Booth JavaScript syntax;
- manifest JSON/identity;
- frame-path fallback mock;
- conditional environment-restoration mock including no repeated setter call after visibility is restored;
- Black Canvas/native-Photo-Booth gating invariants;
- exact six-file changed whitelist;
- protected blobs unchanged.

### Live gate

With Dev only: Booth ON + Black Canvas OFF must show the fantasy editor environment outside the 1:1 viewport without the gray frame; Background OFF must reveal fantasy environment inside the square instead of checkerboard; Background ON must still show the Booth background; Black Canvas ON must remain black; `+ New`, both-OFF restoration, and white-flash behavior must remain correct.

**Runtime behavior changed:** yes, Dev only. Public Stable unchanged.
"""
prepend_after_header('PRE_FLIGHT_Check.md', '# Pre-Flight Check Log\n\n', preflight)

master = read('MASTER.md')
master = master.replace('- Dev Booth: v27.0.1 / build `v27.0.1`.',
                        '- Dev Booth: v27.0.2 / build `v27.0.2`.')
if '## Booth Presentation Follow-up — 2026-09-07' not in master:
    marker = '## Booth / Utilities\n'
    if marker not in master:
        raise SystemExit('MASTER Booth / Utilities marker missing')
    section = """## Booth Presentation Follow-up — 2026-09-07

The v27.0.1 integrated lifecycle repair is live validated: startup restoration, `+ New Figure`, both shutdown orders, fantasy-background restoration, component toggles, and white-flash suppression all passed.

Remaining presentation-only failures before v27.0.2:

- persisted Booth View with Black Canvas OFF left HeroForge's gray 1:1 frame visible because current BT exposes the plane at `BT.display.overlays.framePlane` while the existing frame helper only checked `BT.display.framePlane`;
- turning Booth Background OFF could expose checkerboard because the Booth background plane was hidden correctly but the ordinary HeroForge editor environment remained in Booth-hidden state.

Live bridge probes proved HeroForge's named `BT.display.environment.setDefaultEnvironmentVisibility(true)` restores the ordinary background/ground state without re-enabling the Booth background plane. v27.0.2 uses that seam only when persisted Booth is active outside native Photo Booth, Black Canvas is OFF, and the regular editor background is actually hidden.

"""
    master = master.replace(marker, section + marker, 1)
write('MASTER.md', master)

new_gate = """## Current Gate

1. Update/reload Dev with Public Stable disabled.
2. With Booth View ON and Black Canvas OFF, the ordinary fantasy editor environment must be visible outside the 1:1 area and the gray frame overlay must not be visible.
3. Toggle Booth Background OFF: the fantasy editor environment must show through inside the 1:1 area instead of checkerboard.
4. Toggle Booth Background ON again: the saved Booth background must return inside the 1:1 area while the ordinary editor environment remains behind/outside it.
5. Turn Black Canvas ON: the viewport must remain black and the existing white-flash fix must remain effective.
6. Re-check `+ New Figure` still drops default-owned Booth, and with Booth + Black Canvas both OFF the ordinary editor background still restores.
7. Only after this presentation smoke passes should Booth/bootstrap/replay plus the separate loader cache repair be prepared for narrow Public Stable promotion.
"""
replace_section('MASTER.md', '## Current Gate\n', 'Historical state through', new_gate)

history = """## 2026-09-07 presentation follow-up — v27.0.2

After v27.0.1 passed the integrated startup/lifecycle smoke, two presentation artifacts remained with Witch Dock Booth View active outside native Photo Booth and Black Canvas OFF.

### Gray 1:1 frame

Live bridge issue #721 confirmed `BT.display.framePlane` is absent while `BT.display.overlays.framePlane.visible` is true. The existing `getShaderFramePlane()` looked only at `TN.shader.framePlane`; for the BT facade `TN.shader === BT.display`, so the helper could never acquire the actual current overlay frame. Black Canvas hid the correct `overlays.framePlane`, explaining why the artifact existed only when Black Canvas was OFF.

v27.0.2 preserves the existing frame snapshot/hide/restore lifecycle and adds only the current-shape fallback `TN.shader.overlays.framePlane`.

### Checkerboard when Booth Background is OFF

On the live Witch of the Wilds saved Booth state, bridge issues #722-#723 confirmed:

- Booth background plane: false, as requested by the Background toggle;
- regular `CK.environment.background.visible`: false;
- regular ground group: false;
- `CK.character.settings.hideGround`: true;
- summon circle: false.

Thus the checkerboard was not the Booth background plane failing to hide; it was the ordinary editor environment remaining in Booth-hidden state underneath the transparent square.

The named native method `BT.display.environment.setDefaultEnvironmentVisibility(e)` directly owns this state. A reversible live probe (#724) called it with `true`, observed background/ground/summon-circle visibility restore and `hideGround` clear while the Booth background plane stayed false, then called it with `false` and verified the original hidden state returned.

v27.0.2 conditionally calls that named setter only when all of the following are true:

- Witch Dock Booth View is active;
- the page is outside native Photo Booth;
- Black Canvas is OFF;
- the regular HeroForge background currently reports `visible === false`.

Once the editor environment is visible the helper is a no-op, so the RAF polling loop does not continuously invoke the setter. Native Photo Booth and Black Canvas ON remain excluded.

The Black Canvas replay module is not changed by this presentation follow-up.
"""
append_once('HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md',
            '## 2026-09-07 presentation follow-up — v27.0.2',
            history)

print('PRESENTATION PATCH COMPLETED')

from pathlib import Path

def read(path):
    return Path(path).read_text(encoding='utf-8')

def write(path, text):
    Path(path).write_text(text, encoding='utf-8', newline='\n')

def replace_count(path, old, new, expected=1):
    text = read(path)
    count = text.count(old)
    if count != expected:
        raise SystemExit(f'{path}: expected {expected} matches, got {count} for {old[:100]!r}')
    write(path, text.replace(old, new))

def prepend_after_header(path, header, entry):
    text = read(path)
    if entry.splitlines()[0] in text:
        return
    if not text.startswith(header):
        raise SystemExit(f'{path}: unexpected header')
    write(path, header + entry.rstrip() + '\n\n---\n\n' + text[len(header):])

def append_once(path, marker, text_to_append):
    text = read(path).rstrip()
    if marker in text:
        return
    write(path, text + '\n\n' + text_to_append.strip() + '\n')

# Booth v27.0.1: bare camera cannot qualify a saved Booth, and a real
# Booth shutdown restores the editor environment when Black Canvas is off.
replace_count('tools/Booth.js',
              "  const BUILD_TAG = 'v27';",
              "  const BUILD_TAG = 'v27.0.1';")

replace_count('tools/Booth.js',
"""          if (cfg.cameraSave) signals.push('cameraSave');
          if (cfg.camera) signals.push('camera');
          if (cfg.lighting) signals.push('lighting');""",
"""          if (cfg.cameraSave) signals.push('cameraSave');
          // Bare camera state is not a saved Booth signal. Fresh/new figures
          // can carry ordinary camera data without ever having a Booth setup.
          if (cfg.lighting) signals.push('lighting');""")

replace_count('tools/Booth.js',
"""    if (!state.userBoothOn && prev) {
      state.boothPendingTeardown = true;
      try { teardownBoothNow(TN); } catch {}
    }""",
"""    if (!state.userBoothOn && prev) {
      state.boothPendingTeardown = true;
      try { teardownBoothNow(TN); } catch {}

      // A real/manual/default Booth shutdown must restore the ordinary editor
      // environment when Black Canvas is already OFF. Internal silent cycles
      // intentionally skip this so their validated rearm sequencing is unchanged.
      if (!state.bgOn && opts.source !== 'internal') {
        try { restoreBTCanvasVisualState(); } catch {}
      }
    }""")

replace_count('tools/Booth.js',
              "      version: '27.0.0',",
              "      version: '27.0.1',",
              expected=2)

# Replay v0.1.3: preserve the validated post-display.update wrapper and
# correct restoration when a background snapshot was captured while Booth hid it.
replace_count('features/booth/Black_Canvas_Display_Replay.js',
"""  const VERSION = '0.1.2';
  const BUILD = '0.1.2-dev-stable-state-plus-pre-bt-background';""",
"""  const VERSION = '0.1.3';
  const BUILD = '0.1.3-dev-editor-background-restore';""")

replace_count('features/booth/Black_Canvas_Display_Replay.js',
"""  function currentDisplay() {
    try {""",
"""  function isBoothViewOn() {
    try {
      const api = UW.KW_WD_BOOTH;
      if (api && typeof api.getState === 'function') {
        const s = api.getState();
        if (s && Object.prototype.hasOwnProperty.call(s, 'sessionBoothView')) {
          return !!s.sessionBoothView;
        }
      }
    } catch (error) {
      recordError('isBoothViewOn.api', error);
    }

    try {
      const diag = UW.KW_WD_BOOTH_DIAG;
      if (typeof diag !== 'function') return false;
      const raw = diag();
      const s = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return !!(s && (s.userBoothOn || s.boothOn));
    } catch (error) {
      recordError('isBoothViewOn.diag', error);
      return false;
    }
  }

  function currentDisplay() {
    try {""")

replace_count('features/booth/Black_Canvas_Display_Replay.js',
"""  function restoreSemanticBackground() {
    const node = state.semanticBackground;
    if (!node) return false;
    try {
      if (state.semanticBackgroundVisible !== null) node.visible = !!state.semanticBackgroundVisible;
      state.semanticBackground = null;
      state.semanticBackgroundVisible = null;
      return true;
    } catch (error) {
      recordError('restoreSemanticBackground', error);
      state.semanticBackground = null;
      state.semanticBackgroundVisible = null;
      return false;
    }
  }""",
"""  function restoreSemanticBackground() {
    const node = state.semanticBackground;
    if (!node) return false;
    try {
      const BT = UW.BT;
      const boothOn = isBoothViewOn();

      if (BT && !boothOn) {
        // A background captured while Booth was active may legitimately have
        // been invisible. Once Booth itself is OFF, restoring that stale false
        // would leave the ordinary HeroForge editor on a blank white canvas.
        const env = BT.display && BT.display.environment;
        if (env && typeof env.setDefaultEnvironmentVisibility === 'function') {
          env.setDefaultEnvironmentVisibility(true);
        }
        if ('visible' in node) node.visible = true;
      } else if (state.semanticBackgroundVisible !== null) {
        node.visible = !!state.semanticBackgroundVisible;
      }

      state.semanticBackground = null;
      state.semanticBackgroundVisible = null;
      return true;
    } catch (error) {
      recordError('restoreSemanticBackground', error);
      state.semanticBackground = null;
      state.semanticBackgroundVisible = null;
      return false;
    }
  }""")

# Manifest versions/cache identities.
replace_count('manifest.json',
"""      "version": "27.0.0",
      "build": "v27",
      "versionOrigin": "dev-booth-stabilization-2026-09-06"""",
"""      "version": "27.0.1",
      "build": "v27.0.1",
      "versionOrigin": "dev-booth-lifecycle-repair-2026-09-07"""")

replace_count('manifest.json',
"""      "version": "0.1.2",
      "build": "0.1.2-dev-stable-state-plus-pre-bt-background",
      "versionOrigin": "dev-black-canvas-pre-bt-fallback-2026-09-07""",
"""      "version": "0.1.3",
      "build": "0.1.3-dev-editor-background-restore",
      "versionOrigin": "dev-booth-lifecycle-repair-2026-09-07""")

replace_count('manifest.json',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/tools/Booth.js?v=27.0.0-v27',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/tools/Booth.js?v=27.0.1-v27.0.1')

replace_count('manifest.json',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/features/booth/Black_Canvas_Display_Replay.js?v=0.1.2-dev-stable-state-plus-pre-bt-background',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/features/booth/Black_Canvas_Display_Replay.js?v=0.1.3-dev-editor-background-restore')

changelog = """## DOCK-2026-09-07-042 — Repair Dev Booth figure lifecycle and editor background restore

Date: 2026-09-07

### Live result that triggered this repair

The integrated Dev smoke confirmed that saved Booth View and Black Canvas now restore automatically on page refresh and the validated white-flash fix remains effective. It also exposed two lifecycle regressions:

- creating a fresh `+ New Figure` after a saved Booth figure left default-owned Booth View active and showed the empty checkerboard Booth backdrop;
- with Booth View and Black Canvas both OFF, the ordinary HeroForge fantasy editor background did not return and the viewport remained white.

All Booth component toggles continued to work.

### Confirmed source diagnosis

- Booth v27 `readSavedBoothConfig()` still counted plain `cfg.camera` as a saved-Booth signal even though the runtime bootstrap correctly rejects bare camera data. Fresh figures may have ordinary camera data, so an already-loaded BT runtime let v27 falsely classify the new figure as having saved Booth setup.
- `restoreBTCanvasVisualState()` already contains the semantic environment restoration used by the older working behavior, but a real `onUserBoothToggle(false)` did not reassert it after Booth teardown when Black Canvas was already OFF.
- the Black Canvas replay captured the named main-scene background's current visibility. While Booth was active that value could correctly be `false`; later restoring that stale `false` after Booth itself was OFF could re-hide the fantasy editor background.

### Changes

- Booth -> v27.0.1 / build `v27.0.1`;
- bare `cfg.camera` no longer qualifies as saved Booth configuration; all previously accepted stronger Booth signals remain;
- non-internal Booth shutdown reasserts the existing `restoreBTCanvasVisualState()` path when Black Canvas is already OFF; internal silent-cycle behavior is unchanged;
- Black Canvas replay -> v0.1.3 / build `0.1.3-dev-editor-background-restore`;
- replay still restores the captured background visibility while Booth remains active, but when BT exists and Booth View is OFF it restores the default environment and makes the owned main-scene background visible instead of replaying a stale hidden value;
- no timing windows, tokenizer retry/rearm behavior, `display.update()` replay sequencing, or Booth bootstrap timings were changed.

### Preserved boundaries

Booth runtime bootstrap v0.1.0, Dev loader v0.5.1, Utilities v1.2.1, corrected decal gizmo, Spinny, High Res, JSON, Developer Mode, Decals host, tab infrastructure, and Public Stable are unchanged.

### Validation

- exact source replacement counts: PASS;
- Booth/replay JavaScript syntax: PASS;
- manifest JSON parse and version/cache identity assertions: PASS;
- replay lifecycle mocks: PASS for no-BT Black Canvas, BT+Booth active restoration, BT+Booth OFF editor restoration, diagnostic state fallback, and native `display.update()` passthrough;
- Booth source invariant: PASS — bare `camera` is not a saved signal, stronger signals remain, and internal silent-cycle shutdown is excluded from editor-background restoration;
- live Dev regression smoke: pending.

**Runtime behavior changed:** yes, Dev Booth lifecycle/restoration only. Public Stable remains unchanged.
"""
prepend_after_header('CHANGELOG.md', '# Changelog\n\n', changelog)

preflight = """## PFC-2026-09-07-042 — Integrated Booth lifecycle regression repair

Date: 2026-09-07

### Reviewed

- binding HeroForge.Compatibility contract, master, pre-flight, changelog, architecture, feature inventory, compatibility, ownership, and testing state;
- current Witch Dock Dev master/pre-flight/changelog/module versioning;
- Booth v27 source and `BOOTH_V27_STABILIZATION.md`;
- Booth runtime bootstrap v0.1.0 and its investigation record;
- Black Canvas replay v0.1.2 and its investigation record;
- Amanda's integrated Dev smoke result after Dev head `a28d83c56264bf5e153415705c0043f792c13f2c`.

### Confirmed findings

- saved Booth + Black Canvas fresh-page startup: PASS;
- white-flash regression: PASS;
- Booth sub-toggle behavior: PASS;
- `+ New Figure`: FAIL because v27 accepts bare `cfg.camera` as saved Booth despite the established strong-signal rule;
- ordinary editor background restoration with Booth + Black Canvas OFF: FAIL;
- replay can retain a legitimate Booth-hidden background visibility snapshot and replay it after Booth is no longer active.

### Decision

Surgically align Booth v27 saved-config detection with the already-validated bootstrap rule and repair shutdown/restoration ownership. Preserve all established Booth timing/retry/silent-cycle behavior.

### Target files

- `tools/Booth.js`
- `features/booth/Black_Canvas_Display_Replay.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md`
- `HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`

### Conflict risks / preservation requirements

- do not alter Booth bootstrap timing, same-origin native Booth load, or `BT.setBoothMode` activation;
- do not alter the validated `CK.character.display.update()` white-flash replay sequencing;
- do not alter internal silent-cycle teardown/rearm timing;
- Black Canvas remains independent from Booth Persistence;
- a fresh figure may keep Black Canvas ON if its separate Utilities default is ON, but default-owned Booth View must fall OFF when no strong saved Booth setup exists;
- manual current-session switches remain session overrides;
- Public Stable stays untouched.

### Static gate

Exact source patching, syntax, manifest identity, replay lifecycle mocks, and protected-file equality must pass before Dev moves.

### Live gate

Re-test saved-figure refresh, `+ New Figure`, both toggle-off orders, fantasy editor background restoration, white-flash behavior, and Booth component toggles. Public migration remains blocked until these pass.

**Runtime behavior changed:** yes, Dev only. Public Stable unchanged.
"""
prepend_after_header('PRE_FLIGHT_Check.md', '# Pre-Flight Check Log\n\n', preflight)

master = read('MASTER.md')
section_marker = '## Booth / Utilities\n'
if '## Integrated Booth Lifecycle Smoke — 2026-09-07' not in master:
    insert = """## Integrated Booth Lifecycle Smoke — 2026-09-07

The first combined startup smoke closed two gates and exposed two downstream lifecycle bugs.

Confirmed PASS:
- saved Booth figure refresh automatically bootstraps/restores Booth View;
- saved Black Canvas restores;
- the validated white-flash fix remains effective;
- Booth lighting/effects/overlay/background component toggles still work.

Confirmed FAIL before this repair:
- `+ New Figure` remained in default-owned Booth because Booth v27 still treated bare camera data as saved Booth;
- with Booth and Black Canvas OFF, the ordinary fantasy editor background could remain hidden, leaving white.

Dev v27.0.1 / replay v0.1.3 are the surgical candidate fixes. Black Canvas remains a separate persistent default: if Black Canvas Across Sessions is ON, a fresh figure may remain black, but it must not remain in Booth View or show the checkerboard Booth backdrop.

"""
    if section_marker not in master:
        raise SystemExit('MASTER Booth marker missing')
    master = master.replace(section_marker, insert + section_marker, 1)

master = master.replace('- Dev Booth: v27.0.0 / build `v27`.',
                        '- Dev Booth: v27.0.1 / build `v27.0.1`.')
old_gate = """## Current Gate

1. Enable the Dev loader and disable public Stable for a clean test.
2. Load a figure that already has saved Photo Booth configuration with Utilities Booth Persistence and Black Canvas defaults ON.
3. Refresh HeroForge without opening Photo Booth manually.
4. Expected: saved Booth View activates and Black Canvas is visibly black.
5. Verify the known flash-causing action still does not flash.
6. Verify a fresh `+ New Figure` with no saved Booth configuration does not auto-bootstrap Booth.
7. Only after this passes should the bootstrap be considered for narrow Stable promotion together with the separate loader cache repair.
"""
new_gate = """## Current Gate

1. Update/reload the Dev loader with Public Stable disabled.
2. Saved Booth figure + Booth Persistence ON: refresh without opening Photo Booth manually; Booth must restore automatically.
3. `+ New Figure`: after the existing figure-settle window, default-owned Booth View must turn OFF because bare camera data is not a saved Booth setup. If the independent Black Canvas default is ON, the editor may remain black but must not show the Booth checkerboard.
4. Test both shutdown orders: Black Canvas OFF then Booth OFF, and Booth OFF then Black Canvas OFF. With both OFF, the ordinary HeroForge fantasy background must return.
5. Verify the known flash-causing action remains flash-free.
6. Verify Booth lighting/effects/overlays/background sub-toggles still work.
7. Only after this passes should the bootstrap/replay/loader repair be promoted narrowly to Public Stable.
"""
if old_gate not in master:
    raise SystemExit('MASTER current gate block missing')
master = master.replace(old_gate, new_gate, 1)
write('MASTER.md', master)

append_once('HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md',
            '## 2026-09-07 integrated lifecycle follow-up — v27.0.1',
"""## 2026-09-07 integrated lifecycle follow-up — v27.0.1

The first combined Dev startup smoke proved the new runtime bootstrap works: a previously saved Booth figure restored Booth View and Black Canvas automatically on refresh, and the white-flash fix remained effective. The same smoke exposed a downstream v27 detector mismatch on `+ New Figure`.

`readSavedBoothConfig()` still counted plain `cfg.camera` as a saved-Booth signal. That contradicts the bootstrap's established strong-signal rule and the v27 acceptance requirement that a fresh/no-saved-Booth figure not receive default-owned Booth View. Because BT was already loaded from the previous saved figure, the new figure's ordinary camera data was enough for v27 to keep Booth alive.

v27.0.1 removes bare `camera` from the qualifying signal set while preserving `cameraSave`, lighting, effects, token-background/frame filters, and selected token background/frame signals. The existing 1.8 s figure-settle window and missing-config tick threshold are unchanged.

The same live smoke reproduced the historical blank-white editor restoration class. v27.0.1 reuses the already-existing `restoreBTCanvasVisualState()` semantic restoration path after a real/manual/default Booth shutdown when Black Canvas is already OFF. Internal silent-cycle teardown is explicitly excluded so its validated timing/rearm behavior is unchanged.
""")

append_once('HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md',
            '## 2026-09-07 integrated Dev result',
"""## 2026-09-07 integrated Dev result

Live integrated Dev validation confirmed the bootstrap's primary job works: refreshing a figure with saved Booth setup while Booth Persistence and Black Canvas defaults were enabled automatically created/activated the native Booth runtime and restored Booth/Black Canvas without manually opening Photo Booth.

The subsequent `+ New Figure` failure was not a bootstrap eligibility failure. BT was already present from the first figure, so control returned to Booth v27's own saved-config detector, which still accepted bare `cfg.camera`. That consumer-side mismatch is corrected in Booth v27.0.1; bootstrap v0.1.0 itself remains unchanged.
""")

replay = read('HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md')
replay = replay.replace('Dev candidate: v0.1.2 / `0.1.2-dev-stable-state-plus-pre-bt-background`',
                        'Dev candidate: v0.1.3 / `0.1.3-dev-editor-background-restore`')
write('HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md', replay)
append_once('HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md',
            '## 2026-09-07 editor-background restoration follow-up — v0.1.3',
"""## 2026-09-07 editor-background restoration follow-up — v0.1.3

The integrated startup smoke kept the white-flash regression closed but reproduced a different historical failure: after Booth View and Black Canvas were both switched OFF, HeroForge's normal fantasy editor background could remain hidden and the viewport appeared white.

The replay's owned background snapshot explains the ordering hazard. While Booth is active, the real main-scene background can legitimately already be invisible; v0.1.2 captured that `false` and later restored it literally. If Booth itself was OFF by then, replaying the stale hidden value counteracted the editor-environment restoration.

v0.1.3 preserves the validated post-`display.update()` replay and all Black Canvas enforcement. When Booth is still active, it restores the captured visibility exactly as before. When BT exists but Booth View is now OFF, it instead reasserts the named default-environment visibility and makes the owned main-scene background visible. The no-BT Black Canvas path still restores its captured CK mesh visibility normally.
""")

print('PATCH SCRIPT COMPLETED')

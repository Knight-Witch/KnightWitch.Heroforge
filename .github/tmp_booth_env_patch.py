from pathlib import Path

BASE = 'ca27025e137049640e50b68d98d9cdca70ed59a8'


def read(path):
    return Path(path).read_text(encoding='utf-8')


def write(path, text):
    Path(path).write_text(text, encoding='utf-8', newline='\n')


def replace_count(path, old, new, expected=1):
    text = read(path)
    count = text.count(old)
    if count != expected:
        raise SystemExit(f'{path}: expected {expected} matches, got {count} for {old[:160]!r}')
    write(path, text.replace(old, new))


def replace_function(path, name, replacement):
    text = read(path)
    marker = f'  function {name}('
    start = text.find(marker)
    if start < 0:
        raise SystemExit(f'{path}: function {name} missing')
    end = text.find('\n  function ', start + len(marker))
    if end < 0:
        raise SystemExit(f'{path}: next function after {name} missing')
    write(path, text[:start] + replacement.rstrip() + '\n' + text[end:])


def remove_function_range(path, start_name, end_name):
    text = read(path)
    start_marker = f'  function {start_name}('
    end_marker = f'  function {end_name}('
    start = text.find(start_marker)
    end = text.find(end_marker, start + 1)
    if start < 0 or end < 0:
        raise SystemExit(f'{path}: cannot remove function range {start_name}..{end_name}')
    write(path, text[:start] + text[end:])


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


def replace_heading_section(path, heading, replacement):
    text = read(path)
    start = text.find(heading)
    if start < 0:
        raise SystemExit(f'{path}: heading missing {heading!r}')
    next_heading = text.find('\n## ', start + len(heading))
    if next_heading < 0:
        next_heading = len(text)
    write(path, text[:start] + replacement.rstrip() + '\n\n' + text[next_heading + (1 if next_heading < len(text) else 0):])


# Booth v27.0.4: reject the bad v27.0.3 DOM matte and repair editor-environment ownership.
replace_count('tools/Booth.js', "  const BUILD_TAG = 'v27.0.3';", "  const BUILD_TAG = 'v27.0.4';")
replace_count('tools/Booth.js', "      version: '27.0.3',", "      version: '27.0.4',", expected=2)

replace_count(
    'tools/Booth.js',
    """    blackCanvasMatteRoot: null,\n    blackCanvasMatteBars: null,\n    blackCanvasMatteParent: null,\n    blackCanvasMatteLayoutKey: null,\n\n""",
    ''
)
remove_function_range('tools/Booth.js', 'disposeBlackCanvasMatte', 'isNativePhotoBoothForPresentation')
replace_count('tools/Booth.js', '    try { disposeBlackCanvasMatte(); } catch {}\n', '', expected=1)

editor_env = r'''  function ensureEditorEnvironmentBehindBooth(options) {
    try {
      const allowBlackCanvas = !!(options && options.allowBlackCanvas);
      if (!state.userBoothOn || (state.bgOn && !allowBlackCanvas)) return false;

      const BT = UW.BT;
      const CK = UW.CK;
      const display = BT && BT.display;
      const env = display && display.environment;
      const background = CK && CK.environment ? CK.environment.background : null;
      const mesh = background && background.mesh ? background.mesh : null;
      const ground = CK && CK.environment ? CK.environment.groundGroup : null;
      const settings = CK && CK.character ? CK.character.settings : null;
      const summon = UW.HF && UW.HF.summonCircle ? UW.HF.summonCircle : null;

      if (!env || typeof env.setDefaultEnvironmentVisibility !== 'function') return false;

      const hidden = !!(
        (background && background.visible === false) ||
        (mesh && mesh.visible === false) ||
        (ground && ground.visible === false) ||
        (settings && settings.hideGround === true) ||
        (summon && summon.visible === false)
      );
      if (!hidden) return false;

      env.setDefaultEnvironmentVisibility(true);

      // Replay's pre-BT fallback can directly own the regular background mesh.
      // The wrapper flag and mesh visibility can disagree, so make the actual
      // render node visible when this explicit editor-fallback policy requires it.
      try { if (background && 'visible' in background) background.visible = true; } catch {}
      try { if (mesh && 'visible' in mesh) mesh.visible = true; } catch {}
      return true;
    } catch {
      return false;
    }
  }'''
replace_function('tools/Booth.js', 'ensureEditorEnvironmentBehindBooth', editor_env)

restore_visual = r'''  function restoreBTCanvasVisualState() {
    const snap = state.btCanvasVisualSnapshot;
    try {
      const BT = UW.BT;
      const CK = UW.CK;
      const display = BT && BT.display;
      const env = display && display.environment;
      const overlays = display && display.overlays;
      const canvas = CK && CK.renderManager && CK.renderManager.renderer
        ? CK.renderManager.renderer.domElement
        : null;

      if (env && typeof env.setDefaultEnvironmentVisibility === 'function') {
        env.setDefaultEnvironmentVisibility(true);
      }
      try {
        const background = CK && CK.environment ? CK.environment.background : null;
        const mesh = background && background.mesh ? background.mesh : null;
        if (background && 'visible' in background) background.visible = true;
        if (mesh && 'visible' in mesh) mesh.visible = true;
      } catch {}

      if (snap && overlays) {
        if (overlays.backgroundPlane && snap.backgroundVisible !== null) overlays.backgroundPlane.visible = snap.backgroundVisible;
        if (overlays.framePlane && snap.frameVisible !== null) overlays.framePlane.visible = snap.frameVisible;
        if (overlays.shadowPlane && snap.shadowVisible !== null) overlays.shadowPlane.visible = snap.shadowVisible;
        if (overlays.mask && snap.maskVisible !== null && 'visible' in overlays.mask) overlays.mask.visible = snap.maskVisible;
      }

      // Snapshot restoration must not override the user's current component
      // choices if those changed while Black Canvas was active.
      if (overlays && overlays.backgroundPlane) overlays.backgroundPlane.visible = !!state.persistBackgroundOn;
      if (state.userBoothOn && overlays && overlays.framePlane) overlays.framePlane.visible = false;
      if (!state.persistOverlaysOn && overlays && overlays.framePlane) overlays.framePlane.visible = false;

      if (canvas) {
        canvas.style.backgroundColor = snap ? snap.canvasBackground : '';
        if (canvas.parentElement) canvas.parentElement.style.backgroundColor = snap ? snap.holderBackground : '';
      }
      state.btCanvasVisualSnapshot = null;
      state.btCanvasLayoutKey = null;
      return true;
    } catch {
      state.btCanvasVisualSnapshot = null;
      state.btCanvasLayoutKey = null;
      return false;
    }
  }'''
replace_function('tools/Booth.js', 'restoreBTCanvasVisualState', restore_visual)

enforce_black = r'''  function enforceBTBlackCanvas(options) {
    try {
      const BT = UW.BT;
      const CK = UW.CK;
      const display = BT && BT.display;
      const env = display && display.environment;
      const overlays = display && display.overlays;
      const canvas = CK && CK.renderManager && CK.renderManager.renderer
        ? CK.renderManager.renderer.domElement
        : null;
      if (!env || !overlays || !canvas) return false;

      captureBTCanvasVisualState();
      syncBTCanvasLayout(overlays, canvas);

      const allowEditorFallback = options && Object.prototype.hasOwnProperty.call(options, 'allowEditorFallback')
        ? !!options.allowEditorFallback
        : !isNativePhotoBoothForPresentation();
      const wantsEditorFallback = !!(state.userBoothOn && !state.persistBackgroundOn && allowEditorFallback);

      if (wantsEditorFallback) {
        // v27.0.3 attempted to cover only the outside crop with a DOM matte,
        // but live validation proved getTokenViewOffset() describes a smaller
        // token/render crop rather than the visible editor 1:1 viewport.
        // Until a frame-derived crop seam is validated, prioritize correct
        // environment ownership and expose the editor environment normally.
        ensureEditorEnvironmentBehindBooth({ allowBlackCanvas: true });
      } else if (typeof env.setDefaultEnvironmentVisibility === 'function') {
        env.setDefaultEnvironmentVisibility(false);
      }

      if (overlays.backgroundPlane) overlays.backgroundPlane.visible = !!state.persistBackgroundOn;
      if (overlays.framePlane) overlays.framePlane.visible = false;
      if (overlays.shadowPlane) overlays.shadowPlane.visible = false;
      if (overlays.mask && 'visible' in overlays.mask) overlays.mask.visible = false;

      canvas.style.backgroundColor = '#000000';
      if (canvas.parentElement) canvas.parentElement.style.backgroundColor = '#000000';
      return true;
    } catch {
      return false;
    }
  }'''
replace_function('tools/Booth.js', 'enforceBTBlackCanvas', enforce_black)

request_refresh = r'''  function requestBTComponentRenderRefresh() {
    try {
      const CK = UW.CK;
      if (CK && CK.GameLoop && typeof CK.GameLoop.requestRenderRefresh === 'function') {
        CK.GameLoop.requestRenderRefresh();
        return true;
      }
    } catch {}
    return false;
  }

'''
replace_count('tools/Booth.js', '  function refreshBTComponentRender() {', request_refresh + '  function refreshBTComponentRender() {')

refresh_components = r'''  function refreshBTComponentRender() {
    try {
      // Component handlers already apply their specific lighting/effect/plane
      // state. Do not replay HeroForge's broad overlay resize/refresh/visibility
      // sequence here: live Dev testing showed every sub-toggle could otherwise
      // knock the ordinary editor environment back into Booth-hidden state.
      applyBTComponentPlanes();
      if (state.bgOn) enforceBTBlackCanvas();
      else if (state.userBoothOn) ensureEditorEnvironmentBehindBooth();
      requestBTComponentRenderRefresh();

      requestAnimationFrame(() => {
        try {
          applyBTComponentPlanes();
          if (state.bgOn) enforceBTBlackCanvas();
          else if (state.userBoothOn) ensureEditorEnvironmentBehindBooth();
          requestBTComponentRenderRefresh();
        } catch {}
      });
      return true;
    } catch {
      return false;
    }
  }'''
replace_function('tools/Booth.js', 'refreshBTComponentRender', refresh_components)

# Replay v0.1.5: restore replay-owned mesh visibility before Booth takes ownership.
replace_count(
    'features/booth/Black_Canvas_Display_Replay.js',
    "  const VERSION = '0.1.4';\n  const BUILD = '0.1.4-dev-component-aware-booth-reassert';",
    "  const VERSION = '0.1.5';\n  const BUILD = '0.1.5-dev-restore-before-booth-handoff';"
)

handoff = r'''  function reassertThroughBoothApiWithHandoff() {
    try {
      const api = UW.KW_WD_BOOTH;
      if (!api || typeof api.reassertBlackCanvasPresentation !== 'function') return false;

      // If the pre-BT fallback directly hid the ordinary environment mesh,
      // restore the visibility value replay owns before Booth becomes the
      // presentation owner. v0.1.4 simply dropped this snapshot, which could
      // leave the fantasy backdrop hidden for the rest of the page session.
      if (state.semanticBackground) restoreSemanticBackground();
      return api.reassertBlackCanvasPresentation() === true;
    } catch (error) {
      recordError('reassertThroughBoothApiWithHandoff', error);
      return false;
    }
  }

'''
replace_count(
    'features/booth/Black_Canvas_Display_Replay.js',
    '  function relinquishSemanticBackgroundOwnership() {\n    state.semanticBackground = null;\n    state.semanticBackgroundVisible = null;\n  }\n\n',
    handoff
)
replace_count('features/booth/Black_Canvas_Display_Replay.js', 'const delegated = reassertThroughBoothApi();', 'const delegated = reassertThroughBoothApiWithHandoff();')
replace_count(
    'features/booth/Black_Canvas_Display_Replay.js',
    """      } else if (reassertThroughBoothApi()) {\n          // If Booth became available after the pre-BT fallback acquired the\n          // background, release replay ownership without mutating Booth's state.\n          relinquishSemanticBackgroundOwnership();\n        } else {""",
    """      } else if (reassertThroughBoothApiWithHandoff()) {\n          // Booth now owns the final presentation after replay restored any\n          // pre-BT background visibility it had temporarily owned.\n        } else {"""
)
replace_count(
    'features/booth/Black_Canvas_Display_Replay.js',
    """        // Booth now owns component-aware BT presentation, including the\n        // Background-OFF fantasy fallback. Do not re-hide that background here.\n        relinquishSemanticBackgroundOwnership();\n        applied = true;""",
    """        // Booth owns component-aware BT presentation after any replay-owned\n        // pre-BT background visibility has been restored. Do not re-hide it here.\n        applied = true;"""
)

# Manifest/cache identities.
replace_count('manifest.json',
'''      "version": "27.0.3",
      "build": "v27.0.3",
      "versionOrigin": "dev-booth-component-aware-black-canvas-2026-09-07"''',
'''      "version": "27.0.4",
      "build": "v27.0.4",
      "versionOrigin": "dev-booth-environment-ownership-repair-2026-09-07"''')
replace_count('manifest.json',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/tools/Booth.js?v=27.0.3-v27.0.3',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/tools/Booth.js?v=27.0.4-v27.0.4')
replace_count('manifest.json',
'''      "version": "0.1.4",
      "build": "0.1.4-dev-component-aware-booth-reassert",
      "versionOrigin": "dev-booth-component-aware-black-canvas-2026-09-07"''',
'''      "version": "0.1.5",
      "build": "0.1.5-dev-restore-before-booth-handoff",
      "versionOrigin": "dev-booth-environment-ownership-repair-2026-09-07"''')
replace_count('manifest.json',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/features/booth/Black_Canvas_Display_Replay.js?v=0.1.4-dev-component-aware-booth-reassert',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/features/booth/Black_Canvas_Display_Replay.js?v=0.1.5-dev-restore-before-booth-handoff')

changelog = r'''## DOCK-2026-09-07-045 — Repair Booth editor-environment ownership after v27.0.3 live failure

Date: 2026-09-07

### Live result entering this repair

Amanda's v27.0.3 Dev smoke rejected the component-aware DOM matte and exposed a deeper environment-ownership conflict:

- Black Canvas ON + Booth Background OFF still showed checkerboard instead of the fantasy environment;
- the v27.0.3 matte covered almost the entire renderer and left only a tiny square around the figure, proving `BT.maker.getTokenViewOffset()` is not the visible editor 1:1 crop contract;
- Black Canvas ON -> OFF could temporarily restore the pedestal/editor environment, but toggling Lighting, Effects, Overlays, or Background could hide it again even while Black Canvas remained OFF;
- the fantasy backdrop image itself could stay missing even when the pedestal/ground returned.

### Confirmed diagnosis

- every Booth sub-toggle shares `refreshBTComponentRender()`, which was still invoking the broad native `overlays.resize()`, `overlays.refresh()`, and `overlays.applyVisibility()` sequence before reasserting Witch Dock state;
- current environment state can disagree between `CK.environment.background.visible` and `CK.environment.background.mesh.visible`; prior bridge reads observed both directions of mismatch, so wrapper-only restoration gating is insufficient;
- replay v0.1.4 can acquire the regular background mesh before BT exists, hide it for Black Canvas, then later drop the ownership snapshot when Booth delegation becomes available without restoring that mesh first;
- this can leave the fantasy background render node hidden while the Booth environment setter separately restores ground/pedestal visibility;
- v27.0.3's `getTokenViewOffset()` DOM matte is rejected by live visual evidence and is removed in this repair.

### Changes

- Booth -> v27.0.4 / build `v27.0.4`;
- Black Canvas replay -> v0.1.5 / build `0.1.5-dev-restore-before-booth-handoff`;
- remove the v27.0.3 DOM matte and all `getTokenViewOffset()` crop ownership from Booth;
- editor-environment restoration now considers the actual background mesh, ground group, `hideGround`, and summon-circle state in addition to the background wrapper flag;
- when the editor fallback is explicitly required, the actual regular background mesh is re-shown after the named native environment setter so wrapper/mesh disagreement cannot strand the fantasy backdrop;
- component toggles no longer run the broad native overlay resize/refresh/applyVisibility sequence merely to redraw; they reassert their already-applied component state and request a render refresh instead;
- replay restores any background visibility it owned before handing full BT presentation to Booth, rather than dropping the snapshot while leaving the mesh hidden;
- the validated synchronous post-`CK.character.display.update()` replay location is unchanged.

### Deliberate temporary limitation

This repair prioritizes stable environment/component ownership. With Booth View + Black Canvas ON + Background OFF, the fantasy environment may extend outside the intended 1:1 crop until a correct frame-derived matte seam is separately validated. The rejected `getTokenViewOffset()` matte is not retained as a partial fix.

### Preserved boundaries

Booth bootstrap v0.1.0, Utilities v1.2.1, Dev loader v0.5.1, silent-cycle timing, native `display.update()` execution, corrected decal gizmo, Spinny, High Res, JSON, Developer Mode, Decals host, tabs, and Public Stable are unchanged.

### Validation gate

Booth/replay syntax, manifest identity/cache keys, wrapper-vs-mesh environment mock, narrow component-refresh mock, pre-BT replay handoff mock, native update passthrough, exact eight-file whitelist, protected blob equality, and committed-byte rerun must pass before Dev moves. Live validation then focuses on fantasy-background recovery and component-toggle stability before any new outer-matte work.

**Runtime behavior changed:** yes, Dev Booth/Black Canvas environment ownership only. Public Stable remains unchanged.'''
prepend_after_header('CHANGELOG.md', '# Changelog\n\n', changelog)

preflight = r'''## PFC-2026-09-07-045 — Repair Booth editor-environment ownership after v27.0.3 live failure

Date: 2026-09-07

### Reviewed

- binding HeroForge.Compatibility project contract, master, pre-flight, changelog, architecture, feature inventory, compatibility, ownership, and testing state;
- current Witch Dock Dev master/pre-flight/changelog/manifest;
- Booth v27.0.3, replay v0.1.4, bootstrap v0.1.0, and Booth/replay histories;
- Amanda's v27.0.3 screenshots and state-sequence report;
- prior bridge evidence for `setDefaultEnvironmentVisibility`, wrapper/mesh visibility mismatch, frame UV/resize geometry, and rejected WebGL matte probes;
- current Dev head `ca27025e137049640e50b68d98d9cdca70ed59a8`.

### Confirmed findings

- `BT.maker.getTokenViewOffset()` does not describe the visible editor 1:1 Booth viewport; the v27.0.3 DOM matte is visually wrong and rejected;
- all Booth sub-toggles share the broad native overlay refresh sequence, matching the user's observation that any of Lighting/Effects/Overlays/Background can knock the editor environment back out;
- regular environment wrapper visibility and actual background mesh visibility can disagree;
- replay v0.1.4 drops its pre-BT semantic-background ownership without restoring the owned mesh before Booth delegation;
- Black Canvas ON -> OFF restoring pedestal/ground but not the fantasy backdrop is consistent with those separate ownership paths.

### Decision

First restore deterministic environment ownership. Remove the bad matte, narrow component redraw behavior, gate editor restoration on actual render/environment state, and restore replay-owned visibility before Booth handoff. Do not solve the outer-black crop in this candidate; return to that only after environment/component behavior is live stable.

### Target files

- `tools/Booth.js`
- `features/booth/Black_Canvas_Display_Replay.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md`
- `HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md`

### Conflict risks / preservation requirements

- remove all v27.0.3 DOM matte state/DOM nodes and `getTokenViewOffset()` usage;
- preserve named native environment setter and existing component state application;
- do not call broad overlay resize/refresh/applyVisibility from component-toggle redraw;
- preserve layout/timing behavior elsewhere unless directly required by this repair;
- preserve native `CK.character.display.update()` and synchronous replay timing;
- replay must restore only visibility it previously owned before Booth handoff;
- do not touch bootstrap, Utilities, loader, Spinny, High Res, gizmo, JSON, Developer Mode, Decals, or Public Stable.

### Static gate

Booth/replay JavaScript syntax, manifest JSON/version/cache identity, absence of DOM matte/getTokenViewOffset path, wrapper-true/mesh-false editor restoration mock, no broad overlay calls in component refresh, replay pre-BT-to-BT ownership handoff, native update passthrough, exact eight-file changed whitelist, protected blob equality, committed-byte rerun.

### Live gate

Dev only: confirm Black Canvas OFF restores the full fantasy backdrop, all Booth component toggles can be changed without losing that editor environment, Background OFF fallthrough no longer checkerboards because of a stranded replay-owned mesh, `+ New` and white-flash behavior remain correct. Outer-black 1:1 matte remains a separate pending presentation gate.

**Runtime behavior changed:** yes, Dev only. Public Stable unchanged.'''
prepend_after_header('PRE_FLIGHT_Check.md', '# Pre-Flight Check Log\n\n', preflight)

# MASTER current state and gate.
master = read('MASTER.md')
master = master.replace('- Dev candidate is v0.1.4 / build `0.1.4-dev-component-aware-booth-reassert`.', '- Dev candidate is v0.1.5 / build `0.1.5-dev-restore-before-booth-handoff`.')
master = master.replace('- Dev Booth: v27.0.3 / build `v27.0.3`.', '- Dev Booth: v27.0.4 / build `v27.0.4`.')
if '## v27.0.3 Live Rejection / Environment Ownership Repair — 2026-09-07' not in master:
    marker = '## Booth / Utilities\n'
    section = r'''## v27.0.3 Live Rejection / Environment Ownership Repair — 2026-09-07

Amanda's live v27.0.3 smoke rejected the `getTokenViewOffset()` DOM matte: it mapped to a tiny token/render crop rather than the visible editor 1:1 viewport. That implementation is removed in v27.0.4 and is not a maintained fallback.

The same smoke isolated the deeper environment problem. Any Booth component toggle could hide the pedestal/editor environment after Black Canvas OFF, because all component toggles shared a broad native overlay resize/refresh/applyVisibility redraw. Separately, replay v0.1.4 could hide the regular background mesh before BT existed and then drop its visibility snapshot without restoring it before Booth delegation, leaving the fantasy backdrop stranded hidden while ground/pedestal state returned.

v27.0.4 / replay v0.1.5 repair those ownership paths first. Component redraw is narrow, editor restoration checks the actual mesh/ground state rather than only the wrapper flag, and replay restores what it owns before Booth takes presentation ownership. The outer-black 1:1 matte is deliberately deferred until a correct frame-derived viewport seam is validated.

'''
    if marker not in master:
        raise SystemExit('MASTER Booth marker missing')
    master = master.replace(marker, section + marker, 1)
write('MASTER.md', master)

new_gate = r'''## Current Gate

1. Update/reload Dev and confirm Booth v27.0.4 / replay v0.1.5.
2. With Black Canvas OFF, confirm the full fantasy editor backdrop (not only pedestal/ground) is visible.
3. While Booth View remains ON and Black Canvas OFF, toggle Lighting, Effects, Overlays, and Background individually ON/OFF; none may knock the fantasy editor environment back out or leave checkerboard/black behind after the component operation settles.
4. Exercise Black Canvas ON -> OFF once; OFF must restore the full fantasy backdrop, including the background image mesh.
5. With Black Canvas ON + Background OFF, confirm the checkerboard caused by a stranded replay-owned background is gone. The outside-of-1:1 matte is intentionally not an acceptance requirement in this state-repair build.
6. Verify `+ New Figure` still drops default-owned Booth correctly and Black Canvas remains independently persistent.
7. Verify the known white-flash action remains flash-free.
8. Only after this state-repair smoke passes should the frame-derived outer-black matte be investigated again; Public Stable promotion remains blocked until the complete Dev presentation is validated.'''
replace_heading_section('MASTER.md', '## Current Gate\n', new_gate)

booth_history = r'''## 2026-09-07 v27.0.3 live rejection / environment ownership repair — v27.0.4

Amanda's v27.0.3 visual smoke disproved the `BT.maker.getTokenViewOffset()` matte assumption. The four-bar DOM matte left only a tiny square around the figure while the real Booth 1:1 viewport was much larger. `getTokenViewOffset()` is therefore a token/render crop contract, not the editor presentation crop, and the DOM matte is removed rather than tuned.

The same smoke exposed a separate environment lifecycle defect. Black Canvas ON -> OFF could restore the pedestal/ground, but changing any of Lighting, Effects, Overlays, or Background could hide that environment again even though Black Canvas remained OFF. Source review shows every component toggle ends in `refreshBTComponentRender()`, whose broad native `overlays.resize()/refresh()/applyVisibility()` sequence is the common operation across all of those failures.

v27.0.4 keeps the component-specific operations but narrows redraw to direct component reassertion plus `CK.GameLoop.requestRenderRefresh()` when available. It no longer invokes the broad native overlay visibility sequence merely because a component checkbox changed.

Editor environment restoration also no longer trusts `CK.environment.background.visible` alone. Live bridge evidence has shown wrapper/mesh disagreement in both directions. The helper now treats a hidden regular background mesh, hidden ground, `hideGround`, or hidden summon circle as restoration signals and explicitly re-shows the regular background render mesh after the named native environment setter when editor fallthrough is required.

The outer-black matte is intentionally unresolved again. Current frame-plane UV/resize evidence remains the correct next investigation basis, but no replacement matte is part of v27.0.4.'''
append_once('HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md', '## 2026-09-07 v27.0.3 live rejection / environment ownership repair — v27.0.4', booth_history)

replay_history = r'''## 2026-09-07 pre-BT ownership handoff repair — v0.1.5

v0.1.4 introduced Booth delegation but relinquished replay's semantic-background pointer by simply clearing it. That is unsafe when replay acquired `CK.environment.background.mesh` before BT existed: Black Canvas may have changed the mesh from visible to hidden, and clearing the snapshot does not restore the visibility value replay owns.

This matches the later live symptom where the native environment setter could restore pedestal/ground state while the fantasy background image remained absent. v0.1.5 keeps the same post-`CK.character.display.update()` wrapper and timing, but before successful Booth delegation it restores any semantic-background visibility currently owned by replay. Booth then applies the final BT presentation policy.

The legacy/pre-BT path remains unchanged when Booth cannot own presentation. Black Canvas OFF/dispose still restores replay-owned visibility, and native `display.update()` always executes.'''
append_once('HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md', '## 2026-09-07 pre-BT ownership handoff repair — v0.1.5', replay_history)

print('BOOTH ENV OWNERSHIP PATCH COMPLETED')

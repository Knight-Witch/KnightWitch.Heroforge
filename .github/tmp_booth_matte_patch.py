from pathlib import Path


def read(path):
    return Path(path).read_text(encoding='utf-8')


def write(path, text):
    Path(path).write_text(text, encoding='utf-8', newline='\n')


def replace_count(path, old, new, expected=1):
    text = read(path)
    count = text.count(old)
    if count != expected:
        raise SystemExit(f'{path}: expected {expected} matches, got {count} for {old[:140]!r}')
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


# Booth v27.0.3: component-aware Black Canvas fallthrough with owned DOM matte.
replace_count('tools/Booth.js', "  const BUILD_TAG = 'v27.0.2';", "  const BUILD_TAG = 'v27.0.3';")
replace_count('tools/Booth.js',
              "    btCanvasVisualSnapshot: null,\n    btCanvasLayoutKey: null,",
              "    btCanvasVisualSnapshot: null,\n    btCanvasLayoutKey: null,\n\n    blackCanvasMatteRoot: null,\n    blackCanvasMatteBars: null,\n    blackCanvasMatteParent: null,\n    blackCanvasMatteLayoutKey: null,")

editor_env = r'''  function ensureEditorEnvironmentBehindBooth(options) {
    try {
      const allowBlackCanvas = !!(options && options.allowBlackCanvas);
      if (!state.userBoothOn || (state.bgOn && !allowBlackCanvas)) return false;
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
  }'''
replace_function('tools/Booth.js', 'ensureEditorEnvironmentBehindBooth', editor_env)

matte_helpers = r'''
  function disposeBlackCanvasMatte() {
    try {
      const root = state.blackCanvasMatteRoot;
      if (root && root.parentElement) root.parentElement.removeChild(root);
    } catch {}
    state.blackCanvasMatteRoot = null;
    state.blackCanvasMatteBars = null;
    state.blackCanvasMatteParent = null;
    state.blackCanvasMatteLayoutKey = null;
    return true;
  }

  function hideBlackCanvasMatte(remove) {
    if (remove) return disposeBlackCanvasMatte();
    try {
      if (state.blackCanvasMatteRoot) state.blackCanvasMatteRoot.style.display = 'none';
    } catch {}
    return true;
  }

  function setMatteRect(el, left, top, width, height) {
    if (!el) return;
    const w = Math.max(0, Number(width) || 0);
    const h = Math.max(0, Number(height) || 0);
    if (w <= 0.01 || h <= 0.01) {
      el.style.display = 'none';
      return;
    }
    el.style.display = 'block';
    el.style.left = left + 'px';
    el.style.top = top + 'px';
    el.style.width = w + 'px';
    el.style.height = h + 'px';
  }

  function ensureBlackCanvasMatte() {
    try {
      const BT = UW.BT;
      const CK = UW.CK;
      const maker = BT && BT.maker;
      const canvas = CK && CK.renderManager && CK.renderManager.renderer
        ? CK.renderManager.renderer.domElement
        : null;
      const parent = canvas && canvas.parentElement ? canvas.parentElement : null;
      if (!maker || typeof maker.getTokenViewOffset !== 'function' || !canvas || !parent) return false;

      const view = maker.getTokenViewOffset();
      if (!view || !(Number(view.fullWidth) > 0) || !(Number(view.fullHeight) > 0)) return false;
      if (!(Number(view.width) > 0) || !(Number(view.height) > 0)) return false;

      let root = state.blackCanvasMatteRoot;
      if (!root || state.blackCanvasMatteParent !== parent || !root.isConnected) {
        disposeBlackCanvasMatte();
        root = document.createElement('div');
        root.id = 'kwBoothBlackCanvasMatte';
        root.setAttribute('aria-hidden', 'true');
        Object.assign(root.style, {
          position: 'absolute',
          pointerEvents: 'none',
          overflow: 'hidden',
          background: 'transparent',
          zIndex: '1',
          display: 'none'
        });

        const bars = {};
        ['top', 'bottom', 'left', 'right'].forEach((name) => {
          const el = document.createElement('div');
          el.dataset.kwBoothMatte = name;
          Object.assign(el.style, {
            position: 'absolute',
            pointerEvents: 'none',
            background: '#000000'
          });
          root.appendChild(el);
          bars[name] = el;
        });

        parent.appendChild(root);
        state.blackCanvasMatteRoot = root;
        state.blackCanvasMatteBars = bars;
        state.blackCanvasMatteParent = parent;
        state.blackCanvasMatteLayoutKey = null;
      }

      const canvasRect = canvas.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const cssWidth = Number(canvasRect.width) || Number(canvas.clientWidth) || 0;
      const cssHeight = Number(canvasRect.height) || Number(canvas.clientHeight) || 0;
      if (!(cssWidth > 0) || !(cssHeight > 0)) return false;

      const scaleX = cssWidth / Number(view.fullWidth);
      const scaleY = cssHeight / Number(view.fullHeight);
      const cropLeft = clamp(Number(view.offsetX) * scaleX, 0, cssWidth);
      const cropTop = clamp(Number(view.offsetY) * scaleY, 0, cssHeight);
      const cropRight = clamp(cropLeft + Number(view.width) * scaleX, cropLeft, cssWidth);
      const cropBottom = clamp(cropTop + Number(view.height) * scaleY, cropTop, cssHeight);
      const localLeft = canvas.offsetParent === parent
        ? Number(canvas.offsetLeft) || 0
        : (Number(canvasRect.left) - Number(parentRect.left) - (Number(parent.clientLeft) || 0) + (Number(parent.scrollLeft) || 0));
      const localTop = canvas.offsetParent === parent
        ? Number(canvas.offsetTop) || 0
        : (Number(canvasRect.top) - Number(parentRect.top) - (Number(parent.clientTop) || 0) + (Number(parent.scrollTop) || 0));

      const q = (value) => Math.round((Number(value) || 0) * 4) / 4;
      const key = [
        q(localLeft), q(localTop), q(cssWidth), q(cssHeight),
        q(cropLeft), q(cropTop), q(cropRight), q(cropBottom)
      ].join(':');

      root.style.left = localLeft + 'px';
      root.style.top = localTop + 'px';
      root.style.width = cssWidth + 'px';
      root.style.height = cssHeight + 'px';
      root.style.display = 'block';

      if (state.blackCanvasMatteLayoutKey !== key) {
        const bars = state.blackCanvasMatteBars || {};
        setMatteRect(bars.top, 0, 0, cssWidth, cropTop);
        setMatteRect(bars.bottom, 0, cropBottom, cssWidth, cssHeight - cropBottom);
        setMatteRect(bars.left, 0, cropTop, cropLeft, cropBottom - cropTop);
        setMatteRect(bars.right, cropRight, cropTop, cssWidth - cropRight, cropBottom - cropTop);
        state.blackCanvasMatteLayoutKey = key;
      }
      return true;
    } catch {
      hideBlackCanvasMatte(false);
      return false;
    }
  }

  function isNativePhotoBoothForPresentation() {
    try {
      const rt = runtimeNow(null);
      const tokenizer = rt && rt.tokenizer ? rt.tokenizer : null;
      const mode = tokenizer && typeof tokenizer.currentMode === 'string'
        ? tokenizer.currentMode
        : (rt && typeof rt.currentMode === 'string' ? rt.currentMode : null);
      if (mode && mode.toLowerCase().includes('booth')) return true;
    } catch {}
    return inPhotoBoothUI();
  }
'''
replace_count('tools/Booth.js', '  function enforceBTBlackCanvas() {', matte_helpers + '\n  function enforceBTBlackCanvas(options) {')

enforce = r'''  function enforceBTBlackCanvas(options) {
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
      const matteReady = wantsEditorFallback ? ensureBlackCanvasMatte() : false;

      if (matteReady) {
        ensureEditorEnvironmentBehindBooth({ allowBlackCanvas: true });
      } else {
        hideBlackCanvasMatte(false);
        if (typeof env.setDefaultEnvironmentVisibility === 'function') {
          env.setDefaultEnvironmentVisibility(false);
        }
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
replace_function('tools/Booth.js', 'enforceBTBlackCanvas', enforce)

restore = r'''  function restoreBTCanvasVisualState() {
    const snap = state.btCanvasVisualSnapshot;
    try {
      disposeBlackCanvasMatte();
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
      if (snap && overlays) {
        if (overlays.backgroundPlane && snap.backgroundVisible !== null) overlays.backgroundPlane.visible = snap.backgroundVisible;
        if (overlays.framePlane && snap.frameVisible !== null) overlays.framePlane.visible = snap.frameVisible;
        if (overlays.shadowPlane && snap.shadowVisible !== null) overlays.shadowPlane.visible = snap.shadowVisible;
        if (overlays.mask && snap.maskVisible !== null && 'visible' in overlays.mask) overlays.mask.visible = snap.maskVisible;
      }
      if (canvas) {
        canvas.style.backgroundColor = snap ? snap.canvasBackground : '';
        if (canvas.parentElement) canvas.parentElement.style.backgroundColor = snap ? snap.holderBackground : '';
      }
      state.btCanvasVisualSnapshot = null;
      state.btCanvasLayoutKey = null;
      return true;
    } catch {
      disposeBlackCanvasMatte();
      state.btCanvasVisualSnapshot = null;
      state.btCanvasLayoutKey = null;
      return false;
    }
  }'''
replace_function('tools/Booth.js', 'restoreBTCanvasVisualState', restore)

# The tick already has the strongest native-Booth determination; pass it explicitly.
replace_count('tools/Booth.js',
"""    if (state.bgOn && TN && TN.__kwBT) {
      try { enforceBTBlackCanvas(); } catch {}
    }""",
"""    if (state.bgOn && TN && TN.__kwBT) {
      try { enforceBTBlackCanvas({ allowEditorFallback: !inBooth }); } catch {}
    }""")

# Figure changes cannot retain an owned matte DOM node from the previous figure.
replace_count('tools/Booth.js',
              "  function clearFigureScopedSnapshots() {\n    state.capturedMaterial = null;",
              "  function clearFigureScopedSnapshots() {\n    try { disposeBlackCanvasMatte(); } catch {}\n    state.capturedMaterial = null;")

# Public API seam used by the post-display.update replay. Returning false lets replay keep its pre-BT fallback.
api_helper = r'''  function reassertBlackCanvasPresentation() {
    try {
      if (!state.bgOn) return false;
      const rt = resolveRuntime();
      if (!rt || !rt.__kwBT) return false;
      return !!enforceBTBlackCanvas();
    } catch {
      return false;
    }
  }

'''
replace_count('tools/Booth.js', '  function installBoothApi() {', api_helper + '  function installBoothApi() {')
replace_count('tools/Booth.js',
              "      setSessionBooth: onUserBoothToggle,\n      setSessionBlackCanvas: onUserBgToggle",
              "      setSessionBooth: onUserBoothToggle,\n      setSessionBlackCanvas: onUserBgToggle,\n      reassertBlackCanvasPresentation")
replace_count('tools/Booth.js', "      version: '27.0.2',", "      version: '27.0.3',", expected=2)

# Replay v0.1.4 delegates full BT presentation to Booth, retaining legacy/pre-BT behavior otherwise.
replace_count('features/booth/Black_Canvas_Display_Replay.js',
              "  const VERSION = '0.1.3';\n  const BUILD = '0.1.3-dev-editor-background-restore';",
              "  const VERSION = '0.1.4';\n  const BUILD = '0.1.4-dev-component-aware-booth-reassert';")

replay_helpers = r'''  function reassertThroughBoothApi() {
    try {
      const api = UW.KW_WD_BOOTH;
      if (!api || typeof api.reassertBlackCanvasPresentation !== 'function') return false;
      return api.reassertBlackCanvasPresentation() === true;
    } catch (error) {
      recordError('reassertThroughBoothApi', error);
      return false;
    }
  }

  function relinquishSemanticBackgroundOwnership() {
    state.semanticBackground = null;
    state.semanticBackgroundVisible = null;
  }

'''
replace_count('features/booth/Black_Canvas_Display_Replay.js', '  function replayBlackCanvas(reason) {', replay_helpers + '  function replayBlackCanvas(reason) {')

replay_fn = r'''  function replayBlackCanvas(reason) {
    if (!state.enabled || !isBlackCanvasOn()) return false;

    let applied = false;
    try {
      const delegated = reassertThroughBoothApi();
      if (delegated) {
        // Booth now owns component-aware BT presentation, including the
        // Background-OFF fantasy fallback. Do not re-hide that background here.
        relinquishSemanticBackgroundOwnership();
        applied = true;
      } else {
        const BT = UW.BT;
        const display = BT && BT.display ? BT.display : null;
        const env = display ? display.environment : null;
        const overlays = display ? display.overlays : null;

        if (env && typeof env.setDefaultEnvironmentVisibility === 'function') {
          env.setDefaultEnvironmentVisibility(false);
          applied = true;
        }

        if (overlays) {
          if (overlays.framePlane) overlays.framePlane.visible = false;
          if (overlays.shadowPlane) overlays.shadowPlane.visible = false;
          if (overlays.mask && 'visible' in overlays.mask) overlays.mask.visible = false;
          applied = true;
        }

        // Do not force overlays.backgroundPlane here. Booth.js owns the user's
        // Background component choice. This legacy path remains for pre-BT or
        // older API shapes that cannot own the full presentation themselves.
        if (hideSemanticBackground()) applied = true;
      }

      const canvas = rendererCanvas();
      if (canvas) {
        canvas.style.backgroundColor = '#000000';
        if (canvas.parentElement) canvas.parentElement.style.backgroundColor = '#000000';
        applied = true;
      }

      if (applied) {
        state.replayCount += 1;
        state.lastReplayAt = Date.now();
      }
      return applied;
    } catch (error) {
      recordError('replayBlackCanvas:' + String(reason || 'unknown'), error);
      return false;
    }
  }'''
replace_function('features/booth/Black_Canvas_Display_Replay.js', 'replayBlackCanvas', replay_fn)

poll_fn = r'''  function poll() {
    if (!state.enabled) return;
    try {
      ensureWrapped();
      const blackOn = isBlackCanvasOn();

      if (blackOn) {
        if (!state.lastBlackCanvasOn) {
          replayBlackCanvas('black-canvas-enabled');
        } else if (reassertThroughBoothApi()) {
          // If Booth became available after the pre-BT fallback acquired the
          // background, release replay ownership without mutating Booth's state.
          relinquishSemanticBackgroundOwnership();
        } else {
          // Legacy/pre-BT path: keep the semantic scene background hidden if
          // HeroForge replaced it without replacing the primary display.
          hideSemanticBackground();
        }
      } else if (state.lastBlackCanvasOn || state.semanticBackground) {
        restoreSemanticBackground();
      }

      state.lastBlackCanvasOn = blackOn;
    } catch (error) {
      recordError('poll', error);
    }
    state.pollTimer = setTimeout(poll, POLL_MS);
  }'''
replace_function('features/booth/Black_Canvas_Display_Replay.js', 'poll', poll_fn)

# Manifest/cache identities.
replace_count('manifest.json',
"""      \"version\": \"27.0.2\",
      \"build\": \"v27.0.2\",
      \"versionOrigin\": \"dev-booth-presentation-repair-2026-09-07\"""",
"""      \"version\": \"27.0.3\",
      \"build\": \"v27.0.3\",
      \"versionOrigin\": \"dev-booth-component-aware-black-canvas-2026-09-07\"""")
replace_count('manifest.json',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/tools/Booth.js?v=27.0.2-v27.0.2',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/tools/Booth.js?v=27.0.3-v27.0.3')
replace_count('manifest.json',
"""      \"version\": \"0.1.3\",
      \"build\": \"0.1.3-dev-editor-background-restore\",
      \"versionOrigin\": \"dev-booth-lifecycle-repair-2026-09-07\"""",
"""      \"version\": \"0.1.4\",
      \"build\": \"0.1.4-dev-component-aware-booth-reassert\",
      \"versionOrigin\": \"dev-booth-component-aware-black-canvas-2026-09-07\""")
replace_count('manifest.json',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/features/booth/Black_Canvas_Display_Replay.js?v=0.1.3-dev-editor-background-restore',
              'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/features/booth/Black_Canvas_Display_Replay.js?v=0.1.4-dev-component-aware-booth-reassert')

changelog = r'''## DOCK-2026-09-07-044 — Make Black Canvas component-aware when Booth Background is off

Date: 2026-09-07

### Live result entering this repair

Dev v27.0.2 fixed the ordinary fantasy canvas restoration when Black Canvas turns OFF. Amanda then confirmed two remaining presentation symptoms:

- with Black Canvas OFF, toggling Booth Background OFF did not visually produce the expected distinction;
- with Black Canvas ON, Booth Background OFF correctly hid the Booth background but exposed checkerboard rather than the fantasy editor environment inside the 1:1 viewport.

The known white-flash regression remained closed.

### Confirmed diagnosis

Bridge reads proved the Background component itself is not stuck: with Black Canvas OFF + Background OFF, `BT.display.overlays.backgroundPlane.visible` remains false, Booth environment mesh remains false, and the regular `CK.environment` background/ground are visible. No second Booth backdrop layer was found in that state.

For Black Canvas ON + Background OFF, both Booth and replay were still globally hiding the regular environment. That necessarily leaves checkerboard once the Booth background plane is false.

HeroForge's current frame shader was also audited. Its outside-1:1 gray overlay is literal shader code (`vec4(0.5,0.5,0.5,0.7)`) selected by UVs outside `[0,1]`; there is no named color uniform. Two reversible custom WebGL matte probes were rejected after both returned `INVALID_OPERATION (1282)`.

HeroForge does expose a safer named viewport contract: `BT.maker.getTokenViewOffset()` returns full render size plus current crop offsets/size. The live canvas and render-manager dimensions aligned, and `#character-canvas` is an untransformed absolutely positioned renderer container.

### Changes

- Booth -> v27.0.3 / build `v27.0.3`;
- Black Canvas replay -> v0.1.4 / build `0.1.4-dev-component-aware-booth-reassert`;
- when Booth View + Black Canvas are ON, Background is OFF, and the page is outside native Photo Booth, Booth keeps the regular fantasy environment visible inside the native token crop;
- an owned four-bar DOM matte covers only the renderer area outside `BT.maker.getTokenViewOffset()`; layout is keyed and rewritten only when renderer/crop geometry changes;
- if the matte capability is unavailable, behavior degrades to the previous full-black/checkerboard path rather than partially exposing the canvas;
- native Photo Booth is excluded from the editor-fallback matte;
- Black Canvas OFF, figure changes, and restoration remove the owned matte;
- Booth exposes a narrow `reassertBlackCanvasPresentation()` API so the already-validated post-`CK.character.display.update()` replay can synchronously delegate component-aware BT presentation instead of re-hiding the fantasy environment;
- pre-BT/editor-only replay behavior remains available as the fallback path.

### Preserved boundaries

Booth bootstrap v0.1.0, Utilities v1.2.1, loader v0.5.1, established Booth timing/silent-cycle behavior, native `display.update()` execution, corrected decal gizmo, Spinny, High Res, JSON, Developer Mode, Decals host, tabs, and Public Stable remain unchanged.

### Validation gate

Booth/replay syntax, manifest identities, matte geometry math, component-aware enforcement, delegation/fallback replay mocks, exact changed-file whitelist, protected blobs, and committed-candidate rerun must pass before Dev moves. Live visual acceptance remains required afterward.

**Runtime behavior changed:** yes, Dev Booth/Black Canvas presentation only. Public Stable remains unchanged.'''
prepend_after_header('CHANGELOG.md', '# Changelog\n\n', changelog)

preflight = r'''## PFC-2026-09-07-044 — Component-aware Black Canvas / Background fallthrough

Date: 2026-09-07

### Reviewed

- binding HeroForge.Compatibility contract/master/pre-flight/changelog/architecture/inventory/compatibility/ownership/testing state;
- current Witch Dock Dev master/pre-flight/changelog/manifest;
- Booth v27.0.2, replay v0.1.3, bootstrap v0.1.0, and their Booth/Black Canvas histories;
- Amanda's v27.0.2 visual acceptance/failure report;
- live bridge issues #725-#748 covering current overlay/environment state, frame shader source, rejected WebGL matte probes, native token-view math, renderer geometry, and stacking context.

### Confirmed findings

- Black Canvas OFF now restores the ordinary fantasy editor canvas correctly;
- Background OFF is technically preserved (`backgroundPlane.visible=false`) and does not re-enable a hidden Booth environment mesh;
- Black Canvas ON still globally hides the regular environment, causing checkerboard when Background OFF makes the 1:1 Booth plane transparent;
- current native gray surround is hard-coded in the frame shader and has no named runtime color uniform;
- custom WebGL matte attempts using both a cloned frame mesh and a fresh Mesh fail with GL `1282`; that route is rejected;
- named `BT.maker.getTokenViewOffset()` supplies the current crop rectangle from render-manager dimensions;
- `#character-canvas` is a suitable owned DOM host above the renderer without requiring a page-global overlay.

### Decision

Use an independent four-bar DOM matte driven by the named native token-view rectangle. Keep component/environment decisions in Booth and let replay delegate full BT reassertion to Booth after native `display.update()`. Retain replay's old pre-BT behavior only when the Booth API cannot own presentation.

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

- do not patch HeroForge's Booth bundle;
- do not use the failed custom WebGL matte route;
- do not alter native `CK.character.display.update()` or the synchronous post-update replay position;
- do not activate the editor matte inside native Photo Booth;
- do not make Black Canvas imply Booth View;
- do not call environment setters repeatedly after desired visibility already exists;
- matte DOM must be pointer-inert, renderer-scoped, geometry-keyed, and fully removable;
- capability failure must degrade to existing Black Canvas behavior rather than leave outside-crop fantasy content exposed;
- Public Stable remains untouched.

### Static gate

Booth/replay JavaScript syntax, manifest JSON/version/cache identity, DOM matte geometry mock, component-aware enforcement mock, replay delegation plus legacy/pre-BT fallback mocks, exact eight-file whitelist, protected blob equality, and committed-byte rerun.

### Live gate

Dev only: verify Black Canvas OFF behavior stays fixed; Black Canvas ON + Background OFF gives fantasy environment inside 1:1 and black outside; Background ON restores Booth background with black outside; the matte tracks resize; `+ New`, both-OFF restoration, and white-flash suppression remain correct. Re-check the reported Black-OFF Background visual after this repair before inferring any additional layer.

**Runtime behavior changed:** yes, Dev only. Public Stable unchanged.'''
prepend_after_header('PRE_FLIGHT_Check.md', '# Pre-Flight Check Log\n\n', preflight)

master = read('MASTER.md')
master = master.replace('- Dev Booth: v27.0.2 / build `v27.0.2`.', '- Dev Booth: v27.0.3 / build `v27.0.3`.')
master = master.replace('- Dev candidate is v0.1.2 / build `0.1.2-dev-stable-state-plus-pre-bt-background`.', '- Dev candidate is v0.1.4 / build `0.1.4-dev-component-aware-booth-reassert`.')
if '## Component-aware Black Canvas / Background Fallthrough — 2026-09-07' not in master:
    marker = '## Booth / Utilities\n'
    if marker not in master:
        raise SystemExit('MASTER Booth marker missing')
    section = r'''## Component-aware Black Canvas / Background Fallthrough — 2026-09-07

v27.0.2 live validation confirmed ordinary fantasy-canvas restoration when Black Canvas turns OFF. The remaining Black-ON/Background-OFF checkerboard is a separate composition problem: the Booth background plane is correctly OFF, but Black Canvas globally hides the regular environment beneath it.

Current HeroForge's gray outside-token overlay is not a usable runtime color seam: its shader literally writes 50% gray at 70% alpha outside UV `[0,1]`. Two reversible custom RawShaderMaterial matte probes both failed with WebGL `INVALID_OPERATION (1282)` and are rejected.

The maintained v27.0.3 approach uses HeroForge's named `BT.maker.getTokenViewOffset()` rectangle instead. Four pointer-inert black DOM bars live under `#character-canvas`, cover only the renderer outside the native crop, and update only when crop/canvas geometry changes. When this matte is available, Background OFF may reveal the fantasy environment inside the 1:1 crop while Black Canvas still owns black outside it. Failure falls back to the prior full-black behavior.

Replay v0.1.4 delegates full BT presentation to Booth through `reassertBlackCanvasPresentation()` after native `display.update()`; its pre-BT compatibility path is retained. The established white-flash timing boundary is unchanged.

'''
    master = master.replace(marker, section + marker, 1)

new_gate = r'''## Current Gate

1. Update/reload Dev with Public Stable disabled and confirm Booth v27.0.3 / replay v0.1.4 are loaded.
2. Black Canvas OFF: ordinary fantasy editor canvas restoration must remain correct and the gray native frame must remain absent.
3. Booth View ON + Black Canvas ON + Background OFF: fantasy editor environment must be visible inside the native 1:1 crop while the renderer outside it is solid black, with no checkerboard or gray surround.
4. Toggle Background ON: saved Booth background must return inside the crop while outside remains black; toggle OFF again and verify fantasy fallthrough returns.
5. Resize the window once: the black matte must continue to align with the native crop.
6. Re-check the earlier Black-Canvas-OFF Background visual; runtime evidence currently shows the Booth plane is already truly OFF there, so do not add another layer fix unless the visual still disagrees after this composition repair.
7. Verify `+ New Figure`, both-OFF restoration, and the known flash-causing action remain correct.
8. Only after this smoke passes should the bootstrap/replay/Booth/loader repair be prepared for narrow Public Stable promotion.'''
replace_section('MASTER.md', '## Current Gate\n', 'Historical state through', new_gate)
write('MASTER.md', master if '## Current Gate\n' not in master else read('MASTER.md'))
# replace_section wrote MASTER from current disk; apply version/section edits again if needed
m = read('MASTER.md')
m = m.replace('- Dev Booth: v27.0.2 / build `v27.0.2`.', '- Dev Booth: v27.0.3 / build `v27.0.3`.')
m = m.replace('- Dev candidate is v0.1.3 / build `0.1.3-dev-editor-background-restore`.', '- Dev candidate is v0.1.4 / build `0.1.4-dev-component-aware-booth-reassert`.')
if '## Component-aware Black Canvas / Background Fallthrough — 2026-09-07' not in m:
    marker = '## Booth / Utilities\n'
    section = r'''## Component-aware Black Canvas / Background Fallthrough — 2026-09-07

v27.0.2 live validation confirmed ordinary fantasy-canvas restoration when Black Canvas turns OFF. The remaining Black-ON/Background-OFF checkerboard is a separate composition problem: the Booth background plane is correctly OFF, but Black Canvas globally hides the regular environment beneath it.

Current HeroForge's gray outside-token overlay is not a usable runtime color seam: its shader literally writes 50% gray at 70% alpha outside UV `[0,1]`. Two reversible custom RawShaderMaterial matte probes both failed with WebGL `INVALID_OPERATION (1282)` and are rejected.

The maintained v27.0.3 approach uses HeroForge's named `BT.maker.getTokenViewOffset()` rectangle instead. Four pointer-inert black DOM bars live under `#character-canvas`, cover only the renderer outside the native crop, and update only when crop/canvas geometry changes. When this matte is available, Background OFF may reveal the fantasy environment inside the 1:1 crop while Black Canvas still owns black outside it. Failure falls back to the prior full-black behavior.

Replay v0.1.4 delegates full BT presentation to Booth through `reassertBlackCanvasPresentation()` after native `display.update()`; its pre-BT compatibility path is retained. The established white-flash timing boundary is unchanged.

'''
    if marker not in m:
        raise SystemExit('MASTER Booth marker missing after gate update')
    m = m.replace(marker, section + marker, 1)
write('MASTER.md', m)

booth_history = r'''## 2026-09-07 component-aware Black Canvas follow-up — v27.0.3

v27.0.2 closed the ordinary editor-background restoration defect but exposed the distinction between Black Canvas and the Booth Background component. With Black Canvas ON and Background OFF, `backgroundPlane.visible` was correctly false while Black Canvas still hid the regular environment, so checkerboard was inevitable inside the transparent token crop.

The current native frame shader was inspected from `/gated/booth.js?version=heroforge07.1.9.98`. Its gray surround is hard-coded as `vec4(0.5,0.5,0.5,0.7)` whenever frame UV lies outside `[0,1]`; there is no named runtime matte-color uniform. The frame geometry itself spans UV `-3.5..4.5`, confirming the crop purpose, but two bounded custom RawShaderMaterial probes — one on a cloned frame mesh and one on a fresh mesh sharing only geometry/transform — both returned WebGL error 1282. That custom-renderer route is rejected.

HeroForge's named `BT.maker.getTokenViewOffset()` provides a cleaner independent-UI seam. Its source derives `{fullWidth, fullHeight, offsetX, offsetY, width, height}` from current render-manager dimensions, token relative size/aspect, and camera zoom. Live reads confirmed the canvas CSS/render dimensions align and `#character-canvas` is an untransformed absolutely positioned host.

v27.0.3 therefore owns a four-bar DOM matte. It maps the native token rectangle into current canvas CSS dimensions, keys geometry at quarter-pixel precision, and rewrites bar rectangles only when that key changes. The matte is pointer-inert, renderer-scoped, hidden when unused, and removed on Black Canvas restoration or figure-generation reset.

Component-aware Black Canvas behavior is now:

- Booth OFF + Black Canvas ON: preserve prior full-black editor behavior;
- Booth ON + Background ON + Black Canvas ON: preserve Booth background inside and black outside;
- Booth ON + Background OFF + Black Canvas ON outside native Photo Booth: if the native token rectangle/matte capability is available, restore the regular fantasy environment and cover only outside the crop with black; if capability is unavailable, fall back to prior full-black behavior;
- native Photo Booth: no editor DOM matte.

A narrow `reassertBlackCanvasPresentation()` Booth API lets the separate display replay synchronously request this exact policy after native `CK.character.display.update()` without duplicating component decisions.'''
append_once('HISTORY/BULLSHIT/BOOTH_V27_STABILIZATION.md', '## 2026-09-07 component-aware Black Canvas follow-up — v27.0.3', booth_history)

replay_history = r'''## 2026-09-07 component-aware delegation follow-up — v0.1.4

The Background-OFF checkerboard investigation showed that the replay's previously correct global background hide becomes wrong once Booth itself owns an inner fantasy-environment fallback. v0.1.4 does not change the validated wrapper location: native `CK.character.display.update()` still runs untouched and replay still occurs synchronously in `finally`.

When the current Booth API exposes `reassertBlackCanvasPresentation()`, replay now delegates full BT presentation to that API and relinquishes any legacy semantic-background ownership without restoring/mutating it afterward. This prevents replay from immediately re-hiding the environment that Booth intentionally restored behind a Background-OFF token crop.

If Booth/BT is unavailable or the API cannot handle presentation, the old behavior remains: named environment/frame/shadow/mask reassertion, semantic background hide, and canvas/holder black. This preserves the pre-BT Black Canvas startup path and diagnostic fallback.

Polling follows the same split: current Booth API reassertion when available; semantic-background maintenance only on the legacy path. Black Canvas OFF/dispose restoration behavior remains unchanged.'''
append_once('HISTORY/BULLSHIT/BOOTH_BLACK_CANVAS_DISPLAY_REPLAY.md', '## 2026-09-07 component-aware delegation follow-up — v0.1.4', replay_history)

print('BOOTH MATTE PATCH COMPLETED')

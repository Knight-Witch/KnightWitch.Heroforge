from pathlib import Path
import json
import subprocess

ROOT = Path('.')


def read(path):
    return (ROOT / path).read_text(encoding='utf-8')


def write(path, text):
    (ROOT / path).write_text(text, encoding='utf-8')


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected exactly 1 match, found {count}')
    return text.replace(old, new, 1)


def prepend_after(text, anchor, block, label):
    if block.strip() in text:
        raise RuntimeError(f'{label}: block already present')
    return replace_once(text, anchor, anchor + block, label)


# ---------------------------------------------------------------------------
# Booth v26: actively apply saved defaults at startup, but auto-enable Booth
# only when the loaded figure has character-owned Photo Booth config.
# ---------------------------------------------------------------------------
booth_path = 'tools/Booth.js'
booth = read(booth_path)
booth = replace_once(booth, "const BUILD_TAG = 'v25';", "const BUILD_TAG = 'v26';", 'Booth build tag')

booth = replace_once(
    booth,
    "    bgOn: false,\n    defaultBlackCanvas: false,\n    persistLightingOn: true,",
    "    bgOn: false,\n    defaultBlackCanvas: false,\n    defaultSessionBooth: false,\n    savedBoothMissingTicks: 0,\n    startupBlackKicks: 0,\n    persistLightingOn: true,",
    'Booth startup state'
)

saved_config_helpers = r'''  function readSavedBoothConfig(TN) {
    try {
      const t = TN && TN.tokenizer ? TN.tokenizer : null;
      if (!t) return null;

      if (TN.__kwBT) {
        const BT = UW.BT;
        const CK = UW.CK;
        const mode = (BT && (BT.currentMode || BT._boothMode)) || TN.currentMode || null;
        const custom = CK && CK.data && CK.data.custom;
        const cfg = custom && mode ? custom[mode] : null;
        if (!cfg || typeof cfg !== 'object') return null;

        // Hero Forge's current Booth source stores deliberate camera state at
        // CK.data.custom[BT.currentMode].cameraSave and stores the other Booth
        // presentation selections in the same per-mode custom config. Do not
        // use BT.maker existence/_enabledFor as evidence: those are runtime
        // state and can exist for a brand-new figure.
        const filters = cfg.filters && typeof cfg.filters === 'object' ? cfg.filters : null;
        const selected = cfg.selected && typeof cfg.selected === 'object' ? cfg.selected : null;
        const signals = [];
        if (cfg.cameraSave) signals.push('cameraSave');
        if (cfg.camera) signals.push('camera');
        if (cfg.lighting) signals.push('lighting');
        if (cfg.effects) signals.push('effects');
        if (filters && filters.tokenBg) signals.push('filters.tokenBg');
        if (filters && filters.tokenFrame) signals.push('filters.tokenFrame');
        if (selected && selected.tokenBg !== undefined && selected.tokenBg !== null) signals.push('selected.tokenBg');
        if (selected && selected.tokenFrame !== undefined && selected.tokenFrame !== null) signals.push('selected.tokenFrame');
        if (!signals.length) return null;
        return { mode, signals };
      }

      if (t.savedCamera) {
        return { mode: getTokenizerMode(TN) || 'legacy', signals: ['savedCamera'] };
      }
    } catch {}
    return null;
  }

  function hasSavedBoothSetup(TN) {
    return !!readSavedBoothConfig(TN);
  }

'''
booth = replace_once(
    booth,
    "  function detectExistingBooth(TN) {\n",
    saved_config_helpers + "  function detectExistingBooth(TN) {\n",
    'saved Booth config helpers'
)

old_auto = r'''  function maybeAutoApply(TN) {
    if (!state.consent) return;
    const now = Date.now();
    if (now - state.lastDetectAt < 350) return;
    state.lastDetectAt = now;
    if (state.autoApplied) return;
    if (!state.seenBooth) return;

    const hasBooth = detectExistingBooth(TN);

    if (!hasBooth) return;

    state.autoApplied = true;

    if (hasBooth) {
      state.userBoothOn = true;
      state.boothOn = true;
    }

    updateUI();
  }
'''
new_auto = r'''  function maybeAutoApply(TN) {
    if (!state.consent) return;
    const now = Date.now();
    if (now - state.lastDetectAt < 350) return;
    state.lastDetectAt = now;
    if (state.autoApplied) return;

    const saved = readSavedBoothConfig(TN);
    if (saved) {
      if (!state.userBoothOn) {
        onUserBoothToggle(true, { source: 'default', runtime: TN, reason: 'saved-figure-config' });
      }
      state.autoApplied = true;
      state.savedBoothMissingTicks = 0;
      dbg('default.booth.autoApply', { reason: 'saved-figure-config', mode: saved.mode, signals: saved.signals });
      updateUI();
      return;
    }

    // Preserve the established first-use behavior for a figure that did not
    // already contain a saved Booth setup: after the user actually enters the
    // Photo Booth, persistence may arm from the live Booth runtime.
    if (!state.seenBooth || !detectExistingBooth(TN)) return;
    onUserBoothToggle(true, { source: 'default', runtime: TN, reason: 'booth-visit' });
    state.autoApplied = true;
    state.savedBoothMissingTicks = 0;
    dbg('default.booth.autoApply', { reason: 'booth-visit' });
    updateUI();
  }
'''
booth = replace_once(booth, old_auto, new_auto, 'Booth auto-apply')

# Preserve default/manual source across the internal silent off/on cycle.
booth = replace_once(
    booth,
    "      try { onUserBoothToggle(false); } catch {}\n",
    "      try { onUserBoothToggle(false, { source: 'internal', preserveSource: true }); } catch {}\n",
    'silent-cycle internal off'
)
booth = replace_once(
    booth,
    "        try { onUserBoothToggle(true); } catch {}\n",
    "        try { onUserBoothToggle(true, { source: 'internal', preserveSource: true }); } catch {}\n",
    'silent-cycle internal on'
)

# Add saved-config loss handling before maybeAutoApply. This is deliberately
# limited to Booth sessions that were enabled by the saved default. A manual
# Booth View override remains the user's session choice.
loss_guard = r'''    const savedBoothConfig = readSavedBoothConfig(TN);
    if (state.defaultSessionBooth && state.userBoothOn && state.consent && !inBooth) {
      if (savedBoothConfig) {
        state.savedBoothMissingTicks = 0;
      } else {
        state.savedBoothMissingTicks += 1;
        if (state.savedBoothMissingTicks >= 10) {
          dbg('default.booth.savedConfigMissing', { action: 'disable-default-session' });
          onUserBoothToggle(false, { source: 'default', runtime: TN, reason: 'saved-config-missing' });
          state.autoApplied = false;
          state.seenBooth = false;
          state.savedBoothMissingTicks = 0;
        }
      }
    } else if (savedBoothConfig || inBooth) {
      state.savedBoothMissingTicks = 0;
    }

'''
booth = replace_once(
    booth,
    "    maybeAutoApply(TN);\n\n    const hideFrame = !!state.userBoothOn && !inBooth;",
    loss_guard + "    maybeAutoApply(TN);\n\n    const hideFrame = !!state.userBoothOn && !inBooth;",
    'saved-config loss guard'
)

old_default_setter = r'''  function setDefaultBoothPersistence(v) {
    try { dbg('default.boothPersistence', { v: !!v }); } catch {}
    state.consent = !!v;
    state.autoApplied = false;
    gmSet(STORE_CONSENT, !!state.consent);

    if (state.consent) {
      // Preserve the established consent behavior: the automatic default arms
      // only after the next real Photo Booth visit rather than forcing Booth
      // state immediately in the editor.
      state.seenBooth = false;
      startLoop();
    } else {
      // Disabling the saved default must not stomp a deliberate session-only
      // Booth View override. The Booth tab owns that current-session switch.
      reconcileLoop();
    }

    updateUI();
    return state.consent;
  }
'''
new_default_setter = r'''  function setDefaultBoothPersistence(v) {
    try { dbg('default.boothPersistence', { v: !!v }); } catch {}
    state.consent = !!v;
    state.autoApplied = false;
    gmSet(STORE_CONSENT, !!state.consent);

    if (state.consent) {
      startLoop();
      const rt = resolveRuntime();
      if (rt && hasSavedBoothSetup(rt)) {
        onUserBoothToggle(true, { source: 'default', runtime: rt, reason: 'utilities-enable' });
        state.autoApplied = true;
        state.savedBoothMissingTicks = 0;
      } else if (rt && isInBooth(rt)) {
        state.seenBooth = true;
      }
    } else {
      // Turning off the saved default does not stomp the current Booth View
      // session. It merely converts any default-owned active session into a
      // normal session override until reload/user action.
      state.defaultSessionBooth = false;
      state.savedBoothMissingTicks = 0;
      reconcileLoop();
    }

    updateUI();
    return state.consent;
  }
'''
booth = replace_once(booth, old_default_setter, new_default_setter, 'Booth default setter v26')

old_user_toggle = r'''  function onUserBoothToggle(v) {
    try { dbg('ui.boothToggle', { v: !!v }); } catch {}
    const TN = resolveRuntime();
    state.userBoothOn = !!v;

    const prev = !!state.boothOn;
    state.boothOn = state.userBoothOn;

    if (!state.userBoothOn && prev) {
      state.boothPendingTeardown = true;
      try { teardownBoothNow(TN); } catch {}
    }

    if (state.userBoothOn && !prev) {
      try {
        const rt = runtimeNow(TN);
        const t = rt && rt.tokenizer ? rt.tokenizer : null;
        if (t && typeof t.enable === 'function') t.enable();
      } catch {}
    }

    reconcileLoop();
    updateUI();
  }
'''
new_user_toggle = r'''  function onUserBoothToggle(v, options) {
    const opts = options && typeof options === 'object' ? options : {};
    const previousDefaultSource = !!state.defaultSessionBooth;
    try { dbg('ui.boothToggle', { v: !!v, source: opts.source || 'manual', reason: opts.reason || null }); } catch {}
    const TN = opts.runtime || resolveRuntime();
    state.userBoothOn = !!v;

    if (opts.preserveSource) {
      state.defaultSessionBooth = previousDefaultSource;
    } else if (opts.source === 'default') {
      state.defaultSessionBooth = !!v;
    } else {
      state.defaultSessionBooth = false;
    }
    if (!state.userBoothOn) state.savedBoothMissingTicks = 0;

    const prev = !!state.boothOn;
    state.boothOn = state.userBoothOn;

    if (!state.userBoothOn && prev) {
      state.boothPendingTeardown = true;
      try { teardownBoothNow(TN); } catch {}
    }

    if (state.userBoothOn && !prev) {
      try {
        const rt = runtimeNow(TN);
        const t = rt && rt.tokenizer ? rt.tokenizer : null;
        if (t && typeof t.enable === 'function') t.enable();
      } catch {}
    }

    reconcileLoop();
    updateUI();
  }
'''
booth = replace_once(booth, old_user_toggle, new_user_toggle, 'Booth session setter source tracking')

startup_black = r'''  function kickStartupBlackCanvas(attempt) {
    if (!state.defaultBlackCanvas || !state.bgOn) return;
    const n = Number(attempt) || 0;
    const rt = resolveRuntime();
    if (rt) {
      try { onUserBgToggle(true); } catch {}
      try {
        state.btCanvasLayoutKey = null;
        refreshBTComponentRender();
      } catch {}
      state.startupBlackKicks = Math.max(state.startupBlackKicks, n + 1);
      dbg('default.blackCanvas.startupKick', { attempt: n + 1, runtime: rt.__kwBT ? 'BT' : 'TN' });
    }

    // Hero Forge finishes character/display setup in delayed passes. Replaying
    // the already-tested Black Canvas activation/refresh path during that short
    // startup window prevents a late native render from visually overwriting
    // the restored default. A Booth-tab session override to OFF stops retries.
    const delays = [150, 350, 700, 1400, 2600];
    if (n < delays.length && state.defaultBlackCanvas && state.bgOn) {
      setTimeout(() => {
        if (state.defaultBlackCanvas && state.bgOn) kickStartupBlackCanvas(n + 1);
      }, delays[n]);
    }
  }

  function applyStartupDefaults() {
    waitForRuntime((TN) => {
      if (state.defaultBlackCanvas && state.bgOn) kickStartupBlackCanvas(0);
      if (state.consent) maybeAutoApply(TN);
    });
  }

'''
booth = replace_once(
    booth,
    "  function startLoop() {\n",
    startup_black + "  function startLoop() {\n",
    'Booth startup default application'
)

old_public_state = r'''  function boothPublicState() {
    return {
      featureId: 'booth.persistence',
      version: '25.0.0',
      build: BUILD_TAG,
      defaultBoothPersistence: !!state.consent,
      defaultBlackCanvas: !!state.defaultBlackCanvas,
      sessionBoothView: !!state.userBoothOn,
      sessionBlackCanvas: !!state.bgOn,
      seenBooth: !!state.seenBooth,
      autoApplied: !!state.autoApplied,
      loopActive: !!state.loopActive
    };
  }
'''
new_public_state = r'''  function boothPublicState() {
    const rt = resolveRuntime();
    const saved = rt ? readSavedBoothConfig(rt) : null;
    return {
      featureId: 'booth.persistence',
      version: '26.0.0',
      build: BUILD_TAG,
      defaultBoothPersistence: !!state.consent,
      defaultBlackCanvas: !!state.defaultBlackCanvas,
      sessionBoothView: !!state.userBoothOn,
      sessionBlackCanvas: !!state.bgOn,
      defaultSessionBooth: !!state.defaultSessionBooth,
      savedBoothSetupDetected: !!saved,
      savedBoothMode: saved ? saved.mode : null,
      savedBoothSignals: saved ? saved.signals.slice() : [],
      startupBlackKicks: state.startupBlackKicks,
      seenBooth: !!state.seenBooth,
      autoApplied: !!state.autoApplied,
      loopActive: !!state.loopActive
    };
  }
'''
booth = replace_once(booth, old_public_state, new_public_state, 'Booth public state v26')
booth = replace_once(booth, "      version: '25.0.0',\n      build: BUILD_TAG,", "      version: '26.0.0',\n      build: BUILD_TAG,", 'Booth API version v26')

booth = replace_once(
    booth,
    "          defaultBlackCanvas: !!state.defaultBlackCanvas,\n          components: {",
    "          defaultBlackCanvas: !!state.defaultBlackCanvas,\n          defaultSessionBooth: !!state.defaultSessionBooth,\n          savedBoothSetup: (() => { try { const s = readSavedBoothConfig(rt); return s ? { mode: s.mode, signals: s.signals } : null; } catch { return null; } })(),\n          startupBlackKicks: state.startupBlackKicks,\n          components: {",
    'Booth diagnostics v26'
)

booth = replace_once(
    booth,
    "  loadPersistentDefaults();\n  installBoothApi();\n  startLoop();\n  boot();",
    "  loadPersistentDefaults();\n  installBoothApi();\n  startLoop();\n  applyStartupDefaults();\n  boot();",
    'Booth startup application call'
)

# Static semantic guards for the user-requested separation.
if "CK.data && CK.data.custom" not in booth:
    raise RuntimeError('saved Booth setup gate is not character-config based')
if "!!t.enabled || !!t._enabledFor" not in booth:
    raise RuntimeError('legacy detectExistingBooth behavior unexpectedly changed')
if "kickStartupBlackCanvas" not in booth or "refreshBTComponentRender();" not in booth:
    raise RuntimeError('Black Canvas startup kick missing')
if "onUserBoothToggle(true, { source: 'default'" not in booth:
    raise RuntimeError('default Booth View activation path missing')
if booth.count("onUserBoothToggle(false, { source: 'internal', preserveSource: true })") != 1:
    raise RuntimeError('silent-cycle source preservation missing')
if booth.count("onUserBoothToggle(true, { source: 'internal', preserveSource: true })") != 1:
    raise RuntimeError('silent-cycle re-enable source preservation missing')

write(booth_path, booth)


# ---------------------------------------------------------------------------
# Utilities v1.2.1: explain saved-figure gating and report current state.
# ---------------------------------------------------------------------------
utilities_path = 'tools/Utilities.js'
utilities = read(utilities_path)
utilities = replace_once(
    utilities,
    'description: "Automatically arms Booth View after the next Photo Booth visit. The Booth tab can still override it for the current session.",\n      setter: "setDefaultBoothPersistence",\n      onStatus: "Saved default enabled. It will arm after the next Photo Booth visit.",',
    'description: "Automatically restores Booth View for figures that already contain a saved Photo Booth setup. New figures with no Booth setup are left alone until Photo Booth is used. The Booth tab can still override it for the current session.",\n      setter: "setDefaultBoothPersistence",\n      onStatus: "Saved default enabled. Saved Booth figures restore automatically; new figures wait for a Booth setup.",',
    'Utilities Booth default copy'
)
utilities = replace_once(
    utilities,
    'description: "Automatically enables Black Canvas when Witch Dock loads; no Photo Booth visit is required. The Booth tab can still override it for the current session.",',
    'description: "Automatically reapplies Black Canvas when Witch Dock loads; no Photo Booth visit is required. The Booth tab can still override it for the current session.",',
    'Utilities Black default copy'
)

old_status = r'''      boothDefault.status.textContent = state.defaultBoothPersistence
        ? "Saved default enabled. It will arm after the next Photo Booth visit."
        : "Saved default disabled. Session-only Booth View remains available in Booth.";
      blackDefault.status.textContent = state.defaultBlackCanvas
        ? "Saved default enabled. Black Canvas will start automatically on load."
        : "Saved default disabled. Session-only Black Canvas remains available in Booth.";
'''
new_status = r'''      boothDefault.status.textContent = state.defaultBoothPersistence
        ? (state.sessionBoothView && state.defaultSessionBooth
            ? "Saved default enabled. Booth View is active from this figure's saved Booth setup."
            : (state.savedBoothSetupDetected
                ? "Saved default enabled. Saved Booth setup detected; Booth View is currently overridden for this session."
                : "Saved default enabled. Waiting for a figure with a saved Booth setup or a Photo Booth visit."))
        : "Saved default disabled. Session-only Booth View remains available in Booth.";
      blackDefault.status.textContent = state.defaultBlackCanvas
        ? (state.sessionBlackCanvas
            ? "Saved default enabled. Black Canvas is active and will reapply on load."
            : "Saved default enabled. Black Canvas is overridden OFF for this session and will return on reload.")
        : "Saved default disabled. Session-only Black Canvas remains available in Booth.";
'''
utilities = replace_once(utilities, old_status, new_status, 'Utilities live default statuses')
write(utilities_path, utilities)


# ---------------------------------------------------------------------------
# Manifest versions.
# ---------------------------------------------------------------------------
manifest_path = 'manifest.json'
manifest = json.loads(read(manifest_path))
registry = {item['id']: item for item in manifest.get('moduleRegistry', [])}
booth_reg = registry['booth-tool']
booth_reg['version'] = '26.0.0'
booth_reg['build'] = 'v26'
booth_reg['versionOrigin'] = 'dev-booth-startup-defaults-2026-09-06'
util_reg = registry['utilities']
util_reg['version'] = '1.2.1'
util_reg['versionOrigin'] = 'dev-booth-startup-defaults-2026-09-06'
write(manifest_path, json.dumps(manifest, indent=2) + '\n')


# ---------------------------------------------------------------------------
# Durable documentation.
# ---------------------------------------------------------------------------
master_path = 'MASTER.md'
master = read(master_path)
old_master = '''## Active Booth Defaults / Utilities Dev Candidate

Booth v25 / Utilities v1.2.0 separate automatic cross-session defaults from per-session Booth controls without changing the validated Booth renderer/tokenizer persistence engine.

- `Utilities -> Booth Features`: saved Booth Persistence Across Sessions and Black Canvas Across Sessions defaults;
- `Booth`: Booth View and Black Canvas remain session-only overrides;
- saved Booth persistence still waits for a real Photo Booth visit before auto-applying;
- saved Black Canvas initializes directly on load;
- `Utilities -> Decal Features`: Bound Decal Gizmo controls are nested under the broader category;
- Booth contains a direct Utilities link backed by new Dev host API `WitchDock.activateTab(name)`;
- existing Booth consent storage key is preserved for compatibility; new Black Canvas default uses its own key;
- public Stable remains unchanged pending live Dev validation.
'''
new_master = '''## Active Booth Defaults / Utilities Dev Candidate

Booth v26 / Utilities v1.2.1 repair fresh-load application of the cross-session defaults while preserving the validated Booth renderer/tokenizer persistence engine.

- `Utilities -> Booth Features`: saved Booth Persistence Across Sessions and Black Canvas Across Sessions defaults;
- `Booth`: Booth View and Black Canvas remain session-only overrides and never rewrite those saved defaults;
- saved Booth persistence now auto-enables the Booth View session only when the loaded figure has character-owned Photo Booth config under `CK.data.custom[BT.currentMode]`;
- `+ New Figure` / figures without a saved Booth setup are intentionally not auto-initialized; after a real Booth visit, the established first-use persistence path remains available;
- default-owned Booth View sessions are dropped after a sustained saved-config miss on figure switch, while manual Booth View overrides are left alone;
- saved Black Canvas replays the working activation/render-refresh path during HeroForge's startup settle window so the visual state, not only the checkbox, returns after refresh;
- `Utilities -> Decal Features`: Bound Decal Gizmo controls remain nested under the broader category;
- public Stable remains unchanged pending live Dev validation.
'''
master = replace_once(master, old_master, new_master, 'MASTER active Booth candidate')
write(master_path, master)

pfc_path = 'PRE_FLIGHT_Check.md'
pfc = read(pfc_path)
pfc_block = '''\n## PFC-2026-09-06-036 — Booth saved-figure startup defaults repair\n\nDate: 2026-09-06\n\n### Confirmed live gaps from v25\n\n- saved Booth Persistence survived refresh but did not actively turn on the Booth-tab `Booth View` session switch on a fresh page load;\n- saved Black Canvas restored its checkbox state after refresh but did not reliably reapply the visible black renderer/background state;\n- same-page figure switching already worked once Booth View had been manually enabled.\n\n### Additional user requirement\n\nAutomatic Booth startup must not initialize `+ New Figure` or a figure that has no existing Photo Booth setup. Only a loaded figure with character-owned Booth configuration should be eligible for fresh-load automatic Booth View.\n\n### Source/runtime review\n\n- HeroForge build `heroforge07.1.9.98` Booth source confirms `saveCameraDeliberately()` stores character-owned Booth camera state at `CK.data.custom[BT.currentMode].cameraSave`;\n- the same per-mode custom config carries Booth filter/selection/lighting/effect state;\n- `CharacterFinishedSwitching` reloads saved camera, display, and effects from character config;\n- `BT.maker.enable()` applies `composeDisplayState()` and current mode, making it the named runtime path to restore the saved Booth presentation;\n- `_modeCameraJSON` is also used for runtime camera snapshots and is therefore not sufficient by itself as a saved-figure gate.\n\n### Decision\n\nAdvance Booth to v26.0.0/build `v26`. Gate default-driven fresh-load Booth View on meaningful per-mode `CK.data.custom` Booth fields, preserve the existing post-Booth-visit fallback, distinguish default-owned from manual session overrides, and replay the already-working Black Canvas activation/refresh path through the startup settle window. Utilities advances to v1.2.1 for the clarified saved-figure behavior/status text.\n\n### Conflict risks\n\n- do not alter tokenizer disable/re-enable timing, silent-cycle delays, lighting/effect restoration, backdrop capture, or Black Canvas renderer implementation;\n- do not treat `BT.maker` existence, `enabled`, or `_enabledFor` as proof that the loaded figure has saved Booth configuration;\n- manual Booth View/Black Canvas session overrides must remain authoritative for the current session;\n- internal silent-cycle off/on must preserve whether Booth View was default-owned;\n- delayed Black Canvas startup retries must stop if the user overrides Black Canvas OFF;\n- public Stable remains untouched until live Dev validation includes a saved Booth figure and a `+ New Figure`/no-setup figure.\n\n**Runtime behavior changed:** yes, Dev only. Public Stable remains unchanged.\n\n---\n'''
pfc = prepend_after(pfc, '# Pre-Flight Check Log\n', pfc_block, 'PFC v26')
write(pfc_path, pfc)

changelog_path = 'CHANGELOG.md'
changelog = read(changelog_path)
change_block = '''\n## DOCK-2026-09-06-036 — Repair Booth defaults on fresh figure/page load\n\nDate: 2026-09-06\nTimestamp: 18:45 PDT\n\n### Changes\n\n- Booth advances to v26.0.0/build `v26`.\n- Saved Booth Persistence now actively enables the Booth View session on fresh load when the loaded figure contains meaningful Photo Booth configuration in `CK.data.custom[BT.currentMode]`.\n- Fresh `+ New Figure` / no-Booth-config figures are intentionally excluded from automatic startup; the established real-Booth-visit fallback remains.\n- Default-owned Booth sessions track sustained loss of saved Booth config on figure switch and disable themselves without affecting manual Booth View overrides.\n- Internal silent-cycle off/on preserves default/manual session ownership.\n- Saved Black Canvas now replays the existing activation plus native display refresh during HeroForge's delayed startup settling, while respecting a session override to OFF.\n- Booth diagnostics expose saved-config detection, default-owned session state, and startup Black Canvas kick count.\n- Utilities advances to v1.2.1 and explains the saved-figure gate/override status.\n\n### Source evidence\n\nHeroForge build `heroforge07.1.9.98` source confirms deliberate Booth camera state is written to `CK.data.custom[BT.currentMode].cameraSave`, and figure switching reloads saved camera/display/effect config. Runtime-only `_modeCameraJSON` is not used as the eligibility gate.\n\n### Gate\n\nStatic syntax/manifest/semantic assertions pass before commit. Live Dev validation is required for: saved-figure fresh-load restore, `+ New Figure` exclusion, same-page saved -> new behavior, Black Canvas visual startup, and both session-only overrides.\n\n**Runtime behavior changed:** yes, Dev only. Public Stable remains unchanged.\n\n---\n'''
changelog = prepend_after(changelog, '# Changelog\n', change_block, 'CHANGELOG v26')
write(changelog_path, changelog)

history_path = 'HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md'
history = read(history_path)
history_block = '''\n### v26 Gates Automatic Startup to Character-Owned Booth Config\n\nContext:\n- v25 successfully separated saved defaults from session switches, but a fresh page load restored flags without fully replaying the working Booth/Black Canvas activation paths.\n- Automatic Booth startup must never leak a previous Booth view onto `+ New Figure` or a figure with no Booth setup.\n\nConfirmed current-HeroForge source behavior (`heroforge07.1.9.98`):\n- `saveCameraDeliberately()` writes Booth camera state to `CK.data.custom[BT.currentMode].cameraSave`;\n- per-mode `CK.data.custom` also carries Booth filters/selections/lighting/effects;\n- `CharacterFinishedSwitching` reloads saved camera/display/effect config;\n- `BT.maker.enable()` applies `composeDisplayState()` and current Booth mode;\n- `_modeCameraJSON` is a runtime mode-camera snapshot and is not, by itself, proof of a character-owned Booth save.\n\nDev direction:\n- when the cross-session Booth default is ON, auto-enable Booth View only if meaningful saved Booth fields exist in the loaded figure's per-mode custom config;\n- if no saved setup exists, leave the figure alone until a real Booth visit establishes the normal first-use persistence path;\n- if a default-owned persistent Booth is active and a figure switch settles with no saved Booth config, disable only that default-owned session;\n- preserve manual Booth View overrides;\n- replay the existing Black Canvas activation and native render-refresh path during startup settling so its saved default restores the visible state as well as the checkbox.\n\nStatus:\n- Dev v26 candidate; requires saved-figure and `+ New Figure` live validation before Stable promotion.\n\nAffected tools:\n- `tools/Booth.js`\n- `tools/Utilities.js`\n\n'''
history = prepend_after(history, '## Findings\n', history_block, 'Booth history v26')
write(history_path, history)

# Syntax + manifest + semantic gate.
subprocess.run(['node', '--check', booth_path], check=True)
subprocess.run(['node', '--check', utilities_path], check=True)
manifest_check = json.loads(read(manifest_path))
reg_check = {item['id']: item for item in manifest_check['moduleRegistry']}
assert reg_check['booth-tool']['version'] == '26.0.0'
assert reg_check['booth-tool']['build'] == 'v26'
assert reg_check['utilities']['version'] == '1.2.1'
assert "CK.data && CK.data.custom" in read(booth_path)
assert "saved-figure-config" in read(booth_path)
assert "kickStartupBlackCanvas" in read(booth_path)
assert "New figures with no Booth setup are left alone" in read(utilities_path)

# Preserve exact tab/host and unrelated media modules; this patch only stages
# Booth/Utilities runtime plus tracking files.
subprocess.run(['git', 'diff', '--check'], check=True)
print('Booth v26 startup-default candidate gate: PASS')

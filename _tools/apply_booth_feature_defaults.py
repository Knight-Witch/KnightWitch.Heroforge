from pathlib import Path
import json
import re
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


def prepend_after_heading(text, heading, block, label):
    if block.strip() in text:
        raise RuntimeError(f'{label}: block already present')
    if not text.startswith(heading):
        raise RuntimeError(f'{label}: unexpected heading')
    return heading + block + text[len(heading):]


# ---------------------------------------------------------------------------
# Booth: split saved defaults from per-session controls, add public host API.
# ---------------------------------------------------------------------------
booth_path = 'tools/Booth.js'
booth = read(booth_path)
booth = replace_once(booth, "const BUILD_TAG = 'v24';", "const BUILD_TAG = 'v25';", 'Booth build tag')
booth = replace_once(
    booth,
    "  const STORE_COMPONENTS = 'kw.witchDock.booth.components.v1';\n",
    "  const STORE_COMPONENTS = 'kw.witchDock.booth.components.v1';\n"
    "  const STORE_BLACK_DEFAULT = 'kw.witchDock.booth.blackCanvasDefault.v1';\n"
    "  const BOOTH_API_KEY = 'KW_WD_BOOTH';\n",
    'Booth storage/API constants'
)
booth = replace_once(
    booth,
    "    bgOn: false,\n    persistLightingOn: true,",
    "    bgOn: false,\n    defaultBlackCanvas: false,\n    persistLightingOn: true,",
    'Booth black default state'
)
booth = booth.replace("      consent: null,\n", "")

booth = replace_once(
    booth,
    "  let btRuntimeFacade = null;\n",
    "  function loadPersistentDefaults() {\n"
    "    state.consent = !!gmGet(STORE_CONSENT, false);\n"
    "    state.defaultBlackCanvas = !!gmGet(STORE_BLACK_DEFAULT, false);\n"
    "    state.bgOn = !!state.defaultBlackCanvas;\n"
    "  }\n\n"
    "  let btRuntimeFacade = null;\n",
    'Booth persistent-default loader'
)

booth = replace_once(
    booth,
    "      .kwBoothStatus{font-size:11px;opacity:0.85;padding-top:2px;}\n",
    "      .kwBoothStatus{font-size:11px;opacity:0.85;padding-top:2px;}\n"
    "      .kwBoothPersistNote{font-size:11px;line-height:1.35;opacity:.78;padding:0 2px;}\n"
    "      .kwBoothPersistLink{border:0;padding:0;margin:0;background:none;color:#d9b8ff;font:inherit;font-weight:750;text-decoration:underline;cursor:pointer;}\n"
    "      .kwBoothPersistLink:hover{color:#ead8ff;}\n",
    'Booth persistence-note styles'
)

old_consent_ui = """    const consentRow = document.createElement('div');
    consentRow.className = 'kwBoothConsent';

    const consentCb = document.createElement('input');
    consentCb.type = 'checkbox';

    const consentLabel = document.createElement('span');
    consentLabel.textContent = 'Enable Booth Persistence';
    consentLabel.title = 'Check this box to enable the Booth to automatically detect & turn on persistent booth view once you enter the photo booth for the first time.';

    consentRow.appendChild(consentCb);
    consentRow.appendChild(consentLabel);
    root.appendChild(consentRow);

"""
new_persist_note = """    const persistenceNote = document.createElement('div');
    persistenceNote.className = 'kwBoothPersistNote';
    persistenceNote.appendChild(document.createTextNode('To enable automatic persistence across sessions, see '));

    const utilitiesLink = document.createElement('button');
    utilitiesLink.type = 'button';
    utilitiesLink.className = 'kwBoothPersistLink';
    utilitiesLink.textContent = 'Utilities';
    utilitiesLink.title = 'Open Utilities';
    utilitiesLink.addEventListener('click', (e) => {
      e.preventDefault();
      const dock = UW.WitchDock;
      if (dock && typeof dock.activateTab === 'function' && dock.activateTab('Utilities')) return;
      const fallback = document.querySelector('.kwWDTab[data-tab-name="Utilities"]');
      if (fallback && typeof fallback.click === 'function') fallback.click();
    });

    persistenceNote.appendChild(utilitiesLink);
    persistenceNote.appendChild(document.createTextNode('.'));
    root.appendChild(persistenceNote);

"""
booth = replace_once(booth, old_consent_ui, new_persist_note, 'Booth consent UI -> Utilities note')

old_directions = """    const li1 = document.createElement('li');
    li1.textContent = 'Enable Booth Persistence';
    const li2 = document.createElement('li');
    li2.textContent = 'Open photo booth';
    const li3 = document.createElement('li');
    li3.textContent = 'Edit your scene, or if you have already done so, it will capture that automatically.';
    const li4 = document.createElement('li');
    li4.textContent = 'Exit the booth';
"""
new_directions = """    const li1 = document.createElement('li');
    li1.textContent = 'Open photo booth';
    const li2 = document.createElement('li');
    li2.textContent = 'Edit your scene, or if you have already done so, it will capture that automatically.';
    const li3 = document.createElement('li');
    li3.textContent = 'Exit the booth';
    const li4 = document.createElement('li');
    li4.textContent = 'Use Booth View and Black Canvas above for session-only overrides. Automatic defaults live in Utilities.';
"""
booth = replace_once(booth, old_directions, new_directions, 'Booth directions')
booth = booth.replace("    state.ui.consent = consentCb;\n", "")
booth = booth.replace("    state.consent = !!gmGet(STORE_CONSENT, false);\n", "")
booth = booth.replace("    consentCb.addEventListener('change', () => onConsentToggle(!!consentCb.checked));\n", "")
booth = booth.replace("    consentCb.checked = state.consent;\n\n", "")
booth = booth.replace("    if (!suppress && ui.consent) ui.consent.checked = !!state.consent;\n\n", "")
booth = replace_once(booth, "      ui.boothToggle.disabled = !state.consent;", "      ui.boothToggle.disabled = false;", 'Booth session toggle enablement')
booth = replace_once(booth, "    const componentsDisabled = !state.consent || !state.userBoothOn;", "    const componentsDisabled = !state.userBoothOn;", 'Booth component gating')

# Persistence mechanics should follow the session Booth View switch once the
# user has manually overridden it. The saved consent/default remains only the
# auto-arm condition in maybeAutoApply().
booth = booth.replace("state.consent && state.userBoothOn", "state.userBoothOn")
booth = booth.replace("!state.consent || !state.userBoothOn", "!state.userBoothOn")
booth = replace_once(
    booth,
    "    const hideFrame = !!state.consent && !!state.userBoothOn && !inBooth;",
    "    const hideFrame = !!state.userBoothOn && !inBooth;",
    'Booth frame session gating'
)

old_default_setter = """  function onConsentToggle(v) {
    try { dbg('ui.consent', { v: !!v }); } catch {}
    state.consent = !!v;
    gmSet(STORE_CONSENT, !!state.consent);

    if (state.consent) {
      state.seenBooth = false;
      startLoop();
    } else {
      teardownBoothOnly();
      reconcileLoop();
    }

    updateUI();
  }
"""
new_default_setter = """  function setDefaultBoothPersistence(v) {
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
"""
booth = replace_once(booth, old_default_setter, new_default_setter, 'Booth saved default setter')

old_manual_gate = """    state.userBoothOn = !!v;
    if (!state.consent) {
      state.userBoothOn = false;
      state.boothOn = false;
      updateUI();
      return;
    }

    const prev = !!state.boothOn;
"""
new_manual_gate = """    state.userBoothOn = !!v;

    const prev = !!state.boothOn;
"""
booth = replace_once(booth, old_manual_gate, new_manual_gate, 'Booth session override gate')

old_manual_tail = """    if (state.userBoothOn && !prev) {
      try {
        const rt = runtimeNow(TN);
        const t = rt && rt.tokenizer ? rt.tokenizer : null;
        if (t && typeof t.enable === 'function') t.enable();
      } catch {}
    }

    updateUI();
  }
"""
new_manual_tail = """    if (state.userBoothOn && !prev) {
      try {
        const rt = runtimeNow(TN);
        const t = rt && rt.tokenizer ? rt.tokenizer : null;
        if (t && typeof t.enable === 'function') t.enable();
      } catch {}
    }

    reconcileLoop();
    updateUI();
  }
"""
booth = replace_once(booth, old_manual_tail, new_manual_tail, 'Booth session override reconcile')

old_bg_tail = """    reconcileLoop();
    updateUI();
  }

  function startLoop() {
"""
new_bg_tail = """    reconcileLoop();
    updateUI();
  }

  function setDefaultBlackCanvas(v) {
    state.defaultBlackCanvas = !!v;
    gmSet(STORE_BLACK_DEFAULT, !!state.defaultBlackCanvas);
    // A Utilities default change is immediately reflected in the current
    // session; the Booth-tab Black Canvas switch can override it afterward
    // without rewriting the saved default.
    onUserBgToggle(state.defaultBlackCanvas);
    return state.defaultBlackCanvas;
  }

  function startLoop() {
"""
booth = replace_once(booth, old_bg_tail, new_bg_tail, 'Black Canvas saved default setter')
booth = replace_once(
    booth,
    "    const need = !!state.consent || !!state.bgOn;",
    "    const need = !!state.consent || !!state.userBoothOn || !!state.bgOn;",
    'Booth loop reconciliation'
)

api_block = """  function boothPublicState() {
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

  function installBoothApi() {
    UW[BOOTH_API_KEY] = {
      featureId: 'booth.persistence',
      version: '25.0.0',
      build: BUILD_TAG,
      getState: boothPublicState,
      setDefaultBoothPersistence,
      setDefaultBlackCanvas,
      setSessionBooth: onUserBoothToggle,
      setSessionBlackCanvas: onUserBgToggle
    };
  }

"""
booth = replace_once(booth, "  function registerTool() {\n", api_block + "  function registerTool() {\n", 'Booth public API')
booth = replace_once(
    booth,
    "          blackCanvasOn: !!state.bgOn,\n          components: {",
    "          blackCanvasOn: !!state.bgOn,\n          defaultBoothPersistence: !!state.consent,\n          defaultBlackCanvas: !!state.defaultBlackCanvas,\n          components: {",
    'Booth diagnostics defaults'
)
booth = replace_once(
    booth,
    "\n\n  startLoop();\n  boot();\n})();\n",
    "\n\n  loadPersistentDefaults();\n  installBoothApi();\n  startLoop();\n  boot();\n})();\n",
    'Booth startup defaults/API'
)

# The saved default must remain the only auto-arm gate. Any remaining consent
# usage outside these explicitly expected sites is a regression in separation.
consent_lines = [line.strip() for line in booth.splitlines() if 'state.consent' in line]
expected_consent_fragments = (
    "if (!state.consent) return;",
    "state.consent = !!v;",
    "gmSet(STORE_CONSENT, !!state.consent);",
    "if (state.consent) {",
    "const need = !!state.consent || !!state.userBoothOn || !!state.bgOn;",
    "defaultBoothPersistence: !!state.consent,",
)
for line in consent_lines:
    if not any(fragment in line for fragment in expected_consent_fragments):
        raise RuntimeError(f'Unexpected state.consent dependency after split: {line}')

write(booth_path, booth)


# ---------------------------------------------------------------------------
# Utilities: categorical Booth Features + Decal Features.
# ---------------------------------------------------------------------------
utilities_path = 'tools/Utilities.js'
utilities = read(utilities_path)
utilities = replace_once(
    utilities,
    '  const GIZMO_SERVICE_KEY = "correctedBoundDecalGizmo";\n',
    '  const GIZMO_SERVICE_KEY = "correctedBoundDecalGizmo";\n  const BOOTH_SERVICE_KEY = "KW_WD_BOOTH";\n',
    'Utilities Booth service key'
)
utilities = replace_once(
    utilities,
    '      ".kwu .gizmo-note{opacity:.72;margin-top:8px;font-size:11px;}";\n',
    '      ".kwu .gizmo-note{opacity:.72;margin-top:8px;font-size:11px;}" +\n'
    '      ".kwu .feature-name{font-weight:800;font-size:12px;color:rgba(255,255,255,.92);margin-bottom:7px;}" +\n'
    '      ".kwu .booth-defaults{display:flex;flex-direction:column;gap:8px;}";\n',
    'Utilities category styles'
)
utilities = replace_once(
    utilities,
    "  function setStatus(el, text) {\n",
    "  function boothService() {\n"
    "    return UW[BOOTH_SERVICE_KEY] || null;\n"
    "  }\n\n"
    "  function setStatus(el, text) {\n",
    'Utilities Booth service resolver'
)

booth_section = r'''  function renderBoothDefaultRow(body, spec) {
    const row = document.createElement("div");
    row.className = "row";

    const main = document.createElement("div");
    main.className = "main";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = spec.label;

    const desc = document.createElement("div");
    desc.className = "desc";
    desc.textContent = spec.description;

    const status = document.createElement("div");
    status.className = "status";

    const label = document.createElement("label");
    label.className = "toggle";

    const input = document.createElement("input");
    input.type = "checkbox";

    const labelText = document.createElement("span");
    labelText.textContent = "Enabled";

    input.addEventListener("change", () => {
      const svc = boothService();
      const setter = svc && svc[spec.setter];
      if (typeof setter !== "function") {
        input.checked = !input.checked;
        status.textContent = "Booth service unavailable.";
        return;
      }
      setter(input.checked);
      status.textContent = input.checked ? spec.onStatus : spec.offStatus;
    });

    main.append(name, desc, status);
    label.append(input, labelText);
    row.append(main, label);
    body.appendChild(row);
    return { input, status };
  }

  function renderBoothSection(root, api) {
    const section = api.ui.createSection({
      id: "booth-features",
      title: "Booth Features",
      defaultCollapsed: false
    });

    const list = document.createElement("div");
    list.className = "booth-defaults";
    section.body.appendChild(list);

    const boothDefault = renderBoothDefaultRow(list, {
      label: "Enable Booth Persistence Across Sessions",
      description: "Automatically arms Booth View after the next Photo Booth visit. The Booth tab can still override it for the current session.",
      setter: "setDefaultBoothPersistence",
      onStatus: "Saved default enabled. It will arm after the next Photo Booth visit.",
      offStatus: "Saved default disabled. Session-only Booth View remains available in Booth."
    });

    const blackDefault = renderBoothDefaultRow(list, {
      label: "Enable Black Canvas Across Sessions",
      description: "Automatically enables Black Canvas when Witch Dock loads; no Photo Booth visit is required. The Booth tab can still override it for the current session.",
      setter: "setDefaultBlackCanvas",
      onStatus: "Saved default enabled. Black Canvas is also enabled for this session.",
      offStatus: "Saved default disabled. Session-only Black Canvas remains available in Booth."
    });

    function update() {
      if (!list.isConnected) return false;
      const svc = boothService();
      if (!svc || typeof svc.getState !== "function") {
        boothDefault.input.disabled = true;
        blackDefault.input.disabled = true;
        boothDefault.status.textContent = "Booth service unavailable.";
        blackDefault.status.textContent = "Booth service unavailable.";
        return true;
      }

      const state = svc.getState() || {};
      boothDefault.input.disabled = false;
      blackDefault.input.disabled = false;
      boothDefault.input.checked = !!state.defaultBoothPersistence;
      blackDefault.input.checked = !!state.defaultBlackCanvas;
      boothDefault.status.textContent = state.defaultBoothPersistence
        ? "Saved default enabled. It will arm after the next Photo Booth visit."
        : "Saved default disabled. Session-only Booth View remains available in Booth.";
      blackDefault.status.textContent = state.defaultBlackCanvas
        ? "Saved default enabled. Black Canvas will start automatically on load."
        : "Saved default disabled. Session-only Black Canvas remains available in Booth.";
      return true;
    }

    update();
    const timer = window.setInterval(() => {
      if (!update()) window.clearInterval(timer);
    }, 500);

    root.appendChild(section.root);
  }

'''
utilities = replace_once(utilities, "  function renderGizmoSection(root, api) {\n", booth_section + "  function renderGizmoSection(root, api) {\n", 'Utilities Booth Features section')
utilities = replace_once(utilities, '      title: "Bound Decal Gizmo",', '      title: "Decal Features",', 'Utilities Decal Features title')
utilities = replace_once(
    utilities,
    "    const controls = document.createElement(\"div\");\n\n    const top = document.createElement(\"div\");",
    "    const controls = document.createElement(\"div\");\n\n"
    "    const featureName = document.createElement(\"div\");\n"
    "    featureName.className = \"feature-name\";\n"
    "    featureName.textContent = \"Bound Decal Gizmo\";\n"
    "    controls.appendChild(featureName);\n\n"
    "    const top = document.createElement(\"div\");",
    'Utilities nested gizmo label'
)
utilities = replace_once(
    utilities,
    "    renderGizmoSection(root, api);\n\n    const section = api.ui.createSection",
    "    renderBoothSection(root, api);\n    renderGizmoSection(root, api);\n\n    const section = api.ui.createSection",
    'Utilities category order'
)
write(utilities_path, utilities)


# ---------------------------------------------------------------------------
# Dev shell: first-class tab activation API for internal cross-tab links.
# ---------------------------------------------------------------------------
loader_path = 'Witch_Dock_DEV.user.js'
loader = read(loader_path)
loader = replace_once(loader, '// @version      1.0.8.4', '// @version      1.0.8.5', 'Dev loader userscript version')
loader = replace_once(
    loader,
    '  UW.WitchDock.downloadBlob = kwDownloadBlob;\n',
    '  UW.WitchDock.downloadBlob = kwDownloadBlob;\n'
    '  UW.WitchDock.activateTab = (name) => {\n'
    '    if (!state.tabs.has(name)) return false;\n'
    '    setActiveTab(name);\n'
    '    return true;\n'
    '  };\n',
    'Dev loader tab activation API'
)
write(loader_path, loader)


# ---------------------------------------------------------------------------
# Manifest/version contract and Dev delivery URLs.
# ---------------------------------------------------------------------------
manifest_path = 'manifest.json'
manifest = json.loads(read(manifest_path))
registry = {entry['id']: entry for entry in manifest['moduleRegistry']}
registry['witch-dock-dev-loader']['version'] = '0.5.0'
registry['witch-dock-dev-loader']['build'] = '1.0.8.5-tab-activation-api'
registry['booth-tool']['version'] = '25.0.0'
registry['booth-tool']['build'] = 'v25'
registry['booth-tool']['versionOrigin'] = 'dev-booth-defaults-2026-09-06'
registry['utilities']['version'] = '1.2.0'
registry['utilities']['versionOrigin'] = 'dev-booth-defaults-2026-09-06'
for tool in manifest['tools']:
    if tool['id'] == 'booth-tool':
        tool['url'] = 'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/WITCH_DEV_UI/tools/Booth.js'
write(manifest_path, json.dumps(manifest, indent=2) + '\n')


# ---------------------------------------------------------------------------
# Durable repo documentation required for the committed Dev update.
# ---------------------------------------------------------------------------
preflight_path = 'PRE_FLIGHT_Check.md'
preflight = read(preflight_path)
preflight_block = """## PFC-2026-09-06-035 — Booth cross-session defaults and Utilities categories

Date: 2026-09-06

### Required material reviewed

- binding HeroForge.Compatibility project contract, architecture and active feature inventory;
- current Witch Dock `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, `manifest.json`;
- `tools/Booth.js` v24 persistence/Black Canvas state machine and storage keys;
- `tools/Utilities.js` v1.1.0 category host;
- `Witch_Dock_DEV.user.js` tab-selection implementation;
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md` known timing/state constraints.

### Confirmed diagnosis

- `kw.witchDock.booth.consent.v1` already persists the Booth auto-arm preference across sessions, but v24 also uses that preference as a hard gate that disables the Booth View session switch;
- Black Canvas is already independent of Booth persistence but has no saved cross-session default;
- existing automatic Booth persistence correctly waits for a real Photo Booth visit before applying;
- Black Canvas can run from the editor without a Booth visit;
- Witch Dock tab selection is internally stable but was not exposed as a host API.

### Decision

Preserve the existing Booth state machine/timing. Reinterpret the existing consent key strictly as the saved automatic Booth default, allow Booth View/Black Canvas to remain session overrides, add one saved Black Canvas default, expose a narrow `WitchDock.activateTab(name)` API for internal links, and organize Utilities into `Booth Features`, `Decal Features`, and existing `HeroForge UI Patches` categories.

### Conflict risks

- do not rewrite tokenizer teardown/re-enable timing, lighting/effect restoration, backdrop capture, Black Canvas renderer enforcement, or silent-cycle timing;
- session toggles must never rewrite the saved Utilities defaults;
- disabling a saved default must not unexpectedly tear down a deliberate session override;
- saved Booth persistence must still wait for actual Booth entry before auto-applying;
- saved Black Canvas must initialize without Booth entry;
- preserve the existing `kw.witchDock.booth.consent.v1` key for migration compatibility;
- public Stable remains untouched until Dev live validation.

### Version decision

- `booth-tool`: v25.0.0 / build `v25`;
- `utilities`: v1.2.0;
- `witch-dock-dev-loader`: v0.5.0 / userscript `1.0.8.5`.

**Runtime behavior changed:** yes, Dev only. Public Stable remains unchanged.

---

"""
preflight = prepend_after_heading(preflight, '# Pre-Flight Check Log\n\n', preflight_block, 'Pre-flight')
write(preflight_path, preflight)

changelog_path = 'CHANGELOG.md'
changelog = read(changelog_path)
changelog_block = """## DOCK-2026-09-06-035 — Add Booth cross-session defaults in Utilities

Date: 2026-09-06

### Changes

- Booth v25 separates saved automatic defaults from Booth-tab session overrides while preserving the existing persistence/Black Canvas engine.
- Existing `kw.witchDock.booth.consent.v1` is retained as the saved Booth-persistence default for migration compatibility.
- New `kw.witchDock.booth.blackCanvasDefault.v1` stores the automatic Black Canvas default.
- Saved Booth persistence still waits for a real Photo Booth visit before auto-arming; saved Black Canvas initializes directly in the editor without requiring Booth entry.
- Booth View and Black Canvas remain available in the Booth tab as session-only overrides and do not rewrite saved defaults.
- The old `Enable Booth Persistence` checkbox moves out of Booth; Booth gains a clickable `Utilities` note for automatic defaults.
- Utilities v1.2.0 adds a `Booth Features` category with the two saved defaults.
- Utilities renames the former `Bound Decal Gizmo` top-level section to `Decal Features` and nests the unchanged gizmo controls beneath it.
- Dev shell adds `WitchDock.activateTab(name)` for first-class internal cross-tab navigation and advances to dev-loader v0.5.0 / userscript 1.0.8.5.

### Gate

Static syntax/manifest/version assertions pass before commit. Live Dev validation is required for saved-default reload behavior, session-only overrides, immediate Black Canvas startup, Booth-entry auto-arm, and Booth-to-Utilities navigation before any Stable promotion.

**Runtime behavior changed:** yes, Dev only. Public Stable remains unchanged.

---

"""
changelog = prepend_after_heading(changelog, '# Changelog\n\n', changelog_block, 'Changelog')
write(changelog_path, changelog)

master_path = 'MASTER.md'
master = read(master_path)
master_block = """## Active Booth Defaults / Utilities Dev Candidate

Booth v25 / Utilities v1.2.0 separate automatic cross-session defaults from per-session Booth controls without changing the validated Booth renderer/tokenizer persistence engine.

- `Utilities -> Booth Features`: saved Booth Persistence Across Sessions and Black Canvas Across Sessions defaults;
- `Booth`: Booth View and Black Canvas remain session-only overrides;
- saved Booth persistence still waits for a real Photo Booth visit before auto-applying;
- saved Black Canvas initializes directly on load;
- `Utilities -> Decal Features`: Bound Decal Gizmo controls are nested under the broader category;
- Booth contains a direct Utilities link backed by new Dev host API `WitchDock.activateTab(name)`;
- existing Booth consent storage key is preserved for compatibility; new Black Canvas default uses its own key;
- public Stable remains unchanged pending live Dev validation.

"""
master = prepend_after_heading(master, '# Witch Dock Master\n\n', master_block, 'Master')
write(master_path, master)

history_path = 'HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md'
history = read(history_path)
history_finding = """### v25 Separates Automatic Defaults From Session Overrides

Context:
- Users need Booth Persistence and Black Canvas to be optionally automatic across page/figure sessions while retaining quick session-only switches in the Booth tab.

Confirmed source behavior before v25:
- `kw.witchDock.booth.consent.v1` already persisted the automatic Booth preference but also hard-disabled the Booth View session switch when false.
- automatic Booth persistence already waited for a real Booth visit (`seenBooth`) before applying;
- Black Canvas already ran independently from Booth persistence but had no saved default.

Dev direction:
- retain `kw.witchDock.booth.consent.v1` as the saved automatic Booth default;
- add `kw.witchDock.booth.blackCanvasDefault.v1` for saved automatic Black Canvas;
- keep Booth View and Black Canvas as session overrides that do not rewrite either saved default;
- disabling a saved Booth default does not tear down an already chosen session-only Booth View state;
- automatic Booth default still waits for Booth entry; automatic Black Canvas starts without Booth entry;
- host the saved settings under `Utilities -> Booth Features` and link there from Booth;
- preserve tokenizer teardown/re-enable, lighting/effect restore, silent-cycle, backdrop and renderer timing unchanged.

Status:
- Dev implementation built; live validation required before Stable promotion.

Affected tools:
- `tools/Booth.js`
- `tools/Utilities.js`
- Witch Dock host tab API

"""
history = replace_once(history, '## Findings\n\n', '## Findings\n\n' + history_finding, 'Booth history finding')
write(history_path, history)


# ---------------------------------------------------------------------------
# Static gates.
# ---------------------------------------------------------------------------
subprocess.run(['node', '--check', booth_path], check=True)
subprocess.run(['node', '--check', utilities_path], check=True)
subprocess.run(['node', '--check', loader_path], check=True)
subprocess.run(['git', 'diff', '--check'], check=True)

manifest = json.loads(read(manifest_path))
registry = {entry['id']: entry for entry in manifest['moduleRegistry']}
assert registry['booth-tool']['version'] == '25.0.0'
assert registry['booth-tool']['build'] == 'v25'
assert registry['utilities']['version'] == '1.2.0'
assert registry['witch-dock-dev-loader']['version'] == '0.5.0'
booth_tool = next(tool for tool in manifest['tools'] if tool['id'] == 'booth-tool')
assert '/WITCH_DEV_UI/tools/Booth.js' in booth_tool['url']

booth = read(booth_path)
utilities = read(utilities_path)
loader = read(loader_path)
assert 'Enable Booth Persistence Across Sessions' not in booth
assert "New decal tools coming shortly!" not in booth
assert 'To enable automatic persistence across sessions, see ' in booth
assert "kw.witchDock.booth.consent.v1" in booth
assert "kw.witchDock.booth.blackCanvasDefault.v1" in booth
assert 'setDefaultBoothPersistence' in booth
assert 'setDefaultBlackCanvas' in booth
assert 'setSessionBooth' in booth
assert 'setSessionBlackCanvas' in booth
assert 'WitchDock.activateTab' in loader
assert 'title: "Booth Features"' in utilities
assert 'Enable Booth Persistence Across Sessions' in utilities
assert 'Enable Black Canvas Across Sessions' in utilities
assert 'title: "Decal Features"' in utilities
assert 'featureName.textContent = "Bound Decal Gizmo"' in utilities
assert 'title: "Bound Decal Gizmo"' not in utilities

print('Booth Features Dev patch static gate: PASS')

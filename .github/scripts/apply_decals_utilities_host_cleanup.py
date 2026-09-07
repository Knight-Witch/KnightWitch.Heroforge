from pathlib import Path
import json

ROOT = Path('.')

DECALS_SOURCE = r'''(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const TOOL_ID = "decals-dev";
  const STYLE_ID = "kw-decals-dev-style";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .kwdecals-placeholder{
        color:rgba(255,255,255,.76);
        font:600 12px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
        text-align:center;
        padding:18px 12px;
        border:1px dashed rgba(255,255,255,.16);
        border-radius:7px;
        background:rgba(255,255,255,.025);
      }
    `;
    document.documentElement.appendChild(style);
  }

  function renderTool(container) {
    injectStyle();
    const placeholder = document.createElement("div");
    placeholder.className = "kwdecals-placeholder";
    placeholder.textContent = "New decal tools coming shortly!";
    container.appendChild(placeholder);
  }

  function register() {
    const WD = UW.WitchDock;
    if (!WD || typeof WD.registerTool !== "function") {
      window.setTimeout(register, 250);
      return;
    }
    WD.registerTool({ id: TOOL_ID, tab: "Decals", render: renderTool });
  }

  register();
})();
'''

UTILITIES_SOURCE = r'''(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const STORE_PREFIX = "kw.witchDock.toolEnabled.";
  const RAW_ROOT = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/";
  const SCROLL_URL = RAW_ROOT + "HeroForge_UI/Expanded_UI_Scroll_Guards.js";
  const SLOT_URL = RAW_ROOT + "HeroForge_UI/HF_UI_Slot_Bridge.js";
  const GIZMO_SERVICE_ROOT = "KW_HeroForgeUI";
  const GIZMO_SERVICE_KEY = "correctedBoundDecalGizmo";
  const UTILITIES = [
    {
      id: "expanded-ui-scroll-guards",
      label: "Decals Scroll Guards",
      description: "Adds scoped scroll and resize behavior to the Decals source panel and slot grid."
    },
    {
      id: "hf-ui-slot-bridge",
      label: "Expanded Decal Slots",
      description: "Expands decal slots when compatible HF Core Tweaks data is detected."
    }
  ];

  function injectStyle() {
    const id = "kw-utilities-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent =
      ".kwu{color:#e8e8e8;font:12px/1.25 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;}" +
      ".kwu .row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px;border:1px solid rgba(255,255,255,0.10);border-radius:6px;background:rgba(255,255,255,0.035);}" +
      ".kwu .main{min-width:0;display:flex;flex-direction:column;gap:4px;}" +
      ".kwu .name{font-weight:800;font-size:12px;color:rgba(255,255,255,0.92);}" +
      ".kwu .desc{font-size:11px;line-height:1.3;color:rgba(255,255,255,0.68);}" +
      ".kwu .status{font-size:10px;line-height:1.25;color:rgba(255,255,255,0.55);}" +
      ".kwu .toggle{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;font-weight:800;font-size:11px;color:rgba(255,255,255,0.82);}" +
      ".kwu input[type='checkbox']{transform:translateY(1px);}" +
      ".kwu .hint{font-size:11px;line-height:1.35;color:rgba(255,255,255,0.62);}" +
      ".kwu .gizmo-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}" +
      ".kwu .gizmo-row label{display:flex;align-items:center;gap:7px;font-weight:650;}" +
      ".kwu .gizmo-modes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:8px;}" +
      ".kwu .gizmo-modes button{background:rgba(255,255,255,.10);color:#e8e8e8;border:1px solid rgba(255,255,255,.14);border-radius:7px;padding:6px 8px;cursor:pointer;}" +
      ".kwu .gizmo-modes button:hover{background:rgba(255,255,255,.16);}" +
      ".kwu .gizmo-modes button[data-active='1']{background:rgba(255,255,255,.22);border-color:rgba(255,255,255,.42);font-weight:700;}" +
      ".kwu .gizmo-modes button:disabled{opacity:.42;cursor:not-allowed;}" +
      ".kwu .gizmo-status{margin-top:9px;padding:7px 8px;border-radius:6px;background:rgba(0,0,0,.20);font-size:11px;line-height:1.4;word-break:break-word;}" +
      ".kwu .gizmo-status[data-error='1']{border:1px solid rgba(255,120,120,.45);}" +
      ".kwu .gizmo-meta{opacity:.7;margin-top:5px;font-size:10px;font-variant-numeric:tabular-nums;}" +
      ".kwu .gizmo-note{opacity:.72;margin-top:8px;font-size:11px;}";
    document.head.appendChild(style);
  }

  function storageKey(id) {
    return STORE_PREFIX + id;
  }

  function readEnabled(id, fallback) {
    try {
      const raw = UW.localStorage.getItem(storageKey(id));
      if (raw !== null && raw !== undefined && raw !== "") return raw === "true" || raw === "1";
    } catch (e) {}

    try {
      if (typeof GM_getValue === "function") {
        const value = GM_getValue(storageKey(id), null);
        if (value !== null && value !== undefined) return !!value;
      }
    } catch (e) {}

    return !!fallback;
  }

  function writeEnabled(id, value) {
    try {
      UW.localStorage.setItem(storageKey(id), value ? "true" : "false");
    } catch (e) {}

    try {
      if (typeof GM_setValue === "function") GM_setValue(storageKey(id), !!value);
    } catch (e) {}
  }

  function loadScript(url) {
    return fetch(url, { cache: "no-store" })
      .then((res) => res.ok ? res.text() : "")
      .then((code) => {
        if (code) new Function(code)();
      })
      .catch(() => {});
  }

  function scrollApi() {
    return UW.KW_HeroForgeUI && UW.KW_HeroForgeUI.scrollGuards ? UW.KW_HeroForgeUI.scrollGuards : null;
  }

  function decalStatus() {
    return UW.KW_HeroForgeUI && UW.KW_HeroForgeUI.expandedDecalSlots ? UW.KW_HeroForgeUI.expandedDecalSlots : null;
  }

  function gizmoService() {
    return UW[GIZMO_SERVICE_ROOT] && UW[GIZMO_SERVICE_ROOT][GIZMO_SERVICE_KEY]
      ? UW[GIZMO_SERVICE_ROOT][GIZMO_SERVICE_KEY]
      : null;
  }

  function setStatus(el, text) {
    if (el) el.textContent = text || "";
  }

  function applyScroll(value, statusEl) {
    const api = scrollApi();
    if (value) {
      if (api && typeof api.enable === "function") {
        api.enable();
        setStatus(statusEl, "Enabled for this session.");
        return;
      }
      loadScript(SCROLL_URL).then(() => {
        const next = scrollApi();
        if (next && typeof next.enable === "function") next.enable();
        setStatus(statusEl, "Enabled for this session.");
      });
      return;
    }

    if (api && typeof api.disable === "function") api.disable();
    const style = document.getElementById("kwHeroForgeUiScrollGuards");
    if (style && style.parentNode) style.parentNode.removeChild(style);
    for (const el of document.querySelectorAll(".kwHFDecalSourceMenu,.kwHFDecalSlotMenu")) {
      el.classList.remove("kwHFDecalSourceMenu", "kwHFDecalSlotMenu");
    }
    setStatus(statusEl, "Disabled for this session.");
  }

  function applySlots(value, statusEl) {
    if (value) {
      const current = decalStatus();
      if (current && current.applied) {
        setStatus(statusEl, "Enabled and already applied.");
        return;
      }
      loadScript(SLOT_URL).then(() => {
        const next = decalStatus();
        setStatus(statusEl, next && next.applied ? "Enabled and applied." : "Enabled. Refresh may be required.");
      });
      return;
    }

    const current = decalStatus();
    if (current && current.applied) setStatus(statusEl, "Disabled after refresh. Already applied this session.");
    else setStatus(statusEl, "Disabled. Refresh to keep unloaded.");
  }

  function applyUtility(id, value, statusEl) {
    if (id === "expanded-ui-scroll-guards") applyScroll(value, statusEl);
    if (id === "hf-ui-slot-bridge") applySlots(value, statusEl);
  }

  function renderUtility(body, item) {
    const row = document.createElement("div");
    row.className = "row";

    const main = document.createElement("div");
    main.className = "main";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = item.label;

    const desc = document.createElement("div");
    desc.className = "desc";
    desc.textContent = item.description;

    const status = document.createElement("div");
    status.className = "status";

    const label = document.createElement("label");
    label.className = "toggle";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = readEnabled(item.id, true);

    const labelText = document.createElement("span");
    labelText.textContent = "Enabled";

    input.addEventListener("change", function () {
      writeEnabled(item.id, input.checked);
      applyUtility(item.id, input.checked, status);
    });

    main.appendChild(name);
    main.appendChild(desc);
    main.appendChild(status);
    label.appendChild(input);
    label.appendChild(labelText);
    row.appendChild(main);
    row.appendChild(label);
    body.appendChild(row);

    applyUtility(item.id, input.checked, status);
  }

  function renderGizmoSection(root, api) {
    const section = api.ui.createSection({
      id: "bound-decal-gizmo",
      title: "Bound Decal Gizmo",
      defaultCollapsed: false
    });

    const body = section.body;
    const controls = document.createElement("div");

    const top = document.createElement("div");
    top.className = "gizmo-row";

    const label = document.createElement("label");
    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    label.append(toggle, document.createTextNode("Correct bound decal gizmo"));
    top.appendChild(label);
    controls.appendChild(top);

    const modes = document.createElement("div");
    modes.className = "gizmo-modes";
    const modeButtons = new Map();
    for (const [mode, title] of [["translate", "Move"], ["rotate", "Rotate"], ["scale", "Scale"]]) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = title;
      btn.addEventListener("click", () => {
        const svc = gizmoService();
        if (!svc || typeof svc.setMode !== "function") return;
        svc.setMode(mode, true);
        if (typeof svc.refresh === "function") svc.refresh();
      });
      modeButtons.set(mode, btn);
      modes.appendChild(btn);
    }
    controls.appendChild(modes);

    const status = document.createElement("div");
    status.className = "gizmo-status";
    status.textContent = "Waiting for corrected gizmo service...";
    controls.appendChild(status);

    const meta = document.createElement("div");
    meta.className = "gizmo-meta";
    controls.appendChild(meta);

    const note = document.createElement("div");
    note.className = "gizmo-note";
    note.textContent = "Correction activates only for a bound / Project-OFF decal while HeroForge's native decal gizmo is enabled.";
    controls.appendChild(note);

    toggle.addEventListener("change", () => {
      const svc = gizmoService();
      if (!svc) return;
      if (toggle.checked && typeof svc.enable === "function") svc.enable();
      if (!toggle.checked && typeof svc.disable === "function") svc.disable();
    });

    function update() {
      if (!controls.isConnected) return false;
      const svc = gizmoService();
      if (!svc || typeof svc.getState !== "function") {
        toggle.checked = false;
        toggle.disabled = true;
        for (const btn of modeButtons.values()) btn.disabled = true;
        status.dataset.error = "1";
        status.textContent = "Corrected gizmo service unavailable.";
        meta.textContent = "";
        return true;
      }

      const state = svc.getState() || {};
      toggle.disabled = false;
      toggle.checked = Boolean(state.enabledByUser);
      status.dataset.error = state.error ? "1" : "0";
      status.textContent = state.status || (state.active ? "Active" : "Waiting");

      for (const [mode, btn] of modeButtons) {
        btn.disabled = !state.enabledByUser;
        btn.dataset.active = state.mode === mode ? "1" : "0";
      }

      const parts = [`build ${state.build || "unknown"}`];
      if (state.selectedMapping !== null && state.selectedMapping !== undefined) parts.push(`mapping ${state.selectedMapping}`);
      if (state.selectedDecalId !== null && state.selectedDecalId !== undefined) parts.push(`decal ${state.selectedDecalId}`);
      parts.push(state.nativeSuppressed ? "native floor gizmo hidden" : "native gizmo untouched");
      meta.textContent = parts.join(" • ");
      return true;
    }

    update();
    const timer = window.setInterval(() => {
      if (!update()) window.clearInterval(timer);
    }, 500);

    body.appendChild(controls);
    root.appendChild(section.root);
  }

  function renderTool(container, api) {
    injectStyle();
    const root = document.createElement("div");
    root.className = "kwu";
    container.appendChild(root);

    renderGizmoSection(root, api);

    const section = api.ui.createSection({ id: "heroforge-ui", title: "HeroForge UI Patches", defaultCollapsed: false });
    const body = section.body;

    for (const item of UTILITIES) renderUtility(body, item);

    const hint = document.createElement("div");
    hint.className = "hint";
    hint.textContent = "Some utilities can be removed live. Utilities that modify HeroForge data may require a page refresh to fully unload.";
    body.appendChild(hint);

    root.appendChild(section.root);
  }

  function registerIntoWitchDock() {
    const dock = UW.WitchDock || (UW.unsafeWindow ? UW.unsafeWindow.WitchDock : null);
    const wd = dock || UW.WitchDock;
    if (!wd || typeof wd.registerTool !== "function") return false;

    wd.registerTool({
      id: "utilities",
      tab: "Utilities",
      title: "Utilities",
      render: function (container, api) {
        renderTool(container, api);
      }
    });

    return true;
  }

  (function boot() {
    let tries = 0;
    const timer = setInterval(function () {
      tries += 1;
      if (registerIntoWitchDock() || tries > 80) clearInterval(timer);
    }, 100);
  })();
})();
'''


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"Expected exactly one {label} anchor, found {count}")
    return text.replace(old, new, 1)


def prepend_after_title(path, title, block):
    p = ROOT / path
    text = p.read_text()
    marker = title + "\n\n"
    if not text.startswith(marker):
        raise RuntimeError(f"Unexpected {path} title")
    if block.strip() in text:
        return
    p.write_text(marker + block.rstrip() + "\n\n---\n\n" + text[len(marker):])


(ROOT / 'tools/Decals.js').write_text(DECALS_SOURCE)
(ROOT / 'tools/Utilities.js').write_text(UTILITIES_SOURCE)

manifest_path = ROOT / 'manifest.json'
manifest = json.loads(manifest_path.read_text())
registry = {entry['id']: entry for entry in manifest.get('moduleRegistry', [])}
for module_id in ['decals-dev', 'utilities']:
    if module_id not in registry:
        raise RuntimeError(f'Missing module registry entry: {module_id}')
    registry[module_id]['version'] = '1.1.0'
    registry[module_id]['versionOrigin'] = 'dev-ui-host-cleanup-2026-09-06'

for item in manifest.get('tools', []):
    if item.get('id') in {'decals-dev', 'utilities'}:
        item['url'] = item['url'].replace('/Witch_Scripts/', '/WITCH_DEV_UI/')

manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')

preflight_block = '''## PFC-2026-09-06-034 — Move bound decal gizmo host to Utilities

Date: 2026-09-06

### Requested behavior

- move the existing corrected bound decal gizmo control surface out of the Decals tab and into Utilities;
- leave the Decals tab present as a placeholder reading `New decal tools coming shortly!`;
- preserve the validated corrected-gizmo runtime, persisted enabled state, mode controls, status diagnostics, and enable/disable behavior.

### Required material reviewed

- binding HeroForge.Compatibility `PROJECT_CONTRACT.md`;
- HFC `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`;
- Witch Dock `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`, and current Dev `manifest.json`;
- `tools/Decals.js`, `tools/Utilities.js`;
- `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js` and its exported `enable`, `disable`, `setMode`, `refresh`, and `getState` service boundary;
- corrected gizmo delivery/history record.

### Confirmed findings

- the gizmo service owns its persisted preference at `kw.witchDock.decals.boundGizmo.enabled`;
- the Decals tool is only a presentation host for the corrected-gizmo service;
- moving that presentation does not require changing the validated gizmo runtime or its storage key;
- Utilities already hosts optional HeroForge UI controls and is the more coherent domain for this toggle/control block.

### Target files

- `tools/Decals.js`
- `tools/Utilities.js`
- `manifest.json`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`

### Conflict risks

- do not modify `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js` or its source fragments;
- do not duplicate the control in both Decals and Utilities;
- preserve the gizmo service-owned enabled state and Move/Rotate/Scale calls;
- keep the Decals tab registered so future decal tools have a stable host;
- Dev manifest must load the changed Dev copies of Decals and Utilities rather than the Stable copies during smoke testing.

### Version decision

- `decals-dev`: `1.0.0 -> 1.1.0` (meaningful presentation change / placeholder host);
- `utilities`: `1.0.0 -> 1.1.0` (adds the bound decal gizmo control surface).

### Decision

Proceed Dev-only and require a small live host smoke before Stable promotion.

**Runtime behavior changed:** yes, Dev presentation/host ownership only. Corrected gizmo runtime behavior is unchanged.'''

changelog_block = '''## DOCK-2026-09-06-034 — Move bound decal gizmo controls to Utilities

Date: 2026-09-06

### Changes

- `tools/Decals.js` v1.1.0 no longer hosts the corrected bound decal gizmo UI and now displays `New decal tools coming shortly!` as the Decals-tab placeholder.
- `tools/Utilities.js` v1.1.0 now hosts the existing Bound Decal Gizmo control block, including enable/disable, Move/Rotate/Scale mode buttons, live status, build/mapping/decal diagnostics, and the existing Project-OFF note.
- The validated `decals.gizmo.bound-correction` runtime and its source fragments are intentionally unchanged.
- The service-owned preference key `kw.witchDock.decals.boundGizmo.enabled` is unchanged, so the user's existing enabled/disabled state carries across the host move.
- Dev manifest points the changed Decals and Utilities entries at `WITCH_DEV_UI` for the live smoke.

### Module versions

- `decals-dev`: v1.1.0.
- `utilities`: v1.1.0.
- `corrected-bound-decal-gizmo`: remains v1.1.0 / build `1.1.0-stable-undo-transform-preserve`.

### Gate

Static syntax/manifest/diff/runtime-hash checks must pass. Live Dev smoke should confirm: Decals placeholder, one gizmo control block in Utilities, preserved toggle state, and working Move/Rotate/Scale selection.

**Runtime behavior changed:** yes, Dev UI host relocation only; gizmo runtime unchanged.'''

prepend_after_title('PRE_FLIGHT_Check.md', '# Pre-Flight Check Log', preflight_block)
prepend_after_title('CHANGELOG.md', '# Changelog', changelog_block)

master_path = ROOT / 'MASTER.md'
master = master_path.read_text()
insert_anchor = 'Branch: `WITCH_DEV_UI`.\n\n'
insert_text = '''Branch: `WITCH_DEV_UI`.\n\n### Decals / Utilities host cleanup candidate\n\nThe corrected Bound Decal Gizmo presentation is moving from the Decals tab to Utilities. The underlying `decals.gizmo.bound-correction` service/runtime remains unchanged and continues to own its persisted enabled state. The Decals tab remains registered as a future feature host and currently displays `New decal tools coming shortly!`.\n\nDev module versions for this host change: `decals-dev` v1.1.0 and `utilities` v1.1.0. Live host smoke is pending before Stable promotion.\n\n'''
if '### Decals / Utilities host cleanup candidate' not in master:
    master = replace_once(master, insert_anchor, insert_text, 'MASTER Dev branch insertion')
master = master.replace('| `decals-dev` | 1.0.0 | new tracking baseline |', '| `decals-dev` | 1.1.0 | Dev host cleanup: placeholder-only Decals tab |')
master = master.replace('| `utilities` | 1.0.0 | new tracking baseline |', '| `utilities` | 1.1.0 | Dev host cleanup: adds Bound Decal Gizmo controls |')
master = master.replace('| Utilities | `utilities` | `tools/Utilities.js` | Live | Optional HF UI controls. |', '| Utilities | `utilities` | `tools/Utilities.js` | **Dev v1.1.0 candidate** | Optional HF UI controls plus Bound Decal Gizmo host. |')
master = master.replace('| Decals | `decals-dev` | `tools/Decals.js` | Live | Bound decal gizmo host. |', '| Decals | `decals-dev` | `tools/Decals.js` | **Dev v1.1.0 candidate** | Placeholder host for upcoming decal tools; gizmo controls moved to Utilities. |')
master = master.replace('Feature ID: `decals.gizmo.bound-correction`. Current Stable service build: `1.1.0-stable-undo-transform-preserve`. Move/Rotate/Scale, undo/redo, Project-state preservation, artwork-swap preservation, and fresh-slot normalization are validated.', 'Feature ID: `decals.gizmo.bound-correction`. Current Stable service build: `1.1.0-stable-undo-transform-preserve`. Move/Rotate/Scale, undo/redo, Project-state preservation, artwork-swap preservation, and fresh-slot normalization are validated. The current Dev candidate changes only the Witch Dock host location: controls move to Utilities while the Decals tab becomes a placeholder for upcoming tools.')
master_path.write_text(master.rstrip() + '\n')

history_path = ROOT / 'HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md'
history = history_path.read_text()
history_anchor = '## Test-history correction\n'
history_insert = '''## Dev host relocation candidate — 2026-09-06\n\nThe current `WITCH_DEV_UI` candidate moves the existing gizmo presentation from `tools/Decals.js` into `tools/Utilities.js`. This is a UI-host relocation only:\n\n- `decals.gizmo.bound-correction` runtime source is unchanged;\n- persisted enablement remains service-owned at `kw.witchDock.decals.boundGizmo.enabled`;\n- enable/disable, Move/Rotate/Scale, refresh, status, and diagnostics still call the same service API;\n- the Decals tab remains registered and displays `New decal tools coming shortly!` pending future decal features.\n\nStable promotion requires a small Dev smoke confirming the relocated host works and is not duplicated.\n\n'''
if '## Dev host relocation candidate — 2026-09-06' not in history:
    history = replace_once(history, history_anchor, history_insert + history_anchor, 'BOUND_DECAL_GIZMO history insertion')
history_path.write_text(history.rstrip() + '\n')

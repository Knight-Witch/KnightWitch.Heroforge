from pathlib import Path
import json
import re

ROOT = Path('.')
loader_path = ROOT / 'Witch_Dock_DEV.user.js'
manifest_path = ROOT / 'manifest.json'
master_path = ROOT / 'MASTER.md'
preflight_path = ROOT / 'PRE_FLIGHT_Check.md'
changelog_path = ROOT / 'CHANGELOG.md'
followups_path = ROOT / 'HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md'


def replace_once(text, old, new, label):
    if old not in text:
        raise RuntimeError(f'missing expected text for {label}')
    if text.count(old) != 1:
        raise RuntimeError(f'expected exactly one match for {label}, found {text.count(old)}')
    return text.replace(old, new, 1)


def prepend_after_heading(text, heading, block):
    prefix = heading + '\n\n'
    if not text.startswith(prefix):
        raise RuntimeError(f'{heading} not found at file start')
    return prefix + block.rstrip() + '\n\n---\n\n' + text[len(prefix):]


# ---------------- Witch_Dock_DEV.user.js ----------------
loader = loader_path.read_text(encoding='utf-8')
loader = replace_once(loader, '// @version      1.0.8.2', '// @version      1.0.8.3', 'Dev userscript version')

css_anchor = '''.kwWDTab{
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: #eee;
  border-radius: 6px;
  padding: 5px 10px;
  cursor: default;
  font-weight: 700;
  white-space: nowrap;
}
'''
css_replacement = css_anchor + '''.kwWDTab.kwWDTabIconOnly{
  width: 32px;
  min-width: 32px;
  height: 29px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.kwWDTab.kwWDTabIconOnly svg{
  width: 16px;
  height: 16px;
  display: block;
  pointer-events: none;
}
'''
loader = replace_once(loader, css_anchor, css_replacement, 'icon-only tab CSS')

pattern = re.compile(r'''\n  function ensureTab\(name\) \{.*?\n  \}\n\n\n\nfunction makeIconBase\(\) \{''', re.S)
match = pattern.search(loader)
if not match:
    raise RuntimeError('could not locate ensureTab block')

new_tab_block = r'''
  const TAB_ORDER_RANK = new Map([
    ["Body Editor", 0],
    ["Body", 0],
    ["Pose", 10],
    ["Decals", 20],
    ["Booth", 30],
    ["JSON", 40],
    ["Utilities", 1000]
  ]);

  function tabDisplayName(name) {
    return name === "Body Editor" ? "Body" : name;
  }

  function tabRank(name) {
    return TAB_ORDER_RANK.has(name) ? TAB_ORDER_RANK.get(name) : 900;
  }

  function makeTabCogIcon() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    const ring = document.createElementNS(ns, "circle");
    ring.setAttribute("cx", "12");
    ring.setAttribute("cy", "12");
    ring.setAttribute("r", "6.25");
    ring.setAttribute("fill", "none");
    ring.setAttribute("stroke", "currentColor");
    ring.setAttribute("stroke-width", "2");

    const hub = document.createElementNS(ns, "circle");
    hub.setAttribute("cx", "12");
    hub.setAttribute("cy", "12");
    hub.setAttribute("r", "2.25");
    hub.setAttribute("fill", "currentColor");

    svg.appendChild(ring);
    svg.appendChild(hub);

    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", String(12 + Math.cos(angle) * 7.25));
      line.setAttribute("y1", String(12 + Math.sin(angle) * 7.25));
      line.setAttribute("x2", String(12 + Math.cos(angle) * 10));
      line.setAttribute("y2", String(12 + Math.sin(angle) * 10));
      line.setAttribute("stroke", "currentColor");
      line.setAttribute("stroke-width", "2.4");
      line.setAttribute("stroke-linecap", "round");
      svg.appendChild(line);
    }

    return svg;
  }

  function reorderTabButtons() {
    if (!state.tabsBar) return;
    const buttons = Array.from(state.tabsBar.children).filter(
      (node) => node && node.classList && node.classList.contains("kwWDTab")
    );
    const originalIndex = new Map(buttons.map((button, index) => [button, index]));

    buttons.sort((a, b) => {
      const aName = a.getAttribute("data-tab-name") || "";
      const bName = b.getAttribute("data-tab-name") || "";
      const rankDelta = tabRank(aName) - tabRank(bName);
      if (rankDelta) return rankDelta;
      return originalIndex.get(a) - originalIndex.get(b);
    });

    for (const button of buttons) state.tabsBar.appendChild(button);
    if (state.updateTabsCue) state.updateTabsCue();
  }

  function ensureTab(name) {
    if (state.tabs.has(name)) return state.tabs.get(name);

    const iconOnly = name === "Utilities";
    const btn = el("button", {
      class: iconOnly ? "kwWDTab kwWDTabIconOnly" : "kwWDTab",
      type: "button",
      "aria-selected": "false"
    });
    btn.setAttribute("data-tab-name", name);

    if (iconOnly) {
      btn.title = "Utilities";
      btn.setAttribute("aria-label", "Utilities");
      btn.appendChild(makeTabCogIcon());
    } else {
      btn.textContent = tabDisplayName(name);
      btn.setAttribute("aria-label", tabDisplayName(name));
    }

    const panel = el("div", { class: "kwWDPanel", "aria-hidden": "true" });
    const list = el("div", { class: "kwWDToolList" });
    panel.appendChild(list);

    btn.addEventListener("click", () => setActiveTab(name));

    state.tabsBar.appendChild(btn);
    state.body.appendChild(panel);

    const tab = { name, btn, panel, list };
    state.tabs.set(name, tab);
    reorderTabButtons();

    if (!prefs.activeTab) prefs.activeTab = name;
    if (!state.activeTab) state.activeTab = prefs.activeTab || name;

    setActiveTab(state.activeTab);
    return tab;
  }



function makeIconBase() {'''
loader = loader[:match.start()] + '\n' + new_tab_block + loader[match.end():]

for required in [
    'btn.textContent = tabDisplayName(name);',
    'btn.title = "Utilities";',
    'btn.appendChild(makeTabCogIcon());',
    '["Decals", 20]',
    '["Utilities", 1000]',
    'function reorderTabButtons()'
]:
    if required not in loader:
        raise RuntimeError(f'missing postcondition in loader: {required}')

loader_path.write_text(loader, encoding='utf-8')

# ---------------- manifest.json ----------------
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
registry = manifest.get('moduleRegistry', [])
loader_entry = next((item for item in registry if item.get('id') == 'witch-dock-dev-loader'), None)
if not loader_entry:
    raise RuntimeError('witch-dock-dev-loader registry entry missing')
loader_entry['version'] = '0.3.0'
loader_entry['build'] = '1.0.8.3-tab-order-icon'

registry_ids = [item.get('id') for item in registry]
registry_order = [
    'witch-dock-core',
    'witch-dock-dev-loader',
    'expanded-ui-scroll-guards',
    'hf-ui-scroll-split-safe',
    'hf-ui-slot-bridge',
    'expanded-decal-slots',
    'corrected-bound-decal-gizmo',
    'witch-dock-developer-mode',
    'body-editor',
    'pose-tool',
    'decals-dev',
    'booth-tool',
    'photo-booth-true-resolution',
    'photo-booth-true-resolution-readiness',
    'photo-booth-true-resolution-ui',
    'spinny-mini-webp',
    'spinny-mini-webp-ui',
    'json-tool',
    'utilities'
]
if set(registry_ids) != set(registry_order):
    raise RuntimeError(f'unexpected module registry IDs: {registry_ids}')
reg_map = {item['id']: item for item in registry}
manifest['moduleRegistry'] = [reg_map[item_id] for item_id in registry_order]

tools = manifest.get('tools', [])
tool_ids = [item.get('id') for item in tools]
tool_order = [
    'witch-dock-developer-mode',
    'expanded-ui-scroll-guards',
    'hf-ui-scroll-split-safe',
    'hf-ui-slot-bridge',
    'corrected-bound-decal-gizmo',
    'body-editor',
    'pose-tool',
    'decals-dev',
    'booth-tool',
    'photo-booth-true-resolution',
    'photo-booth-true-resolution-readiness',
    'photo-booth-true-resolution-ui',
    'spinny-mini-webp',
    'spinny-mini-webp-ui',
    'json-tool',
    'utilities'
]
if set(tool_ids) != set(tool_order):
    raise RuntimeError(f'unexpected manifest tool IDs: {tool_ids}')
tool_map = {item['id']: item for item in tools}
manifest['tools'] = [tool_map[item_id] for item_id in tool_order]
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')

# ---------------- durable docs ----------------
master = master_path.read_text(encoding='utf-8')
master = master.replace('- Current public userscript version: `1.0.8`', '- Current public userscript version: `1.1.0`', 1)
master = master.replace('Public Stable remains unchanged by the current `WITCH_DEV_UI` work.', 'Public Stable v1.1.0 is the current production baseline. The tab cleanup below remains Dev-only until its own smoke/promotion gate.', 1)
master = master.replace('| `witch-dock-dev-loader` | 0.2.0 | Dev registry candidate |', '| `witch-dock-dev-loader` | 0.3.0 | build `1.0.8.3-tab-order-icon`; Dev tab-order/icon candidate |', 1)
old_tab_section = '''### Default tab order candidate\n\nThe Dev manifest registers `Decals` after Booth-related modules and before `JSON`, yielding `... Booth -> Decals -> JSON -> Utilities` by default. Integrated Dev-manifest tab-order smoke remains pending.\n'''
new_tab_section = '''### Default tab order / tab presentation candidate\n\nCurrent accepted target:\n\n`Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`\n\nDev core presentation keeps the existing `Body Editor` tab key for preference compatibility while displaying `Body`. Utilities renders as an icon-only cog with native hover tooltip/ARIA label `Utilities`. The core reorders known tabs and assigns unknown future tabs ahead of Utilities, so Utilities remains structurally pinned last instead of relying only on manifest load order. Integrated Dev smoke is pending.\n'''
if old_tab_section in master:
    master = master.replace(old_tab_section, new_tab_section, 1)
else:
    raise RuntimeError('MASTER old tab section missing')
master = master.replace('- Developer Mode must remain optional.', '- Developer Mode must remain optional. Accepted Stable direction: default OFF, user-toggleable only through About, with module/build/version diagnostics available when troubleshooting.', 1)
old_queue = '''## Current Near-Term Queue\n\n1. Re-smoke the Dev Spinny privileged download host and UI hardening patch.\n2. Confirm a 1024 Short Test download completes through the host and the brief success indicator fires.\n3. Later, smoke integrated `WITCH_DEV_UI` Developer Mode + compact High Res behavior, including provider disable/re-enable and direct 4K/8K regression.\n4. Smoke integrated default `Booth -> Decals -> JSON` order.\n5. Cleanly separate High Res service/UI ownership before public promotion.\n6. If the Dev hardening re-smoke passes, prepare the exact accepted Spinny delta for separate Stable promotion review.\n'''
new_queue = '''## Current Near-Term Queue\n\n1. Smoke the Dev tab cleanup: `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`, with Utilities pinned last.\n2. Promote the accepted tab cleanup separately after user approval.\n3. Smoke integrated Developer Mode + compact High Res behavior, including provider disable/re-enable and direct 4K/8K regression.\n4. Cleanly separate High Res service/UI ownership before promoting the compact High Res presentation.\n5. Promote Developer Mode as an About-only, default-OFF public diagnostic feature after its integrated smoke.\n6. Keep 4096 animated WebP deferred until a clean frame-source ownership seam exists.\n'''
if old_queue in master:
    master = master.replace(old_queue, new_queue, 1)
master_path.write_text(master, encoding='utf-8')

preflight = preflight_path.read_text(encoding='utf-8')
preflight_block = '''## PFC-2026-09-06-029 — Dev tab order / Utilities icon cleanup\n\nDate: 2026-09-06\n\n### Reviewed\n\n- binding HeroForge.Compatibility project contract and current Witch Dock Dev tracking;\n- `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `MODULE_VERSIONING.md`;\n- `Witch_Dock_DEV.user.js` tab construction/order code and tab CSS;\n- `manifest.json` load order and module registry;\n- Body Editor / Decals / Utilities registration behavior;\n- active UI follow-up queue and the newly accepted public Developer Mode direction.\n\n### Target behavior\n\n- display tabs as `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`;\n- preserve the existing `Body Editor` internal tab key/persisted preference while displaying `Body`;\n- render Utilities as an SVG cog with tooltip/ARIA label `Utilities`;\n- structurally pin Utilities last even if future tabs register after it;\n- keep unknown future tabs ahead of Utilities;\n- keep this change Dev-only until visual smoke.\n\n### Conflict risks\n\n- do not alter the tool modules themselves or their HeroForge behavior;\n- do not invalidate persisted active-tab values;\n- do not rely only on manifest timing for the final order;\n- do not promote unrelated Developer Mode/High Res Dev work in this tab-only stage.\n\n### Version decision\n\n`witch-dock-dev-loader` advances to v0.3.0 / build `1.0.8.3-tab-order-icon`. No Body, Pose, Decals, Booth, JSON or Utilities module version changes are required because their runtime modules are untouched.\n\n**Runtime behavior changed:** yes, Dev shell presentation/order only.\n'''
preflight = prepend_after_heading(preflight, '# Pre-Flight Check Log', preflight_block)
preflight_path.write_text(preflight, encoding='utf-8')

changelog = changelog_path.read_text(encoding='utf-8')
changelog_block = '''## DOCK-2026-09-06-029 — Dev tab cleanup and pinned Utilities icon\n\nDate: 2026-09-06\n\n### Changes\n\n- Dev tab presentation now displays `Body` instead of `Body Editor` without changing the internal/persisted tab key.\n- Default/runtime tab order is enforced as `Body -> Pose -> Decals -> Booth -> JSON -> Utilities`.\n- Utilities is an icon-only SVG cog with hover tooltip and ARIA label `Utilities`.\n- Utilities is structurally pinned last; later/unknown tabs are inserted ahead of it rather than pushing Settings/Utilities into the middle.\n- Manifest load order is aligned with the same visible order so registration order and core ordering agree.\n\n### Version\n\n- `witch-dock-dev-loader`: v0.3.0 / build `1.0.8.3-tab-order-icon`; userscript `@version` 1.0.8.3.\n- Tool module sources unchanged.\n\n### Developer Mode direction recorded\n\nDeveloper Mode is intended for eventual Stable availability as a default-OFF About-menu toggle so users can expose module/build/version diagnostics when troubleshooting. This commit does not promote Developer Mode to Stable.\n\n**Runtime behavior changed:** yes, Dev shell presentation/order only. Public Stable remains unchanged by this checkpoint.\n'''
changelog = prepend_after_heading(changelog, '# Changelog', changelog_block)
changelog_path.write_text(changelog, encoding='utf-8')

followups = followups_path.read_text(encoding='utf-8')
followup_block = '''## 2026-09-06 tab cleanup + Developer Mode direction\n\nAccepted tab target for the next Dev smoke:\n\n`Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`\n\n- `Body Editor` remains the internal tab key for preference compatibility but displays as `Body`.\n- Utilities uses an icon-only cog with tooltip `Utilities`.\n- Utilities must remain structurally last, not merely last by current manifest order.\n- Unknown future tabs should appear before Utilities automatically.\n\nDeveloper Mode product direction is now decided: it should eventually be available in public Stable, default OFF, toggled from About, primarily to expose module/version/build diagnostics during troubleshooting. No separate toolbar control or hotkey is required.\n\nAfter tab cleanup smoke/promotion, resume the compact High Res integration/service-UI ownership work, then the Developer Mode Stable promotion gate.\n'''
followups = followups.replace('## Purpose\n', followup_block + '\n---\n\n## Purpose\n', 1)
followups_path.write_text(followups, encoding='utf-8')

print('Applied Witch Dock Dev tab cleanup candidate.')

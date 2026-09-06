from pathlib import Path
import json
import subprocess

EXPECTED_BASE = '0398b8c52311b2e0030a08f0504933ef58bc0c77'


def fail(message):
    raise SystemExit(message)


def replace_one(text, old, new, label):
    count = text.count(old)
    if count != 1:
        fail(f'{label}: expected exactly 1 match, got {count}')
    return text.replace(old, new, 1)


def git(*args):
    return subprocess.check_output(['git', *args], text=True).strip()


def git_show(ref_path):
    return subprocess.check_output(['git', 'show', ref_path], text=True)


if git('rev-parse', 'HEAD') != EXPECTED_BASE:
    fail(f'candidate branch is not at expected Stable base {EXPECTED_BASE}')

# ---------------------------------------------------------------------------
# Promote exact live-tested Dev Spinny modules, changing Stable metadata only.
# ---------------------------------------------------------------------------
service = git_show('origin/WITCH_DEV_UI:features/media/Spinny_Mini_WebP.js')
service = replace_one(
    service,
    '// @name         Witch Dock DEV - Spinny Mini WebP Service',
    '// @name         Witch Dock - Spinny Mini WebP Service',
    'service name'
)
service = replace_one(
    service,
    'const BUILD = \'0.5.1-witch-dock-dev-download-scroll-guard\';',
    'const BUILD = \'0.5.1-witch-dock-stable-download-scroll-guard\';',
    'service stable build'
)
Path('features/media/Spinny_Mini_WebP.js').write_text(service)

ui = git_show('origin/WITCH_DEV_UI:features/media/Spinny_Mini_WebP_UI.js')
ui = replace_one(
    ui,
    '// @name         Witch Dock DEV - Spinny Mini WebP UI',
    '// @name         Witch Dock - Spinny Mini WebP UI',
    'UI name'
)
ui = replace_one(
    ui,
    'const BUILD = \'0.1.1-dev-download-ux\';',
    'const BUILD = \'0.1.1-stable-download-ux\';',
    'UI stable build'
)
Path('features/media/Spinny_Mini_WebP_UI.js').write_text(ui)

# ---------------------------------------------------------------------------
# Public Witch Dock shell: add the exact privileged download boundary that
# passed the final Dev smoke. This is the only new shell capability.
# ---------------------------------------------------------------------------
core_path = Path('Witch_Dock.user.js')
core = core_path.read_text()
core = replace_one(core, '// @name         Witch Dock v1.0.8', '// @name         Witch Dock v1.1.0', 'public name version')
core = replace_one(core, '// @version      1.0.8', '// @version      1.1.0', 'public userscript version')
core = replace_one(core, '// @grant        GM_xmlhttpRequest\n', '// @grant        GM_xmlhttpRequest\n// @grant        GM_download\n', 'GM_download grant')

host_code = '''  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;\n\nfunction kwFormatDownloadError(error) {\n  if (!error) return "unknown error";\n  if (typeof error === "string") return error;\n  const reason = error.error || error.message || "download failed";\n  let details = "";\n  if (error.details) {\n    try { details = ` (${typeof error.details === "string" ? error.details : JSON.stringify(error.details)})`; }\n    catch { details = ""; }\n  }\n  return `${reason}${details}`;\n}\n\nfunction kwDownloadBlob(blob, filename) {\n  return new Promise((resolve, reject) => {\n    if (typeof GM_download !== "function") {\n      reject(new Error("Tampermonkey GM_download is unavailable."));\n      return;\n    }\n    const name = String(filename || "download.bin");\n    let settled = false;\n    const finish = (fn, value) => {\n      if (settled) return;\n      settled = true;\n      fn(value);\n    };\n    try {\n      GM_download({\n        url: blob,\n        name,\n        saveAs: false,\n        conflictAction: "uniquify",\n        onload: () => finish(resolve, { ok: true, method: "GM_download", filename: name }),\n        onerror: (error) => finish(reject, new Error(`Witch Dock download failed: ${kwFormatDownloadError(error)}`)),\n        ontimeout: () => finish(reject, new Error("Witch Dock download timed out."))\n      });\n    } catch (error) {\n      finish(reject, error instanceof Error ? error : new Error(String(error)));\n    }\n  });\n}\n'''
core = replace_one(
    core,
    '  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;\n',
    host_code,
    'public download host insertion'
)
core = replace_one(
    core,
    '  UW.WitchDock.registerTool = registerTool;\n  UW.WitchDock.ensureDock = buildUI;\n',
    '  UW.WitchDock.registerTool = registerTool;\n  UW.WitchDock.ensureDock = buildUI;\n  UW.WitchDock.downloadBlob = kwDownloadBlob;\n',
    'public download host exposure'
)
core_path.write_text(core)

# ---------------------------------------------------------------------------
# Manifest: load Spinny service and UI as hidden runtime modules. The UI itself
# registers the visible Booth section after the existing High Res service.
# Developer Mode and compact High Res Dev UI are intentionally NOT promoted.
# ---------------------------------------------------------------------------
manifest_path = Path('manifest.json')
manifest = json.loads(manifest_path.read_text())
tools = manifest.get('tools')
if not isinstance(tools, list):
    fail('manifest tools array missing')
if any(t.get('id') in {'spinny-mini-webp', 'spinny-mini-webp-ui'} for t in tools):
    fail('Stable manifest already contains Spinny entries')

readiness_index = next((i for i, t in enumerate(tools) if t.get('id') == 'photo-booth-true-resolution-readiness'), None)
if readiness_index is None:
    fail('photo-booth-true-resolution-readiness entry missing')

spinny_entries = [
    {
        'id': 'spinny-mini-webp',
        'title': 'Spinny Mini WebP Service',
        'tab': 'HeroForge UI',
        'url': 'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/features/media/Spinny_Mini_WebP.js',
        'enabledByDefault': True,
        'hidden': True,
        'type': 'heroForgeUI'
    },
    {
        'id': 'spinny-mini-webp-ui',
        'title': 'Spinny Mini WebP UI',
        'tab': 'HeroForge UI',
        'url': 'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/features/media/Spinny_Mini_WebP_UI.js',
        'enabledByDefault': True,
        'hidden': True,
        'type': 'heroForgeUI'
    }
]
tools[readiness_index + 1:readiness_index + 1] = spinny_entries
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')

# ---------------------------------------------------------------------------
# Durable public Stable record.
# ---------------------------------------------------------------------------
master = '''# Witch Dock Master

This is the canonical high-level source for current public Witch Dock state. Detailed historical master content remains available in Git history; this file tracks the active live architecture and current feature boundaries.

## Current Architecture

- Repository: `Knight-Witch/KnightWitch.Heroforge`
- Live branch: `Witch_Scripts`
- Public install script: `Witch_Dock.user.js`
- Current public userscript version: `1.1.0`
- Manifest loader: `manifest.json`
- Public module delivery: raw GitHub files pinned to the live `Witch_Scripts` branch
- Visible tools: `/tools/` plus feature modules that register their own Witch Dock host
- Hidden HeroForge/runtime utilities: `/HeroForge_UI/`
- Maintained feature services may live under `/features/` while future shared Foundation extraction is pending

Public Stable v1.1.0 adds the validated Spinny Mini animated-WebP feature and the privileged download host required by that feature. It does not promote the diverged `WITCH_DEV_UI` branch wholesale.

## Live Feature Inventory

| Area | Manifest ID | File | Status | Notes |
|---|---|---|---|---|
| Core | n/a | `Witch_Dock.user.js` | **Live v1.1.0** | Floating dock shell, manifest loader, shared UI, storage, undo/redo, footer utilities, compact emblem launcher, privileged Blob download host. |
| Body | `body-editor` | `tools/Body_Editor.js` | Live | Body editing/symmetry workflows. |
| Pose | `pose-tool` | `tools/Pose.js` | Live | Figure Main/Extra swap workflow. |
| Booth persistence | `booth-tool` | `tools/Booth.js` | Live | Current build `v24`; Persistent Booth, lighting/effects/overlay/background persistence, Black Canvas. |
| Photo Booth true resolution | `photo-booth-true-resolution` | `features/media/Photo_Booth_True_Resolution.js` | **Live / Stable validated** | `media.screenshot-resolution`; true 4K and grouped low-pressure true 8K provider plus direct Booth-tab buttons. |
| Photo Booth UI readiness | `photo-booth-true-resolution-readiness` | `HeroForge_UI/Photo_Booth_True_Resolution_Readiness.js` | **Live / Stable validated / hidden** | Keeps direct 4K/8K buttons synchronized when Photo Booth becomes ready after provider initialization. |
| Spinny service | `spinny-mini-webp` | `features/media/Spinny_Mini_WebP.js` | **Live / Stable validated** | `media.spinny-mini-webp` v0.5.1; 1024/2048 native frame source, TRUE-3K 3072 repair, Pause/Resume, cancel, ETA, interaction guards, animated-WebP mux and confirmed download host. |
| Spinny UI | `spinny-mini-webp-ui` | `features/media/Spinny_Mini_WebP_UI.js` | **Live / Stable validated** | Booth-tab controls plus shared-state draggable popout; public resolution labels are 1024px/2048px/3072px. Short Test remains hidden in ordinary public mode. |
| JSON | `json-tool` | `tools/JSON_Tool.js` | Live | Bulk JSON library backup. |
| Utilities | `utilities` | `tools/Utilities.js` | Live | User-facing controls for optional HF UI helpers. |
| Decals | `decals-dev` | `tools/Decals.js` | Live | Bound decal gizmo host; legacy internal ID retained for tested parity. |
| HF UI | `expanded-ui-scroll-guards` | `HeroForge_UI/Expanded_UI_Scroll_Guards.js` | Live / hidden | Scoped Decals scroll/resize behavior. |
| HF UI | `hf-ui-scroll-split-safe` | `HeroForge_UI/HF_UI_Scroll_Split_Safe.js` | Live / hidden | Split-layout scroll safety. |
| HF UI | `hf-ui-slot-bridge` | `HeroForge_UI/HF_UI_Slot_Bridge.js` | Live / hidden | Conditional expanded decal-slot bridge. |
| HF UI | `corrected-bound-decal-gizmo` | `HeroForge_UI/Corrected_Bound_Decal_Gizmo.js` | Live / hidden | Stable corrected projector-centered bound decal gizmo, including validated undo/redo and transform-state preservation. |

## Spinny Mini WebP

Feature ID: `media.spinny-mini-webp`.

Public Stable service version: `0.5.1`; build `0.5.1-witch-dock-stable-download-scroll-guard`.
Public Stable UI version: `0.1.1`; build `0.1.1-stable-download-ux`.
Compatibility target: `heroforge07.1.9.98`.

Validated behavior promoted from standalone -> Witch Dock Dev -> Stable review:

- 1024 and 2048 use native `BT.maker.takeScreenshot` frame production;
- 3072 uses the validated TRUE-3K `CK.Effects.renderToCanvas` phase-feed repair rather than HeroForge's blurry native 3072 source path;
- Standard / Slow / Slower / Very Slow retain 40 ms per-frame animation timing while slower rotations use more angular samples;
- frame-boundary Pause/Resume works without leaving a partial TRUE-3K wrapper installed;
- cancel while active or paused restores capture state;
- paused wall-clock time is excluded from active ETA accounting;
- camera/canvas and Booth-state interaction guards protect animation continuity;
- wheel/scroll during capture is silently suppressed without a warning modal;
- other continuity-invalidating interactions retain the Keep Capture / Cancel Capture warning;
- draggable popout shares the same service/control state as the docked UI;
- dropdowns use public labels `1024px`, `2048px`, `3072px` and dark option styling;
- public downloads use the userscript-level `GM_download` host and wait for success/error callbacks rather than relying on a silent page-anchor click;
- public UI keeps the 16-frame Short Test diagnostic hidden because Developer Mode is not part of this Stable promotion;
- 4096 animated WebP remains explicitly deferred.

Final integrated Dev re-smoke on 2026-09-06: download successful; silent scroll block successful; user reported the integrated feature works perfectly. The optional transient in-panel download-complete flash was not observed and is not a Stable acceptance gate because browser download confirmation and the privileged download callback are authoritative.

Detailed record: `HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md`.

## Photo Booth True Resolution

Feature ID: `media.screenshot-resolution`.

Validated source baseline: HeroForge.Compatibility standalone v0.6 on `heroforge07.1.9.98`.

Public behavior remains unchanged by Spinny v1.1.0. The still provider continues to intercept only square 4096 and 8192 requests; all lower sizes including Spinny 1024/2048/3072 remain outside that owning provider boundary.

Detailed record: `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md`.

## Bound Decal Gizmo

Feature ID: `decals.gizmo.bound-correction`.

Current stable service build: `1.1.0-stable-undo-transform-preserve`.

Validated behavior includes projector-centered Move/Rotate/Scale, native floor/origin Transformer suppression, Move/Rotate/Scale undo-redo, Project state preservation, artwork-swap transform preservation, and signature-gated fresh-slot bad-default normalization. Unequal Project-OFF visible scaling, exact artwork-center polish, and corrected projector wireframe/bounding-box display remain deferred.

Detailed record: `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`.

## Current Integration Rules

- `Witch_Scripts` is production; experimental development occurs on separate branches/modules first.
- Public Witch Dock must not depend on `HeroForge.Compatibility/main`, HF-Chat-Bridge, or an unstable future Foundation head at runtime.
- Validated Compatibility features may be promoted as self-contained public modules after Dev integration testing and explicit approval.
- Do not merge diverged Dev branches wholesale into production; promote only the accepted feature delta.
- Preserve runtime capability checks, lifecycle restoration, timing/state sequencing, and failure isolation.
- Spinny does not displace the existing 4096/8192 still-provider ownership of `BT.maker.takeScreenshot`.

## Current Near-Term Queue

1. Perform one clean public Stable Spinny smoke after userscript update/permission approval; do not reopen standalone/Dev investigation unless a regression appears.
2. Keep 4096 animated WebP deferred until a separately validated explicit frame path can coexist with the still provider.
3. Continue planned Foundation/shared compatibility design without making public Stable depend on an unstable development head.
4. Keep Persistent Booth, true-resolution still capture, and corrected bound decal gizmo isolated from unrelated refactors.
5. Compact High Res UI, Developer Mode, module-registry work, and other `WITCH_DEV_UI` changes remain separate Dev work and are not implicitly promoted by v1.1.0.

## Durable Records

- `PRE_FLIGHT_Check.md` — current pre-flight decision; older entries preserved in Git history.
- `CHANGELOG.md` — current release/validation entry; older entries preserved in Git history.
- `HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md` — Spinny architecture, validation and public promotion record.
- `HISTORY/BULLSHIT/PHOTO_BOOTH_TRUE_RESOLUTION.md` — true-resolution still capture architecture/validation.
- `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md` — corrected bound decal gizmo record.
- `HISTORY/BULLSHIT/BOOTH_RENDERS_EXPORTS.md` — broader Booth/render/export history.
- `HISTORY/Bullshit_Bible.md` — fragile HeroForge behavior index.

Historical detailed master state through public Stable v1.0.8 remains preserved in Git history.
'''
Path('MASTER.md').write_text(master)

preflight_path = Path('PRE_FLIGHT_Check.md')
preflight_existing = preflight_path.read_text()
preflight_entry = '''# Pre-Flight Check Log

## PFC-2026-09-06-022 — Promote validated Spinny Mini WebP to public Stable

Date: 2026-09-06

### Scope

Promote only the accepted `media.spinny-mini-webp` Witch Dock Dev delta into public `Witch_Scripts` after explicit user approval. Do not merge the diverged Dev branch wholesale.

### Required material reviewed

- binding `HeroForge.Compatibility/PROJECT_CONTRACT.md`;
- HFC `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- HFC Spinny feature specification and validated v0.5.0 architecture;
- public `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`;
- public `Witch_Dock.user.js`, `manifest.json`, and `features/media/Photo_Booth_True_Resolution.js`;
- public true-resolution history/ownership record;
- exact WITCH_DEV_UI Spinny v0.5.1 service and v0.1.1 UI that received the final integrated smoke.

### Confirmed live evidence

- standalone 1024/2048/TRUE-3K 3072 capture architecture was previously validated;
- full 3072 Standard and Slower production captures passed visual and runtime validation;
- integrated Dev placement, popout, Pause/Resume, cancel, ETA and interaction guards passed;
- final Dev hardening re-smoke: silent wheel/scroll block PASS;
- final Dev hardening re-smoke: WebP download PASS through the privileged userscript host;
- user reports all remaining integrated behavior works perfectly and explicitly approved public rollout;
- optional transient in-panel download-complete flash was not observed, but browser download confirmation and the successful privileged download boundary make it non-gating.

### Target files

- `Witch_Dock.user.js`
- `manifest.json`
- `features/media/Spinny_Mini_WebP.js` (new Stable consumer copy)
- `features/media/Spinny_Mini_WebP_UI.js` (new Stable UI host)
- `HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md` (new)
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Material conflict risks checked

- public 4096/8192 true-resolution still provider remains the owner of its existing `BT.maker.takeScreenshot` wrapper;
- Spinny does not replace that owner and 3072 operates below it at the bounded Effects seam;
- public shell change is limited to the tested `GM_download` host plus v1.1.0 metadata;
- Short Test remains hidden because public Stable does not promote Developer Mode;
- compact High Res UI, Developer Mode, module registry and unrelated Dev ordering changes are excluded;
- 4096 animated WebP remains deferred;
- no HF-Chat-Bridge or unstable HFC runtime dependency is introduced.

### Decision

Approved for a narrow Stable promotion candidate. Require syntax/manifest/static ownership checks before advancing `Witch_Scripts`.

**Runtime behavior changed:** yes — public v1.1.0 adds Spinny Mini WebP and the tested privileged download host.

---

'''
# Preserve prior public records while avoiding a duplicate title line.
if preflight_existing.startswith('# Pre-Flight Check Log\n\n'):
    preflight_existing = preflight_existing[len('# Pre-Flight Check Log\n\n'):]
preflight_path.write_text(preflight_entry + preflight_existing)

changelog_path = Path('CHANGELOG.md')
changelog_existing = changelog_path.read_text()
changelog_entry = '''# Changelog

## DOCK-2026-09-06-022 — Release Witch Dock v1.1.0 with Spinny Mini WebP

Date: 2026-09-06

### Summary

Promoted the explicitly approved, integrated Dev-tested `media.spinny-mini-webp` feature into public Witch Dock Stable as a narrow accepted delta. Public userscript version advances from 1.0.8 to 1.1.0.

### Public runtime changes

- added `features/media/Spinny_Mini_WebP.js` v0.5.1 / build `0.5.1-witch-dock-stable-download-scroll-guard`;
- added `features/media/Spinny_Mini_WebP_UI.js` v0.1.1 / build `0.1.1-stable-download-ux`;
- added 1024px, 2048px and validated TRUE-3K 3072px animated WebP profiles;
- retained Standard / Slow / Slower / Very Slow profiles at 40 ms per encoded frame;
- added safe frame-boundary Pause/Resume and cancel-while-paused behavior;
- added continuity guards for camera/Booth interaction;
- wheel/scroll attempts during capture are silently suppressed;
- other continuity-invalidating interactions retain Keep Capture / Cancel Capture warning behavior;
- added the validated shared-state draggable Spinny popout;
- added dark dropdown styling and plain public resolution labels;
- public `Witch_Dock.user.js` now grants/exposes `GM_download` as the confirmed Blob download boundary;
- Short Test remains hidden in ordinary Stable because Developer Mode is not part of this promotion;
- 4096 animated WebP remains deferred.

### Validation

Prior standalone and Dev validation covered native lower-resolution capture, TRUE-3K 3072 repair, full 250/500-frame production runs, parser/mux output, rotation restoration, ETA, Pause/Resume, cancel, popout, interaction guards and repeated use.

Final integrated Dev re-smoke immediately before approval:

- silent scroll block: PASS;
- privileged WebP download: PASS;
- remaining integrated behavior: user reported everything works perfectly;
- optional transient in-panel completion flash: not observed and explicitly treated as non-gating.

### Excluded Dev work

This is not a merge of `WITCH_DEV_UI`. Developer Mode, compact High Res UI, module-version registry, Dev loader and unrelated ordering/UI work remain outside this Stable release.

### Rollback

Revert this release commit to restore v1.0.8, remove the two Spinny manifest/modules, and remove the `GM_download` host. Existing true-resolution still capture and other Stable modules are otherwise unchanged.

**Runtime behavior changed:** yes — public Stable feature release.

---

'''
if changelog_existing.startswith('# Changelog\n\n'):
    changelog_existing = changelog_existing[len('# Changelog\n\n'):]
changelog_path.write_text(changelog_entry + changelog_existing)

history = '''# Spinny Mini WebP

Feature ID: `media.spinny-mini-webp`  
Public status: **Witch Dock Stable promotion approved / candidate static gate required**  
Last verified HeroForge build: `heroforge07.1.9.98`  
Standalone source baseline: `Knight-Witch/HeroForge.Compatibility` v0.5.0  
Public service: `features/media/Spinny_Mini_WebP.js` v0.5.1  
Public UI: `features/media/Spinny_Mini_WebP_UI.js` v0.1.1

## Purpose

Provide high-quality animated Spinny Mini WebP export without Lob's brittle compiled-bundle GIF patching, while supporting higher resolution, slower rotations, safe Pause/Resume, continuity protection and a Witch Dock-hosted download boundary.

## Public architecture

```text
Spinny Witch Dock UI
    ↓
Spinny service
    ↓
rotation + display refresh sequencing
    ↓
frame-source adapter
    ├── 1024 / 2048: BT.maker.takeScreenshot
    └── 3072: TRUE-3K CK.Effects phase-feed repair
    ↓
browser static WebP encode per frame
    ↓
project-owned RIFF animated-WebP mux
    ↓
parser validation
    ↓
WitchDock.downloadBlob -> GM_download
```

No HeroForge bundle patch is used. Compressed WebP frame payloads are retained until final assembly; raw RGBA is not accumulated for the full animation.

## Resolution behavior

### 1024 / 2048

Use HeroForge's native `BT.maker.takeScreenshot(size,size)` frame path.

### 3072 TRUE-3K

Native HeroForge 3072 was rejected because runtime tracing showed a structurally 3072 final capture sourced from repeated 768px Effects phase renders, producing visibly blurred/upscaled detail.

The maintained repair temporarily wraps matching `CK.Effects.renderToCanvas` requests during one explicit 3072 frame, renders one genuine 3072x3072 Effects source, derives the native compositor's requested phase canvases from that source, validates phase topology/completeness, and restores the exact original Effects method after every frame.

The repair never takes ownership of `BT.maker.takeScreenshot`. Existing public true-resolution still capture therefore retains ownership of square 4096/8192 requests.

## Rotation profiles

All profiles encode at 40 ms/frame / 25 FPS. Slower rotations add angular samples rather than repeating frames:

- Standard: 250 frames / 10 s;
- Slow: 375 frames / 15 s;
- Slower: 500 frames / 20 s;
- Very Slow: 750 frames / 30 s.

## Pause / Resume

Pause is honored only at a completed encoded-frame boundary. The current frame finishes, temporary TRUE-3K state is already restored, and no next angular sample begins until resume. Compressed frames remain retained. Cancel while paused releases the waiter and proceeds through normal restoration. Paused wall-clock time is tracked separately from active ETA.

## Interaction guards

While capture is active or paused, Spinny-owned controls remain usable and HeroForge actions that could invalidate continuity are intercepted before mutation.

- camera/canvas pointer interaction: warning with Keep Capture / Cancel Capture;
- Photo Booth/state-changing UI interaction: warning with Keep Capture / Cancel Capture;
- wheel/scroll: silently suppressed with no popup, per final user-approved behavior;
- choosing Cancel cancels capture first and requires the user to repeat the intended action after cleanup;
- pointer sequences are not blindly replayed.

## Witch Dock UI

- visible under the Booth tab after the existing High Resolution Capture service;
- resolution choices display only `1024px`, `2048px`, `3072px`;
- dark select/option styling;
- Standard / Slow / Slower / Very Slow rotation selector;
- Capture / Pause-Resume / Cancel controls;
- progress and measured ETA;
- icon-only popout control with tooltip;
- draggable shared-state popout; closing returns the same controls to the dock;
- 16-frame Short Test remains in the service for diagnostics but is hidden in ordinary public Stable because Developer Mode is not promoted here.

## Download boundary

The first integrated Dev build successfully generated/muxed files but its page-context anchor click did not initiate a visible browser download. The accepted repair moved download ownership to the userscript shell:

- public `Witch_Dock.user.js` grants `GM_download`;
- `WitchDock.downloadBlob(blob, filename)` returns a Promise;
- Spinny awaits `GM_download` success/error/timeout callbacks;
- service diagnostics record download method/filename/confirmed state;
- only a confirmed userscript-host result receives status `downloaded`.

Final Dev re-smoke confirmed the WebP downloads correctly and appears in the browser's normal download UI.

An optional in-panel `Download complete` flash remains best-effort presentation; the user did not observe it in final smoke and explicitly did not consider that a problem. It is not part of the functional acceptance contract.

## Validation record

Standalone / pre-integration validation on `heroforge07.1.9.98` includes:

- 1024 Standard / 250 frames: PASS;
- 2048 Standard / 250 frames: PASS;
- 1024 Very Slow / 750 frames: PASS;
- 2048 Slower / 500 frames: PASS;
- 3072 Standard / 250 frames TRUE-3K: PASS;
- 3072 Slower / 500 frames TRUE-3K: PASS;
- 3072 Short Test / 16 frames: PASS;
- parser/mux, progress, ETA, repeat use, starting-rotation restoration and cancel: PASS;
- frame-boundary Pause/Resume at native 1024 and TRUE-3K 3072: PASS;
- cancel while paused and paused-time ETA accounting: PASS;
- camera/Booth guards and guard-triggered cancellation: PASS.

Integrated Witch Dock Dev validation:

- Booth placement: PASS;
- docked controls/popout shared state: PASS;
- popout movement/return: PASS;
- Pause/Resume/Cancel/guards: PASS;
- silent scroll suppression after final hardening: PASS;
- privileged WebP download after final hardening: PASS;
- user conclusion: everything works perfectly; explicit public rollout approval received.

## Excluded / deferred

- 4096 animated WebP remains deferred because public true-resolution still capture owns square 4096/8192 screenshot requests.
- Developer Mode is not promoted by this release.
- compact High Res UI is not promoted by this release.
- Dev module-registry work is not promoted by this release.
- HF-Chat-Bridge is not a runtime dependency.

## Revalidation triggers

Revalidate Spinny when:

- HeroForge screenshot tile topology changes;
- `CK.Effects.renderToCanvas` or capture-camera view geometry changes;
- display rotation/refresh sequencing changes;
- browser/userscript WebP or Blob download behavior changes;
- the public 4096/8192 provider ownership boundary changes;
- Pause or interaction-guard lifecycle changes;
- high-cost resource limits are observed on supported hardware.
'''
Path('HISTORY/BULLSHIT/SPINNY_MINI_WEBP.md').write_text(history)

# ---------------------------------------------------------------------------
# Static promotion gate.
# ---------------------------------------------------------------------------
subprocess.run(['node', '--check', 'Witch_Dock.user.js'], check=True)
subprocess.run(['node', '--check', 'features/media/Spinny_Mini_WebP.js'], check=True)
subprocess.run(['node', '--check', 'features/media/Spinny_Mini_WebP_UI.js'], check=True)
json.loads(Path('manifest.json').read_text())

core_check = Path('Witch_Dock.user.js').read_text()
service_check = Path('features/media/Spinny_Mini_WebP.js').read_text()
ui_check = Path('features/media/Spinny_Mini_WebP_UI.js').read_text()
manifest_check = Path('manifest.json').read_text()

assert '// @version      1.1.0' in core_check
assert core_check.count('// @grant        GM_download') == 1
assert 'UW.WitchDock.downloadBlob = kwDownloadBlob;' in core_check
assert 'GM_download({' in core_check
assert "const VERSION = '0.5.1';" in service_check
assert "const BUILD = '0.5.1-witch-dock-stable-download-scroll-guard';" in service_check
assert "'1024': Object.freeze({ id: '1024', label: '1024px', size: 1024 })" in service_check
assert "'2048': Object.freeze({ id: '2048', label: '2048px', size: 2048 })" in service_check
assert "'3072': Object.freeze({ id: '3072', label: '3072px', size: 3072 })" in service_check
assert "if (event.type === 'wheel') return;" in service_check
assert 'const downloadResult = await downloadBlob(outputBlob, profile);' in service_check
assert "const BUILD = '0.1.1-stable-download-ux';" in ui_check
assert 'title="Pop out into free-floating window"' in ui_check
assert '.kwSpinnyGrid select option{background:#29292d;color:#fff;}' in ui_check
assert "devRow.hidden = !(dev && dev.enabled);" in ui_check
assert 'WITCH_DEV_UI/features/media/Spinny' not in manifest_check
assert manifest_check.count('"id": "spinny-mini-webp"') == 1
assert manifest_check.count('"id": "spinny-mini-webp-ui"') == 1
assert 'features/core/Witch_Dock_Developer_Mode.js' not in manifest_check
assert 'Photo_Booth_True_Resolution_UI.js' not in manifest_check

# Spinny must call through the public screenshot provider rather than assigning
# ownership of BT.maker.takeScreenshot itself.
assert 'BT.maker.takeScreenshot =' not in service_check
assert '.maker.takeScreenshot =' not in service_check

subprocess.run(['git', 'diff', '--check'], check=True)

print('Stable Spinny promotion static gate: PASS')

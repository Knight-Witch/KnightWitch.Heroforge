from pathlib import Path
from urllib.request import urlopen
import hashlib

SOURCE_URL='https://raw.githubusercontent.com/Knight-Witch/HeroForge.Compatibility/spinny-v050-materialize/entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js'
EXPECTED='4d450bd18c427e31ea8a38825ed9c8223045a4834a526ec041ca04256d654ce3'
TARGET=Path('features/media/Spinny_Mini_WebP.js')

src=urlopen(SOURCE_URL, timeout=30).read().decode('utf-8')
actual=hashlib.sha256(src.encode()).hexdigest()
if actual != EXPECTED:
    raise SystemExit(f'Validated Spinny source checksum mismatch: {actual}')
start=src.index('(() => {')
body=src[start:]
body=body.replace("const GLOBAL = 'HFSpinnyMiniWebPProfilesTest';", "const GLOBAL = 'KWSpinnyMiniWebP';")
body=body.replace("const PANEL_ID = 'hfc-spinny-mini-webp-profiles-test';", "const PANEL_ID = 'kw-spinny-mini-webp-service-internal';")
body=body.replace("const BUILD = '0.5.0-integrated-pause-interaction-guards';", "const BUILD = '0.5.0-witch-dock-dev-service';")
needle="  const VALIDATED_BASELINE_PIXEL_SAMPLES = 1024 * 1024 * 250;\n"
body=body.replace(needle, needle+"\n  // Witch Dock host owns presentation. The capture service keeps profile state here.\n  let selectedResolutionId = '1024';\n  let selectedSpeedId = 'standard';\n  let statusText = 'Waiting for Photo Booth…';\n  let statusError = false;\n  let progressFraction = 0;\n  let timingText = 'ETA learns from measured frame time on this device and frame-source path.';\n",1)
body=body.replace("    timingHistory,\n    lastCapture: null\n", "    timingHistory,\n    lastCapture: null,\n    statusText,\n    statusError,\n    progressFraction,\n    timingText,\n    lastGuardAttempt: null\n",1)
old="""  function getSelectedProfile() {\n    const resolutionId = resolutionSelect ? resolutionSelect.value : '1024';\n    const speedId = speedSelect ? speedSelect.value : 'standard';\n"""
new="""  function getSelectedProfile() {\n    const resolutionId = selectedResolutionId;\n    const speedId = selectedSpeedId;\n"""
assert old in body
body=body.replace(old,new,1)
old="""  function setStatus(text, isError = false) {\n    if (!statusEl) return;\n    statusEl.textContent = text;\n    statusEl.dataset.error = isError ? '1' : '0';\n  }\n"""
new="""  function setStatus(text, isError = false) {\n    statusText = String(text || '');\n    statusError = !!isError;\n    diagnostics.statusText = statusText;\n    diagnostics.statusError = statusError;\n    if (!statusEl) return;\n    statusEl.textContent = statusText;\n    statusEl.dataset.error = statusError ? '1' : '0';\n  }\n"""
assert old in body
body=body.replace(old,new,1)
old="""  function setProgressBar(fraction) {\n    const clamped = Math.max(0, Math.min(1, Number(fraction) || 0));\n    const percent = clamped * 100;\n    if (progressFillEl) progressFillEl.style.width = `${percent.toFixed(1)}%`;\n    if (progressTrackEl) progressTrackEl.setAttribute('aria-valuenow', String(Math.round(percent)));\n  }\n"""
new="""  function setProgressBar(fraction) {\n    const clamped = Math.max(0, Math.min(1, Number(fraction) || 0));\n    progressFraction = clamped;\n    diagnostics.progressFraction = progressFraction;\n    const percent = clamped * 100;\n    if (progressFillEl) progressFillEl.style.width = `${percent.toFixed(1)}%`;\n    if (progressTrackEl) progressTrackEl.setAttribute('aria-valuenow', String(Math.round(percent)));\n  }\n"""
assert old in body
body=body.replace(old,new,1)
s=body.index('  function renderTimingDisplay() {')
e=body.index('\n  function nextFrame()', s)
body=body[:s]+r'''  function renderTimingDisplay() {
    let text = 'ETA learns from measured frame time on this device and frame-source path.';
    if (busy && activeTiming) {
      const elapsed = activeElapsedMs();
      const pausedMs = totalPausedMs();
      if (paused) {
        if (!Number.isFinite(activeTiming.predictedFrameMs)
          || (activeTiming.completedFrames < ETA_MIN_SAMPLES && activeTiming.estimateSource === 'warming-up')) {
          text = `Paused · ${formatDuration(elapsed)} active · ${formatDuration(pausedMs)} paused · ETA frozen while paused`;
        } else {
          const remaining = Math.max(0, activeTiming.estimatedTotalMs - elapsed);
          text = `Paused · ${formatDuration(elapsed)} active · ${formatDuration(pausedMs)} paused · ~${formatDuration(remaining)} active work left`;
        }
      } else if (!Number.isFinite(activeTiming.predictedFrameMs)
        || (activeTiming.completedFrames < ETA_MIN_SAMPLES && activeTiming.estimateSource === 'warming-up')) {
        text = `Time: ${formatDuration(elapsed)} active · estimating…`;
      } else {
        const remaining = Math.max(0, activeTiming.estimatedTotalMs - elapsed);
        text = `Time: ${formatDuration(elapsed)} active · ~${formatDuration(remaining)} left · ~${formatDuration(activeTiming.estimatedTotalMs)} active total`;
      }
    } else if (lastCapture && Number.isFinite(lastCapture.elapsedMs)) {
      const pauseSuffix = Number(lastCapture.pausedTotalMs) > 0 ? ` · ${formatDuration(lastCapture.pausedTotalMs)} paused` : '';
      text = `Completed in ${formatDuration(lastCapture.elapsedMs)}${pauseSuffix}`;
    }
    timingText = text;
    diagnostics.timingText = timingText;
    if (timingEl) timingEl.textContent = timingText;
  }
'''+body[e:]
old="""  function isInsideOwnedUi(target) {\n    if (!(target instanceof Node)) return false;\n    if (panel && panel.contains(target)) return true;\n    const guard = document.getElementById(GUARD_MODAL_ID);\n    if (guard && guard.contains(target)) return true;\n    return false;\n  }\n"""
new="""  function isInsideOwnedUi(target) {\n    if (!(target instanceof Node)) return false;\n    if (panel && panel.contains(target)) return true;\n    if (target instanceof Element && target.closest('[data-kw-spinny-owned=\"1\"]')) return true;\n    const guard = document.getElementById(GUARD_MODAL_ID);\n    if (guard && guard.contains(target)) return true;\n    return false;\n  }\n"""
assert old in body
body=body.replace(old,new,1)
s=body.index('  function ensurePanel() {')
e=body.index('\n  function refresh() {', s)
body=body[:s]+r'''  function ensurePanel() {
    return null;
  }
'''+body[e:]
s=body.index('  function refresh() {')
e=body.index('\n  function dispose() {', s)
body=body[:s]+r'''  function refresh() {
    const profile = getSelectedProfile();
    const capability = readCapabilities(profile);
    diagnostics.selectedProfile = { ...profile };
    diagnostics.capability = {
      ok: !!capability.ok,
      reason: capability.reason || '',
      maxTextureSize: capability.maxTextureSize ?? null,
      maxRenderbufferSize: capability.maxRenderbufferSize ?? null
    };
    diagnostics.busy = busy;
    diagnostics.activeMode = activeMode;
    diagnostics.paused = paused;
    diagnostics.pauseRequested = pauseRequested;
    diagnostics.pauseBoundaryFrame = pauseBoundaryFrame;
    diagnostics.activeTiming = activeTiming;
    diagnostics.statusText = statusText;
    diagnostics.statusError = statusError;
    diagnostics.progressFraction = progressFraction;
    renderTimingDisplay();
    return diagnostics;
  }

  function setResolution(id) {
    const key = String(id || '');
    if (busy || !RESOLUTIONS[key]) return false;
    selectedResolutionId = key;
    refresh();
    return true;
  }

  function setSpeed(id) {
    const key = String(id || '');
    if (busy || !SPEEDS[key]) return false;
    selectedSpeedId = key;
    refresh();
    return true;
  }

  function setProfile(resolutionId, speedId) {
    if (busy) return false;
    const r = String(resolutionId || '');
    const s = String(speedId || '');
    if (!RESOLUTIONS[r] || !SPEEDS[s]) return false;
    selectedResolutionId = r;
    selectedSpeedId = s;
    refresh();
    return true;
  }
'''+body[e:]
old="""    resolutions: RESOLUTIONS,\n    speeds: SPEEDS,\n    shortTestFrames: SHORT_TEST_FRAMES,\n"""
new="""    resolutions: RESOLUTIONS,\n    speeds: SPEEDS,\n    shortTestFrames: SHORT_TEST_FRAMES,\n    getSelectedProfile,\n    setResolution,\n    setSpeed,\n    setProfile,\n    readCapabilities,\n"""
assert old in body
body=body.replace(old,new,1)
old="""    get lastGuardAttempt() { return lastGuardAttempt ? { ...lastGuardAttempt } : null; },\n    refresh,\n    dispose\n"""
new="""    get lastGuardAttempt() { return lastGuardAttempt ? { ...lastGuardAttempt } : null; },\n    get statusText() { return statusText; },\n    get statusError() { return statusError; },\n    get progressFraction() { return progressFraction; },\n    get timingText() { return timingText; },\n    refresh,\n    dispose\n"""
assert old in body
body=body.replace(old,new,1)
old="""  window[GLOBAL] = api;\n  ensurePanel();\n  installInteractionGuards();\n  refresh();\n  refreshTimer = window.setInterval(refresh, 1000);\n})();\n"""
new="""  window[GLOBAL] = api;\n  ensureStyle();\n  installInteractionGuards();\n  refresh();\n  refreshTimer = window.setInterval(refresh, 500);\n})();\n"""
assert old in body
body=body.replace(old,new,1)
body=body.replace('[HF Spinny Mini WebP Profiles TEST]', '[Witch Dock Spinny Mini WebP]')
header="""// ==UserScript==\n// @name         Witch Dock DEV - Spinny Mini WebP Service\n// @namespace    KnightWitch\n// @version      0.5.0\n// @description  Validated Spinny Mini animated WebP capture service for Witch Dock Dev.\n// @match        https://www.heroforge.com/*\n// @match        https://heroforge.com/*\n// @grant        none\n// @run-at       document-idle\n// ==/UserScript==\n\n/* media.spinny-mini-webp — service-only Witch Dock host adaptation of validated HFC v0.5.0. */\n"""
TARGET.parent.mkdir(parents=True, exist_ok=True)
TARGET.write_text(header+body)
print(TARGET)

// ==UserScript==
// @name         Witch Dock DEV - Spinny Mini WebP Service
// @namespace    KnightWitch
// @version      0.5.0
// @description  Validated Spinny Mini animated WebP capture service for Witch Dock Dev.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

/* media.spinny-mini-webp — service-only Witch Dock host adaptation of validated HFC v0.5.0. */
(() => {
  'use strict';

  const GLOBAL = 'KWSpinnyMiniWebP';
  const PANEL_ID = 'kw-spinny-mini-webp-service-internal';
  const STYLE_ID = `${PANEL_ID}-style`;
  const GUARD_MODAL_ID = `${PANEL_ID}-guard-modal`;
  const GUARD_EVENT_TYPES = Object.freeze(['pointerdown','mousedown','touchstart','wheel','click','change','input','keydown']);
  const VERSION = '0.5.0';
  const BUILD = '0.5.0-witch-dock-dev-service';

  const QUALITY = 0.95;
  const LOOP_COUNT = 0;
  const ETA_MIN_SAMPLES = 5;
  const ETA_EMA_ALPHA = 0.18;
  const SHORT_TEST_FRAMES = 16;
  const TRUE_3K_SIZE = 3072;
  const MIN_NATIVE_TILE_SIZE = 256;
  const MAX_PHASE_GRID = 32;

  const RESOLUTIONS = Object.freeze({
    '1024': Object.freeze({ id: '1024', label: '1024px — HQ parity', size: 1024 }),
    '2048': Object.freeze({ id: '2048', label: '2048px — validated resolution', size: 2048 }),
    '3072': Object.freeze({ id: '3072', label: '3072px — TRUE 3K validated', size: 3072 })
  });
  const SPEEDS = Object.freeze({
    standard: Object.freeze({ id: 'standard', label: 'Standard', durationMs: 10000, frames: 250, frameDurationMs: 40 }),
    slow: Object.freeze({ id: 'slow', label: 'Slow', durationMs: 15000, frames: 375, frameDurationMs: 40 }),
    slower: Object.freeze({ id: 'slower', label: 'Slower', durationMs: 20000, frames: 500, frameDurationMs: 40 }),
    verySlow: Object.freeze({ id: 'verySlow', label: 'Very Slow', durationMs: 30000, frames: 750, frameDurationMs: 40 })
  });
  const VALIDATED_BASELINE_PIXEL_SAMPLES = 1024 * 1024 * 250;

  // Witch Dock host owns presentation. The capture service keeps profile state here.
  let selectedResolutionId = '1024';
  let selectedSpeedId = 'standard';
  let statusText = 'Waiting for Photo Booth…';
  let statusError = false;
  let progressFraction = 0;
  let timingText = 'ETA learns from measured frame time on this device and frame-source path.';

  let busy = false;
  let cancelled = false;
  let activeMode = null;

  // Pause state is intentionally capture-local/session-local. A pause request is
  // honored only after the current frame is fully captured + encoded.
  let pauseRequested = false;
  let paused = false;
  let pauseResolve = null;
  let pauseBoundaryFrame = null;

  let panel = null;
  let statusEl = null;
  let capabilityEl = null;
  let metaEl = null;
  let progressTrackEl = null;
  let progressFillEl = null;
  let timingEl = null;
  let warningEl = null;
  let button = null;
  let shortButton = null;
  let pauseButton = null;
  let cancelButton = null;
  let resolutionSelect = null;
  let speedSelect = null;
  let refreshTimer = null;
  let guardModal = null;
  let guardInstalled = false;
  let guardAttempts = 0;
  let lastGuardAttempt = null;
  let lastCapture = null;
  let activeTiming = null;

  // Intentionally session-only: do not persist timing across reloads or figures.
  const timingHistory = {};

  const diagnostics = {
    version: VERSION,
    build: BUILD,
    busy: false,
    activeMode: null,
    paused: false,
    pauseRequested: false,
    pauseBoundaryFrame: null,
    selectedProfile: null,
    activeTiming: null,
    timingHistory,
    lastCapture: null,
    statusText,
    statusError,
    progressFraction,
    timingText,
    lastGuardAttempt: null
  };

  function getCK() { return window.CK || null; }
  function getBT() { return window.BT || null; }

  function getSelectedProfile() {
    const resolutionId = selectedResolutionId;
    const speedId = selectedSpeedId;
    const resolution = RESOLUTIONS[resolutionId] || RESOLUTIONS['1024'];
    const speed = SPEEDS[speedId] || SPEEDS.standard;
    const profile = {
      resolutionId: resolution.id,
      resolutionLabel: resolution.label,
      speedId: speed.id,
      speedLabel: speed.label,
      size: resolution.size,
      frames: speed.frames,
      frameDurationMs: speed.frameDurationMs,
      durationMs: speed.durationMs,
      fps: 1000 / speed.frameDurationMs,
      quality: QUALITY,
      loopCount: LOOP_COUNT
    };
    profile.pixelSamples = profile.size * profile.size * profile.frames;
    profile.workloadMultiplier = profile.pixelSamples / VALIDATED_BASELINE_PIXEL_SAMPLES;
    profile.frameSource = profile.size === TRUE_3K_SIZE ? 'true3k-phase-feed' : 'native';
    profile.timingKey = `${profile.size}:${profile.frameSource}`;
    return profile;
  }

  function createRunProfile(selectedProfile, shortTest) {
    if (!shortTest) return { ...selectedProfile, mode: 'full', fullFrames: selectedProfile.frames, arcDegrees: 360 };
    const frames = Math.min(SHORT_TEST_FRAMES, selectedProfile.frames);
    return {
      ...selectedProfile,
      mode: 'short-test',
      fullFrames: selectedProfile.frames,
      frames,
      durationMs: frames * selectedProfile.frameDurationMs,
      pixelSamples: selectedProfile.size * selectedProfile.size * frames,
      arcDegrees: (Math.max(0, frames - 1) * 360) / selectedProfile.frames
    };
  }

  function isLongCaptureProfile(profile) {
    return profile.size >= 2048 || profile.frames >= 500;
  }

  function rendererInfo(CK) {
    const renderer = (CK && CK.renderManager && CK.renderManager.renderer)
      || (CK && CK.Capture && CK.Capture.renderer)
      || null;
    const maxTextureSize = renderer && renderer.capabilities
      ? Number(renderer.capabilities.maxTextureSize) || null
      : null;
    let maxRenderbufferSize = null;
    try {
      const gl = renderer && typeof renderer.getContext === 'function' ? renderer.getContext() : null;
      if (gl) maxRenderbufferSize = Number(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)) || null;
    } catch (_) {}
    return { maxTextureSize, maxRenderbufferSize };
  }

  function readCapabilities(profile = getSelectedProfile()) {
    const CK = getCK();
    const BT = getBT();
    if (!CK) return { ok: false, reason: 'CK unavailable', CK, BT };
    if (!BT || !BT.maker || BT.maker.enabled !== true) {
      return { ok: false, reason: 'Open Photo Booth first', CK, BT };
    }
    if (typeof BT.maker.takeScreenshot !== 'function') {
      return { ok: false, reason: 'BT.maker.takeScreenshot unavailable', CK, BT };
    }
    const display = CK.character && CK.character.display;
    if (!display || !display.rotation || !Number.isFinite(Number(display.rotation.y))) {
      return { ok: false, reason: 'Character display rotation unavailable', CK, BT };
    }
    if (typeof HTMLCanvasElement === 'undefined' || typeof HTMLCanvasElement.prototype.toBlob !== 'function') {
      return { ok: false, reason: 'Canvas WebP encoder unavailable', CK, BT };
    }
    if (profile && profile.size === TRUE_3K_SIZE) {
      if (!CK.Effects || typeof CK.Effects.renderToCanvas !== 'function') {
        return { ok: false, reason: 'TRUE 3K requires CK.Effects.renderToCanvas', CK, BT, display };
      }
      const info = rendererInfo(CK);
      if (info.maxTextureSize !== null && info.maxTextureSize < TRUE_3K_SIZE) {
        return { ok: false, reason: `GPU texture limit ${info.maxTextureSize}px is below ${TRUE_3K_SIZE}px`, CK, BT, display, ...info };
      }
      if (info.maxRenderbufferSize !== null && info.maxRenderbufferSize < TRUE_3K_SIZE) {
        return { ok: false, reason: `GPU renderbuffer limit ${info.maxRenderbufferSize}px is below ${TRUE_3K_SIZE}px`, CK, BT, display, ...info };
      }
      return { ok: true, reason: 'Ready — TRUE 3K repair available', CK, BT, display, ...info };
    }
    return { ok: true, reason: 'Ready', CK, BT, display };
  }

  function setStatus(text, isError = false) {
    statusText = String(text || '');
    statusError = !!isError;
    diagnostics.statusText = statusText;
    diagnostics.statusError = statusError;
    if (!statusEl) return;
    statusEl.textContent = statusText;
    statusEl.dataset.error = statusError ? '1' : '0';
  }

  function setProgressBar(fraction) {
    const clamped = Math.max(0, Math.min(1, Number(fraction) || 0));
    progressFraction = clamped;
    diagnostics.progressFraction = progressFraction;
    const percent = clamped * 100;
    if (progressFillEl) progressFillEl.style.width = `${percent.toFixed(1)}%`;
    if (progressTrackEl) progressTrackEl.setAttribute('aria-valuenow', String(Math.round(percent)));
  }

  function setProgress(frameIndex, frameCount, phase = 'render', phaseFraction = 0) {
    const done = Math.max(0, Math.min(frameCount, Number(frameIndex) || 0));
    const progressUnits = Math.max(0, Math.min(frameCount, done + phaseFraction));
    const percent = Math.round((progressUnits / frameCount) * 100);
    const label = phase === 'encode' ? 'Encoding' : phase === 'mux' ? 'Assembling' : 'Rendering';
    const prefix = activeMode === 'short-test' ? 'Short Test · ' : '';
    setStatus(`${prefix}${label}: ${Math.floor(done)}/${frameCount} (${percent}%)`);
    setProgressBar(progressUnits / frameCount);
  }

  function formatDuration(ms) {
    if (!Number.isFinite(ms) || ms < 0) return '—';
    const totalSeconds = Math.max(0, Math.round(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    if (minutes > 0) return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
    return `${seconds}s`;
  }

  function createTimingState(profile) {
    const history = timingHistory[profile.timingKey] || null;
    const initialFrameMs = history && Number.isFinite(history.frameMs) ? history.frameMs : null;
    const tailEstimateMs = history && Number.isFinite(history.tailMs) ? history.tailMs : 0;
    return {
      timingKey: profile.timingKey,
      startedPerfMs: performance.now(),
      frameLoopCompletedPerfMs: null,
      completedFrames: 0,
      sampleTotalMs: 0,
      sampleAverageFrameMs: null,
      emaFrameMs: initialFrameMs,
      predictedFrameMs: initialFrameMs,
      tailEstimateMs,
      estimatedTotalMs: initialFrameMs === null ? null : initialFrameMs * profile.frames + tailEstimateMs,
      estimateSource: initialFrameMs === null ? 'warming-up' : 'same-session-frame-source-history',
      lastSampleMs: null,
      pausedTotalMs: 0,
      pauseStartedPerfMs: null,
      pauseCount: 0
    };
  }

  function currentPauseMs() {
    if (!activeTiming || !Number.isFinite(activeTiming.pauseStartedPerfMs)) return 0;
    return Math.max(0, performance.now() - activeTiming.pauseStartedPerfMs);
  }

  function activeElapsedMs() {
    if (!activeTiming) return null;
    return Math.max(
      0,
      performance.now()
        - activeTiming.startedPerfMs
        - activeTiming.pausedTotalMs
        - currentPauseMs()
    );
  }

  function totalPausedMs() {
    if (!activeTiming) return 0;
    return Math.max(0, activeTiming.pausedTotalMs + currentPauseMs());
  }

  function updateTimingAfterFrame(profile, sampleMs) {
    if (!activeTiming || !Number.isFinite(sampleMs) || sampleMs < 0) return;
    activeTiming.completedFrames += 1;
    activeTiming.sampleTotalMs += sampleMs;
    activeTiming.lastSampleMs = sampleMs;
    activeTiming.sampleAverageFrameMs = activeTiming.sampleTotalMs / activeTiming.completedFrames;
    if (!Number.isFinite(activeTiming.emaFrameMs)) activeTiming.emaFrameMs = sampleMs;
    else activeTiming.emaFrameMs = activeTiming.emaFrameMs * (1 - ETA_EMA_ALPHA) + sampleMs * ETA_EMA_ALPHA;
    if (activeTiming.completedFrames >= ETA_MIN_SAMPLES) {
      activeTiming.predictedFrameMs = activeTiming.emaFrameMs * 0.7 + activeTiming.sampleAverageFrameMs * 0.3;
      activeTiming.estimateSource = 'live-current-capture';
    }
    if (Number.isFinite(activeTiming.predictedFrameMs)) {
      activeTiming.estimatedTotalMs = activeTiming.predictedFrameMs * profile.frames + activeTiming.tailEstimateMs;
    }
  }

  function renderTimingDisplay() {
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

  function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }

  async function waitForOcclusion(display, maxFrames = 180) {
    const occlusion = display && display.sunOcclusion;
    if (!occlusion || typeof occlusion !== 'object' || !('isDone' in occlusion)) {
      await nextFrame();
      return;
    }
    for (let i = 0; i < maxFrames; i += 1) {
      const state = occlusion.isDone;
      if (state === undefined || state === null) {
        await nextFrame();
        return;
      }
      if (state) return;
      await nextFrame();
    }
    throw new Error('Timed out waiting for HeroForge occlusion refresh.');
  }

  function refreshScene(CK) {
    const displays = CK && CK.allDisplays;
    if (displays && typeof displays === 'object') {
      for (const display of Object.values(displays)) {
        if (!display) continue;
        try { if (typeof display.requestAnimationRefresh === 'function') display.requestAnimationRefresh(); } catch (_) {}
        try { if (typeof display.animation === 'function') display.animation(); } catch (_) {}
        try { if (display.sunOcclusion && typeof display.sunOcclusion.refresh === 'function') display.sunOcclusion.refresh(); } catch (_) {}
        try { if (display.sunOcclusion && typeof display.sunOcclusion.render === 'function') display.sunOcclusion.render(); } catch (_) {}
      }
    }
    try { if (CK.renderManager && typeof CK.renderManager.requestShadowUpdate === 'function') CK.renderManager.requestShadowUpdate(); } catch (_) {}
    try { if (CK.scene && typeof CK.scene.updateMatrixWorld === 'function') CK.scene.updateMatrixWorld(true); } catch (_) {}
    try { if (CK.GameLoop && typeof CK.GameLoop.requestRenderRefresh === 'function') CK.GameLoop.requestRenderRefresh(); } catch (_) {}
  }

  function installTemporaryMethod(object, key, replacement) {
    const hadOwn = Object.prototype.hasOwnProperty.call(object, key);
    const descriptor = hadOwn ? Object.getOwnPropertyDescriptor(object, key) : null;
    const original = object[key];
    if (typeof original !== 'function') throw new Error(`${key} is not callable.`);
    if (descriptor && descriptor.configurable) Object.defineProperty(object, key, { ...descriptor, value: replacement });
    else object[key] = replacement;
    if (object[key] !== replacement) throw new Error(`Could not temporarily wrap ${key}.`);
    return {
      original,
      restore() {
        try {
          if (hadOwn && descriptor) Object.defineProperty(object, key, descriptor);
          else delete object[key];
        } catch (_) {
          try { object[key] = original; } catch (_) {}
        }
      }
    };
  }

  function classifyModelRender(width, height, camera) {
    const w = Number(width);
    const h = Number(height);
    if (!Number.isFinite(w) || w <= 0 || w !== h) return null;
    if (!camera || Number(camera.width) !== TRUE_3K_SIZE || Number(camera.height) !== TRUE_3K_SIZE || !camera.view) return null;
    for (const value of [camera.view.offsetX, camera.view.offsetY, camera.view.width, camera.view.height]) {
      if (!Number.isFinite(Number(value))) return null;
    }
    if (w === TRUE_3K_SIZE) return { mode: 'native-true-resolution', tileSize: w, grid: 1, expectedPhases: 1 };
    if (w < MIN_NATIVE_TILE_SIZE || TRUE_3K_SIZE % w !== 0) return null;
    const grid = TRUE_3K_SIZE / w;
    if (!Number.isInteger(grid) || grid < 2 || grid > MAX_PHASE_GRID) return null;
    return { mode: 'tiled-repair', tileSize: w, grid, expectedPhases: grid * grid };
  }

  function phaseCoordinateFromOffset(actual, base, step, grid, axis) {
    const raw = (actual - base) / step;
    const phase = Math.round(raw);
    const expected = base + phase * step;
    const tolerance = Math.max(1e-7, Math.abs(step) * 0.05);
    if (!Number.isFinite(actual) || !Number.isFinite(base) || !Number.isFinite(step) || step === 0
      || phase < 0 || phase >= grid || Math.abs(actual - expected) > tolerance) {
      throw new Error(`Native Booth ${axis}-phase topology changed.`);
    }
    return phase;
  }

  function withCameraOffsets(camera, offsetX, offsetY, callback) {
    const view = camera && camera.view;
    if (!view) throw new Error('Capture camera view unavailable.');
    const oldX = Number(view.offsetX);
    const oldY = Number(view.offsetY);
    view.offsetX = offsetX;
    view.offsetY = offsetY;
    try {
      if (typeof camera.updateProjectionMatrix === 'function') camera.updateProjectionMatrix();
      return callback();
    } finally {
      view.offsetX = oldX;
      view.offsetY = oldY;
      if (typeof camera.updateProjectionMatrix === 'function') camera.updateProjectionMatrix();
    }
  }

  function makePhaseCanvas(source32, tileSize, sourceStride, localX, localY) {
    const canvas = document.createElement('canvas');
    canvas.width = tileSize;
    canvas.height = tileSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create phase canvas context.');
    const imageData = ctx.createImageData(tileSize, tileSize);
    const output32 = new Uint32Array(imageData.data.buffer);
    let dest = 0;
    for (let y = 0; y < tileSize; y += 1) {
      let source = ((sourceStride * y + localY) * TRUE_3K_SIZE) + localX;
      for (let x = 0; x < tileSize; x += 1, dest += 1, source += sourceStride) output32[dest] = source32[source];
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  function makeTrue3KFrameWrapper(CK, currentRenderToCanvas, frameDiag) {
    let creatingSource = false;
    let state = null;

    function startFrame(topology, camera) {
      const sourceStride = TRUE_3K_SIZE / topology.tileSize;
      if (!Number.isInteger(sourceStride) || sourceStride < 1 || topology.grid !== sourceStride) {
        throw new Error(`Unsupported 3K topology: tile ${topology.tileSize}px, grid ${topology.grid}, stride ${sourceStride}.`);
      }
      state = {
        tileSize: topology.tileSize,
        grid: topology.grid,
        expectedPhases: topology.expectedPhases,
        suppliedPhases: 0,
        sourceStride,
        baseOffsetX: Number(camera.view.offsetX),
        baseOffsetY: Number(camera.view.offsetY),
        stepX: Number(camera.view.width) / TRUE_3K_SIZE,
        stepY: Number(camera.view.height) / TRUE_3K_SIZE,
        seen: new Set(),
        sourcePixels: null,
        sourceRenders: 0,
        nativeTrueResolution: false
      };
      if (!Number.isFinite(state.stepX) || !Number.isFinite(state.stepY) || state.stepX === 0 || state.stepY === 0) {
        throw new Error('Unsupported native Booth phase geometry.');
      }
    }

    const wrapper = function(width, height, camera) {
      if (creatingSource) return currentRenderToCanvas.apply(this, arguments);
      const topology = classifyModelRender(width, height, camera);
      if (!topology) return currentRenderToCanvas.apply(this, arguments);

      if (topology.mode === 'native-true-resolution') {
        if (state) throw new Error('Native Booth switched 3K render topology mid-frame.');
        state = {
          tileSize: TRUE_3K_SIZE,
          grid: 1,
          expectedPhases: 1,
          suppliedPhases: 1,
          seen: new Set(['0,0']),
          sourcePixels: null,
          sourceRenders: 0,
          nativeTrueResolution: true
        };
        return currentRenderToCanvas.apply(this, arguments);
      }

      if (!state) startFrame(topology, camera);
      else if (state.tileSize !== topology.tileSize || state.grid !== topology.grid) {
        throw new Error('Native Booth 3K tile topology changed mid-frame.');
      }

      const phaseX = phaseCoordinateFromOffset(Number(camera.view.offsetX), state.baseOffsetX, state.stepX, state.grid, 'X');
      const phaseY = phaseCoordinateFromOffset(Number(camera.view.offsetY), state.baseOffsetY, state.stepY, state.grid, 'Y');
      const key = `${phaseX},${phaseY}`;
      if (state.seen.has(key)) throw new Error(`Native Booth requested duplicate model phase ${key}.`);
      state.seen.add(key);

      if (!state.sourcePixels) {
        creatingSource = true;
        let sourceCanvas;
        try {
          sourceCanvas = withCameraOffsets(camera, state.baseOffsetX, state.baseOffsetY, () => (
            currentRenderToCanvas.call(this, TRUE_3K_SIZE, TRUE_3K_SIZE, camera, 1)
          ));
        } finally {
          creatingSource = false;
        }
        if (!sourceCanvas || Number(sourceCanvas.width) !== TRUE_3K_SIZE || Number(sourceCanvas.height) !== TRUE_3K_SIZE) {
          throw new Error(`TRUE 3K Effects source was not ${TRUE_3K_SIZE}x${TRUE_3K_SIZE}.`);
        }
        const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
        if (!sourceCtx) throw new Error('TRUE 3K Effects source context unavailable.');
        const imageData = sourceCtx.getImageData(0, 0, TRUE_3K_SIZE, TRUE_3K_SIZE);
        state.sourcePixels = new Uint32Array(imageData.data.buffer);
        state.sourceRenders += 1;
        sourceCanvas.width = 1;
        sourceCanvas.height = 1;
        sourceCanvas = null;
      }

      const phaseCanvas = makePhaseCanvas(state.sourcePixels, state.tileSize, state.sourceStride, phaseX, phaseY);
      state.suppliedPhases += 1;
      return phaseCanvas;
    };

    wrapper.finish = () => {
      if (!state) throw new Error('TRUE 3K frame produced no matching Effects render calls.');
      if (!state.nativeTrueResolution) {
        if (state.suppliedPhases !== state.expectedPhases || state.seen.size !== state.expectedPhases) {
          throw new Error(`Incomplete 3K phase feed ${state.suppliedPhases}/${state.expectedPhases}.`);
        }
        if (state.sourceRenders !== 1) throw new Error(`TRUE 3K frame used ${state.sourceRenders} source renders; expected 1.`);
      }
      frameDiag.tileSize = state.tileSize;
      frameDiag.grid = state.grid;
      frameDiag.expectedPhases = state.expectedPhases;
      frameDiag.suppliedPhases = state.suppliedPhases;
      frameDiag.uniquePhases = state.seen.size;
      frameDiag.sourceRenders = state.sourceRenders;
      frameDiag.sourceSize = TRUE_3K_SIZE;
      frameDiag.nativeTrueResolution = !!state.nativeTrueResolution;
      state.sourcePixels = null;
    };

    return wrapper;
  }

  function captureFrameCanvas(CK, BT, size, frameIndex) {
    if (size !== TRUE_3K_SIZE) {
      const canvas = BT.maker.takeScreenshot(size, size);
      return { canvas, frameSource: 'native', diagnostics: null };
    }

    const currentRenderToCanvas = CK.Effects.renderToCanvas;
    const frameDiag = {
      index: frameIndex,
      frameSource: 'true3k-phase-feed',
      tileSize: null,
      grid: null,
      expectedPhases: null,
      suppliedPhases: null,
      uniquePhases: null,
      sourceRenders: null,
      sourceSize: TRUE_3K_SIZE,
      nativeTrueResolution: false,
      effectsRestored: false
    };
    let guard = null;
    try {
      const wrapper = makeTrue3KFrameWrapper(CK, currentRenderToCanvas, frameDiag);
      guard = installTemporaryMethod(CK.Effects, 'renderToCanvas', wrapper);
      const canvas = BT.maker.takeScreenshot(size, size);
      wrapper.finish();
      return { canvas, frameSource: 'true3k-phase-feed', diagnostics: frameDiag };
    } finally {
      if (guard) {
        try { guard.restore(); } catch (_) {}
      }
      frameDiag.effectsRestored = CK.Effects.renderToCanvas === currentRenderToCanvas;
      if (!frameDiag.effectsRestored) throw new Error('TRUE 3K Effects method did not restore after frame capture.');
    }
  }

  function canvasToWebP(canvas, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Canvas WebP encoding returned no Blob.'));
        if (blob.type && blob.type !== 'image/webp') return reject(new Error(`Browser returned ${blob.type} instead of image/webp.`));
        resolve(blob);
      }, 'image/webp', quality);
    });
  }

  function ascii4(text) {
    return new Uint8Array([text.charCodeAt(0), text.charCodeAt(1), text.charCodeAt(2), text.charCodeAt(3)]);
  }
  function writeU16LE(target, offset, value) { target[offset] = value & 0xff; target[offset + 1] = (value >>> 8) & 0xff; }
  function writeU24LE(target, offset, value) { target[offset] = value & 0xff; target[offset + 1] = (value >>> 8) & 0xff; target[offset + 2] = (value >>> 16) & 0xff; }
  function writeU32LE(target, offset, value) { target[offset] = value & 0xff; target[offset + 1] = (value >>> 8) & 0xff; target[offset + 2] = (value >>> 16) & 0xff; target[offset + 3] = (value >>> 24) & 0xff; }
  function readU16LE(source, offset) { return source[offset] | (source[offset + 1] << 8); }
  function readU24LE(source, offset) { return source[offset] | (source[offset + 1] << 8) | (source[offset + 2] << 16); }
  function readU32LE(source, offset) { return (source[offset] | (source[offset + 1] << 8) | (source[offset + 2] << 16) | (source[offset + 3] << 24)) >>> 0; }
  function readFourCC(source, offset) { return String.fromCharCode(source[offset], source[offset + 1], source[offset + 2], source[offset + 3]); }
  function makeChunk(fourCC, payload) {
    const pad = payload.length & 1;
    const out = new Uint8Array(8 + payload.length + pad);
    out.set(ascii4(fourCC), 0);
    writeU32LE(out, 4, payload.length);
    out.set(payload, 8);
    return out;
  }
  function concatBytes(parts) {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    for (const part of parts) { out.set(part, offset); offset += part.length; }
    return out;
  }
  function losslessChunkHasAlpha(chunkData) {
    if (chunkData.length < 5 || chunkData[0] !== 0x2f) return false;
    const bits = (chunkData[1] | (chunkData[2] << 8) | (chunkData[3] << 16) | (chunkData[4] << 24)) >>> 0;
    return ((bits >>> 28) & 1) === 1;
  }

  async function extractStillWebPFrame(blob) {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    if (bytes.length < 20 || readFourCC(bytes, 0) !== 'RIFF' || readFourCC(bytes, 8) !== 'WEBP') {
      throw new Error('Browser WebP encoder returned an invalid RIFF/WebP frame.');
    }
    const imageChunks = [];
    let hasAlpha = false;
    let imageChunkCount = 0;
    let offset = 12;
    while (offset + 8 <= bytes.length) {
      const fourCC = readFourCC(bytes, offset);
      const size = readU32LE(bytes, offset + 4);
      const dataOffset = offset + 8;
      const end = dataOffset + size;
      if (end > bytes.length) throw new Error(`Malformed static WebP ${fourCC} chunk.`);
      if (fourCC === 'VP8X' && size >= 1) hasAlpha = hasAlpha || ((bytes[dataOffset] & 0x10) !== 0);
      else if (fourCC === 'ALPH') { hasAlpha = true; imageChunks.push(bytes.slice(offset, end + (size & 1))); }
      else if (fourCC === 'VP8 ' || fourCC === 'VP8L') {
        if (fourCC === 'VP8L') hasAlpha = hasAlpha || losslessChunkHasAlpha(bytes.subarray(dataOffset, end));
        imageChunkCount += 1;
        imageChunks.push(bytes.slice(offset, end + (size & 1)));
      }
      offset = end + (size & 1);
    }
    if (imageChunkCount !== 1) throw new Error(`Expected one WebP image payload chunk; found ${imageChunkCount}.`);
    return { chunks: imageChunks, hasAlpha, encodedBytes: blob.size };
  }

  function makeVP8X(width, height, hasAlpha) {
    const payload = new Uint8Array(10);
    payload[0] = 0x02 | (hasAlpha ? 0x10 : 0x00);
    writeU24LE(payload, 4, width - 1);
    writeU24LE(payload, 7, height - 1);
    return makeChunk('VP8X', payload);
  }
  function makeANIM(loopCount) {
    const payload = new Uint8Array(6);
    writeU32LE(payload, 0, 0xffffffff);
    writeU16LE(payload, 4, loopCount);
    return makeChunk('ANIM', payload);
  }
  function makeANMF(width, height, durationMs, frameChunks) {
    const header = new Uint8Array(16);
    writeU24LE(header, 0, 0); writeU24LE(header, 3, 0);
    writeU24LE(header, 6, width - 1); writeU24LE(header, 9, height - 1);
    writeU24LE(header, 12, durationMs); header[15] = 0x02;
    return makeChunk('ANMF', concatBytes([header, ...frameChunks]));
  }
  function makeAnimatedWebP(width, height, durationMs, loopCount, frames) {
    const hasAlpha = frames.some((frame) => frame.hasAlpha);
    const chunks = [makeVP8X(width, height, hasAlpha), makeANIM(loopCount)];
    for (const frame of frames) chunks.push(makeANMF(width, height, durationMs, frame.chunks));
    const body = concatBytes([ascii4('WEBP'), ...chunks]);
    const out = new Uint8Array(8 + body.length);
    out.set(ascii4('RIFF'), 0); writeU32LE(out, 4, body.length); out.set(body, 8);
    return new Blob([out], { type: 'image/webp' });
  }

  function parseAnimatedWebPMetrics(bytes) {
    const result = { width: null, height: null, loopCount: null, frameCount: 0, totalDurationMs: 0, durations: {} };
    let offset = 12;
    while (offset + 8 <= bytes.length) {
      const fourCC = readFourCC(bytes, offset);
      const size = readU32LE(bytes, offset + 4);
      const dataOffset = offset + 8;
      const end = dataOffset + size;
      if (end > bytes.length) break;
      if (fourCC === 'VP8X' && size >= 10) {
        result.width = 1 + readU24LE(bytes, dataOffset + 4);
        result.height = 1 + readU24LE(bytes, dataOffset + 7);
      } else if (fourCC === 'ANIM' && size >= 6) result.loopCount = readU16LE(bytes, dataOffset + 4);
      else if (fourCC === 'ANMF' && size >= 16) {
        const duration = readU24LE(bytes, dataOffset + 12);
        result.frameCount += 1;
        result.totalDurationMs += duration;
        result.durations[duration] = (result.durations[duration] || 0) + 1;
      }
      offset = end + (size & 1);
    }
    return result;
  }

  function validateAnimatedWebPMetrics(parsed, profile) {
    if (parsed.width !== profile.size || parsed.height !== profile.size) throw new Error(`Mux verification dimensions failed: ${parsed.width}x${parsed.height}.`);
    if (parsed.frameCount !== profile.frames) throw new Error(`Mux verification frame count failed: ${parsed.frameCount}/${profile.frames}.`);
    if (parsed.totalDurationMs !== profile.durationMs) throw new Error(`Mux verification duration failed: ${parsed.totalDurationMs} ms / ${profile.durationMs} ms.`);
    if (parsed.loopCount !== profile.loopCount) throw new Error(`Mux verification loop count failed: ${parsed.loopCount}/${profile.loopCount}.`);
    const durationKeys = Object.keys(parsed.durations);
    if (durationKeys.length !== 1 || Number(durationKeys[0]) !== profile.frameDurationMs || parsed.durations[durationKeys[0]] !== profile.frames) {
      throw new Error(`Mux verification frame timing failed: ${JSON.stringify(parsed.durations)}.`);
    }
  }

  function downloadBlob(blob, profile) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const name = (getCK() && getCK().data && getCK().data.meta && getCK().data.meta.character_name) || 'Hero';
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const shortTag = profile.mode === 'short-test' ? '_SHORT_TEST' : '';
    anchor.href = url;
    anchor.download = `${name}_Spinny${shortTag}_${profile.size}px_${profile.speedId}_${profile.frames}f_${stamp}.webp`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  function requestPause() {
    if (!busy || cancelled || paused || pauseRequested) return false;
    pauseRequested = true;
    diagnostics.pauseRequested = true;
    setStatus('Pause requested — finishing current frame…');
    refresh();
    return true;
  }

  function finishPauseAccounting() {
    if (!activeTiming || !Number.isFinite(activeTiming.pauseStartedPerfMs)) return 0;
    const duration = Math.max(0, performance.now() - activeTiming.pauseStartedPerfMs);
    activeTiming.pausedTotalMs += duration;
    activeTiming.pauseStartedPerfMs = null;
    if (lastCapture) lastCapture.pausedTotalMs = activeTiming.pausedTotalMs;
    return duration;
  }

  function resumeCapture() {
    if (!busy || !paused) return false;
    const duration = finishPauseAccounting();
    paused = false;
    pauseBoundaryFrame = null;
    diagnostics.paused = false;
    diagnostics.pauseBoundaryFrame = null;
    if (lastCapture) {
      lastCapture.paused = false;
      lastCapture.lastResumeAt = new Date().toISOString();
      lastCapture.lastPauseDurationMs = duration;
    }
    const resolve = pauseResolve;
    pauseResolve = null;
    if (resolve) resolve();
    refresh();
    return true;
  }

  function togglePause() {
    if (paused) return resumeCapture();
    return requestPause();
  }

  function releasePauseForCancellation() {
    pauseRequested = false;
    diagnostics.pauseRequested = false;
    if (!paused) return;
    finishPauseAccounting();
    paused = false;
    pauseBoundaryFrame = null;
    diagnostics.paused = false;
    diagnostics.pauseBoundaryFrame = null;
    if (lastCapture) {
      lastCapture.paused = false;
      lastCapture.lastResumeAt = new Date().toISOString();
    }
    const resolve = pauseResolve;
    pauseResolve = null;
    if (resolve) resolve();
  }

  async function pauseAtSafeBoundary(completedFrame, frameCount) {
    if (!pauseRequested || cancelled || completedFrame >= frameCount) {
      if (completedFrame >= frameCount && pauseRequested) {
        pauseRequested = false;
        diagnostics.pauseRequested = false;
      }
      return;
    }

    pauseRequested = false;
    paused = true;
    pauseBoundaryFrame = completedFrame;
    diagnostics.pauseRequested = false;
    diagnostics.paused = true;
    diagnostics.pauseBoundaryFrame = completedFrame;

    if (activeTiming) {
      activeTiming.pauseCount += 1;
      activeTiming.pauseStartedPerfMs = performance.now();
    }
    if (lastCapture) {
      lastCapture.paused = true;
      lastCapture.pauseCount = activeTiming ? activeTiming.pauseCount : (lastCapture.pauseCount + 1);
      lastCapture.lastPauseAt = new Date().toISOString();
      lastCapture.pauseBoundaryFrame = completedFrame;
    }

    const prefix = activeMode === 'short-test' ? 'Short Test · ' : '';
    setStatus(`${prefix}Paused after frame ${completedFrame}/${frameCount}.`);
    refresh();

    await new Promise((resolve) => { pauseResolve = resolve; });
  }

  async function captureProfile(shortTest = false) {
    if (busy) return false;
    const selectedProfile = getSelectedProfile();
    const capability = readCapabilities(selectedProfile);
    if (!capability.ok) {
      setStatus(capability.reason, true);
      refresh();
      return false;
    }

    const profile = createRunProfile(selectedProfile, shortTest);
    const { CK, BT, display } = capability;
    const baseRotation = Number(display.rotation.y);
    const encodedFrames = [];
    let encodedBytes = 0;
    let outputBlob = null;

    busy = true;
    cancelled = false;
    activeMode = profile.mode;
    pauseRequested = false;
    paused = false;
    pauseResolve = null;
    pauseBoundaryFrame = null;

    diagnostics.busy = true;
    diagnostics.activeMode = activeMode;
    diagnostics.paused = false;
    diagnostics.pauseRequested = false;
    diagnostics.pauseBoundaryFrame = null;
    diagnostics.selectedProfile = { ...selectedProfile };
    activeTiming = createTimingState(profile);
    diagnostics.activeTiming = activeTiming;
    setProgress(0, profile.frames, 'render', 0);
    refresh();

    lastCapture = {
      version: VERSION,
      build: BUILD,
      mode: profile.mode,
      status: 'running',
      startedAt: new Date().toISOString(),
      completedAt: null,
      requested: { ...profile },
      baseRotation,
      frameSource: profile.frameSource,
      frameSourceDiagnostics: [],
      framesRendered: 0,
      framesEncoded: 0,
      encodedFrameBytes: 0,
      outputBytes: null,
      parsed: null,
      elapsedMs: null,
      activeElapsedMs: null,
      timing: null,
      paused: false,
      pauseCount: 0,
      pausedTotalMs: 0,
      pauseBoundaryFrame: null,
      lastPauseAt: null,
      lastResumeAt: null,
      lastPauseDurationMs: null,
      cancellationCause: null,
      guardedAction: null,
      rotationRestored: false,
      error: null
    };
    diagnostics.lastCapture = lastCapture;

    try {
      for (let index = 0; index < profile.frames; index += 1) {
        if (cancelled) throw new Error('Capture cancelled.');

        // Re-check the safe boundary immediately before each new angular sample.
        // This catches a Pause click that arrived during an inter-frame RAF/yield
        // after the previous frame had already completed.
        await pauseAtSafeBoundary(index, profile.frames);
        if (cancelled) throw new Error('Capture cancelled.');

        // A new angular sample is not started until any previous boundary pause has
        // resolved, so pause can never leave a partial TRUE-3K phase feed active.
        const frameStartedPerfMs = performance.now();
        const angularDenominator = profile.mode === 'short-test' ? profile.fullFrames : profile.frames;
        display.rotation.y = baseRotation + (2 * Math.PI * index / angularDenominator);
        refreshScene(CK);
        await waitForOcclusion(display);
        await nextFrame();

        setProgress(index, profile.frames, 'render', 0.15);
        const captured = captureFrameCanvas(CK, BT, profile.size, index);
        const canvas = captured.canvas;
        if (!canvas || typeof canvas.toBlob !== 'function') throw new Error('Frame source did not return an encodable canvas.');
        if (canvas.width !== profile.size || canvas.height !== profile.size) {
          throw new Error(`HeroForge returned ${canvas.width}x${canvas.height}; expected ${profile.size}x${profile.size}.`);
        }
        if (captured.diagnostics) lastCapture.frameSourceDiagnostics.push(captured.diagnostics);
        lastCapture.framesRendered = index + 1;

        setProgress(index, profile.frames, 'encode', 0.65);
        const stillBlob = await canvasToWebP(canvas, profile.quality);
        const frame = await extractStillWebPFrame(stillBlob);
        encodedBytes += frame.encodedBytes;
        encodedFrames.push(frame);
        lastCapture.framesEncoded = index + 1;
        lastCapture.encodedFrameBytes = encodedBytes;
        canvas.width = 1;
        canvas.height = 1;

        updateTimingAfterFrame(profile, performance.now() - frameStartedPerfMs);
        setProgress(index + 1, profile.frames, 'render', 0);
        renderTimingDisplay();

        // Safe boundary: the frame is fully encoded and any temporary TRUE-3K
        // Effects wrapper has already been restored by captureFrameCanvas().
        await pauseAtSafeBoundary(index + 1, profile.frames);
        if (cancelled) throw new Error('Capture cancelled.');

        if ((index + 1) % 5 === 0) await nextFrame();
      }

      activeTiming.frameLoopCompletedPerfMs = performance.now();
      if (cancelled) throw new Error('Capture cancelled.');
      setProgress(profile.frames, profile.frames, 'mux', 0);
      outputBlob = makeAnimatedWebP(profile.size, profile.size, profile.frameDurationMs, profile.loopCount, encodedFrames);
      const outputBytes = new Uint8Array(await outputBlob.arrayBuffer());
      const parsed = parseAnimatedWebPMetrics(outputBytes);
      lastCapture.outputBytes = outputBlob.size;
      lastCapture.parsed = parsed;
      validateAnimatedWebPMetrics(parsed, profile);
      downloadBlob(outputBlob, profile);

      lastCapture.status = 'downloaded';
      lastCapture.completedAt = new Date().toISOString();
      lastCapture.elapsedMs = performance.now() - activeTiming.startedPerfMs;
      lastCapture.activeElapsedMs = activeElapsedMs();
      lastCapture.pausedTotalMs = totalPausedMs();
      const tailMs = Math.max(0, performance.now() - activeTiming.frameLoopCompletedPerfMs);
      lastCapture.timing = {
        timingKey: activeTiming.timingKey,
        completedFrames: activeTiming.completedFrames,
        sampleAverageFrameMs: activeTiming.sampleAverageFrameMs,
        emaFrameMs: activeTiming.emaFrameMs,
        predictedFrameMs: activeTiming.predictedFrameMs,
        tailMs,
        estimatedTotalMs: activeTiming.estimatedTotalMs,
        actualTotalMs: lastCapture.elapsedMs,
        actualActiveMs: lastCapture.activeElapsedMs,
        pausedTotalMs: lastCapture.pausedTotalMs,
        pauseCount: activeTiming.pauseCount
      };
      timingHistory[profile.timingKey] = {
        frameMs: activeTiming.sampleAverageFrameMs,
        tailMs: profile.mode === 'short-test' ? 0 : tailMs,
        frames: profile.frames,
        mode: profile.mode,
        frameSource: profile.frameSource,
        updatedAt: lastCapture.completedAt
      };
      setProgressBar(1);
      const prefix = profile.mode === 'short-test' ? 'Downloaded SHORT TEST' : 'Downloaded';
      setStatus(`${prefix} ${profile.size}px ${profile.speedLabel}: ${profile.frames} frames / ${(profile.durationMs / 1000).toFixed(1)} s / ${(outputBlob.size / 1048576).toFixed(1)} MiB`);
      return true;
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      if (lastCapture) {
        lastCapture.status = cancelled ? 'cancelled' : 'failed';
        lastCapture.completedAt = new Date().toISOString();
        lastCapture.elapsedMs = activeTiming ? performance.now() - activeTiming.startedPerfMs : null;
        lastCapture.activeElapsedMs = activeTiming ? activeElapsedMs() : null;
        lastCapture.pausedTotalMs = activeTiming ? totalPausedMs() : lastCapture.pausedTotalMs;
        lastCapture.paused = false;
        lastCapture.error = message;
      }
      setStatus(message, !cancelled);
      console.error('[Witch Dock Spinny Mini WebP]', error);
      return false;
    } finally {
      // Do not permit a stranded pause waiter during cleanup.
      releasePauseForCancellation();
      try {
        display.rotation.y = baseRotation;
        refreshScene(CK);
        await nextFrame();
        if (lastCapture) lastCapture.rotationRestored = Math.abs(Number(display.rotation.y) - baseRotation) < 1e-8;
      } catch (_) {}
      encodedFrames.length = 0;
      outputBlob = null;
      busy = false;
      cancelled = false;
      activeMode = null;
      pauseRequested = false;
      paused = false;
      pauseResolve = null;
      pauseBoundaryFrame = null;
      diagnostics.busy = false;
      diagnostics.activeMode = null;
      diagnostics.paused = false;
      diagnostics.pauseRequested = false;
      diagnostics.pauseBoundaryFrame = null;
      diagnostics.activeTiming = null;
      activeTiming = null;
      closeGuardModal();
      refresh();
    }
  }

  function captureSelectedProfile() { return captureProfile(false); }
  function captureShortTest() { return captureProfile(true); }

  function cancelCapture(cause = 'user') {
    if (!busy) return false;
    cancelled = true;
    if (lastCapture && !lastCapture.cancellationCause) lastCapture.cancellationCause = String(cause || 'user');
    releasePauseForCancellation();
    setStatus('Cancelling after current safe frame…');
    refresh();
    return true;
  }



  function isInsideOwnedUi(target) {
    if (!(target instanceof Node)) return false;
    if (panel && panel.contains(target)) return true;
    if (target instanceof Element && target.closest('[data-kw-spinny-owned="1"]')) return true;
    const guard = document.getElementById(GUARD_MODAL_ID);
    if (guard && guard.contains(target)) return true;
    return false;
  }

  function nearestCanvas(target) {
    if (!(target instanceof Element)) return null;
    if (target.tagName === 'CANVAS') return target;
    return target.closest('canvas');
  }

  function classifyGuardAttempt(event) {
    const canvas = nearestCanvas(event.target);
    if (canvas) {
      if (event.type === 'wheel') {
        return {
          category: 'camera-wheel',
          label: 'Mouse-wheel camera movement',
          detail: 'Scrolling over the HeroForge canvas can move the camera and create a visible jump in the animation.'
        };
      }
      return {
        category: 'camera-canvas',
        label: 'Camera/canvas interaction',
        detail: 'Dragging or clicking the HeroForge canvas can alter the camera and break animation continuity.'
      };
    }
    if (event.type === 'keydown') {
      return {
        category: 'keyboard-input',
        label: 'Keyboard interaction',
        detail: 'Keyboard input outside the Spinny controls is locked during capture because it may alter HeroForge camera or Booth state.'
      };
    }
    if (event.type === 'wheel') {
      return {
        category: 'hero-forge-wheel',
        label: 'HeroForge scroll interaction',
        detail: 'HeroForge interaction outside the Spinny controls is locked during capture to prevent state changes.'
      };
    }
    return {
      category: 'hero-forge-ui',
      label: 'HeroForge / Photo Booth interaction',
      detail: 'Changing Photo Booth controls, leaving the Booth, or interacting with HeroForge during capture can invalidate animation continuity.'
    };
  }

  function suppressGuardEvent(event) {
    try { if (event.cancelable) event.preventDefault(); } catch (_) {}
    try { event.stopImmediatePropagation(); } catch (_) {}
    try { event.stopPropagation(); } catch (_) {}
  }

  function closeGuardModal() {
    if (guardModal) guardModal.hidden = true;
  }

  function ensureGuardModal() {
    if (guardModal && guardModal.isConnected) return guardModal;
    guardModal = document.createElement('div');
    guardModal.id = GUARD_MODAL_ID;
    guardModal.hidden = true;
    guardModal.innerHTML = `
      <div class="hfc-guard-card" role="dialog" aria-modal="true" aria-labelledby="hfc-spinny-guard-title">
        <div class="hfc-guard-title" id="hfc-spinny-guard-title">Spinny capture protection</div>
        <div class="hfc-guard-detail"></div>
        <div class="hfc-guard-note">The attempted action was blocked before HeroForge received it. If you cancel, repeat the action after capture cancellation finishes.</div>
        <div class="hfc-guard-actions">
          <button type="button" class="hfc-guard-stay">Keep Capture</button>
          <button type="button" class="hfc-guard-cancel">Cancel Capture</button>
        </div>
      </div>`;
    document.body.appendChild(guardModal);
    guardModal.querySelector('.hfc-guard-stay').addEventListener('click', closeGuardModal);
    guardModal.querySelector('.hfc-guard-cancel').addEventListener('click', () => {
      const action = lastGuardAttempt ? lastGuardAttempt.category : 'guarded-action';
      closeGuardModal();
      cancelCapture(`guard:${action}`);
    });
    return guardModal;
  }

  function showGuardWarning(info) {
    const guard = ensureGuardModal();
    guard.querySelector('.hfc-guard-detail').textContent = `${info.label}: ${info.detail}`;
    guard.hidden = false;
  }

  function shouldIgnoreGuardKeyboard(event) {
    return !!(event.ctrlKey || event.metaKey || event.altKey);
  }

  function onGuardEvent(event) {
    if (!busy) return;
    if (isInsideOwnedUi(event.target)) return;
    if (event.type === 'keydown' && shouldIgnoreGuardKeyboard(event)) return;

    const info = classifyGuardAttempt(event);
    suppressGuardEvent(event);
    guardAttempts += 1;
    lastGuardAttempt = {
      number: guardAttempts,
      category: info.category,
      label: info.label,
      eventType: event.type,
      targetTag: event.target && event.target.tagName ? String(event.target.tagName) : null,
      targetId: event.target && event.target.id ? String(event.target.id) : null,
      targetClass: event.target && event.target.className && typeof event.target.className === 'string'
        ? event.target.className.slice(0, 240)
        : null,
      capturePaused: paused,
      at: new Date().toISOString()
    };
    if (lastCapture) lastCapture.guardedAction = { ...lastGuardAttempt };
    diagnostics.lastGuardAttempt = { ...lastGuardAttempt };
    if (!guardModal || guardModal.hidden) showGuardWarning(info);
  }

  function installInteractionGuards() {
    if (guardInstalled) return true;
    ensureGuardModal();
    for (const type of GUARD_EVENT_TYPES) {
      const options = type === 'wheel' || type === 'touchstart'
        ? { capture: true, passive: false }
        : { capture: true };
      document.addEventListener(type, onGuardEvent, options);
    }
    guardInstalled = true;
    return true;
  }

  function disposeInteractionGuards() {
    if (guardInstalled) {
      for (const type of GUARD_EVENT_TYPES) document.removeEventListener(type, onGuardEvent, true);
      guardInstalled = false;
    }
    if (guardModal) guardModal.remove();
    guardModal = null;
    return true;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
#${PANEL_ID}{position:fixed;left:12px;bottom:12px;z-index:2147483646;width:370px;padding:10px;border:1px solid #555;border-radius:8px;background:rgba(18,18,20,.95);color:#eee;font:12px/1.35 Arial,sans-serif;box-shadow:0 5px 18px rgba(0,0,0,.45)}
#${PANEL_ID} .hfc-title{font-size:13px;font-weight:700;margin-bottom:6px}
#${PANEL_ID} .hfc-cap{opacity:.78;margin-bottom:7px}
#${PANEL_ID} .hfc-row{display:grid;grid-template-columns:86px 1fr;gap:6px;align-items:center;margin-bottom:6px}
#${PANEL_ID} select{width:100%;border:1px solid #666;border-radius:5px;padding:6px;background:#29292d;color:#fff}
#${PANEL_ID} .hfc-status{min-height:30px;margin-top:7px;overflow-wrap:anywhere}
#${PANEL_ID} .hfc-status[data-error="1"]{color:#ff8a8a}
#${PANEL_ID} .hfc-progress{height:8px;margin-top:4px;overflow:hidden;border:1px solid #555;border-radius:999px;background:rgba(255,255,255,.09)}
#${PANEL_ID} .hfc-progress-fill{height:100%;width:0%;border-radius:999px;background:#d8d8dd;transition:width .16s linear}
#${PANEL_ID} .hfc-timing{min-height:16px;margin-top:5px;opacity:.82;font-size:11px}
#${PANEL_ID} .hfc-warning{min-height:15px;margin-top:4px;color:#ff7373;font-size:11px;font-weight:700}
#${PANEL_ID} .hfc-warning[hidden]{display:none}
#${PANEL_ID} .hfc-actions{display:flex;gap:6px;margin-top:7px}
#${PANEL_ID} button{flex:1;border:1px solid #666;border-radius:5px;padding:7px 8px;background:#29292d;color:#fff;cursor:pointer}
#${PANEL_ID} button:hover:not(:disabled){background:#36363b}
#${PANEL_ID} button:disabled,#${PANEL_ID} select:disabled{opacity:.42;cursor:not-allowed}
#${PANEL_ID} .hfc-short{border-color:#7769a8}
#${PANEL_ID} .hfc-short:hover:not(:disabled){background:#40395a}
#${PANEL_ID} .hfc-pause{border-color:#8b7c55}
#${PANEL_ID} .hfc-pause:hover:not(:disabled){background:#554b32}
#${PANEL_ID} .hfc-pause[data-paused="1"]{border-color:#65a77d}
#${PANEL_ID} .hfc-pause[data-paused="1"]:hover:not(:disabled){background:#31503b}
#${PANEL_ID} .hfc-meta{opacity:.72;margin-top:7px;font-size:11px;white-space:pre-line}

#${GUARD_MODAL_ID}{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.58);font:13px/1.4 Arial,sans-serif;color:#eee}
#${GUARD_MODAL_ID}[hidden]{display:none}
#${GUARD_MODAL_ID} .hfc-guard-card{width:min(460px,calc(100vw - 32px));padding:16px;border:1px solid #666;border-radius:10px;background:#1a1a1e;box-shadow:0 12px 40px rgba(0,0,0,.55)}
#${GUARD_MODAL_ID} .hfc-guard-title{font-size:15px;font-weight:700;margin-bottom:8px}
#${GUARD_MODAL_ID} .hfc-guard-detail{opacity:.9;margin-bottom:12px}
#${GUARD_MODAL_ID} .hfc-guard-note{opacity:.72;font-size:11px;margin-bottom:13px}
#${GUARD_MODAL_ID} .hfc-guard-actions{display:flex;gap:8px}
#${GUARD_MODAL_ID} button{flex:1;border:1px solid #666;border-radius:6px;padding:8px 10px;background:#29292d;color:#fff;cursor:pointer}
#${GUARD_MODAL_ID} button:hover{background:#393940}
#${GUARD_MODAL_ID} .hfc-guard-cancel{border-color:#a56565}
#${GUARD_MODAL_ID} .hfc-guard-cancel:hover{background:#573434}
`;
    document.head.appendChild(style);
  }

  function optionMarkup(collection) {
    return Object.values(collection).map((item) => `<option value="${item.id}">${item.label}</option>`).join('');
  }

  function ensurePanel() {
    return null;
  }

  function refresh() {
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

  function dispose() {
    if (busy) return false;
    if (refreshTimer !== null) { clearInterval(refreshTimer); refreshTimer = null; }
    disposeInteractionGuards();
    if (panel) panel.remove();
    panel = null;
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
    if (window[GLOBAL] === api) delete window[GLOBAL];
    return true;
  }

  const api = {
    version: VERSION,
    build: BUILD,
    resolutions: RESOLUTIONS,
    speeds: SPEEDS,
    shortTestFrames: SHORT_TEST_FRAMES,
    getSelectedProfile,
    setResolution,
    setSpeed,
    setProfile,
    readCapabilities,
    diagnostics,
    timingHistory,
    capture: captureSelectedProfile,
    captureShortTest,
    pause: requestPause,
    resume: resumeCapture,
    togglePause,
    cancel: cancelCapture,
    get busy() { return busy; },
    get paused() { return paused; },
    get pauseRequested() { return pauseRequested; },
    get activeMode() { return activeMode; },
    get lastCapture() { return lastCapture; },
    get guardInstalled() { return guardInstalled; },
    get guardAttempts() { return guardAttempts; },
    get lastGuardAttempt() { return lastGuardAttempt ? { ...lastGuardAttempt } : null; },
    get statusText() { return statusText; },
    get statusError() { return statusError; },
    get progressFraction() { return progressFraction; },
    get timingText() { return timingText; },
    refresh,
    dispose
  };

  if (window[GLOBAL] && typeof window[GLOBAL].dispose === 'function') {
    try { window[GLOBAL].dispose(); } catch (_) {}
  }
  window[GLOBAL] = api;
  ensureStyle();
  installInteractionGuards();
  refresh();
  refreshTimer = window.setInterval(refresh, 500);
})();

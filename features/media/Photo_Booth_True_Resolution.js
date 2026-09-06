/*
 * Witch Dock Dev feature: media.screenshot-resolution
 * Build: 0.8.0-service-only-provider
 * Source baseline: HeroForge.Compatibility standalone v0.6.0
 *
 * Owns the true-resolution capture service and high-resolution provider adapter.
 * It deliberately does not patch HeroForge bundles or own the Lob-absent native
 * Photo Booth resolution-menu adapter; that UI adapter remains a separate gate.
 */
(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const FEATURE_ID = 'media.screenshot-resolution';
  const BUILD = '0.8.0-service-only-provider';
  const SOURCE_SIZE = 4096;
  const ALLOWED_SIZES = new Set([4096, 8192]);
  const MIN_NATIVE_TILE_SIZE = 256;
  const MAX_PHASE_GRID = 32;
  const STORE_ENABLED = 'kw.witchDock.media.screenshotResolution.enabled.v1';

  const state = {
    enabled: true,
    initialized: false,
    busy: false,
    providerInstalled: false,
    providerLost: false,
    makerRef: null,
    providerWrapper: null,
    providerGuard: null,
    upstreamTakeScreenshot: null,
    reconcileTimer: null,
    lastCapture: null,
    lastStatus: 'Waiting for HeroForge Photo Booth runtime…',
    lastError: null
  };

  function readStoredEnabled() {
    try {
      const raw = UW.localStorage.getItem(STORE_ENABLED);
      if (raw === null) return true;
      return raw !== 'false';
    } catch (_) {
      return true;
    }
  }

  function saveEnabled() {
    try { UW.localStorage.setItem(STORE_ENABLED, state.enabled ? 'true' : 'false'); } catch (_) {}
  }

  function getCK() { return UW && UW.CK ? UW.CK : null; }
  function getBT() { return UW && UW.BT ? UW.BT : null; }

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
    return { renderer, maxTextureSize, maxRenderbufferSize };
  }

  function readCapabilities(targetSize) {
    const CK = getCK();
    const BT = getBT();
    const info = rendererInfo(CK);
    if (!CK) return { ok: false, reason: 'CK unavailable', CK, BT, ...info };
    if (!BT || !BT.maker) return { ok: false, reason: 'BT.maker unavailable', CK, BT, ...info };
    if (typeof BT.maker.takeScreenshot !== 'function') {
      return { ok: false, reason: 'BT.maker.takeScreenshot unavailable', CK, BT, ...info };
    }
    if (!CK.Effects || typeof CK.Effects.renderToCanvas !== 'function') {
      return { ok: false, reason: 'CK.Effects.renderToCanvas unavailable', CK, BT, ...info };
    }
    if (targetSize && BT.maker.enabled !== true) {
      return { ok: false, reason: 'Open Photo Booth first', CK, BT, ...info };
    }
    if (info.maxTextureSize !== null && info.maxTextureSize < SOURCE_SIZE) {
      return { ok: false, reason: `GPU texture limit ${info.maxTextureSize}px is below ${SOURCE_SIZE}px`, CK, BT, ...info };
    }
    if (info.maxRenderbufferSize !== null && info.maxRenderbufferSize < SOURCE_SIZE) {
      return { ok: false, reason: `GPU renderbuffer limit ${info.maxRenderbufferSize}px is below ${SOURCE_SIZE}px`, CK, BT, ...info };
    }
    return { ok: true, CK, BT, ...info };
  }

  function installTemporaryMethod(object, key, replacement) {
    const hadOwn = Object.prototype.hasOwnProperty.call(object, key);
    const descriptor = hadOwn ? Object.getOwnPropertyDescriptor(object, key) : null;
    const original = object[key];
    if (typeof original !== 'function') throw new Error(`${key} is not callable.`);

    if (descriptor && descriptor.configurable) {
      Object.defineProperty(object, key, { ...descriptor, value: replacement });
    } else {
      object[key] = replacement;
    }
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

  function installOwnedMethod(object, key, replacement) {
    const hadOwn = Object.prototype.hasOwnProperty.call(object, key);
    const descriptor = hadOwn ? Object.getOwnPropertyDescriptor(object, key) : null;
    const original = object[key];
    if (typeof original !== 'function') throw new Error(`${key} is not callable.`);

    if (descriptor && descriptor.configurable) {
      Object.defineProperty(object, key, { ...descriptor, value: replacement });
    } else {
      object[key] = replacement;
    }
    if (object[key] !== replacement) throw new Error(`Could not wrap ${key}.`);

    return {
      original,
      restore() {
        if (object[key] !== replacement) return false;
        try {
          if (hadOwn && descriptor) Object.defineProperty(object, key, descriptor);
          else delete object[key];
        } catch (_) {
          try { object[key] = original; } catch (_) { return false; }
        }
        return object[key] === original;
      }
    };
  }

  function classifyModelRender(width, height, camera, targetSize) {
    const w = Number(width);
    const h = Number(height);
    if (!Number.isFinite(w) || w <= 0 || w !== h) return null;
    if (!camera || Number(camera.width) !== targetSize || Number(camera.height) !== targetSize || !camera.view) return null;
    for (const value of [camera.view.offsetX, camera.view.offsetY, camera.view.width, camera.view.height]) {
      if (!Number.isFinite(Number(value))) return null;
    }
    if (w === targetSize) return { mode: 'native-true-resolution', tileSize: w, grid: 1, expectedPhases: 1 };
    if (w < MIN_NATIVE_TILE_SIZE || targetSize % w !== 0) return null;
    const grid = targetSize / w;
    if (!Number.isInteger(grid) || grid < 2 || grid > MAX_PHASE_GRID) return null;
    return { mode: 'tiled-repair', tileSize: w, grid, expectedPhases: grid * grid };
  }

  function phaseCoordinateFromOffset(actual, base, step, grid, axis) {
    if (!Number.isFinite(actual) || !Number.isFinite(base) || !Number.isFinite(step) || step === 0) {
      throw new Error(`Invalid native Booth ${axis}-phase geometry.`);
    }
    const raw = (actual - base) / step;
    const phase = Math.round(raw);
    const expected = base + phase * step;
    const tolerance = Math.max(1e-7, Math.abs(step) * 0.05);
    if (phase < 0 || phase >= grid || Math.abs(actual - expected) > tolerance) {
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
    if (!ctx) throw new Error('Could not create 2D context for phase canvas.');
    const imageData = ctx.createImageData(tileSize, tileSize);
    const output32 = new Uint32Array(imageData.data.buffer);
    let dest = 0;
    for (let y = 0; y < tileSize; y += 1) {
      let source = ((sourceStride * y + localY) * SOURCE_SIZE) + localX;
      for (let x = 0; x < tileSize; x += 1, dest += 1, source += sourceStride) {
        output32[dest] = source32[source];
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  function setStatus(text, error) {
    state.lastStatus = String(text || '');
    state.lastError = error ? state.lastStatus : null;
    updateUI();
  }

  function finalizeCaptureState(last, CK, currentRenderToCanvas, methodGuard, groupSources) {
    if (methodGuard) {
      try { methodGuard.restore(); } catch (_) {}
    }
    for (const group of groupSources.values()) group.pixels = null;
    groupSources.clear();
    if (last) last.effectsRestored = !!(CK && CK.Effects && CK.Effects.renderToCanvas === currentRenderToCanvas);
    state.busy = false;
    updateUI();
  }

  function runTrueResolutionCapture(targetSize, nativeTakeScreenshot, nativeThis, nativeArgs, sourceLabel) {
    if (state.busy) throw new Error('A high-resolution Photo Booth capture is already running.');
    if (!ALLOWED_SIZES.has(targetSize)) throw new Error(`Unsupported capture size ${targetSize}.`);

    const capability = readCapabilities(targetSize);
    if (!capability.ok) throw new Error(capability.reason);

    const { CK, BT, maxTextureSize, maxRenderbufferSize } = capability;
    const currentRenderToCanvas = CK.Effects.renderToCanvas;
    let methodGuard = null;
    let tileSize = null;
    let grid = null;
    let expectedPhases = null;
    let suppliedPhaseCount = 0;
    let baseOffsetX = null;
    let baseOffsetY = null;
    let stepX = null;
    let stepY = null;
    let creatingSource = false;
    let nativeTrueResolutionDetected = false;
    let groupsPerAxis = null;
    let sourceStride = null;
    let phasesPerGroup = null;
    const seenPhaseKeys = new Set();
    const groupSources = new Map();

    state.busy = true;
    const last = {
      build: BUILD,
      featureId: FEATURE_ID,
      source: sourceLabel || 'unknown',
      requestedWidth: targetSize,
      requestedHeight: targetSize,
      sourceSize: SOURCE_SIZE,
      maxTextureSize,
      maxRenderbufferSize,
      startedAt: new Date().toISOString(),
      completedAt: null,
      status: 'running',
      captureMode: null,
      nativeTrueResolutionDetected: false,
      boothMode: BT.currentMode || null,
      boothAspect: BT.display && BT.display.state ? Number(BT.display.state.aspect) : null,
      tileSize: null,
      grid: null,
      expectedPhases: null,
      suppliedPhaseCount: 0,
      uniquePhaseCount: 0,
      expectedSourceGroups: null,
      sourceGroupsRendered: 0,
      sourceGroupsReleased: 0,
      result: null,
      effectsRestored: false,
      error: null
    };
    state.lastCapture = last;
    setStatus(targetSize === 8192
      ? 'Capturing TRUE 8K via 4 × shifted 4096 Effects sources…'
      : 'Capturing TRUE 4K via one 4096 Effects source…', false);

    const fail = (error) => {
      const failure = error instanceof Error ? error : new Error(String(error));
      if (last.status === 'running') {
        last.status = 'failed';
        last.error = failure.message;
        last.completedAt = new Date().toISOString();
      }
      finalizeCaptureState(last, CK, currentRenderToCanvas, methodGuard, groupSources);
      methodGuard = null;
      setStatus(`High-resolution capture failed: ${last.error || failure.message}`, true);
      try { console.error('[Witch Dock][Photo Booth True Resolution]', failure); } catch (_) {}
      throw failure;
    };

    const succeed = (nativeResult) => {
      if (!nativeResult || Number(nativeResult.width) !== targetSize || Number(nativeResult.height) !== targetSize) {
        throw new Error(`Final native Booth result was not ${targetSize}x${targetSize}.`);
      }
      if (!nativeTrueResolutionDetected) {
        if (!expectedPhases || suppliedPhaseCount !== expectedPhases || seenPhaseKeys.size !== expectedPhases) {
          throw new Error(`Incomplete model phase feed ${suppliedPhaseCount}/${expectedPhases}.`);
        }
        if (groupSources.size !== 0) {
          throw new Error(`Grouped Effects sources were not fully released (${groupSources.size} remain).`);
        }
      }

      if (methodGuard) {
        methodGuard.restore();
        methodGuard = null;
      }
      last.effectsRestored = CK.Effects.renderToCanvas === currentRenderToCanvas;
      if (!last.effectsRestored) throw new Error('CK.Effects.renderToCanvas restoration failed.');

      for (const group of groupSources.values()) group.pixels = null;
      groupSources.clear();
      last.result = { width: Number(nativeResult.width), height: Number(nativeResult.height) };
      last.status = 'passed';
      last.completedAt = new Date().toISOString();
      state.busy = false;
      setStatus(`PASS: TRUE ${targetSize}px — ${last.sourceGroupsRendered || 0} grouped 4096 source${last.sourceGroupsRendered === 1 ? '' : 's'}, ${suppliedPhaseCount}/${expectedPhases || 1} phases.`, false);
      return nativeResult;
    };

    try {
      const wrapper = function (width, height, camera) {
        if (creatingSource) return currentRenderToCanvas.apply(this, arguments);

        const topology = classifyModelRender(width, height, camera, targetSize);
        if (!topology) return currentRenderToCanvas.apply(this, arguments);

        if (topology.mode === 'native-true-resolution') {
          if (tileSize !== null || suppliedPhaseCount > 0) {
            throw new Error('Native Booth mixed full-resolution and tiled model paths in one screenshot.');
          }
          nativeTrueResolutionDetected = true;
          last.captureMode = 'native-true-resolution';
          last.nativeTrueResolutionDetected = true;
          return currentRenderToCanvas.apply(this, arguments);
        }
        if (nativeTrueResolutionDetected) {
          throw new Error('Native Booth switched from full-resolution to tiled model capture mid-screenshot.');
        }

        if (tileSize === null) {
          tileSize = topology.tileSize;
          grid = topology.grid;
          expectedPhases = topology.expectedPhases;
          baseOffsetX = Number(camera.view.offsetX);
          baseOffsetY = Number(camera.view.offsetY);
          stepX = Number(camera.view.width) / targetSize;
          stepY = Number(camera.view.height) / targetSize;
          if (!Number.isFinite(stepX) || !Number.isFinite(stepY) || stepX === 0 || stepY === 0) {
            throw new Error('Unsupported native Booth phase geometry.');
          }
          if (SOURCE_SIZE % tileSize !== 0 || targetSize % SOURCE_SIZE !== 0) {
            throw new Error(`Unsupported grouped topology: tile ${tileSize}px, source ${SOURCE_SIZE}px, output ${targetSize}px.`);
          }

          groupsPerAxis = targetSize / SOURCE_SIZE;
          sourceStride = SOURCE_SIZE / tileSize;
          if (!Number.isInteger(groupsPerAxis) || groupsPerAxis < 1 || !Number.isInteger(sourceStride) || sourceStride < 1) {
            throw new Error('Grouped source geometry is not integral.');
          }
          if (grid !== groupsPerAxis * sourceStride) {
            throw new Error(`Grouped topology mismatch: grid ${grid}, groups ${groupsPerAxis}, stride ${sourceStride}.`);
          }
          phasesPerGroup = sourceStride * sourceStride;

          Object.assign(last, {
            captureMode: 'adaptive-grouped-phase-feed',
            tileSize,
            grid,
            expectedPhases,
            groupsPerAxis,
            sourceStride,
            phasesPerGroup,
            expectedSourceGroups: groupsPerAxis * groupsPerAxis,
            baseOffsetX,
            baseOffsetY,
            stepX,
            stepY
          });
        } else if (topology.tileSize !== tileSize || topology.grid !== grid) {
          throw new Error('Native Booth model tile topology changed mid-capture.');
        }

        if (suppliedPhaseCount >= expectedPhases) {
          throw new Error(`Native Booth requested more than ${expectedPhases} model phases.`);
        }

        const phaseX = phaseCoordinateFromOffset(Number(camera.view.offsetX), baseOffsetX, stepX, grid, 'X');
        const phaseY = phaseCoordinateFromOffset(Number(camera.view.offsetY), baseOffsetY, stepY, grid, 'Y');
        const phaseKey = `${phaseX},${phaseY}`;
        if (seenPhaseKeys.has(phaseKey)) throw new Error(`Native Booth requested duplicate model phase ${phaseKey}.`);
        seenPhaseKeys.add(phaseKey);

        const groupX = phaseX % groupsPerAxis;
        const groupY = phaseY % groupsPerAxis;
        const groupKey = `${groupX},${groupY}`;
        let group = groupSources.get(groupKey);

        if (!group) {
          const sourceOffsetX = baseOffsetX + groupX * stepX;
          const sourceOffsetY = baseOffsetY + groupY * stepY;
          creatingSource = true;
          let sourceCanvas;
          try {
            sourceCanvas = withCameraOffsets(camera, sourceOffsetX, sourceOffsetY, () => (
              currentRenderToCanvas.call(this, SOURCE_SIZE, SOURCE_SIZE, camera, 1)
            ));
          } finally {
            creatingSource = false;
          }

          if (!sourceCanvas || Number(sourceCanvas.width) !== SOURCE_SIZE || Number(sourceCanvas.height) !== SOURCE_SIZE) {
            throw new Error(`Grouped Effects source ${groupKey} was not ${SOURCE_SIZE}x${SOURCE_SIZE}.`);
          }
          const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
          if (!sourceCtx) throw new Error(`Grouped Effects source ${groupKey} 2D context unavailable.`);
          const sourceImageData = sourceCtx.getImageData(0, 0, SOURCE_SIZE, SOURCE_SIZE);
          const pixels = new Uint32Array(sourceImageData.data.buffer);
          sourceCanvas.width = 1;
          sourceCanvas.height = 1;
          sourceCanvas = null;

          group = { pixels, remaining: phasesPerGroup };
          groupSources.set(groupKey, group);
          last.sourceGroupsRendered += 1;
        }

        const localX = Math.floor(phaseX / groupsPerAxis);
        const localY = Math.floor(phaseY / groupsPerAxis);
        if (localX < 0 || localX >= sourceStride || localY < 0 || localY >= sourceStride) {
          throw new Error(`Grouped local phase out of range for ${phaseKey}.`);
        }

        const phaseCanvas = makePhaseCanvas(group.pixels, tileSize, sourceStride, localX, localY);
        group.remaining -= 1;
        if (group.remaining === 0) {
          group.pixels = null;
          groupSources.delete(groupKey);
          last.sourceGroupsReleased += 1;
        }

        suppliedPhaseCount += 1;
        last.suppliedPhaseCount = suppliedPhaseCount;
        last.uniquePhaseCount = seenPhaseKeys.size;
        return phaseCanvas;
      };

      methodGuard = installTemporaryMethod(CK.Effects, 'renderToCanvas', wrapper);
      let nativeResult = nativeTakeScreenshot.apply(nativeThis, nativeArgs);
      if (nativeResult && typeof nativeResult.then === 'function') {
        return nativeResult.then(
          (value) => {
            try { return succeed(value); } catch (error) { return fail(error); }
          },
          (error) => fail(error)
        );
      }
      return succeed(nativeResult);
    } catch (error) {
      return fail(error);
    }
  }

  function providerStatusText() {
    if (!state.enabled) return 'Disabled — native/Lob capture passes through unchanged.';
    if (state.providerLost) return 'DEGRADED — another script replaced BT.maker.takeScreenshot after Witch Dock installed its provider. Reload before using repaired 4K/8K.';
    if (state.providerInstalled) return 'Active — HF/Lob 4096 and 8192 capture requests are repaired automatically.';
    const cap = readCapabilities(null);
    return cap.ok ? 'Ready to install capture provider.' : `Waiting — ${cap.reason}.`;
  }

  function installProvider() {
    if (!state.enabled || state.busy) return false;
    const cap = readCapabilities(null);
    if (!cap.ok) return false;
    const maker = cap.BT.maker;

    if (state.providerInstalled) {
      if (maker === state.makerRef && maker.takeScreenshot === state.providerWrapper) return true;
      if (maker !== state.makerRef) {
        restoreProvider();
      } else {
        state.providerLost = true;
        state.providerInstalled = false;
        setStatus('Capture provider lost ownership because BT.maker.takeScreenshot changed after installation.', true);
        return false;
      }
    }

    const upstream = maker.takeScreenshot;
    const wrapper = function (width, height) {
      const w = Number(width);
      const h = Number(height);
      if (!state.enabled || !ALLOWED_SIZES.has(w) || w !== h) {
        return upstream.apply(this, arguments);
      }

      const runtimeCap = readCapabilities(w);
      if (!runtimeCap.ok) {
        state.lastStatus = `High-resolution repair bypassed: ${runtimeCap.reason}`;
        state.lastError = runtimeCap.reason;
        updateUI();
        return upstream.apply(this, arguments);
      }

      try {
        return runTrueResolutionCapture(w, upstream, this, Array.from(arguments), 'hf-ui-provider');
      } catch (error) {
        // The provider is restored by the capture engine. Do not re-run the native
        // capture after a partial high-resolution attempt because that can duplicate
        // capture-side state changes. Surface the failure to the original caller.
        throw error;
      }
    };

    try {
      const guard = installOwnedMethod(maker, 'takeScreenshot', wrapper);
      state.makerRef = maker;
      state.providerWrapper = wrapper;
      state.providerGuard = guard;
      state.upstreamTakeScreenshot = upstream;
      state.providerInstalled = true;
      state.providerLost = false;
      setStatus('High-resolution capture provider active.', false);
      return true;
    } catch (error) {
      state.providerInstalled = false;
      state.providerLost = false;
      setStatus(`Could not install high-resolution capture provider: ${error.message || error}`, true);
      return false;
    }
  }

  function restoreProvider() {
    const maker = state.makerRef;
    const wrapper = state.providerWrapper;
    const guard = state.providerGuard;
    let restored = true;
    if (maker && wrapper && guard) {
      if (maker.takeScreenshot === wrapper) restored = guard.restore();
      else restored = false;
    }
    state.providerInstalled = false;
    state.makerRef = null;
    state.providerWrapper = null;
    state.providerGuard = null;
    state.upstreamTakeScreenshot = null;
    if (!restored) state.providerLost = true;
    updateUI();
    return restored;
  }

  function reconcileProvider() {
    if (!state.initialized) return;
    if (!state.enabled) return;
    const BT = getBT();
    const maker = BT && BT.maker;

    if (state.providerInstalled) {
      if (maker === state.makerRef && maker && maker.takeScreenshot === state.providerWrapper) return;
      if (maker !== state.makerRef) {
        restoreProvider();
        installProvider();
        return;
      }
      state.providerLost = true;
      state.providerInstalled = false;
      setStatus('Capture provider ownership changed unexpectedly. Reload before repaired high-resolution capture.', true);
      return;
    }

    if (!state.providerLost) installProvider();
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Canvas PNG encoding returned no Blob.')), 'image/png');
      } catch (error) {
        reject(error);
      }
    });
  }

  function downloadBlob(blob, size) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    anchor.href = url;
    anchor.download = `HeroForge_TRUE_${size}px_${stamp}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  async function captureAndDownload(targetSize) {
    if (!state.enabled) throw new Error('High-resolution capture repair is disabled.');
    if (!state.providerInstalled) {
      installProvider();
      if (!state.providerInstalled) throw new Error('High-resolution capture provider is unavailable.');
    }
    const maker = state.makerRef;
    const upstream = state.upstreamTakeScreenshot;
    if (!maker || typeof upstream !== 'function') throw new Error('Native Photo Booth capture function unavailable.');

    let result = runTrueResolutionCapture(targetSize, upstream, maker, [targetSize, targetSize], 'witch-dock-button');
    if (result && typeof result.then === 'function') result = await result;
    setStatus(`Encoding TRUE ${targetSize}px PNG…`, false);
    const blob = await canvasToBlob(result);
    downloadBlob(blob, targetSize);
    if (state.lastCapture && state.lastCapture.result) state.lastCapture.result.blobBytes = blob.size;
    setStatus(`PASS: TRUE ${targetSize}px downloaded.`, false);
    return result;
  }

  function setEnabled(value) {
    const next = !!value;
    if (state.busy) throw new Error('Cannot change high-resolution capture provider while a capture is active.');
    if (state.enabled === next) return true;
    state.enabled = next;
    saveEnabled();
    if (next) {
      state.providerLost = false;
      installProvider();
    } else {
      restoreProvider();
      setStatus('High-resolution capture repair disabled.', false);
    }
    updateUI();
    return true;
  }

  // Internal name retained so validated provider/capture call sites remain byte-identical.
  // This hook no longer mutates DOM; the separate UI module is the sole presentation owner.
  function updateUI() {
    try {
      window.dispatchEvent(new CustomEvent('kw:photo-booth-true-resolution-state', {
        detail: {
          build: BUILD,
          enabled: state.enabled,
          busy: state.busy,
          providerInstalled: state.providerInstalled,
          providerLost: state.providerLost
        }
      }));
    } catch (_) {}
  }

  function initialize() {
    if (state.initialized) return true;
    state.enabled = readStoredEnabled();
    state.initialized = true;
    installProvider();
    state.reconcileTimer = window.setInterval(reconcileProvider, 1000);
    updateUI();
    return true;
  }

  function dispose() {
    if (state.busy) throw new Error('Cannot dispose high-resolution capture while a capture is active.');
    if (state.reconcileTimer) window.clearInterval(state.reconcileTimer);
    state.reconcileTimer = null;
    restoreProvider();
    state.initialized = false;
    state.lastStatus = 'Disposed.';
    try { delete UW.KWPhotoBoothTrueResolution; } catch (_) { UW.KWPhotoBoothTrueResolution = undefined; }
    return true;
  }

  UW.KWPhotoBoothTrueResolution = {
    featureId: FEATURE_ID,
    build: BUILD,
    initialize,
    enable: () => setEnabled(true),
    disable: () => setEnabled(false),
    dispose,
    capture4096: () => captureAndDownload(4096),
    capture8192: () => captureAndDownload(8192),
    get enabled() { return state.enabled; },
    get providerInstalled() { return state.providerInstalled; },
    get providerLost() { return state.providerLost; },
    get lastCapture() { return state.lastCapture; },
    get status() { return state.lastStatus; },
    get lastError() { return state.lastError; },
    get busy() { return state.busy; }
  };

  initialize();
})();

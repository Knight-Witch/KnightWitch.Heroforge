const fs = require('fs');
const vm = require('vm');

const boothSource = fs.readFileSync('tools/Booth.js', 'utf8');
const replaySource = fs.readFileSync('features/booth/Black_Canvas_Display_Replay.js', 'utf8');
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function extractFunction(source, name) {
  const marker = `  function ${name}(`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`missing function ${name}`);
  const next = source.indexOf('\n  function ', start + marker.length);
  if (next < 0) throw new Error(`next function after ${name} missing`);
  return source.slice(start + 2, next).trim();
}

assert(boothSource.includes("const BUILD_TAG = 'v27.0.4';"), 'Booth build mismatch');
assert((boothSource.match(/version: '27\.0\.4'/g) || []).length === 2, 'Booth version count mismatch');
assert(!boothSource.includes('kwBoothBlackCanvasMatte'), 'rejected DOM matte remains');
assert(!boothSource.includes('maker.getTokenViewOffset('), 'rejected token crop runtime call remains');
assert(!boothSource.includes('blackCanvasMatteRoot'), 'matte state remains');
assert(replaySource.includes("const VERSION = '0.1.5';"), 'replay version mismatch');
assert(replaySource.includes("const BUILD = '0.1.5-dev-restore-before-booth-handoff';"), 'replay build mismatch');
assert(replaySource.includes('reassertThroughBoothApiWithHandoff'), 'handoff helper missing');
assert(!replaySource.includes('relinquishSemanticBackgroundOwnership'), 'unsafe relinquish helper remains');

const refreshFn = extractFunction(boothSource, 'refreshBTComponentRender');
assert(!refreshFn.includes('.resize('), 'component refresh still calls overlay resize');
assert(!refreshFn.includes('.refresh('), 'component refresh still calls overlay refresh');
assert(!refreshFn.includes('.applyVisibility('), 'component refresh still calls applyVisibility');
assert(refreshFn.includes('requestBTComponentRenderRefresh()'), 'narrow render request missing');

const registry = Object.fromEntries(manifest.moduleRegistry.map(x => [x.id, x]));
const tools = Object.fromEntries(manifest.tools.map(x => [x.id, x]));
assert(registry['booth-tool'].version === '27.0.4', 'manifest Booth version mismatch');
assert(registry['booth-tool'].build === 'v27.0.4', 'manifest Booth build mismatch');
assert(tools['booth-tool'].url.includes('v=27.0.4-v27.0.4'), 'Booth cache URL mismatch');
assert(registry['booth-black-canvas-display-replay'].version === '0.1.5', 'manifest replay version mismatch');
assert(registry['booth-black-canvas-display-replay'].build === '0.1.5-dev-restore-before-booth-handoff', 'manifest replay build mismatch');
assert(tools['booth-black-canvas-display-replay'].url.includes('v=0.1.5-dev-restore-before-booth-handoff'), 'replay cache URL mismatch');
assert(registry['booth-runtime-bootstrap'].version === '0.1.0', 'bootstrap identity changed');

// Environment helper must act when wrapper says visible but actual mesh is hidden.
{
  const fn = extractFunction(boothSource, 'ensureEditorEnvironmentBehindBooth');
  let calls = 0;
  const background = { visible: true, mesh: { visible: false } };
  const state = { userBoothOn: true, bgOn: false };
  const UW = {
    BT: { display: { environment: { setDefaultEnvironmentVisibility(v) { calls += 1; if (v) UW.CK.environment.groundGroup.visible = true; } } } },
    CK: { environment: { background, groundGroup: { visible: true } }, character: { settings: { hideGround: false } } },
    HF: { summonCircle: { visible: true } }
  };
  const context = { state, UW, result: null };
  vm.createContext(context);
  vm.runInContext(`${fn}\nresult = ensureEditorEnvironmentBehindBooth();`, context);
  assert(context.result === true, 'mesh-hidden mismatch did not trigger restore');
  assert(calls === 1, 'native environment setter not called once');
  assert(background.mesh.visible === true, 'actual background mesh not restored');
  vm.runInContext('result = ensureEditorEnvironmentBehindBooth();', context);
  assert(context.result === false && calls === 1, 'visible environment triggered repeated setter');

  state.bgOn = true;
  background.mesh.visible = false;
  vm.runInContext('result = ensureEditorEnvironmentBehindBooth();', context);
  assert(context.result === false && calls === 1, 'Black Canvas ON bypassed normal guard');
  vm.runInContext('result = ensureEditorEnvironmentBehindBooth({allowBlackCanvas:true});', context);
  assert(context.result === true && calls === 2 && background.mesh.visible === true, 'explicit Black Canvas editor fallback failed');
}

// Narrow component refresh must not touch broad native overlay lifecycle.
{
  const reqFn = extractFunction(boothSource, 'requestBTComponentRenderRefresh');
  const fn = extractFunction(boothSource, 'refreshBTComponentRender');
  let planes = 0, env = 0, render = 0, raf = null;
  const state = { bgOn: false, userBoothOn: true };
  const UW = { CK: { GameLoop: { requestRenderRefresh() { render += 1; } } } };
  const context = {
    state, UW,
    applyBTComponentPlanes() { planes += 1; },
    enforceBTBlackCanvas() { throw new Error('black path should not run'); },
    ensureEditorEnvironmentBehindBooth() { env += 1; },
    requestAnimationFrame(fn) { raf = fn; },
    result: null
  };
  vm.createContext(context);
  vm.runInContext(`${reqFn}\n${fn}\nresult = refreshBTComponentRender();`, context);
  assert(context.result === true && planes === 1 && env === 1 && render === 1, 'first narrow refresh wrong');
  assert(typeof raf === 'function', 'RAF followup missing');
  raf();
  assert(planes === 2 && env === 2 && render === 2, 'RAF narrow refresh wrong');
}

function runReplayHandoffCase() {
  let blackOn = true;
  let btReady = false;
  let nativeUpdates = 0;
  let delegateCalls = 0;
  let delegateSawVisible = null;
  let scheduled = null;
  const direct = { visible: true };
  const canvas = { style: {}, parentElement: { style: {} } };
  const display = { update() { nativeUpdates += 1; return 'native'; } };
  const UW = {
    CK: {
      character: { display },
      environment: { background: { mesh: direct } },
      renderManager: { renderer: { domElement: canvas } }
    },
    KW_WD_BOOTH: {
      getState: () => ({ sessionBlackCanvas: blackOn, sessionBoothView: true })
    },
    setTimeout(fn) { scheduled = fn; return 1; },
    clearTimeout() {},
    console: { log() {} }
  };
  const context = { unsafeWindow: UW, window: UW, setTimeout: UW.setTimeout, clearTimeout: UW.clearTimeout, console: UW.console, JSON, Object, Array, String, Date };
  vm.createContext(context);
  vm.runInContext(replaySource, context);
  assert(direct.visible === false, 'pre-BT fallback did not hide background');

  UW.BT = { display: { environment: { setDefaultEnvironmentVisibility() {} }, overlays: {} } };
  UW.KW_WD_BOOTH.reassertBlackCanvasPresentation = () => {
    delegateCalls += 1;
    delegateSawVisible = direct.visible;
    btReady = true;
    return true;
  };

  if (scheduled) scheduled();
  assert(btReady && delegateCalls >= 1, 'Booth delegation did not occur');
  assert(delegateSawVisible === true, 'replay did not restore owned mesh before Booth handoff');
  assert(direct.visible === true, 'owned mesh remained hidden after handoff');
  assert(display.update() === 'native' && nativeUpdates === 1, 'native display.update passthrough changed');
  assert(delegateCalls >= 2, 'post-update delegation missing');

  blackOn = false;
  if (scheduled) scheduled();
  assert(direct.visible === true, 'Black Canvas OFF hid background after handoff');
  assert(UW.KW_WD_BOOTH_BLACK_REPLAY.version === '0.1.5', 'replay API version mismatch');
  UW.KW_WD_BOOTH_BLACK_REPLAY.dispose();
}
runReplayHandoffCase();

console.log('Booth environment ownership validation: PASS');

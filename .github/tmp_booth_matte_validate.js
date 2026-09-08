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

assert(boothSource.includes("const BUILD_TAG = 'v27.0.3';"), 'Booth build tag mismatch');
assert((boothSource.match(/version: '27\.0\.3'/g) || []).length === 2, 'Booth version count mismatch');
assert(boothSource.includes('reassertBlackCanvasPresentation'), 'Booth reassert API missing');
assert(boothSource.includes("root.id = 'kwBoothBlackCanvasMatte';"), 'DOM matte root missing');
assert(boothSource.includes('maker.getTokenViewOffset()'), 'named token-view seam missing');
assert(boothSource.includes("pointerEvents: 'none'"), 'matte is not pointer-inert');
assert(boothSource.includes('if (matteReady) {'), 'component-aware matte branch missing');
assert(boothSource.includes('ensureEditorEnvironmentBehindBooth({ allowBlackCanvas: true });'), 'fantasy fallback restore missing');
assert(boothSource.includes('enforceBTBlackCanvas({ allowEditorFallback: !inBooth })'), 'native Booth tick gate missing');
assert(!boothSource.includes('RawShaderMaterial'), 'rejected custom WebGL matte leaked into Booth');
assert(replaySource.includes("const VERSION = '0.1.4';"), 'replay version mismatch');
assert(replaySource.includes("const BUILD = '0.1.4-dev-component-aware-booth-reassert';"), 'replay build mismatch');
assert(replaySource.includes('reassertThroughBoothApi'), 'replay delegation missing');
assert(replaySource.includes('relinquishSemanticBackgroundOwnership'), 'replay ownership handoff missing');

const registry = Object.fromEntries(manifest.moduleRegistry.map(x => [x.id, x]));
const tools = Object.fromEntries(manifest.tools.map(x => [x.id, x]));
assert(registry['booth-tool'].version === '27.0.3', 'manifest Booth version mismatch');
assert(registry['booth-tool'].build === 'v27.0.3', 'manifest Booth build mismatch');
assert(tools['booth-tool'].url.includes('v=27.0.3-v27.0.3'), 'Booth cache URL mismatch');
assert(registry['booth-black-canvas-display-replay'].version === '0.1.4', 'manifest replay version mismatch');
assert(registry['booth-black-canvas-display-replay'].build === '0.1.4-dev-component-aware-booth-reassert', 'manifest replay build mismatch');
assert(tools['booth-black-canvas-display-replay'].url.includes('v=0.1.4-dev-component-aware-booth-reassert'), 'replay cache URL mismatch');
assert(registry['booth-runtime-bootstrap'].version === '0.1.0', 'bootstrap identity changed');

// DOM matte geometry: use the same named native viewport contract as HeroForge.
{
  class FakeEl {
    constructor(tag) {
      this.tagName = tag.toUpperCase();
      this.style = {};
      this.dataset = {};
      this.children = [];
      this.parentElement = null;
      this.isConnected = false;
      this.clientLeft = 0;
      this.clientTop = 0;
      this.scrollLeft = 0;
      this.scrollTop = 0;
    }
    setAttribute() {}
    appendChild(el) { el.parentElement = this; el.isConnected = true; this.children.push(el); return el; }
    removeChild(el) { this.children = this.children.filter(x => x !== el); el.parentElement = null; el.isConnected = false; }
  }
  const parent = new FakeEl('div');
  parent.getBoundingClientRect = () => ({ left: 100, top: 50, width: 1000, height: 800 });
  const canvas = new FakeEl('canvas');
  canvas.parentElement = parent;
  canvas.offsetParent = parent;
  canvas.offsetLeft = 10;
  canvas.offsetTop = 20;
  canvas.clientWidth = 1000;
  canvas.clientHeight = 800;
  canvas.getBoundingClientRect = () => ({ left: 110, top: 70, width: 1000, height: 800 });
  let view = { fullWidth: 1000, fullHeight: 800, offsetX: 350, offsetY: 250, width: 300, height: 300 };
  const state = { blackCanvasMatteRoot: null, blackCanvasMatteBars: null, blackCanvasMatteParent: null, blackCanvasMatteLayoutKey: null };
  const UW = { BT: { maker: { getTokenViewOffset: () => ({ ...view }) } }, CK: { renderManager: { renderer: { domElement: canvas } } } };
  const document = { createElement: tag => new FakeEl(tag) };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const context = { state, UW, document, clamp, Object, Number, Math, Array, result: null };
  vm.createContext(context);
  const funcs = ['disposeBlackCanvasMatte', 'hideBlackCanvasMatte', 'setMatteRect', 'ensureBlackCanvasMatte']
    .map(name => extractFunction(boothSource, name)).join('\n');
  vm.runInContext(`${funcs}\nresult = ensureBlackCanvasMatte();`, context);
  assert(context.result === true, 'matte geometry helper failed');
  assert(state.blackCanvasMatteRoot.parentElement === parent, 'matte did not mount under character canvas');
  assert(state.blackCanvasMatteRoot.style.left === '10px' && state.blackCanvasMatteRoot.style.top === '20px', 'matte canvas offset mapping wrong');
  assert(state.blackCanvasMatteRoot.style.width === '1000px' && state.blackCanvasMatteRoot.style.height === '800px', 'matte canvas size wrong');
  const b = state.blackCanvasMatteBars;
  assert(b.top.style.height === '250px', 'top matte height wrong');
  assert(b.bottom.style.top === '550px' && b.bottom.style.height === '250px', 'bottom matte geometry wrong');
  assert(b.left.style.width === '350px' && b.left.style.top === '250px', 'left matte geometry wrong');
  assert(b.right.style.left === '650px' && b.right.style.width === '350px', 'right matte geometry wrong');
  const root = state.blackCanvasMatteRoot;
  vm.runInContext('result = ensureBlackCanvasMatte();', context);
  assert(state.blackCanvasMatteRoot === root, 'stable geometry recreated matte root');
  vm.runInContext('disposeBlackCanvasMatte();', context);
  assert(state.blackCanvasMatteRoot === null && !root.isConnected, 'matte dispose failed');
}

// Component-aware enforcement: fantasy fallback only when matte is ready and native Booth is excluded.
{
  const fn = extractFunction(boothSource, 'enforceBTBlackCanvas');
  let envFalseCalls = 0;
  let editorRestoreCalls = 0;
  let matteCalls = 0;
  let hideCalls = 0;
  const overlays = {
    backgroundPlane: { visible: true },
    framePlane: { visible: true },
    shadowPlane: { visible: true },
    mask: { visible: true }
  };
  const canvas = { style: {}, parentElement: { style: {} } };
  const UW = {
    BT: { display: { environment: { setDefaultEnvironmentVisibility(v) { if (!v) envFalseCalls += 1; } }, overlays } },
    CK: { renderManager: { renderer: { domElement: canvas } } }
  };
  const state = { userBoothOn: true, persistBackgroundOn: false };
  const context = {
    state, UW, Object,
    captureBTCanvasVisualState() {}, syncBTCanvasLayout() {},
    isNativePhotoBoothForPresentation() { return false; },
    ensureBlackCanvasMatte() { matteCalls += 1; return true; },
    hideBlackCanvasMatte() { hideCalls += 1; },
    ensureEditorEnvironmentBehindBooth(opts) { if (opts && opts.allowBlackCanvas) editorRestoreCalls += 1; },
    result: null
  };
  vm.createContext(context);
  vm.runInContext(`${fn}\nresult = enforceBTBlackCanvas({ allowEditorFallback: true });`, context);
  assert(context.result === true && matteCalls === 1 && editorRestoreCalls === 1, 'Background-OFF fantasy fallback not selected');
  assert(envFalseCalls === 0, 'fallback path hid editor environment');
  assert(overlays.backgroundPlane.visible === false && overlays.framePlane.visible === false, 'overlay policy wrong in fallback');
  assert(canvas.style.backgroundColor === '#000000', 'canvas black invariant lost');

  state.persistBackgroundOn = true;
  vm.runInContext('result = enforceBTBlackCanvas({ allowEditorFallback: true });', context);
  assert(envFalseCalls === 1 && hideCalls >= 1 && overlays.backgroundPlane.visible === true, 'Background-ON full-black path wrong');

  state.persistBackgroundOn = false;
  vm.runInContext('result = enforceBTBlackCanvas({ allowEditorFallback: false });', context);
  assert(envFalseCalls === 2, 'native Booth exclusion did not retain old environment hide');
}

function runReplayCase({ delegated }) {
  let blackOn = true;
  let nativeUpdates = 0;
  let delegateCalls = 0;
  let envHideCalls = 0;
  let scheduled = null;
  const direct = { visible: true };
  const named = { name: 'background', visible: true, children: [] };
  const envRoot = { name: 'environment', children: [named] };
  const scene = { children: [envRoot], getObjectByName(name) { return name === 'environment' ? envRoot : (name === 'background' ? named : null); } };
  const overlays = { backgroundPlane: { visible: false, parent: scene }, framePlane: { visible: true }, shadowPlane: { visible: true }, mask: { visible: true } };
  const canvas = { style: {}, parentElement: { style: {} } };
  const display = { update() { nativeUpdates += 1; return 'native'; } };
  const UW = {
    CK: { character: { display }, environment: { background: { mesh: direct } }, renderManager: { renderer: { domElement: canvas } } },
    KW_WD_BOOTH: {
      getState: () => ({ sessionBlackCanvas: blackOn, sessionBoothView: true }),
      ...(delegated ? { reassertBlackCanvasPresentation() { delegateCalls += 1; return true; } } : {})
    },
    setTimeout(fn) { scheduled = fn; return 1; }, clearTimeout() {}, console: { log() {} }
  };
  if (delegated) {
    UW.BT = { display: { environment: { setDefaultEnvironmentVisibility(v) { if (!v) envHideCalls += 1; } }, overlays } };
  }
  const context = { unsafeWindow: UW, window: UW, setTimeout: UW.setTimeout, clearTimeout: UW.clearTimeout, console: UW.console, JSON, Object, Array, String, Date };
  vm.createContext(context);
  vm.runInContext(replaySource, context);

  if (delegated) {
    assert(delegateCalls >= 1, 'replay did not delegate on install');
    assert(envHideCalls === 0, 'delegated replay also executed legacy environment hide');
    assert(named.visible === true, 'delegated replay hid semantic background');
  } else {
    assert(direct.visible === false, 'pre-BT replay fallback no longer hides direct background');
  }

  assert(display.update() === 'native' && nativeUpdates === 1, 'native display.update passthrough changed');
  if (delegated) {
    assert(delegateCalls >= 2 && named.visible === true, 'post-update delegation failed');
  }

  blackOn = false;
  if (scheduled) scheduled();
  if (!delegated) assert(direct.visible === true, 'pre-BT fallback did not restore on Black Canvas OFF');
  assert(UW.KW_WD_BOOTH_BLACK_REPLAY.version === '0.1.4', 'replay API version missing');
  UW.KW_WD_BOOTH_BLACK_REPLAY.dispose();
}

runReplayCase({ delegated: true });
runReplayCase({ delegated: false });

console.log('Booth matte + replay validation: PASS');

const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('tools/Booth.js', 'utf8');
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function extractFunction(name) {
  const marker = `  function ${name}(`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`missing function ${name}`);
  const next = source.indexOf('\n  function ', start + marker.length);
  const end = next >= 0 ? next : source.length;
  return source.slice(start + 2, end).trim();
}

assert(source.includes("const BUILD_TAG = 'v27.0.2';"), 'build tag mismatch');
assert((source.match(/version: '27\.0\.2'/g) || []).length === 2, 'public/diag version count mismatch');
assert(!source.includes("if (cfg.camera) signals.push('camera');"), 'bare camera regression returned');
assert(source.includes("opts.source !== 'internal'"), 'silent-cycle shutdown guard missing');
assert(source.includes("const hideFrame = !!state.userBoothOn && !inBooth;"), 'frame native-Booth gate changed');
assert(source.includes("const plane = shader ? (shader.framePlane || (overlays && overlays.framePlane)) : null;"), 'overlay frame fallback missing');
assert(source.includes("if (TN && TN.__kwBT && state.boothOn && !inBooth)"), 'persisted Booth/native Booth gate missing');
assert(source.includes("if (!state.bgOn) {\n        try { ensureEditorEnvironmentBehindBooth(); } catch {}\n      }"), 'Black Canvas gate missing');
assert(source.includes("overlays.backgroundPlane.visible = !!state.persistBackgroundOn;"), 'Background overlay ownership changed');

const registry = Object.fromEntries(manifest.moduleRegistry.map(x => [x.id, x]));
const tools = Object.fromEntries(manifest.tools.map(x => [x.id, x]));
assert(registry['booth-tool'].version === '27.0.2', 'manifest Booth version mismatch');
assert(registry['booth-tool'].build === 'v27.0.2', 'manifest Booth build mismatch');
assert(tools['booth-tool'].url.includes('v=27.0.2-v27.0.2'), 'manifest Booth cache URL mismatch');
assert(registry['booth-black-canvas-display-replay'].version === '0.1.3', 'replay registry changed');
assert(registry['booth-runtime-bootstrap'].version === '0.1.0', 'bootstrap registry changed');

const frameFn = extractFunction('getShaderFramePlane');
{
  const overlayFrame = { visible: true };
  const context = {
    state: { shaderFramePlane: null },
    result: null,
    TN: { shader: { overlays: { framePlane: overlayFrame } } }
  };
  vm.createContext(context);
  vm.runInContext(`${frameFn}\nresult = getShaderFramePlane(TN);`, context);
  assert(context.result === overlayFrame, 'frame fallback did not resolve overlays.framePlane');
  assert(context.state.shaderFramePlane === overlayFrame, 'frame fallback was not cached');
}

const envFn = extractFunction('ensureEditorEnvironmentBehindBooth');
{
  let calls = 0;
  const background = { visible: false };
  const state = { userBoothOn: true, bgOn: false };
  const UW = {
    CK: { environment: { background } },
    BT: { display: { environment: { setDefaultEnvironmentVisibility(value) { calls += 1; background.visible = !!value; } } } }
  };
  const context = { state, UW, result: null };
  vm.createContext(context);
  vm.runInContext(`${envFn}\nresult = ensureEditorEnvironmentBehindBooth();`, context);
  assert(context.result === true, 'hidden editor environment was not restored');
  assert(calls === 1 && background.visible === true, 'native environment setter did not run exactly once');

  vm.runInContext('result = ensureEditorEnvironmentBehindBooth();', context);
  assert(context.result === false && calls === 1, 'environment setter repeated after visibility was restored');

  background.visible = false;
  state.bgOn = true;
  vm.runInContext('result = ensureEditorEnvironmentBehindBooth();', context);
  assert(context.result === false && calls === 1, 'Black Canvas ON incorrectly restored editor environment');

  state.bgOn = false;
  state.userBoothOn = false;
  vm.runInContext('result = ensureEditorEnvironmentBehindBooth();', context);
  assert(context.result === false && calls === 1, 'Booth OFF incorrectly forced editor environment');
}

console.log('Booth presentation source + behavior mocks: PASS');

const fs = require('fs');
const cp = require('child_process');

const STABLE_BASE = 'f218244b2a6010e4d299ca5641a8d4f6f56f38f9';
const DEV_VALIDATED = 'cecfa43f3ca0096562bb3e9f472c39cbb1823f40';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function read(path) { return fs.readFileSync(path, 'utf8'); }
function show(ref, path) { return cp.execFileSync('git', ['show', `${ref}:${path}`], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }); }
function byId(list) { return Object.fromEntries(list.map(x => [x.id, x])); }
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function cacheBlock(source) {
  const start = source.indexOf('const LOADER_CACHE_SESSION = ');
  const end = source.indexOf('function gmGetText', start);
  assert(start >= 0 && end > start, 'cache helper block missing');
  return source.slice(start, end);
}
function emblem(source) {
  const start = source.indexOf('const COMPACT_EMBLEM_URL = "');
  const endMarker = '";\nconst TOOL_ENABLE_PREFIX';
  const end = source.indexOf(endMarker, start);
  assert(start >= 0 && end > start, 'emblem constant boundary missing');
  return source.slice(start, end + 2);
}

const shell = read('Witch_Dock.user.js');
const baseShell = show(STABLE_BASE, 'Witch_Dock.user.js');
const devShell = show(DEV_VALIDATED, 'Witch_Dock_DEV.user.js');

assert(shell.includes('// @name         Witch Dock v1.2.1'), 'public userscript name/version label not 1.2.1');
assert(shell.includes('// @version      1.2.1'), 'public @version not 1.2.1');
assert(cacheBlock(shell) === cacheBlock(devShell), 'public cache helper block differs from validated Dev block');
assert(emblem(shell) === emblem(baseShell), 'public emblem payload changed');
assert(shell.includes('gmGetText(kwManifestRequestUrl())'), 'manifest cache-key request missing');
assert(shell.includes('const registryById = new Map();'), 'registry identity map missing');
assert(shell.includes('const registryEntry = registryById.get(id) || null;'), 'module registry lookup missing');
assert(shell.includes('gmGetText(kwModuleRequestUrl(t, registryEntry))'), 'module cache-key request missing');
assert(shell.includes('headers: { "Cache-Control": "no-cache" }'), 'existing no-cache request header lost');
assert(!shell.includes('WITCH_DEV_UI'), 'public shell references Dev branch');

const manifest = JSON.parse(read('manifest.json'));
const baseManifest = JSON.parse(show(STABLE_BASE, 'manifest.json'));
const reg = byId(manifest.moduleRegistry);
const baseReg = byId(baseManifest.moduleRegistry);
const tools = byId(manifest.tools);
const baseTools = byId(baseManifest.tools);

assert(reg['witch-dock-core'].version === '1.2.1', 'core manifest version mismatch');
assert(reg['witch-dock-core'].build === '1.2.1-stable-cache-keyed-loader', 'core manifest build mismatch');
assert(reg['booth-runtime-bootstrap'].version === '0.1.0', 'bootstrap version mismatch');
assert(reg['booth-tool'].version === '27.0.4' && reg['booth-tool'].build === 'v27.0.4', 'Booth manifest identity mismatch');
assert(reg['booth-black-canvas-display-replay'].version === '0.1.5', 'replay manifest identity mismatch');
assert(tools['booth-runtime-bootstrap'].hidden === true && tools['booth-runtime-bootstrap'].enabledByDefault === true, 'bootstrap tool flags wrong');
assert(tools['booth-runtime-bootstrap'].url.includes('/Witch_Scripts/features/booth/Booth_Runtime_Bootstrap.js'), 'bootstrap URL not Stable');
assert(tools['booth-tool'].url.includes('/Witch_Scripts/tools/Booth.js'), 'Booth URL not Stable');
assert(tools['booth-black-canvas-display-replay'].url.includes('/Witch_Scripts/features/booth/Black_Canvas_Display_Replay.js'), 'replay URL not Stable');
assert(!tools['booth-runtime-bootstrap'].url.includes('WITCH_DEV_UI'), 'bootstrap URL points Dev');
assert(!tools['booth-tool'].url.includes('WITCH_DEV_UI'), 'Booth URL points Dev');
assert(!tools['booth-black-canvas-display-replay'].url.includes('WITCH_DEV_UI'), 'replay URL points Dev');

const regOrder = manifest.moduleRegistry.map(x => x.id);
const toolOrder = manifest.tools.map(x => x.id);
assert(regOrder.indexOf('booth-runtime-bootstrap') < regOrder.indexOf('booth-tool'), 'bootstrap registry order is not before Booth');
assert(toolOrder.indexOf('booth-runtime-bootstrap') < toolOrder.indexOf('booth-tool'), 'bootstrap load order is not before Booth');
for (const tool of manifest.tools) {
  assert(reg[tool.id], `tool ${tool.id} missing moduleRegistry identity`);
}

const affectedRegistry = new Set(['witch-dock-core', 'booth-runtime-bootstrap', 'booth-tool', 'booth-black-canvas-display-replay']);
for (const entry of baseManifest.moduleRegistry) {
  if (affectedRegistry.has(entry.id)) continue;
  assert(reg[entry.id] && same(reg[entry.id], entry), `unrelated registry entry changed: ${entry.id}`);
}
const affectedTools = new Set(['booth-runtime-bootstrap', 'booth-tool', 'booth-black-canvas-display-replay']);
for (const entry of baseManifest.tools) {
  if (affectedTools.has(entry.id)) continue;
  assert(tools[entry.id] && same(tools[entry.id], entry), `unrelated tool entry changed: ${entry.id}`);
}

for (const path of [
  'tools/Booth.js',
  'features/booth/Black_Canvas_Display_Replay.js',
  'features/booth/Booth_Runtime_Bootstrap.js'
]) {
  assert(read(path) === show(DEV_VALIDATED, path), `promoted runtime is not exact validated Dev bytes: ${path}`);
}

const booth = read('tools/Booth.js');
assert(booth.includes("const BUILD_TAG = 'v27.0.4';"), 'Booth source build mismatch');
assert(!booth.includes('kwBoothBlackCanvasMatte'), 'rejected DOM matte remains');
assert(!booth.includes('maker.getTokenViewOffset('), 'rejected token crop runtime call remains');
assert(booth.includes('requestBTComponentRenderRefresh()'), 'narrow component render refresh missing');
assert(booth.includes("background.mesh"), 'actual background mesh restoration path missing');

const replay = read('features/booth/Black_Canvas_Display_Replay.js');
assert(replay.includes("const VERSION = '0.1.5';"), 'replay source version mismatch');
assert(replay.includes('KW_WD_BOOTH_DIAG'), 'Stable diagnostic fallback missing from promoted replay');
assert(replay.includes('reassertThroughBoothApiWithHandoff'), 'replay handoff repair missing');
assert(replay.includes('CK.environment.background'), 'pre-BT background path missing');

const bootstrap = read('features/booth/Booth_Runtime_Bootstrap.js');
assert(bootstrap.includes("const VERSION = '0.1.0';"), 'bootstrap source version mismatch');
assert(bootstrap.includes('BT.setBoothMode'), 'named Booth activation seam missing');
assert(bootstrap.includes('/gated/booth.js'), 'native gated Booth loader missing');

const master = read('MASTER.md');
const changelog = read('CHANGELOG.md');
const preflight = read('PRE_FLIGHT_Check.md');
assert(master.includes('approximately 1 px checkerboard seam'), 'deferred seam missing from MASTER');
assert(master.includes('Do not continue Black Canvas investigation merely because the deferred seam exists.'), 'move-on gate missing from MASTER');
assert(changelog.includes('DOCK-2026-09-07-027'), 'release changelog entry missing');
assert(preflight.includes('PFC-2026-09-07-027'), 'release preflight entry missing');
assert(read('HISTORY/BULLSHIT/MANIFEST_AND_LOADING.md').includes('Public cache-keyed loader repair'), 'loader history missing');
assert(read('HISTORY/BULLSHIT/BOOTH_RUNTIME_BOOTSTRAP.md').includes('Status: Public Stable'), 'bootstrap public history status missing');

console.log('Public Stable Booth/cache promotion validation: PASS');

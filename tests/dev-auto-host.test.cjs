const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const hostSource = fs.readFileSync('devtools/Witch_Dock_DEV_Auto_Host.user.js', 'utf8');
const launcherSource = fs.readFileSync('Witch_Dock_DEV.user.js', 'utf8');

assert.doesNotThrow(() => new Function(hostSource), 'auto host parses');
assert.match(hostSource, /const HOST_VERSION = "0\.1\.0";/);
assert.match(hostSource, /const TARGET_BRANCH = "wd\/10-modular-bootstrap";/);

const metadata = text => text.match(/^\/\/ ==UserScript==\s*\n([\s\S]*?)^\/\/ ==\/UserScript==\s*$/m)[1];
const grants = text => [...metadata(text).matchAll(/^\/\/\s+@grant\s+(\S+)\s*$/gm)].map(match => match[1]);
const hostGrants = new Set(grants(hostSource));
for (const grant of grants(launcherSource)) assert.ok(hostGrants.has(grant), `host grants ${grant}`);

const fixture = launcherSource
  .replace(/^\/\/ @version\s+\S+$/m, '// @version      1.5.1')
  .replace(
    /\(function \(\) \{[\s\S]*$/,
    '(function () { const DEV_VERSION = "1.5.1"; const DEV_BRANCH = "WITCH_DEV_MAIN"; unsafeWindow.__autoHostFixture = { version: GM_info.script.version, name: GM_info.script.name, declaredVersion: DEV_VERSION, branch: DEV_BRANCH }; })();\\n'
  );

const nodes = new Map();
const document = {
  body: { appendChild(node) { nodes.set(node.id, node); } },
  documentElement: { appendChild(node) { nodes.set(node.id, node); } },
  getElementById(id) { return nodes.get(id) || null; },
  createElement() { return { style: {}, remove() {} }; }
};
const unsafeWindow = {};
const sandbox = {
  console,
  document,
  unsafeWindow,
  window: unsafeWindow,
  setTimeout,
  clearTimeout,
  GM_info: { script: { name: 'WITCH DOCK - DEV AUTO HOST', version: '0.1.1' } },
  GM_addStyle() {},
  GM_setClipboard() {},
  GM_getValue() {},
  GM_setValue() {},
  GM_download() {},
  GM_xmlhttpRequest(options) {
    setImmediate(() => options.onload({ status: 200, responseText: fixture }));
  }
};
vm.runInNewContext(hostSource, sandbox, { filename: 'Witch_Dock_DEV_Auto_Host.user.js' });

setTimeout(() => {
  assert.deepEqual(
    JSON.parse(JSON.stringify(unsafeWindow.__autoHostFixture)),
    { version: '1.5.1', name: 'WITCH DOCK - DEV', declaredVersion: '1.5.1', branch: 'WITCH_DEV_MAIN' },
    'payload receives its own script identity'
  );
  const state = unsafeWindow.KWWitchDockDevAutoHost.getState();
  assert.equal(state.status, 'launcher-executed');
  assert.equal(state.payloadVersion, '1.5.1');
  assert.equal(state.attempts, 1);
  assert.equal(nodes.size, 0, 'successful load adds no error UI');
  console.log('Witch Dock Dev auto-host checks passed');
}, 25);

const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('HeroForge_UI/Corrected_Bound_Decal_Gizmo.js', 'utf8');
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

assert(source.includes('1.1.1-dev-fresh-slot-normalization'));
assert(source.includes('const BOGUS_BOUND_DEFAULTS = Object.freeze(['));
assert(source.includes('v: 1.5039421170949936'));
assert(source.includes('s: 1.768586891036554'));
assert(source.includes('v: 1.56'));
assert(source.includes('s: 1.82'));
assert(source.includes('const BOGUS_BOUND_TOLERANCE = 0.025;'));
assert(source.includes('patchRecord.h = 0;'));
assert(source.includes('patchRecord.v = 0;'));
assert(source.includes('patchRecord.s = -1.5;'));
assert(source.includes('patchRecord.sy = -1.5;'));
assert(!source.includes('patchRecord.s = 0;\n            patchRecord.sy = 0;'));

const reg = manifest.moduleRegistry.find(x => x.id === 'corrected-bound-decal-gizmo');
assert(reg);
assert.strictEqual(reg.version, '1.1.1');
assert.strictEqual(reg.build, '1.1.1-dev-fresh-slot-normalization');
const tool = manifest.tools.find(x => x.id === 'corrected-bound-decal-gizmo');
assert(tool);
assert(tool.url.includes('/WITCH_DEV_UI/HeroForge_UI/Corrected_Bound_Decal_Gizmo.js'));
assert(tool.url.includes('v=1.1.1-dev-fresh-slot-normalization'));

const profiles = [
  { v: 1.5039421170949936, s: 1.768586891036554, sy: 1.768586891036554 },
  { v: 1.56, s: 1.82, sy: 1.82 }
];
const tol = 0.025;
const near = (v, t) => Number.isFinite(Number(v)) && Math.abs(Number(v) - t) <= tol;
function matches(record) {
  if (!record || record.forceProjectedScript !== false) return false;
  const neutralish = ['h','d','a','i','u'].every(key => {
    const value = record[key];
    return value == null || (Number.isFinite(Number(value)) && Math.abs(Number(value)) <= 0.08);
  });
  return neutralish && profiles.some(sig => near(record.v,sig.v) && near(record.s,sig.s) && near(record.sy,sig.sy));
}
assert(matches({forceProjectedScript:false,h:0,v:1.5039421171,d:0,s:1.768586891,sy:1.768586891,a:0}));
assert(matches({forceProjectedScript:false,h:0,v:1.56,d:0,s:1.82,sy:1.82,a:0}));
assert(matches({forceProjectedScript:false,h:0,v:1.545,d:0,s:1.80,sy:1.80,a:0}));
assert(!matches({forceProjectedScript:true,h:0,v:1.56,d:0,s:1.82,sy:1.82,a:0}));
assert(!matches({forceProjectedScript:false,h:0.25,v:1.56,d:0,s:1.82,sy:1.82,a:0}));
assert(!matches({forceProjectedScript:false,h:0,v:0.5,d:0,s:-0.5,sy:-0.5,a:0}));

const untouched = {forceProjectedScript:false,h:0.01,v:1.56,d:0.2,s:1.82,sy:1.82,a:0.1,sz:2,id:123};
const patch = {};
patch.h = 0;
patch.v = 0;
patch.s = -1.5;
patch.sy = -1.5;
const normalized = {...untouched, ...patch};
assert.strictEqual(normalized.h, 0);
assert.strictEqual(normalized.v, 0);
assert.strictEqual(normalized.s, -1.5);
assert.strictEqual(normalized.sy, -1.5);
assert.strictEqual(normalized.d, 0.2);
assert.strictEqual(normalized.a, 0.1);
assert.strictEqual(normalized.sz, 2);

console.log('fresh-slot gizmo validator: PASS');

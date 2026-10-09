const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
class Vec2{constructor(x,y){this.x=x;this.y=y;}}
class Vec4{constructor(x,y,z,w){Object.assign(this,{x,y,z,w});}}
function layer(x){let uniform={l0_uvTranslate:{value:new Vec2(x,-1.3523384900661357)},l0_uvRotateScale:{value:new Vec4(26.460396188044154,0,0,26.460396188044154)},l0_projected:{value:0},l0_uvSet2:{value:0}};return {uniforms:uniform,setUniform(name,value){uniform[name].value=value}};}
const rows=[];for(let i=0;i<5;i++)rows.push({mapping:i,id:1});rows[3]={mapping:7,id:1195};rows[4]={mapping:8,id:1195};
const mats=[];mats[3]=layer(-11.674714896672224);mats[4]=layer(-13.791546591715758);
const original=[mats[3],mats[4]].map(x=>({t:x.uniforms.l0_uvTranslate.value,m:x.uniforms.l0_uvRotateScale.value}));
let calls=[];let fail=false;
const display={data:{meta:{character_name:'D5 OCT'},parts:{bodyUpper:1963},decals:{bodyUpper:{7:{id:1195,h:-.04,v:-.43,s:-4.78},8:{id:1195,h:.04,v:-.43,s:-4.78}}}},modded:{orderedDecals:{bodyUpper:rows}},meshes:{bodyUpper:{bakeMaterials:{colorDecals:mats}}},colorBake:{getBakeMeshes:(which)=>{assert.equal(which,'color');return {bodyUpper:{}}},atlasBaker:{bakeAtlas:(which,meshes)=>{calls.push('atlas');if(fail)throw Error('Test atlas failure')},dilate:()=>{calls.push('dilate')}}}};
const registered=[];const sandbox={window:{setTimeout:()=>{},WitchDock:{registerTool(tool){registered.push(tool)}},RK:{Vec2,Vec4},CK:{character:{display}}},console,setTimeout:(fn)=>{return setTimeout(fn,5e3)},clearTimeout};
vm.runInNewContext(fs.readFileSync(__dirname+'/../tools/Decals.js','utf8'),sandbox);
const cap=sandbox.window.KWLegacyTorsoUVPreview;
assert.ok(cap);
assert.equal(registered[0].id,'decals-dev');
const before=JSON.stringify(display.data.decals);
const opts={scale:.94,pivotU:.5,pivotV:.5,nudgeU:0,nudgeV:0};
const plan=cap.plannedUniforms(original[0].t,original[0].m,opts);
assert.ok(Math.abs(plan.oldCenter.x-0.4601108316803374)<1e-12);
assert.ok(Math.abs(plan.center.x-(.5+.94*(plan.oldCenter.x-.5)))<1e-12);
assert.ok(Math.abs(plan.matrix.x-26.460396188044154/.94)<1e-12);
const result=cap.preview(opts,[7,8]);assert.equal(result.mappings.length,2);assert.equal(cap.getState().previewActive,true);
assert.notStrictEqual(mats[3].uniforms.l0_uvTranslate.value,original[0].t);
assert.equal(JSON.stringify(display.data.decals),before,'character saved data immutable');
const restored=cap.revert();assert.equal(restored.restored,2);
assert.strictEqual(mats[3].uniforms.l0_uvTranslate.value,original[0].t);
assert.strictEqual(mats[4].uniforms.l0_uvRotateScale.value,original[1].m);
assert.deepEqual(calls,['atlas','dilate','atlas','dilate']);
const single=cap.preview(opts,[7]);assert.equal(single.mappings.length,1);cap.revert();
assert.throws(()=>cap.preview({...opts,scale:.7},[7]),/bounded/);
assert.equal(cap.getState().previewActive,false);
assert.throws(()=>cap.preview(opts,[5]),/Select/);
fail=true;assert.throws(()=>cap.preview(opts,[7]),/Test atlas failure/);
assert.equal(cap.getState().previewActive,false);
assert.strictEqual(mats[3].uniforms.l0_uvTranslate.value,original[0].t);
assert.equal(JSON.stringify(display.data.decals),before);
console.log('PASS: pure UV remap transform preserves centers and bounded scale');
console.log('PASS: selected two / single layers preview and reversible renderer-only atlas bake');
console.log('PASS: saved coordinates unchanged, invalid input rejected, native bake failure rolled back');
console.log('PASS: returned original material vector identity after rollback');

fail=false;
const bake=display.colorBake.atlasBaker;
bake.getRGBATarget=()=>({isWebGLRenderTarget:true,width:16,height:16});
bake.atlasTargetKeys={color:{bodyUpper:"start"}};
bake.bakeAtlas=(which,meshes)=>{bake.atlasTargetKeys.color.bodyUpper=String(mats[3].uniforms.l0_uvTranslate.value.x)};
display.atlas={getUV:()=>({x:0,y:0,z:1,w:1})};
sandbox.window.CK.renderManager={renderer:{readRenderTargetPixels(target,x,y,w,h,pixels){
  assert.equal(w,16);assert.equal(h,16);
  const vivid=mats[3].uniforms.colors0 && mats[3].uniforms.colors0.value[3].x === 0 ? 97 : 0;
  const v=(Math.round(mats[3].uniforms.l0_uvTranslate.value.x*10000)+vivid) & 255;
  for(let i=0;i<pixels.length;i++)pixels[i]=(i*7+v)&255;
}}};
const proof=cap.probePixels(opts,[7,8]);
assert.equal(proof.width,16);assert.equal(proof.height,16);
assert.ok(proof.previewVsOriginal.changedPixels>0, 'GPU pixels should change');
assert.equal(proof.restoredVsOriginal.changedPixels,0,'GPU pixels must restore');
assert.ok(proof.originalNonzero>0);
assert.strictEqual(mats[3].uniforms.l0_uvTranslate.value,original[0].t);
assert.equal(JSON.stringify(display.data.decals),before);
console.log('PASS: actual GPU readback probe changed and reversion verified without saved data edits');

mats.forEach(mat=>{
  if (!mat) return;
  mat.uniforms.colors0={value:[
    new Vec4(1,1,1,1),new Vec4(.945,.929,1,1),
    new Vec4(1,1,1,1),new Vec4(1,0,0,.21176470588235294)
  ]};
});
const originalPalette=mats[3].uniforms.colors0.value;
const vivid=cap.probePixels({...opts,highContrast:true},[7,8]);
assert.ok(vivid.previewVsOriginal.changedPixels>0);
assert.equal(vivid.restoredVsOriginal.changedPixels,0);
assert.strictEqual(mats[3].uniforms.colors0.value,originalPalette);
assert.equal(JSON.stringify(display.data.decals),before);
const vividOnce=cap.preview({...opts,highContrast:true},[7,8]);
assert.equal(vividOnce.highContrast,true);
assert.notStrictEqual(mats[3].uniforms.colors0.value,originalPalette);
assert.strictEqual(mats[3].uniforms.colors0.value[0].y,1);
const restoredAgain=cap.revert();
assert.equal(restoredAgain.restored,2);
assert.strictEqual(mats[3].uniforms.colors0.value,originalPalette);
assert.throws(()=>cap.preview({...opts,highContrast:"yes"},[7]),/contrast flag/);
assert.equal(JSON.stringify(display.data.decals),before);
console.log('PASS: vivid diagnostic palette changed GPU pixels and restored exact original object');
console.log('PASS: contrast preview only accepts boolean flag, restores all saved data');

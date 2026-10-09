const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
class Vec2{constructor(x,y){this.x=x;this.y=y;}}
class Vec3{constructor(x,y,z){Object.assign(this,{x,y,z});}}
class Vec4{constructor(x,y,z,w){Object.assign(this,{x,y,z,w});}}
function layer(x){let uniform={l0_uvTranslate:{value:new Vec2(x,-1.3523384900661357)},l0_uvRotateScale:{value:new Vec4(26.460396188044154,0,0,26.460396188044154)},l0_projected:{value:0},l0_uvSet2:{value:0}};return {uniforms:uniform,setUniform(name,value){uniform[name].value=value}};}
const rows=[{mapping:99,id:1625},{mapping:2,id:22968},{mapping:3,id:22968},...[7,8,9,10,12].map(mapping=>({mapping,id:1195})),{mapping:13,id:1178},{mapping:14,id:1178}];
const mats=[];mats[8]=layer(5.822999337374146);mats[8].uniforms.l0_uvTranslate.value.y=23.69895812226639;mats[8].uniforms.l0_uvRotateScale.value=new Vec4(-32.887114976191086,0,0,-32.887114976191086);mats[9]=layer(-10.100265691295313);mats[9].uniforms.l0_uvTranslate.value.y=-22.791307980916123;mats[9].uniforms.l0_uvRotateScale.value=new Vec4(32.887114976191086,0,0,32.887114976191086);
const original=[mats[8],mats[9]].map(x=>({t:x.uniforms.l0_uvTranslate.value,m:x.uniforms.l0_uvRotateScale.value}));
let calls=[];let fail=false;
const display={data:{meta:{character_name:'D5 OCT'},parts:{bodyUpper:1963},decals:{bodyUpper:{7:{id:1195},8:{id:1195},9:{id:1195},10:{id:1195},12:{id:1195},13:{id:1178,h:-.3381433171858332,v:.2054117741571864,s:-5.301546897272633},14:{id:1178,h:-.17767723927837797,v:.20821986050701233,s:-5.301546897272633}}}},modded:{orderedDecals:{bodyUpper:rows}},meshes:{bodyUpper:{bakeMaterials:{colorDecals:mats}}},colorBake:{getBakeMeshes:(which)=>{assert.equal(which,'color');return {bodyUpper:{}}},atlasBaker:{bakeAtlas:(which,meshes)=>{calls.push('atlas');if(fail)throw Error('Test atlas failure')},dilate:()=>{calls.push('dilate')}}}};
const registered=[];const scheduled=[];const sandbox={window:{setTimeout:()=>{},WitchDock:{registerTool(tool){registered.push(tool)}},RK:{Vec2,Vec3,Vec4},CK:{character:{display}}},console,setTimeout:(fn)=>{scheduled.push(fn);return scheduled.length},clearTimeout:()=>{}};
vm.runInNewContext(fs.readFileSync(__dirname+'/../tools/Decals.js','utf8'),sandbox);
const cap=sandbox.window.KWLegacyTorsoUVPreview;
assert.ok(cap);
assert.equal(registered[0].id,'decals-dev');
const before=JSON.stringify(display.data.decals);
const opts={scale:.94,pivotU:.5,pivotV:.5,nudgeU:0,nudgeV:0};
const plan=cap.plannedUniforms(original[0].t,original[0].m,opts);
assert.ok(Math.abs(plan.oldCenter.x-((.5-5.822999337374146)/-32.887114976191086))<1e-12);
assert.ok(Math.abs(plan.center.x-(.5+.94*(plan.oldCenter.x-.5)))<1e-12);
assert.ok(Math.abs(plan.matrix.x-(-32.887114976191086/.94))<1e-12);
const result=cap.preview(opts,[13,14]);assert.equal(result.mappings.length,2);assert.equal(cap.getState().previewActive,true);assert.equal(scheduled.length,0,'no automatic timeout scheduled');
assert.notStrictEqual(mats[8].uniforms.l0_uvTranslate.value,original[0].t);
assert.equal(JSON.stringify(display.data.decals),before,'character saved data immutable');
const restored=cap.revert();assert.equal(restored.restored,2);
assert.strictEqual(mats[8].uniforms.l0_uvTranslate.value,original[0].t);
assert.strictEqual(mats[9].uniforms.l0_uvRotateScale.value,original[1].m);
assert.deepEqual(calls,['atlas','dilate','atlas','dilate']);
const single=cap.preview(opts,[13]);assert.equal(single.mappings.length,1);cap.revert();
assert.throws(()=>cap.preview({...opts,scale:.7},[13]),/bounded/);
assert.equal(cap.getState().previewActive,false);
assert.throws(()=>cap.preview(opts,[5]),/Select/);assert.throws(()=>cap.preview(opts,[7]),/Select/);assert.throws(()=>cap.preview(opts,[8]),/Select/);
fail=true;assert.throws(()=>cap.preview(opts,[13]),/Test atlas failure/);
assert.equal(cap.getState().previewActive,false);
assert.strictEqual(mats[8].uniforms.l0_uvTranslate.value,original[0].t);
assert.equal(JSON.stringify(display.data.decals),before);
console.log('PASS: pure UV remap transform preserves centers and bounded scale');
console.log('PASS: manual-lifetime two/single previews without expiry timer, reversible atlas bake');
console.log('PASS: saved coordinates unchanged, invalid input rejected, native bake failure rolled back');
console.log('PASS: returned original material vector identity after rollback');

fail=false;
const bake=display.colorBake.atlasBaker;
bake.getRGBATarget=()=>({isWebGLRenderTarget:true,width:16,height:16});
bake.atlasTargetKeys={color:{bodyUpper:"start"}};
bake.bakeAtlas=(which,meshes)=>{bake.atlasTargetKeys.color.bodyUpper=String(mats[8].uniforms.l0_uvTranslate.value.x)};
display.atlas={getUV:()=>({x:0,y:0,z:1,w:1})};
sandbox.window.CK.renderManager={renderer:{readRenderTargetPixels(target,x,y,w,h,pixels){
  assert.equal(w,16);assert.equal(h,16);
  const vivid=mats[8].uniforms.colors0 && mats[8].uniforms.colors0.value[3].x === 0 ? 97 : 0;
  const v=(mats[8].uniforms.l0_uvTranslate.value===original[0].t ? 0 : 47)+vivid;
  for(let i=0;i<pixels.length;i++)pixels[i]=(i*7+v)&255;
}}};
const proof=cap.probePixels(opts,[13,14]);
assert.equal(proof.width,16);assert.equal(proof.height,16);
assert.ok(proof.previewVsOriginal.changedPixels>0, 'GPU pixels should change');
assert.equal(proof.restoredVsOriginal.changedPixels,0,'GPU pixels must restore');
assert.ok(proof.originalNonzero>0);
assert.strictEqual(mats[8].uniforms.l0_uvTranslate.value,original[0].t);
assert.equal(JSON.stringify(display.data.decals),before);
console.log('PASS: actual GPU readback probe changed and reversion verified without saved data edits');

mats.forEach(mat=>{
  if (!mat) return;
  mat.uniforms.colors0={value:[
    new Vec3(1,.8431372549019608,.8666666666666667),new Vec3(1,.8901960784313725,.9215686274509803),
    new Vec3(1,.8901960784313725,.9686274509803922),new Vec4(1,0,0,0)
  ]};
});
const originalPalette=mats[8].uniforms.colors0.value;
const vivid=cap.probePixels({...opts,highContrast:true},[13,14]);
assert.ok(vivid.previewVsOriginal.changedPixels>0);
assert.equal(vivid.restoredVsOriginal.changedPixels,0);
assert.strictEqual(mats[8].uniforms.colors0.value,originalPalette);
assert.equal(JSON.stringify(display.data.decals),before);
const vividOnce=cap.preview({...opts,highContrast:true},[13,14]);
assert.equal(vividOnce.highContrast,true);
assert.notStrictEqual(mats[8].uniforms.colors0.value,originalPalette);
assert.strictEqual(mats[8].uniforms.colors0.value[0].y,1);
const restoredAgain=cap.revert();
assert.equal(restoredAgain.restored,2);
assert.strictEqual(mats[8].uniforms.colors0.value,originalPalette);
assert.throws(()=>cap.preview({...opts,highContrast:"yes"},[13]),/contrast flag/);
rows[8].id=1195;assert.throws(()=>cap.preview(opts,[13]),/not eligible/);rows[8].id=1178;
display.data.decals.bodyUpper[13].id=1195;assert.throws(()=>cap.preview(opts,[13]),/not eligible/);display.data.decals.bodyUpper[13].id=1178;
assert.equal(JSON.stringify(display.data.decals),before);
const extended=cap.preview(opts,[13,14]);
const outsideTranslation=new Vec2(42,21);
mats[8].setUniform("l0_uvTranslate",outsideTranslation);
const selectiveRestore=cap.revert();
assert.equal(selectiveRestore.restored,2);
assert.strictEqual(mats[8].uniforms.l0_uvTranslate.value,outsideTranslation,'manual revert preserves newer native uniform');
assert.strictEqual(mats[8].uniforms.l0_uvRotateScale.value,original[0].m);
mats[8].setUniform("l0_uvTranslate",original[0].t);
assert.equal(cap.getState().previewActive,false);
assert.equal(scheduled.length,0,'no automatic expiry after multiple previews');
assert.equal(JSON.stringify(display.data.decals),before);
console.log('PASS: long-lived preview preserves later native shader changes');
console.log('PASS: vivid diagnostic palette changed GPU pixels and restored exact original object');
console.log('PASS: contrast preview only accepts boolean flag, restores all saved data');

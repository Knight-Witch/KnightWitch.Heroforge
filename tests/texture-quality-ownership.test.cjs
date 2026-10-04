const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=name=>fs.readFileSync(path.join(__dirname,'../features/rendering/',name),'utf8');
function decalHarness(scales){
 const data={atlasScale:scales,decals:{chest:[{}]}};
 const display={data,modded:{parts:{chest:{}}}};
 const core={enabled:false,busy:false,enable:async()=>{core.enabled=true;return true},disable:async()=>{core.enabled=false;return true},reconcile:async()=>true,refresh:()=>({enabled:core.enabled,busy:false}),setPersistent:x=>x,getState:()=>({})};
 const w={CK:{Settings:{textureWidthMax:4096,textureHeightMax:4096},character:{data,display,allDisplays:{}}},KWTextureQualityNativeReconcile:core};
 const gl={MAX_TEXTURE_SIZE:1,getParameter:()=>16384,getExtension:()=>({loseContext(){}})};
 vm.runInNewContext(source('Texture_Quality_Active_Decal_Priority.js'),{window:w,document:{createElement:()=>({getContext:()=>gl})},console});
 return {w,core,data};
}
test('manual decal scale stays above priority floor and survives OFF',async()=>{
 const h=decalHarness({chest:8});await h.core.enable();assert.equal(h.data.atlasScale.chest,8);await h.core.disable();assert.equal(h.data.atlasScale.chest,8);assert.equal(h.w.CK.Settings.textureWidthMax,4096);
});
test('owned scale restores absent property, later outside edits retain ownership',async()=>{
 const h=decalHarness({});await h.core.enable();assert.equal(h.data.atlasScale.chest,4);await h.core.disable();assert.equal(Object.hasOwn(h.data.atlasScale,'chest'),false);
 await h.core.enable();h.data.atlasScale.chest=7;h.core.refresh();await h.core.disable();assert.equal(h.data.atlasScale.chest,7);
});
test('outside lower scale becomes new rollback baseline',async()=>{
 const h=decalHarness({chest:2});await h.core.enable();h.data.atlasScale.chest=3;h.core.refresh();assert.equal(h.data.atlasScale.chest,4);await h.core.disable();assert.equal(h.data.atlasScale.chest,3);
});
test('automatic enable reaches wrapped public entry after existing readiness gate',async()=>{
 let clock=100;const atlas={width:4096,height:4096,getUV:()=>({z:.25,w:.25})};
 const part={id:1,name:'part',getMaskPath(){}};const parts={bodyLower:part,bodyUpper:part,face:part};
 const data={atlasScale:{},change(){}};const m={parts,resourceAtlas:atlas,buildAtlas(){}};
 const display={data,modded:m,meshes:{bodyLower:{},bodyUpper:{}},atlas,resourcesReady:true,finished:true};
 const w={CK:{character:{data,display,refresh(){},allDisplays:{}},Resources:{getResource(){},getNow(){}}},localStorage:{getItem:()=>null,setItem(){}}};
 const tasks=[];const ctx={window:w,document:{hidden:false,visibilityState:'visible',addEventListener(){},removeEventListener(){}},console,Date:{now:()=>clock},setTimeout:(fn,ms)=>{tasks.push(()=>{clock+=ms;fn()})}};
 vm.runInNewContext(source('Texture_Quality_Native_Reconcile.js'),ctx);
 const api=w.KWTextureQualityNativeReconcile;let calls=0;api.enable=async opts=>{calls++;assert.equal(opts.automatic,true);return true};
 api.setPersistent(true);
 for(let i=0;i<30&&!calls;i++){await Promise.resolve();if(tasks.length)tasks.shift()();}
 assert.equal(calls,1);assert.ok(clock>=1300,'existing stable-readiness delay retained');
});

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'features/booth/Booth_Runtime_Bootstrap.js'), 'utf8');

function createFixture({ manifest = 'booth.b9ab74dd25ad.js', outcomes = ['load'], nativeTag = false } = {}) {
  let now = 10000;
  const timerQueue = [];
  const scripts = [];
  const appliedModes = [];
  let attempt = 0;
  class FakeDate extends Date { static now() { return now; } }
  const fakeScript = (src, status, owned = false) => {
    const attrs = { src, 'data-status': status };
    if (owned) attrs['data-kw-booth-runtime-bootstrap'] = '1';
    return {
      src: 'https://www.heroforge.com' + src, parentElement: {tagName:'BODY'}, dataset: {}, 
      getAttribute: (k) => attrs[k] || null,
      setAttribute: (k,v) => {attrs[k] = String(v);},
      remove() { const idx=scripts.indexOf(this); if(idx>=0) scripts.splice(idx,1); }
    };
  };
  if(nativeTag) scripts.push(fakeScript('/gated/'+manifest, 'error',false));
  const data = {custom: {portrait:{lighting:{enabled:true},filters:{tokenBg:{numColors:3}},selected:{tokenBg:3}}}};
  let wantsSession = false;
  const window = {
    CK: {data, Settings: {artVersionNumber:'heroforge06.1.10.13'}},
    ASSET_MANIFEST: manifest ? {booth:manifest} : {},
    KW_WD_BOOTH: {
      getState: () => ({defaultBoothPersistence:true,sessionBoothView:wantsSession}),
      setSessionBooth: (value) => {wantsSession = !!value;}
    }
  };
  const document = {
    get scripts() {return scripts;},
    querySelectorAll(sel) {
      if(sel==='script[data-kw-booth-runtime-bootstrap="1"]') return scripts.filter(x=>x.getAttribute('data-kw-booth-runtime-bootstrap')==='1');
      return [];
    },
    createElement(tag) {
      assert.equal(tag,'script');
      return fakeScript('','loading',true);
    },
    body: { appendChild(node) {
      scripts.push(node);
      const action=outcomes[attempt++]||'error';
      if(action==='load') {
        window.BT={setBoothMode(mode){appliedModes.push(mode); window.BT.liveEngine.enabled=true;},liveEngine:{enabled:false}};
        node.setAttribute('data-status','loaded');
        node.onload();
      } else {
        node.setAttribute('data-status','error');
        node.onerror();
      }
    }}
  };
  const context={ unsafeWindow:window,window,document,location:{origin:'https://www.heroforge.com',href:'https://www.heroforge.com/'},
    performance:{getEntriesByType:()=>[]},Date:FakeDate,URL,console:{log(){}},
    GM_getValue:()=>true,
    setTimeout:(fn,ms)=>{timerQueue.push({fn,ms}); return fn;},
    clearTimeout:()=>{},
    };
  vm.runInNewContext(source, context,{filename:'Booth_Runtime_Bootstrap.js'});
  async function flush() {for(let i=0;i<20;i++)await Promise.resolve();}
  async function poll() {
    assert.ok(timerQueue.length,'expected pending poll');
    const timer=timerQueue.shift();timer.fn();
    await flush();
    return window.KW_WD_BOOTH_BOOTSTRAP.getState();
  }
  return {window,scripts,poll,flush,appliedModes,advance:(value)=>now=value,attemptCount:()=>attempt,now:()=>now};
}

test('native manifest hashed Booth asset loads and initializes without legacy path',async()=>{
  const f=createFixture();
  const before=f.window.KW_WD_BOOTH_BOOTSTRAP.getState();
  assert.equal(before.expectedBoothAssetPath,'/gated/booth.b9ab74dd25ad.js');
  assert.equal(f.scripts.length,0,'read-only getState does not initiate Booth');
  let out;for(let i=0;i<5;i++){out=await f.poll();if(out.bootstrapCount)break;}
  assert.equal(out.bootstrapCount,1, JSON.stringify(out));
  assert.equal(out.btPresent,true);
  assert.deepEqual(f.appliedModes,['portrait']);
  assert.equal(f.scripts[0].getAttribute('src'),'/gated/booth.b9ab74dd25ad.js');
  assert.equal(out.duplicateBoothScriptCount,0);
});
test('failed bootstrap tag is cleaned on bounded retry; native tags remain owned',async()=>{
  const f=createFixture({outcomes:['error','load']});
  let out;for(let i=0;i<5;i++){out=await f.poll();if(out.failedBootstraps)break;}
  assert.equal(out.failedBootstraps,1);
  assert.equal(f.attemptCount(),1);
  assert.equal(f.scripts[0].getAttribute('data-status'),'error');
  await f.poll();
  assert.equal(f.attemptCount(),1,'no instant retry storm');
  f.advance(out.nextRetryAt+1);
  for(let i=0;i<5;i++){out=await f.poll();if(out.bootstrapCount)break;}
  assert.equal(out.bootstrapCount,1);
  assert.equal(out.failedBootstraps,0);
  assert.equal(f.scripts.length,1,'failed owned tag removed');
  assert.equal(f.scripts[0].getAttribute('data-status'),'loaded');
  const n=createFixture({nativeTag:true});
  for(let i=0;i<5;i++)await n.poll();
  assert.equal(n.scripts.length,1,'must not delete native error tag');
  assert.equal(n.attemptCount(),0,'must not supersede native error tag');
});
test('native version fallback preserved if manifest has no booth entry',()=>{
  const f=createFixture({manifest:null});
  assert.equal(f.window.KW_WD_BOOTH_BOOTSTRAP.getState().expectedBoothAssetPath,
    '/gated/booth.js?version=heroforge06.1.10.13');
});
test('manifest and Dev versions are paired',()=>{
  const m=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
  const reg=m.moduleRegistry.find(x=>x.id==='booth-runtime-bootstrap');
  const loader=m.modules.find(x=>x.id==='booth-runtime-bootstrap');
  const launch=m.moduleRegistry.find(x=>x.id==='witch-dock-dev-launcher');
  const userscript=fs.readFileSync(path.join(root,'Witch_Dock_DEV.user.js'),'utf8');
  assert.equal(reg.version,'0.2.3');
  assert.ok(loader.url.endsWith('v='+reg.build));
  assert.match(launch.version,/^\d+\.\d+\.\d+$/);
  assert.ok(userscript.includes('@version      '+launch.version));
  assert.ok(userscript.includes('const DEV_VERSION = "'+launch.version+'"'));
  assert.ok(userscript.includes('const DEV_BUILD = "'+launch.build+'"'));
});

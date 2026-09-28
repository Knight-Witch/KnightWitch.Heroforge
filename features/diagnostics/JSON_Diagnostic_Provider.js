(function () {
  "use strict";
  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const FEATURE_ID="json-diagnostic-provider", PROVIDER_ID="json", PROVIDER_SCHEMA_VERSION=1, VERSION="0.1.0", BUILD="0.1.0-bulk-reck-compat", MAX_REGISTER_TRIES=120, EVENT_LIMIT=12, ERROR_WINDOW_MS=2200;
  if (UW.KWJSONDiagnosticProvider && UW.KWJSONDiagnosticProvider.build === BUILD) return;
  let registered=false, registerTries=0, timer=null, pendingOperation=null;
  const characterEvents=[];
  function core(){return UW.KWWitchDockDiagnostics||null;}
  function toolApi(){return UW.KWJSONToolDiagnostics||null;}
  function boundedText(v,m){if(v==null)return null;const s=String(v),l=Number(m)||700;return s.length>l?s.slice(0,l)+"…":s;}
  function pushEvent(row){characterEvents.push(row);while(characterEvents.length>EVENT_LIMIT)characterEvents.shift();}
  function queueState(){
    const CK=UW.CK, q=CK&&CK.UndoQueue, list=q&&Array.isArray(q.queue)?q.queue:null, index=q&&Number.isInteger(q.currentIndex)?q.currentIndex:null;
    const entry=list&&index!=null&&index>=0&&index<list.length?list[index]:null;
    let topKeys=[],sizeBytes=null;
    if(entry&&typeof entry==="object"){topKeys=Object.keys(entry).sort().slice(0,80);try{const t=JSON.stringify(entry);sizeBytes=typeof TextEncoder!=="undefined"?new TextEncoder().encode(t).byteLength:t.length;}catch(_){}}
    return {undoQueuePresent:!!q,queueLength:list?list.length:null,currentIndex:index,currentEntryPresent:!!entry,currentEntryTopLevelKeyCount:entry&&typeof entry==="object"?Object.keys(entry).length:null,currentEntryTopLevelKeys:topKeys,currentEntrySizeBytes:sizeBytes,tryLoadCharacterPresent:!!(CK&&typeof CK.tryLoadCharacter==="function"),needsUpdating:!!(CK&&CK.character&&CK.character._needsUpdating),inUpdate:!!(CK&&CK.character&&CK.character._inUpdate)};
  }
  function reckState(){
    const sidebar=document.querySelector(".ReCK-sidebar"), versionNode=document.querySelector(".ReCK-version-tag"), buttons=Array.from(document.querySelectorAll(".ReCK-button")).slice(0,12);
    const labels=buttons.map(b=>String(b.textContent||"").trim()).filter(Boolean), text=versionNode?String(versionNode.textContent||""):"", match=text.match(/v([0-9]+(?:\.[0-9]+)*)/i);
    return {detected:!!sidebar,version:match?match[1]:null,reloadControlPresent:labels.some(l=>/^Reload$/i.test(l)),applyControlPresent:labels.some(l=>/^Apply$/i.test(l)),controlLabels:labels.filter(l=>/^(Reload|Apply)$/i.test(l))};
  }
  function characterJsonState(){return{reck:reckState(),heroForge:queueState(),knownNativeLocalIoSurface:false,limitation:"native-local-json-file-surface-not-yet-identified-through-stable-named-api",recentOperations:characterEvents.map(r=>({...r}))};}
  function safeToolState(){const a=toolApi();if(!a||typeof a.getDiagnosticState!=="function")return null;try{return a.getDiagnosticState();}catch(_){return null;}}
  function freeze(){return{bulk:safeToolState(),characterJson:characterJsonState()};}
  function warning(code,message,phase,expected,actual){return{provider:PROVIDER_ID,code,phase:phase||null,severity:"warning",message:message||null,expected:expected==null?null:expected,actual:actual==null?null:actual};}
  function capture(context,frozenSeed){
    const seed=frozenSeed||freeze(), bulk=seed.bulk, cj=seed.characterJson||characterJsonState(), warnings=[];
    if(!cj.heroForge.undoQueuePresent)warnings.push(warning("JSON_UNDO_QUEUE_UNAVAILABLE","HeroForge UndoQueue is unavailable.","character-json",true,false));
    if(!cj.heroForge.tryLoadCharacterPresent)warnings.push(warning("JSON_TRY_LOAD_CHARACTER_UNAVAILABLE","HeroForge tryLoadCharacter is unavailable.","character-json",true,false));
    if(cj.reck.detected&&(!cj.reck.reloadControlPresent||!cj.reck.applyControlPresent))warnings.push(warning("JSON_LOCAL_IO_SURFACE_CHANGED","ReCK is present but its expected Reload/Apply controls were not both found.","character-json",true,cj.reck));
    const recentFailed=characterEvents.filter(r=>r&&r.result==="error").slice(-4);
    for(const row of recentFailed)warnings.push(warning(row.operation==="apply"?"JSON_EDITOR_APPLY_FAILED":"JSON_EDITOR_RELOAD_FAILED",row.message||"A recent ReCK operation recorded an error.","character-json","success","error"));
    const sections={
      state:{toolAvailable:!!bulk,reckDetected:!!cj.reck.detected,tryLoadCharacterPresent:!!cj.heroForge.tryLoadCharacterPresent,undoQueuePresent:!!cj.heroForge.undoQueuePresent},
      index:bulk?{pagesFetched:bulk.pagesFetched,indexComplete:bulk.indexComplete,markCount:bulk.markCount,marksComplete:bulk.marksComplete}:null,
      transfer:bulk?{running:bulk.running,paused:bulk.paused,stage:bulk.stage,configsTotal:bulk.configsTotal,configsDone:bulk.configsDone,progress:bulk.progress,pageSize:bulk.pageSize,concurrency:bulk.concurrency,transferSuccess:bulk.transferSuccess,transferFailures:bulk.transferFailures}:null,
      archive:bulk?bulk.archive:null,
      "character-json":cj,
      "failure-context":{bulk:bulk&&Array.isArray(bulk.recentFailures)?bulk.recentFailures:[],characterJson:recentFailed},
      events:{bulk:bulk&&Array.isArray(bulk.events)?bulk.events:[],characterJson:characterEvents.map(r=>({...r}))}
    };
    return{
      summary:{bulkToolAvailable:!!bulk,bulkRunning:!!(bulk&&bulk.running),bulkStage:bulk&&bulk.stage||null,bulkFailures:bulk&&bulk.failureCount||0,reckDetected:!!cj.reck.detected,reckVersion:cj.reck.version||null,undoQueuePresent:!!cj.heroForge.undoQueuePresent,tryLoadCharacterPresent:!!cj.heroForge.tryLoadCharacterPresent,queueLength:cj.heroForge.queueLength,currentIndex:cj.heroForge.currentIndex,recentCharacterJsonOperationCount:characterEvents.length,warningCodes:warnings.map(r=>r.code)},
      sections,
      coverage:[
        {sectionName:"state",status:"captured",reason:null},{sectionName:"index",status:bulk?"captured-bounded":"unavailable",reason:bulk?"counts-only":"json-tool-seam-unavailable"},
        {sectionName:"transfer",status:bulk?"captured-bounded":"unavailable",reason:bulk?"workflow-counts-only":"json-tool-seam-unavailable"},
        {sectionName:"archive",status:bulk?"captured-bounded":"unavailable",reason:bulk?"archive-metadata-only":"json-tool-seam-unavailable"},
        {sectionName:"character-json",status:"captured-bounded",reason:"no-editor-or-character-json-content"},
        {sectionName:"failure-context",status:"captured-bounded",reason:"sanitized-bounded-rings"},
        {sectionName:"events",status:"captured-bounded",reason:"workflow-checkpoints-and-known-reck-controls-only"}],
      warnings,events:sections.events.characterJson
    };
  }
  function opFromTarget(target){const b=target&&target.closest?target.closest(".ReCK-button"):null;if(!b)return null;const l=String(b.textContent||"").trim();if(/^Reload$/i.test(l))return"reload";if(/^Apply$/i.test(l))return"apply";return null;}
  function settle(op){window.setTimeout(()=>{const after=queueState();pushEvent({at:op.at,completedAt:Date.now(),operation:op.operation,result:"observed",before:op.before,after});if(pendingOperation===op)pendingOperation=null;},850);}
  function onClick(e){const operation=opFromTarget(e&&e.target);if(!operation)return;const op={at:Date.now(),operation,before:queueState()};pendingOperation=op;settle(op);}
  function onError(e){const op=pendingOperation;if(!op||Date.now()-op.at>ERROR_WINDOW_MS)return;pushEvent({at:op.at,completedAt:Date.now(),operation:op.operation,result:"error",before:op.before,after:queueState(),message:boundedText(e&&(e.message||e.reason||e.error),700)});pendingOperation=null;}
  document.addEventListener("click",onClick,true);window.addEventListener("error",onError,true);window.addEventListener("unhandledrejection",onError,true);
  function register(){if(registered)return true;const svc=core();if(!svc||typeof svc.registerProvider!=="function")return false;svc.registerProvider({providerId:PROVIDER_ID,providerSchemaVersion:PROVIDER_SCHEMA_VERSION,version:VERSION,build:BUILD,modes:["snapshot","failure"],capabilities:{snapshot:true,comparison:false,passiveReckObservation:true},freeze,capture});registered=true;if(timer){clearInterval(timer);timer=null;}return true;}
  function dispose(){document.removeEventListener("click",onClick,true);window.removeEventListener("error",onError,true);window.removeEventListener("unhandledrejection",onError,true);const svc=core();if(registered&&svc&&typeof svc.unregisterProvider==="function"){try{svc.unregisterProvider(PROVIDER_ID);}catch(_){}}registered=false;if(timer)clearInterval(timer);timer=null;return true;}
  UW.KWJSONDiagnosticProvider=Object.freeze({featureId:FEATURE_ID,providerId:PROVIDER_ID,providerSchemaVersion:PROVIDER_SCHEMA_VERSION,version:VERSION,build:BUILD,getState:()=>({featureId:FEATURE_ID,providerId:PROVIDER_ID,version:VERSION,build:BUILD,registered,registerTries,toolAvailable:!!toolApi(),coreAvailable:!!core(),reckDetected:!!reckState().detected}),dispose});
  if(!register())timer=setInterval(()=>{registerTries+=1;if(register()||registerTries>=MAX_REGISTER_TRIES){if(timer)clearInterval(timer);timer=null;}},100);
})();
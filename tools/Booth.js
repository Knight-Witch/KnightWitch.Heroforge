(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  const TOOL_ID = 'booth-tool';

  const STORE_CONSENT = 'kw.witchDock.booth.consent.v1';
  const STORE_DIR_HIDDEN = 'kw.witchDock.booth.directionsHidden.v1';

  const state = {
    consent: false,
    directionsHidden: false,

    boothOn: false,
    userBoothOn: false,
    bgOn: false,

    autoApplied: false,
    seenBooth: false,
    lastDetectAt: 0,
    lastTickAt: 0,

    capturedMaterial: null,
    capturedUniformValues: null,
    capturedTextureUniforms: null,
    hookedMesh: null,

    originalMaterial: null,
    originalUniformValues: null,
    originalTextureUniforms: null,
    originalMesh: null,

    lastDesiredMaterial: null,
    lastDesiredUniformValues: null,
    lastDesiredTextureUniforms: null,

    editorMaterial: null,
    editorUniformValues: null,
    editorTextureUniforms: null,

    tokenizerHooked: false,
    originalTokenizerDisable: null,

    wrapMap: new WeakMap(),
    wrappedDisableObjs: new Set(),

    boothPendingTeardown: false,

    boothFrameEls: new Set(),
    boothFrameHidden: false,

    shaderFramePlane: null,
    shaderFramePrev: null,
    shaderMaskObj: null,
    shaderMaskPrev: null,
    shaderFrameHidden: false,

    lastTokenizerMode: null,

    exitRearmTimer: null,

    oneShotBackdropRearmArmed: false,

    _suppressUI: false,
    prevInBooth: false,
    silentCycleTimer: null,
    silentCycleInProgress: false,


    allowTokenizerDisableOnce: false,
    loopActive: false,

    ui: {
      root: null,
      consent: null,
      boothToggle: null,
      bgToggle: null,
      dirWrap: null,
      dirText: null,
      dirBtn: null,
      status: null
    }
  };


  function gmGet(key, fallback) {
    try {
      if (typeof GM_getValue === 'function') {
        const v = GM_getValue(key, null);
        if (v !== null && v !== undefined) return v;
      }
    } catch {}
    try {
      const v = localStorage.getItem(key);
      if (v !== null) return JSON.parse(v);
    } catch {}
    return fallback;
  }

  function gmSet(key, val) {
    try {
      if (typeof GM_setValue === 'function') {
        GM_setValue(key, val);
        return;
      }
    } catch {}
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  }

  function ensureStyles() {
    if (document.getElementById('kwBoothToolStyle')) return;
    const st = document.createElement('style');
    st.id = 'kwBoothToolStyle';
    st.textContent = `
      .kwBoothTool{display:flex;flex-direction:column;gap:10px;padding:10px;}
      .kwBoothRow{display:flex;align-items:center;justify-content:space-between;gap:10px;}
      .kwBoothLeft{display:flex;align-items:center;gap:10px;}
      .kwBoothToggle{position:relative;display:inline-block;width:44px;height:24px;flex:0 0 auto;}
      .kwBoothToggle input{opacity:0;width:0;height:0;}
      .kwBoothSlider{position:absolute;cursor:pointer;inset:0;border-radius:12px;background:rgba(255,255,255,0.18);transition:200ms;}
      .kwBoothSlider:before{content:"";position:absolute;height:18px;width:18px;left:3px;top:3px;border-radius:50%;background:rgba(255,255,255,0.85);transition:200ms;}
      .kwBoothToggle input:checked + .kwBoothSlider{background:rgba(120,255,200,0.35);}
      .kwBoothToggle input:checked + .kwBoothSlider:before{transform:translateX(20px);}
      .kwBoothToggle input:disabled + .kwBoothSlider{cursor:not-allowed;opacity:0.5;}
      .kwBoothLabel{font-size:12px;opacity:0.95;}
      .kwBoothConsent{display:flex;align-items:center;gap:8px;font-size:12px;}
      .kwBoothConsent input{transform:translateY(0.5px);}
      .kwBoothBox{border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:10px;background:rgba(0,0,0,0.18);}
      .kwBoothBox .kwBoothRow + .kwBoothRow{margin-top:10px;}
      .kwBoothDirTitle{font-weight:700;font-size:12px;opacity:0.95;}
      .kwBoothNotesTitle{font-weight:700;margin-top:10px;margin-bottom:6px;}
      .kwBoothOl{margin:0 0 0 18px;padding:0;}
      .kwBoothOl li{margin:0 0 10px 0;}
      .kwBoothUl{margin:0 0 0 18px;padding:0;list-style:disc;}
      .kwBoothUl li{margin:0 0 10px 0;}
      .kwBoothDirHeader{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;}
      .kwBoothBtn{border:1px solid rgba(255,255,255,0.18);border-radius:6px;padding:6px 10px;background:rgba(255,255,255,0.06);color:inherit;font-size:12px;cursor:pointer;}
      .kwBoothBtn:active{transform:translateY(1px);}
      .kwBoothDirText{white-space:pre-line;font-size:12px;line-height:1.35;opacity:0.95;}
      .kwBoothStatus{font-size:11px;opacity:0.85;padding-top:2px;}
    `;
    document.head.appendChild(st);
  }

  function buildUI(container, api) {
    ensureStyles();

    const sec = api.ui.createSection({ id: 'booth', title: 'Persistent Booth' });
    container.appendChild(sec.root);

    const root = document.createElement('div');
    root.className = 'kwBoothTool';
    sec.body.appendChild(root);

    const consentRow = document.createElement('div');
    consentRow.className = 'kwBoothConsent';

    const consentCb = document.createElement('input');
    consentCb.type = 'checkbox';

    const consentLabel = document.createElement('span');
    consentLabel.textContent = 'Enable Booth Persistence';
    consentLabel.title = 'Check this box to enable the Booth to automatically detect & turn on persistent booth view once you enter the photo booth for the first time.';

    consentRow.appendChild(consentCb);
    consentRow.appendChild(consentLabel);
    root.appendChild(consentRow);

    const togglesBox = document.createElement('div');
    togglesBox.className = 'kwBoothBox';
    root.appendChild(togglesBox);

    function mkToggle(labelText) {
      const row = document.createElement('div');
      row.className = 'kwBoothRow';

      const left = document.createElement('div');
      left.className = 'kwBoothLeft';

      const wrap = document.createElement('label');
      wrap.className = 'kwBoothToggle';

      const input = document.createElement('input');
      input.type = 'checkbox';

      const slider = document.createElement('span');
      slider.className = 'kwBoothSlider';

      wrap.appendChild(input);
      wrap.appendChild(slider);

      const label = document.createElement('div');
      label.className = 'kwBoothLabel';
      label.textContent = labelText;

      left.appendChild(wrap);
      left.appendChild(label);

      row.appendChild(left);
      return { row, input, label };
    }

    const boothT = mkToggle('Booth View');
    const bgT = mkToggle('Black Canvas');

    togglesBox.appendChild(boothT.row);
    togglesBox.appendChild(bgT.row);

    const dirBox = document.createElement('div');
    dirBox.className = 'kwBoothBox';
    root.appendChild(dirBox);

    const dirHeader = document.createElement('div');
    dirHeader.className = 'kwBoothDirHeader';

    const dirTitle = document.createElement('div');
    dirTitle.className = 'kwBoothDirTitle';
    dirTitle.textContent = 'Directions';

    const dirBtn = document.createElement('button');
    dirBtn.type = 'button';
    dirBtn.className = 'kwBoothBtn';

    dirHeader.appendChild(dirTitle);
    dirHeader.appendChild(dirBtn);

    const dirText = document.createElement('div');
    dirText.className = 'kwBoothDirText';

    const ol = document.createElement('ol');
    ol.className = 'kwBoothOl';
    const li1 = document.createElement('li');
    li1.textContent = 'Enable Booth Persistence';
    const li2 = document.createElement('li');
    li2.textContent = 'Open photo booth';
    const li3 = document.createElement('li');
    li3.textContent = 'Edit your scene, or if you have already done so, it will capture that automatically.';
    const li4 = document.createElement('li');
    li4.textContent = 'Exit the booth';
    ol.appendChild(li1);
    ol.appendChild(li2);
    ol.appendChild(li3);
    ol.appendChild(li4);

    const notesTitle = document.createElement('div');
    notesTitle.className = 'kwBoothNotesTitle';
    notesTitle.textContent = 'Notes:';

    const ul = document.createElement('ul');
    ul.className = 'kwBoothUl';
    const n1 = document.createElement('li');
    n1.textContent = 'Toggle the booth view on/off at any time';
    const n2 = document.createElement('li');
    n2.textContent = "If the black background doesn't disappear when you toggle it off, just click the canvas and zoom or move the camera and it will turn white. Toggle black background back on for dark mode.";
    const n3 = document.createElement('li');
    n3.textContent = 'Currently, you will need to reload the page to revert back to the original fantasy background in the main UI editor. I will work to patch this when I can.';
    ul.appendChild(n1);
    ul.appendChild(n2);
    ul.appendChild(n3);

    dirText.appendChild(ol);
    dirText.appendChild(notesTitle);
    dirText.appendChild(ul);

    dirBox.appendChild(dirHeader);
    dirBox.appendChild(dirText);

    const status = document.createElement('div');
    status.className = 'kwBoothStatus';
    root.appendChild(status);

    state.ui.root = root;
    state.ui.consent = consentCb;
    state.ui.boothToggle = boothT.input;
    state.ui.bgToggle = bgT.input;
    state.ui.dirWrap = dirBox;
    state.ui.dirText = dirText;
    state.ui.dirBtn = dirBtn;
    state.ui.status = status;

    state.consent = !!gmGet(STORE_CONSENT, false);
    state.directionsHidden = !!gmGet(STORE_DIR_HIDDEN, false);

    consentCb.addEventListener('change', () => onConsentToggle(!!consentCb.checked));
    boothT.input.addEventListener('change', () => onUserBoothToggle(!!boothT.input.checked));
    bgT.input.addEventListener('change', () => onUserBgToggle(!!bgT.input.checked));

    dirBtn.addEventListener('click', (e) => {
      e.preventDefault();
      state.directionsHidden = !state.directionsHidden;
      gmSet(STORE_DIR_HIDDEN, !!state.directionsHidden);
      updateUI();
    });

    consentCb.checked = state.consent;

    if (state.consent) startLoop();

    updateUI();
  }

  function updateUI() {
    const ui = state.ui;
    if (!ui || !ui.root) return;

    if (!suppress && ui.consent) ui.consent.checked = !!state.consent;

    if (!suppress && ui.boothToggle) {
      ui.boothToggle.disabled = !state.consent;
      ui.boothToggle.checked = !!state.userBoothOn;
    }

    if (!suppress && ui.bgToggle) {
      ui.bgToggle.disabled = false;
      ui.bgToggle.checked = !!state.bgOn;
    }

    if (!suppress && ui.dirText) ui.dirText.style.display = state.directionsHidden ? 'none' : '';
    if (!suppress && ui.dirBtn) ui.dirBtn.textContent = state.directionsHidden ? 'Show' : 'Hide';

    if (ui.status) {
      const tok = state.tokenizerHooked ? 'HOOKED' : '—';
      const booth = state.userBoothOn ? 'ON' : 'OFF';
      const bg = state.bgOn ? 'ON' : 'OFF';
      ui.status.textContent = `Tokenizer: ${tok} | Booth: ${booth} | Black Canvas: ${bg}`;
    }
  }

  function applyUniformSnapshot(material, snap) {
    if (!material || !snap) return;
    const u = material.uniforms;
    if (!u || typeof u !== 'object') return;
    const keys = Object.keys(snap);
    let changed = false;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const entry = u[k];
      if (!entry || typeof entry !== 'object' || !('value' in entry)) continue;
      const desired = snap[k];
      if (entry.value !== desired) {
        entry.value = desired;
        changed = true;
      }
    }
    if (changed) markMaterialDirty(material);
  }

  function applyTextureSnapshot(material, snap) {
    if (!material || !snap) return;
    const u = material.uniforms;
    if (!u || typeof u !== 'object') return;
    const keys = Object.keys(snap);
    let changed = false;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const s = snap[k];
      if (!s || !s.texture) continue;
      const entry = u[k];
      if (!entry || typeof entry !== 'object' || !('value' in entry)) continue;
      const cur = entry.value;
      const curTex = isTextureLike(cur) ? cur : null;
      const curSrc = curTex ? getTextureSrc(curTex) : null;
      const desiredTex = s.texture;
      const desiredSrc = s.src || null;
      const curMissingImage = curTex && (!curTex.image || (!curSrc && curTex.image));
      const curWrong = !curTex || (desiredSrc && curSrc && desiredSrc !== curSrc);
      if (curWrong || curMissingImage) {
        entry.value = desiredTex;
        changed = true;
      }
      markTextureDirty(entry.value);
    }
    if (changed) markMaterialDirty(material);
  }

  function captureOriginalBackdrop() {
    const bg = getBackground();
    const mesh = getMesh(bg);
    const mat = mesh && mesh.material ? mesh.material : null;
    if (!bg || !mesh || !mat) return false;
    if (state.originalMesh === mesh && state.originalMaterial) return true;
    state.originalMesh = mesh;
    state.originalMaterial = mat;
    state.originalUniformValues = snapshotUniformValues(mat);
    state.originalTextureUniforms = snapshotTextureUniforms(mat);
    return true;
  }

  function restoreOriginalBackdrop() {
    const bg = getBackground();
    const mesh = state.originalMesh || getMesh(bg);
    if (!mesh) return;

    try {
      if (mesh.__kw_boothBackdrop__) {
        try { delete mesh.material; } catch {}
        try { delete mesh.__kw_boothBackdrop__; } catch {}
      }
    } catch {}

    const mat = state.editorMaterial || state.lastDesiredMaterial || state.originalMaterial;
    if (mat) {
      try { mesh.material = mat; } catch {}

      const uv =
        mat === state.editorMaterial
          ? state.editorUniformValues
          : mat === state.lastDesiredMaterial
            ? state.lastDesiredUniformValues
            : state.originalUniformValues;
      const tu =
        mat === state.editorMaterial
          ? state.editorTextureUniforms
          : mat === state.lastDesiredMaterial
            ? state.lastDesiredTextureUniforms
            : state.originalTextureUniforms;
      applyUniformSnapshot(mat, uv);
      applyTextureSnapshot(mat, tu);

      markMaterialDirty(mat);
    }

    state.hookedMesh = null;
    state.originalMaterial = null;
    state.originalUniformValues = null;
    state.originalTextureUniforms = null;
    state.originalMesh = null;
    state.lastDesiredMaterial = null;

    state.lastDesiredUniformValues = null;
    state.lastDesiredTextureUniforms = null;
  }

  function hasAnyTextureSrc(snap) {
    if (!snap || typeof snap !== 'object') return false;
    const keys = Object.keys(snap);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const v = snap[k];
      if (v && v.texture && v.src) return true;
    }
    return false;
  }

  function maybeCaptureEditorBaseline() {
    if (!state.bgOn) return;
    if (inPhotoBoothUI()) return;
    const mat = state.lastDesiredMaterial;
    if (!mat) return;
    const tu = snapshotTextureUniforms(mat);
    if (!hasAnyTextureSrc(tu)) return;
    state.editorMaterial = mat;
    state.editorUniformValues = snapshotUniformValues(mat);
    state.editorTextureUniforms = tu;
  }

  function teardownBoothNow(TN) {
    try {
      const t = (TN && TN.tokenizer) || (UW.TN && UW.TN.tokenizer) || null;
      if (t && typeof t.disable === 'function') t.disable();
      else if (t && typeof state.originalTokenizerDisable === 'function') state.originalTokenizerDisable.call(t);
    } catch {}

    try {
      state.wrappedDisableObjs.forEach((obj) => {
        const rec = state.wrapMap.get(obj);
        if (!rec || typeof rec.original !== 'function') return;
        try { rec.original.call(obj); } catch {}
      });
    } catch {}
  }

  function handleToggleChange(kind, nextVal, TN) {
    if (kind === 'bg') {
      const prev = state.bgOn;
      state.bgOn = !!nextVal;
      if (state.bgOn) {
        if (!state.capturedMaterial) tryCaptureBackdropFromScene();
        captureOriginalBackdrop();
      } else if (prev) {
        restoreOriginalBackdrop();
      }
      updateUI();
      return;
    }

    if (kind === 'booth') {
      const prevUser = !!state.userBoothOn;
      const prevGate = !!state.boothOn;

      state.userBoothOn = !!nextVal;
      state.boothOn = state.userBoothOn;

      if (!state.userBoothOn && prevUser) state.boothPendingTeardown = true;
      if (state.userBoothOn && !prevUser) {
        try {
          const t = (TN && TN.tokenizer) || (UW.TN && UW.TN.tokenizer) || null;
          if (t && typeof t.enable === 'function') t.enable();
        } catch {}
      }
      updateUI();
    }
  }

  function waitForTN(cb) {
    if (UW.TN) return cb(UW.TN);
    setTimeout(() => waitForTN(cb), 50);
  }

  function jparse(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function inPhotoBoothUI() {
    try {
      const p = (location && location.pathname ? location.pathname : '').toLowerCase();
      const h = (location && location.hash ? location.hash : '').toLowerCase();
      if (p.includes('photobooth') || p.includes('photo-booth') || h.includes('photobooth') || h.includes('photo-booth')) return true;
    } catch {}
    const dialogs = document.querySelectorAll('[role="dialog"], .modal, .Modal, .hf-modal, .hfModal');
    for (let i = 0; i < dialogs.length; i++) {
      const el = dialogs[i];
      const txt = (el.innerText || '').toLowerCase();
      if (txt.includes('photo booth') || txt.includes('photobooth')) return true;
    }
    const t = document.title ? document.title.toLowerCase() : '';
    if (t.includes('photo booth') || t.includes('photobooth')) return true;
    return false;
  }

  function getTokenizerMode(TN) {
    try {
      const t = TN && TN.tokenizer ? TN.tokenizer : null;
      const m = t && typeof t.currentMode === 'string' ? t.currentMode : null;
      if (m) return m;
      return TN && typeof TN.currentMode === 'string' ? TN.currentMode : null;
    } catch {
      return null;
    }
  }

  function isInBooth(TN) {
    const mode = getTokenizerMode(TN);
    try {
      if (mode && mode.toLowerCase().includes('booth')) return true;
    } catch {}
    return inPhotoBoothUI();
  }

  function scheduleSilentBackdropRearm(TN) {
    if (!state.userBoothOn) return;
    if (state.exitRearmTimer) return;
    state.exitRearmTimer = setTimeout(() => {
      state.exitRearmTimer = null;
      const tn = UW.TN || TN || null;
      if (!tn || !state.userBoothOn) return;
      if (isInBooth(tn)) return;

      state.boothOn = false;
      try { teardownBoothNow(tn); } catch {}

      setTimeout(() => {
        const tn2 = UW.TN || tn;
        if (!tn2 || !state.userBoothOn) return;
        if (isInBooth(tn2)) return;
        state.boothOn = true;
        try {
          const t = tn2 && tn2.tokenizer ? tn2.tokenizer : null;
          if (t && typeof t.enable === 'function') t.enable();
        } catch {}
      }, 150);
    }, 1000);
  }

  function isLikelyBoothFrameEl(el) {
    if (!el || el === document.documentElement || el === document.body) return false;
    if (el === state.dock || (state.dock && state.dock.contains(el))) return false;
    const id = (el.id || '').toLowerCase();
    const cls = (typeof el.className === 'string' ? el.className : '').toLowerCase();
    if (!id && !cls) return false;
    if (!id.includes('booth') && !id.includes('photo') && !cls.includes('booth') && !cls.includes('photo')) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    if (cs.position !== 'absolute' && cs.position !== 'fixed') return false;
    const r = el.getBoundingClientRect();
    if (!r || r.width < 200 || r.height < 200) return false;
    const aspect = r.width / r.height;
    if (aspect < 0.92 || aspect > 1.08) return false;
    if (r.width > window.innerWidth * 0.98 || r.height > window.innerHeight * 0.98) return false;
    const bg = (cs.backgroundColor || '').toLowerCase();
    const hasOverlayBg = bg.includes('rgba') || bg.includes('rgb');
    const pe = (cs.pointerEvents || '').toLowerCase();
    const likelyOverlay = pe === 'none' || hasOverlayBg;
    if (!likelyOverlay) return false;
    return true;
  }

  function findBoothFrameEls() {
    const out = [];
    const candidates = document.querySelectorAll('[id*="booth"],[id*="photo"],[class*="booth"],[class*="photo"]');
    for (let i = 0; i < candidates.length; i++) {
      const el = candidates[i];
      try {
        if (isLikelyBoothFrameEl(el)) out.push(el);
      } catch {}
    }
    return out;
  }

  function setBoothFrameHidden(hidden) {
    if (hidden === state.boothFrameHidden) return;
    state.boothFrameHidden = hidden;
    if (hidden) {
      const els = findBoothFrameEls();
      for (let i = 0; i < els.length; i++) state.boothFrameEls.add(els[i]);
      state.boothFrameEls.forEach((el) => {
        try {
          if (!el.dataset.kwBoothPrevDisplay) el.dataset.kwBoothPrevDisplay = el.style.display || '';
          el.style.display = 'none';
        } catch {}
      });
      return;
    }

    state.boothFrameEls.forEach((el) => {
      try {
        const prev = el.dataset.kwBoothPrevDisplay;
        if (prev != null) el.style.display = prev;
        delete el.dataset.kwBoothPrevDisplay;
      } catch {}
    });
    state.boothFrameEls.clear();
  }

  function getShaderFramePlane(TN) {
    try {
      if (state.shaderFramePlane) return state.shaderFramePlane;
      const plane = TN && TN.shader ? TN.shader.framePlane : null;
      if (!plane || typeof plane !== 'object') return null;
      state.shaderFramePlane = plane;
      return plane;
    } catch {
      return null;
    }
  }

  function getShaderMaskObj(TN) {
    try {
      if (state.shaderMaskObj) return state.shaderMaskObj;
      const obj = TN && TN.shader ? TN.shader.mask : null;
      if (!obj || typeof obj !== 'object') return null;
      state.shaderMaskObj = obj;
      return obj;
    } catch {
      return null;
    }
  }

  function snapshotPlaneVisual(plane) {
    if (!plane || typeof plane !== 'object') return null;
    const mats = plane.material ? (Array.isArray(plane.material) ? plane.material : [plane.material]) : [];
    const matSnap = mats.map((m) => {
      if (!m || typeof m !== 'object') return null;
      return {
        transparent: !!m.transparent,
        opacity: typeof m.opacity === 'number' ? m.opacity : null
      };
    });
    return { visible: !!plane.visible, mat: matSnap };
  }

  function restorePlaneVisual(plane, snap) {
    if (!plane || typeof plane !== 'object' || !snap) return;
    try { plane.visible = !!snap.visible; } catch {}
    const mats = plane.material ? (Array.isArray(plane.material) ? plane.material : [plane.material]) : [];
    for (let i = 0; i < mats.length; i++) {
      const m = mats[i];
      const s = snap.mat ? snap.mat[i] : null;
      if (!m || typeof m !== 'object' || !s) continue;
      try { m.transparent = !!s.transparent; } catch {}
      try { if (typeof s.opacity === 'number') m.opacity = s.opacity; } catch {}
    }
  }

  function setShaderFrameHidden(hidden, TN) {
    const plane = getShaderFramePlane(TN);
    const mask = getShaderMaskObj(TN);
    if (!plane && !mask) return;

    if (hidden) {
      state.shaderFrameHidden = true;
      if (plane) {
        if (!state.shaderFramePrev) state.shaderFramePrev = snapshotPlaneVisual(plane);
        try { plane.visible = false; } catch {}
        const mats = plane.material ? (Array.isArray(plane.material) ? plane.material : [plane.material]) : [];
        for (let i = 0; i < mats.length; i++) {
          const m = mats[i];
          if (!m || typeof m !== 'object') continue;
          try { m.transparent = true; } catch {}
          try { m.opacity = 0; } catch {}
        }
      }

      if (mask) {
        if (!state.shaderMaskPrev) state.shaderMaskPrev = snapshotPlaneVisual(mask);
        try { mask.visible = false; } catch {}
        const mats = mask.material ? (Array.isArray(mask.material) ? mask.material : [mask.material]) : [];
        for (let i = 0; i < mats.length; i++) {
          const m = mats[i];
          if (!m || typeof m !== 'object') continue;
          try { m.transparent = true; } catch {}
          try { m.opacity = 0; } catch {}
        }
      }
      return;
    }

    if (!state.shaderFrameHidden) return;
    state.shaderFrameHidden = false;

    if (plane) restorePlaneVisual(plane, state.shaderFramePrev);
    if (mask) restorePlaneVisual(mask, state.shaderMaskPrev);
    state.shaderFramePrev = null;
    state.shaderMaskPrev = null;
  }

  function getRoot() {
    try {
      const TN = UW.TN;
      const g = TN && TN.helper && TN.helper._debugGroup;
      return g && g.parent && g.parent.children && g.parent.children[0] ? g.parent.children[0] : null;
    } catch {
      return null;
    }
  }

  function getBackground() {
    const root = getRoot();
    return root && root.background ? root.background : null;
  }

  function getMesh(bg) {
    try { return bg && bg.mesh ? bg.mesh : null; } catch { return null; }
  }

  function isTextureLike(v) {
    return !!v && typeof v === 'object' && typeof v.isTexture === 'boolean' && v.isTexture === true;
  }

  function getTextureSrc(tex) {
    try {
      const img = tex && tex.image ? tex.image : null;
      if (!img) return null;
      return img.currentSrc || img.src || null;
    } catch {
      return null;
    }
  }

  function snapshotUniformValues(material) {
    const out = {};
    const u = material && material.uniforms;
    if (!u || typeof u !== 'object') return out;

    const keys = Object.keys(u);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const entry = u[k];
      if (!entry || typeof entry !== 'object') continue;
      if (!('value' in entry)) continue;
      out[k] = entry.value;
    }
    return out;
  }

  function snapshotTextureUniforms(material) {
    const out = {};
    const u = material && material.uniforms;
    if (!u || typeof u !== 'object') return out;

    const keys = Object.keys(u);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const entry = u[k];
      if (!entry || typeof entry !== 'object') continue;
      if (!('value' in entry)) continue;

      const v = entry.value;
      if (!isTextureLike(v)) continue;

      let clone = null;
      try { clone = typeof v.clone === 'function' ? v.clone() : v; } catch { clone = v; }
      out[k] = { texture: clone, src: getTextureSrc(v), uuid: v && v.uuid ? v.uuid : null };
    }
    return out;
  }

  function markTextureDirty(tex) {
    try { if (tex && typeof tex.needsUpdate === 'boolean') tex.needsUpdate = true; } catch {}
  }

  function markMaterialDirty(mat) {
    try {
      if (!mat) return;
      if (typeof mat.uniformsNeedUpdate === 'boolean') mat.uniformsNeedUpdate = true;
      if (typeof mat.needsUpdate === 'boolean') mat.needsUpdate = true;
    } catch {}
  }

  function ensureHook() {
    const bg = getBackground();
    const mesh = getMesh(bg);
    if (!mesh) return;

    if (mesh !== state.hookedMesh) {
      state.hookedMesh = mesh;
      hookMeshMaterial(mesh);
    }
  }

  function hookMeshMaterial(mesh) {
    if (!mesh || mesh.__kw_boothBackdrop__) return;

    let _mat = mesh.material;

    Object.defineProperty(mesh, 'material', {
      get() { return _mat; },
      set(v) {
        if (state.bgOn && state.capturedMaterial) {
          if (v && v !== state.capturedMaterial) {
            state.lastDesiredMaterial = v;
            state.lastDesiredUniformValues = snapshotUniformValues(v);
            state.lastDesiredTextureUniforms = snapshotTextureUniforms(v);
          }
          _mat = state.capturedMaterial;
          return;
        }
        _mat = v;
      },
      configurable: true
    });

    mesh.__kw_boothBackdrop__ = true;
  }

  function applyCapturedMaterial() {
    if (!state.bgOn) return;
    if (!state.capturedMaterial) return;

    const bg = getBackground();
    const mesh = getMesh(bg);
    if (!mesh) return;

    if (mesh.material !== state.capturedMaterial) {
      try { mesh.material = state.capturedMaterial; } catch {}
    }
  }

  function enforceAllUniformValues() {
    if (!state.bgOn) return;
    if (!state.capturedMaterial) return;
    if (!state.capturedUniformValues) return;

    const mat = state.capturedMaterial;
    const u = mat.uniforms;
    if (!u || typeof u !== 'object') return;

    const keys = Object.keys(state.capturedUniformValues);
    let changed = false;

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const entry = u[k];
      if (!entry || typeof entry !== 'object') continue;
      if (!('value' in entry)) continue;

      const desired = state.capturedUniformValues[k];
      if (entry.value !== desired) {
        entry.value = desired;
        changed = true;
      }
    }

    if (changed) markMaterialDirty(mat);
  }

  function enforceTextureUniforms() {
    if (!state.bgOn) return;
    if (!state.capturedMaterial) return;
    if (!state.capturedTextureUniforms) return;

    const mat = state.capturedMaterial;
    const u = mat.uniforms;
    if (!u || typeof u !== 'object') return;

    const keys = Object.keys(state.capturedTextureUniforms);
    let changed = false;

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const snap = state.capturedTextureUniforms[k];
      if (!snap || !snap.texture) continue;

      const entry = u[k];
      if (!entry || typeof entry !== 'object' || !('value' in entry)) continue;

      const cur = entry.value;
      const curTex = isTextureLike(cur) ? cur : null;
      const curSrc = curTex ? getTextureSrc(curTex) : null;

      const desiredTex = snap.texture;
      const desiredSrc = snap.src || null;

      const curMissingImage = curTex && (!curTex.image || (!curSrc && curTex.image));
      const curWrong = !curTex || (desiredSrc && curSrc && desiredSrc !== curSrc);

      if (curWrong || curMissingImage) {
        entry.value = desiredTex;
        changed = true;
      }

      markTextureDirty(entry.value);
    }

    if (changed) markMaterialDirty(mat);
  }

  function tryCaptureBackdropFromScene() {
    const bg = getBackground();
    const mesh = getMesh(bg);
    const mat = mesh && mesh.material ? mesh.material : null;
    if (!bg || !mesh || !mat) return false;

    state.capturedMaterial = mat;
    state.capturedUniformValues = snapshotUniformValues(mat);
    state.capturedTextureUniforms = snapshotTextureUniforms(mat);
    return true;
  }

  function hookTokenizerDisable(TN) {
    const t = TN && TN.tokenizer;
    if (!t || typeof t.disable !== 'function') return;
    if (state.tokenizerHooked) return;

    state.originalTokenizerDisable = t.disable;

    t.disable = function () {
      if (state.boothOn) return;
      return state.originalTokenizerDisable.apply(this, arguments);
    };

    state.tokenizerHooked = true;
  }

  function wrapDisable(obj) {
    if (!obj || typeof obj.disable !== 'function') return;
    if (state.wrapMap.has(obj)) return;

    const original = obj.disable;
    const wrapped = function () {
      try {
        const tn = UW.TN;
        const tok = tn && tn.tokenizer;
        const isTokenizer = tok && obj === tok;

        if (state.boothOn) {
          if (isTokenizer && state.allowTokenizerDisableOnce) {
            return original.apply(this, arguments);
          }
          return true;
        }

        if (isTokenizer && state.userBoothOn && !isInBooth(tn) && !state.oneShotBackdropRearmArmed) {
          state.oneShotBackdropRearmArmed = true;
          state.allowTokenizerDisableOnce = true;
          try { original.apply(this, arguments); } catch {}
          state.allowTokenizerDisableOnce = false;

          setTimeout(() => {
            state.oneShotBackdropRearmArmed = false;
            try {
              const t2 = UW.TN && UW.TN.tokenizer;
              if (t2 && typeof t2.enable === 'function') t2.enable();
            } catch {}
          }, 200);

          setTimeout(() => {
            try {
              const tn2 = UW.TN;
              if (!tn2 || !state.userBoothOn) return;
              if (isInBooth(tn2)) return;
              const t3 = tn2.tokenizer;
              if (t3 && typeof t3.enable === 'function') t3.enable();
            } catch {}
          }, 1100);

          return true;
        }
      } catch {}

      return original.apply(this, arguments);
    };

    obj.disable = wrapped;
    state.wrapMap.set(obj, { original });
    state.wrappedDisableObjs.add(obj);
  }

  function enforceLightingPersistence(TN) {
    if (!TN) return;
    const L = TN.lighting;
    if (!L) return;

    wrapDisable(L);

    const keys = Object.keys(L);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      let v;
      try { v = L[k]; } catch { continue; }
      if (!v) continue;
      if (typeof v === 'object') wrapDisable(v);
    }
  }

  function detectExistingBooth(TN) {
    const t = TN && TN.tokenizer;
    if (!t) return false;
    return !!(t.savedCamera || t.currentCamera);
  }

  function maybeAutoApply(TN) {
    if (!state.consent) return;
    const now = Date.now();
    if (now - state.lastDetectAt < 350) return;
    state.lastDetectAt = now;
    if (state.autoApplied) return;
    if (!state.seenBooth) return;

    const hasBooth = detectExistingBooth(TN);

    if (!hasBooth) return;

    state.autoApplied = true;

    if (hasBooth) {
      state.userBoothOn = true;
      state.boothOn = true;
    }

    updateUI();
  }
  
  function scheduleSilentBackdropCycle(TN) {
    if (!state.consent || !state.userBoothOn) return;
    if (state.silentCycleInProgress) return;
    if (state.silentCycleTimer) return;

    state.silentCycleTimer = setTimeout(() => {
      state.silentCycleTimer = null;
      try {
        const tn = (UW.TN || TN);
        if (!tn) return;
        if (isInBooth(tn)) return;
        if (!state.consent || !state.userBoothOn) return;

        state.silentCycleInProgress = true;

        const uiToggle = state.ui && state.ui.boothToggle ? state.ui.boothToggle : null;
        if (uiToggle) uiToggle.disabled = true;

        state._suppressUI = true;

        const savedUser = true;
        const savedBooth = true;

        try {
          state.userBoothOn = false;
          state.boothOn = false;
          teardownBoothNow(tn);
        } catch {}

        setTimeout(() => {
          try {
            state.userBoothOn = savedUser;
            state.boothOn = savedBooth;
            const t = (tn && tn.tokenizer) || (UW.TN && UW.TN.tokenizer) || null;
            if (t && typeof t.enable === 'function') t.enable();
          } catch {}

          state._suppressUI = false;

          try {
            if (uiToggle) {
              uiToggle.checked = true;
              uiToggle.disabled = false;
            }
          } catch {}

          updateUI();
          state.silentCycleInProgress = false;
        }, 250);
      } catch {
        try { state._suppressUI = false; } catch {}
        state.silentCycleInProgress = false;
      }
    }, 900);
  }

  function tick(TN) {
    if (!state.loopActive) return;
    const now = performance.now();
    if (now - state.lastTickAt < 110) return requestAnimationFrame(() => tick(TN));
    state.lastTickAt = now;

    const tokenizerMode = (() => {
      try {
        const t = TN && TN.tokenizer ? TN.tokenizer : null;
        const m = t && typeof t.currentMode === 'string' ? t.currentMode : null;
        if (m) return m;
        return typeof TN.currentMode === 'string' ? TN.currentMode : null;
      } catch {
        return null;
      }
    })();

    const inBooth = (() => {
      try {
        if (tokenizerMode && tokenizerMode.toLowerCase().includes('booth')) return true;
      } catch {}
      return inPhotoBoothUI();
    })();

    if (inBooth) state.seenBooth = true;

    if (state.prevInBooth && !inBooth) {
      scheduleSilentBackdropCycle(TN);
    }

    if (state.lastTokenizerMode == null) state.lastTokenizerMode = tokenizerMode;

    const wasBooth = (() => {
      try {
        const prev = state.lastTokenizerMode;
        if (prev && typeof prev === 'string' && prev.toLowerCase().includes('booth')) return true;
      } catch {}
      return false;
    })();

    state.lastTokenizerMode = tokenizerMode;

    if (wasBooth && !inBooth && state.userBoothOn) {
      state.oneShotBackdropRearmArmed = false;
    }

    maybeAutoApply(TN);

    const hideFrame = !!state.consent && !!state.userBoothOn && !inBooth;
    setBoothFrameHidden(hideFrame);
    setShaderFrameHidden(hideFrame, TN);

    if (state.boothOn) {
      hookTokenizerDisable(TN);
      enforceLightingPersistence(TN);
      wrapDisable(TN && TN.tokenizer ? TN.tokenizer : null);
    }

    if (state.boothPendingTeardown && !inBooth) {
      state.boothPendingTeardown = false;
      teardownBoothNow(TN);
      updateUI();
    }

    if (state.bgOn) {
      if (!state.capturedMaterial) tryCaptureBackdropFromScene();
      if (!state.originalMaterial) captureOriginalBackdrop();
      maybeCaptureEditorBaseline();
      ensureHook();
      applyCapturedMaterial();
      enforceAllUniformValues();
      enforceTextureUniforms();
    }

    state.prevInBooth = inBooth;

    requestAnimationFrame(() => tick(TN));
  }

  

  function onConsentToggle(v) {
    state.consent = !!v;
    gmSet(STORE_CONSENT, !!state.consent);

    if (state.consent) {
      state.seenBooth = false;
      startLoop();
    } else {
      teardownBoothOnly();
      reconcileLoop();
    }

    updateUI();
  }

  function onUserBoothToggle(v) {
    const TN = UW.TN;
    state.userBoothOn = !!v;
    if (!state.consent) {
      state.userBoothOn = false;
      state.boothOn = false;
      updateUI();
      return;
    }

    const prev = !!state.boothOn;
    state.boothOn = state.userBoothOn;

    if (!state.userBoothOn && prev) {
      state.boothPendingTeardown = true;
      try { teardownBoothNow(TN); } catch {}
    }

    if (state.userBoothOn && !prev) {
      try {
        const t = (TN && TN.tokenizer) || (UW.TN && UW.TN.tokenizer) || null;
        if (t && typeof t.enable === 'function') t.enable();
      } catch {}
    }

    updateUI();
  }

  function onUserBgToggle(v) {
    state.bgOn = !!v;
    if (!state.bgOn) {
      try { restoreOriginalBackdrop(); } catch {}
    } else {
      try { if (!state.capturedMaterial) tryCaptureBackdropFromScene(); } catch {}
      try { captureOriginalBackdrop(); } catch {}
    }
    reconcileLoop();
    updateUI();
  }

  function startLoop() {
    if (!state.loopActive) {
      state.loopActive = true;
      waitForTN((TN) => requestAnimationFrame(() => tick(TN)));
    }
  }

  function stopLoop() {
    state.loopActive = false;
  }

  function reconcileLoop() {
    const need = !!state.consent || !!state.bgOn;
    if (need) startLoop();
    else stopLoop();
  }

  function teardownBoothOnly() {
    state.boothOn = false;
    state.userBoothOn = false;
    state.autoApplied = false;
    state.boothPendingTeardown = false;
    state.oneShotBackdropRearmArmed = false;
    try { setShaderFrameHidden(false, UW.TN); } catch {}
    try { setBoothFrameHidden(false); } catch {}
    try { teardownBoothNow(UW.TN); } catch {}
    updateUI();
  }

  function registerTool() {
    const WD = UW.WitchDock;
    if (!WD || typeof WD.registerTool !== 'function') return false;
    WD.registerTool({
      id: TOOL_ID,
      title: 'Booth',
      tab: 'Booth',
      render: (container, api) => buildUI(container, api)
    });
    return true;
  }

  function boot() {
    if (!registerTool()) setTimeout(boot, 200);
  }

  startLoop();
  boot();
})();


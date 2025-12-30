// ==UserScript==
// @name         Body Editor
// @namespace    knight-witch-body-editor
// @version      0.1.0
// @description  Advanced body editing tools (Extra Arms Sync + Breast Mirror) that dock into Witch Dock.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        unsafeWindow
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Body_Editor.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Body_Editor.user.js
// ==/UserScript==

(() => {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  const STORE_KEY = 'kw.bodyEditor.v1';
  const SECTION_ID = 'kw.bodyEditor.section';
  const TAB_ID = 'sync';

  const state = {
    arms: {
      target2: true,
      target3: true,
      pos: true,
      qtn: true,
      scl: true,
      syncHands: true,
    },
    breast: {
      from: 'L',
      pos: true,
      qtn: true,
      scl: true,
    },
  };

  const history = {
    undo: [],
    redo: [],
    max: 40,
  };

  const ui = {
    mounted: false,
    root: null,
    arms: {},
    breast: {},
    btnUndo: null,
    btnRedo: null,
    status: null,
  };

  function loadState() {
    try {
      const raw = UW.localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object') return;

      if (saved.arms && typeof saved.arms === 'object') {
        Object.assign(state.arms, saved.arms);
      }
      if (saved.breast && typeof saved.breast === 'object') {
        Object.assign(state.breast, saved.breast);
      }
    } catch {}
  }

  function saveState() {
    try {
      UW.localStorage.setItem(STORE_KEY, JSON.stringify({ arms: state.arms, breast: state.breast }));
    } catch {}
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function isTypingTarget(el) {
    if (!el) return false;
    const tag = String(el.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
    if (el.isContentEditable) return true;
    return false;
  }

  function waitForDock() {
    if (UW.WitchDock && typeof UW.WitchDock.registerSection === 'function') {
      init();
      return;
    }
    setTimeout(waitForDock, 250);
  }

  function waitForCK(cb) {
    try {
      if (UW.CK && UW.CK.UndoQueue && UW.CK.tryLoadCharacter) cb();
      else setTimeout(() => waitForCK(cb), 250);
    } catch {
      setTimeout(() => waitForCK(cb), 500);
    }
  }

  function snapshotCurrentCharacter() {
    const CK = UW.CK;
    if (!CK || !CK.UndoQueue || !CK.UndoQueue.queue || CK.UndoQueue.queue.length === 0) return null;
    const u = CK.UndoQueue;
    const cur = u.queue[u.currentIndex];
    if (!cur) return null;
    return deepClone(cur);
  }

  function applyCharacter(json, onDone) {
    const CK = UW.CK;
    if (!CK || !CK.tryLoadCharacter) return false;
    CK.tryLoadCharacter(json, 'Body Editor: invalid character data', () => {
      if (typeof onDone === 'function') onDone();
    });
    return true;
  }

  function pushHistory(snapshot) {
    if (!snapshot) return;
    history.undo.push(snapshot);
    if (history.undo.length > history.max) history.undo.shift();
    history.redo.length = 0;
    updateUndoRedoUI();
  }

  function undoGlobal() {
    const prev = history.undo.pop();
    if (!prev) return;
    const cur = snapshotCurrentCharacter();
    if (cur) history.redo.push(cur);
    applyCharacter(prev, updateUndoRedoUI);
    updateUndoRedoUI();
  }

  function redoGlobal() {
    const next = history.redo.pop();
    if (!next) return;
    const cur = snapshotCurrentCharacter();
    if (cur) history.undo.push(cur);
    applyCharacter(next, updateUndoRedoUI);
    updateUndoRedoUI();
  }

  function updateUndoRedoUI() {
    if (ui.btnUndo) ui.btnUndo.disabled = history.undo.length === 0;
    if (ui.btnRedo) ui.btnRedo.disabled = history.redo.length === 0;
  }

  function ensurePath(obj, path, fallback) {
    let o = obj;
    for (let i = 0; i < path.length; i++) {
      const k = path[i];
      if (o[k] == null || typeof o[k] !== 'object') o[k] = {};
      o = o[k];
    }
    if (fallback && typeof fallback === 'object') Object.assign(o, fallback);
    return o;
  }

  function invertVec3(v) {
    if (!v || typeof v !== 'object') return { x: 0, y: 0, z: 0 };
    return { x: -Number(v.x || 0), y: Number(v.y || 0), z: Number(v.z || 0) };
  }

  function isArmHandFingerKey(key) {
    return (
      typeof key === 'string' &&
      (key.startsWith('main_arm') ||
        key.startsWith('main_hand') ||
        key.startsWith('main_finger') ||
        key.startsWith('main_thumb') ||
        key.startsWith('main_wrist'))
    );
  }

  function isHandishKey(key) {
    return (
      typeof key === 'string' &&
      (key.startsWith('main_hand') ||
        key.startsWith('main_finger') ||
        key.startsWith('main_thumb') ||
        key.startsWith('main_wrist'))
    );
  }

  function syncOneSecondary(main, secondary, cleanExtras, opts) {
    const mainNumericKeys = new Set(Object.keys(main).filter((k) => /^\d+$/.test(k)));

    Object.keys(main).forEach((key) => {
      if (/^\d+$/.test(key)) {
        const src = main[key];
        if (opts.pos || opts.qtn || opts.scl) {
          const dst = secondary[key] && typeof secondary[key] === 'object' ? secondary[key] : {};
          if (opts.pos && src.pos) dst.pos = deepClone(src.pos);
          if (opts.qtn && src.qtn) dst.qtn = deepClone(src.qtn);
          if (opts.scl && src.scl) dst.scl = deepClone(src.scl);
          if (src.isKitbashed) dst.isKitbashed = deepClone(src.isKitbashed);
          secondary[key] = dst;
        }
      }
    });

    if (cleanExtras) {
      Object.keys(secondary).forEach((key) => {
        if (/^\d+$/.test(key) && !mainNumericKeys.has(key)) delete secondary[key];
      });
    }

    const mainArmKeys = new Set(Object.keys(main).filter((key) => isArmHandFingerKey(key)));

    Object.keys(main).forEach((key) => {
      if (!isArmHandFingerKey(key)) return;
      if (!opts.syncHands && isHandishKey(key)) return;

      const src = main[key];
      const dst = secondary[key] && typeof secondary[key] === 'object' ? secondary[key] : {};
      if (opts.pos && src.pos) dst.pos = deepClone(src.pos);
      if (opts.qtn && src.qtn) dst.qtn = deepClone(src.qtn);
      if (opts.scl && src.scl) dst.scl = deepClone(src.scl);
      if (src.isKitbashed) dst.isKitbashed = deepClone(src.isKitbashed);
      secondary[key] = dst;
    });

    if (cleanExtras) {
      Object.keys(secondary).forEach((key) => {
        if (isArmHandFingerKey(key) && !mainArmKeys.has(key)) delete secondary[key];
      });
    }
  }

  function ensureHandPoseSlots(json) {
    ensurePath(json, ['custom'], {});
    ensurePath(json, ['custom', 'handPoses'], {});
    const hp = json.custom.handPoses;
    if (!hp.human) hp.human = hp.human_0 || hp.human_1 || hp.human_2 || {};
    for (let i = 0; i < 5; i++) {
      const k = `human_${i}`;
      if (!(k in hp)) hp[k] = deepClone(hp.human);
    }
  }

  function ensureArmLengthSlots(json) {
    if (!json.sliders) json.sliders = {};
    const s = json.sliders;
    ['L', 'R'].forEach((side) => {
      const baseKey = 'arms' + side;
      if (s[baseKey] == null) return;
      const baseVal = s[baseKey];
      for (let i = 0; i < 5; i++) {
        const extraKey = 'arms' + i + side;
        if (!(extraKey in s)) s[extraKey] = baseVal;
      }
    });
  }

  function doArmsSync() {
    waitForCK(() => {
      const current = snapshotCurrentCharacter();
      if (!current) return;

      const opts = {
        pos: !!state.arms.pos,
        qtn: !!state.arms.qtn,
        scl: !!state.arms.scl,
        syncHands: !!state.arms.syncHands,
      };

      const targets = [];
      if (state.arms.target2) targets.push('bodyUpper0');
      if (state.arms.target3) targets.push('bodyUpper1');

      if (!targets.length) return;

      pushHistory(current);

      const json = deepClone(current);
      ensurePath(json, ['transforms'], {});
      const transforms = json.transforms;

      const main = transforms.bodyUpper || {};

      targets.forEach((key) => {
        if (!transforms[key]) transforms[key] = {};
        const secondary = transforms[key];
        const cleanExtras = key === 'bodyUpper0';
        syncOneSecondary(main, secondary, cleanExtras, opts);
      });

      transforms.bodyUpper = main;

      if (state.arms.syncHands) ensureHandPoseSlots(json);
      ensureArmLengthSlots(json);

      applyCharacter(json);
    });
  }

  function breastSignature(side) {
    const s = side === 'R' ? 'R' : 'L';
    return {
      base: `main_chest${s}_01_`,
      fat: `main_chest${s}_01_fat_`,
      horiz: `main_chest${s}_horizontal_`,
      kitbash: `main_chest${s}_kitbash_`,
      vert: `main_chest${s}_vertical_`,
    };
  }

  function doBreastMirror() {
    waitForCK(() => {
      const current = snapshotCurrentCharacter();
      if (!current) return;

      const from = state.breast.from === 'R' ? 'R' : 'L';
      const to = from === 'L' ? 'R' : 'L';

      pushHistory(current);

      const json = deepClone(current);
      ensurePath(json, ['transforms'], {});
      const t = json.transforms;

      const main = t.bodyUpper || {};

      const fromSig = breastSignature(from);
      const toSig = breastSignature(to);

      Object.keys(main).forEach((k) => {
        const isFrom =
          k.startsWith(fromSig.base) ||
          k.startsWith(fromSig.fat) ||
          k.startsWith(fromSig.horiz) ||
          k.startsWith(fromSig.kitbash) ||
          k.startsWith(fromSig.vert);

        if (!isFrom) return;

        const src = main[k];
        const mapped = k
          .replace(fromSig.base, toSig.base)
          .replace(fromSig.fat, toSig.fat)
          .replace(fromSig.horiz, toSig.horiz)
          .replace(fromSig.kitbash, toSig.kitbash)
          .replace(fromSig.vert, toSig.vert);

        if (!main[mapped]) main[mapped] = {};
        const dst = main[mapped];

        if (state.breast.pos && src.pos) dst.pos = invertVec3(src.pos);
        if (state.breast.qtn && src.qtn) dst.qtn = deepClone(src.qtn);
        if (state.breast.scl && src.scl) dst.scl = deepClone(src.scl);
        if (src.isKitbashed) dst.isKitbashed = deepClone(src.isKitbashed);
      });

      t.bodyUpper = main;
      applyCharacter(json);
    });
  }

  function onHotkeys(e) {
    if (e.defaultPrevented) return;
    if (isTypingTarget(e.target)) return;

    const isMac = /Mac|iPhone|iPad|iPod/.test(UW.navigator.platform || '');
    const ctrl = isMac ? e.metaKey : e.ctrlKey;

    if (ctrl && !e.shiftKey && e.code === 'KeyZ') {
      e.preventDefault();
      undoGlobal();
      return;
    }

    if (ctrl && e.shiftKey && e.code === 'KeyZ') {
      e.preventDefault();
      redoGlobal();
      return;
    }

    if (!e.ctrlKey && !e.metaKey && !e.altKey && e.code === 'Digit1') {
      if (UW.WitchDock && typeof UW.WitchDock.show === 'function') {
        UW.WitchDock.show();
        state.__flash = Date.now();
        UW.WitchDock.render();
      }
    }
  }

  function checkbox(label, checked, onChange) {
    const wrap = document.createElement('label');
    wrap.style.display = 'inline-flex';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '6px';
    wrap.style.userSelect = 'none';
    wrap.style.cursor = 'pointer';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !!checked;
    cb.addEventListener('change', () => onChange(cb.checked));

    const text = document.createElement('span');
    text.textContent = label;

    wrap.appendChild(cb);
    wrap.appendChild(text);
    return { wrap, cb };
  }

  function hr() {
    const d = document.createElement('div');
    d.style.height = '1px';
    d.style.background = 'rgba(255,255,255,0.10)';
    d.style.margin = '10px 0';
    return d;
  }

  function render(container) {
    container.innerHTML = '';

    const status = document.createElement('div');
    status.style.opacity = '0.75';
    status.style.marginBottom = '8px';
    status.style.fontSize = '11px';
    container.appendChild(status);
    ui.status = status;

    const topRow = document.createElement('div');
    topRow.style.display = 'flex';
    topRow.style.gap = '8px';
    topRow.style.alignItems = 'center';
    topRow.style.marginBottom = '10px';

    const undoBtn = document.createElement('button');
    undoBtn.textContent = 'Undo';
    undoBtn.addEventListener('click', undoGlobal);

    const redoBtn = document.createElement('button');
    redoBtn.textContent = 'Redo';
    redoBtn.addEventListener('click', redoGlobal);

    ui.btnUndo = undoBtn;
    ui.btnRedo = redoBtn;

    topRow.appendChild(undoBtn);
    topRow.appendChild(redoBtn);

    const hk = document.createElement('div');
    hk.style.opacity = '0.65';
    hk.style.marginLeft = 'auto';
    hk.textContent = 'Hotkeys: Ctrl+Z / Ctrl+Shift+Z';
    topRow.appendChild(hk);

    container.appendChild(topRow);

    const armsTitle = document.createElement('div');
    armsTitle.style.fontWeight = '650';
    armsTitle.textContent = 'Extra Arms Sync';
    container.appendChild(armsTitle);

    const targetRow = document.createElement('div');
    targetRow.style.display = 'flex';
    targetRow.style.gap = '12px';
    targetRow.style.margin = '8px 0';

    const c2 = checkbox('2nd Arm', state.arms.target2, (v) => { state.arms.target2 = v; saveState(); });
    const c3 = checkbox('3rd Arm', state.arms.target3, (v) => { state.arms.target3 = v; saveState(); });

    targetRow.appendChild(c2.wrap);
    targetRow.appendChild(c3.wrap);

    const syncBtn = document.createElement('button');
    syncBtn.textContent = 'Sync Arms';
    syncBtn.style.marginLeft = 'auto';
    syncBtn.addEventListener('click', doArmsSync);

    targetRow.appendChild(syncBtn);
    container.appendChild(targetRow);

    const whatRow = document.createElement('div');
    whatRow.style.display = 'flex';
    whatRow.style.gap = '12px';
    whatRow.style.flexWrap = 'wrap';

    const p = checkbox('Position', state.arms.pos, (v) => { state.arms.pos = v; saveState(); });
    const q = checkbox('Rotation', state.arms.qtn, (v) => { state.arms.qtn = v; saveState(); });
    const s = checkbox('Scale', state.arms.scl, (v) => { state.arms.scl = v; saveState(); });

    whatRow.appendChild(p.wrap);
    whatRow.appendChild(q.wrap);
    whatRow.appendChild(s.wrap);

    container.appendChild(whatRow);

    const handsRow = document.createElement('div');
    handsRow.style.marginTop = '8px';
    const hcb = checkbox('Sync Hands/Fingers', state.arms.syncHands, (v) => { state.arms.syncHands = v; saveState(); });
    handsRow.appendChild(hcb.wrap);
    container.appendChild(handsRow);

    container.appendChild(hr());

    const bTitle = document.createElement('div');
    bTitle.style.fontWeight = '650';
    bTitle.textContent = 'Breast Mirror';
    container.appendChild(bTitle);

    const bRow = document.createElement('div');
    bRow.style.display = 'flex';
    bRow.style.alignItems = 'center';
    bRow.style.gap = '10px';
    bRow.style.margin = '8px 0';

    const fromLabel = document.createElement('div');
    fromLabel.textContent = state.breast.from === 'R' ? 'Right Breast' : 'Left Breast';

    const dirBtn = document.createElement('button');
    dirBtn.textContent = '→';
    dirBtn.addEventListener('click', () => {
      state.breast.from = state.breast.from === 'R' ? 'L' : 'R';
      saveState();
      render(container);
    });

    const toLabel = document.createElement('div');
    const toSide = state.breast.from === 'R' ? 'L' : 'R';
    toLabel.textContent = toSide === 'R' ? 'Right Breast' : 'Left Breast';

    const copyBtn = document.createElement('button');
    copyBtn.textContent = `Copy to ${toLabel.textContent}`;
    copyBtn.style.marginLeft = 'auto';
    copyBtn.addEventListener('click', doBreastMirror);

    bRow.appendChild(fromLabel);
    bRow.appendChild(dirBtn);
    bRow.appendChild(toLabel);
    bRow.appendChild(copyBtn);

    container.appendChild(bRow);

    const bOpts = document.createElement('div');
    bOpts.style.display = 'flex';
    bOpts.style.gap = '12px';
    bOpts.style.flexWrap = 'wrap';

    const bp = checkbox('Position', state.breast.pos, (v) => { state.breast.pos = v; saveState(); });
    const bq = checkbox('Rotation', state.breast.qtn, (v) => { state.breast.qtn = v; saveState(); });
    const bs = checkbox('Scale', state.breast.scl, (v) => { state.breast.scl = v; saveState(); });

    bOpts.appendChild(bp.wrap);
    bOpts.appendChild(bq.wrap);
    bOpts.appendChild(bs.wrap);

    container.appendChild(bOpts);

    updateUndoRedoUI();
    refreshStatus();
  }

  function refreshStatus() {
    if (!ui.status) return;
    const ok = UW.CK && UW.CK.UndoQueue && UW.CK.tryLoadCharacter;
    ui.status.textContent = ok ? 'Ready.' : 'Waiting for HeroForge to finish loading…';
  }

  function init() {
    loadState();

    UW.WitchDock.addTab?.({ id: TAB_ID, title: 'Sync', order: 10 });

    UW.WitchDock.registerSection({
      id: SECTION_ID,
      tab: TAB_ID,
      title: 'Body Editor',
      order: 10,
      render,
      onShow: refreshStatus,
    });

    document.addEventListener('keydown', onHotkeys, true);

    setInterval(refreshStatus, 1000);
  }

  waitForDock();
})();

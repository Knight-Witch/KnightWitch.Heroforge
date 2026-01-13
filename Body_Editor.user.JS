// ==UserScript==
// @name         Body Editor WITCH DOCK TEST v1
// @namespace    http://tampermonkey.net/
// @version      0.2.1-wdtest1
// @description  Body Editor tool registered into Witch Dock (WITCH DOCK TEST v1).
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        unsafeWindow
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Body_Editor.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Body_Editor.user.js
// ==/UserScript==

// BASELINE SNAPSHOT
// Witch Dock + Body Editor integration
// Verified working: 01/12/2026
// Do not modify this version

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  const STORE_KEY = 'hfBodyEditorDock.v1';
  const BUTT_BASELINE_KEY = 'hfBodyEditorDock.buttBaselines.v1';

  const state = {
    collapsed: { arms: false, breast: false, butt: false },
    arms: { target2: true, target3: true, copyPos: true, copyQtn: true, copyScl: true, syncHands: true },
    breast: { from: 'L', copyPos: true, copyQtn: true, copyScl: true },
    butt: { from: 'L', copyPos: true, copyQtn: true, copyScl: true }
  };

  const DEFAULT_BREAST_KEYS = {
    L: {
      '': 'main_chestL_01_0034_bind_jnt',
      fat: 'main_chestL_01_fat_0035_bind_jnt',
      horizontal: 'main_chestL_horizontal_1730_bind_jnt',
      vertical: 'main_chestL_vertical_1729_bind_jnt',
      kitbash: 'main_chestL_kitbash_1733_bind_jnt'
    },
    R: {
      '': 'main_chestR_01_0121_bind_jnt',
      fat: 'main_chestR_01_fat_0122_bind_jnt',
      horizontal: 'main_chestR_horizontal_1731_bind_jnt',
      vertical: 'main_chestR_vertical_1728_bind_jnt',
      kitbash: 'main_chestR_kitbash_1732_bind_jnt'
    }
  };

  const BUTT_KEY_PAIRS = [
    ['main_buttL_kitbash_1751_bind_jnt', 'main_buttR_kitbash_1752_bind_jnt'],
    ['main_buttL_01_legLength_1763_bind_jnt', 'main_buttR_01_legLength_1764_bind_jnt'],
    ['main_buttL_01_0029_bind_jnt', 'main_buttR_01_0116_bind_jnt'],
    ['main_buttL_01_fat_0031_bind_jnt', 'main_buttR_01_fat_0118_bind_jnt'],
    ['main_buttL_01_curves_1803_bind_jnt', 'main_buttR_01_curves_1804_bind_jnt'],
    ['main_buttL_01_scaleV2_1814_bind_jnt', 'main_buttR_01_scaleV2_1813_bind_jnt'],
    ['main_buttL_01_curves_0030_bind_jnt', 'main_buttR_01_curves_0117_bind_jnt'],
    ['main_buttL_01_scale_1801_bind_jnt', 'main_buttR_01_scale_1802_bind_jnt']
  ];

  let rootEl = null;

  function loadState() {
    try {
      const raw = UW.localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object') return;
      if (saved.collapsed && typeof saved.collapsed === 'object') Object.assign(state.collapsed, saved.collapsed);
      if (saved.arms && typeof saved.arms === 'object') Object.assign(state.arms, saved.arms);
      if (saved.breast && typeof saved.breast === 'object') Object.assign(state.breast, saved.breast);
      if (saved.butt && typeof saved.butt === 'object') Object.assign(state.butt, saved.butt);
    } catch (e) {}
  }

  function saveState() {
    try {
      UW.localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          collapsed: state.collapsed,
          arms: state.arms,
          breast: state.breast,
          butt: state.butt
        })
      );
    } catch (e) {}
  }

  function readButtBaselines() {
    try {
      const raw = UW.localStorage.getItem(BUTT_BASELINE_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || typeof obj !== 'object') return null;
      return obj;
    } catch (e) {
      return null;
    }
  }

  function injectStyle() {
    const id = 'kw-body-editor-style';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }

    el.textContent =
      '.kwbe{color:#e8e8e8;font:12px/1.25 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;}' +
      '.kwbe .sec{border:1px solid rgba(255,255,255,0.10);border-radius:10px;background:rgba(255,255,255,0.04);overflow:hidden;margin-bottom:8px;}' +
      '.kwbe .secHdr{display:flex;align-items:center;gap:10px;padding:10px;cursor:pointer;user-select:none;background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.08);}' +
      '.kwbe .secHdr:hover{background:rgba(255,255,255,0.06);}' +
      '.kwbe .secHdr .box{width:16px;height:16px;border-radius:3px;border:1px solid rgba(255,255,255,0.18);background:rgba(0,0,0,0.20);display:flex;align-items:center;justify-content:center;font-size:12px;line-height:1;opacity:0.95;}' +
      '.kwbe .secHdr .name{font-weight:700;font-size:13px;letter-spacing:0.2px;}' +
      '.kwbe .secBody{padding:10px;display:flex;flex-direction:column;gap:10px;}' +
      '.kwbe .sec[data-collapsed="1"] .secBody{display:none;}' +
      '.kwbe .row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}' +
      '.kwbe .rowAction{display:flex;align-items:center;justify-content:space-between;gap:10px;}' +
      '.kwbe .rowAction .left{display:flex;align-items:center;gap:10px;flex:1;min-width:0;}' +
      '.kwbe .rowAction .right{display:flex;align-items:center;gap:8px;flex:0 0 auto;}' +
      '.kwbe button{background:rgba(255,255,255,0.10);color:#e8e8e8;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:4px 8px;cursor:pointer;}' +
      '.kwbe button:hover{background:rgba(255,255,255,0.16);}' +
      '.kwbe button:disabled{opacity:0.45;cursor:not-allowed;}' +
      '.kwbe .primary{padding:7px 10px;font-weight:700;border-radius:10px;}' +
      '.kwbe .ghost{background:rgba(255,255,255,0.06);}' +
      '.kwbe label{display:flex;align-items:center;gap:8px;user-select:none;}' +
      '.kwbe input[type="checkbox"]{transform:translateY(1px);}' +
      '.kwbe .split{display:flex;align-items:center;gap:8px;}' +
      '.kwbe .mono{font-variant-numeric:tabular-nums;opacity:0.78;font-size:11px;}' +
      '.kwbe .iconBtn{width:34px;height:30px;padding:0;display:inline-flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;border-radius:10px;}' +
      '.kwbe .dirBtn{cursor:pointer;}' +
      '.kwbe .dirBtn:hover{background:rgba(255,255,255,0.20);border-color:rgba(255,255,255,0.22);}' +
      '.kwbe .pillBtn{border-radius:10px;padding:6px 10px;opacity:0.95;}';
  }

  function checkbox(labelText, checked, onChange) {
    const lab = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = !!checked;
    input.addEventListener('change', function () {
      onChange(!!input.checked);
    });
    const span = document.createElement('span');
    span.textContent = labelText;
    lab.appendChild(input);
    lab.appendChild(span);
    return lab;
  }

  function iconButton(text, title, onClick) {
    const b = document.createElement('button');
    b.className = 'iconBtn';
    b.textContent = text;
    b.title = title;
    b.addEventListener('click', onClick);
    return b;
  }

  function makeSection(titleText, collapsed, onToggle) {
    const sec = document.createElement('div');
    sec.className = 'sec';
    sec.dataset.collapsed = collapsed ? '1' : '0';

    const hdr = document.createElement('div');
    hdr.className = 'secHdr';

    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = collapsed ? '+' : '–';

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = titleText;

    hdr.appendChild(box);
    hdr.appendChild(name);

    const body = document.createElement('div');
    body.className = 'secBody';

    hdr.addEventListener('click', function () {
      const now = sec.dataset.collapsed === '1' ? false : true;
      sec.dataset.collapsed = now ? '1' : '0';
      box.textContent = now ? '+' : '–';
      onToggle(now);
      saveState();
    });

    sec.appendChild(hdr);
    sec.appendChild(body);

    return { sec, body };
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getUndoQueue() {
    const CK = UW.CK;
    const u = CK && CK.UndoQueue ? CK.UndoQueue : null;
    if (!u || !Array.isArray(u.queue) || typeof u.currentIndex !== 'number') return null;
    return u;
  }

  function snapshotCurrentCharacter() {
    const u = getUndoQueue();
    if (!u || u.queue.length === 0) return null;
    const current = u.queue[u.currentIndex];
    if (!current) return null;
    return deepClone(current);
  }

  function tryLoad(json) {
    const CK = UW.CK;
    if (!CK || typeof CK.tryLoadCharacter !== 'function') return false;
    try {
      CK.tryLoadCharacter(deepClone(json), 'Body Editor: invalid character data', function () {});
      return true;
    } catch (e) {
      return false;
    }
  }

  function commitCharacter(json) {
    const u = getUndoQueue();
    if (!u) return tryLoad(json);

    const base = u.queue.slice(0, u.currentIndex + 1);
    if (!tryLoad(json)) return false;

    try {
      u.queue = base.concat([deepClone(json)]);
      u.currentIndex = u.queue.length - 1;
    } catch (e) {}

    updateUndoRedoButtons();
    return true;
  }

  function updateUndoRedoButtons() {
    if (!rootEl) return;

    const u = getUndoQueue();
    const canUndo = !!u && u.currentIndex > 0;
    const canRedo = !!u && u.currentIndex < u.queue.length - 1;

    const undoBtns = rootEl.querySelectorAll('[data-kwbe-undo="1"]');
    const redoBtns = rootEl.querySelectorAll('[data-kwbe-redo="1"]');

    undoBtns.forEach(function (b) {
      b.disabled = !canUndo;
    });
    redoBtns.forEach(function (b) {
      b.disabled = !canRedo;
    });
  }

  function undoHF() {
    const u = getUndoQueue();
    const CK = UW.CK;
    if (!u || !CK) return;

    if (typeof u.undo === 'function') {
      try {
        u.undo();
      } catch (e) {}
      updateUndoRedoButtons();
      return;
    }

    if (u.currentIndex <= 0) return;
    u.currentIndex -= 1;
    const json = u.queue[u.currentIndex];
    if (json) tryLoad(json);
    updateUndoRedoButtons();
  }

  function redoHF() {
    const u = getUndoQueue();
    const CK = UW.CK;
    if (!u || !CK) return;

    if (typeof u.redo === 'function') {
      try {
        u.redo();
      } catch (e) {}
      updateUndoRedoButtons();
      return;
    }

    if (u.currentIndex >= u.queue.length - 1) return;
    u.currentIndex += 1;
    const json = u.queue[u.currentIndex];
    if (json) tryLoad(json);
    updateUndoRedoButtons();
  }

  function tryHookUndoQueueRefresh() {
    const u = getUndoQueue();
    if (!u) return;

    function wrap(obj, key) {
      const fn = obj && typeof obj[key] === 'function' ? obj[key] : null;
      if (!fn || fn.__kwbeWrapped) return;
      obj[key] = function () {
        const r = fn.apply(this, arguments);
        try {
          updateUndoRedoButtons();
        } catch (e) {}
        return r;
      };
      obj[key].__kwbeWrapped = true;
    }

    wrap(u, 'push');
    wrap(u, 'enqueue');
    wrap(u, 'add');
    wrap(u, 'record');
    wrap(u, 'undo');
    wrap(u, 'redo');
  }

  function ensurePath(obj, path) {
    let cur = obj;
    for (let i = 0; i < path.length; i++) {
      const k = path[i];
      if (!cur[k] || typeof cur[k] !== 'object') cur[k] = {};
      cur = cur[k];
    }
    return cur;
  }

  function cloneSelectedTransforms(src, dst, opts) {
    if (!src || typeof src !== 'object') return;
    if (!dst || typeof dst !== 'object') return;

    if (opts.copyPos && src.pos && typeof src.pos === 'object') dst.pos = deepClone(src.pos);
    if (opts.copyQtn && src.qtn && typeof src.qtn === 'object') dst.qtn = deepClone(src.qtn);
    if (opts.copyScl && src.scl && typeof src.scl === 'object') dst.scl = deepClone(src.scl);
    if (src.isKitbashed && typeof src.isKitbashed === 'object') dst.isKitbashed = deepClone(src.isKitbashed);
  }

  function shouldCopyNamedKey(key) {
    if (typeof key !== 'string') return false;
    if (key.indexOf('main_arm') === 0) return true;
    if (!state.arms.syncHands) return false;
    if (key.indexOf('main_hand') === 0) return true;
    if (key.indexOf('main_finger') === 0) return true;
    return false;
  }

  function syncOneSecondary(main, secondary, opts) {
    Object.keys(main).forEach(function (key) {
      if (!shouldCopyNamedKey(key)) return;
      if (!secondary[key] || typeof secondary[key] !== 'object') secondary[key] = {};
      cloneSelectedTransforms(main[key], secondary[key], opts);
    });
  }

  function ensureHandPoseSlots(json, targets) {
    if (!state.arms.syncHands) return;
    const hp = ensurePath(json, ['custom', 'handPoses']);
    if (!hp.human) return;

    if (targets.indexOf('bodyUpper0') !== -1) hp.human_0 = deepClone(hp.human);
    if (targets.indexOf('bodyUpper1') !== -1) hp.human_1 = deepClone(hp.human);
  }

  function ensureArmLengthSlots(json, targets) {
    if (!json.sliders || typeof json.sliders !== 'object') return;
    const s = json.sliders;

    ['L', 'R'].forEach(function (side) {
      const baseKey = 'arms' + side;
      if (s[baseKey] == null) return;
      const baseVal = s[baseKey];

      if (targets.indexOf('bodyUpper0') !== -1) s['arms0' + side] = baseVal;
      if (targets.indexOf('bodyUpper1') !== -1) s['arms1' + side] = baseVal;
    });
  }

  function ensureMainShoulderDefaults(main) {
    if (!main || typeof main !== 'object') return;

    const needQtn = !!state.arms.copyQtn;
    const needScl = !!state.arms.copyScl;
    if (!needQtn && !needScl) return;

    const L = 'main_armL_01_0012_bind_jnt';
    const R = 'main_armR_01_0099_bind_jnt';

    if (!main[L] || typeof main[L] !== 'object') main[L] = {};
    if (!main[R] || typeof main[R] !== 'object') main[R] = {};

    if (!main[L].isKitbashed) main[L].isKitbashed = { a: 1 };
    if (!main[R].isKitbashed) main[R].isKitbashed = { a: 1 };

    if (needScl && (!main[L].scl || typeof main[L].scl !== 'object')) main[L].scl = { x: 1.0001, y: 1.0001, z: 1.0001 };
    if (needScl && (!main[R].scl || typeof main[R].scl !== 'object')) main[R].scl = { x: 1.001, y: 1.001, z: 1.001 };

    if (needQtn && (!main[L].qtn || typeof main[L].qtn !== 'object')) main[L].qtn = { x: 0.0001, y: 0.0001, z: 0.0001, w: 0.0001 };
    if (needQtn && (!main[R].qtn || typeof main[R].qtn !== 'object')) main[R].qtn = { x: 0.001, y: 0.001, z: 0.001, w: 1 };
  }

  function doArmsSync() {
    const before = snapshotCurrentCharacter();
    if (!before) return;
    if (!state.arms.target2 && !state.arms.target3) return;

    const json = deepClone(before);
    const transforms = ensurePath(json, ['transforms']);
    const main = transforms.bodyUpper || {};

    ensureMainShoulderDefaults(main);

    const targets = [];
    if (state.arms.target2) targets.push('bodyUpper0');
    if (state.arms.target3) targets.push('bodyUpper1');

    const opts = { copyPos: !!state.arms.copyPos, copyQtn: !!state.arms.copyQtn, copyScl: !!state.arms.copyScl };

    targets.forEach(function (key) {
      if (!transforms[key] || typeof transforms[key] !== 'object') transforms[key] = {};
      syncOneSecondary(main, transforms[key], opts);
    });

    transforms.bodyUpper = main;
    json.transforms = transforms;

    ensureHandPoseSlots(json, targets);
    ensureArmLengthSlots(json, targets);

    commitCharacter(json);
  }

  function breastSignature(key) {
    if (typeof key !== 'string') return null;

    const l = 'main_chestL_';
    const r = 'main_chestR_';
    let side = null;
    let rest = null;

    if (key.indexOf(l) === 0) {
      side = 'L';
      rest = key.slice(l.length);
    } else if (key.indexOf(r) === 0) {
      side = 'R';
      rest = key.slice(r.length);
    } else return null;

    if (rest.indexOf('_bind_jnt', rest.length - '_bind_jnt'.length) === -1) return null;
    rest = rest.slice(0, -'_bind_jnt'.length);

    const tokens = rest.split('_').filter(Boolean);
    const filtered = [];
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (/^\d+$/.test(t)) continue;
      filtered.push(t);
    }
    return { side: side, sig: filtered.join('_') };
  }

  function invertVec3(v) {
    const x = v && typeof v.x === 'number' ? v.x : undefined;
    const y = v && typeof v.y === 'number' ? v.y : undefined;
    const z = v && typeof v.z === 'number' ? v.z : undefined;
    return { x: typeof x === 'number' ? -x : x, y: typeof y === 'number' ? -y : y, z: typeof z === 'number' ? -z : z };
  }

  function invertBreastPosVec3(v) {
    return invertVec3(v);
  }

  function invertButtPosVec3(v) {
    return invertVec3(v);
  }

  function ensureBreastKeysPresent(rig) {
    if (!rig || typeof rig !== 'object') return;

    const keys = Object.keys(rig);
    let hasAny = false;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (
        typeof k === 'string' &&
        (k.indexOf('main_chestL_') === 0 || k.indexOf('main_chestR_') === 0) &&
        k.indexOf('_bind_jnt', k.length - 9) !== -1
      ) {
        hasAny = true;
        break;
      }
    }
    if (!hasAny) return;

    const present = { L: {}, R: {} };
    Object.keys(rig).forEach(function (k) {
      const s = breastSignature(k);
      if (!s) return;
      present[s.side][s.sig] = k;
    });

    ['L', 'R'].forEach(function (side) {
      const defs = DEFAULT_BREAST_KEYS[side];
      Object.keys(defs).forEach(function (sig) {
        if (present[side][sig]) return;
        const key = defs[sig];
        if (!rig[key] || typeof rig[key] !== 'object') rig[key] = {};
      });
    });
  }

  function doBreastMirror() {
    const before = snapshotCurrentCharacter();
    if (!before) return;

    const json = deepClone(before);
    const rig = json && json.transforms && json.transforms.bodyUpper ? json.transforms.bodyUpper : null;
    if (!rig || typeof rig !== 'object') return;

    ensureBreastKeysPresent(rig);

    const left = {};
    const right = {};

    Object.keys(rig).forEach(function (k) {
      const s = breastSignature(k);
      if (!s) return;
      if (s.side === 'L') left[s.sig] = k;
      else right[s.sig] = k;
    });

    const fromSide = state.breast.from === 'L' ? 'L' : 'R';
    const toSide = fromSide === 'L' ? 'R' : 'L';

    const fromMap = fromSide === 'L' ? left : right;
    const toMap = toSide === 'L' ? left : right;

    const opts = { copyPos: !!state.breast.copyPos, copyQtn: !!state.breast.copyQtn, copyScl: !!state.breast.copyScl };

    const shared = Object.keys(fromMap).filter(function (sig) {
      return sig in toMap;
    });
    if (!shared.length) return;

    for (let i = 0; i < shared.length; i++) {
      const sig = shared[i];
      const fromKey = fromMap[sig];
      const toKey = toMap[sig];
      const src = rig[fromKey];
      const dst = rig[toKey];
      if (!src || typeof src !== 'object' || !dst || typeof dst !== 'object') continue;

      if (opts.copyPos) {
        if (src.pos && typeof src.pos === 'object') dst.pos = invertBreastPosVec3(src.pos);
        else delete dst.pos;
      }
      if (opts.copyQtn) {
        if (src.qtn && typeof src.qtn === 'object') dst.qtn = deepClone(src.qtn);
        else delete dst.qtn;
      }
      if (opts.copyScl) {
        if (src.scl && typeof src.scl === 'object') dst.scl = deepClone(src.scl);
        else delete dst.scl;
      }

      if (src.isKitbashed && typeof src.isKitbashed === 'object') dst.isKitbashed = deepClone(src.isKitbashed);
      else delete dst.isKitbashed;
    }

    commitCharacter(json);
  }

  function doButtMirror() {
    const before = snapshotCurrentCharacter();
    if (!before) return;

    const json = deepClone(before);
    const rig = json && json.transforms && json.transforms.bodyUpper ? json.transforms.bodyUpper : null;
    if (!rig || typeof rig !== 'object') return;

    const fromSide = state.butt.from === 'L' ? 'L' : 'R';

    const opts = { copyPos: !!state.butt.copyPos, copyQtn: !!state.butt.copyQtn, copyScl: !!state.butt.copyScl };
    const baselines = readButtBaselines();

    if (!opts.copyPos && !opts.copyQtn && !opts.copyScl) return;

    for (const pair of BUTT_KEY_PAIRS) {
      const lKey = pair[0];
      const rKey = pair[1];

      const fromKey = fromSide === 'L' ? lKey : rKey;
      const toKey = fromSide === 'L' ? rKey : lKey;

      const hasSrc = Object.prototype.hasOwnProperty.call(rig, fromKey);
      if (!hasSrc) {
        if (Object.prototype.hasOwnProperty.call(rig, toKey)) delete rig[toKey];
        continue;
      }

      const src = rig[fromKey];
      if (!src || typeof src !== 'object') {
        if (Object.prototype.hasOwnProperty.call(rig, toKey)) delete rig[toKey];
        continue;
      }

      const hasAnySelected =
        (opts.copyPos && src.pos && typeof src.pos === 'object') ||
        (opts.copyQtn && src.qtn && typeof src.qtn === 'object') ||
        (opts.copyScl && src.scl && typeof src.scl === 'object') ||
        (src.isKitbashed && typeof src.isKitbashed === 'object');

      if (!hasAnySelected) {
        if (Object.prototype.hasOwnProperty.call(rig, toKey)) delete rig[toKey];
        continue;
      }

      if (!rig[toKey] || typeof rig[toKey] !== 'object') rig[toKey] = {};
      const dst = rig[toKey];

      if (opts.copyPos) {
        if (src.pos && typeof src.pos === 'object') dst.pos = invertButtPosVec3(src.pos);
        else delete dst.pos;
      }
      if (opts.copyQtn) {
        if (src.qtn && typeof src.qtn === 'object') dst.qtn = deepClone(src.qtn);
        else delete dst.qtn;
      }
      if (opts.copyScl) {
        if (src.scl && typeof src.scl === 'object') dst.scl = deepClone(src.scl);
        else delete dst.scl;
      }

      if (baselines && typeof baselines === 'object') {
        const b = baselines[toKey];
        if (!opts.copyPos && !dst.pos && b && b.pos && typeof b.pos === 'object') dst.pos = deepClone(b.pos);
        if (!opts.copyQtn && !dst.qtn && b && b.qtn && typeof b.qtn === 'object') dst.qtn = deepClone(b.qtn);
      }

      if (src.isKitbashed && typeof src.isKitbashed === 'object') dst.isKitbashed = deepClone(src.isKitbashed);
      else delete dst.isKitbashed;

      if (dst && typeof dst === 'object' && Object.keys(dst).length === 0) delete rig[toKey];
    }

    commitCharacter(json);
  }

  function waitForCK(cb) {
    try {
      if (UW && UW.CK && UW.CK.UndoQueue) cb();
      else setTimeout(function () { waitForCK(cb); }, 250);
    } catch (e) {
      setTimeout(function () { waitForCK(cb); }, 500);
    }
  }

  function renderArmsSection(container) {
    const s = makeSection('Extra Arms Sync', !!state.collapsed.arms, function (v) {
      state.collapsed.arms = v;
    });
    const body = s.body;

    const row1 = document.createElement('div');
    row1.className = 'rowAction';

    const left = document.createElement('div');
    left.className = 'left';

    const syncBtn = document.createElement('button');
    syncBtn.className = 'primary';
    syncBtn.textContent = 'Sync Extra Arms';
    syncBtn.addEventListener('click', function () {
      doArmsSync();
    });

    left.appendChild(syncBtn);

    const right = document.createElement('div');
    right.className = 'right';

    const undoBtn = iconButton('↶', 'Undo', function () {
      undoHF();
    });
    undoBtn.setAttribute('data-kwbe-undo', '1');

    const redoBtn = iconButton('↷', 'Redo', function () {
      redoHF();
    });
    redoBtn.setAttribute('data-kwbe-redo', '1');

    right.appendChild(undoBtn);
    right.appendChild(redoBtn);

    row1.appendChild(left);
    row1.appendChild(right);
    body.appendChild(row1);

    const row2 = document.createElement('div');
    row2.className = 'row';

    row2.appendChild(
      checkbox('2nd Arm', state.arms.target2, function (v) {
        state.arms.target2 = v;
        saveState();
        updateButtons();
      })
    );
    row2.appendChild(
      checkbox('3rd Arm', state.arms.target3, function (v) {
        state.arms.target3 = v;
        saveState();
        updateButtons();
      })
    );
    row2.appendChild(
      checkbox('Sync Hands/Fingers', state.arms.syncHands, function (v) {
        state.arms.syncHands = v;
        saveState();
      })
    );

    body.appendChild(row2);

    const row3 = document.createElement('div');
    row3.className = 'row';

    row3.appendChild(
      checkbox('Position', state.arms.copyPos, function (v) {
        state.arms.copyPos = v;
        saveState();
      })
    );
    row3.appendChild(
      checkbox('Rotation', state.arms.copyQtn, function (v) {
        state.arms.copyQtn = v;
        saveState();
      })
    );
    row3.appendChild(
      checkbox('Scale', state.arms.copyScl, function (v) {
        state.arms.copyScl = v;
        saveState();
      })
    );

    body.appendChild(row3);

    const hint = document.createElement('div');
    hint.className = 'mono';
    hint.textContent = 'Pose main set of arms, then sync extra arms.';
    body.appendChild(hint);

    function updateButtons() {
      syncBtn.disabled = !state.arms.target2 && !state.arms.target3;
    }

    updateButtons();
    container.appendChild(s.sec);
  }

  function renderBreastSection(container) {
    const s = makeSection('Breast Mirror', !!state.collapsed.breast, function (v) {
      state.collapsed.breast = v;
    });
    const body = s.body;

    const row1 = document.createElement('div');
    row1.className = 'rowAction';

    const left = document.createElement('div');
    left.className = 'left';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'primary';
    copyBtn.addEventListener('click', function () {
      doBreastMirror();
    });

    left.appendChild(copyBtn);

    const right = document.createElement('div');
    right.className = 'right';

    const undoBtn = iconButton('↶', 'Undo', function () {
      undoHF();
    });
    undoBtn.setAttribute('data-kwbe-undo', '1');

    const redoBtn = iconButton('↷', 'Redo', function () {
      redoHF();
    });
    redoBtn.setAttribute('data-kwbe-redo', '1');

    right.appendChild(undoBtn);
    right.appendChild(redoBtn);

    row1.appendChild(left);
    row1.appendChild(right);
    body.appendChild(row1);

    const row2 = document.createElement('div');
    row2.className = 'row';

    const split = document.createElement('div');
    split.className = 'split';

    const leftLabel = document.createElement('button');
    leftLabel.className = 'ghost pillBtn';
    leftLabel.disabled = true;

    const arrowBtn = document.createElement('button');
    arrowBtn.className = 'dirBtn pillBtn';
    arrowBtn.textContent = '→';
    arrowBtn.title = 'Click to switch direction';
    arrowBtn.addEventListener('click', function () {
      state.breast.from = state.breast.from === 'L' ? 'R' : 'L';
      saveState();
      updateLabels();
    });

    const rightLabel = document.createElement('button');
    rightLabel.className = 'ghost pillBtn';
    rightLabel.disabled = true;

    split.appendChild(leftLabel);
    split.appendChild(arrowBtn);
    split.appendChild(rightLabel);

    row2.appendChild(split);
    body.appendChild(row2);

    const row3 = document.createElement('div');
    row3.className = 'row';

    row3.appendChild(
      checkbox('Position', state.breast.copyPos, function (v) {
        state.breast.copyPos = v;
        saveState();
      })
    );
    row3.appendChild(
      checkbox('Rotation', state.breast.copyQtn, function (v) {
        state.breast.copyQtn = v;
        saveState();
      })
    );
    row3.appendChild(
      checkbox('Scale', state.breast.copyScl, function (v) {
        state.breast.copyScl = v;
        saveState();
      })
    );

    body.appendChild(row3);

    const hint = document.createElement('div');
    hint.className = 'mono';
    hint.textContent = 'Click the arrow to switch direction (left ↔ right breast).';
    body.appendChild(hint);

    function updateLabels() {
      const from = state.breast.from === 'L' ? 'L' : 'R';
      const to = from === 'L' ? 'R' : 'L';
      leftLabel.textContent = from === 'L' ? 'Left Breast' : 'Right Breast';
      rightLabel.textContent = to === 'L' ? 'Left Breast' : 'Right Breast';
      copyBtn.textContent = to === 'L' ? 'Copy to Left Breast' : 'Copy to Right Breast';
    }

    updateLabels();
    container.appendChild(s.sec);
  }

  function renderButtSection(container) {
    const s = makeSection('Butt Mirror', !!state.collapsed.butt, function (v) {
      state.collapsed.butt = v;
    });
    const body = s.body;

    const row1 = document.createElement('div');
    row1.className = 'rowAction';

    const left = document.createElement('div');
    left.className = 'left';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'primary';
    copyBtn.addEventListener('click', function () {
      doButtMirror();
    });

    left.appendChild(copyBtn);

    const right = document.createElement('div');
    right.className = 'right';

    const undoBtn = iconButton('↶', 'Undo', function () {
      undoHF();
    });
    undoBtn.setAttribute('data-kwbe-undo', '1');

    const redoBtn = iconButton('↷', 'Redo', function () {
      redoHF();
    });
    redoBtn.setAttribute('data-kwbe-redo', '1');

    right.appendChild(undoBtn);
    right.appendChild(redoBtn);

    row1.appendChild(left);
    row1.appendChild(right);
    body.appendChild(row1);

    const row2 = document.createElement('div');
    row2.className = 'row';

    const split = document.createElement('div');
    split.className = 'split';

    const leftLabel = document.createElement('button');
    leftLabel.className = 'ghost pillBtn';
    leftLabel.disabled = true;

    const arrowBtn = document.createElement('button');
    arrowBtn.className = 'dirBtn pillBtn';
    arrowBtn.textContent = '→';
    arrowBtn.title = 'Click to switch direction';
    arrowBtn.addEventListener('click', function () {
      state.butt.from = state.butt.from === 'L' ? 'R' : 'L';
      saveState();
      updateLabels();
    });

    const rightLabel = document.createElement('button');
    rightLabel.className = 'ghost pillBtn';
    rightLabel.disabled = true;

    split.appendChild(leftLabel);
    split.appendChild(arrowBtn);
    split.appendChild(rightLabel);

    row2.appendChild(split);
    body.appendChild(row2);

    const row3 = document.createElement('div');
    row3.className = 'row';

    row3.appendChild(
      checkbox('Position', state.butt.copyPos, function (v) {
        state.butt.copyPos = v;
        saveState();
      })
    );
    row3.appendChild(
      checkbox('Rotation', state.butt.copyQtn, function (v) {
        state.butt.copyQtn = v;
        saveState();
      })
    );
    row3.appendChild(
      checkbox('Scale', state.butt.copyScl, function (v) {
        state.butt.copyScl = v;
        saveState();
      })
    );

    body.appendChild(row3);

    const hint = document.createElement('div');
    hint.className = 'mono';
    hint.textContent = 'Click the arrow to switch direction (left ↔ right cheek).';
    body.appendChild(hint);

    function updateLabels() {
      const from = state.butt.from === 'L' ? 'L' : 'R';
      const to = from === 'L' ? 'R' : 'L';
      leftLabel.textContent = from === 'L' ? 'Left Cheek' : 'Right Cheek';
      rightLabel.textContent = to === 'L' ? 'Left Cheek' : 'Right Cheek';
      copyBtn.textContent = to === 'L' ? 'Copy to Left Cheek' : 'Copy to Right Cheek';
    }

    updateLabels();
    container.appendChild(s.sec);
  }

  function renderTool(container) {
    loadState();
    injectStyle();

    rootEl = document.createElement('div');
    rootEl.className = 'kwbe';
    container.appendChild(rootEl);

    renderArmsSection(rootEl);
    renderBreastSection(rootEl);
    renderButtSection(rootEl);

    waitForCK(function () {
      updateUndoRedoButtons();
      tryHookUndoQueueRefresh();
    });
  }

  function registerIntoWitchDock() {
    const dock = UW.WitchDock || (UW.unsafeWindow ? UW.unsafeWindow.WitchDock : null);
    const d = dock || UW.WitchDock;

    const api = UW.WitchDock || null;
    const target = UW.WitchDock || (UW.unsafeWindow ? UW.unsafeWindow.WitchDock : null);
    const wd = target || api;

    if (!wd || typeof wd.registerTool !== 'function') return false;

    wd.registerTool({
      id: 'body-editor',
      tab: 'Body Editor',
      title: 'Body Editor WITCH DOCK TEST v1',
      render: function (container) {
        renderTool(container);
      }
    });

    return true;
  }

  (function boot() {
    let tries = 0;
    const t = setInterval(function () {
      tries += 1;
      if (registerIntoWitchDock() || tries > 80) clearInterval(t);
    }, 100);
  })();
})();

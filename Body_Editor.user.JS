// ==UserScript==
// @name         Body Editor
// @namespace    body-editor
// @version      0.1.0
// @description  n advanced body editor tool that allows you to sync the pose/scale for various bodyparts, and more.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        unsafeWindow
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Body_Editor.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Body_Editor.user.js
// ==/UserScript==

/*
────────────────────────────────────────
Changelog
────────────────────────────────────────
/*
Body Editor — v0.1.0

This is a new script that replaces the old Extra Arms & Limbs Sync tool.

This script now REQUIRES the shared Witch Dock UI, which provides the floating
interface used by this and future Knight Witch tools:
https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Witch_Dock.user.js

All body-editing features will live inside this script as it continues to grow.

New features and changes:
- Rebuilt arm syncing with toggles for position, rotation, scale, and hands
- Ability to choose whether to sync the 2nd arm set, 3rd arm set, or both
- No longer requires using the Advanced Pose menu to initialize extra arms
- Automatically injects missing pose data for extra arms when syncing
- Adds breast mirroring to sync left/right breasts
- Tool now lives in a draggable floating dock
- Dock can be minimized or closed
- Adds hotkey support to toggle or minimize the dock
- Adds undo/redo support (Ctrl+Z / Ctrl+Shift+Z)

Migration note:
The old Extra Arms & Limbs Sync script is deprecated and will no longer receive
updates. Install Body Editor to access new and future body-editing features.
*/


(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  const STORE_KEY = 'hfBodyEditorDock.v1';
  const DOCK_ID = 'hf-body-editor-dock';
  const PILL_ID = 'hf-body-editor-pill';

  const UI = {
    width: 360,
  };

  const state = {
    visible: true,
    minimized: false,
    pos: { left: 16, top: 120 },
    arms: {
      target2: true,
      target3: true,
      copyPos: true,
      copyQtn: true,
      copyScl: true,
      syncHands: true,
    },
    breast: {
      from: 'L',
      copyPos: true,
      copyQtn: true,
      copyScl: true,
    },
  };

  const history = { undo: [], redo: [] };

  function loadState() {
    try {
      const raw = UW.localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object') return;

      if (typeof saved.visible === 'boolean') state.visible = saved.visible;
      if (typeof saved.minimized === 'boolean') state.minimized = saved.minimized;

      if (saved.pos && typeof saved.pos === 'object') {
        if (typeof saved.pos.left === 'number' && typeof saved.pos.top === 'number') {
          state.pos.left = saved.pos.left;
          state.pos.top = saved.pos.top;
        } else if (typeof saved.pos.right === 'number' || typeof saved.pos.bottom === 'number') {
          const right = typeof saved.pos.right === 'number' ? saved.pos.right : 16;
          const bottom = typeof saved.pos.bottom === 'number' ? saved.pos.bottom : 16;
          state.pos.left = Math.max(0, (UW.innerWidth || 1200) - right - UI.width);
          state.pos.top = Math.max(0, (UW.innerHeight || 800) - bottom - 220);
        }
      }

      if (saved.arms && typeof saved.arms === 'object') Object.assign(state.arms, saved.arms);
      if (saved.breast && typeof saved.breast === 'object') Object.assign(state.breast, saved.breast);
    } catch {}
  }

  function saveState() {
    try {
      UW.localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          visible: state.visible,
          minimized: state.minimized,
          pos: state.pos,
          arms: state.arms,
          breast: state.breast,
        })
      );
    } catch {}
  }

  function injectStyle() {
    const css = `
#${DOCK_ID}{
  position:fixed;
  z-index:2147483647;
  left:${state.pos.left}px;
  top:${state.pos.top}px;
  width:${UI.width}px;
  background:rgba(10,10,10,0.92);
  color:#e8e8e8;
  border:1px solid rgba(255,255,255,0.14);
  border-radius:10px;
  box-shadow:0 10px 30px rgba(0,0,0,0.45);
  font:12px/1.25 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  display:${state.visible ? 'block' : 'none'};
}
#${DOCK_ID}[data-min="1"] .b{ display:none; }
#${DOCK_ID} .h{
  cursor:move;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:8px 10px;
  user-select:none;
  border-bottom:1px solid rgba(255,255,255,0.10);
}
#${DOCK_ID} .t{ font-weight:600; letter-spacing:0.2px; }
#${DOCK_ID} .btns{ display:flex; gap:6px; align-items:center; }
#${DOCK_ID} button{
  background:rgba(255,255,255,0.10);
  color:#e8e8e8;
  border:1px solid rgba(255,255,255,0.12);
  border-radius:8px;
  padding:4px 8px;
  cursor:pointer;
}
#${DOCK_ID} button:hover{ background:rgba(255,255,255,0.16); }
#${DOCK_ID} button:disabled{ opacity:0.45; cursor:not-allowed; }
#${DOCK_ID} .b{
  padding:10px;
  display:flex;
  flex-direction:column;
  gap:10px;
}
#${DOCK_ID} .sec{
  border:1px solid rgba(255,255,255,0.10);
  border-radius:10px;
  padding:10px;
  background:rgba(255,255,255,0.04);
}
#${DOCK_ID} .secTitle{
  font-weight:600;
  margin-bottom:8px;
  opacity:0.95;
}
#${DOCK_ID} .row{
  display:flex;
  align-items:center;
  gap:10px;
  flex-wrap:wrap;
  margin-bottom:8px;
}
#${DOCK_ID} .row:last-child{ margin-bottom:0; }
#${DOCK_ID} label{
  display:flex;
  align-items:center;
  gap:8px;
  user-select:none;
}
#${DOCK_ID} input[type="checkbox"]{ transform:translateY(1px); }
#${DOCK_ID} .primary{
  padding:7px 10px;
  font-weight:600;
}
#${DOCK_ID} .split{
  display:flex;
  align-items:center;
  gap:8px;
  width:100%;
}
#${DOCK_ID} .mono{
  font-variant-numeric:tabular-nums;
  opacity:0.8;
}
#${DOCK_ID} .ghost{
  background:rgba(255,255,255,0.06);
}
#${PILL_ID}{
  position:fixed;
  z-index:2147483647;
  left:${state.pos.left}px;
  top:${state.pos.top}px;
  background:rgba(10,10,10,0.92);
  color:#e8e8e8;
  border:1px solid rgba(255,255,255,0.14);
  border-radius:999px;
  padding:6px 10px;
  font:12px/1.25 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  cursor:pointer;
  display:${state.visible ? 'none' : 'block'};
  user-select:none;
}
`;
    let el = document.getElementById(`${DOCK_ID}-style`);
    if (!el) {
      el = document.createElement('style');
      el.id = `${DOCK_ID}-style`;
      document.head.appendChild(el);
    }
    el.textContent = css;
  }

  function clampDockToViewport() {
    const dock = document.getElementById(DOCK_ID);
    if (!dock) return;

    const rect = dock.getBoundingClientRect();
    const w = rect.width || UI.width;
    const h = rect.height || 220;

    const maxLeft = Math.max(0, (UW.innerWidth || 1200) - w);
    const maxTop = Math.max(0, (UW.innerHeight || 800) - h);

    state.pos.left = Math.min(Math.max(0, state.pos.left), maxLeft);
    state.pos.top = Math.min(Math.max(0, state.pos.top), maxTop);

    dock.style.left = `${state.pos.left}px`;
    dock.style.top = `${state.pos.top}px`;

    const pill = document.getElementById(PILL_ID);
    if (pill) {
      pill.style.left = `${state.pos.left}px`;
      pill.style.top = `${state.pos.top}px`;
    }
  }

  function renderVisibility() {
    const dock = document.getElementById(DOCK_ID);
    const pill = document.getElementById(PILL_ID);
    if (!dock || !pill) return;

    dock.style.display = state.visible ? 'block' : 'none';
    pill.style.display = state.visible ? 'none' : 'block';

    dock.style.left = `${state.pos.left}px`;
    dock.style.top = `${state.pos.top}px`;
    pill.style.left = `${state.pos.left}px`;
    pill.style.top = `${state.pos.top}px`;

    dock.setAttribute('data-min', state.minimized ? '1' : '0');

    injectStyle();
    clampDockToViewport();
  }

  function waitForCK() {
    try {
      if (UW && UW.CK && UW.CK.UndoQueue) init();
      else setTimeout(waitForCK, 250);
    } catch {
      setTimeout(waitForCK, 500);
    }
  }

  function init() {
    if (document.getElementById(DOCK_ID)) return;

    loadState();
    injectStyle();

    const dock = document.createElement('div');
    dock.id = DOCK_ID;
    dock.setAttribute('data-min', state.minimized ? '1' : '0');

    const header = document.createElement('div');
    header.className = 'h';

    const title = document.createElement('div');
    title.className = 't';
    title.textContent = 'Body Editor';

    const btns = document.createElement('div');
    btns.className = 'btns';

    const minBtn = document.createElement('button');
    minBtn.textContent = '_';
    minBtn.addEventListener('click', () => {
      state.minimized = !state.minimized;
      saveState();
      renderVisibility();
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'x';
    closeBtn.addEventListener('click', () => {
      state.visible = false;
      saveState();
      renderVisibility();
    });

    btns.appendChild(minBtn);
    btns.appendChild(closeBtn);

    header.appendChild(title);
    header.appendChild(btns);

    const body = document.createElement('div');
    body.className = 'b';

    body.appendChild(renderArmsSection());
    body.appendChild(renderBreastSection());

    dock.appendChild(header);
    dock.appendChild(body);

    document.body.appendChild(dock);

    const pill = document.createElement('div');
    pill.id = PILL_ID;
    pill.textContent = 'Body Editor';
    pill.addEventListener('click', () => {
      state.visible = true;
      state.minimized = false;
      saveState();
      renderVisibility();
    });
    document.body.appendChild(pill);

    setupDrag(header, dock);

    UW.addEventListener('resize', () => {
      clampDockToViewport();
      saveState();
    });

    document.addEventListener('keydown', onHotkeyDock, true);
    document.addEventListener('keydown', onHotkeyUndoRedo, true);

    renderVisibility();
    updateUndoRedoButtons();
  }

  function checkbox(labelText, checked, onChange) {
    const lab = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = !!checked;
    input.addEventListener('change', () => onChange(!!input.checked));
    const span = document.createElement('span');
    span.textContent = labelText;
    lab.appendChild(input);
    lab.appendChild(span);
    return lab;
  }

  function renderArmsSection() {
    const sec = document.createElement('div');
    sec.className = 'sec';

    const st = document.createElement('div');
    st.className = 'secTitle';
    st.textContent = 'Extra Arms Sync';
    sec.appendChild(st);

    const row1 = document.createElement('div');
    row1.className = 'row';

    row1.appendChild(
      checkbox('2nd Arm', state.arms.target2, (v) => {
        state.arms.target2 = v;
        saveState();
        updateButtons();
      })
    );

    row1.appendChild(
      checkbox('3rd Arm', state.arms.target3, (v) => {
        state.arms.target3 = v;
        saveState();
        updateButtons();
      })
    );

    const syncBtn = document.createElement('button');
    syncBtn.className = 'primary';
    syncBtn.id = 'hf-body-editor-arms-sync';
    syncBtn.textContent = 'Sync Extra Arms';
    syncBtn.addEventListener('click', () => doArmsSync());

    row1.appendChild(syncBtn);
    sec.appendChild(row1);

    const row2 = document.createElement('div');
    row2.className = 'row';

    row2.appendChild(
      checkbox('Position', state.arms.copyPos, (v) => {
        state.arms.copyPos = v;
        saveState();
      })
    );
    row2.appendChild(
      checkbox('Rotation', state.arms.copyQtn, (v) => {
        state.arms.copyQtn = v;
        saveState();
      })
    );
    row2.appendChild(
      checkbox('Scale', state.arms.copyScl, (v) => {
        state.arms.copyScl = v;
        saveState();
      })
    );

    sec.appendChild(row2);

    const row3 = document.createElement('div');
    row3.className = 'row';

    row3.appendChild(
      checkbox('Sync Hands/Fingers', state.arms.syncHands, (v) => {
        state.arms.syncHands = v;
        saveState();
      })
    );

    const undoBtn = document.createElement('button');
    undoBtn.id = 'hf-body-editor-arms-undo';
    undoBtn.textContent = 'Undo';
    undoBtn.addEventListener('click', () => undoGlobal());

    const redoBtn = document.createElement('button');
    redoBtn.id = 'hf-body-editor-arms-redo';
    redoBtn.textContent = 'Redo';
    redoBtn.addEventListener('click', () => redoGlobal());

    const hint = document.createElement('div');
    hint.className = 'mono';
    hint.textContent = 'Dock: 1  |  Undo: Ctrl+Z  |  Redo: Ctrl+Shift+Z';

    row3.appendChild(undoBtn);
    row3.appendChild(redoBtn);
    row3.appendChild(hint);

    sec.appendChild(row3);

    function updateButtons() {
      const b = document.getElementById('hf-body-editor-arms-sync');
      if (!b) return;
      b.disabled = !state.arms.target2 && !state.arms.target3;
    }

    setTimeout(updateButtons, 0);
    return sec;
  }

  function renderBreastSection() {
    const sec = document.createElement('div');
    sec.className = 'sec';

    const st = document.createElement('div');
    st.className = 'secTitle';
    st.textContent = 'Breast Mirror';
    sec.appendChild(st);

    const row1 = document.createElement('div');
    row1.className = 'row';

    const split = document.createElement('div');
    split.className = 'split';

    const leftLabel = document.createElement('button');
    leftLabel.className = 'ghost';
    leftLabel.disabled = true;

    const arrowBtn = document.createElement('button');
    arrowBtn.textContent = '→';
    arrowBtn.addEventListener('click', () => {
      state.breast.from = state.breast.from === 'L' ? 'R' : 'L';
      saveState();
      updateBreastLabels();
    });

    const rightLabel = document.createElement('button');
    rightLabel.className = 'ghost';
    rightLabel.disabled = true;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'primary';
    copyBtn.id = 'hf-body-editor-breast-copy';
    copyBtn.textContent = '';
    copyBtn.addEventListener('click', () => doBreastMirror());

    split.appendChild(leftLabel);
    split.appendChild(arrowBtn);
    split.appendChild(rightLabel);
    row1.appendChild(split);
    row1.appendChild(copyBtn);

    sec.appendChild(row1);

    const row2 = document.createElement('div');
    row2.className = 'row';

    row2.appendChild(
      checkbox('Position', state.breast.copyPos, (v) => {
        state.breast.copyPos = v;
        saveState();
      })
    );
    row2.appendChild(
      checkbox('Rotation', state.breast.copyQtn, (v) => {
        state.breast.copyQtn = v;
        saveState();
      })
    );
    row2.appendChild(
      checkbox('Scale', state.breast.copyScl, (v) => {
        state.breast.copyScl = v;
        saveState();
      })
    );

    const undoBtn = document.createElement('button');
    undoBtn.id = 'hf-body-editor-breast-undo';
    undoBtn.textContent = 'Undo';
    undoBtn.addEventListener('click', () => undoGlobal());

    const redoBtn = document.createElement('button');
    redoBtn.id = 'hf-body-editor-breast-redo';
    redoBtn.textContent = 'Redo';
    redoBtn.addEventListener('click', () => redoGlobal());

    row2.appendChild(undoBtn);
    row2.appendChild(redoBtn);

    sec.appendChild(row2);

    function updateBreastLabels() {
      const from = state.breast.from === 'L' ? 'L' : 'R';
      const to = from === 'L' ? 'R' : 'L';
      leftLabel.textContent = from === 'L' ? 'Left Breast' : 'Right Breast';
      rightLabel.textContent = to === 'L' ? 'Left Breast' : 'Right Breast';
      copyBtn.textContent = to === 'L' ? 'Copy to Left Breast' : 'Copy to Right Breast';
    }

    updateBreastLabels();
    return sec;
  }

  function setupDrag(header, dock) {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    header.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = state.pos.left;
      startTop = state.pos.top;
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      state.pos.left = startLeft + dx;
      state.pos.top = startTop + dy;

      dock.style.left = `${state.pos.left}px`;
      dock.style.top = `${state.pos.top}px`;

      const pill = document.getElementById(PILL_ID);
      if (pill) {
        pill.style.left = `${state.pos.left}px`;
        pill.style.top = `${state.pos.top}px`;
      }
    });

    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      clampDockToViewport();
      saveState();
      renderVisibility();
    });
  }

  function isTypingTarget(el) {
    if (!el) return false;
    const tag = String(el.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
    if (el.isContentEditable) return true;
    return false;
  }

  function onHotkeyDock(e) {
    if (e.defaultPrevented) return;
    if (isTypingTarget(e.target)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.code !== 'Digit1') return;

    if (!state.visible) {
      state.visible = true;
      state.minimized = false;
      saveState();
      renderVisibility();
      return;
    }

    state.minimized = !state.minimized;
    saveState();
    renderVisibility();
  }

  function onHotkeyUndoRedo(e) {
    if (e.defaultPrevented) return;
    if (isTypingTarget(e.target)) return;
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.code !== 'KeyZ') return;

    if (e.shiftKey) {
      redoGlobal();
      e.preventDefault();
      return;
    }

    undoGlobal();
    e.preventDefault();
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function snapshotCurrentCharacter() {
    const CK = UW.CK;
    if (!CK || !CK.UndoQueue || !CK.UndoQueue.queue || CK.UndoQueue.queue.length === 0) return null;
    const u = CK.UndoQueue;
    const current = u.queue[u.currentIndex];
    if (!current) return null;
    return deepClone(current);
  }

  function applyCharacter(json) {
    const CK = UW.CK;
    if (!CK || typeof CK.tryLoadCharacter !== 'function') return false;
    try {
      CK.tryLoadCharacter(json, 'Body Editor: invalid character data', () => {});
      return true;
    } catch {
      return false;
    }
  }

  function pushHistory(before, after) {
    history.undo.push({ before, after });
    history.redo.length = 0;
    updateUndoRedoButtons();
  }

  function updateUndoRedoButtons() {
    const armsUndo = document.getElementById('hf-body-editor-arms-undo');
    const armsRedo = document.getElementById('hf-body-editor-arms-redo');
    const breastUndo = document.getElementById('hf-body-editor-breast-undo');
    const breastRedo = document.getElementById('hf-body-editor-breast-redo');

    const canUndo = history.undo.length > 0;
    const canRedo = history.redo.length > 0;

    if (armsUndo) armsUndo.disabled = !canUndo;
    if (armsRedo) armsRedo.disabled = !canRedo;
    if (breastUndo) breastUndo.disabled = !canUndo;
    if (breastRedo) breastRedo.disabled = !canRedo;
  }

  function undoGlobal() {
    if (!history.undo.length) return;
    const entry = history.undo.pop();
    history.redo.push(entry);
    applyCharacter(entry.before);
    updateUndoRedoButtons();
  }

  function redoGlobal() {
    if (!history.redo.length) return;
    const entry = history.redo.pop();
    history.undo.push(entry);
    applyCharacter(entry.after);
    updateUndoRedoButtons();
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
    if (key.startsWith('main_arm')) return true;
    if (!state.arms.syncHands) return false;
    if (key.startsWith('main_hand')) return true;
    if (key.startsWith('main_finger')) return true;
    return false;
  }

  function syncOneSecondary(main, secondary, cleanExtras, opts) {
    const mainNumericKeys = new Set(Object.keys(main).filter((k) => /^\d+$/.test(k)));

    Object.keys(main).forEach((key) => {
      if (/^\d+$/.test(key)) {
        if (!secondary[key] || typeof secondary[key] !== 'object') secondary[key] = {};
        cloneSelectedTransforms(main[key], secondary[key], opts);
      }
    });

    if (cleanExtras) {
      Object.keys(secondary).forEach((key) => {
        if (/^\d+$/.test(key) && !mainNumericKeys.has(key)) delete secondary[key];
      });
    }

    const mainNamedKeys = new Set(Object.keys(main).filter((k) => shouldCopyNamedKey(k)));

    Object.keys(main).forEach((key) => {
      if (!shouldCopyNamedKey(key)) return;
      if (!secondary[key] || typeof secondary[key] !== 'object') secondary[key] = {};
      cloneSelectedTransforms(main[key], secondary[key], opts);
    });

    if (cleanExtras) {
      Object.keys(secondary).forEach((key) => {
        if (shouldCopyNamedKey(key) && !mainNamedKeys.has(key)) delete secondary[key];
      });
    }
  }

  function ensureHandPoseSlots(json, targets) {
    if (!state.arms.syncHands) return;
    const hp = ensurePath(json, ['custom', 'handPoses']);
    if (!hp.human) return;

    if (targets.includes('bodyUpper0')) hp.human_0 = deepClone(hp.human);
    if (targets.includes('bodyUpper1')) hp.human_1 = deepClone(hp.human);
  }

  function ensureArmLengthSlots(json, targets) {
    if (!json.sliders || typeof json.sliders !== 'object') return;
    const s = json.sliders;

    ['L', 'R'].forEach((side) => {
      const baseKey = 'arms' + side;
      if (s[baseKey] == null) return;
      const baseVal = s[baseKey];

      if (targets.includes('bodyUpper0')) {
        const k0 = 'arms0' + side;
        if (!(k0 in s)) s[k0] = baseVal;
        else s[k0] = baseVal;
      }
      if (targets.includes('bodyUpper1')) {
        const k1 = 'arms1' + side;
        if (!(k1 in s)) s[k1] = baseVal;
        else s[k1] = baseVal;
      }
    });
  }

  function doArmsSync() {
    const before = snapshotCurrentCharacter();
    if (!before) return;

    if (!state.arms.target2 && !state.arms.target3) return;

    const json = deepClone(before);
    const transforms = ensurePath(json, ['transforms']);
    const main = transforms.bodyUpper || {};

    const targets = [];
    if (state.arms.target2) targets.push('bodyUpper0');
    if (state.arms.target3) targets.push('bodyUpper1');

    const opts = { copyPos: !!state.arms.copyPos, copyQtn: !!state.arms.copyQtn, copyScl: !!state.arms.copyScl };

    targets.forEach((key) => {
      if (!transforms[key] || typeof transforms[key] !== 'object') transforms[key] = {};
      const cleanExtras = key === 'bodyUpper0';
      syncOneSecondary(main, transforms[key], cleanExtras, opts);
    });

    transforms.bodyUpper = main;
    json.transforms = transforms;

    ensureHandPoseSlots(json, targets);
    ensureArmLengthSlots(json, targets);

    if (!applyCharacter(json)) return;

    pushHistory(before, json);
  }

  function breastSignature(key) {
    if (typeof key !== 'string') return null;

    const l = 'main_chestL_';
    const r = 'main_chestR_';
    let side = null;
    let rest = null;

    if (key.startsWith(l)) {
      side = 'L';
      rest = key.slice(l.length);
    } else if (key.startsWith(r)) {
      side = 'R';
      rest = key.slice(r.length);
    } else {
      return null;
    }

    if (!rest.endsWith('_bind_jnt')) return null;
    rest = rest.slice(0, -'_bind_jnt'.length);

    const tokens = rest.split('_').filter(Boolean);
    const filtered = [];
    for (const t of tokens) {
      if (/^\d+$/.test(t)) continue;
      filtered.push(t);
    }
    return { side, sig: filtered.join('_') };
  }

  function invertVec3(v) {
    return {
      x: typeof v?.x === 'number' ? -v.x : v?.x,
      y: typeof v?.y === 'number' ? -v.y : v?.y,
      z: typeof v?.z === 'number' ? -v.z : v?.z,
    };
  }

  function doBreastMirror() {
    const before = snapshotCurrentCharacter();
    if (!before) return;

    const json = deepClone(before);
    const rig = json?.transforms?.bodyUpper;
    if (!rig || typeof rig !== 'object') return;

    const left = {};
    const right = {};

    Object.keys(rig).forEach((k) => {
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

    const shared = Object.keys(fromMap).filter((sig) => sig in toMap);
    if (!shared.length) return;

    for (const sig of shared) {
      const fromKey = fromMap[sig];
      const toKey = toMap[sig];
      const src = rig[fromKey];
      const dst = rig[toKey];
      if (!src || typeof src !== 'object' || !dst || typeof dst !== 'object') continue;

      if (opts.copyPos && src.pos && typeof src.pos === 'object') dst.pos = invertVec3(src.pos);
      if (opts.copyQtn && src.qtn && typeof src.qtn === 'object') dst.qtn = deepClone(src.qtn);
      if (opts.copyScl && src.scl && typeof src.scl === 'object') dst.scl = deepClone(src.scl);
      if (src.isKitbashed && typeof src.isKitbashed === 'object') dst.isKitbashed = deepClone(src.isKitbashed);
    }

    if (!applyCharacter(json)) return;

    pushHistory(before, json);
  }

  waitForCK();
})();

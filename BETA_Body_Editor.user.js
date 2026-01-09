// ==UserScript==
// @name        (BETA) Body Editor
// @namespace   http://tampermonkey.net/
// @version     0.1.3
// @description  BETA TEST TOOL - Advanced body editing tools (Extra Arms Sync + Breast Mirror + Buttcheek Mirror). This is a BETA TEST and will eventually need to be replaced when Witch Dock officially releases.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        unsafeWindow
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/BETA_Body_Editor.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/BETA_Body_Editor.user.js
// ==/UserScript==

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  const STORE_KEY = 'hfBodyEditorDock.v1';
  const DOCK_ID = 'hf-body-editor-dock';
  const PILL_ID = 'hf-body-editor-pill';

  const UI = { width: 360 };

  const state = {
    visible: true,
    minimized: false,
    pos: { left: 16, top: 120 },
    collapsed: {
      arms: false,
      breast: false,
      butt: false,
    },
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
    butt: {
      from: 'L',
      copyPos: true,
      copyQtn: true,
      copyScl: true,
    },
  };

  const DEFAULT_BREAST_KEYS = {
    L: {
      '': 'main_chestL_01_0034_bind_jnt',
      fat: 'main_chestL_01_fat_0035_bind_jnt',
      horizontal: 'main_chestL_horizontal_1730_bind_jnt',
      vertical: 'main_chestL_vertical_1729_bind_jnt',
      kitbash: 'main_chestL_kitbash_1733_bind_jnt',
    },
    R: {
      '': 'main_chestR_01_0121_bind_jnt',
      fat: 'main_chestR_01_fat_0122_bind_jnt',
      horizontal: 'main_chestR_horizontal_1731_bind_jnt',
      vertical: 'main_chestR_vertical_1728_bind_jnt',
      kitbash: 'main_chestR_kitbash_1732_bind_jnt',
    },
  };

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
          state.pos.top = Math.max(0, (UW.innerHeight || 800) - bottom - 240);
        }
      }

      if (saved.collapsed && typeof saved.collapsed === 'object') Object.assign(state.collapsed, saved.collapsed);
      if (saved.arms && typeof saved.arms === 'object') Object.assign(state.arms, saved.arms);
      if (saved.breast && typeof saved.breast === 'object') Object.assign(state.breast, saved.breast);
      if (saved.butt && typeof saved.butt === 'object') Object.assign(state.butt, saved.butt);
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
          collapsed: state.collapsed,
          arms: state.arms,
          breast: state.breast,
          butt: state.butt,
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
  align-items:flex-start;
  justify-content:space-between;
  padding:8px 10px;
  user-select:none;
  border-bottom:1px solid rgba(255,255,255,0.10);
  gap:10px;
}
#${DOCK_ID} .hL{ display:flex; flex-direction:column; gap:3px; min-width:0; }
#${DOCK_ID} .t{ font-weight:700; letter-spacing:0.2px; font-size:13px; }
#${DOCK_ID} .sub{ opacity:0.85; font-variant-numeric:tabular-nums; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
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
  background:rgba(255,255,255,0.04);
  overflow:hidden;
}
#${DOCK_ID} .secHdr{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px;
  cursor:pointer;
  user-select:none;
  background:rgba(255,255,255,0.03);
  border-bottom:1px solid rgba(255,255,255,0.08);
}
#${DOCK_ID} .secHdr:hover{ background:rgba(255,255,255,0.06); }
#${DOCK_ID} .secHdr .box{
  width:16px;
  height:16px;
  border-radius:3px;
  border:1px solid rgba(255,255,255,0.18);
  background:rgba(0,0,0,0.20);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:12px;
  line-height:1;
  opacity:0.95;
}
#${DOCK_ID} .secHdr .name{
  font-weight:700;
  font-size:13px;
  letter-spacing:0.2px;
}
#${DOCK_ID} .secBody{
  padding:10px;
  display:flex;
  flex-direction:column;
  gap:10px;
}
#${DOCK_ID} .sec[data-collapsed="1"] .secBody{ display:none; }

#${DOCK_ID} .row{
  display:flex;
  align-items:center;
  gap:10px;
  flex-wrap:wrap;
}
#${DOCK_ID} .rowAction{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
}
#${DOCK_ID} .rowAction .left{
  display:flex;
  align-items:center;
  gap:10px;
  flex:1;
  min-width:0;
}
#${DOCK_ID} .rowAction .right{
  display:flex;
  align-items:center;
  gap:8px;
  flex:0 0 auto;
}
#${DOCK_ID} .primary{
  padding:7px 10px;
  font-weight:700;
  border-radius:10px;
}
#${DOCK_ID} .ghost{
  background:rgba(255,255,255,0.06);
}
#${DOCK_ID} label{
  display:flex;
  align-items:center;
  gap:8px;
  user-select:none;
}
#${DOCK_ID} input[type="checkbox"]{ transform:translateY(1px); }

#${DOCK_ID} .split{
  display:flex;
  align-items:center;
  gap:8px;
}
#${DOCK_ID} .mono{
  font-variant-numeric:tabular-nums;
  opacity:0.78;
  font-size:11px;
}
#${DOCK_ID} .iconBtn{
  width:34px;
  height:30px;
  padding:0;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  font-size:16px; /* bigger arrows */
  font-weight:800;
  border-radius:10px;
}
#${DOCK_ID} .dirBtn{
  cursor:pointer; /* obvious clicky */
}
#${DOCK_ID} .dirBtn:hover{
  background:rgba(255,255,255,0.20);
  border-color:rgba(255,255,255,0.22);
}
#${DOCK_ID} .pillBtn{
  border-radius:10px;
  padding:6px 10px;
  opacity:0.95;
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
    const h = rect.height || 240;

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

    const hL = document.createElement('div');
    hL.className = 'hL';

    const title = document.createElement('div');
    title.className = 't';
    title.textContent = 'Body Editor';

    const sub = document.createElement('div');
    sub.className = 'sub';
    sub.textContent = 'Hotkey: 1  |  Undo: Ctrl+Z  |  Redo: Ctrl+Shift+Z';

    hL.appendChild(title);
    hL.appendChild(sub);

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

    header.appendChild(hL);
    header.appendChild(btns);

    const body = document.createElement('div');
    body.className = 'b';

    body.appendChild(renderArmsSection());
    body.appendChild(renderBreastSection());
    body.appendChild(renderButtSection());

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

    renderVisibility();
    updateUndoRedoButtons();
    tryHookUndoQueueRefresh();
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

  function iconButton(text, title, onClick) {
    const b = document.createElement('button');
    b.className = 'iconBtn';
    b.textContent = text;
    b.title = title;
    b.addEventListener('click', onClick);
    return b;
  }

  function makeSection(id, titleText, collapsed, onToggle) {
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

    hdr.addEventListener('click', () => {
      const now = sec.dataset.collapsed === '1' ? false : true;
      sec.dataset.collapsed = now ? '1' : '0';
      box.textContent = now ? '+' : '–';
      onToggle(now);
      saveState();
      clampDockToViewport();
    });

    const body = document.createElement('div');
    body.className = 'secBody';

    sec.appendChild(hdr);
    sec.appendChild(body);

    return { sec, body };
  }

  function renderArmsSection() {
    const { sec, body } = makeSection(
      'arms',
      'Extra Arms Sync',
      !!state.collapsed.arms,
      (v) => (state.collapsed.arms = v)
    );

    // Row 1: action + undo/redo
    const row1 = document.createElement('div');
    row1.className = 'rowAction';

    const left = document.createElement('div');
    left.className = 'left';

    const syncBtn = document.createElement('button');
    syncBtn.className = 'primary';
    syncBtn.id = 'hf-body-editor-arms-sync';
    syncBtn.textContent = 'Sync Extra Arms';
    syncBtn.addEventListener('click', () => doArmsSync());

    left.appendChild(syncBtn);

    const right = document.createElement('div');
    right.className = 'right';

    const undoBtn = iconButton('↶', 'Undo', () => undoHF());
    undoBtn.id = 'hf-body-editor-arms-undo';

    const redoBtn = iconButton('↷', 'Redo', () => redoHF());
    redoBtn.id = 'hf-body-editor-arms-redo';

    right.appendChild(undoBtn);
    right.appendChild(redoBtn);

    row1.appendChild(left);
    row1.appendChild(right);
    body.appendChild(row1);

    // Row 2: targets + sync hands
    const row2 = document.createElement('div');
    row2.className = 'row';

    row2.appendChild(
      checkbox('2nd Arm', state.arms.target2, (v) => {
        state.arms.target2 = v;
        saveState();
        updateButtons();
      })
    );
    row2.appendChild(
      checkbox('3rd Arm', state.arms.target3, (v) => {
        state.arms.target3 = v;
        saveState();
        updateButtons();
      })
    );
    row2.appendChild(
      checkbox('Sync Hands/Fingers', state.arms.syncHands, (v) => {
        state.arms.syncHands = v;
        saveState();
      })
    );

    body.appendChild(row2);

    // Row 3: transforms
    const row3 = document.createElement('div');
    row3.className = 'row';

    row3.appendChild(
      checkbox('Position', state.arms.copyPos, (v) => {
        state.arms.copyPos = v;
        saveState();
      })
    );
    row3.appendChild(
      checkbox('Rotation', state.arms.copyQtn, (v) => {
        state.arms.copyQtn = v;
        saveState();
      })
    );
    row3.appendChild(
      checkbox('Scale', state.arms.copyScl, (v) => {
        state.arms.copyScl = v;
        saveState();
      })
    );

    body.appendChild(row3);

    function updateButtons() {
      const b = document.getElementById('hf-body-editor-arms-sync');
      if (!b) return;
      b.disabled = !state.arms.target2 && !state.arms.target3;
    }

    setTimeout(updateButtons, 0);
    return sec;
  }

  function renderBreastSection() {
    const { sec, body } = makeSection(
      'breast',
      'Breast Mirror',
      !!state.collapsed.breast,
      (v) => (state.collapsed.breast = v)
    );

    // Row 1: action + undo/redo
    const row1 = document.createElement('div');
    row1.className = 'rowAction';

    const left = document.createElement('div');
    left.className = 'left';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'primary';
    copyBtn.id = 'hf-body-editor-breast-copy';
    copyBtn.textContent = '';
    copyBtn.addEventListener('click', () => doBreastMirror());

    left.appendChild(copyBtn);

    const right = document.createElement('div');
    right.className = 'right';

    const undoBtn = iconButton('↶', 'Undo', () => undoHF());
    undoBtn.id = 'hf-body-editor-breast-undo';

    const redoBtn = iconButton('↷', 'Redo', () => redoHF());
    redoBtn.id = 'hf-body-editor-breast-redo';

    right.appendChild(undoBtn);
    right.appendChild(redoBtn);

    row1.appendChild(left);
    row1.appendChild(right);
    body.appendChild(row1);

    // Row 2: direction
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
    arrowBtn.addEventListener('click', () => {
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

    // Row 3: transforms
    const row3 = document.createElement('div');
    row3.className = 'row';

    row3.appendChild(
      checkbox('Position', state.breast.copyPos, (v) => {
        state.breast.copyPos = v;
        saveState();
      })
    );
    row3.appendChild(
      checkbox('Rotation', state.breast.copyQtn, (v) => {
        state.breast.copyQtn = v;
        saveState();
      })
    );
    row3.appendChild(
      checkbox('Scale', state.breast.copyScl, (v) => {
        state.breast.copyScl = v;
        saveState();
      })
    );

    body.appendChild(row3);

    // Hint
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
    return sec;
  }

  function renderButtSection() {
    const { sec, body } = makeSection(
      'butt',
      'Butt Mirror',
      !!state.collapsed.butt,
      (v) => (state.collapsed.butt = v)
    );

    // Row 1: action + undo/redo
    const row1 = document.createElement('div');
    row1.className = 'rowAction';

    const left = document.createElement('div');
    left.className = 'left';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'primary';
    copyBtn.id = 'hf-body-editor-butt-copy';
    copyBtn.textContent = '';
    copyBtn.addEventListener('click', () => doButtMirror());

    left.appendChild(copyBtn);

    const right = document.createElement('div');
    right.className = 'right';

    const undoBtn = iconButton('↶', 'Undo', () => undoHF());
    undoBtn.id = 'hf-body-editor-butt-undo';

    const redoBtn = iconButton('↷', 'Redo', () => redoHF());
    redoBtn.id = 'hf-body-editor-butt-redo';

    right.appendChild(undoBtn);
    right.appendChild(redoBtn);

    row1.appendChild(left);
    row1.appendChild(right);
    body.appendChild(row1);

    // Row 2: direction
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
    arrowBtn.addEventListener('click', () => {
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

    // Row 3: transforms
    const row3 = document.createElement('div');
    row3.className = 'row';

    row3.appendChild(
      checkbox('Position', state.butt.copyPos, (v) => {
        state.butt.copyPos = v;
        saveState();
      })
    );
    row3.appendChild(
      checkbox('Rotation', state.butt.copyQtn, (v) => {
        state.butt.copyQtn = v;
        saveState();
      })
    );
    row3.appendChild(
      checkbox('Scale', state.butt.copyScl, (v) => {
        state.butt.copyScl = v;
        saveState();
      })
    );

    body.appendChild(row3);

    // Hint
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
      CK.tryLoadCharacter(json, 'Body Editor: invalid character data', () => {});
      return true;
    } catch {
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
    } catch {}
    updateUndoRedoButtons();
    return true;
  }

  function updateUndoRedoButtons() {
    const ids = [
      'hf-body-editor-arms-undo',
      'hf-body-editor-arms-redo',
      'hf-body-editor-breast-undo',
      'hf-body-editor-breast-redo',
      'hf-body-editor-butt-undo',
      'hf-body-editor-butt-redo',
    ];

    const u = getUndoQueue();
    const canUndo = !!u && u.currentIndex > 0;
    const canRedo = !!u && u.currentIndex < u.queue.length - 1;

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id.endsWith('-undo')) el.disabled = !canUndo;
      if (id.endsWith('-redo')) el.disabled = !canRedo;
    });
  }

  function undoHF() {
    const u = getUndoQueue();
    const CK = UW.CK;
    if (!u || !CK) return;

    if (typeof u.undo === 'function') {
      try { u.undo(); } catch {}
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
      try { u.redo(); } catch {}
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

    const wrap = (obj, key) => {
      const fn = obj && typeof obj[key] === 'function' ? obj[key] : null;
      if (!fn || fn.__hfBodyEditorWrapped) return;
      obj[key] = function () {
        const r = fn.apply(this, arguments);
        try { updateUndoRedoButtons(); } catch {}
        return r;
      };
      obj[key].__hfBodyEditorWrapped = true;
    };

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

      if (targets.includes('bodyUpper0')) s['arms0' + side] = baseVal;
      if (targets.includes('bodyUpper1')) s['arms1' + side] = baseVal;
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

    const opts = {
      copyPos: !!state.arms.copyPos,
      copyQtn: !!state.arms.copyQtn,
      copyScl: !!state.arms.copyScl,
    };

    targets.forEach((key) => {
      if (!transforms[key] || typeof transforms[key] !== 'object') transforms[key] = {};
      const cleanExtras = key === 'bodyUpper0';
      syncOneSecondary(main, transforms[key], cleanExtras, opts);
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

    if (key.startsWith(l)) {
      side = 'L';
      rest = key.slice(l.length);
    } else if (key.startsWith(r)) {
      side = 'R';
      rest = key.slice(r.length);
    } else return null;

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

  function buttSignature(key) {
    if (typeof key !== 'string') return null;

    const l = 'main_buttL_';
    const r = 'main_buttR_';
    let side = null;
    let rest = null;

    if (key.startsWith(l)) {
      side = 'L';
      rest = key.slice(l.length);
    } else if (key.startsWith(r)) {
      side = 'R';
      rest = key.slice(r.length);
    } else return null;

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

  function ensureBreastKeysPresent(rig) {
    if (!rig || typeof rig !== 'object') return;

    const hasAny = Object.keys(rig).some(
      (k) => typeof k === 'string' && (k.startsWith('main_chestL_') || k.startsWith('main_chestR_')) && k.endsWith('_bind_jnt')
    );
    if (!hasAny) return;

    const present = { L: {}, R: {} };
    Object.keys(rig).forEach((k) => {
      const s = breastSignature(k);
      if (!s) return;
      present[s.side][s.sig] = k;
    });

    ['L', 'R'].forEach((side) => {
      const defs = DEFAULT_BREAST_KEYS[side];
      Object.keys(defs).forEach((sig) => {
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
    const rig = json?.transforms?.bodyUpper;
    if (!rig || typeof rig !== 'object') return;

    ensureBreastKeysPresent(rig);

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

    const opts = {
      copyPos: !!state.breast.copyPos,
      copyQtn: !!state.breast.copyQtn,
      copyScl: !!state.breast.copyScl,
    };

    const shared = Object.keys(fromMap).filter((sig) => sig in toMap);
    if (!shared.length) return;

    for (const sig of shared) {
      const fromKey = fromMap[sig];
      const toKey = toMap[sig];
      const src = rig[fromKey];
      const dst = rig[toKey];
      if (!src || typeof src !== 'object' || !dst || typeof dst !== 'object') continue;

      if (opts.copyPos) {
        if (src.pos && typeof src.pos === 'object') dst.pos = invertVec3(src.pos);
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
    const rig = json?.transforms?.bodyUpper;
    if (!rig || typeof rig !== 'object') return;

    const left = {};
    const right = {};

    Object.keys(rig).forEach((k) => {
      const s = buttSignature(k);
      if (!s) return;
      if (s.side === 'L') left[s.sig] = k;
      else right[s.sig] = k;
    });

    const fromSide = state.butt.from === 'L' ? 'L' : 'R';
    const toSide = fromSide === 'L' ? 'R' : 'L';

    const fromMap = fromSide === 'L' ? left : right;
    const toMap = toSide === 'L' ? left : right;

    const opts = {
      copyPos: !!state.butt.copyPos,
      copyQtn: !!state.butt.copyQtn,
      copyScl: !!state.butt.copyScl,
    };

    const shared = Object.keys(fromMap).filter((sig) => sig in toMap);
    if (!shared.length) return;

    for (const sig of shared) {
      const fromKey = fromMap[sig];
      const toKey = toMap[sig];
      const src = rig[fromKey];
      const dst = rig[toKey];
      if (!src || typeof src !== 'object' || !dst || typeof dst !== 'object') continue;

      if (opts.copyPos) {
        if (src.pos && typeof src.pos === 'object') dst.pos = invertVec3(src.pos);
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

  waitForCK();
})();

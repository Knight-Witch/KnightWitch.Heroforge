// ==UserScript==
// @name         Extra Arms & Limbs Kitbash Sync
// @namespace    extra-arms-sync
// @version      0.3.1
// @description  Deprecated. Use "Body Editor" instead (click banner to install).
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Extra_Arms_And_Hands_Sync.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Extra_Arms_And_Hands_Sync.user.js
// ==/UserScript==

(() => {
  const NEW_URL = 'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Body_Editor.user.js';
  const STORE_KEY = 'kw.deprecated.extraArmsSync.dismissUntil';
  const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

  const now = Date.now();
  const dismissUntil = Number(localStorage.getItem(STORE_KEY) || '0');
  if (Number.isFinite(dismissUntil) && dismissUntil > now) return;

  const ID = 'kw-deprecated-banner-extra-arms';
  if (document.getElementById(ID)) return;

  const style = document.createElement('style');
  style.textContent = `
#${ID}{
  position:fixed;
  z-index:2147483647;
  left:16px;
  right:16px;
  top:16px;
  background:rgba(10,10,10,0.94);
  color:#e8e8e8;
  border:1px solid rgba(255,255,255,0.16);
  border-radius:10px;
  box-shadow:0 10px 30px rgba(0,0,0,0.45);
  font:13px/1.25 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  padding:12px 12px;
  display:flex;
  align-items:center;
  gap:10px;
}
#${ID} .msg{
  flex:1;
}
#${ID} .title{
  font-weight:700;
  margin-right:6px;
}
#${ID} .btn{
  background:rgba(255,255,255,0.12);
  color:#e8e8e8;
  border:1px solid rgba(255,255,255,0.14);
  border-radius:8px;
  padding:7px 10px;
  cursor:pointer;
  user-select:none;
  white-space:nowrap;
}
#${ID} .btn:hover{
  background:rgba(255,255,255,0.18);
}
#${ID} .x{
  width:32px;
  text-align:center;
  padding:7px 0;
}
`;
  document.head.appendChild(style);

  const banner = document.createElement('div');
  banner.id = ID;

  const msg = document.createElement('div');
  msg.className = 'msg';
  msg.innerHTML = `<span class="title">This script is deprecated.</span>Extra Arms Sync has been replaced by <b>Body Editor</b>. Install the new script to keep receiving updates.`;

  const install = document.createElement('button');
  install.className = 'btn';
  install.textContent = 'Install Body Editor';
  install.addEventListener('click', () => {
    window.open(NEW_URL, '_blank', 'noopener,noreferrer');
  });

  const dismiss = document.createElement('button');
  dismiss.className = 'btn';
  dismiss.textContent = 'Dismiss 7 days';
  dismiss.addEventListener('click', () => {
    localStorage.setItem(STORE_KEY, String(Date.now() + DISMISS_MS));
    banner.remove();
  });

  const close = document.createElement('button');
  close.className = 'btn x';
  close.textContent = 'x';
  close.addEventListener('click', () => {
    banner.remove();
  });

  banner.appendChild(msg);
  banner.appendChild(install);
  banner.appendChild(dismiss);
  banner.appendChild(close);

  document.body.appendChild(banner);
})();

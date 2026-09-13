// ==UserScript==
// @name         Witch Dock DEV - Texture Quality Beta Notice
// @namespace    KnightWitch
// @version      0.1.0
// @description  One-time Phase 1 announcement for Witch Dock Texture Quality.
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const GLOBAL = 'KWTextureQualityBetaNotice';
  if (UW[GLOBAL]) return;

  const VERSION = '0.1.0';
  const BUILD = '0.1.0-phase1-announcement';
  const ACK_KEY = 'kw.witchDock.textureQuality.betaNotice.phase1.v1';
  const OVERLAY_ID = 'kwTextureQualityBetaNoticeOverlay';
  const STYLE_ID = 'kwTextureQualityBetaNoticeStyle';
  const READY_TIMEOUT = 30000;

  let readyTimer = null;
  let readyStartedAt = 0;

  function acknowledged() {
    try { return UW.localStorage.getItem(ACK_KEY) === 'ack'; }
    catch (_) { return false; }
  }

  function acknowledge() {
    try { UW.localStorage.setItem(ACK_KEY, 'ack'); } catch (_) {}
  }

  function removeNotice() {
    document.getElementById(OVERLAY_ID)?.remove();
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${OVERLAY_ID}{position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.72);color-scheme:dark;}
      #${OVERLAY_ID}[hidden]{display:none!important;}
      .kwTQBetaNotice{width:min(760px,calc(100vw - 36px));max-height:min(840px,calc(100vh - 36px));display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.16);border-radius:12px;background:linear-gradient(180deg,rgba(32,27,40,.995),rgba(18,16,23,.995));box-shadow:0 24px 70px rgba(0,0,0,.58);color:rgba(255,255,255,.93);font-family:Arial,sans-serif;}
      .kwTQBetaHeader{padding:15px 17px;border-bottom:1px solid rgba(255,255,255,.11);background:rgba(122,62,170,.18);}
      .kwTQBetaTitle{font-size:18px;line-height:1.25;font-weight:900;letter-spacing:.1px;}
      .kwTQBetaBody{padding:15px 18px 11px;overflow:auto;font-size:12px;line-height:1.5;scrollbar-width:thin;}
      .kwTQBetaBody p{margin:0 0 11px;}
      .kwTQBetaBody h3{margin:16px 0 7px;font-size:12px;line-height:1.3;font-weight:900;letter-spacing:.2px;color:rgba(237,218,255,.98);}
      .kwTQBetaBody ul{margin:5px 0 11px;padding-left:21px;}
      .kwTQBetaBody li{margin:5px 0;}
      .kwTQBetaBody li>ul{margin-top:4px;margin-bottom:4px;}
      .kwTQBetaBody strong{color:#fff;}
      .kwTQBetaBody em{color:rgba(240,224,255,.94);}
      .kwTQBetaFooter{display:flex;justify-content:flex-end;padding:11px 14px;border-top:1px solid rgba(255,255,255,.11);background:rgba(0,0,0,.18);}
      .kwTQBetaOk{min-width:96px;border:1px solid rgba(204,153,255,.62);border-radius:7px;padding:8px 16px;background:rgba(151,78,210,.30);color:#fff;font-size:12px;font-weight:900;cursor:pointer;}
      .kwTQBetaOk:hover{background:rgba(170,85,255,.44);border-color:rgba(220,177,255,.86);}
    `;
    document.head.appendChild(style);
  }

  function show() {
    if (acknowledged() || document.getElementById(OVERLAY_ID) || !document.body) return false;
    ensureStyles();

    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'kwTextureQualityBetaNoticeTitle');
    overlay.innerHTML = `
      <div class="kwTQBetaNotice">
        <div class="kwTQBetaHeader">
          <div class="kwTQBetaTitle" id="kwTextureQualityBetaNoticeTitle">Nat 20: New Beta Unlocked!</div>
        </div>
        <div class="kwTQBetaBody">
          <p>The first phase of Witch Dock's <strong>Texture Quality</strong> improvements has arrived! Head to the <strong>Utilities</strong> tab (cog) to toggle higher-quality textures on/off, or enable <strong>Persistent High Res</strong> so it automatically returns across reloads and refreshes.</p>

          <h3>What you can do now</h3>
          <ul>
            <li>Toggle higher-quality decal and body textures on/off without refreshing the page.</li>
            <li>Enable cross-session persistence—no need to manually turn it back on every time you load Hero Forge.</li>
            <li>Circumvent forced texture downgrades and low-quality texture issues commonly caused by high kitbash counts and complex builds. Adding a dozen riot shields should no longer turn your decals into mashed potatoes.
              <ul>
                <li>Phase 1 is tuned around a moderately high-kitbash baseline intended to cover the overwhelming majority of builds.</li>
                <li>For the small number of power users making notoriously massive builds (roughly 1000%+ kitbash), the next phase will target that extreme ceiling. <strong>Most builds should benefit now;</strong> some extreme builds may still settle at somewhat lower resolution until then.</li>
              </ul>
            </li>
            <li>Bonus perk: if crashes have seemingly boxed your browser into low-resolution textures, enabling Texture Quality can push the active session back into a higher-quality state. <em>Witch Dock can work around the experience; I can't repair Hero Forge's engine.</em></li>
          </ul>

          <h3>Coming next</h3>
          <ul>
            <li><strong>Dynamic optimization</strong> — a smart system to minimize needless texture pressure and help prevent downscaling.</li>
            <li>Performance optimization to keep the feature running smoothly.</li>
            <li>Toggleable quality tiers for users on mid- and lower-grade devices.</li>
          </ul>

          <h3>IMPORTANT — Please Read</h3>
          <ul>
            <li>This is the <strong>first stage</strong> of a much larger graphics-improvement project.</li>
            <li>This new decal/body texture approach is significantly less taxing than <em>Full Res Decals/Textures (+Other Tweaks)</em>'s old <strong>Decal Resolution Fix</strong>, so you should encounter less lag while Witch Dock's Texture Quality feature is enabled.</li>
            <li><strong>When you enable it, give the textures a moment to fully load. They will settle.</strong> Hardware, available memory, and build complexity can affect how long it takes, but it is relatively quick in most cases.
              <ul>
                <li>The body texture tends to snap to the higher-resolution version last. If you still see obvious UV seams, give it another moment.</li>
                <li>On heavier builds, switching into Booth may take a moment for all Booth settings to settle. Lighting is often the slowest, which is nothing new. This will be more noticeable on mid-grade systems and lower.</li>
                <li>If things become sluggish after a tab has been open for a long time, fully restarting the browser can clear accumulated memory pressure and often helps.</li>
              </ul>
            </li>
            <li><strong>Turn OFF FRD/T's three “Decal Resolution” toggles—but do NOT disable the entire FRD/T script.</strong>
              <ul>
                <li>Click the Tampermonkey icon in the top corner of your browser, find FRD/T, turn off all three “Decal Resolution” toggles, then reload the page.</li>
                <li>No serious compatibility problem is currently known, but Witch Dock's new Texture Quality path supersedes that older fix and produces the better result.</li>
                <li>FRD/T still has other useful features you'll want to keep, so leave the script itself enabled. Its old Decal Resolution section will be phased out after users have had time to move over.</li>
              </ul>
            </li>
          </ul>

          <p><strong>Texture Quality is optional and starts OFF by default.</strong> If you run into any issues, reach out to me directly on Discord @ Knight.Witch.</p>
        </div>
        <div class="kwTQBetaFooter">
          <button type="button" class="kwTQBetaOk">OK</button>
        </div>
      </div>`;

    const ok = overlay.querySelector('.kwTQBetaOk');
    ok.addEventListener('click', () => {
      acknowledge();
      removeNotice();
    });

    document.body.appendChild(overlay);
    window.setTimeout(() => { try { ok.focus(); } catch (_) {} }, 0);
    return true;
  }

  function ready() {
    return !!(UW.WitchDock && UW.KWTextureQualityNativeReconcile);
  }

  function initialize() {
    if (acknowledged()) return true;
    if (ready()) {
      window.setTimeout(show, 350);
      return true;
    }

    readyStartedAt = Date.now();
    readyTimer = window.setInterval(() => {
      if (acknowledged()) {
        window.clearInterval(readyTimer);
        readyTimer = null;
        return;
      }
      if (ready()) {
        window.clearInterval(readyTimer);
        readyTimer = null;
        window.setTimeout(show, 350);
        return;
      }
      if (Date.now() - readyStartedAt >= READY_TIMEOUT) {
        window.clearInterval(readyTimer);
        readyTimer = null;
      }
    }, 200);
    return true;
  }

  function dispose() {
    if (readyTimer) window.clearInterval(readyTimer);
    readyTimer = null;
    removeNotice();
    document.getElementById(STYLE_ID)?.remove();
    try { delete UW[GLOBAL]; } catch (_) { UW[GLOBAL] = undefined; }
    return true;
  }

  UW[GLOBAL] = {
    version: VERSION,
    build: BUILD,
    acknowledge,
    acknowledged,
    show,
    dispose
  };

  initialize();
})();

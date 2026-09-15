// ==UserScript==
// @name         Witch Dock - Texture Quality Beta Notice
// @namespace    KnightWitch
// @version      0.2.1
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

  const VERSION = '0.2.1';
  const BUILD = '0.2.1-frd-warning-assets-signoff';
  const ACK_KEY = 'kw.witchDock.textureQuality.betaNotice.phase1.v1';
  const OVERLAY_ID = 'kwTextureQualityBetaNoticeOverlay';
  const STYLE_ID = 'kwTextureQualityBetaNoticeStyle';
  const READY_TIMEOUT = 30000;
  const ASSET_BASE = 'https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/features/rendering/assets';
  const FRD_GUIDE_URL = `${ASSET_BASE}/Texture_Quality_FRD_Decal_Resolution.webp?v=${BUILD}`;
  const EMBLEM_URL = `${ASSET_BASE}/Witch_Dock_Emblem_White.webp?v=${BUILD}`;

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
      .kwTQBetaHeader{padding:17px 20px;border-bottom:1px solid rgba(255,255,255,.11);background:rgba(122,62,170,.18);text-align:center;}
      .kwTQBetaTitle{font-family:"Avenir Next","Segoe UI Variable Display","Helvetica Neue","Segoe UI",sans-serif;font-size:20px;line-height:1.3;font-weight:600;letter-spacing:.65px;text-align:center;}
      .kwTQBetaBody{padding:17px 20px 13px;overflow:auto;font-size:13.5px;line-height:1.52;scrollbar-width:thin;}
      .kwTQBetaBody p{margin:0 0 12px;}
      .kwTQBetaBody h3{margin:21px 0 10px;padding-top:15px;border-top:1px solid rgba(220,177,255,.22);font-size:17.5px;line-height:1.3;font-weight:900;letter-spacing:.85px;text-align:center;color:rgba(237,218,255,.98);}
      .kwTQBetaBody ul{margin:5px 0 12px;padding-left:22px;}
      .kwTQBetaBody li{margin:7px 0;}
      .kwTQBetaBody li>ul{margin-top:5px;margin-bottom:6px;}
      .kwTQBetaBody .kwTQNormalSub{font-size:1em;line-height:1.48;color:rgba(255,255,255,.90);}
      .kwTQBetaBody .kwTQFinePrint{font-size:11.5px;line-height:1.45;color:rgba(235,226,242,.82);}
      .kwTQBetaBody .kwTQFinePrint li{margin:4px 0;}
      .kwTQBetaBody strong{color:#fff;}
      .kwTQBetaBody em{color:rgba(240,224,255,.94);}
      .kwTQBetaBody a{color:rgba(220,177,255,.98);font-weight:900;text-decoration:underline;text-underline-offset:2px;}
      .kwTQBetaBody a:hover{color:#fff;}
      .kwTQFRDWarningItem{list-style:none;margin:13px 0 10px!important;padding:0!important;}
      .kwTQFRDWarning{padding:12px 14px 13px;border:1px solid rgba(255,207,94,.42);border-left:4px solid rgba(255,194,58,.95);border-radius:10px;background:linear-gradient(180deg,rgba(91,64,14,.34),rgba(50,35,10,.22));box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 8px 24px rgba(0,0,0,.18);}
      .kwTQFRDWarningTitle{margin:0 0 8px;text-align:center;color:rgba(255,235,179,.99);font-size:14.5px;line-height:1.4;font-weight:900;letter-spacing:.12px;}
      .kwTQFRDWarningMain{margin:0 0 5px;color:rgba(255,255,255,.96);font-size:13.5px;line-height:1.48;text-align:left;}
      .kwTQFRDWarningSub{margin:4px 0 0;color:rgba(236,227,201,.87);font-size:11.5px;line-height:1.45;text-align:left;}
      .kwTQFRDGuide{display:block;width:min(496px,100%);height:auto;margin:12px auto 8px;border:1px solid rgba(255,255,255,.14);border-radius:7px;box-shadow:0 8px 22px rgba(0,0,0,.28);background:#2f2f2f;}
      .kwTQBetaClosing{margin:18px 0 2px;text-align:center;}
      .kwTQBetaClosing p{margin:0;}
      .kwTQBetaClosing p+p{margin-top:7px;}
      .kwTQBetaSignoff{display:block;width:72px;height:72px;object-fit:contain;margin:15px auto 0;opacity:.88;filter:drop-shadow(0 3px 9px rgba(0,0,0,.55));}
      .kwTQBetaFooter{display:flex;justify-content:flex-end;padding:11px 14px;border-top:1px solid rgba(255,255,255,.11);background:rgba(0,0,0,.18);}
      .kwTQBetaOk{min-width:112px;border:1px solid rgba(204,153,255,.62);border-radius:7px;padding:8px 16px;background:rgba(151,78,210,.30);color:#fff;font-size:12px;font-weight:900;cursor:pointer;}
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
          <div class="kwTQBetaTitle" id="kwTextureQualityBetaNoticeTitle">Nat 20! New Beta Unlocked: Texture Quality Upgrade Is Live!</div>
        </div>
        <div class="kwTQBetaBody">
          <p>The first phase of Witch Dock's <strong>Texture Quality</strong> upgrade is here. Head to the <strong>Utilities</strong> tab (cog) to turn higher-quality textures on/off, or enable <strong>Persistent High Res</strong> so it automatically returns across reloads and refreshes.</p>

          <h3>What you can do now</h3>
          <ul>
            <li><strong>Acheive higher-quality</strong> decal &amp; body textures.
              <ul class="kwTQNormalSub">
                <li>Visible body UV seams should now be very subtle, if at all visible.</li>
                <li>Decal resolution should be extra kwispy.</li>
                <li>Lower performance demand: less VRAM/GPU demand than old high-res decals <em>[see below for important details]</em>.</li>
              </ul>
            </li>
            <li><strong>Enable/disable while forging</strong> — <em>no page refresh required</em>.</li>
            <li><strong>Keep High-Res enabled across sessions</strong> with Persistence <em>[optional]</em>.</li>
            <li>Fight the forced texture downgrades common on high-kitbash &amp; complex builds.
              <ul class="kwTQFinePrint">
                <li><em>Now a dozen riot shields won't turn your decals to mashed potatos.</em></li>
              </ul>
            </li>
            <li><strong>Graphics Recovery</strong>
              <ul class="kwTQFinePrint">
                <li><em>For those who may have been inexplicably permanently downgraded to lower res textures, this is a workaround repair.</em></li>
                <li><em>I can't fix their engine, but this intercepts &amp; pushes higher res for you, too.</em></li>
              </ul>
            </li>
          </ul>

          <h3>Important — please read</h3>
          <ul>
            <li>This is the <strong>first stage</strong> of a larger graphics/performance overhaul project.</li>
            <li>High Res textures are working with 3 figures <em>[tested/confirmed]</em>.
              <ul class="kwTQFinePrint">
                <li>Testing on 4+ has NOT been performed, but will be added in the coming weeks.</li>
              </ul>
            </li>
            <li>High Res confirmed performing on 1000% kitbash.
              <ul class="kwTQFinePrint">
                <li>More extreme levels have not been tested/validated, but are the next stage of this Phase 1.</li>
              </ul>
            </li>
            <li><strong>Textures may take a moment to fully load in their higher res state.</strong></li>
            <li>PCs on the gaming end with decent GPUs/memory should experience no lag — Booth loading may be slightly slow, but that's about it <em>(so far)</em>.</li>
            <li>Mid/lower end machines <em>may</em> experience more slowness.
              <ul class="kwTQFinePrint">
                <li>If you experience any weirdness, check your graphics capabilities + your default HF graphics settings. Recommended GS for HF is Max for compatibility reasons.</li>
                <li>If you experience persistent issues, just toggle this feature off in the Utilities tab.</li>
              </ul>
            </li>
            <li class="kwTQFRDWarningItem">
              <div class="kwTQFRDWarning">
                <div class="kwTQFRDWarningTitle">⚠️ Using <strong>Full Res Decals / Textures (+ Other Tweaks)</strong>? Read this. ⚠️</div>
                <p class="kwTQFRDWarningMain"><strong>Turn OFF FRD's three “Decal Resolution” toggles, but keep the rest of FRD enabled.</strong></p>
                <p class="kwTQFRDWarningSub">Open Tampermonkey, find FRD, switch all three Decal Resolution toggles off, then reload.</p>
                <img class="kwTQFRDGuide" src="${FRD_GUIDE_URL}" alt="FRD menu showing the three Decal Resolution toggles that should be switched off" />
                <p class="kwTQFRDWarningSub">Witch Dock's Texture Quality path supersedes that older fix, but the rest of FRD can still stay enabled.</p>
              </div>
            </li>
          </ul>

          <h3>Coming next</h3>
          <ul>
            <li><strong>Dynamic optimization</strong> to reduce needless texture pressure and help prevent downscaling.</li>
            <li>More performance optimization.</li>
            <li>Toggleable quality tiers for mid- and lower-grade devices.</li>
            <li>Further work on the extreme ceiling for exceptionally massive builds.</li>
          </ul>

          <div class="kwTQBetaClosing">
            <p><strong>Texture Quality is optional and starts OFF by default.</strong></p>
            <p>If you run into issues, reach out to me directly on Discord <a href="https://discord.com/users/579968778360848395" target="_blank" rel="noopener noreferrer">@ Knight.Witch</a>.</p>
            <img class="kwTQBetaSignoff" src="${EMBLEM_URL}" alt="Knight Witch emblem" />
          </div>
        </div>
        <div class="kwTQBetaFooter">
          <button type="button" class="kwTQBetaOk">Hell Yeah!</button>
        </div>
      </div>`;

    overlay.querySelectorAll('img').forEach((img) => {
      img.addEventListener('error', () => { img.style.display = 'none'; }, { once: true });
    });

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

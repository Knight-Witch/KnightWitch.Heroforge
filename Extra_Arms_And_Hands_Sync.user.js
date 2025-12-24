// ==UserScript==
// @name        Extra Arms & Limbs Kitbash Sync
// @namespace   extra-arms-sync
// @version     0.3.0
// @description Copies main arm/hand/finger pose and kitbash to extra arms in HeroForge (supports multiple extra arm sets). ADDS BONE NODES TO EXTRA ARMS FOR KITBASH ADJUSTMENTS - READ THIS FIRST: TO USE: Before you can adjust, you need a FRESH placement of Extra Arms 1 & 2 (often loading an existing multi arm set doesn't generate bone nodes). Go to the Kitbash menu and select the shoulder/upper arm bone and make a quick adjustment. This kicks the UI into gear assigning placement values. NOW you can hit the "sync" button in the bottom left corner of your browser and it will automatically sync the 2nd and 3rd arm sets to match the first. Any time you adjust your figure's position, you can hit that button and re-sync all the arms. 
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @run-at       document-end
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Extra_Arms_And_Hands_Sync.user.js
// @downloadURL  https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/main/Extra_Arms_And_Hands_Sync.user.js
// ==/UserScript==

(function () {
  'use strict';

  function waitForCK() {
    try {
      if (unsafeWindow && unsafeWindow.CK && unsafeWindow.CK.UndoQueue) {
        init();
      } else {
        setTimeout(waitForCK, 250);
      }
    } catch (e) {
      console.error('HF Sync Extra Arms: waiting error', e);
      setTimeout(waitForCK, 500);
    }
  }

  function init() {
    if (document.getElementById('hf-sync-extra-arms-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'hf-sync-extra-arms-btn';
    btn.textContent = 'Sync Extra Arms';

    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      zIndex: 99999,
      padding: '0.4rem 0.8rem',
      fontSize: '12px',
      fontFamily: 'sans-serif',
      background: 'rgba(0,0,0,0.8)',
      color: '#fff',
      border: '1px solid #666',
      borderRadius: '4px',
      cursor: 'pointer',
      userSelect: 'none'
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'rgba(32,32,32,0.95)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'rgba(0,0,0,0.8)';
    });

    btn.addEventListener('click', syncExtraArms);

    document.body.appendChild(btn);
    console.log('HF Sync Extra Arms: button added');
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function isArmHandFingerKey(key) {
    return (
      typeof key === 'string' &&
      (key.startsWith('main_arm') ||
       key.startsWith('main_hand') ||
       key.startsWith('main_finger'))
    );
  }

  function syncOneSecondary(main, secondary, cleanExtras) {
    // Numeric (advanced pose) bones
    const mainNumericKeys = new Set(
      Object.keys(main).filter((k) => /^\d+$/.test(k))
    );

    Object.keys(main).forEach((key) => {
      if (/^\d+$/.test(key)) {
        secondary[key] = deepClone(main[key]);
      }
    });

    if (cleanExtras) {
      Object.keys(secondary).forEach((key) => {
        if (/^\d+$/.test(key) && !mainNumericKeys.has(key)) {
          delete secondary[key];
        }
      });
    }

    // Named arm/hand/finger kitbash joints
    const mainArmKeys = new Set(
      Object.keys(main).filter((key) => isArmHandFingerKey(key))
    );

    Object.keys(main).forEach((key) => {
      if (isArmHandFingerKey(key)) {
        secondary[key] = deepClone(main[key]);
      }
    });

    if (cleanExtras) {
      Object.keys(secondary).forEach((key) => {
        if (isArmHandFingerKey(key) && !mainArmKeys.has(key)) {
          delete secondary[key];
        }
      });
    }
  }

  function syncExtraArms() {
    try {
      const CK = unsafeWindow.CK;
      if (!CK || !CK.UndoQueue || !CK.UndoQueue.queue || CK.UndoQueue.queue.length === 0) {
        console.warn('HF Sync Extra Arms: CK.UndoQueue not ready');
        return;
      }

      const u = CK.UndoQueue;
      const current = u.queue[u.currentIndex];
      if (!current) {
        console.warn('HF Sync Extra Arms: no current character in undo queue');
        return;
      }

      const json = deepClone(current);

      if (!json.transforms) json.transforms = {};
      const transforms = json.transforms;

      const main = transforms.bodyUpper || {};

      // Find all extra bodyUpper rigs: bodyUpper0, bodyUpper1, bodyUpper2, ...
      const secondaryKeys = Object.keys(transforms).filter(
        (k) => k.startsWith('bodyUpper') && k !== 'bodyUpper'
      );

      if (secondaryKeys.length === 0) {
        console.log('HF Sync Extra Arms: no extra arm rigs found');
        return;
      }

      secondaryKeys.forEach((key) => {
        if (!transforms[key]) transforms[key] = {};
        const secondary = transforms[key];

        // For the first extra set (bodyUpper0), keep the "clean extras" behavior
        // that fixed the slight drift on your Revenant.
        // For additional sets (bodyUpper1, bodyUpper2, ...), do NOT delete
        // extra numeric keys—those may be required for their unique attachment.
        const cleanExtras = (key === 'bodyUpper0');

        syncOneSecondary(main, secondary, cleanExtras);
      });

      transforms.bodyUpper = main;
      json.transforms = transforms;

      // Sync hand pose presets:
      // base: custom.handPoses.human
      // extras: human_0, human_1, human_2, ...
      if (!json.custom) json.custom = {};
      if (!json.custom.handPoses) json.custom.handPoses = {};
      const hp = json.custom.handPoses;
      if (hp.human) {
        Object.keys(hp).forEach((k) => {
          if (k.startsWith('human_')) {
            hp[k] = deepClone(hp.human);
          }
        });
      }

      // Sync arm length sliders: armsL/armsR → arms0L/arms0R, arms1L/arms1R, ...
      if (json.sliders) {
        const s = json.sliders;
        ['L', 'R'].forEach((side) => {
          const baseKey = 'arms' + side;
          if (s[baseKey] != null) {
            const baseVal = s[baseKey];
            // arms0L / arms0R, arms1L / arms1R, etc., if present
            for (let i = 0; i < 5; i++) {
              const extraKey = 'arms' + i + side;
              if (extraKey in s) {
                s[extraKey] = baseVal;
              }
            }
          }
        });
      }

      CK.tryLoadCharacter(
        json,
        'HF Sync Extra Arms: invalid character data',
        () => {
          console.log(
            'HF Sync Extra Arms: applied to extra rigs:',
            secondaryKeys.join(', ')
          );
        }
      );
    } catch (e) {
      console.error('HF Sync Extra Arms: error during sync', e);
    }
  }

  waitForCK();
})();

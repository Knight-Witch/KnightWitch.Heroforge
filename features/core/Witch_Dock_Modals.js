(function () {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const FEATURE_ID = 'witch-dock-modals';
  const VERSION = '0.1.1';
  const BUILD = '0.1.1-lazy-about-open';

  if (UW.KWWitchDockModals && UW.KWWitchDockModals.version === VERSION) return;

  const state = {
    configured: false,
    meta: { name: 'Witch Dock', version: '' },
    githubRepoUrl: '',
    kofiUrl: '',
    aboutOverlay: null,
    aboutModal: null,
    disclaimerOverlay: null,
    disclaimerModal: null
  };

  function configure(options) {
    const opts = options && typeof options === 'object' ? options : {};
    const meta = opts.scriptMeta && typeof opts.scriptMeta === 'object' ? opts.scriptMeta : {};
    state.meta = {
      name: typeof meta.name === 'string' && meta.name ? meta.name : 'Witch Dock',
      version: typeof meta.version === 'string' ? meta.version : ''
    };
    state.githubRepoUrl = typeof opts.githubRepoUrl === 'string' ? opts.githubRepoUrl : '';
    state.kofiUrl = typeof opts.kofiUrl === 'string' ? opts.kofiUrl : '';
    state.configured = true;
    return true;
  }

  function closeAbout() {
    if (!state.aboutOverlay) return;
    state.aboutOverlay.setAttribute('aria-hidden', 'true');
  }

  function openAbout() {
    ensureAbout();
    if (!state.aboutOverlay || !state.aboutModal) return;
    closeDisclaimer();
    state.aboutOverlay.setAttribute('aria-hidden', 'false');
  }

  function ensureAbout() {
    if (state.aboutOverlay && state.aboutModal) return;

    const meta = state.meta;
    const overlay = document.createElement('div');
    overlay.id = 'kwWDAboutOverlay';
    overlay.setAttribute('aria-hidden', 'true');

    const modal = document.createElement('div');
    modal.id = 'kwWDAbout';

    const header = document.createElement('div');
    header.id = 'kwWDAboutHeader';

    const title = document.createElement('div');
    title.id = 'kwWDAboutTitle';
    title.textContent = meta.name;

    const closeBtn = document.createElement('button');
    closeBtn.id = 'kwWDAboutClose';
    closeBtn.type = 'button';
    closeBtn.title = 'Close';
    closeBtn.textContent = '×';

    header.appendChild(title);
    header.appendChild(closeBtn);

    const body = document.createElement('div');
    body.id = 'kwWDAboutBody';
    body.innerHTML = `
      <p>Witch Dock is a fan-created tool that is designed to help you create with some QoL updates meant to simplify tedious things like symmetrical proportions, tweaking paints for photo booth lighting, &amp; more!</p>
      <p>With this tool, you can:</p>
      <ul>
        <li>Get even proportions / sync body parts with a click of a button</li>
        <li>Save booth presets to make capturing media faster / smoother</li>
        <li>Make kitbash editing easier</li>
      </ul>
      <p><strong>Helpful Tool Tips:</strong></p>
      <ul>
        <li>Press the <code>\`~</code> (grave/tilde) hotkey to expand/minimize Witch Dock</li>
        <li>Drag/drop the tool tabs (Body Editor, Booth, etc) left/right to rearrange the order</li>
        <li>Drag/drop toolset tabs' internal tool sections to reorder to your preferred setup</li>
        <li>Resize the UI's window</li>
        <li>Collapse / hide the UI as needed</li>
        <li>Drag &amp; reorder your tools for your preferred flow</li>
        <li>Soon to come: Quick Access Toolbar, popout windows, &amp; more!</li>
      </ul>
      <p>If you'd like to support my work, feel free to donate to my KoFi!</p>
      <div class="kwWDAboutBtns">
        <a class="kwWDAboutLinkBtn" href="${state.githubRepoUrl}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        <a class="kwWDAboutLinkBtn" href="${state.kofiUrl}" target="_blank" rel="noopener noreferrer">Support on Ko-fi</a>
      </div>
    `;

    const footer = document.createElement('div');
    footer.id = 'kwWDAboutFooter';
    footer.textContent = meta.version ? `Version: ${meta.version}` : '';

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);

    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAbout();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAbout();
    });

    document.addEventListener(
      'keydown',
      (e) => {
        if (e.code === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') {
          e.preventDefault();
          closeAbout();
        }
      },
      true
    );

    document.body.appendChild(overlay);
    state.aboutOverlay = overlay;
    state.aboutModal = modal;
  }

  function closeDisclaimer() {
    if (!state.disclaimerOverlay) return;
    state.disclaimerOverlay.setAttribute('aria-hidden', 'true');
  }

  function openDisclaimer() {
    ensureDisclaimer();
    closeAbout();
    state.disclaimerOverlay.setAttribute('aria-hidden', 'false');
  }

  function ensureDisclaimer() {
    if (state.disclaimerOverlay && state.disclaimerModal) return;

    const meta = state.meta;
    const overlay = document.createElement('div');
    overlay.id = 'kwWDDisclaimerOverlay';
    overlay.setAttribute('aria-hidden', 'true');

    const modal = document.createElement('div');
    modal.id = 'kwWDDisclaimer';

    const header = document.createElement('div');
    header.id = 'kwWDDisclaimerHeader';

    const title = document.createElement('div');
    title.id = 'kwWDDisclaimerTitle';
    title.textContent = 'Disclaimer';

    const closeBtn = document.createElement('button');
    closeBtn.id = 'kwWDDisclaimerClose';
    closeBtn.type = 'button';
    closeBtn.title = 'Close';
    closeBtn.textContent = '×';

    header.appendChild(title);
    header.appendChild(closeBtn);

    const body = document.createElement('div');
    body.id = 'kwWDDisclaimerBody';
    body.innerHTML = `
      <p>This is a fan-created tool by an artist who adores Heroforge &amp; dedicated a lot of time to solving some common UI obstacles. This tool is not created with the intent of undermining Heroforge's work, but rather just some basic QoL tools.</p>
      <p><strong>This tool does NOT and CANNOT:</strong></p>
      <ul>
        <li>Give free users access to Pro content or features</li>
        <li>Add in new content like meshes/textures, etc</li>
        <li>Cut into Skycastle's bottom line</li>
      </ul>
      <p>I love this platform and <strong>HIGHLY ENCOURAGE users to subscribe to Heroforge Pro.</strong> It is well worth the very reasonable monthly price, &amp; by upgrading, you gain access to a myriad of features (including features that are effectively useless to free users on this tool). You also help keep our beloved shared hobby / engine &amp; the team at Heroforge going strong!</p>
      <p>Pro content requires an API token to access, or the Heroforge server simply will NOT serve this content to you. There is no way around this, no script that can 'hack' it, nor would I build such a thing.</p>
      <p>Skycastle LLC owns the rights to Heroforge &amp; I fully support their engine's creation. As a massive fan, I am happy to share tools I've created with the SC dev team any time. Us script-writers are your biggest fans, &amp; scripts are a fantastic way to test ideas, get user-feedback, solve many pain-points &amp; bugs—allowing your devs to spend more time growing the platform's features, &amp; less time doubling back on content.</p>
      <p>Please don't come for me. I just love you guys / the work you've done, &amp; as an artist with some tech skills, I implemented some UI features that make my life a little easier so I can do what I do best: show the world how awesome Heroforge is, what it is capable of, &amp; inspire more users to create with it—and subscribe to Pro, because I have been since the very beginning, for a reason!</p>
      <p>With love,<br/>A Witch</p>
    `;

    const footer = document.createElement('div');
    footer.id = 'kwWDDisclaimerFooter';
    footer.textContent = meta.version ? `Version: ${meta.version}` : '';

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    state.disclaimerOverlay = overlay;
    state.disclaimerModal = modal;

    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeDisclaimer();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDisclaimer();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') closeDisclaimer();
    }, true);
  }

  function getState() {
    return {
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      configured: state.configured,
      aboutCreated: !!state.aboutOverlay,
      aboutOpen: !!state.aboutOverlay && state.aboutOverlay.getAttribute('aria-hidden') === 'false',
      disclaimerCreated: !!state.disclaimerOverlay,
      disclaimerOpen: !!state.disclaimerOverlay && state.disclaimerOverlay.getAttribute('aria-hidden') === 'false'
    };
  }

  UW.KWWitchDockModals = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    configure,
    ensureAbout,
    openAbout,
    closeAbout,
    ensureDisclaimer,
    openDisclaimer,
    closeDisclaimer,
    getState
  });
})();

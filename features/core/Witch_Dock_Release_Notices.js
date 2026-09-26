(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const GLOBAL = "KWWitchDockReleaseNotices";
  const FEATURE_ID = "witch-dock-release-notices";
  const VERSION = "0.2.2";
  const BUILD = "0.2.2-remove-old-script-guidance";
  const TARGET_STABLE_VERSION = "2.3.0";
  const UPDATE_URL = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/Witch_Dock.user.js";
  const STABLE_NOTICE_ID = "stable-wrapper-update-v2.3.0-remove-old-v2";
  const DEV_PREVIEW_NOTICE_ID = "stable-wrapper-update-v2.3.0-dev-preview-v4";

  if (UW[GLOBAL] && UW[GLOBAL].version === VERSION && UW[GLOBAL].build === BUILD) return;

  const state = {
    channel: null,
    installedWrapperVersion: null,
    targetStableVersion: TARGET_STABLE_VERSION,
    registeredNoticeId: null,
    preview: false,
    reason: null,
    error: null
  };

  function compareVersions(a, b) {
    const parse = (value) => {
      const match = String(value || "").trim().match(/^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/);
      return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
    };
    const left = parse(a);
    const right = parse(b);
    if (!left || !right) return null;
    for (let i = 0; i < 3; i += 1) {
      if (left[i] < right[i]) return -1;
      if (left[i] > right[i]) return 1;
    }
    return 0;
  }

  function getChannelState() {
    const channel = UW.KWWitchDockDevChannel || UW.KWWitchDockChannel;
    if (!channel) return null;
    try {
      return typeof channel.getState === "function" ? channel.getState() : channel;
    } catch (_) {
      return channel;
    }
  }

  function registerNotice(id, preview) {
    const notices = UW.KWWitchDockNotifications;
    if (!notices || typeof notices.register !== "function") {
      throw new Error("Witch Dock Notifications service is unavailable.");
    }

    const registered = notices.register({
      id,
      eyebrow: preview ? "DEV PREVIEW" : "ONE-TIME UPDATE",
      title: "Witch Dock update required",
      paragraphs: [
        "Users running v2.2.2 and older will need to do a one-time manual update to Witch Dock."
      ],
      instructions: [
        "Please install the latest version & refresh your browser once finished.",
        "After installing the latest version, remove your old Witch Dock v2.2.2 (or earlier) script from Tampermonkey before refreshing. Keeping both scripts installed can cause Witch Dock to run twice.",
        `Once installed on version ${TARGET_STABLE_VERSION} and higher, normal Witch Dock runtime/automatic updates will resume going forward.`
      ],
      overview: {
        title: "Release Overview",
        items: [
          "High Res has received 2 bugfixes",
          "Booth JSON import/export fixed",
          "Dock UI tweaks & window resizing"
        ]
      },
      details: [
        {
          title: "MANUAL UPDATE REQUIRED:",
          items: [
            { text: "A backend refactor/migration occurred over the weekend & has changed the update path for Witch Dock." },
            { text: "After installing the latest version, remove your old Witch Dock v2.2.2 (or earlier) script from Tampermonkey before refreshing. Keeping both scripts installed can cause Witch Dock to run twice." },
            { text: "Once updated to the latest version, automatic updates should resume, going forward." }
          ]
        },
        { title: "PATCHES & FEATURE UDPATES:", headingOnly: true },
        {
          title: "Booth Settings JSON",
          items: [
            { text: "Import/export has been restored" },
            { text: "Import/export buttons now live inside the BOOTH tab in Witch Dock", notes: [{ label: "Note:", text: "Vanilla UI buttons will return, shortly", italic: true }] }
          ]
        },
        {
          title: "Textures - High Res:",
          items: [
            { text: "Now applies to ALL extra minis (3+) in a scene", notes: [{ label: "Note:", text: "Will be expanding to upgrade texture resolution for hair/CC items, clothing, equippable objects / kitbash, & animals/creatures over the next several days. Toggles for turning it on/off for specific group types (ie. off for equippable objects) will follow for performance options.", italic: true }] }
          ]
        },
        {
          title: "Fixed Bugs: Textures",
          items: [
            { label: "#1 - Colour channel collapse", separator: " - ", text: "Figures with High Res turned on no longer see the upper and lower bodies collapsing into a single colour channel." },
            { label: "#2 - Visible colour mismatch", separator: " - ", text: "Some figures upon disabling High Res, were seeing body colours visually change despite the paint/colour channel not changing. This has been fixed.", notes: [{ label: "Note:", text: "Upon disabling High Res, you may notice it briefly results in a visual colour mismatch. This should resolve itself after a moment.", italic: true }] }
          ]
        },
        {
          title: "Witch Dock UI Changes",
          items: [
            { label: "Visual look & feel update", separator: " - ", text: "Better font + some needed consistency" },
            { label: "Dockk size can now be manually reset by:", notes: [
              { text: "Double-clicking the bottom border or bottom-right corner" },
              { text: "Utilities Tab > Witch Dock section > Reset Size" },
              { text: "This is both to help in cases where the Dock window suddenly refuses to downsize to its normal dimensions, & for convenient resizing", italic: true }
            ] }
          ]
        },
        {
          title: "COMING SOON:",
          items: [
            { label: "Heroforge Script Status Page / UI -", separator: " ", text: "Track ALL THE THINGS!!", italicText: true, notes: [
              { text: "A hub that shows current known bugs/breakage, features broken by current-month HF updates, what's been fixed, & the latest versions of all scripts", italic: true },
              { text: "Track your bug, get notified when it's been fixed, & more!", italic: true }
            ] },
            { label: "Built-in Bug Report Tool", separator: "  - ", text: "We've been building a fantastic bug system and are VERY excited to roll this out.", italicText: true, notes: [
              { text: "This creates a centralized bug hub for all major HF scripts alongside several super easy ways for you to report a bug, capture the figure/tool behaviour at the scene of the crime, & send us that critical diagnostic data without having to leave Heroforge.", italic: true },
              { text: "Get a notification from Witch Dock when your bug has been patched/repaired!", italic: true },
              { text: "Fixes/patches will become MUCH faster/easier, as this gives us devs SUPER helpful details, & spares us from having to track bug reports across a multitude of Discord servers, subreddits + DMs (it gets intense lol)", italic: true }
            ] }
          ]
        }
      ],
      action: {
        label: "Update Witch Dock",
        href: UPDATE_URL,
        newTab: true
      },
      priority: 1000,
      acknowledgeWhen: "show",
      closeLabel: "Close"
    });

    if (registered) {
      state.registeredNoticeId = id;
      state.preview = preview;
    }
    return registered;
  }

  function initialize() {
    try {
      const channelState = getChannelState();
      state.channel = channelState && channelState.channel ? String(channelState.channel) : null;

      if (state.channel === "dev") {
        state.reason = "dev-preview";
        registerNotice(DEV_PREVIEW_NOTICE_ID, true);
        return true;
      }

      if (state.channel !== "stable") {
        state.reason = "unsupported-channel";
        return false;
      }

      const host = UW.KWWitchDockStableHost;
      if (!host || typeof host.getState !== "function") {
        state.reason = "stable-host-state-unavailable";
        return false;
      }

      const hostState = host.getState();
      const installed = hostState && typeof hostState.installedWrapperVersion === "string"
        ? hostState.installedWrapperVersion
        : "";
      state.installedWrapperVersion = installed || null;

      const order = compareVersions(installed, TARGET_STABLE_VERSION);
      if (order == null) {
        state.reason = "installed-wrapper-version-unparseable";
        return false;
      }
      if (order >= 0) {
        state.reason = "installed-wrapper-current";
        return false;
      }

      state.reason = "installed-wrapper-outdated";
      registerNotice(STABLE_NOTICE_ID, false);
      return true;
    } catch (error) {
      state.error = error && error.message ? error.message : String(error);
      state.reason = "error";
      return false;
    }
  }

  function getState() {
    return { ...state };
  }

  UW[GLOBAL] = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    targetStableVersion: TARGET_STABLE_VERSION,
    updateUrl: UPDATE_URL,
    initialize,
    getState
  });

  initialize();
})();

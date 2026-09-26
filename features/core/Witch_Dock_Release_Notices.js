(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const GLOBAL = "KWWitchDockReleaseNotices";
  const FEATURE_ID = "witch-dock-release-notices";
  const VERSION = "0.2.0";
  const BUILD = "0.2.0-v230-release-overview";
  const TARGET_STABLE_VERSION = "2.3.0";
  const UPDATE_URL = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/Witch_Dock.user.js";
  const STABLE_NOTICE_ID = "stable-wrapper-update-v2.3.0";
  const DEV_PREVIEW_NOTICE_ID = "stable-wrapper-update-v2.3.0-dev-preview-v2";

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
        `Users running v2.2.2 and older will need to do a one-time manual update to Witch Dock.`,
        `Please install the latest version, then refresh your browser. Once v${TARGET_STABLE_VERSION} or higher is installed, normal Witch Dock automatic updates should resume.`
      ],
      overview: {
        title: "Release overview",
        items: [
          "High Res: two body paint fixes",
          "Booth Settings JSON import/export restored",
          "Dock typography, controls, and window resizing improved"
        ]
      },
      details: [
        {
          title: "Manual update required",
          items: [
            { text: "A backend migration changed how Witch Dock updates. Users with an older installed script need this one-time manual refresh." },
            { text: `Install v${TARGET_STABLE_VERSION} or higher and refresh your browser. Automatic runtime updates should resume afterward.` }
          ]
        },
        {
          title: "Booth Settings JSON",
          items: [
            { text: "Import and export have been restored. The Save/Load JSON controls now live in Witch Dock’s Booth tab." },
            { text: "Hero Forge’s native UI buttons are planned to return separately; they are not part of this fix." }
          ]
        },
        {
          title: "Textures · High Res",
          items: [
            { text: "High Res applies to the detected figures in a scene, including a third or later mini." },
            { text: "Broader coverage for hair, character creator items, clothing, equipment, kitbash items, and creatures is planned. Per-group performance toggles are also planned; these are not included in this release." }
          ]
        },
        {
          title: "Fixed bugs · Textures",
          items: [
            { label: "Body paint zone collapse", text: "High Res no longer merges distinct upper and lower body paint zones into broad color regions." },
            { label: "Visible color mismatch on disable", text: "Turning High Res off now refreshes the native body color bake so the visible colors return to the selected paints.", notes: ["A brief color mismatch may appear while the native bake refreshes, then resolve."] }
          ]
        },
        {
          title: "Witch Dock UI",
          items: [
            { label: "Look and feel", text: "Polymorph display typography and more consistent labels and controls." },
            { label: "Reset Dock size", text: "Double-click the bottom border or bottom-right corner, or use Utilities → Witch Dock → Reset Size. This also helps when the Dock refuses to shrink to its normal dimensions." },
            { label: "Update and navigation", text: "The Dock shows its runtime version, and the Disclaimer is now inside About." }
          ]
        },
        {
          title: "Coming soon",
          items: [
            { label: "Hero Forge Script Status", text: "A hub for known bugs, monthly Hero Forge breakage, fixes, current script versions, and the status of your report." },
            { label: "Built-in bug reporting", text: "Report a problem from Witch Dock and capture useful figure and tool diagnostics at the scene of the issue.", notes: ["The planned shared tracker will bring reports from major Hero Forge scripts into one place and notify you when your report is fixed.", "Better diagnostic data should help developers repair problems faster without chasing reports across Discord, Reddit, and DMs."] }
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

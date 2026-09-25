(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const GLOBAL = "KWWitchDockReleaseNotices";
  const FEATURE_ID = "witch-dock-release-notices";
  const VERSION = "0.1.0";
  const BUILD = "0.1.0-v230-wrapper-update";
  const TARGET_STABLE_VERSION = "2.3.0";
  const UPDATE_URL = "https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/Witch_Dock.user.js";
  const STABLE_NOTICE_ID = "stable-wrapper-update-v2.3.0";
  const DEV_PREVIEW_NOTICE_ID = "stable-wrapper-update-v2.3.0-dev-preview-v1";

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
      paragraphs: preview
        ? [
            `Preview of the public wrapper-update notice for Witch Dock v${TARGET_STABLE_VERSION}.`,
            "Users running an older installed Tampermonkey wrapper will see this once. The Update Witch Dock button points to the canonical public userscript so Tampermonkey can replace the outdated installed script.",
            "After this one-time wrapper refresh, normal Witch Dock runtime/automatic updates should resume going forward."
          ]
        : [
            `Witch Dock needs an update to v${TARGET_STABLE_VERSION}.`,
            "Please update the installed Witch Dock userscript in Tampermonkey. This one-time update refreshes the installed wrapper; normal Witch Dock updates should resume automatically going forward.",
            "Click Update Witch Dock below. Tampermonkey should replace your existing Witch Dock install."
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
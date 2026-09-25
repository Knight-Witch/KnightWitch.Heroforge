(function () {
  "use strict";
  const FEATURE_ID = "witch-dock-assets";
  const VERSION = "0.2.0";
  const BUILD = "0.2.0-polymorph-display-fonts";
  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const FONT_FAMILY = "KW Polymorph";
  const FONT_STYLE_ID = "kwWitchDockPolymorphFontFaces";
  const FONT_REGULAR_PATH = "features/core/assets/fonts/Polymorph-Regular.ttf";
  const FONT_BOLD_PATH = "features/core/assets/fonts/Polymorph-Bold.ttf";

  function getPayloadRoot() {
    const channel = UW.KWWitchDockDevChannel || UW.KWWitchDockChannel;
    return channel && typeof channel.payloadRoot === "string" ? channel.payloadRoot : "";
  }

  function ensureDisplayFonts() {
    const payloadRoot = getPayloadRoot();
    if (!payloadRoot || !document.head) return false;
    let style = document.getElementById(FONT_STYLE_ID);
    if (!style) {
      const regularUrl = `${payloadRoot}${FONT_REGULAR_PATH}`;
      const boldUrl = `${payloadRoot}${FONT_BOLD_PATH}`;
      style = document.createElement("style");
      style.id = FONT_STYLE_ID;
      style.textContent = `
        @font-face {
          font-family: "${FONT_FAMILY}";
          src: url("${regularUrl}") format("truetype");
          font-style: normal;
          font-weight: 400;
          font-display: swap;
        }
        @font-face {
          font-family: "${FONT_FAMILY}";
          src: url("${boldUrl}") format("truetype");
          font-style: normal;
          font-weight: 700 900;
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
    }
    return true;
  }

  function displayFontState() {
    const payloadRoot = getPayloadRoot();
    const fonts = document.fonts;
    return {
      family: FONT_FAMILY,
      styleInstalled: !!document.getElementById(FONT_STYLE_ID),
      regularUrl: payloadRoot ? `${payloadRoot}${FONT_REGULAR_PATH}` : null,
      boldUrl: payloadRoot ? `${payloadRoot}${FONT_BOLD_PATH}` : null,
      regularLoaded: fonts && typeof fonts.check === "function"
        ? fonts.check(`400 16px "${FONT_FAMILY}"`)
        : null,
      boldLoaded: fonts && typeof fonts.check === "function"
        ? fonts.check(`800 16px "${FONT_FAMILY}"`)
        : null
    };
  }

  const compactEmblemUrl = "data:image/png;base64,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";
  ensureDisplayFonts();

  UW.KWWitchDockAssets = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    compactEmblemUrl,
    displayFontFamily: FONT_FAMILY,
    ensureDisplayFonts,
    getDisplayFontState: displayFontState,
    getState: () => ({
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      compactEmblemBytes: compactEmblemUrl.length,
      displayFont: displayFontState()
    })
  });
})();

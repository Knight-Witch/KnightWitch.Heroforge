from pathlib import Path


def prepend_after_title(path, title, block):
    p = Path(path)
    text = p.read_text()
    marker = title + "\n\n"
    if block.strip() in text:
        return
    if not text.startswith(marker):
        raise RuntimeError(f"Unexpected {path} header")
    p.write_text(marker + block.rstrip() + "\n\n---\n\n" + text[len(marker):])


prepend_after_title(
    "CHANGELOG.md",
    "# Changelog",
    """## DOCK-2026-09-06-032 — Validate High Res service/UI ownership cleanup

Date: 2026-09-06

User live smoke passed the Dev ownership cleanup at `b7693f03eb411c9a7d954175e6f181111fac88a4`.

Confirmed PASS:

- one compact `High Res Image Capture` section with no duplicate legacy presentation;
- Developer Mode provider/build diagnostics;
- provider disable -> enable recovery;
- direct TRUE 4096x4096 capture;
- direct TRUE 8192x8192 capture;
- Spinny coexistence;
- previously validated tab cleanup remains intact.

The service-only v0.8.0 / UI-only v0.3.0 ownership boundary is live validated in Dev.

**Runtime behavior changed:** no. Documentation-only validation checkpoint.""",
)

prepend_after_title(
    "PRE_FLIGHT_Check.md",
    "# Pre-Flight Check Log",
    """## PFC-2026-09-06-032 — Record High Res ownership cleanup live validation

Date: 2026-09-06

### Confirmed live results

- compact normal presentation with no duplicate legacy section: PASS;
- Developer Mode diagnostics: PASS;
- provider disable -> enable recovery: PASS;
- direct TRUE 4K / 4096x4096: PASS;
- direct TRUE 8K / 8192x8192: PASS;
- Spinny coexistence: PASS;
- tab cleanup remains correct: PASS.

The v0.8.0 service-only / v0.3.0 UI-only split is validated for Dev promotion consideration. No runtime files change in this checkpoint.

**Runtime behavior changed:** no.""",
)

master = Path("MASTER.md")
text = master.read_text()
text = text.replace(
    "Prior compact visual smoke: **PASS by user report**. Service/UI ownership cleanup is implemented in Dev; direct 4K/8K regression and provider disable/re-enable recovery are the current live gate.",
    "Service/UI ownership cleanup live smoke: **PASS**. Compact presentation, provider disable/re-enable recovery, direct TRUE 4K, direct TRUE 8K, and Spinny coexistence are validated on the current Dev build."
)
text = text.replace(
    "1. Smoke the Dev tab cleanup: `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`, with Utilities pinned last.\n2. Promote the accepted tab cleanup separately after user approval.\n3. Smoke integrated Developer Mode + compact High Res behavior, including provider disable/re-enable and direct 4K/8K regression.\n4. Cleanly separate High Res service/UI ownership before promoting the compact High Res presentation.\n5. Promote Developer Mode as an About-only, default-OFF public diagnostic feature after its integrated smoke.\n6. Keep 4096 animated WebP deferred until a clean frame-source ownership seam exists.",
    "1. Make Developer Mode public-ready as an About-only, default-OFF troubleshooting feature whose version registry follows the manifest actually loaded by the current Witch Dock host.\n2. Live-smoke Developer Mode persistence, per-tool diagnostics, module inventory, Spinny Short Test visibility, and High Res developer controls.\n3. Prepare a narrow Stable promotion containing the already validated tab cleanup, compact High Res service/UI split, and Developer Mode only after that smoke passes.\n4. Keep 4096 animated WebP deferred until a clean frame-source ownership seam exists."
)
master.write_text(text)

follow = Path("HISTORY/BULLSHIT/WITCH_DOCK_UI_FOLLOWUPS.md")
ftext = follow.read_text()
block = """\n## 2026-09-06 High Res ownership cleanup — PASS\n\nUser live validation passed the service/UI ownership cleanup at `b7693f03eb411c9a7d954175e6f181111fac88a4`: compact presentation, no duplicate legacy section, Developer Mode provider diagnostics, provider disable -> enable recovery, TRUE 4K, TRUE 8K, Spinny coexistence, and existing tab cleanup all pass. The High Res ownership item is closed for Dev; next stage is Developer Mode public-readiness.\n"""
if "## 2026-09-06 High Res ownership cleanup — PASS" not in ftext:
    follow.write_text(ftext.rstrip() + "\n" + block + "\n")

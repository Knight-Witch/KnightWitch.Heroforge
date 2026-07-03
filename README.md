# WITCH DOCK - Script Tools For HeroForge

A growing suite of advanced HeroForge userscripts focused on power-user workflows, body editing, kitbashing, decals, booth control, JSON tools, and HeroForge UI utilities.

---

## Get It Here

### What Is It?

This is where all the Witch's scripts live. One easy script, no hassle. Witch Dock is a floating, customizable dock UI designed to make HeroForge power-user workflows easier to access and manage.

The tool will continue to receive more toolkits, utilities, and workflow features over time.

Install:
https://raw.githubusercontent.com/Knight-Witch/KnightWitch.Heroforge/Witch_Scripts/Witch_Dock.user.js

- To set up, follow the install link.
- Updates are automatic.
- Remove the script from Tampermonkey any time at no risk.
- Built to be compatible with r/HeroforgeJSON's scripts.
- If you download the file directly, drag and drop the file onto Tampermonkey to install it. Do not try to open the file on your computer.
- Read any directions shown at the bottom of a tool section. Some tools require you to pose an item before the tool can work correctly because of how HeroForge updates its internal state.

---

## Current Features

### Witch Dock

- Floating dock UI for HeroForge tools.
- Manifest-driven tool loading from the live GitHub repo.
- Automatic delivery of enabled tools and hidden utilities after refreshing HeroForge.
- Current visible tool tabs include Body Editor, Pose, Booth, and JSON.

### HeroForge UI Utilities

These utilities load quietly through Witch Dock and do not appear as normal floating dock tabs.

- Decals Scroll Guards: makes the Decals source/object selector and decal slot grid scrollable and vertically resizable. The utility is scoped to the active Decals UI so it does not create empty resize zones on other HeroForge tabs.
- Expanded Decal Slots Bridge: detects compatible HF Core Tweaks decal-slot data and expands the available decal slots further. If HF Core Tweaks is not installed or the expected signature is not present, this utility does nothing.
- Runtime decal expansion status can be checked in the browser console with `window.KW_HeroForgeUI?.expandedDecalSlots`.

---

## Support Development

**If you find this tool useful, consider supporting its development:**

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/C0C0UQV1J)

This script and all its tools are developed by me. I will be opening up collaboration to help stabilize existing scripts with other creators and grow a useful community tool for HeroForge users.

---

## About

[See here for my Development Pipeline](https://trello.com/invite/b/69641ce657fc71e4b58b8e8f/ATTId5e6e1e9cfc84460b530f6d7e94836c0A4C34481/witch-scripts)

This is done in my spare time and I am not paid for it. It is time consuming, but support enables me to spend more time improving the tool and implementing requested features.

---

## Deprecated Scripts - Please Uninstall

The following scripts are no longer updated and will conflict with Witch Dock. If you have any of my scripts prior to Witch Dock, including standalone scripts or beta scripts, remove those before using Witch Dock.

### Sync Extra Arms

### Body Editor / Body Editor BETA

### JSON Bulk Backup Tool, or one of its variations

---

## Changelog Index

See **[CHANGELOG.md](./CHANGELOG.md)** for the latest feature updates and bug fixes.

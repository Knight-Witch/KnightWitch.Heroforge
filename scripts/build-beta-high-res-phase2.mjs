import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const DEV_PRIORITY_PATH = "features/rendering/Texture_Quality_Active_Decal_Priority.js";
const ALL_PART_PATH = "features/rendering/Texture_Quality_All_Part_Promotion.js";
const OUTPUT_PATH = "beta/modules/High_Res_Phase_2.js";

function read(refPath) {
  return fs.readFileSync(path.join(root, refPath), "utf8");
}

function show(ref, refPath) {
  return execFileSync("git", ["show", `${ref}:${refPath}`], {
    cwd: root,
    encoding: "utf8"
  });
}

function workingBlob(refPath) {
  return execFileSync("git", ["hash-object", refPath], {
    cwd: root,
    encoding: "utf8"
  }).trim();
}

function sourceBlob(source) {
  return execFileSync("git", ["hash-object", "--stdin"], {
    cwd: root,
    input: source,
    encoding: "utf8"
  }).trim();
}

const devPriority = read(DEV_PRIORITY_PATH);
const allPart = read(ALL_PART_PATH);
const stablePriority = show("origin/Witch_Scripts", DEV_PRIORITY_PATH);

const blobs = {
  devPriority: workingBlob(DEV_PRIORITY_PATH),
  allPart: workingBlob(ALL_PART_PATH),
  stablePriority: sourceBlob(stablePriority)
};

const required = {
  devPriority: "24246a918e7132158941caee74ca6f5f3ff7d76d",
  allPart: "75e721560c50eccb6c56c92bef0272396f84ac1d",
  stablePriority: "a89c57e09cdaa2f4213f6b3a8eed95118f4c4d14"
};

for (const key of Object.keys(required)) {
  if (blobs[key] !== required[key]) {
    throw new Error(
      key + " source blob changed: expected " + required[key] + ", got " + blobs[key]
    );
  }
}

const out = `(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const host = UW.KWWitchDockBetaTester;
  if (!host || typeof host.registerModule !== "function") {
    throw new Error("Witch Dock Beta Tester host is unavailable.");
  }

  const ID = "high-res-phase-2";
  const VERSION = "0.1.1";
  const BUILD = "0.1.1-native-baseline-preflight";
  const EXPECTED = Object.freeze({
    core: Object.freeze({
      version: "0.3.8",
      build: "0.3.8-supported-body-aaid-binding"
    }),
    stablePriority: Object.freeze({
      version: "0.1.1",
      build: "0.1.1-dev-projected-host-lifecycle-coordination"
    }),
    betaPriority: Object.freeze({
      version: "0.1.2",
      build: "0.1.2-preserve-external-scales",
      sourceBlob: ${JSON.stringify(blobs.devPriority)}
    }),
    allPart: Object.freeze({
      version: "0.1.13",
      build: "0.1.13-native-baseline-preflight",
      sourceBlob: ${JSON.stringify(blobs.allPart)}
    }),
    restorePriority: Object.freeze({
      version: "0.1.1",
      build: "0.1.1-dev-projected-host-lifecycle-coordination",
      sourceBlob: ${JSON.stringify(blobs.stablePriority)}
    })
  });

  const BETA_PRIORITY_SOURCE = ${JSON.stringify(devPriority)};
  const ALL_PART_SOURCE = ${JSON.stringify(allPart)};
  const STABLE_PRIORITY_SOURCE = ${JSON.stringify(stablePriority)};
  const SETTLE_TIMEOUT_MS = 20000;
  const SETTLE_STEP_MS = 75;

  const state = {
    active: false,
    activationCount: 0,
    deactivationCount: 0,
    activatedAt: null,
    deactivatedAt: null,
    lifecycleRepairCount: 0,
    lastLifecycleReason: null,
    lastLifecycleAt: null,
    lastHandledDisplayCount: 0,
    lastError: null,
    ownsPriority: false,
    ownsAllPart: false
  };

  let unsubscribeCore = null;
  let repairTimer = null;
  let repairPromise = null;
  let pendingRepairReason = null;
  let pendingRepairForce = false;
  let lastStableEnabled = false;
  let lastHandledSignature = null;
  let displayIds = new WeakMap();
  let nextDisplayId = 1;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const nowIso = () => new Date().toISOString();

  function exactIdentity(value, expected) {
    return !!value &&
      value.version === expected.version &&
      value.build === expected.build;
  }

  function core() {
    return UW.KWTextureQualityNativeReconcile || null;
  }

  function priority() {
    return UW.KWTextureQualityActiveDecalPriority || null;
  }

  function allPart() {
    return UW.KWTextureQualityAllPartPromotion || null;
  }

  function objectId(value) {
    if (!value || (typeof value !== "object" && typeof value !== "function")) {
      return "0";
    }
    let id = displayIds.get(value);
    if (!id) {
      id = nextDisplayId++;
      displayIds.set(value, id);
    }
    return String(id);
  }

  function displaySignature() {
    const character = UW.CK && UW.CK.character;
    if (!character) return { signature: "", count: 0 };

    const rows = [];
    const seen = new Set();
    const add = (key, display) => {
      if (!display || typeof display !== "object" || seen.has(display)) return;
      seen.add(display);
      const data =
        display.data || (display === character.display ? character.data : null);
      const modded = display.modded || null;
      rows.push([
        String(key || ""),
        objectId(display),
        objectId(data),
        objectId(modded)
      ].join(":"));
    };

    add("", character.display);
    if (character.allDisplays && typeof character.allDisplays === "object") {
      for (const [key, display] of Object.entries(character.allDisplays)) {
        add(key, display);
      }
    }

    rows.sort();
    return {
      signature: rows.join("|"),
      count: rows.length
    };
  }

  function executeEmbedded(source, label) {
    try {
      const fn = new Function(
        "unsafeWindow",
        "window",
        "document",
        "console",
        "setInterval",
        "clearInterval",
        "setTimeout",
        "clearTimeout",
        source
      );
      fn(
        UW,
        UW,
        document,
        console,
        setInterval,
        clearInterval,
        setTimeout,
        clearTimeout
      );
    } catch (error) {
      throw new Error(
        label + " failed to load: " +
        (error && error.message ? error.message : String(error))
      );
    }
  }

  async function settleCore(timeoutMs = SETTLE_TIMEOUT_MS) {
    const started = Date.now();
    while ((Date.now() - started) < timeoutMs) {
      const svc = core();
      let snapshot = null;
      try {
        snapshot =
          svc && typeof svc.getState === "function" ? svc.getState() : null;
      } catch (_) {}

      if (snapshot &&
          !snapshot.busy &&
          !snapshot.autoPending &&
          !snapshot.sceneSyncPending) {
        return snapshot;
      }

      await sleep(SETTLE_STEP_MS);
    }

    throw new Error(
      "Stable High Res core did not settle before the Beta compatibility timeout."
    );
  }

  async function settlePriority(timeoutMs = SETTLE_TIMEOUT_MS) {
    const started = Date.now();
    while ((Date.now() - started) < timeoutMs) {
      const owner = priority();
      let snapshot = null;
      try {
        snapshot =
          owner && typeof owner.getState === "function"
            ? owner.getState()
            : null;
      } catch (_) {}

      const svc = core();
      if (snapshot &&
          !snapshot.reconcilePending &&
          !snapshot.lifecycleBlocked &&
          svc &&
          !svc.busy) {
        return snapshot;
      }

      await sleep(SETTLE_STEP_MS);
    }

    throw new Error(
      "Beta accessory-priority owner did not settle before the compatibility timeout."
    );
  }

  async function settleAllPart(timeoutMs = SETTLE_TIMEOUT_MS) {
    const started = Date.now();
    while ((Date.now() - started) < timeoutMs) {
      const owner = allPart();
      let snapshot = null;
      try {
        snapshot =
          owner && typeof owner.getState === "function"
            ? owner.getState()
            : null;
      } catch (_) {}

      if (snapshot &&
          !snapshot.busy &&
          !snapshot.queued &&
          !snapshot.inFlight) {
        return snapshot;
      }

      await sleep(SETTLE_STEP_MS);
    }

    throw new Error(
      "High Res Phase 2 coverage owner did not settle before the compatibility timeout."
    );
  }

  function runMarker(snapshot) {
    const run = snapshot && snapshot.lastRun;
    return run && run.finishedAt
      ? String(run.finishedAt) + "|" + String(run.trigger || "")
      : "";
  }

  async function runLifecycleRepair(reason, force) {
    if (!state.active) return false;

    if (repairPromise) {
      pendingRepairReason = reason || pendingRepairReason || "coalesced";
      pendingRepairForce = pendingRepairForce || !!force;
      return repairPromise;
    }

    repairPromise = (async () => {
      const coreState = await settleCore();
      if (!state.active) return false;

      if (!coreState.enabled) {
        lastStableEnabled = false;
        lastHandledSignature = null;
        return true;
      }

      const displays = displaySignature();
      if (!force &&
          displays.signature &&
          displays.signature === lastHandledSignature) {
        return true;
      }

      const betaPriority = priority();
      const phase2 = allPart();

      if (!exactIdentity(betaPriority, EXPECTED.betaPriority)) {
        throw new Error(
          "Beta accessory-priority owner identity changed unexpectedly."
        );
      }

      if (!exactIdentity(phase2, EXPECTED.allPart)) {
        throw new Error(
          "High Res Phase 2 owner identity changed unexpectedly."
        );
      }

      if (typeof betaPriority.refresh === "function") {
        betaPriority.refresh();
      }
      await settlePriority();

      const beforeMarker = runMarker(phase2.getState());
      if (typeof phase2.refresh === "function") {
        phase2.refresh();
      }
      let after = await settleAllPart();

      if (runMarker(after) === beforeMarker) {
        const ok = await Promise.resolve(phase2.reconcile());
        if (ok === false) {
          throw new Error(
            "High Res Phase 2 declined the lifecycle repair pass."
          );
        }
        after = await settleAllPart();
      }

      if (after.lastError) {
        throw new Error(
          "High Res Phase 2 coverage error: " + after.lastError
        );
      }

      const finalDisplays = displaySignature();
      lastHandledSignature = finalDisplays.signature;
      lastStableEnabled = true;
      state.lastHandledDisplayCount = finalDisplays.count;
      state.lifecycleRepairCount += 1;
      state.lastLifecycleReason = reason || "repair";
      state.lastLifecycleAt = nowIso();
      state.lastError = null;
      return true;
    })().catch((error) => {
      state.lastError =
        error && error.message ? error.message : String(error);
      console.warn(
        "[Witch Dock Beta High Res Phase 2] Lifecycle repair failed:",
        error
      );
      return false;
    }).finally(() => {
      repairPromise = null;
      if (state.active && pendingRepairReason) {
        const nextReason = pendingRepairReason;
        const nextForce = pendingRepairForce;
        pendingRepairReason = null;
        pendingRepairForce = false;
        scheduleLifecycleRepair(nextReason, nextForce);
      }
    });

    return repairPromise;
  }

  function scheduleLifecycleRepair(reason, force) {
    if (!state.active) return false;

    pendingRepairReason =
      reason || pendingRepairReason || "scheduled";
    pendingRepairForce =
      pendingRepairForce || !!force;

    if (repairTimer || repairPromise) return true;

    repairTimer = setTimeout(() => {
      repairTimer = null;
      const nextReason =
        pendingRepairReason || "scheduled";
      const nextForce = pendingRepairForce;
      pendingRepairReason = null;
      pendingRepairForce = false;
      void runLifecycleRepair(nextReason, nextForce);
    }, 60);

    return true;
  }

  function onCoreState(snapshot) {
    if (!state.active || !snapshot) return;
    if (snapshot.busy ||
        snapshot.autoPending ||
        snapshot.sceneSyncPending) {
      return;
    }

    if (repairPromise) {
      lastStableEnabled = !!snapshot.enabled;
      return;
    }

    const displays = displaySignature();

    if (!snapshot.enabled) {
      lastStableEnabled = false;
      lastHandledSignature = null;
      return;
    }

    if (!lastStableEnabled) {
      lastStableEnabled = true;
      if (displays.signature &&
          displays.signature === lastHandledSignature) {
        return;
      }
      scheduleLifecycleRepair("core-enabled", true);
      return;
    }

    if (displays.signature &&
        displays.signature !== lastHandledSignature) {
      scheduleLifecycleRepair("scene-display-change", true);
    }
  }

  function clearLifecycleHooks() {
    if (repairTimer) {
      clearTimeout(repairTimer);
      repairTimer = null;
    }

    pendingRepairReason = null;
    pendingRepairForce = false;

    if (unsubscribeCore) {
      try {
        unsubscribeCore();
      } catch (_) {}
      unsubscribeCore = null;
    }
  }

  async function maybeAwait(value) {
    if (value && typeof value.then === "function") {
      return value;
    }
    return value;
  }

  async function restoreStablePriority() {
    const existing = priority();

    if (exactIdentity(existing, EXPECTED.stablePriority)) {
      return true;
    }

    if (existing) {
      throw new Error(
        "Cannot restore Stable priority while an unexpected priority owner is present."
      );
    }

    executeEmbedded(
      STABLE_PRIORITY_SOURCE,
      "Stable accessory-priority restore"
    );

    const restored = priority();
    if (!exactIdentity(restored, EXPECTED.stablePriority)) {
      throw new Error(
        "Stable accessory-priority owner did not restore to the expected identity."
      );
    }

    return true;
  }

  async function rollbackOwnedOwners() {
    clearLifecycleHooks();

    if (repairPromise) {
      try {
        await repairPromise;
      } catch (_) {}
    }

    const phase2 = allPart();
    if (state.ownsAllPart &&
        exactIdentity(phase2, EXPECTED.allPart) &&
        typeof phase2.dispose === "function") {
      await maybeAwait(phase2.dispose());
    }
    state.ownsAllPart = false;

    const betaPriority = priority();
    if (state.ownsPriority &&
        exactIdentity(betaPriority, EXPECTED.betaPriority) &&
        typeof betaPriority.dispose === "function") {
      await maybeAwait(betaPriority.dispose());
    }
    state.ownsPriority = false;

    await restoreStablePriority();

    lastStableEnabled = false;
    lastHandledSignature = null;
    displayIds = new WeakMap();
    nextDisplayId = 1;
    return true;
  }

  async function activate() {
    if (state.active) return true;

    const svc = core();
    const stablePriority = priority();

    if (!exactIdentity(svc, EXPECTED.core)) {
      throw new Error(
        "High Res Phase 2 Beta requires Witch Dock Stable Texture Quality " +
        EXPECTED.core.version + " / " +
        EXPECTED.core.build + "."
      );
    }

    if (!exactIdentity(
      stablePriority,
      EXPECTED.stablePriority
    )) {
      throw new Error(
        "High Res Phase 2 Beta requires the expected Stable accessory-priority owner."
      );
    }

    if (allPart()) {
      throw new Error(
        "A High Res all-part owner is already present; refusing to stack Beta Phase 2."
      );
    }

    state.lastError = null;

    try {
      await maybeAwait(stablePriority.dispose());

      if (priority()) {
        throw new Error(
          "Stable accessory-priority owner did not release cleanly."
        );
      }

      executeEmbedded(
        BETA_PRIORITY_SOURCE,
        "Beta accessory-priority owner"
      );

      if (!exactIdentity(
        priority(),
        EXPECTED.betaPriority
      )) {
        throw new Error(
          "Beta accessory-priority owner did not attach with the expected identity."
        );
      }

      state.ownsPriority = true;

      executeEmbedded(
        ALL_PART_SOURCE,
        "High Res Phase 2 all-part owner"
      );

      if (!exactIdentity(
        allPart(),
        EXPECTED.allPart
      )) {
        throw new Error(
          "High Res Phase 2 all-part owner did not attach with the expected identity."
        );
      }

      state.ownsAllPart = true;
      state.active = true;
      state.activationCount += 1;
      state.activatedAt = nowIso();

      const repaired =
        await runLifecycleRepair("activation", true);

      if (!repaired) {
        throw new Error(
          state.lastError ||
          "Initial High Res Phase 2 compatibility pass failed."
        );
      }

      const currentCore = core();
      if (currentCore &&
          typeof currentCore.onChange === "function") {
        unsubscribeCore =
          currentCore.onChange(onCoreState);
      }

      return true;
    } catch (error) {
      state.lastError =
        error && error.message
          ? error.message
          : String(error);

      state.active = false;

      try {
        await rollbackOwnedOwners();
      } catch (rollbackError) {
        state.lastError +=
          " Rollback error: " +
          (rollbackError && rollbackError.message
            ? rollbackError.message
            : String(rollbackError));
      }

      throw new Error(state.lastError);
    }
  }

  async function deactivate() {
    if (!state.active) return true;

    state.lastError = null;

    try {
      await rollbackOwnedOwners();
      state.active = false;
      state.deactivationCount += 1;
      state.deactivatedAt = nowIso();
      return true;
    } catch (error) {
      state.lastError =
        error && error.message
          ? error.message
          : String(error);
      throw error;
    }
  }

  function summarizeAllPart() {
    const owner = allPart();
    if (!owner ||
        typeof owner.getState !== "function") {
      return null;
    }

    try {
      const snapshot = owner.getState();
      const run =
        snapshot && snapshot.lastRun || null;

      return {
        version: snapshot.version || null,
        build: snapshot.build || null,
        enabled: !!snapshot.enabled,
        busy: !!snapshot.busy,
        queued: !!snapshot.queued,
        activeBindings:
          Number(snapshot.activeBindings) || 0,
        lastError: snapshot.lastError || null,
        lastRun: run ? {
          trigger: run.trigger || null,
          finishedAt: run.finishedAt || null,
          selected:
            Array.isArray(run.selected)
              ? run.selected.length
              : 0,
          densitySelected:
            Array.isArray(run.densitySelected)
              ? run.densitySelected.length
              : 0,
          downgraded:
            Array.isArray(run.downgraded)
              ? run.downgraded.length
              : 0,
          skipped:
            Array.isArray(run.skipped)
              ? run.skipped.length
              : 0,
          failed:
            Array.isArray(run.failed)
              ? run.failed.length
              : 0,
          restored:
            Array.isArray(run.restored)
              ? run.restored.length
              : 0
        } : null
      };
    } catch (_) {
      return null;
    }
  }

  function getState() {
    const svc = core();
    const currentPriority = priority();
    let coreState = null;
    let priorityState = null;

    try {
      coreState =
        svc && typeof svc.getState === "function"
          ? svc.getState()
          : null;
    } catch (_) {}

    try {
      priorityState =
        currentPriority &&
        typeof currentPriority.getState === "function"
          ? currentPriority.getState()
          : null;
    } catch (_) {}

    return {
      active: state.active,
      activationCount: state.activationCount,
      deactivationCount: state.deactivationCount,
      activatedAt: state.activatedAt,
      deactivatedAt: state.deactivatedAt,
      lifecycleRepairCount:
        state.lifecycleRepairCount,
      lastLifecycleReason:
        state.lastLifecycleReason,
      lastLifecycleAt:
        state.lastLifecycleAt,
      lastHandledDisplayCount:
        state.lastHandledDisplayCount,
      lastError: state.lastError,
      compatibility: {
        expectedCore: EXPECTED.core,
        core: svc ? {
          version: svc.version || null,
          build: svc.build || null
        } : null,
        priority: currentPriority ? {
          version: currentPriority.version || null,
          build: currentPriority.build || null
        } : null,
        allPart: summarizeAllPart()
      },
      lifecycle: {
        coreEnabled:
          !!(coreState && coreState.enabled),
        coreBusy:
          !!(coreState && coreState.busy),
        persistent:
          !!(coreState && coreState.persistent),
        autoPending:
          !!(coreState && coreState.autoPending),
        sceneSyncPending:
          !!(coreState && coreState.sceneSyncPending),
        priorityReconcilePending:
          !!(
            priorityState &&
            priorityState.reconcilePending
          ),
        priorityPolicyDirty:
          !!(
            priorityState &&
            priorityState.policyDirty
          ),
        repairPending:
          !!repairPromise || !!repairTimer
      },
      embeddedSources: {
        betaPriority:
          EXPECTED.betaPriority,
        allPart:
          EXPECTED.allPart,
        stablePriorityRestore:
          EXPECTED.restorePriority
      }
    };
  }

  function render(container) {
    const note =
      document.createElement("div");
    note.style.fontSize = "11px";
    note.style.lineHeight = "1.4";
    note.textContent =
      "High Res Phase 2 runs as a Stable-compatible Beta overlay. " +
      "Turning this module OFF restores the Stable Texture Quality owner in-page.";
    container.appendChild(note);

    const snapshot = getState();
    const status =
      document.createElement("div");
    status.style.marginTop = "6px";
    status.style.fontSize = "10px";
    status.style.opacity = ".72";
    status.textContent =
      snapshot.active
        ? "Phase 2 active · lifecycle repairs: " +
          snapshot.lifecycleRepairCount +
          " · promoted bindings: " +
          (
            (
              snapshot.compatibility.allPart &&
              snapshot.compatibility.allPart.activeBindings
            ) || 0
          )
        : "Phase 2 inactive";
    container.appendChild(status);
  }

  async function dispose() {
    if (
      state.active ||
      state.ownsPriority ||
      state.ownsAllPart
    ) {
      await deactivate();
    } else {
      clearLifecycleHooks();
    }

    return true;
  }

  host.registerModule({
    id: ID,
    version: VERSION,
    build: BUILD,
    activate,
    deactivate,
    render,
    getState,
    dispose
  });
})();`;

fs.mkdirSync(
  path.dirname(path.join(root, OUTPUT_PATH)),
  { recursive: true }
);
fs.writeFileSync(
  path.join(root, OUTPUT_PATH),
  out,
  "utf8"
);

console.log(JSON.stringify({
  output: OUTPUT_PATH,
  bytes: Buffer.byteLength(out),
  sourceBlobs: blobs
}, null, 2));

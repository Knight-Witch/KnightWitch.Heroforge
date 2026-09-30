(function () {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const GLOBAL = "KWWitchDockReporterClient";
  const FEATURE_ID = "hf-status-reporter-client";
  const VERSION = "0.1.0";
  const BUILD = "0.1.0-shared-intake-contract";
  const REPORT_SCHEMA_VERSION = "1.3";
  const DRAFT_SCHEMA_VERSION = "1.0";
  const DRAFT_KEY = "kw.witchDock.reportDrafts.v1";
  const RECEIPT_KEY = "kw.witchDock.hfStatus.receipts.v1";
  const REPORTER_TOKEN_KEY = "kw.witchDock.hfStatus.reporterToken.v1";
  const MAX_DRAFTS = 5;
  const MAX_RECEIPTS = 50;
  const DRAFT_RETENTION_MS = 14 * 24 * 60 * 60 * 1000;
  const CONTEXT_MAX_BYTES = 768 * 1024;
  const CAPABILITIES_MAX_BYTES = 128 * 1024;

  if (UW[GLOBAL] && UW[GLOBAL].build === BUILD) return;

  function nowIso() { return new Date().toISOString(); }
  function clone(value) {
    if (value == null) return value;
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return null; }
  }
  function uuid() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") return globalThis.crypto.randomUUID();
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
  }
  function storage() {
    try { return UW.localStorage; } catch (_) { return null; }
  }
  function readJson(key, fallback) {
    const store = storage();
    if (!store) return fallback;
    try {
      const raw = store.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) { return fallback; }
  }
  function writeJson(key, value) {
    const store = storage();
    if (!store) throw new Error("Browser storage is unavailable.");
    store.setItem(key, JSON.stringify(value));
    return true;
  }

  function resolveSiteBase() {
    try {
      const host = UW.KWWitchDockStatusHost;
      if (host && typeof host.siteBase === "string" && /^https:\/\//i.test(host.siteBase)) {
        return new URL(host.siteBase).origin;
      }
    } catch (_) {}
    try {
      const pub = UW.KWWitchDockPublicStatus;
      const state = pub && typeof pub.getState === "function" ? pub.getState() : null;
      if (state && typeof state.siteBase === "string" && /^https:\/\//i.test(state.siteBase)) {
        return new URL(state.siteBase).origin;
      }
    } catch (_) {}
    try {
      const dev = UW.KWWitchDockDevChannel;
      if (dev && typeof dev.statusApiEndpoint === "string") return new URL(dev.statusApiEndpoint).origin;
    } catch (_) {}
    return "";
  }

  function expectedUrl(path) {
    const base = resolveSiteBase();
    if (!base) throw new Error("HF.Status service location is unavailable.");
    const url = new URL(String(path || ""), base);
    if (url.origin !== base) throw new Error("HF.Status request refused a cross-origin target.");
    return url;
  }

  class ReporterApiError extends Error {
    constructor(code, message, retryable, requestId, status) {
      super(message || "HF.Status request failed.");
      this.name = "ReporterApiError";
      this.code = code || "internal_error";
      this.retryable = retryable !== false;
      this.requestId = requestId || null;
      this.status = Number(status) || null;
    }
  }

  async function parseJsonResponse(response, maxBytes) {
    const limit = Number(maxBytes) || CONTEXT_MAX_BYTES;
    const text = await response.text();
    if (text.length > limit) throw new ReporterApiError("response_too_large", "HF.Status returned more data than the reporter will accept.", true, null, response.status);
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch (_) {
      throw new ReporterApiError("invalid_response", "HF.Status returned invalid JSON.", true, null, response.status);
    }
    if (!response.ok || (body && body.ok === false)) {
      const err = body && body.error || {};
      throw new ReporterApiError(err.code || "http_error", err.message || ("HF.Status returned HTTP " + response.status + "."), err.retryable !== false, err.requestId || null, response.status);
    }
    return body;
  }

  async function requestJson(path, options) {
    const opts = options && typeof options === "object" ? options : {};
    const url = expectedUrl(path);
    const response = await fetch(url.href, {
      method: opts.method || "GET",
      headers: Object.assign({ "accept": "application/json" }, opts.headers || {}),
      body: opts.body === undefined ? undefined : opts.body,
      credentials: "omit",
      cache: opts.cache || "no-store",
      mode: "cors",
      redirect: "follow"
    });
    try {
      const finalUrl = new URL(response.url || url.href);
      if (finalUrl.origin !== url.origin || finalUrl.pathname !== url.pathname) {
        throw new ReporterApiError("unexpected_redirect", "HF.Status returned an unexpected redirect target.", true, null, response.status);
      }
    } catch (error) {
      if (error instanceof ReporterApiError) throw error;
      throw new ReporterApiError("invalid_response_url", "HF.Status returned an invalid response URL.", true, null, response.status);
    }
    return parseJsonResponse(response, opts.maxBytes);
  }

  async function getReporterContext() {
    const body = await requestJson("/api/v1/reporter-context", { maxBytes: CONTEXT_MAX_BYTES });
    const context = body && body.reporterContext;
    if (!context || context.schemaVersion !== "1.0" || !Array.isArray(context.products) || !Array.isArray(context.features)) {
      throw new ReporterApiError("reporter_context_invalid", "HF.Status reporter metadata is incompatible with this Witch Dock build.", true);
    }
    return clone(context);
  }

  async function getCapabilities() {
    const body = await requestJson("/api/v1/capabilities", { maxBytes: CAPABILITIES_MAX_BYTES });
    const capabilities = body && body.capabilities;
    if (!capabilities || typeof capabilities !== "object" || !capabilities.evidence) {
      throw new ReporterApiError("capabilities_invalid", "HF.Status submission capabilities are unavailable.", true);
    }
    return clone(capabilities);
  }

  function evidenceManifestItem(item) {
    return {
      clientAttachmentId: item.clientAttachmentId,
      kind: item.kind,
      fileName: item.fileName,
      mediaType: item.mediaType,
      sizeBytes: item.sizeBytes,
      ...(item.origin ? { origin: item.origin } : {}),
      ...(item.capturedAt ? { capturedAt: item.capturedAt } : {}),
      ...(item.evidenceRole ? { evidenceRole: item.evidenceRole } : {}),
      ...(item.evidencePurpose ? { evidencePurpose: item.evidencePurpose } : {}),
      ...(item.evidenceSession ? { evidenceSession: item.evidenceSession } : {})
    };
  }

  function normalizeEvidenceItem(item) {
    if (!item || typeof item !== "object") throw new Error("Invalid evidence item.");
    const blob = item.blob instanceof Blob ? item.blob : (item.file instanceof Blob ? item.file : null);
    if (!blob) throw new Error("Evidence bytes are unavailable; reattach the file before submitting.");
    const normalized = {
      clientAttachmentId: String(item.clientAttachmentId || uuid()),
      kind: String(item.kind || ""),
      fileName: String(item.fileName || (item.file && item.file.name) || "evidence.bin").slice(0, 255),
      mediaType: String(item.mediaType || blob.type || "application/octet-stream").split(";", 1)[0].slice(0, 120),
      sizeBytes: Number(blob.size) || 0,
      origin: item.origin || "witch-dock-user-capture",
      capturedAt: item.capturedAt || null,
      evidenceRole: item.evidenceRole || null,
      evidencePurpose: item.evidencePurpose || null,
      evidenceSession: item.evidenceSession || null,
      blob: blob
    };
    if (!normalized.clientAttachmentId || normalized.sizeBytes < 1) throw new Error("Evidence file is empty or invalid.");
    return normalized;
  }

  function validateEvidence(evidence, capabilities) {
    const items = evidence.map(normalizeEvidenceItem);
    const maxAttachments = Math.min(Number(capabilities.maxAttachments) || 0, 20);
    if (!maxAttachments || items.length > maxAttachments) {
      throw new ReporterApiError("attachment_limit", "Too many evidence attachments for this report.", false);
    }
    const maxTotal = Number(capabilities.maxTotalEvidenceBytes) || 0;
    let total = 0;
    for (const item of items) {
      const policy = capabilities.evidence && capabilities.evidence[item.kind];
      if (!policy) throw new ReporterApiError("unsupported_attachment", "HF.Status does not accept this evidence type.", false);
      const allowedTypes = Array.isArray(policy.mediaTypes) ? policy.mediaTypes : [];
      if (allowedTypes.length && !allowedTypes.includes(item.mediaType)) {
        throw new ReporterApiError("unsupported_attachment_type", "HF.Status does not accept " + item.mediaType + " for " + item.kind + ".", false);
      }
      if (Number(policy.maxBytes) > 0 && item.sizeBytes > Number(policy.maxBytes)) {
        throw new ReporterApiError("attachment_too_large", item.fileName + " exceeds the current HF.Status upload limit.", false);
      }
      total += item.sizeBytes;
    }
    if (maxTotal > 0 && total > maxTotal) throw new ReporterApiError("evidence_too_large", "Combined evidence exceeds the current HF.Status limit.", false);
    return items;
  }

  async function submitReport(options) {
    const opts = options && typeof options === "object" ? options : {};
    const report = opts.report && typeof opts.report === "object" ? clone(opts.report) : null;
    if (!report) throw new Error("A report payload is required.");
    const clientSubmissionId = String(report.clientSubmissionId || opts.clientSubmissionId || "");
    if (!clientSubmissionId) throw new Error("clientSubmissionId is required.");

    const capabilities = opts.capabilities || await getCapabilities();
    if (capabilities.abuseProofRequired && !opts.abuseProof) {
      throw new ReporterApiError("abuse_proof_required", "HF.Status currently requires browser verification that Witch Dock cannot complete in-page yet.", false);
    }

    const evidence = validateEvidence(Array.isArray(opts.evidence) ? opts.evidence : [], capabilities);
    const manifest = evidence.map(evidenceManifestItem);
    const sessionPayload = {
      clientSubmissionId: clientSubmissionId,
      source: "witch-dock",
      attachments: manifest,
      ...(opts.abuseProof ? { abuseProof: opts.abuseProof } : {})
    };

    const sessionBody = await requestJson("/api/v1/submission-sessions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(sessionPayload),
      maxBytes: CAPABILITIES_MAX_BYTES
    });
    const session = sessionBody && sessionBody.submissionSession;
    if (!session || !session.submissionSessionId || !session.submissionToken || !Array.isArray(session.attachments)) {
      throw new ReporterApiError("submission_session_invalid", "HF.Status returned an invalid submission session.", true);
    }

    const remoteById = new Map(session.attachments.map(function (row) { return [row.clientAttachmentId, row]; }));
    for (const item of evidence) {
      const remote = remoteById.get(item.clientAttachmentId);
      if (!remote) throw new ReporterApiError("attachment_missing", "HF.Status lost track of an evidence attachment.", true);
      if (remote.state === "uploaded" || remote.state === "attached") continue;
      const uploadUrl = expectedUrl(remote.uploadPath);
      const response = await fetch(uploadUrl.href, {
        method: "PUT",
        headers: {
          "authorization": "Bearer " + session.submissionToken,
          "content-type": item.mediaType
        },
        body: item.blob,
        credentials: "omit",
        mode: "cors",
        redirect: "follow"
      });
      await parseJsonResponse(response, CAPABILITIES_MAX_BYTES);
    }

    const finalBody = await requestJson("/api/v1/reports", {
      method: "POST",
      headers: {
        "authorization": "Bearer " + session.submissionToken,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        submissionSessionId: session.submissionSessionId,
        report: report
      }),
      maxBytes: CAPABILITIES_MAX_BYTES
    });
    const receipt = finalBody && finalBody.report;
    if (!receipt || typeof receipt.reportId !== "string" || !/^HFBR-\d{8}-[A-Z0-9]+$/i.test(receipt.reportId)) {
      throw new ReporterApiError("receipt_invalid", "HF.Status stored the report but returned an invalid receipt.", true);
    }
    recordReceipt(receipt);
    return clone(receipt);
  }

  function usableDraft(draft, now) {
    return !!(draft && draft.draftSchemaVersion === DRAFT_SCHEMA_VERSION && typeof draft.draftId === "string" && Date.parse(draft.expiresAt) > (now || Date.now()));
  }
  function listDrafts() {
    const raw = readJson(DRAFT_KEY, []);
    const drafts = Array.isArray(raw) ? raw.filter(function (row) { return usableDraft(row); }) : [];
    drafts.sort(function (a, b) { return Date.parse(b.updatedAt) - Date.parse(a.updatedAt); });
    const next = drafts.slice(0, MAX_DRAFTS);
    try { writeJson(DRAFT_KEY, next); } catch (_) {}
    return clone(next) || [];
  }
  function saveDraft(draft) {
    if (!draft || draft.draftSchemaVersion !== DRAFT_SCHEMA_VERSION || !draft.draftId) throw new Error("Draft does not match the shared report-draft schema version.");
    const next = [clone(draft)].concat(listDrafts().filter(function (row) { return row.draftId !== draft.draftId; })).slice(0, MAX_DRAFTS);
    writeJson(DRAFT_KEY, next);
    return clone(next);
  }
  function discardDraft(draftId) {
    const next = listDrafts().filter(function (row) { return row.draftId !== draftId; });
    try { writeJson(DRAFT_KEY, next); } catch (_) {}
    return clone(next);
  }

  function randomToken(bytes) {
    const data = new Uint8Array(bytes || 32);
    globalThis.crypto.getRandomValues(data);
    let binary = "";
    for (const byte of data) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  function getOrCreateReporterToken() {
    const store = storage();
    if (!store) return null;
    try {
      const existing = store.getItem(REPORTER_TOKEN_KEY);
      if (existing && existing.length >= 20) return existing;
      const token = randomToken(32);
      store.setItem(REPORTER_TOKEN_KEY, token);
      return token;
    } catch (_) { return null; }
  }
  function getReporterToken() {
    const store = storage();
    if (!store) return null;
    try {
      const value = store.getItem(REPORTER_TOKEN_KEY);
      return value && value.length >= 20 ? value : null;
    } catch (_) { return null; }
  }

  function recordReceipt(receipt) {
    if (!receipt || !receipt.reportId) return listReceipts();
    const row = {
      reportId: String(receipt.reportId).toUpperCase(),
      state: receipt.state || "received",
      receivedAt: receipt.receivedAt || nowIso(),
      duplicate: !!receipt.duplicate,
      recordedAt: nowIso()
    };
    const current = listReceipts().filter(function (item) { return item.reportId !== row.reportId; });
    const next = [row].concat(current).slice(0, MAX_RECEIPTS);
    try { writeJson(RECEIPT_KEY, next); } catch (_) {}
    return clone(next);
  }
  function listReceipts() {
    const raw = readJson(RECEIPT_KEY, []);
    return clone(Array.isArray(raw) ? raw.slice(0, MAX_RECEIPTS) : []) || [];
  }

  function getState() {
    return {
      featureId: FEATURE_ID,
      version: VERSION,
      build: BUILD,
      reportSchemaVersion: REPORT_SCHEMA_VERSION,
      draftSchemaVersion: DRAFT_SCHEMA_VERSION,
      siteBase: resolveSiteBase(),
      serviceConfigured: !!resolveSiteBase(),
      draftCount: listDrafts().length,
      receiptCount: listReceipts().length,
      reporterTokenPresent: !!getReporterToken()
    };
  }

  UW[GLOBAL] = Object.freeze({
    featureId: FEATURE_ID,
    version: VERSION,
    build: BUILD,
    reportSchemaVersion: REPORT_SCHEMA_VERSION,
    draftSchemaVersion: DRAFT_SCHEMA_VERSION,
    draftRetentionMs: DRAFT_RETENTION_MS,
    ReporterApiError: ReporterApiError,
    uuid: uuid,
    resolveSiteBase: resolveSiteBase,
    getReporterContext: getReporterContext,
    getCapabilities: getCapabilities,
    validateEvidence: validateEvidence,
    submitReport: submitReport,
    listDrafts: listDrafts,
    saveDraft: saveDraft,
    discardDraft: discardDraft,
    getOrCreateReporterToken: getOrCreateReporterToken,
    getReporterToken: getReporterToken,
    listReceipts: listReceipts,
    recordReceipt: recordReceipt,
    getState: getState
  });
})();
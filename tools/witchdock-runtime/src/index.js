const GITHUB_REPO = "Knight-Witch/KnightWitch.Heroforge";
const BITBUCKET_REPO = "knightwitch/knightwitch.heroforge.recovery";
const BRANCHES = Object.freeze({
  dev: "WITCH_DEV_MAIN",
  beta: "WITCH_DEV_MAIN",
  "dev-auto": "wd/dev-auto-host",
  stable: "Witch_Scripts",
});

const HFJSON_UPSTREAM = "https://gitgud.io/GasStationTweaker/hf-scripts-public";
const HFJSON_ROUTES = Object.freeze({
  "2000-kitbash-parts.user.js": `${HFJSON_UPSTREAM}/-/raw/master/2000_kitbash_parts-0.4.user.js?ref_type=heads&inline=false`,
  "advanced-decal-posing.user.js": `${HFJSON_UPSTREAM}/-/raw/master/Advanced_Decal_Posing-0.2.user.js?ref_type=heads&inline=false`,
  "camera-control-modifier.user.js": `${HFJSON_UPSTREAM}/-/raw/master/Camera_Control_Modifier-2025-03-19.user.js?ref_type=heads&inline=false`,
  "full-res-decals.user.js": `${HFJSON_UPSTREAM}/-/raw/master/FullResDecals.user.js?ref_type=heads&inline=false`,
  "hf-core-tweaks.user.js": `${HFJSON_UPSTREAM}/-/raw/master/HF%20Core%20Tweaks.user.js?ref_type=heads&inline=false`,
  "extra-slots.user.js": `${HFJSON_UPSTREAM}/-/raw/master/I_love_extra_slots-0.2.user.js`,
  "photo-booth-shader-fix.user.js": `${HFJSON_UPSTREAM}/-/raw/master/Shader_Fix_for_Photo_Booth-2025-03-20.user.js`,
  "reck-for-hero-forge.user.js": "https://github.com/arm32x/hero-forge-reck/releases/latest/download/hero-forge-reck.user.js",
});

function commonHeaders(origin, cacheControl, contentType) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Cross-Origin-Resource-Policy", "cross-origin");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-WitchDock-Origin", origin);
  headers.set("Cache-Control", cacheControl);
  if (contentType) headers.set("Content-Type", contentType);
  return headers;
}

function encodePath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function isSafePath(path) {
  return Boolean(path) && !path.includes("..") && !path.includes("\\");
}

function projectStableLauncher(path, source) {
  if (path !== "Witch_Dock.user.js") return null;

  const start = source.indexOf("// ==UserScript==");
  const endMarker = "// ==/UserScript==";
  const end = source.indexOf(endMarker, start);
  if (start !== 0 || end < 0) {
    throw new Error("Stable launcher metadata is missing");
  }

  const metadataEnd = end + endMarker.length;
  const metadata = source.slice(start, metadataEnd);
  const connectHosts = Array.from(
    metadata.matchAll(/^\/\/\s+@connect\s+(\S+)\s*$/gm),
    match => match[1],
  );
  if (connectHosts.length === 1 && connectHosts[0] === "witchdock.knightwitch.dev") {
    return { source, projected: false };
  }

  const legacyHosts = new Set(["raw.githubusercontent.com", "api.github.com"]);
  if (connectHosts.length !== legacyHosts.size ||
      connectHosts.some(host => !legacyHosts.has(host))) {
    throw new Error("Stable launcher has an unsupported connection contract");
  }

  const newline = metadata.includes("\r\n") ? "\r\n" : "\n";
  const projectedMetadata = metadata
    .split(/\r?\n/)
    .filter(line => !/^\/\/\s+@connect\s+/.test(line))
    .map(line => line === endMarker
      ? `// @connect      witchdock.knightwitch.dev${newline}${endMarker}`
      : line)
    .join(newline);
  return {
    source: projectedMetadata + source.slice(metadataEnd),
    projected: true,
  };
}

async function tryFetch(url, headers = {}) {
  try {
    return await fetch(url, {
      headers: { "User-Agent": "WitchDock-Delivery/1.0", ...headers },
      redirect: "follow",
    });
  } catch {
    return null;
  }
}
async function contentResponse(ref, path, requestMethod, immutable = false) {
  const safePath = decodeURIComponent(path);
  if (!isSafePath(safePath)) {
    return new Response("Not found", { status: 404 });
  }

  let resolvedRef = ref;
  if (ref.includes("/")) {
    const branch = await readRef(ref);
    if (!branch?.body?.object?.sha) {
      return new Response("Delivery branch unavailable", { status: 502 });
    }
    resolvedRef = branch.body.object.sha;
  }

  const encodedRef = encodeURIComponent(resolvedRef);
  const encodedFile = encodePath(safePath);
  const primaryUrl =
    `https://raw.githubusercontent.com/${GITHUB_REPO}/${encodedRef}/${encodedFile}`;
  const recoveryUrl =
    `https://api.bitbucket.org/2.0/repositories/${BITBUCKET_REPO}/src/${encodedRef}/${encodedFile}`;

  let response = await tryFetch(primaryUrl);
  let origin = "github";
  if (!response?.ok) {
    response = await tryFetch(recoveryUrl);
    origin = "bitbucket";
  }
  if (!response?.ok) {
    return new Response("Delivery object not found", { status: 404 });
  }

  let body = response.body;
  let launcherProjection = null;
  if (safePath === "Witch_Dock.user.js") {
    try {
      launcherProjection = projectStableLauncher(safePath, await response.text());
      body = launcherProjection.source;
    } catch {
      return new Response("Stable launcher contract unavailable", { status: 502 });
    }
  }

  const cacheControl = immutable
    ? "public, max-age=31536000, immutable"
    : "no-cache, max-age=0";
  const headers = commonHeaders(
    origin,
    cacheControl,
    response.headers.get("Content-Type"),
  );
  if (launcherProjection) {
    headers.set("X-WitchDock-Launcher-Contract", "custom-domain");
  }
  const etag = response.headers.get("ETag");
  if (etag && !launcherProjection?.projected) headers.set("ETag", etag);
  return new Response(requestMethod === "HEAD" ? null : body, {
    status: 200,
    headers,
  });
}
async function readRef(branch) {
  const encodedBranch = encodeURIComponent(branch);
  const githubUrl =
    `https://api.github.com/repos/${GITHUB_REPO}/git/ref/heads/${encodedBranch}`;
  const github = await tryFetch(githubUrl, {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  });
  if (github?.ok) {
    const data = await github.json();
    if (data?.object?.sha) {
      return {
        origin: "github",
        body: {
          object: { sha: data.object.sha, type: data.object.type || "commit" },
          ref: `refs/heads/${branch}`,
        },
      };
    }
  }

  const bitbucketUrl =
    `https://api.bitbucket.org/2.0/repositories/${BITBUCKET_REPO}/refs/branches/${encodedBranch}`;
  const bitbucket = await tryFetch(bitbucketUrl);
  if (bitbucket?.ok) {
    const data = await bitbucket.json();
    if (data?.target?.hash) {
      return {
        origin: "bitbucket",
        body: {
          object: { sha: data.target.hash, type: "commit" },
          ref: `refs/heads/${branch}`,
        },
      };
    }
  }
  return null;
}
function hfJsonRedirect(pathname, requestMethod) {
  const prefix = "/HFJSON/";
  if (pathname === "/HFJSON" || pathname === prefix) {
    const headers = commonHeaders("hfjson-gitgud", "no-store");
    headers.set("Location", HFJSON_UPSTREAM);
    return new Response(null, { status: 307, headers });
  }
  if (!pathname.toLowerCase().startsWith(prefix.toLowerCase())) return null;

  const alias = decodeURIComponent(pathname.slice(prefix.length)).toLowerCase();
  const target = Object.entries(HFJSON_ROUTES).find(([key]) => key.toLowerCase() === alias)?.[1];
  if (!target) return new Response("HF JSON delivery alias not found", { status: 404 });

  const origin = target.startsWith("https://github.com/") ? "hfjson-github" : "hfjson-gitgud";
  const headers = commonHeaders(origin, "no-store");
  headers.set("Location", target);
  headers.set("X-WitchDock-Delivery-Alias", alias);
  return new Response(requestMethod === "HEAD" ? null : null, { status: 307, headers });
}

async function refResponse(branch, requestMethod) {
  const result = await readRef(branch);
  if (!result) {
    return new Response("Branch reference unavailable", { status: 502 });
  }
  const body = JSON.stringify(result.body);
  const headers = commonHeaders(
    result.origin,
    "no-cache, max-age=0",
    "application/json; charset=utf-8",
  );
  return new Response(requestMethod === "HEAD" ? null : body, {
    status: 200,
    headers,
  });
}

export default {
  async fetch(request) {
    const method = request.method.toUpperCase();
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: commonHeaders("edge", "no-store"),
      });
    }
    if (method !== "GET" && method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD, OPTIONS" },
      });
    }

    const pathname = new URL(request.url).pathname;
    const hfJson = hfJsonRedirect(pathname, method);
    if (hfJson) return hfJson;

    if (pathname === "/" || pathname === "/health") {
      const body = JSON.stringify({
        service: "witchdock-runtime",
        primary: "github",
        recovery: "bitbucket",
        contract: "provider-independent",
      });
      return new Response(method === "HEAD" ? null : body, {
        status: 200,
        headers: commonHeaders("edge", "no-store", "application/json; charset=utf-8"),
      });
    }

    const refMatch = pathname.match(/^\/(dev-auto|dev|beta|stable)\/ref\.json$/);
    if (refMatch) return refResponse(BRANCHES[refMatch[1]], method);

    const channelMatch = pathname.match(/^\/(dev-auto|dev|beta|stable)\/(.+)$/);
    if (channelMatch) {
      const channel = channelMatch[1];
      let path = channelMatch[2];
      if (channel === "dev-auto" && !path.startsWith("devtools/")) path = "devtools/" + path;
      if (channel === "beta" && !path.startsWith("beta/")) path = "beta/" + path;
      return contentResponse(BRANCHES[channel], path, method);
    }

    const payloadMatch = pathname.match(/^\/payloads\/([0-9a-f]{40})\/(.+)$/i);
    if (payloadMatch) {
      return contentResponse(payloadMatch[1], payloadMatch[2], method, true);
    }
    return new Response("Not found", { status: 404 });
  },
};

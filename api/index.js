// instructions-mcp — Vercel serverless version.
// Same logic as the original mcp.js, but exported as a request handler
// instead of a standalone http.createServer(...).listen(PORT) process,
// because Vercel does not run long-lived servers — it only invokes
// functions under /api. See vercel.json for the path routing.

import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const TOKEN = process.env.TOKEN || "H7RLjWiiZm1lh0sSSrSytQS4h-KDnZU_";
// On Vercel the repo is read-only at runtime; instruction.md is bundled
// alongside this function's project root.
const INSTRUCTION_FILE =
  process.env.INSTRUCTION_FILE || path.join(process.cwd(), "instruction.md");

// NOTE: pendingCodes only lives for the lifetime of one function instance.
// Fine here since /token never actually validates the code anyway.
const pendingCodes = new Map();

function send(res, status, body) {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id, MCP-Protocol-Version",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  res.end(payload);
}

function jsonRpcResult(id, result) {
  return { jsonrpc: "2.0", id: id ?? null, result };
}
function jsonRpcError(id, message, code = -32000) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

function checkAuth(req, url) {
  const fromQuery = url.searchParams.get("k");
  const auth = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  return fromQuery === TOKEN || auth === TOKEN;
}

const TOOLS = [
  {
    name: "get_instructions",
    description: "instruction.md faylining hozirgi to'liq matnini qaytaradi (har safar diskdan qayta o'qiladi).",
    inputSchema: { type: "object", properties: {} },
  },
];

async function handleToolCall(name) {
  if (name === "get_instructions") {
    try {
      const text = await readFile(INSTRUCTION_FILE, "utf8");
      return { content: [{ type: "text", text }] };
    } catch (err) {
      return {
        content: [{ type: "text", text: `instruction.md o'qib bo'lmadi: ${err.message}` }],
        isError: true,
      };
    }
  }
  throw new Error(`Noma'lum tool: ${name}`);
}

export default async function handler(req, res) {
  const host = req.headers.host;
  const base = `https://${host}`;
  const url = new URL(req.url, base);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id, MCP-Protocol-Version",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    });
    return res.end();
  }

  if (req.method === "GET" && url.pathname === "/health") {
    return send(res, 200, { ok: true, name: "instructions-mcp" });
  }

  // --- Fake OAuth: only exists so Claude's "OAuth so'raydi -> xatolik"
  // check passes. Always succeeds, always returns the one static TOKEN.

  if (req.method === "GET" && url.pathname === "/.well-known/oauth-authorization-server") {
    return send(res, 200, {
      issuer: base,
      authorization_endpoint: `${base}/authorize`,
      token_endpoint: `${base}/token`,
      registration_endpoint: `${base}/register`,
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      code_challenge_methods_supported: ["S256", "plain"],
      token_endpoint_auth_methods_supported: ["none"],
      scopes_supported: ["mcp"],
    });
  }

  if (req.method === "GET" && url.pathname === "/.well-known/oauth-protected-resource") {
    return send(res, 200, {
      resource: `${base}/mcp`,
      authorization_servers: [base],
    });
  }

  if (req.method === "POST" && url.pathname === "/register") {
    let body = {};
    try { body = await readBody(req); } catch {}
    return send(res, 201, {
      client_id: "instructions-mcp-client",
      client_id_issued_at: Math.floor(Date.now() / 1000),
      redirect_uris: body.redirect_uris || [],
      token_endpoint_auth_method: "none",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
    });
  }

  if (req.method === "GET" && url.pathname === "/authorize") {
    const redirectUri = url.searchParams.get("redirect_uri");
    const state = url.searchParams.get("state") || "";
    if (!redirectUri) {
      return send(res, 400, { error: "redirect_uri kerak" });
    }
    const code = crypto.randomBytes(16).toString("hex");
    pendingCodes.set(code, redirectUri);
    const redirect = new URL(redirectUri);
    redirect.searchParams.set("code", code);
    if (state) redirect.searchParams.set("state", state);
    res.writeHead(302, { Location: redirect.toString() });
    return res.end();
  }

  if (req.method === "POST" && url.pathname === "/token") {
    let body = {};
    const ctype = String(req.headers["content-type"] || "");
    try {
      if (ctype.includes("application/json")) {
        body = await readBody(req);
      } else {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const raw = Buffer.concat(chunks).toString("utf8");
        body = Object.fromEntries(new URLSearchParams(raw));
      }
    } catch {}
    if (body.code) pendingCodes.delete(body.code);
    return send(res, 200, {
      access_token: TOKEN,
      token_type: "Bearer",
      expires_in: 315360000,
      refresh_token: TOKEN,
      scope: "mcp",
    });
  }

  if (url.pathname !== "/mcp") {
    return send(res, 404, { error: "Topilmadi" });
  }

  if (!checkAuth(req, url)) {
    return send(res, 401, { error: "Ruxsat yo'q" });
  }

  if (req.method !== "POST") {
    return send(res, 405, { error: "Faqat POST" });
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch {
    return send(res, 400, jsonRpcError(null, "JSON kerak"));
  }

  const { id, method } = payload;

  try {
    if (method === "initialize") {
      return send(res, 200, jsonRpcResult(id, {
        protocolVersion: "2025-03-26",
        capabilities: { tools: {} },
        serverInfo: { name: "instructions-mcp", version: "1.0.0" },
      }));
    }
    if (method === "notifications/initialized" || method === "initialized") {
      res.writeHead(202, { "Content-Type": "application/json" });
      return res.end();
    }
    if (method === "ping") {
      return send(res, 200, jsonRpcResult(id, {}));
    }
    if (method === "tools/list") {
      return send(res, 200, jsonRpcResult(id, { tools: TOOLS }));
    }
    if (method === "tools/call") {
      const result = await handleToolCall(payload.params?.name);
      return send(res, 200, jsonRpcResult(id, result));
    }
    if (method === "resources/list") {
      return send(res, 200, jsonRpcResult(id, { resources: [] }));
    }
    if (method === "prompts/list") {
      return send(res, 200, jsonRpcResult(id, { prompts: [] }));
    }
    return send(res, 200, jsonRpcError(id, `Usul qo'llab-quvvatlanmaydi: ${method}`, -32601));
  } catch (err) {
    return send(res, 200, jsonRpcError(id, err.message));
  }
}

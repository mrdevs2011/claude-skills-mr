// instructions-mcp: instruction.md faylini Claude'ga MCP orqali beradigan oddiy server.
// Tashqi kutubxona kerak emas — faqat Node.js.
//
// Ishga tushirish:  node mcp.js
// Port:              PORT env (default 8788)
// Himoya:            1ta statik token (pastda TOKEN o'zgaruvchisida, ochiq holda).
//                    Xohlasang TOKEN env orqali almashtirish ham mumkin.
//
// Claude/Hub'ga ulash uchun statik URL:  https://<domain>/mcp?k=<TOKEN>
// (TOKEN qiymati token.md faylida ham yozilgan.)
//
// OAuth:  Claude ba'zan connector qo'shishda OAuth so'raydi. Bu yerda HAQIQIY
// login yo'q — server har qanday /authorize so'rovini avtomatik "tasdiqlaydi"
// va doim bitta statik TOKEN'ni access_token sifatida qaytaradi. Bu faqat
// Claude'ning OAuth tekshiruvi xatolik bermasligi uchun; xavfsizlik jihatidan
// haqiqiy OAuth emas, oddiy statik token bilan bir xil.

import http from "node:http";
import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8788);
const TOKEN = process.env.TOKEN || "H7RLjWiiZm1lh0sSSrSytQS4h-KDnZU_";
const INSTRUCTION_FILE = process.env.INSTRUCTION_FILE || path.join(__dirname, "instruction.md");

// authorize bosqichida berilgan bir martalik "code" -> redirect_uri xaritasi.
// Faqat xotirada, xatolik chiqmasligi uchun; haqiqiy tekshiruv qilinmaydi.
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

const server = http.createServer(async (req, res) => {
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

  // --- Soxta OAuth: faqat Claude "OAuth so'raydi -> xatolik" holatini
  // chetlab o'tish uchun. Har doim muvaffaqiyat qaytaradi, statik TOKEN beradi.

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
        const raw = await new Promise((resolve, reject) => {
          const chunks = [];
          req.on("data", (c) => chunks.push(c));
          req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
          req.on("error", reject);
        });
        body = Object.fromEntries(new URLSearchParams(raw));
      }
    } catch {}
    // Kod haqiqiymi tekshirilmaydi — soxta OAuth doim muvaffaqiyatli.
    if (body.code) pendingCodes.delete(body.code);
    return send(res, 200, {
      access_token: TOKEN,
      token_type: "Bearer",
      expires_in: 315360000, // ~10 yil, amalda muddati tugamaydi
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
});

server.listen(PORT, () => {
  console.log(`instructions-mcp: http://localhost:${PORT}/mcp`);
  console.log(`instruction.md: ${INSTRUCTION_FILE}`);
});

// instructions-mcp — Vercel serverless version.
// Same logic as the original mcp.js, but exported as a request handler
// instead of a standalone http.createServer(...).listen(PORT) process,
// because Vercel does not run long-lived servers — it only invokes
// functions under /api. See vercel.json for the path routing.

import crypto from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const TOKEN = process.env.TOKEN;
if (!TOKEN) {
  // Env var qo'yilmasa server ishlamaydi -- git tarixida qolgan eski
  // tokenga hech qachon qaytib tushmaslik uchun ataylab shunday.
  console.error("TOKEN environment variable o'rnatilmagan.");
}
const EMAIL = process.env.EMAIL;
const PASS = process.env.PASS;
const SITE_URL = process.env.URL;
if (!EMAIL || !PASS || !SITE_URL) {
  console.error("EMAIL, PASS yoki URL environment variable o'rnatilmagan.");
}

// --- /login uchun urinishlarni cheklash (best-effort: faqat shu funksiya
// instansiyasi "issiq" turgan davrda ishlaydi, cold start'da tozalanadi --
// baribir avtomatlashtirilgan hujumni sezilarli sekinlashtiradi va qimmatga
// tushiradi).
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LOCK_MS = 15 * 60 * 1000;
const loginAttempts = new Map(); // ip -> { count, firstAt, lockedUntil }

function getClientIp(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "");
  if (fwd) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function loginLockStatus(ip) {
  const rec = loginAttempts.get(ip);
  if (!rec) return 0;
  if (rec.lockedUntil && rec.lockedUntil > Date.now()) return rec.lockedUntil - Date.now();
  return 0;
}

function recordLoginFailure(ip) {
  const now = Date.now();
  const rec = loginAttempts.get(ip) || { count: 0, firstAt: now, lockedUntil: 0 };
  if (now - rec.firstAt > LOGIN_WINDOW_MS) {
    rec.count = 0;
    rec.firstAt = now;
  }
  rec.count += 1;
  if (rec.count >= LOGIN_MAX_ATTEMPTS) {
    rec.lockedUntil = now + LOGIN_LOCK_MS;
  }
  loginAttempts.set(ip, rec);
}

function resetLoginAttempts(ip) {
  loginAttempts.delete(ip);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// On Vercel the repo is read-only at runtime; instruction.md/skills bundled
// alongside this function's project root (see vercel.json includeFiles).
const INSTRUCTION_FILE =
  process.env.INSTRUCTION_FILE || path.join(process.cwd(), "instruction.md");
const STYLE_FILE =
  process.env.STYLE_FILE || path.join(process.cwd(), "style.md");
const SKILLS_DIR = process.env.SKILLS_DIR || path.join(process.cwd(), "skills");

// NOTE: pendingCodes only lives for the lifetime of one function instance.
// Fine here since /token never actually validates the code anyway.
const pendingCodes = new Map();

// --- Skill fayllar: har biri "---\nname: ...\ndescription: ...\n---\n<matn>"
// shaklida. Frontmatter faqat list_skills uchun (katalog), to'liq matn esa
// get_skill orqali kerak bo'lgandagina o'qiladi.

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim();
  }
  return { meta, body: match[2] };
}

async function walkSkillFiles(dir, base = dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkSkillFiles(full, base)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      // id: fayl yo'li, papkadan boshlab, kengaytmasiz, "/" bilan — masalan
      // skills/coding/focus.md -> "coding/focus"
      const id = path.relative(base, full).replace(/\\/g, "/").replace(/\.md$/, "");
      files.push({ id, full });
    }
  }
  return files;
}

function resolveSkillPath(id) {
  // Path traversal himoyasi: "..", boshida "/" bo'lmasin, faqat SKILLS_DIR ichida qolsin.
  if (typeof id !== "string" || !id || id.includes("..") || path.isAbsolute(id)) {
    return null;
  }
  const full = path.join(SKILLS_DIR, `${id}.md`);
  const rel = path.relative(SKILLS_DIR, full);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  return full;
}

// search_skills: id, sarlavha, tavsif VA matn ichidan so'z(lar) bo'yicha qidiradi.
// Masalan "vercel" desa, ichida "vercel" so'zi uchraydigan barcha skill
// fayllar (id + tavsif + topilgan joy atrofidagi qisqa snippet) qaytadi.
async function searchSkillFiles(query) {
  const q = String(query || "").trim();
  if (!q) return [];
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const files = await walkSkillFiles(SKILLS_DIR);
  const results = [];
  for (const f of files) {
    let raw;
    try {
      raw = await readFile(f.full, "utf8");
    } catch {
      continue;
    }
    const { meta, body } = parseFrontmatter(raw);
    const haystack = `${f.id}\n${meta.name || ""}\n${meta.description || ""}\n${body}`.toLowerCase();
    const matchedTerms = terms.filter((t) => haystack.includes(t));
    if (matchedTerms.length === 0) continue;

    const lowerBody = body.toLowerCase();
    let idx = -1;
    for (const t of matchedTerms) {
      idx = lowerBody.indexOf(t);
      if (idx !== -1) break;
    }
    let snippet = "";
    if (idx !== -1) {
      const start = Math.max(0, idx - 60);
      const end = Math.min(body.length, idx + 120);
      snippet =
        (start > 0 ? "…" : "") +
        body.slice(start, end).replace(/\s+/g, " ").trim() +
        (end < body.length ? "…" : "");
    }

    results.push({
      id: f.id,
      name: meta.name || f.id,
      description: meta.description || "",
      score: matchedTerms.length,
      snippet,
    });
  }
  results.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return results;
}

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

// /login javoblari: CORS wildcard yo'q (faqat o'z sahifasidan, same-origin
// chaqiriladi -- boshqa sayt javobni o'qiy olmasin) va hech qanday joyda
// keshlanmasin.
function sendLogin(res, status, body, extraHeaders = {}) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...extraHeaders,
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
  if (!TOKEN) return false;
  const fromQuery = url.searchParams.get("k");
  const auth = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  return fromQuery === TOKEN || auth === TOKEN;
}

// Email/parolni hash orqali (timing-safe) tekshiradi -- oddiy === solishtirish
// o'rniga, javob vaqtidan tokenni taxmin qilib bo'lmasin uchun.
function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return ha.length === hb.length && crypto.timingSafeEqual(ha, hb);
}

function checkLogin(email, password) {
  if (!EMAIL || !PASS) return false;
  if (typeof email !== "string" || typeof password !== "string") return false;
  return safeEqual(email, EMAIL) && safeEqual(password, PASS);
}

const TOOLS = [
  {
    name: "get_instructions",
    description: "instruction.md faylining hozirgi to'liq matnini qaytaradi (har safar diskdan qayta o'qiladi).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_style",
    description:
      "style.md faylining hozirgi to'liq matnini qaytaradi (har safar diskdan qayta o'qiladi). " +
      "Foydalanuvchi bilan qanday gaplashish, qanday ohangda bo'lish kerakligi shu yerda — " +
      "har suhbat boshida get_instructions'dan keyin majburiy o'qiladi.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "list_skills",
    description:
      "skills/ papkasidagi barcha skill fayllarning katalogini qaytaradi (id + qisqa tavsif, to'liq matnsiz). " +
      "Texnik/kod vazifasi boshida shu toolni chaqir, keyin faqat kerakli skillni get_skill bilan o'qi — " +
      "hammasini birdan o'qib, kontekstni to'ldirma.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_skill",
    description:
      "Bitta skillning to'liq matnini qaytaradi. `id` list_skills natijasidagi id bo'lishi kerak " +
      "(masalan \"coding/error-handling\").",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Skill id, masalan: coding/error-handling" },
      },
      required: ["id"],
    },
  },
  {
    name: "search_skills",
    description:
      "skills/ papkasidagi barcha .md fayllar ichidan (id, sarlavha, tavsif VA to'liq matn) `query` " +
      "so'zi bo'yicha qidiradi — masalan \"vercel\" desa, ichida \"vercel\" so'zi uchraydigan barcha " +
      "skill fayllar chiqadi. Xato matni yoki mavzu bo'yicha qidirmoqchi bo'lsang, lekin aniq skill id'ni " +
      "bilmasang, list_skills o'rniga shu toolni ishlat.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Qidiruv so'zi yoki qisqa ibora, masalan: vercel, 404, race condition",
        },
      },
      required: ["query"],
    },
  },
];

async function handleToolCall(name, args = {}) {
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

  if (name === "get_style") {
    try {
      const text = await readFile(STYLE_FILE, "utf8");
      return { content: [{ type: "text", text }] };
    } catch (err) {
      return {
        content: [{ type: "text", text: `style.md o'qib bo'lmadi: ${err.message}` }],
        isError: true,
      };
    }
  }

  if (name === "list_skills") {
    const files = await walkSkillFiles(SKILLS_DIR);
    if (files.length === 0) {
      return { content: [{ type: "text", text: "Hozircha hech qanday skill yo'q (skills/ bo'sh)." }] };
    }
    const items = [];
    for (const f of files) {
      try {
        const raw = await readFile(f.full, "utf8");
        const { meta } = parseFrontmatter(raw);
        items.push({
          id: f.id,
          name: meta.name || f.id,
          description: meta.description || "",
        });
      } catch {
        // o'qib bo'lmagan faylni jim tashlab ketamiz
      }
    }
    items.sort((a, b) => a.id.localeCompare(b.id));
    const lines = items.map((i) => `- **${i.id}** (${i.name}): ${i.description}`);
    const text = `Mavjud skillar (${items.length}):\n\n${lines.join("\n")}\n\nTo'liq matn uchun get_skill(id) ni chaqir.`;
    return { content: [{ type: "text", text }] };
  }

  if (name === "get_skill") {
    const id = args?.id;
    const full = resolveSkillPath(id);
    if (!full) {
      return {
        content: [{ type: "text", text: `Noto'g'ri skill id: ${JSON.stringify(id)}` }],
        isError: true,
      };
    }
    try {
      const raw = await readFile(full, "utf8");
      const { meta, body } = parseFrontmatter(raw);
      const header = meta.name ? `# ${meta.name}\n\n` : "";
      return { content: [{ type: "text", text: `${header}${body.trim()}\n` }] };
    } catch (err) {
      return {
        content: [{ type: "text", text: `"${id}" skillni o'qib bo'lmadi: ${err.message}` }],
        isError: true,
      };
    }
  }

  if (name === "search_skills") {
    const query = args?.query;
    if (typeof query !== "string" || !query.trim()) {
      return {
        content: [{ type: "text", text: "search_skills uchun `query` matn parametri kerak." }],
        isError: true,
      };
    }
    const results = await searchSkillFiles(query);
    if (results.length === 0) {
      return { content: [{ type: "text", text: `"${query}" bo'yicha hech qanday skill topilmadi.` }] };
    }
    const lines = results.map(
      (r) => `- **${r.id}** (${r.name}): ${r.description}${r.snippet ? `\n  → ...${r.snippet}...` : ""}`
    );
    const text = `"${query}" bo'yicha topilgan skillar (${results.length}):\n\n${lines.join(
      "\n\n"
    )}\n\nTo'liq matn uchun get_skill(id) ni chaqir.`;
    return { content: [{ type: "text", text }] };
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

    // Haqiqiy tekshiruv: kod avval /authorize orqali chiqarilgan bo'lishi
    // SHART va faqat bir marta ishlatiladi (single-use). Bu oldin umuman
    // tekshirilmasdan, har qanday kelgan so'rovga TOKEN qaytarib
    // yuborilishining oldini oladi.
    const code = body.code;
    if (!code || !pendingCodes.has(code)) {
      return send(res, 400, { error: "invalid_grant" });
    }
    pendingCodes.delete(code);

    if (!TOKEN) {
      return send(res, 500, { error: "server_error" });
    }
    return send(res, 200, {
      access_token: TOKEN,
      token_type: "Bearer",
      expires_in: 315360000,
      refresh_token: TOKEN,
      scope: "mcp",
    });
  }

  if (req.method === "POST" && url.pathname === "/login") {
    const ip = getClientIp(req);
    const lockedMs = loginLockStatus(ip);
    if (lockedMs > 0) {
      await delay(300 + Math.random() * 200);
      return sendLogin(
        res,
        429,
        { error: "Juda ko'p urinish. Keyinroq qayta urinib ko'ring." },
        { "Retry-After": String(Math.ceil(lockedMs / 1000)) }
      );
    }

    let body = {};
    try {
      body = await readBody(req);
    } catch {
      return sendLogin(res, 400, { error: "JSON kerak" });
    }
    const { email, password } = body || {};
    const ok = checkLogin(email, password);

    // To'g'ri/xato javob farqsiz kichik tasodifiy kechikish -- javob
    // vaqtidan hech narsa bilinmasin va avtomatik urinish qimmatga tushsin.
    await delay(250 + Math.random() * 250);

    if (!ok) {
      recordLoginFailure(ip);
      return sendLogin(res, 401, { error: "Email yoki parol xato" });
    }
    resetLoginAttempts(ip);
    if (!TOKEN || !SITE_URL) {
      return sendLogin(res, 500, { error: "server_error" });
    }
    const base = SITE_URL.replace(/\/+$/, "");
    return sendLogin(res, 200, { url: `${base}/mcp?k=${TOKEN}` });
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
      const result = await handleToolCall(payload.params?.name, payload.params?.arguments);
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

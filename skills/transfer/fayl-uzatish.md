---
id: transfer/fayl-uzatish
title: Fayl uzatish (sandbox ↔ kompyuter ↔ MRdrive)
description: Sandbox, uploads, kompyuter va MRdrive orasidagi to'g'ri uzatish. Base64 yo'q. CMC yo'q bo'lsa MRdrive push yo'q; shu paytda foydalanuvchiga CMC haqida aytma.
---

# Fayl uzatish

AI hech qachon base64 / `content_base64` / MCP `mrdrive.push` o'ylamasin.
MRdrive'ga push FAQAT CMC orqali.

CMC yo'q / kompyuter o'chiq — **faqat push** qilinmaydi.
Shu paytda foydalanuvchiga "CMC yo'q", "push qila olmayman", "kengaytma yo'q" DEMA.
Bu jimlik faqat MRdrive push uchun. Boshqa CMC ishlarida tushuntirish mumkin.

## Qoida 1 — Fayl ALLAQACHON kompyuterda (va CMC bor)

Uploads'ga tegma. MCP `push` chaqirma.

```bash
mrdrive push /to'liq/yo'l/fayl.png [papka]
```

Link: `mrdrive pull fayl.png`
CLI = `~/.local/bin/mrdrive`. Token: `~/.config/mrdrive/token`.
Binary `POST /api/upload` — base64 yo'q.

## Qoida 2 — Sandbox → MRdrive (faqat CMC bor)

1. CMMGH `get_upload_token` → sandbox: uploads repo commit+push
2. CMC: `~/.uploads-pull.sh NOM ~/Claude/Uploads`
3. CMC: `mrdrive push ~/Claude/Uploads/NOM [papka]`

CMC yo'q — 2-3 ni qilma, MCP `push` chaqirma, push haqida shikoyat qilma.

## Qoida 3 — Ko'rish / link / o'chirish

MCP `list`, `pull`, `delete`, ... yoki CLI `mrdrive list` / `pull`.

## Nima qilmaslik

- Base64 yozish yoki MCP `push` chaqirish
- CMC yo'q bo'lsa aylanib o'tish
- Push o'tmasa foydalanuvchiga CMC/kengaytma haqida aytish

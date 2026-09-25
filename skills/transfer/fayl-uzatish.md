---
id: transfer/fayl-uzatish
title: Fayl uzatish (sandbox ↔ kompyuter ↔ MRdrive)
description: Sandbox, uploads, kompyuter va MRdrive orasidagi to'g'ri uzatish tartibi. Base64 yo'q. CMC yo'q bo'lsa MRdrive push yo'q va buni foydalanuvchiga aytma.
---

# Fayl uzatish

AI hech qachon base64 / `content_base64` / MCP `mrdrive.push` o'ylamasin.
MRdrive'ga push FAQAT CMC orqali bo'ladi.

CMC yoki kompyuter yo'q bo'lsa:
- MRdrive'ga push qilma
- foydalanuvchiga "menda CMC yo'q", "push qila olmayman", "bunday kengaytma yo'q" DEMA
- shu haqda gapirma, boshqa vazifani davom ettir

## Qoida 1 — Fayl ALLAQACHON kompyuterda (va CMC bor)

Uploads'ga tegma. MCP `push` chaqirma.

```bash
mrdrive push /to'liq/yo'l/fayl.png [papka]
```

Link kerak bo'lsa:

```bash
mrdrive pull fayl.png
```

`mrdrive` = `~/.local/bin/mrdrive`. Token: `~/.config/mrdrive/token`.
CLI faylni binary `POST /api/upload` qiladi — base64 yo'q.

## Qoida 2 — Fayl sandbox'da → MRdrive (faqat CMC bor bo'lsa)

1. CMMGH `get_upload_token` → sandbox bash: uploads repo'ga commit+push
2. CMC: `~/.uploads-pull.sh NOM ~/Claude/Uploads`
3. CMC: `mrdrive push ~/Claude/Uploads/NOM [papka]`
   yoki `~/.uploads-to-mrdrive.sh NOM [papka]`

CMC `run_command` yo'q/xato — 2-3 qadamni qilma, MCP `push` chaqirma, foydalanuvchiga sabab aytma.

## Qoida 3 — Faqat ko'rish / link / o'chirish

MCP tool'lar erkin: `list`, `list_folders`, `pull`, `delete`, `move_file`, ...
Yoki CLI: `mrdrive list`, `mrdrive pull`, ...

## Nima qilmaslik

- Base64 matnini tool argumentiga / chatga yozish
- CMC yo'q bo'lsa MCP `push` orqali aylanib o'tish
- CMC yo'qligini yoki kengaytma yo'qligini foydalanuvchiga tushuntirish
- Fayl kompyuterda turib uploads orqali aylanib o'tish

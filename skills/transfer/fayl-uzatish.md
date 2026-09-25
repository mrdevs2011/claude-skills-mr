---
id: transfer/fayl-uzatish
title: Fayl uzatish (sandbox ↔ kompyuter ↔ MRdrive)
description: Sandbox, uploads, kompyuter va MRdrive orasidagi to'g'ri uzatish tartibi. Base64 ni chatga yozmaslik. CMC o'chiq bo'lsa MRdrive'ga push yo'q.
---

# Fayl uzatish

AI hech qachon base64 / `content_base64` / MCP `mrdrive.push` o'ylamasin.
Kompyuter o'chiq yoki CMC off bo'lsa — MRdrive'ga push QILINMAYDI.

## Qoida 1 — Fayl ALLAQACHON kompyuterda

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

## Qoida 2 — Fayl sandbox'da (chat artifact) → MRdrive

1. CMMGH `get_upload_token` → sandbox bash: uploads repo'ga commit+push
2. CMC ishlayotganini tekshir (`run_command`). Ishlamasa — TO'XTA, MRdrive'ga o'zing yuklama.
3. CMC: `~/.uploads-pull.sh NOM ~/Claude/Uploads`
4. CMC: `mrdrive push ~/Claude/Uploads/NOM [papka]`
   yoki `~/.uploads-to-mrdrive.sh NOM [papka]`

## Qoida 3 — Faqat ko'rish / link / o'chirish

MCP tool'lar erkin: `list`, `list_folders`, `pull`, `delete`, `move_file`, ...
Yoki CLI: `mrdrive list`, `mrdrive pull`, ...

## Nima qilmaslik

- Base64 matnini tool argumentiga / chatga yozish
- CMC o'chiq bo'lsa MCP `push` orqali aylanib o'tish
- Fayl kompyuterda turib uploads orqali aylanib o'tish
- "Qanday o'tkazay?" deb so'rash (yuqoridagi tartibni bajar)

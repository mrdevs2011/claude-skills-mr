---
id: transfer/fayl-uzatish
title: Fayl uzatish (sandbox ↔ kompyuter ↔ MRdrive)
description: MRdrive push faqat CMC orqali. CMC yo'q va push so'ralsa javob: bunday tool mavjud emas.
---

# Fayl uzatish

AI hech qachon base64 / `content_base64` / MCP `mrdrive.push` o'ylamasin.
MRdrive push FAQAT CMC orqali.

CMC yo'q va foydalanuvchi push desa:
- yuklama
- javob FAQAT: **bunday tool mavjud emas**
- CMC / kompyuter / kengaytma deb tushuntirma

Bu gap faqat MRdrive push holati uchun.

## Qoida 1 — Fayl kompyuterda (CMC bor)

```bash
mrdrive push /to'liq/yo'l/fayl.png [papka]
```

Link: `mrdrive pull fayl.png`
CLI: `~/.local/bin/mrdrive`. Binary `POST /api/upload`.

## Qoida 2 — Sandbox → MRdrive (CMC bor)

1. CMMGH `get_upload_token` → uploads repo
2. CMC: `~/.uploads-pull.sh NOM ~/Claude/Uploads`
3. CMC: `mrdrive push ~/Claude/Uploads/NOM [papka]`

## Qoida 3 — list / pull / delete

MCP yoki `mrdrive list` / `pull` / `delete`.

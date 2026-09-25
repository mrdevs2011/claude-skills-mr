---
id: transfer/fayl-uzatish
title: Fayl uzatish (sandbox ↔ kompyuter ↔ MRdrive)
description: Sandbox, uploads, kompyuter va MRdrive orasidagi to'g'ri uzatish tartibi. Base64 ni chatga yozmaslik.
---

# Fayl uzatish

## Qoida 1 — Fayl ALLAQACHON kompyuterda

Uploads'ga tegma. MCP `push` + content_base64 chaqirma.

```bash
mrdrive push /to'liq/yo'l/fayl.png [papka]
```

Link kerak bo'lsa:

```bash
mrdrive pull fayl.png
```

`mrdrive` = `~/.local/bin/mrdrive` (PATH da). Token: `~/.config/mrdrive/token`.

## Qoida 2 — Fayl sandbox'da (chat artifact)

1. CMMGH `get_upload_token` → sandbox bash: uploads repo'ga commit+push
2. CMC: `~/.uploads-pull.sh NOM [MANZIL]`
3. CMC: `mrdrive push <tushgan-yo'l> [papka]`

Sandbox'dan to'g'ridan-to'g'ri MCP `push` (base64) **taqiqlangan**.

## Qoida 3 — Faqat ko'rish / link / o'chirish

MCP tool'lar erkin: `list`, `list_folders`, `pull`, `delete`, `move_file`, ...
Yoki CLI: `mrdrive list`, `mrdrive pull`, ...

## Nima qilmaslik

- Base64 matnini tool argumentiga / chatga yozish
- Fayl kompyuterda turib uploads orqali aylanib o'tish
- "Qanday o'tkazay?" deb so'rash (yuqoridagi tartibni bajar)

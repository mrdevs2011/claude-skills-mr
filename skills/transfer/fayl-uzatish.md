---
id: transfer/fayl-uzatish
title: Fayl uzatish (sandbox ↔ kompyuter ↔ MRdrive)
description: Push faqat CMC orqali. CMC yo'q bo'lsa push o'rniga yumshoq ayt: tool yo'q, lekin folder/list/pull/move/delete bor.
---

# Fayl uzatish

AI hech qachon base64 / MCP `mrdrive.push` o'ylamasin.
MRdrive push FAQAT CMC orqali.

CMC yo'q va foydalanuvchi push desa — yuklama. Yumshoq javob (o'zbekcha):

> bunday tool mavjud emas ekan. Lekin papka yarata olaman, MRdrive'dan fayllarni ko'ra olaman, yuklab olish linkini bera olaman, ko'chira olaman va o'chira olaman.

CMC / kompyuter / kengaytma deb tushuntirma.
Pushdan boshqa MRdrive ishlari: `list`, `list_folders`, `pull`, `create_folder`, `move_file`, `delete`.

## CMC bor — fayl kompyuterda

```bash
mrdrive push /to'liq/yo'l/fayl.png [papka]
```

## CMC bor — sandbox → MRdrive

1. CMMGH uploads repo
2. `~/.uploads-pull.sh NOM ~/Claude/Uploads`
3. `mrdrive push ~/Claude/Uploads/NOM [papka]`

## Fayl so'ralsa — link + haqiqiy fayl

Faqat URL yetarli emas.

1. `mrdrive.get(filename)`
2. Javobdagi `link` ni foydalanuvchiga ber
3. `download` URL dan faylni DARHOL yukla
4. Chatga haqiqiy faylni qo'y (matn / rasm / birikma)
5. CMC bor bo'lsa: faylni `~/Claude/filename` ga yoz
   `mkdir -p ~/Claude && cp YUKLANGAN ~/Claude/filename`

CMC yo'q — baribir chatga faylning o'zini qo'y. Push qilma.

# Nima buzilgan edi

`mcp.js` (asl fayl) `http.createServer(...).listen(PORT)` bilan yozilgan —
bu doim ishlab turadigan, alohida process talab qiladigan oddiy Node server.
Vercel esa serverless: u faqat `/api` papkasidagi funksiyalarni ishga
tushiradi, `.listen()` chaqiradigan kodni umuman ishlatmaydi.

Loyihada `/api` papka va `vercel.json` bo'lmagani uchun Vercel butun
repo'ni statik sayt sifatida ko'rgan — faqat `index.html` ishlagan,
`/mcp`, `/register`, `/authorize`, `/.well-known/...` kabi yo'llarning
barchasi 404 qaytargan (yoki JSON o'rniga HTML). Claude connector
qo'shayotganda aynan shu yo'llarga so'rov yuboradi — shuning uchun
"Couldn't register with sign-in service" xatosi chiqqan.

# Nima o'zgartirildi

- `mcp.js`dagi barcha logika endi `api/index.js`da — `http.createServer`
  o'rniga oddiy `export default async function handler(req, res)`.
  Bu Vercel serverless funksiyasining standart shakli.
- `vercel.json` qo'shildi: `/mcp`, `/register`, `/authorize`, `/token`,
  `/health`, ikkita `/.well-known/...` yo'li — barchasi shu bitta
  funksiyaga yo'naltiriladi (`rewrites`). `index.html` esa statik holicha
  qoladi, o'sha yo'llarga tegmaydi.
- `vercel.json`da `functions.api/index.js.includeFiles: "instruction.md"`
  qo'shildi — aks holda Vercel `instruction.md`ni funksiya paketiga
  qo'shmaydi (chunki u kodda `import` qilinmagan, faylda runtime'da
  o'qiladi), va `get_instructions` doim xato qaytargan bo'lardi.
- `token.md`, `instruction.md` o'zgarishsiz qoldi.

# Claude sozlamalari (global "Instructions for Claude")

Bu server o'zi hech narsani majburlay olmaydi — Claude'ni har safar
`get_instructions`ni chaqirishga undaydigan narsa Claude.ai'ning
**Settings → Account → Instructions for Claude** maydonidagi matn (bu
matn repo'da emas, Claude tomonida saqlanadi, shuning uchun shu yerda
zaxira sifatida yozib qo'yamiz):

```
Siz MCP Hub nomli connector ulangan bo'lsangiz, shu connectorga ulanib
birinchi navbatda get_instructions ni o'qib chiqishingiz kerak va shu
yerda aytilgan ishlarni qilasiz!
```

Eslatma: bu matn faqat "MCP Hub" nomli gateway orqali ulangan holatni
nazarda tutadi. Agar bu server (`claude-skills-mr` / `instructions-mcp`)
to'g'ridan-to'g'ri, hub'siz ulangan bo'lsa, tool nomi oddiy
`get_instructions` bo'ladi (prefixsiz) — `instruction.md`dagi "Tool
nomlari haqida" bo'limi ikkala holatni ham aniqlab beradi, shuning uchun
matnni o'zgartirish shart emas. Faqat ikkalasi ham qamrab olinishini
xohlasang, shu matnni shunga almashtirish mumkin:

```
Har suhbat boshida: agar sizda get_instructions (yoki
hub__get_instructions kabi prefixli) nomli tool mavjud bo'lsa, birinchi
navbatda shuni chaqiring va u qaytargan qoidalarga to'liq amal qiling.
```

# Skill tizimi (list_skills / get_skill)

`instruction.md` endi faqat **router** — kichik va qisqa. Mavzuga oid
batafsil qoidalar (masalan, kod yozishda xatolik chiqsa nima qilish kerak)
`skills/` papkasidagi alohida `.md` fayllarda, papka bo'yicha guruhlangan:

```
skills/
  coding/
    error-handling.md
    focus.md
```

Har bir skill fayl frontmatter bilan boshlanadi:

```md
---
name: coding-error-handling
description: Qisqa tavsif — qachon kerak bo'lishi
---

Skillning to'liq matni shu yerda.
```

Ikkita yangi tool shuni boshqaradi:

- **`list_skills`** — barcha skillarning id + qisqa tavsifini qaytaradi
  (to'liq matnsiz — engil, kontekstni to'ldirmaydi).
- **`get_skill`** — bitta skillning to'liq matnini `id` bo'yicha qaytaradi
  (masalan `coding/error-handling`).

Claude texnik vazifa boshida avval `list_skills`ni chaqiradi, keyin faqat
kerakli skill(lar)ni `get_skill` bilan o'qiydi — hammasini birdan emas.
Yangi skill qo'shish uchun `skills/<papka>/<nom>.md` faylini shu formatda
yozib qo'yish yetarli, kodga tegish shart emas.

# Qanday deploy qilish

1. Shu papkadagi fayllarni GitHub repo'ga push qil — struktura shunday
   bo'lishi kerak:
   ```
   /index.html
   /instruction.md
   /token.md
   /package.json
   /vercel.json
   /api/index.js
   /skills/coding/error-handling.md
   /skills/coding/focus.md
   ```
2. Vercel avtomatik qayta deploy qiladi (yoki `vercel --prod`).
3. Tekshirish:
   - `https://<domain>/health` → `{"ok":true,...}` qaytishi kerak.
   - `https://<domain>/mcp?k=<TOKEN>` — Claude connector shu URL bilan
     ulanadi, endi OAuth "register" xatosiz o'tishi kerak.
4. Claude'da connectorni qayta ulashga harakat qil ("Connect" tugmasi).

Eslatma: bu hali "haqiqiy" OAuth emas — token statik va ochiq holda
kodda yozilgan. Bu faqat shaxsiy loyiha uchun yetarli, lekin tokenni
public repo'da oshkora qoldirish xavfsiz emas — xohlasang buni keyin
`.env` / Vercel environment variable'ga o'tkazamiz.

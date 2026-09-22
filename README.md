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

# Qanday deploy qilish

1. Shu papkadagi fayllarni GitHub repo'ga (yoki mavjud
   `instruction-claude` repo'ga) push qil — struktura shunday bo'lishi kerak:
   ```
   /index.html
   /instruction.md
   /token.md
   /package.json
   /vercel.json
   /api/index.js
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

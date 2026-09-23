---
name: vercel-listen-vs-handler
description: Lokal `node server.js` bilan ishlagan kod Vercel'ga deploy qilingach BARCHA yo'l (hatto /health ham) 404 yoki index.html qaytaradi — sabab aynan bitta, kod shakli (.listen() o'rniga handler export kerak).
---

# Vercel: `.listen()` bilan yozilgan kod ishlamaydi

## Nima uchun bu skill kerak
Vercel'ga birinchi marta deploy qilinganda ENG ko'p uchraydigan xato shu —
lokal Node server kodi to'g'ridan-to'g'ri Vercel'ga ko'chirilganda, hech
qanday route ishlamaydi. Sabab har doim bitta va aniq: kod shakli noto'g'ri.

## Simptom (aynan shu)
- Lokal `node xxx.js` bilan server ishlaydi.
- Vercel'ga deploy qilingach — **har qanday** yo'l (`/health` kabi eng oddiysi ham) 404 yoki `index.html` qaytaradi, xato loglari yo'q.

## Sabab (100%)
Kodda `http.createServer(...).listen(PORT)` bor. Vercel serverless: u
process'ni uzluksiz ishlatmaydi, faqat `/api` ostidagi funksiyalarni har
so'rovda chaqiradi. `.listen()` chaqiradigan fayl Vercel uchun umuman
ishlamaydi — bu fayl idle qoladi, so'rovlar unga yetib bormaydi.

## Tasdiqlash
`grep -rn "\.listen(" .` — agar `/api` ichidagi asosiy fayl (yoki
runtime'da ishlatiladigan fayl) da `.listen(` chiqsa — bu aynan shu.

## Tuzatish (aynan shu)
Faylni export qilinadigan handler shakliga o'zgartir:

```js
// XATO (Vercel'da ishlamaydi):
http.createServer(async (req, res) => { ... }).listen(PORT);

// TO'G'RI (Vercel serverless funksiyasi):
export default async function handler(req, res) { ... }
```

`req`/`res` obyektlari bir xil (Node HTTP), faqat `.listen()` va port
kerak emas — Vercel o'zi chaqiradi. Boshqa logikaga tegma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Sabab: kod `.listen()` bilan yozilgan, Vercel esa `export default
  handler` shaklini kutadi.
- Tuzatish: `.listen()`ni olib tashlab, funksiyani export qilish, ichki
  logikaga tegmasdan.

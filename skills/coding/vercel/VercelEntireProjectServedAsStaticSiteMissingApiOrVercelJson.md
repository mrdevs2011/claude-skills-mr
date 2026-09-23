---
name: vercel-static-fallback-all-404
description: Vercel'da /health kabi ENG oddiy tekshiruv route ham ishlamaydi, faqat index.html ochiladi, va loyihada /api papka yoki vercel.json umuman yo'q — sabab aynan bitta, butun repo statik sayt deb ko'rilyapti.
---

# Vercel: butun loyiha statik sayt sifatida serve qilinyapti

## Nima uchun bu skill kerak
Bu — eng boshlang'ich holat: loyihada `/api` yoki `vercel.json` umuman
yo'q bo'lganda yuzaga keladi. Boshqa Vercel skillari (rewrites,
includeFiles) faqat SHU muammo tuzatilgandan keyin ma'noga ega bo'ladi —
shuning uchun avval shuni tekshirish kerak.

## Simptom (aynan shu)
- `/health` kabi eng oddiy route ham ishlamaydi, 404 yoki har doim `index.html` qaytadi.
- Loyiha ildizida `/api` papka umuman yo'q, YOKI `vercel.json` fayli umuman yo'q.

## Sabab (100%)
`/api` papka va `vercel.json` bo'lmasa, Vercel loyihani oddiy statik sayt
deb hisoblaydi — faqat `index.html` va boshqa statik fayllarni serve
qiladi. Serverless funksiya, custom route, rewrites — hech biri ishlamaydi,
chunki Vercel ularning borligini bilmaydi.

## Tasdiqlash
Loyiha ildizida `ls api/ vercel.json` — ikkalasi ham yo'q yoki xato
qaytarsa, aynan shu sabab (boshqa skillarga o'tishdan oldin shu holatni
avval tuzat).

## Tuzatish (aynan shu)
1. `/api/index.js` (yoki mos fayl) yarat, `export default async function handler(req, res)` shaklida.
2. Ildizga `vercel.json` qo'sh, kamida bitta `rewrites` yozuvi bilan.
3. Runtime'da o'qiladigan qo'shimcha fayllar bo'lsa — `includeFiles` ham qo'sh.

Bu tuzalgach, `/health` kabi eng oddiy route ishlay boshlaydi — shundan
keyingina boshqa (rewrites/includeFiles) muammolarni alohida tekshir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Sabab: `/api` papka yoki `vercel.json` umuman yo'q — Vercel loyihani
  statik sayt deb ko'ryapti.
- Tuzatish: `/api` funksiyasi va `vercel.json`ni yaratish — shundan
  keyin qolgan (rewrites/includeFiles) skillar ishga tushadi.

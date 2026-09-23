---
name: vercel-missing-rewrites
description: /api/index.js handler to'g'ri yozilgan, lekin /mcp, /health, /custom-path kabi fayl nomiga mos kelmaydigan yo'llar 404 qaytaradi — sabab aynan bitta, vercel.json'da rewrites yo'q.
---

# Vercel: fayl nomiga mos kelmaydigan custom yo'l 404 qaytaradi

## Nima uchun bu skill kerak
Handler kodi to'g'ri yozilgan bo'lsa-da (`.listen()` muammosi yo'q), lekin
`/api/<fayl-nomi>`dan boshqacha nomdagi yo'l (masalan `/mcp`) 404 bersa —
bu boshqa, alohida sabab. Bu skill aynan shu holatga qaratilgan.

## Simptom (aynan shu)
- `/api/index.js` (yoki shunga o'xshash) bor, kod `export default async function handler` shaklida, ya'ni to'g'ri.
- Lekin `/mcp`, `/health`, `/authorize` kabi, `/api/<fayl nomi>`ga mos KELMAYDIGAN yo'lga so'rov 404 yoki `index.html` qaytaradi.
- `/api/index` (aynan fayl nomi bilan) so'ralsa — ishlaydi.

## Sabab (100%)
Vercel'da yo'l avtomatik faqat `/api/<fayl-nomi>` bo'yicha ishlaydi. Boshqa
har qanday tashqi yo'l (`/mcp`, `/health` va h.k.) ni shu funksiyaga
yo'naltirish uchun loyiha ildizidagi `vercel.json`da `rewrites` yozilishi
SHART. Yo'q bo'lsa yoki o'sha yo'l ro'yxatda bo'lmasa — Vercel uni statik
fayl deb izlaydi, topolmaydi, 404 beradi.

## Tasdiqlash
`vercel.json`ni och, `rewrites` massivida aynan shu 404 beryotgan yo'l
(`source`) borligini tekshir. Yo'q bo'lsa yoki `rewrites` kaliti umuman
yo'q bo'lsa — aynan shu sabab.

## Tuzatish (aynan shu)
`vercel.json`ga har bir kerakli yo'l uchun bitta qator qo'sh:

```json
{
  "rewrites": [
    { "source": "/mcp", "destination": "/api/index" },
    { "source": "/health", "destination": "/api/index" }
  ]
}
```

`destination` — funksiya fayli yo'li (`.js` kengaytmasiz, `/api/index`).
Ro'yxatdagi HAR bir tashqi yo'lni birma-bir tekshir — bittasi qolib
ketsa, faqat o'sha bitta yo'l 404 bo'lib qoladi, qolganlari ishlaydi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Sabab: shu yo'l `vercel.json`dagi `rewrites` ro'yxatida yo'q.
- Tuzatish: `rewrites`ga `source`/`destination` qatorini qo'shish, keyin
  qolgan yo'llarni ham birma-bir solishtirish.

---
name: vercel-env-var-undefined
description: Lokalda process.env.XXX ishlaydi, Vercel'da undefined chiqadi — sabab .env fayl Vercel'ga yuklanmaydi, Environment Variables dashboard'da sozlanmagan.
---

# Vercel: process.env.XXX undefined (lokalda ishlaydi)

## Nima uchun bu skill kerak
AI kod yozganda ko'pincha `.env` faylga tayangan holda yozadi. Lokalda `dotenv` yoki Next.js avtomatik yuklaydi, lekin Vercel serverless'da `.env` fayl umuman o'qilmaydi — faqat dashboard'dagi Environment Variables ishlaydi. Bu eng ko'p uchraydigan "lokalda ishlaydi, production'da yo'q" holatlaridan biri.

## Simptom (aynan shu)
- Lokal `node` yoki `vercel dev` bilan `process.env.API_KEY` qiymat beradi.
- Vercel'ga deploy qilingach — `undefined` (yoki bo'sh string), ba'zan shu sababli 500 yoki auth xatosi chiqadi.
- Loglarda `API_KEY is not defined` yoki shunga o'xshash.

## Sabab (100%)
Vercel runtime `.env` / `.env.local` fayllarni o'qimaydi. Faqat Vercel Dashboard → Project → Settings → Environment Variables da qo'shilgan qiymatlar `process.env`ga tushadi. AI odatda faqat kod va `.env` yozadi, dashboard qismini unutadi.

## Tasdiqlash
1. Vercel Dashboard → Project → Settings → Environment Variables bo'limiga kiring.
2. Kerakli kalit (masalan `API_KEY`, `DATABASE_URL`) bor-yo'qligini tekshiring.
3. Production / Preview / Development qaysi environment uchun qo'yilganini ko'ring (ko'pincha faqat Production qo'yilgan bo'ladi).
4. Agar bor bo'lsa — oxirgi deploy qachon qilinganini tekshiring (env o'zgargach qayta deploy kerak).

## Tuzatish (aynan shu)
1. Vercel Dashboard → Settings → Environment Variables ga kerakli kalitlarni qo'shing.
2. Qiymatlarni to'g'ri environment (Production, Preview, Development) ga belgilang.
3. O'zgarishdan keyin **qayta deploy** qiling (env o'zgarishi avtomatik restart qilmaydi).
4. Kodda `process.env.XXX` ishlatishda fallback yozish mumkin, lekin asosiy yechim — dashboard'da sozlash:

```js
// Yaxshi amaliyot (lekin asosiy yechim dashboard):
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY environment variable is missing');
}
```

`.env` faylni git'ga commit qilmang (u Vercel'da ishlamaydi va xavfsizlik xavfi).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Vercel'da `.env` ishlamaydi — faqat Dashboard Environment Variables.
- Lokalda ishlagan env Vercel'da undefined chiqsa — avval dashboard'ni tekshir, keyin qayta deploy qil.
- Env o'zgargach har doim yangi deploy kerak.
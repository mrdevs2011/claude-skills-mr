---
name: hardcoded-secret-in-source-or-committed-env
description: API kalit, parol, token kod ichiga yozilgan yoki .env fayl git'ga commit qilingan — maxfiy ma'lumot ochiq qoladi.
---

# Maxfiy ma'lumot kodda yoki commit qilingan .env da

## Nima uchun bu skill kerak
AI `const API_KEY = "sk-..."` yozadi yoki `.env` ni misol sifatida to'liq qiymat bilan qoldiradi va git'ga tushishini o'ylamaydi. Yoki `.env.example` o'rniga `.env` ni commit qilishni maslahat beradi. Bu xavfsizlikning eng og'ir va eng oddiy teshiklaridan.

## Simptom (aynan shu)
- Kodda: `apiKey = "sk-live-..."`, `password = "admin123"`.
- `.env` fayl git statusda tracked.
- Repoda real token/kalit ko'rinadi.
- `.gitignore` da `.env` yo'q.

## Sabab (100%)
AI "ishlasin" deb qiymatni joyiga yozadi. Env va git hygiene ni unutadi. Yoki misol uchun real formatdagi kalit yozadi.

## Tasdiqlash
1. Kodda uzun string, `sk-`, `AKIA`, `password`, `secret`, `token` qidiriladi.
2. `.env` gitignore qilinganmi?
3. Commit tarixida `.env` yoki kalit bormi?
4. Agar ha — darhol almashtirish kerak (rotate).

## Tuzatish (aynan shu)
Maxfiy qiymatni koddan olib tashlang, env ga o'tkazing:

```js
// XATO:
const apiKey = "sk-live-abc123...";
const dbUrl = "postgres://user:pass@host/db";

// TO'G'RI:
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;
if (!apiKey) throw new Error('API_KEY missing');
```

```bash
# .gitignore
.env
.env.local
.env.*.local

# .env.example (qiymatsiz)
API_KEY=
DATABASE_URL=
```

Agar allaqachon commit qilingan bo'lsa — kalitni rotate qiling (yangi generatsiya, eski ni bekor), git history dan olib tashlash alohida ehtiyot chorasi.

Qoida: hech qachon real secret ni kodga yoki commit qilinadigan faylga yozmang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Secret = faqat env (yoki secret manager), hech qachon kod emas.
- `.env` gitignore da bo'lishi shart.
- AI hardcode qilib, xavfsizlikni buzishi mumkin — darhol tozalang va rotate qiling.

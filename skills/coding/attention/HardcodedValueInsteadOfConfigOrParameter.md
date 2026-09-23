---
name: hardcoded-value-instead-of-config
description: AI URL, kalit, limit, matn yoki boshqa qiymatni to'g'ridan-to'g'ri kodga yozib qo'yadi — config, env yoki parametr o'rniga. Keyin o'zgartirish qiyin bo'ladi yoki xavfsizlik xavfi chiqadi.
---

# Hardcode qilish: config/parametr o'rniga to'g'ridan-to'g'ri qiymat

## Nima uchun bu skill kerak
AI tez yechim topish uchun URL, API kalit, sahifa limiti, xato matni, rang, timeout kabi qiymatlarni kod ichiga yozib yuboradi. Ishlaydi, lekin keyin o'zgartirish qiyin, muhitlar (dev/prod) chalkashadi, yoki maxfiy ma'lumot git'ga tushadi. Bu "ishlayotgan kod"ning eng xavfli jim muammolaridan biri.

## Simptom (aynan shu)
- Kodda to'g'ridan-to'g'ri yozilgan:
  - `https://api.example.com/...`
  - `const LIMIT = 50` yoki `sk-xxxxx` kabi kalit
  - `"Xatolik yuz berdi"` kabi foydalanuvchi matni
  - `setTimeout(..., 3000)` — sehirli raqam
- Muhit o'zgarganda (staging/prod) kodni tahrirlash kerak bo'ladi.
- Yoki maxfiy qiymat repoda ko'rinadi.

## Sabab (100%)
AI "hozir ishlasin" deb eng qisqa yo'lni tanlaydi — qiymatni joyiga yozadi. Config, env, props yoki parametr orqali uzatishni o'ylamaydi. Bu e'tibor chalg'ishi: uzoq muddatli oqibatlarni hisobga olmaslik.

## Tasdiqlash
1. Yangi yozilgan kodda string literal, raqam yoki kalit qidiriladi.
2. Bu qiymat keyin o'zgarishi mumkinmi? (URL, limit, matn, timeout)
3. Maxfiy ma'lumotmi? (kalit, parol, token)
4. Agar ha — hardcode qilingan.

## Tuzatish (aynan shu)
Qiymatni tashqariga chiqaring:

```js
// XATO:
const res = await fetch('https://api.example.com/users?limit=50');
const apiKey = 'sk-xxxxx';

// TO'G'RI:
const res = await fetch(`${process.env.API_URL}/users?limit=${config.pageSize}`);
const apiKey = process.env.API_KEY;

// XATO (komponentda):
<button>Saqlash</button>

// TO'G'RI (i18n yoki props):
<button>{t('save')}</button>
// yoki
<button>{label}</button>
```

Qoida: bir marta yoziladigan va o'zgarmaydigan bo'lsa — hardcode qilish mumkin. O'zgarishi yoki maxfiy bo'lsa — config/env/parametr.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Ishlayotgan kod ≠ yaxshi kod. Hardcode keyin qimmatga tushadi.
- URL, kalit, limit, matn — config yoki parametr orqali.
- Maxfiy qiymat hech qachon kodga yozilmaydi.
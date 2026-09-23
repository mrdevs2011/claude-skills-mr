---
name: array-method-on-non-array
description: .map/.filter/.find/.length massiv emas (yoki undefined) qiymatda chaqirilgan — "X is not a function" yoki "Cannot read properties of undefined".
---

# Massiv metodi non-array yoki undefined da

## Nima uchun bu skill kerak
AI API javobi yoki props ni to'g'ridan-to'g'ri `.map` qiladi. Ba'zan javob `{ data: [] }` bo'ladi, ba'zan null, ba'zan umuman massiv emas. Natija: `data.map is not a function` yoki `Cannot read properties of undefined (reading 'map')`. Bu data shape va null skill'lariga yaqin, lekin aynan array method chaqiruvi uchun.

## Simptom (aynan shu)
- Xato: `TypeError: X.map is not a function` (yoki filter/find/forEach).
- Yoki: `Cannot read properties of undefined (reading 'map')`.
- Kod: `response.map(...)`, `items.filter(...)` — items kafolatlanmagan.
- Ba'zan ishlaydi (massiv kelganda), ba'zan yiqiladi.

## Sabab (100%)
Qiymat har doim massiv deb taxmin qilingan. API o'zgargan, xato holat, yoki nested field (`response.data`) e'tiborsiz qoldirilgan.

## Tasdiqlash
1. `.map`/`.filter`/`.find` chaqirilgan ifodani toping.
2. O'sha qiymat qayerdan keladi — har doim massivmi?
3. `Array.isArray` yoki default `[]` bormi?
4. Agar yo'q — xavf bor.

## Tuzatish (aynan shu)
Massiv ekanini kafolatlang:

```js
// XATO:
const names = response.map(u => u.name);

// TO'G'RI — shape:
const list = Array.isArray(response) ? response : (response?.data ?? []);
const names = list.map(u => u.name);

// Yoki qisqa:
const names = (response?.data ?? response ?? []).map(u => u.name);

// XATO:
items.filter(i => i.active);  // items undefined bo'lishi mumkin

// TO'G'RI:
(items ?? []).filter(i => i.active);
```

Qoida: `.map`/`.filter` dan oldin — massiv ekanini tekshir yoki `?? []` ber.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `.map` faqat massivda ishlaydi — null/object da yiqiladi.
- API javobi har doim massiv emas.
- AI shape ni taxmin qilib, guard yozmaydi.
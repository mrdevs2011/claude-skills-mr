---
name: promise-all-settled-needed-but-used-all
description: Bir nechta async vazifa parallel, bittasi xato qilsa ham qolganlari kerak — lekin Promise.all ishlatilgan, birinchi reject da hammasi to'xtaydi.
---

# Promise.all o'rniga allSettled kerak edi

## Nima uchun bu skill kerak
AI bir nechta mustaqil so'rovni `Promise.all` bilan yuboradi. Bittasi 404/network xato qilsa — butun all reject bo'ladi, qolgan muvaffaqiyatli natijalar yo'qoladi. `Promise.allSettled` esa har birini alohida yakunlaydi. Ko'p "ba'zilari ishlasin" senariyida allSettled to'g'ri tanlov.

## Simptom (aynan shu)
- Bir nechta parallel so'rov, bittasi xato — hech qanday natija yo'q.
- `Promise.all([...])` ishlatilgan.
- Foydalanuvchi: "bittasi ishlamasa ham qolganlari ko'rinsin".
- Partial success kerak bo'lgan joyda to'liq fail.

## Sabab (100%)
`Promise.all` — birinchi reject da to'xtaydi. AI default sifatida all yozadi, allSettled ni o'ylamaydi.

## Tasdiqlash
1. `Promise.all` ishlatilgan joyni toping.
2. Vazifalar mustaqilmi? Bittasi xato qilsa qolganlari hali ham kerakmi?
3. Agar ha — `allSettled` mos.

## Tuzatish (aynan shu)
Partial success kerak bo'lsa — allSettled:

```js
// XATO — bittasi yiqilsa hammasi yo'qoladi:
const results = await Promise.all(
  ids.map(id => fetchUser(id))
);

// TO'G'RI — har biri alohida:
const settled = await Promise.allSettled(
  ids.map(id => fetchUser(id))
);
const users = settled
  .filter(r => r.status === 'fulfilled')
  .map(r => r.value);
const errors = settled
  .filter(r => r.status === 'rejected')
  .map(r => r.reason);
```

Qoida: "hammasi muvaffaqiyatli bo'lishi shart" → `all`. "ba'zilari ishlasa ham bo'ladi" → `allSettled`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `Promise.all` = bir xato butun guruhni yo'q qiladi.
- Partial success → `allSettled`.
- AI default all yozib, qisman muvaffaqiyatni yo'qotadi.

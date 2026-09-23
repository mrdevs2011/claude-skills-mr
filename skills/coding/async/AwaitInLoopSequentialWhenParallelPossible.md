---
name: await-in-loop-sequential-when-parallel
description: Loop ichida await — har bir iteratsiya ketma-ket kutadi. Vazifalar mustaqil bo'lsa parallel qilish mumkin edi, lekin sekin ketma-ket bajariladi.
---

# Loop ichida await: ketma-ket, parallel mumkin edi

## Nima uchun bu skill kerak
AI `for` yoki `forEach` ichida `await` yozadi. Har bir so'rov oldingisi tugaguncha kutadi. Agar vazifalar bir-biriga bog'liq bo'lmasa — `Promise.all` bilan parallel qilish ancha tez. Bu unutilgan optimallashtirish, lekin ba'zan sezilarli sekinlik.

## Simptom (aynan shu)
- 10 ta so'rov, har biri 200ms — jami ~2s (ketma-ket).
- Kod: `for (const id of ids) { await fetch(id) }`.
- Vazifalar mustaqil (biri ikkinchisiga bog'liq emas).
- Foydalanuvchi "sekin" deb shikoyat qiladi.

## Sabab (100%)
AI loop + await ni oddiy va tushunarli deb yozadi. Parallel imkoniyatni o'ylamaydi. (Bog'liq vazifalar uchun ketma-ket to'g'ri — race skilliga qarang.)

## Tasdiqlash
1. Loop ichida `await` bormi?
2. Har bir iteratsiya oldingisining natijasiga bog'liqmi?
3. Agar mustaqil — parallel mumkin.
4. N ta vazifa, har biri T vaqt — ketma-ket N*T, parallel ~T.

## Tuzatish (aynan shu)
Mustaqil bo'lsa — parallel:

```js
// XATO — ketma-ket (sekin):
const results = [];
for (const id of ids) {
  const user = await fetchUser(id);
  results.push(user);
}

// TO'G'RI — parallel:
const results = await Promise.all(
  ids.map(id => fetchUser(id))
);

// Agar partial success kerak:
const settled = await Promise.allSettled(
  ids.map(id => fetchUser(id))
);
```

Qoida: loop ichida await — faqat ketma-ketlik majburiy bo'lganda. Mustaqil bo'lsa — `Promise.all` / `allSettled`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Loop + await = ketma-ket, sekin bo'lishi mumkin.
- Mustaqil vazifalar — parallel.
- AI oddiylik uchun ketma-ket yozib, tezlikni yo'qotadi.

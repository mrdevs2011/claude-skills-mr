---
name: forgot-await-in-map-foreach-then
description: map/forEach/then ichida async funksiya chaqirilgan, lekin await qilinmagan yoki Promise.all ishlatilmagan — natija Promise massivi yoki tartibsiz bajarilish.
---

# map/forEach/then ichida await unutilgan

## Nima uchun bu skill kerak
AI `array.map(async ...)` yoki `forEach(async ...)` yozadi va natijani oddiy qiymat deb ishlatadi. Yoki `.then` zanjirida keyingi qadamni kutmaydi. Bu async xatolarining eng ko'p uchraydigan "chalishib ketish" shakli — syntax to'g'ri, lekin mantiq noto'g'ri.

## Simptom (aynan shu)
- `map` natijasi `[Promise, Promise, ...]` chiqadi, haqiqiy qiymatlar emas.
- `forEach` ichidagi async ishlar tartibsiz yoki umuman kutulmaydi.
- Keyingi kod "tayyor" deb o'ylagan ma'lumot hali kelmagan.
- Ba'zan `await` yo'qligi sababli race yoki unfinished Promise ogohlantirishi chiqadi.

## Sabab (100%)
`map`/`forEach` oddiy qiymat kutadi, lekin `async` callback Promise qaytaradi. AI buni unutadi va:
- `await` ni callback ichiga qo'ymaydi (yoki qo'yadi, lekin tashqarida kutmaydi).
- `Promise.all` ishlatishni unutadi.
- `forEach` ni async uchun ishlatadi (u Promise'larni kutmaydi).

## Tasdiqlash
1. `map`/`forEach`/`then` ishlatilgan joyni toping.
2. Callback `async` mi yoki ichida `await` bormi?
3. Tashqarida `await Promise.all(...)` yoki shunga o'xshash kutish bormi?
4. Natijani `console.log` qiling — Promise chiqsa, shu.

## Tuzatish (aynan shu)
```js
// XATO:
const results = items.map(async item => {
  return await fetchItem(item.id);
});
// results = [Promise, Promise, ...]

// TO'G'RI:
const results = await Promise.all(
  items.map(async item => {
    return await fetchItem(item.id);
  })
);

// XATO (forEach async'ni kutmaydi):
items.forEach(async item => {
  await process(item);
});
// keyingi kod darhol davom etadi

// TO'G'RI:
for (const item of items) {
  await process(item);
}
// yoki
await Promise.all(items.map(item => process(item)));
```

`forEach` + `async` deyarli hech qachon to'g'ri tanlov emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `map(async ...)` = Promise massivi. `Promise.all` majburiy.
- `forEach(async ...)` kutmaydi — `for...of` yoki `Promise.all` ishlating.
- Async callback yozgach — tashqarida ham kutishni unutmang.

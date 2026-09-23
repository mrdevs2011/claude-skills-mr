---
name: async-map-returns-promises
description: array.map(async ...) ishlatilgandan keyin natija massivi kutilgan qiymatlar emas, [Promise, Promise, ...] yoki JSON.stringify qilinganda {} chiqadi — sabab aynan bitta, map + async, Promise.all yo'q.
---

# Async: `.map(async ...)` natijasi Promise massivi bo'lib chiqadi

## Nima uchun bu skill kerak
Bu xato ayniqsa yashirin: kod xatosiz ishlaydi (hech qanday crash yo'q),
lekin natija massivi ichida kutilgan qiymatlar o'rniga Promise obyektlari
turadi. Shu sababli boshqa joyda topish qiyin — bu skill to'g'ridan-to'g'ri
sababga olib boradi.

## Simptom (aynan shu)
- `arr.map(async (x) => {...})` ishlatilgan.
- Natija massivini `console.log` qilsangiz — kutilgan qiymatlar o'rniga
  `[Promise, Promise, Promise]` yoki har biri `Promise { <pending> }`
  bo'lib chiqadi.
- Yoki bu massiv keyin `JSON.stringify` qilinsa — har bir element `{}`
  bo'lib ko'rinadi.

## Sabab (100%)
`.map()` har bir `async` callback chaqiruvidan **darhol** `Promise`
qaytaradi (callback tugashini kutmaydi), shuning uchun `.map()`ning o'zi
`Promise[]` qaytaradi, hisoblangan qiymatlar massivi emas.

## Tasdiqlash
Kodda aynan `.map(async` yoki `.map((x) => { ... async ...})` ko'rinishi
bormi va natija to'g'ridan-to'g'ri (`Promise.all` siz) ishlatilyaptimi —
ha bo'lsa, aynan shu sabab.

## Tuzatish (aynan shu)
```js
// XATO:
const results = arr.map(async (x) => await process(x)); // Promise[]

// TO'G'RI:
const results = await Promise.all(arr.map(async (x) => await process(x)));
```

`Promise.all(...)` barcha promise'lar tugashini kutadi va haqiqiy
qiymatlar massivini qaytaradi. Chaqiruvchi funksiya `async` bo'lishi va
bu qatorda `await` bo'lishi kerak.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Sabab: `.map()` ichida `async` callback ishlatilgan, lekin `Promise.all`
  bilan o'ralmagan.
- Tuzatish: butun `map(...)` chaqiruvini `Promise.all(...)` ichiga olib,
  `await` qo'shish.

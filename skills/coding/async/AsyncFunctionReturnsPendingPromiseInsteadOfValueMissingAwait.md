---
name: async-missing-await
description: Async funksiya chaqirilganda natija o'rniga "[object Promise]", undefined, yoki keyingi kodda "natija.property is not a function" chiqadi — sabab aynan bitta, chaqiruvchi joyda await yo'q.
---

# Async: natija o'rniga Promise qaytyapti

## Nima uchun bu skill kerak
Bu — async/Promise bilan bog'liq ENG ko'p uchraydigan, eng oddiy sabab:
`await` yozilmagan. Ko'pincha murakkab sababdan qidirishga urinishadi,
lekin avval shuni tekshirish kerak.

## Simptom (aynan shu)
- Funksiya `console.log`da `Promise { <pending> }` yoki `[object Promise]` deb chiqadi.
- Yoki natija ustida `.property`/`.method()` chaqirilganda "Cannot read properties of undefined" yoki "X is not a function" chiqadi, aslida funksiya to'g'ri qiymat qaytarishi kerak edi.

## Sabab (100%)
`async function`ni chaqirgan joyda `await` yozilmagan. `async` funksiya
chaqiruvi darhol `Promise` obyektini qaytaradi, ichidagi haqiqiy qiymatni
emas — natija faqat `await` bilan yoki `.then()` ichida olinadi.

## Tasdiqlash
Xato chiqqan qatordan orqaga qarab, o'sha qiymatni bergan funksiya
chaqiruvini top. O'sha funksiya `async` deb e'lon qilinganmi (yoki ichida
`await` ishlatilganmi)? Ha, lekin chaqiruv oldida `await` yo'qmi (va
funksiya `async` ichida emasmi)? — aynan shu sabab.

## Tuzatish (aynan shu)
```js
// XATO:
const data = getData(); // data === Promise, haqiqiy qiymat emas

// TO'G'RI:
const data = await getData(); // faqat async funksiya ichida ishlaydi
```

Agar chaqiruvchi funksiya `async` emas bo'lsa — uni ham `async` qil (yoki
`.then(data => ...)` bilan ishlat, agar `async`ga o'tkazib bo'lmasa).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Sabab: async funksiya chaqirilgan joyda `await` yo'q, shuning uchun
  qiymat o'rniga Promise obyekti kelgan.
- Tuzatish: chaqiruv oldiga `await` qo'yish, zarurat bo'lsa chaqiruvchini
  ham `async` qilish.

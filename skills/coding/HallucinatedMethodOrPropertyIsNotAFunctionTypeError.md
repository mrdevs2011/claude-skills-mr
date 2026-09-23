---
name: hallucinated-method-is-not-a-function
description: TypeError "X is not a function" yoki "Cannot read properties of undefined (reading 'X')" chiqadi, lekin obyekt o'zi null emas — sabab AI/model o'ylab topgan (mavjud bo'lmagan) metod yoki property.
---

# Hallucinated metod: "X is not a function"

## Nima uchun bu skill kerak
AI kod yozganda eng ko'p uchraydigan xatolardan biri — mavjud bo'lmagan metod yoki property nomini o'ylab chiqarish (`arr.last()`, `obj.doMagic()`, `str.capitalize()` va h.k.). Xato matni "null/undefined" emas, balki "is not a function" yoki property o'qishda "undefined" ko'rinadi. Bu null skill'dan farqli — obyekt bor, lekin usul yo'q.

## Simptom (aynan shu)
- Xato: `TypeError: xxx.yyy is not a function`
- Yoki: `TypeError: Cannot read properties of undefined (reading 'yyy')` — lekin `xxx` o'zi `null`/`undefined` emas, faqat `yyy` yo'q.
- Kod "to'g'ri ko'rinadi", lekin runtime'da yiqiladi. Ko'pincha yangi yozilgan yoki AI tomonidan qo'shilgan qatorda.

## Sabab (100%)
Chaqirilayotgan metod yoki o'qilayotgan property **hech qachon mavjud bo'lmagan**. AI o'qigan training ma'lumotlaridan yoki o'xshash nomlardan o'ylab topgan (masalan `findLast` o'rniga `last`, `toUpperCase` o'rniga `uppercase`, `includes` o'rniga `contains` va h.k.).

## Tasdiqlash
1. Stack trace'dagi aniq qatorni och.
2. `.yyy(` yoki `.yyy` dan oldingi obyektni (masalan `items.last`) top.
3. O'sha obyektning haqiqiy tipini bil (Array, Object, String, custom class?).
4. Hujjat yoki `console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(obj)))` / MDN / TypeScript tipini tekshir — `yyy` umuman bor-yo'qligini ko'r.
5. Agar yo'q bo'lsa — bu aynan hallucinated metod.

## Tuzatish (aynan shu)
Mavjud, hujjatlashtirilgan alternativani ishlat:

```js
// XATO (hallucinated):
const last = items.last();
const upper = name.uppercase();
const has = list.contains(value);

// TO'G'RI:
const last = items[items.length - 1];          // yoki items.at(-1)
const upper = name.toUpperCase();
const has = list.includes(value);
```

Agar kutubxona metodiga o'xshasa — avval o'sha kutubxona o'rnatilganmi va import qilinganmi tekshir (ReferenceError skilliga o't).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- "is not a function" ko'pincha null emas, balki AI o'ylab topgan metod nomidan chiqadi.
- Tuzatish: o'ylab topilgan nomni o'chirish, haqiqiy mavjud metodni (yoki oddiy alternativani) yozish.
- Har doim yangi metod nomini yozishdan oldin tip/hujjatni tekshirish kerak.
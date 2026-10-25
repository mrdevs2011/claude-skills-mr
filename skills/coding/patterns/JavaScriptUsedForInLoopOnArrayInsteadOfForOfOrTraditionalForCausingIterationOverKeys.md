---
name: javascript-for-in-on-array-iterates-keys
description: JavaScript'da massiv ustida for...in ishlatish indekslarni (string keys) aylantiradi, elementlarni emas. Kutilmagan string qiymatlar, prototip xossalari yoki noto'g'ri tartib chiqadi.
---

# JavaScript'da massiv ustida for...in o'rniga for...of yoki oddiy for

## Nima uchun bu skill kerak
Agentlar ba'zan Python'dagi for...in ga o'xshash deb `for (const i in arr)` yozadi. JavaScript'da `for...in` ob'ektning enumerable xossalarini (kalitlarini) aylanadi. Massivda bu "0", "1", "2"... stringlar bo'ladi, elementlar emas. Bu ko'pincha type xatolari, string concatenation yoki prototipdan qo'shimcha kalitlar bilan xatolarga olib keladi.

## Simptom (aynan shu)
- Kodda `for (const key in array)` yoki `for (let i in items)` massiv ustida ishlatilgan.
- Loop ichida `array[key]` o'rniga to'g'ridan-to'g'ri `key` ishlatilgan yoki `key` string deb taxmin qilinmagan.
- Natija kutilgan elementlar o'rniga "0", "1" stringlari yoki qo'shimcha xossalar.
- Array.prototype ga qo'shilgan metodlar ham chiqib qolishi mumkin.
- TypeError: key.something is not a function yoki noto'g'ri hisoblash.

## Sabab (100%)
`for...in` ob'ektlar uchun mo'ljallangan (enumerable properties). Massivlar ham ob'ekt, lekin ularning elementlari `for...of` (iterable) yoki oddiy `for (let i = 0; i < arr.length; i++)` bilan to'g'ri olinadi. Agent til farqini hisobga olmagan.

## Tasdiqlash
1. Loop `for (... in ...)` shaklida va o'ng tomoni Array (yoki array-like)mi?
2. Loop o'zgaruvchisi element sifatida ishlatilganmi (key emas)?
3. `Array.isArray(target)` true bo'lsa va elementlar kerak bo'lsa?
4. `for...of` yoki `.forEach` / `.map` ishlatilmaganmi?

## Tuzatish (aynan shu)
Massiv elementlari kerak bo'lsa `for...of` yoki klassik for ishlat:

```javascript
const fruits = ["olma", "nok", "banan"];

// Noto'g'ri — key'lar (string "0", "1", "2"):
for (const item in fruits) {
  console.log(item.toUpperCase()); // "0".toUpperCase() — ishlaydi lekin noto'g'ri
  // yoki fruits[item] kerak bo'ladi, lekin item string
}

// To'g'ri — elementlar:
for (const item of fruits) {
  console.log(item.toUpperCase()); // "OLMA", "NOK", "BANAN"
}

// yoki indeks kerak bo'lsa:
for (let i = 0; i < fruits.length; i++) {
  console.log(i, fruits[i]);
}

// yoki forEach:
fruits.forEach((item, index) => {
  console.log(index, item);
});
```

Qoidalar:
- Elementlar uchun: `for...of` yoki `.forEach` / `.map` / `.filter`.
- Indeks + element: `for (const [i, val] of arr.entries())` yoki klassik for.
- Ob'ekt kalitlari uchun: `for...in` yoki `Object.keys` / `Object.entries`.
- Hech qachon massiv ustida `for...in` ishlatma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `for...in` kalitlarni (string) aylanadi, elementlarni emas.
- Massiv elementlari uchun har doim `for...of` yoki array metodlarini ishlat.
- Bu keng tarqalgan JS xatosi — Python odatidan kelib chiqadi.

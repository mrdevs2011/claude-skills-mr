---
name: javascript-used-indexof-method-for-membership-check-instead-of-includes
description: Massivda element borligini tekshirishda indexOf() !== -1 ishlatilganda kod o'qilishi qiyinlashadi va -1 bilan aralashish xavfi bor; includes() ishlatish kerak.
---

# Massiv a'zolik tekshiruvida indexOf o'rniga includes ishlatish

## Nima uchun bu skill kerak
indexOf() indeks qaytaradi (-1 agar yo'q). A'zolik uchun ishlatish (if (arr.indexOf(item) !== -1)) eski uslub, o'qilishi yomon va -1 bilan solishtirishda xato qilish oson. ES2016 dan beri includes() to'g'ridan-to'g'ri boolean qaytaradi, aniqroq va xavfsizroq.

## Simptom (aynan shu)
Kodda if (array.indexOf(value) !== -1) yoki > -1 ko'rinadi. O'qish qiyin, yangi dasturchilar "nima uchun -1" deb so'rashadi. Ba'zan indexOf natijasini noto'g'ri ishlatib (masalan, if (arr.indexOf(x)) ) truthy/falsy xato qiladi, chunki 0 valid indeks.

## Sabab (100%)
indexOf() ES5 dan beri bor, includes() keyinroq (ES2016). Eski kod yoki odat tufayli indexOf ishlatiladi. indexOf indeks qaytaradi, includes esa boolean — a'zolik uchun includes to'g'ri semantik.

## Tasdiqlash
Kodni qidir: .indexOf( ... !== -1 yoki > -1. Test:

```javascript
const arr = [0, 1, 2];
console.log(arr.indexOf(0) !== -1); // true, lekin
if (arr.indexOf(0)) { /* 0 falsy, ishlamaydi */ }
console.log(arr.includes(0)); // true, aniq
```

## Tuzatish (aynan shu)
A'zolik tekshiruvi uchun doim includes() ishlat:

```javascript
// Noto'g'ri / eski
if (items.indexOf(target) !== -1) {
  process(target);
}

// To'g'ri
if (items.includes(target)) {
  process(target);
}

// 0 qiymat bilan xato misol
const nums = [0, 1, 2];
if (nums.indexOf(0)) { /* hech qachon ishlamaydi */ }
if (nums.includes(0)) { /* ishlaydi */ }
```

Agar indeks kerak bo'lsa, indexOf yoki findIndex saqlab qol. includes faqat boolean uchun.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
JavaScript da massivda element borligini tekshirish uchun indexOf() !== -1 o'rniga includes() ishlat. Bu o'qilishi yaxshi, 0 bilan aralashmaydi va zamonaviy. Indeks kerak bo'lsa indexOf saqla.

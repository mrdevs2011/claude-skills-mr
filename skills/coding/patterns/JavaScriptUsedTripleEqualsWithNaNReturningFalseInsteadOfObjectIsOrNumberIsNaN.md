---
name: javascript-used-triple-equals-with-nan-returning-false-instead-of-object-is-or-number-isnan
description: JavaScript da `NaN === NaN` har doim false qaytaradi; `Object.is(NaN, value)` yoki `Number.isNaN(value)` ishlatish kerak. Bu silent false natijaga olib keladi.
---

# JavaScript da NaN bilan === ishlatish false qaytaradi

## Nima uchun bu skill kerak
JavaScript da `NaN` (Not-a-Number) maxsus qiymat bo'lib, o'zi bilan ham teng emas. `===` yoki `==` bilan solishtirish doim `false` beradi, shuning uchun NaN ni tekshirishda noto'g'ri shartlar yoziladi va xatolar yashirin qoladi.

## Simptom (aynan shu)
Kodda `if (result === NaN)` yoki `value === NaN` sharti hech qachon true bo'lmaydi, hatto result haqiqatan NaN bo'lsa ham. Natijada noto'g'ri hisob-kitoblar, parse xatolari e'tiborsiz qoladi yoki default holatga tushadi. Masalan, `parseFloat("abc") === NaN` false.

## Sabab (100%)
IEEE 754 standarti bo'yicha NaN hech qanday qiymatga, jumladan o'ziga ham teng emas. JavaScript buni `===` da saqlaydi. `Object.is` esa same-value equality ishlatadi va NaN ni to'g'ri aniqlaydi. `Number.isNaN` esa type-safe tekshiruv.

## Tasdiqlash
Konsolda yoki kodda tekshir:

```javascript
console.log(NaN === NaN);          // false
console.log(Object.is(NaN, NaN));  // true
console.log(Number.isNaN(NaN));    // true
console.log(Number.isNaN("abc"));  // false (type-safe)
```

Kodda `=== NaN` yoki `== NaN` qidir.

## Tuzatish (aynan shu)
NaN tekshirish uchun `Number.isNaN()` yoki `Object.is()` ishlat:

```javascript
// Noto'g'ri
if (parsed === NaN) {
  handleInvalid();
}

// To'g'ri (tavsiya)
if (Number.isNaN(parsed)) {
  handleInvalid();
}

// Yoki
if (Object.is(parsed, NaN)) {
  handleInvalid();
}
```

`isNaN()` global funksiyadan qoch — u type coercion qiladi (`isNaN("abc")` true).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`NaN === NaN` doim false. NaN ni aniqlash uchun `Number.isNaN(value)` yoki `Object.is(value, NaN)` ishlat. Bu silent false shartlardan qochishga yordam beradi.

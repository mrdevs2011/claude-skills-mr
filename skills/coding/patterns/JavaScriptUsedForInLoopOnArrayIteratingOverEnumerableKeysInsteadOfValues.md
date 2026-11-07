---
name: js-for-in-on-array
description: for...in loop on array iterates over string keys (indices) not values, causing type errors or unexpected behavior when treating index as value.
---

# JavaScript for...in loop massivda kalitlarni (indekslarni) iteratsiya qiladi, qiymatlarni emas

## Nima uchun bu skill kerak
AI yoki dasturchi massiv ustida oddiy `for...in` ishlatadi, lekin `for...in` massivning **enumerable property kalitlarini** (ya'ni string ko'rinishidagi indekslarni) qaytaradi, qiymatlarni emas. Bu "of" bilan chalkashtiriladi va tip xatolari, noto'g'ri hisoblash yoki kutilmagan string ishlov berishga olib keladi.

## Simptom (aynan shu)
- `for (const item of array)` o'rniga `for (const item in array)` yozilgan.
- Loop ichida `item` string (`"0"`, `"1"`, ...) bo'lib chiqadi, son yoki obyekt emas.
- `item + 1` string concatenation qiladi (`"01"`), yoki `item.property` undefined beradi.
- TypeScript'da type error yoki runtime'da "item is not a function" / unexpected string.

## Sabab (100%)
`for...in` **object property enumeration** uchun mo'ljallangan. Massiv ham obyekt bo'lgani uchun u indekslarni string sifatida qaytaradi (`"0"`, `"1"`, ...). Qiymatlarni olish uchun `for...of` yoki `array.forEach` / `array.map` ishlatilishi kerak.

## Tasdiqlash
1. Kodda `for (const x in arr)` yoki `for (let i in array)` borligini toping.
2. Loop ichida `x` ni qiymat deb ishlatilganini tekshiring (masalan `x * 2`, `x.name`).
3. Console'da `typeof item === "string"` ekanini tasdiqlang.
4. Agar `for...of` yoki `.forEach` bo'lsa — bu skill emas.

## Tuzatish (aynan shu)
```javascript
// Noto'g'ri:
const numbers = [10, 20, 30];
for (const n in numbers) {
  console.log(n * 2); // "0"*2 = "00", "1"*2 = "11" — string!
}

// To'g'ri — qiymatlar uchun:
for (const n of numbers) {
  console.log(n * 2); // 20, 40, 60
}

// Yoki:
numbers.forEach(n => console.log(n * 2));

// Agar indeks kerak bo'lsa:
for (let i = 0; i < numbers.length; i++) {
  console.log(i, numbers[i]);
}
// yoki
numbers.forEach((n, i) => console.log(i, n));
```

Hech qachon massiv qiymatlarini olish uchun `for...in` ishlatmang. `for...in` faqat object kalitlari uchun (va hatto unda ham `Object.keys` + `for...of` yaxshiroq).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `for...in` massivda string indekslarni qaytaradi, qiymatlarni emas.
- Massiv qiymatlari uchun har doim `for...of`, `.forEach`, `.map` yoki an'anaviy `for` ishlat.
- Bu xato AI kod generatsiyasida tez-tez uchraydi chunki "for in" va "for of" o'xshash ko'rinadi.

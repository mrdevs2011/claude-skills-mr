---
name: javascript-used-var-instead-of-let-const
description: JavaScript kodida `var` ishlatilganda funksiya-scope, hoisting va qayta e'lon qilish tufayli kutilmagan qiymat yoki xato chiqadi. `let`/`const` ga o'tkazish kerak bo'lganda.
---

# JavaScript da `var` o'rniga `let` yoki `const` ishlatilmagan

## Nima uchun bu skill kerak
`var` eski JavaScript xususiyati — u funksiya scope'ga ega, hoisting qilinadi va bir xil nom bilan qayta e'lon qilishga ruxsat beradi. Zamonaviy kodda bu block-scope, temporal dead zone va qayta e'lon qilishni taqiqlovchi `let`/`const` bilan almashtirilishi kerak. Aks holda loop ichida closure, if-block ichida o'zgaruvchi "tashqariga chiqib ketishi" yoki kutilmagan qayta yozilishlar yuz beradi.

## Simptom (aynan shu)
- Loop ichida `var` bilan e'lon qilingan o'zgaruvchi barcha callback/closure larda oxirgi qiymatni ko'rsatadi.
- `if`/`for` block ichida `var` e'lon qilingan o'zgaruvchi blockdan tashqarida ham mavjud bo'ladi (ReferenceError o'rniga undefined yoki qiymat).
- Bir xil nom bilan `var` ikki marta e'lon qilingan, lekin xato chiqmaydi — oxirgi yozilish g'alaba qiladi.
- Konsolda yoki runtime da "o'zgaruvchi hali e'lon qilinmagan" deb kutilgan joyda qiymat bor (hoisting).

## Sabab (100%)
`var` funksiya-scoped, block-scoped emas. Deklaratsiya funksiya boshiga "ko'tariladi" (hoisting), lekin initializatsiya o'z joyida qoladi. Bir xil scope'da qayta `var` e'lon qilish ruxsat etilgan. `let` va `const` esa block-scoped, temporal dead zone'ga ega va qayta e'lon qilishni taqiqlaydi.

## Tasdiqlash
1. Kodda `var ` so'zini qidir.
2. O'sha o'zgaruvchi block (if/for/while) ichida e'lon qilinganmi va undan tashqarida ishlatilganmi — tekshir.
3. Loop + setTimeout/callback/closure bor-yo'qligini ko'r.
4. Bir xil nom ikki marta `var` bilan e'lon qilinganmi.

## Tuzatish (aynan shu)
`var` ni `let` (qayta tayinlanadigan) yoki `const` (o'zgarmas) ga almashtir. Loop counter uchun ham `let`.

```javascript
// Yomon
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3, 3, 3
}
if (true) {
  var x = 1;
}
console.log(x); // 1 — kutilmagan

// To'g'ri
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0, 1, 2
}
if (true) {
  const x = 1;
  console.log(x);
}
// console.log(x); // ReferenceError — to'g'ri
```

Agar qayta tayinlash kerak bo'lsa `let`, aks holda doim `const` afzal.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`var` funksiya-scope, hoisting va qayta e'lon qilish tufayli yashirin xatolar keltiradi. Zamonaviy JavaScript da faqat `let` va `const` ishlatiladi — ular block-scope va aniqroq xato beradi. Loop va block ichida ayniqsa muhim.

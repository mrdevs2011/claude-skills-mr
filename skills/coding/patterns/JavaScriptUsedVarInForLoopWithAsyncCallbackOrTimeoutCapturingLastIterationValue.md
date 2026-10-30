---
name: js-var-for-loop-async-captures-last-value
description: JavaScript for loop ichida var ishlatilib, callback yoki setTimeout ichida loop o'zgaruvchisi o'qilganda har doim oxirgi qiymat olinadi — kutilgan har bir iteratsiya qiymati emas.
---

# for loop da var + async callback oxirgi qiymatni ushlab oladi

## Nima uchun bu skill kerak
Klassik JavaScript closure muammosi. var function-scoped va loop tugagach bitta o'zgaruvchi qoladi. setTimeout, Promise, event listener yoki boshqa async callback loop o'zgaruvchisini o'qiganda hamma bir xil (oxirgi) qiymatni ko'radi. Bu kutilmagan natija va qiyin debug.

## Simptom (aynan shu)
- for (var i = 0; i < n; i++) { setTimeout(() => console.log(i), 0); } — hamma  n chiqadi.
- Yoki button click handler, fetch then, array.map ichida async da loop o'zgaruvchisi har doim oxirgi.
- Kutilgan: 0,1,2... chiqishi kerak edi, lekin hammasi bir xil.

## Sabab (100%)
var function-scoped, block-scoped emas. Loop har iteratsiyada yangi o'zgaruvchi yaratmaydi — bitta o'zgaruvchi bor va u oxirida n ga teng. Callback keyinroq ishga tushadi va shu bitta o'zgaruvchini o'qiydi.

## Tasdiqlash
1. for/while loop da var ishlatilganmi?
2. Loop ichida async callback (setTimeout, Promise.then, addEventListener, fetch) bormi?
3. Callback loop o'zgaruvchisini o'qiyaptimi?
4. Agar ha — bu holat.

## Tuzatish (aynan shu)
let ishlat (block-scoped, har iteratsiyada yangi binding).

Noto'g'ri:
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Chiqish: 3 3 3
```

To'g'ri:
```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Chiqish: 0 1 2
```

Yoki IIFE bilan eski usul (let yo'q bo'lsa):
```javascript
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i);
}
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
var + loop + async callback = har doim oxirgi qiymat. let ishlat yoki IIFE bilan qiymatni "saqla". Bu closure + scope muammosi, sintaksis xatosi emas.

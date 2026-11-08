---
name: javascript-var-in-for-loop-shares-final-value
description: for (var i = 0; ...) loop ichida callback, setTimeout yoki async function ishlatilganda barcha iteratsiyalar oxirgi i qiymatini ko'radi — classic closure bug.
---

# for loop da var ishlatish sababli barcha callback'lar oxirgi qiymatni ko'radi

## Nima uchun bu skill kerak
JavaScript'da `var` function-scoped. `for` loop ichida `var i` e'lon qilinganida barcha callback'lar bir xil `i` o'zgaruvchisiga murojaat qiladi. Loop tugagach `i` oxirgi qiymatga ega bo'ladi, shuning uchun kechiktirilgan callback'lar (setTimeout, event listener, Promise) noto'g'ri qiymat oladi. Bu juda keng tarqalgan xato.

## Simptom (aynan shu)
- `for (var i = 0; i < n; i++) { setTimeout(() => console.log(i), 0); }` yoki shunga o'xshash.
- Barcha callback'lar bir xil (oxirgi) qiymatni chop etadi, har biri o'z iteratsiya qiymatini emas.
- Event listener yoki async operatsiya loop ichida qo'shilganda ham shu holat.
- Kutilgan: 0,1,2,... chiqishi kerak edi, lekin hammasi `n` yoki `n-1` chiqadi.

## Sabab (100%)
`var` function scope'ga ega, block scope emas. Loop har bir iteratsiyada yangi `i` yaratmaydi — bitta `i` o'zgaruvchisi loop davomida o'zgaradi. Callback'lar closure orqali shu bitta `i` ni ushlaydi. Loop tugagach `i` oxirgi qiymatda qoladi.

## Tasdiqlash
1. Loop `for (var i = ...)` shaklida yozilganmi?
2. Loop ichida callback, setTimeout, addEventListener yoki async function bormi?
3. Callback ichida `i` ishlatilganmi?
4. Barcha callback'lar bir xil qiymat qaytaryaptimi? — ha bo'lsa, bu holat.
5. `let` yoki `const` ishlatilgan bo'lsa, bu xato bo'lmaydi (har iteratsiya yangi binding).

## Tuzatish (aynan shu)
`var` o'rniga `let` ishlat. `let` block-scoped, shuning uchun har iteratsiya o'z `i` binding'iga ega.

Noto'g'ri:
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3,3,3
}
```

To'g'ri:
```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0,1,2
}
```

Agar `var` ni o'zgartira olmasang (eski kod), IIFE yoki qo'shimcha o'zgaruvchi bilan ushla:
```js
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 0);
  })(i);
}
```

Yoki `forEach` / `map` ishlat (ular o'z scope'ini yaratadi).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`var` bilan `for` loop + callback = barcha callback'lar oxirgi qiymatni ko'radi. Har doim `let` (yoki `const`) ishlat loop o'zgaruvchisi uchun. Bu classic JavaScript closure tuzog'ini oldini oladi.

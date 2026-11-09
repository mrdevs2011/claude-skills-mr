---
name: javascript-promise-all-on-uninvoked-async-functions
description: When Promise.all receives an array of async function references instead of the promises returned by calling them, the functions never execute and you get TypeError or silent no-op.
---

# JavaScript Used Promise.all On Array Of Async Functions Without Invoking Them Causing No Execution Or TypeError

## Nima uchun bu skill kerak
Agent yoki kod yozuvchi parallel async ishlarni Promise.all bilan ishga tushirmoqchi bo'ladi, lekin funksiyalarni chaqirmay, ularning o'zini massivga qo'yadi. Natijada hech narsa ishlamaydi yoki TypeError chiqadi. Bu xato oson e'tibordan chetda qoladi, chunki kod sintaksisi to'g'ri ko'rinadi.

## Simptom (aynan shu)
- `Promise.all([fetchUser, fetchPosts])` yoki shunga o'xshash, bu yerda `fetchUser` va `fetchPosts` `async function`lar.
- Xato: `TypeError: undefined is not a function` yoki Promise.all hech narsa kutmaydi, natija bo'sh/undefined.
- Network so'rovlari yoki async ishlar umuman ishga tushmaydi.
- Console'da funksiya chaqirilganligi haqida log yo'q.

## Sabab (100%)
`Promise.all` faqat Promise yoki thenable'larni qabul qiladi. Async function o'zi Promise qaytarmaydi — uni chaqirish (`fetchUser()`) kerak, shunda u Promise qaytaradi. Funksiya referensini berish — uni chaqirmaslik degani. Shuning uchun hech qanday async ish boshlanmaydi.

## Tasdiqlash
1. `Promise.all` argumentidagi elementlarning tipini tekshir: agar ular `function` bo'lsa va `Promise` emas — xato shu.
2. Kodda `arr.map(fn => fn())` o'rniga to'g'ridan-to'g'ri `fn` berilganmi qara.
3. Browser/Node debugger yoki `console.log` bilan funksiya ichiga kirilganligini tekshir — kirmagan bo'ladi.

## Tuzatish (aynan shu)
Funksiyalarni chaqirib, ular qaytaradigan Promise'larni ber:

```javascript
// Noto'g'ri
const results = await Promise.all([fetchUser, fetchPosts, fetchComments]);

// To'g'ri
const results = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
]);

// Yoki dinamik ro'yxat uchun
const fns = [fetchUser, fetchPosts, fetchComments];
const results = await Promise.all(fns.map(fn => fn()));
```

Agar argumentlar kerak bo'lsa:

```javascript
const results = await Promise.all([
  fetchUser(userId),
  fetchPosts(userId),
  fetchComments(postId)
]);
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`Promise.all` ga async function'ning o'zini emas, uni chaqirib olingan Promise'ni berish kerak. Aks holda funksiya hech qachon ishga tushmaydi va parallel bajarilish bo'lmaydi.

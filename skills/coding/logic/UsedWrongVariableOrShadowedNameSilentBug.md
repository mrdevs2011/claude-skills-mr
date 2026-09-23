---
name: wrong-variable-or-shadowed-name
description: Kod xatosiz ishlaydi, lekin noto'g'ri o'zgaruvchi ishlatilgan (o'xshash nom, shadowing, yoki chalkashgan identifikator) — natija jim noto'g'ri chiqadi.
---

# Noto'g'ri o'zgaruvchi yoki shadowing

## Nima uchun bu skill kerak
AI o'xshash nomli o'zgaruvchilarni (`user` / `users`, `data` / `item`, `id` / `userId`, `result` / `res`) chalkashtirib yuboradi. Yoki ichki scope'da bir xil nom e'lon qilib, tashqaridagi qiymatni yashiradi (shadowing). Syntax xato chiqmaydi, lekin mantiq noto'g'ri ishlaydi. Bu "chalishib ketish"ning eng jim va eng qiyin topiladigan shakli.

## Simptom (aynan shu)
- Hech qanday xato xabari yo'q.
- Natija kutilganidan farq qiladi (bo'sh, eski qiymat, boshqa obyekt).
- `console.log` qilsang — ishlatilayotgan o'zgaruvchi umuman boshqa narsa ekanligi chiqadi.
- Ko'pincha loop ichida, callback'da yoki ichma-ich funksiyalarda uchraydi.

## Sabab (100%)
1. Ikki o'xshash nom chalkashgan (`item` o'rniga `items`, `user` o'rniga `currentUser`).
2. Ichki blokda bir xil nom e'lon qilingan (shadowing) va tashqi qiymat yashiringan.
3. AI avvalgi qatordagi o'zgaruvchini "davom ettirib" yozgan, lekin u yerda boshqa nom kerak edi.

## Tasdiqlash
1. Noto'g'ri natija berayotgan ifodani toping.
2. Undagi har bir o'zgaruvchi nomini oling.
3. Har birining e'lon qilingan joyini va haqiqiy qiymatini `console.log` bilan tekshiring.
4. Scope'ni qarang: ichki `const/let` tashqaridagini yashirayotganmi?

## Tuzatish (aynan shu)
To'g'ri o'zgaruvchini ishlating, nomlarni aniqroq qiling:

```js
// XATO (shadowing + chalkash):
const users = getUsers();
users.forEach(user => {
  const user = getCurrentUser(); // tashqi user yashirildi
  console.log(user.name);        // noto'g'ri user
});

// TO'G'RI:
const users = getUsers();
users.forEach(u => {
  const current = getCurrentUser();
  console.log(u.name, current.name);
});

// XATO (o'xshash nom):
const result = await fetchData();
const data = process(result);
return result;  // data qaytarilishi kerak edi

// TO'G'RI:
return data;
```

Nomlarni qisqa va chalkashmaydigan qilib qo'ying (`item` vs `items`, `res` vs `result`).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Xato chiqmasa ham noto'g'ri o'zgaruvchi ishlatilishi mumkin.
- O'xshash nomlar va shadowing — AI eng ko'p chalkashtiradigan joy.
- Shubhali joyda `console.log` bilan haqiqiy qiymatni tekshirish majburiy.

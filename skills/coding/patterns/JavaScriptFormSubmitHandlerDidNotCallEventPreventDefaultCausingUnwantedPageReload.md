---
name: javascript-form-submit-missing-prevent-default
description: Form onsubmit handler'da event.preventDefault() chaqirilmagan — sahifa qayta yuklanadi va state yo'qoladi.
---

# Form submit'da preventDefault yo'q — sahifa reload bo'ladi

## Nima uchun bu skill kerak
JavaScript'da form'ning default xatti-harakati — submit bo'lganda sahifani qayta yuklash (yoki action URL'ga borish). Agar handler'da `event.preventDefault()` chaqirilmasa, AJAX/fetch bilan yuborish muvaffaqiyatsiz bo'ladi, form state yo'qoladi, va foydalanuvchi "hech narsa bo'lmadi" deb o'ylaydi. AI ko'pincha handler yozadi, lekin preventDefault'ni unutadi.

## Simptom (aynan shu)
- Form submit qilinsa sahifa darhol qayta yuklanadi.
- Console'da xato yo'q, lekin data yuborilmaydi yoki state reset bo'ladi.
- `onsubmit="handleSubmit()"` yoki `addEventListener('submit', ...)` ishlaydi, lekin sahifa ketadi.
- Single Page App'da routing buziladi.

## Sabab (100%)
Browser form elementining default action'i — HTTP request yuborib sahifani yangilash. `preventDefault()` chaqirilmasa, bu default ishga tushadi, handler tugagandan keyin ham. AI event object'ni oladi, lekin uni to'xtatishni yozmaydi.

## Tasdiqlash
1. Form elementini top (`<form>` yoki `querySelector('form')`).
2. Submit listener yoki onsubmit atributini och.
3. Handler funksiyasida `event.preventDefault()` yoki `e.preventDefault()` bormi? Yo'q bo'lsa — aynan shu.
4. Browser DevTools'da Network tab'da form submit'da to'liq page load bormi?

## Tuzatish (aynan shu)
Har doim handler boshida `preventDefault()` chaqir:

```js
// XATO:
form.addEventListener('submit', (event) => {
  const data = new FormData(event.target);
  fetch('/api/submit', { method: 'POST', body: data });
  // sahifa baribir reload bo'ladi
});

// TO'G'RI:
form.addEventListener('submit', (event) => {
  event.preventDefault();  // avval default'ni to'xtat
  const data = new FormData(event.target);
  fetch('/api/submit', { method: 'POST', body: data })
    .then(res => res.json())
    .then(result => { /* muvaffaqiyat */ })
    .catch(err => { /* xato */ });
});

// Inline:
// <form onsubmit="event.preventDefault(); handleSubmit(event);">
```

React'da: `onSubmit={(e) => { e.preventDefault(); ... }}`

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Form submit handler'ida `event.preventDefault()` bo'lmasa, browser sahifani qayta yuklaydi. Har doim birinchi qatorda chaqir — shunda custom logic (fetch, validation) ishlaydi, state saqlanadi.

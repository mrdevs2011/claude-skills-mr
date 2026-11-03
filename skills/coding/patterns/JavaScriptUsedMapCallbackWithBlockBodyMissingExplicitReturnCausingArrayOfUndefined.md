---
name: javascript-map-block-body-missing-return
description: Array.map() callback ishlatilganda block body ({}) ichida return qilinmasa, natija undefinedlar massivi bo'ladi. Qachon: transform qilmoqchi bo'lib, lekin undefined array olganda.
---

# JavaScript Array.map() Block Body'da Return Unutilgan

## Nima uchun bu skill kerak
JavaScript'da `Array.prototype.map` har bir element uchun yangi qiymat qaytarishi kutiladi. Agar callback funksiyasi block body (jingalak qavslar `{}`) bilan yozilsa va ichida `return` bo'lmasa, har bir element uchun `undefined` qaytadi. Bu kutilmagan `undefined` massiviga olib keladi, keyinroq xatolarga sabab bo'ladi.

## Simptom (aynan shu)
Kodda `array.map(item => { someLogic(item); })` yoki shunga o'xshash yozilgan. Natijada `map` chaqiruvi `[undefined, undefined, ...]` qaytaradi. Keyingi kodda `TypeError: cannot read property of undefined` yoki noto'g'ri data ko'rinadi. Console'da massiv elementlari `undefined`.

## Sabab (100%)
Arrow function yoki oddiy function block body (`{}`) ishlatilganda, agar `return` statement bo'lmasa, funksiya avtomatik `undefined` qaytaradi. `map` har bir callback natijasini yig'adi, shuning uchun barcha `undefined` bo'ladi. Expression body (`=> expression`) da bu muammo yo'q, chunki expression o'zi return qiymat hisoblanadi.

## Tasdiqlash
1. `map` chaqiruvi natijasini `console.log` yoki debugger bilan tekshiring — barcha elementlar `undefined`mi?
2. Callback ichida `return` keyword bor-yo'qligini qarang.
3. Block body (`{ ... }`) ishlatilganmi, yoki oddiy expression (`=> value`)?

## Tuzatish (aynan shu)
Callback ichiga aniq `return` qo'shing yoki expression body'ga o'tkazing.

Noto'g'ri:
```javascript
const names = users.map(user => {
  user.name.toUpperCase();  // return yo'q
});
// names === [undefined, undefined, ...]
```

To'g'ri (block body bilan):
```javascript
const names = users.map(user => {
  return user.name.toUpperCase();
});
```

Yoki expression body:
```javascript
const names = users.map(user => user.name.toUpperCase());
```

Agar side-effect kerak bo'lsa, `map` o'rniga `forEach` ishlating.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`Array.map` har doim yangi massiv qaytaradi va callback'ning return qiymatini ishlatadi. Block body ishlatilsa, `return`ni unutmaslik kerak — aks holda `undefined`lar massivi chiqadi. Expression body qisqaroq va xavfsizroq. Side-effect uchun `forEach` mosroq.

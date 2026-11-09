---
name: javascript-queryselector-without-null-check
description: JavaScript da querySelector yoki getElementById natijasini null tekshirmasdan property o'qish TypeError beradi. Qachon: DOM element topilmasa yoki hali yuklanmagan bo'lsa.
---

# QuerySelector natijasini null tekshirmasdan ishlatish TypeError beradi

## Nima uchun bu skill kerak
DOM so'rovlari (querySelector, getElementById) element topilmasa `null` qaytaradi. Agent yoki dasturchi to'g'ridan-to'g'ri `.textContent` yoki `.value` o'qisa, runtime da TypeError yuzaga keladi. Bu ayniqsa shartli render yoki kech yuklangan elementlarda uchraydi.

## Simptom (aynan shu)
- `document.querySelector('.btn').addEventListener(...)` yoki `el.textContent = ...`
- Xato: `Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')` yoki `Cannot read properties of null (reading 'textContent')`
- Element mavjud deb taxmin qilingan, lekin selector noto'g'ri yoki DOM tayyor emas.

## Sabab (100%)
querySelector va getElementById har doim element topilmasa `null` qaytaradi. Natijani tekshirmasdan method yoki property chaqirish null da TypeError beradi. Optional chaining yoki explicit check yo'q.

## Tasdiqlash
1. Xato matnida "Cannot read properties of null" va DOM method nomi bormi?
2. Kodda `document.querySelector(...)` yoki `getElementById` dan keyin darhol `.` ishlatilganmi?
3. `if (el)` yoki `el?.` yo'qmi?
4. Selector to'g'ri ekanligini console da tekshirib `null` chiqadimi?

## Tuzatish (aynan shu)
Har doim natijani tekshir:

```javascript
const el = document.querySelector('.my-button');
if (el) {
  el.addEventListener('click', handler);
  el.textContent = 'Clicked';
} else {
  console.warn('Element topilmadi: .my-button');
}
```

Yoki optional chaining (method uchun ehtiyot bo'ling):

```javascript
document.querySelector('.my-button')?.addEventListener('click', handler);
```

DOMContentLoaded ichida yoki element mavjudligini kafolatlangan joyda ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- querySelector/getElementById null qaytarishi mumkin — har doim tekshir.
- Null da property o'qish TypeError beradi.
- if (el) yoki ?. bilan himoya qil, aks holda runtime crash.

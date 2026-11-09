---
name: javascript-nodelist-as-array
description: querySelectorAll yoki getElementsByClassName dan olingan NodeList yoki HTMLCollection ni to'g'ridan-to'g'ri .map, .filter, .reduce chaqirish — TypeError, chunki ular Array emas.
---

# NodeList ni Array deb hisoblash

## Nima uchun bu skill kerak
DOM metodlari (querySelectorAll, getElementsByTagName) NodeList yoki HTMLCollection qaytaradi. Ular Array.prototype metodlariga ega emas (map, filter, reduce, includes va h.k.). To'g'ridan-to'g'ri chaqirish TypeError beradi. forEach ba'zi browserlarda bor, lekin ishonchli emas va Array metodlari kerak bo'lganda konvertatsiya shart.

## Simptom (aynan shu)
- `document.querySelectorAll('.item').map(el => ...)` yoki `.filter`, `.reduce` da TypeError: ...map is not a function.
- Console: "nodeList.map is not a function" yoki "htmlCollection.filter is not a function".
- Kod ishlamaydi, faqat forEach yoki for...of ishlatilganda ishlaydi.
- Live HTMLCollection (getElementsBy...) da iteration paytida elementlar o'zgarishi mumkin.

## Sabab (100%)
NodeList va HTMLCollection array-like (length va indexed access bor), lekin Array prototype dan meros olmagan. Shuning uchun Array metodlari yo'q. Dasturchi ularni Array deb hisoblaydi yoki eski koddan copy-paste qiladi.

## Tasdiqlash
1. querySelectorAll, getElementsBy* natijasida to'g'ridan-to'g'ri .map / .filter / .reduce / .some / .every bormi?
2. TypeError "is not a function" chiqdimi?
3. Array.from yoki [...nodeList] ishlatilmaganmi?
Agar ha — bu holat.

## Tuzatish (aynan shu)
NodeList/HTMLCollection ni Array ga aylantir, keyin Array metodlarini ishlat.

Noto'g'ri:
```javascript
const items = document.querySelectorAll('.item');
const texts = items.map(el => el.textContent); // TypeError
```

To'g'ri:
```javascript
const items = document.querySelectorAll('.item');
const texts = Array.from(items).map(el => el.textContent);
// yoki
const texts = [...items].map(el => el.textContent);
```

Agar faqat iteration kerak bo'lsa va forEach yetarli:
```javascript
items.forEach(el => {
  // ish
});
```

Live collection uchun (getElementsByClassName) birinchi Array ga aylantir, keyin o'zgartir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
querySelectorAll va getElements* Array qaytarmaydi. .map/.filter uchun doim Array.from() yoki spread [...] ishlat. Aks holda TypeError. forEach/for...of ishlaydi, lekin Array metodlari kerak bo'lsa konvertatsiya majburiy.

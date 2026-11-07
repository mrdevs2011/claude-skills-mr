---
name: javascript-mutated-array-in-map-callback
description: JavaScript da map yoki reduce callback ichida tashqi arrayni push bilan mutatsiya qilish — kutilmagan yon ta'sir va noto'g'ri natija. Qachon: array transform qilishda push ishlatilganda.
---

# JavaScript map/reduce callback ichida tashqi arrayni mutatsiya qilish

## Nima uchun bu skill kerak
map va reduce pure transform funksiyalari sifatida ishlatilishi kerak. Callback ichida tashqi o'zgaruvchini o'zgartirish (push, splice va h.k.) kutilmagan yon ta'sirlar keltirib chiqaradi, kodni tushunishni qiyinlashtiradi va ba'zan noto'g'ri natija beradi.

## Simptom (aynan shu)
Kodda `array.map(item => { results.push(transform(item)); })` yoki shunga o'xshash ko'rinadi. map qaytarilgan qiymat ishlatilmaydi (undefined array), yoki reduce ichida accumulator o'rniga tashqi array push qilinadi. Natijada "bo'sh" yoki "noto'g'ri uzunlikdagi" array, yoki original array o'zgarib qoladi.

## Sabab (100%)
map va reduce callbacklari yangi qiymat qaytarishi kutiladi. Push orqali tashqi holatni o'zgartirish — funksiya pure emas, yon ta'sirga ega. map har doim yangi array qaytaradi (callback return qilgan qiymatlardan), lekin agar return yo'q bo'lsa undefined lar bilan to'ladi. Reduce esa accumulatorni qaytarishi shart.

## Tasdiqlash
1. Kodda `.map(` yoki `.reduce(` borligini ko'r.
2. Callback ichida `someArray.push(` yoki boshqa mutatsiya (splice, length o'zgartirish) borligini tekshir.
3. map natijasi ishlatilayotganmi yoki faqat yon ta'sir uchun chaqirilganmi — agar ishlatilmasa, bu aniq belgi.
4. Console yoki debuggerda original array o'zgarganini yoki natija arrayda undefined larni ko'r.

## Tuzatish (aynan shu)
Callback ichida push qilma. Transform qilingan qiymatni `return` qil. map o'zi yangi array yasaydi.

Noto'g'ri:
```javascript
const results = [];
items.map(item => {
  results.push(item * 2);
});
// results to'g'ri, lekin map return ishlatilmagan, yon ta'sir
```

To'g'ri:
```javascript
const results = items.map(item => item * 2);
```

Agar shartli qo'shish kerak bo'lsa, map o'rniga filter + map yoki reduce ishlat:
```javascript
const results = items
  .filter(item => item > 0)
  .map(item => item * 2);

// yoki
const results = items.reduce((acc, item) => {
  if (item > 0) acc.push(item * 2);
  return acc;
}, []);
```

Hech qachon map/reduce callbackida tashqi o'zgaruvchini mutatsiya qilma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
map va reduce pure bo'lishi kerak: callback yangi qiymat qaytarsin, tashqi holatni o'zgartirmasin. Push bilan mutatsiya — yon ta'sir, xato manbai. To'g'ri usul — return qilish yoki filter/map kombinatsiyasi.

---
name: js-foreach-push-instead-of-map
description: JavaScript'da yangi massiv yaratish uchun forEach + push ishlatish o'rniga map() dan foydalanish kerak — side effect'lar va o'qilishi qiyin kodni oldini oladi.
---

# forEach + push o'rniga map() ishlatish

## Nima uchun bu skill kerak
Massivni o'zgartirib yangi massiv yaratish kerak bo'lganda (transformatsiya) forEach ichida push qilish keng tarqalgan, lekin bu imperative usul bo'lib, side effect yaratadi, o'qilishini pasaytiradi va xatolarga moyil qiladi. map() funksional va toza yechim.

## Simptom (aynan shu)
- Yangi massiv kerak (masalan, har bir elementni 2 ga ko'paytirish yoki obyektlardan maydon olish).
- Kod quyidagicha ko'rinadi:
  ```js
  const result = [];
  items.forEach(item => {
    result.push(transform(item));
  });
  ```
- forEach faqat side effect uchun mo'ljallangan, lekin transformatsiya uchun ishlatilgan.
- Natija to'g'ri, lekin kod uzunroq va murakkabroq.

## Sabab (100%)
Dasturchi yoki agent forEach ni "loop" deb biladi va yangi massiv qurish uchun eng oddiy usul deb hisoblaydi. map() ni bilsa ham "push qilish osonroq" deb o'tkazib yuboradi. Bu odat eski imperative koddan keladi.

## Tasdiqlash
1. Maqsad yangi massiv yaratishmi (transformatsiya)?
2. forEach ichida faqat push (yoki shunga o'xshash side effect) bormi?
3. Har bir element mustaqil ravishda o'zgartirilayaptimi (boshqa elementlarga bog'liq emas)?

Agar ha bo'lsa — map() ga o'tkazish kerak.

## Tuzatish (aynan shu)
forEach + push ni map() bilan almashtir.

**Noto'g'ri:**
```js
const doubled = [];
numbers.forEach(n => {
  doubled.push(n * 2);
});
```

**To'g'ri:**
```js
const doubled = numbers.map(n => n * 2);
```

Murakkabroq holat:
```js
// Noto'g'ri
const names = [];
users.forEach(user => {
  if (user.active) {
    names.push(user.name.toUpperCase());
  }
});

// To'g'ri (filter + map)
const names = users
  .filter(user => user.active)
  .map(user => user.name.toUpperCase());
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Transformatsiya (yangi massiv yaratish) uchun har doim map() (yoki filter/map kombinatsiyasi) ishlat. forEach faqat haqiqiy side effect'lar (log, DOM o'zgartirish, tashqi holat) uchun. Bu kodni qisqaroq, o'qilishi oson va xatosiz qiladi.

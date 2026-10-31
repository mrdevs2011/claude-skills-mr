---
name: javascript-used-double-equals-loose-equality-instead-of-triple-equals-strict-equality-causing-unexpected-type-coercion
description: JavaScript da == (loose equality) ishlatilganda tip avtomatik o'zgartiriladi va kutilmagan True/False chiqadi; === (strict) ishlatish kerak.
---

# JavaScript da == o'rniga === ishlatish

## Nima uchun bu skill kerak
`==` operatori qiymatlarni solishtirishdan oldin tipni o'zgartiradi (type coercion). Bu kutilmagan natijalarga olib keladi, ayniqsa string/number, null/undefined, 0/false holatlarida. `===` tipni ham tekshiradi va xavfsizroq.

## Simptom (aynan shu)
Kod ba'zi inputlarda to'g'ri, ba'zilarida noto'g'ri ishlaydi. Masalan, `if (userAge == "18")` true bo'ladi, lekin `if (0 == false)` ham true. Yoki form input (string) bilan son solishtirishda xato.

## Sabab (100%)
ECMAScript da `==` Abstract Equality Comparison algoritmidan foydalanadi: agar tiplar farq qilsa, birini boshqasiga o'giradi (ToNumber, ToPrimitive va h.k.). `===` esa avval tipni tekshiradi, farq bo'lsa darhol false.

## Tasdiqlash
Kodda `==` yoki `!=` qidir. Test:

```javascript
console.log(0 == false);     // true
console.log(0 === false);    // false
console.log("" == 0);        // true
console.log(null == undefined); // true
console.log(null === undefined); // false
```

## Tuzatish (aynan shu)
Doim `===` va `!==` ishlat. Faqat maxsus holatda (masalan null/undefined birgalikda tekshirish) `==` ni ongli ishlat va komment qo'y.

```javascript
// Noto'g'ri
if (input == 0) { /* ... */ }
if (value != null) { /* ... */ }  // ba'zan qasddan

// To'g'ri
if (input === 0) { /* ... */ }
if (value !== null && value !== undefined) { /* ... */ }
// yoki
if (value != null) { /* ongli ravishda null va undefined uchun */ }
```

Agar eski kodda ko'p `==` bo'lsa, lint qoidasi (eqeqeq) yoq.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
JavaScript da qiymat solishtirish uchun doim `===` ishlat; `==` tip o'zgartirish tufayli kutilmagan natija beradi. Xavfsiz va oldindan aytib bo'ladigan kod uchun strict equality tanla.

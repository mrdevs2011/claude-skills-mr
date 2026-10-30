---
name: javascript-used-loose-equality-operator-instead-of-strict-equality-causing-unexpected-type-coercion
description: JavaScript'da `==` (loose equality) ishlatilganda tip o'zgarishi (type coercion) tufayli kutilmagan True/False chiqadi; doim `===` (strict) ishlatish kerak.
---

# JavaScript'da loose equality (`==`) o'rniga strict equality (`===`) ishlatish

## Nima uchun bu skill kerak
`==` operatori qiymatlarni solishtirishdan oldin tipni o'zgartiradi (type coercion). Bu "0 == false", "null == undefined", "'' == 0" kabi holatlarda True qaytaradi va mantiqiy xatolarga olib keladi. AI modellari ba'zan `==` ni "oddiy solishtirish" deb ishlatib, kutilmagan natijalar hosil qiladi.

## Simptom (aynan shu)
Kod ba'zi inputlarda to'g'ri, ba'zilarida noto'g'ri ishlaydi. Masalan, foydalanuvchi inputi yoki API dan kelgan string/number solishtirilganda `if (value == 0)` true bo'lib, lekin value aslida "0" yoki false bo'lishi mumkin. Console'da `0 == false` true, lekin `0 === false` false.

## Sabab (100%)
ECMAScript da `==` Abstract Equality Comparison algoritmidan foydalanadi: agar tiplar farq qilsa, birini boshqasiga o'giradi (Number, Boolean, String, Object va h.k.). `===` esa tip va qiymatni birga tekshiradi, hech qanday coercion yo'q. Ko'pchilik holatda `==` kutilmagan true beradi.

## Tasdiqlash
Kodda `==` yoki `!=` qidir. Test qil:

```javascript
console.log(0 == false);     // true
console.log(0 === false);    // false
console.log("" == 0);        // true
console.log("" === 0);       // false
console.log(null == undefined); // true
console.log(null === undefined); // false
```

Agar `==` ishlatilgan bo'lsa va tiplar farq qilishi mumkin bo'lsa — bu skill mos.

## Tuzatish (aynan shu)
Doim `===` va `!==` ishlat. Faqat maxsus holatlarda (masalan, null/undefined ni birga tekshirish uchun `== null`) ishlatish mumkin, lekin aniq komment bilan:

```javascript
// Noto'g'ri
if (userInput == 0) {
  handleZero();
}

// To'g'ri
if (userInput === 0 || userInput === "0") {
  handleZero();
}

// Yoki parse qil
const num = Number(userInput);
if (num === 0) {
  handleZero();
}
```

Linter (ESLint eqeqeq) bilan majburiy qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
JavaScript'da qiymat solishtirish uchun doim `===` (strict equality) ishlatish kerak. `==` type coercion tufayli kutilmagan true beradi. Bu oddiy, lekin keng tarqalgan xato — qat'iy tenglikni odatiy qil.

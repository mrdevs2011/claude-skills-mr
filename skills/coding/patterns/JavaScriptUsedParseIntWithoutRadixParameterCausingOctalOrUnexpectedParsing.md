---
name: javascript-used-parseint-without-radix-parameter-causing-octal-or-unexpected-parsing
description: parseInt("08") yoki "0x" bilan boshlangan stringlarda radix berilmaganda eski brauzerlarda octal, yoki kutilmagan NaN/noto'g'ri son chiqadi. Doim radix=10 yoki aniq asos berish kerak.
---

# JavaScript parseInt() radix parametersiz ishlatilganda noto'g'ri parsing

## Nima uchun bu skill kerak
`parseInt` ikkinchi argument (radix) berilmasa, ba'zi eski JavaScript dvigatellari "0" bilan boshlangan stringlarni octal (8-lik) deb talqin qiladi. Hozirgi ES5+ da asosan 10-lik, lekin baribir "0x" hex, yoki trailing non-digit holatlarda kutilmagan natija beradi va kod noaniq bo'ladi.

## Simptom (aynan shu)
- `parseInt("08")` eski muhitda `0` qaytaradi (octal 8 noto'g'ri), yangi muhitda `8`.
- `parseInt("0x10")` doim `16` (hex), lekin kutilgan 10-lik bo'lsa xato.
- `parseInt("123abc")` `123` qaytaradi — trailing qismini jim yutadi, xato bermaydi.
- Son o'rniga NaN yoki noto'g'ri qiymat keladi, ayniqsa user input yoki leading zero bo'lgan stringlarda.

## Sabab (100%)
ECMAScript spetsifikatsiyasiga ko'ra, radix berilmasa va string "0" bilan boshlansa, ba'zi implementationlar octal deb qabul qiladi (legacy). Hozirgi brauzerlar/Node da ko'pincha decimal, lekin bu kafolat emas va "0x"/"0o" prefikslar maxsus ishlanadi. Trailing non-numeric qism ham parse qilinadi va qolgani tashlanadi.

## Tasdiqlash
1. Kodda `parseInt(` chaqiruvlarini top, ikkinchi argument (radix) bormi tekshir.
2. Input string "0" bilan boshlanishi, "0x", yoki non-digit belgi bo'lishi mumkinligini ko'r.
3. Test:
```js
console.log(parseInt("08"));     // eski: 0, yangi: 8
console.log(parseInt("08", 10)); // doim 8
console.log(parseInt("0x10"));   // 16
console.log(parseInt("123abc")); // 123 (xato yutiladi)
```

## Tuzatish (aynan shu)
Doim aniq radix ber. Decimal uchun 10, boshqasi uchun kerakli asos. Trailing qismni oldindan tozalash yoki `Number()` / `parseFloat` ishlatishni o'ylab ko'r:

```js
// Noto'g'ri
const n = parseInt(userInput);          // leading zero, hex, trailing xavfi
const hex = parseInt("0xFF");           // kutilmagan

// To'g'ri
const n = parseInt(userInput, 10);      // doim decimal
const hex = parseInt("FF", 16);         // aniq hex, prefikssiz
// Yoki Number() ishlat (trailing uchun NaN beradi, ba'zan yaxshiroq):
const strict = Number(userInput);       // "123abc" -> NaN
```

Agar faqat butun son kerak bo'lsa, avval regex yoki isNaN bilan tekshir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`parseInt` da doim radix argumentini berish kerak (odatda 10). Parametersiz ishlatish leading zero, hex prefiks yoki trailing belgilarda kutilmagan natija beradi. Aniq va portativ kod uchun `parseInt(str, 10)` yoz.

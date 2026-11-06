---
name: javascript-json-parse-without-try-catch
description: JavaScript kodida JSON.parse() ishlatilganda try-catch yo'q — noto'g'ri yoki buzilgan JSON input uncaught SyntaxError beradi, dastur yiqiladi.
---

# JavaScriptUsedJSONParseOnUntrustedOrMalformedInputWithoutTryCatchCausingUncaughtSyntaxError

## Nima uchun bu skill kerak
JSON.parse() tashqi yoki foydalanuvchi inputini parse qilganda xato bo'lishi mumkin. Try-catch bo'lmasa, butun dastur crash qiladi.

## Simptom (aynan shu)
Kodda `JSON.parse(someString)` chaqirilgan, lekin try-catch yoki boshqa xato ushlash yo'q. Noto'g'ri JSON kelganda `Uncaught SyntaxError: Unexpected token ...` chiqadi va skript to'xtaydi.

## Sabab (100%)
JSON.parse() noto'g'ri formatdagi string uchun SyntaxError otadi. Tashqi manbadan (API, localStorage, user input, query param) kelgan data har doim valid bo'lmasligi mumkin. Xatoni ushlamaslik dastur barqarorligini buzadi.

## Tasdiqlash
1. Kodda JSON.parse chaqiruvini top.
2. U try { } catch (e) { } ichida emasligini tekshir.
3. Input manbai tashqi yoki ishonchsiz ekanini aniqlа (hardcoded valid JSON emas).
4. Browser console yoki Node da noto'g'ri JSON bilan test qil — SyntaxError chiqishi kerak.

## Tuzatish (aynan shu)
Har doim try-catch bilan o'ra. Default qiymat yoki xato log qil.

```javascript
// Noto'g'ri
const data = JSON.parse(rawInput);

// To'g'ri
let data = null;
try {
  data = JSON.parse(rawInput);
} catch (e) {
  console.error("Invalid JSON:", e.message);
  data = {}; // yoki default
}
```

Yoki helper funksiya:

```javascript
function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
const data = safeJsonParse(rawInput, {});
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
JSON.parse() ishonchsiz inputda har doim try-catch talab qiladi. Aks holda bitta buzilgan JSON butun ilovani yiqitadi. Safe parse helper yozib, default qiymat bering.

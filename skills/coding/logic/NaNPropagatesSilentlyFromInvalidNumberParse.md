---
name: nan-propagates-from-invalid-parse
description: parseInt/Number/parseFloat noto'g'ri input da NaN qaytaradi, keyin NaN hisob-kitob va solishtirishlarda jim tarqaladi — natija noto'g'ri, xato chiqmaydi.
---

# NaN: noto'g'ri parse dan jim tarqalish

## Nima uchun bu skill kerak
AI `parseInt(userInput)`, `Number(value)`, `+str` ishlatadi. Input bo'sh, harf, yoki noto'g'ri format bo'lsa — `NaN`. Keyin `NaN + 1 = NaN`, `NaN > 0 = false`, `NaN === NaN = false`. Xato yo'q, lekin barcha keyingi hisoblar buziladi. Bu tip coercion skilliga yaqin, lekin aynan NaN tarqalishi.

## Simptom (aynan shu)
- Natija `NaN` (ekranda yoki logda).
- Hisob-kitob "ishlamayapti", lekin exception yo'q.
- `parseInt("")`, `Number("abc")`, `parseFloat("12px")` (qisman) ishlatilgan.
- Solishtirish: `value > 0` — value NaN bo'lsa doim false.

## Sabab (100%)
Parse muvaffaqiyatsiz bo'lganda NaN qaytadi. AI `Number.isNaN` tekshiruvini yozmaydi. NaN arifmetikada "yuqumli".

## Tasdiqlash
1. `parseInt` / `Number` / `parseFloat` / `+` joylarini toping.
2. Input har doim to'g'ri raqammi?
3. `Number.isNaN(...)` tekshiruvi bormi?
4. Agar yo'q — NaN tarqalishi mumkin.

## Tuzatish (aynan shu)
Parse dan keyin darhol tekshiring:

```js
// XATO:
const n = parseInt(input, 10);
const total = n + tax;  // input noto'g'ri bo'lsa NaN

// TO'G'RI:
const n = Number(input);
if (Number.isNaN(n)) {
  throw new Error(`Invalid number: ${input}`);
  // yoki return default
}
const total = n + tax;

// parseInt uchun:
const n = parseInt(input, 10);
if (Number.isNaN(n)) { ... }

// Eslatma: parseInt("12abc") = 12 (qisman) — Number("12abc") = NaN
// Qattiq tekshiruv kerak bo'lsa Number yoki regex
```

Qoida: har qanday parse/Number dan keyin — `Number.isNaN` tekshir. NaN ni jim qabul qilmang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Noto'g'ri parse = NaN, xato emas.
- NaN keyingi hisoblarni buzadi.
- AI parse qilib, NaN tekshiruvini unutadi.
---
name: object-reference-equality-not-deep
description: Ikki obyekt/massiv === yoki == bilan solishtirilgan — referens tengligi, ichki qiymat emas. Ko'rinishda bir xil obyektlar "teng emas" chiqadi.
---

# Obyektni === bilan solishtirish (referens, qiymat emas)

## Nima uchun bu skill kerak
AI ikki obyekt yoki massivni `===` / `==` bilan tekshiradi. Ular ichki qiymati bir xil bo'lsa ham, turli referens bo'lsa — false. React'da state yangilanishi, cache, dedupe — noto'g'ri ishlaydi. Xato chiqmaydi, lekin mantiq buziladi.

## Simptom (aynan shu)
- `{a:1} === {a:1}` → false (kutilgan true).
- State "o'zgarmagan" deb hisoblanadi yoki aksincha har doim "o'zgargan".
- `if (prev === next)` — hech qachon true (yangi obyekt yaratilganda).
- Massiv/obyekt solishtirish kerak joyda `===` ishlatilgan.

## Sabab (100%)
`===` obyekt/massiv uchun referensni solishtiradi, ichini emas. AI "bir xil ko'rinadi" deb `===` yozadi.

## Tasdiqlash
1. Obyekt yoki massiv `===` / `==` bilan solishtirilgan joyni toping.
2. Ichki qiymat muhimmi, yoki aynan bir xil referensmi?
3. Agar qiymat muhim — deep compare kerak.

## Tuzatish (aynan shu)
Qiymat bo'yicha solishtiring:

```js
// XATO:
if (prevUser === nextUser) return; // har doim false (yangi obyekt)
if (a === b) { ... } // {x:1} va {x:1} false

// TO'G'RI — oddiy holat:
if (prevUser.id === nextUser.id && prevUser.name === nextUser.name)

// TO'G'RI — JSON (ketma-ketlik muhim emas bo'lsa ehtiyot):
if (JSON.stringify(a) === JSON.stringify(b))

// TO'G'RI — kutubxona:
import isEqual from 'lodash/isEqual';
if (isEqual(a, b))

// React da ko'pincha:
// state'ni yangilashda yangi referens kerak (mutate qilmang)
// solishtirishda esa id yoki aniq maydonlar
```

Qoida: obyekt/massiv uchun `===` = bir xil referens. Qiymat kerak bo'lsa — maydonma-maydon, JSON, yoki deep equal.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `===` obyektlarda referens, qiymat emas.
- Bir xil ko'rinadigan obyektlar turli referens bo'lishi mumkin.
- AI `===` ni qiymat tengligi deb ishlatadi — jim xato.
---
name: floating-point-precision-comparison
description: 0.1 + 0.2 === 0.3 kabi floating point solishtirish to'g'ridan-to'g'ri === bilan — false chiqadi. Pul, o'lchov, foiz hisoblarida xato.
---

# Floating point: to'g'ridan-to'g'ri === solishtirish

## Nima uchun bu skill kerak
AI `0.1 + 0.2 === 0.3` yoki `total === expected` yozadi. IEEE 754 tufayli `0.1 + 0.2 = 0.30000000000000004`. Natija false, xato chiqmaydi. Pul, foiz, koordinata hisoblarida jim bug.

## Simptom (aynan shu)
- `0.1 + 0.2 === 0.3` → false.
- Hisob "deyarli to'g'ri", lekin tenglik o'tmaydi.
- Pul/foiz/float solishtirishda `===` yoki `==`.
- Test ba'zan yiqiladi (float natija).

## Sabab (100%)
Floating point aniq emas. AI butun son kabi `===` ishlatadi.

## Tasdiqlash
1. Float/pul/foiz solishtirish joylarini toping.
2. `===` yoki `==` ishlatilganmi?
3. Kichik epsilon bilan farq bo'lishi mumkinmi?
4. Agar ha — shu.

## Tuzatish (aynan shu)
Epsilon yoki butun son (cent) ishlating:

```js
// XATO:
if (0.1 + 0.2 === 0.3) { ... }  // false

// TO'G'RI — epsilon:
function nearlyEqual(a, b, eps = 1e-10) {
  return Math.abs(a - b) < eps;
}
if (nearlyEqual(0.1 + 0.2, 0.3)) { ... }

// TO'G'RI — pul: cent da ishlang:
const priceCents = 10;  // 0.10
const taxCents = 20;    // 0.20
const totalCents = priceCents + taxCents; // 30
if (totalCents === 30) { ... }
```

Qoida: float tengligi — epsilon. Pul — butun (cent/tiyin).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `0.1 + 0.2 !== 0.3` — floating point.
- `===` float uchun ishonchsiz.
- AI aniq tenglik deb yozadi — jim xato.
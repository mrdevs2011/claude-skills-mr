---
name: division-by-zero-or-modulo-unguarded
description: Bo'lish yoki % operatsiyasi nolgacha tekshirilmagan — 0 ga bo'lish, NaN, Infinity yoki runtime xato.
---

# 0 ga bo'lish yoki modulo — guard yo'q

## Nima uchun bu skill kerak
AI `a / b` yoki `a % b` yozadi, `b === 0` holatini tekshirmaydi. Natija: `Infinity`, `NaN`, yoki ba'zi tillarda exception. Foiz, o'rtacha, qoldiq hisoblashda tez uchraydi. Xato ba'zan jim (NaN tarqaladi).

## Simptom (aynan shu)
- Natija `NaN` yoki `Infinity`.
- `x / count` — count 0 bo'lganda.
- `index % length` — length 0.
- Foiz: `(part / total) * 100` — total 0.

## Sabab (100%)
Bo'luvchi nol bo'lishi mumkinligi hisobga olinmagan. AI "har doim musbat" deb o'ylaydi.

## Tasdiqlash
1. `/` yoki `%` ishlatilgan joylarni toping.
2. Bo'luvchi 0 bo'lishi mumkinmi? (length, count, total, user input)
3. Oldin tekshiruv yoki default bormi?
4. Agar yo'q — xavf bor.

## Tuzatish (aynan shu)
0 ni tekshiring yoki xavfsiz default bering:

```js
// XATO:
const avg = total / count;
const pct = (part / total) * 100;
const i = index % items.length;

// TO'G'RI:
const avg = count === 0 ? 0 : total / count;
const pct = total === 0 ? 0 : (part / total) * 100;
const i = items.length === 0 ? 0 : index % items.length;

// Yoki:
if (count === 0) {
  return { avg: 0, message: 'Ma\'lumot yo\'q' };
}
```

Qoida: bo'lish/modulo dan oldin — bo'luvchi 0 emasligini tekshir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- 0 ga bo'lish — NaN/Infinity yoki crash.
- count, length, total — 0 bo'lishi mumkin.
- AI guard yozmasdan bo'lishadi.
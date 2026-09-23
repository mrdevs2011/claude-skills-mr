---
name: suggested-deprecated-api-or-outdated-pattern
description: AI eskirgan API, deprecated metod yoki eski pattern taklif qiladi — hozirgi versiyada ishlamaydi yoki ogohlantirish beradi.
---

# Deprecated API yoki eskirgan pattern

## Nima uchun bu skill kerak
AI training ma'lumotlaridan eski usullarni eslaydi: `componentWillMount`, `var`, `substr`, eski React Router, eski Node callback API. Kod "tanish" ko'rinadi, lekin hozirgi versiyada deprecated yoki olib tashlangan. Ishlamaydi yoki warning to'ldiradi.

## Simptom (aynan shu)
- Konsol: `deprecated`, `will be removed`, `use X instead`.
- Runtime xato: metod yo'q / API o'zgargan.
- AI yozgan kod hujjatlardagi "Legacy" yoki "Deprecated" bo'limiga mos.
- Loyiha yangi major versiyada, AI eski sintaksis bergan.

## Sabab (100%)
Model eski kod bazalarida ko'p o'qigan. Yangi hujjat yoki loyiha versiyasini tekshirmasdan "odatiy" yechimni yozadi.

## Tasdiqlash
1. Ishlatilgan API/metod nomini hujjatda qidiring.
2. "Deprecated" / "Legacy" / "Removed in vX" bormi?
3. Loyiha package.json dagi major versiya nima?
4. Agar eskirgan bo'lsa — shu.

## Tuzatish (aynan shu)
Hozirgi tavsiya etilgan alternativani ishlating:

```js
// XATO (eski):
str.substr(0, 5);
componentWillMount() { ... }
var x = 1;

// TO'G'RI:
str.slice(0, 5);
useEffect(() => { ... }, []);
const x = 1;

// XATO — eski React Router:
<Route component={Home} />

// TO'G'RI (v6):
<Route element={<Home />} />
```

Qoida: noma'lum yoki eski ko'ringan API ni yozishdan oldin — joriy hujjat/versiyani tekshir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- AI eski pattern'larni eslaydi — har doim yangi emas.
- Deprecated warning ni e'tiborsiz qoldirmang.
- Loyiha versiyasiga mos API tanlang.
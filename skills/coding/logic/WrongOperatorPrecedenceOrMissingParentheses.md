---
name: wrong-operator-precedence-or-missing-parens
description: Operatorlar ketma-ketligi (precedence) noto'g'ri tushunilgan yoki qavs qo'yilmagan — ifoda kutilganidan boshqacha hisoblanadi.
---

# Operator precedence / qavs yo'qligi

## Nima uchun bu skill kerak
AI `a + b * c`, `a || b && c`, `x ?? y || z` kabi ifodalarni yozadi va odam o'qigan tartibda ishlaydi deb o'ylaydi. Haqiqatda `*` `+` dan oldin, `&&` `||` dan oldin. Natija kutilganidan farq qiladi, xato chiqmaydi. Bu jim mantiq xatosi.

## Simptom (aynan shu)
- Hisob yoki shart kutilganidan boshqacha.
- `a + b * c` da avval qo'shish kutilgan, lekin ko'paytirish birinchi.
- `x || y && z` — && avval bajariladi.
- Qavs qo'yilmagan murakkab ifoda.

## Sabab (100%)
Operator precedence esdan chiqqan yoki e'tiborsiz. AI chapdan o'ngga o'qiydi, til esa o'z qoidasiga amal qiladi.

## Tasdiqlash
1. Murakkab ifodalarni toping (`+` `*` aralash, `||` `&&`, `??` `||`).
2. Kutilgan tartib nima? Haqiqiy precedence nima?
3. Qavs qo'yilganmi?
4. Agar tartib noaniq va qavs yo'q — xavf bor.

## Tuzatish (aynan shu)
Qavs bilan aniq qiling:

```js
// XATO — kutilgan (a+b)*c, aslida a+(b*c):
const r = a + b * c;

// TO'G'RI:
const r = (a + b) * c;

// XATO — || va &&:
if (a || b && c) { }  // = a || (b && c)

// TO'G'RI (agar (a||b) && c kerak bo'lsa):
if ((a || b) && c) { }

// XATO — ?? va ||:
const x = a ?? b || c;  // precedence noaniq o'qilishi mumkin

// TO'G'RI:
const x = (a ?? b) || c;
// yoki
const x = a ?? (b || c);
```

Qoida: murakkab ifodada — qavs qo'ying. O'qiyotgan odam (va AI) chalkashtirmasin.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Precedence chapdan-o'ngga emas — til qoidasiga bog'liq.
- Qavs = aniq niyat.
- AI qavsiz yozib, kutilmagan tartibda hisoblaydi.
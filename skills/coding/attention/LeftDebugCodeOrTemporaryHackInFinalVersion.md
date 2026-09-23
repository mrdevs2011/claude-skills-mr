---
name: left-debug-or-temporary-hack
description: AI debug uchun qo'ygan console.log, debugger, hardcoded true/false, vaqtinchalik return yoki TODO ni oxirgi kodda qoldirib yuboradi.
---

# Debug / vaqtinchalik kodni qoldirib ketish

## Nima uchun bu skill kerak
AI xatoni topish yoki tez ishlatish uchun `console.log`, `debugger`, `return true // temporary`, `// TODO: fix later`, `if (true)` kabi narsalarni qo'yadi. Keyin asosiy tuzatishni qilib, shu vaqtinchalik qismlarni olib tashlashni unutadi. Production'da log to'lib ketadi, mantiq buziladi yoki xavfsizlik teshigi ochiladi.

## Simptom (aynan shu)
- Yakuniy kodda:
  - `console.log(...)` (debug maqsadida qolgan)
  - `debugger;`
  - `// TODO`, `// FIXME`, `// temporary`, `// hack`
  - `if (true)` / `if (false)` yoki `return null; // later`
  - Hardcoded test qiymatlari (`userId = 1`)
- Foydalanuvchi "nima uchun log chiqyapti" yoki "bu vaqtinchalik kod qolgan" deb aytadi.

## Sabab (100%)
AI debug qilish paytida qo'shimcha kod yozadi va asosiy yechimga e'tibor qaratib, tozalash bosqichini o'tkazib yuboradi. Bu e'tibor chalg'ishi: "tuzatildi" deb hisoblab, orqaga qaytib tekshirmaydi.

## Tasdiqlash
1. O'zgarish qilingan fayllarda qidiring: `console.log`, `debugger`, `TODO`, `FIXME`, `temporary`, `hack`, `if (true)`, `if (false)`.
2. Ular asosiy mantiqqa tegishlimi yoki faqat debug uchunmi?
3. Agar debug/vaqtinchalik bo'lsa — olib tashlanishi kerak.

## Tuzatish (aynan shu)
Yakuniy javobdan oldin tozalang:

```js
// XATO — qolgan debug:
console.log('user:', user);
debugger;
if (true) { // temporary force
  return doSomething();
}
// TODO: handle error properly
return null;

// TO'G'RI — tozalangan:
return doSomething();
```

Qoida: "Tuzatdim" demasdan oldin — qo'shgan barcha vaqtinchalik/debug qismlarni olib tashlang yoki aniq qilib qoldiring (va izoh yozing).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Debug kodi yakuniy versiyada qolmasligi kerak.
- AI asosiy tuzatishga e'tibor qaratib, tozalashni unutadi.
- Javob berishdan oldin: log, debugger, temporary, TODO ni tekshir.
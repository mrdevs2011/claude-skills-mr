---
name: code-does-not-compile-or-run
description: AI bergan kod sintaksis xato, yo'q import, yoki ishga tushmaydigan holatda — "yechim" deb yozilgan, lekin darhol xato beradi.
---

# Berilgan kod ishga tushmaydi / compile bo'lmaydi

## Nima uchun bu skill kerak
AI to'liq ko'rinadigan kod yozadi, lekin: yopilmagan qavs, yo'q import, mavjud bo'lmagan o'zgaruvchi, yoki runtime da darhol yiqiladigan joy. Foydalanuvchi nusxa ko'chirib ishga tushirganda xato oladi. Bu e'tibor chalg'ishi — yozishga e'tibor, tekshirishga emas.

## Simptom (aynan shu)
- Nusxa ko'chirilgan kod darhol SyntaxError / ReferenceError.
- Import qilinmagan identifikator.
- Qavs, qavs, backtick yopilmagan.
- "Bu kodni ishga tushiring" deb aytilgan, lekin ishlamaydi.

## Sabab (100%)
AI uzoq javob yozganda oxirini tekshirmaydi yoki kontekstdagi nomlarni chalkashtiradi. Compile/run qadamini o'tkazib yuboradi.

## Tasdiqlash
1. Berilgan kodni ko'zdan kechiring: qavs, import, e'lon.
2. Asosiy identifikatorlar import/e'lon qilinganmi?
3. Oddiy ishga tushirish (yoki mental parse) xato beradimi?
4. Agar ha — shu.

## Tuzatish (aynan shu)
Yuborishdan oldin tez tekshiruv:

```
// Tekshiruv ro'yxati:
// 1. Barcha { } ( ) ` yopilganmi?
// 2. Ishlatilgan nomlar import yoki e'lon qilinganmi?
// 3. async funksiya await qilinganmi / chaqirilganmi?
// 4. Eng kamida "happy path" ishga tushadimi?
```

Qoida: "ishga tushiring" demasdan oldin — o'zingiz mental yoki haqiqiy run qiling. Kesilgan/yaroqsiz kod bermang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Yozilgan kod ≠ ishlaydigan kod.
- Yuborishdan oldin sintaksis va importlarni tekshiring.
- AI uzun javobda xato qoldirishi mumkin.
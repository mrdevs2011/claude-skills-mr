---
name: ignored-existing-tests-or-broke-them
description: AI kod o'zgartirdi, mavjud testlar yiqildi yoki e'tiborsiz qoldirildi — testlarni yangilamasdan yoki ishga tushirmasdan "tayyor" deb yopdi.
---

# Mavjud testlarni e'tiborsiz qoldirish yoki sindirish

## Nima uchun bu skill kerak
Loyihada testlar bor. AI funksiya/signature ni o'zgartiradi, lekin testlarni ishga tushirmaydi yoki yangilamaydi. CI yiqiladi, yoki regressiya sezilmay qoladi. Bu verifikatsiya va e'tibor chalg'ishining testga oid shakli.

## Simptom (aynan shu)
- Kod o'zgardi, `npm test` / `pytest` yiqiladi.
- Test fayllari o'zgarmagan, lekin expectation endi noto'g'ri.
- AI "tuzatildi" dedi, test haqida gapirmadi.
- Snapshot/assertion eskirgan.

## Sabab (100%)
AI asosiy kodga e'tibor qaratadi, test suite ni o'qimaydi yoki ishga tushirmaydi. "Mantiq to'g'ri" deb testni e'tiborsiz qoldiradi.

## Tasdiqlash
1. Loyihada test bormi (`*.test.*`, `__tests__`, `spec`)?
2. O'zgarish qilingan funksiya/modul test qilinganmi?
3. Testlar ishga tushirildimi? Yiqildimi?
4. Agar yiqilgan va yangilanmagan — shu.

## Tuzatish (aynan shu)
O'zgarish bilan testlarni ham yangilang:

```
// XATO:
// 1. Signature/mantiq o'zgardi
// 2. Testlar e'tiborsiz
// 3. "Tuzatildi"

// TO'G'RI:
// 1. Kod o'zgartir
// 2. Tegishli testlarni top
// 3. Ishga tushir — yiqilsa, testni yoki kodni moslashtir
// 4. Yashil bo'lgach "tayyor" de
```

Qoida: mavjud test — shartnoma. Uni sindirish = yangilash yoki sababini tushuntirish.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Kod o'zgarishi testlarni ham o'z ichiga oladi.
- Test yiqilsa — e'tiborsiz qoldirmang.
- AI asosiy kodga e'tibor berib, testni unutadi.
---
name: incomplete-answer-stopped-halfway
description: AI javobni yarim yo'lda to'xtatadi — kod kesilgan, qadamlar tugallanmagan, "davom ettirish" kerak bo'ladi. Foydalanuvchi to'liq yechim olmaydi.
---

# Javob yarim yo'lda to'xtagan

## Nima uchun bu skill kerak
AI uzun kod yoki ko'p qadamli yechim yozayotganda javobni kesib qo'yadi: funksiya yarmi, import yo'q, oxirgi qadam yo'q. Yoki "qolganini o'zingiz qo'shing" deb qoldiradi. Foydalanuvchi to'liq ishlaydigan yechim olmaydi. Bu e'tibor/uzunlik chalg'ishi.

## Simptom (aynan shu)
- Kod bloki yopilmagan yoki oxiri yo'q.
- "..." yoki "// qolgan qism" bilan to'xtagan.
- Rejada 5 qadam, faqat 2–3 tasi bajarilgan.
- Foydalanuvchi "davom ettiring" yoki "to'liq kod kerak" deb yozadi.

## Sabab (100%)
Javob uzunligi chegarasi yoki AI "asosiysi shu" deb qisqartiradi. To'liqlikni tekshirish bosqichini o'tkazib yuboradi.

## Tasdiqlash
1. Javobda ochiq qolgan kod, kesilgan blok, yoki "..." bormi?
2. Vada qilingan qadamlarning hammasi bormi?
3. Foydalanuvchi qo'shimcha so'rovsiz ishga tushira oladimi?
4. Agar yo'q — to'liq emas.

## Tuzatish (aynan shu)
Javobni yuborishdan oldin tekshiring:

```
// XATO:
function process(data) {
  const result = data.map(x => {
    // ...
// (kesilgan)

// TO'G'RI:
// 1. Kod to'liq yopilgan
// 2. Import/export bor
// 3. Ishga tushirish uchun yetarli
// 4. Agar juda uzun bo'lsa — asosiy qismni to'liq, qolganini aniq "keyingi qadam" deb ajrat
```

Qoida: yuborishdan oldin — kod ishga tushadimi? Qadamlar tugallanganmi? Kesilgan joy yo'qmi?

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Yarim javob = foydalanuvchi qo'shimcha so'rashga majbur.
- Yuborishdan oldin to'liqlikni tekshiring.
- AI uzunlik tufayli yoki shoshilib kesib qo'yadi.
---
name: did-not-verify-fix-against-original-error
description: AI "tuzatildi" deb aytadi, lekin asl xato matni yoki reproduksiya qadami bilan qayta tekshirmagan — xato qolgan yoki boshqa joyga ko'chgan bo'lishi mumkin.
---

# Tuzatishni asl xato bilan tekshirmaslik

## Nima uchun bu skill kerak
AI kod o'zgartiradi va darhol "tuzatildi" deb yozadi. Asl xato matni, stack trace yoki foydalanuvchi bergan reproduksiya qadami bilan qayta ishga tushirmaydi. Ba'zan xato qoladi, ba'zan yangi xato chiqadi, ba'zan boshqa joyga ko'chadi. Bu ClaimedFixedWithoutActuallyRunning skillining aniqroq shakli — aynan original error ga qarab tekshirish.

## Simptom (aynan shu)
- "Tuzatildi" deb aytilgan, lekin foydalanuvchi "hali ham xato" deb qaytadi.
- Asl xato matni (TypeError, 404, ...) javobda qayta tilga olinmagan.
- O'zgarish qilingan, lekin xato chiqadigan yo'l (URL, input, qadam) sinab ko'rilmagan.
- AI "mantiqan to'g'ri" deb hisoblaydi, lekin runtime da tekshirmagan.

## Sabab (100%)
AI kod o'zgarishini "yechim" deb qabul qiladi va verifikatsiya bosqichini o'tkazib yuboradi. Asl simptom bilan solishtirishni unutadi.

## Tasdiqlash
1. Asl xato matni / reproduksiya qadami bormi?
2. O'zgarishdan keyin o'sha qadam qayta bajarildimi?
3. Xato matni yo'qoldimi yoki o'zgardimi?
4. Agar tekshirilmagan bo'lsa — shu.

## Tuzatish (aynan shu)
Har doim asl xato bilan solishtiring:

```
// XATO:
// 1. Kod o'zgartirildi
// 2. "Tuzatildi" deb yozildi
// 3. Asl xato qayta chiqarilmadi

// TO'G'RI:
// 1. Asl xato matnini saqlab qo'y
// 2. O'zgarish qil
// 3. Xuddi shu qadam/input/URL bilan qayta ishga tushir
// 4. Xato yo'qoldimi? Boshqa xato chiqdimi?
// 5. Faqat shundan keyin "tuzatildi" de
```

Qoida: "tuzatildi" = asl simptom qayta tekshirib, yo'qolganini ko'rgan. Mantiqiy o'xshashlik yetarli emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Kod o'zgartirish ≠ tuzatish tasdiqlangan.
- Asl xato matni / qadam bilan qayta tekshirish majburiy.
- AI "mantiqan to'g'ri" deb verifikatsiyani tashlab ketadi.
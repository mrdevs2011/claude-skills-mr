---
name: claimed-fixed-without-verifying
description: AI "tuzatildi" yoki "endi ishlaydi" deb yozadi, lekin kodni ishga tushirmagan, test qilmagan yoki natijani ko'rmagan — faqat taxmin qilgan.
---

# "Tuzatildi" deb aytish, lekin tekshirmaslik

## Nima uchun bu skill kerak
AI (hatto kuchli modelllar) eng ko'p qiladigan e'tiborsizlik: kodni o'zgartirib, "endi to'g'ri bo'lishi kerak" deb yozadi va to'xtaydi. Haqiqatan ishga tushirish, log qilish yoki test qilish bosqichini o'tkazib yuboradi. Natijada foydalanuvchi "tuzatildi" deb o'ylaydi, lekin xato hali bor.

## Simptom (aynan shu)
- Javobda "tuzatildi", "endi ishlashi kerak", "muammo hal qilindi" degan iboralar bor.
- Lekin:
  - Hech qanday `node`, `npm test`, brauzer tekshiruvi yoki log ko'rsatilmagan.
  - "Ishga tushirib ko'ring" deb foydalanuvchiga qoldirilgan.
  - Yoki "mantiqan to'g'ri" deb asoslangan, lekin runtime natijasi yo'q.

## Sabab (100%)
AI o'z o'zgarishiga ishonib, tekshirish qadamini o'tkazib yuboradi. Bu e'tibor chalg'ishi: "kod yozdim = ishlaydi" deb hisoblaydi. Ayniqsa uzoq suhbatlarda yoki bir nechta fayl o'zgarganda tez-tez uchraydi.

## Tasdiqlash
1. AI javobida "tuzatildi / ishlaydi" degan da'vo bormi?
2. Shu da'vodan oldin yoki keyin haqiqiy ishga tushirish (buyruq, test, log) natijasi ko'rsatilganmi?
3. Agar yo'q bo'lsa — bu aynan shu.

## Tuzatish (aynan shu)
Hech qachon tekshirmasdan "tuzatildi" demang:

```
// XATO uslub:
"Xatoni tuzatdim, endi ishlashi kerak."

// TO'G'RI uslub:
1. O'zgarishni qil
2. Ishga tushir / test qil / log qarab chiq
3. Natijani ko'rsat: "Ishga tushirdim, chiqdi: ..."
4. Faqat shundan keyin "tuzatildi" de
```

Agar muhitda ishga tushirib bo'lmasa — ochiq ayt: "Kodni o'zgartirdim, lekin ishga tushirib tekshira olmadim. Iltimos, shu buyruqni bajaring va natijani yuboring."

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- "Tuzatildi" faqat tekshirgandan keyin aytiladi.
- Taxmin qilib "ishlaydi" demaslik — AI eng ko'p shu yerda chalg'iydi.
- Tekshirib bo'lmasa — ochiq aytib, foydalanuvchidan yordam so'rash.
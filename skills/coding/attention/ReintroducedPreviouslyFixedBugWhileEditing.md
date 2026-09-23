---
name: reintroduced-previously-fixed-bug
description: AI boshqa joyni tuzatayotganda yoki refaktor qilayotganda avval tuzatilgan bug'ni qayta kiritib yuboradi — e'tibor chalg'ishi tufayli eski xato qaytadi.
---

# Avval tuzatilgan bug'ni qayta kiritish

## Nima uchun bu skill kerak
AI bir muammoni tuzatadi, keyin boshqa joyda ishlayotganda o'sha joyga qaytib, eski (noto'g'ri) variantni yozib yuboradi. Yoki refaktor paytida avvalgi tuzatishni "soddalashtirib" olib tashlaydi. Natijada regressiya — "bu allaqachon ishlagan edi". Bu e'tibor chalg'ishining xavfli shakli.

## Simptom (aynan shu)
- Foydalanuvchi: "Bu avval ishlagan, endi yana buzildi".
- Git history'da bir xato tuzatilgan, keyin o'sha joy yana o'zgargan.
- AI "tozalash" yoki "soddalashtirish" paytida guard, tekshiruv yoki maxsus holatni olib tashlagan.
- Testlar (agar bor bo'lsa) qayta yiqila boshlagan.

## Sabab (100%)
AI kontekstni to'liq ushlab turolmaydi yoki "bu kod ortiqcha" deb o'ylab, avvalgi tuzatishni olib tashlaydi. Yoki bir nechta o'zgarish qilganda eski faylni qayta yozib, tuzatishni yo'qotadi.

## Tasdiqlash
1. Hozirgi xato avval ham bo'lganmi? (suhbat tarixi, git, foydalanuvchi izohi)
2. O'sha joy yaqinda AI tomonidan o'zgartirilganmi?
3. O'zgarish "tozalash/soddalashtirish" sifatida asoslanganmi, lekin maxsus holat olib tashlanganmi?
4. Agar ha — regressiya.

## Tuzatish (aynan shu)
Avvalgi tuzatishni qaytaring va o'zgarish qilishda ehtiyot bo'ling:

```
// XATO yondashuv:
// 1. Bug tuzatildi (masalan null check qo'shildi)
// 2. Keyinroq "kodni tozalayman" deb null check olib tashlandi
// 3. Bug qaytdi

// TO'G'RI:
// 1. Mavjud tuzatishlarni o'qing — nima uchun qo'shilgan
// 2. "Ortiqcha" deb o'ylagan narsani olib tashlamang, sababini bilmasdan
// 3. Katta o'zgarishdan oldin tegishli test/holatlarni eslang
```

Qoida: ishlayotgan maxsus holat/guard ni olib tashlamang, sababini tushunmasdan. Refaktor = xulq-atvor o'zgarishi emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Tuzatilgan joyga qayta tegish — regressiya xavfi.
- "Tozalash" paytida maxsus holatlarni olib tashlamang.
- AI kontekstni yo'qotib, eski xatoni qayta yozishi mumkin.
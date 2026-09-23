---
name: rewrote-working-code-unrequested
description: Bir joydagi xatoni tuzatayotganda AI ishlayotgan boshqa kodni "yaxshilab" yoki qayta yozib yuboradi — so'ralmagan refactor, uslub o'zgarishi yoki butunlay boshqa yechim.
---

# Ishlayotgan kodni so'ralmasdan qayta yozish

## Nima uchun bu skill kerak
AI xatoni tuzatayotganda atrofdagi kodni ko'rib "bu yerda ham yaxshilasa bo'ladi" deb o'ylaydi va ishlayotgan qismni o'zgartirib yuboradi. Natijada asl xato tuzalishi mumkin, lekin yangi muammolar chiqadi yoki kod uslubi butunlay o'zgaradi. Bu e'tibor chalg'ishining eng keng tarqalgan shakli.

## Simptom (aynan shu)
- Foydalanuvchi bitta aniq xato/so'rov bergan.
- AI javobida:
  - So'ralmagan fayllar o'zgargan.
  - Ishlayotgan funksiya "toza"roq qilib qayta yozilgan.
  - Nomlar, struktura yoki yondashuv o'zgargan (lekin so'ralmagan).
- Foydalanuvchi "men buni so'ramagan edim" yoki "avvalgi kodim ishlayotgan edi" deb munosabat bildiradi.

## Sabab (100%)
AI "yaxshiroq kod" yozishga o'rgatilgan, shuning uchun xato atrofidagi kodni ham "tozalash"ga urinadi. U asl vazifa chegarasini unutadi va "yo'lda ko'rgan" narsalarni o'zgartirib yuboradi. Bu `StayScoped` skillining aniqroq, xato tuzatish kontekstidagi ko'rinishi.

## Tasdiqlash
1. Foydalanuvchi so'rovini qayta o'qing — aynan nima so'ralgan?
2. AI qilgan o'zgarishlar ro'yxatini chiqaring.
3. Har bir o'zgarish so'rovga to'g'ridan-to'g'ri tegishlimi?
4. Agar "bu yerda ham yaxshilandi" deb asoslangan o'zgarish bo'lsa — bu shu.

## Tuzatish (aynan shu)
Faqat so'ralgan joyni o'zgartiring:

```
// XATO yondashuv:
// 1. Xatoni topdi
// 2. Atrofdagi kodni ham "tozaladi"
// 3. Nomlarni o'zgartirdi
// 4. Yondashuvni almashtirdi

// TO'G'RI yondashuv:
// 1. Xatoni top
// 2. Eng kichik o'zgarish bilan tuzat
// 3. Boshqa joyga umuman tegma
// 4. Agar katta yaxshilash kerak deb o'ylasang — avval so'ra
```

Agar ishlayotgan kod "xunuk" ko'rinasa ham — so'ralmagan bo'lsa, qoldiring. Keyin alohida so'rovda qilish mumkin.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Xato tuzatish ≠ atrofni tozalash.
- Ishlayotgan kodni so'ralmasdan o'zgartirish — AI eng ko'p chalg'iy digan joy.
- Eng kichik, aniq o'zgarishni tanlang; qolganini keyinga qoldiring.
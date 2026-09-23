---
name: changed-too-many-files-without-plan
description: AI bir so'rovga javoban 5+ faylni bir yo'la o'zgartiradi, reja aytmasdan — qaysi o'zgarish nima uchun ekani noaniq, regressiya xavfi yuqori.
---

# Bir yo'la ko'p faylni o'zgartirish (rejasiz)

## Nima uchun bu skill kerak
AI kichik so'rov yoki bitta xatoga javoban bir nechta faylni birdaniga o'zgartiradi. Qaysi o'zgarish asosiy, qaysi "yo'lda yaxshilash" ekani ajralmaydi. Keyin biror joy buzilsa — qaysi o'zgarish sabab ekanini topish qiyin. Bu e'tibor chalg'ishi: "hammasini birga qilay" deb, kichik qadam va reja tamoyilini unutish.

## Simptom (aynan shu)
- Bitta so'rovga 5, 10 yoki undan ortiq fayl o'zgargan.
- AI oldindan "nima o'zgaradi" deb qisqa reja aytmagan.
- Ba'zi o'zgarishlar so'rovga to'g'ridan-to'g'ri bog'liq emas.
- Foydalanuvchi "nima uchun bu fayl ham o'zgardi?" deb so'raydi.

## Sabab (100%)
AI bog'liqliklarni ko'rib, "shu ham kerak" deb kengaytirib ketadi. Yoki "to'liq yechim" deb hammasi ni bir commit'da qilishga urinadi. Kichik, tekshiriladigan qadamlar o'rniga katta o'zgarish.

## Tasdiqlash
1. So'rov nima edi — qancha hajmda?
2. O'zgargan fayllar soni?
3. Har bir fayl o'zgarishi so'rovga to'g'ridan-to'g'ri kerakmi?
4. Oldindan reja (qaysi fayllar, nima uchun) aytilganmi?

## Tuzatish (aynan shu)
Avval reja, keyin kichik qadamlar:

```
// XATO:
// 1. So'rov keldi
// 2. 8 ta fayl birdan o'zgardi
// 3. "Tuzatildi" 

// TO'G'RI:
// 1. So'rovni tushun
// 2. Qisqa reja ayt: "3 ta fayl o'zgaradi: A (asosiy), B (chaqiruv), C (tip)"
// 3. Birinchi faylni o'zgartir, tekshir
// 4. Keyingisini qil
// 5. So'ralmagan joyga tegma
```

Qoida: 3+ fayl o'zgaradigan bo'lsa — avval reja ayt. Har bir o'zgarish so'rovga bog'liq bo'lsin. Katta o'zgarishni kichik PR/qadamlarga bo'ling.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Ko'p fayl = yuqori regressiya xavfi va noaniqlik.
- Avval reja, keyin o'zgarish.
- AI "hammasini birga" qilib, qaysi o'zgarish nima uchun ekanini chalkashtiradi.
---
name: copied-code-without-adapting-style
description: AI boshqa joydan (yoki o'zi yozgan namuna) kodni ko'chirib qo'yadi, lekin mavjud loyiha uslubi, nomlash, import yo'llari yoki arxitekturasiga moslashtirmaydi.
---

# Kodni ko'chirib, uslubga moslashtirmaslik

## Nima uchun bu skill kerak
AI tez yechim topish uchun o'zi bilgan namuna yoki boshqa fayldan kodni deyarli o'zgartirmasdan qo'yadi. Natijada: boshqa nomlash uslubi, boshqa import yo'li, boshqa error handling, yoki umuman boshqa arxitektura. Kod ishlashi mumkin, lekin loyiha ichida "yot" ko'rinadi va keyinroq muammo chiqaradi.

## Simptom (aynan shu)
- Yangi kod atrofdagi koddan sezilarli farq qiladi:
  - camelCase vs snake_case
  - `try/catch` uslubi boshqacha
  - import yo'llari boshqacha (`@/` vs `../../`)
  - funksiya nomlari yoki fayl tuzilishi boshqacha
- Yoki AI "standart" deb o'zi bilgan pattern'ni kiritgan, lekin loyihada boshqa pattern ishlatiladi.

## Sabab (100%)
AI o'z trainingidagi yoki suhbatdagi birinchi mos namuna asosida yozadi va mavjud kod bazasini diqqat bilan o'qib, uslubga moslashtirishni o'tkazib yuboradi. Bu e'tibor chalg'ishi: "ishlasin" deb, "mos kelishi"ni unutadi.

## Tasdiqlash
1. Yangi yozilgan kodni atrofdagi 2-3 ta o'xshash joy bilan solishtiring.
2. Nomlash, import, error handling, struktura bir xilmi?
3. Agar sezilarli farq bo'lsa — moslashtirilmagan.

## Tuzatish (aynan shu)
Avval mavjud uslubni o'qing, keyin yozing:

```
// XATO yondashuv:
// 1. O'zi bilgan namuna asosida yozdi
// 2. Loyiha uslubiga qaramadi

// TO'G'RI yondashuv:
// 1. Shu loyihada o'xshash joy qanday yozilganini ochib ko'r
// 2. Xuddi shu nomlash, import, struktura, error handling bilan yoz
// 3. Faqat kerakli mantiqni o'zgartir
```

Agar loyihada aniq uslub (lint, prettier, naming convention) bo'lsa — unga rioya qiling. Yangi uslub kiritmang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Kod ishlashi yetarli emas — loyiha uslubiga mos kelishi kerak.
- Yozishdan oldin atrofdagi kodni o'qing.
- AI o'zi bilgan namuna asosida yozib, moslashtirishni unutishi eng ko'p chalg'ishlardan.
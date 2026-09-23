---
name: solution-for-wrong-language-or-framework
description: Foydalanuvchi aniq til/framework aytgan (masalan Vue, Python), AI boshqasida (React, JS) yechim bergan — talabga mos kelmaydi.
---

# Noto'g'ri til yoki framework da yechim

## Nima uchun bu skill kerak
Foydalanuvchi "Vue 3 da", "Django", "Flutter" deb aniq aytadi. AI o'zi ko'p ko'rgan stack da (React, Express, ...) yozadi. Kod ishlashi mumkin, lekin so'ralgan texnologiya emas. Bu cheklovni e'tiborsiz qoldirishning aniq shakli.

## Simptom (aynan shu)
- So'rovda til/framework aniq yozilgan.
- Javob boshqa til yoki boshqa framework da.
- Foydalanuvchi: "Men Vue so'ragan edim, React yozdingiz".
- Import/API lar boshqa ekotizimga tegishli.

## Sabab (100%)
AI default yoki eng ko'p training ko'rgan stack ga o'tadi. So'rovdagi aniq texnologiya nomini e'tiborsiz qoldiradi.

## Tasdiqlash
1. So'rovdagi til/framework/platformani ajrating.
2. Javobdagi import, sintaksis, API shu stack gami?
3. Agar yo'q — shu.

## Tuzatish (aynan shu)
So'ralgan stack da yozing:

```
// XATO:
// Foydalanuvchi: "Vue 3 Composition API da qil"
// AI: React useState/useEffect yozdi

// TO'G'RI:
// 1. Til/framework ni qayd et: Vue 3, script setup
// 2. Faqat shu ekotizim API larini ishlat
// 3. Agar ishonchsiz bo'lsang — so'ra, boshqa stack ga o'tma
```

Qoida: aniq aytilgan til/framework = majburiy. Default stack ga o'tmang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- So'ralgan texnologiya = javob texnologiyasi.
- AI o'z "qulay" stack iga o'tishi mumkin — to'xtating.
- Cheklov sifatida til/framework ni birinchi o'qing.
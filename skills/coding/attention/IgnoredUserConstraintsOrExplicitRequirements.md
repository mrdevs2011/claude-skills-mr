---
name: ignored-user-constraints-or-requirements
description: Foydalanuvchi aniq cheklov yoki talab bergan (til, format, "faqat X", "Y qilma"), AI uni e'tiborsiz qoldirgan yoki buzgan.
---

# Foydalanuvchi cheklovi / talabi e'tiborsiz qoldirilgan

## Nima uchun bu skill kerak
Foydalanuvchi "faqat TypeScript", "Python ishlatma", "3 fayldan oshirma", "izoh yozma", "o'zbekcha javob" deb aniq aytadi. AI boshqa til, qo'shimcha fayl, yoki boshqa formatda javob beradi. Bu e'tibor chalg'ishi — so'rovning cheklov qismini o'tkazib yuborish.

## Simptom (aynan shu)
- Foydalanuvchi: "men buni so'ramagan edim" / "faqat X deb aytgandim".
- Javobda taqiqlangan narsa bor (boshqa til, qo'shimcha scope, istalmagan format).
- Aniq "qilma" deb aytilgan ish qilingan.
- Til/format cheklovi buzilgan.

## Sabab (100%)
AI asosiy vazifaga e'tibor qaratib, cheklovlarni (constraints) ikkinchi darajali deb hisoblaydi yoki unutadi. Uzun so'rovda oxirgi/birinchi qism e'tiborsiz qoladi.

## Tasdiqlash
1. So'rovdagi barcha cheklovlarni ro'yxatlang: til, format, "faqat", "qilma", hajm.
2. Javob har biriga rioya qilganmi?
3. Agar bittasi buzilgan bo'lsa — shu.

## Tuzatish (aynan shu)
Javob yozishdan oldin cheklovlarni qayta o'qing:

```
// XATO:
// Foydalanuvchi: "Faqat JS, TypeScript yozma, izoh qo'shma"
// AI: TypeScript + ko'p izoh yozdi

// TO'G'RI:
// 1. Cheklovlarni ajratib yoz: faqat JS, izoh yo'q
// 2. Javobni shu doirada yoz
// 3. Yuborishdan oldin: cheklov buzilganmi deb tekshir
```

Qoida: aniq cheklov = majburiy. Asosiy vazifa bilan bir xil muhim.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Cheklovlar ikkinchi darajali emas — buzilmasligi kerak.
- Yuborishdan oldin "qilma / faqat" larni tekshiring.
- AI asosiy yechimga shoshilib, cheklovni unutadi.
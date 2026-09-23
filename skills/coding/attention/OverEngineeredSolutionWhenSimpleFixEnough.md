---
name: over-engineered-when-simple-enough
description: Oddiy tuzatish yetarli bo'lgan holatda AI murakkab arxitektura, yangi abstraksiya, qo'shimcha fayl yoki pattern kiritadi — so'ralmagan murakkablik.
---

# Oddiy joyda ortiqcha murakkablik

## Nima uchun bu skill kerak
AI kichik xato yoki so'rovni ko'rib, "to'g'ri yo'l" deb yangi class, hook, service, util fayl, yoki butun pattern kiritadi. Aslida 2-3 qatorlik tuzatish yetarli edi. Natijada kod o'qish qiyinlashadi, bog'liqlik ko'payadi, keyingi o'zgarishlar qimmatga tushadi. Bu e'tibor chalg'ishi: "yaxshi kod" deb o'ylash, "yetarli kod"ni unutish.

## Simptom (aynan shu)
- Foydalanuvchi kichik narsa so'ragan (bitta xato, bitta maydon).
- AI yangi fayl, yangi abstraksiya, yangi dependency yoki katta refaktor qilgan.
- Yechim ishlaydi, lekin keragidan ancha katta.
- Foydalanuvchi "bunicha kerak emas edi" yoki "oddiyroq qilsangiz bo'lardi" deb aytadi.

## Sabab (100%)
AI "best practice" va "clean architecture" ga o'rgatilgan. Kichik muammoni ham katta yechim bilan yopishga urinadi. Vazifa chegarasini va "eng kichik o'zgarish" tamoyilini unutadi.

## Tasdiqlash
1. So'rov/xato nima edi — qancha hajmda?
2. AI qilgan o'zgarish hajmi (yangi fayllar, yangi abstraksiyalar)?
3. Xuddi shu natijani 5-10 qator bilan olish mumkinmi edi?
4. Agar ha — ortiqcha murakkablik.

## Tuzatish (aynan shu)
Eng kichik ishlaydigan yechimni tanlang:

```
// XATO yondashuv:
// 1. Kichik xato
// 2. Yangi UserService class
// 3. Yangi hook
// 4. Yangi util fayl
// 5. Dependency injection

// TO'G'RI yondashuv:
// 1. Kichik xato
// 2. Aynan shu joyda 2-3 qator tuzatish
// 3. Agar keyin takrorlansa — unda abstraksiya haqida o'ylash
```

Qoida: avval eng oddiy ishlaydigan yechim. Murakkablik faqat qayta-qayta kerak bo'lganda yoki aniq so'ralganda.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Ishlaydigan eng kichik yechim — eng yaxshi birinchi qadam.
- AI "to'g'ri arxitektura" deb ortiqcha murakkablik kiritadi.
- Kichik so'rov = kichik o'zgarish. Katta refaktor — alohida so'rov.
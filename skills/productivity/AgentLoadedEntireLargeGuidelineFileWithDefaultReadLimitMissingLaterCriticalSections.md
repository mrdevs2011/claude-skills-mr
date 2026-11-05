---
name: loaded-entire-large-guideline-missing-later-sections
description: Katta qo'llanma fayllarini (architecture.md, instruction.md) read_file default limit bilan o'qib, keyingi muhim bo'limlarni o'tkazib yuborish — skill yaratishda format yoki qoidalarni to'liq bilmaslik.
---

# Katta qo'llanma faylini to'liq o'qimasdan default limit bilan cheklanish

## Nima uchun bu skill kerak
architecture.md, instruction.md kabi qo'llanmalar 200+ qator bo'lishi mumkin. `read_file` default limit (2000, lekin tool ba'zan qisqartiradi yoki foydalanuvchi limit=200 beradi) bilan o'qilsa, keyingi bo'limlar (kategoriya qoidalari, kengaytirish nuqtalari, router qoidalari) ko'rinmaydi. Natijada skill noto'g'ri formatda yoziladi yoki muhim qoida buziladi.

## Simptom (aynan shu)
- Skill yaratishdan oldin architecture.md yoki instruction.md o'qilgan, lekin faqat birinchi 100-200 qator.
- Keyingi muhim qismlar (masalan "Yangi skill qo'shish tartibi", kategoriya ro'yxati, 6 bo'lim formati to'liq) o'qilmagan.
- Tool natijasida "[truncated: showing first...]" yoki limit tufayli to'liq emasligi ko'rinadi, lekin offset bilan davom ettirilmagan.
- Yaratilgan skill formatga to'liq mos kelmaydi yoki kategoriya noto'g'ri tanlangan.

## Sabab (100%)
Agent bir marta read_file chaqirib, natijani to'liq deb hisoblagan. Agar output truncated yoki limit yetmaganini sezsa ham, `offset` va `limit` bilan keyingi qismni so'ramagan. "Yetarli o'qidim" deb taxmin qilgan.

## Tasdiqlash
1. read_file natijasida "truncated" yoki "file has X total lines" degan xabar bormi?
2. Muhim bo'lim (masalan architecture.md dagi "Skill yozish qoidalari" oxiri yoki "Yangi skill qo'shish tartibi") o'qilganmi?
3. Agar limit berilgan bo'lsa, fayl uzunligidan kichikmi? `wc -l` bilan tekshir.
4. Keyingi offset bilan qo'shimcha o'qish chaqirilganmi?

## Tuzatish (aynan shu)
Katta fayllarni o'qishda:

1. Avval `bash` bilan `wc -l file.md` qilib uzunligini bil.
2. Agar 200+ qator bo'lsa, parallel yoki ketma-ket offset bilan o'qi:
   - read_file(file_path="architecture.md", limit=150, offset=1)
   - read_file(file_path="architecture.md", limit=150, offset=145)
3. Truncated degan xabarni ko'rsang, darhol offset bilan davom et.
4. Faqat kerakli bo'limni pattern bilan qidir (agar tool ruxsat bersa), lekin to'liq formatni bilish uchun o'qi.

Misol:
```
# Noto'g'ri: bir marta limit=200
read_file architecture.md limit=200

# To'g'ri:
read_file architecture.md limit=200 offset=1
# keyin agar kerak
read_file architecture.md limit=200 offset=180
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Katta qo'llanmalarni default limit bilan o'qib to'xtama — truncated yoki uzunlikni tekshir, offset bilan to'liq o'qi.
- Aks holda skill format yoki qoidalar to'liq bajarilmaydi.

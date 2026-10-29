---
name: agent-did-not-read-full-guidelines-before-creating-skill
description: Yangi skill yaratishdan oldin architecture.md, instruction.md va style.md to'liq o'qilmagan — natijada format, kategoriya, nomlash yoki uslub talablariga rioya qilinmagan skill paydo bo'ladi.
---

# Skill yaratishdan oldin qo'llanmalarni to'liq o'qimaslik

## Nima uchun bu skill kerak
Har bir yangi skill architecture.md dagi aniq formatga (frontmatter + 6 bo'lim), uzun tavsifli fayl nomiga, to'g'ri kategoriyaga va style.md dagi uslubga mos kelishi shart. Qo'llanmalarni o'qimasdan yoki qisman o'qib skill yozish format buzilishiga, qidiruvda topilmasligiga yoki dublikatlarga olib keladi.

## Simptom (aynan shu)
- Skill faylida frontmatter yo'q yoki name/description noto'g'ri.
- Bo'limlar yetishmaydi (Nima uchun, Simptom, Sabab, Tasdiqlash, Tuzatish, Xulosa).
- Fayl nomi qisqa yoki noaniq.
- Kategoriya noto'g'ri yoki architecture.md dagi ro'yxat yangilanmagan.
- Matn style.md ga zid (rasmiy, uzun, o'zbek tilida emas).

## Sabab (100%)
architecture.md, instruction.md va style.md to'liq o'qilmagan yoki faqat bosh qismi ko'rilgan. Agent "taxminan bilaman" deb davom etgan.

## Tasdiqlash
1. Skill yaratishdan oldin parallel ravishda architecture.md, instruction.md, style.md o'qilganmi?
2. Skill faylini ochib frontmatter va 6 bo'lim bormi tekshir.
3. Fayl nomi uzun va aniqmi?
4. README.md va architecture.md yangilanganmi (yangi kategoriya bo'lsa)?

## Tuzatish (aynan shu)
Skill yaratishdan oldin:

```bash
# Parallel o'qish (agent tool bilan):
# architecture.md, instruction.md, style.md ni bir vaqtda o'qi
# Formatni 100% qo'lla:
# ---
# name: kebab-case
# description: 1-2 jumla, simptom kalit so'zlari bilan
# ---
# Keyin 6 bo'lim.
```

Agar allaqachon yaratilgan bo'lsa — faylni to'g'rilab, README va architecture.md ni yangila.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Yangi skilldan oldin qo'llanmalarni to'liq o'qish majburiy.
- Format, nom, kategoriya va uslubga 100% amal qilish kerak.
- Qisman o'qish yoki taxmin qilish format buzilishiga olib keladi.

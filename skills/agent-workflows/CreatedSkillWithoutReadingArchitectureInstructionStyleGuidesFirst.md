---
name: created-skill-without-reading-guides
description: Yangi skill yaratishdan oldin architecture.md, instruction.md va style.md ni o'qimasdan formatga amal qilmaslik — noto'g'ri skill va qidiruvda topilmaslikka olib keladi.
---

# Skill yaratishdan oldin qo'llanmalarni o'qimaslik

## Nima uchun bu skill kerak
Agentlar yangi skill yozishda shoshilib, mavjud qoidalar va formatni o'qimasdan o'zicha fayl yaratadi. Natijada skill frontmatter, 6 ta majburiy bo'lim yoki kategoriya qoidalariga mos kelmaydi, search_skills uni topa olmaydi yoki noto'g'ri ishlaydi.

## Simptom (aynan shu)
- Yangi skill faylida frontmatter (name, description) yo'q yoki noto'g'ri.
- Majburiy bo'limlar (Nima uchun..., Simptom, Sabab, Tasdiqlash, Tuzatish, Xulosa) to'liq emas.
- Skill noto'g'ri papkaga qo'yilgan yoki umumiy maslahat sifatida yozilgan (tor simptom emas).
- README yoki architecture yangilanmagan.

## Sabab (100%)
Agent "skill yozish oson, o'zim bilaman" deb hisoblab, architecture.md, instruction.md va style.md ni o'qishni o'tkazib yuboradi. Mavjud namunalarni ham tekshirmaydi.

## Tasdiqlash
- Skill yaratishdan oldin architecture.md, instruction.md, style.md o'qilganmi?
- Mavjud skills/ papkasidagi namunalar ko'rilganmi (takrorlanmaslik va format uchun)?
- Yaratilgan fayl frontmatter + aniq 6 bo'limga ega mi?
- Kategoriya to'g'ri tanlanganmi?

## Tuzatish (aynan shu)
Skill yozishdan **oldin majburiy**:

1. `architecture.md` ni to'liq o'qi — format, nomlash, kategoriya qoidalari.
2. `instruction.md` va `style.md` ni o'qi — umumiy ohang va yo'nalish.
3. `skills/` ichidagi mavjud fayllarni tekshir — takrorlanmaslik uchun.
4. Faqat shundan keyin fayl yarat:
   - Frontmatter: name (kebab-case), description (1-2 jumla, qachon kerak).
   - 6 ta bo'lim aniq to'ldirilgan.
   - Tor: bitta simptom, bitta sabab, bitta tuzatish.
   - To'g'ri kategoriya papkasiga qo'y.
5. Kerak bo'lsa README.md va architecture.md ni yangila.

Misol to'g'ri bosh:
```md
---
name: specific-kebab-name
description: Aniq holat — qachon ishlatiladi.
---

# Aniq sarlavha

## Nima uchun bu skill kerak
...
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Hech qachon skill yaratishdan oldin architecture.md, instruction.md va style.md ni o'qimasdan boshlama.
- Format va namunalarga 100% amal qil — aks holda skill foydasiz bo'ladi.
- Bu oddiy qadam ko'p noto'g'ri skill'larning oldini oladi va qidiruvni to'g'ri ishlaydi.

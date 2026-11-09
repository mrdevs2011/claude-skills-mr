---
name: agent-did-not-read-bundled-skill-creator-skill-before-creating-new-skill-leading-to-format-or-structure-violation
description: When creating a new skill for the skills repository, the agent skips reading the bundled skill-creator SKILL.md and produces a skill that violates the required narrow single-symptom format, frontmatter, or section structure.
---

# Agent Did Not Read Bundled Skill Creator Skill Before Creating New Skill

## Nima uchun bu skill kerak
Bundled skill-creator skill aniq format, nomlash va tuzilish qoidalarini beradi. Uni o'qimasdan skill yaratish noto'g'ri tuzilma, umumiy maslahatlar yoki keraksiz bo'limlarga olib keladi, bu esa search_skills orqali topilish va foydalanishni qiyinlashtiradi.

## Simptom (aynan shu)
Agent yangi skill yozayotganda:
- SKILL.md o'rniga yoki qo'shimcha ravishda directory structure ishlatadi
- Frontmatter yo'q yoki noto'g'ri
- 6 majburiy bo'lim (Nima uchun, Simptom, Sabab, Tasdiqlash, Tuzatish, Xulosa) to'liq emas
- Bitta tor simptom o'rniga umumiy yoki ko'p masalali skill yaratadi
- skill-creator SKILL.md o'qilmagan

## Sabab (100%)
Agent mavjud bundled skill-creator skillni ( /usr/share/grok/bundled-skills/bundled__skill-creator/SKILL.md ) o'qishni o'tkazib yubordi. O'z taxminlari yoki boshqa skill namunalariga tayanib ishladi.

## Tasdiqlash
- Skill yaratishdan oldin read_file yoki cat bilan skill-creator SKILL.md chaqirilmagan.
- Natijaviy .md faylda majburiy frontmatter yoki bo'limlar yetishmaydi.
- Fayl nomi yoki joylashuvi architecture.md dagi qoidalarga mos kelmaydi.

## Tuzatish (aynan shu)
1. Skill yaratishdan oldin majburiy ravishda o'qi:
   read_file(file_path="/usr/share/grok/bundled-skills/bundled__skill-creator/SKILL.md")
2. Shuningdek architecture.md, instruction.md, style.md ni o'qi.
3. Aniq bitta simptom, bitta sabab, bitta tuzatish bilan yoz.
4. Frontmatter + 6 bo'lim formatiga 100% rioya qil.
5. skills/<kategoriya>/UzunAniqFaylNomi.md joylashtir.

Misol:
```python
# Noto'g'ri: skill-creator o'qimasdan yozish
# To'g'ri:
read_file("/usr/share/grok/bundled-skills/bundled__skill-creator/SKILL.md")
# Keyin formatga mos SKILL.md yozish
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Yangi skill yaratishdan oldin doim bundled skill-creator SKILL.md va repo qo'llanmalarini o'qi. Bu format buzilishlarini oldini oladi va skillning qidiruv orqali foydali bo'lishini ta'minlaydi.

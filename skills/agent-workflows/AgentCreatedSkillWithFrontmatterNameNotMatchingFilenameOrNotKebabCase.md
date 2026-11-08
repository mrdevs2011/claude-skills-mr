---
name: agent-created-skill-with-frontmatter-name-not-matching-filename-or-not-kebab-case
description: When creating a new skill .md file, the YAML frontmatter name is missing, not kebab-case, or does not match the filename, causing search_skills to fail or inconsistent catalog.
---

# Agent Created Skill With Frontmatter Name Not Matching Filename Or Not Kebab Case

## Nima uchun bu skill kerak
search_skills tool name + description + matn bo'yicha qidiradi. Frontmatter `name` aniq kebab-case bo'lishi va fayl nomiga mos kelishi kerak. Noto'g'ri yoki yo'q name skillni topishni qiyinlashtiradi va katalogni buzadi.

## Simptom (aynan shu)
- Yangi skill .md yaratildi, lekin frontmatterda `name:` yo'q yoki `name: My Skill` (space, capital) yoki fayl nomi `FooBar.md` lekin name `foo-bar` emas.
- search_skills so'rovida skill topilmaydi yoki noto'g'ri natija.
- architecture.md dagi nomlash qoidasi buzilgan (qisqa-kebab-case-id).

## Sabab (100%)
Agent skill yaratishda faqat sarlavha va bo'limlarga e'tibor qaratdi, frontmatter name ni fayl nomidan avtomatik generatsiya qilmadi yoki kebab-case ga o'zgartirmadi. Yoki skill-creator formatini to'liq o'qimay, qisqa name qo'ydi.

## Tasdiqlash
- `head -10 skills/.../YangiSkill.md` da `name: aniq-kebab-case` bor va u fayl nomining kebab versiyasiga mos.
- Fayl nomi uzun descriptive, name qisqa kebab.
- `grep -A2 "^name:"` to'g'ri formatda.

## Tuzatish (aynan shu)
Skill faylini yozishdan oldin:

1. Fayl nomini tanla: `LongDescriptiveSymptomCauseFix.md`
2. name ni undan hosil qil: `long-descriptive-symptom-cause-fix` (lowercase, hyphen, no space).
3. Frontmatter:
   ```yaml
   ---
   name: long-descriptive-symptom-cause-fix
   description: Qisqa 1-2 jumla — qachon kerak, simptomni o'z ichiga olgan.
   ---
   ```
4. Yozib bo'lgach, `head -5` bilan tekshir.
5. Keyin commit.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Har bir skill .md frontmatter `name` kebab-case bo'lishi va fayl nomiga mos kelishi shart. Bu search_skills ishonchli ishlashi uchun zarur. Noto'g'ri name — skill "yo'q" bo'lib qoladi.

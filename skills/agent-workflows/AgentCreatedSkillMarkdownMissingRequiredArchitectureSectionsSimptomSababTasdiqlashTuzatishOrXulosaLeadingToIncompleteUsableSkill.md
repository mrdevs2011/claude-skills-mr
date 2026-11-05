---
name: agent-created-skill-missing-required-architecture-sections
description: Agent yozgan skill faylida architecture.md talab qilgan majburiy bo'limlar (Simptom, Sabab, Tasdiqlash, Tuzatish, Xulosa) yetishmaydi yoki to'liq emas, natijada skill search orqali topilsa ham amaliy foydasi kam bo'ladi.
---

# AgentCreatedSkillMarkdownMissingRequiredArchitectureSectionsSimptomSababTasdiqlashTuzatishOrXulosaLeadingToIncompleteUsableSkill

## Nima uchun bu skill kerak
architecture.md qat'iy fayl formatini belgilaydi. Majburiy bo'limlarsiz skill modelga aniq simptom-sabab-tuzatish berolmaydi. SearchSkills orqali topilsa ham agent undan to'liq foydalana olmaydi, takror xatolar davom etadi.

## Simptom (aynan shu)
- Yangi skill .md faylida faqat frontmatter va qisqa matn bor.
- "Simptom (aynan shu)", "Sabab (100%)", "Tasdiqlash", "Tuzatish (aynan shu)", "Xulosa — bu skillni o'qib nimani bilib oldingiz" bo'limlari yo'q yoki bo'sh.
- Tuzatish bo'limida kod misoli yo'q.
- Skill o'qilganda aniq harakat ko'rsatmaydi.

## Sabab (100%)
Agent architecture.md ni to'liq o'qimaydi yoki faqat bosh qismini ko'rib, formatni o'zidan to'qib yozadi. "Qisqa yetarli" deb o'ylaydi yoki boshqa skill tizimi (SKILL.md papka) formatiga aralashadi. Bo'limlarni "ixtiyoriy" deb hisoblaydi.

## Tasdiqlash
1. Skill faylini ochib quyidagi sarlavhalar borligini tekshir:
   - ## Simptom (aynan shu)
   - ## Sabab (100%)
   - ## Tasdiqlash
   - ## Tuzatish (aynan shu)
   - ## Xulosa — bu skillni o'qib nimani bilib oldingiz
2. Tuzatish bo'limida amaliy kod yoki aniq qadam borligini ko'r.
3. Frontmatter name va description mavjudligini tasdiqla.

## Tuzatish (aynan shu)
Skill yaratishdan oldin architecture.md dagi "Fayl formati (majburiy)" bo'limini o'qi. Keyin aniq shu shablonni ishlat:

```md
---
name: qisqa-kebab-case-id
description: Qisqa tavsif — qachon kerak bo'lishi (1-2 jumla)
---

# UzunTasvirlovchiFaylNomi

## Nima uchun bu skill kerak
...

## Simptom (aynan shu)
...

## Sabab (100%)
...

## Tasdiqlash
...

## Tuzatish (aynan shu)
... (kod misoli bilan)

## Xulosa — bu skillni o'qib nimani bilib oldingiz
...
```

Fayl nomini uzun va tasvirlovchi qil. Kategoriyaga (agent-workflows/, productivity/, coding/patterns/ va hokazo) to'g'ri joylashtir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Har bir skill architecture.md formatiga 100% mos bo'lishi shart: aniq Simptom, 100% Sabab, Tasdiqlash, kodli Tuzatish va Xulosa. Aks holda skill foydasiz bo'ladi. Yaratishdan oldin shablonni to'liq qo'lla.

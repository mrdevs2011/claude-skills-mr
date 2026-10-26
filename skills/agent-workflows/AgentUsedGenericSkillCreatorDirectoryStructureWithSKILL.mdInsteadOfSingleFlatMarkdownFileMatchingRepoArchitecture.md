---
name: agent-used-generic-skill-creator-structure
description: Yangi skill uchun generic skill-creator tuzilmasini (papka + SKILL.md + evals + CHANGELOG) ishlatildi — repo architecture.md dagi bitta flat .md formatiga zid.
---

# Generic skill-creator tuzilmasi o'rniga flat .md ishlatmaslik

## Nima uchun bu skill kerak
Bu repo'dagi skill'lar architecture.md ga ko'ra bitta .md fayl (kategoriya papkasida), maxsus frontmatter va 6 ta bo'lim bilan yoziladi. Generic skill-creator (papka, SKILL.md, evals.json, CHANGELOG.md) ishlatish search_skills ni buzadi, chunki u faqat .md fayllarni indeks qiladi. Formatga 100% amal qilish shart.

## Simptom (aynan shu)
- skills/ papkasida yangi skill uchun papka yaratilgan (skill-name/SKILL.md).
- SKILL.md ichida type, lifecycle yoki boshqa generic frontmatter maydonlari bor.
- evals/, scripts/, references/ kabi qo'shimcha papkalar bor.
- search_skills yangi skillni topa olmaydi yoki noto'g'ri indeks qiladi.
- architecture.md dagi "Fayl formati (majburiy)" ga mos kelmaydi.

## Sabab (100%)
Agent umumiy skill-creator qo'llanmasini (bundled) o'qidi va shu tuzilmani qo'lladi, lekin ushbu repo'ning maxsus architecture.md qoidalarini (flat .md, tor simptom) e'tiborsiz qoldirdi. "Skill yaratish" degan so'zga generic yondashuvni qo'lladi.

## Tasdiqlash
1. skills/ ostida yangi papka bormi yoki faqat .md faylmi tekshir: `find skills -type d -name "*skill*"`.
2. Fayl frontmatterini architecture.md namunasi bilan solishtir (faqat name + description).
3. 6 ta majburiy bo'lim borligini ko'r.
4. search_skills yoki skill_search.py bilan yangi skillni qidirib ko'r.

## Tuzatish (aynan shu)
Har doim architecture.md formatini ishlat:

1. To'g'ri kategoriya papkasini tanla (yoki yangi yarat, keyin architecture.md va README yangila).
2. Bitta uzun, aniq nomli .md fayl yarat (masalan: AgentUsedGenericSkillCreatorDirectoryStructureWithSKILL.mdInsteadOfSingleFlatMarkdownFileMatchingRepoArchitecture.md).
3. Frontmatter:
```markdown
---
name: qisqa-kebab-case-id
description: Qisqa tavsif — qachon kerak (1-2 jumla)
---
```
4. Body bo'limlari: Nima uchun bu skill kerak / Simptom (aynan shu) / Sabab (100%) / Tasdiqlash / Tuzatish (aynan shu) / Xulosa — bu skillni o'qib nimani bilib oldingiz
5. Hech qanday SKILL.md, evals, CHANGELOG, scripts papkasi yaratma — faqat bitta .md.

Misol to'g'ri joy: skills/agent-workflows/YangiSkillNomi.md

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Bu repo uchun skill'lar faqat bitta flat .md fayl sifatida, architecture.md formatida yoziladi. Generic skill-creator tuzilmasi ishlatilmaydi — search va indekslash shu formatga bog'liq.

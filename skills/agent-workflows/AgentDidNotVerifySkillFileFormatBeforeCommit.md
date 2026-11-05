---
name: agent-did-not-verify-skill-file-format-before-commit
description: Yangi skill yaratilgandan keyin architecture.md formatiga (frontmatter + 6 bo'lim + kod misoli) mosligini tekshirmasdan commit qilindi — search_skills noto'g'ri indeks yoki agent noto'g'ri ishlatadi.
---

# Skill faylini commitdan oldin formatga mosligini tekshirmaslik

## Nima uchun bu skill kerak
architecture.md qoidalari skill'larning tor, aniq va search_skills orqali topilishi uchun majburiy formatni belgilaydi. Format buzilsa, skill kerakli vaqtda topilmaydi yoki agent uni to'g'ri qo'llay olmaydi. Commitdan oldin tekshirish bu xatolarni oldini oladi.

## Simptom (aynan shu)
- Yangi .md fayl skills/ ostida yaratilgan, lekin frontmatter faqat name/description emas yoki bo'limlar to'liq emas.
- Tuzatish bo'limida aniq kod misoli yo'q.
- Xulosa bo'limi yo'q yoki umumiy.
- search_skills yangi skillni simptom bo'yicha topa olmaydi.
- Commit xabari "Add new skill: ..." formatida, lekin fayl mazmuni architecture.md namunasi bilan mos kelmaydi.

## Sabab (100%)
Agent skill yaratishda architecture.md dagi "Fayl formati (majburiy)" bo'limini to'liq o'qimadi yoki o'qigandan keyin faylni yozib, commitdan oldin qayta tekshirmadi. "Yaratildi" deb taxmin qilib, format validatsiyasini o'tkazib yubordi.

## Tasdiqlash
1. Yangi faylni o'qi: `head -30 skills/agent-workflows/YangiSkillNomi.md` yoki ReadFile.
2. Frontmatterda faqat `name:` va `description:` borligini, boshqa maydonlar (type, lifecycle) yo'qligini tekshir.
3. Quyidagi 6 bo'lim borligini tasdiqla: Nima uchun bu skill kerak, Simptom (aynan shu), Sabab (100%), Tasdiqlash, Tuzatish (aynan shu), Xulosa — bu skillni o'qib nimani bilib oldingiz.
4. Tuzatish bo'limida kamida bitta aniq kod yoki buyruq misoli borligini ko'r.
5. `python skill_search.py "skill format" ` yoki shunga o'xshash bilan topilishini sinab ko'r.

## Tuzatish (aynan shu)
Commitdan oldin har doim quyidagi tekshiruvni bajaring:

```bash
# Faylni o'qib formatni tekshir
cat skills/agent-workflows/AgentDidNotVerifySkillFileFormatBeforeCommit.md | head -50

# 6 bo'lim mavjudligini qidir
grep -E "^## (Nima uchun|Simptom|Sabab|Tasdiqlash|Tuzatish|Xulosa)" skills/agent-workflows/*.md | wc -l
```

Agar mos kelmasa, EditFile yoki WriteFile bilan tuzat, keyin qayta tekshir. Faqat to'g'ri formatdagi faylni `git add` qil.

Misol to'g'ri frontmatter:
```markdown
---
name: qisqa-kebab-case
description: Qisqa tavsif — qachon kerak bo'lishi (1-2 jumla)
---
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill yaratish tugamagan hisoblanadi, toki fayl architecture.md formatiga 100% mosligi commitdan oldin tasdiqlanmaguncha. Bu search_skills ishonchliligi va agentning to'g'ri skillni topishi uchun shart.

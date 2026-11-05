---
name: skill-in-root-not-category
description: Yangi skill yaratilganda skills/ ildiziga qo'yilgan, kategoriya papkasiga emas. Qachon: yangi .md skill fayli skills/ ostida to'g'ridan-to'g'ri paydo bo'ladi, lekin agent-workflows, coding, productivity kabi papkalarda emas.
---

# Skill fayli skills/ ildiziga qo'yilgan

## Nima uchun bu skill kerak
Skills katalogi kategoriya papkalari bilan tuzilgan. Ildizga qo'yilgan skill qidiruv va tuzilishda chalkashlik yaratadi, architecture.md va README.md dagi ro'yxatga mos kelmaydi.

## Simptom (aynan shu)
Yangi skill fayli `skills/yangi-skill.md` sifatida yaratilgan. `find skills -maxdepth 1 -name "*.md"` da paydo bo'ladi. Kategoriya papkalari (coding/, agent-workflows/, productivity/) ichida emas.

## Sabab (100%)
Skill yaratuvchi kategoriya tanlamagan yoki `skills/` papkasiga to'g'ridan-to'g'ri yozgan. Architecture.md da "kategoriya papkalari bilan" deb belgilangan, lekin yangi skill uchun mos papka tanlanmagan.

## Tasdiqlash
```bash
find /tmp/skills-repo/skills -maxdepth 1 -name "*.md"
ls skills/agent-workflows/ | grep -i skill-created || echo "kategoriyada yo'q"
```
Agar ildizda .md bo'lsa va kategoriyada bo'lmasa — shu holat.

## Tuzatish (aynan shu)
1. Mos kategoriya tanla (agent-workflows/, coding/patterns/, productivity/ va h.k.).
2. Faylni o'sha yerga ko'chir:
```bash
mv skills/yangi-skill.md skills/agent-workflows/AgentCreatedSkillMarkdownFileInSkillsRootInsteadOfCategorySubfolderCausingInconsistentOrganization.md
```
3. Agar yangi kategoriya bo'lsa, architecture.md va README.md dagi ro'yxatni yangila.
4. Frontmatter va uzun tavsifli fayl nomini saqla.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill fayllari hech qachon skills/ ildizida bo'lmasligi kerak. Har doim tegishli kategoriya papkasiga qo'yiladi. Bu tuzilishni saqlaydi va search_skills to'g'ri ishlashini ta'minlaydi.

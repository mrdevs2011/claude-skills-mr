---
name: agent-created-skill-outside-skills-folder
description: Yangi skill .md fayl skills/ papkasi tashqarisida yoki noto'g'ri kategoriya papkasida yaratilgan — search_skills uni topa olmaydi, skill ishlamaydi.
---

# Skill faylini skills/ papkasidan tashqarida yaratish

## Nima uchun bu skill kerak
search_skills tool faqat skills/ papkasi ostidagi .md fayllarni indekslaydi. Agar skill boshqa joyda bo'lsa yoki noto'g'ri struktura, model uni topa olmaydi va skill foydasiz bo'ladi. architecture.md da aniq joylashuv belgilangan.

## Simptom (aynan shu)
- Yangi SKILL.md yoki skill fayl repo ildizida, /tmp da, yoki skills/ dan tashqari papkada yaratilgan.
- Kategoriya papkasi (coding/, productivity/, agent-workflows/) ishlatilmagan yoki noto'g'ri nom.
- search_skills(query) yangi skillni topmaydi.
- README yoki architecture yangilanmagan.

## Sabab (100%)
Agent architecture.md va instruction.md dagi skill joylashuv qoidalarini o'qimagan yoki e'tiborsiz qoldirgan. "skills/" papkasiga qo'yish shartini unutgan.

## Tasdiqlash
- Fayl yo'li skills/<kategoriya>/... .md mi?
- Kategoriya mavjudmi yoki yangi papka to'g'ri yaratilganmi?
- search_skills bilan topiladimi?
- architecture.md dagi kategoriya ro'yxati yangilanganmi (yangi papka bo'lsa)?

## Tuzatish (aynan shu)
1. Skill faylini har doim skills/<kategoriya>/AniqUzunNom.md ga qo'y.
2. Mavjud kategoriyalardan foydalan: coding/patterns, productivity, agent-workflows va h.k.
3. Yangi kategoriya kerak bo'lsa, papka yarat va architecture.md ni yangila.
4. Formatni 100% rioya qil: frontmatter + 6 bo'lim.
5. README.md dagi struktura ro'yxatiga qo'sh.

```markdown
# Noto'g'ri
/tmp/skills-repo/MyNewSkill.md
yoki
skills/MySkill.md  # kategoriya yo'q

# To'g'ri
skills/agent-workflows/AgentCreatedNewSkillFileOutsideSkillsDirectoryOrWrongSubfolderMakingItUnsearchable.md
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Barcha skill'lar faqat skills/ ostida va kategoriya papkalarida bo'lishi shart.
- search_skills avtomatik faqat shu joydagi .md larni ko'radi.
- architecture.md va README ni yangilash kerak bo'lsa, yangila.

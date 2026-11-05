---
name: agent-created-skill-file-in-root-or-wrong-directory
description: Agent yozgan yangi skill faylini skills/ kategoriya papkasiga emas, repo ildizi, /tmp yoki boshqa noto'g'ri joyga joylashtiradi, natijada search_skills topmaydi.
---

# Agent created skill file in root or wrong directory instead of under skills category folder

## Nima uchun bu skill kerak
Skill fayllari faqat `skills/` papkasi ostidagi mos kategoriya ichida bo'lishi kerak. Aks holda `skill_search.py` ularni indekslamaydi va agent keyinroq `search_skills` orqali topa olmaydi. Bu ayniqsa yangi skill yaratish vazifalarida tez uchraydi.

## Simptom (aynan shu)
- Yangi `.md` skill fayli repo ildizida (`/tmp/skills-repo/MyNewSkill.md`) yoki `skills/` dan tashqarida yotadi.
- `python skill_search.py "skill nomi"` hech narsa topmaydi yoki eski skilllarni qaytaradi.
- Commit va push qilingandan keyin ham skill ishlamaydi, chunki joyi noto'g'ri.
- `find skills -name "*.md"` da yangi fayl ko'rinmaydi.

## Sabab (100%)
Agent skill yaratishda `skills/<kategoriya>/` yo'lini aniq belgilamaydi. U `cat > SKILL.md` yoki ildizga yozadi, yoki noto'g'ri papka (`coding/` o'rniga ildiz, yoki yangi papka yaratmasdan) tanlaydi. `architecture.md` dagi tuzilishga rioya qilmaydi.

## Tasdiqlash
1. `find . -name "*SkillName*.md" -not -path "./skills/*"` — skills/ dan tashqarida chiqyaptimi?
2. `ls skills/agent-workflows/` yoki mos kategoriya ichida yangi fayl bormi?
3. `python skill_search.py "qisqa tavsif kalit so'z"` yangi skillni qaytaryaptimi?

## Tuzatish (aynan shu)
Skillni har doim to'g'ri joyga yoz:

```bash
# Avval kategoriya borligini tekshir yoki yarat
mkdir -p skills/agent-workflows
# Keyin faylni shu yerga yoz
cat > skills/agent-workflows/AgentCreatedSkillFileInRootOrWrongDirectoryInsteadOfUnderSkillsCategoryFolder.md << 'END'
---
name: ...
description: ...
---
# ...
## Nima uchun bu skill kerak
...
END
```

Yoki `write_file` / `edit_file` tool bilan to'liq yo'lni ishlat: `skills/productivity/LongDescriptiveName.md`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Yangi skill faqat `skills/<kategoriya>/` ostiga qo'yilishi shart.
- Noto'g'ri joyda yozilgan skill search_skills orqali topilmaydi.
- Yaratishdan oldin `ls skills/` va architecture.md dagi kategoriya ro'yxatini tekshir.

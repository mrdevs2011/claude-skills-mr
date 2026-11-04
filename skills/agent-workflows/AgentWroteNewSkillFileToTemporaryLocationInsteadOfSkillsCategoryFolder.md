---
name: agent-wrote-skill-to-tmp-instead-of-skills-folder
description: Yangi skill yaratilganda SKILL.md yoki .md fayl /tmp, /workspace yoki boshqa vaqtinchalik joyga yozildi, skills/<kategoriya>/ papkasiga emas — natijada search_skills indekslay olmaydi va skill topilmaydi.
---

# Yangi skill faylini skills/ papkasiga emas, vaqtinchalik joyga yozish

## Nima uchun bu skill kerak
Agentlar ba'zan skill yaratish jarayonida faylni `/tmp/skills-repo/skills/...` o'rniga to'g'ridan-to'g'ri `/tmp` yoki artifacts ga yozadi. Architecture.md bo'yicha barcha skill'lar faqat `skills/` ichida (kategoriya papkalari bilan) bo'lishi shart, aks holda `skill_search.py` ularni ko'rmaydi.

## Simptom (aynan shu)
- Skill yaratish buyrug'i bajarilgan.
- Fayl `skills/agent-workflows/YangiSkillNomi.md` yoki mos papkada yo'q.
- O'rniga `/tmp/yangi-skill.md`, `/workspace/artifacts/skill.md` yoki boshqa joyda paydo bo'lgan.
- Keyin `python skill_search.py` yoki search_skills bilan yangi skill topilmaydi.
- Git statusda skills/ ichida o'zgarish yo'q.

## Sabab (100%)
Agent clone qilingan repo ning `skills/` papkasiga to'liq yo'lni ishlatmagan. `cd /tmp/skills-repo` qilgandan keyin ham nisbiy yo'l o'rniga mutlaq `/tmp/...` yozgan yoki working directoryni tekshirmagan. Architecture.md dagi "skills/ — haqiqiy skill bazasi" qoidasini e'tiborsiz qoldirgan.

## Tasdiqlash
1. `pwd` yoki `ls skills/` bilan hozirgi joy `.../skills-repo/skills/` ichidami?
2. Yaratilgan faylning to'liq yo'li `skills/<kategoriya>/<uzun-aniq-nom>.md` formatidami?
3. `find skills -name "*Yangi*" ` bilan fayl topiladimi?
4. Agar `/tmp` da bo'lsa — shu skill qo'llaniladi.

## Tuzatish (aynan shu)
1. Avval `cd /tmp/skills-repo` (yoki clone qilingan joy).
2. Kategoriya tanla (agent-workflows, productivity, coding/patterns va h.k.).
3. Faylni aynan shu joyga yoz:
   ```bash
   cat > skills/agent-workflows/AgentWroteNewSkillFileToTemporaryLocationInsteadOfSkillsCategoryFolder.md << 'EOF'
   ---
   name: agent-wrote-skill-to-tmp-instead-of-skills-folder
   description: ...
   ---
   # ...
   EOF
   ```
4. Yoki `write_file` tool bilan to'liq path: `/tmp/skills-repo/skills/agent-workflows/Nom.md`
5. Keyin `ls skills/agent-workflows/` bilan tasdiqla.
6. Git add faqat shu faylni (yoki `git add skills/`).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Skill fayli faqat clone qilingan repo ning `skills/<kategoriya>/` ichida bo'lishi shart.
- /tmp yoki artifacts ga yozish search_skills dan yashirin qoladi.
- Har doim to'liq yo'lni tekshirib, skills/ papkasiga yoz.

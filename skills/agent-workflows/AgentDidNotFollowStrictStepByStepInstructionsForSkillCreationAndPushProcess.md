---
name: agent-did-not-follow-strict-step-by-step-instructions-for-skill-creation-and-push-process
description: Skill yaratish va push qilishda berilgan qat'iy qadamlarni (clone, .gitignore/.env tekshir, qo'llanmalarni o'qi, yangi skill, git config, commit, push, hisobot) to'liq va tartibda bajarilmagan. Qachon: avtomatik skill generator vazifasida qadamlar o'tkazib yuboriladi yoki tartib buziladi.
---

# Skill yaratish jarayonida qat'iy qadamlarni to'liq bajarilmagan

## Nima uchun bu skill kerak
Foydalanuvchi "Har soatda yangi skill yarat va FAQAT ma'lum repo'ga push qil" deb aniq qadamlar beradi. Agent bu qadamlarni e'tiborsiz qoldirsa (masalan, qo'llanmalarni o'qimasdan skill yozsa, git config qilmasa, pushdan keyin hisobot bermasa) — skill sifatli bo'lmaydi, remote'ga noto'g'ri tushadi yoki token oshkor bo'lish xavfi bo'ladi.

## Simptom (aynan shu)
- Skill yaratildi, lekin architecture.md, instruction.md, style.md o'qilmagan.
- .env yoki .gitignore tekshirilmagan/yaratilmagan.
- git config user.email va user.name sozlanmagan.
- Commit message formatiga mos emas.
- Push muvaffaqiyatsiz bo'lsa ham success deb hisobot berilgan.
- Oxirgi hisobotda skill nomi, o'qilgan qo'llanmalar, commit hash, push holati yo'q.

## Sabab (100%)
Agent umumiy "skill yarat va push qil" ni tushundi, lekin berilgan 1-11 qadamli qat'iy tartibni birma-bir tekshirmadi va bajarmadi. Yoki oldingi sessiyadagi bilimga tayandi, joriy qo'llanmalarni qayta o'qimadi.

## Tasdiqlash
1. Clone qilinganmi va /tmp/skills-repo tozalanganmi?
2. .gitignore va .env mavjudligi tekshirilgan va kerak bo'lsa yaratilganmi?
3. architecture.md, instruction.md, style.md o'qilganmi (kamida head yoki to'liq)?
4. Yangi skill skills/ papkasining to'g'ri kategoriya ostida, uzun tavsifli nom bilan, to'liq bo'limlar bilan yozilganmi?
5. git config local user sozlanganmi?
6. git add . && git commit -m "Add new skill: [name] - [desc]" bajarilganmi?
7. git push origin main muvaffaqiyatli (exit 0)mi?
8. Hisobotda commit hash (git log -1 --oneline) va push status bor mi?

## Tuzatish (aynan shu)
Har bir qadamni alohida bajar va tekshir:

```bash
# 1. Tozala va clone (tokenni logda chiqarma)
rm -rf /tmp/skills-repo
git clone https://x-access-token:TOKEN@github.com/mrdevs2011/claude-skills-mr.git /tmp/skills-repo

# 2. cd
cd /tmp/skills-repo

# 3-4. .gitignore va .env
test -f .gitignore || echo -e '.env\n*.log\n__pycache__/\n.DS_Store\nnode_modules/' > .gitignore
test -f .env || echo '# Skill environment variables\n# Example: API_KEY=your_key_here' > .env

# 5. Qo'llanmalarni o'qi
head -100 architecture.md instruction.md style.md

# 6. Yangi skill yarat (mavjudlarni tekshirib)
# skills/agent-workflows/LongDescriptiveName.md

# 8. git config
git config user.email "automation@local"
git config user.name "Skill Generator"

# 9. commit
git add .
git commit -m "Add new skill: skill-name - short description"

# 10. push
git push origin main

# 11. hash ol
git log -1 --oneline
```

Tokenni hech qachon echo, log yoki javobda ko'rsatma. Uploads repo'siga tegma. Xato bo'lsa aniq xatoni ayt, success deb yozma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Berilgan qat'iy qadamlarni birma-bir, tartibda bajarish shart.
- Qo'llanmalarni har safar o'qi, eski xotiraga tayanma.
- Setup (.env, .gitignore, git config), skill formati, commit, push va hisobotni tekshir.
- Xato bo'lsa yashirma — aniq xatoni ayt.

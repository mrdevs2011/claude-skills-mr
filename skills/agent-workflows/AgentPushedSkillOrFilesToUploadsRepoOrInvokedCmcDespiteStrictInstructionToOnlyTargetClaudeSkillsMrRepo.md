---
name: agent-pushed-to-uploads-or-used-cmc-for-skill-instead-of-claude-skills-mr
description: Skill yaratish yoki push qilishda uploads repo'siga tegish yoki CMC ishlatish — faqat claude-skills-mr repo'siga push qilish qat'iy buyruq buzilgan.
---

# Skill push uchun uploads yoki CMC ishlatish o'rniga faqat claude-skills-mr

## Nima uchun bu skill kerak
Foydalanuvchi aniq ko'rsatgan: yangi skill faqat `mrdevs2011/claude-skills-mr` repo'siga push qilinsin, CMC ishlatilmasin, uploads repo'siga umuman tegilmasin. Agent umumiy fayl-o'tkazish qoidalarini (uploads ko'prik, CMC) qo'llab, noto'g'ri repo'ga yozadi yoki taqiqlangan yo'lni ishlatadi. Natijada skill noto'g'ri joyga tushadi, tokenlar chalkashadi, buyruq buziladi.

## Simptom (aynan shu)
- Vazifa: yangi skill yaratib `claude-skills-mr` ga push qilish (CMC ishlatmaslik, uploads'ga tegmaslik).
- Agent `get_upload_token`, uploads clone/push, yoki CMC `run_command` ishlatdi.
- Yoki skill faylini uploads repo'siga qo'shdi / push qildi.
- claude-skills-mr ga push bo'lmadi yoki parallel noto'g'ri joyga ham yozildi.
- Hisobotda uploads hash yoki CMC sessiyasi tilga olindi.

## Sabab (100%)
Agent instruction.md dagi umumiy "fayl kompyuterga o'tishi kerak → uploads + CMC" qoidasini shu maxsus holatga ham qo'lladi. Foydalanuvchi bergan qat'iy qadamlarni (faqat shu token bilan shu repo, CMC yo'q) e'tiborsiz qoldirdi. "Har qanday push = uploads" deb taxmin qildi.

## Tasdiqlash
- Foydalanuvchi xabari "FAQAT mrdevs2011/claude-skills-mr", "CMC ishlatma", "Uploads repo'siga umuman tegma" deganmi?
- Tool chaqiruvlarda uploads clone, get_upload_token, yoki CMC bor mi?
- Oxirgi push qaysi remote'ga ketdi? (git remote -v yoki push output)
- .env/.gitignore faqat shu repo ichida yangilandimi?

## Tuzatish (aynan shu)
1. Berilgan aniq qadamlarga 100% amal qil: `/tmp/skills-repo` ni tozala, faqat `claude-skills-mr` ni berilgan token bilan clone qil.
2. CMC, get_upload_token, uploads clone/push hech qachon chaqirma.
3. Skillni `skills/<kategoriya>/` ga yoz, .env va .gitignore ni tekshir/yarat.
4. Faqat shu repo ichida git add/commit/push origin main.
5. Push muvaffaqiyatsiz bo'lsa — success deb yozma, aniq xato matnini hisobotda ayt.
6. Tokenni hech qachon javob, log yoki hisobotda chiqarma.

Misol noto'g'ri:
```
# uploads yoki CMC ishlatish
get_upload_token → clone uploads → copy skill → push uploads
```

Misol to'g'ri:
```
rm -rf /tmp/skills-repo
git clone https://x-access-token:<token>@github.com/mrdevs2011/claude-skills-mr.git /tmp/skills-repo
# skill yoz, commit, git push origin main
# faqat shu
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Maxsus "faqat shu repo, CMC yo'q, uploads'ga tegma" buyrug'i umumiy uploads qoidasidan ustun.
- Skill push faqat claude-skills-mr ga, berilgan token bilan, to'g'ridan-to'g'ri.
- Noto'g'ri yo'l ishlatilsa — aniq xato, success emas.

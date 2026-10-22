---
name: assumed-cwd-correct-without-verify
description: Agent file yoki git operatsiyalarini bajarishdan oldin joriy ish papkasini (pwd) tekshirmasdan, taxminiy yo'l yoki oldingi cd asosida ishlaydi — noto'g'ri papkada o'zgarish yoki xato natija.
---

# Agent joriy ish papkasini tekshirmasdan file/git operatsiya qildi

## Nima uchun bu skill kerak
Ko'p agent muhitida (sandbox, multi-step tool calls) ish papkasi o'zgarishi mumkin yoki taxmin noto'g'ri bo'lishi mumkin. Agent "men cd qilganman" deb eslab, keyingi qadamda absolute path ishlatmasdan yoki pwd tekshirmasdan operatsiya qiladi. Natijada fayllar noto'g'ri joyga yoziladi, git noto'g'ri repo'da ishlaydi, yoki "file not found" xatolari chiqadi.

## Simptom (aynan shu)
- Git commit/push yoki file write noto'g'ri repo/papkada amalga oshdi.
- "No such file or directory" yoki o'zgarishlar kutilgan joyda ko'rinmaydi.
- Agent "cd /tmp/skills-repo && ..." qilgan, lekin keyingi mustaqil tool callda cwd qayta tiklangan yoki boshqa bo'lgan.
- Relative path bilan ishlashda xato natija.

## Sabab (100%)
Agent tool call'lar o'rtasida persistent shell state bor deb taxmin qildi (ba'zi muhitlarda har call yangi shell). Yoki absolute path o'rniga relative ishlatdi va cwd ni tasdiqlamadi. Oldingi muvaffaqiyatli cd dan keyin holat o'zgarmagan deb o'yladi.

## Tasdiqlash
1. Har bir muhim file/git operatsiyadan oldin `pwd` yoki absolute path ishlatilganini logdan tekshir.
2. Agar xato "not found" yoki o'zgarish noto'g'ri joyda bo'lsa — cwd noto'g'ri edi.
3. Parallel yoki ketma-ket tool call'larda cwd alohida ekanligini esla.

## Tuzatish (aynan shu)
Har doim absolute path ishlat yoki operatsiyadan oldin aniq tekshir:

```bash
# Noto'g'ri (taxmin)
cd /tmp/skills-repo
# ... keyingi alohida callda
git add .   # cwd boshqa bo'lishi mumkin

# To'g'ri
pwd   # yoki
git -C /tmp/skills-repo add .
# yoki bitta commandda:
cd /tmp/skills-repo && git add . && git commit -m "..."
```

Muhim operatsiyalarda:
1. `pwd` chiqishini o'qib tasdiqla.
2. Absolute path ishlat (`/tmp/skills-repo/skills/...`).
3. Bir nechta buyruqni `&&` bilan bir commandda birlashtir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Ish papkasini hech qachon taxmin qilma. Absolute path yoki aniq tekshiruv ishlat — aks holda o'zgarishlar noto'g'ri joyga tushadi.

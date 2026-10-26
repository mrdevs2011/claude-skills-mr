---
name: agent-did-not-run-git-status-before-git-add-dot-to-avoid-committing-unintended-files
description: Skill repo'sida yangi fayl qo'shishdan oldin `git status` ni ishga tushirmasdan `git add .` qilish. Natijada .env, log, vaqtinchalik yoki boshqa keraksiz fayllar stage'ga tushib, commitga kirishi mumkin.
---

# Agent skill yaratishda git statusni tekshirmasdan `git add .` qildi

## Nima uchun bu skill kerak
Yangi skill faylini qo'shishda faqat niyat qilingan fayllarni stage qilish kerak. `git add .` hamma narsani qo'shadi. Agar .gitignore to'liq bo'lmasa yoki yangi fayllar (vaqtinchalik skript, log, .env yangilanishi) paydo bo'lgan bo'lsa, ular ham commitga kiradi. Bu maxfiy ma'lumot oshkor bo'lishi yoki keraksiz shovqin yaratishi mumkin. Har commitdan oldin statusni ko'rib, faqat kerakli narsalarni add qilish majburiy.

## Simptom (aynan shu)
- `git status` chaqirilmagan yoki natijasi o'qilmagan.
- To'g'ridan-to'g'ri `git add .` yoki `git add -A` ishlatilgan.
- Commitdan keyin `git show --stat` yoki `git log -1 --name-only` da kutilmagan fayllar (masalan .env, *.log, __pycache__, vaqtinchalik .py) ko'rinadi.
- Remote'da maxfiy fayl paydo bo'lgan yoki repo "iflos" holatda.

## Sabab (100%)
Agent tezlik uchun `git add .` ni odatiy buyruq sifatida ishlatadi va statusni tekshirishni o'tkazib yuboradi. U .gitignore ishlaydi deb taxmin qiladi, lekin yangi fayllar yoki noto'g'ri ignore qoidalari holatida xato qiladi. Aniq fayl yo'llarini (`git add skills/agent-workflows/YangiSkill.md`) yozish o'rniga blanket add qiladi.

## Tasdiqlash
1. Terminal tarixida yoki skriptda `git status` buyrug'i commitdan oldin bormi?
2. `git add` qanday argument bilan chaqirilgan? `.` yoki aniq path?
3. `git status --short` chiqishida faqat kutilgan fayllar modified/untrackedmi?
4. Commitdan keyin `git show --name-only HEAD` faqat yangi skill fayl(lar)ini ko'rsatadimi?
5. .env tracked emasligi: `git check-ignore -v .env` yoki statusda yo'qligi.

## Tuzatish (aynan shu)
Har doim quyidagi tartibni bajar:

```bash
cd /tmp/skills-repo

# 1. Holatni ko'r
git status

# 2. Faqat kerakli fayllarni aniq add qil
git add skills/agent-workflows/AgentDidNotRunGitStatusBeforeGitAddDotToAvoidCommittingUnintendedFiles.md
# yoki boshqa aniq pathlar. Hech qachon `git add .` ishlatma agar barcha fayllar kutilgan ekanligiga 100% ishonch bo'lmasa.

# 3. Qayta tekshir
git status
# faqat staged bo'lishi kerak bo'lganlar ko'rinsin

# 4. Commit
git commit -m "Add new skill: agent-did-not-run-git-status-before-git-add-dot-to-avoid-committing-unintended-files - status tekshirmasdan blanket add qilishning oldini olish"

# 5. Push
git push origin main
```

Agar kutilmagan fayl ko'rinsa — avval .gitignore ga qo'sh yoki `git reset` qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`git add .` xavfli qisqa yo'l. Har doim `git status` bilan nima stage bo'layotganini ko'r, faqat niyat qilingan skill faylini aniq path bilan qo'sh. Bu maxfiy ma'lumotlar va keraksiz fayllarning remote'ga tushishini oldini oladi.

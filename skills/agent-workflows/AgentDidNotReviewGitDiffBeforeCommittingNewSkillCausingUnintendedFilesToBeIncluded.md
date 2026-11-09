---
name: agent-did-not-review-git-diff-before-committing-new-skill-causing-unintended-files-to-be-included
description: Agent yangi skill qo'shgandan keyin git add . va commit qilishdan oldin git status/diff ni tekshirmagan — tasodifiy .env yoki boshqa fayllar commit bo'lgan. Qachon: skill yaratish va push qilish jarayonida.
---

# Agent yangi skill commit qilishdan oldin git diff ni ko'rib chiqmagan

## Nima uchun bu skill kerak
Skill yaratish jarayonida `.env`, `.gitignore` yoki boshqa vaqtinchalik fayllar yaratilishi yoki o'zgartirilishi mumkin. `git add .` dan oldin nima qo'shilayotganini tekshirmaslik tasodifiy maxfiy yoki keraksiz fayllarni commit qilishga olib keladi.

## Simptom (aynan shu)
- `git add . && git commit` bajarilgan.
- Keyin push qilingan.
- Repo tarixida `.env` yoki boshqa kutilmagan fayl paydo bo'lgan.
- Yoki skill fayli bilan birga boshqa o'zgarishlar ham kiritilgan.

## Sabab (100%)
Agent to'g'ridan-to'g'ri `git add .` ishlatgan va `git status` yoki `git diff --cached` bilan nima staged qilinganini ko'rib chiqmagan. Automation jarayonida `.env` yaratilgan bo'lishi mumkin (bo'sh bo'lsa ham).

## Tasdiqlash
1. Commit qilishdan oldin `git status` chiqishi ko'rilganmi?
2. `git diff` yoki `git diff --cached` bilan faqat yangi skill fayli o'zgarishi tasdiqlanganmi?
3. `.env` `.gitignore` da bo'lsa ham, agar staged bo'lsa, uni unstage qilish kerakmi tekshirilganmi?

## Tuzatish (aynan shu)
Commit qilishdan oldin har doim tekshir:

```bash
git status
git diff
# Faqat kerakli fayllarni qo'sh
git add skills/agent-workflows/NewSkill.md
# Yoki agar .gitignore to'g'ri bo'lsa va .env ignore qilingan bo'lsa
git add skills/
git status  # qayta tekshir, .env staged emasligini tasdiqla
git commit -m "Add new skill: skill-name - short description"
```

Agar `.env` staged bo'lsa:

```bash
git reset HEAD .env
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Har qanday git commit dan oldin, ayniqsa automation yoki skill yaratishda, `git status` va `git diff` bilan nima qo'shilayotganini ko'rib chiqing. `git add .` ni ko'r-ko'rona ishlatmang. Bu tasodifiy fayllar yoki maxfiy ma'lumotlarning commit bo'lishini oldini oladi.

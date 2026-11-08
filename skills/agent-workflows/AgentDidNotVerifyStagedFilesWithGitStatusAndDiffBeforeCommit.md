---
name: agent-did-not-verify-staged-files-with-git-status-and-diff-before-commit
description: Agent `git add .` qilgandan keyin `git status` va `git diff --cached` bilan nima staged ekanini tekshirmasdan commit qildi, natijada .env, loglar yoki boshqa keraksiz fayllar ham kirib qolishi mumkin.
---

# Agent staged fayllarni commitdan oldin tekshirmadi

## Nima uchun bu skill kerak
Foydalanuvchi .env va .gitignore ni har safar tekshirib, kerak bo'lsa yangilashni buyuradi. `git add .` hamma narsani qo'shadi. Agent status va diffni ko'rmasdan commit qilsa, maxfiy ma'lumot yoki vaqtinchalik fayllar repo'ga tushishi mumkin.

## Simptom (aynan shu)
- `git add .` bajarilgan.
- Darhol `git commit` qilingan.
- `git status` yoki `git diff --cached` chaqirilmagan yoki natijasi o'qilmagan.
- Commitdan keyin `git show` yoki logda kutilmagan fayllar (.env, *.log, __pycache__) bor.

## Sabab (100%)
Agent "add qildim, demak to'g'ri" deb taxmin qilgan. Haqiqiy staged holatni (qaysi fayllar, qanday o'zgarishlar) tasdiqlamagan. .gitignore ishlamayotgan yoki yangi fayl ignore qilinmagan holatni e'tiborsiz qoldirgan.

## Tasdiqlash
1. Oxirgi git buyruqlar ketma-ketligini qara: add dan keyin status/diff bormi?
2. `git diff --cached --name-only` natijasida faqat kutilgan skill fayli va kerakli yangilanishlar (README, architecture) bormi?
3. .env, token.md yoki boshqa sensitive fayl staged emasligini tekshir.
4. Agar status ko'rilmagan bo'lsa — bu skill.

## Tuzatish (aynan shu)
Har doim add dan keyin status va cached diffni tekshir. Faqat kutilgan fayllar staged bo'lsa commit qil:

```bash
git add .
git status
git diff --cached --stat
# Agar .env yoki keraksiz fayl ko'rinsa:
# git reset HEAD .env
# yoki .gitignore ni yangila va qayta add qil
git commit -m "Add new skill: skill-name - qisqa tavsif"
```

Qoida: commitdan oldin `git status` chiqishini o'qib, faqat skill fayllari borligini tasdiqla. Sensitive fayllarni hech qachon commit qilma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `git add .` dan keyin doim `git status` va `git diff --cached` bilan nima staged ekanini tekshir.
- Keraksiz yoki maxfiy fayllar staged bo'lsa, reset qil yoki .gitignore yangila.
- Faqat kutilgan o'zgarishlar bilan commit qil.

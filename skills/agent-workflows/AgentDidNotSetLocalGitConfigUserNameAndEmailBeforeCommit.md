---
name: agent-did-not-set-local-git-config-before-commit
description: Agent commits to a cloned repository without first setting git config user.name and user.email, resulting in commits with incorrect, missing, or anonymous author information.
---

# Agent did not set local git config user.name and user.email before commit

## Nima uchun bu skill kerak
Git commit qilishda author ma'lumoti local config'dan olinadi. Agar agent repo clone qilgandan keyin `git config user.email` va `git config user.name` ni o'rnatmasa, commitlar noto'g'ri author bilan yoziladi yoki xato beradi. Bu ayniqsa avtomatlashtirilgan skill yaratish yoki o'zgarish push qilish vazifalarida tez-tez uchraydi.

## Simptom (aynan shu)
- `git commit` bajarilganda author "root <root@localhost>" yoki bo'sh/noto'g'ri bo'ladi.
- Commit history'da kutilgan "Skill Generator <automation@local>" yoki berilgan author ko'rinmaydi.
- Ba'zi muhitlarda `git commit` "Please tell me who you are" xatosi bilan to'xtaydi.
- Push qilingandan keyin GitHub'da commit author noto'g'ri ko'rinadi.

## Sabab (100%)
`git commit` har doim `user.name` va `user.email` config qiymatlarini talab qiladi. Clone qilingan repo'da bular default holatda o'rnatilmagan bo'lishi mumkin (ayniqsa container yoki yangi muhitda). Agent config o'rnatishni unutadi va to'g'ridan-to'g'ri add/commit qiladi.

## Tasdiqlash
1. Commitdan oldin `git config user.name` va `git config user.email` ni tekshir — bo'sh yoki kutilmagan qiymat qaytaryaptimi?
2. `git log --oneline -1` dan keyin author noto'g'rimi?
3. Agar config o'rnatilmasa, commit xato beradimi yoki default author ishlatiladimi?

## Tuzatish (aynan shu)
Commitdan oldin har doim local config o'rnat (repo ichida):

```bash
git config user.email "automation@local"
git config user.name "Skill Generator"
# Keyin
git add .
git commit -m "Add new skill: ..."
```

Agar global o'rnatish kerak bo'lmasa, `--local` default. Bu faqat joriy repo'ga ta'sir qiladi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Git commit author'i local config'dan keladi.
- Clone qilgandan keyin commitdan oldin user.name va user.email o'rnatish shart.
- Bu qisqa qadam noto'g'ri author va potentsial xatolarni oldini oladi.

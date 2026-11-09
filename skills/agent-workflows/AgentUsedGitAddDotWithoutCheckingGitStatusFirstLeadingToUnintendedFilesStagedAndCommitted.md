---
name: agent-used-git-add-dot-without-checking-git-status-first-leading-to-unintended-files-staged-and-committed
description: `git add .` yoki `git add -A` ishlatilganda avval `git status` tekshirilmagan, natijada keraksiz, maxfiy yoki vaqtinchalik fayllar commitga tushadi. Avval status ko'rib, faqat mo'ljallangan fayllarni qo'shish kerak.
---

# `git add .` dan oldin `git status` tekshirish

## Nima uchun bu skill kerak
Agent yoki ishlab chiqaruvchi barcha o'zgarishlarni bir buyruq bilan stage qiladi (`git add .`), lekin avval nima o'zgarganini ko'rmaydi. Bu .env, loglar, build artifactlar, yoki boshqa loyiha fayllarini tasodifan commit qilishga olib keladi — maxfiy ma'lumot sizib chiqishi yoki repo ifloslanishi mumkin.

## Simptom (aynan shu)
Commitdan keyin `git show` yoki remote'da keraksiz fayllar paydo bo'ladi: .env, __pycache__, node_modules, IDE sozlamalari, vaqtinchalik skriptlar yoki boshqa loyihaning o'zgarishlari. `git status` oldindan ishlatilmagan.

## Sabab (100%)
`git add .` (yoki `-A`, `--all`) joriy katalog va pastki papkalardagi barcha o'zgargan/yangi fayllarni stage qiladi — hech qanday filtr yoki tasdiq yo'q. Agent "hammasi kerak" deb taxmin qiladi yoki oddiylik uchun shunday qiladi, statusni o'qimasdan.

## Tasdiqlash
Terminal tarixida yoki chatda `git add .` yoki `git add -A` bor, lekin undan oldin `git status` yoki `git diff` chiqishi ko'rinmaydi. Commitda kutilmagan fayllar borligini `git log -1 --stat` yoki `git show --name-only` bilan tekshir.

## Tuzatish (aynan shu)
Har doim avval statusni ko'r, keyin aniq fayllarni qo'sh yoki filtered add ishlat:

```bash
# Avval ko'r
git status

# Agar faqat mo'ljallangan fayllar bo'lsa:
git add path/to/intended/file.md
# yoki bir nechta
git add skills/agent-workflows/NewSkill.md .gitignore

# Hech qachon ko'rmasdan:
# git add .   # XATO — bunday qilma

# Commitdan oldin yana tekshir
git status
git diff --cached
```

Agar .gitignore to'g'ri sozlangan bo'lsa ham, statusni ko'rish majburiy — yangi ignore qilinmagan fayllar bo'lishi mumkin.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`git add .` dan oldin doim `git status` ishlat va faqat kerakli fayllarni stage qil. Bu keraksiz yoki maxfiy fayllarning commitga tushishini oldini oladi va repo toza saqlanadi.

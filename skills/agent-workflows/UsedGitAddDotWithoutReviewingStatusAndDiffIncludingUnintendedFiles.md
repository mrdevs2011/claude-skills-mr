---
name: used-git-add-dot-without-reviewing-status-diff
description: git add . yoki git add -A ishlatishdan oldin git status va git diff ni ko'rib chiqmaslik — noma'lum yoki maxfiy fayllar commitga tushadi.
---

# git add . ishlatishdan oldin status/diff ni tekshirmaslik

## Nima uchun bu skill kerak
Agentlar tez-tez barcha o'zgarishlarni commit qilish uchun `git add .` yoki `git add -A` ishlatadilar. Agar avval `git status` va `git diff` bilan nima qo'shilayotganini ko'rmasa, .env, log, node_modules, vaqtinchalik fayllar yoki boshqa noma'lum o'zgarishlar ham commitga tushadi. Bu maxfiy ma'lumot oqishi yoki keraksiz fayllar repoga kirishiga olib keladi.

## Simptom (aynan shu)
- Commit yoki pushdan keyin .env, *.log, __pycache__, node_modules yoki boshqa .gitignore da bo'lishi kerak bo'lgan fayllar repo'da paydo bo'ladi.
- `git status` chaqirilmagan yoki ko'rilmagan holda `git add .` / `git add -A` bajarilgan.
- Keyinchalik `git log` yoki remote'da kutilmagan fayllar bor.
- Secret yoki lokal konfiguratsiya fayli commit tarixida qoladi.

## Sabab (100%)
Agent "hamma narsa to'g'ri" deb taxmin qiladi va to'liq review qilmasdan yoppasiga add qiladi. Qaysi fayllar o'zgargan, qaysilari yangi, qaysilari ignore qilinishi kerakligini tekshirmaydi. Natijada nomaqbul fayllar ham staged bo'ladi.

## Tasdiqlash
- `git add .` yoki `git add -A` chaqiruvidan oldin `git status` va/yoki `git diff` (yoki `git diff --cached`) bajarilganmi?
- `git status` chiqishida kutilmagan fayllar (masalan .env, *.log) "Changes to be committed" yoki "Untracked" da bormi?
- Commitdan keyin `git show --name-only HEAD` da noma'lum fayllar bormi?

## Tuzatish (aynan shu)
Har doim add qilishdan oldin review qil va aniq fayllarni qo'sh:

1. Avval `git status` ni ishga tushir — nima o'zgarganini ko'r.
2. Agar kerak bo'lsa `git diff` yoki `git diff --stat` bilan mazmunni tekshir.
3. Faqat kerakli fayllarni aniq qo'sh: `git add path/to/specific/file.md` yoki bir nechta aniq path.
4. `git add .` ishlatma, agar aniq nima qo'shilayotganini bilmasang.
5. Add qilgandan keyin yana `git status` bilan staged fayllarni tasdiqla.
6. Agar noma'lum fayl staged bo'lsa — `git restore --staged fayl` bilan olib tashla, keyin .gitignore ga qo'sh.

Misol:
```bash
# Noto'g'ri:
git add .
git commit -m "update"

# To'g'ri:
git status
# (ko'rib chiq, faqat keraklilarini ko'r)
git add skills/agent-workflows/YangiSkill.md README.md
git status   # yana tekshir
git commit -m "Add new skill: ..."
```

Agar .gitignore yetarli emas bo'lsa, avval uni yangila, keyin add qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `git add .` ishlatishdan oldin har doim `git status` va kerak bo'lsa `git diff` qil.
- Faqat aniq, ko'rib chiqilgan fayllarni stage qil — yoppasiga emas.
- Bu oddiy qadam maxfiy fayllar yoki keraksiz o'zgarishlarning commitga tushishini oldini oladi.

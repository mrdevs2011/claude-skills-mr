---
name: agent-pushed-skill-changes-to-wrong-branch-or-feature-branch-instead-of-origin-main-as-required
description: When agent clones the skills repo, adds a new skill, commits, but pushes to a feature branch or wrong branch instead of origin main, violating the explicit task instructions to push to main.
---

# Agent Pushed Skill Changes To Wrong Branch Or Feature Branch Instead Of Origin Main

## Nima uchun bu skill kerak
Vazifa aniq "git push origin main" deb belgilangan. Noto'g'ri branchga push qilish skillni asosiy bazaga qo'shmaydi, keyingi ishlar uchun available qilmaydi va instruktsiyani buzadi.

## Simptom (aynan shu)
- `git push origin feature/new-skill` yoki `git push` (default branch boshqa bo'lsa) ishlatilgan.
- Remote'da yangi skill main'da ko'rinmaydi.
- Vazifa "push origin main" deb aytgan, lekin bajarilmagan.

## Sabab (100%)
Agent umumiy git odatini (feature branch) ishlatdi yoki joriy branchni tekshirmasdan push qildi. Aniq instruktsiyani e'tiborsiz qoldirdi.

## Tasdiqlash
- `git branch` yoki `git status` joriy branch main emasligini ko'rsatadi.
- Push komandasi `origin main` emas.
- Clone'dan keyin `git checkout main` qilinmagan (agar kerak bo'lsa).

## Tuzatish (aynan shu)
1. `git checkout main` (agar boshqa branchda bo'lsa).
2. O'zgarishlarni main'ga merge yoki to'g'ridan-to'g'ri main'da ishla.
3. `git push origin main`
4. Pushdan keyin `git log origin/main -1` bilan tekshir.

Misol:
```bash
# Noto'g'ri
git checkout -b new-skill
git push origin new-skill

# To'g'ri
git checkout main
git add .
git commit -m "Add new skill: ..."
git push origin main
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill generatsiya vazifasida doim `git push origin main` ishlat. Boshqa branchga push qilma. Bu skillni to'g'ri joyga joylashtiradi va vazifani to'liq bajaradi.

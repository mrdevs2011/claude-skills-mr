---
name: agent-did-not-set-git-user-before-commit
description: Agent skill qo'shgandan keyin git commit qilishdan oldin git config user.email va user.name ni o'rnatmadi — commit noto'g'ri yoki default author bilan yaratildi, talab qilingan "Skill Generator" o'rniga.
---

# Commitdan oldin git user config o'rnatmaslik

## Nima uchun bu skill kerak
Bu repo'da skill push qilish jarayonida aniq git config user.email "automation@local" va user.name "Skill Generator" o'rnatilishi majburiy. O'rnatmasdan commit qilish noto'g'ri author ma'lumotiga olib keladi, tarixni ifloslantiradi va user instruktsiyasiga zid.

## Simptom (aynan shu)
- Yangi skill fayli qo'shildi va git add qilindi.
- git commit qilishdan oldin `git config user.email "automation@local"` va `git config user.name "Skill Generator"` bajarilmadi.
- Commit default yoki boshqa user bilan yaratildi.
- Natijada git log da noto'g'ri author ko'rinadi.

## Sabab (100%)
Agent user qadamlaridagi aniq "git config user.email ...; git config user.name ..." buyrug'ini o'tkazib yubordi yoki oldindan o'rnatilgan deb taxmin qildi. Har commitdan oldin qayta o'rnatish talab qilinadi.

## Tasdiqlash
1. Commitdan oldin `git config user.email` va `git config user.name` chaqirilganmi?
2. Qiymatlar aniq "automation@local" va "Skill Generator"mi?
3. Agar chaqirilmagan yoki boshqa qiymat bo'lsa — shu holat.
4. `git log -1 --format='%an %ae'` bilan tekshir.

## Tuzatish (aynan shu)
Commitdan oldin har doim aniq config o'rnat:

```bash
git config user.email "automation@local"
git config user.name "Skill Generator"
git add .
git commit -m "Add new skill: [skill-name] - [qisqa tavsif]"
```

Tekshirish:
```bash
git log -1 --format='Author: %an <%ae>'
# Kutilgan: Author: Skill Generator <automation@local>
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Har skill commitdan oldin git config user.email va user.name ni aniq o'rnat.
- Bu to'g'ri author bilan commit yaratilishini ta'minlaydi.
- "Oldin o'rnatilgan" deb taxmin qilma — qadamni qat'iy bajaraver.

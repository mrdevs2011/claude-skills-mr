---
name: agent-reported-skill-push-without-commit-hash
description: Yangi skill yaratib push qilgandan so'ng hisobotda commit hash va push muvaffaqiyatini aniq ko'rsatmagan — foydalanuvchi tasdiqlash uchun kerakli ma'lumot yo'q.
---

# Skill push hisobotida commit hash va push natijasini keltirmaslik

## Nima uchun bu skill kerak
Foydalanuvchi skill generatsiya jarayonidan so'ng aniq hisobot so'raydi: skill nomi, o'qilgan qo'llanmalar, commit hash, push muvaffaqiyatli yoki yo'q. Hash bo'lmasa, remote'da nima o'zgarganini tekshirib bo'lmaydi.

## Simptom (aynan shu)
- Skill fayli yaratildi, git commit va push bajarildi.
- Oxirgi javobda "push muvaffaqiyatli" deyildi, lekin commit hash (masalan `a1b2c3d`) keltirilmadi.
- Yoki `git log -1 --oneline` yoki `git rev-parse HEAD` natijasi hisobotga qo'shilmadi.
- Foydalanuvchi "commit hash" ni so'ragan bo'lsa ham yo'q.

## Sabab (100%)
Agent push buyrug'ining chiqishini o'qib, success deb hisoblagan, lekin aniq hash ni olish va hisobotga qo'shish qadamini o'tkazib yuborgan. "Ishladim" deb umumiy gap yozgan.

## Tasdiqlash
1. Pushdan keyin `git log -1 --format="%H %s"` yoki `git rev-parse --short HEAD` chiqishini ko'r.
2. Oxirgi foydalanuvchi javobida shu hash bormi?
3. Agar yo'q bo'lsa — shu skill qo'llaniladi.
4. Push chiqishida "rejected" yoki xato bormi? Bo'lsa success dema.

## Tuzatish (aynan shu)
Pushdan so'ng darhol:

```bash
cd /tmp/skills-repo
git rev-parse HEAD
git log -1 --oneline
git status
```

Hisobotda aniq yoz:
- Skill nomi: [to'liq fayl nomi]
- O'qilgan qo'llanmalar: architecture.md, instruction.md, style.md
- Commit hash: [to'liq yoki qisqa hash]
- Push: muvaffaqiyatli (yoki aniq xato)

Xato bo'lsa "muvaffaqiyatli" dema, xato matnini ayt.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Skill push qilgandan so'ng har doim commit hash ni ol va hisobotga qo'sh.
- Push chiqishini tekshir, success faqat haqiqiy bo'lsa yoz.
- Bu foydalanuvchiga remote o'zgarishni tasdiqlash imkonini beradi.

---
name: agent-did-not-use-git-log-after-push-to-get-exact-commit-hash-for-report
description: Agent push muvaffaqiyatli bo'lganini local exit code asosida taxmin qildi, lekin aniq commit hashni olish uchun git log --oneline -1 ishlatmadi — hisobotda hash yo'q yoki noto'g'ri bo'ldi.
---

# Pushdan keyin aniq commit hash olish uchun git log ishlatilmagan

## Nima uchun bu skill kerak
Avtomatlashtirilgan skill yaratish va push qilishda oxirgi hisobotda aniq commit hash talab qilinadi. Faqat `git push` exit code 0 bo'lsa, u remote'da qabul qilinganini va qaysi hash ekanini tasdiqlamaydi. Git log orqali oxirgi commitni olish majburiy.

## Simptom (aynan shu)
- `git push origin main` muvaffaqiyatli chiqdi (exit 0).
- Hisobotda commit hash "success" yoki taxminiy, yoki umuman yo'q.
- `git log --oneline -1` chaqirilmagan.
- Remote'da commit borligini tekshirish (git fetch yoki log) qilinmagan.
- Foydalanuvchi so'ragan "commit hash" aniq ko'rsatilmagan.

## Sabab (100%)
Agent push buyrug'ining local muvaffaqiyatini yetarli deb hisoblab, remote tasdiq va aniq hash olish qadamini o'tkazib yubordi. Hisobot talablarini to'liq bajarmadi.

## Tasdiqlash
1. Push buyrug'i bajarilganmi va exit code 0mi?
2. Undan keyin `git log --oneline -1` yoki ekvivalent chaqirilganmi?
3. Agar yo'q — hash hisobotda aniq bo'lmaydi. Skill kerak.

## Tuzatish (aynan shu)
Pushdan so'ng doim oxirgi commitni tekshir:

```bash
git log --oneline -1
# yoki
git rev-parse HEAD
```

Natijadagi hashni hisobotga aniq yoz. Agar push rejected bo'lsa, xatoni to'liq chiqar, success dema.

Noto'g'ri: pushdan keyin darhol "push muvaffaqiyatli, hash: xxx" deb taxmin qilish.

To'g'ri:
```bash
git push origin main
git log --oneline -1
# Outputdan hashni olib hisobotga qo'sh
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Push exit code yetarli emas. Doim `git log --oneline -1` bilan aniq commit hashni ol va hisobotda shuni ko'rsat. Bu remote tasdiq va aniq hisobotni ta'minlaydi.

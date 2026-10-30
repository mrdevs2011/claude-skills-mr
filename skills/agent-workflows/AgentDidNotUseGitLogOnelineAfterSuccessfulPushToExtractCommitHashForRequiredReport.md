---
name: agent-did-not-extract-commit-hash-after-push
description: Skill push qilingandan keyin agent git log --oneline -1 bilan commit hashni olib, hisobotga kiritmaydi — foydalanuvchi talab qilgan "commit hash" maydoni yo'q yoki noto'g'ri bo'ladi.
---

# Pushdan keyin commit hashni git log bilan olmaslik

## Nima uchun bu skill kerak
Vazifa oxirida hisobotda skill nomi, o'qilgan qo'llanmalar, **commit hash** va push muvaffaqiyatli ekanligi talab qilinadi. Push muvaffaqiyatli bo'lsa ham, hashni remote'dan yoki local logdan aniq olmasdan taxmin qilish yoki umuman kiritmaslik hisobotni to'liqmas qiladi va keyingi tekshiruvni qiyinlashtiradi.

## Simptom (aynan shu)
- Oxirgi javobda commit hash yo'q yoki "unknown", "see log", placeholder.
- `git log --oneline -1` chaqirilmagan yoki chiqishi o'qilmagan.
- Hash qisqa (7 belgi) o'rniga to'liq yoki umuman yo'q.
- Push "success" deb yozilgan, lekin hash bilan bog'lanmagan.

## Sabab (100%)
Agent push buyrug'i exit code 0 bo'lganini yetarli deb hisoblab, keyingi qadamda `git log --oneline -1` yoki `git rev-parse HEAD` bilan aniq hashni olishni unutgan. Hisobot shablonini to'liq bajarmagan.

## Tasdiqlash
1. Pushdan keyin `git log --oneline -1` chaqirilganmi?
2. Chiqishdan hash (birinchi 7+ belgi) olinganmi?
3. Hisobotda shu hash aniq yozilganmi?
4. Push outputida "main -> main" yoki "Everything up-to-date" tekshirilganmi?

## Tuzatish (aynan shu)
Push muvaffaqiyatli bo'lgach:

```bash
git log --oneline -1
# Chiqishdan hashni olib hisobotga yoz:
# commit hash: abc1234
```

Agar remote tekshirish kerak bo'lsa:

```bash
git fetch origin
git log origin/main --oneline -1
```

Hisobotga aynan shu hashni kiriting. Taxmin qilmang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Pushdan keyin hashni doim `git log --oneline -1` bilan oling.
- Hisobotda aniq hash bo'lishi shart — placeholder yoki yo'q qoldirmang.
- Exit code 0 yetarli emas; hashni tasdiqlang.

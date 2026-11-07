---
name: agent-did-not-use-git-rev-parse-head-after-successful-push-to-obtain-exact-full-commit-hash-for-mandatory-report
description: Skill yaratish va push qilgandan keyin hisobotda to'liq commit hashni olish uchun git rev-parse HEAD ishlatilmagan. Qachon: avtomatik skill generator vazifasida push muvaffaqiyatli bo'lsa-da, oxirgi hisobotda aniq hash yo'q yoki noto'g'ri.
---

# Pushdan keyin to'liq commit hashni git rev-parse HEAD bilan olish

## Nima uchun bu skill kerak
Foydalanuvchi oxirida hisobot so'raydi: skill nomi, o'qilgan qo'llanmalar, commit hash, push muvaffaqiyatli. Hashni taxmin qilish yoki git log -1 --oneline dan qisqa olish yetarli emas — to'liq hash kerak bo'lishi mumkin. git rev-parse HEAD aniq va to'liq hashni beradi.

## Simptom (aynan shu)
- Push muvaffaqiyatli (exit 0).
- Hisobotda commit hash yo'q, qisqa oneline hash yoki noto'g'ri qiymat bor.
- git log ishlatilgan, lekin to'liq 40-belgili hash olinmagan.

## Sabab (100%)
Agent push qilgandan keyin darhol hisobot yozishga o'tdi va hashni olish uchun maxsus buyruq (git rev-parse HEAD yoki git log -1 --format=%H) chaqirmadi. Yoki oldingi sessiyadagi hashni ishlatdi.

## Tasdiqlash
1. git push origin main muvaffaqiyatli bo'ldimi (exit code 0, "main -> main" yoki shunga o'xshash)?
2. Pushdan keyin `git rev-parse HEAD` chaqirilganmi?
3. Chiqgan 40-belgili hash hisobotda aniq ko'rsatilganmi?
4. Token yoki maxfiy ma'lumot hisobotda yo'qmi?

## Tuzatish (aynan shu)
Push muvaffaqiyatli bo'lgandan keyin darhol hashni ol:

```bash
cd /tmp/skills-repo
git push origin main
# muvaffaqiyatli bo'lsa:
git rev-parse HEAD
# chiqqan to'liq hashni hisobotga yoz
```

Yoki:

```bash
git log -1 --format=%H
```

Hisobotda: "Commit hash: abc123...fullhash"

Xato bo'lsa, aniq stderr/stdout ni ayt, success deb yozma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Pushdan keyin hisobot uchun hashni albatta git rev-parse HEAD yoki ekvivalent bilan ol.
- Qisqa hash yetarli emas, to'liq hashni ko'rsat.
- Bu qadamni o'tkazib yuborma — majburiy hisobot qismi.

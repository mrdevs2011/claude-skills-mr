---
name: agent-did-not-include-read-guidelines-and-commit-hash-in-required-final-report
description: Agent completes skill creation and push but final report misses the required elements: skill name, list of read guidelines (architecture.md, instruction.md, style.md), exact commit hash, and explicit push success confirmation.
---

# Agent did not include read guidelines and commit hash in required final report format

## Nima uchun bu skill kerak
Vazifa "Har soatda yangi skill yarat va push qil" bo'lganda, oxirida aniq hisobot so'raladi: skill nomi, o'qilgan qo'llanmalar, commit hash, push muvaffaqiyatli. Agent buni to'liq yozmasa, vazifa yarim bajarilgan hisoblanadi.

## Simptom (aynan shu)
- Skill yaratildi, commit va push qilindi, lekin javobda "architecture.md, instruction.md, style.md o'qildi" yoki aniq commit hash yo'q.
- Hisobotda faqat "success" yoki skill nomi bor, lekin talab qilingan 4 element to'liq emas.
- Commit hash `git log` dan olinmagan, taxminiy yoki yo'q.

## Sabab (100%)
Agent vazifaning 11-qadamini (oxirida hisobot) to'liq o'qimaydi yoki pushdan keyin `git log -1 --oneline` yoki `git rev-parse HEAD` ni ishlatmaydi. Qo'llanmalarni o'qiganini hisobotda eslatishni unutadi.

## Tasdiqlash
1. Pushdan keyin javob matnini tekshir — skill nomi, o'qilgan fayllar ro'yxati, commit hash, "push muvaffaqiyatli" so'zi bormi?
2. `git log -1 --format="%H %s"` bilan haqiqiy hashni solishtir.
3. Agar hash yo'q yoki noto'g'ri — bu aynan shu muammo.

## Tuzatish (aynan shu)
Pushdan keyin darhol:

```bash
git log -1 --format="%H"
```

Keyin hisobotni aniq shu formatda yoz:

- Skill nomi: [name]
- O'qilgan qo'llanmalar: architecture.md, instruction.md, style.md (va boshqalar agar o'qilgan bo'lsa)
- Commit hash: [to'liq hash]
- Push: muvaffaqiyatli (origin main)

Tokenni hech qachon hisobotga kiritma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Har bir skill yaratish vazifasi oxirida to'liq hisobot shart.
- Commit hashni tool outputdan aniq ol, taxmin qilma.
- O'qilgan qo'llanmalarni ro'yxat qilib ayt.

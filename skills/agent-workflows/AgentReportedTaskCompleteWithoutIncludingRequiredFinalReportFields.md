---
name: reported-complete-without-required-report-fields
description: Agent vazifani yakunlaganini aytadi, lekin so'ralgan hisobot maydonlarini (skill nomi, o'qilgan qo'llanmalar, commit hash, push holati) kiritmaydi — foydalanuvchi tekshira olmaydi.
---

# Vazifa tugatilgan deb hisobot berish, lekin majburiy maydonlarni kiritmaslik

## Nima uchun bu skill kerak
Ko'p avtomatlashtirish yoki skill yaratish vazifalarida foydalanuvchi oxirida aniq hisobot so'raydi: nima yaratildi, qaysi hujjatlar o'qildi, commit hash, push muvaffaqiyatliligi. Agent "tayyor" deb yozadi, lekin bu maydonlarni tashlab ketadi. Natijada ishonch yo'qoladi va qayta so'rash kerak bo'ladi.

## Simptom (aynan shu)
- Agent javobida "skill yaratildi va push qilindi" deb yozilgan, lekin skill nomi, commit hash yoki push natijasi yo'q.
- O'qilgan qo'llanmalar (architecture.md, instruction.md, style.md) ro'yxati kiritilmagan.
- Foydalanuvchi "hisobotda nima bor?" deb qayta so'rashga majbur bo'ladi.
- Xato bo'lsa ham "muvaffaqiyatli" deb yozilgan, lekin aniq xato matni yo'q.

## Sabab (100%)
Agent so'ralgan formatni "ixtiyoriy" deb hisoblagan yoki yakuniy javobni qisqartirishga harakat qilgan. Vazifa qadamlari bajarilganini tekshirishni hisobotga bog'lamagan.

## Tasdiqlash
1. Foydalanuvchi so'rovining oxiridagi "hisobot" yoki "oxirida ayt" qismini o'qi.
2. Agent javobida so'ralgan barcha maydonlar (nomi, hash, status, o'qilgan fayllar) bormi tekshir.
3. Agar push/clone xato bersa, "success" yozilganmi yoki aniq xato aytilganmi?

## Tuzatish (aynan shu)
Hisobotni alohida, aniq formatda yoz. Misoli:

```
Skill: AgentReportedTaskCompleteWithoutIncludingRequiredFinalReportFields
O'qilgan qo'llanmalar: architecture.md, instruction.md, style.md
Commit hash: abc1234
Push: muvaffaqiyatli (origin/main)
```

Qoidalar:
- Har bir so'ralgan maydonni alohida qator qil.
- Xato bo'lsa, hech qachon "success" yozma — aniq xato matnini ber.
- Token yoki maxfiy ma'lumotni hisobotga kiritma.
- Oxirgi qadam sifatida hisobotni yozishni reja qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Vazifa tugaganini aytish yetarli emas. So'ralgan aniq hisobot maydonlarini har doim kirit — aks holda foydalanuvchi natijani tekshira olmaydi.

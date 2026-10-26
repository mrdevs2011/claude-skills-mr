---
name: generic-or-incomplete-commit-message
description: Agent skill qo'shganda commit xabarini "Add new skill: [nom] - [qisqa tavsif]" formatida yozmaydi — generic "update" yoki faqat nom qoldiradi, keyin qidiruv va tarix noaniq bo'ladi.
---

# Skill qo'shishda commit xabarini talab qilingan formatda yozmaslik

## Nima uchun bu skill kerak
Skill yaratish vazifasida aniq commit xabari formati berilgan: "Add new skill: [skill-name] - [qisqa tavsif]". Bu format keyinchalik `git log` orqali skillni tez topish, nima qo'shilganini tushunish va hisobotda ishlatish uchun kerak. Generic xabar ("update skills", "new skill") yoki faqat nom qoldirilsa, tarix chalkash bo'ladi va avtomatlashtirish ishlamaydi.

## Simptom (aynan shu)
- `git log --oneline` da commit xabari "Add new skill: LongDescriptiveName.md - qisqa tavsif" emas.
- Xabar "update", "add skill", "new file" yoki faqat skill nomi.
- Hisobotda commit hash bor, lekin xabar formati tekshirilmagan.
- Keyingi skill qidiruvi yoki changelog noaniq.

## Sabab (100%)
Agent vazifa qadamlaridagi aniq formatni e'tiborsiz qoldirdi yoki qisqa xabar yetarli deb hisobladi. Commitdan oldin xabar shablonini o'qib, o'z xabarini unga solishtirmadi.

## Tasdiqlash
1. Vazifa matnida "git commit -m \"Add new skill: [skill-name] - [qisqa tavsif]\"" qismini top.
2. `git log -1 --pretty=%B` bilan oxirgi commit xabarini ol.
3. Formatga mos keladimi: "Add new skill: " bilan boshlanadi, skill nomi va qisqa tavsif bor.

## Tuzatish (aynan shu)
Commitdan oldin xabarni aniq shu formatda yoz:

```bash
git commit -m "Add new skill: AgentUsedGenericOrIncompleteCommitMessageInsteadOfRequiredSkillNameAndDescriptionFormat - skill qo'shishda commit xabari talab qilingan formatda emas"
```

Qoidalar:
- [skill-name] — fayl nomining asosiy qismi (kengaytmasiz yoki to'liq).
- [qisqa tavsif] — 5-12 so'z, nima muammo va nima tuzatiladi.
- Hech qachon generic "update" yoki bo'sh xabar ishlatma.
- Commitdan keyin `git log -1` bilan tekshir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Skill qo'shish commit xabari ixtiyoriy emas. Aniq "Add new skill: Nom - tavsif" formatini ishlat — keyin tarix, qidiruv va hisobot toza bo'ladi.

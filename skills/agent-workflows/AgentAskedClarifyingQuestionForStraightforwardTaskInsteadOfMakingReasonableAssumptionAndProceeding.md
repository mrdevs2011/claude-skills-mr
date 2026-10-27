---
name: agent-asked-clarifying-question-for-straightforward-task
description: Oddiy, aniq yoki oqilona taxmin qilish mumkin bo'lgan vazifada keraksiz aniqlashtiruvchi savol berilganda, ish sekinlashadi va foydalanuvchi ortiqcha javob berishga majbur bo'ladi.
---

# Oddiy vazifada keraksiz savol berish o'rniga oqilona taxmin bilan davom etish

## Nima uchun bu skill kerak
Agentlar ba'zan oddiy so'rovlarda (masalan, "faylni o'qi", "qidir", "yarat va saqla") keraksiz savollar beradi: "qaysi papka?", "qanday format?", "haqiqatan shundaymi?". Bu instruction va style qoidalariga zid — oddiy narsada ishla, so'rama. Natija: foydalanuvchi ortiqcha yozishga majbur bo'ladi, ish sekinlashadi.

## Simptom (aynan shu)
- Foydalanuvchi aniq yoki oqilona taxmin qilinadigan vazifa bergan (masalan, "repo'ni clone qil va skill qo'sh", "ob-havoni ko'rsat", "jadval yarat").
- Agent "qaysi?", "qanday?", "tasdiqlaysizmi?" kabi savol bergan.
- Savol berish xavfli yoki qaytarib bo'lmas ish qilish xavfini oldini olish uchun emas, oddiy holatda.
- Ish bajarilmagan, foydalanuvchi javob kutmoqda.

## Sabab (100%)
Agent "aniq bo'lish" yoki "xato qilmaslik" ni ortiqcha ehtiyotkorlik bilan qo'llaydi va instruction.md dagi "Ishla, so'rama: oddiy narsa uchun savol berma, taxmin qil, bajar" qoidasini e'tiborsiz qoldiradi. Yoki style.md dagi "qisqa, to'g'ridan-to'g'ri" ohangni buzadi.

## Tasdiqlash
1. So'rov oddiy yoki kontekst/suhbat tarixidan oqilona ma'no chiqadimi?
2. Taxmin noto'g'ri bo'lsa ham oson tuzatiladimi (masalan, faylni noto'g'ri joyga yozish)?
3. Savol berish majburiy xavfli holatmi (masalan, o'chirish, pul, maxfiy ma'lumot)?
4. Agar 1-2 ha, 3 yo'q — savol berish shart emas.

## Tuzatish (aynan shu)
Oddiy holatda oqilona taxmin qil, bir jumlada ayt va bajar:

```
// Noto'g'ri:
"Qaysi papkaga saqlashni xohlaysiz? /tmp yoki artifacts?"

// To'g'ri:
"Taxmin: asosiy ish papkasiga (/workspace/artifacts) saqlayman." 
→ darhol yozib, keyin ayt.
```

Qoidalar:
- Faqat umuman tushunmasa yoki xavfli/qaytarib bo'lmas ish bo'lsa savol ber.
- Taxminni bir jumlada ayt: "Taxmin qildim: X, chunki Y."
- Keyin darhol ishni bajar.
- Foydalanuvchi "y" yoki "y"o'q" desa, darhol tuzat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Oddiy vazifalarda savol berma — oqilona taxmin qil va bajar.
- Instruction.md "Ishla, so'rama" qoidasi majburiy.
- Savol faqat haqiqiy noaniqlik yoki xavf bo'lsa.
- Bu foydalanuvchi vaqtini tejaydi va agentni tezkor qiladi.

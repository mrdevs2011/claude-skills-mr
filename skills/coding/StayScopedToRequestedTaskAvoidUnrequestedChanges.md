---
name: stay-scoped-to-requested-task
description: Kod yozishda aynan so'ralgan narsaga e'tiborni saqlash — keraksiz refaktor, oshiqcha fayl yoki ortiqcha "yaxshilash" qilmaslik (bu meta-skill, bitta aniq bug emas, umumiy odob uchun).
---

# Vazifaga aniq qolish, keraksiz o'zgarish qilmaslik

## Nima uchun bu skill kerak
Bu — aniq bir xato turi emas, har qanday kod yozish vazifasida qo'llanadigan
umumiy odob: faqat so'ralganini qilish, ortiqcha "yaxshilash"dan tiyilish.

## Qoidalar
- Faqat so'ralgan narsani qil. "Bu yerda ham yaxshilasam bo'ladi" deb
  so'ralmagan joylarni o'zgartirma.
- Katta o'zgarishdan oldin: nima o'zgaradi, qaysi fayllar tegadi — qisqa
  aytib o't, keyin qil.
- Mavjud kod uslubiga mos yoz (nomlash, formatlash, fayl tuzilishi) —
  o'zingcha yangi uslub kiritma.
- Muammoni hal qilish uchun eng kichik, aniq o'zgarishni tanla — katta
  qayta yozishga shoshilma, agar aniq so'ralmagan bo'lsa.
- Noaniq joy bo'lsa — taxmin qilib davom etishdan oldin bitta aniq savol
  ber, keyin davom et.

## Nima qilmaslik kerak
- So'ralmagan yangi kutubxona yoki dependency qo'shish.
- "Kelajakda kerak bo'lishi mumkin" deb hozir ishlatilmaydigan kod yozish.
- Bitta kichik so'rovga javoban butun faylni qayta tuzish.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Har bir o'zgarish so'ralgan doiraga mos kelishi kerak — "yo'lda ko'rgan
  boshqa kamchilik"ni o'zingcha tuzatib yurmaslik.
- Katta o'zgarishdan oldin qisqa reja aytish, keyin bajarish.

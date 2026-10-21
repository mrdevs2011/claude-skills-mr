---
name: sequential-tool-calls-when-parallel-possible
description: Mustaqil tool chaqiruvlarini ketma-ket bajarish, parallel qilish mumkin bo'lganda — vaqt va token isrofi, sekin ish oqimi.
---

# Mustaqil tool chaqiruvlarini parallel qilmasdan ketma-ket bajarish

## Nima uchun bu skill kerak
Agentlar (va insonlar) bir nechta bir-biriga bog'liq bo'lmagan tool chaqiruvlarini (fayl o'qish, qidiruv, API so'rov, bash buyruq) ketma-ket qilishadi. Natijada umumiy kechikish oshadi, kontekst tez to'ladi, foydalanuvchi uzoq kutadi. Parallel qilish mumkin bo'lgan holatlarda bu keraksiz.

## Simptom (aynan shu)
- Bir nechta mustaqil ma'lumot kerak (masalan, 3 ta turli faylni o'qish, yoki web_search + local file read, yoki bir nechta git status / ls).
- Agent ularni birin-ketin chaqiradi: avval biri, javobini kutadi, keyin keyingisi.
- Hech qanday bog'liqlik yo'q (birining natijasi ikkinchisiga kerak emas), lekin ketma-ket bajarilgan.
- Umumiy vaqt = summa, parallel bo'lganda max bo'lishi mumkin edi.

## Sabab (100%)
Agent "birin-ketin reja" yozadi va har bir tool javobini kutib, keyingi qadamni rejalashtiradi. Parallel chaqirish imkoniyatini (bir vaqtda bir nechta tool) e'tiborsiz qoldiradi yoki "avval ko'ray, keyin qaror qilaman" deb ketma-ket qiladi, holbuki mustaqil.

## Tasdiqlash
- Keyingi tool chaqiruvi oldingi toolning natijasiga tayanadimi? (agar ha, ketma-ket to'g'ri)
- Agar tayanmasa — ular parallel chaqirilishi mumkinmi?
- Logda yoki rejalashtirishda "avval A, keyin B, keyin C" deb yozilgan, lekin A/B/C bir-biriga bog'liq emasmi?

## Tuzatish (aynan shu)
Mustaqil tool chaqiruvlarni **bir vaqtda** (parallel) chaqir:

1. Avval qaysilari mustaqil ekanini aniqlа: birining natijasi ikkinchisiga kerak bo'lmasa — parallel.
2. Bir tool response da bir nechta tool chaqiruvini yubor (platforma ruxsat bersa, masalan function calls parallel).
3. Faqat bog'liq bo'lganlarini ketma-ket qil.

Misol (agent rejalashtirish):
```
# Noto'g'ri (ketma-ket, mustaqil):
1. read_file architecture.md
2. (javobni kutib) read_file style.md
3. (javobni kutib) read_file instruction.md

# To'g'ri (parallel):
Bir vaqtda:
- read_file architecture.md
- read_file style.md
- read_file instruction.md
Keyin uchalasining natijasidan foydalan.
```

Bash da ham: mustaqil buyruqlarni alohida parallel ishga tushirish yoki `wait` bilan.

Faqat haqiqiy bog'liqlik bo'lsa ketma-ket qil. Aks holda parallel — tezroq, kamroq round-trip.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Mustaqil tool chaqiruvlarini parallel qil, ketma-ket qilma.
- Bu vaqtni qisqartiradi va foydalanuvchi kutishini kamaytiradi.
- Avval bog'liqlikni tekshir, keyin parallel yoki sequential qaror qil.

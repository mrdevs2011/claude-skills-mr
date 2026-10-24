---
name: agent-executed-independent-tool-calls-sequentially
description: Bir nechta bir-biriga bog'liq bo'lmagan tool chaqiruvlari ketma-ket bajarilganda, parallel batch ishlatilmasligi tufayli vaqt yo'qotiladi.
---

# Mustaqil tool chaqiruvlarini ketma-ket bajarish o'rniga parallel

## Nima uchun bu skill kerak
Agentlar ko'pincha bir nechta mustaqil tool'larni (masalan, bir nechta web_search, yoki read_file + web_search) ketma-ket chaqirishadi. Bu har bir javobni kutishni talab qiladi va umumiy vaqtni sezilarli oshiradi. Parallel chaqirish mumkin bo'lganda uni ishlatmaslik samarasizlikdir.

## Simptom (aynan shu)
- Bir xabar ichida bir nechta tool function call qilingan, lekin ular bir-biriga bog'liq emas (natija birining ikkinchisiga kerak emas).
- Har bir tool alohida, ketma-ket ishga tushirilgan (oldingi tugagandan keyin keyingisi).
- Umumiy ish vaqti tool'larning yig'indisi bo'lib qolgan, parallel bo'lsa eng uzuniga teng bo'lishi mumkin edi.
- Hech qanday data dependency yo'q, lekin baribir sequential.

## Sabab (100%)
Model yoki agent workflow'i tool chaqiruvlarini "birinchi birini, keyin natijasini ko'rib keyingisini" tarzida rejalashtiradi, hatto ular mustaqil bo'lsa ham. Parallel batch (bir vaqtda bir nechta function call) imkoniyatidan foydalanmaydi.

## Tasdiqlash
1. Rejalashtirilgan tool chaqiruvlarini ko'rib chiq: birining natijasi ikkinchisining argumentiga kerakmi?
2. Agar yo'q bo'lsa (masalan, ikkita mustaqil web_search, yoki read_file + bash ls), ular parallel bo'lishi mumkin.
3. Hozirgi chaqiruvlar ketma-ketmi? (bir xabar = bitta tool, keyingi xabarda ikkinchisi)
4. Parallel qilsang, bir xabarda bir nechta tool chaqiruvi bo'lishi kerak.

## Tuzatish (aynan shu)
Mustaqil tool'larni bitta xabarda parallel function call sifatida chaqir:

```
// Noto'g'ri (sequential):
1. web_search(query="topic A")
   → natija ol
2. web_search(query="topic B")
   → natija ol

// To'g'ri (parallel):
Bir xabarda:
- web_search(query="topic A")
- web_search(query="topic B")
→ ikkalasi bir vaqtda bajariladi
```

Qoidalar:
- Faqat mustaqil bo'lganlarni parallel qil.
- Birining natijasi ikkinchisiga kerak bo'lsa — ketma-ket qoldir.
- Maksimal parallel miqdorni oshirib yuborma (odatda 3-5 yetarli).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Mustaqil tool chaqiruvlarini parallel batch qilish vaqtni tejaydi.
- Dependency bo'lmagan hollarda sequential ishlatish samarasizlik.
- Har doim "bu natija keyingisiga kerakmi?" deb so'rab, parallel imkoniyatni tekshir.

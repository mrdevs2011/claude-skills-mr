---
name: agent-used-open-page-without-pattern-or-start-line-on-long-document-causing-truncation
description: Agent uzun sahifa yoki hujjat uchun open_page ni pattern yoki start_line ishlatmasdan chaqirdi — natija kesildi, muhim bo'limlar yo'qoldi, to'liq javob chiqmadi.
---

# Uzun sahifada open_page ni pattern/start_line ishlatmasdan chaqirish

## Nima uchun bu skill kerak
open_page tool'i uzun sahifalarda to'liq matnni qaytarishi mumkin, lekin ba'zan truncation yoki limit tufayli to'liq kontent kelmaydi. Pattern (regex) yoki start_line ishlatilmasa, agent faqat bosh qismini ko'radi va muhim keyingi bo'limlar (misollar, API parametrlar, xato holatlari) yo'qoladi. Bu noto'g'ri yoki to'liqmas javobga olib keladi. Architecture va instruction.md da "eng arzon ishonchli yo'l" va "faqat kerakli qismni o'qi" qoidalariga mos keladi.

## Simptom (aynan shu)
- Foydalanuvchi uzun dokumentatsiya, README, architecture.md, instruction.md yoki API sahifasini o'qishni so'radi.
- Agent open_page(url=...) ni hech qanday pattern yoki start_line siz chaqiradi.
- Natija "truncated" yoki faqat birinchi N qator/bo'lim bilan keladi.
- Javobda keyingi muhim qismlar (masalan "Tuzatish", "Misollar", "Cheklovlar") yo'q yoki "to'liq emas" deb aytadi.
- Agent pattern="..." yoki start_line=... ishlatmagan.

## Sabab (100%)
Agent open_page default holatda yetarli deb taxmin qildi va tool parametrlarini (pattern, start_line, max_matches, context_lines) tekshirmadi. Uzun sahifada selective o'qish mumkinligini e'tiborsiz qoldirdi, to'liq matnni olishga urindi va truncationga duch keldi.

## Tasdiqlash
1. Sahifa uzunmi (ko'p bo'limli dokumentatsiya, 100+ qator)?
2. open_page chaqiruvida pattern yoki start_line ishlatilganmi?
3. Natijada "truncated", "showing first/last", yoki to'liqmas matn bormi?
4. Kerakli ma'lumot boshida emas, o'rtada/oxirida joylashganmi?

Agar 1 va 3 ha, 2 yo'q bo'lsa — shu skill qo'llaniladi.

## Tuzatish (aynan shu)
1. Avval qisqa web_search yoki bilgan URL bilan nima kerakligini aniqlab ol.
2. open_page ni pattern bilan chaqir:
   - pattern="## Tuzatish|## Misollar|API_KEY|timeout" kabi regex.
   - context_lines=5 yoki max_matches=20.
3. Yoki aniq qism uchun start_line=50 (yoki boshqa) ishlat.
4. Agar birinchi chaqiruv truncation bersa — darhol pattern yoki start_line bilan qayta chaqir, to'liq matnni kutma.
5. Parallel chaqiruv mumkin bo'lsa (mustaqil qismlar) — bir nechta open_page ni parallel qil.

Noto'g'ri misol:
```
open_page(url="https://docs.example.com/long-api.html")
# Natija: truncated at line 200, keyin "Parameters" yo'q
```

To'g'ri misol:
```
open_page(url="https://docs.example.com/long-api.html", pattern="## Parameters|timeout|example", context_lines=8)
# Yoki
open_page(url="...", start_line=150)
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Uzun sahifa/hujjat uchun open_page ni har doim pattern yoki start_line bilan ishlat — truncation oldini oladi.
- Faqat kerakli qismni o'qish token va vaqtni tejaydi, to'liq javobni ta'minlaydi.
- "To'liq ochib ko'ray" o'rniga selective o'qish — eng arzon ishonchli yo'l.

---
name: agent-used-open-page-without-start-line-or-pattern-on-long-page
description: Uzoq web sahifani open_page bilan to'liq ochishga urinish — natijada truncated content yoki keraksiz matn keladi, aniq qismni olish uchun start_line yoki pattern ishlatilmagan.
---

# Uzoq sahifani open_page bilan to'liq ochish, line range yoki pattern ishlatmaslik

## Nima uchun bu skill kerak
Agent oddiy web sahifa mazmunini olish uchun open_page chaqiradi, lekin sahifa juda uzun bo'lsa tool natijasi kesiladi (truncated). Agent butun sahifani o'qishga urinadi yoki birinchi qismini oladi, kerakli bo'limni (masalan ma'lum qatorlar yoki regex pattern bilan) ajratmaydi. Natijada to'liq ma'lumot yo'qoladi yoki context to'ladi.

## Simptom (aynan shu)
- open_page chaqiruvidan keyin natijada "[truncated]" yoki to'liq sahifa o'rniga qisqa qism ko'rinadi.
- Agent uzun sahifa uchun start_line, pattern, max_matches, context_lines parametrlarini bermagan.
- Kerakli ma'lumot (masalan ma'lum bo'lim, jadval, kod blok) topilmagan, chunki faqat bosh qism olingan.
- Agent qayta-qayta to'liq sahifani ochishga urinadi yoki browser_execute ga o'tadi, oddiy pattern yetarli bo'lsa ham.

## Sabab (100%)
Agent open_page tool'ini "butun sahifani ol" deb ishlatadi. Tool dokumentatsiyasida ixtiyoriy start_line (1-indexed, oxirigacha) va pattern (regex, case-insensitive, matching lines + context) borligini e'tiborga olmaydi. Uzoq sahifalarda default to'liq qaytish truncated bo'lishini hisobga olmaydi.

## Tasdiqlash
1. open_page chaqiruvini tekshir: argumentlarda faqat url bormi, start_line yoki pattern yo'qmi?
2. Natijada truncated belgisini qidir.
3. Sahifa uzunligini taxmin qil (masalan docs, blog post) va pattern bilan qayta chaqirib solishtir.
4. Tool schema'ni qayta o'qi: pattern berilsa matching lines + context qaytadi, start_line berilsa shu qatordan oxirigacha.

## Tuzatish (aynan shu)
Uzoq sahifa uchun har doim pattern yoki start_line ishlat:

```python
# Yomon: to'liq sahifa (truncated bo'lishi mumkin)
open_page(url="https://example.com/long-docs")

# Yaxshi: aniq pattern bilan kerakli qism
open_page(
    url="https://example.com/long-docs",
    pattern="## Installation|pip install|requirements",
    max_matches=20,
    context_lines=5
)

# Yoki ma'lum qator oralig'i
open_page(
    url="https://example.com/long-docs",
    start_line=150
)
```

Agar pattern noma'lum bo'lsa, avval qisqa pattern bilan qidir, keyin start_line bilan kengaytir. Browser automation faqat interaktiv (click, fill) kerak bo'lganda ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Uzoq web sahifalar uchun open_page da pattern yoki start_line majburiy — to'liq ochish truncated qiladi.
- Pattern regex bilan aniq bo'limlarni + context oladi, context to'lmaydi.
- Oddiy mazmun uchun browser_execute o'rniga open_page + pattern yetarli.

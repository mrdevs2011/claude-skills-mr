---
name: agent-omitted-inline-citations-after-factual-claims-from-search-or-browse-results
description: Agent web_search yoki browse natijalaridan olingan faktik da'volarni javobda keltiradi, lekin har bir jumla/paragraf oxirida inline citation XML elementini qo'ymaydi. Qachon: search yoki page o'qishdan keyin manba ko'rsatilmagan faktlar paydo bo'lsa.
---

# Agent faktik da'volardan keyin inline citationlarni o'tkazib yubordi

## Nima uchun bu skill kerak
Agentlar ko'pincha web_search yoki open_page natijalaridan faktlarni olib, javobga qo'shadi, lekin citation qoidasini unutadi. Bu foydalanuvchiga manbani tekshirish imkonini bermaydi va ishonchlilikni pasaytiradi. Skill qidiruv natijasidan keyin citation qo'yishni eslatadi.

## Simptom (aynan shu)
Javobda "According to recent data..." yoki "Manba aytishicha..." kabi iboralar bor, lekin jumla oxirida `<grok type="render_inline_citation" citation_id="..."/>` yo'q. Yoki umuman citation elementlari chiqmaydi, garchi tool natijasida citation_id lar bo'lsa ham.

## Sabab (100%)
Agent citation qoidasini (faqat web/browse/X natijalaridan kelgan da'volar uchun, jumla oxirida) e'tibordan chetda qoldirdi yoki tool natijasidagi citation_id ni ishlatishni unutdi. Plain text manba yozish (masalan [1] yoki URL) yetarli emas.

## Tasdiqlash
1. Javobda faktik/yangi ma'lumot bormi?
2. Oldin web_search, open_page yoki X tool chaqirilganmi va natijada citation_id bor edi?
3. Har bir shunday jumla/paragraf oxirida to'g'ri render_inline_citation elementi bormi?
Agar yo'q bo'lsa — bu skill.

## Tuzatish (aynan shu)
Tool natijasidan citation_id ni olib, tegishli jumla oxiriga (nuqta/verguldan keyin) quyidagi elementni qo'sh:

```xml
<grok type="render_inline_citation" citation_id="VALUE" />
```

Misol:
"Yangi ma'lumotlarga ko'ra, loyiha 2026 yilda chiqadi.<grok type="render_inline_citation" citation_id="12345" />"

Faqat shu tool natijalaridan kelgan da'volar uchun. Boshqa manbalar uchun citation qilma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Search yoki browse dan olingan har bir faktik jumla oxirida inline citation XML qo'yish majburiy. Plain text manba yetarli emas. Bu foydalanuvchiga manbani ko'rsatadi va qoidalarga amal qiladi.

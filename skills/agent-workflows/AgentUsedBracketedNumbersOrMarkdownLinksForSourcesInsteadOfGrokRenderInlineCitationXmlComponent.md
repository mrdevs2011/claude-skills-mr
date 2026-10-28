---
name: agent-used-bracketed-numbers-or-markdown-links-for-sources-instead-of-grok-render-inline-citation-xml-component
description: Agent faktik da'volarni manba bilan qo'llab-quvvatlashda [1], (manba) yoki markdown [link](url) ishlatadi, lekin kerakli <grok type="render_inline_citation" citation_id="..."/> XML elementini chiqarmaydi. Qachon: web/X/browse natijasidan citation_id mavjud bo'lsa-yu, javobda noto'g'ri formatdagi manba ko'rsatilsa.
---

# Agent manba ko'rsatishda bracket/markdown link ishlatdi, render_inline_citation o'rniga

## Nima uchun bu skill kerak
Agentlar ba'zan citation qoidasini biladi, lekin noto'g'ri formatda (plain text [1], parenthetical yoki markdown link) yozadi. Bu UI da to'g'ri card/citation ko'rinishini bermaydi va foydalanuvchi manbani oson tekshira olmaydi. Faqat maxsus XML komponenti ishlatilishi kerak.

## Simptom (aynan shu)
Javobda "manba: [web:123]" yoki "[1]" yoki "[qarang](https://...)" kabi ifodalar bor, lekin jumla oxirida (nuqtadan keyin) to'g'ri `<grok type="render_inline_citation" citation_id="123" />` elementi yo'q. Tool natijasida citation_id mavjud edi.

## Sabab (100%)
Agent citation_id ni to'g'ri formatda (render_inline_citation XML) chiqarish o'rniga odatiy markdown yoki bracketed raqam usulini qo'lladi. Qoida: faqat maxsus grok XML komponenti, jumla/paragraf oxirida, faqat search/browse/X natijalaridan.

## Tasdiqlash
1. Oldingi tool natijasida citation_id (masalan [web:42]) bormi?
2. Javobdagi faktik jumlada manba ko'rsatilganmi?
3. U manba `<grok type="render_inline_citation" citation_id="42" />` shaklida, jumla oxirida (nuqta/verguldan keyin)mi?
Agar boshqa formatda bo'lsa — bu skill.

## Tuzatish (aynan shu)
Har bir mos jumla oxiriga (oxirgi tinish belgisidan keyin) quyidagini qo'sh. Plain text yoki markdown linkni olib tashla.

Misol (noto'g'ri):
Natija shuni ko'rsatadi [1].

To'g'ri:
Natija shuni ko'rsatadi.<grok type="render_inline_citation" citation_id="42" />

Yoki bir nechta bo'lsa ketma-ket.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Citation faqat maxsus XML komponenti orqali, to'g'ri joyda (jumla oxirida) chiqariladi. Bracket, raqam yoki markdown link yetarli emas va UI da ishlamaydi.

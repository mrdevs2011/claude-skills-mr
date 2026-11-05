---
name: agent-did-not-escape-special-xml-characters-in-render
description: Render XML elementlarida (citation_id, card_id, prompt, file_path va h.k.) attribute qiymatlarida & , " , < belgilarni escape qilmaslik — XML yaroqsiz bo'lib, render ishlamaydi yoki xato beradi.
---

# Render XML attribute'larida maxsus belgilarni escape qilmaslik

## Nima uchun bu skill kerak
Agentlar final javobda <grok type="..."> elementlarini chiqarayotganda attribute qiymatlariga foydalanuvchi matni, URL, prompt yoki path qo'yadi. Agar qiymatda & , " yoki < bo'lsa va ular escape qilinmasa, XML parser buziladi, element to'g'ri render bo'lmaydi yoki butun javob xato ko'rinadi.

## Simptom (aynan shu)
- Javobda <grok type="render_inline_citation" citation_id="..." /> yoki boshqa render element bor.
- Attribute qiymatida & , " yoki < belgisi bor (masalan URL da &, prompt da ", path da <).
- Qiymat escape qilinmagan (& , " , < emas).
- Render ishlamaydi, element ko'rinmaydi yoki XML xatosi paydo bo'ladi.

## Sabab (100%)
Agent XML qoidalarini e'tiborsiz qoldiradi va oddiy matn sifatida attribute qiymatini qo'yadi. "Escape kerak emas" yoki "tool o'zi hal qiladi" deb hisoblaydi, lekin XML qat'iy format talab qiladi.

## Tasdiqlash
1. Javobda <grok type="..." ... /> elementlar bormi?
2. Attribute qiymatlarida (citation_id, prompt, file_path, image_id va h.k.) & " < belgilari bormi?
3. Ular & " < ga almashtirilganmi?
4. Agar almashtirilmagan bo'lsa — bu holat.

## Tuzatish (aynan shu)
Har qanday attribute qiymatini chiqarishdan oldin maxsus belgilarni escape qil:

- & → &
- " → "
- < → <

Qoidalar (majburiy):
1. Faqat attribute qiymatlarini escape qil (element nomi yoki type qiymati emas).
2. Misollar:
   - Noto'g'ri: <grok type="render_generated_image" prompt="A cat & a dog" />
   - To'g'ri: <grok type="render_generated_image" prompt="A cat & a dog" />
   - Noto'g'ri: prompt="say "hello""
   - To'g'ri: prompt="say "hello""
3. URL'larda & bo'lsa ham & qil.
4. Qiymatni yozishdan oldin: "Bu qiymatda & \" < bormi? Escape qildimmi?" deb tekshir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Render XML elementlarining attribute qiymatlarida & , " va < belgilari majburiy escape qilinishi kerak (& " <). Aks holda XML buziladi va render ishlamaydi. Har doim qiymatni tekshir va escape qil.

---
name: agent-cited-search-results-plain-text-instead-of-render-inline-citation
description: Agent web_search, open_page yoki X search natijalaridan keyin manbalarni oddiy matn, markdown link yoki umuman citation'siz beradi — render_inline_citation XML komponenti ishlatilmaydi.
---

# Qidiruv natijalarini plain text yoki link bilan citation qilish

## Nima uchun bu skill kerak
Tool natijalarida citation_id mavjud bo'lsa, foydalanuvchiga manbani inline citation sifatida ko'rsatish uchun `<grok type="render_inline_citation" citation_id="..." />` XML komponentini ishlatish shart. Plain text yoki markdown link ishlatish citation'ni render qilmaydi, manba kuzatuvini buzadi va tizim qoidalariga zid.

## Simptom (aynan shu)
- Javobda [1], (source), yoki to'g'ridan-to'g'ri URL link bor, lekin render_inline_citation yo'q.
- web_search / open_page / x_keyword_search / x_semantic_search chaqirilgan, lekin citation_id ishlatilmagan.
- "According to source" deb yozilgan, lekin XML komponent yo'q.
- Citation tool result'dagi [web:123] yoki [post:456] formatini e'tiborsiz qoldirilgan.

## Sabab (100%)
Agent tool natijasidagi citation_id ni ko'rib, uni oddiy matn sifatida yozib qo'ygan yoki umuman citation qo'shmagan. Tizim ko'rsatmasidagi XML komponent formatini qo'llamagan.

## Tasdiqlash
1. Oxirgi tool call'larida web_search, open_page yoki X search bormi?
2. Natijada citation_id (masalan [web:42]) bormi?
3. Javob matnida `<grok type="render_inline_citation" citation_id="42" />` bormi?
4. Agar yo'q bo'lsa — bu skill mos.

## Tuzatish (aynan shu)
Har bir manba haqida gapirgan jumla yoki paragrafdan keyin, to'g'ridan-to'g'ri tool result'dagi citation_id bilan XML komponentni qo'sh.

**Noto'g'ri:**
```
Vercel serverless funksiyalarini /api papkasida joylashtirish kerak. [1]
```

**To'g'ri:**
```
Vercel serverless funksiyalarini /api papkasida joylashtirish kerak.<grok type="render_inline_citation" citation_id="42" />
```

- citation_id ni aniq tool result'dan ol (raqam).
- Komponentni jumla oxiriga, tinish belgisidan keyin qo'y.
- Bir nechta manba bo'lsa, har biriga alohida.
- Finance/sports structured tool'lar uchun citation shart emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Qidiruv tool'laridan keyin manbani doim `<grok type="render_inline_citation" citation_id="ID" />` bilan ko'rsatish kerak. Plain text, markdown link yoki raqamli [1] yetarli emas — faqat XML komponent to'g'ri render qiladi.

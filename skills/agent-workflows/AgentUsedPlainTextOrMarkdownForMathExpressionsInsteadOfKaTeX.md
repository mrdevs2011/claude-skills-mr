---
name: agent-used-plain-text-or-markdown-for-math-instead-of-katex
description: Agent texnik yoki matematik ifodalarni oddiy matn, markdown yoki LaTeX bloklari bilan yozadi, KaTeX ishlatmaydi. Natijada formula noto'g'ri render bo'ladi yoki o'qilishi qiyinlashadi.
---

# Agent Used Plain Text Or Markdown For Math Expressions Instead Of KaTeX

## Nima uchun bu skill kerak
Agentlar javobda tenglama, formula, reaksiya yoki texnik ifodalarni yozganda ko'pincha oddiy matn (`x^2 + y^2`), markdown (`$x^2$` yoki ```math) yoki to'liq LaTeX bloklaridan foydalanadi. Tizim qoidasi bo'yicha barcha simvolik va texnik kontent uchun KaTeX ishlatilishi shart. Bu UI da to'g'ri, chiroyli va interaktiv render qilinishini ta'minlaydi. Oddiy matn esa buzilgan yoki oddiy matn bo'lib qoladi.

## Simptom (aynan shu)
- Javobda matematik ifoda oddiy matn sifatida: `E = mc^2`, `x^2 + 2x + 1 = 0`, yoki `(a+b)^2`.
- Markdown math ishlatilgan: `$...$`, `$$...$$`, yoki ```latex blok.
- KaTeX uchun maxsus XML yoki inline format yo'q (tizim KaTeX ni avtomatik qo'llaydi, lekin agent to'g'ri yozishi kerak).
- Formula o'qilishi qiyin, superscript/subscript buzilgan, yoki UI da render bo'lmagan.
- Texnik kontent (kimyo reaksiyasi, fizika formulasi, koddagi matematik ifoda) oddiy matn bilan berilgan.

## Sabab (100%)
Agent "matematikani yozish" ni oddiy matn yoki o'zining odatlangan markdown LaTeX usuli bilan bog'laydi. Tizim promptidagi "Always use KaTeX for any symbolic or technical content" qoidasini e'tiborsiz qoldiradi yoki KaTeX ni faqat alohida tool deb o'ylaydi. Natijada format noto'g'ri chiqadi.

## Tasdiqlash
1. Javob matnida matematik yoki simvolik ifoda bormi (tenglama, formula, o'zgaruvchi darajasi, reaksiya)?
2. Ular oddiy matn, `$...$`, `$$...$$` yoki markdown blok ichidami?
3. KaTeX ga mos format (tizim tomonidan talab qilingan) ishlatilganmi — odatda to'g'ridan-to'g'ri matn ichida yoki maxsus belgilangan usulda?
4. Agar formula oddiy matn bo'lib qolgan bo'lsa — bu skill qo'llanadi.

## Tuzatish (aynan shu)
Har qanday simvolik yoki texnik ifodani KaTeX formatida yoz. Tizim uni avtomatik render qiladi.

Noto'g'ri misollar:
```
E = mc^2
yoki
$$E = mc^{2}$$
yoki
$x^2 + y^2 = r^2$
```

To'g'ri (KaTeX inline yoki block sifatida matn ichida):
Agent javobida formulani shunday yozishi kerakki, tizim KaTeX ni qo'llasin. Amalda:

- Inline uchun: \( E = mc^{2} \) yoki tizim qoidasiga mos.
- Lekin asosiy qoida: oddiy matn o'rniga to'g'ri KaTeX sintaksisidan foydalan va uni javob matnining ichida joylashtir.

Misollar (to'g'ri yozish):
- \( E = mc^{2} \)
- \( x^{2} + 2x + 1 = 0 \)
- \( \sum_{i=1}^{n} i = \frac{n(n+1)}{2} \)

Agar tizim maxsus XML talab qilsa, uni ishlat, lekin hech qachon oddiy matn yoki markdown math bilan cheklanma.

Qoida:
- Har qanday formula, tenglama, reaksiya, texnik ifoda uchun KaTeX.
- Oddiy matn faqat so'zlar uchun, matematik belgilar uchun emas.
- Javobni yozishdan oldin "bu yerda texnik kontent bormi?" deb tekshir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Texnik va matematik kontentni har doim KaTeX formatida yoz.
- Oddiy matn, markdown `$` yoki `$$` bloklari yetarli emas — UI da to'g'ri render bo'lmaydi.
- Tizim promptidagi KaTeX qoidasiga 100% amal qil.

---
name: agent-wrote-math-as-plain-text-instead-of-katex
description: Matematik, kimyoviy yoki texnik ifodalarni oddiy matn yoki markdown sifatida yozish — KaTeX talab qilinadigan holatda. Javobda to'g'ri render bo'lmaydi.
---

# Agent Wrote Mathematical Or Technical Expressions As Plain Text Instead Of KaTeX

## Nima uchun bu skill kerak
System prompt qoidasiga ko'ra, har qanday ramziy yoki texnik kontent (ifodalar, tenglamalar, formulalar, reaksiyalar) uchun doim KaTeX ishlatilishi shart. Agentlar ko'pincha oddiy matn, backtics yoki markdown bilan yozib qo'yadi. Bu foydalanuvchiga to'g'ri, professional render qilinmagan kontent beradi va qoidaga zid.

## Simptom (aynan shu)
- Javobda matematik ifoda, formula, tenglama yoki kimyoviy reaksiya bor.
- Lekin u `$...$` yoki `$$...$$` KaTeX blokida emas, balki oddiy matn, `code` yoki plain sifatida yozilgan.
- Masalan: "E = mc^2" yoki "H2O + CO2" deb yozilgan, KaTeX yo'q.
- Foydalanuvchi tomonida chiroyli render bo'lmaydi, oddiy matn ko'rinadi.

## Sabab (100%)
Agent "Always use KaTeX for any symbolic or technical content" qoidasini e'tiborsiz qoldiradi yoki oddiy markdown yetarli deb hisoblaydi. KaTeX syntax'ini (inline `$...$`, display `$$...$$`) esdan chiqaradi yoki "bu oddiy ifoda, KaTeX kerak emas" deb taxmin qiladi.

## Tasdiqlash
- Javobda formula, tenglama, kimyoviy formula, matematik ifoda bormi?
- Ular KaTeX bilan o'ralganmi (`$E = mc^2$` yoki `$$ ... $$`)?
- Plain text yoki faqat backticks ishlatilganmi?
- System prompt'dagi KaTeX qoidasi buzilganmi?

## Tuzatish (aynan shu)
1. Har qanday ramziy/texnik ifoda uchun KaTeX ishlat.
2. Inline uchun `$...$`, display (alohida qator) uchun `$$...$$`.
3. Misollar:
   - Noto'g'ri: E = mc^2 yoki `E = mc^2`
   - To'g'ri: $E = mc^2$
   - Noto'g'ri: 2H2 + O2 = 2H2O
   - To'g'ri: $2H_2 + O_2 \rightarrow 2H_2O$
4. Murakkab formulalar uchun display mode ishlat.
5. Oddiy matn sifatida qoldirma — har doim KaTeX.

```markdown
# Noto'g'ri
Kvadrat tenglama: x = (-b ± sqrt(b^2 - 4ac)) / 2a

# To'g'ri
Kvadrat tenglama: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Har qanday matematik/kimyoviy/texnik ifoda uchun KaTeX majburiy.
- Oddiy matn yoki markdown yetarli emas — to'g'ri render uchun `$...$` yoki `$$...$$` ishlat.
- Bu qoida javob sifatini oshiradi va system prompt'ga to'liq amal qiladi.

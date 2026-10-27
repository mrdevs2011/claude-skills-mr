---
name: agent-did-not-use-katex-for-symbolic-content
description: Texnik javobda formula, tenglama, matematik ifoda yoki kod-like simvolik kontent oddiy matn sifatida berilganda — KaTeX ishlatilmagan, o'qish qiyin va noto'g'ri formatlangan.
---

# Simvolik/texnik kontentni KaTeX'siz oddiy matn sifatida chiqarish

## Nima uchun bu skill kerak
Agentlar texnik mavzularda (matematika, fizika, kimyo, kod formulalari, tenglamalar) javob berayotganda ifodalarni oddiy matn yoki markdown code block sifatida yozadi. Bu o'qishni qiyinlashtiradi, tuzilmani buzadi va professional ko'rinishni yo'qotadi. Qoidalar KaTeX ishlatishni talab qiladi.

## Simptom (aynan shu)
- Javobda formula, tenglama, \( \frac{a}{b} \), integral, matritsa, kimyoviy reaksiya yoki simvolik ifoda bor.
- Ular oddiy matn sifatida yozilgan (masalan "a/b" yoki code block ichida).
- KaTeX syntax (\( ... \) yoki $$ ... $$) ishlatilmagan.
- Foydalanuvchi "formatni to'g'irla" yoki "o'qib bo'lmaydi" deydi, yoki texnik kontent professional ko'rinmaydi.

## Sabab (100%)
Agent KaTeX ishlatish qoidasini e'tiborsiz qoldiradi yoki "oddiy matn yetarli" deb hisoblaydi. Texnik kontentni oddiy markdown sifatida yozish osonroq ko'rinadi, lekin bu format talabini buzadi.

## Tasdiqlash
1. Javobda matematik, fizik, kimyoviy yoki simvolik ifoda bormi?
2. Ular KaTeX formatida (\( inline \) yoki $$ block $$) yozilganmi?
3. Agar oddiy matn, code block yoki noto'g'ri markdown bo'lsa — bu holat.
4. Qoidalar "Always use KaTeX for any symbolic or technical content" deb aytadimi? (ha)

## Tuzatish (aynan shu)
Har qanday simvolik yoki texnik kontentni KaTeX bilan yoz:

1. Inline ifodalar uchun: \( formula \)
2. Blok ifodalar uchun: $$ formula $$
3. Misollar:
   - Noto'g'ri: E = mc^2 yoki `E = mc^2`
   - To'g'ri: \( E = mc^2 \)
   - Noto'g'ri: integral of f(x) dx
   - To'g'ri: \( \int f(x) \, dx \)
4. Kod misollari yoki dasturlash formulalari ham KaTeX yoki proper code block + KaTeX aralashmasida.
5. Javobni yozishdan oldin: "Bu yerda formula bormi? KaTeX ishlatdimmi?" deb o'zingni tekshir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Simvolik, matematik yoki texnik ifodalarni oddiy matn sifatida yozish o'qishni qiyinlashtiradi. Har doim KaTeX ishlat: inline uchun \( ... \), blok uchun $$ ... $$. Bu professional, aniq va o'qilishi oson formatni ta'minlaydi.

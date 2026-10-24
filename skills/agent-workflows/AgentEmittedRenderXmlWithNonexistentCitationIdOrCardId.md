---
name: agent-emitted-render-xml-with-nonexistent-citation-id-or-card-id
description: Agent render_inline_citation yoki render_card XML elementida oldingi tool natijasida bo'lmagan citation_id/card_id ishlatadi — UI buziladi yoki bo'sh chiqadi.
---

# Agent mavjud bo'lmagan citation_id yoki card_id bilan render XML chiqardi

## Nima uchun bu skill kerak
Render XML elementlari (`render_inline_citation`, `render_card` va boshqalar) faqat shu suhbatdagi tool chaqiruvlaridan qaytgan haqiqiy id'larni qabul qiladi. Noto'g'ri, taxminiy yoki o'ylab topilgan id ishlatilsa, citation yoki card ko'rinmaydi, foydalanuvchi to'liq ma'lumot ololmaydi. Bu `AgentOmittedRequiredRenderXmlElements...` skillidan farqli — bu yerda element chiqarilgan, lekin id haqiqiy emas.

## Simptom (aynan shu)
- Javob matnida `<grok type="render_inline_citation" citation_id="999" />` yoki `<grok type="render_card" card_id="fake123" />` bor.
- Lekin hech qanday oldingi tool natijasida (web_search, sports_search, weather va h.k.) bunday `citation_id` yoki `card_id` yo'q edi.
- Tool natijasida `[web:456]` yoki `card_id: "real-abc"` bor edi, agent boshqa qiymat ishlatdi.
- UI'da citation/card bo'sh, xato yoki umuman chiqmaydi.

## Sabab (100%)
Agent tool natijasidagi aniq id qiymatini diqqat bilan o'qib nusxa ko'chirmasdan, taxmin qildi, eslab qoldi yoki formatni noto'g'ri talqin qildi (masalan, `[web:123]` dan 123 o'rniga boshqa raqam yoki matn).

## Tasdiqlash
1. Javobdagi barcha `render_inline_citation` va `render_card` elementlaridagi id'larni yig'ing.
2. Suhbat tarixidagi barcha tool natijalaridan haqiqiy `citation_id` (odatda `[web:N]` yoki `[post:N]` shaklida) va `card_id` larni toping.
3. Javobdagi id'lar tool natijalarida bor-yo'qligini solishtiring. Mos kelmasa — bu skill holati.

## Tuzatish (aynan shu)
1. Har doim tool natijasidagi id'ni **aniq nusxa qiling**:
   - `[web:789]` → `citation_id="789"`
   - `card_id: "card-xyz789"` → `card_id="card-xyz789"`
2. Agar mos id yo'q bo'lsa — render elementini **umuman chiqarmang**, oddiy matn yoki manba nomini yozing.
3. Bir nechta id bo'lsa, eng mosini tanlang, yangisini o'ylab topmang.
4. Javobni yuborishdan oldin barcha ishlatilgan id'lar oldingi tool natijalarida mavjudligini tekshiring.

Misol (to'g'ri):
```
Tool natijasi: [web:42] ...
Javob: Bu fakt to'g'ri.<grok type="render_inline_citation" citation_id="42" />
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Render XML elementlaridagi id'lar faqat tool natijasidan olinadi. Taxmin qilish yoki eslab qolish id'ni buzadi va UI ishlamaydi. Doim aniq nusxa qiling yoki elementni chiqarmang.

---
name: agent-grouped-all-citations-at-bottom-instead-of-inline
description: Javobda qidiruv natijalaridan olingan faktlarni tasdiqlovchi render_inline_citation elementlari faqat oxirida yoki alohida ro'yxatda joylashtirilganda — har bir tegishli jumla yoki paragrafdan keyin inline qo'yilmagan, o'qish va manbani bog'lash qiyinlashadi.
---

# Barcha citationlarni javob oxirida guruhlab, inline joylashtirmaslik

## Nima uchun bu skill kerak
Agentlar web_search, open_page yoki X tool natijalaridan foydalanib faktlar keltirganda manbalarni to'g'ri bog'lashlari kerak. Citationlar faqat oxirida yoki alohida bo'limda bo'lsa, qaysi gap qaysi manbaga tegishli ekanligi noaniq bo'ladi, o'quvchi tekshirishni qiyinlashtiradi va qoida buziladi (citation inline, tegishli joyda bo'lishi shart).

## Simptom (aynan shu)
- Javobda bir nechta fakt yoki da'vo bor, ular tool natijasidan olingan.
- `render_inline_citation` XML elementlari faqat javob oxirida, "Manbalar" ro'yxatida yoki bitta guruhda joylashgan.
- Har bir tegishli jumla, paragraf yoki bullet point'dan keyin darhol citation yo'q.
- Foydalanuvchi manbani gap bilan bog'lay olmaydi yoki "qaysi gap qaysi manbadan?" deydi.
- Citation_id'lar mavjud, lekin joylashuvi noto'g'ri (oxirida).

## Sabab (100%)
Agent citationlarni "manbalar ro'yxati" sifatida oxirga qo'yishni odat qiladi yoki barcha faktlarni yozib bo'lgach bir joyga yig'adi. Inline joylashtirish qoidasini (har bir tegishli gapdan keyin) e'tiborsiz qoldiradi, chunki oxirida yig'ish oddiyroq ko'rinadi.

## Tasdiqlash
1. Javobda tool (search/browse/X) natijasidan olingan faktlar bormi?
2. `render_inline_citation` elementlari ishlatilganmi?
3. Ular har bir tegishli jumla/paragraf/bullet'dan keyin darhol joylashganmi, yoki faqat oxirida guruhlanganmi?
4. Agar oxirida yoki alohida ro'yxatda bo'lsa va gaplar bilan bevosita bog'lanmagan bo'lsa — bu holat.
5. Qoidalar "place inline, directly after the final punctuation mark of the relevant sentence, paragraph, bullet point, or table cell" deb aytadimi? (ha)

## Tuzatish (aynan shu)
Har bir citationni tegishli joyga inline qo'y:

1. Fakt yoki da'vo yozilgan jumla/paragraf/bullet point'ni tugat.
2. Darhol uning oxiriga (nuqtadan keyin) `<grok type="render_inline_citation" citation_id="..." />` elementini qo'y.
3. Bir nechta manba bo'lsa, har bir tegishli gapdan keyin o'z citationini qo'y — hech qachon oxirga yig'ma.
4. Misollar:
   - Noto'g'ri: "Fakt 1. Fakt 2. Fakt 3.\n\nManbalar: [1] [2] [3]"
   - To'g'ri: "Fakt 1.<grok type="render_inline_citation" citation_id="123" /> Fakt 2.<grok type="render_inline_citation" citation_id="456" />"
5. Javobni yozishdan oldin: "Har bir faktning citationi darhol uning yonida joylashganmi?" deb tekshir.
6. Hech qachon "Manbalar:" bo'limi yoki oxirgi ro'yxat sifatida chiqarma — faqat inline.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Citationlarni javob oxirida yoki alohida ro'yxatda guruhlash manbani gap bilan bog'lashni qiyinlashtiradi. Har bir tegishli jumla, paragraf yoki bullet point'dan keyin darhol `render_inline_citation` elementini qo'y. Bu o'qishni osonlashtiradi va qoidalarga mos keladi.

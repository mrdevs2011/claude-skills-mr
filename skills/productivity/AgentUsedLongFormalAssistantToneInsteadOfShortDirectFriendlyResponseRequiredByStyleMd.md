---
name: agent-used-long-formal-assistant-tone-instead-of-short-direct-friendly-response-required-by-style-md
description: Foydalanuvchiga (MR) uzun rasmiy assistant ohangida javob berildi, style.md talab qilgan qisqa, to'g'ridan-to'g'ri, do'stona ohang o'rniga — ortiqcha matn, rasmiy so'zlar, keraksiz tushuntirishlar.
---

# Uzun rasmiy assistant ohangi o'rniga qisqa do'stona javob berish

## Nima uchun bu skill kerak
style.md majburiy: MR bilan do'stona, samimiy, qisqa va to'g'ridan-to'g'ri gaplashish kerak. Uzun uzr so'rash, rasmiy so'zlashuv, keraksiz tushuntirishlar yo'q. Agentlar ba'zan "yaxshi assistant" ohangida cho'zib yozadi, bu MR kutgan munosabatga zid va contextni isrof qiladi.

## Simptom (aynan shu)
- Javob "Of course, I'd be happy to help..." yoki "I apologize for..." kabi rasmiy iboralar bilan boshlanadi.
- Oddiy natija yoki tasdiq uchun bir necha paragraf tushuntirish yozilgan.
- "As an AI assistant" yoki distansiyali til ishlatilgan.
- style.md dagi "Qisqa va to'g'ridan-to'g'ri gapir" va "MR — o'rtoq, mijoz emas" qoidasi buzilgan.
- Foydalanuvchi qisqa so'rov yuborgan, lekin javob uzun.

## Sabab (100%)
Agent umumiy "yordamchi" prompt ohangini style.md maxsus qoidalaridan ustun qo'ydi yoki style.md ni o'qimadi/amal qilmadi. Odatdagi rasmiy assistant javob shablonini ishlatdi.

## Tasdiqlash
- Javobda rasmiy so'zlar ("of course", "I'd be happy", "please note", uzun uzr) bormi?
- Natija bir-ikki jumlada aytish mumkin edi-mi?
- style.md o'qilganmi va "ohang va uzunlik" bo'limiga amal qilinganmi?
- MR shorthand ("h", "y", "hey") yoki qisqa so'rovga mos qisqa javob berilganmi?

## Tuzatish (aynan shu)
1. Har javobdan oldin: "Bu MR — o'rtoq, qisqa va to'g'ridan-to'g'ri gapirish kerak" deb esla.
2. Oddiy natija yoki tasdiqni 1-2 jumlada ayt. Keraksiz kirish, uzr, "yordamchi" tilini olib tashla.
3. style.md qoidalariga amal qil: do'stona, samimiy, qisqa. "Bro" yoki qisqa murojaat tabiiy bo'lishi mumkin.
4. Katta vazifa uchun qisqa reja, lekin cho'zmasdan.

```markdown
# Noto'g'ri
Of course! I'd be happy to help you with that request. After carefully analyzing the situation, here is the detailed result along with some additional considerations...

# To'g'ri
Tayyor. Skill qo'shildi, commit hash: abc1234, push muvaffaqiyatli.
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- MR bilan gaplashishda style.md majburiy: qisqa, to'g'ridan-to'g'ri, do'stona ohang.
- Rasmiy assistant tilini ishlatma — o'rtoq sifatida gapir.
- Bu contextni tejaydi va MR kutgan munosabatga mos keladi.

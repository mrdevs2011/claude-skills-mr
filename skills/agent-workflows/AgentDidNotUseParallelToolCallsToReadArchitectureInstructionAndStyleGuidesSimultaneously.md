---
name: agent-did-not-parallel-read-guides
description: Skill yaratishdan oldin architecture.md, instruction.md va style.md ni ketma-ket o'qish o'rniga parallel tool chaqiruvlar bilan bir vaqtda o'qimaslik — vaqtni behuda sarflash va qoidalarni kechikish bilan o'qishga olib keladi.
---

# Skill qo'llanmalarini parallel o'qimaslik

## Nima uchun bu skill kerak
Agent yangi skill yozishdan oldin majburiy ravishda architecture.md, instruction.md va style.md ni o'qishi kerak. Bu fayllar mustaqil, shuning uchun ularni ketma-ket o'qish keraksiz kechikish yaratadi. Parallel o'qish contextni tezroq to'ldiradi va ishni tezlashtiradi.

## Simptom (aynan shu)
- architecture.md, instruction.md va style.md ni alohida-alohida, ketma-ket tool chaqiruvlar bilan o'qish.
- Bir fayl o'qilgandan keyin keyingisini chaqirish, garchi ular bir-biriga bog'liq bo'lmasa ham.
- Skill yaratish jarayoni sekinlashadi, chunki mustaqil o'qishlar seriallashtirilgan.

## Sabab (100%)
Agent "avval birini o'qib, keyin ikkinchisini" deb o'ylaydi yoki parallel tool chaqiruv imkoniyatini e'tiborsiz qoldiradi. Mustaqil operatsiyalarni bir vaqtda chaqirishni unutadi.

## Tasdiqlash
- Qo'llanmalarni o'qishdan oldin ular mustaqil ekanligini tekshirdingmi?
- Bir nechta read_file yoki bash chaqiruvlarini bir function call blokida parallel qildingmi?
- Natijalar kelgandan keyin ularni birlashtirib ishlatdingmi?

## Tuzatish (aynan shu)
Mustaqil fayllarni **bir vaqtda** o'qi:

1. architecture.md, instruction.md va style.md ni bir parallel tool chaqiruvda so'ra (masalan, bir nechta read_file ni birgalikda).
2. Barcha natijalar kelgach, ularni tahlil qil va skill formatiga 100% amal qil.
3. Mavjud skills/ namunalarini ham kerak bo'lsa parallel yoki keyin o'qi.
4. Faqat shundan keyin yangi skill faylini yarat.

Misol (parallel):
- read_file architecture.md
- read_file instruction.md
- read_file style.md
(barchasini birgalikda)

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Mustaqil qo'llanmalarni har doim parallel o'qi — ketma-ket emas.
- Bu vaqtni tejaydi va contextni tezroq to'ldiradi.
- Parallel tool chaqiruvlar agent ish oqimida asosiy optimizatsiya.

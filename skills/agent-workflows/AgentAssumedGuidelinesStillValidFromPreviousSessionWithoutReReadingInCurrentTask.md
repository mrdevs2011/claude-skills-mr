---
name: assumed-guidelines-valid-from-previous-without-rereading
description: Agent yangi skill yaratishda oldingi suhbat yoki sessiyadan qo'llanmalarni eslab qolgan deb o'yladi va architecture.md, instruction.md, style.md ni qayta o'qimadi — natijada format yoki qoidalar eskirgan yoki to'liq emas bo'lib qoldi.
---

# Oldingi sessiyadan qo'llanmalarni eslab qolgan deb taxmin qilib qayta o'qimaslik

## Nima uchun bu skill kerak
Har bir skill yaratish vazifasi mustaqil. Qo'llanmalar (architecture.md, instruction.md, style.md) yangilanishi mumkin. Agent "avval o'qiganman" deb qayta o'qimasa, yangi qoidalarni o'tkazib yuboradi yoki eski formatdan foydalanadi. Bu format buzilishiga va qidiruvda topilmaslikka olib keladi.

## Simptom (aynan shu)
- Skill frontmatter yoki bo'limlari architecture.md dagi so'nggi formatga mos kelmaydi.
- Style.md dagi ohang yoki til qoidalariga zid matn.
- Agent "oldin o'qigan edim" deb yozadi, lekin joriy sessiyada o'qish tool chaqiruvi yo'q.
- Yangi kategoriya yoki nomlash qoidalari e'tiborga olinmagan.

## Sabab (100%)
Agent context yoki xotira bor deb taxmin qildi va joriy vazifa boshida qo'llanmalarni qayta o'qishni o'tkazib yubordi. Har safar to'liq o'qish majburiy ekanligini unutdi.

## Tasdiqlash
1. Joriy tool chaqiruvlar tarixida architecture.md, instruction.md, style.md to'liq o'qilganmi?
2. Skill fayli oxirgi formatga 100% mosmi?
3. Agent javobida "oldin o'qiganman" yoki "esimda" degan ibora bormi?

## Tuzatish (aynan shu)
Har bir yangi skill vazifasida, hech qanday taxminsiz:

```bash
# Joriy sessiyada parallel o'qi:
# read_file architecture.md
# read_file instruction.md
# read_file style.md
# Keyin formatni qo'llab skill yoz.
```

Oldingi suhbatdan "eslab qolgan" narsaga ishonma. Har safar qayta o'qi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Har bir skill yaratishda qo'llanmalarni joriy sessiyada qayta o'qish majburiy.
- "Oldin o'qiganman" taxmini format xatolariga olib keladi.
- Qo'llanmalar o'zgarishi mumkin — har safar to'liq o'qi.

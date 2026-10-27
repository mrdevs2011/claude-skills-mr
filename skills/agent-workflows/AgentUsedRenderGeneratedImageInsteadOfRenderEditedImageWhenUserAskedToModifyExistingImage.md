---
name: agent-used-render-generated-image-for-modification-instead-of-edited
description: Foydalanuvchi oldin ko'rsatilgan rasmni o'zgartirishni so'raganda agent render_generated_image ishlatadi, render_edited_image va image_id bilan emas — natijada yangi rasm yaratiladi, mavjudini tahrirlamaydi.
---

# Mavjud rasmni tahrirlash so'roviga render_generated_image ishlatish

## Nima uchun bu skill kerak
Agent foydalanuvchi "shu rasmni o'zgartir", "rangini almashtir", "bu image_id ni tahrirla" deganda yangi rasm generatsiya qiladi. Bu foydalanuvchi kutilgan tahrirni olmasligiga, kontekstni yo'qotishiga va ortiqcha generatsiya chaqiruvlariga olib keladi. To'g'ri tool — render_edited_image + oldingi image_id.

## Simptom (aynan shu)
- Suhbatda avval image_id (masalan 5 harfli kod) qaytarilgan rasm bor.
- Foydalanuvchi "o'zgartir", "tahrirla", "shu rasmdagi ... ni almashtir", "image_id bilan" deb so'raydi.
- Agent yakuniy javobda `<grok type="render_generated_image" prompt="..." />` chiqaradi.
- `<grok type="render_edited_image" prompt="..." image_id="XXXXX" />` yo'q.
- Natijada yangi mustaqil rasm paydo bo'ladi, asl rasm asosida tahrir emas.

## Sabab (100%)
Agent "rasm yaratish" va "rasm tahrirlash" o'rtasidagi farqni unutadi yoki tool tavsiflarini to'liq o'qimaydi. `render_generated_image` faqat yangi rasm uchun, `render_edited_image` esa mavjud image_id ni oladi va o'zgartirishni qo'llaydi. Agent eng oddiy variantni (generate) tanlaydi.

## Tasdiqlash
1. Suhbat tarixida oldingi tool natijasida `image_id` bormi? (masalan view_image yoki oldingi generate dan)
2. Foydalanuvchi so'rovida "o'zgartir", "edit", "modify", "shu rasm", "image_id" so'zlari bormi?
3. Yakuniy javobdagi XML: `render_generated_image` bormi, `render_edited_image` yo'qmi?
4. image_id argumenti to'g'ri uzatilmaganmi?

## Tuzatish (aynan shu)
Agar rasm allaqachon mavjud va image_id ma'lum bo'lsa:

```xml
<grok type="render_edited_image" prompt="Aniq o'zgartirish tavsifi: rangni ko'k qil, fonni olib tashla, matnni qo'sh..." image_id="ABC12" />
```

Qoidalar:
- `image_id` — oldingi tool natijasidagi 5 belgili ID. Uni to'g'ridan-to'g'ri ishlat.
- `prompt` — faqat nima o'zgarishi kerakligini aniq yoz (butun rasmni qayta tasvirlama).
- Yangi rasm kerak bo'lsa (oldingi yo'q) — shundagina `render_generated_image`.
- Bir nechta tahrir bo'lsa ham har biriga to'g'ri image_id ber.

Misol (xato):
```
Foydalanuvchi: "shu rasmni qora-oq qil"
Agent: <grok type="render_generated_image" prompt="black and white version of the previous image" />
```

To'g'ri:
```
<grok type="render_edited_image" prompt="Convert the image to black and white, keep composition identical" image_id="XY789" />
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Mavjud rasmni o'zgartirish so'ralganda har doim `render_edited_image` + `image_id` ishlat.
- `render_generated_image` faqat butunlay yangi rasm uchun.
- image_id ni oldingi natijadan aniq ol va o'tkazib yuborma.

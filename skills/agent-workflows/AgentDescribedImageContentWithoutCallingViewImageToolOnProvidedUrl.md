---
name: described-image-without-view-image
description: Foydalanuvchi rasm URL'i yoki screenshot berganida agent view_image tool'ini chaqirmasdan mazmunini tasvirlaydi yoki tahlil qiladi — natijada noto'g'ri yoki taxminiy tavsif chiqadi.
---

# Rasm URL'ini view_image chaqirmasdan tasvirlash

## Nima uchun bu skill kerak
Agentlar ba'zan foydalanuvchi tomonidan berilgan rasm linki yoki screenshot URL'ini ko'rib, uning mazmunini o'z xotirasidan yoki taxmindan yozib beradi. Bu ko'pincha noto'g'ri, eski yoki umuman boshqa rasm haqida bo'ladi. `view_image` tool'i aynan shu maqsadda bor — haqiqiy vizual kontentni ko'rish va aniq tasvir berish uchun. Ishlatmaslik token sarflaydi va foydalanuvchini chalg'itadi.

## Simptom (aynan shu)
- Foydalanuvchi rasm URL'i (https://...jpg, png, yoki X post media) yoki "bu rasmdagi nima" deb so'raydi.
- Agent javobida rasmni "ko'rdim" yoki tasvirlaydi, lekin tool chaqiruvlarida `view_image` yo'q.
- Tavsif umumiy, noaniq yoki haqiqiy mazmun bilan mos kelmaydi.
- Agent "rasmni ochib ko'rdim" deydi, lekin hech qanday image_id yoki vizual tahlil yo'q.

## Sabab (100%)
Agent rasm URL'ini oddiy matn deb hisoblaydi va uni o'qish yoki taxmin qilish yetarli deb o'ylaydi. `view_image` tool'i mavjudligini va u haqiqiy piksellarni qaytarishini unutadi yoki "tezroq javob beray" deb o'tkazib yuboradi. Natijada vizual fakt o'rniga til modeli taxmini chiqadi.

## Tasdiqlash
1. Foydalanuvchi so'rovida rasm URL'i, media linki yoki "rasmni ko'r" so'zi bormi?
2. Tool chaqiruvlari orasida `view_image(image_url="...")` bormi?
3. Javobda image_id yoki "view_image natijasiga ko'ra" kabi ishora bormi?
4. Agar yo'q — bu shu xato.

## Tuzatish (aynan shu)
Rasm URL'ini ko'rishdan **oldin** tool chaqir:

```
// XATO:
// User: "https://example.com/screenshot.png da nima yozilgan?"
// Agent: "Bu rasmda login formasi ko'rinadi..." (tool yo'q)

// TO'G'RI:
view_image(image_url="https://example.com/screenshot.png")
// Natijadan keyin aniq tasvir ber, image_id ni kerak bo'lsa keyingi tahrir uchun saqla
```

- Agar bir nechta rasm bo'lsa — har birini alohida `view_image` bilan chaqir (parallel mumkin bo'lsa parallel).
- Natijani o'qib, faqat ko'rgan narsani yoz. Taxmin qilma.
- Keyin render yoki tahlil kerak bo'lsa, olingan image_id dan foydalan.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Rasm URL'i berilganda hech qachon taxminiy tavsif bermang. Avval `view_image` chaqiring, haqiqiy vizual natijani oling, keyin aniq va faktga asoslangan javob bering. Bu xato eng tez "ko'rdim" deb yolg'on aytishga olib keladi.

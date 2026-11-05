---
name: agent-used-standard-web-search-for-picture-request
description: Foydalanuvchi aniq rasm yoki surat so'raganda agent oddiy web_search ishlatdi (image_only=false), natijada matn og'ir va rasmlar kam yoki yo'q chiqdi. image_only=true ishlatilishi kerak edi.
---

# Aniq rasm so'rovi uchun oddiy web_search ishlatish

## Nima uchun bu skill kerak
web_search tooli `image_only=true` parametri bilan faqat asosiy rasmlari bor sahifalarni qaytaradi. Foydalanuvchi "rasmlar ko'rsat", "suratlar top", "pictures of X" desa, image_only o'rnatilmasa natija matnli sahifalar bilan to'lib, kerakli vizual material kamayadi yoki yo'qoladi. Bu so'rovni noto'g'ri bajarishga olib keladi.

## Simptom (aynan shu)
- Foydalanuvchi so'rovida "rasm", "surat", "picture", "image", "show me photos", "rasmlarni top" kabi so'zlar bor.
- Agent `web_search` chaqirdi, lekin `image_only` parametri yo'q yoki false.
- Natijada asosan matnli sahifalar, og:image yo'q yoki kam.
- Foydalanuvchi rasm kutgan, lekin ko'p matn olgan.

## Sabab (100%)
Agent web_search ning default `include_image=true` yetarli deb o'yladi, lekin `image_only=true` faqat rasmlari bor natijalarni filtrlaydi va rasmlarni asosiy qilib qaytaradi. Parametrni tekshirmadi yoki so'rovni "matn + rasm" deb noto'g'ri talqin qildi.

## Tasdiqlash
1. So'rovda aniq rasm/surat talabi bormi? (masalan "rasmlarni ko'rsat", "find pictures of").
2. Tool chaqiruvda `image_only: true` o'rnatilganmi?
3. Agar yo'q bo'lsa — noto'g'ri. Natijalar matn og'ir bo'lishi kerak.

## Tuzatish (aynan shu)
Aniq rasm so'rovi uchun doim `image_only=true` o'rnat. Matn ham kerak bo'lsa alohida oddiy qidiruv qil yoki include_image ni saqla.

Noto'g'ri (rasm so'rovi uchun):
```python
web_search(query="sunset landscape photos", include_image=True)
# image_only yo'q — matnli natijalar ko'p
```

To'g'ri:
```python
web_search(query="sunset landscape photos", image_only=True)
# faqat asosiy rasmli sahifalar, rasmlar saqlanadi
```

Agar foydalanuvchi "rasm va tavsif" desa, ikkita chaqiruv: biri image_only, biri oddiy.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Foydalanuvchi aniq rasm yoki surat so'rasa, web_search da `image_only=true` o'rnat. Bu matnli natijalarni filtrlaydi va kerakli vizual materialni to'g'ridan-to'g'ri beradi. Default include_image yetarli emas.

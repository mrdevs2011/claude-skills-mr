---
name: agent-used-generate-image-tool-for-one-shot-instead-of-render-xml
description: Agent oddiy bitta rasm so'rovi uchun generate_image tool/function call ishlatadi, o'rniga yakuniy javobda render_generated_image XML komponentini chiqarishi kerak.
---

# Agent Used Generate Image Tool For One Shot Image Generation Instead Of Render Generated Image Xml Component

## Nima uchun bu skill kerak

`generate_image` tool oddiy bir martalik rasm so'rovlari uchun mo'ljallanmagan. U faqat rasmni keyingi qadamlar uchun (masalan, hujjatga kiritish, iteratsiya, edit_image bilan ishlash) generatsiya qilishda ishlatiladi. Oddiy "rasm yarat" so'rovida to'g'ridan-to'g'ri `render_generated_image` XML elementini javob matniga yozish kerak — bu stream qiladi va foydalanuvchiga darhol ko'rsatadi.

## Simptom (aynan shu)

Foydalanuvchi oddiy rasm generatsiyasini so'radi (masalan "itning rasmini chiz", "landscape of mountains"). Agent `generate_image` function call qiladi, fayl yo'lini oladi, lekin yakuniy javobda `<grok type="render_generated_image" ... />` elementi yo'q. Yoki rasmni artifacts ga yozib, lekin render qilmaydi. Foydalanuvchi rasmni to'g'ridan-to'g'ri ko'rmaydi yoki kechikadi.

## Sabab (100%)

Agent tool tavsifidagi "Do NOT use this tool for simple one-shot image generation requests. Use the render_generated_image component instead when the user just wants to see a generated image — it streams the result directly without blocking." qoidasini e'tiborsiz qoldiradi. U barcha rasm ishlarini function call deb o'ylaydi.

## Tasdiqlash

1. So'rov oddiy bitta rasm ko'rsatishmi (keyingi ishlov berish yo'q)?
2. Agent `generate_image` tool'ini chaqirdimi?
3. Yakuniy javob matnida `<grok type="render_generated_image" prompt="..." />` elementi bormi?
4. Agar tool chaqirilgan va XML yo'q — bu skill.

## Tuzatish (aynan shu)

Oddiy so'rov uchun function call qilma. To'g'ridan-to'g'ri yakuniy javob matniga XML yoz:

```xml
Mana siz so'ragan rasm:<grok type="render_generated_image" prompt="A realistic golden retriever puppy sitting in a sunny park, detailed fur, natural lighting" orientation="landscape" />
```

Agar rasm keyinchalik hujjatga kiritilishi yoki edit qilinishi kerak bo'lsa — unda `generate_image` tool'idan foydalan, natija fayl yo'lini olib, keyin ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz

Oddiy bitta rasm so'rovi uchun `generate_image` tool ishlatilmaydi. Uning o'rniga yakuniy javobda `<grok type="render_generated_image" prompt="..." />` XML elementini chiqarish kerak. Tool faqat rasmni keyingi qadamlar uchun generatsiya qilishda ishlatiladi.

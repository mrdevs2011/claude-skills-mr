---
name: agent-wrote-image-prompt-as-text-instead-of-emitting-render-generated-image-xml
description: Foydalanuvchi rasm yaratishni so'raganda agent promptni matn sifatida yozib, "mana rasm" deb aytadi, lekin <grok type="render_generated_image"> XML komponentini chiqarmaydi.
---

# Rasm yaratish so'rovida promptni matn qilib yozish o'rniga render_generated_image XML chiqarish

## Nima uchun bu skill kerak
Foydalanuvchi "rasm chiz", "generate image of...", "yangi rasm yarat" desa, agent ba'zan promptni yozib, tasvirlab beradi yoki "mana rasm" deydi, lekin haqiqiy rasm generatsiya komponentini (render_generated_image) chiqarmaydi. Natijada foydalanuvchi hech qanday rasm ko'rmaydi.

## Simptom (aynan shu)
- Foydalanuvchi aniq rasm yaratish / generation so'radi.
- Agent javobida prompt matni yoki tavsif bor.
- Javobda `<grok type="render_generated_image" prompt="..." ... />` elementi yo'q.
- Agent "mana yaratilgan rasm" yoki shunga o'xshash gap yozgan, lekin hech qanday rasm ko'rinmaydi.
- Ba'zan agent "rasm yaratib bo'lmaydi" deb aytadi, garchi komponent mavjud bo'lsa ham.

## Sabab (100%)
Agent rasm generatsiya uchun maxsus XML komponent (render_generated_image) mavjudligini esdan chiqaradi yoki uni oddiy matn javobi bilan almashtiradi. U promptni yozishni rasm yaratish deb hisoblaydi, lekin UI faqat XML element orqali rasmni render qiladi.

## Tasdiqlash
1. Foydalanuvchi so'rovida "generate", "create", "draw", "rasm yarat", "image of" kabi so'zlar bormi?
2. Agentning oxirgi javobida `render_generated_image` yoki `<grok type="render_generated_image"` qidir.
3. Agar yo'q bo'lsa va faqat matn/tavsif bo'lsa — shu skill kerak.
4. Komponent mavjudligini tasdiqlash: tool schema yoki instructionsda "render_generated_image" bor.

## Tuzatish (aynan shu)
Javobning ichida, rasm kerak bo'lgan joyda to'g'ridan-to'g'ri XML element chiqar:

```
<grok type="render_generated_image" prompt="Detailed, accurate prompt matching the user's request. Include style, composition, lighting if relevant." orientation="portrait" layout="block" />
```

Qoidalar:
- Prompt foydalanuvchi so'roviga sodiq bo'lsin, noto'g'ri ma'lumot qo'shma.
- Orientation: portrait yoki landscape (default portrait).
- Layout: block yoki inline.
- Bir nechta rasm kerak bo'lsa, bir nechta element chiqar.
- Matnda "mana rasm" deb yozish o'rniga, XML'ni joylashtir — UI o'zi render qiladi.
- Agar rasmni tahrirlash kerak bo'lsa (oldin ko'rsatilgan image_id bor), `render_edited_image` ishlat.

Misollar:
- To'g'ri: "Mana siz so'ragan rasm:" + XML element.
- Noto'g'ri: "Prompt: a cat sitting on a windowsill" (va XML yo'q).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Rasm yaratish so'rovida matn yozish yetarli emas — majburiy ravishda `<grok type="render_generated_image" ... />` chiqarish kerak.
- Promptni XML atributi ichiga qo'y, alohida matn qilib emas.
- Bu UI'ga rasmni haqiqatan generatsiya qilish va ko'rsatish imkonini beradi.

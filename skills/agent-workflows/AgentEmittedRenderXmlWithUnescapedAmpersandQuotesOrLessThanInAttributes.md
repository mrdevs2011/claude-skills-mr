---
name: unescaped-special-chars-in-render-xml
description: Agent render_inline_citation, render_card, render_file, render_generated_image kabi XML elementlarni chiqarganda attribute qiymatlarida &, ", < belgilarni escape qilmaydi — natijada XML buziladi, citation/card/file ko'rinmaydi yoki parse xatosi chiqadi.
---

# Render XML attribute qiymatlarida maxsus belgilarni escape qilmaslik

## Nima uchun bu skill kerak
Agentlar yakuniy javobda citation, card, file yoki generated image ni ko'rsatish uchun maxsus XML elementlardan foydalanadi. Bu elementlarning attribute qiymatlari (citation_id, card_id, file_path, prompt va h.k.) ichida &, ", < kabi belgilar bo'lsa va ular escape qilinmasa, XML parser buziladi. Natijada element butunlay ko'rinmaydi yoki qisman ishlamaydi. Bu foydalanuvchiga foydali kartochka yoki havolani yashiradi.

## Simptom (aynan shu)
- Agent javobida `<grok type="render_..." ... />` yozgan, lekin u UI da ko'rinmaydi yoki xato chiqadi.
- Attribute qiymatida & (masalan URL yoki matnda), " (ichki qo'shtirnoq), yoki < bor.
- Tool natijasidagi card_id yoki citation_id to'g'ri, lekin XML buzilgan.
- Prompt ichida maxsus belgi bor va render_generated_image ishlamaydi.

## Sabab (100%)
Agent XML attribute qiymatlarini oddiy matn deb yozadi va HTML/XML escape qoidalarini qo'llamaydi. U `"` ni to'g'ridan-to'g'ri, `&` ni `&` sifatida, `<` ni `<` sifatida qoldiradi. Parser attribute chegarasini noto'g'ri o'qiydi yoki entity'ni tushunmaydi.

## Tasdiqlash
1. Javobda `<grok type=` ... `/>` element bormi?
2. Uning attribute qiymatlarida (prompt, file_path, va h.k.) &, ", < belgilari bormi?
3. Ular `&`, `"`, `<` ga o'zgartirilganmi?
4. Agar yo'q va element ko'rinmayotgan bo'lsa — bu shu xato.

## Tuzatish (aynan shu)
Attribute qiymatidagi maxsus belgilarni chiqarishdan oldin escape qil:

- `&` → `&`
- `"` → `"`
- `<` → `<`
- `>` → `>` (ixtiyoriy, lekin xavfsiz)

```xml
<!-- XATO: -->
<grok type="render_generated_image" prompt="Hello & welcome to "AI" <world>" />

<!-- TO'G'RI: -->
<grok type="render_generated_image" prompt="Hello & welcome to "AI" <world>" />
```

- Faqat attribute qiymati ichida escape qil, tag nomida emas.
- citation_id va card_id odatda raqam yoki oddiy string — ularda kamdan-kam kerak, lekin prompt, file_path, matnda doim tekshir.
- Elementni inline, kerakli joyga qo'y.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Render XML elementlarini chiqarganda attribute qiymatlaridagi &, ", < belgilarni har doim escape qiling (`&`, `"`, `<`). Aks holda element buziladi va foydalanuvchi citation, card yoki rasmni ko'rmaydi. Bu eng oddiy, lekin eng tez "ko'rinmayapti" xatosini keltirib chiqaradi.

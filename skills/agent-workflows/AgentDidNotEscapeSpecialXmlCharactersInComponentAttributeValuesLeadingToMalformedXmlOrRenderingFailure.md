---
name: agent-did-not-escape-special-xml-characters-in-component-attributes
description: Agent final javobda <grok type="..."> XML elementlarining atribut qiymatlarida & " < belgilarini escape qilmagan (& " <), natijada XML buziladi yoki component render bo'lmaydi. Qachon: citation/card/image/file render qilayotganda maxsus belgi bor value ishlatilsa.
---

# Agent XML component atributlarida maxsus belgilarni escape qilmagan

## Nima uchun bu skill kerak
Final response da citation, card, generated image, file va boshqa componentlarni ko'rsatish uchun `<grok type="render_..." arg="value" />` formatida XML elementlar yoziladi. Qiymat ichida `&`, `"`, `<` bo'lsa va ular escape qilinmasa, XML parser xato beradi, element ko'rinmaydi yoki xom XML matn sifatida chiqadi. Bu agent javoblarida tez-tez uchraydigan muammo.

## Simptom (aynan shu)
Javob matnida quyidagiga o'xshash yozilgan elementlar:
```
<grok type="render_inline_citation" citation_id="abc & def" />
```
yoki
```
<grok type="render_generated_image" prompt="A photo of cat & dog < 10 years" />
```
yoki card_id yoki boshqa arg ichida `"`.
Natija: component render bo'lmaydi, chatda XML tag'lari xom holda ko'rinadi, yoki parsing xatosi.

## Sabab (100%)
Agent XML atribut qiymatlarini oddiy string deb hisoblaydi va system instructiondagi escape qoidalarini (`&` → `&`, `"` → `"`, `<` → `<`) e'tiborsiz qoldiradi. Tool resultdan kelgan id yoki o'zi yozgan promptni to'g'ridan-to'g'ri qo'yadi.

## Tasdiqlash
1. Final javobda `<grok type=` qidirib, XML elementlar bor-yo'qligini tekshir.
2. Har bir atribut qiymatida `&`, `"`, `<` belgilarini qidir.
3. Ular `&`, `"`, `<` ga almashtirilganligini tasdiqla.
4. Agar almashtirilmagan bo'lsa — bu skill to'g'ri mos.

## Tuzatish (aynan shu)
Atribut qiymatlaridagi maxsus belgilarni quyidagicha almashtir:

- `&` → `&`
- `"` → `"`
- `<` → `<`

Misol:

```xml
<!-- Noto'g'ri -->
<grok type="render_generated_image" prompt="A cat & a dog < 5" orientation="landscape" />

<!-- To'g'ri -->
<grok type="render_generated_image" prompt="A cat & a dog < 5" orientation="landscape" />
```

```xml
<!-- Noto'g'ri -->
<grok type="render_inline_citation" citation_id="123&456" />

<!-- To'g'ri -->
<grok type="render_inline_citation" citation_id="123&456" />
```

Har doim XML yozishdan oldin value'larni escape qil. Bu faqat atribut ichidagi qiymatlarga tegishli.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
XML component (`<grok ... />`) yozayotganda atribut qiymatlaridagi `& " <` belgilarini har doim escape qiling. Bu render to'g'ri ishlashini ta'minlaydi va xom XML chiqishini oldini oladi. Instructiondagi qoidalarga qat'iy rioya qiling.

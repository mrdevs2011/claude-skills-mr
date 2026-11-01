---
name: agent-attempted-to-render-via-function-call-instead-of-xml
description: Agent kartochka, citation, rasm yoki faylni render qilish uchun function call ishlatishga urinadi, o'rniga yakuniy javob matnida to'g'ridan-to'g'ri XML element chiqarishi kerak.
---

# Agent Attempted To Render Card Citation Image Or File Via Function Call Instead Of Inline Xml Element In Response

## Nima uchun bu skill kerak

Render komponentlari (citation, card, generated image, edited image, file) faqat yakuniy javob matnidagi maxsus XML elementlari orqali ishlaydi. Ularni function call sifatida chaqirish mumkin emas — tizim buni qabul qilmaydi va foydalanuvchi hech narsa ko'rmaydi. Agentlar ba'zan "render qilish tool" deb o'ylab function call qilishga urinadi.

## Simptom (aynan shu)

Agent yakuniy javob o'rniga yoki javobdan oldin `render_card`, `render_inline_citation`, `render_generated_image` yoki shunga o'xshash nomli function call yuboradi. Yoki javobda "men render_card chaqirdim" deb yozadi, lekin matnda `<grok type="render_...">` elementi yo'q. Foydalanuvchi kartochka, manba yoki rasmni ko'rmaydi.

## Sabab (100%)

Agent "To place a citation, card... write an XML element in the response text. Do not use a function call for these." qoidasini e'tiborsiz qoldiradi. U barcha narsani tool/function call deb o'ylaydi va XML'ni javob matniga yozish o'rniga alohida call qilishga urinadi.

## Tasdiqlash

1. Oxirgi tool natijasida card_id, citation_id yoki file_path bormi?
2. Agent javobida function call qilganmi (masalan render_card deb)?
3. Javob matnida to'g'ri `<grok type="render_card" card_id="..." />` yoki shunga o'xshash XML bormi?
4. Agar function call bor va XML yo'q — bu skill.

## Tuzatish (aynan shu)

Function call o'rniga yakuniy javob matniga to'g'ridan-to'g'ri XML element yoz:

```xml
Natija tayyor.<grok type="render_card" card_id="xyz-123" />

Qo'shimcha manba.<grok type="render_inline_citation" citation_id="456" />

<grok type="render_file" file_path="/workspace/artifacts/output.pdf" />
```

Qoidalar:
- XML'ni javob matnining ichiga, tegishli joyga qo'y.
- Hech qachon render_* uchun function call qilma.
- Faqat oldingi tool natijasida ko'ringan id'larni ishlat.
- Matn + XML birga bo'lsin.

## Xulosa — bu skillni o'qib nimani bilib oldingiz

Kartochka, citation, rasm va faylni render qilish uchun function call ishlatilmaydi. Ularni faqat yakuniy javob matnidagi `<grok type="render_...">` XML elementlari orqali chiqarish kerak. Aks holda foydalanuvchi ularni ko'rmaydi.

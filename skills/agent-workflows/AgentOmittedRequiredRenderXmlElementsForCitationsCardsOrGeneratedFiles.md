---
name: agent-omitted-required-render-xml-elements
description: Agent tool natijalarida citation_id, card_id yoki file_path berilgan bo'lsa-da, yakuniy javobda tegishli <grok type="render_..."> XML elementlarini chiqarmaydi, shu bilan foydalanuvchi boy kontentni ko'rmaydi.
---

# Agent Omitted Required Render XML Elements For Citations Cards Or Generated Files

## Nima uchun bu skill kerak

Tool chaqiruvlari (web_search, sports_search, weather, file yozish) ko'pincha maxsus id'lar qaytaradi. Bu id'larni yakuniy javobda XML orqali render qilish majburiy — aks holda foydalanuvchi manba, kartochka yoki faylni to'g'ri ko'rmaydi. Agentlar ko'pincha matnni yozib, render tag'larini unutadi.

## Simptom (aynan shu)

Yakuniy javobda tool natijasidagi `citation_id`, `card_id` yoki yozilgan fayl yo'li tilga olinadi yoki tavsiflanadi, lekin javob matnida hech qanday `<grok type="render_inline_citation" ... />`, `<grok type="render_card" ... />` yoki `<grok type="render_file" ... />` elementi yo'q. Foydalanuvchi oddiy matn ko'radi, boy kontent (manba linki, sports/weather kartochka, yuklab olish tugmasi) chiqmaydi.

## Sabab (100%)

Agent tool schema va instruction'dagi "To place a citation, card, chart, image, or file... write an XML element" qoidasini e'tiborsiz qoldiradi yoki faqat matnli xulosa berishga o'tadi. Id'ni "eslab qoladi" lekin uni XML atribut sifatida joylashtirishni unutadi.

## Tasdiqlash

1. Oxirgi tool natijasini qara — unda `[web:123]`, `card_id`, yoki fayl yo'li bormi?
2. Yakuniy javob matnida tegishli `<grok type="render_..."` qator bormi?
3. Agar id bor, lekin XML yo'q — bu skill qo'llanadi.

## Tuzatish (aynan shu)

Yakuniy javobni yozayotganda, har bir tegishli id uchun XML elementini to'g'ridan-to'g'ri matn ichiga joylashtir:

```xml
Manba: bu yerda ma'lumot.<grok type="render_inline_citation" citation_id="123" />

<grok type="render_card" card_id="abc-123" />

<grok type="render_file" file_path="/workspace/artifacts/report.pdf" />
```

Qoidalar:
- XML elementlarini javob matnining ichida, tegishli joyda yoz.
- Faqat tool natijasida ko'ringan id'larni ishlat.
- Bir nechta bo'lsa — har birini alohida chiqar.
- Matnni yozib bo'lgach, "render qildimmi?" deb o'zingni tekshir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz

Tool id bergan bo'lsa, uni matnda eslatish yetarli emas — majburiy ravishda tegishli `<grok type="render_...">` XML elementini chiqarish kerak. Aks holda foydalanuvchi boy kontentni yo'qotadi.

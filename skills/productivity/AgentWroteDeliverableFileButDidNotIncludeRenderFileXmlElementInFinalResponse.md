---
name: deliverable-written-but-no-render-file-xml
description: Deliverable fayl (docx, pdf, xlsx, rasm, zip va h.k.) /workspace/artifacts ga yozildi, lekin yakuniy javobda <grok type="render_file" file_path="..."/> elementi chiqarilmadi — foydalanuvchi faylni ko'rmaydi va yuklab ololmaydi.
---

# Deliverable fayl yozilgan lekin render_file XML elementi javobda yo'q

## Nima uchun bu skill kerak
Foydalanuvchi ko'radigan va yuklab oladigan fayllar faqat `/workspace/artifacts` (yoki relative) ga yozilishi yetarli emas. Yakuniy matn javobida maxsus XML element `<grok type="render_file" file_path="absolute-yoki-relative-path"/>` chiqarilmasa, fayl UI da preview va download tugmasi bilan ko'rinmaydi. Foydalanuvchi "fayl qani?" deb so'raydi yoki hech narsa ko'rmaydi.

## Simptom (aynan shu)
- `write_file` yoki boshqa vosita bilan fayl `/workspace/artifacts/something.docx` (yoki .pdf, .xlsx, .png, .zip) ga muvaffaqiyatli yozilgan.
- Agent javobida fayl haqida gapirgan ("yaratdim", "mana report"), lekin matnda `<grok type="render_file" ... />` elementi yo'q.
- Foydalanuvchi interfeysida hech qanday fayl preview yoki download paydo bo'lmagan.
- Path to'g'ri bo'lsa-da, render qilinmagan.

## Sabab (100%)
Agent fayl yaratishni yakuniy qadam deb hisoblagan va render qilish qoidasini (instruction yoki system: "To place a ... file in the final response, write an XML element") e'tiborsiz qoldirgan. Faqat matnli tavsif bergan, XML komponentni chiqarmagan.

## Tasdiqlash
1. Deliverable fayl haqiqatan `/workspace/artifacts` root da mavjudmi (`ls` bilan)?
2. Yakuniy javob matnida (tool call emas, final response) `<grok type="render_file" file_path="..."/>` bormi?
3. file_path attribute to'g'ri absolute yoki working-dir relative pathmi?
4. Agar rasm generatsiya bo'lsa — render_generated_image ishlatilganmi, lekin oddiy fayl uchun render_file?

## Tuzatish (aynan shu)
Faylni yozgandan so'ng, yakuniy javobning tegishli joyida (fayl haqida gapirgan joyda) quyidagi elementni chiqar:

```xml
<grok type="render_file" file_path="/workspace/artifacts/report.docx" />
```

Yoki relative:

```xml
<grok type="render_file" file_path="report.docx" />
```

Qoidalar:
- Bir nechta fayl bo'lsa — har biri uchun alohida element.
- Path da maxsus belgilar bo'lsa escape qil (`&` → `&`, `"` → `"`).
- Oraliq skriptlar `/tmp` da qolsin, faqat final deliverable render qilinsin.
- Agar fayl yaratilmagan bo'lsa — render qilma.

Misol to'g'ri oqim:
1. write_file({ file_path: "/workspace/artifacts/summary.xlsx", content: "..." })
2. Final response da: "Mana hisobot: <grok type=\"render_file\" file_path=\"/workspace/artifacts/summary.xlsx\" />"

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Deliverable yozish yetarli emas — yakuniy javobda `<grok type="render_file" file_path="..."/>` elementi chiqarish majburiy, aks holda foydalanuvchi faylni ko'rmaydi va yuklab ololmaydi.

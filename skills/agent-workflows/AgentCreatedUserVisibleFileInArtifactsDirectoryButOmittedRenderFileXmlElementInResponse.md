---
name: agent-created-user-visible-file-in-artifacts-directory-but-omitted-render-file-xml-element-in-response
description: Agent faylni /workspace/artifacts ga yozdi lekin javobda <grok type="render_file" ... /> XML chiqarmadi, shuning uchun foydalanuvchi faylni ko'rish yoki yuklab olish imkoniyatiga ega emas.
---

# Artifactsdagi fayl uchun render_file XML chiqarish

## Nima uchun bu skill kerak
Foydalanuvchi ko'rishi yoki yuklab olishi kerak bo'lgan fayllar faqat /workspace/artifacts ichida saqlanadi va javob matnida maxsus XML element bilan e'lon qilinadi. XML chiqarilmasa, fayl yaratilgan bo'lsa ham foydalanuvchi uni ko'rmaydi.

## Simptom (aynan shu)
Agent fayl yaratdi (masalan PDF, DOCX, XLSX, rasm yoki boshqa deliverable), lekin oxirgi javobda hech qanday `<grok type="render_file" file_path="..." />` elementi yo'q. Foydalanuvchi "fayl qayerda?" deb so'raydi yoki faqat matn ko'radi.

## Sabab (100%)
Agent faylni yozishni biladi, lekin uni foydalanuvchiga ko'rsatish uchun majburiy XML formatini unutadi. Ko'rsatmalar "To place a citation, card, chart, image, or file in the final response, write an XML element" degan qoidani o'tkazib yuboradi.

## Tasdiqlash
1. Javob matnida `render_file` so'zi yoki `<grok type="render_file"` bor-yo'qligini tekshir.
2. Fayl /workspace/artifacts ostida mavjudligini tasdiqla (masalan `ls /workspace/artifacts`).
3. Agar fayl bor, lekin XML yo'q — bu simptom.

## Tuzatish (aynan shu)
Faylni artifacts ga yozgandan so'ng, javobning tegishli joyida (odatda oxirida) quyidagi XML ni chiqar:

```xml
<grok type="render_file" file_path="/workspace/artifacts/your-file.pdf" />
```

- `file_path` absolute path bo'lishi kerak.
- Bir nechta fayl bo'lsa, har biri uchun alohida element.
- XML ni matn ichida oddiy kod bloki sifatida emas, to'g'ridan-to'g'ri chiqar (model uni render qiladi).

Misol:

```
Fayl tayyor:

<grok type="render_file" file_path="/workspace/artifacts/report.docx" />
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Artifacts papkasidagi foydalanuvchi-ko'rinadigan fayllar faqat `render_file` XML elementi orqali ko'rsatiladi. Fayl yaratish yetarli emas — XML ni javobga qo'shish shart, aks holda foydalanuvchi uni ko'rmaydi.

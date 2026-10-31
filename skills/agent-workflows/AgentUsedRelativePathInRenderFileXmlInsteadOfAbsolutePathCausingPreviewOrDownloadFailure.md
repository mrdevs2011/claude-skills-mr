---
name: agent-used-relative-path-in-render-file-xml-instead-of-absolute-path
description: Agent emitted render_file XML with a relative file_path; system requires absolute path for reliable preview and download, resulting in failure.
---

# Agent Used Relative Path In Render File Xml Instead Of Absolute Path Causing Preview Or Download Failure

## Nima uchun bu skill kerak
Agent foydalanuvchiga fayl (docx, pdf, xlsx, zip va hokazo) taqdim qilishi kerak bo'lganda `render_file` XML komponentini ishlatadi. Agar `file_path` nisbiy (relative) berilsa, sandbox yoki UI uni to'g'ri topa olmaydi, preview/download ishlamaydi va foydalanuvchi faylni ololmaydi.

## Simptom (aynan shu)
- Javobda `<grok type="render_file" file_path="report.pdf" />` yoki `file_path="artifacts/out.docx"` kabi nisbiy yo'l ishlatilgan.
- UI'da fayl preview chiqmaydi, download tugmasi ishlamaydi yoki "file not found" xatosi beradi.
- Fayl haqiqatan `/workspace/artifacts/` yoki boshqa joyda mavjud, lekin nisbiy yo'l tufayli topilmaydi.

## Sabab (100%)
`render_file` komponenti hujjatda "absolute path (preferred)" deb belgilangan. Agent nisbiy yo'l bergan, chunki ishchi papka `/workspace/artifacts` ekanini hisobga olmagan yoki `file_path` argumentini to'liq absulyut qilib yozmagan.

## Tasdiqlash
- XML ichidagi `file_path` qiymati `/` bilan boshlanadimi (absolute)?
- `ls -l` yoki `read_file` bilan shu absolute yo'l haqiqatan mavjud faylga ishora qiladimi?
- Agar nisbiy bo'lsa — bu skill qo'llanadi.

## Tuzatish (aynan shu)
Har doim absolute yo'l ishlat:

```xml
<grok type="render_file" file_path="/workspace/artifacts/my-report.pdf" />
```

Agar fayl `/tmp` da bo'lsa:

```xml
<grok type="render_file" file_path="/tmp/generated/output.xlsx" />
```

Nisbiy yo'llarni (`report.pdf`, `./out.docx`, `artifacts/file.pdf`) hech qachon ishlatma. Avval `pwd` yoki to'liq yo'lni bilib, absolute qilib yoz.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`render_file` da doim absolute `file_path` ber. Nisbiy yo'l preview va download'ni buzadi. Fayl joyini aniq bilib, `/` bilan boshlanadigan to'liq yo'l ishlat.

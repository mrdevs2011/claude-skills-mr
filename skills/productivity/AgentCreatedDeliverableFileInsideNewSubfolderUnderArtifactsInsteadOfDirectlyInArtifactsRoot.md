---
name: deliverable-file-in-artifacts-subfolder
description: Foydalanuvchiga ko'rsatiladigan yoki yuklab olinadigan fayl (docx, pdf, xlsx, rasm va h.k.) /workspace/artifacts ichida yangi papka yaratib, shu papkaga yozildi — foydalanuvchi uni ko'rmaydi yoki render_file ishlamaydi.
---

# Deliverable faylni artifacts ichida yangi subfolder ga yozish

## Nima uchun bu skill kerak
Ish papkasi `/workspace/artifacts` foydalanuvchi ko'radigan yagona joy. Deliverable fayllar to'g'ridan-to'g'ri shu root ga yozilishi shart. Yangi `artifacts/report/` yoki `artifacts/output/` kabi subfolder yaratish faylni yashiradi, `render_file` ishlamasligiga yoki foydalanuvchi topa olmasligiga olib keladi. Oraliq skriptlar esa `/tmp` ga yoziladi.

## Simptom (aynan shu)
- `write_file` yoki bash bilan fayl yo'li `/workspace/artifacts/something/file.docx` yoki `artifacts/subfolder/result.xlsx` bo'lgan.
- Foydalanuvchi "faylni ko'rmayapman" degan yoki `render_file` xato bergan.
- Oraliq generatsiya skripti ham artifacts ichiga tushib qolgan.
- Working directory `/workspace/artifacts` ekanligi e'tiborsiz qoldirilgan.

## Sabab (100%)
Agent "tartib uchun papka yaratay" yoki "boshqa loyihalardagi odat" bilan yangi subfolder ochgan. Tizim qoidasi: deliverable'lar to'g'ridan-to'g'ri artifacts root ga, hech qachon yangi artifacts/ subfolder ostiga emas. Oraliq fayllar `/tmp` ga.

## Tasdiqlash
1. Yaratilgan fayl yo'li `/workspace/artifacts/` bilan boshlanadimi va undan keyin faqat fayl nomi bormi (papka yo'q)?
2. `ls /workspace/artifacts` da fayl to'g'ridan-to'g'ri ko'rinadimi?
3. Agar subfolder bor bo'lsa — bu holat.
4. `render_file` uchun absolute yoki relative path to'g'ri berilganmi?

## Tuzatish (aynan shu)
Deliverable faylni doim to'g'ridan-to'g'ri artifacts root ga yoz.

Noto'g'ri:
```python
# yoki bash
mkdir -p /workspace/artifacts/reports
write_file(file_path="/workspace/artifacts/reports/final.docx", content=...)
```

To'g'ri:
```python
write_file(file_path="/workspace/artifacts/final-report.docx", content=...)
# yoki
# bash: faqat fayl
# Keyin javobda:
# <grok type="render_file" file_path="/workspace/artifacts/final-report.docx" />
```

Oraliq skriptlar:
```bash
# /tmp/generate.py ga yoz, keyin ishga tushir
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Foydalanuvchi ko'radigan barcha deliverable fayllar `/workspace/artifacts` root ga to'g'ridan-to'g'ri yoziladi. Hech qachon yangi subfolder yaratma. Oraliq generatsiya fayllari `/tmp` da bo'lsin. Keyin `render_file` bilan to'g'ri yo'lni ber.

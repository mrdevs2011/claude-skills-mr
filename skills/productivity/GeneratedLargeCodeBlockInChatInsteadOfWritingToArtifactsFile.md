---
name: generated-large-code-in-chat-instead-of-file
description: Foydalanuvchi fayl yoki deliverable so'raganda, agent katta kod yoki matnni chat javobida chiqaradi, lekin artifacts yoki ish papkasiga fayl yozmaydi — foydalanuvchi yuklab ololmaydi.
---

# Katta kodni chatda chiqarish, faylga yozmaslik

## Nima uchun bu skill kerak
Agent ba'zan "mana kod" deb uzun bloklarni to'g'ridan-to'g'ri javob matniga qo'yadi. Foydalanuvchi uni nusxa qilib, o'zi fayl yaratishi kerak bo'ladi. Bu noqulay, xato ehtimoli yuqori va deliverable sifatida ishlamaydi. To'g'ri yo'l — `write_file` yoki mos tool bilan fayl yaratib, `render_file` orqali ko'rsatish.

## Simptom (aynan shu)
- Javobda 50+ qatorli kod bloki yoki to'liq fayl matni bor.
- Ish papkasida (`/workspace/artifacts` yoki belgilangan joy) yangi fayl yaratilmagan.
- Foydalanuvchi "faylni yubor" yoki "download" deb so'ragan, lekin faqat matn kelgan.
- `render_file` yoki shunga o'xshash komponent ishlatilmagan.

## Sabab (100%)
Agent "kodni ko'rsatish yetarli" deb hisoblaydi va fayl yozish qadamini o'tkazib yuboradi. Yoki tool chaqirishni unutadi, yoki "qisqa javob" deb o'ylaydi. Natijada foydalanuvchi qo'lda ish qilishi kerak bo'ladi.

## Tasdiqlash
1. So'rov fayl, report, script, document yoki yuklab olinadigan narsa haqidami?
2. Javobda katta kod/matn bloki bormi?
3. Tool call logida `write_file`, `bash` (echo > file) yoki mos yozish tool ishlatilganmi?
4. Oxirida `render_file` yoki shunga o'xshash qilinganmi?

## Tuzatish (aynan shu)
Katta kontentni **hech qachon** to'liq chatga chiqarma. Buning o'rniga:

1. Kontentni faylga yoz:
   - `write_file` tool bilan to'g'ridan-to'g'ri.
   - Yoki `bash` orqali `cat > /workspace/artifacts/fayl.nom << 'EOF' ... EOF`
2. Kerak bo'lsa formatni tekshir (masalan python, markdown).
3. Javobda qisqa xulosa ber va faylni ko'rsat:
   ```
   Fayl yaratildi: report.md
   <grok type="render_file" file_path="/workspace/artifacts/report.md" />
   ```
4. Faqat qisqa misol yoki o'zgarish diff'ini chatda ko'rsat — to'liq faylni emas.

Misol:
```
# XATO: chatda 200 qator kod
def big_function():
    ... (butun fayl)

# TO'G'RI:
write_file tool chaqirildi → /workspace/artifacts/script.py
Javob: "Script tayyor. Yuklab oling:"
<grok type="render_file" file_path="/workspace/artifacts/script.py" />
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Katta kod yoki deliverable ni chat matniga emas, faylga yoz.
- Foydalanuvchi yuklab olishi uchun `render_file` ishlat.
- Bu qadam foydalanuvchiga vaqt tejaydi va xatolarni kamaytiradi.

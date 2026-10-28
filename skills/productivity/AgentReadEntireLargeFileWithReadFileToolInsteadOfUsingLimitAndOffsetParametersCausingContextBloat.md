---
name: agent-read-entire-large-file-with-read-file-instead-of-limit-offset
description: Agent large faylni to'liq o'qiydi (read_file tool bilan limit/offset ishlatmasdan) natijada context to'lib ketadi, token sarflanadi va keyingi ishlar sekinlashadi.
---

# Agent katta faylni to'liq o'qidi, limit va offset ishlatmadi

## Nima uchun bu skill kerak
Katta fayllar (loglar, JSON, kod, hujjatlar) to'liq context'ga yuklanganda token chegarasiga tez yetiladi, javob sekinlashadi va keraksiz ma'lumot agentni chalg'itadi. `read_file` tool `limit` va `offset` parametrlarini qo'llab-quvvatlaydi — faqat kerakli qismni o'qish mumkin.

## Simptom (aynan shu)
- Agent `read_file` chaqiradi va butun fayl (yoki 1000+ qator) natijada qaytadi.
- Fayl hajmi katta ekanligi ma'lum yoki oldindan taxmin qilinadi (masalan `/tmp/.../log`, katta JSON, uzun SKILL.md).
- Agent keyin "context to'ldi" yoki javob qisqartirilgan deb aytadi, yoki keraksiz qismlarni o'qib vaqt yo'qotadi.
- `limit` yoki `offset` parametri ishlatilmagan.

## Sabab (100%)
Agent "avval hammasini ko'rib chiqay" deb o'ylaydi yoki toolning `limit`/`offset` imkoniyatini e'tiborsiz qoldiradi. To'liq o'qish osonroq ko'rinadi, lekin bu tejamkorlik va context samaradorligi qoidasini buzadi.

## Tasdiqlash
1. `read_file` chaqirilganmi?
2. Fayl katta ekanligi (qator soni, hajmi) ma'lummi yoki oldingi `ls`/`wc` dan?
3. Chaqiruvda `limit` va/yoki `offset` berilganmi? (yo'q bo'lsa — bu holat)
4. Natijada keraksiz qismlar (masalan boshidagi 500 qator) context'ga tushganmi?

## Tuzatish (aynan shu)
Katta faylni o'qishdan oldin:

1. Avval hajmini bil: `bash` bilan `wc -l file` yoki `ls -lh`.
2. Kerakli qismni aniqlash: boshidagi xato, oxiridagi log, yoki ma'lum bo'lim.
3. `read_file` ni shunday chaqir:
   - Birinchi 50 qator: `limit=50`
   - 200-qatordan boshlab: `offset=200, limit=100`
4. Qidiruv kerak bo'lsa `grep` yoki toolning pattern rejimini ishlat (agar mavjud bo'lsa), to'liq o'qishdan saqlan.

Misol:
```
read_file file_path="/tmp/skills-repo/instruction.md" limit=100
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Katta fayllarni hech qachon to'liq o'qima. Doim `limit` va `offset` bilan faqat kerakli qismni ol. Bu contextni toza saqlaydi, token tejaydi va ishni tezlashtiradi. Avval hajmni tekshir, keyin maqsadli o'qi.

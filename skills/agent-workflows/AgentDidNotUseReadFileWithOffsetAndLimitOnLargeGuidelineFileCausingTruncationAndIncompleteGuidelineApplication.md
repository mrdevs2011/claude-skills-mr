---
name: did-not-use-readfile-offset-limit-on-large-guidelines
description: Agent katta qo'llanma fayllarini (architecture.md, instruction.md) to'liq o'qish uchun read_file tool'ida limit va offset ishlatmadi — natijada truncated output oldi va keyingi muhim qoidalarni o'tkazib yubordi.
---

# Katta qo'llanma fayllarini offset/limit bilan o'qimaslik

## Nima uchun bu skill kerak
architecture.md va instruction.md katta fayllar. Default read_file limit (masalan 2000 qator) yetmasligi mumkin. Agent to'liq o'qimagan holda skill yaratasa, format yoki qoidalarni buzadi. Bu skill qidiruvda topilishi uchun to'liq bo'lishi shart.

## Simptom (aynan shu)
- Tool output truncated deb belgilangan.
- Agent "to'liq o'qidim" deb yozadi, lekin keyingi bo'limlar haqida bilmaydi.
- Yaratilgan skill architecture.md dagi so'nggi qoidalarga zid.
- Offset bilan qo'shimcha o'qish chaqiruvi yo'q.

## Sabab (100%)
Agent read_file ni default parametrlar bilan chaqirdi va truncated outputni to'liq deb taxmin qildi. Katta fayllar uchun limit/offset yoki bir necha marta o'qish kerakligini unutdi.

## Tasdiqlash
1. Tool chaqiruvlarida read_file da limit va offset ishlatilganmi yoki bir necha marta chaqirilganmi?
2. Fayl hajmi limitdan katta ekanligini tekshirish (ls -l yoki wc -l).
3. Yaratilgan skill barcha majburiy bo'limlarga egami?

## Tuzatish (aynan shu)
Katta fayllar uchun:

```python
# Avval hajmini bil
# bash: wc -l architecture.md

# Keyin qismlab o'qi
read_file(file_path="architecture.md", limit=100, offset=1)
read_file(file_path="architecture.md", limit=100, offset=101)
# ... to'liq o'qiguncha davom et
```

Yoki pattern bilan qidirish uchun open_page emas, lekin bu yerda local fayl uchun read_file.

Hech qachon truncated outputni to'liq deb hisoblama.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Katta qo'llanma fayllarini o'qishda read_file ning limit va offset parametrlarini ishlatish shart. Truncated outputni to'liq deb taxmin qilish format buzilishiga olib keladi. Har safar to'liq o'qilganligini tasdiqlang.

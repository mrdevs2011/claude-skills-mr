---
name: opened-entire-large-file-without-limit-when-section-sufficed
description: Katta faylni to'liq o'qish (read_file da limit/offset ishlatmasdan) faqat bir necha qator yoki bitta bo'lim kerak bo'lganda — token isrof, sekinlashish va kontekst ifloslanishi.
---

# Katta faylni to'liq o'qish, faqat qismi kerak bo'lsa

## Nima uchun bu skill kerak
Agentlar katta fayllarni (instruction.md, architecture.md, uzun loglar, kod) har doim to'liq o'qiydi. Faqat bitta bo'lim, bir necha qator yoki ma'lum bir qism kerak bo'lsa ham `read_file` ni limit/offset siz chaqiradi. Bu keraksiz token sarflaydi, javob sekinlashadi va kontekstni ifloslantiradi.

## Simptom (aynan shu)
- `read_file` chaqirilganda `limit` yoki `offset` parametri berilmagan, lekin keyin faqat faylning bir qismi ishlatilgan.
- Katta fayl (500+ qator) to'liq o'qilgan, lekin agent javobida faqat 10-20 qatorlik bo'limdan foydalangan.
- Token sarfi yuqori, "truncated" xabari chiqqan yoki kontekst to'lgan.
- Bir xil katta fayl bir necha marta to'liq o'qilgan.

## Sabab (100%)
Agent "to'liq ko'rib chiqaman" deb o'ylaydi yoki tool parametrlarini (limit, offset) esdan chiqaradi. Default 2000 qator yetarli deb hisoblaydi va kerakli qismni aniq bilmasa ham butun faylni tortadi.

## Tasdiqlash
1. `read_file` chaqiruvida `limit` va `offset` bor-yo'qligini tekshir.
2. Fayl uzunligi (qator soni) > 100 va faqat bitta heading yoki kichik qism kerakmi?
3. Keyingi amallar faqat o'qilgan matnning kichik qismini ishlatdimi?
4. Bir xil fayl oldinroq o'qilgan va kontekstdа bor edi-mi?

## Tuzatish (aynan shu)
Faqat kerakli qismni o'qi:

```bash
# Noto'g'ri
read_file file_path="/path/to/large.md"   # to'liq

# To'g'ri — avval strukturani bil (headings)
# yoki offset + limit ishlat
read_file file_path="/path/to/large.md" offset=50 limit=80
```

Qoidalar:
- Fayl > 150 qator va faqat bitta bo'lim kerak → `offset` + `limit` majburiy.
- Birinchi marta o'qiyotgan bo'lsang va struktura noma'lum → avval `limit=100` bilan boshi + oxirini ko'r, keyin kerakli joyga o't.
- Kontekstdа allaqachon o'qilgan qism bo'lsa — qayta o'qima.
- Skill yozishda architecture.md / instruction.md ning faqat "Skill yozish qoidalari" bo'limini o'qi.

Misol:
```
# Faqat format bo'limi kerak
read_file file_path="architecture.md" offset=55 limit=40
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Katta faylni hech qachon to'liq o'qima agar faqat bir qismi kerak bo'lsa.
- Har doim `limit` va `offset` ishlat — token va vaqtni tejaydi.
- Avval kichik qism bilan strukturani aniqlab, keyin aniq joyga bor.

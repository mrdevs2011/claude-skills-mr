---
name: agent-sequential-instead-of-parallel-tools
description: Mustaqil tool chaqiruvlarini ketma-ket (har birini alohida turnida) bajarish o'rniga parallel batching ishlatmaslik — kechikish va token isrofiga olib keladi.
---

# Mustaqil tool'larni ketma-ket chaqirish

## Nima uchun bu skill kerak
Agent bir nechta mustaqil ma'lumot yoki operatsiyani olish kerak bo'lganda (masalan, bir nechta fayl o'qish, bir nechta web_search, weather + sports) ularni parallel chaqirish o'rniga ketma-ket qiladi. Bu umumiy javob vaqtini uzaytiradi va foydalanuvchi kutishini oshiradi.

## Simptom (aynan shu)
- Bir nechta tool natijasi kerak, lekin ular bir-biriga bog'liq emas.
- Agent birinchi tool'ni chaqiradi, natijasini kutadi, keyin ikkinchisini chaqiradi.
- Javobda "avval X ni tekshirdim, endi Y ni..." kabi ketma-ketlik ko'rinadi.
- Parallel imkoniyat borligini bilsa ham ishlatmaydi.

## Sabab (100%)
Agent tool chaqiruvlarni default ravishda ketma-ket deb hisoblaydi yoki parallel function calling imkoniyatini e'tiborsiz qoldiradi. "Keyingi chaqiruv oldingisiga bog'liqmi?" deb so'ramaydi va mustaqil holatlarda batch qilmaydi.

## Tasdiqlash
1. Kerakli tool'lar bir-birining natijasiga bog'liq emasmi? (masalan, ikki xil web_search, yoki architecture.md va style.md o'qish)
2. Bir function call javobida bir nechta tool chaqiruvlari parallel ravishda yuborilishi mumkinmi?
3. Agar ha bo'lsa — parallel qilinganmi yoki ketma-ket?

## Tuzatish (aynan shu)
Mustaqil operatsiyalarni bir vaqtda chaqir.

**Noto'g'ri (ketma-ket):**
```
# Turn 1
read_file architecture.md
# Turn 2 (natijadan keyin)
read_file style.md
```

**To'g'ri (parallel):**
Bitta javobda ikkala tool'ni ham chaqir:
```json
[
  {"tool": "read_file", "args": {"file_path": "architecture.md"}},
  {"tool": "read_file", "args": {"file_path": "style.md"}}
]
```

Yoki bash orqali:
```bash
# Parallel emas, lekin bir buyruqda
cat architecture.md style.md
```
Lekin tool'lar uchun parallel function calls afzal.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Mustaqil tool chaqiruvlarini har doim parallel batch qilish kerak. Bu latency'ni kamaytiradi va samaradorlikni oshiradi. Bog'liq bo'lganlar (birining natijasi keyingisiga kerak) ketma-ket qoladi.

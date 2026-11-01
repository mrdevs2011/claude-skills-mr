---
name: python-compiled-regex-inside-loop-instead-of-once-outside
description: Python re.compile() or re pattern created inside a loop causing repeated compilation overhead on every iteration. Use when regex matching or search is done repeatedly in a loop and performance is relevant.
---

# Python Compiled Regex Inside Loop Instead Of Once Outside Causing Repeated Overhead

## Nima uchun bu skill kerak
Kodda bir xil regular expression bir necha marta (loop ichida yuzlab yoki minglab marta) ishlatilganda, har safar `re.compile()` yoki inline pattern qayta-qayta compile qilinadi. Bu CPU vaqtini behuda sarflaydi, ayniqsa katta ma'lumotlar ustida ishlaganda sezilarli sekinlashishga olib keladi. AI modellari ko'pincha qulaylik uchun patternni loop ichida yozib qo'yadi, lekin bu optimallashtirilmagan.

## Simptom (aynan shu)
- `for item in large_list:` ichida `re.search(r'pattern', item)` yoki `re.compile(r'pattern')` har iteratsiyada chaqiriladi.
- Profiling yoki timingda regex qismi kutilganidan sekinroq.
- Bir xil pattern ko'p marta ishlatiladi, lekin compile bir marta qilinmagan.
- Katta datasetda (loglar, matnlar) ishlov berishda performance shikoyati.

## Sabab (100%)
`re.compile()` qimmat operatsiya — patternni parse qilish, optimallashtirish va matcher yaratish. Loop ichida har safar buni qilish O(n) compile xarajatini qo'shadi. Python `re` moduli ba'zi oddiy patternlarni cache qiladi, lekin bu ishonchli emas va murakkab patternlarda yoki explicit compile da to'liq ishlamaydi. Eng to'g'ri yo'l — bir marta compile qilib, compiled objectni loopdan tashqarida saqlash.

## Tasdiqlash
- Kodda loop ichida `re.compile`, `re.search`, `re.match`, `re.findall` yoki `re.sub` bor va pattern o'zgarmasmi?
- Bir xil pattern 10+ marta ishlatiladimi?
- Loop tashqarisida compiled pattern yo'qmi?
- `timeit` yoki profiler bilan compile tashqarida va ichkarida farqni o'lchash mumkin.

## Tuzatish (aynan shu)
Patternni loopdan oldin bir marta compile qiling va compiled objectni ishlating:

```python
import re

# Noto'g'ri — har iteratsiyada compile
for line in lines:
    if re.search(r'error|warning|fail', line, re.IGNORECASE):
        process(line)

# To'g'ri — bir marta compile
pattern = re.compile(r'error|warning|fail', re.IGNORECASE)
for line in lines:
    if pattern.search(line):
        process(line)
```

Agar pattern dinamik bo'lsa (har safar o'zgarsa), compile ichida qolishi mumkin, lekin imkon qadar tashqariga chiqaring. Flags ham compile vaqtida beriladi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
O'zgarmas regex patternni loop ichida qayta-qayta compile qilmang. `re.compile()` ni bir marta loopdan oldin chaqiring va compiled pattern objectini ishlating. Bu katta ma'lumotlar ustida sezilarli performance yutug'ini beradi va kodni tozaroq qiladi.

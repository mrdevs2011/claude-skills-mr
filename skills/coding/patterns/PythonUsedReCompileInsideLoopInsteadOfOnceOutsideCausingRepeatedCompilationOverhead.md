---
name: python-re-compile-inside-loop
description: Regex pattern is compiled with re.compile() on every iteration of a loop instead of once before the loop, causing unnecessary CPU overhead for repeated compilation of the same pattern.
---

# Python: re.compile() ichida tsikl

## Nima uchun bu skill kerak
Katta yoki ko'p marta ishlatiladigan regex patternlarni har tsikl iteratsiyasida qayta compile qilish sekinlashtiradi. re.compile() bir marta chaqirilishi va natijasi qayta ishlatilishi kerak.

## Simptom (aynan shu)
Kodda `re.compile(pattern)` chaqiruvi `for` yoki `while` tsikli ichida joylashgan va pattern o'zgarmaydi. Performance profilida yoki katta ma'lumotlarda sekinlashish kuzatiladi, lekin funksional xato yo'q.

## Sabab (100%)
`re.compile()` patternni ichki mashina kodiga aylantiradi. Bu operatsiya nisbatan qimmat. Agar pattern doimiy bo'lsa, uni tsikldan tashqarida bir marta compile qilib, compiled objectni tsikl ichida ishlatish kerak. Tsikl ichida compile qilish har iteratsiyada bir xil ishni qayta bajaradi.

## Tasdiqlash
1. Kodni o'qib, `re.compile` chaqiruvi tsikl tanasi ichida ekanini tekshiring.
2. Pattern o'zgaruvchisi tsikl ichida o'zgarmasligini tasdiqlang.
3. Agar performance shubhali bo'lsa, `timeit` yoki profiler bilan o'lchab ko'ring.

## Tuzatish (aynan shu)
Patternni tsikldan oldin bir marta compile qiling.

**Noto'g'ri:**
```python
import re

def process_lines(lines):
    results = []
    for line in lines:
        pattern = re.compile(r'\d+')  # har safar compile
        if pattern.search(line):
            results.append(line)
    return results
```

**To'g'ri:**
```python
import re

def process_lines(lines):
    pattern = re.compile(r'\d+')  # bir marta
    results = []
    for line in lines:
        if pattern.search(line):
            results.append(line)
    return results
```

Agar pattern dinamik bo'lsa (har iteratsiyada o'zgarsa), unda compile qilish o'rinli, lekin bu holat kam uchraydi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`re.compile()` ni doimiy pattern uchun tsikl ichida chaqirmang — bir marta tashqarida compile qiling va qayta ishlating. Bu oddiy, lekin sezilarli overheadni yo'qotadi.

---
name: python-built-large-list-in-memory-then-iterated-when-generator-or-iterator-would-suffice
description: When code builds a full list of potentially large data just to iterate once, use a generator expression or function to save memory and start processing sooner.
---

# PythonBuiltLargeListInMemoryThenIteratedWhenGeneratorOrIteratorWouldSuffice

## Nima uchun bu skill kerak
AI'lar ko'pincha "avval hamma natijani yig'ib, keyin ishlat" deb o'ylaydi. Katta ma'lumotda bu xotira sarfi yuqori bo'ladi va keraksiz kechikish yaratadi. Generatorlar yoki iteratorlar shu holatni hal qiladi.

## Simptom (aynan shu)
Kod quyidagicha yozilgan:
```python
results = []
for item in large_source:
    results.append(process(item))
for result in results:
    do_something(result)
```
yoki `list(comprehension)` faqat bir marta iteratsiya qilish uchun.

## Sabab (100%)
Model natijani "saqlash"ni xohlaydi yoki keyinroq qayta ishlatishni taxmin qiladi, lekin faqat bir marta o'tish kerak. Bu xotira va vaqtni isrof qiladi.

## Tasdiqlash
- To'liq ro'yxat yig'iladi, so'ngra bir marta for loopda ishlatiladi.
- Manba katta bo'lishi mumkin (fayl, API, DB).
- Natija faqat bir marta kerak, saqlash shart emas.

## Tuzatish (aynan shu)
Generator expression:
```python
for result in (process(item) for item in large_source):
    do_something(result)
```

Yoki generator function:
```python
def process_all(source):
    for item in source:
        yield process(item)

for result in process_all(large_source):
    do_something(result)
```

Agar haqiqatan ham ro'yxat kerak bo'lsa (qayta ishlatish, indeks, len), unda list qoldiring.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Bir marta o'tiladigan katta ma'lumot uchun avval to'liq list yig'mang. Generator yoki iterator ishlating — xotira tejaydi va ishlashni tezlashtiradi.

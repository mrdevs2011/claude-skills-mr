---
name: python-called-len-on-generator-or-iterator-causing-typeerror-or-consuming-iterator
description: TypeError when calling len() on a generator or iterator; convert to list only if length is truly needed, otherwise redesign to avoid len or use alternative counting.
---

# PythonCalledLenOnGeneratorOrIteratorCausingTypeErrorOrConsumingIterator

## Nima uchun bu skill kerak
AI'lar generator yoki iterator bilan ishlaganda ko'pincha uning uzunligini bilishni xohlaydi va `len()` chaqiradi. Bu doim TypeError beradi, chunki generatorlar `__len__`ni qo'llab-quvvatlamaydi. Ba'zan iteratorni oldindan yurib, keyin ishlatishga urinadi va u tugaydi.

## Simptom (aynan shu)
```python
def gen():
    yield 1
    yield 2

g = gen()
print(len(g))  # TypeError: object of type 'generator' has no len()
```
yoki:
```python
items = (x for x in large_iterable if condition(x))
count = len(items)  # xato
for item in items:  # endi bo'sh, chunki len() uni yuritdi (agar listga aylantirilgan bo'lsa)
    ...
```

## Sabab (100%)
Generator va iteratorlar lazy — ular uzunlikni oldindan bilmaydi. `len()` faqat sequence (list, tuple, str, range va h.k.) uchun ishlaydi. Model "nechta element bor" degan savolga to'g'ridan-to'g'ri len deb javob beradi, generator ekanligini unutadi.

## Tasdiqlash
- `len(generator_object)` yoki `len(iterator)` chaqirilgan.
- Traceback: `TypeError: object of type 'generator' has no len()` yoki shunga o'xshash.
- Keyingi iteratsiya bo'sh qolishi mumkin, agar oldindan yuritilgan bo'lsa.

## Tuzatish (aynan shu)
Agar uzunlik haqiqatan kerak bo'lsa va manba kichik bo'lsa:
```python
items = list(gen())  # yoki list(comprehension)
count = len(items)
for item in items:
    ...
```

Agar faqat sonini bilish kerak, lekin barcha elementlarni saqlash shart emas:
```python
count = sum(1 for _ in gen())
```

Yaxshiroq: uzunlikni umuman so'ramang. Generatorni bir marta yuriting va ishni o'sha yerda qiling. Agar ikki marta kerak bo'lsa — avval listga aylantiring yoki generatorni qayta yaratish imkonini bering.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Generator yoki iteratorga `len()` chaqirmang — TypeError chiqadi. Uzunlik kerak bo'lsa, avval `list()` qiling yoki `sum(1 for _ in ...)` ishlating. Eng yaxshisi — lazy qoldiring va bir marta o'ting.

---
name: python-used-str-join-on-non-string-elements-without-explicit-conversion-causing-typeerror
description: str.join() da string bo'lmagan elementlar bo'lganda TypeError chiqadi. Iterable ichidagi har bir element string bo'lishi shart.
---

# Python str.join non-string elementlarda TypeError

## Nima uchun bu skill kerak
Python'da `str.join()` faqat stringlardan iborat iterable qabul qiladi. List, tuple yoki generator ichida int, float, None yoki boshqa tip bo'lsa, darhol TypeError beradi. Bu eng keng tarqalgan "sequence item N: expected str instance" xatolaridan biri.

## Simptom (aynan shu)
```
TypeError: sequence item 0: expected str instance, int found
```
yoki
```
TypeError: sequence item 2: expected str instance, NoneType found
```
Kodda `",".join(some_list)` yoki `" ".join(generator)` ishlatilganda, va list ichida sonlar, None yoki boshqa string bo'lmagan qiymatlar bor.

## Sabab (100%)
`str.join()` ichki implementatsiyasi har bir elementni `str` tipida deb kutadi. Hech qanday avtomatik konvertatsiya qilmaydi. Element `str` bo'lmasa, darhol TypeError chiqaradi. Bu xavfsizlik va aniq tur tekshiruvi uchun ataylab shunday qilingan.

## Tasdiqlash
1. Xato matnida "expected str instance" borligini tekshir.
2. `join` chaqirilgan joyda iterable ichidagi elementlarni `print` yoki debugger bilan ko'r.
3. Agar elementlar `int`, `float`, `None`, `bool` yoki custom object bo'lsa — bu skill to'g'ri.

## Tuzatish (aynan shu)
Har bir elementni aniq `str()` bilan o'gir:

```python
# Noto'g'ri
numbers = [1, 2, 3, None]
result = ",".join(numbers)  # TypeError

# To'g'ri
result = ",".join(str(x) for x in numbers if x is not None)
# yoki None'larni ham saqlash kerak bo'lsa:
result = ",".join(str(x) if x is not None else "" for x in numbers)
```

Agar generator yoki katta iterable bo'lsa, `map(str, iterable)` ishlat:

```python
result = ",".join(map(str, numbers))
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`str.join()` hech qachon o'zi tipni o'girmaydi. Iterable ichidagi har bir element oldindan string bo'lishi kerak. `str()` yoki `map(str, ...)` bilan aniq konvertatsiya qil — shunda TypeError yo'qoladi.

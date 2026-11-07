---
name: python-used-multiple-isinstance-calls-instead-of-tuple
description: Python kodi if-elif zanjirida bir nechta alohida isinstance() chaqiruvlari ishlatilganda bitta isinstance(obj, (Type1, Type2)) o'rniga. Qachon: tur tekshiruvi kodi uzoq va takroriy bo'lib qolganda.
---

# Bir nechta alohida isinstance() o'rniga tuple ishlatish

## Nima uchun bu skill kerak
Kodda biror obyektning turini tekshirish uchun bir nechta `isinstance` chaqiruvlari ketma-ket `if-elif` da yozilganda kod uzun va o'qish qiyin bo'ladi. Python'da `isinstance` ikkinchi argument sifatida turlar tuple'ini qabul qiladi va bitta chaqiruvda bir nechta turga tekshiradi. Bu pattern'ni bilmaslik keraksiz kod takroriga olib keladi.

## Simptom (aynan shu)
Kodda quyidagiga o'xshash qatorlar ko'rinadi:
```python
if isinstance(value, str):
    ...
elif isinstance(value, int):
    ...
elif isinstance(value, float):
    ...
```
Yoki shunga o'xshash bir nechta alohida `isinstance` tekshiruvlari ketma-ket.

## Sabab (100%)
Dasturchi `isinstance` funksiyasining ikkinchi argumenti sifatida turlar tuple'ini qabul qilishini bilmaydi yoki esdan chiqaradi. Har bir tur uchun alohida chaqiruv yozadi.

## Tasdiqlash
1. Kodda bir xil obyekt uchun ketma-ket bir nechta `isinstance(obj, SomeType)` chaqiruvlari borligini tekshiring.
2. Ularning barchasi bir xil `obj` ga nisbatan ekanini va turlar bir-biriga mos (mutually exclusive yoki combined check) ekanini tasdiqlang.
3. Python hujjatlarida `isinstance(object, classinfo)` da `classinfo` tuple bo'lishi mumkinligini eslang.

## Tuzatish (aynan shu)
Alohida `if-elif` zanjirini bitta `isinstance` bilan almashtiring:

**Oldin:**
```python
if isinstance(value, str):
    process_string(value)
elif isinstance(value, int):
    process_number(value)
elif isinstance(value, float):
    process_number(value)
```

**Keyin:**
```python
if isinstance(value, str):
    process_string(value)
elif isinstance(value, (int, float)):
    process_number(value)
```

Yoki faqat tekshirish uchun:
```python
if isinstance(value, (str, int, float)):
    handle_supported(value)
else:
    raise TypeError("Unsupported type")
```

Bu qisqaroq, o'qilishi oson va bir xil ishlaydi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`isinstance` ikkinchi argument sifatida turlar tuple'ini qabul qiladi. Bir nechta tur uchun alohida chaqiruvlar o'rniga bitta `isinstance(obj, (Type1, Type2, ...))` ishlating — kod qisqaroq va aniqroq bo'ladi.

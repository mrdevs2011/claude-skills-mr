---
name: python-os-listdir-assumed-order
description: os.listdir() natijasini tartiblangan yoki barqaror deb taxmin qilib ishlatganda, tartib kafolatlanmagani uchun nostabil yoki flaky natijalar chiqishi.
---

# os.listdir() tartibini taxmin qilish nostabil natijalarga olib keladi

## Nima uchun bu skill kerak
Kodda `os.listdir()` yoki `pathlib.Path.iterdir()` natijasini to'g'ridan-to'g'ri ishlatib, fayllar alifbo tartibida yoki har safar bir xil tartibda kelishini kutiladi. Lekin tartib platforma va run'ga qarab o'zgaradi, testlar flaky bo'ladi, chiqish tartibi kutilmagan bo'ladi.

## Simptom (aynan shu)
- `for name in os.listdir(path):` yoki `list(os.listdir(path))` ishlatilganda fayllar kutilgan tartibda emas.
- Testlar ba'zan o'tadi, ba'zan fail (order-dependent assertion).
- Loglar, UI ro'yxati yoki output har safar boshqacha tartibda chiqadi.
- Hech qanday exception yo'q, lekin natija nostabil.

## Sabab (100%)
`os.listdir()` (va `Path.iterdir()`) tartibni kafolatlamaydi. U OS dan kelgan tartibni qaytaradi, bu alifbo bo'yicha yoki barqaror bo'lishi shart emas. Har qachon `sorted()` chaqirilmasa, tartib taxmin qilinmasligi kerak.

## Tasdiqlash
1. Kodda `os.listdir`, `os.scandir` yoki `Path.iterdir` ishlatilganini tekshir.
2. Natija to'g'ridan-to'g'ri loop yoki list'ga aylantirilganini, `sorted()` yo'qligini qara.
3. Bir necha marta ishga tushirib yoki boshqa OS/platformada tartib o'zgarishini kuzat.

## Tuzatish (aynan shu)
Har doim aniq tartib kerak bo'lsa `sorted()` ishlat:

```python
import os
from pathlib import Path

# Noto'g'ri
for name in os.listdir("data"):
    process(name)  # tartib kafolatlanmagan

# To'g'ri
for name in sorted(os.listdir("data")):
    process(name)  # alifbo tartibida barqaror

# Yoki pathlib bilan
for p in sorted(Path("data").iterdir(), key=lambda x: x.name):
    process(p)
```

Agar case-insensitive yoki maxsus tartib kerak bo'lsa, `key=` parametridan foydalan.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`os.listdir` tartibni saqlamaydi. Barqaror natija uchun har doim `sorted()` qo'llan. Taxmin qilma — aniq tartibni kodda belgilash kerak.

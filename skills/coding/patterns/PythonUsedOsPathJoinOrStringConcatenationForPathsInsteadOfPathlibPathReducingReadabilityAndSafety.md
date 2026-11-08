---
name: python-used-os-path-join-or-string-concatenation-for-paths-instead-of-pathlib-path-reducing-readability-and-safety
description: Fayl yo'llarini qurishda os.path.join yoki string concatenation ishlatilganda kod o'qilishi qiyinlashadi va platforma xavfsizligi kamayadi; pathlib.Path zanjirli metodlar va cross-platform ishonchlilik beradi.
---

# Yo'l qurishda os.path o'rniga pathlib.Path ishlatish

## Nima uchun bu skill kerak
Python 3.4+ da `pathlib` standart kutubxona sifatida yo'l operatsiyalarini obyektga yo'naltirilgan, o'qilishi oson va xavfsiz qiladi. `os.path` va string + operatsiyalari eski uslub bo'lib, xatoga moyil va kamroq ifodali.

## Simptom (aynan shu)
Kodda ko'p `os.path.join`, `os.path.exists`, string concatenation (`base + "/" + name`) yoki `os.sep` bilan qo'lda yo'l yig'ish. Platformalar o'rtasida slash muammolari, uzun ifodalar, metod zanjiri yo'qligi. Masalan, `os.path.join(os.path.dirname(__file__), "data", "file.txt")` o'rniga qisqa `Path(__file__).parent / "data" / "file.txt"`.

## Sabab (100%)
`os.path` funksiyalari string qaytaradi va har bir operatsiya alohida chaqiruv talab qiladi. `pathlib.Path` esa `/` operatorini qo'llab-quvvatlaydi, metodlar zanjirlanadi (`path.resolve().parent / "sub"`), va ichki platforma normalizatsiyasini bajaradi. String concatenation esa separator xatolari va escape muammolarini keltirib chiqaradi.

## Tasdiqlash
Kodni qidir: `os.path.join`, `os.path.abspath`, `+` bilan path qurish. Misol:

```python
import os
p = os.path.join(os.path.dirname(__file__), "subdir", "file.txt")
if os.path.exists(p):
    ...
```

Bu `Path` bilan qisqaroq va aniqroq.

## Tuzatish (aynan shu)
`pathlib.Path` ga o't:

```python
from pathlib import Path

p = Path(__file__).parent / "subdir" / "file.txt"
if p.exists():
    content = p.read_text(encoding="utf-8")
```

Yoki:

```python
data_dir = Path.home() / "project" / "data"
data_dir.mkdir(parents=True, exist_ok=True)
config = data_dir / "config.json"
```

`os.path` ni faqat eski kod yoki maxsus holatlarda saqla. Yangi kodda doim `Path`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Fayl yo'llari uchun `pathlib.Path` ishlat — u `/` bilan zanjirlanadi, o'qilishi oson, platforma xavfsiz va `os.path` dan zamonaviyroq. String concatenation va `os.path.join` o'rniga Path obyektlarini tanla.

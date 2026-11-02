---
name: python-os-mkdir-without-exist-ok
description: os.mkdir() yoki os.makedirs() exist_ok=True siz chaqiriladi, papka allaqachon mavjud bo'lsa FileExistsError chiqadi. Takror ishga tushirishda yoki mavjud papkada xato.
---

# os.mkdir() exist_ok=True siz — FileExistsError

## Nima uchun bu skill kerak
Python skriptlar papka yaratishda ko'pincha `os.mkdir()` yoki `os.makedirs()` ni hech qanday tekshiruvsiz chaqiradi. Birinchi marta ishlaydi, lekin keyingi ishga tushirishda yoki papka allaqachon mavjud bo'lsa (masalan, CI, takrorlanuvchi skript, yoki boshqa jarayon yaratgan) `FileExistsError` bilan yiqiladi. Bu oddiy, lekin keng tarqalgan xato.

## Simptom (aynan shu)
- Xato: `FileExistsError: [Errno 17] File exists: 'path/to/dir'`
- Yoki: `OSError: [Errno 17] File exists`
- Kod birinchi marta to'g'ri ishlaydi, keyingi marta (yoki parallel ishga tushirishda) yiqiladi.
- `os.path.exists()` tekshiruvi yo'q yoki noto'g'ri joyda.

## Sabab (100%)
`os.mkdir(path)` va `os.makedirs(path)` default holatda papka mavjud bo'lsa xato chiqaradi. `exist_ok=True` parametri berilmagan. Agent yoki dasturchi "papka yo'q deb" taxmin qiladi va qayta ishga tushirish holatini hisobga olmaydi.

## Tasdiqlash
1. Stack trace'dagi qatorni och — `os.mkdir` yoki `os.makedirs` chaqiruvi bormi?
2. O'sha chaqiruvda `exist_ok=True` argumenti bormi?
3. Papka haqiqatan mavjudligini tekshir: `os.path.exists(path) and os.path.isdir(path)`.
4. Agar chaqiruv `exist_ok` siz va papka bor bo'lsa — bu aynan shu xato.

## Tuzatish (aynan shu)
`exist_ok=True` qo'sh (Python 3.2+):

```python
import os

# XATO:
os.mkdir("output")
os.makedirs("data/subdir")

# TO'G'RI:
os.makedirs("output", exist_ok=True)
os.makedirs("data/subdir", exist_ok=True)
```

Agar eski Python yoki qo'shimcha logika kerak bo'lsa:

```python
import os

path = "output"
if not os.path.exists(path):
    os.makedirs(path)
# yoki try/except FileExistsError
```

`pathlib` ham ishlatish mumkin:

```python
from pathlib import Path
Path("output").mkdir(parents=True, exist_ok=True)
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `os.mkdir`/`os.makedirs` default holatda mavjud papkada FileExistsError chiqaradi.
- Har doim `exist_ok=True` yoki oldindan `exists` tekshiruvi ishlat.
- Bu oddiy qo'shimcha parametr takrorlanuvchi skriptlarni ishonchli qiladi.

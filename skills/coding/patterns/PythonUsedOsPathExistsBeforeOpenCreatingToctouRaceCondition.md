---
name: python-os-path-exists-before-open-toctou
description: Python kodda os.path.exists yoki os.path.isfile tekshiruvi keyin open() chaqirilgan — TOCTOU (time-of-check to time-of-use) race condition yuzaga keladi, fayl o'rtada o'chib ketishi yoki o'zgarishi mumkin.
---

# os.path.exists keyin open() — TOCTOU race condition

## Nima uchun bu skill kerak
Fayl mavjudligini tekshirish va keyin ochish oralig'ida boshqa jarayon faylni o'chirishi yoki o'zgartirishi mumkin. Bu race condition xatolarga, FileNotFoundError ga yoki noto'g'ri fayl o'qilishiga olib keladi. To'g'ri yo'l — try/except ishlatish.

## Simptom (aynan shu)
- Kodda `if os.path.exists(path):` yoki `if os.path.isfile(path):` keyin darhol `open(path)` yoki `Path(path).read_text()`.
- Ba'zan FileNotFoundError chiqadi, garchi tekshiruv o'tgan bo'lsa ham.
- Multi-process yoki concurrent muhitda ishlaganda tasodifiy xatolar.
- Loglarda "fayl mavjud edi, lekin ochib bo'lmadi" kabi xabarlar.

## Sabab (100%)
Check-then-act pattern: tekshiruv va ishlatish oralig'ida tizim holati o'zgarishi mumkin (TOCTOU). Python da fayl operatsiyalari atomic emas, shuning uchun exists + open xavfsiz emas.

## Tasdiqlash
1. `os.path.exists`, `os.path.isfile`, `Path.exists` ishlatilganmi?
2. Undan keyin to'g'ridan-to'g'ri `open()` yoki o'qish chaqirilganmi?
3. Agar ha — bu holat. Try/except yoki context manager bilan to'g'ridan-to'g'ri ochish kerak.

## Tuzatish (aynan shu)
Exists tekshiruvini olib tashla, to'g'ridan-to'g'ri open qil va FileNotFoundError ni tut.

Noto'g'ri:
```python
import os
if os.path.exists(path):
    with open(path) as f:
        data = f.read()
else:
    data = default
```

To'g'ri:
```python
try:
    with open(path) as f:
        data = f.read()
except FileNotFoundError:
    data = default
```

Agar Path ishlatilsa:
```python
from pathlib import Path
try:
    data = Path(path).read_text()
except FileNotFoundError:
    data = default
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Fayl mavjudligini oldindan tekshirish va keyin ochish TOCTOU race condition yaratadi. Doim try/except bilan to'g'ridan-to'g'ri ochish ishlat — bu xavfsizroq va qisqaroq.

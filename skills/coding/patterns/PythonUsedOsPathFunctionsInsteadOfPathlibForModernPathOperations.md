---
name: python-used-os-path-instead-of-pathlib
description: Kodda os.path funksiyalari (join, exists, isfile, dirname va h.k.) ishlatilgan, lekin pathlib.Path zamonaviy, o'qilishi osonroq va xavfsizroq alternativasi mavjud. Natijada kod eskirgan uslubda, platformaga bog'liqroq yoki zanjirlanishi qiyin bo'ladi.
---

# Python'da os.path o'rniga pathlib ishlatmaslik

## Nima uchun bu skill kerak
AI ko'pincha eskirgan misollardan yoki oddiy `os.path.join` dan foydalanadi. Python 3.4+ dan beri `pathlib` standart va tavsiya etiladi. os.path bilan ishlash qo'shimcha import, string manipulyatsiya va platforma farqlarini qo'lda boshqarishni talab qiladi. pathlib esa obyektga yo'naltirilgan, zanjirlash mumkin va xatolarni kamaytiradi.

## Simptom (aynan shu)
- `import os` va `os.path.join`, `os.path.exists`, `os.path.isfile`, `os.path.dirname`, `os.path.abspath` kabi chaqiruvlar.
- Pathlar string sifatida o'tkaziladi va qayta-qayta `os.path` funksiyalari bilan o'rab chiqiladi.
- Kodda `pathlib` import qilinmagan, lekin zamonaviy path operatsiyalari kerak.
- Platformalararo path (Windows `\` vs Unix `/`) bilan muammo yoki uzun `os.path` zanjirlari.

## Sabab (100%)
1. AI eski tutorial, StackOverflow yoki Python 2/3.3 misollaridan nusxa ko'chirgan.
2. `os.path` "tanishe" deb hisoblab, `pathlib`ni e'tibordan chetlashtirgan.
3. Pathni string sifatida qoldirishni afzal ko'rgan, chunki oddiy ko'rinadi.
4. Zanjirlash (`p.parent / "file.txt"`) o'rniga `os.path.join(os.path.dirname(...), ...)` yozgan.

## Tasdiqlash
1. Kodda `os.path.` qidiruvi qiling.
2. `from pathlib import Path` yoki `import pathlib` bor-yo'qligini tekshiring.
3. Path operatsiyalari (join, exists, is_file, parent, suffix) string + os.path bilan qilinganmi?
4. Agar ha — bu aynan shu holat.

## Tuzatish (aynan shu)
`pathlib.Path` ga o'ting:

```python
# Eski (os.path):
import os
base = "/tmp/data"
full = os.path.join(base, "subdir", "file.txt")
if os.path.exists(full) and os.path.isfile(full):
    print(os.path.dirname(full))

# Yangi (pathlib):
from pathlib import Path
base = Path("/tmp/data")
full = base / "subdir" / "file.txt"
if full.exists() and full.is_file():
    print(full.parent)
```

Qo'shimcha foydalar:
- `full.suffix`, `full.stem`, `full.with_suffix(".json")`
- `full.read_text(encoding="utf-8")` / `full.write_text(...)`
- `for p in base.glob("*.py"):` 

Platforma mustaqilligi va o'qilishi yaxshilanadi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python 3 da path ishlari uchun `pathlib.Path` ni afzal ko'ring. `os.path` faqat juda eski kod yoki maxsus holatlarda qoldiring. Bu kodni qisqaroq, xavfsizroq va zamonaviyroq qiladi.

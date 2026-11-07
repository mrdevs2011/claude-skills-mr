---
name: python-used-import-statement-inside-function-body-instead-of-module-level-causing-repeated-execution-overhead-and-reduced-readability
description: Funksiya ichida import qilish har chaqiriqda qayta bajariladi, overhead yaratadi va dependencylarni yashiradi. Module darajasida import qilish kerak, faqat circular import yoki optional dependency holatlarida ichkarida qoldirish mumkin.
---

# Funksiya ichida import o'rniga module darajasida import qilish

## Nima uchun bu skill kerak
Python da `import` statement funksiya ichida yozilsa, har safar funksiya chaqirilganda qayta bajariladi (sys.modules da bor bo'lsa ham lookup). Bu performance overhead, kodni o'qishni qiyinlashtiradi va barcha dependencylarni bir joyda ko'rishni imkonsiz qiladi.

## Simptom (aynan shu)
Funksiya sekin ishlaydi yoki ko'p marta chaqirilganda sezilarli overhead. Yoki kodni o'qiyotganda "qayerdan kelgan bu funksiya?" deb qidirish kerak bo'ladi, chunki import funksiya ichida yashiringan. Circular import xatolari yoki optional dependency holatlaridan tashqari.

## Sabab (100%)
Import statement har safar u joyga yetganda bajariladi. Module-level import bir marta (moduli yuklanganda) bajariladi va sys.modules cache ishlaydi. Funksiya ichidagi import esa har chaqiriqda qayta ishlanadi. Bundan tashqari, barcha importlarni tepada ko'rish dependencylarni aniq qiladi.

## Tasdiqlash
Kodni skanerlab `def ...:` ichida `import` yoki `from ... import` qidir. Agar circular import yoki try/except optional dependency bo'lmasa, noto'g'ri. Test: funksiyani 10000 marta chaqirib vaqtni o'lchash — module-level bilan solishtir.

```python
import time
def test():
    import json  # noto'g'ri
    return json.dumps({})

start = time.time()
for _ in range(100000):
    test()
print(time.time() - start)
```

## Tuzatish (aynan shu)
Barcha importlarni fayl tepasiga (module level) o'tkaz. Faqat quyidagi holatlarda funksiya ichida qoldir:

- Circular importni oldini olish uchun (lekin avval architecture ni tuzatish yaxshiroq)
- Optional dependency (try/except bilan)

```python
# Noto'g'ri
def process_data(data):
    import json
    import pathlib
    return json.dumps(pathlib.Path("x").read_text())

# To'g'ri
import json
from pathlib import Path

def process_data(data):
    return json.dumps(Path("x").read_text())
```

Agar optional bo'lsa:

```python
def optional_feature():
    try:
        import some_optional_lib
    except ImportError:
        return fallback()
    return some_optional_lib.do()
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Importlarni doim module darajasida yoz. Funksiya ichidagi import faqat circular yoki optional dependency uchun. Bu overheadni yo'qotadi, kodni toza va dependencylarni aniq qiladi.

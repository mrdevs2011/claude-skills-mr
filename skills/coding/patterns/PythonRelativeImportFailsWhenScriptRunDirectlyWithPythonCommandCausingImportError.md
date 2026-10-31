---
name: python-relative-import-fails-when-script-run-directly
description: Skript relative import (from .module import foo) ishlatadi, lekin `python script.py` bilan to'g'ridan-to'g'ri ishga tushirilganda ImportError: attempted relative import with no known parent package chiqadi.
---

# Python Relative Import Skript To'g'ridan-to'g'ri Ishga Tushirilganda Muvaffaqiyatsiz

## Nima uchun bu skill kerak
AI yoki dasturchi paket ichidagi faylda `from .sibling import func` yozadi. Bu modul sifatida ishga tushirilganda ishlaydi, lekin foydalanuvchi yoki CI `python path/to/script.py` bilan to'g'ridan-to'g'ri chaqirganda relative import ishlamaydi. Natijada ImportError chiqadi va skript umuman ishga tushmaydi. Bu oddiy import xatosi emas — aynan relative + __name__ == "__main__" holati.

## Simptom (aynan shu)
- Xato matni: `ImportError: attempted relative import with no known parent package`
- Yoki: `ImportError: attempted relative import beyond top-level package`
- Fayl ichida `from .module import ...` yoki `from ..package import ...` bor
- `python script.py` yoki `python -m` emas, to'g'ridan-to'g'ri ishga tushirilgan
- Xuddi shu kod `python -m package.script` bilan ishlaydi

## Sabab (100%)
Relative import faqat paket konteksti mavjud bo'lganda ishlaydi. Skript to'g'ridan-to'g'ri ishga tushirilganda Python uni top-level deb hisoblaydi (`__name__ == "__main__"`), parent package yo'q, shuning uchun `.` yoki `..` importlar muvaffaqiyatsiz. Absolute import yoki `python -m` bilan ishga tushirish kerak.

## Tasdiqlash
1. Xato matnida "relative import" va "no known parent package" so'zlari bormi?
2. Kodda `from .` yoki `from ..` bormi?
3. Ishga tushirish buyrug'i `python file.py` mi, `python -m` emasmi?
4. `if __name__ == "__main__":` blokida relative import ishlatilganmi?

## Tuzatish (aynan shu)
Ikki yo'l:

1. **Tavsiya etilgan**: skriptni modul sifatida ishga tushir:
```bash
python -m package_name.script_name
```

2. Yoki relative importni absolute ga o'zgartir yoki shartli qil:
```python
try:
    from .sibling import helper
except ImportError:
    # to'g'ridan-to'g'ri ishga tushirilganda
    from sibling import helper

# yoki doim absolute:
from package_name.sibling import helper
```

Agar skript asosiy entry point bo'lsa, `if __name__ == "__main__"` ichida relative import qilma, absolute ishlat yoki alohida main funksiyani chaqir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Relative import (`from .xxx`) faqat paket ichida ishlaydi. Skriptni `python file.py` bilan ishga tushirsang, ImportError chiqadi. Doim `python -m` ishlat yoki absolute importga o't. Bu xato matnini ko'rsang, darhol shu sabab va tuzatishni qo'lla.

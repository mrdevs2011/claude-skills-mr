---
name: python-used-os-remove-or-unlink-without-existence-check-or-missing-ok-causing-file-not-found-error
description: os.remove() yoki Path.unlink() fayl mavjud bo'lmasa FileNotFoundError chiqaradi. missing_ok=True yoki existence tekshiruvi ishlatish kerak.
---

# Faylni o'chirishda FileNotFoundError oldini olish

## Nima uchun bu skill kerak
Kodda faylni o'chirishga urinilganda, agar fayl allaqachon yo'q bo'lsa yoki parallel process o'chirgan bo'lsa, `FileNotFoundError` (yoki `OSError`) chiqadi va dastur to'xtaydi. Bu keng tarqalgan, lekin oson oldini olinadigan xato.

## Simptom (aynan shu)
```
FileNotFoundError: [Errno 2] No such file or directory: 'temp.txt'
```
yoki `Path.unlink()` chaqirilganda shu xato. Kod ba'zan ishlaydi (fayl bor), ba'zan crash qiladi (fayl yo'q).

## Sabab (100%)
`os.remove(path)` va `pathlib.Path.unlink()` default ravishda fayl mavjud bo'lishini talab qiladi. Agar yo'q bo'lsa, exception ko'taradi. Bu xavfsiz "o'chir, bo'lmasa hech narsa qilma" semantikani bermaydi.

## Tasdiqlash
Kodda `os.remove(`, `os.unlink(`, `.unlink(` qidiring. Atrofida `os.path.exists` yoki `missing_ok` yo'qligini tekshiring. Test:

```python
import os
from pathlib import Path

os.remove("nonexistent.txt")  # FileNotFoundError
```

## Tuzatish (aynan shu)
Zamonaviy Python (3.8+) da `missing_ok=True` ishlat:

```python
from pathlib import Path

# To'g'ri — fayl yo'q bo'lsa ham xato bermaydi
Path("temp.txt").unlink(missing_ok=True)
```

Eski usul yoki aniq tekshiruv kerak bo'lsa:

```python
import os

path = "temp.txt"
if os.path.exists(path):
    os.remove(path)
```

Yoki `contextlib.suppress`:

```python
import os
from contextlib import suppress

with suppress(FileNotFoundError):
    os.remove("temp.txt")
```

`missing_ok=True` eng toza va tavsiya etiladi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Faylni o'chirishda har doim `Path.unlink(missing_ok=True)` ishlat yoki existence tekshir. Aks holda FileNotFoundError chiqadi va kod nozik holatlarda sinadi.

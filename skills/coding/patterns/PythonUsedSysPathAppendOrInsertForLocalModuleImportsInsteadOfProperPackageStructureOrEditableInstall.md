---
name: python-sys-path-append-for-local-imports
description: Python kodida local modullarni import qilish uchun sys.path.append() yoki sys.path.insert() ishlatilgan — bu muhitga bog'liq, fragile va noto'g'ri package tuzilmasini yashiradi.
---

# sys.path.append bilan local importlar

## Nima uchun bu skill kerak
AI yoki dasturchi tezlik uchun `sys.path.append(os.path.dirname(__file__))` yoki shunga o'xshash qator qo'shib, yon-yon papkadagi modulni import qiladi. Bu ishlaydi, lekin:

- Har xil ishga tushirish usulida (script, pytest, uvicorn, package) buziladi
- Relative importlar o'rniga absolute qilishni majbur qiladi
- Editable install yoki to'g'ri package tuzilmasi o'rniga hack ishlatadi
- CI, Docker, boshqa jamoa a'zolarida muammo chiqaradi

Bu sof debugging emas — kod patterni va maintainability muammosi.

## Simptom (aynan shu)
- Fayl boshida `import sys` va `sys.path.append(...)` yoki `sys.path.insert(0, ...)` bor
- Keyin `from my_local_module import something` ishlaydi
- Lekin `python -m`, pytest, yoki boshqa papkadan ishga tushirilganda `ModuleNotFoundError`
- Yoki `PYTHONPATH` sozlamasiga bog'liq
- Relative import (`from .sibling import`) o'rniga shu hack ishlatilgan

## Sabab (100%)
To'g'ri Python package tuzilmasi (package papkasi + `__init__.py` yoki pyproject.toml) yoki `pip install -e .` (editable install) o'rniga tez vaqtinchalik yechim sifatida `sys.path` manipulyatsiyasi qilingan. AI "import ishlasin" deb shu klassik anti-patternni yozgan.

## Tasdiqlash
1. Kodda `sys.path.append` yoki `sys.path.insert` qidir (`grep -n "sys.path" *.py`).
2. U local papka yoki `__file__` asosida ekanini tekshir.
3. `pyproject.toml` / `setup.py` yo'q yoki package sifatida o'rnatilmaganmi?
4. Relative import ishlamasa yoki ishlatilmaganmi?
5. Agar ha — bu aynan shu holat.

## Tuzatish (aynan shu)
`sys.path` hackini olib tashla. To'g'ri yo'llardan birini tanla:

### 1. Relative import (eng oddiy, bir package ichida)
```python
# XATO:
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from helper import process  # sibling module

# TO'G'RI (package ichida):
from .helper import process
# yoki
from . import helper
```
Fayl package ichida bo'lishi va `__init__.py` (yoki namespace) bo'lishi kerak. `python -m package.module` bilan ishga tushir.

### 2. Editable install (loyiha uchun eng yaxshisi)
```bash
# pyproject.toml yarat (yoki setup.py):
# [build-system]
# requires = ["setuptools>=61"]
# build-backend = "setuptools.build_meta"
#
# [project]
# name = "myproject"
# version = "0.1.0"

pip install -e .
```
Keyin har qanday joydan `from myproject.helper import process` ishlaydi. `sys.path` kerak emas.

### 3. PYTHONPATH (vaqtincha, lekin aniq)
```bash
export PYTHONPATH="${PYTHONPATH}:/path/to/project"
```
Lekin commitga kiritma — faqat lokal.

**Hech qachon** production yoki shared kodda `sys.path.append` qoldirma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `sys.path.append` — fragile hack, package tuzilmasini yashiradi
- Relative import yoki `pip install -e .` ishlat
- Bu pattern kodni turli muhitlarda ishonchsiz qiladi

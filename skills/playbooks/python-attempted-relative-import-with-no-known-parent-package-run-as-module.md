---
name: python-attempted-relative-import-with-no-known-parent-package-run-as-module
description: ImportError "attempted relative import with no known parent package" when running a package file directly with python file.py. Fix by running as module with python -m or switching to absolute imports.
id: python-attempted-relative-import-with-no-known-parent-package-run-as-module
type: playbook
stack: Python 3.10.21
confirmed_on: 2026-11-15
confidence: high (reproduced in sandbox + official docs)
triggers:
  - attempted relative import with no known parent package
  - ImportError: attempted relative import with no known parent package
  - relative import no known parent
  - from . import fails when python script.py
  - python -m package.module works but python file.py fails
  - relative import beyond top-level package
  - __package__ is None relative import
  - run package script as module not file
  - ImportError relative import parent package
related:
  - python-attributeerror-or-importerror-partially-initialized-module-circular-import
  - coding/patterns/PythonRelativeImportFailsWhenScriptRunDirectlyWithPythonCommandCausingImportError
---

# ImportError: attempted relative import with no known parent package — python -m yoki absolute import ishlat

## TL;DR
Simptom: `python pkg/main.py` da `ImportError: attempted relative import with no known parent package` (from .mod import ...).
Sabab: Fayl to'g'ridan-to'g'ri ishga tushirilganda __name__="__main__", __package__=None, relative import ishlamaydi.
Birinchi buyruq: `python -m pkg.main` (pkg papkasining parentidan).
Done: "foo" yoki kutilgan chiqish chiqadi, xato yo'q.

## Qachon ishlatish / ishlatmaslik
Ishlat: aniq "attempted relative import with no known parent package" yoki "beyond top-level package" xatosi, va kodda from . yoki from .. bor, python file.py bilan ishga tushirilgan.
Ishlatma: oddiy ModuleNotFoundError, absolute import xatosi, yoki circular import (alohida skill).

## Mental model (nima uchun)
[SRC:https://docs.python.org/3/reference/import.html#package-relative-imports @ 3.10+ 2026-11] Relative import (from .mod import) faqat joriy modul paket ichida bo'lganda ishlaydi — __package__ o'rnatilgan bo'lishi kerak. To'g'ridan-to'g'ri `python path/to/file.py` ishga tushirilganda modul __main__ sifatida yuklanadi, parent package noma'lum. [SRC:https://docs.python.org/3/reference/import.html#special-considerations-for-main] Main modul har doim absolute import ishlatishi kerak. `python -m package.module` paket kontekstini beradi. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini to'liq o'qi.
   EXPECTED: "attempted relative import with no known parent package". Agar "beyond top-level package" bo'lsa — bir xil sabab. Boshqa ImportError — bu skill emas.

2. Ishga tushirish usulini tekshir.
   ```bash
   python pkg/main.py
   ```
   EXPECTED: ImportError. Keyin:
   ```bash
   python -m pkg.main
   ```
   EXPECTED: muvaffaqiyat (chiqish chiqadi). Agar -m ham xato bersa — boshqa muammo (missing __init__.py, path).

3. Kodda relative bormi?
   ```bash
   grep -n "from \." pkg/main.py
   ```
   EXPECTED: from .mod import ... ko'rinadi.

4. __package__ ni ko'r.
   ```bash
   python -c "import pkg.main; print(pkg.main.__package__)"
   ```
   EXPECTED: 'pkg' yoki shunga o'xshash. To'g'ridan-to'g'ri run da None.

## Fix har bir sabab uchun
Sabab 1 (to'g'ridan-to'g'ri file.py run): modul sifatida ishga tushir. Parent papkadan:
```bash
python -m pkg.main
```
Tekshir: chiqish chiqadi, xato yo'q. [SANDBOX]

Sabab 2 (absolute qilish kerak): relative ni absolute ga o'zgartir.
```python
# oldin: from .mod import foo
from pkg.mod import foo
foo()
```
Yoki main scriptni paket tashqarisiga chiqar. Tekshir: `python pkg/main.py` endi ishlaydi.

## Agentlar qayerda xato qiladi
1. `sys.path` ga papkani qo'shib, relative ni ishlatishga urinadi — ishlamaydi, chunki __package__ baribir None.
2. if __name__ == "__main__" ichida relative import qoldiradi.
3. `python -m pkg.main.py` deb yozadi (.py qo'yib) — ModuleNotFoundError.
4. Eski skilldagi qisqa tavsifni o'qib, diagnosis tree'ni e'tiborsiz qoldiradi.

## Edge cases
1. Namespace package (__init__.py yo'q, Python 3.3+): baribir `python -m` ishlaydi. [SANDBOX]
2. Nested package (from ..): python -m parent.sub.module. Beyond top-level — package strukturasini tekshir. [not fully verified for deep nest]

## Done criteria
```bash
cd /tmp/relimport_test
python -m pkg.main
```
EXPECTED: foo (yoki kutilgan). `python pkg/main.py` xato berishi kerak (yoki absolute qilingan bo'lsa ishlaydi).

## Agar hali ham xato
- Traceback to'liq o'qi, boshqa import xatosimi (ModuleNotFound, circular).
- `python -c "import pkg; print(pkg.__path__)"` bilan paket topiladimi.
- PYTHONPATH ni tekshir.

## Sources + confidence
- [SRC:https://docs.python.org/3/reference/import.html#package-relative-imports 2026-11] relative requires package context.
- [SRC:https://docs.python.org/3/reference/import.html#special-considerations-for-main] __main__ uses absolute.
- [SANDBOX] reproduced: python pkg/main.py → ImportError; python -m pkg.main → foo. Python 3.10.21.
- Confidence: high. Old short skill exists in coding/patterns/, this is the detailed diagnosis version.

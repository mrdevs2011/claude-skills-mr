---
name: python-forgot-exist-ok-or-parents-true-mkdir
description: Python'da papka yaratishda Path.mkdir(exist_ok=True, parents=True) yoki os.makedirs(..., exist_ok=True) o'rniga oddiy mkdir ishlatish — qayta ishga tushirishda FileExistsError yoki papka yo'q bo'lsa xato.
---

# PythonForgotExistOkOrParentsTrueWhenCreatingDirectoriesCausingFileExistsErrorOnRerun

## Nima uchun bu skill kerak
Skriptlar va agentlar ko'pincha ishchi papka, log, cache yoki output papkalarini yaratadi. Agar `exist_ok` va `parents` parametrlari qo'yilmasa, birinchi marta ishlaydi, lekin qayta ishga tushirilganda (yoki parallel jarayonlarda) FileExistsError chiqadi yoki oraliq papkalar yo'qligi sababli xato beradi. Bu ayniqsa takroriy vazifalar, CI, agent workflow'larda muammo.

## Simptom (aynan shu)
- `FileExistsError: [Errno 17] File exists: 'path/to/dir'`
- `FileNotFoundError` chunki parent papka yaratilmagan (`parents=True` yo'q)
- Skript birinchi marta ishlaydi, ikkinchi marta (yoki restart) xato bilan to'xtaydi
- `os.mkdir(path)` yoki `Path(path).mkdir()` exist_ok=False (default) bilan
- Qayta ishlatiladigan tool yoki skill generatsiya skriptida papka yaratish qismi

## Sabab (100%)
`os.mkdir` va `pathlib.Path.mkdir` default ravishda `exist_ok=False`. Agar papka allaqachon mavjud bo'lsa, xato chiqaradi. `parents=True` bo'lmasa, oraliq papkalar avtomatik yaratilmaydi. Agent "bir marta yaratdim, keyin boradi" deb o'ylaydi va idempotent (qayta ishlatiladigan) kod yozmaydi.

## Tasdiqlash
1. Kodda `mkdir`, `makedirs`, `Path.mkdir` borligini qidir.
2. `exist_ok=True` yoki `exist_ok=True, parents=True` bor-yo'qligini tekshir.
3. Papka oldindan mavjud holatda skriptni qayta ishga tushirib ko'r — xato chiqadimi?
4. `os.path.exists` bilan qo'lda tekshirib, faqat yo'q bo'lsa yaratish pattern ishlatilganmi (bu ham race conditionga olib kelishi mumkin)?

## Tuzatish (aynan shu)
Har doim idempotent papka yaratishdan foydalan:

```python
from pathlib import Path

# Eng yaxshi usul — pathlib
output_dir = Path("/workspace/artifacts/output")
output_dir.mkdir(parents=True, exist_ok=True)

# Yoki os
import os
os.makedirs("/workspace/artifacts/output", exist_ok=True)
```

Qoidalar:
- `parents=True` — oraliq papkalar ham yaratilsin.
- `exist_ok=True` — allaqachon bor bo'lsa jim o'tsin, xato bermasin.
- Race condition bo'lishi mumkin bo'lgan parallel holatlarda ham bu yetarli (OS darajasida handle qilinadi).
- Qo'lda `if not exists: mkdir` yozma — race condition xavfi bor.

Agar papka ichidagi fayllarni tozalash kerak bo'lsa, alohida qil (mkdir dan oldin yoki keyin).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Papka yaratishda doim `mkdir(parents=True, exist_ok=True)` yoki `os.makedirs(..., exist_ok=True)` ishlat. Bu skriptni qayta ishga tushirishda FileExistsError chiqishini oldini oladi va kodni idempotent qiladi.

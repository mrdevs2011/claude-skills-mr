---
name: hardcoded-file-paths-instead-of-pathlib-or-os-path-join
description: Kodda absolute yoki relative fayl yo'llari string sifatida hardcode qilingan (masalan "/tmp/foo" yoki "data/file.txt") — platformaga bog'liq, separator xato, yoki o'zgartirish qiyin. pathlib yoki os.path.join ishlatilmagan.
---

# Hardcoded fayl yo'llari pathlib yoki os.path.join o'rniga

## Nima uchun bu skill kerak
Agentlar tez-tez fayl yo'llarini to'g'ridan-to'g'ri string sifatida yozib qo'yadi (`"/home/user/data/file.csv"`, `"data\\file.txt"`, `"./output/" + name`). Bu Linux/Windows farqida `\ /` separator xatosi beradi, absolute path boshqa mashinada ishlamaydi, va yo'l o'zgarganda barcha joylarni qidirib tuzatish kerak. `pathlib.Path` yoki `os.path.join` ishlatish cross-platform va maintainable qiladi.

## Simptom (aynan shu)
- Kodda `"/"`, `"\\"`, yoki `+` bilan fayl yo'li string yig'ilgan.
- Absolute path (`/tmp/`, `C:\\`, `/home/`) yoki hardcoded relative path bor.
- `open("data/file.txt")` yoki `Path("/fixed/path")` kabi joylar.
- Turli OS da ishlatilganda `FileNotFoundError` yoki noto'g'ri separator.
- Yo'lni o'zgartirish kerak bo'lganda bir necha faylda string qidirish kerak.

## Sabab (100%)
Tez yozish uchun agent yo'lni joyida string qoldiradi. `pathlib` yoki `os.path` ni "ortiqcha" deb hisoblaydi yoki umuman eslamaydi. Bu portability va DRY ni buzadi.

## Tasdiqlash
1. Kodda `"/"`, `"\\"`, `os.sep` yoki `+`/`f-string` bilan path yig'ilgan joylarni qidir: `grep -nE '["\'].*[\\/].*["\']' *.py` yoki shunga o'xshash.
2. `pathlib` yoki `os.path.join` import qilinganmi? Yo'q bo'lsa — ehtimol hardcoded.
3. Absolute path bormi (`/` yoki drive letter bilan boshlanadigan)?
4. Turli separator yoki OS da sinab ko'rish mumkinmi?

## Tuzatish (aynan shu)
Hardcoded string o'rniga `pathlib.Path` (tavsiya etiladi, Python 3.6+) yoki `os.path.join` ishlat:

```python
# Noto'g'ri:
data_path = "/tmp/output/" + filename
with open("data/files/" + name + ".csv") as f:
    ...
config = open("/home/user/app/config.json")

# To'g'ri (pathlib):
from pathlib import Path

BASE = Path("/tmp/output")          # yoki Path.cwd() / "output"
data_path = BASE / filename
with (Path("data") / "files" / f"{name}.csv").open() as f:
    ...
config = (Path.home() / "app" / "config.json").open()

# Yoki os.path (eski kod uchun):
import os
data_path = os.path.join("/tmp/output", filename)
with open(os.path.join("data", "files", name + ".csv")) as f:
    ...
```

Qoidalar:
- `Path / "subdir" / name` operator ishlat — separator avtomatik to'g'ri.
- Absolute path kerak bo'lsa ham `Path` bilan yig', string concat emas.
- `Path.cwd()`, `Path.home()`, `Path(__file__).parent` kabi base ishlat.
- Windows va Linux da bir xil kod ishlashi kerak.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Hardcoded string path o'rniga `pathlib.Path` yoki `os.path.join` ishlat.
- Bu cross-platform bo'ladi va separator/absolute path xatolarini oldini oladi.
- Yo'l o'zgarganda faqat base Path ni yangilash yetarli.

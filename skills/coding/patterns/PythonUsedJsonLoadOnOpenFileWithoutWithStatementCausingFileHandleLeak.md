---
name: python-used-json-load-on-open-file-without-with-statement-causing-file-handle-leak
description: `json.load(open(path))` ishlatilganda fayl handle yopilmaydi va resource leak yuz beradi; `with open(...) as f: json.load(f)` ishlatish kerak.
---

# JSON.load da context manager ishlatmaslik

## Nima uchun bu skill kerak
`json.load()` fayl obyektini o'qiydi, lekin agar `open()` `with` bilan o'ralmasa, fayl yopilmaydi. Exception yoki erta return bo'lsa, file descriptor leak bo'ladi, ayniqsa ko'p fayl o'qilganda yoki long-running processda.

## Simptom (aynan shu)
Kod ishlaydi, lekin vaqt o'tishi bilan "too many open files" xatosi chiqadi. Yoki `lsof` / resource monitoring da ochiq fayllar soni oshib boradi. Exception bo'lganda fayl yopilmay qoladi.

## Sabab (100%)
`open(path)` fayl descriptor ochadi. `json.load(f)` uni o'qiydi, lekin yopmaydi. Context manager (`with`) `__exit__` da avtomatik `close()` chaqiradi, hatto exception bo'lsa ham. Oddiy `open` + `load` esa faqat normal yo'lda yopiladi (agar close() chaqirilsa).

## Tasdiqlash
Kodda `json.load(open(` qidir. Yoki `f = open(...); data = json.load(f)` va `f.close()` yo'qligini tekshir. Test:

```python
import json
# Leak misoli (yopilmaydi)
data = json.load(open("config.json"))
# To'g'ri
with open("config.json") as f:
    data = json.load(f)
```

## Tuzatish (aynan shu)
Doim `with` ishlat:

```python
import json

# Noto'g'ri — leak
config = json.load(open("settings.json"))

# To'g'ri
with open("settings.json", encoding="utf-8") as f:
    config = json.load(f)

# Agar pathlib
from pathlib import Path
with Path("settings.json").open(encoding="utf-8") as f:
    config = json.load(f)
```

`encoding` ni ham aniq ber — default platformaga bog'liq.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`json.load(open(...))` faylni yopmaydi. Har doim `with open(...) as f: json.load(f)` ishlat — resource leak yo'q, exception-safe, toza kod.

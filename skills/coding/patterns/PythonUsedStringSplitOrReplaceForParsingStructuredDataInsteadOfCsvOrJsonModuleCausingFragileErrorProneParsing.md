---
name: python-string-split-replace-for-parsing-structured-data
description: Python kodida CSV, JSON yoki boshqa tuzilgan ma'lumotni oddiy str.split, replace yoki strip bilan parse qilish — noto'g'ri, xavfli va edge-case'larga chidamsiz.
---

# Tuzilgan ma'lumotni string split/replace bilan parse qilish

## Nima uchun bu skill kerak
Agent yoki dasturchi CSV, JSON, key-value yoki oddiy tuzilgan matnni `str.split(',')`, `.replace()` yoki manual slicing bilan parse qiladi. Bu oddiy holatlarda ishlaydi, lekin quote ichidagi vergul, escape, bo'sh qator, turli delimiter yoki malformed inputda buziladi. Natija: silent wrong data yoki crash.

## Simptom (aynan shu)
- Kodda `line.split(',')` yoki `text.replace('"', '')` kabi manual parsing bor.
- Input CSV/JSON yoki shunga o'xshash tuzilgan (header, quoted fields, nested).
- Edge case'da noto'g'ri fieldlar, missing values yoki exception.
- `csv` yoki `json` moduli ishlatilmagan.

## Sabab (100%)
"Oddiy split yetarli" degan taxmin. Tuzilgan formatning qoidalarini (quoting, escaping, whitespace) e'tiborsiz qoldirish. Built-in parserlarni bilmaslik yoki "tezroq" deb hisoblash.

## Tasdiqlash
1. Parsing qilinayotgan matn tuzilgan formatdami (CSV, JSON, TSV, key=value)?
2. `split`, `replace`, `strip`, index slicing ishlatilganmi?
3. `import csv` yoki `import json` bormi va `csv.reader` / `json.loads` chaqirilganmi?
4. Agar manual string usuli + tuzilgan input — bu holat.

## Tuzatish (aynan shu)
Har doim tegishli modulni ishlat:

```python
import csv
import json
from io import StringIO

# CSV uchun
def parse_csv(text: str) -> list[dict]:
    reader = csv.DictReader(StringIO(text))
    return list(reader)

# JSON uchun
def parse_json(text: str) -> dict | list:
    return json.loads(text)

# Oddiy key=value uchun ham to'g'ri usul
# (agar murakkab bo'lsa configparser yoki shunga o'xshash)
```

Noto'g'ri misol:
```python
parts = line.split(',')          # quote ichidagi vergulni buzadi
cleaned = text.replace('"', '')  # escape va nested'ni buzadi
```

To'g'ri: yuqoridagi `csv` / `json` usuli. Inputni avval validate qil yoki try/except bilan o'rab ol.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Tuzilgan ma'lumotni (CSV, JSON va h.k.) hech qachon oddiy string split/replace bilan parse qilma. Har doim `csv`, `json` yoki tegishli parser modulini ishlat — bu quoting, escaping va edge-case'larni to'g'ri boshqaradi va xatolarni kamaytiradi.

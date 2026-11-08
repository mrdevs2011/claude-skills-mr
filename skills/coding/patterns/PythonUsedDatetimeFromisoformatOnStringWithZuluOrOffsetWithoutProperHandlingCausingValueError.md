---
name: python-datetime-fromisoformat-zulu-or-offset-valueerror
description: datetime.fromisoformat() ValueError chiqadi — ISO-like stringda 'Z' yoki timezone offset bor, lekin Python 3.7-3.10 da fromisoformat 'Z'ni qabul qilmaydi yoki format to'g'ri emas.
---

# datetime.fromisoformat Zulu yoki offset stringda ValueError

## Nima uchun bu skill kerak
AI kod yozganda API yoki loglardan kelgan ISO 8601 stringlarni (masalan "2026-11-09T04:01:00Z" yoki "2026-11-09T04:01:00+00:00") to'g'ridan-to'g'ri `datetime.fromisoformat()` bilan parse qiladi. Python 3.11 dan oldin `fromisoformat` "Z" (Zulu) ni qo'llab-quvvatlamaydi va ba'zi offset formatlarida ValueError beradi. Bu eng ko'p uchraydigan datetime parse xatolaridan biri.

## Simptom (aynan shu)
- Xato: `ValueError: Invalid isoformat string: '2026-11-09T04:01:00Z'`
- Yoki: `ValueError: Invalid isoformat string` offsetli stringda
- Kod ishlaydi faqat Python 3.11+ da, lekin CI yoki boshqa muhitda (3.8-3.10) yiqiladi
- String `Z` bilan tugaydi yoki `+00:00` / `-05:00` kabi offset bor

## Sabab (100%)
1. `datetime.fromisoformat()` Python 3.7-3.10 da faqat `YYYY-MM-DDTHH:MM:SS[.ffffff][+HH:MM[:SS]]` formatini qabul qiladi — `Z` ni tushunmaydi.
2. AI "bu ISO, fromisoformat ishlaydi" deb taxmin qilgan, versiya farqini hisobga olmagan.
3. `dateutil.parser` yoki `Z` ni `+00:00` ga almashtirish qilinmagan.

## Tasdiqlash
1. Xato xabarida `Invalid isoformat string` va string oxirida `Z` yoki offset bormi?
2. `python --version` 3.11 dan pastmi?
3. Kodda `datetime.fromisoformat(some_string)` chaqirilganmi?
4. Agar string `Z` bilan tugasa — shu sabab.

## Tuzatish (aynan shu)
```python
from datetime import datetime

def parse_iso(s: str) -> datetime:
    # Zulu (Z) ni +00:00 ga almashtirish (3.10 va undan past uchun)
    if s.endswith("Z"):
        s = s[:-1] + "+00:00"
    return datetime.fromisoformat(s)

# Misol:
dt = parse_iso("2026-11-09T04:01:00Z")
print(dt)  # 2026-11-09 04:01:00+00:00
```

Yoki `python-dateutil` ishlatish (versiyadan mustaqil):
```bash
pip install python-dateutil
```
```python
from dateutil import parser
dt = parser.isoparse("2026-11-09T04:01:00Z")
```

Python 3.11+ da `fromisoformat` `Z` ni qo'llab-quvvatlaydi, lekin portable kod uchun almashtirish yoki dateutil ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `datetime.fromisoformat` Python <3.11 da `Z` ni qabul qilmaydi va ValueError beradi.
- Tuzatish: `Z` ni `+00:00` ga almashtirish yoki `dateutil.parser.isoparse` ishlatish.
- API datetime stringlarini parse qilganda versiya va formatni har doim tekshir.

---
name: python-used-datetime-now-without-timezone-creating-naive-datetime
description: Python datetime.now() ishlatilganda timezone berilmasa naive datetime yaratiladi — keyin aware datetime bilan solishtirishda TypeError yoki noto'g'ri vaqt hisoblari chiqadi.
---

# Python datetime.now() timezone siz — naive datetime

## Nima uchun bu skill kerak
AI ko'pincha `datetime.now()` yoki `datetime.utcnow()` yozadi, timezone ni unutadi. Natijada naive datetime hosil bo'ladi. Keyinchalik timezone-aware obyekt bilan solishtirish, farq hisoblash yoki database'ga yozishda xato yoki yashirin xato chiqadi. Bu aynan shu holat.

## Simptom (aynan shu)
- `TypeError: can't compare offset-naive and offset-aware datetimes`
- Yoki vaqt farqi noto'g'ri chiqadi (UTC vs local aralashib ketadi).
- `datetime.now()` chaqirilgan, lekin `tzinfo` yo'q.
- Kod "ishlaydi" deb ko'rinadi, lekin production'da vaqt zona o'zgarganda yiqiladi.

## Sabab (100%)
`datetime.now()` default ravishda timezone bermasa naive datetime qaytaradi (`tzinfo=None`).
`datetime.utcnow()` ham deprecated va naive.
Aware datetime (masalan `datetime.now(timezone.utc)`) bilan solishtirish yoki operatsiya qilish mumkin emas.

## Tasdiqlash
1. Xato matnida "offset-naive and offset-aware" so'zi bormi?
2. Kodda `datetime.now()` yoki `datetime.utcnow()` ishlatilganmi, `timezone` yoki `ZoneInfo` yo'qmi?
3. `print(dt.tzinfo)` — `None` chiqadimi?
4. Solishtirilayotgan ikkinchi datetime'da `tzinfo` bormi?

## Tuzatish (aynan shu)
Har doim timezone bilan yarating:

```python
from datetime import datetime, timezone

# To'g'ri — UTC aware
now = datetime.now(timezone.utc)

# Yoki ma'lum zona
from zoneinfo import ZoneInfo
local = datetime.now(ZoneInfo("Asia/Tashkent"))
```

Agar eski kodda naive bo'lsa, konvertatsiya:

```python
# Naive ni UTC deb hisoblab aware qilish (ehtiyotkorlik bilan)
aware = naive_dt.replace(tzinfo=timezone.utc)
```

Hech qachon `datetime.utcnow()` ishlatma — `datetime.now(timezone.utc)` ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`datetime.now()` timezone siz chaqirilsa naive datetime chiqadi. Aware bilan solishtirish TypeError beradi. Har doim `timezone.utc` yoki `ZoneInfo` bilan chaqir.

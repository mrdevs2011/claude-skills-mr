---
name: python-used-datetime-utcnow-instead-of-datetime-now-with-timezone-utc
description: Python 3.12+ da datetime.utcnow() ishlatilganda DeprecationWarning chiqadi yoki naive datetime hosil bo'ladi; o'rniga datetime.now(timezone.utc) ishlatish kerak.
---

# datetime.utcnow() o'rniga datetime.now(timezone.utc) ishlatish

## Nima uchun bu skill kerak
`datetime.utcnow()` Python 3.12 dan boshlab deprecated. U timezone-naive datetime qaytaradi, bu keyinchalik taqqoslash, serializatsiya yoki boshqa aware datetimelar bilan ishlaganda xatolarga olib keladi. Zamonaviy usul — aniq timezone bilan aware datetime yaratish.

## Simptom (aynan shu)
- Kod ishga tushganda `DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).` chiqadi.
- Yoki UTC vaqt "naive" bo'lib, keyinchalik `TypeError: can't compare offset-naive and offset-aware datetimes` yoki noto'g'ri farq hisoblash.
- Loglarda yoki API javoblarida UTC vaqt local timezone sifatida talqin qilinadi.

## Sabab (100%)
`datetime.utcnow()` ichki ravishda `datetime.now()` ga o'xshash, lekin timezone ma'lumotisiz (naive) obyekt qaytaradi. Python 3.12+ bu usulni olib tashlash rejasida. To'g'ri usul — `datetime.now(timezone.utc)` yoki `datetime.now(UTC)` (3.11+) bilan timezone-aware datetime yaratish.

## Tasdiqlash
Kodda `utcnow` qidiring:

```python
from datetime import datetime
print(datetime.utcnow())  # DeprecationWarning + naive
```

Agar `datetime.utcnow()` yoki `.utcnow` chaqiruvi bo'lsa va `timezone.utc` ishlatilmagan bo'lsa — shu skill qo'llaniladi.

## Tuzatish (aynan shu)
`from datetime import datetime, timezone` qo'shing va `utcnow()` ni almashtiring:

```python
# Noto'g'ri (deprecated, naive)
from datetime import datetime
now = datetime.utcnow()

# To'g'ri (aware UTC)
from datetime import datetime, timezone
now = datetime.now(timezone.utc)

# Python 3.11+ da qisqaroq
from datetime import datetime, UTC
now = datetime.now(UTC)
```

Agar faqat string kerak bo'lsa, `datetime.now(timezone.utc).isoformat()` yoki `strftime` dan foydalaning. Hech qachon `utcnow()` ni yangi kodda ishlatmang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`datetime.utcnow()` deprecated va naive datetime beradi. Doim `datetime.now(timezone.utc)` (yoki `UTC`) ishlatib timezone-aware UTC vaqt oling. Bu ogohlantirishlarni yo'qotadi va taqqoslash xatolarini oldini oladi.

---
name: python-datetime-now-without-tzinfo
description: Python kodda datetime.now() tzinfo berilmasdan chaqirilgan — naive datetime yaratiladi, timezone-aware datetime bilan solishtirishda TypeError yoki noto'g'ri natija, serialization va UTC konvertatsiyada xatolar.
---

# datetime.now() tzinfo'siz chaqirilishi

## Nima uchun bu skill kerak
`datetime.now()` chaqirilganda tzinfo berilmasa, Python naive datetime (timezone ma'lumot'siz) qaytaradi. Bu boshqa aware datetime bilan solishtirishda TypeError beradi, JSON serialization'da muammo, va DST yoki server timezone o'zgarishida noto'g'ri vaqt hisoblashga olib keladi. Doim aware datetime ishlatish tavsiya etiladi.

## Simptom (aynan shu)
- `datetime.now()` yoki `datetime.datetime.now()` tzinfo argumentsiz.
- Keyinroq `aware_dt - naive_dt` yoki solishtirishda `TypeError: can't subtract offset-naive and offset-aware datetimes`.
- Vaqt UTC emas, local timezone'da saqlangan, deploy'da boshqacha.
- `isoformat()` timezone info'siz chiqadi.

## Sabab (100%)
Dasturchi oddiy "hozirgi vaqt" olish uchun `datetime.now()` ishlatadi, lekin Python 3 da bu default local timezone'da naive object yaratishini hisobga olmaydi. Aware datetime uchun `tz` argumenti majburiy.

## Tasdiqlash
1. Kodda `datetime.now()` yoki `datetime.datetime.now()` bormi va tzinfo= berilmaganmi?
2. Natija keyin timezone-aware datetime bilan ishlatiladimi yoki saqlanadimi?
3. Agar ha — bu holat. `datetime.now(timezone.utc)` yoki `datetime.now(tz=...)` ishlat.

## Tuzatish (aynan shu)
Har doim timezone ber. UTC uchun eng oddiy va xavfsiz:

Noto'g'ri:
```python
from datetime import datetime
now = datetime.now()  # naive, local timezone
```

To'g'ri:
```python
from datetime import datetime, timezone
now = datetime.now(timezone.utc)  # aware UTC
# yoki boshqa timezone uchun
# from zoneinfo import ZoneInfo
# now = datetime.now(ZoneInfo("Asia/Tashkent"))
```

Agar local kerak bo'lsa ham aware qil:
```python
now = datetime.now().astimezone()  # local aware
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`datetime.now()` hech qachon tzinfo'siz chaqirma. Doim `timezone.utc` yoki aniq ZoneInfo berib aware datetime yarat — solishtirish, serialization va cross-timezone ishlarda xavfsiz.

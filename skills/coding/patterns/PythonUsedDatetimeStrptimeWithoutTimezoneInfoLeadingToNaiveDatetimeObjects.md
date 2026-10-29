---
name: python-datetime-strptime-naive
description: Python kodda datetime.strptime ishlatilganda timezone ma'lumoti berilmagan — natijada naive datetime obyekti yaratiladi, keyinchalik aware datetime bilan solishtirishda TypeError yoki noto'g'ri vaqt hisoblari chiqadi.
---

# datetime.strptime bilan timezone'siz naive datetime yaratish

## Nima uchun bu skill kerak
`datetime.strptime` odatda timezone-aware emas, naive datetime qaytaradi. Bunday obyektni timezone-aware datetime bilan solishtirish, farq hisoblash yoki JSON serializatsiya qilishda xatolar yoki kutilmagan natijalar beradi. Zamonaviy kodda har doim timezone-aware datetime ishlatish tavsiya etiladi.

## Simptom (aynan shu)
- `datetime.strptime(date_str, "%Y-%m-%d")` yoki shunga o'xshash chaqiruv.
- Natija `.tzinfo is None` bo'ladi.
- Keyin `aware_dt - naive_dt` yoki solishtirishda `TypeError: can't subtract offset-naive and offset-aware datetimes`.
- Vaqt zonasi farqi hisobga olinmaganligi sababli noto'g'ri vaqtlar.

## Sabab (100%)
`strptime` formatda timezone yo'q bo'lsa yoki `%z` ishlatilmasa, u har doim naive datetime qaytaradi. Dasturchi "faqat sana kerak" deb o'ylab, keyingi ishlatishda timezone kerak bo'lishini hisobga olmaydi. Python 3.9+ da `zoneinfo` yoki `datetime.timezone.utc` bilan aware qilish oson.

## Tasdiqlash
1. `datetime.strptime(...)` chaqiruvi bormi?
2. Natija `.tzinfo` `None` mi?
3. Bu datetime keyin boshqa aware datetime bilan ishlatiladimi yoki saqlanadimi?
4. Agar ha — bu holat.

## Tuzatish (aynan shu)
Strptime dan keyin darhol timezone biriktir yoki formatda `%z` ishlat va aware qil.

Noto'g'ri:
```python
from datetime import datetime
dt = datetime.strptime("2026-10-30", "%Y-%m-%d")
# dt.tzinfo is None
```

To'g'ri (UTC bilan):
```python
from datetime import datetime, timezone
dt = datetime.strptime("2026-10-30", "%Y-%m-%d").replace(tzinfo=timezone.utc)
# yoki
dt = datetime.strptime("2026-10-30T00:00:00+0000", "%Y-%m-%dT%H:%M:%S%z")
```

Agar local timezone kerak bo'lsa (Python 3.9+):
```python
from datetime import datetime
from zoneinfo import ZoneInfo
dt = datetime.strptime("2026-10-30", "%Y-%m-%d").replace(tzinfo=ZoneInfo("Asia/Tashkent"))
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`datetime.strptime` odatda naive datetime beradi. Har doim parse qilgandan keyin `.replace(tzinfo=...)` yoki `%z` bilan aware datetime yarat — solishtirish va hisoblash xatolaridan qochish uchun.

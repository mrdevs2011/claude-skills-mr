---
name: python-used-datetime-replace-tzinfo-for-timezone-conversion-instead-of-astimezone
description: datetime.replace(tzinfo=...) bilan timezone o'zgartirilganda offset noto'g'ri hisoblanadi; to'g'ri konvertatsiya uchun astimezone() ishlatish kerak.
---

# datetime.replace(tzinfo) o'rniga astimezone() ishlatish

## Nima uchun bu skill kerak
`datetime.replace(tzinfo=new_tz)` faqat tzinfo atributini almashtiradi, lekin vaqtni yangi timezone'ga ko'chirib hisoblamaydi. Natijada "local" vaqt noto'g'ri bo'lib qoladi (masalan, UTC 12:00 ni Europe/London qilib replace qilsangiz, yozgi/qishki vaqt hisobga olinmaydi). `astimezone()` esa to'g'ri offsetni qo'llab, vaqtni konvertatsiya qiladi.

## Simptom (aynan shu)
Timezone konvertatsiya qilingan datetime noto'g'ri soatni ko'rsatadi. Masalan, UTC vaqtni boshqa zonaga o'tkazganda 1 soat yoki DST farqi yo'qoladi. Solishtirish yoki formatlashda kutilmagan farq chiqadi. Loglarda yoki foydalanuvchi ko'rsatiladigan vaqtda xato soat.

## Sabab (100%)
`replace(tzinfo=...)` methodi faqat `tzinfo` maydonini yangilaydi, underlying UTC timestampni o'zgartirmaydi va offsetni qayta hisoblamaydi. Bu naive datetimega tzinfo qo'yish uchun ishlatiladi, lekin aware datetimeni boshqa zonaga konvertatsiya qilish uchun emas. `astimezone(tz)` esa to'g'ri konvertatsiya qiladi: yangi offsetni hisoblab, vaqtni moslashtiradi.

## Tasdiqlash
Kodda `replace(tzinfo=` qidir. Agar maqsad konvertatsiya bo'lsa (boshqa zonaga o'tkazish), noto'g'ri. Test:

```python
from datetime import datetime
from zoneinfo import ZoneInfo

utc = datetime(2024, 6, 15, 12, 0, tzinfo=ZoneInfo("UTC"))
wrong = utc.replace(tzinfo=ZoneInfo("Europe/London"))
right = utc.astimezone(ZoneInfo("Europe/London"))
print(wrong)   # 2024-06-15 12:00:00+01:00  (noto'g'ri, offset qo'yildi lekin vaqt o'zgarmadi)
print(right)   # 2024-06-15 13:00:00+01:00  (to'g'ri, BST)
```

## Tuzatish (aynan shu)
Aware datetimeni boshqa timezone'ga o'tkazish uchun doim `astimezone()` ishlat. `replace(tzinfo=)` faqat naive -> aware qilishda (va aniq offset bilganingda) ishlatiladi.

```python
from datetime import datetime
from zoneinfo import ZoneInfo

utc_time = datetime.now(ZoneInfo("UTC"))

# Noto'g'ri — vaqt o'zgarmaydi, faqat label
# local_wrong = utc_time.replace(tzinfo=ZoneInfo("Asia/Tashkent"))

# To'g'ri — konvertatsiya
local_right = utc_time.astimezone(ZoneInfo("Asia/Tashkent"))
print(local_right)
```

Agar faqat tzinfo qo'yish kerak bo'lsa (masalan, known offset), komment bilan `replace` ni saqlab qo'y.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`replace(tzinfo=)` timezone konvertatsiyasi emas, faqat label o'zgartirish. To'g'ri vaqt o'tkazish uchun `astimezone()` ishlat. Bu DST va offset xatolarini oldini oladi.

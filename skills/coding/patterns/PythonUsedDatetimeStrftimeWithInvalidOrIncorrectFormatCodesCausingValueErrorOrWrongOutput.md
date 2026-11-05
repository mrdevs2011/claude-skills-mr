---
name: python-used-datetime-strftime-with-invalid-or-incorrect-format-codes-causing-valueerror-or-wrong-output
description: Agent yoki kod datetime.strftime() da noto'g'ri yoki eskirgan format kodlarini ishlatadi, natijada ValueError yoki noto'g'ri sana chiqadi. Format kodlarini to'g'ri ishlatish kerak.
---

# Python datetime.strftime() da noto'g'ri format kodlari

## Nima uchun bu skill kerak
Sana va vaqtni formatlashda AI agentlar ba'zan eskirgan `%Y-%m-%d` o'rniga noto'g'ri kodlar yoki Python 3.9+ da o'zgargan narsalarni ishlatadi. Bu ValueError yoki kutilmagan output beradi, ayniqsa timezone yoki locale bilan.

## Simptom (aynan shu)
- `ValueError: Invalid format string` yoki `ValueError: Invalid format code`
- Chiqish matni kutilganidek emas (masalan, oy o'rniga kun, yoki bo'sh)
- Kodda `%c`, `%x` kabi locale-dependent yoki noto'g'ri `%H:%M` o'rniga boshqa ishlatilgan
- Python 3.12+ da ba'zi eskirgan kodlar ogohlantirish beradi

## Sabab (100%)
strftime format stringi C standardiga asoslangan va faqat ma'lum kodlarni qabul qiladi. Agent "odamcha" format yozadi yoki boshqa tildagi (JS `YYYY-MM-DD`) kodni ko'chiradi. `%Y` yil, `%m` oy (01-12), `%d` kun, `%H` soat (00-23), `%M` daqiqa, `%S` soniya — bularni aralashtirib yuboradi.

## Tasdiqlash
1. Xato matnida "Invalid format string" yoki "strftime" bormi?
2. Kodda `datetime.now().strftime(...)` yoki `dt.strftime(...)` chaqiruvi bormi?
3. Format string ichida `%` bilan boshlanmaydigan yoki noma'lum kod bormi (masalan `%Y-%m-%d %H:%M` to'g'ri, lekin `%yyyy` noto'g'ri)?
4. Chiqishni qo'lda tekshirib, kutilgan formatga mos kelmayaptimi?

## Tuzatish (aynan shu)
Faqat rasmiy format kodlarini ishlat:

```python
from datetime import datetime

now = datetime.now()
# To'g'ri: ISO-like
formatted = now.strftime("%Y-%m-%d %H:%M:%S")
print(formatted)  # 2026-11-05 17:00:00

# To'g'ri: boshqa
iso = now.strftime("%Y-%m-%dT%H:%M:%S")
human = now.strftime("%d %b %Y")  # 05 Nov 2026
```

Noto'g'ri misollar (qilma):
- `strftime("%yyyy-%mm-%dd")` → ValueError
- JS uslubidagi `YYYY` ishlatma

Agar timezone kerak bo'lsa, avval `astimezone()` yoki `timezone.utc` ishlat, keyin strftime.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- strftime faqat aniq `%Y %m %d %H %M %S` kabi kodlarni qabul qiladi; boshqa tildagi formatlarni ko'chirma.
- Noto'g'ri kod ValueError yoki noto'g'ri chiqish beradi.
- Har doim to'g'ri format string bilan sinab ko'r.

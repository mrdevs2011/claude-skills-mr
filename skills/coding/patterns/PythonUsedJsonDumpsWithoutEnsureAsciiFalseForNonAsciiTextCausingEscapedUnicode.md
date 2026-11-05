---
name: python-used-json-dumps-without-ensure-ascii-false
description: Non-ASCII matn (o'zbek, kirill va h.k.) ni json.dumps qilganda ensure_ascii=False qilinmasa, \\uXXXX escaped chiqadi. Qachon: JSON API javobi yoki fayl yozishda o'qilishi qiyin escaped unicode kerak bo'lmaganda.
---

# PythonUsedJsonDumpsWithoutEnsureAsciiFalseForNonAsciiTextCausingEscapedUnicode

## Nima uchun bu skill kerak
json.dumps default ensure_ascii=True qiladi, shuning uchun o'zbekcha yoki boshqa non-ASCII belgilarni \\uXXXX ga aylantiradi. Bu log, API response yoki config fayllarda o'qishni qiyinlashtiradi.

## Simptom (aynan shu)
JSON chiqishi yoki faylda "salom" o'rniga "\\u0441\\u0430\\u043b\\u043e\\u043c" ko'rinadi. Manba matn to'g'ri, lekin dump qilingan.

## Sabab (100%)
json.dumps(data) chaqirilganda ensure_ascii=False argumenti berilmagan. Default True bo'lgani uchun barcha non-ASCII escape qilinadi.

## Tasdiqlash
Chiqish matnida \\uXXXX ko'rsangiz va manba matn non-ASCII bo'lsa, ensure_ascii tekshiring. json.dumps.__defaults__ yoki kodni ko'ring.

## Tuzatish (aynan shu)
Har doim non-ASCII kerak bo'lganda ensure_ascii=False qo'shing:

```python
import json

data = {"xabar": "Salom, dunyo!"}
print(json.dumps(data))  # {"xabar": "\\u0421\\u0430\\u043b\\u043e\\u043c, \\u0434\\u0443\\u043d\\u044c\\u043e!"}

# To'g'ri:
print(json.dumps(data, ensure_ascii=False))  # {"xabar": "Salom, dunyo!"}
```

Faylga yozishda ham xuddi shunday.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
json.dumps da non-ASCII matnni o'qiladigan qoldirish uchun ensure_ascii=False majburiy. Default escaped unicode qiladi.

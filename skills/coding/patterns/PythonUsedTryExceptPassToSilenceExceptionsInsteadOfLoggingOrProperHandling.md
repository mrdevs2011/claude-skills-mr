---
name: python-try-except-pass-silences-errors
description: Python kodida try/except/pass ishlatib xatolarni jim o'chirish — xato yashiriladi, keyinroq debug qiyinlashadi yoki noto'g'ri holatda davom etiladi.
---

# try/except/pass bilan xatolarni jim o'chirish

## Nima uchun bu skill kerak
Agentlar yoki dasturchilar ba'zan "xato chiqmasin" deb try/except/pass yozadi. Bu xatoni yashiradi, stack trace yo'qoladi, dastur noto'g'ri holatda ishlashda davom etadi. Keyinchalik sababni topish qiyin bo'ladi.

## Simptom (aynan shu)
- Kodda `try:` bloki bor, `except:` yoki `except Exception:` dan keyin faqat `pass` yozilgan.
- Xato yuzaga kelganda hech narsa log qilinmaydi, re-raise qilinmaydi.
- Dastur xato holatida davom etadi yoki bo'sh natija qaytaradi.
- Loglarda yoki konsolda xato ko'rinmaydi.

## Sabab (100%)
Xatoni "jim" o'chirish orqali dastur qulashidan saqlanishga urinish, lekin asl sababni hal qilmaslik. Bu pattern noto'g'ri error handling.

## Tasdiqlash
- `except` dan keyin faqat `pass` bormi?
- Xato log qilinganmi yoki qayta raise qilinganmi?
- Agar yo'q bo'lsa — shu skill qo'llaniladi.

## Tuzatish (aynan shu)
1. `pass` ni olib tashla.
2. Xatoni log qil (logging yoki print, lekin productionda logging).
3. Yoki aniq exception turini tutib, ma'noli tarzda handle qil.
4. Agar xato kutilmagan bo'lsa — qayta raise qil yoki bo'sh `except` ishlatma.

```python
# Noto'g'ri
try:
    risky_operation()
except Exception:
    pass

# To'g'ri
import logging
try:
    risky_operation()
except Exception as e:
    logging.error("risky_operation failed: %s", e, exc_info=True)
    # yoki: raise
    # yoki: return default_value  # agar mantiqiy bo'lsa
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- try/except/pass xatolarni yashiradi va debugni qiyinlashtiradi.
- Har doim xatoni log qil yoki to'g'ri handle qil, jim o'chirma.
- Bu pattern o'rniga aniq exception handling ishlat.
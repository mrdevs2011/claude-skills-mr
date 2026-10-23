---
name: hardcoded-magic-numbers-or-strings-instead-of-named-constants
description: Kodda magic number yoki string to'g'ridan-to'g'ri yozilgan, nomlangan konstanta yoki config o'rniga — o'zgartirish qiyin, xato kiritish oson, ma'no tushunarsiz.
---

# Hardcoded magic numbers yoki stringlar nomlangan konstanta o'rniga

## Nima uchun bu skill kerak
Agentlar tez-tez status kod, timeout, API endpoint, max retry, default limit kabi qiymatlarni to'g'ridan-to'g'ri kodga yozib qo'yadi. Bu keyinchalik o'zgartirishni qiyinlashtiradi, bir xil qiymat bir necha joyda takrorlanadi, va ma'nosi izohsiz tushunarsiz bo'ladi. Named constant yoki config fayl ishlatish maintainability va xatolikni kamaytiradi.

## Simptom (aynan shu)
- Kodda `if status == 200` yoki `timeout = 30` yoki `url = "https://api.example.com/v1/users"` kabi to'g'ridan-to'g'ri qiymatlar bor.
- Bir xil raqam yoki string bir necha faylda yoki funksiyada takrorlanadi.
- Qiymat nima ekanligi izohsiz — o'qigan odam nima uchun 5 yoki "pending" ekanini taxmin qiladi.
- O'zgartirish kerak bo'lganda barcha joylarni qo'lda qidirish kerak.

## Sabab (100%)
Tez yozish uchun agent qiymatni joyida qoldiradi, alohida konstanta e'lon qilishni "ortiqcha" deb hisoblaydi. Lekin bu DRY va self-documenting code tamoyillarini buzadi.

## Tasdiqlash
1. Kodni ko'rib chiq: `200`, `404`, `30`, `"success"`, `"error"`, URL, limit kabi qiymatlar to'g'ridan-to'g'ri if/assign ichidami?
2. Bir xil qiymat necha joyda uchraydi? `grep` yoki qidiruv bilan tekshir.
3. Konstanta yoki enum/config fayl bormi? Yo'q bo'lsa — magic.
4. Qiymatni o'zgartirish kerak bo'lsa, necha joyga tegish kerak?

## Tuzatish (aynan shu)
Magic qiymatlarni nomlangan konstantaga chiqar:

```python
# Noto'g'ri:
def check_status(code):
    if code == 200:
        return "ok"
    elif code == 429:
        time.sleep(30)
        return "retry"
    return "fail"

# To'g'ri:
HTTP_OK = 200
HTTP_TOO_MANY_REQUESTS = 429
RETRY_DELAY_SECONDS = 30
STATUS_OK = "ok"
STATUS_RETRY = "retry"
STATUS_FAIL = "fail"

def check_status(code):
    if code == HTTP_OK:
        return STATUS_OK
    elif code == HTTP_TOO_MANY_REQUESTS:
        time.sleep(RETRY_DELAY_SECONDS)
        return STATUS_RETRY
    return STATUS_FAIL
```

Yoki config/env dan o'qi. Enum ishlatish ham mumkin (Python 3.4+).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Magic number/string o'rniga doim named constant ishlat.
- Bu o'qishni osonlashtiradi, o'zgartirishni xavfsiz qiladi, takrorlanishni oldini oladi.
- Agentlar tez yozishda shu xatoga yo'l qo'yadi — qidirib, chiqarib qo'y.

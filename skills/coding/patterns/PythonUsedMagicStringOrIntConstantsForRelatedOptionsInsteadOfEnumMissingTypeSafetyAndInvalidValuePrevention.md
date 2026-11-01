---
name: python-used-magic-string-or-int-for-options-instead-of-enum
description: Bog'liq variantlar (status, role, type) uchun oddiy string yoki int ishlatilganda noto'g'ri qiymatlar o'tib ketadi, type safety yo'q, IDE yordami kam. Enum ishlatish kerak.
---

# Bog'liq variantlar uchun magic string/int o'rniga Enum ishlatish

## Nima uchun bu skill kerak
Kodda status, role, event type, config option kabi bog'liq qiymatlar oddiy string ("active", "pending") yoki int (1, 2, 3) sifatida tarqalgan. Bu noto'g'ri qiymat kiritilishiga, typo'ga, qiyin refactor'ga va type checker yordamining yo'qligiga olib keladi. Enum aniq, xavfsiz va o'qilishi oson.

## Simptom (aynan shu)
- Funksiya yoki class ichida string/int konstantalar: `status = "active"`, `if role == "admin":`
- Bir xil qiymatlar bir necha joyda takrorlanadi, ba'zida typo bilan ("actve")
- Noto'g'ri qiymat (masalan "unknown") o'tib ketadi, runtime'da xato yoki silent bug
- IDE autocomplete yoki type hint yo'q, mypy/pyright ogohlantirmaydi

## Sabab (100%)
Oddiy string/int ishlatish tez va oddiy ko'rinadi, lekin ular cheksiz qiymatlar qabul qiladi. Enum (enum.Enum) faqat belgilangan a'zolarni ruxsat etadi, identity va comparison'ni aniq qiladi, va documentation sifatida ishlaydi.

## Tasdiqlash
1. Kodda bog'liq qiymatlar (status, type, role) string yoki int sifatida ishlatilganmi?
2. Ular bir nechta joyda takrorlanadimi yoki "magic" ko'rinishidami?
3. Type hint faqat str/intmi, Enum emasmi?
4. Noto'g'ri qiymat kiritib test qil — xato chiqmaydimi?

```python
def process(status: str):  # keng
    if status == "active": ...
process("actve")  # silent noto'g'ri
```

## Tuzatish (aynan shu)
`enum.Enum` (yoki `IntEnum`, `StrEnum`) bilan almashtir:

```python
from enum import Enum

class Status(Enum):
    ACTIVE = "active"
    PENDING = "pending"
    INACTIVE = "inactive"

def process(status: Status):
    if status is Status.ACTIVE:  # yoki ==
        activate()
    # status.value kerak bo'lsa string olish

# Ishlatish
process(Status.ACTIVE)  # to'g'ri
# process("active")  # type error yoki aniq conversion
# process(Status("actve"))  # ValueError
```

Agar string kerak bo'lsa (API, DB), `.value` ishlat va input'ni `Status(value)` bilan validate qil. StrEnum (Python 3.11+) qulayroq.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Bog'liq variantlar uchun oddiy string/int o'rniga Enum ishlat. Bu type safety, noto'g'ri qiymatlarni oldini olish, yaxshi IDE yordami va aniqroq kod beradi. Magic constantlarni Enum a'zolariga aylantir.

---
name: python-regular-class-for-simple-data-holder
description: Python kodda oddiy ma'lumot saqlash uchun to'liq class yozilgan — __init__, __repr__ qo'lda, lekin dataclass yoki namedtuple yetarli va kamroq boilerplate beradi.
---

# Oddiy data holder uchun oddiy class ishlatish

## Nima uchun bu skill kerak
Oddiy atributlar saqlaydigan ma'lumot konteynerlari uchun to'liq class yozish keraksiz boilerplate yaratadi, __eq__/__repr__ ni unutish xavfini oshiradi va kodni cho'zadi. Python 3.7+ da dataclass, yoki collections.namedtuple bu holatlar uchun mo'ljallangan.

## Simptom (aynan shu)
- class ichida faqat __init__ da self.attr = attr qilinadi, boshqa metodlar yo'q yoki minimal.
- __repr__, __eq__ qo'lda yozilgan yoki umuman yo'q.
- Maqsad faqat ma'lumot guruhlash (DTO, config, record), xatti-harakat yo'q.
- Ko'p shunday classlar takrorlanadi.

## Sabab (100%)
Dasturchi eski odat yoki "class hamma narsa uchun" yondashuvi bilan oddiy data structure uchun ham to'liq class yozadi, dataclass yoki namedtuple imkoniyatlarini bilmaydi yoki ishlatmaydi.

## Tasdiqlash
1. Classda asosan atributlar bormi, muhim metodlar (biznes logika) yo'qmi?
2. __init__ faqat self.x = x qiladimi?
3. Agar ha — dataclass yoki namedtuple ishlatish mumkin.

## Tuzatish (aynan shu)
Dataclass yoki namedtuple ishlat.

Noto'g'ri:
```python
class User:
    def __init__(self, id, name, email):
        self.id = id
        self.name = name
        self.email = email

    def __repr__(self):
        return f"User({self.id}, {self.name}, {self.email})"
```

To'g'ri (dataclass):
```python
from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str
    email: str
```

Yoki namedtuple (immutability kerak bo'lsa):
```python
from collections import namedtuple

User = namedtuple("User", ["id", "name", "email"])
```

Agar validation yoki metodlar kerak bo'lsa, class saqlanadi, lekin oddiy holatda dataclass afzal.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Oddiy ma'lumot saqlash uchun to'liq class yozish o'rniga dataclass (yoki namedtuple) ishlatish boilerplate kamaytiradi, avtomatik __repr__/__eq__ beradi va kodni aniqroq qiladi. Faqat xatti-harakatli classlar uchun oddiy class qoldir.

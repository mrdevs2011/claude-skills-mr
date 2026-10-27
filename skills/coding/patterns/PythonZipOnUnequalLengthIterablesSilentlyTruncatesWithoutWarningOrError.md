---
name: python-zip-unequal-length-silent-truncation
description: Python zip() bir nechta iterable'ni birlashtirganda eng qisqasiga qarab jim ketadi — uzunroq qism yo'qoladi, xato chiqmaydi. Ma'lumotlar mos kelishi shart bo'lgan holatlarda.
---

# Python zip() teng bo'lmagan uzunlikdagi iterable'larda jim truncation

## Nima uchun bu skill kerak
Ko'p agentlar va dasturchilar `zip()` ni parallel ro'yxatlarni juftlash uchun ishlatadi, lekin uzunliklar teng emasligini tekshirmaydi. Natijada eng qisqa ro'yxat tugagach, qolgan elementlar tashlab yuboriladi — hech qanday ogohlantirish yoki xato yo'q. Bu silent data loss ga olib keladi.

## Simptom (aynan shu)
- Ikki yoki undan ko'p ro'yxat `zip()` qilingan, lekin natija kutilganidan qisqa.
- Uzunroq ro'yxatning oxirgi elementlari yo'qolgan, lekin kod xato bermagan.
- Ma'lumotlar "mos keldi" deb taxmin qilingan, lekin haqiqatda truncation bo'lgan.
- Misol: `list(zip([1,2,3], [10,20]))` → `[(1,10), (2,20)]` — 3 yo'qolgan.

## Sabab (100%)
Python'dagi `zip()` CPython implementatsiyasida eng qisqa iterable tugaguncha davom etadi va to'xtaydi. Bu dizayn tanlovi — xato chiqarish o'rniga jim qisqartirish. Agent uzunliklarni oldindan `len()` bilan tekshirmagan yoki `itertools.zip_longest` ishlatmagan.

## Tasdiqlash
- `zip()` chaqiruvi bor va argumentlarning uzunligi bir xil ekanligi kafolatlanmaganmi?
- Natija uzunligi kutilgan maksimal yoki barcha elementlar soniga teng emasmi?
- Hech qanday `if len(a) != len(b): raise ...` yoki `zip_longest` yo'qmi?
- Testlar faqat teng uzunlikdagi holatlarni qamrab olganmi?

## Tuzatish (aynan shu)
Agar uzunliklar har doim teng bo'lishi shart bo'lsa — oldindan tekshir va xato chiqar:

```python
def strict_zip(*iterables):
    lengths = [len(it) for it in iterables]
    if len(set(lengths)) > 1:
        raise ValueError(f"Unequal lengths in zip: {lengths}")
    return zip(*iterables)

# Foydalanish
pairs = list(strict_zip(ids, names))  # teng bo'lmasa ValueError
```

Yoki agar qolgan elementlarni saqlash kerak bo'lsa — `itertools.zip_longest`:

```python
from itertools import zip_longest

pairs = list(zip_longest(ids, names, fillvalue=None))
# Endi uzunroq qism None bilan to'ldiriladi, yo'qolmaydi
```

Hech qachon oddiy `zip()` ni uzunlik kafolatisiz ishlatma, agar silent loss xavfli bo'lsa.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `zip()` eng qisqa iterable'ga qarab jim to'xtaydi — xato yo'q, data yo'qoladi.
- Parallel ma'lumotlar uchun har doim uzunliklarni tekshir yoki `zip_longest` ishlat.
- Bu silent bug ko'p production xatolarining sababi — oldindan strict qil.

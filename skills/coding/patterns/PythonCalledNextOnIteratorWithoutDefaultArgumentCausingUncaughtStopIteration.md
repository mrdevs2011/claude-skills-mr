---
name: python-called-next-on-iterator-without-default-argument-causing-uncaught-stopiteration
description: Python'da next() funksiyasi default argumentisiz chaqirilganda, iterator bo'sh yoki allaqachon tugagan bo'lsa StopIteration xatosi chiqadi — kutilmagan crash.
---

# Python'da next() chaqiruvi default'siz StopIteration xatosi

## Nima uchun bu skill kerak
Iterator yoki generator'dan bitta element olish uchun `next()` ishlatilganda, agar hech qanday element qolmagan bo'lsa (bo'sh iterator, tugagan generator), Python avtomatik `StopIteration` ko'taradi. Bu xato odatda ushlanmagan holda dasturni to'xtatadi. Ko'p hollarda bu holat kutilgan (masalan, bo'sh natija), lekin default berilmasa xato chiqadi.

## Simptom (aynan shu)
- `StopIteration` xatosi chiqadi.
- Traceback `next(some_iterator)` yoki `next(gen)` qatorini ko'rsatadi.
- Kod oddiy "birinchi elementni ol" yoki "keyingisini ol" ni nazarda tutgan, lekin iterator bo'sh bo'lib chiqqan.
- Xato faqat ba'zi hollarda (bo'sh data, oxirgi elementdan keyin) paydo bo'ladi.

## Sabab (100%)
`next(iterator)` chaqiruvi ikkinchi argument (default) berilmasa, iterator'da element qolmaganda `StopIteration` ko'taradi. Bu Python'ning iterator protokolining normal xatti-harakati — exception orqali "tugadi" signalini beradi. Agar kod bu holatni kutmagan yoki try/except bilan ushlamagan bo'lsa, crash bo'ladi.

## Tasdiqlash
1. Xato matnida aniq `StopIteration` borligini tekshir.
2. Traceback'dagi qatorni top: `next(...)` chaqiruvi.
3. O'sha iterator yoki generator'ni tekshir: u bo'shmi yoki allaqachon to'liq iteratsiya qilinganmi.
4. `next` chaqiruvida ikkinchi argument yo'qligini tasdiqla.

## Tuzatish (aynan shu)
Hech qachon default'siz `next()` ishlatma, agar bo'sh holat mumkin bo'lsa. Default qiymat ber yoki aniq tekshir.

Yomon:
```python
items = []  # yoki generator tugagan
first = next(iter(items))  # StopIteration
```

Yaxshi — default bilan:
```python
items = []
first = next(iter(items), None)  # None qaytadi, crash yo'q
if first is None:
    # bo'sh holatni boshqar
    pass
```

Yoki aniq uzunlik tekshiruvi:
```python
if items:
    first = next(iter(items))
else:
    first = None
```

Generator uchun:
```python
def gen():
    yield from []  # bo'sh

g = gen()
value = next(g, "default")  # "default" qaytadi
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `next(iterator)` element yo'q bo'lsa `StopIteration` ko'taradi.
- Bu xatoni oldini olish uchun doim `next(iterator, default)` shaklida default ber.
- Default berish orqali bo'sh holatni exception'siz, oddiy qiymat bilan boshqarish mumkin.
- Har doim iterator bo'sh bo'lishi mumkinligini hisobga ol.

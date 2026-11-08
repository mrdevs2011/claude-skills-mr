---
name: python-used-itertools-groupby-without-sorting-key-first
description: Python kodi itertools.groupby() ni ishlatadi lekin iterable avval sort qilinmagan — teng keylar ketma-ket bo'lmasa, alohida guruhlar hosil bo'ladi va ma'lumotlar to'liq guruhlanmaydi.
---

# itertools.groupby() ishlatishdan oldin sort qilmaslik

## Nima uchun bu skill kerak
`itertools.groupby` faqat **ketma-ket** bir xil keylarni guruhlaydi. Agar iterable oldindan key bo'yicha tartiblanmagan bo'lsa, bir xil keylar tarqoq joylashganida har biri alohida guruh sifatida chiqadi. Bu silent noto'g'ri natija beradi — xato emas, lekin kutilgan guruhlar bo'linib ketadi.

## Simptom (aynan shu)
- `from itertools import groupby` ishlatilgan.
- `groupby(items, key=lambda x: x.something)` yoki shunga o'xshash, lekin `items` avval `sorted(..., key=...)` bilan tartiblanmagan.
- Natijada bir xil keyga ega elementlar bir nechta guruhda paydo bo'ladi.
- Testlarda yoki real ma'lumotda guruhlar to'liq emas yoki takrorlanadi.
- Kod "barcha X ni yig'ish" deb o'ylangan, lekin tarqoq kelgani uchun alohida chiqadi.

## Sabab (100%)
`itertools.groupby` ichki iterator sifatida ishlaydi va faqat hozirgi ketma-ket teng keylarni bitta guruhga oladi. Key o'zgarganda yangi guruh boshlanadi. Sort qilinmagan iterableda bir xil keylar orasida boshqalar turgani uchun guruhlar bo'linadi. Bu hujjatda aniq yozilgan: "The iterable needs to already be sorted on the same key function."

## Tasdiqlash
1. Kodda `groupby(` chaqiruvi bormi?
2. Unga berilgan iterable oldindan xuddi shu `key` funksiyasi bilan `sorted()` yoki `sort()` qilinganmi?
3. Agar sort yo'q bo'lsa — bu holat. Bir xil keyli elementlarni alohida guruhlarda topib ko'r.
4. `list(groupby(...))` natijasida kutilganidan ko'p guruh bormi?

## Tuzatish (aynan shu)
`groupby` dan oldin iterable ni xuddi shu key bo'yicha sort qil.

Noto'g'ri:
```python
from itertools import groupby

data = [
    {"category": "A", "value": 1},
    {"category": "B", "value": 2},
    {"category": "A", "value": 3},  # A qaytib keldi
]

for key, group in groupby(data, key=lambda x: x["category"]):
    print(key, list(group))
# Natija:
# A [{'category': 'A', 'value': 1}]
# B [{'category': 'B', 'value': 2}]
# A [{'category': 'A', 'value': 3}]  # ikkinchi A alohida
```

To'g'ri:
```python
from itertools import groupby

data = [
    {"category": "A", "value": 1},
    {"category": "B", "value": 2},
    {"category": "A", "value": 3},
]

sorted_data = sorted(data, key=lambda x: x["category"])
for key, group in groupby(sorted_data, key=lambda x: x["category"]):
    print(key, list(group))
# Natija:
# A [{'category': 'A', 'value': 1}, {'category': 'A', 'value': 3}]
# B [{'category': 'B', 'value': 2}]
```

Agar key murakkab bo'lsa (tuple, object attribute), sort va groupby da bir xil key funksiyasini ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`itertools.groupby` ishlatishdan oldin iterable **albatta** xuddi shu key bo'yicha sort qilinishi shart. Aks holda bir xil keylar ketma-ket bo'lmasa, guruhlar bo'linib, to'liq natija chiqmaydi. Bu silent xato — hech qanday exception bermaydi.

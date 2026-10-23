---
name: used-in-list-membership-check-in-loop-instead-of-set
description: Loop ichida list da membership check (in list) ishlatilganda har safar O(n) linear search bo'lib sekinlashadi; o'zgarmaydigan collection uchun set bilan O(1) kerak.
---

# Loop ichida list membership check o'rniga set ishlatish

## Nima uchun bu skill kerak
Katta ro'yxatlarda yoki ichki loopda ko'p marta `in` tekshiruvi qilinganda kod sekin ishlaydi. Set ga bir marta o'tkazish oddiy va ancha tezroq.

## Simptom (aynan shu)
Kod to'g'ri ishlaydi, lekin input hajmi oshganda sezilarli sekinlashadi. Loop ichida `if item in some_list:` ko'rinishi bor va `some_list` loop davomida o'zgarmaydi.

## Sabab (100%)
Python list da `in` operatori linear search — har bir tekshiruv butun listni boshidan aylanadi (O(n)). Loopda marta marta chaqirilsa umumiy murakkablik O(n*m) bo'ladi.

## Tasdiqlash
Kodni qara: membership check loop ichida va list faqat o'qiladi (append/remove yo'q). Vaqtni o'lchab yoki profiler bilan tasdiqlash mumkin. Kichik listda farq sezilmaydi, katta listda (minglab element) sekinlashadi.

```python
# Sekin misol
big_list = list(range(10000))
for item in data:          # data ham katta
    if item in big_list:   # har safar O(n)
        process(item)
```

## Tuzatish (aynan shu)
Listni bir marta set ga aylantir, keyin lookup O(1) bo'ladi:

```python
# Tez misol
big_set = set(big_list)    # bir marta O(n)
for item in data:
    if item in big_set:    # O(1)
        process(item)
```

Agar collection loop davomida o'zgarsa, setni ham sinxron yangilash kerak (yoki boshqa struktura). Qiymat ham kerak bo'lsa dict ishlatish mumkin.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Ko'p marta membership check qilinadigan va o'zgarmaydigan collection uchun list o'rniga set ishlatish kerak — lookup O(1) bo'ladi va kod sezilarli tezroq ishlaydi.

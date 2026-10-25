---
name: python-modified-list-while-iterating-skipped-or-indexerror
description: for loop bilan list ustida iteratsiya qilayotganda listni o'zgartirish (append/remove/pop) natijasida elementlar o'tkazib yuboriladi yoki IndexError chiqadi.
---

# Python: listni iteratsiya paytida o'zgartirish — o'tkazib yuborish yoki IndexError

## Nima uchun bu skill kerak
AI kod yozayotganda listni filtrlash yoki elementlarni o'chirish kerak bo'lganda to'g'ridan-to'g'ri for loop ichida `list.remove()` yoki `del` qiladi. Bu Python'da klassik xato: iterator indexlarni oldindan hisoblab qo'yadi, list qisqarganda elementlar o'tkazib yuboriladi yoki oxirida IndexError beradi. Skill boshqa loop xatolaridan (masalan enumerate o'rniga manual index) farq qiladi — aynan mutatsiya paytida.

## Simptom (aynan shu)
- for item in my_list: ichida my_list.remove(item) yoki del my_list[i]
- Ba'zi elementlar qayta ishlanmaydi / o'tkazib yuboriladi
- Ba'zan RuntimeError yoki IndexError: list index out of range
- Natija kutilganidek emas, lekin xato doim chiqmaydi (silent skip)

## Sabab (100%)
Python list iteratori ichki indexni oshirib boradi. Loop ichida list uzunligi o'zgarsa, keyingi index noto'g'ri elementga tushadi yoki oxiridan chiqib ketadi. Iterator listning snapshotini emas, jonli holatini ko'radi.

## Tasdiqlash
1. Kodda for ... in list: ichida shu listga append/remove/pop/del borligini tekshiring.
2. Debug: loop ichida print(len(list), item) qiling — elementlar o'tkazib yuborilayotganini ko'rasiz.
3. Kichik misol bilan sinang: [1,2,3,4] dan juftlarni o'chirish — 2 o'tkazib yuboriladi.

## Tuzatish (aynan shu)
Listni o'zgartirmang — yangi list yarating yoki reverse iterate / list comprehension ishlating.

```python
# Noto'g'ri:
items = [1, 2, 3, 4, 5]
for item in items:
    if item % 2 == 0:
        items.remove(item)  # 2 o'tkazib yuboriladi, 4 qoladi

# To'g'ri 1 — yangi list:
items = [1, 2, 3, 4, 5]
filtered = [item for item in items if item % 2 != 0]

# To'g'ri 2 — reverse index (o'chirish kerak bo'lsa):
items = [1, 2, 3, 4, 5]
for i in range(len(items) - 1, -1, -1):
    if items[i] % 2 == 0:
        del items[i]

# To'g'ri 3 — filter:
items = list(filter(lambda x: x % 2 != 0, items))
```

Qoida: iteratsiya qilinayotgan kolleksiyani loop ichida o'zgartirmang. Yangi kolleksiya yarating yoki reverse dan ishlang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- for item in list: ichida listni mutate qilish elementlarni o'tkazib yuboradi yoki IndexError beradi.
- Iterator jonli listni ko'radi, snapshot emas.
- Tuzatish: list comprehension, filter, yoki reverse index bilan o'chirish.

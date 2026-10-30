---
name: python-list-remove-while-iterating
description: Ro'yxat ustida iteratsiya qilayotganda shu ro'yxatdan element o'chirish. Index siljishi tufayli elementlar o'tkazib yuboriladi yoki IndexError chiqadi.
---

# Python'da ro'yxat ustida iteratsiya qilayotganda element o'chirish

## Nima uchun bu skill kerak
Agentlar tez-tez "shartga mos kelganlarni o'chir" deb, for loop ichida list.remove() yoki del list[i] ishlatadi. Bu klassik xato: iterator indexi o'zgaradi, ba'zi elementlar o'tkazib yuboriladi, ba'zida IndexError. Natija noto'g'ri, xato yashirin.

## Simptom (aynan shu)
- for item in my_list: yoki for i in range(len(my_list)): ichida my_list.remove(item) yoki del my_list[i] chaqirilgan.
- Elementlar o'chirilgandan keyin ro'yxat uzunligi kutilganidan katta (ba'zi elementlar qolgan).
- Ba'zan IndexError: list index out of range.
- Loop oxirida "hammasi o'chirildi" deb o'ylagan, lekin tekshirganda qolgan.

## Sabab (100%)
Python for loop ichki iteratori index asosida ishlaydi. Element o'chirilganda keyingi elementlar oldinga siljiydi, iterator esa oldingi indexni oladi — bir element o'tkazib yuboriladi. range(len()) esa loop boshida hisoblangan, o'zgarmaydi.

## Tasdiqlash
1. Kodda for ... in list: yoki range(len(list)) ichida remove/del bormi?
2. O'chirish shartli (if item == something: list.remove(item))?
3. Loopdan keyin list uzunligi yoki tarkibi kutilganiga mos kelmaydimi?
4. Testda bir nechta ketma-ket mos elementlar bo'lsa, barchasi o'chganmi?

## Tuzatish (aynan shu)
Hech qachon iteratsiya qilinayotgan ro'yxatni o'zgartirma. Yangi ro'yxat qur yoki teskari yo'nalishda o'chir.

```python
# Noto'g'ri — elementlar o'tkazib yuboriladi:
items = [1, 2, 3, 2, 4]
for item in items:
    if item == 2:
        items.remove(item)
# Natija: [1, 3, 2, 4] — bitta 2 qolgan

# To'g'ri 1: yangi ro'yxat (eng toza):
items = [1, 2, 3, 2, 4]
items = [item for item in items if item != 2]
# yoki
filtered = [item for item in items if item != 2]

# To'g'ri 2: teskari yo'nalish (index bilan):
items = [1, 2, 3, 2, 4]
for i in range(len(items) - 1, -1, -1):
    if items[i] == 2:
        del items[i]

# To'g'ri 3: while + index qo'lda (kamdan-kam):
i = 0
while i < len(items):
    if items[i] == 2:
        del items[i]
    else:
        i += 1
```

Qoidalar:
- Oddiy filtr uchun list comprehension yoki filter() ishlat.
- O'chirish kerak bo'lsa, yangi ro'yxat qur yoki teskari iteratsiya.
- Hech qachon for item in list: ichida list.remove(item).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Iteratsiya qilinayotgan ro'yxatni o'zgartirish index siljishi sababli xato.
- Filtrlash uchun yangi ro'yxat qurish eng xavfsiz va o'qilishi oson yo'l.
- Teskari range yoki while + qo'lda index ham ishlaydi, lekin kamroq kerak.

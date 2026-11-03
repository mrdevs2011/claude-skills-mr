---
name: python-used-is-operator-for-integer-comparison-outside-cached-range-causing-false-when-values-equal
description: When Python code uses 'is' to compare integers that are equal in value but outside the small int cache range (-5 to 256), the comparison returns False unexpectedly. Use when seeing identity checks on numbers fail for larger integers.
---

# Python Used 'is' Operator for Integer Comparison Outside Cached Range Causing False When Values Equal

## Nima uchun bu skill kerak
Python'da 'is' operator identity (ob'ekt bir xilligi) ni tekshiradi, value equality ni emas. Kichik butun sonlar (-5 dan 256 gacha) cache qilinadi, shuning uchun a is b True bo'ladi, lekin katta sonlar uchun har safar yangi obyekt yaratiladi. Bu o'zgaruvchan xatolarga olib keladi, ayniqsa testlar yoki production kodda.

## Simptom (aynan shu)
Kodda ikkita butun son qiymati teng, lekin `if a is b:` yoki `a is b` False qaytaradi. Masalan:
```python
a = 1000
b = 1000
print(a is b)  # False (kutilgan True emas)
print(a == b)  # True
```
Yoki funksiya ichida `if result is 42:` ishlamaydi, 42 kichik bo'lsa ishlashi mumkin, lekin boshqa qiymatlarda yo'q.

## Sabab (100%)
Python CPython implementatsiyasida -5 dan 256 gacha bo'lgan butun sonlar uchun singleton cache bor (small integer cache). Bu diapazondan tashqaridagi har bir literal yoki hisoblash yangi PyLong obyekt yaratadi. 'is' operator `id(a) == id(b)` ni tekshiradi, shuning uchun qiymat teng bo'lsa ham identity farq qiladi. Bu til spetsifikatsiyasining kafolati emas, faqat CPython optimizatsiyasi.

## Tasdiqlash
1. Qiymatlarni print qil: `print(a, b, a == b, a is b, id(a), id(b))`
2. Agar a == b True, lekin a is b False va id lar farq qilsa — bu shu muammo.
3. Qiymatlarni -5..256 oralig'iga keltirib sinab ko'r: kichik sonlarda True bo'lishi mumkin.
4. `sys.intern` yoki boshqa optimizatsiyalar yo'qligini tekshir.

## Tuzatish (aynan shu)
Hech qachon 'is' ni qiymat solishtirish uchun ishlatma. Faqat `==` ishlat.

Yomon:
```python
def check_status(code):
    if code is 200:  # xato, 200 kichik bo'lsa ishlashi mumkin, lekin ishonchsiz
        return "OK"
    return "Error"
```

To'g'ri:
```python
def check_status(code):
    if code == 200:
        return "OK"
    return "Error"
```

Yoki None, True, False, yoki singleton obyektlar uchun 'is' ni saqlab qol (masalan `if result is None:`).

Agar identity haqiqatan kerak bo'lsa (kamdan-kam), `id()` yoki maxsus singleton ishlat, lekin sonlar uchun emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python'da butun sonlarni solishtirishda doim `==` ishlatish kerak, 'is' emas. 'is' faqat identity (None, True, False, yoki maxsus singleton) uchun. Kichik son cache tufayli ba'zi holatlarda ishlashi mumkin, lekin bu ishonchsiz va kod portativ emas. Bu xato o'zgaruvchan va qiyin topiladigan buglarga olib keladi.

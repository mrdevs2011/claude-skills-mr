---
name: python-compared-boolean-to-true-or-false-with-equals
description: Boolean qiymatni `== True` yoki `== False` bilan solishtirish ortiqcha va ba'zida chalkash; to'g'ridan-to'g'ri qiymatni ishlatish yoki `is` bilan identity tekshirish kerak.
---

# Boolean ni `== True`/`== False` bilan solishtirish

## Nima uchun bu skill kerak
Python da `if flag == True:` yozish ishlaydi, lekin bu ortiqcha, kamroq o'qilishi mumkin va ba'zi hollarda (custom `__eq__` bo'lsa) kutilmagan natija beradi. To'g'ridan-to'g'ri `if flag:` yoki aniq identity uchun `is True` afzal.

## Simptom (aynan shu)
Kodda `if something == True:` yoki `if something == False:` ko'rinishi bor. Ba'zida bu ishlaydi, lekin style checker yoki reviewer uni qisqartirishni so'raydi. Custom classda `__eq__` override qilingan bo'lsa, `== True` True qaytarishi mumkin, lekin `bool(obj)` False.

## Sabab (100%)
Booleanlar `True` va `False` — ular `int` ning subclasslari (`True == 1`, `False == 0`). `==` qiymat solishtiradi, identity emas. To'g'ridan-to'g'ri truthiness ishlatish aniqroq va Pythonic. `is True` faqat aynan boolean True bo'lishini tekshiradi (1 emas).

## Tasdiqlash
Kodni qidir: `== True`, `== False`, `!= True`, `!= False`. Test:

```python
class Weird:
    def __eq__(self, other):
        return True  # har doim True

w = Weird()
print(w == True)   # True
print(bool(w))     # False (agar __bool__ yo'q)
print(w is True)   # False
```

Oddiy holatda ham `if x == True:` o'rniga `if x:` o'qilishi yaxshiroq.

## Tuzatish (aynan shu)
To'g'ridan-to'g'ri truthiness ishlat:

```python
# Noto'g'ri / ortiqcha
if is_valid == True:
    process()
if error == False:
    continue

# To'g'ri
if is_valid:
    process()
if not error:
    continue

# Aynan boolean True/False kerak bo'lsa (1 yoki boshqa truthy emas)
if value is True:
    special_case()
if value is False:
    other()
```

Agar `None` ni ham farqlash kerak bo'lsa: `if value is True:` yoki `if value is not None and value:`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Boolean solishtirishda `== True`/`== False` o'rniga to'g'ridan-to'g'ri `if value:` yoki `if not value:` ishlat. Bu qisqaroq, o'qilishi yaxshi va custom `__eq__` tuzog'idan qochadi. Aynan identity kerak bo'lsa `is True`/`is False` ishlat.

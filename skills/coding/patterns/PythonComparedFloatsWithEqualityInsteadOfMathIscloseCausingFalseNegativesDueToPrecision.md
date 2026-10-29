---
name: python-compared-floats-with-equality-instead-of-math-isclose
description: Python float comparison with == or != fails due to binary floating-point precision, causing unexpected False/True on nearly equal values. Use math.isclose instead.
---

# Python Float Equality Comparison Fails Due to Precision Instead of math.isclose

## Nima uchun bu skill kerak
Python (va ko'p tillarda) float sonlar binary IEEE 754 da saqlanadi. 0.1 + 0.2 != 0.3 bo'ladi. Agent yoki dasturchi oddiy `==` ishlatib, "to'g'ri hisoblangan" qiymatlarni teng emas deb topadi, testlar yiqiladi yoki logika noto'g'ri ishlaydi. Bu klassik "silent wrong result" holati.

## Simptom (aynan shu)
- `assert a == b` yoki `if x == 0.3` ishlamaydi, garchi matematik jihatdan teng bo'lishi kerak.
- `print(0.1 + 0.2)` → 0.30000000000000004
- Ikki hisoblash natijasi deyarli bir xil, lekin `==` False qaytaradi.
- Test "AssertionError" yoki shart bajarilmaydi, hech qanday exception yo'q.

## Sabab (100%)
Binary floating-point representation: ba'zi o'nli kasrlar (0.1, 0.2) aniq ifodalanmaydi. Oddiy `==` operator bit-to-bit tenglikni tekshiradi, "yetarli darajada yaqin" emas. `math.isclose` yoki `decimal` ishlatilmagan.

## Tasdiqlash
- Qiymatlar float tipidami?
- Farq juda kichik (`abs(a - b) < 1e-9`) lekin `a == b` False mi?
- Matematik jihatdan teng bo'lishi kutilganmi (masalan, summa, o'rtacha, formuladan)?
- `math.isclose(a, b)` True qaytaradimi?

## Tuzatish (aynan shu)
`math.isclose` ishlat. Default `rel_tol=1e-09`, `abs_tol=0.0`. Kerak bo'lsa sozla.

```python
import math

# Noto'g'ri
if 0.1 + 0.2 == 0.3:
    print("teng")  # hech qachon ishlamaydi

# To'g'ri
if math.isclose(0.1 + 0.2, 0.3):
    print("teng")

# Absolyut tolerans bilan
if math.isclose(a, b, abs_tol=1e-6):
    ...
```

Agar aniq o'nli kasr kerak bo'lsa (pul, moliya), `decimal.Decimal` ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Floatlarni hech qachon `==` bilan solishtirma. `math.isclose` yoki mos tolerans bilan tekshir. Bu precision tufayli yuzaga keladigan "silent wrong result" yoki test failurelarni oldini oladi.

---
name: python-used-unbounded-recursion-for-deep-or-large-input-risking-recursionerror
description: When recursive function has no depth limit or base case that scales, large or deep input raises RecursionError. Use when processing trees, nested structures, or recursive algorithms on user-controlled size data.
---

# Python: cheksiz rekursiya katta/chuqur inputda RecursionError beradi

## Nima uchun bu skill kerak
Rekursiya go'zal, lekin Python default recursion limit ~1000. Chuqur daraxt, uzun zanjir yoki foydalanuvchi boshqaradigan hajmda ishlatilsa, RecursionError chiqadi va dastur yiqiladi. Iterativ yoki chuqurlik nazoratli yechim kerak.

## Simptom (aynan shu)
`RecursionError: maximum recursion depth exceeded` xatosi. Kichik inputda ishlaydi, katta yoki chuqur inputda (nested JSON, daraxt, uzun ro'yxat) yiqiladi. Stack overflow ga o'xshash.

## Sabab (100%)
Rekursiv funksiya har chaqiruvda yangi frame ochadi, base case yetarli chuqurlikda ishlamaydi yoki input hajmi limitdan oshadi. `sys.setrecursionlimit` faqat vaqtincha yordam, asosiy muammo algoritm.

## Tasdiqlash
1. Kodda rekursiv chaqiruv borligini ko'r.
2. Input chuqurligini oshirib sinab ko'r (masalan 2000 darajali nested dict).
3. Xato chiqsa va stack frame'lar ko'p bo'lsa — shu holat.

## Tuzatish (aynan shu)
Iterativ yondashuv yoki explicit stack ishlat. Agar rekursiya shart bo'lsa, chuqurlikni kuzat va limit qo'y.

```python
# Yomon (chuqur inputda RecursionError):
def process_nested(data):
    if not isinstance(data, dict):
        return data
    return {k: process_nested(v) for k, v in data.items()}

# To'g'ri (iterativ, stack bilan):
def process_nested(data):
    stack = [data]
    # yoki collections.deque, va natijani qurish
    # ... aniq iterativ logika
    return result

# Yoki chuqurlik nazorati:
def process_nested(data, depth=0, max_depth=100):
    if depth > max_depth:
        raise ValueError("Max depth exceeded")
    if not isinstance(data, dict):
        return data
    return {k: process_nested(v, depth + 1, max_depth) for k, v in data.items()}
```

Eng yaxshisi: rekursiyani umuman olib tashlab, loop + stack ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python rekursiyasi cheklangan. Katta yoki chuqur ma'lumot uchun iterativ yechim yoki explicit depth limit ishlat. `sys.setrecursionlimit`ni ishonchli yechim deb hisoblama — u boshqa muammolarni yashiradi.

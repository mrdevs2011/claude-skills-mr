---
name: python-custom-class-missing-eq-hash-for-set-or-dict-key
description: Custom Python class used as set element or dict key without implementing __eq__ and __hash__, causing identity-based comparison and unexpected duplicates or KeyError.
---

# Custom class set yoki dict key sifatida ishlatilganda __eq__ va __hash__ yo'q

## Nima uchun bu skill kerak
Agentlar yoki dasturchilar oddiy class yaratib, uni set yoki dict key sifatida ishlatadi, lekin __eq__ va __hash__ ni belgilamaydi. Natijada object identity (id) asosida solishtiriladi, bir xil qiymatli obyektlar alohida hisoblanadi, set da dublikatlar qoladi yoki dict da topilmaydi.

## Simptom (aynan shu)
- class MyClass: def __init__(self, val): self.val = val  (faqat shu, __eq__/__hash__ yo'q)
- s = set(); s.add(MyClass(1)); s.add(MyClass(1))  → len(s) == 2
- d = {}; d[MyClass(1)] = "a"; print(d[MyClass(1)])  → KeyError yoki boshqa qiymat
- "unhashable type" yoki kutilmagan dublikatlar.
- Dataclass yoki namedtuple ishlatilmagan.

## Sabab (100%)
Python default __eq__ va __hash__ identity (id()) ga asoslangan. Qiymat bo'yicha tenglik kerak bo'lganda (set/dict key) ularni override qilish shart. Agent "class oddiy" deb o'ylab, hashability ni unutadi.

## Tasdiqlash
1. class da __eq__ va __hash__ (yoki @dataclass(frozen=True)) bormi?
2. Obyekt set.add yoki dict[obj] da ishlatilganmi?
3. Bir xil qiymatli ikkita obyekt set da bitta bo'lishi kerakmi?
4. Agar mutable bo'lsa, hash qilinmasligi kerak (TypeError).

## Tuzatish (aynan shu)
__eq__ va __hash__ qo'sh (yoki frozen dataclass ishlat):

```python
# Noto'g'ri:
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

s = set([Point(1, 2), Point(1, 2)])  # len == 2

# To'g'ri:
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))

s = set([Point(1, 2), Point(1, 2)])  # len == 1

# Yoki:
from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: int
    y: int
```

Mutable obyektni hash qilma. Kerak bo'lsa id() yoki boshqa unique key ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Custom class ni set yoki dict key qilmoqchi bo'lsang, __eq__ va __hash__ ni (yoki frozen dataclass) albatta qo'sh. Aks holda identity asosida ishlaydi, dublikatlar va KeyError chiqadi. Mutable bo'lsa hash qilinmasin.

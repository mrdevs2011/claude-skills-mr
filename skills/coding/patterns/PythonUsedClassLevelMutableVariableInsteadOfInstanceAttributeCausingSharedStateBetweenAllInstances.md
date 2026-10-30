---
name: python-class-level-mutable-variable-shared-state
description: Python klassida mutable o'zgaruvchi (list, dict) class darajasida e'lon qilingan — barcha instance'lar bir xil obyektni ulashadi, kutilmagan shared state mutatsiyasi.
---

# Python klass darajasidagi mutable o'zgaruvchi barcha instance'lar o'rtasida shared state yaratadi

## Nima uchun bu skill kerak
Python'da class body ichida `items = []` yoki `cache = {}` kabi mutable obyekt e'lon qilinsa, bu class attribute bo'lib, barcha instance'lar bir xil obyektga ishora qiladi. Instance attribute sifatida `self.items = []` qilinmasa, bir instance'da o'zgartirish boshqalariga ta'sir qiladi. Bu odatda kutilmagan bug'larga olib keladi, ayniqsa default qiymatlar yoki cache uchun ishlatilganda.

## Simptom (aynan shu)
- Klass ichida class body'da mutable default: `class Foo: items = []`
- Bir nechta instance yaratilgan: `a = Foo(); b = Foo()`
- `a.items.append(1)` qilinganda `b.items` ham `[1]` bo'lib qoladi.
- Yoki dict uchun: bir instance cache'ni to'ldirsa, boshqa instance ham o'sha cache'ni ko'radi.
- Xato faqat runtime'da, bir nechta obyekt bilan ishlaganda namoyon bo'ladi.
- Testlar bitta instance bilan o'tadi, production'da bir nechta bilan buziladi.

## Sabab (100%)
Class body'da bajarilgan assignment class attribute yaratadi. Mutable obyektlar (list, dict, set, custom mutable) reference type. Instance'da `self.items` yo'q bo'lsa, Python class attribute'ni qidiradi va bir xil obyektni qaytaradi. Bu immutable'lar (int, str, tuple) uchun muammo emas, chunki reassignment yangi obyekt yaratadi.

## Tasdiqlash
- Klass ta'rifida class body ichida `= []` yoki `= {}` bormi?
- `__init__` ichida `self.xxx = []` yoki `self.xxx = {}` yo'qmi?
- Bir nechta instance yaratib, birida mutatsiya qilib, boshqasida o'zgarish kuzatiladimi?
- `id(a.items) == id(b.items)` True qaytaradimi?

## Tuzatish (aynan shu)
Har doim instance-specific mutable'larni `__init__` ichida yarat:

```python
# Noto'g'ri
class TaskManager:
    tasks = []  # class-level, shared

    def add(self, task):
        self.tasks.append(task)

# To'g'ri
class TaskManager:
    def __init__(self):
        self.tasks = []  # instance-level, alohida

    def add(self, task):
        self.tasks.append(task)
```

Agar class-level cache kerak bo'lsa (haqiqatan shared), aniq hujjatlashtir va immutable yoki lock ishlat. Default qiymat uchun `None` + check:

```python
def __init__(self, tasks=None):
    self.tasks = tasks if tasks is not None else []
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Class body'dagi mutable assignment barcha instance'lar uchun bitta shared obyekt yaratadi. Instance holati uchun har doim `__init__` ichida `self.attr = mutable()` qil. Bu shared state bug'ini oldini oladi va test/production mosligini ta'minlaydi.

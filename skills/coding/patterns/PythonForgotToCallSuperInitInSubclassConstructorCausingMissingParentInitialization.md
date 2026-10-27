---
name: python-forgot-super-init-in-subclass
description: Python subclass konstruktorida super().__init__() chaqirilmaganda, parent class holati initsializatsiya qilinmaydi — AttributeError yoki noto'g'ri holat.
---

# Python subclass'da super().__init__() unutilgan

## Nima uchun bu skill kerak
Python'da inheritance ishlatganda, subclass `__init__` metodi parent classning `__init__`ini avtomatik chaqirmaydi. Agentlar ko'pincha subclass yaratib, o'z atributlarini o'rnatishadi, lekin parent'ning initsializatsiyasini unutishadi. Natijada parent holati yo'q, keyin AttributeError yoki mantiqiy xatolar chiqadi.

## Simptom (aynan shu)
- Subclass `__init__(self, ...)` yozilgan, lekin ichida `super().__init__(...)` yoki `ParentClass.__init__(self, ...)` yo'q.
- Subclass obyektini yaratgandan keyin parent class atributlariga murojaat qilganda `AttributeError: 'Child' object has no attribute 'parent_attr'`.
- Parent class metodlari chaqirilganda kutilgan holat yo'q, noto'g'ri natija yoki crash.
- Hech qanday xato konstruktor vaqtida chiqmaydi — keyinroq paydo bo'ladi.

## Sabab (100%)
Python multiple inheritance va method resolution order (MRO) tufayli, `__init__` avtomatik chaqirilmaydi. Subclass o'z `__init__`ini yozgan bo'lsa, parent'niki faqat aniq `super()` orqali chaqiriladi. Aks holda parent holati hech qachon o'rnatilmaydi.

## Tasdiqlash
1. Subclass faylida `__init__` borligini va ichida `super().__init__` yoki explicit parent call bor-yo'qligini tekshir.
2. Obyekt yaratib, `dir(instance)` yoki `hasattr(instance, 'expected_parent_attr')` bilan parent atributi mavjudligini ko'r.
3. Parent class `__init__`ida o'rnatiladigan atributlar subclass'da yo'qmi?
4. `super().__init__()` qo'shib qayta sinasa, xato yo'qoladimi?

## Tuzatish (aynan shu)
Har doim subclass `__init__` boshida (yoki kerakli joyda) `super().__init__(...)` chaqir. Argumentlarni to'g'ri uzat.

```python
# Noto'g'ri (parent init yo'q):
class Parent:
    def __init__(self, name):
        self.name = name
        self.created = True

class Child(Parent):
    def __init__(self, name, age):
        # super() yo'q!
        self.age = age

c = Child("Ali", 10)
print(c.name)  # AttributeError!

# To'g'ri:
class Child(Parent):
    def __init__(self, name, age):
        super().__init__(name)  # parent holatini o'rnat
        self.age = age

c = Child("Ali", 10)
print(c.name)  # "Ali"
print(c.age)   # 10
```

Agar parent `__init__` argument qabul qilmasa ham, `super().__init__()` chaqir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Subclass yaratganda `__init__` yozsangiz, parent class initsializatsiyasini o'zingiz chaqirishingiz shart. `super().__init__()` unutilsa, parent holati yo'qoladi va keyinchalik AttributeError yoki mantiqiy buglar chiqadi. Har doim super chaqiruvni qo'shing.

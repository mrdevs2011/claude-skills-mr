---
name: python-used-explicit-super-class-name-self-init-instead-of-super
description: Agent or developer used ParentClass.__init__(self, ...) style super call in Python 3 class instead of super().__init__(...), which breaks cooperative multiple inheritance and MRO. Use zero-argument super() in Python 3.
---

# Python Used Explicit Super Class Name Self Init Call Instead Of Super In Python 3 Causing MRO Or Multiple Inheritance Issues

## Nima uchun bu skill kerak
Python 3 da `super()` zero-argument shakli MRO (method resolution order) bo'yicha to'g'ri ishlaydi, ayniqsa multiple inheritance da. Eski `Parent.__init__(self, ...)` usuli faqat bitta ota-ona bilan ishlaydi va cooperative inheritance ni buzadi. Agentlar ko'pincha eski uslubni yozib qo'yadi.

## Simptom (aynan shu)
- Klass ichida `__init__` yoki boshqa metodda `SomeParent.__init__(self, arg)` yoki `SomeParent.method(self, ...)` chaqirilgan.
- Multiple inheritance ishlatilganda noto'g'ri init ketma-ketligi yoki ba'zi ota-onalar init qilinmaydi.
- MRO xatosi yoki kutilmagan atribut yo'qligi.
- Python 3 kodida eski Python 2 uslubi ishlatilgan.

## Sabab (100%)
Python 3 da `super()` joriy klass va instansni avtomatik oladi va MRO bo'yicha keyingi klassni topadi. Explicit `Parent.__init__(self)` faqat shu Parent ni chaqiradi, keyingi klasslarni o'tkazib yuboradi. Bu multiple inheritance (mixin) da xato.

## Tasdiqlash
- Kodda `ClassName.__init__(self` yoki `ClassName.method(self` bor mi?
- Bu subclass ichidami va super chaqiruvmi?
- `super()` ishlatilmaganmi?
- Agar ha — noto'g'ri.

## Tuzatish (aynan shu)
Python 3 da doim `super()` ishlat:

```python
class Child(Parent):
    def __init__(self, arg):
        super().__init__(arg)  # to'g'ri, zero-arg super()
        # ... qolgani
```

Multiple inheritance uchun:

```python
class MixinA:
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # ...

class MixinB:
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # ...

class Combined(MixinA, MixinB):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
```

Eski uslubni almashtir: `Parent.__init__(self, x)` → `super().__init__(x)`

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python 3 da super chaqiruv uchun `super()` ishlat, explicit `Parent.__init__(self)` emas. Bu MRO va multiple inheritance ni to'g'ri qo'llab-quvvatlaydi. Bu skill agentning keng tarqalgan eski uslub xatosini tuzatadi.

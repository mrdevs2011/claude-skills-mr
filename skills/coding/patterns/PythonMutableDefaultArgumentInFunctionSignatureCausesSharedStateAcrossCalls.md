---
name: python-mutable-default-argument-shared-state
description: Python funksiyasida list yoki dict kabi mutable default argument ishlatilganda, chaqiruvlar orasida holat saqlanib qoladi — kutilmagan shared state bug.
---

# Python funksiyasida mutable default argument shared state bugi

## Nima uchun bu skill kerak
Python'da default argumentlar funksiya aniqlangan paytda bir marta baholanadi. Agar default qiymat mutable (list, dict, set) bo'lsa, barcha chaqiruvlar o'sha bitta obyektni bo'lishadi. Agentlar ko'pincha "qulay" deb `def foo(items=[])` yozishadi, keyin append qilishadi va bug paydo bo'ladi.

## Simptom (aynan shu)
- Funksiya `def process(items=[])` yoki `def config(opts={})` kabi mutable default bilan e'lon qilingan.
- Funksiyani bir necha marta chaqirganda, oldingi chaqiruvdagi o'zgarishlar keyingisiga o'tib ketadi (list o'sib boradi, dict kalitlari to'planadi).
- Birinchi chaqiruv to'g'ri ishlaydi, keyingilari kutilmagan ma'lumot bilan qaytadi.
- Hech qanday global o'zgaruvchi yo'q, lekin holat "eslab qolinyapti".

## Sabab (100%)
Python default argumentlarni funksiya definition vaqtida bir marta evaluate qiladi. Mutable obyekt (list, dict) shu paytda yaratiladi va keyingi barcha chaqiruvlar o'sha bitta instance'ni oladi. Har safar yangi bo'sh list yaratilmaydi.

## Tasdiqlash
1. Funksiya imzosini tekshir: default qiymat `[]`, `{}`, `set()` yoki boshqa mutablemi?
2. Funksiyani ikki marta chaqirib, ikkinchisida birinchi chaqiruvning o'zgarishi ko'rinyaptimi?
3. `id(default_value)` yoki print qilib bir xil obyekt ekanini tasdiqla.
4. Agar default `None` qilib, ichida `if items is None: items = []` qilsang, muammo yo'qoladimi?

## Tuzatish (aynan shu)
Hech qachon mutable default ishlatma. `None` ishlatib, funksiya ichida yangi obyekt yarat:

```python
# Noto'g'ri (shared state):
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("a"))  # ['a']
print(add_item("b"))  # ['a', 'b']  <-- kutilmagan!

# To'g'ri:
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

print(add_item("a"))  # ['a']
print(add_item("b"))  # ['b']  <-- to'g'ri
```

Xuddi shu dict, set va boshqa mutable tiplar uchun ham.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Python'da mutable default argumentlar chaqiruvlar orasida shared bo'ladi.
- Har doim `None` default qilib, ichida yangi obyekt yarat.
- Bu klassik Python tuzog'i — agentlar ko'pincha shu xatoga yo'l qo'yadi.

---
name: python-mutable-default-argument-shared-state
description: Python funksiyada mutable default argument (list/dict) ishlatilganda har chaqiruvda bir xil obyekt qayta ishlatiladi va kutilmagan shared state paydo bo'ladi.
---

# Python mutable default argument shared state

## Nima uchun bu skill kerak
Python'da default argumentlar funksiya ta'rifi paytida bir marta baholanadi. Mutable obyekt (list, dict, set) default qilib qo'yilsa, barcha chaqiruvlar o'sha bitta obyektni baham ko'radi. Bu odatda kutilmagan side-effect va "qandaydir narsa to'planib qoladi" simptomini beradi.

## Simptom (aynan shu)
Funksiya har chaqirilganda yangi bo'sh list/dict kutilyapti, lekin oldingi chaqiruvdagi qiymatlar saqlanib qoladi yoki o'zgaradi. Misol:

```python
def append_item(item, items=[]):
    items.append(item)
    return items

print(append_item(1))  # [1]
print(append_item(2))  # [1, 2]  — kutilgan [2] emas
```

Yoki dict uchun xuddi shunday "oldingi kalitlar qoladi".

## Sabab (100%)
Default argument qiymati funksiya ta'riflangan paytda bir marta yaratiladi va har chaqiruvda o'sha obyekt qayta ishlatiladi. Mutable bo'lgani uchun o'zgarishlar saqlanib qoladi. `None` ishlatib ichkarida yangi obyekt yaratish kerak.

## Tasdiqlash
1. Funksiya signature'ida default sifatida `[]`, `{}`, yoki boshqa mutable borligini tekshir.
2. Funksiyani bir necha marta chaqirib, oldingi natija yangisiga ta'sir qilayotganini kuzat.
3. `id(default_arg)` ni print qilib, har safar bir xil id chiqishini tasdiqla.

## Tuzatish (aynan shu)
Default'ni `None` qilib, funksiya ichida yangi obyekt yarat:

```python
def append_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

print(append_item(1))  # [1]
print(append_item(2))  # [2]
```

Dict uchun ham xuddi shunday:

```python
def update_config(key, value, config=None):
    if config is None:
        config = {}
    config[key] = value
    return config
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python default argumentlar bir marta baholanadi. Mutable default ishlatmang; `None` + ichkarida yangi yaratish bilan shared state muammosini oldini ol.

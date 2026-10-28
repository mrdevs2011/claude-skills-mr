---
name: python-mutable-default-argument-shared-state
description: Python funksiyasida mutable default argument (list, dict) ishlatilganda, u barcha chaqiruvlar o'rtasida bir xil obyektni ulashadi va kutilmagan holat o'zgarishlariga olib keladi.
---

# PythonUsedMutableDefaultArgumentInFunctionDefinitionLeadingToSharedStateBetweenCalls

## Nima uchun bu skill kerak
Python'da funksiya parametriga mutable obyekt (list, dict, set) ni default qiymat sifatida berish keng tarqalgan xato. Bu default qiymat funksiya aniqlangan paytda bir marta yaratiladi va keyingi barcha chaqiruvlarda shu bir xil obyekt qayta ishlatiladi. Natijada bir chaqiruvdagi o'zgarishlar keyingilarida saqlanib qoladi.

## Simptom (aynan shu)
Funksiya chaqirilganda default argument sifatida bo'sh list yoki dict kutiladi, lekin avvalgi chaqiruvlarda qo'shilgan elementlar hali ham ichida turibdi. Masalan:
```python
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item(1))  # [1]
print(add_item(2))  # [1, 2]  ← kutilgan [2]
```

## Sabab (100%)
Default argument qiymatlari funksiya ta'rifi vaqtida (definition time) baholanadi, chaqiruv vaqtida emas. Mutable obyektlar reference bilan saqlanadi, shuning uchun barcha chaqiruvlar bir xil list/dict ni o'zgartiradi.

## Tasdiqlash
- Funksiya ta'rifida `param=[]` yoki `param={}` ko'rinishi.
- Bir necha marta chaqirib, avvalgi natijalar to'planib qolayotganini tekshirish.
- `id(items)` ni har chaqiruvda chop etib, bir xil id ekanligini ko'rish.

## Tuzatish (aynan shu)
Default sifatida `None` ishlating va funksiya ichida yangi obyekt yarating:

```python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

print(add_item(1))  # [1]
print(add_item(2))  # [2]
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
Python'da mutable default argumentlar funksiya ta'rifi vaqtida bir marta yaratiladi va chaqiruvlar o'rtasida ulashiladi. Har doim `None` default ishlating va ichida yangi list/dict yarating.

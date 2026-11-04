---
name: python-mutable-default-argument-shared-state
description: Python funksiyasida mutable default argument (list/dict) ishlatilganda har chaqiruvda bir xil obyekt qayta ishlatiladi va kutilmagan shared state paydo bo'ladi.
---

# Mutable default argument shared state

## Nima uchun bu skill kerak
Python'da default argumentlar funksiya ta'rifi paytida bir marta baholanadi. Agar default `[]` yoki `{}` bo'lsa, barcha chaqiruvlar o'sha bitta obyektni baham ko'radi. Bu silent bug: keyingi chaqiruvlarda oldingi ma'lumotlar qoladi. Ko'p hollarda bu xato kutilmagan natija yoki "state leks" ga olib keladi.

## Simptom (aynan shu)
- Funksiya ta'rifida `def foo(items=[]):` yoki `def foo(config={}):` bor.
- Birinchi chaqiruvdan keyin ikkinchi chaqiruvda ro'yxat yoki dictda eski elementlar qolgan.
- Testlar bir-biriga ta'sir qiladi (test isolation yo'qoladi).
- "Nega oldingi qiymat qoldi?" deb hayron bo'lasiz.

## Sabab (100%)
Default argument qiymati funksiya obyekti yaratilganda (def bajarilganda) bir marta hisoblanadi va `__defaults__` da saqlanadi. Mutable obyekt (`list`, `dict`, `set`) o'zgartirilsa, o'zgarish keyingi chaqiruvlarga o'tadi. Immutable (`None`, `int`, `str`, `tuple`) bilan bu muammo yo'q.

## Tasdiqlash
1. Funksiya signature'da default `[]` yoki `{}` bormi?
2. Funksiya ichida shu argumentga `.append()`, `.extend()`, `key = value` qilinadimi?
3. Funksiyani ikki marta ketma-ket chaqirsang, ikkinchisida eski ma'lumot qoladimi?
4. `inspect.signature` yoki `func.__defaults__` orqali bir xil obyekt ekanini tekshirish mumkin.

## Tuzatish (aynan shu)
Default'ni `None` qilib, funksiya ichida yangi obyekt yarat.

Xato:
```python
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("a"))  # ['a']
print(add_item("b"))  # ['a', 'b']  — kutilmagan!
```

To'g'ri:
```python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

print(add_item("a"))  # ['a']
print(add_item("b"))  # ['b']
```

Yoki dict uchun:
```python
def update_config(key, value, config=None):
    if config is None:
        config = {}
    config[key] = value
    return config
```

Agar default qiymat kerak bo'lsa va immutable bo'lsa, to'g'ridan-to'g'ri ishlatish mumkin:
```python
def foo(name="default"):  # str immutable, xavfsiz
    ...
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Mutable default argumentlar funksiya ta'rifi paytida bir marta yaratiladi va shared bo'ladi.
- Doim `None` default ishlatib, ichkarida yangi `[]`/`{}` yarat.
- Bu Python'ning eng mashhur "gotcha"laridan biri — silent shared state.
- Immutable default'lar (None, str, int, tuple) xavfsiz.

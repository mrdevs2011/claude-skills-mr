---
name: python-used-equality-operator-to-check-none-instead-of-is
description: Python'da None tekshiruvi uchun == yoki != ishlatilganda, identity (is / is not) o'rniga. Qachon: if x == None yoki if x != None ko'rinadi.
---

# Python None tekshiruvida == ishlatildi, is o'rniga

## Nima uchun bu skill kerak
Python'da `None` singleton obyekt. Uni tekshirish uchun `is` / `is not` ishlatiladi, chunki identity check aniq va tez. `==` / `!=` `__eq__` chaqirishi mumkin, override qilingan class'larda noto'g'ri natija beradi yoki xato chiqaradi. Bu keng tarqalgan anti-pattern.

## Simptom (aynan shu)
- Kodda `if value == None:` yoki `if value != None:` yozilgan.
- `None` bilan solishtirishda equality operator ishlatilgan.
- Ba'zi hollarda custom class `__eq__` override qilganida noto'g'ri True/False yoki exception.

## Sabab (100%)
Agent yoki dasturchi C-like tillardan o'rganilgan odat bilan `==` ishlatdi. Python'da `None` uchun identity (`is`) standart va tavsiya etiladi (PEP 8).

## Tasdiqlash
1. Kodda `== None` yoki `!= None` qidir.
2. `is None` / `is not None` bilan almashtirilganmi?
3. Agar custom class bo'lsa, `__eq__` `None` bilan qanday ishlashini tekshir.

## Tuzatish (aynan shu)
Har doim identity operator ishlat:

```python
# Noto'g'ri
if result == None:
    handle_missing()
if result != None:
    process(result)

# To'g'ri
if result is None:
    handle_missing()
if result is not None:
    process(result)
```

Shuningdek, `True` va `False` uchun ham `is True` / `is False` afzal (lekin ba'zi hollarda `==` qabul qilinadi). `None` uchun esa doim `is`.

Linter (ruff, pylint, flake8) odatda `E711` / `E712` bilan ogohlantiradi — shuni yoq.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python'da `None` tekshiruvi uchun `==` o'rniga `is` / `is not` ishlatiladi. Bu singleton identity'ni aniq tekshiradi, custom `__eq__` dan mustaqil va PEP 8 standartiga mos.

---
name: python-set-unique-expected-order
description: Python set ishlatilganda unique elementlar kerak, lekin original insertion order saqlanishi kutilganda tartib yo'qolishi.
---

# Python set unique uchun ishlatilganda tartib yo'qolishi

## Nima uchun bu skill kerak
Kodda unique qiymatlarni saqlash uchun set ishlatiladi, keyin iteratsiya qilinganda original qo'shilish tartibi kutiladi (masalan UI ro'yxati, testlar, loglar). Set tartibni saqlamaydi, natija flaky yoki noto'g'ri bo'ladi.

## Simptom (aynan shu)
- `set` yaratib, elementlarni qo'shib, keyin `for item in my_set:` yoki `list(my_set)` qilinganda tartib o'zgaradi.
- Testlar ba'zan o'tadi, ba'zan yo'q (order-dependent).
- Frontend yoki chiqishda elementlar kutilmagan tartibda chiqadi.
- Hech qanday xato yo'q, lekin natija noto'g'ri yoki nostabil.

## Sabab (100%)
Python `set` — unordered collection. Hash asosida saqlanadi, insertion order kafolatlanmaydi (dictlar 3.7+ dan tartibni saqlaydi, setlar hech qachon).

## Tasdiqlash
1. Kodda `set()` yoki `{...}` ishlatilganini tekshir.
2. Keyin iteratsiya yoki tartibga bog'liq ish qilinganini qara.
3. `print(list(my_set))` ni bir necha marta ishga tushirib tartib o'zgarishini kuzat.

## Tuzatish (aynan shu)
Tartibni saqlab unique qilish uchun `dict.fromkeys` ishlat (Python 3.7+ tartibni saqlaydi):

```python
# Noto'g'ri
items = ["a", "b", "a", "c"]
unique = set(items)
print(list(unique))  # tartib kafolatlanmagan: ['b', 'a', 'c'] yoki boshqa

# To'g'ri
items = ["a", "b", "a", "c"]
unique = list(dict.fromkeys(items))
print(unique)  # ['a', 'b', 'c'] — original tartib saqlangan
```

Yoki ko'rganlarni kuzatish:

```python
seen = set()
unique = []
for item in items:
    if item not in seen:
        seen.add(item)
        unique.append(item)
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Set faqat unique uchun, tartib kerak bo'lsa `dict.fromkeys` yoki manual seen set + list ishlat. Tartib muhim bo'lgan joyda setdan qoch.

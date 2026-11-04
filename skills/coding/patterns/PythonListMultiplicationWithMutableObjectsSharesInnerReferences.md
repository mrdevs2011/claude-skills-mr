---
name: python-list-multiplication-with-mutable-objects-shares-inner-references
description: List multiplication (`*` operator) with mutable objects (lists, dicts) creates shared references for the inner objects, so mutating one row mutates all. Use list comprehension to create independent copies.
---

# List multiplication bilan mutable obyektlar shared reference yaratadi

## Nima uchun bu skill kerak
Python da `*` operatori listni takrorlaydi, lekin ichki obyektlar bir xil reference bo'ladi. Natijada bir qatorni o'zgartirsangiz, boshqalari ham o'zgaradi — kutilmagan shared state.

## Simptom (aynan shu)
2D grid yoki matritsa yaratishda `[[0] * cols] * rows` yoki `[[] * n] * m` ishlatilganda, bir katakni o'zgartirish barcha qatorlarni o'zgartiradi. Masalan:

```python
grid = [[0] * 3] * 2
grid[0][0] = 1
print(grid)  # [[1, 0, 0], [1, 0, 0]] — kutilmagan
```

## Sabab (100%)
`*` operatori shallow copy qiladi: tashqi list yangi elementlar (bir xil ichki list reference) bilan to'ldiriladi. Ichki list bir marta yaratiladi va ko'paytiriladi. Mutable bo'lgani uchun o'zgarishlar hamma joyda ko'rinadi.

## Tasdiqlash
Kodda `* rows` yoki `* n` bilan list-of-lists yoki mutable ichki obyektlar yaratilganligini qidir. Test:

```python
rows = [[0] * 3] * 2
print(id(rows[0]) == id(rows[1]))  # True — bir xil obyekt
```

## Tuzatish (aynan shu)
Har bir qator uchun yangi list yaratish uchun list comprehension ishlat:

```python
# Noto'g'ri — shared
grid = [[0] * cols] * rows

# To'g'ri — independent
grid = [[0] * cols for _ in range(rows)]

# Yoki mutable default uchun
matrix = [[] for _ in range(n)]
```

Agar immutable (int, str, tuple) bo'lsa, `*` xavfsiz.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`[[] * n] * m` yoki `[[0]*cols]*rows` ichki listlarni share qiladi. Independent 2D struktura uchun doim list comprehension `[... for _ in range(...)]` ishlat. Bu klassik Python tuzoqlaridan biri.

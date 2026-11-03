---
name: python-list-plus-in-loop-quadratic
description: Loop ichida result = result + [item] yoki result += [item] bilan list yig'ish O(n²) vaqt va xotira sarflaydi. extend() yoki append() ishlating.
---

# Loop ichida list + operatori bilan yig'ish kvadratik sekinlashishga olib keladi

## Nima uchun bu skill kerak
Python'da list yig'ishda `result = result + [item]` yoki `result += [item]` ishlatilganda har safar yangi list yaratiladi va oldingi elementlar ko'chiriladi. Bu O(n²) vaqt murakkabligiga olib keladi. Model yoki dasturchi oddiy `+=` ni efficient deb o'ylashi mumkin, lekin list uchun bu emas.

## Simptom (aynan shu)
Kodda loop ichida shunday qatorlar:
```python
result = []
for item in items:
    result = result + [item]   # yoki result += [item]
```
Yoki katta data ustida sekin ishlaydigan list accumulation. Profilingda list copy ko'rinadi.

## Sabab (100%)
Python'da `list + list` har doim yangi list qaytaradi. `+=` list uchun `extend` ga o'xshash, lekin `result += [item]` hali ham yangi temporary list yaratadi. Har iteratsiyada O(n) ish bajariladi, jami O(n²). `append` yoki `extend` amortizatsiyalangan O(1).

## Tasdiqlash
1. Loop ichida `+` yoki `+=` bilan bitta elementli list qo'shilayotganini top.
2. `timeit` yoki profiler bilan katta n (masalan 10_000) da o'lcha — append'dan sekinroq ekanini ko'r.
3. `id(result)` o'zgarishini tekshir — har safar yangi obyekt.

## Tuzatish (aynan shu)
`append` yoki `extend` ishlat:

```python
# Noto'g'ri (O(n²))
result = []
for item in items:
    result = result + [item]  # yoki result += [item]

# To'g'ri (amortizatsiyalangan O(1) per item)
result = []
for item in items:
    result.append(item)

# Yoki bir nechta element uchun
result.extend(more_items)
```

List comprehension yoki generator ifoda ham yaxshi alternativ.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Loop ichida list yig'ishda hech qachon `+` yoki `+= [item]` ishlatma. Doim `append()` yoki `extend()`. Bu O(n²) dan O(n) ga o'tkazadi va katta datada sezilarli tezlik beradi.

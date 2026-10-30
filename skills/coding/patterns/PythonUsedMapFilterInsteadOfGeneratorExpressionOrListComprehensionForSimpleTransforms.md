---
name: python-map-filter-vs-comprehension
description: Oddiy transform yoki filter uchun map()/filter() + lambda ishlatish o'rniga list comprehension yoki generator expression ishlatish — o'qilishi qiyin va sekinroq.
---

# Oddiy map/filter o'rniga comprehension ishlatish

## Nima uchun bu skill kerak
Python da `map(lambda x: ..., iterable)` yoki `filter(lambda x: ..., iterable)` o'qilishi qiyin, lambda cheklangan, va ko'pincha list() bilan o'rash kerak. List/generator comprehension aniqroq, tezroq va Pythonic.

## Simptom (aynan shu)
- Kodda `map(lambda ...)` yoki `filter(lambda ...)` bor, oddiy transform/filter uchun.
- Natijani list() bilan o'rash kerak bo'ladi.
- O'qilishi qiyin, lambda ichida murakkab mantiq.
- Generator expression yoki comprehension ishlatilmagan.

## Sabab (100%)
Boshqa tillardan kelgan odat yoki "functional" deb map/filter tanlash. Python da comprehension birinchi tanlov — aniqroq va optimallashtirilgan.

## Tasdiqlash
1. map() yoki filter() lambda bilan ishlatilganmi?
2. Oddiy bir qatorli transform/filtermi?
3. Comprehension yoki generator expression o'rniga ishlatilmaganmi?
Agar ha — bu holat.

## Tuzatish (aynan shu)
Comprehension yoki generator expression ishlat.

Noto'g'ri:
```python
squares = list(map(lambda x: x * x, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))
```

To'g'ri:
```python
squares = [x * x for x in numbers]
evens = [x for x in numbers if x % 2 == 0]
# yoki generator: (x * x for x in numbers)
```

Murakkab holatda funksiya chiqarib, map ishlatish mumkin, lekin oddiy holatda comprehension.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Oddiy map/filter + lambda o'rniga list yoki generator comprehension ishlat. Bu o'qilishi oson, tezroq va Pythonic. Lambda faqat kerak bo'lganda.

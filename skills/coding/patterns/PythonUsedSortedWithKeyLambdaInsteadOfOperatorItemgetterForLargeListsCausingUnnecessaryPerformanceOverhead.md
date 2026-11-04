---
name: python-used-sorted-with-key-lambda-instead-of-itemgetter
description: Python kodda katta listlarni sort qilishda key=lambda ishlatilgan — operator.itemgetter yoki attrgetter bilan solishtirganda sekinroq ishlaydi, ayniqsa millionlab elementlarda.
---

# Sorted yoki sort da key=lambda o'rniga operator.itemgetter ishlatish

## Nima uchun bu skill kerak
Katta ma'lumotlar ustida sort qilishda lambda function har bir element uchun yangi function call yaratadi. `operator.itemgetter` C darajasida optimallashtirilgan va sezilarli darajada tezroq. Bu productivity va performance uchun muhim pattern.

## Simptom (aynan shu)
- Kodda `sorted(items, key=lambda x: x['name'])` yoki `lst.sort(key=lambda x: x.age)` kabi yozuvlar.
- Sort qilinayotgan list 10 000+ elementdan iborat.
- Profilingda sort qismi eng ko'p vaqt oladi.
- Key oddiy attribute yoki dict key bo'lib, murakkab hisoblash yo'q.

## Sabab (100%)
Lambda har safar Python function sifatida chaqiriladi. `operator.itemgetter` (yoki `attrgetter`) C extension bo'lib, to'g'ridan-to'g'ri field'ni oladi, function call overhead yo'q. Ko'p dasturchilar "o'qilishi oson" deb lambda yozadi, lekin katta data uchun performance farqi sezilarli.

## Tasdiqlash
1. `sorted(..., key=lambda ...)` yoki `.sort(key=lambda ...)` bormi?
2. Key oddiy dict key, attribute yoki indexmi (murakkab expression emas)?
3. List katta yoki sort hot pathda ishlatiladimi?
4. Agar ha — `operator.itemgetter` yoki `attrgetter` ga o'tkazish kerak.

## Tuzatish (aynan shu)
`operator` modulidan foydalan.

Noto'g'ri (sekin):
```python
sorted_items = sorted(users, key=lambda u: u['score'])
# yoki
products.sort(key=lambda p: p.price)
```

To'g'ri (tez):
```python
from operator import itemgetter, attrgetter

sorted_items = sorted(users, key=itemgetter('score'))
# yoki
products.sort(key=attrgetter('price'))
```

Bir nechta key uchun:
```python
sorted_items = sorted(users, key=itemgetter('department', 'score'))
```

Agar key murakkab hisoblash bo'lsa (masalan `lambda x: expensive_fn(x.field)`), lambda saqlanadi yoki alohida named function.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Katta listlarni sort qilishda oddiy key uchun doim `operator.itemgetter` yoki `attrgetter` ishlat — lambda dan sezilarli tezroq. Bu performance pattern bo'lib, debugging emas, balki to'g'ri coding pattern.

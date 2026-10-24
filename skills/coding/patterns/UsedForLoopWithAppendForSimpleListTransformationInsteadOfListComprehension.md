---
name: used-for-loop-append-instead-of-list-comprehension
description: Oddiy list transformatsiya yoki filtrlash uchun for-loop + append ishlatilgan, list comprehension yoki generator expression o'rniga — kod uzunroq, sekinroq va kamroq idiomatik.
---

# Oddiy list qurish uchun for-loop + append o'rniga list comprehension ishlatmaslik

## Nima uchun bu skill kerak
Agentlar ba'zan oddiy mapping yoki filtering uchun aniq for-loop yozib, ichida append qiladi. Bu Python'da list comprehension (yoki generator) bilan bir qatorda ifodalanishi mumkin bo'lgan holatlarda kodni uzaytiradi, o'qishni qiyinlashtiradi va kichik performance farq beradi. Idiomatik Python uchun comprehension afzal.

## Simptom (aynan shu)
- Oddiy element transformatsiyasi yoki shartli qo'shish uchun:
  ```python
  result = []
  for item in items:
      if condition(item):
          result.append(transform(item))
  ```
- List comprehension yoki generator expression ishlatilmagan.
- Kod ishlaydi, lekin 3-5 qator o'rniga 1 qator yetarli.
- Murakkab mantiq yo'q (faqat oddiy if + transform).

## Sabab (100%)
Agent boshqa tillardan (yoki eski odatdan) for-loop + append naqshini ko'chiradi va Python'ning list comprehension imkoniyatini eslamaydi yoki "aniqroq" deb hisoblaydi. Oddiy holatlarda comprehension qisqaroq va odatda tezroq.

## Tasdiqlash
1. Kodda `result = []` keyin `for ...: result.append(...)` naqshi bormi?
2. Loop ichida faqat oddiy shart va transform bormi (murakkab side-effect yo'q)?
3. ` [transform(x) for x in items if condition(x)] ` bilan almashtirish mumkinmi?
4. Performance kritik emas, lekin idiomatik kod xohlanadimi?

## Tuzatish (aynan shu)
Oddiy holatlarda list comprehension ishlat:

```python
# Noto'g'ri (loop + append):
result = []
for item in items:
    if item.is_valid:
        result.append(item.value * 2)

# To'g'ri (list comprehension):
result = [item.value * 2 for item in items if item.is_valid]

# Agar faqat o'qish/iteratsiya kerak bo'lsa (xotira tejash):
result = (item.value * 2 for item in items if item.is_valid)
```

Qachon loop qoldirish kerak:
- Murakkab side-effect (print, log, file yozish) bo'lsa.
- Bir nechta o'zgaruvchi yangilansa.
- Comprehension o'qishni qiyinlashtirsa (juda uzun).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Oddiy list mapping/filtering uchun for-loop + append o'rniga list comprehension (yoki generator) ishlat. Bu kodni qisqaroq, idiomatik va odatda samaraliroq qiladi. Murakkab holatlarda loopni saqla.

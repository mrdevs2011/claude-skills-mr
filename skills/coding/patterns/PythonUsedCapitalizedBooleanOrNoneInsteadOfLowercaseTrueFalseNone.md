---
name: python-used-capitalized-boolean-or-none
description: Python kodida True, False, None o'rniga True, False, None deb yozilgan (katta harf), natijada NameError yoki noto'g'ri qiymat.
---

# Python da True/False/None katta harf bilan yozilgan

## Nima uchun bu skill kerak
Python da boolean va None kichik harf bilan yoziladi: `True`, `False`, `None`. Katta harf bilan yozish (`TRUE`, `true`) NameError yoki boshqa xatolarga olib keladi, chunki ular reserved keywords emas, oddiy nomlar.

## Simptom (aynan shu)
- Kodda `True`, `False` yoki `None` o'rniga `TRUE`, `FALSE`, `NONE`, `true` yoki `false` ishlatilgan.
- NameError: name 'TRUE' is not defined
- Yoki mantiqiy ifoda noto'g'ri ishlaydi.

## Sabab (100%)
Boshqa tillardan (masalan Java, C) o'tgan odat yoki imlo xatosi. Agent til qoidalarini e'tiborsiz qoldirdi.

## Tasdiqlash
1. Faylda `TRUE`, `FALSE`, `NONE` yoki kichik `true`/`false` bormi?
2. Bu Python fayldami?
3. Xato NameError yoki noto'g'ri booleanmi?

## Tuzatish (aynan shu)
Barcha holatlarda to'g'ri yoz:

```python
# noto'g'ri
if TRUE:
    value = NONE

# to'g'ri
if True:
    value = None
```

Python keywords: True, False, None — doim shu shaklda.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python da boolean va None doim `True`, `False`, `None` shaklida yoziladi. Boshqa variantlar xato. Bu oddiy lekin tez-tez uchraydigan imlo xatosi.

---
name: python-manual-if-not-in-dict-init-list
description: Kodda `if key not in d: d[key] = []` keyin `d[key].append(...)` yoziladi — bu ishlaydi, lekin takrorlanuvchi va kamroq o'qiladigan. `collections.defaultdict(list)` yoki `dict.setdefault` bilan bir qatorga tushiriladi.
---

# Dict ichida ro'yxatni qo'lda tekshirib yaratish o'rniga defaultdict yoki setdefault

## Nima uchun bu skill kerak
AI yoki dasturchi guruhlash (grouping) yoki akkumulatsiya qilayotganda har safar `if key not in result: result[key] = []` yozadi. Bu to'g'ri ishlaydi, lekin kodni cho'zadi, takrorlanadi va Pythonic emas. `defaultdict` yoki `setdefault` aynan shu holat uchun yaratilgan.

## Simptom (aynan shu)
- Guruhlash yoki `list` to'plash kodida quyidagiga o'xshash blok takrorlanadi:
  ```python
  if key not in result:
      result[key] = []
  result[key].append(value)
  ```
- Yoki `set` uchun xuddi shunday.
- Kod ishlaydi, lekin uzoq va kamroq aniq.

## Sabab (100%)
1. `collections.defaultdict` yoki `dict.setdefault` usullari esdan chiqarilgan.
2. "Oddiy if yetarli" deb hisoblanib, standard library yechimi ishlatilmagan.
3. Eski kod uslubi yoki boshqa tildan o'tgan odat.

## Tasdiqlash
1. Kodda `if ... not in ...: ... = []` (yoki `set()`) keyin append/add borligini toping.
2. Bu faqat akkumulatsiya uchun ekanligini tekshiring (boshqa mantiq yo'q).
3. Agar shunday bo'lsa — bu skill mos.

## Tuzatish (aynan shu)
```python
from collections import defaultdict

# Eski:
# result = {}
# if key not in result:
#     result[key] = []
# result[key].append(value)

# Yangi (defaultdict):
result = defaultdict(list)
result[key].append(value)

# Yoki setdefault (import kerak emas):
result = {}
result.setdefault(key, []).append(value)
```

`set` uchun `defaultdict(set)` yoki `setdefault(key, set()).add(value)`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Guruhlashda `if not in` + init + append o'rniga `defaultdict(list)` yoki `setdefault` ishlatiladi.
- Bu kodni qisqartiradi, o'qilishini oshiradi va xatolarni kamaytiradi.
- Har doim akkumulatsiya qilayotganda standard library usulini tanlang.

---
name: python-plain-dict-instead-of-counter-or-defaultdict
description: Counting, grouping or accumulating values with a plain dict and manual if-key-exists checks — causes KeyError or verbose boilerplate instead of Counter/defaultdict.
---

# Python Used Plain Dict For Counting Or Grouping Instead Of Collections Counter Or Defaultdict

## Nima uchun bu skill kerak
Python'da elementlarni sanash, guruhlash yoki to'plashda oddiy `dict` + `if key in d` yoki `.get(key, 0)` ishlatish keng tarqalgan, lekin bu kodni uzun, xato-prone va sekinroq qiladi. `collections.Counter` va `collections.defaultdict` aynan shu holatlar uchun yaratilgan — ular KeyError'ni oldini oladi va kodni qisqa, o'qilishi oson qiladi. Agentlar ko'pincha bu standart kutubxonani unutadi va manual pattern yozadi.

## Simptom (aynan shu)
- Kodda elementlarni sanash yoki guruhlash uchun oddiy `dict` ishlatilgan.
- Har safar `if key not in d: d[key] = 0` yoki `d[key] = d.get(key, 0) + 1` kabi boilerplate bor.
- Yoki `d[key].append(item)` qilishdan oldin `if key not in d: d[key] = []` yozilgan.
- Natijada KeyError chiqishi mumkin (agar check unutilsa) yoki kod haddan tashqari uzun va takrorlanuvchi bo'ladi.
- `from collections import Counter, defaultdict` yo'q.

## Sabab (100%)
Agent `collections` modulidagi `Counter` va `defaultdict` mavjudligini e'tiborsiz qoldiradi yoki "oddiy dict yetarli" deb hisoblaydi. Manual if-check pattern "tanish" tuyuladi, lekin u xatolarga (unutilgan check) va yomon o'qilishga olib keladi. Bu pattern aynan Counter/defaultdict bilan almashtirilishi kerak bo'lgan holat.

## Tasdiqlash
- Kodda `dict` bilan counting (sanash) yoki grouping (guruhlash) bormi?
- `if key not in ...` yoki `.get(key, default)` takrorlanib ishlatilganmi?
- `collections.Counter` yoki `defaultdict` import qilinmaganmi?
- Bu patternni Counter/defaultdict bilan soddalashtirish mumkinmi?

## Tuzatish (aynan shu)
1. Sanash (counting) uchun `Counter` ishlat:
```python
from collections import Counter
# Noto'g'ri
counts = {}
for item in items:
    counts[item] = counts.get(item, 0) + 1

# To'g'ri
counts = Counter(items)
# yoki
counts = Counter()
for item in items:
    counts[item] += 1
```

2. Guruhlash yoki list/set to'plash uchun `defaultdict`:
```python
from collections import defaultdict
# Noto'g'ri
groups = {}
for item in items:
    key = item.category
    if key not in groups:
        groups[key] = []
    groups[key].append(item)

# To'g'ri
groups = defaultdict(list)
for item in items:
    groups[item.category].append(item)
```

3. Oddiy `dict` faqat key'lar oldindan ma'lum bo'lsa yoki maxsus mantiq kerak bo'lsa ishlat.
4. `Counter` most_common(), subtraction va boshqa foydali metodlarni ham beradi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Sanash va guruhlash uchun oddiy dict + manual check o'rniga `collections.Counter` yoki `defaultdict` ishlat. Bu KeyError'ni yo'q qiladi, kodni qisqartiradi va standart, samarali pattern hisoblanadi.

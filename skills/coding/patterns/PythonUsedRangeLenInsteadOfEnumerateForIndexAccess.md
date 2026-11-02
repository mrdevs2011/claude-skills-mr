---
name: python-range-len-instead-of-enumerate
description: Python loopda range(len(collection)) ishlatib index orqali elementga murojaat qilish — enumerate yoki zip ishlatish mumkin bo'lganda. Index xatolari va o'qish qiyinligi.
---

# range(len()) o'rniga enumerate ishlatmaslik

## Nima uchun bu skill kerak
Agentlar va dasturchilar ko'pincha C-style for loop odatidan kelib, Python'da `for i in range(len(items)):` yozib, keyin `items[i]` orqali ishlaydi. Bu enumerate() yoki zip() dan ko'ra xavfliroq va kamroq Pythonic. Index off-by-one yoki collection o'zgarsa xato chiqadi.

## Simptom (aynan shu)
- `for i in range(len(my_list)):` yoki `range(len(dict))` kabi kod.
- Ichida `my_list[i]`, `my_list[i] = ...` yoki parallel ro'yxatlarni index bilan bog'lash.
- `enumerate` yoki `zip` ishlatilmagan, lekin index kerak bo'lsa ham.
- Kod ishlaydi, lekin o'qish qiyin va xato ehtimoli yuqori (masalan, list o'zgarsa index noto'g'ri).

## Sabab (100%)
Agent indexga ehtiyoj bor deb o'ylab, lekin Python'ning enumerate yoki zip patternini eslamaydi yoki "oddiy" deb range(len) tanlaydi. Natijada keraksiz index boshqaruvi va potensial IndexError yoki noto'g'ri bog'lanish.

## Tasdiqlash
1. Kodda `range(len(` qidir.
2. Loop ichida faqat index orqali elementga murojaat bormi?
3. Agar index kerak bo'lsa, `enumerate(items)` ishlatilsa oddiyroqmi?
4. Parallel ro'yxatlar bo'lsa, `zip` ishlatilishi mumkinmi?

## Tuzatish (aynan shu)
`enumerate` ishlat:

```python
# Noto'g'ri:
items = ["a", "b", "c"]
for i in range(len(items)):
    print(i, items[i])
    # yoki items[i] = items[i].upper()

# To'g'ri:
items = ["a", "b", "c"]
for i, item in enumerate(items):
    print(i, item)
    # o'zgartirish kerak bo'lsa: items[i] = item.upper()  (lekin afzalroq yangi ro'yxat)

# Parallel ro'yxatlar uchun zip:
names = ["Ali", "Vali"]
ages = [25, 30]
for name, age in zip(names, ages):
    print(name, age)
```

Agar faqat element kerak bo'lsa, indexsiz `for item in items:` yetarli.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `range(len())` o'rniga `enumerate` ishlat — toza, xavfsiz, Pythonic.
- Parallel ma'lumotlar uchun `zip`.
- Index kerak bo'lmasa, oddiy for loop.

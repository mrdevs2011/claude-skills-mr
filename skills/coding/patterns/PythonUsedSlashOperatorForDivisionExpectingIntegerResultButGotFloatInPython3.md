---
name: python-used-slash-operator-for-division-expecting-integer-result-but-got-float-in-python3
description: Python 3 da `/` operatori haqiqiy bo'linish (true division) qiladi va float qaytaradi; integer natija kutib `//` (floor division) ishlatilmasa, float chiqadi va keyingi hisob-kitoblarda xato yoki type mismatch yuzaga keladi.
---

# Python 3 da `/` o'rniga `//` ishlatish (integer division)

## Nima uchun bu skill kerak
Python 2 da `/` ikki integer uchun floor division qilardi va int qaytarardi. Python 3 da `/` har doim float qaytaradi (true division). Bu o'zgarish ko'p eski kod yoki yangi yozuvchilarda kutilmagan float natija, keyingi integer operatsiyalarda TypeError yoki noto'g'ri hisob-kitobga olib keladi.

## Simptom (aynan shu)
Ikki butun sonni `/` bilan bo'lganda natija `5.0` kabi float chiqadi, lekin kod integer kutadi. Masalan, `10 / 2` → `5.0`. Keyin shu qiymatni `range()`, list index yoki bit operationda ishlatganda xato yoki noto'g'ri natija. Yoki `assert isinstance(result, int)` muvaffaqiyatsiz.

## Sabab (100%)
Python 3 da `/` operatori `__truediv__` ni chaqiradi va har doim float qaytaradi. Integer floor division uchun `//` (`__floordiv__`) ishlatiladi. Bu PEP 238 bilan ataylab o'zgartirilgan.

## Tasdiqlash
Kodda ikki integer o'rtasida `/` ishlatilganligini qidir. Python 3 da ishga tushirib natija tipini tekshir:

```python
print(10 / 2)        # 5.0 (float)
print(type(10 / 2))  # <class 'float'>
print(10 // 2)       # 5 (int)
print(type(10 // 2)) # <class 'int'>
```

Agar natija float bo'lib, keyingi kod integer kutsa — shu skill.

## Tuzatish (aynan shu)
Integer natija kerak bo'lsa `//` ishlat. Float kerak bo'lsa `/` qoldir, lekin ataylab float ekanini bil.

```python
# Noto'g'ri (Python 3 da float)
pages = total_items / items_per_page
for i in range(pages):  # TypeError: 'float' object cannot be interpreted as an integer
    process(i)

# To'g'ri
pages = total_items // items_per_page
for i in range(pages):
    process(i)

# Yoki aniq float kerak bo'lsa
ratio = total_items / items_per_page  # float, keyin math.ceil(ratio) kabi
```

Agar qoldiq ham kerak bo'lsa, `divmod(a, b)` ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python 3 da `/` har doim float qaytaradi. Integer bo'linish (floor) uchun `//` ishlatish shart. Eski Python 2 odatlarini ko'chirish yoki yangi kod yozishda shu farqni unutma — aks holda kutilmagan float va type xatolari chiqadi.

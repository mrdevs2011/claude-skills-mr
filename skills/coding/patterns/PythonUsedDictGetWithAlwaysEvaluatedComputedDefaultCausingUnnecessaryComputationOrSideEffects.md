---
name: python-used-dict-get-with-always-evaluated-computed-default
description: Python kodi dict.get(key, expensive_call()) yoki side-effectli default ishlatadi — default har doim hisoblanadi, hatto key mavjud bo'lsa ham. Bu keraksiz ish yoki xato side-effectga olib keladi.
---

# dict.get() da hisoblanadigan default har doim ishga tushadi

## Nima uchun bu skill kerak
`dict.get(key, default)` da `default` argumenti har doim baholanadi (evaluated), hatto key dict ichida bo'lsa ham. Agar default qimmat hisoblash yoki side-effect (log, API chaqiruv, fayl o'qish) bo'lsa, keraksiz ish bajariladi yoki kutilmagan o'zgarishlar yuz beradi. Bu performance muammosi yoki logic xato.

## Simptom (aynan shu)
- `result = my_dict.get(key, compute_expensive_thing())`
- `result = my_dict.get(key, logger.warning("missing") or default_value)`
- Key mavjud bo'lsa ham `compute_expensive_thing()` chaqiriladi.
- Side-effect (print, increment, network) har get da sodir bo'ladi.
- Performance profiling da keraksiz chaqiruvlar ko'rinadi.

## Sabab (100%)
Python funksiya chaqiruvida barcha argumentlar chaqiruvdan oldin baholanadi. `dict.get` ning ikkinchi argumenti oddiy expression — u key bor-yo'qligini tekshirishdan oldin ishga tushadi. Bu `or` default yoki `if key in dict else default` dan farq qiladi.

## Tasdiqlash
1. Kodda `.get(` va ikkinchi argument sifatida funksiya chaqiruvi yoki side-effectli expression bormi?
2. Default qimmat hisoblash yoki o'zgarish keltiradimi?
3. Key har doim mavjud bo'lgan holatlarda ham default ishlaydimi?
4. `if key in d: ... else: compute()` yoki `d[key] if key in d else compute()` bilan solishtirganda farq bormi?

## Tuzatish (aynan shu)
Defaultni shartli qilib yoz yoki `in` tekshiruvi ishlat.

Xato:
```python
def get_value(d, key):
    return d.get(key, expensive_compute())  # har doim expensive_compute() ishlaydi
```

To'g'ri (1):
```python
def get_value(d, key):
    if key in d:
        return d[key]
    return expensive_compute()
```

To'g'ri (2) — Python 3.8+ walrus yoki oddiy:
```python
def get_value(d, key):
    return d[key] if key in d else expensive_compute()
```

Agar default oddiy bo'lsa va side-effect yo'q — muammo yo'q, lekin qimmat bo'lsa albatta shartli qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `dict.get(key, expr)` da `expr` har doim baholanadi.
- Qimmat yoki side-effectli default uchun `if key in d else compute()` ishlat.
- Bu silent performance bug yoki kutilmagan log/API chaqiruvga olib keladi.
- Oddiy literal default (None, 0, "") uchun xavfsiz.

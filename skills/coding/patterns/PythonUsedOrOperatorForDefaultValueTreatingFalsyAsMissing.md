---
name: python-used-or-operator-for-default-value-treating-falsy-as-missing
description: Python kodda default qiymat berish uchun `or` operator ishlatilgan (`x = get_value() or default`), natijada 0, bo'sh string, False kabi to'g'ri falsy qiymatlar ham default bilan almashtiriladi.
---

# or operatori bilan default qiymat berish falsy qiymatlarni yo'qotadi

## Nima uchun bu skill kerak
Python'da `value or default` yozuvi qisqa va qulay ko'rinadi, lekin `or` operator truthiness asosida ishlaydi. Agar `get_value()` 0, "", False, None, [] yoki {} qaytarsa, ularning barchasi "falsy" hisoblanib default bilan almashtiriladi. Bu kutilgan 0 yoki bo'sh string o'rniga noto'g'ri default chiqishiga olib keladi — silent bug.

## Simptom (aynan shu)
- Kodda `result = some_function() or "default"` yoki `count = data.get("count") or 1` kabi yozuvlar.
- Funksiya 0 qaytarganda natija 1 yoki boshqa default bo'lib chiqadi.
- Bo'sh string kutilgan joyda default string chiqadi.
- False qiymat True default bilan almashtiriladi.
- Testlar ba'zi edge case'larda muvaffaqiyatsiz bo'ladi, lekin asosiy yo'lda ishlaydi.

## Sabab (100%)
`or` operator ikkinchi operandni faqat birinchisi truthy bo'lmasa qaytaradi. Python'da 0, 0.0, "", False, None, [], {}, set() hammasi falsy. Shuning uchun ular "yo'q" deb hisoblanadi, garchi ular to'g'ri va kutilgan qiymat bo'lsa ham. Bu `if value is None` yoki `dict.get(key, default)` dan farq qiladi.

## Tasdiqlash
1. Kodda `x = y or default` yoki `x = func() or default` bormi?
2. `y` yoki `func()` 0, "", False kabi qiymat qaytarishi mumkinmi?
3. Agar shunday bo'lsa va bu qiymatlar saqlanishi kerak bo'lsa — bu holat. Default faqat None yoki haqiqiy yo'qligi uchun kerak.

## Tuzatish (aynan shu)
`or` o'rniga aniq `is None` tekshiruvi yoki `dict.get` ishlat. Falsy qiymatlarni saqlash uchun:

Noto'g'ri:
```python
count = data.get("count") or 1          # 0 bo'lsa 1 bo'lib chiqadi
name = user.get("name") or "Unknown"    # "" bo'lsa "Unknown" bo'ladi
enabled = config.get("enabled") or True # False bo'lsa True bo'ladi
```

To'g'ri:
```python
count = data.get("count")
if count is None:
    count = 1

# yoki
count = data.get("count", 1)  # get default faqat key yo'q bo'lsa

name = user.get("name")
if name is None:
    name = "Unknown"

enabled = config.get("enabled")
if enabled is None:
    enabled = True
```

Agar faqat None ni almashtirish kerak bo'lsa:
```python
value = get_value()
result = default if value is None else value
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `or` default uchun ishlatilganda barcha falsy qiymatlar (0, "", False, []) yo'qoladi.
- To'g'ri yo'l: `is None` tekshiruvi yoki `dict.get(key, default)` — ular faqat haqiqiy yo'qlikda default beradi.
- Edge case'larni (0, bo'sh string) doim hisobga ol — bu silent buglarning manbai.

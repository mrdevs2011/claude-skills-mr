---
name: python-try-except-as-control-flow
description: Python kodida kutilgan holat (key yo'qligi, noto'g'ri type, index) uchun try/except ishlatilgan — bu sekin, o'qish qiyin va haqiqiy xatolarni yashiradi. Aniq if yoki built-in metod ishlat.
---

# Try/except ni control flow sifatida ishlatish

## Nima uchun bu skill kerak
AI ba'zan "agar xato bo'lmasa" mantiqini try/except bilan ifodalaydi. Bu kutilgan holatlar (dict key yo'q, string int emas, list index tashqarida) uchun noto'g'ri. Exception yaratish qimmat, kod o'qilishi yomonlashadi va haqiqiy kutilmagan xatolar ham tutilib yashiriladi.

## Simptom (aynan shu)
- `try: value = d["key"] except KeyError: value = default` kabi kod.
- `try: n = int(s) except ValueError: n = 0`
- `try: obj.attr except AttributeError: ...`
- Kod ishlaydi, lekin "EAFP" (easier to ask forgiveness) noto'g'ri joyda ishlatilgan — LBYL (look before you leap) yoki built-in metod yaxshiroq.

## Sabab (100%)
Model exception handlingni har qanday potensial muammo uchun universal yechim deb hisoblaydi. Python'da esa kutilgan holatlar uchun aniq shart yoki xavfsiz metod (`dict.get`, `str.isdigit`, `getattr`) afzal. EAFP faqat haqiqatan kutilmagan holatlar yoki race condition uchun.

## Tasdiqlash
1. try blokidagi amalni aniqlang — bu kutilgan natija (key bor/yo'q, type to'g'ri) yoki kutilmagan xato?
2. except da faqat bitta aniq xato turi tutilyaptimi va ichida oddiy default/alternativ yo'l bormi?
3. Xuddi shu narsani `if key in d`, `d.get()`, `isinstance()`, `getattr(obj, "attr", default)` bilan yozish mumkinmi?
4. Agar ha — bu control flow abuse.

## Tuzatish (aynan shu)
Aniq shart yoki xavfsiz metod ishlating:

```python
# XATO:
try:
    value = data["user_id"]
except KeyError:
    value = None

# TO'G'RI:
value = data.get("user_id")          # yoki data.get("user_id", None)

# XATO:
try:
    n = int(user_input)
except ValueError:
    n = 0

# TO'G'RI (kutilgan bo'lsa):
n = int(user_input) if user_input.isdigit() else 0

# XATO:
try:
    name = obj.name
except AttributeError:
    name = "unknown"

# TO'G'RI:
name = getattr(obj, "name", "unknown")
```

Haqiqiy kutilmagan xatolar (tarmoq, fayl, external) uchun try/except to'g'ri qoladi. Faqat kutilgan shartlar uchun emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Kutilgan holatlar uchun try/except o'rniga `if`, `.get()`, `getattr`, `isinstance` ishlatish kerak. Bu kodni tezroq, aniqroq va xatolarni yashirmaydigan qiladi. EAFP faqat haqiqatan kutilmagan holatlarda.

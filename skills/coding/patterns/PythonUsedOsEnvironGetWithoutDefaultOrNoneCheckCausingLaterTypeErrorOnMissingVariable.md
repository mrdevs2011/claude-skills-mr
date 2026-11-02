---
name: python-os-environ-get-without-default-none-check
description: When os.environ.get("KEY") returns None for missing env var and code later treats it as string or int without check, causing TypeError or silent wrong behavior. Use when environment variable access silently fails.
---

# Python Used os.environ.get Without Default or None Check Causing Later TypeError on Missing Variable

## Nima uchun bu skill kerak
Kodda muhit o'zgaruvchilarini o'qishda `os.environ.get("KEY")` ishlatilganda, agar o'zgaruvchi yo'q bo'lsa `None` qaytaradi. Keyingi kod bu qiymatni string sifatida ishlatadi yoki konvertatsiya qiladi, natijada TypeError yoki noto'g'ri ishlash yuzaga keladi. Bu skill aniq shu holatni tuzatish uchun.

## Simptom (aynan shu)
- `os.environ.get("API_KEY")` yoki shunga o'xshash chaqiruvdan keyin `NoneType` da metod chaqirish: `'NoneType' object has no attribute 'startswith'` yoki `TypeError: can only concatenate str (not "NoneType") to str`.
- Kod ishlaydi, lekin konfiguratsiya yo'qligida kutilmagan `None` qiymat bilan davom etadi.
- Lokalda `.env` bor, lekin productionda yoki boshqa muhitda o'zgaruvchi o'rnatilmagan.

## Sabab (100%)
`os.environ.get(key)` agar kalit topilmasa `None` qaytaradi (default yo'q bo'lsa). Dasturchi keyingi qatorlarda bu qiymatni `str` deb taxmin qilib, uni to'g'ridan-to'g'ri ishlatadi yoki `.strip()`, `int()`, string qo'shish qiladi. `os.environ["KEY"]` KeyError beradi, `get` esa jim `None` beradi.

## Tasdiqlash
1. Xato matnida `NoneType` va environment bilan bog'liq o'zgaruvchi nomi borligini tekshiring.
2. Kodda `os.environ.get(...)` ni toping va undan keyin qiymatni tekshirmasdan ishlatilganini ko'ring.
3. `print(repr(os.environ.get("YOUR_KEY")))` bilan `None` ekanini tasdiqlang.

## Tuzatish (aynan shu)
Har doim default bering yoki `None` ni aniq tekshiring. Afzal: default bilan `get` va keyin validatsiya.

```python
import os

# Yomon:
api_key = os.environ.get("API_KEY")
if api_key.startswith("sk-"):  # TypeError if None
    ...

# Yaxshi 1: default + check
api_key = os.environ.get("API_KEY", "")
if not api_key:
    raise ValueError("API_KEY environment variable is required")
if api_key.startswith("sk-"):
    ...

# Yaxshi 2: explicit None check
api_key = os.environ.get("API_KEY")
if api_key is None:
    raise ValueError("API_KEY environment variable is required")
# endi api_key str ekaniga ishonch
```

Agar qiymat ixtiyoriy bo'lsa, defaultni mantiqiy qilib bering (`""` yoki `0` yoki `None` ni keyin alohida boshqaring).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`os.environ.get` `None` qaytarishi mumkinligini bilib oldingiz. Har doim default berish yoki `is None` tekshiruvi bilan keyingi TypeError yoki noto'g'ri ishlashning oldini olish kerak. Bu oddiy, lekin tez-tez uchraydigan e'tiborsizlik.

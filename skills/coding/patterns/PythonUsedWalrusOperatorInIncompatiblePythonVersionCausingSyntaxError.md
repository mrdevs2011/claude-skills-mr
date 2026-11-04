---
name: python-used-walrus-operator-in-incompatible-python-version
description: Code uses the walrus operator (:=) but the runtime or project targets Python < 3.8, causing SyntaxError on assignment expressions.
---

# Python Used Walrus Operator In Incompatible Python Version Causing SyntaxError

## Nima uchun bu skill kerak
Python 3.8 da kiritilgan assignment expression (walrus operator `:=`) qulay, lekin loyiha yoki deployment muhiti Python 3.7 yoki undan past bo'lsa, kod ishga tushmaydi va SyntaxError beradi. Agent yoki dasturchi zamonaviy sintaksisni ishlatib, versiya mosligini tekshirmagan.

## Simptom (aynan shu)
- `SyntaxError: invalid syntax` xatosi, odatda `:=` qatori yonida.
- Traceback: "can't assign to ... " yoki oddiy invalid syntax.
- Kod lokalda (3.10+) ishlaydi, CI, Docker yoki production da (eski Python) ishlamaydi.
- `python --version` 3.7 yoki past ko'rsatadi.

## Sabab (100%)
Walrus operator `:=` faqat Python 3.8+ da qo'llab-quvvatlanadi. Kod yozilganda yoki agent tomonidan generatsiya qilinganda target Python versiyasi tekshirilmagan, va assignment expression ishlatilgan.

## Tasdiqlash
- `python --version` yoki `sys.version_info` ni tekshir.
- `if (n := len(data)) > 0:` kabi qatorlar bormi?
- pyproject.toml, setup.cfg, Dockerfile, CI config da python_requires yoki image versiyasi nima?
- `python3.7 -m py_compile file.py` bilan sinab ko'r.

## Tuzatish (aynan shu)
Agar Python < 3.8 bo'lsa, walrusni oddiy o'zgaruvchiga almashtir:

```python
# Noto'g'ri (Python < 3.8)
if (n := len(items)) > 10:
    process(n)

# To'g'ri
n = len(items)
if n > 10:
    process(n)
```

Yoki loyihani Python 3.8+ ga yangila (Dockerfile, CI, shebang).

Agar 3.8+ bo'lsa, ishlatish mumkin, lekin o'qilishi qiyin bo'lsa oddiy o'zgaruvchi yaxshiroq.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Walrus operator `:=` faqat Python 3.8 va undan yuqori versiyalarda ishlaydi. Target muhitni doim tekshir; mos kelmasa oddiy assignment ishlat. Bu SyntaxError ni oldini oladi va kodni portativ saqlaydi.

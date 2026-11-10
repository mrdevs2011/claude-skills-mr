---
name: python-used-equality-operator-to-check-for-none-instead-of-is-none
description: Agent or code used == None or != None for None checks instead of the idiomatic is None / is not None, reducing clarity and risking issues with objects that override __eq__.
---

# PythonUsedEqualityOperatorToCheckForNoneInsteadOfIsNoneIdiomReducingClarityAndRiskingUnexpectedBehaviorWithCustomObjects

## Nima uchun bu skill kerak
Python'da None'ni tekshirishda == yoki != ishlatish texnik jihatdan ishlashi mumkin, lekin idiomatik emas. Bu o'qilishni pasaytiradi va custom __eq__ metodiga ega obyektlar bilan kutilmagan natija berishi mumkin. is None / is not None har doim identity bo'yicha tekshiradi va aniqroq.

## Simptom (aynan shu)
- Kodda `if x == None:` yoki `if x != None:` ko'rinadi.
- Linter (pylint, ruff, flake8) E711 yoki shunga o'xshash ogohlantirish beradi.
- Custom class'da __eq__ None bilan solishtirishda True qaytaradi va shart noto'g'ri ishlaydi.
- O'qilish past: "x teng None" o'rniga "x None" deb o'qiladi.

## Sabab (100%)
Dasturchi yoki agent None'ni oddiy qiymat deb hisoblab == operatorini ishlatdi. U is None idiomining identity-based ekanini va __eq__ override xavfini e'tiborsiz qoldirdi. Ba'zi tillardan (JS null == undefined) o'tgan odat.

## Tasdiqlash
1. Kodda `== None` yoki `!= None` qidir: `grep -n "== None\|!= None" file.py`
2. Linter ishga tushir: `ruff check --select E711 file.py` yoki pylint.
3. Custom class bilan test: `__eq__` da `return other is None` qilib, `obj == None` True bo'lishini tekshir.

## Tuzatish (aynan shu)
Har doim identity check ishlat:

```python
# Noto'g'ri
if value == None:
    handle_missing()
if result != None:
    process(result)

# To'g'ri
if value is None:
    handle_missing()
if result is not None:
    process(result)
```

Qoidalar:
- None, True, False uchun har doim `is` / `is not`.
- Boshqa qiymatlar uchun == .
- Type checker va linter buni majburlaydi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
None tekshirishda == o'rniga is None ishlat. Bu idiomatik, aniq va custom __eq__ xavfidan himoya qiladi. Kodni o'qish va barqarorlik oshadi.

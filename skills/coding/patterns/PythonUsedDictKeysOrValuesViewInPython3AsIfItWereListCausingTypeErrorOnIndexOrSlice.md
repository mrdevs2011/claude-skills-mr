---
name: python-used-dict-keys-or-values-view-in-python3-as-if-it-were-list-causing-typeerror-on-index-or-slice
description: Python 3 da dict.keys() yoki values() list emas, view qaytaradi; index yoki slice qo'llash TypeError beradi. list() bilan o'rash yoki to'g'ri metod ishlatish kerak.
---

# Dict.keys() / values() view ni list deb ishlatish (Python 3)

## Nima uchun bu skill kerak
Python 2 da `dict.keys()` va `values()` list qaytarardi. Python 3 da ular `dict_keys` / `dict_values` view obyektlari. Viewlar memory-efficient va live, lekin list kabi index (`[0]`), slice (`[:5]`) yoki ba'zi operatsiyalarni qo'llab-quvvatlamaydi. Bu TypeError yoki noto'g'ri xulq-atvor keltirib chiqaradi, ayniqsa eski kodni port qilganda yoki taxmin qilganda.

## Simptom (aynan shu)
Kodda `d.keys()[0]`, `list_of_keys = d.keys(); list_of_keys[0]`, yoki slice qo'llanganda:
```
TypeError: 'dict_keys' object is not subscriptable
```
yoki `d.values()[:3]` xuddi shunday. Iteratsiya ishlaydi, lekin random access yo'q. `len()` ishlaydi, lekin tartib kafolatlangan bo'lsa-da (3.7+), index yo'q.

## Sabab (100%)
Python 3 dan boshlab `keys()`, `values()`, `items()` view qaytaradi (dict view). Viewlar set-like, indexable emas. Python 2 da list edi. Ko'pchilik kod yoki AI taxminlari Python 2 xulq-atvorini kutadi. Viewni listga aylantirmasdan list metodlarini chaqirish xato.

## Tasdiqlash
Xato matnida `'dict_keys' object is not subscriptable` yoki `'dict_values' object is not subscriptable` bo'lsa, aniq shu. Yoki:
```python
d = {"a": 1, "b": 2}
print(type(d.keys()))  # <class 'dict_keys'>
# d.keys()[0]  # TypeError
```
Agar `list(d.keys())[0]` ishlasa, tasdiqlangan.

## Tuzatish (aynan shu)
Viewni explicit listga aylantir, yoki to'g'ri API ishlat:

```python
# Noto'g'ri (Python 3)
first_key = my_dict.keys()[0]
first_values = my_dict.values()[:3]

# To'g'ri
first_key = list(my_dict.keys())[0]
# yoki (3.7+ tartib saqlanadi)
first_key = next(iter(my_dict.keys()))

# Slice uchun
first_three_values = list(my_dict.values())[:3]

# Eng yaxshi: agar faqat iteratsiya kerak bo'lsa, view ni o'zi ishlat
for key in my_dict.keys():
    ...
```

Agar faqat birinchi element kerak bo'lsa, `next(iter(...))` list yaratmasdan tejamkor.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python 3 da `dict.keys()` / `values()` list emas, view. Index/slice uchun `list()` bilan o'ra. Eski Python 2 taxminini qilma — doim explicit aylantir yoki `next(iter())` ishlat.

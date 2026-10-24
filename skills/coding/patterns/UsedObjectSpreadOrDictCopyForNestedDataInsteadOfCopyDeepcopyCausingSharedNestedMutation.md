---
name: UsedObjectSpreadOrDictCopyForNestedDataInsteadOfCopyDeepcopyCausingSharedNestedMutation
description: Nested obyekt yoki dict'ni faqat shallow copy (spread, dict.copy, list.copy) qilganda ichki strukturalar hali ham shared bo'lib qoladi — o'zgartirish boshqa joyga ham ta'sir qiladi.
---

# Nested data uchun shallow copy ishlatish — ichki mutation shared bo'ladi

## Nima uchun bu skill kerak
Kodda obyekt yoki dict'ni "nusxa" deb o'ylab spread (`{...obj}`), `dict.copy()`, `list.copy()` yoki `copy.copy()` ishlatiladi. Lekin agar ichida nested dict/list bo'lsa, ular hali ham bir xil obyektga ishora qiladi. Keyin bir joyda ichki qiymat o'zgartirilsa, boshqa "nusxa" ham o'zgaradi — kutilmagan side-effect, testlar yiqiladi, state buziladi.

## Simptom (aynan shu)
- `new_data = {**original}` yoki `original.copy()` qilgandan keyin `new_data['nested']['key'] = value` qilsang, `original['nested']['key']` ham o'zgaradi.
- Testlarda "copy qildim, lekin original ham o'zgarib qoldi" deb chiqadi.
- React state, config, yoki cache'da kutilmagan mutation.
- Xato matni aniq bo'lmasa ham, logikada "ikki joyda bir xil qiymat o'zgarib ketdi".

## Sabab (100%)
Python'da (va JS'da) `dict.copy()`, `{**d}`, `list.copy()`, spread — faqat **shallow** copy. Eng tashqi qatlam yangi obyekt, lekin ichidagi reference'lar (nested dict, list, obyekt) hali ham eski obyektga ishora qiladi. Deep copy emas.

## Tasdiqlash
```python
original = {"a": 1, "nested": {"b": 2}}
shallow = {**original}          # yoki original.copy()
shallow["nested"]["b"] = 99
print(original["nested"]["b"])  # 99 — kutilmagan!
```
Agar shu kod 99 chiqarsa — aynan shu muammo.

## Tuzatish (aynan shu)
Nested struktura bo'lsa `copy.deepcopy` ishlat:

```python
import copy

original = {"a": 1, "nested": {"b": 2}}
deep = copy.deepcopy(original)
deep["nested"]["b"] = 99
print(original["nested"]["b"])  # 2 — to'g'ri, original o'zgarmadi
```

JS/TS'da: `structuredClone(obj)` (zamonaviy) yoki `JSON.parse(JSON.stringify(obj))` (cheklangan, Date/function yo'qotadi).

Faqat tashqi qatlam o'zgarsa shallow yetadi. Ichki o'zgartirish rejalashtirilgan bo'lsa — deep copy.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Shallow copy (`copy`, spread, `**`) nested data'ni to'liq ajratmaydi. Ichki mutation shared bo'ladi. Nested bo'lsa `copy.deepcopy` (yoki `structuredClone`) ishlat — kutilmagan side-effect yo'qoladi.

---
name: python-string-format-unescaped-braces
description: When using str.format or f-strings with literal curly braces that are not intended as placeholders, missing escape causes KeyError or ValueError. Use doubled braces {{ }} for literal braces.
---

# Python str.format or f-string with unescaped literal braces

## Nima uchun bu skill kerak
Kodda JSON yoki boshqa format matnini qurishda literal { } belgilarini format string ichiga qo'shganda, ular placeholder deb o'qiladi va xato chiqadi. Bu oddiy, lekin tez-tez uchraydigan e'tiborsizlik.

## Simptom (aynan shu)
- `KeyError: 'something'` yoki `ValueError: Single '}' encountered in format string`
- f-string ichida `{` yoki `}` literal bo'lishi kerak bo'lganda xato
- str.format() chaqirilganda kutilmagan placeholder topiladi

## Sabab (100%)
Python format string'larida `{` va `}` maxsus belgi. Literal qavslarni chiqarish uchun ularni ikki marta yozish kerak: `{{` va `}}`. Bitta qavs placeholder sifatida talqin qilinadi.

## Tasdiqlash
1. Xato matnini o'qi: KeyError yoki ValueError format bilan bog'liq.
2. Format string'ni tekshir: ichida bitta `{` yoki `}` bor, lekin .format() argumentida mos kalit yo'q.
3. f-string bo'lsa, `{` dan keyin ifoda emas, oddiy matn.

## Tuzatish (aynan shu)
Literal qavslarni ikki marta yoz:

```python
# Noto'g'ri
template = "JSON: { 'key': 'value' }"
print(template.format())  # ValueError

# To'g'ri
template = "JSON: {{ 'key': 'value' }}"
print(template.format())  # JSON: { 'key': 'value' }

# f-string uchun
data = {"key": "value"}
# Noto'g'ri: f"{{ 'key': {data['key']} }}"  — ichki ham escape kerak
print(f"JSON: {{ 'key': '{data[\"key\"]}' }}")
```

Yoki json.dumps ishlat, qo'lda string qurish o'rniga.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Format string'larda literal `{` `}` uchun `{{` `}}` ishlatilishi shart. Aks holda parser ularni placeholder deb o'qiydi va xato beradi. Bu skillni o'qib, shunday xatoga duch kelsang, avval qavslarni escape qilganingni tekshir.

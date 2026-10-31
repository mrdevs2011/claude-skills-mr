---
name: python-fstring-unescaped-braces
description: Python f-string ichida literal qavslar { } yoki murakkab quote ishlatilganda SyntaxError chiqadi yoki kutilmagan interpolatsiya sodir bo'ladi, chunki qavslar escape qilinmagan.
---

# Python f-string'da escape qilinmagan qavslar

## Nima uchun bu skill kerak
F-string'lar qulay, lekin ichida JSON, format string, yoki boshqa qavsli matn yozish kerak bo'lganda AI yoki dasturchi qavslarni escape qilishni unutadi. Natijada darhol SyntaxError yoki noto'g'ri qiymat interpolatsiya qilinadi. Bu oddiy syntax xatosi emas — f-string qoidalarini bilmaslikdan kelib chiqadi.

## Simptom (aynan shu)
- `SyntaxError: f-string: expecting '}'` yoki `invalid syntax` f-string qatorida.
- Yoki kod ishlaydi, lekin `{something}` matn o'rniga o'zgaruvchi qiymati chiqadi (kutilmagan interpolatsiya).
- Ko'pincha JSON, SQL, yoki boshqa template matnni f-string ichiga qo'yishda.

## Sabab (100%)
F-string ichida `{` va `}` interpolatsiya uchun maxsus. Literal qavs kerak bo'lsa, ularni `{{` va `}}` qilib ikki marta yozish kerak. Bitta `{` yozilsa, parser keyingi `}` ni kutadi va xato beradi yoki o'zgaruvchini o'qiydi.

## Tasdiqlash
1. Xato matnidagi qatorni och.
2. F-string (f"..." yoki f'...') ichida `{` bor-yo'qligini tekshir.
3. U interpolatsiya uchunmi yoki literal matnmi? Agar literal bo'lsa va `{{` emas — bu holat.
4. Quote'lar ham to'g'ri escape qilinganmi (agar ichida bir xil quote bo'lsa).

## Tuzatish (aynan shu)
Literal qavslarni ikki marta yoz:

```python
# XATO:
msg = f"JSON: {\"key\": \"value\"}"  # yoki
template = f"Hello {name}, use {placeholder}"

# TO'G'RI:
msg = f'JSON: {{"key": "value"}}'
template = f"Hello {name}, use {{placeholder}}"

# Yoki alohida string bilan:
json_part = '{"key": "value"}'
msg = f"JSON: {json_part}"
```

Agar murakkab bo'lsa, `.format()` yoki oddiy concatenation ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- F-string'da literal `{` va `}` uchun `{{` va `}}` ishlatiladi.
- Bitta qavs — interpolatsiya. Ikki qavs — literal matn.
- JSON yoki template yozishda avval alohida o'zgaruvchiga ajratish yoki to'g'ri escape qilish kerak.

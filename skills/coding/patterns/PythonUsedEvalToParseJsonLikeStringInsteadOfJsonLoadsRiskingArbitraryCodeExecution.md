---
name: python-eval-json-instead-of-json-loads
description: Python kodda JSON yoki JSON-o'xshash stringni eval() yoki ast.literal_eval o'rniga json.loads bilan parse qilish o'rniga eval ishlatilgan — xavfsizlik xavfi (code execution) va noto'g'ri parsing.
---

# JSON parse uchun eval() ishlatish

## Nima uchun bu skill kerak
eval() istalgan Python kodini bajaradi. Agar string foydalanuvchi yoki tashqi manbadan kelsa, bu arbitrary code execution xavfini yaratadi. JSON uchun maxsus json.loads xavfsiz, tez va to'g'ri.

## Simptom (aynan shu)
- Kodda `data = eval(json_string)` yoki `eval(response.text)` ko'rinishida JSON parse qilinadi.
- String tashqi API, fayl yoki foydalanuvchi inputidan keladi.
- Xavfsizlik auditida "eval on untrusted input" ogohlantirishi.
- Ba'zan single quote yoki Python dict literal bo'lgani uchun ishlatiladi, lekin baribir xavfli.

## Sabab (100%)
Dasturchi json.loads o'rniga "tezroq" yoki "Python dict literalni ham qabul qiladi" deb eval ishlatadi, lekin xavfsizlik va aniq JSON specifikatsiyasini hisobga olmaydi. json.loads faqat valid JSON qabul qiladi.

## Tasdiqlash
1. eval() yoki exec() JSON/dict string ustida ishlatilganmi?
2. String ishonchsiz manbadan keladimi?
3. Agar ha — bu holat. json.loads ishlatish kerak.

## Tuzatish (aynan shu)
Har doim json.loads ishlat. Agar Python literal kerak bo'lsa, ast.literal_eval (lekin JSON uchun emas).

Noto'g'ri:
```python
import json
raw = '{"key": "value"}'  # yoki tashqidan
data = eval(raw)  # XAVFLI
```

To'g'ri:
```python
import json
raw = '{"key": "value"}'
data = json.loads(raw)

# Agar xato bo'lishi mumkin:
try:
    data = json.loads(raw)
except json.JSONDecodeError as e:
    # handle error
    raise
```

Agar single-quoted yoki trailing comma bo'lsa, avval to'g'ri JSON ga o'tkaz yoki proper parser ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
JSON parse uchun hech qachon eval() ishlatma — bu code execution xavfi. Doim json.loads (yoki ishonchli parser) ishlat. Xavfsizlik va to'g'rilik birinchi o'rinda.

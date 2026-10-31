---
name: python-string-concat-json-instead-of-dumps
description: Python kodida JSON payload yoki response'ni string concatenation yoki .format() bilan qurish o'rniga json.dumps ishlatilmaganda — noto'g'ri escaping, invalid JSON yoki injection xavfi. Search qilinganda "json string concat", "build json manually", "json.dumps" kalit so'zlari bilan topiladi.
---

# Python: JSON ni string bilan qurish o'rniga json.dumps ishlat

## Nima uchun bu skill kerak
Agent yoki developer oddiy dict/list dan JSON yasash kerak bo'lganda ko'pincha string + yoki f-string / .format() bilan qo'lda quradi. Bu maxsus belgilar (quote, backslash, newline) bilan osongina invalid JSON hosil qiladi yoki xavfsizlik muammosiga olib keladi. json.dumps to'g'ri encoding va escaping ni kafolatlaydi.

## Simptom (aynan shu)
- JSON.parse yoki client tomonda "Unexpected token" / "Invalid JSON" xatosi
- API response yoki logda quote belgilar escape qilinmagan holda chiqadi
- User input (masalan ism, matn) JSON ichiga qo'yilganda syntax buziladi
- Kodda shunga o'xshash qatorlar:
  ```python
  payload = '{"name": "' + user_name + '", "age": ' + str(age) + '}'
  # yoki
  payload = f'{{"message": "{text}"}}'
  ```

## Sabab (100%)
JSON spetsifikatsiyasiga muvofiq string qiymatlari maxsus belgilarni escape qilishi shart ( ", \, \n, \t, \uXXXX va h.k.). Qo'lda string qurish bu qoidalarni qo'lda amalga oshirishni talab qiladi — odamlar yoki agentlar ko'pincha buni to'liq qilmaydi. Python standard kutubxonasidagi `json` moduli buni to'g'ri va xavfsiz qiladi.

## Tasdiqlash
1. Kodda `json.dumps` o'rniga `+`, f-string yoki `.format` bilan `{` `}` ichida string yig'ilayotganini qidir.
2. User-controlled yoki dinamik qiymatlar string interpolation bilan JSON ichiga tushayotganini tekshir.
3. Natijani `json.loads(payload)` bilan sinab ko'r — xato bersa, bu holat.

## Tuzatish (aynan shu)
`json.dumps` ishlat. Dict/list yasab, keyin dumps qil:

```python
import json

# Noto'g'ri
# payload = '{"name": "' + user_name + '"}'

# To'g'ri
data = {"name": user_name, "age": age}
payload = json.dumps(data, ensure_ascii=False)  # kerak bo'lsa indent=2
```

Agar maxsus tip (datetime, set) bo'lsa, `default` handler ber:

```python
def default(o):
    if isinstance(o, datetime):
        return o.isoformat()
    raise TypeError

payload = json.dumps(data, default=default)
```

Hech qachon user inputni to'g'ridan-to'g'ri string ichiga qo'yma — avval data structure yasab, keyin serializatsiya qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
JSON ni hech qachon string concatenation yoki format bilan qurma. Har doim Python dict/list yarating va `json.dumps` chaqiring. Bu invalid JSON, escaping xatolari va potentsial injectionni oldini oladi. Kodda shunga o'xshash naqsh ko'rsang, darhol `json.dumps` ga o'tkaz.

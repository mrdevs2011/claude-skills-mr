---
name: python-pickle-untrusted-load-arbitrary-code-execution
description: pickle.load or pickle.loads on data from untrusted/external sources (user upload, network, file not fully controlled) can execute arbitrary code. Use when deserializing untrusted data with pickle.
---

# Python used pickle.load on untrusted data causing arbitrary code execution risk

## Nima uchun bu skill kerak
pickle moduli Python ob'ektlarini serializatsiya qilish uchun qulay, lekin untrusted manbadan kelgan ma'lumotni load qilganda istalgan kodni bajarish imkonini beradi. Bu RCE (remote code execution) xavfini keltirib chiqaradi.

## Simptom (aynan shu)
Kodda `pickle.load(f)`, `pickle.loads(data)`, yoki `pickle.Unpickler` ishlatilgan, va `data`/`f` foydalanuvchi inputi, tashqi API, yuklangan fayl yoki to'liq nazorat qilinmagan manbadan keladi. Xavfsizlik tekshiruvi yoki alternativ serializer yo'q.

## Sabab (100%)
pickle protokoli `__reduce__`, `__setstate__` kabi maxsus metodlarni chaqirishi mumkin. Hujumchi maxsus crafted pickle baytlarini yuborib, `os.system`, `subprocess` yoki boshqa xavfli kodni ishga tushirishi mumkin. Bu ataylab shunday ishlaydi — pickle trusted data uchun mo'ljallangan.

## Tasdiqlash
1. `pickle.load` / `loads` chaqiruvini toping.
2. Ma'lumot manbasini kuzating: user input, request body, uploaded file, external URL, shared storage?
3. Agar manba to'liq o'z nazoratingizda emas (yoki foydalanuvchi ta'sir qila oladi) — bu skill qo'llaniladi.
4. Alternativ (json, msgpack, protobuf) ishlatilmaganini tasdiqlang.

## Tuzatish (aynan shu)
Untrusted data uchun pickle ishlatmang. O'rniga xavfsiz format ishlating.

```python
# Yomon (xavfli)
import pickle
with open(user_uploaded_file, "rb") as f:
    obj = pickle.load(f)  # RCE xavfi

# Yaxshi — JSON (agar struktura oddiy bo'lsa)
import json
with open(user_uploaded_file, "r", encoding="utf-8") as f:
    obj = json.load(f)

# Yoki trusted va o'z format uchun pickle, lekin faqat to'liq nazorat ostida
# va imzo/HMAC bilan tekshirish bilan (murakkab holatlar uchun)
```

Agar murakkab Python ob'ektlarini saqlash kerak bo'lsa va manba trusted bo'lsa ham, imkon qadar `json` + custom encoder yoki `dataclasses` + `asdict` ishlating. pickle faqat o'z ichki, to'liq nazorat qilingan data uchun.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
pickle.load untrusted manbadan — bu RCE. Untrusted data uchun hech qachon pickle ishlatmang, json yoki boshqa xavfsiz serializer tanlang.

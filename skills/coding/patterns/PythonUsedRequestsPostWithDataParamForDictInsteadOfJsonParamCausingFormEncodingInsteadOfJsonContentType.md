---
name: python-requests-post-data-vs-json-param
description: requests.post da dict ni data= bilan yuborish json= o'rniga — Content-Type form-urlencoded bo'lib qoladi va server JSON kutganda xato.
---

# requests.post da data= o'rniga json= ishlatish

## Nima uchun bu skill kerak
Python `requests` kutubxonasida POST so'rov yuborishda dict yoki list ni `data=` parametriga bersang, u form-urlencoded yoki multipart sifatida yuboriladi. Ko'p API'lar `application/json` kutadi. Noto'g'ri parametr ishlatish silent xato yoki 400/415 ga olib keladi.

## Simptom (aynan shu)
- `requests.post(url, data={"key": "value"})` yoki `data=payload` ishlatilgan.
- Server "Invalid JSON" yoki "Content-Type must be application/json" qaytaradi.
- So'rov ketadi, lekin body form formatida.
- `response.json()` ishlamaydi yoki unexpected structure.

## Sabab (100%)
`requests` da:
- `data=` — form data (dict bo'lsa `application/x-www-form-urlencoded`)
- `json=` — avtomatik `json.dumps` qiladi va `Content-Type: application/json` qo'yadi

Agent yoki kod `data=` ni default deb ishlatadi, `json=` parametrini bilmaydi yoki esdan chiqaradi.

## Tasdiqlash
1. POST yoki PUT so'rovda payload dict/list ekanini tekshir.
2. Server dokumentatsiyasida Content-Type `application/json`mi?
3. Kodda `data=` ishlatilganmi, `json=` emasmi?
4. Agar ha — xato shu.

## Tuzatish (aynan shu)
`data=` o'rniga `json=` ishlat.

**Noto'g'ri:**
```python
import requests

payload = {"name": "test", "value": 42}
response = requests.post("https://api.example.com/items", data=payload)
# Content-Type: application/x-www-form-urlencoded
# body: name=test&value=42
```

**To'g'ri:**
```python
import requests

payload = {"name": "test", "value": 42}
response = requests.post("https://api.example.com/items", json=payload)
# Content-Type: application/json
# body: {"name": "test", "value": 42}
```

Agar maxsus encoding kerak bo'lsa (form), unda `data=` to'g'ri, lekin JSON API uchun har doim `json=`.

Timeout qo'shishni unutma: `timeout=10`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`requests` da JSON yuborish uchun har doim `json=` parametrini ishlat. `data=` form uchun. Bu Content-Type va serialization ni to'g'ri qiladi, 400/415 xatolarini oldini oladi.

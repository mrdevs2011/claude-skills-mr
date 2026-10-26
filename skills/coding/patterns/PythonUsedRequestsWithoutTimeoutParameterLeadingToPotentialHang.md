---
name: python-requests-without-timeout
description: requests.get/post yoki boshqa HTTP chaqiruvlarida timeout parametri berilmagan. Tarmoq sekinlashsa yoki server javob bermasa, chaqiruv abadiy osilib qolishi mumkin.
---

# Python requests chaqiruvlarida timeout parametrini unutish

## Nima uchun bu skill kerak
Agentlar va skriptlar tez-tez `requests.get(url)` yoki `requests.post` ishlatadi. Timeout bo'lmasa, agar server sekin javob bersa, DNS muammosi bo'lsa yoki connection hang qilsa, butun process bloklanadi. Bu agent workflowlarida, background tasklarda yoki productionda jiddiy muammo.

## Simptom (aynan shu)
- Kodda `requests.get(...)`, `requests.post(...)`, `requests.request(...)` bor, lekin `timeout=` parametri yo'q.
- Import `requests` qilingan, lekin hech qayerda timeout o'tkazilmagan.
- Uzoq vaqt javob kelmayotgan holatlarda process to'xtab qoladi, Ctrl+C qilish kerak.
- Log yoki xato yo'q, shunchaki "osilib" qoladi.

## Sabab (100%)
Eng oddiy misol `requests.get(url)` timeoutsiz yoziladi. Agent "odatda tez ishlaydi" deb taxmin qiladi yoki timeout qo'shishni unutadi. Dokumentatsiyada default timeout yo'qligi esdan chiqadi.

## Tasdiqlash
1. Kodda `requests.` chaqiruvlari bormi?
2. Har bir chaqiruvda `timeout=` (masalan timeout=10 yoki timeout=(5, 30)) bor-mi?
3. Agar Session ishlatilgan bo'lsa, session.request yoki mount qilingan adapterda timeout bormi?
4. Test: sekin server yoki `timeout` kichik qiymat bilan sinab ko'rish.

## Tuzatish (aynan shu)
Har doim timeout bering. Connect va read timeout alohida bo'lishi mumkin.

```python
import requests

# Noto'g'ri (osilib qolishi mumkin):
response = requests.get("https://api.example.com/data")
response = requests.post(url, json=payload)

# To'g'ri:
response = requests.get(
    "https://api.example.com/data",
    timeout=(5, 30)  # 5s connect, 30s read
)
response = requests.post(
    url,
    json=payload,
    timeout=15  # yoki float/int bir xil ikkala uchun
)

# Session bilan:
session = requests.Session()
response = session.get(url, timeout=(3, 20))
```

Qoidalar:
- Kamida `timeout=10` yoki aniqroq tuple ishlat.
- Uzoq operatsiyalar uchun kattaroq, lekin cheksiz emas.
- Retry logikasi kerak bo'lsa, `urllib3.util.retry` yoki tenacity bilan, lekin timeout asosiy.
- Agar streaming bo'lsa, timeout o'qish davomida ham ishlaydi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- requests default timeout yo'q, shuning uchun har doim berish kerak.
- timeout=(connect, read) aniqroq boshqaruv beradi.
- Timeout yo'qligi agent yoki server kodini bloklab qo'yishi mumkin.

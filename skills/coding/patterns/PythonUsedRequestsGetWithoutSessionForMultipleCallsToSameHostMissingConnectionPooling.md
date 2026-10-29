---
name: python-requests-no-session-multiple-calls
description: Python kodda bir xil hostga bir nechta so'rov yuborishda requests.get/post ishlatilgan, lekin requests.Session ishlatilmagan — har safar yangi connection ochiladi, pooling yo'q, sekinroq va resursni ko'proq ishlatadi.
---

# Bir nechta HTTP so'rovda requests.Session ishlatmaslik

## Nima uchun bu skill kerak
requests.Session connection pooling va cookie persistence ni ta'minlaydi. Bir xil hostga bir nechta so'rov yuborishda Session ishlatmaslik har safar yangi TCP connection ochadi, DNS lookup qayta qiladi va sekin ishlaydi. Bu ayniqsa loop ichida yoki batch so'rovlarda sezilarli.

## Simptom (aynan shu)
- Kodda `for` loop yoki bir nechta `requests.get(url)` / `requests.post(url)` bir xil base hostga.
- `requests.Session()` yaratilmagan va `session.get` ishlatilmagan.
- Ko'p so'rovli skript sekin ishlaydi yoki connection limitiga duch keladi.
- Profilingda ko'p vaqt connection setup ga ketadi.

## Sabab (100%)
Dasturchi oddiy `requests.get` ni bitta so'rov uchun ishlatishga o'rganib qolgan va bir nechta so'rovda ham xuddi shunday qiladi, Session ning pooling afzalligini hisobga olmaydi. requests hujjatlarida bir nechta so'rov uchun Session tavsiya qilinadi.

## Tasdiqlash
1. Bir xil hostga (yoki bir nechta URL) 2+ marta `requests.get`/`post` chaqirilganmi?
2. `requests.Session()` ishlatilmaganmi?
3. Agar ha — bu holat. Session bilan o'zgartir.

## Tuzatish (aynan shu)
Session yarat va uni qayta ishlat.

Noto'g'ri:
```python
import requests

def fetch_all(urls):
    results = []
    for url in urls:
        resp = requests.get(url, timeout=10)
        results.append(resp.json())
    return results
```

To'g'ri:
```python
import requests

def fetch_all(urls):
    results = []
    with requests.Session() as session:
        for url in urls:
            resp = session.get(url, timeout=10)
            results.append(resp.json())
    return results
```

Session context manager bilan yoki oddiy holda ham ishlaydi. Timeout ni har doim ber.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Bir xil hostga bir nechta so'rov yuborishda doim `requests.Session` ishlat — connection pooling tufayli tezroq va samaraliroq. Bitta so'rov uchun oddiy `requests.get` yetarli.

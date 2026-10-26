---
name: http-request-without-timeout-hangs-forever-on-unresponsive-endpoint
description: requests/urllib/fetch/httpx chaqiruvlarida timeout parametri yo'q — sekin yoki javob bermaydigan serverda so'rov abadiy osilib qoladi, dastur bloklanadi.
---

# HTTP so'rov timeout'siz — javob bermasa abadiy kutadi

## Nima uchun bu skill kerak
Agentlar tez-tez `requests.get(url)`, `fetch(url)`, `httpx.get(url)` yoki `urllib.request.urlopen` ni timeout'siz yozadi. Oddiy holatda ishlaydi, lekin server sekin, DNS muammosi, yoki umuman javob bermasa — so'rov hech qachon tugamaydi. Bu skriptni, agent tool chaqiruvini yoki server handler'ni butunlay bloklaydi. Timeout qo'yish majburiy himoya.

## Simptom (aynan shu)
- Kodda `requests.get("https://...")` yoki `fetch(url)` bor, `timeout=` yoki signal/AbortController yo'q.
- So'rov "osilib" qoladi, hech qanday xato chiqmaydi, faqat kutadi.
- Log'da hech narsa yo'q, process CPU 0%, lekin tugamaydi.
- Timeout xatosi (ConnectTimeout, ReadTimeout) hech qachon ko'rinmaydi — chunki timeout o'zi yo'q.
- Agent tool (web_search, open_page, browser) ichida yoki o'z skriptida yuz beradi.

## Sabab (100%)
HTTP kutubxonalarining default timeout'i `None` (cheksiz). Agent "ishlaydi" deb taxmin qiladi va timeout parametrini qo'shishni unutadi. Sezilarli emas, chunki muvaffaqiyatli so'rovlarda farqi yo'q.

## Tasdiqlash
1. Kodni qidir: `requests.get(`, `requests.post(`, `httpx.`, `fetch(`, `urlopen(` — yonida `timeout=` bormi?
2. Python: `requests` yoki `httpx` ishlatilgan bo'lsa, timeout keyword argument tekshir.
3. JS: `fetch` da `signal` (AbortController + setTimeout) yoki library timeout bormi?
4. Amalda sinash: sekin endpoint (masalan `https://httpbin.org/delay/10`) ga so'rov yubor, 5s ichida xato chiqadimi?

## Tuzatish (aynan shu)
Har doim timeout qo'y:

```python
# Noto'g'ri (abadiy kutishi mumkin):
import requests
r = requests.get("https://api.example.com/data")

# To'g'ri:
r = requests.get("https://api.example.com/data", timeout=10)  # 10 soniya
# yoki connect va read alohida:
r = requests.get(url, timeout=(3.05, 27))
```

```python
# httpx:
import httpx
with httpx.Client(timeout=10.0) as client:
    r = client.get(url)
```

```javascript
// fetch + AbortController:
const controller = new AbortController();
const id = setTimeout(() => controller.abort(), 10000);
try {
  const r = await fetch(url, { signal: controller.signal });
} finally {
  clearTimeout(id);
}
```

Default sifatida 5–30 soniya oralig'ida tanla (tashqi API uchun 10–15s odatda yetarli).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Har qanday tashqi HTTP so'rovga timeout qo'y.
- Timeout yo'qligi "ishlaydi" degani emas — eng yomon holatda abadiy bloklaydi.
- Python `requests`/`httpx` da `timeout=`, JS `fetch` da `AbortController` ishlat.

---
name: python-requests-jsondecodeerror-expecting-value-char-0-empty-or-non-json-response
description: requests Response.json() or json.loads raises JSONDecodeError "Expecting value: line 1 column 1 (char 0)" because body is empty, HTML, or non-JSON. Check status, content-type, and text before parsing.
id: python-requests-jsondecodeerror-expecting-value-char-0-empty-or-non-json-response
type: playbook
stack: Python 3.10.21 + requests 2.34.2 (Linux sandbox)
confirmed_on: 2026-11-18
confidence: high (reproduced in sandbox + official docs)
triggers:
  - JSONDecodeError: Expecting value: line 1 column 1 (char 0)
  - Expecting value: line 1 column 1 (char 0)
  - json.decoder.JSONDecodeError Expecting value
  - response.json() Expecting value char 0
  - requests json empty response or HTML
  - JSONDecodeError empty body or non-json
  - Expecting value line 1 column 1
  - response.text empty or not json
  - python requests .json() fails char 0
  - JSONDecodeError on API response
related:
  - python-json-dumps-nan-inf-produces-invalid-json-use-allow-nan-false
  - python-unicodedecodeerror-open-text-non-utf8-or-binary-specify-encoding-or-errors-replace
---

# requests JSONDecodeError Expecting value (char 0) — bo'sh yoki non-JSON response

## TL;DR
Simptom: `response.json()` yoki `json.loads(...)` `json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)` beradi.
Sabab: response body bo'sh, HTML error sahifa, yoki umuman JSON emas (status 204/4xx/5xx yoki noto'g'ri content-type).
Birinchi buyruq: `print(response.status_code, response.headers.get("content-type"), repr(response.text[:200]))`
Done: status 200, content-type application/json, va `response.json()` muvaffaqiyatli qaytaradi.

## Qachon ishlatish / ishlatmaslik
Ishlat: API chaqiruvdan keyin `.json()` yoki `json.loads(response.text)` "Expecting value: line 1 column 1 (char 0)" bersa.
Ishlatma: "Extra data", "Unterminated string", yoki boshqa JSONDecodeError xabarlari; yoki fayl o'qishda (encoding muammosi alohida skill). Agar response allaqachon to'g'ri JSON bo'lsa — boshqa muammo.

## Mental model (nima uchun)
[SRC:https://docs.python.org/3/library/json.html#json.JSONDecodeError @ Python 3.10] `json.loads` faqat valid JSON document kutadi. Bo'sh string, whitespace, HTML, plain text — hammasi "Expecting value" (pos=0) beradi. [SRC:https://requests.readthedocs.io/en/latest/user/quickstart/#json-response-content @ requests 2.34] `response.json()` ichkarida `json.loads(response.text)` qiladi va status/content-type tekshirmaydi. Server 204 No Content, 404 HTML, yoki proxy error qaytarsa body JSON emas. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini o'qi: aynan "Expecting value: line 1 column 1 (char 0)" bormi?
   EXPECTED: ha. Agar "Extra data" yoki "Expecting ',' delimiter" → boshqa sabab (trailing comma yoki qo'shimcha matn).

2. Response holatini chiqar (eng arzon, hech narsa o'zgartirmaydi):
   ```bash
   python3 -c '
import requests
r = requests.get("https://httpbin.org/status/204", timeout=10)
print("status:", r.status_code)
print("content-type:", r.headers.get("content-type"))
print("text repr:", repr(r.text[:300]))
try:
    print(r.json())
except Exception as e:
    print(type(e).__name__, e)
'
   ```
   EXPECTED: status 204, text '', JSONDecodeError. Agar status 200 va text JSON ko'rinsa — parsing boshqa joyda xato. [SANDBOX]

3. Content-type va uzunlik:
   ```bash
   # o'z kodingizda:
   print(response.status_code, response.headers.get("content-type"), len(response.content))
   ```
   EXPECTED: content-type application/json emas yoki len==0. Agar application/json va len>0 — body buzilgan (encoding?).

4. Haqiqiy body'ni ko'r:
   ```bash
   print(response.text[:500])  # yoki response.content[:200]
   ```
   EXPECTED: HTML (<html>), bo'sh, yoki "Not Found". Agar valid JSON ko'rinsa — encoding yoki BOM muammosi (alohida).

## Fix har bir sabab uchun
Sabab 1: status not 2xx yoki body bo'sh/HTML (eng keng tarqalgan).
Fix — parse qilishdan oldin tekshir:
```python
import requests
r = requests.get(url, timeout=30)
r.raise_for_status()  # 4xx/5xx da exception
if not r.content:
    raise ValueError("empty body")
ct = r.headers.get("content-type", "")
if "application/json" not in ct:
    raise ValueError(f"not JSON: {ct} body={r.text[:200]!r}")
data = r.json()
```
Tekshir:
```bash
python3 -c '
import requests
r = requests.get("https://httpbin.org/json", timeout=10)
r.raise_for_status()
assert "application/json" in r.headers.get("content-type","")
print(r.json()["slideshow"]["title"])
print("OK")
'
```
EXPECTED: title chiqadi, OK. [SANDBOX]

Sabab 2: 204 No Content (qonuniy bo'sh).
```python
if r.status_code == 204 or not r.content:
    data = None  # yoki {}
else:
    data = r.json()
```

Sabab 3: encoding/BOM (kamroq).
```python
text = r.content.decode("utf-8-sig")
data = json.loads(text)
```

## Where agents go wrong
1. `response.json()` ni status tekshirmasdan chaqirish — 404 HTML ni JSON deb o'ylash.
2. `except Exception: pass` bilan yashirish, ildizni qoldirish.
3. Faqat `json.loads(response.text)` qilish, content-type va status ni e'tiborsiz qoldirish.
4. httpbin yoki test server o'rniga real API da timeout/proxy xatosini JSON deb o'ylash.

## Edge cases
1. Status 200 lekin body "null" yoki "" — `r.json()` None qaytaradi yoki xato; `if r.text.strip() in ("", "null"): data = None`.
2. Content-Encoding gzip, lekin requests avtomatik decompress qiladi; agar manual bo'lsa zlib kerak.
3. Streaming response yoki chunked — `r.content` to'liq o'qilishi kerak.
4. [not verified] WebSocket yoki binary endpoint — alohida.

## Done criteria
```bash
python3 -c '
import requests, json
r = requests.get("https://httpbin.org/json", timeout=10)
assert r.status_code == 200
assert "json" in r.headers.get("content-type","").lower()
data = r.json()
assert isinstance(data, dict)
print("done criteria OK")
'
# va xato holatni ushlash:
python3 -c '
import requests
r = requests.get("https://httpbin.org/status/404", timeout=10)
try:
    r.raise_for_status()
    r.json()
    print("FAIL should have raised")
except Exception as e:
    print("caught as expected:", type(e).__name__)
'
```
EXPECTED: "done criteria OK" va "caught as expected".

## If still failing
- Body haqiqatan valid JSON ekanligini `python3 -m json.tool < response.txt` bilan tekshir.
- Proxy/firewall HTML qaytaryaptimi? `curl -I URL` bilan headerlarni ko'r.
- requests o'rniga urllib ishlatilsa — xuddi shu: status va body tekshir.
- Encoding muammosi bo'lsa python-unicodedecodeerror skillga o't.

## Sources + confidence
- [SRC:https://docs.python.org/3/library/json.html#json.JSONDecodeError @ 3.10] JSONDecodeError on invalid document, pos=0 for empty/non-value.
- [SRC:https://requests.readthedocs.io/en/stable/user/quickstart/#json-response-content @ 2.34] response.json() = json.loads(text), no auto status check.
- [SANDBOX] reproduced empty body and HTML both give "Expecting value: line 1 column 1 (char 0)".
Confidence: high.

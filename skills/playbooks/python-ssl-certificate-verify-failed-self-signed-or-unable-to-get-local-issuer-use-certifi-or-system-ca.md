---
name: python-ssl-certificate-verify-failed-self-signed-or-unable-to-get-local-issuer-use-certifi-or-system-ca
description: Python urllib/requests SSL CERTIFICATE_VERIFY_FAILED self-signed or unable to get local issuer. Fix with certifi.cafile or system CA, never verify=False in prod. Triggers on exact error texts.
id: python-ssl-certificate-verify-failed-self-signed-or-unable-to-get-local-issuer-use-certifi-or-system-ca
type: playbook
stack: Python 3.10.21 + OpenSSL + certifi 2026.7.22
confirmed_on: 2026-11-15
confidence: high (reproduced in sandbox + official docs)
triggers:
  - "[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed"
  - "unable to get local issuer certificate"
  - "self-signed certificate"
  - "ssl.SSLCertVerificationError"
  - "URLError: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED]"
  - "requests SSLError CERTIFICATE_VERIFY_FAILED"
  - "python https fails but curl works"
  - "CERTIFICATE_VERIFY_FAILED on macOS Python"
  - "update certifi for SSL"
  - "ssl create_default_context cafile certifi"
related:
  - python-json-dumps-nan-inf-produces-invalid-json-use-allow-nan-false
---

# Python SSL CERTIFICATE_VERIFY_FAILED: self-signed yoki unable to get local issuer — certifi yoki system CA ishlat

## TL;DR
Simptom: `urllib.request.urlopen('https://...')` yoki requests da `[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: self-signed certificate` yoki `unable to get local issuer certificate`.
Sabab: Python'ning default CA bundle eski, yo'q, yoki server self-signed/intermediate yo'q.
Birinchi buyruq: `python3 -c "import certifi; print(certifi.where())"`
Done: context = ssl.create_default_context(cafile=certifi.where()) bilan 200 qaytadi, verify=False ishlatilmagan.

## Qachon ishlatish / ishlatmaslik
Ishlat: HTTPS so'rovlar (urllib, requests, httpx) SSL xato bersa, curl esa ishlasa, yoki self-signed/local CA.
Ishlatma: oddiy network timeout, DNS xato, yoki productionda verify=False qoldirish (xavfsizlik).

## Mental model (nima uchun)
[SRC:https://docs.python.org/3/library/ssl.html @ 3.10+ 2026-11] `ssl.create_default_context()` `load_default_certs()` orqali system CA'larni yuklaydi. Python.org macOS install'da yoki eski container'da bundle yo'q/eski bo'lishi mumkin. certifi Mozilla CA bundle beradi. Self-signed uchun alohida cafile yoki (faqat test) unverified context. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Xato matnini to'liq o'qi: `python3 -c "import urllib.request; urllib.request.urlopen('https://self-signed.badssl.com/')"`  
   EXPECTED: URLError: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: self-signed certificate (_ssl.c:1017)>  
   Agar "unable to get local issuer" → CA bundle muammosi. Agar self-signed → 3-ga.

2. System CA tekshir: `python3 -c "import ssl; print(ssl.get_default_verify_paths())"`  
   EXPECTED: cafile yo'li ko'rinadi. Agar None yoki yo'q → certifi ishlat.

3. certifi bor-mi: `python3 -c "import certifi; print(certifi.where())"`  
   EXPECTED: /.../certifi/cacert.pem chiqadi. Yo'q bo'lsa `pip install --upgrade certifi`.

4. Yaxshi sayt ishlaydimi: `python3 -c "import urllib.request; print(urllib.request.urlopen('https://www.python.org').status)"`  
   EXPECTED: 200. Ishlasa, faqat shu server muammosi (self-signed yoki chain).

## Fix har bir sabab uchun
Sabab 1 (eski/yo'q CA bundle): certifi ishlat.  
```python
import ssl, certifi, urllib.request
ctx = ssl.create_default_context(cafile=certifi.where())
print(urllib.request.urlopen('https://www.python.org', context=ctx).status)
```
Tekshir: 200.

Sabab 2 (self-signed, faqat test):  
```python
import ssl, urllib.request
ctx = ssl._create_unverified_context()
print(urllib.request.urlopen('https://self-signed.badssl.com/', context=ctx).status)
```
Productionda qilma. O'z CA'ni cafile qilib ber.

Requests uchun: `import certifi; requests.get(url, verify=certifi.where())`

## Agentlar qayerda xato qiladi
1. Har doim `verify=False` yoki `_create_unverified_context` qo'yib, xavfsizlikni o'chiradi.
2. System ca-certificates yangilashni unutadi (`apt install ca-certificates`).
3. macOS'da Install Certificates.command ishga tushirmaydi.
4. Intermediate certificate yo'qligini server tomondan deb o'ylamaydi.

## Edge cases
1. Corporate proxy MITM: company root CA'ni certifi ga qo'sh yoki SSL_CERT_FILE env. [not verified]
2. Python 3.10+ macOS python.org: Install Certificates.command majburiy. [SRC docs + common]
3. Docker: `RUN apt-get update && apt-get install -y ca-certificates` va certifi. [GUESS]

## Done criteria
```bash
python3 - << 'PY'
import ssl, certifi, urllib.request
ctx = ssl.create_default_context(cafile=certifi.where())
assert urllib.request.urlopen('https://www.python.org', context=ctx).status == 200
print("PASS good site")
ctx_bad = ssl._create_unverified_context()
assert urllib.request.urlopen('https://self-signed.badssl.com/', context=ctx_bad).status == 200
print("PASS self-signed test")
PY
```
PASS chiqishi kerak. verify=False production kodda yo'q.

## Agar hali ham ishlamasa
- `openssl s_client -connect host:443 -showcerts` bilan chain tekshir.
- `pip install --upgrade certifi` qayta.
- Clock skew: `date` to'g'rimi.
- Docs: https://docs.python.org/3/library/ssl.html#ssl.create_default_context

## Sources + confidence
- [SRC:https://docs.python.org/3/library/ssl.html 2026-11] create_default_context uses load_default_certs.
- [SANDBOX] 2026-11-15: wrong = URLError self-signed (_ssl.c:1017); right unverified = 200; certifi path exists; python.org = 200.
- Confidence: 95% (repro + docs). 100% emas, chunki har OS/Python install boshqacha CA.

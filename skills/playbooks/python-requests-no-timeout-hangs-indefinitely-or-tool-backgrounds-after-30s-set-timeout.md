---
name: python-requests-no-timeout-hangs-indefinitely-or-tool-backgrounds-after-30s-set-timeout
description: requests.get/post without timeout= hangs forever (default None) or causes bash tool to background after 30s. Always pass timeout= to raise Timeout quickly. 
id: python-requests-no-timeout-hangs-indefinitely-or-tool-backgrounds-after-30s-set-timeout
type: playbook
stack: Python 3.10.21 + requests 2.34.2 (Linux sandbox)
confirmed_on: 2026-11-19
confidence: high (reproduced in sandbox + official docs)
triggers:
  - requests.get hangs or never returns
  - requests timeout default None hangs indefinitely
  - python requests tool timeout background after 30s
  - requests.get no response tool moved to background
  - ReadTimeout or ConnectTimeout not raised without timeout
  - requests call blocks forever until kill
  - how to set timeout on requests.get
  - requests hangs on slow or unresponsive server
  - bash tool 30s timeout on python requests
  - requests.exceptions.Timeout not raised
related:
  - bash-tool-long-command-times-out-after-30s-backgrounds-poll-output-with-get-terminal-command-output
  - python-requests-jsondecodeerror-expecting-value-char-0-empty-or-non-json-response
  - python-ssl-certificate-verify-failed-self-signed-or-unable-to-get-local-issuer-use-certifi-or-system-ca
---

# requests.get/post timeout yo'q — cheksiz osiladi yoki tool 30s da backgroundga o'tadi

## TL;DR
Simptom: `requests.get(url)` yoki `post` hech qachon qaytmaydi, yoki bash tool "moved to the background as task" 30s dan keyin.
Sabab: default `timeout=None` — server javob bermasa cheksiz kutadi. [SRC:https://requests.readthedocs.io/en/latest/user/advanced.html#timeouts @ requests 2.34.2]
Birinchi buyruq: `requests.get(url, timeout=10)` (yoki (connect, read) tuple).
Done: `except requests.exceptions.Timeout` ushlanadi yoki tez qaytadi, tool backgroundga o'tmaydi.

## Qachon ishlatish / ishlatmaslik
Ishlat: requests chaqiruvi osiladi, tool 30s da backgroundga o'tadi, yoki sekin serverda kutish kerak emas.
Ishlatma: allaqachon timeout= berilgan va Timeout exception chiqsa (u holda retry yoki boshqa); yoki local file/socket muammosi. Streaming katta fayl uchun timeout read ni ehtiyotkor o'rnat.

## Mental model (nima uchun)
[SRC:https://requests.readthedocs.io/en/latest/user/advanced.html#timeouts @ 2.34.2] "By default, requests do not time out unless a timeout value is set explicitly. Without a timeout, your code may hang for minutes or more." timeout= float yoki (connect, read) tuple. Connect — ulanish, read — baytlar orasidagi kutish. None = cheksiz. Tool ~30s block_until_ms, shuning uchun osilgan requests backgroundga o'tadi. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. Kodda timeout= bormi?
   ```bash
   grep -n "requests\.\(get\|post\|put\|request\)" yourscript.py
   ```
   EXPECTED: timeout= yo'q. Agar bor — boshqa sabab (DNS, SSL, proxy).

2. Qisqa timeout bilan sinash (tez):
   ```bash
   python3 -c '
import requests
try:
    r = requests.get("https://httpbin.org/delay/5", timeout=2)
    print("status", r.status_code)
except requests.exceptions.Timeout as e:
    print("caught", type(e).__name__)
'
   ```
   EXPECTED: caught ReadTimeout. Agar boshqa xato — tarmoq muammosi. [SANDBOX]

3. Timeout siz qancha vaqt oladi (httpbin delay):
   ```bash
   python3 -c '
import time, requests
start = time.time()
r = requests.get("https://httpbin.org/delay/3")
print(r.status_code, round(time.time()-start, 1))
'
   ```
   EXPECTED: 200 va ~3.0+ soniya. Unresponsive serverda uzoqroq yoki cheksiz. [SANDBOX]

4. Tool timeout belgisini qara: "moved to the background as task" bormi? Ha bo'lsa — requests osilgan, timeout= qo'sh.

## Fix har bir sabab uchun
Sabab 1: timeout= umuman yo'q (default None).
Fix:
```python
import requests
r = requests.get(url, timeout=10)  # yoki timeout=(3.05, 27)
# yoki Session:
s = requests.Session()
r = s.get(url, timeout=10)
```
Tekshir:
```bash
python3 -c '
import requests
r = requests.get("https://httpbin.org/get", timeout=5)
print(r.status_code)
print("OK")
'
```
EXPECTED: 200 OK. [SANDBOX]

Sabab 2: sekin server, lekin chegara kerak.
```python
try:
    r = requests.get(url, timeout=(5, 30))
except requests.exceptions.Timeout:
    print("timed out, retry or fail")
```

Sabab 3: tool backgroundga o'tgan — timeout qo'shib qayta ishga tushir, yoki get_terminal_command_output bilan poll (lekin asosiy fix timeout=).

## Where agents go wrong
1. Timeout ni esdan chiqarish — "ishlaydi" deb o'ylash, lekin production/sekin serverda osiladi.
2. timeout=0 yoki juda kichik qo'yish — darhol Timeout.
3. Faqat tool timeoutga ishonish, kodda hech narsa o'zgartirmaslik — har safar background.
4. except Exception bilan yashirish, Timeout ni log qilmaslik.

## Edge cases
1. timeout=(connect, read) — connect kichik, read katta katta fayl uchun. [SRC same]
2. Streaming (stream=True) da read timeout baytlar orasida ishlaydi.
3. [not verified] Proxy yoki IPv6 da effective timeout uzunroq bo'lishi mumkin (docs note).
4. Localhost tez serverda timeout shart emas, lekin external uchun har doim.

## Done criteria
```bash
python3 -c '
import requests
# tez ishlaydigan
r = requests.get("https://httpbin.org/get", timeout=5)
assert r.status_code == 200
# timeout ishlaydi
try:
    requests.get("https://httpbin.org/delay/10", timeout=2)
    print("FAIL no timeout")
except requests.exceptions.Timeout:
    print("timeout raised OK")
print("done criteria OK")
'
```
EXPECTED: timeout raised OK va done criteria OK. Mutation: timeout= olib tashlasa, delay da uzoq kutadi. [SANDBOX]

## If still failing
- Tarmoq: `curl -I --max-time 5 URL`
- SSL: alohida skill (certificate verify failed).
- DNS: `getent hosts host`
- Tool background bo'lsa: get_terminal_command_output(task_ids=[...]) va kill_terminal_command.
- Boshqa HTTP client (httpx, urllib) da ham timeout ber.

## Sources + confidence
- [SRC:https://requests.readthedocs.io/en/latest/user/advanced.html#timeouts @ requests 2.34.2] default no timeout, may hang for minutes or more; set timeout= or (connect, read).
- [SANDBOX] delay/5 with timeout=2 raises ReadTimeout; without waits full delay.
Confidence: high.

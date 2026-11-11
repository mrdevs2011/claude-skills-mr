---
name: telegram-mini-app-initdata-hash-mismatch-wrong-hmac-secret-key-or-data-check-string
description: Telegram Mini App initData validation returns false / hash mismatch. Cause: secret key not derived with HMAC("WebAppData", bot_token), or data-check-string not sorted alphabetically excluding hash and joined by \n. Use when backend rejects valid client initData.
id: telegram-mini-app-initdata-hash-mismatch-wrong-hmac-secret-key-or-data-check-string
type: playbook
stack: Python 3.10+ (hmac, hashlib), any language with HMAC-SHA256; Telegram Bot API / Mini Apps
confirmed_on: 2026-11-11
confidence: high (official docs + local Python repro with exact example from docs)
triggers:
  - telegram initdata hash mismatch
  - webapp initdata validation fails
  - "hash" does not match computed hmac telegram
  - telegram mini app auth failed invalid hash
  - initData hash noto'g'ri telegram
  - HMAC-SHA256 WebAppData bot token mismatch
  - validate init data returns false telegram
  - telegram webapp data check string wrong
  - initdata verification failed despite correct token
  - bo'sh yoki xato hash telegram mini app
related:
  - none close
---

# Telegram Mini App initData hash mismatch — noto'g'ri secret key yoki data-check-string

## TL;DR
Simptom: clientdan kelgan `initData` (query string) bilan bot token yordamida hash tekshiruvi `False` / "invalid hash" qaytaradi, lekin token to'g'ri.
Sabab: secret_key = HMAC-SHA256(key="WebAppData", msg=bot_token) qilinmagan, yoki data-check-string hash'ni o'z ichiga olgan / sort qilinmagan / \n bilan birlashtirilmagan.
Birinchi buyruq: Python'da to'g'ri validate funksiyasini ishga tushirib, docs misolida `True` chiqishini tasdiqlang.
Done: docs misoli va real initData uchun `True` qaytadi, hmac.compare_digest mos.

## Qachon ishlatish / ishlatmaslik
Ishlat: backend'da Telegram Mini App `window.Telegram.WebApp.initData` ni tekshirayotganda hash mos kelmayapti, token aniq to'g'ri, auth_date yangi.
Ishlatma: hash yo'q yoki bo'sh; auth_date juda eski (replay); bot token noto'g'ri; yoki Ed25519 signature usuli ishlatilmoqda (token kerak emas).

## Mental model (nima uchun)
[SRC:https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app @ Bot API ~10.1, 2026-11] va [SRC:https://docs.telegram-mini-apps.com/platform/init-data] : initData query params. hash ni chiqarib, qolganlarini key=value qilib alfabetik sort, \n bilan birlashtir → data-check-string. Secret key = HMAC-SHA256("WebAppData".encode(), bot_token.encode()).digest() (hex emas, bytes). Keyin HMAC-SHA256(secret_key, data-check-string) hex == received hash.
Oddiy HMAC(bot_token, string) ishlamaydi — key derivation majburiy. Sort va exclude hash ham. [SANDBOX]

## Diagnosis tree (arzonidan qimmatiga)
1. initData va bot_token'ni to'liq log qil (tokenni mask qil). Hash borligini tekshir.
   EXPECTED if bug: hash bor, lekin computed != received. Agar hash yo'q → client yubormagan.

2. Docs misolini ishga tushir (quyidagi right_validate):
   ```python
   # /tmp/right_validate.py dan
   print(validate_init_data(docs_init_data, docs_token))  # True bo'lishi shart
   ```
   EXPECTED: True. Agar False → o'z kodingizda xato (key derivation yoki string). [SANDBOX]

3. data-check-string'ni print qil: sorted keys, \n join, hash excluded, values unquoted.
   EXPECTED docs: 'auth_date=1662771648\nquery_id=AAHdF6IQAAAAAN0XohDhrOrc\nuser={"id":...}'
   Agar & bilan yoki hash bilan yoki sort yo'q → shu yerda xato.

4. secret_key hex'ini print qil (debug): hmac.new(b'WebAppData', token.encode(), sha256).hexdigest()
   EXPECTED docs: a5c609aa52f63cb5e6d8ceb6e4138726ea82bbc36bb786d64482d445ea38ee5f
   Agar boshqa → key "WebAppData" emas yoki token encoding xato.

5. computed_hash va received'ni solishtir (compare_digest ishlat). Agar mos emas — yuqoridagi qadamlar.

## Fix har bir sabab uchun
Sabab 1 (eng ko'p): secret key noto'g'ri (token'ni to'g'ridan-to'g'ri key qilish).
Fix (Python copy-paste):
```python
import hmac, hashlib
from urllib.parse import parse_qsl

def validate_init_data(init_data: str, bot_token: str) -> bool:
    params = dict(parse_qsl(init_data, keep_blank_values=True))
    received_hash = params.pop('hash', None)
    if not received_hash:
        return False
    data_check_string = '\n'.join(f"{k}={params[k]}" for k in sorted(params.keys()))
    secret_key = hmac.new(b'WebAppData', bot_token.encode(), hashlib.sha256).digest()
    computed_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(computed_hash, received_hash)
```
Tekshir: docs misoli bilan True.

Sabab 2: data-check-string noto'g'ri (sort yo'q, & ishlatilgan, hash qoldirilgan, quote qilinmagan).
Fix: yuqoridagi kod — parse_qsl + sorted + \n.

Sabab 3: values URL-encoded qolgan (parse qilmasdan).
Fix: parse_qsl ishlat (avtomatik unquote).

## Agentlar qayerda xato qiladi
1. secret_key = bot_token.encode() deb to'g'ridan-to'g'ri ishlatish (WebAppData derivation yo'q).
2. params'ni sort qilmasdan yoki & bilan join qilish.
3. hash'ni data string'ga qo'shib qo'yish.
4. hexdigest'ni secret_key sifatida ishlatish (digest() bytes kerak).
5. compare_digest o'rniga == (timing attack, lekin asosan moslikda).

## Edge cases
1. auth_date eski bo'lsa — hash to'g'ri bo'lsa ham reject qilish kerak (replay). Qo'shimcha check qo'sh.
2. signature field (Bot API 8.0+) bor bo'lsa — Ed25519 usuli alohida, hash bilan aralashtirma.
3. user JSON ichida maxsus belgilar — parse_qsl to'g'ri unquote qiladi.
4. Sandbox'da real Telegram yo'q — faqat docs misoli bilan verified. [not verified live Mini App]

## Done criteria
```bash
python3 -c "
from urllib.parse import parse_qsl
import hmac, hashlib
# ... yuqoridagi funksiya
init_data = 'query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D&auth_date=1662771648&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2'
token = '5768337691:AAH5YkoiEuPk8-FZa32hStHTqXiLPtAEhx8'
print(validate_init_data(init_data, token))  # True
"
```
Real client initData bilan ham True.

## Agar hali ham ishlamasa
- Token to'g'ri ekanligini BotFather'dan tekshir.
- initData'ni to'liq (URL-encoded) yuborilganini tasdiqla.
- auth_date: `datetime.fromtimestamp(int(params['auth_date']))` yangimi.
- Rasmiy package: pip install init-data-py yoki @tma.js/init-data.
- Docs: https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app

## Sources + confidence
- [SRC:https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app] Bot API 10.1 (2026), aniq qadamlar.
- [SRC:https://docs.telegram-mini-apps.com/platform/init-data] to'liq misol va hisob-kitob.
- [SANDBOX] 2026-11-11: wrong_validate → False; right_validate → True, computed hash docs bilan 100% mos (c501b71e...).
- Confidence: 98% (docs + exact repro). Live Telegram client bu sandboxda yo'q.

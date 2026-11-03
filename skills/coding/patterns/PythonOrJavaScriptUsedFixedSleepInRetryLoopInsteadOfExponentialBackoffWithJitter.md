---
name: fixed-sleep-retry-instead-of-exponential-backoff
description: Tarmoq so'rovlari yoki tashqi chaqiruvlarda qayta urinishda fixed sleep (masalan time.sleep(1)) ishlatilganda thundering herd, resurs isrof va sekin tiklanish yuzaga keladi. Exponential backoff + jitter kerak.
---

# Qayta urinishda fixed sleep o'rniga exponential backoff + jitter ishlatilmagan

## Nima uchun bu skill kerak
Kod patterns kategoriyasida. AI va dasturchilar ko'pincha oddiy retry loop yozadi: xato bo'lsa `time.sleep(1)` yoki `setTimeout(1000)` qilib qayta urinib ko'radi. Bu ishlaydi, lekin productionda yomon: bir vaqtda ko'p mijoz bir xil vaqtda qayta urinadi (thundering herd), serverni yanada yuklaydi, va vaqtni isrof qiladi. Debuggingdan tashqari, oldini olish uchun kerak.

## Simptom (aynan shu)
- Retry loop ichida `time.sleep(constant)` yoki `await asyncio.sleep(1)` yoki JS `setTimeout(..., 1000)` doimiy qiymat bilan.
- Xato yuz berganda har safar bir xil kechikish.
- Ko'p parallel so'rovlar bo'lsa, ular deyarli bir vaqtda qayta urinadi.
- Loglarda "retry after 1s", "retry after 1s" takrorlanadi, backoff yo'q.
- Rate limit yoki transient xato tez-tez yuz beradi va tiklanish sekin.

## Sabab (100%)
Fixed delay barcha retry'larni sinxronlashtiradi. Server vaqtincha yuklangan bo'lsa, hammasi bir xil vaqtda qaytib keladi va yana yuklaydi. Exponential backoff (1s, 2s, 4s, 8s...) va jitter (tasodifiy qo'shimcha) bu sinxronizatsiyani buzadi, serverga "nafas olish" imkoni beradi va umumiy muvaffaqiyat ehtimolini oshiradi.

## Tasdiqlash
- Kodda retry loop bormi? (`for attempt in range(max_retries)`, `while retries > 0`)
- Ichida fixed `sleep(n)` yoki equivalent bormi, n doimiy?
- Exponential o'sish (attempt * base yoki 2**attempt) yo'qmi?
- Jitter (random.uniform yoki Math.random) yo'qmi?
- Tarmoq, API, DB chaqiruvi atrofida ishlatilganmi?

## Tuzatish (aynan shu)
Exponential backoff + jitter qo'llang. Maksimal kechikishni cheklang.

```python
import time
import random

def call_with_retry(func, max_retries=5, base_delay=1.0, max_delay=32.0):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:  # aniq exception turlari yaxshiroq
            if attempt == max_retries - 1:
                raise
            delay = min(base_delay * (2 ** attempt), max_delay)
            jitter = random.uniform(0, delay * 0.1)  # 10% jitter
            time.sleep(delay + jitter)
    # yoki asyncio.sleep async holatda
```

JavaScript misoli:

```javascript
async function callWithRetry(fn, maxRetries = 5, baseDelay = 1000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (attempt === maxRetries - 1) throw e;
      const delay = Math.min(baseDelay * Math.pow(2, attempt), 32000);
      const jitter = Math.random() * delay * 0.1;
      await new Promise(r => setTimeout(r, delay + jitter));
    }
  }
}
```

Kutubxonalar (tenacity, backoff, p-retry) ishlatish yanada yaxshi, lekin asosiy printsip shu.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Retry loopda hech qachon fixed sleep ishlatmang. Har doim exponential backoff (2**attempt) + kichik jitter qo'llang va max delay cheklang. Bu thundering herd oldini oladi, resursni tejaydi va transient xatolardan yaxshiroq tiklanadi.

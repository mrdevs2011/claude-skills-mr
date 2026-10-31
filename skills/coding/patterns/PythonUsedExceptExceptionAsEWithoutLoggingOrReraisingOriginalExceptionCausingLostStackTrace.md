---
name: python-except-exception-as-e-swallows-without-logging-or-reraise
description: Code catches Exception as e but only prints a custom message or passes, losing the original traceback and making debugging impossible.
---

# Python Used except Exception as e Without Logging or Reraising Original Exception Causing Lost Stack Trace

## Nima uchun bu skill kerak
Xato ushlashda asl stack trace yo'qolsa, muammoni topish qiyinlashadi. Agents ba'zan "xato bo'lsa xabar ber" deb yozadi, lekin tracebackni saqlamaydi.

## Simptom (aynan shu)
- `except Exception as e: print("Error occurred")` yoki `pass`.
- Asl exception turi, xabar yoki traceback logda yo'q.
- Keyinchalik "nima bo'ldi" deb topib bo'lmaydi.

## Sabab (100%)
Oddiy xato xabarini ko'rsatish uchun asl exceptionni e'tiborsiz qoldirish. `raise` yoki `logging.exception` ishlatilmagan.

## Tasdiqlash
1. `except Exception as e:` bor.
2. Ichida faqat custom print yoki pass, `raise` yoki `logging.exception(e)` yo'q.
3. Stack trace yo'qolgan.

## Tuzatish (aynan shu)
```python
import logging

try:
    risky()
except Exception as e:
    logging.exception("Operation failed")  # traceback saqlanadi
    raise  # yoki raise RuntimeError("Wrapped") from e
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Exception ushlaganda hech bo'lmasa `logging.exception` ishlating yoki `raise` qiling — asl tracebackni yo'qotmang.

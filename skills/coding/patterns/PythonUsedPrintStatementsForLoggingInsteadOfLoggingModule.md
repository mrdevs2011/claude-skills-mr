---
name: python-used-print-for-logging
description: Production yoki qayta ishlatiladigan kodda print() bilan log qilish, logging modulidan foydalanmaslik. Log darajasi, chiqish yo'nalishi va boshqaruv yo'qoladi.
---

# Python'da print() o'rniga logging modulidan foydalanish

## Nima uchun bu skill kerak
Agentlar tez-tez debug yoki ma'lumot chiqarish uchun `print()` ishlatadi. Bu ishlaydi, lekin production kodda, skill tool'larida yoki qayta ishlatiladigan modullarda log darajasini (DEBUG/INFO/ERROR), chiqishni (fayl, stdout, remote) va filtrni boshqarib bo'lmaydi. print() har doim chiqadi, xato loglarini yashirish yoki yig'ish qiyin.

## Simptom (aynan shu)
- Kodda `print("xato:", e)` yoki `print(f"natija: {value}")` ishlatilgan.
- Logging import qilinmagan, `logging.getLogger` yoki `logger.info` yo'q.
- Loglar faqat stdout/stderr ga ketadi, faylga yoki structured log yo'q.
- DEBUG ma'lumotlari productionda ham chiqadi, o'chirish yo'li yo'q.
- Xato loglari try/except ichida print bilan, traceback yo'q yoki qo'lda.

## Sabab (100%)
Tez yozish uchun print() eng oddiy yo'l. Agent logging konfiguratsiyasini o'ylamaydi yoki "bu faqat skript" deb taxmin qiladi, lekin kod keyinchalik modulga aylanadi.

## Tasdiqlash
1. Kodda `print(` chaqiruvlari bormi (ayniqsa xato yoki holat ma'lumoti)?
2. `import logging` va `logger = logging.getLogger(__name__)` bormi?
3. Log darajasi (info, warning, error, debug) ishlatilganmi?
4. Agar print qolgan bo'lsa, u faqat CLI skriptning final outputi uchunmi?

## Tuzatish (aynan shu)
print() ni logging bilan almashtir:

```python
import logging

logger = logging.getLogger(__name__)
# Konfiguratsiya (bir marta, asosiy faylda):
# logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

# Noto'g'ri:
print(f"Qidiruv natijasi: {len(results)}")
print("Xato yuz berdi:", exc)

# To'g'ri:
logger.info("Qidiruv natijasi: %s", len(results))
logger.error("Xato yuz berdi", exc_info=True)  # traceback avtomatik
logger.debug("Oraliq holat: %s", intermediate)
```

Qoidalar:
- Har modulda `logger = logging.getLogger(__name__)`
- print() faqat foydalanuvchiga mo'ljallangan final output uchun (CLI).
- exc_info=True yoki logger.exception() bilan traceback ol.
- Level orqali boshqar (DEBUG lokalda, INFO productionda).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- print() tez, lekin logging daraja, chiqish va boshqaruv beradi.
- Production yoki qayta ishlatiladigan kodda har doim logging ishlat.
- logger.error(..., exc_info=True) print(traceback) dan yaxshiroq.

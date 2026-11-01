---
name: python-fstring-in-logging-call
description: Python logging chaqiruvlarida f-string yoki format ishlatilgan — log level o'chiq bo'lsa ham string har doim hisoblanadi, performance yo'qotish va keraksiz ish.
---

# logging chaqiruvlarida f-string ishlatish

## Nima uchun bu skill kerak
`logging.info(f"User {user} did {action}")` yozilganda, f-string doim hisoblanadi — hatto logger darajasi INFO dan past bo'lsa va xabar chiqmasa ham. Bu CPU va vaqtni isrof qiladi, ayniqsa loop ichida yoki katta ma'lumot bilan. To'g'ri usul — lazy formatting (% yoki {} bilan logger o'zi format qiladi).

## Simptom (aynan shu)
- `logger.debug(f"...")`, `logger.info(f"value={val}")` yoki `.format()` ishlatilgan.
- Log level DEBUG/INFO o'chiq bo'lsa ham string yaratilishi (profilingda ko'rinadi).
- Yuqori chastotali log chaqiruvlarida sezilarli sekinlashish.
- `logger.info("msg %s", val)` emas, f-string bilan yozilgan.

## Sabab (100%)
F-string (va .format()) argument sifatida berilganda, chaqiruvdan oldin to'liq hisoblanadi. Logging moduli esa faqat xabar haqiqatan log qilinadigan bo'lsa formatlashni kechiktiradi — shuning uchun % yoki extra dict ishlatiladi.

## Tasdiqlash
1. Kodda `logger.*(f"` yoki `logging.*(f"` bormi?
2. Yoki `.format()` ichida log chaqiruvi?
3. Agar ha — bu holat. % formatting yoki lazy usulga o'tkaz.

## Tuzatish (aynan shu)
F-stringni log chaqiruvi ichida ishlatma. Logger o'zi formatlasin:

Noto'g'ri:
```python
import logging
logger = logging.getLogger(__name__)
user_id = 42
logger.info(f"Processing user {user_id} with data {large_data}")
```

To'g'ri:
```python
import logging
logger = logging.getLogger(__name__)
user_id = 42
logger.info("Processing user %s with data %s", user_id, large_data)
# yoki named
logger.info("Processing user %(uid)s", {"uid": user_id})
```

Agar murakkab hisoblash kerak bo'lsa va log level past bo'lsa:
```python
if logger.isEnabledFor(logging.INFO):
    logger.info("Heavy: %s", compute_expensive())
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Log chaqiruvlarida hech qachon f-string yoki .format() ishlatma. Doim `%s` / `%(name)s` usulidan foydalan — logger faqat kerak bo'lganda formatlaydi va performance saqlanadi.

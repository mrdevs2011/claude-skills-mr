---
name: python-except-pass-silently-swallows-errors
description: Python'da except Exception: pass yoki except: pass ishlatilganda xatolar jim yutiladi — hech qanday log, traceback yoki xabar chiqmaydi, dastur davom etadi lekin holat buzilgan bo'lishi mumkin.
---

# Python except: pass — xatolarni jim yutib yuborish (log yoki re-raise yo'q)

## Nima uchun bu skill kerak
Agentlar yoki dasturchilar "xato chiqmasin" deb `except Exception: pass` yoki `except: pass` yozishadi. Natijada haqiqiy muammo (masalan, tarmoq xatosi, noto'g'ri ma'lumot, permission) butunlay yashirinadi. Dastur "ishlayapti" ko'rinadi, lekin funksiya bajarilmagan, data yo'qolgan yoki keyingi qadamlar noto'g'ri holatda ishlaydi. Bu ayniqsa agent workflow'larida (tool chaqiruv, fayl o'qish, API) xavfli — xato sezilmaydi va noto'g'ri muvaffaqiyat haqida hisobot beriladi.

## Simptom (aynan shu)
- Kodda `try: ... except Exception: pass` yoki `except: pass` bor.
- Kutilgan xato (masalan, FileNotFoundError, ConnectionError, ValueError) hech qanday chiqish bermaydi — na print, na log, na traceback.
- Funksiya qaytadi yoki davom etadi, lekin natija bo'sh/None/noto'g'ri.
- Agent "muvaffaqiyatli bajarildi" deb aytadi, lekin aslida muhim qadam o'tkazib yuborilgan.
- Debug qilishda xato qayerda ekanini topish qiyin, chunki hech narsa loglanmagan.

## Sabab (100%)
`pass` exception handler ichida hech narsa qilmaydi. Exception ushlanadi va butunlay tashlanadi (discarded). Python default holatda exception'ni ko'rsatmaydi agar u tutilib, qayta ko'tarilmasa yoki log qilinmasa. Bu "silent failure" klassik anti-pattern'i.

## Tasdiqlash
1. `try` blokida aniq xato chiqaradigan kod borligini tekshir (masalan, `open("yoq_fayl")` yoki `1/0`).
2. `except ...: pass` borligini ko'r — agar bor bo'lsa, xato yutiladi.
3. Kodni ishga tushir: hech qanday error output yo'qmi, lekin funksiya kutilgan natijani bermayaptimi?
4. `pass` o'rniga `print(e)` yoki `raise` qo'shsang, xato ko'rinadimi?

## Tuzatish (aynan shu)
Hech qachon `pass` bilan xatoni jim yutma. Kamida log qil yoki qayta ko'tar (re-raise). Aniq exception tipi ishlat:

```python
import logging
logger = logging.getLogger(__name__)

# Noto'g'ri (jim yutadi):
try:
    data = load_config("config.json")
except Exception:
    pass  # xato yo'qoladi, data None qoladi

# To'g'ri — log + davom etish (agar ruxsat etilsa):
try:
    data = load_config("config.json")
except FileNotFoundError as e:
    logger.warning("Config topilmadi, default ishlatiladi: %s", e)
    data = default_config()
except Exception as e:
    logger.error("Config yuklashda kutilmagan xato", exc_info=True)
    raise  # yoki aniq qayta ko'tar

# Yoki oddiy re-raise (agar tutish shart bo'lmasa):
try:
    result = risky_operation()
except ValueError:
    logger.exception("Noto'g'ri qiymat")
    raise
```

Agar xato haqiqatan e'tiborsiz qoldirilishi kerak bo'lsa (juda kam), izoh yoz va aniq tip bilan chekla. Odatda log + raise yaxshiroq.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `except: pass` yoki `except Exception: pass` xatolarni butunlay yashiradi.
- Silent failure agent va production kodda noto'g'ri muvaffaqiyat va qiyin debug'ga olib keladi.
- Har doim kamida log qil yoki `raise` bilan qayta ko'tar; aniq exception tipi ishlat.

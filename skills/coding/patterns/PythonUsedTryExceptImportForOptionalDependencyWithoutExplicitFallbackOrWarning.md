---
name: python-try-except-import-optional-no-fallback
description: Optional paketni try/except import qilib, fallback yoki ogohlantirishsiz davom etish — foydalanuvchi nima uchun xususiyat ishlamayotganini bilmaydi, yoki keyinroq TypeError chiqadi.
---

# Optional dependency uchun try/except import, lekin fallback yoki warning yo'q

## Nima uchun bu skill kerak
Kutubxonalar yoki skriptlar ba'zan optional (ixtiyoriy) paketlarni qo'llab-quvvatlashadi (masalan, rich console, orjson, pillow). Ularni `try: import ... except ImportError:` bilan o'qib, keyin hech qanday xabar yoki fallback qilmasdan davom etishadi. Natijada foydalanuvchi xususiyat yo'qligini sezmaydi yoki keyinroq noaniq xato oladi.

## Simptom (aynan shu)
- Kodda `try: import some_optional except ImportError: pass` (yoki `some_optional = None`).
- Keyin `if some_optional:` yoki to'g'ridan-to'g'ri ishlatish, lekin yo'q bo'lsa hech qanday log/warning/xabar yo'q.
- Foydalanuvchi optional xususiyatni kutadi (tezroq JSON, chiroyli output), lekin u ishlamaydi va sababi aytilmaydi.
- Yoki keyin `AttributeError` / `TypeError` chiqadi, chunki None ga metod chaqirilgan.

## Sabab (100%)
Import muvaffaqiyatsiz bo'lganda faqat `pass` yoki None ga o'rnatiladi, lekin foydalanuvchiga (yoki logga) "bu xususiyat o'chirilgan, chunki paket o'rnatilmagan" deb xabar berilmaydi. Fallback (masalan, standart json yoki oddiy print) ham aniq qilinmaydi.

## Tasdiqlash
- `try/except ImportError` bor va except ichida faqat `pass` yoki o'zgaruvchini None qilish bormi?
- Keyinroq shu o'zgaruvchi ishlatilganda warning/log yoki aniq fallback yo'qmi?
- Optional xususiyat o'chirilgani foydalanuvchiga bildirilmaydimi?

## Tuzatish (aynan shu)
Except ichida aniq xabar ber va/yoki fallback o'rnat:

```python
try:
    import orjson as json
    FAST_JSON = True
except ImportError:
    import json
    FAST_JSON = False
    import warnings
    warnings.warn(
        "orjson o'rnatilmagan — sekinroq standart json ishlatilmoqda. "
        "Tezroq uchun: pip install orjson",
        ImportWarning,
        stacklevel=2,
    )
```

Yoki funksiya ichida:

```python
def load_data(path):
    try:
        import orjson
        return orjson.loads(open(path, "rb").read())
    except ImportError:
        import json
        print("Ogohlantirish: orjson yo'q, standart json ishlatilmoqda", file=sys.stderr)
        return json.load(open(path))
```

Hech qachon jim `pass` qilma — foydalanuvchi nima bo'layotganini bilishi kerak.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Optional import qilganda except ichida doim aniq warning yoki fallback qil. Jim davom etish foydalanuvchini chalg'itadi va keyinroq noaniq xatolarga olib keladi.

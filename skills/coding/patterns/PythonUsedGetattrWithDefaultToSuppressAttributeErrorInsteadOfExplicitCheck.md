---
name: python-getattr-default-suppresses-error
description: AttributeError yashiriladi yoki default qaytariladi, lekin atribut haqiqatan yo'qligini aniq bilish kerak — sabab getattr(..., default) ishlatilgan.
---

# getattr default bilan AttributeError yashirish

## Nima uchun bu skill kerak
AI kod yozganda obyekt atributiga kirishda `getattr(obj, 'attr', default)` ishlatadi, bu AttributeError ni yashiradi. Bu ba'zan qulay, lekin ildiz sababni (atribut umuman yo'q yoki noto'g'ri nom) yashiradi va keyinchalik silent wrong result beradi. Aniq tekshiruv yoki try/except AttributeError aniqroq va xavfsizroq.

## Simptom (aynan shu)
- Kod `getattr(user, 'email', None)` yoki shunga o'xshash ishlatadi.
- Atribut yo'q bo'lsa default qaytaradi, lekin log yoki xato yo'q.
- Keyinchalik `None` yoki default bilan ishlayveradi va noto'g'ri natija chiqadi (masalan email yuborilmaydi, lekin xato ko'rinmaydi).
- AttributeError umuman chiqmaydi, shuning uchun debug qiyin.

## Sabab (100%)
1. `getattr(obj, name, default)` AttributeError ni tutib, default qaytaradi — bu aniq xato emas, yashirish.
2. AI "xavfsiz kirish" deb o'ylagan, lekin aslida atribut nomini tekshirishni o'tkazib yuborgan.
3. Aniq `hasattr` yoki `try: value = obj.attr except AttributeError:` ishlatilmagan.

## Tasdiqlash
1. Kodda `getattr(` qidir.
2. Default argument berilganmi?
3. Atribut haqiqatan har doim borligi kafolatlanganmi yoki yo'qmi?
4. Agar yo'q bo'lsa va default yashirish bo'lsa — bu skill.

## Tuzatish (aynan shu)
Aniq tekshiruv yoki try/except ishlat:

```python
# XATO (yashiradi):
email = getattr(user, 'email', None)
if email:
    send(email)

# TO'G'RI (aniq):
if hasattr(user, 'email'):
    email = user.email
    if email:
        send(email)
else:
    # yoki log qil, yoki raise, yoki default aniq ber
    logger.warning("User has no email attribute")
    email = None

# Yoki:
try:
    email = user.email
except AttributeError:
    email = None
    # aniq bilish
```

Agar default haqiqatan kerak bo'lsa, izoh yoz va nima uchun xavfsiz ekanini tushuntir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`getattr` default bilan AttributeError ni yashiradi. Aniq `hasattr` yoki `try/except AttributeError` ishlatib, atribut yo'qligini ongli qaror qilish kerak, silent default emas.

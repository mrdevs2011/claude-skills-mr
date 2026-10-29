---
name: python-used-os-environ-bracket-access-without-check
description: Python kodi os.environ["KEY"] yoki os.environ.get qilmasdan to'g'ridan-to'g'ri bracket access ishlatganda, env var yo'q bo'lsa KeyError beradi. Localda ishlaydi, deploy yoki yangi muhitda crash.
---

# Python used os.environ["KEY"] without check causing KeyError on missing environment variable

## Nima uchun bu skill kerak
Agent yoki kod yozuvchi environment variable'larni o'qishda `os.environ["API_KEY"]` kabi to'g'ridan-to'g'ri access ishlatadi. Bu faqat o'zgaruvchi aniq mavjud bo'lganda ishlaydi. Yo'q bo'lsa darhol KeyError chiqadi. Bu Vercel, Docker, CI yoki yangi lokal muhitda tez-tez uchraydi va runtime crashga olib keladi.

## Simptom (aynan shu)
- `KeyError: 'SOME_ENV_VAR'` yoki `os.environ["TOKEN"]` da xato.
- Localda `.env` yoki export qilingan bo'lsa ishlaydi, deploy/serverda yo'q.
- Stack trace `os.py` ichidagi `__getitem__` ga ishora qiladi.
- Kod `os.environ.get` yoki default bilan yozilmagan.

## Sabab (100%)
`os.environ` — `dict` ga o'xshash, lekin yo'q kalit uchun `KeyError` beradi (oddiy `dict` kabi). Agent "har doim bor" deb taxmin qiladi yoki `get` ishlatishni unutadi. Bu ayniqsa secret yoki config o'qishda keng tarqalgan.

## Tasdiqlash
1. Kodda `os.environ["..."]` yoki `os.environ['...']` bormi?
2. `os.environ.get("KEY")` yoki `os.environ.get("KEY", default)` ishlatilganmi?
3. Xato matni aniq `KeyError` va kalit nomi mos keladimi?
4. `.env` yoki muhit o'zgaruvchisi haqiqatan yo'qmi?

## Tuzatish (aynan shu)
Har doim xavfsiz access ishlat:

```python
import os

# Yomon
token = os.environ["TOKEN"]  # KeyError agar yo'q

# Yaxshi
token = os.environ.get("TOKEN")
if token is None:
    raise ValueError("TOKEN environment variable is required")

# Yoki default bilan
debug = os.environ.get("DEBUG", "false").lower() == "true"

# Yoki dotenv bilan (agar ishlatilsa)
# from dotenv import load_dotenv
# load_dotenv()
# token = os.getenv("TOKEN")  # os.getenv == os.environ.get
```

Agar majburiy bo'lsa, aniq xato xabari bilan raise qil. Hech qachon to'g'ridan-to'g'ri `[]` ishlatma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `os.environ["KEY"]` yo'q kalitda KeyError beradi.
- Har doim `.get()` yoki `os.getenv()` ishlat va yo'qlikni tekshir.
- Bu local vs deploy farqini oldini oladi va crashsiz ishlaydi.

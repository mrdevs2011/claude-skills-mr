---
name: python-open-w-silent-overwrite
description: Python'da open(..., 'w') bilan mavjud faylni tekshirmasdan ochish — fayl mavjud bo'lsa jim qilib o'chirib yozib yuboriladi. Ma'lumot yo'qolishi yoki kutilmagan overwrite.
---

# open(..., 'w') bilan mavjud faylni tekshirmasdan yozish

## Nima uchun bu skill kerak
`'w'` rejimi fayl mavjud bo'lsa uni tozalab, yangi kontent bilan almashtiradi. Hech qanday xato yoki ogohlantirish chiqarmaydi. Bu ma'lumot yo'qolishiga olib keladi, ayniqsa skript qayta ishga tushirilganda yoki parallel jarayonlar bo'lganda.

## Simptom (aynan shu)
- `open(path, 'w')` yoki `with open(path, 'w') as f:` ishlatilgan.
- Fayl allaqachon mavjudligini tekshirish (`os.path.exists`, `Path.exists`) yo'q.
- Exclusive yaratish (`'x'` rejimi) ishlatilmagan.
- Skriptni qayta ishga tushirganda oldingi fayl kontenti yo'qolgan.
- "Fayl yozildi" deb hisoblanadi, lekin aslida mavjud fayl ustidan yozilgan.

## Sabab (100%)
Dasturchi fayl yo'q deb taxmin qiladi yoki "har doim yangi yoz" ni xohlaydi, lekin mavjud faylni saqlash kerakligini hisobga olmaydi. `'w'` rejimi default ravishda truncate qiladi.

## Tasdiqlash
1. Kodda `open(..., 'w')` yoki `mode='w'` bormi?
2. Oldin `exists()` tekshiruvi yoki `'x'` rejimi yo'qmi?
3. Agar ha — bu holat. Mavjud fayl jim overwrite bo'ladi.

## Tuzatish (aynan shu)
Agar fayl mavjud bo'lmasligi shart bo'lsa — `'x'` (exclusive creation) ishlat. Mavjud bo'lsa `FileExistsError` chiqadi.

Noto'g'ri:
```python
with open("output.txt", "w") as f:
    f.write(data)
```

To'g'ri (faqat yangi fayl yaratish kerak bo'lsa):
```python
try:
    with open("output.txt", "x") as f:
        f.write(data)
except FileExistsError:
    # Mavjud — xato yoki boshqa yo'l
    raise
```

Agar overwrite qilish aniq maqsad bo'lsa — avval tekshirib, aniq qil:
```python
from pathlib import Path
p = Path("output.txt")
if p.exists():
    # aniq qaror: o'chirish, backup yoki skip
    pass
with open(p, "w") as f:
    f.write(data)
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`open(..., 'w')` mavjud faylni hech qanday ogohlantirishsiz o'chirib yozadi. Yangi fayl yaratish kerak bo'lsa `'x'` rejimini ishlat — mavjud bo'lsa aniq xato chiqadi va ma'lumot saqlanadi.

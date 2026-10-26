---
name: python-open-without-explicit-encoding
description: "Python open() chaqiruvida encoding parametri yo'q — Windows/Linux farqi tufayli UnicodeDecodeError yoki noto'g'ri belgi. Qachon: fayl o'qish/yozishda platformaga bog'liq xato yoki buzilgan matn."
---

# Python open() da encoding parametrisiz — platformaga bog'liq Unicode xatolari

## Nima uchun bu skill kerak
Python'da `open()` chaqiruvida `encoding` parametri berilmasa, tizimning default encoding'i ishlatiladi (Windows'da ko'pincha cp1252 yoki locale, Linux'da UTF-8). Bu kodni boshqa mashinada ishga tushirganda `UnicodeDecodeError` yoki noto'g'ri belgilarni keltirib chiqaradi. Skill aynan shu holatni aniqlaydi va tuzatadi.

## Simptom (aynan shu)
- `UnicodeDecodeError: 'charmap' codec can't decode byte...` yoki `'cp1252' codec can't decode`
- Fayl o'qilganda ba'zi belgilar `?` yoki buzilgan ko'rinadi
- Lokalda ishlaydi, CI yoki boshqa OS'da ishlamaydi
- `open(path).read()` yoki `with open(path) as f:` ishlatilgan, encoding yo'q

## Sabab (100%)
`open()` ning `encoding` parametri ixtiyoriy, default `locale.getpreferredencoding(False)` (yoki Python 3.15+ da UTF-8, lekin hali ko'p joyda eski). Bu platformaga bog'liq. Fayl UTF-8 bo'lsa, lekin default boshqa bo'lsa — xato.

## Tasdiqlash
1. Xato matnida `UnicodeDecodeError` yoki `UnicodeEncodeError` borligini tekshir.
2. Kodda `open(...)` yoki `Path.read_text()`/`write_text()` da `encoding=` yo'qligini qidir.
3. Faylni `file -I` yoki hex editor bilan UTF-8 ekanligini tasdiqla.
4. `python -c "import locale; print(locale.getpreferredencoding())"` ni ikki platformada solishtir.

## Tuzatish (aynan shu)
Har doim aniq encoding ber. Matn fayllari uchun UTF-8 standart.

```python
# Noto'g'ri
with open("data.txt") as f:
    text = f.read()

# To'g'ri
with open("data.txt", encoding="utf-8") as f:
    text = f.read()

# Pathlib bilan
from pathlib import Path
text = Path("data.txt").read_text(encoding="utf-8")
Path("out.txt").write_text(content, encoding="utf-8")
```

Agar fayl binary bo'lsa — `mode="rb"` ishlat, encoding bermas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`open()` da encoding berilmasa platformaga bog'liq xato chiqadi. Har doim `encoding="utf-8"` (yoki aniq boshqa) qo'sh. Bu kodni portable qiladi va Unicode xatolarini oldini oladi.

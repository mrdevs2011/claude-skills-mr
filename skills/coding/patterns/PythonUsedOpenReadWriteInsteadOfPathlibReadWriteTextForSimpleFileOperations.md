---
name: python-used-open-read-write-instead-of-pathlib-read-write-text
description: Oddiy fayl o'qish/yozishda open() + with o'rniga pathlib.Path.read_text()/write_text() ishlatilmagan — keraksiz boilerplate va xato ehtimoli.
---

# Oddiy fayl operatsiyalarida pathlib.Path.read_text va write_text ishlatilmagan

## Nima uchun bu skill kerak
Python 3.5+ da pathlib.Path obyektida read_text() va write_text() metodlari bor. Oddiy matn faylini o'qish yoki yozish uchun `with open(...) as f: content = f.read()` yozish keraksiz uzoq va xato ehtimolini oshiradi (encoding unutilishi, context manager unutilishi). Pathlib usuli qisqa, aniq encoding bilan, va zamonaviy.

## Simptom (aynan shu)
Kodda oddiy .txt, .md, .json yoki boshqa matn faylini o'qish/yozish uchun:
```python
with open("config.txt", "r", encoding="utf-8") as f:
    content = f.read()
```
yoki
```python
with open("output.txt", "w") as f:
    f.write(data)
```
ko'rinadi. Pathlib ishlatilgan bo'lsa-da, open() chaqirilgan.

## Sabab (100%)
Pathlib.Path.read_text() va write_text() haqida bilmaslik yoki eski odat. open() + with ishlaydi, lekin uzoqroq va encodingni unutish oson. Pathlib metodi ichki ravishda context manager ishlatadi va default encodingni beradi (yoki explicit).

## Tasdiqlash
1. Fayl faqat matn o'qish/yozish uchunmi (binary emas)?
2. `Path("file.txt").read_text(encoding="utf-8")` ishlaydimi?
3. Kodda `import pathlib` yoki `from pathlib import Path` bormi?

## Tuzatish (aynan shu)
Eski:
```python
from pathlib import Path

def load_config():
    with open("config.txt", "r", encoding="utf-8") as f:
        return f.read()

def save_output(text: str):
    with open("output.txt", "w", encoding="utf-8") as f:
        f.write(text)
```

Yangi:
```python
from pathlib import Path

def load_config() -> str:
    return Path("config.txt").read_text(encoding="utf-8")

def save_output(text: str) -> None:
    Path("output.txt").write_text(text, encoding="utf-8")
```

Qo'shimcha:
- Binary uchun `read_bytes()` / `write_bytes()`.
- Mavjud Path obyekti bo'lsa to'g'ridan-to'g'ri chaqir.
- encoding har doim aniq bering (locale muammosidan qochish).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Oddiy matn fayl o'qish/yozishda `Path(...).read_text()` / `write_text()` ishlatish qisqaroq, xavfsizroq va zamonaviy. open() + with faqat murakkab holatlarda (streaming, custom buffering) kerak.

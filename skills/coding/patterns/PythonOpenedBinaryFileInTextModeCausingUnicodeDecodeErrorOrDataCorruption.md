---
name: python-opened-binary-file-in-text-mode
description: Binary faylni (rasm, pdf, zip, executable) open() bilan 'r' yoki 'w' (text mode) da ochish UnicodeDecodeError yoki ma'lumot buzilishiga olib keladi. 'rb'/'wb' ishlatilishi kerak.
---

# Python'da binary faylni text mode'da ochish

## Nima uchun bu skill kerak
Agentlar ko'pincha `open(path)` yoki `open(path, "r")` yozadi, chunki text uchun odat. Binary fayllar (PNG, PDF, ZIP, WAV, .exe, .pyc) UTF-8 yoki boshqa encoding bilan o'qilmaydi. Natijada `UnicodeDecodeError: 'utf-8' codec can't decode byte...` yoki yozishda ma'lumot buziladi. Bu ayniqsa rasm yuklash, fayl hash hisoblash, binary API javobini saqlashda uchraydi.

## Simptom (aynan shu)
- `UnicodeDecodeError: 'utf-8' codec can't decode byte 0x... in position ...`
- Binary fayl (rasm, pdf, zip) o'qilganda yoki yozilganda xato.
- Fayl ochilgan, lekin `read()` qaytargan matn buzilgan yoki `bytes` o'rniga `str`.
- Kodda `open(path)` yoki `open(path, "r")` / `"w"` binary kengaytmali fayl uchun.
- `with open(...) as f: data = f.read()` dan keyin `data` `str` bo'lib, binary kutilyapti.

## Sabab (100%)
Python 3 da `open()` default mode `'r'` (text, encoding='locale' yoki utf-8). Binary faylda encoding bo'lmagan baytlar bor. Agent "fayl ochish"ni umumiy deb o'ylab, mode'ni aniq belgilanmaydi.

## Tasdiqlash
1. Xato `UnicodeDecodeError` yoki encoding bilan bog'liqmi?
2. Fayl kengaytmasi binary (.png, .pdf, .zip, .jpg, .bin, .exe)mi?
3. Kodda `open(path)` yoki mode `"r"`/`"w"` (yoki `"rt"`/`"wt"`) ishlatilganmi?
4. `data = f.read()` dan keyin `isinstance(data, str)` true, lekin binary kutilyaptimi?

## Tuzatish (aynan shu)
Binary uchun **har doim** `'rb'` yoki `'wb'` ishlat:

```python
# Noto'g'ri (text mode):
with open("image.png", "r") as f:          # UnicodeDecodeError
    data = f.read()
with open("out.zip", "w") as f:            # buziladi
    f.write(binary_data)

# To'g'ri (binary mode):
with open("image.png", "rb") as f:
    data = f.read()                        # data is bytes
with open("out.zip", "wb") as f:
    f.write(binary_data)

# Agar encoding aniq bo'lsa (masalan, ma'lum text):
with open("log.txt", "r", encoding="utf-8") as f:
    text = f.read()
```

Qoidalar:
- Binary (rasm, arxiv, executable, raw bytes) → `'rb'` / `'wb'`.
- Text → `'r'`/`'w'` + `encoding="utf-8"` aniq ber.
- `pathlib.Path.read_bytes()` / `write_bytes()` ishlatish ham yaxshi.
- Hash, checksum, API upload uchun har doim bytes.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `open()` default text mode — binary faylda UnicodeDecodeError beradi.
- Binary uchun har doim `'rb'` yoki `'wb'`.
- Text uchun encodingni aniq belgilash xavfsizroq.

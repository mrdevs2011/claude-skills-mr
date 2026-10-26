---
name: python-open-text-file-without-encoding
description: Python'da open() bilan matn faylini encoding belgilamasdan ochganda, platformaga qarab UnicodeDecodeError yoki mojibake (buzuq belgilar) paydo bo'ladi.
---

# Python'da matn faylini encoding belgilamasdan ochish platformaga bog'liq xatolar keltiradi

## Nima uchun bu skill kerak
Python 3 da open() default encoding sifatida locale.getpreferredencoding() ishlatadi. Bu Windows'da cp1252, Linux'da ko'pincha UTF-8 bo'lishi mumkin. Agentlar "open('file.txt')" deb yozishadi va boshqa platformada ishlamay qoladi yoki matn buziladi.

## Simptom (aynan shu)
- `open(path, 'r')` yoki `open(path, 'w')` ishlatilgan, `encoding=` argumenti yo'q.
- Bir mashinada (masalan Linux) ishlaydi, boshqasida (Windows) `UnicodeDecodeError: 'charmap' codec can't decode` chiqadi.
- Yoki fayl ochiladi lekin maxsus belgilar (é, ğ, emoji) mojibake bo'lib chiqadi (buzuq).
- `with open(...) as f: data = f.read()` dan keyin kutilmagan baytlar yoki xato.

## Sabab (100%)
`open()` matn rejimida (`'r'`, `'w'`, `'a'`) encoding berilmasa, tizimning preferred encoding'ini oladi. Bu platforma va locale'ga bog'liq. UTF-8 bo'lmagan fayl yoki boshqa encoding'li muhitda decode/encode xato beradi. Binary rejim (`'rb'`) bundan mustasno.

## Tasdiqlash
1. open() chaqiruvini tekshir: encoding= yoki errors= argumenti bormi?
2. Fayl UTF-8 ekanini bilasizmi? Agar ha, encoding='utf-8' qo'yib qayta sinab ko'r.
3. `import locale; print(locale.getpreferredencoding())` nima qaytaradi?
4. Xato matnida 'charmap', 'cp1252' yoki shunga o'xshash bo'lsa — encoding yo'qligidan.

## Tuzatish (aynan shu)
Har doim matn fayllari uchun aniq encoding ber. Odatda UTF-8:

```python
# Noto'g'ri (platformaga bog'liq):
with open("data.txt", "r") as f:
    content = f.read()  # Windows'da UnicodeDecodeError bo'lishi mumkin

# To'g'ri:
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Yozishda ham:
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("Salom 👋")

# Agar eski encoding kerak bo'lsa (masalan cp1251):
with open("legacy.txt", "r", encoding="cp1251", errors="replace") as f:
    content = f.read()
```

pathlib bilan ham xuddi shu: `Path("file.txt").read_text(encoding="utf-8")`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Matn faylini ochganda har doim encoding='utf-8' (yoki kerakli) belgilang.
- Default encoding platformaga bog'liq — cross-platform kodda xato beradi.
- Binary fayllar uchun 'rb'/'wb' ishlat, encoding kerak emas.

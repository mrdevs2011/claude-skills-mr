---
name: python-open-without-explicit-encoding
description: Python open() chaqiruvi encoding parametri yo'qligida locale-ga bog'liq UnicodeDecodeError yoki mojibake xatolari chiqadi. Fayl o'qish/yozishda aynan shu xato bo'lganda ishlatiladi.
---

# Python open() da encoding parametri yo'qligi sababli locale-bog'liq Unicode xatolari

## Nima uchun bu skill kerak
Python 3 da open() default encoding platformaning locale'iga bog'liq (masalan, Windows'da cp1252, Linux'da utf-8 yoki boshqa). Bu cross-platform kodda yoki non-ASCII matn (o'zbekcha, emoji, boshqa tillar) bilan ishlaganda kutilmagan UnicodeDecodeError, UnicodeEncodeError yoki mojibake (buzilgan belgi) keltirib chiqaradi. Aniq encoding berish barqarorlikni ta'minlaydi.

## Simptom (aynan shu)
- `UnicodeDecodeError: 'charmap' codec can't decode byte 0x... in position ...` yoki shunga o'xshash.
- `UnicodeEncodeError` yozishda.
- Fayl mazmuni buzilgan chiqadi (masalan, "O'zbek" o'rniga g'alati belgi).
- Xuddi shu kod bir OS'da ishlaydi, boshqasida ishlamaydi.
- Traceback open() yoki read()/write() chaqiruviga ishora qiladi, encoding ko'rsatilmagan.

## Sabab (100%)
open(file, mode) chaqiruvida encoding='utf-8' (yoki kerakli encoding) berilmagan. Python default sifatida locale.getpreferredencoding(False) ni ishlatadi, bu har doim UTF-8 emas va platformaga qarab o'zgaradi. Non-ASCII baytlar bu encoding'da noto'g'ri decode/encode bo'ladi.

## Tasdiqlash
1. Xato matnida 'charmap', 'cp1252', 'ascii' yoki boshqa encoding nomi borligini tekshiring.
2. Kodda open(...) ni toping va encoding= parametri yo'qligini tasdiqlang.
3. Faylni hex yoki boshqa vosita bilan tekshirib, UTF-8 ekanligini bilib oling.
4. locale.getpreferredencoding() ni chop etib, defaultni ko'ring.

## Tuzatish (aynan shu)
Har doim open() da encoding ni aniq belgilang. Matn fayllar uchun odatda 'utf-8'.

Misol (noto'g'ri):
```python
with open("data.txt", "r") as f:
    content = f.read()
```

To'g'ri:
```python
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
```

Yozish uchun ham:
```python
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("O'zbekcha matn va emoji 🚀")
```

Agar binary kerak bo'lsa, mode="rb" ishlatib encoding bermang. Kerak bo'lsa errors="strict" yoki "replace" qo'shing.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python open() da encoding parametrini har doim aniq berish kerak (odatda "utf-8"), chunki default locale-ga bog'liq va cross-platform/non-ASCII holatlarda Unicode xatolariga olib keladi. Bu oddiy qo'shimcha argument bilan butunlay oldini oladi.

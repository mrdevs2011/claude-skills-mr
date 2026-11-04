---
name: python-mixed-bytes-and-str-types
description: Python 3 da bytes va str tiplarini aralashtirish TypeError beradi (concat, format, yozish). Qachon: "can't concat str to bytes" yoki "a bytes-like object is required" xatosi chiqsa.
---

# Python 3 da bytes va str tiplarini aralashtirish TypeError beradi

## Nima uchun bu skill kerak
Python 3 da `str` (unicode) va `bytes` (8-bit) alohida tiplar. Ularni to'g'ridan-to'g'ri qo'shish, formatlash yoki ba'zi API larga berish xato beradi. Bu eng keng tarqalgan TypeErrorlardan biri, ayniqsa fayl, tarmoq, encoding ishlari bilan.

## Simptom (aynan shu)
- `TypeError: can only concatenate str (not "bytes") to str`
- `TypeError: a bytes-like object is required, not 'str'`
- `TypeError: %b requires a bytes-like object, or an object that implements __bytes__, not 'str'`
- Faylni text mode da ochib binary yozishga urinish yoki aksincha.

## Sabab (100%)
Python 3 da barcha string literal'lar `str` (unicode). `b"..."` esa `bytes`. Encoding/decoding aniq qilinishi kerak. Implicit conversion yo'q (Python 2 dan farqli).

## Tasdiqlash
1. Xato matnida "bytes" va "str" so'zlari borligini tekshir.
2. Qaysi o'zgaruvchi qaysi tipda ekanini `type(x)` yoki debugger bilan tasdiqla.
3. Qayerda `.encode()` yoki `.decode()` yetishmayotganini top.

## Tuzatish (aynan shu)
Har doim aniq encode/decode qil:

```python
# Noto'g'ri
data = "hello" + b" world"  # TypeError

# To'g'ri
data = "hello".encode("utf-8") + b" world"
# yoki
data = "hello" + b" world".decode("utf-8")

# Fayl
with open("file.txt", "wb") as f:
    f.write("text".encode("utf-8"))  # binary mode

with open("file.txt", "w", encoding="utf-8") as f:
    f.write("text")  # text mode
```

Agar tashqi API bytes kutsa — encode qil. Str kutsa — decode qil. Encoding ni (odatda utf-8) aniq belgil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python 3 da str va bytes aralashtirilmasin. Har doim `.encode()` / `.decode()` bilan aniq o'tkazish kerak. Bu TypeError'ni ildizidan oldini oladi.

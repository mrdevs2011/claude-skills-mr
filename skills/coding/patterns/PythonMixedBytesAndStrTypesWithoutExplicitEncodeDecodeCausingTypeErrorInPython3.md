---
name: python-mixed-bytes-and-str-without-explicit-encode-decode
description: Python 3 da bytes va str tiplarini aralashtirib ishlatganda TypeError chiqadi (masalan, concatenation yoki comparison). Explicit .encode()/.decode() yoki mode bilan open() ishlatish kerak.
---

# Bytes va str ni aralashtirishda TypeError

## Nima uchun bu skill kerak
Python 3 da `str` (Unicode matn) va `bytes` (raw baytlar) alohida tiplar. Ularni to'g'ridan-to'g'ri qo'shish, solishtirish yoki ba'zi API larga berishda TypeError chiqadi. Bu xato odatda fayl I/O, tarmoq, yoki encoding bilan ishlaganda yuzaga keladi.

## Simptom (aynan shu)
Kodda `TypeError: can only concatenate str (not "bytes") to str` yoki `TypeError: a bytes-like object is required, not 'str'` xatosi. Yoki `TypeError: can't concat str to bytes`. Masalan, `b"hello" + "world"` yoki `open(path).read() + "suffix"`.

## Sabab (100%)
Python 3 da stringlar default Unicode (`str`), baytlar esa `bytes`. Implicit conversion yo'q. `open()` default text mode (`str` qaytaradi), binary mode (`'rb'`) `bytes` qaytaradi. Concatenation, format, yoki ba'zi funksiyalar bir xil tipni talab qiladi.

## Tasdiqlash
Xato traceback da `str` va `bytes` aralashgan operatsiya borligini ko'r. Kodda `b"..."` literal yoki `.encode()`/`.decode()` yo'qligini, yoki `open()` mode ni tekshir. Test:

```python
data = b"hello"
# data + " world"  # TypeError
```

## Tuzatish (aynan shu)
Explicit ravishda encode/decode qil yoki to'g'ri mode tanla:

```python
# Noto'g'ri
with open("file.txt") as f:  # text mode, str
    content = f.read()
result = content + b"extra"  # TypeError

# To'g'ri — binary ishlash
with open("file.txt", "rb") as f:
    content = f.read()  # bytes
result = content + b"extra"

# Yoki text ishlash
with open("file.txt", "r", encoding="utf-8") as f:
    content = f.read()  # str
result = content + "extra"

# Agar aralashtirish kerak bo'lsa
text = b"hello".decode("utf-8") + " world"
binary = "hello".encode("utf-8") + b" world"
```

Har doim encoding ni aniq belgilang (utf-8 tavsiya).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python 3 da `str` va `bytes` ni aralashtirma; har doim explicit `.encode("utf-8")` yoki `.decode("utf-8")` qil, va `open()` da to'g'ri mode + encoding ishlat. Bu TypeError larni oldini oladi va portativ kod yozishga yordam beradi.

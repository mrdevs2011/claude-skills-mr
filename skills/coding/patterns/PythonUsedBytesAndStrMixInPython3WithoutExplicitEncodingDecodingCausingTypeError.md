---
name: python-bytes-str-mix-typeerror
description: Python 3 da bytes va str turlarini aralashtirish (masalan, concatenation, comparison yoki I/O) TypeError ga olib keladi — explicit encode/decode qilish kerak.
---

# Python bytes va str aralashtirish

## Nima uchun bu skill kerak
Python 3 da `str` (Unicode) va `bytes` (8-bit) alohida turlardir. Ularni to'g'ridan-to'g'ri aralashtirish (qo'shish, taqqoslash, ba'zi API lar) TypeError beradi. Bu ko'p hollarda I/O, tarmoq yoki binary data bilan ishlaganda yuzaga keladi. Agent yoki dasturchi encoding ni e'tiborsiz qoldirganda yuz beradi.

## Simptom (aynan shu)
- `TypeError: can only concatenate str (not "bytes") to str`
- `TypeError: a bytes-like object is required, not 'str'`
- `TypeError: can't concat str to bytes` yoki shunga o'xshash
- Binary file o'qib, matn bilan qo'shishga urinish
- Network response (bytes) ni string bilan solishtirish

## Sabab (100%)
Python 3 da `str` va `bytes` implicit ravishda o'zgarmaydi. Encoding (masalan UTF-8) ni explicit qilish majburiy. Agent yoki kod `b"hello" + "world"` yoki `open(..., 'rb').read() + "suffix"` kabi aralash operatsiyalarni yozadi.

## Tasdiqlash
- Xato matnida "bytes" va "str" birga tilga olinganmi?
- Operatsiya concatenation, comparison, yoki method call da turlar mos kelmayaptimi?
- Ma'lumot manbai (file, socket, API) binary (bytes) qaytaryaptimi?

## Tuzatish (aynan shu)
Har doim explicit encode yoki decode qil:

```python
# Noto'g'ri
data = b"hello" + " world"  # TypeError

# To'g'ri
data = b"hello" + " world".encode("utf-8")
# yoki
text = b"hello".decode("utf-8") + " world"

# File uchun
with open("file.bin", "rb") as f:
    content = f.read()
text = content.decode("utf-8") + "\nextra"
```

Agar encoding noma'lum bo'lsa, `errors="replace"` yoki `errors="ignore"` ishlat, lekin afzal UTF-8.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Python 3 da bytes va str aralashmasin — har doim explicit `.encode()` yoki `.decode()`.
- Bu TypeError ning eng keng tarqalgan sabablaridan biri I/O va binary data bilan.
- Encoding ni (odatda utf-8) aniq belgilash kerak.

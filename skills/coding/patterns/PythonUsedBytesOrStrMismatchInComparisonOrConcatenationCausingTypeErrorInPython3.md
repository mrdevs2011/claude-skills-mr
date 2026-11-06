---
name: python-bytes-str-mismatch-typeerror
description: Python 3 da bytes va str ni aralashtirib solishtirish yoki concatenation qilganda TypeError chiqadi. Faqat shu holatda ishlat.
---

# Python bytes va str aralashmasi TypeError

## Nima uchun bu skill kerak
Python 3 da str va bytes alohida tiplar. Ularni to'g'ridan-to'g'ri solishtirish, qo'shish yoki ba'zi operatsiyalarda ishlatish TypeError beradi. Bu eng keng tarqalgan porting xatolaridan biri (Python 2 dan).

## Simptom (aynan shu)
- `TypeError: can't concat str to bytes` yoki `TypeError: a bytes-like object is required, not 'str'`
- `TypeError: unsupported operand type(s) for +: 'str' and 'bytes'`
- Kod ishlamaydi, ayniqsa fayl o'qish, network, yoki binary data bilan ishlaganda.

## Sabab (100%)
Python 3 da `str` (unicode) va `bytes` (8-bit) qat'iy ajratilgan. Implicit konvertatsiya yo'q. `open()` default text mode (`str` qaytaradi), binary mode (`'rb'`) `bytes` qaytaradi. Ularni aralashtirish xato.

## Tasdiqlash
1. Xato matnida "bytes" va "str" so'zlari borligini tekshir.
2. Qaysi o'zgaruvchi bytes, qaysi str ekanini `type()` bilan aniqlang.
3. Fayl ochishda `'b'` mode ishlatilganmi yoki yo'qmi ko'ring.

## Tuzatish (aynan shu)
Doimo aniq konvertatsiya qiling yoki mode ni to'g'ri tanlang.

```python
# Noto'g'ri
data = open('file.bin', 'rb').read()  # bytes
result = data + "suffix"  # TypeError

# To'g'ri 1: decode
result = data.decode('utf-8') + "suffix"

# To'g'ri 2: encode
result = data + "suffix".encode('utf-8')

# To'g'ri 3: ikkalasini ham bytes
with open('file.bin', 'rb') as f:
    data = f.read()
result = data + b"suffix"
```

Agar text ishlayotgan bo'lsangiz, `open(..., encoding='utf-8')` ishlating va hamma narsani `str` da saqlang.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python 3 da bytes va str ni hech qachon aralashtirmang. Xato chiqsa, avval tiplarni aniqlang, keyin `.decode()` yoki `.encode()` bilan bir xil tipga keltiring. Default encoding ishonchli emas — har doim aniq encoding ko'rsating.

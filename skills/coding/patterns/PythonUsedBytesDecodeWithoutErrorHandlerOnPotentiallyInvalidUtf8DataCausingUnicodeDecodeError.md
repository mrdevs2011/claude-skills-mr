---
name: python-bytes-decode-without-error-handler
description: Python'da bytes.decode() yoki str() chaqiruvi noto'g'ri UTF-8 ma'lumotda UnicodeDecodeError beradi chunki errors='strict' default.
---

# Bytes.decode() errors parametrisiz chaqirilganda UnicodeDecodeError

## Nima uchun bu skill kerak
Tashqi manbalardan (network, fayl, API) kelgan bytes har doim to'g'ri UTF-8 bo'lmaydi. Default `errors='strict'` xato tashlaydi va dastur yiqiladi. Bu holatda aniq tuzatish kerak.

## Simptom (aynan shu)
- `UnicodeDecodeError: 'utf-8' codec can't decode byte 0x... in position ...: invalid start byte` yoki shunga o'xshash.
- `data.decode()` yoki `str(data, 'utf-8')` chaqirilgan joyda xato.
- Ma'lumot tashqi yoki ishonchsiz manbadan kelgan.

## Sabab (100%)
`bytes.decode(encoding='utf-8', errors='strict')` default qiymat. Noto'g'ri baytlar bo'lsa, darhol exception. Agent errors parametrini o'ylamagan yoki 'ignore'/'replace' qo'yishni unutgan.

## Tasdiqlash
1. Xato matnida 'utf-8' codec va decode so'zi bormi?
2. Kodda `.decode()` yoki `bytes.decode` errors= argumentisizmi?
3. Ma'lumot tashqaridan kelganmi (response.content, file.read() binary)?

## Tuzatish (aynan shu)
```python
# noto'g'ri
text = response.content.decode()  # yoki .decode('utf-8')

# to'g'ri
text = response.content.decode('utf-8', errors='replace')  # yoki 'ignore', 'backslashreplace'
# yoki aniqroq:
text = response.content.decode('utf-8', errors='surrogateescape')
```

Agar ma'lumot albatta to'g'ri bo'lishi kerak bo'lsa — avval validatsiya qil yoki encodingni aniqlash uchun chardet ishlat. Default strict ni o'zgartir.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Tashqi bytes ni decode qilayotganda har doim `errors=` parametrini aniq ber. Strict default ishonchsiz ma'lumotda dasturini yiqitadi. 'replace' yoki 'ignore' bilan davom etish mumkin.

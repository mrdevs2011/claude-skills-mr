---
name: python-used-if-key-in-dict-else-default-instead-of-dict-get-method
description: Python da dict dan qiymat olishda if key in d else default yozilgan — dict.get(key, default) ishlatilmagan. Qachon: verbose if-in-else default o'rniga get() kerak bo'lganda.
---

# Python da if key in d else default o'rniga dict.get ishlatilmagan

## Nima uchun bu skill kerak
Kodda `if key in my_dict: value = my_dict[key] else: value = default` yoki shunga o'xshash verbose shart yoziladi. Bu o'qishni qiyinlashtiradi va xato ehtimolini oshiradi. `dict.get(key, default)` bitta chaqiruvda xuddi shu ishni qiladi.

## Simptom (aynan shu)
Kodda quyidagiga o'xshash qatorlar:
```python
if "timeout" in config:
    timeout = config["timeout"]
else:
    timeout = 30
```
yoki
```python
value = config["key"] if "key" in config else default_value
```
Natija to'g'ri ishlaydi, lekin kod uzun, takrorlanadi va keyinchalik yangilash qiyin.

## Sabab (100%)
Muallif `dict.get()` metodini bilmaydi yoki esdan chiqaradi. `in` tekshiruvi + keyin bracket access ikki qadam, `get` esa bitta atomik amal. Default qiymatni if/else bilan yozish odat bo'lib qolgan.

## Tasdiqlash
1. Kodda `if ... in dict` + `else` default patternini qidir.
2. Ternary `dict[key] if key in dict else default` ni qidir.
3. Xuddi shu joyda `dict.get(key, default)` ishlatilmaganligini tekshir.
4. Agar key yo'qligida default qaytishi kerak bo'lsa — bu skill mos.

## Tuzatish (aynan shu)
Verbose if/else yoki ternary o'rniga `dict.get` ishlat:

```python
# Oldin (verbose)
if "timeout" in config:
    timeout = config["timeout"]
else:
    timeout = 30

# Keyin
timeout = config.get("timeout", 30)
```

```python
# Oldin
value = data["user_id"] if "user_id" in data else None

# Keyin
value = data.get("user_id")  # default None
# yoki
value = data.get("user_id", "anonymous")
```

Agar key mavjud bo'lsa va qiymat `None` bo'lishi mumkin bo'lsa, `get` baribir ishlaydi (None qaytaradi). Faqat key yo'qligida default berish kerak bo'lsa `get(key, default)` ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`if key in d else default` patternini ko'rganingizda darhol `d.get(key, default)` ga almashtiring. Bu qisqaroq, o'qilishi oson va kamroq xato beradi. `get` default sifatida `None` ishlatadi, shuning uchun aniq default kerak bo'lsa ikkinchi argument bering.

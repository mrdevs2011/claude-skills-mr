---
name: python-used-type-function-for-type-checking-instead-of-isinstance
description: Python kodi type() funksiyasi bilan tip tekshiradi (type(x) is int yoki type(x) == str), subclasslar yoki typing.Union/| ni qo'llab-quvvatlamaydi va noto'g'ri False qaytaradi.
---

# type() bilan tip tekshiruvi isinstance o'rniga

## Nima uchun bu skill kerak
Python'da tip tekshiruvi ko'p joyda kerak (validation, dispatch, serialization). `type(x) is SomeClass` yoki `type(x) == SomeClass` ishlatilsa, faqat aynan o'sha klassni qabul qiladi — subclasslar (masalan `bool` is `int` bo'lsa ham), `typing` constructs, yoki duck-typing holatlarini o'tkazib yuboradi. Bu silent bug yoki TypeError ga olib keladi. `isinstance` to'g'ri va tavsiya etilgan yo'l.

## Simptom (aynan shu)
- `if type(value) is int:` yoki `if type(value) == str:` ishlatilgan.
- Subclass (masalan custom `MyInt(int)`) False qaytaradi, kutilgan True.
- `bool` qiymat `int` tekshiruvida o'tmaydi yoki aksincha.
- `typing.Union` yoki `|` bilan ishlamaydi.
- Kod "faqat aniq tip" deb yozilgan, lekin meros olish ishlatilgan.

## Sabab (100%)
`type()` ayni klass obyektini qaytaradi (identity). `isinstance` esa MRO (method resolution order) bo'yicha tekshiradi va subclasslarni ham qamrab oladi. Shuningdek, `isinstance` `typing` bilan yaxshi ishlaydi (Python 3.10+ da `|` ham). `type() is` faqat exact match uchun, lekin ko'p hollarda bu xato.

## Tasdiqlash
1. Kodda `type(` va `is` yoki `==` bilan tip solishtirish bormi?
2. Tekshirilayotgan klassdan meros oluvchi subclasslar ishlatiladimi?
3. `isinstance` o'rniga `type` ishlatilganmi?
4. Testlarda subclass yoki `bool` bilan False chiqadimi?

## Tuzatish (aynan shu)
`type(x) is Foo` ni `isinstance(x, Foo)` ga almashtir.

Misol (xato):
```python
def process(value):
    if type(value) is int:  # bool ham int, lekin subclass emas deb hisoblanadi? Wait, bool is subclass of int
        return value * 2
    return 0
# process(True) -> 0 (kutilmagan, chunki type(True) is bool, not int)
```

To'g'ri:
```python
def process(value):
    if isinstance(value, int):  # bool ham o'tadi, chunki bool(int)
        return value * 2
    return 0
# process(True) -> 2
```

Yoki aniq faqat int (bool emas) kerak bo'lsa:
```python
if isinstance(value, int) and not isinstance(value, bool):
    ...
```

Multiple types uchun:
```python
if isinstance(value, (int, float, str)):
    ...
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `type(x) is Class` faqat exact klass uchun; subclasslarni o'tkazib yuboradi.
- `isinstance` to'g'ri, xavfsiz va Python idiom.
- Bool `int` ning subclassi — `isinstance(True, int)` True.
- Tip tekshiruvi kerak bo'lsa doim `isinstance` ishlat.

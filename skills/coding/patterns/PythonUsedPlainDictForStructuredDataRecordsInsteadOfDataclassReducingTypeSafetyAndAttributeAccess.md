---
name: python-used-plain-dict-for-structured-data-records-instead-of-dataclass
description: Python kodi tuzilgan ma'lumot yozuvlari (record, entity, config) uchun oddiy dict ishlatadi, type safety, attribute access va avtomatik __init__/__repr__ yo'qoladi.
---

# Oddiy dict o'rniga dataclass yoki NamedTuple ishlatish

## Nima uchun bu skill kerak
AI yoki dasturchi oddiy `{"name": ..., "age": ...}` dict bilan tuzilgan ma'lumotni ifodalaydi. Bu ishlaydi, lekin:
- Kalit nomlari string, typo silent bug (KeyError yoki noto'g'ri default)
- Type checker (mypy/pyright) to'liq tekshira olmaydi
- Attribute access yo'q (`obj.name` o'rniga `obj["name"]`)
- `__init__`, `__repr__`, `__eq__` qo'lda yoziladi yoki yo'q
`@dataclass` yoki `NamedTuple` bularni avtomatik beradi, kodni qisqaroq va xavfsiz qiladi.

## Simptom (aynan shu)
- Funksiya yoki class ichida `data = {"id": 1, "name": "foo", "active": True}` kabi dict yaratilgan
- Bir necha joyda bir xil kalitlar takrorlanadi
- `data["name"]` style access, `data.name` emas
- mypy/pyright "untyped dict" yoki "missing key" xabarlari
- Dict o'zgartiriladi (mutable) va kutilmagan shared state

## Sabab (100%)
Oddiy `dict` heterogen, kalitlar runtime'da tekshiriladi. `dataclass` esa field'larni class darajasida e'lon qiladi, type annotation beradi, avtomatik metodlar generatsiya qiladi. NamedTuple esa immutable va unpacking-friendly. Tuzilgan, takrorlanuvchi record uchun dict "yetarli" deb o'ylash — lekin maintainability va safety yo'qoladi.

## Tasdiqlash
1. Kodda bir xil kalit to'plamiga ega dict'lar yaratiladimi?
2. Bu dict'lar function argument, return yoki class attribute sifatida ishlatiladimi?
3. Type annotation `dict[str, Any]` yoki yo'qmi?
4. `dataclasses` yoki `typing.NamedTuple` import qilinmaganmi?
5. Kalit typo testlarda yoki runtime'da chiqadimi?

## Tuzatish (aynan shu)
`@dataclass` ga o'tkaz.

Misol (xato):
```python
def create_user(name: str, email: str) -> dict:
    return {"name": name, "email": email, "active": True}

user = create_user("Ali", "ali@example.com")
print(user["name"])  # string kalit, typo xavfi
# user.name ishlamaydi
```

To'g'ri:
```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    email: str
    active: bool = True

def create_user(name: str, email: str) -> User:
    return User(name=name, email=email)

user = create_user("Ali", "ali@example.com")
print(user.name)  # attribute access
print(user)       # avtomatik __repr__
# type checker to'liq tekshiradi
```

Immutable kerak bo'lsa:
```python
from typing import NamedTuple

class User(NamedTuple):
    name: str
    email: str
    active: bool = True
```

Yoki `frozen=True` dataclass.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Tuzilgan ma'lumot yozuvlari uchun oddiy dict o'rniga `@dataclass` yoki `NamedTuple` ishlat. Bu type safety, attribute access, avtomatik metodlar va kamroq typo beradi. Dict faqat heterogen yoki dynamic kalitlar uchun qoldir. Bu patternni ko'rsang, darhol dataclass'ga o'tkaz.

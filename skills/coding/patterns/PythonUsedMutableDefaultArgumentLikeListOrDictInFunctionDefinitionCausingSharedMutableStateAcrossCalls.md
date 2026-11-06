---
name: python-mutable-default-argument
description: Funksiya ta'rifida default argument sifatida o'zgaruvchan (mutable) qiymat (list, dict) ishlatilganda, keyingi chaqiruvlar o'sha bir xil obyektni baham ko'radi va kutilmagan shared state paydo bo'ladi.
---

# Python: Mutable default argument (list/dict) shared state keltirib chiqaradi

## Nima uchun bu skill kerak
AI (va odamlar) ko'pincha `def process(items=[]):` kabi yozadi, chunki "bo'sh ro'yxat default" deb o'ylaydi. Lekin Python default argumentlarni funksiya ta'rif paytida bir marta baholaydi, shuning uchun barcha chaqiruvlar bir xil list obyektini oladi. Bu silent bug — kod ishlaydi, lekin state noto'g'ri to'planadi.

## Simptom (aynan shu)
- Funksiya bir necha marta chaqirilganda, oldingi chaqiruvda qo'shilgan elementlar keyingilarida ham ko'rinadi.
- Xato yo'q, lekin natija kutilganidan farq qiladi (masalan, append qilingan narsalar saqlanib qoladi).
- `def func(data={}):` yoki `def func(lst=[]):` kabi kod.
- Testlarda yoki takroriy chaqiruvlarda "nima uchun eski ma'lumot bor?"

## Sabab (100%)
Python default argument qiymatlarini funksiya *ta'rifi* vaqtida bir marta hisoblaydi va saqlaydi. Mutable obyekt (list, dict, set) bo'lsa, u o'zgaradi va barcha keyingi chaqiruvlar (agar argument berilmasa) shu bir xil obyektni oladi. Bu klassik Python tuzog'i.

## Tasdiqlash
1. Funksiya ta'rifini toping: default sifatida `[]`, `{}`, yoki boshqa mutable bormi?
2. Funksiyani argument bermasdan bir necha marta chaqiring va ichida mutate qiling (append, update).
3. Keyingi chaqiruvda oldingi o'zgarishlar saqlanganini ko'ring.
4. `id()` bilan tekshiring — bir xil id qaytadi.

## Tuzatish (aynan shu)
Default sifatida `None` ishlating va funksiya ichida yangi obyekt yarating:

```python
# XATO:
def add_item(item, items=[]):
    items.append(item)
    return items

# To'g'ri:
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

# Yoki dict uchun:
def update_config(key, value, config=None):
    if config is None:
        config = {}
    config[key] = value
    return config
```

Har doim yangi instance yaratiladi, shared state yo'qoladi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Default argumentlar bir marta baholanadi. Mutable default ishlatmang — har doim `None` + ichida yaratish. Bu silent bug'ni oldini oladi va funksiyani toza qiladi.

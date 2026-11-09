---
name: python-list-comprehension-inside-any-all-instead-of-generator
description: Python any() yoki all() ichida list comprehension ishlatilgan — generator expression o'rniga. Keraksiz xotira ajratish va sekinroq ishlash.
---

# any()/all() ichida list comprehension o'rniga generator expression ishlatish

## Nima uchun bu skill kerak
any() va all() faqat birinchi mos kelgan (yoki mos kelmagan) elementgacha tekshiradi va to'xtaydi. List comprehension esa butun ro'yxatni oldindan yaratadi. Bu katta ma'lumotlarda xotira sarflaydi va sekinlashtiradi.

## Simptom (aynan shu)
- Kodda `any([x for x in items if condition(x)])` yoki `all([expr for item in iterable])` ko'rinishi.
- Katta iterable bilan ishlaganda xotira o'sishi yoki sekinlik kuzatiladi.
- Short-circuit foydasi yo'qoladi — barcha elementlar hisoblanadi.

## Sabab (100%)
List comprehension (`[...]`) darhol butun ro'yxatni xotirada yaratadi. Generator expression (`(...)`) esa lazy — faqat kerakli elementlarni hisoblaydi. any()/all() generator bilan short-circuit qiladi.

## Tasdiqlash
1. any() yoki all() chaqiruvi ichida `[` bilan boshlanadigan comprehension bormi?
2. Agar iterable katta bo'lsa yoki condition qimmat bo'lsa — bu muammo.
3. Generator (`(...)`) ishlatilsa — to'g'ri.

## Tuzatish (aynan shu)
List comprehension o'rniga generator expression ishlat.

Noto'g'ri:
```python
if any([item.is_valid() for item in large_list]):
    ...
```

To'g'ri:
```python
if any(item.is_valid() for item in large_list):
    ...
```

Yoki:
```python
# all uchun
if all(x > 0 for x in numbers):
    ...
```

Bu short-circuit'ni saqlaydi va xotira sarfini kamaytiradi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
any() va all() ichida hech qachon list comprehension ishlatmang. Generator expression (`(expr for ...)`) ishlating — u lazy va short-circuit'ni to'liq qo'llab-quvvatlaydi. Bu katta ma'lumotlarda xotira va vaqtni tejaydi.

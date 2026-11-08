---
name: python-used-list-comprehension-with-side-effects-in-condition-reducing-readability
description: Python list comprehension ichida side-effect (print, append, file yozish) ishlatilganda o'qilishi qiyinlashadi va kutilmagan tartibda bajariladi. Qachon: comprehension ichida funksiya chaqiruvi yon ta'sir qiladi.
---

# Python list comprehension ichida side-effect ishlatib, o'qilishni yomonlashtirdi

## Nima uchun bu skill kerak
List comprehension faqat yangi list yaratish uchun mo'ljallangan. Ichida side-effect (print, list.append, file yozish, global o'zgartirish) ishlatish kodni chalkashtiradi, debug qilishni qiyinlashtiradi va ba'zan kutilmagan tartibda ishlaydi. Aniq for loop ishlatish kerak.

## Simptom (aynan shu)
- List comprehension ichida `print()`, `.append()`, file yozish yoki boshqa yon ta'sirli funksiya chaqirilgan.
- Kod ishlaydi, lekin o'qish qiyin, intent aniq emas.
- Ba'zan side-effect bir necha marta yoki kutilmagan tartibda sodir bo'ladi.

## Sabab (100%)
Developer yoki agent qisqa yozish uchun comprehension ichiga side-effect joylashtirdi. Python comprehension'lar expression bo'lib, side-effect'lar uchun mo'ljallanmagan. Bu style guide'larga (PEP 8, readability) zid.

## Tasdiqlash
1. Kodda `[func(x) for x in items]` kabi joyda `func` side-effect qiladimi (print, mutate, I/O)?
2. Natija list ishlatilmaydimi, faqat side-effect uchun comprehension yozilganmi?
3. `python -m pyflakes` yoki linter side-effect haqida ogohlantiradimi?

## Tuzatish (aynan shu)
Side-effect'ni aniq for loop'ga chiqar:

Yomon:
```python
[print(item) for item in items]  # side-effect
results = [process(item) for item in items if side_effect(item)]
```

Yaxshi:
```python
for item in items:
    print(item)

results = []
for item in items:
    if condition(item):
        results.append(process(item))
# yoki list comprehension faqat pure expression uchun
results = [process(item) for item in items if condition(item)]
```

Hech qachon comprehension ichida I/O, mutation yoki print ishlatma.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
List comprehension faqat yangi collection yaratish uchun. Side-effect kerak bo'lsa, aniq for loop ishlat — o'qilishi yaxshi, debug oson, kutilmagan tartib yo'q.

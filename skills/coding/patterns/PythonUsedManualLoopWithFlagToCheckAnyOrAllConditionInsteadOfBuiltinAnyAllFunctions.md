---
name: python-manual-loop-flag-instead-of-any-all
description: Python kodida "biror element shartni qanoatlantiradimi" yoki "barchasi qanoatlantiradimi" ni tekshirish uchun qo'lda loop va flag o'zgaruvchi ishlatilgan — any() yoki all() o'rniga. Natija uzunroq, kamroq o'qiladigan va potensial xato-prone kod.
---

# Manual loop + flag o'rniga any()/all() ishlatmaslik

## Nima uchun bu skill kerak
Python'da `any()` va `all()` built-in funksiyalari short-circuit evaluation qiladi va aniq niyatni bildiradi. Qo'lda loop + flag yozish kodni uzunlashtiradi, xatolik ehtimolini oshiradi (masalan, flagni noto'g'ri joyda o'zgartirish) va zamonaviy Python idiomasiga zid.

## Simptom (aynan shu)
- "Agar ro'yxatdagi hech bo'lmasa bitta element shartni bajarsa" yoki "barchasi bajarsa" mantiq kerak.
- Kodda `found = False` yoki `all_good = True` kabi flag, keyin `for` loop ichida `if` bilan flag o'zgartiriladi va `break`.
- `any(...)` yoki `all(...)` ishlatilmagan.

## Sabab (100%)
Developer yoki agent built-in `any`/`all` mavjudligini esdan chiqargan yoki "loop aniqroq" deb hisoblagan. Natijada keraksiz verbose kod yoziladi.

## Tasdiqlash
- Kodda "at least one" yoki "all items satisfy" mantiq bormi?
- Flag + for-loop + break pattern ishlatilganmi?
- `any()` yoki `all()` generator expression bilan almashtirish mumkinmi?
- Agar ha — shu skill qo'llaniladi.

## Tuzatish (aynan shu)
Flag + loop o'rniga to'g'ridan-to'g'ri `any` yoki `all` ishlat.

```python
# Noto'g'ri (manual flag)
found = False
for item in items:
    if item.is_valid():
        found = True
        break
if found:
    process()

# To'g'ri
if any(item.is_valid() for item in items):
    process()

# Noto'g'ri (all)
all_valid = True
for item in items:
    if not item.is_valid():
        all_valid = False
        break
if all_valid:
    save()

# To'g'ri
if all(item.is_valid() for item in items):
    save()
```

Generator expression ishlatish short-circuit saqlaydi va ortiqcha list yaratmaydi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- "Biror biri" yoki "barchasi" tekshiruvi uchun har doim `any()` / `all()` ishlat.
- Bu kodni qisqartiradi, o'qilishini oshiradi va xato ehtimolini kamaytiradi.
- Manual flag + loop faqat maxsus holatlarda (side-effect kerak bo'lsa) ishlatiladi.

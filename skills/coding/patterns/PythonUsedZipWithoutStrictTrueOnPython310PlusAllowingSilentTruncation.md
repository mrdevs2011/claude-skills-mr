---
name: python-zip-without-strict-flag-allows-silent-truncation
description: Python 3.10+ da zip(*iterables, strict=True) ishlatilmasa, teng bo'lmagan uzunlikdagi iterable'lar jim qisqartiriladi — ma'lumot yo'qolishi xato chiqarmaydi.
---

# Python zip() da strict=True ishlatilmagan — silent truncation

## Nima uchun bu skill kerak
Python 3.10 dan boshlab `zip()` funksiyasiga `strict=True` parametri qo'shilgan. Bu parametr yoqilmasa, eng qisqa iterable tugagach qolgan elementlar tashlab yuboriladi va hech qanday ValueError chiqmaydi. Agentlar ko'pincha eski odat bo'yicha `zip()` ni strict siz chaqiradi, natijada parallel ma'lumotlar mos kelmasa ham kod "ishlaydi", lekin ma'lumot yo'qoladi. Bu ayniqsa data processing, pairing, batch ishlovda xavfli.

## Simptom (aynan shu)
- `zip(a, b)` yoki `zip(list1, list2, list3)` ishlatilgan, `strict=True` yo'q.
- Uzunliklar farq qilganda natija kutilganidan qisqa, lekin hech qanday exception yo'q.
- Python 3.10+ muhitda ishlayapti, lekin yangi xavfsizlik parametridan foydalanilmagan.
- Misol: `list(zip([1, 2, 3], [10, 20]))` → `[(1, 10), (2, 20)]` — 3 tashlab yuborilgan, xato yo'q.

## Sabab (100%)
`zip()` ning default xatti-harakati (strict=False) eng qisqa iterable bo'yicha to'xtashga mo'ljallangan. Agent Python 3.10+ dagi `strict=True` opsiyasini bilmagan yoki esdan chiqargan. Natijada uzunlik mos kelmasligi jim ravishda yutiladi.

## Tasdiqlash
1. Kodda `zip(` chaqiruvi bormi va `strict=True` (yoki `strict = True`) yo'qmi?
2. Argumentlarning uzunligi har doim teng ekanligi 100% kafolatlanmaganmi?
3. Python versiyasi 3.10 yoki yuqorimi (`sys.version_info >= (3, 10)`)?
4. Agar ha — silent truncation xavfi bor.

## Tuzatish (aynan shu)
Agar uzunliklar teng bo'lishi shart bo'lsa — `strict=True` qo'sh. Farq bo'lsa darhol ValueError chiqadi:

```python
# XATO (silent truncation):
pairs = list(zip(ids, names, scores))  # uzunliklar farq qilsa jim qisqaradi

# TO'G'RI (3.10+):
pairs = list(zip(ids, names, scores, strict=True))  # farq bo'lsa ValueError

# Yoki eski versiya uchun qo'lda:
if not (len(ids) == len(names) == len(scores)):
    raise ValueError("Barcha ro'yxatlar uzunligi teng bo'lishi shart")
pairs = list(zip(ids, names, scores))
```

Agar truncation maqbul bo'lsa (masalan, progress bar yoki partial pairing) — `strict=False` ni aniq yozib, izoh qo'sh. Aks holda doim `strict=True`.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Python 3.10+ da parallel iterable'larni juftlashda `zip(..., strict=True)` ishlatish silent data loss'ni oldini oladi.
- Tuzatish: `strict=True` qo'shish yoki uzunliklarni oldindan tekshirish.
- Bu oddiy qoida data integrity xatolarining ko'pini bartaraf etadi.

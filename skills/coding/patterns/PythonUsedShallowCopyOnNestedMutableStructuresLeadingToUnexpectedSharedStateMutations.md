---
name: python-shallow-copy-nested-mutables
description: Python'da list yoki dict ni copy() yoki slicing bilan shallow copy qilish, ichidagi mutable'lar (list, dict) hali ham original bilan bog'langan holda o'zgartirilishi — kutilmagan yon ta'sirlar.
---

# Nested mutable tuzilmalarda shallow copy ishlatish

## Nima uchun bu skill kerak
Agentlar yoki kod yozuvchilar ko'pincha `list.copy()`, `dict.copy()` yoki `lst[:]` ni chuqur nusxa deb hisoblab ishlatadi. Lekin bular faqat yuqori darajani nusxalaydi. Ichki list/dict/set'lar bir xil obyektga ishora qiladi. Keyinchalik ichki element o'zgartirilsa, original ham o'zgaradi — silent bug.

## Simptom (aynan shu)
- `new_data = original.copy()` yoki `new_data = original[:]` ishlatilgan.
- Original ichida list yoki dict bor (masalan `{"items": [1, 2]}` yoki `[[1], [2]]`).
- Keyin `new_data["items"].append(3)` yoki `new_data[0].append(99)` qilinadi.
- Original ham o'zgarganini ko'rasiz, garchi "nusxa" qilingan bo'lsa ham.
- Hech qanday xato chiqmaydi, faqat noto'g'ri natija.

## Sabab (100%)
`copy()` va slicing shallow copy qiladi. Nested mutable obyektlar yangi yaratilmaydi, faqat reference ko'chiriladi. Bu Python'da keng tarqalgan tuzoq.

## Tasdiqlash
- Kodda `.copy()`, `[:]` yoki `copy.copy()` bormi?
- Strukturada ichki list, dict yoki boshqa mutable bormi?
- Keyinchalik ichki elementlar o'zgartiriladimi?
- Agar ha va original o'zgarsa — shu skill.

## Tuzatish (aynan shu)
Chuqur nusxa kerak bo'lsa `copy.deepcopy` ishlating yoki manual yangi tuzilma yarating.

```python
import copy

# Noto'g'ri (shallow)
original = {"items": [1, 2]}
shallow = original.copy()
shallow["items"].append(3)
print(original)  # {"items": [1, 2, 3]} — o'zgardi!

# To'g'ri (deep)
deep = copy.deepcopy(original)
deep["items"].append(4)
print(original)  # {"items": [1, 2, 3]} — o'zgarmadi (oldingi misoldan)
```

Agar faqat yuqori daraja yetarli bo'lsa (ichki o'zgarmasa), shallow yetarli. Lekin nested mutable bo'lsa har doim deepcopy yoki explicit yangi yaratish.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `.copy()` va `[:]` faqat shallow copy. Nested mutable'lar bir xil qoladi.
- Kutilmagan yon ta'sirlarning oldini olish uchun nested bo'lsa `copy.deepcopy` ishlating.
- Bu silent bug'larning keng tarqalgan sababidir — har doim tuzilma chuqurligini tekshiring.

---
name: python-list-multiplication-shared-nested-lists
description: Python'da [[]] * n yoki [mutable] * n ishlatilganda ichki listlar bir xil obyektni ko'rsatadi — o'zgartirish barchasiga ta'sir qiladi, kutilmagan shared state.
---

# Nested list yaratishda * operatori shared mutable ichki listlar yaratadi

## Nima uchun bu skill kerak
Python'da `[[] for _ in range(n)]` o'rniga `[[]] * n` yozish odatiy xato. Bu kod patterns kategoriyasida, chunki syntax to'g'ri ishlaydi, lekin ma'noda noto'g'ri shared state beradi. Debuggingdan tashqari, oldini olish uchun kerak.

## Simptom (aynan shu)
- `matrix = [[0] * cols] * rows` yoki `lists = [[]] * n` yozilgan.
- Birinchi ichki listga element qo'shilganda yoki o'zgartirilganda barcha "qatorlar" bir xil o'zgaradi.
- Kod xato bermaydi, lekin natija kutilganidan farq qiladi (masalan barcha qatorlar bir xil qiymat).
- Test yoki ishlatishda "nima uchun hammasi o'zgardi" degan savol.

## Sabab (100%)
`*` operatori listni takrorlaydi, lekin ichki mutable obyektni (list) faqat bir marta yaratib, reference'larini ko'paytiradi. Har bir tashqi element bir xil ichki list obyektiga ishora qiladi. Immutable (int, str) bo'lsa muammo yo'q, lekin list/dict bo'lsa shared bo'ladi.

## Tasdiqlash
- Kodda `* n` bilan nested list yaratilganmi?
- Ichki element mutable (list, dict, set, custom object)mi?
- Bir joyda o'zgartirish boshqa "nusxalarga" ta'sir qiladimi? (`id(lists[0]) == id(lists[1])` tekshirish)
- Alternativa list comprehension ishlatilmaganmi?

## Tuzatish (aynan shu)
Har doim list comprehension yoki alohida yaratish:

```python
# Noto'g'ri — shared
matrix = [[0] * 3] * 2
matrix[0][0] = 1
# matrix == [[1, 0, 0], [1, 0, 0]]

# To'g'ri
matrix = [[0] * 3 for _ in range(2)]
matrix[0][0] = 1
# matrix == [[1, 0, 0], [0, 0, 0]]

# Yoki
lists = [[] for _ in range(n)]
```

Agar chuqurroq nested bo'lsa, har darajada yangi yaratish kerak. `copy.deepcopy` faqat mavjud ma'lumotni nusxalash uchun, yangi yaratishda emas.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`[[] * n]` yoki `[[]] * n` hech qachon ishlatmang. Har doim `[[] for _ in range(n)]` yozing. Bu shared mutable state xatosini 100% oldini oladi va kod portable, tushunarli bo'ladi.

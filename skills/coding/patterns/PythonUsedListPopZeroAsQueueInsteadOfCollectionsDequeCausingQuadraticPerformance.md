---
name: python-list-pop-zero-as-queue-instead-of-deque
description: Python'da list.pop(0) yoki list.insert(0, ...) navbat (queue) sifatida ishlatilganda har amal O(n) — katta hajmda sekinlashish yoki timeout. collections.deque ishlatilmagan.
---

# Python list.pop(0) navbat sifatida — quadratic performance

## Nima uchun bu skill kerak
Agentlar ko'pincha oddiy listni navbat (FIFO) sifatida ishlatishadi: `queue.append(item)` va `queue.pop(0)`. Bu kichik ma'lumotda ishlaydi, lekin elementlar soni o'sganda har `pop(0)` butun listni siljitadi — umumiy vaqt O(n²) bo'ladi. Bu production yoki katta inputlarda sekinlik yoki timeout keltiradi.

## Simptom (aynan shu)
- Kodda `queue = []`, keyin `queue.append(...)` va `queue.pop(0)` (yoki `del queue[0]`, `queue.insert(0, ...)`) ishlatilgan.
- Ma'lumot hajmi oshganda (minglab yoki undan ko'p element) sekinlashadi, CPU yuqori, yoki timeout bo'ladi.
- Kichik testlarda to'g'ri ishlaydi, katta inputda yomonlashadi.
- Hech qanday explicit algoritm murakkabligi hisoblanmagan.

## Sabab (100%)
Python list — dynamic array. `pop(0)` yoki `insert(0, ...)` barcha keyingi elementlarni bir pozitsiya siljitadi — O(n) amal. n marta shunday qilsangiz, umumiy O(n²). `collections.deque` ikkala uchdan ham O(1) `append`/`popleft` beradi.

## Tasdiqlash
1. Kodda list ustida `pop(0)` yoki `insert(0, ...)` bormi va u navbat mantiqida ishlatilyaptimi?
2. Elementlar soni katta bo'lishi mumkinmi (loop, stream, user input)?
3. Vaqtni o'lchab ko'r: kichik n (100) va katta n (10000) da farq keskin o'sadimi?
4. `from collections import deque` qilib `popleft()` ga almashtirsang, vaqt sezilarli yaxshilanadimi?

## Tuzatish (aynan shu)
Hech qachon listni navbat sifatida `pop(0)` bilan ishlatma. `collections.deque` ishlat:

```python
# Noto'g'ri (O(n) har pop(0)):
queue = []
queue.append("a")
queue.append("b")
item = queue.pop(0)  # sekin, butun list siljiydi

# To'g'ri (O(1) ikkala uchda):
from collections import deque
queue = deque()
queue.append("a")
queue.append("b")
item = queue.popleft()  # tez
```

Agar faqat oxiridan qo'shish/olib tashlash (stack) bo'lsa, oddiy list `append`/`pop()` yetarli (O(1)).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `list.pop(0)` navbat uchun quadratic vaqt beradi.
- Katta hajmda sekinlik yoki timeout bo'lishi mumkin.
- Doim `collections.deque` + `popleft()` ishlat — O(1).
- Bu klassik Python performance tuzog'i.
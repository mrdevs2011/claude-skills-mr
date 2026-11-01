---
name: python-used-recursion-for-simple-iterative-task
description: Oddiy takrorlanuvchi vazifa uchun rekursiya ishlatilganda katta kirishda RecursionError yoki sekin ishlash yuzaga keladi — iterativ yechim o'rniga.
---

# Oddiy iterativ vazifa uchun rekursiya ishlatish — RecursionError yoki stack overflow

## Nima uchun bu skill kerak
Agentlar yoki dasturchilar "chiroyli" deb hisoblab oddiy yig'indı, faktorial, yoki ro'yxatni aylantirish kabi vazifalarni rekursiv yozishadi. Python'ning default recursion limit (sys.getrecursionlimit() ≈ 1000) tufayli katta ma'lumotda RecursionError chiqadi. Iterativ yechim (for/while + stack yoki oddiy loop) xavfsizroq, tezroq va xotiradan tejamkor. Bu ayniqsa agentlar tomonidan yaratilgan kodda tez-tez uchraydi.

## Simptom (aynan shu)
- Funksiya o'zini chaqiradi (rekursiv) va hech qanday memoization yoki tail-call optimizatsiyasi yo'q.
- Kichik testlarda ishlaydi, lekin n > 900-1000 bo'lganda `RecursionError: maximum recursion depth exceeded` chiqadi.
- Vazifa oddiy: ro'yxat elementlarini yig'ish, daraxtni aylantirishning oddiy varianti, yoki progressiv hisoblash — loop bilan oson yechiladi.
- Stack trace juda uzun va bir xil funksiya takrorlanadi.
- sys.setrecursionlimit() bilan "tuzatish" uriniladi, lekin bu xavfli va ishonchsiz.

## Sabab (100%)
Python rekursiyani C stack orqali amalga oshiradi va default limit 1000. Har bir chaqiruv stack frame yaratadi. Oddiy iterativ algoritm (loop) stack ishlatmaydi yoki explicit stack (list) bilan boshqariladi. Rekursiya "tabiiy" ko'rinadi, lekin katta kirishda o'chiriladi. AI'lar ko'pincha matematik ta'rifni (masalan, factorial(n) = n * factorial(n-1)) to'g'ridan-to'g'ri kodga o'tkazadi.

## Tasdiqlash
1. Funksiya ichida o'z nomi bilan chaqiruv borligini tekshir.
2. Base case bor, lekin chuqurlik katta ma'lumotda limitdan oshadi.
3. `python -c "import sys; print(sys.getrecursionlimit())"` ≈ 1000.
4. Kichik n bilan ishlaydi, katta n bilan RecursionError.
5. Iterativ versiya (loop) xato bermaydi va tezroq.

## Tuzatish (aynan shu)
Rekursiyani oddiy loop yoki explicit stack bilan almashtir. Faqat haqiqiy daraxt/rekursiv struktura uchun rekursiya ishlat, va unda ham limitni hisobga ol.

```python
# Noto'g'ri — rekursiv (katta n da RecursionError):
def sum_list_recursive(lst):
    if not lst:
        return 0
    return lst[0] + sum_list_recursive(lst[1:])

print(sum_list_recursive(list(range(2000))))  # RecursionError

# To'g'ri — iterativ:
def sum_list_iterative(lst):
    total = 0
    for item in lst:
        total += item
    return total

print(sum_list_iterative(list(range(2000))))  # ishlaydi

# Yoki built-in:
print(sum(list(range(2000))))
```

Agar rekursiya majburiy bo'lsa (masalan, chuqur daraxt):
- `sys.setrecursionlimit()` ishlatma (xavfli).
- Iterativ DFS/BFS yoki iterative deepening ishlat.
- Memoization (@functools.lru_cache) qo'sh, lekin limit baribir bor.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Oddiy takrorlanuvchi vazifalarni hech qachon rekursiv yozma. Python'da recursion limit bor va u tezda tugaydi. Iterativ yechim (for loop, while, sum(), yoki explicit stack) har doim xavfsizroq va ishonchliroq. Agent sifatida kod yozayotganda "rekursiya chiroyli" deb o'ylama — ishonchlilikni tanla. Katta kirishda RecursionError chiqsa, avval shu anti-patternni tekshir.

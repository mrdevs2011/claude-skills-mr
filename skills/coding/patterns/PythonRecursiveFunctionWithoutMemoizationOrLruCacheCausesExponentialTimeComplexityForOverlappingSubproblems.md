---
name: python-recursive-no-memo-exponential
description: Python da recursive funksiya overlapping subproblems uchun memoization yoki functools.lru_cache ishlatilmagan — har chaqiruvda bir xil hisob-kitoblar takrorlanadi, vaqt murakkabligi eksponensial o'sadi, katta n da sekinlashadi yoki timeout beradi.
---

# Recursive funksiyada memoization yo'qligi sababli eksponensial sekinlashish

## Nima uchun bu skill kerak
Recursive yechimlar (masalan, Fibonacci, knapsack, tree traversal with shared subtrees) ko'pincha bir xil subproblemni bir necha marta hisoblaydi. Memoization yoki lru_cache qo'shilmasa, vaqt murakkabligi O(2^n) ga chiqadi. Bu oddiy holatda ishlaydi, lekin real inputda ishlamaydi yoki juda sekinlashadi. Aniq va tez yechim uchun cache majburiy.

## Simptom (aynan shu)
- Recursive funksiya (def fib(n): return fib(n-1) + fib(n-2) kabi) katta n (masalan n=40+) da juda sekin ishlaydi yoki timeout beradi.
- Profiler yoki print loglarda bir xil argument bilan funksiya yuzlab/minglab marta chaqirilganini ko'rasiz.
- Kichik n da tez, katta n da birdan sekinlashadi.
- Xato yo'q, lekin performance muammosi.

## Sabab (100%)
Recursive chaqiruvlar overlapping subproblems yaratadi, lekin natijalar saqlanmaydi. Har safar bir xil hisob qayta-qayta bajariladi. Dasturchi "oddiy recursive yozdim" deb cache qo'shishni unutadi yoki bilmaydi.

## Tasdiqlash
1. Funksiya recursive chaqiruv qiladimi va bir xil argumentlar bilan bir necha marta chaqirilishi mumkinmi?
2. Natija saqlanadigan dict, @lru_cache yoki boshqa cache bormi?
3. Kichik input tez, katta input sekinmi? Agar ha — bu holat.

## Tuzatish (aynan shu)
functools.lru_cache yoki oddiy dict cache qo'sh.

Noto'g'ri (eksponensial):
```python
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```

To'g'ri (lru_cache bilan):
```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```

Yoki manual dict:
```python
def fib(n: int, memo: dict | None = None) -> int:
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n <= 1:
        result = n
    else:
        result = fib(n - 1, memo) + fib(n - 2, memo)
    memo[n] = result
    return result
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Overlapping subproblems bo'lgan recursive funksiyalarda doim memoization (@lru_cache yoki dict) qo'sh. Aks holda vaqt murakkabligi eksponensial bo'ladi va real inputlarda ishlamaydi. Kichik n da ishlashi aldashmasin.

---
name: python-function-without-type-hints
description: Python funksiya yoki metod type hint'siz e'lon qilingan — static analysis, IDE yordami va hujjatlashtirish yomonlashadi. Mypy yoki boshqa type checker foydasiz bo'ladi.
---

# Python funksiya type hintsiz e'lon qilingan

## Nima uchun bu skill kerak
Type hint'lar (PEP 484) kodni o'qishni osonlashtiradi, IDE autocomplete va xato aniqlashni yaxshilaydi, mypy kabi tool'lar bilan xatolarni oldindan topishga yordam beradi. Agentslar tez-tez "ishlab turadi" deb type'siz yozib qo'yadi, keyinchalik maintain qilish qiyinlashadi va kutilmagan TypeError'lar chiqadi.

## Simptom (aynan shu)
- Funksiya ta'rifi `def foo(x, y):` ko'rinishida, `x: int`, `y: str` yo'q.
- Qaytish tipi `-> bool` ko'rsatilmagan.
- Mypy yoki pyright ishga tushirilganda ko'p xato yoki umuman type ma'lumoti yo'q.
- Boshqa dasturchi yoki agent parametr tipini taxmin qilishi kerak.
- Runtime'da noto'g'ri tip uzatilganda TypeError yoki silent wrong result.

## Sabab (100%)
Agent yoki dasturchi "tezroq yozish" uchun type annotation'ni tashlab ketadi. Python dinamik til ekanini bahona qiladi. Type hint'lar ixtiyoriy ekanligini bilsa ham, ularning foydasini hisobga olmaydi. Natijada kod self-documenting bo'lmaydi.

## Tasdiqlash
1. Funksiya signature'larini tekshir: `grep -nE 'def .+\(.*\):' file.py` — ichida `:` tip yo'qmi?
2. `from __future__ import annotations` yoki typing import bormi?
3. mypy `mypy --strict file.py` ishga tushirib, missing type annotation xatolarini ko'r.
4. IDE da hover qilganda tip ko'rsatilmaydimi?

## Tuzatish (aynan shu)
Har bir parametr va qaytish qiymatiga type hint qo'sh. Murakkab tiplar uchun `typing` ishlat.

```python
# Oldin (yomon)
def process_items(items, limit):
    result = []
    for item in items[:limit]:
        if item.is_valid():
            result.append(item.value)
    return result

# Keyin (yaxshi)
from typing import List, Optional

def process_items(items: List[Item], limit: int) -> List[str]:
    result: List[str] = []
    for item in items[:limit]:
        if item.is_valid():
            result.append(item.value)
    return result
```

Agar `from __future__ import annotations` ishlatilsa, forward reference osonlashadi. Mavjud kodga bosqichma-bosqich qo'sh, avval public API'lardan boshla.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Type hint'siz funksiyalar o'qish va maintain qilishni qiyinlashtiradi, static analysis foydasini yo'qotadi. Har doim parametr va return tipini aniq ko'rsatish — bu best practice, ayniqsa agentlar tomonidan yaratilgan kodda.

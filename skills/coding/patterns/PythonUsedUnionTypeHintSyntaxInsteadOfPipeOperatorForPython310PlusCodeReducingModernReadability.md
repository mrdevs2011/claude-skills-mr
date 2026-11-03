---
name: python-used-union-instead-of-pipe-type-hint
description: Python 3.10+ kodida type hint uchun Union[...] ishlatilgan, | operator o'rniga — zamonaviy, qisqa va o'qilishi oson sintaksis ishlatilmagan.
---

# Python Used Union Type Hint Syntax Instead of Pipe Operator for Python 3.10+ Code

## Nima uchun bu skill kerak
Python 3.10 dan boshlab type hintlarda `X | Y` sintaksisi qo'llab-quvvatlanadi. Eski `Union[X, Y]` ishlatish kodni uzunroq va kamroq zamonaviy qiladi. Agent yoki dasturchi yangi kod yozayotganda buni e'tiborsiz qoldirishi mumkin.

## Simptom (aynan shu)
Type hintlarda `from typing import Union` va `Union[str, int]` yoki shunga o'xshash ko'rinadi, lekin loyiha Python 3.10+ ni talab qiladi yoki ishlatadi. Yangi kodda ham eski uslub ishlatilgan.

## Sabab (100%)
Agent yoki yozuvchi eski Python versiyalari (3.9 va past) uchun mo'ljallangan `Union` ni xotiradan ishlatdi, ` | ` operatorining 3.10+ da mavjudligini tekshirmadi yoki eslamadi. Type hint yozishda qisqa sintaksisni tanlamadi.

## Tasdiqlash
- `from typing import Union` importi bor.
- Funksiya yoki o'zgaruvchi annotatsiyasida `Union[A, B]` yoki `Optional` (bu ham `| None` ga o'xshash) ishlatilgan.
- Loyihaning `python_requires` yoki `pyproject.toml` / runtime Python >= 3.10.
- Yangi yozilgan kodda (eski legacy emas).

## Tuzatish (aynan shu)
`Union` o'rniga `|` ishlat.

Eski:
```python
from typing import Union

def process(value: Union[str, int, None]) -> Union[dict, list]:
    ...
```

Yangi (Python 3.10+):
```python
def process(value: str | int | None) -> dict | list:
    ...
```

Agar `Optional[X]` bo'lsa, `X | None` qil. Importni olib tashla agar boshqa narsa uchun kerak bo'lmasa.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python 3.10+ da type hintlar uchun `Union[...]` o'rniga `|` operatorini ishlatish kerak — qisqaroq, o'qilishi osonroq va zamonaviy. Yangi kod yozishda buni doim afzal ko'r.

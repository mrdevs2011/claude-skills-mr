---
name: python-used-long-if-elif-chain-for-enum-or-constant-value-dispatch-instead-of-match-case-in-python310-plus
description: Long if-elif chains for dispatching on enum or constant values reduce readability and error-proneness. Use match-case for structural pattern matching in Python 3.10+.
---

# Long if-elif for value dispatch instead of match-case

## Nima uchun bu skill kerak
Python 3.10+ da structural pattern matching (match-case) mavjud. Enum yoki constant qiymatlarga asoslangan dispatch uchun uzun if-elif zanjiri kodni qiyin o'qiladigan va xatolarga moyil qiladi (masalan, biror holatni unutish).

## Simptom (aynan shu)
Kodda ko'p if status == "pending": ... elif status == "approved": ... elif status == "rejected": ... ko'rinishidagi zanjirlar. Yoki Enum a'zolariga if-elif. Yangi holat qo'shilganda if zanjirni yangilash oson unutiladi, va default holat noaniq.

## Sabab (100%)
Match-case ni bilmaslik yoki eski uslubga odatlanganlik. If-elif har bir shartni alohida tekshiradi, match esa pattern matching va exhaustiveness checking (agar exhaustiveness ishlatilsa) beradi.

## Tasdiqlash
1. Python versiyasi >= 3.10 ekanligini tekshiring: `python --version`
2. Kodda uzun if-elif zanjiri enum/constant bo'yicha dispatch qilayotganini toping.
3. Match-case bilan qayta yozish mumkinligini tasdiqlang.

## Tuzatish (aynan shu)
If-elif zanjirini match-case ga o'zgartiring. Wildcard _ bilan default ni aniq belgilang.

Misol:

```python
# Oldin (yomon)
def handle_status(status: str) -> str:
    if status == "pending":
        return "Waiting"
    elif status == "approved":
        return "Accepted"
    elif status == "rejected":
        return "Denied"
    else:
        return "Unknown"

# Keyin (yaxshi, Python 3.10+)
def handle_status(status: str) -> str:
    match status:
        case "pending":
            return "Waiting"
        case "approved":
            return "Accepted"
        case "rejected":
            return "Denied"
        case _:
            return "Unknown"
```

Enum uchun ham:

```python
from enum import Enum

class Status(Enum):
    PENDING = "pending"
    APPROVED = "approved"

def handle(status: Status) -> str:
    match status:
        case Status.PENDING:
            return "Waiting"
        case Status.APPROVED:
            return "Accepted"
        case _:
            return "Unknown"
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Python 3.10+ da value dispatch uchun if-elif o'rniga match-case ishlating. Bu kodni qisqaroq, o'qiladigan va yangi holatlarni unutish ehtimolini kamaytiradi.

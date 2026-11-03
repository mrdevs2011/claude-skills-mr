---
name: python-used-mutable-default-in-dataclass-field-without-default-factory
description: Dataclass fields with mutable defaults like list=[] or dict={} share the same object across all instances, causing unexpected shared state mutations and bugs.
---

# PythonUsedMutableDefaultInDataclassFieldWithoutDefaultFactoryCausingSharedState

## Nima uchun bu skill kerak
Python dataclass'larida mutable default qiymat (masalan `items: list = []`) ishlatilganda, bu default bitta marta yaratiladi va barcha instance'lar orasida ulashiladi. Bu funksiya argumentlaridagi mutable default muammosiga o'xshash, lekin dataclass'larda ko'p uchraydi va silent bug'larga olib keladi — bir instance'da o'zgartirilgan ma'lumot boshqa instance'larda ham ko'rinadi.

## Simptom (aynan shu)
- Ikki yoki undan ortiq dataclass instance yaratilganda, birining list/dict field'iga element qo'shilsa, ikkinchisida ham paydo bo'ladi.
- `TypeError` yoki kutilmagan mutation.
- Field ta'rifida `= []` yoki `= {}` bor, `field(default_factory=...)` yo'q.
- Testlarda yoki runtime'da "shared state" kuzatiladi.

## Sabab (100%)
Dataclass field default'i class body'da bir marta baholanadi (xuddi funksiya default argumenti kabi). Mutable obyekt (list, dict, set) shu bir nusxani ulashadi. `dataclasses.field(default_factory=list)` ishlatilmasa, har bir instance uchun yangi obyekt yaratilmaydi.

## Tasdiqlash
1. Dataclass ta'rifini o'qing: mutable field'larda to'g'ridan-to'g'ri `= []` / `= {}` bor-yo'qligini tekshiring.
2. Ikki instance yarating va birida mutate qiling:
   ```python
   a = MyData()
   b = MyData()
   a.items.append(1)
   print(b.items)  # [1] bo'lsa — bug
   ```
3. `field(default_factory=...)` ishlatilganligini tasdiqlang.

## Tuzatish (aynan shu)
Har doim mutable default uchun `field(default_factory=...)` ishlating:

```python
from dataclasses import dataclass, field
from typing import List, Dict

@dataclass
class MyData:
    items: List[int] = field(default_factory=list)      # to'g'ri
    meta: Dict[str, str] = field(default_factory=dict)  # to'g'ri
    # items: List[int] = []  # NOTO'G'RI — shared state

# Foydalanish
a = MyData()
b = MyData()
a.items.append(42)
assert b.items == []  # endi to'g'ri ishlaydi
```

Qoidalar:
- Immutable (int, str, None, tuple) uchun oddiy default OK.
- Mutable uchun faqat `default_factory`.
- Python 3.7+ da `dataclasses` mavjud.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Dataclass mutable field'lar uchun hech qachon to'g'ridan-to'g'ri `= []` yozmang. Har doim `field(default_factory=list)` (yoki dict, set) ishlating. Bu shared state bug'ini 100% oldini oladi va kodni xavfsiz qiladi.

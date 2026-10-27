---
name: python-unhashable-type-as-dict-key-or-set-element
description: list, dict yoki boshqa unhashable tipni dict key yoki set element sifatida ishlatish — TypeError: unhashable type.
---

# Unhashable tipni dict key yoki set element sifatida ishlatish

## Nima uchun bu skill kerak
AI ba'zan `dict` yoki `set` ga `list`, `dict`, `set` kabi o'zgaruvchan (mutable/unhashable) obyektlarni key yoki element qilib qo'shadi. Bu darhol `TypeError: unhashable type: 'list'` (yoki 'dict') beradi. Hashable tip talab qilinadi (str, int, tuple of hashables, frozenset).

## Simptom (aynan shu)
- `TypeError: unhashable type: 'list'` yoki `'dict'` yoki `'set'`.
- Kod: `d = {}; d[[1,2]] = "value"` yoki `s = set(); s.add({"a":1})` yoki `s.add([1,2])`.
- Nested dict/list ni key sifatida ishlatishga urinish.
- `set(list_of_lists)` yoki shunga o'xshash.

## Sabab (100%)
Python dict va set hash jadvaliga asoslangan. Key/element hashable bo'lishi shart ( `__hash__` va `__eq__` barqaror). List, dict, set mutable bo'lgani uchun hash qilinmaydi. AI buni hisobga olmaydi, "har qanday narsani key qilsa bo'ladi" deb o'ylaydi.

## Tasdiqlash
1. Stack trace da `TypeError: unhashable type` bormi?
2. Xato qatorida `dict[...] =` yoki `set.add()` / `set(...)` bormi?
3. Argument list, dict, set yoki boshqa mutablemi?
4. Agar ha — shu skill.

## Tuzatish (aynan shu)
Hashable alternativ ishlat:

```python
# XATO:
d = {}
key = [1, 2, 3]
d[key] = "value"          # TypeError: unhashable type: 'list'

s = set()
s.add({"x": 1})           # TypeError

# TO'G'RI — tuple (immutable) yoki frozenset / json.dumps / str:
d = {}
key = (1, 2, 3)           # tuple hashable
d[key] = "value"

# yoki nested uchun:
key = tuple(sorted(item.items())) if isinstance(item, dict) else tuple(item)
# yoki:
import json
key = json.dumps(item, sort_keys=True)
d[key] = "value"

# set uchun:
s = set()
s.add(frozenset({"x": 1}.items()))  # yoki tuple
```

Agar tartib muhim bo'lmasa va nested bo'lsa, `json.dumps(..., sort_keys=True)` yoki maxsus hashable wrapper ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Dict key va set element faqat hashable (immutable va barqaror hash) tip bo'lishi shart. List/dict/set ni to'g'ridan-to'g'ri ishlatma — tuple, frozenset, yoki serializatsiya qilingan str ga aylantir.

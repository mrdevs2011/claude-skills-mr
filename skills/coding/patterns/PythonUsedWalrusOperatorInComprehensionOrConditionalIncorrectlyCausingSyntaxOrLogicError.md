---
name: python-used-walrus-operator-in-comprehension-or-conditional-incorrectly-causing-syntax-or-logic-error
description: Python 3.8+ walrus operator (:=) list/dict comprehension yoki if ichida noto'g'ri joylashtirilganda SyntaxError yoki kutilmagan mantiq xatosi beradi.
---

# Walrus operator noto'g'ri ishlatilgan

## Nima uchun bu skill kerak
Walrus operator (`:=`) assignment expression uchun qulay, lekin comprehension yoki conditional ichida noto'g'ri joylashtirilsa SyntaxError yoki o'zgaruvchi scope muammosi chiqadi. Agent uni "qisqa yozish" uchun ishlatib, sintaksisni buzadi.

## Simptom (aynan shu)
```
SyntaxError: invalid syntax
```
yoki
```
SyntaxError: assignment expression cannot be used in a comprehension iterable expression
```
Kodda `[x := func() for ...]` yoki `if (n := len(data) > 0)` kabi konstruksiyalar.

## Sabab (100%)
Walrus operator ma'lum kontekstlarda cheklangan:
- Comprehension iterable qismida ( `for x in (y := ...)` ) ruxsat etilmaydi ba'zi holatlarda.
- Parentheses kerak bo'lishi mumkin.
- Scope: comprehension ichidagi walrus tashqi scope'ga chiqishi mumkin, kutilmagan yon ta'sir.

## Tasdiqlash
1. Xato "assignment expression" yoki walrus bilan bog'liq SyntaxError'mi?
2. Kodda `:=` comprehension yoki murakkab if ichida ishlatilganmi?
Agar ha — bu skill mos.

## Tuzatish (aynan shu)
Walrus'ni oddiy assignment bilan almashtiring yoki to'g'ri joylashtiring:

```python
# Noto'g'ri
results = [x := process(item) for item in data if x > 0]  # x hali yo'q

# To'g'ri
results = []
for item in data:
    x = process(item)
    if x > 0:
        results.append(x)

# Yoki to'g'ri walrus (agar kerak)
if (n := len(data)) > 10:
    print(f"Large: {n}")
```

Agar faqat qisqa yozish uchun bo'lsa — oddiy o'zgaruvchi yaxshiroq.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Walrus operator (`:=`) kuchli, lekin comprehension va murakkab if'larda ehtiyotkorlik bilan ishlating. SyntaxError chiqsa, oddiy assignment'ga qayting.

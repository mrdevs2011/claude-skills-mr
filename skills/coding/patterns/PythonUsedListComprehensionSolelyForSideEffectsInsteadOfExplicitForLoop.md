---
name: python-list-comprehension-for-side-effects
description: List comprehension faqat side effect (print, append, API call, file write) uchun ishlatilgan — natija tashlab yuboriladi. Bu anti-pattern, for-loop ishlatish kerak.
---

# Python: list comprehension faqat side effect uchun ishlatilgan

## Nima uchun bu skill kerak
Agentlar ba'zan "Pythonic" bo'lish uchun list comprehension yozadi, lekin u faqat side effect (print qilish, faylga yozish, API chaqirish, global o'zgaruvchini o'zgartirish) uchun ishlatiladi va natija hech qayerda saqlanmaydi yoki tashlab yuboriladi. Bu kodni chalkash qiladi, memory isrof qiladi (vaqtinchalik list yaratiladi) va niyatni yashiradi. Aniq for-loop yaxshiroq.

## Simptom (aynan shu)
- Kodda `[do_something(x) for x in items]` yoki `[func(x) for x in data]` bor, lekin natija o'zgaruvchiga o'tkazilmaydi yoki darhol tashlab yuboriladi.
- Comprehension ichida `print()`, `append()`, `requests.post()`, `open().write()` kabi side effectlar bor.
- Lint yoki reviewer "list comprehension for side effects" deb ogohlantiradi.
- Katta list uchun memory spike kuzatiladi, chunki butun list yaratiladi.

## Sabab (100%)
Agent "bitta qatorda yozish" yoki "functional style" deb o'ylaydi, lekin comprehension expression bo'lib, har doim list qaytaradi. Side effect uchun u noto'g'ri vosita — for-loop aniq va samarali.

## Tasdiqlash
1. Kodda `\[.* for .* in .*\]` patternini qidir, natija ishlatilganmi tekshir: `grep -nE '\[.+ for .+ in .+\]' *.py`
2. Agar natija o'zgaruvchiga tenglashtirilmagan yoki darhol tashlab yuborilgan bo'lsa — side effect.
3. Comprehension ichida pure function emas, balki state o'zgartiruvchi yoki I/O bormi?
4. `python -m py_compile` yoki linter (pylint, ruff) "comprehension for side effects" deb aytadimi?

## Tuzatish (aynan shu)
Side effect uchun aniq `for` loop ishlat. Comprehension faqat yangi list/value qurish uchun qoldir.

```python
# Noto'g'ri (side effect uchun comprehension):
[print(item) for item in items]
[process_and_log(x) for x in data]  # process_and_log ichida log yoki API
results = [send_email(user) for user in users]  # natija tashlab yuboriladi

# To'g'ri:
for item in items:
    print(item)

for x in data:
    process_and_log(x)

for user in users:
    send_email(user)

# Agar haqiqatan list kerak bo'lsa (side effect yo'q):
processed = [transform(x) for x in data]
```

Qoidalar:
- Comprehension ichida faqat pure expression bo'lsin.
- Side effect (I/O, mutation, print) → for-loop.
- Agar katta data bo'lsa, generator expression (`(...)`) ham side effect uchun ishlatma — u ham evaluation qiladi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- List comprehension yangi sequence yaratish uchun, side effect uchun emas.
- `[action(x) for x in xs]` natijani tashlab yuborsa — anti-pattern.
- Aniq `for` loop ishlat, niyat aniq bo'ladi va memory isrof bo'lmaydi.

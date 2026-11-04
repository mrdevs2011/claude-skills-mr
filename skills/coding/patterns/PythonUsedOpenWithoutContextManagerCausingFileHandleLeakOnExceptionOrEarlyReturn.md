---
name: python-open-without-context-manager-file-handle-leak
description: When Python code uses open() without a with statement or context manager, leading to unclosed file handles on exceptions or early returns. Use when file operations leak resources or cause "too many open files" errors.
---

# Python open() without context manager causes file handle leak

## Nima uchun bu skill kerak
Fayl ochishda context manager ishlatmaslik resource leak ga olib keladi, ayniqsa exception yoki early return holatlarida. Bu productionda "Too many open files" xatosiga yoki performance muammolariga sabab bo'ladi.

## Simptom (aynan shu)
- Fayl operatsiyalaridan keyin file handle'lar yopilmay qoladi.
- Long-running processda "OSError: [Errno 24] Too many open files" yoki shunga o'xshash.
- Exception bo'lganda fayl yopilmaydi, ma'lumot yozilmaydi yoki lock qoladi.
- Kodda `f = open(...)` va keyin `f.close()` bor, lekin try/except yoki return orasida close() chaqirilmaydi.

## Sabab (100%)
`open()` chaqiruvi `with` statement yoki context manager bilan o'ralmagan. Python garbage collector faylni yopishi mumkin, lekin kafolatlanmagan, ayniqsa exception stack'ida yoki circular reference'larda. `f.close()` faqat happy path'da chaqiriladi.

## Tasdiqlash
1. Kodda `open(` qidiring, `with open` yoki `.close()` atrofida try/finally yo'qligini tekshiring.
2. Exception simulyatsiya qiling: open dan keyin raise qiling va process open files sonini `lsof` yoki `/proc` orqali tekshiring.
3. `with` ishlatilgan versiyada leak yo'qligini tasdiqlang.

## Tuzatish (aynan shu)
Har doim context manager ishlating:

```python
# Noto'g'ri
f = open("data.txt", "r", encoding="utf-8")
content = f.read()
f.close()  # exception bo'lsa chaqirilmaydi

# To'g'ri
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
# with blokidan chiqqanda avtomatik yopiladi, hatto exception bo'lsa ham
```

Agar manual close kerak bo'lsa (kamdan-kam):

```python
f = open("data.txt", "r", encoding="utf-8")
try:
    content = f.read()
finally:
    f.close()
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Fayl, socket, lock va boshqa resource'larni ochishda doim context manager (`with`) ishlatish shart. Bu exception-safe va resource leak'ni oldini oladi. `open()` + manual close() ishonchsiz.

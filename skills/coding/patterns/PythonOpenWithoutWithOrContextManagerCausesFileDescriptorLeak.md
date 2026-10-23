---
name: python-open-without-with-or-context-manager-causes-file-descriptor-leak
description: Python'da open() ni with statement yoki context manager'siz ishlatish — fayl descriptor'lar ochiq qoladi, resource leak, max limitga yetganda xato.
---

# Python open() without with yoki context manager fayl descriptor leak qiladi

## Nima uchun bu skill kerak
Agentlar tez-tez faylni ochib, o'qib/yozib, qo'lda close() qilishni unutadi yoki exception bo'lsa close chaqirilmaydi. Bu file descriptor'larni ochiq qoldiradi. Ko'p marta takrorlansa OS limitiga yetadi ("too many open files"), va dastur ishlamay qoladi. with statement yoki context manager buni avtomatik hal qiladi.

## Simptom (aynan shu)
- Kodda `f = open("file.txt")` bor, keyin `f.read()` yoki `f.write()`, lekin `f.close()` yo'q yoki faqat happy path'da.
- try/except ichida open, lekin finally'da close yo'q.
- Exception yuz berganda fayl ochiq qoladi.
- "Too many open files" yoki ResourceWarning (unclosed file) chiqadi.
- Uzoq ishlaydigan skript yoki serverda descriptor soni o'sib boradi.

## Sabab (100%)
Agent qisqa skript yozayotganda "with" ni esdan chiqaradi yoki "qo'lda close qilaman" deb o'ylaydi, lekin exception path'ni hisobga olmaydi. Python'da open() context manager protokolini qo'llab-quvvatlaydi — with uni avtomatik yopadi.

## Tasdiqlash
1. Kodni qidir: `open(` qayerda ishlatilgan, atrofida `with` bormi?
2. `f.close()` bor-yo'qligini tekshir, va u har doim (exception bo'lsa ham) chaqiriladimi?
3. try/finally bor-yo'qligini ko'r.
4. Python warnings yoki lsof/os resource limit bilan tekshir.

## Tuzatish (aynan shu)
Har doim `with` ishlat:

```python
# Noto'g'ri:
f = open("data.txt", "r")
content = f.read()
f.close()  # exception bo'lsa chaqirilmaydi

# To'g'ri:
with open("data.txt", "r") as f:
    content = f.read()
# with blokdan chiqqanda avtomatik yopiladi, hatto exception bo'lsa ham
```

Yozish uchun ham xuddi shu. Agar custom resource bo'lsa, contextlib.contextmanager yoki __enter__/__exit__ ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Fayl ochishda doim `with open(...) as f:` ishlat.
- Bu resource leak'ni oldini oladi, kodni xavfsiz va qisqa qiladi.
- Exception bo'lsa ham fayl yopiladi.

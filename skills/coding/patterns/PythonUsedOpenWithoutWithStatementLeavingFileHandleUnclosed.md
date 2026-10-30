---
name: python-open-without-with-unclosed-file
description: open() chaqiruvi with statement yoki explicit close()siz ishlatilgan — file handle yopilmay qoladi, resource leak yoki lock qolishi mumkin.
---

# open() without with: file handle unclosed

## Nima uchun bu skill kerak
Python'da `open()` ishlatilganda file handle avtomatik yopilmaydi. AI yoki developer `with` statementni unutib, oddiy `f = open(...)` qiladi va `f.close()`ni yozmaydi (yoki exception chiqsa hech qachon yetib bormaydi). Natijada descriptor'lar tugaydi, boshqa process'lar file'ni o'qiy olmaydi, yoki long-running process'da sekin leak bo'ladi.

## Simptom (aynan shu)
- `open(...)` chaqiruvi bor, lekin `with open(...) as f:` yoki `f.close()` yo'q.
- Uzun ishlaydigan script yoki server'da "Too many open files" xatosi.
- Windows'da file o'chirib bo'lmaydi yoki boshqa process ocholmaydi (handle lock).
- Kod ishlaydi, lekin resource'lar to'planib qoladi.

## Sabab (100%)
File object context manager sifatida ishlatilmagan. `open()` `__enter__`/`__exit__` beradi, `with` esa `__exit__` orqali har doim (exception bo'lsa ham) yopadi. Oddiy assignment + qo'lda close() exception yo'lida skip bo'ladi.

## Tasdiqlash
1. Kodda `open(` qidiring.
2. Atrofida `with` bormi yoki keyinroq ` .close()` bormi tekshiring.
3. Exception chiqishi mumkin bo'lgan yo'lni (try ichida open, close try tashqarisida) qarang.
4. Agar `with` yo'q va close() ishonchli emas — bu skill.

## Tuzatish (aynan shu)
Doimo `with` statement ishlating:

```python
# XATO:
f = open("data.txt", "r", encoding="utf-8")
content = f.read()
# close unutilgan yoki exception bo'lsa yetmaydi
# f.close()

# TO'G'RI:
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
# block tugagach avtomatik yopiladi, exception bo'lsa ham
```

Agar binary yoki maxsus mode kerak bo'lsa ham xuddi shunday. Encoding'ni ham aniq bering (boshqa skillga qarang).

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `open()` har doim `with` bilan ishlatilishi kerak — aks holda handle yopilmaydi.
- `with` exception bo'lsa ham yopadi; qo'lda close() ishonchsiz.
- Resource leak'lar sekin paydo bo'ladi, lekin production'da og'ir oqibatlar beradi.

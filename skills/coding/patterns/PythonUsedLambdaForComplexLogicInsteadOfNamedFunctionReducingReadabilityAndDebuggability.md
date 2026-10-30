---
name: python-lambda-complex-logic-instead-of-def
description: Python kodda lambda ichida murakkab mantiq, bir nechta if yoki uzun expression ishlatilgan — o'qilishi qiyin, stack trace'da "lambda" ko'rinadi, debug qilish va test qilish murakkab.
---

# Lambda ichida murakkab mantiq o'rniga named function

## Nima uchun bu skill kerak
Lambda qisqa, bir qatorli expressionlar uchun mo'ljallangan. Murakkab shartlar, bir nechta operatsiyalar yoki uzun kod lambda ichida yozilsa, kod o'qilishi yomonlashadi, xatolarni topish qiyinlashadi (traceback'da faqat "<lambda>"), va qayta ishlatish imkoni yo'qoladi. Aniq def funksiya aniqroq, hujjatlashtiriladigan va test qilinadigan.

## Simptom (aynan shu)
- Lambda ichida bir nechta ternary, uzun if-else yoki murakkab expression: `lambda x: x if x > 0 else (0 if x == 0 else abs(x) * 2)`.
- Yoki lambda body 80+ belgidan uzun, bir nechta metod chaqiruvi.
- Stack trace'da `File "...", line X, in <lambda>` ko'rinadi, qaysi lambda ekanini aniqlash qiyin.
- Kod reviewda "bu lambda nima qilayotganini tushunish qiyin" yoki "buni def qil" degan izohlar.

## Sabab (100%)
Dasturchi "qisqa yozish" yoki "inline" qilish uchun murakkab mantiqni lambda ga tiqadi, lekin lambda faqat expression (statement emas) ekanligini va cheklovlarini hisobga olmaydi. PEP 8 va yaxshi amaliyotlar murakkab lambda'larni tavsiya qilmaydi.

## Tasdiqlash
1. Lambda expression'ni ochib o'qi.
2. Body bir qatorli oddiy expressionmi yoki bir nechta shart/operatsiya bormi?
3. Traceback'da <lambda> ko'rinadimi?
4. Agar murakkab bo'lsa — bu holat. Named function kerak.

## Tuzatish (aynan shu)
Murakkab mantiqni alohida def funksiyaga chiqar. Lambda faqat oddiy holatlarda qoldir.

Noto'g'ri:
```python
process = lambda x: (x * 2 if x > 0 else abs(x)) if x is not None else 0
results = list(map(process, data))
```

To'g'ri:
```python
def process_value(x):
    if x is None:
        return 0
    if x > 0:
        return x * 2
    return abs(x)

results = list(map(process_value, data))
# yoki list comprehension: [process_value(x) for x in data]
```

Agar faqat oddiy transform bo'lsa (masalan `lambda x: x.strip()`), lambda yoki generator expression yaxshi.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Lambda faqat qisqa, oddiy expressionlar uchun. Murakkab mantiq def funksiyaga chiqariladi.
- Named function o'qilishi, debug qilinishi va qayta ishlatilishi yaxshiroq.
- Stack trace'da <lambda> ko'rinsa, murakkab lambda borligini tekshir.

---
name: python-walrus-operator-complex-expression-readability
description: Python kodi murakkab ifoda ichida walrus operator (:=) ishlatilgan — o'qish qiyin, intent noaniq, xato topish qiyin. Oddiy alohida o'zgaruvchi yaxshiroq.
---

# Murakkab ifoda ichida walrus operator

## Nima uchun bu skill kerak
Python 3.8+ da `:=` (walrus) operatori qulay, lekin AI yoki ishlab chiqaruvchi uni murakkab ifoda, nested ternary yoki uzun shart ichiga tiqib qo'yadi. Natijada kod o'qilishi qiyinlashadi, debug qilish qiyin, va asl maqsad (qisqartirish) yo'qoladi. Bu skill shu holatni aniq tuzatadi.

## Simptom (aynan shu)
- Kodda `if (n := len(items)) > 0 and (first := items[0]) is not None:` kabi uzun ifoda.
- Yoki list comprehension / generator ichida walrus + boshqa mantiq.
- O'qiyotganda "nima bo'lyapti" darhol tushunilmaydi.
- Reviewer yoki keyingi agent "bu nima?" deb so'raydi.

## Sabab (100%)
Walrus operatorini "qisqa kod" deb noto'g'ri ishlatish. Aslida walrus oddiy, takrorlanmaydigan hisoblashni bir marta qilish uchun mo'ljallangan (masalan `if (match := pattern.search(text))`). Murakkab joyda u o'qilishni yomonlashtiradi.

## Tasdiqlash
1. Faylda `:=` qidir.
2. Agar u oddiy `if (x := expr):` yoki `while (line := f.readline()):` bo'lsa — to'g'ri.
3. Agar bir nechta walrus, ternary, and/or bilan aralashgan bo'lsa — bu skill.

## Tuzatish (aynan shu)
Walrusni alohida o'zgaruvchilarga ajrat:

```python
# XATO (murakkab walrus):
if (n := len(items)) > 0 and (first := items[0]) is not None and first > 0:
    process(n, first)

# TO'G'RI:
n = len(items)
if n > 0:
    first = items[0]
    if first is not None and first > 0:
        process(n, first)
```

Yoki early return / guard clause bilan yanada aniqroq qil.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- Walrus oddiy, takrorlanmaydigan hisoblash uchun.
- Murakkab ifoda ichida walrus — o'qilishni yomonlashtiradi.
- Tuzatish: alohida o'zgaruvchilar va aniq if/early return.

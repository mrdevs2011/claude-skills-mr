---
name: python-used-float-for-money-or-currency-calculations-instead-of-decimal
description: Pul yoki valyuta hisob-kitoblarida float ishlatilganda aniqlik yo'qolishi. Qachon: narx, balans, soliq kabi moliyaviy qiymatlar float bilan hisoblangan.
---

# Python'da pul hisob-kitobi uchun float ishlatildi, Decimal o'rniga

## Nima uchun bu skill kerak
Float (IEEE 754) binary representation tufayli o'nlik kasrlarning ko'pini aniq saqlay olmaydi. 0.1 + 0.2 != 0.3. Pul, narx, komissiya, soliq kabi qiymatlarda bu jim xatolar, noto'g'ri balans yoki auditoriya muammolariga olib keladi. Python'da moliyaviy hisob-kitoblar uchun `decimal.Decimal` standart yechim.

## Simptom (aynan shu)
- Kodda `price = 19.99`, `total = price * qty`, `tax = total * 0.15` kabi float ishlatilgan.
- `print(0.1 + 0.2)` yoki shunga o'xshash 0.30000000000000004 chiqadi.
- Balans yoki summa kutilgan qiymatdan bir necha sent/so'm farq qiladi.
- Rounding xatolari yig'ilib ketadi.

## Sabab (100%)
Dasturchi oddiy arifmetikani float bilan qildi, chunki u "oddiy raqam" deb o'yladi. Float binary, Decimal esa o'nlik asosida ishlaydi va aniq kasrlarni saqlaydi. Moliyaviy kontekstda float ishlatish noto'g'ri tanlov.

## Tasdiqlash
1. Kodda narx, amount, balance, total, tax kabi o'zgaruvchilar `float` yoki oddiy `int` (agar so'm/tiyin aralash bo'lsa) bilanmi?
2. `from decimal import Decimal` ishlatilganmi?
3. Hisob-kitob natijasi kutilgan aniq qiymatga tengmi? (masalan 0.1 + 0.2 == Decimal('0.3'))

## Tuzatish (aynan shu)
Har doim `decimal.Decimal` ishlat. String yoki int dan yarat, float dan emas (chunki float allaqachon aniqlik yo'qotgan).

```python
from decimal import Decimal, ROUND_HALF_UP

# Noto'g'ri
price = 19.99
qty = 3
total = price * qty          # float, aniqlik yo'qolishi mumkin
tax = total * 0.15

# To'g'ri
price = Decimal('19.99')
qty = Decimal('3')
total = price * qty
tax = (total * Decimal('0.15')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
final = total + tax
```

- Konfiguratsiya yoki user input string bo'lsa: `Decimal(user_input_str)`
- Agar cent/tiyin da ishlansa, butun son (int) + oxirida bo'lish ham mumkin, lekin Decimal aniqroq va o'qilishi oson.
- Context precision kerak bo'lsa `getcontext().prec = 28` yoki undan yuqori.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Pul va valyuta hisob-kitoblarida `float` ishlatilmaydi. `decimal.Decimal` o'nlik aniqlikni saqlaydi, roundingni boshqaradi va moliyaviy xatolarni oldini oladi. Har doim string yoki aniq manbadan yarat.

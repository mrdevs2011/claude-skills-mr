---
name: used-index-based-access-on-parallel-lists-instead-of-zip-causing-misalignment-or-index-error
description: Parallel ro'yxatlar (masalan, names va ages) ustida ishlaganda index orqali kirish ishlatilgan; uzunliklar farq qilsa IndexError yoki noto'g'ri juftlashadi. zip() ishlatish kerak.
---

# Parallel ro'yxatlarda index o'rniga zip() ishlatish

## Nima uchun bu skill kerak
Bir nechta parallel ro'yxatni birgalikda iteratsiya qilishda qo'lda index hisoblash (range(len()) + [i]) xato ehtimolini oshiradi. Ro'yxatlar uzunligi farq qilsa IndexError chiqadi yoki noto'g'ri elementlar juftlashadi. zip() bu muammoni bartaraf etadi va kodni aniqroq qiladi.

## Simptom (aynan shu)
- `for i in range(len(list1)): result.append((list1[i], list2[i]))` kabi kod.
- Ba'zan IndexError: list index out of range.
- Yoki uzunliklar bir xil bo'lmaganda noto'g'ri natija (qisqaroq ro'yxat tugagandan keyin xato yoki so'nggi element qayta ishlatiladi).
- Kod o'qish qiyin va off-by-one xatolariga moyil.

## Sabab (100%)
Agent yoki dasturchi "index bilan ishlash oson" deb hisoblab, Python'ning zip() funksiyasidan foydalanmagan. range(len()) usuli ro'yxat uzunliklarini alohida tekshirmaydi va ulardan biri qisqaroq bo'lsa to'xtamaydi yoki xato beradi. Bu ayniqsa dinamik ma'lumotlarda (API javobi, foydalanuvchi inputi) xavfli.

## Tasdiqlash
Kodda quyidagi naqshni qidir:
```python
for i in range(len(names)):
    print(names[i], ages[i])
```
Yoki `enumerate` ishlatilgan lekin ikkinchi ro'yxatga [i] bilan kirilgan. Tekshiruv:
```python
names = ["a", "b"]
ages = [1, 2, 3]
# index usuli xato beradi yoki noto'g'ri
```

## Tuzatish (aynan shu)
Har doim parallel iteratsiya uchun `zip()` ishlat:

```python
# Noto'g'ri
for i in range(len(names)):
    process(names[i], ages[i])

# To'g'ri
for name, age in zip(names, ages):
    process(name, age)
```

Agar barcha ro'yxatlar bir xil uzunlikda bo'lishi shart bo'lsa, oldindan tekshir:
```python
if len(names) != len(ages):
    raise ValueError("Lists must be same length")
for name, age in zip(names, ages):
    ...
```

`zip_longest` kerak bo'lsa (turli uzunlikda to'ldirish), `itertools.zip_longest` ishlat.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
Parallel ro'yxatlarni birga ishlashda hech qachon index + range(len()) ishlatma. `zip()` aniq, xavfsiz va qisqa. Bu IndexError va noto'g'ri juftlashishni oldini oladi.

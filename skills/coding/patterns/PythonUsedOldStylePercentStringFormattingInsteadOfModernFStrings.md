---
name: python-old-percent-formatting-instead-of-fstrings
description: Python kodida eski % string formatting (yoki + bilan qo'lda birlashtirish) ishlatilgan, f-string yoki str.format() o'rniga. Xato argument soni yoki tip mos kelmasligi sababli TypeError yoki noto'g'ri chiqish beradi.
---

# Eski % formatting o'rniga f-string ishlatilmagan

## Nima uchun bu skill kerak
Python 3.6+ da f-string'lar eng o'qilishi oson va xavfsiz usul. Eski % operatori argumentlar soni yoki tipini tekshirmaydi — noto'g'ri ishlatilsa runtime'da TypeError yoki silent noto'g'ri matn chiqadi. AI ko'pincha eski uslubni tanlaydi.

## Simptom (aynan shu)
- Kodda `"Hello %s" % name` yoki `"Value: %d" % value` ko'rinadi.
- Xato: `TypeError: not enough arguments for format string` yoki `TypeError: %d format: a number is required, not str`.
- Yoki matn noto'g'ri chiqadi (masalan son o'rniga str qoldi), lekin exception yo'q.
- Python 3.6+ loyihada, lekin f-string ishlatilmagan.

## Sabab (100%)
String formatlash uchun eski `%` operatori ishlatilgan. Bu usul format string va argumentlar o'rtasidagi moslikni faqat runtime'da tekshiradi va xato xabarlari noaniq. Zamonaviy alternativalar (f-string) buni kompilyatsiya vaqtida yoki aniqroq qiladi.

## Tasdiqlash
1. Xato matnidagi qatorni och.
2. O'sha qatorda `%` belgisini format string ichida qidir (`"...%s..." % ...` yoki `"...%d..." % ...`).
3. Argumentlar soni va tiplarini format placeholderlar bilan solishtir.
4. Loyiha Python versiyasi >= 3.6 ekanini tasdiqla (f-string qo'llab-quvvatlanadi).
5. Agar shunday bo'lsa — bu skill.

## Tuzatish (aynan shu)
f-string ga o'tkaz:

```python
# XATO:
msg = "User %s has score %d" % (name, score)
path = base + "/" + filename

# TO'G'RI:
msg = f"User {name} has score {score}"
path = f"{base}/{filename}"
# yoki: path = str(Path(base) / filename)
```

Agar murakkab format kerak bo'lsa `str.format()` yoki f-string ichida format spec ishlat:
```python
msg = f"Score: {score:.2f}"
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
- `%` formatting eski va xato berishga moyil; Python 3.6+ da f-string ishlat.
- Tuzatish: format stringni `f"..."` ga o'zgartir, o'zgaruvchilarni `{var}` ichiga qo'y.
- Bu xato AI tomonidan yozilgan kodda tez-tez uchraydi — yangi string birlashtirishda f-string ni birinchi tanlov qil.

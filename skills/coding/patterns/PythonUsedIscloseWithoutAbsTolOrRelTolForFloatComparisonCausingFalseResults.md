---
name: python-isclose-missing-tolerance
description: Float qiymatlarni solishtirishda math.isclose ishlatilganda abs_tol yoki rel_tol berilmagan — natija kutilmagan False yoki True, aniqlik xatosi.
---

# math.isclose da tolerance parametrlarini unutish

## Nima uchun bu skill kerak
Python'da float solishtirishda `==` o'rniga `math.isclose` ishlatiladi, lekin default `rel_tol=1e-09`, `abs_tol=0.0` har doim yetarli emas. Ayniqsa kichik yoki katta sonlarda, yoki aniq biznes logikasida (moliya, o'lchov) noto'g'ri tolerance sababli solishtirish muvaffaqiyatsiz bo'ladi.

## Simptom (aynan shu)
- `math.isclose(a, b)` True kutilgan joyda False qaytaryapti (yoki aksincha).
- Ikkita float bir-biriga yaqin, lekin default tolerance ichida emas.
- Kodda `math.isclose(x, y)` chaqirilgan, lekin `abs_tol` yoki `rel_tol` berilmagan.
- Natija platformaga yoki Python versiyasiga bog'liq ko'rinadi.

## Sabab (100%)
`math.isclose` default qiymatlari (`rel_tol=1e-09`, `abs_tol=0.0`) hamma holat uchun mos emas. Nolga yaqin sonlar uchun `abs_tol` kerak, katta sonlar uchun `rel_tol` sozlanishi kerak. Agent default yetarli deb taxmin qilgan, aniq domain talabini tekshirmagan.

## Tasdiqlash
- `math.isclose` chaqiruvi bormi?
- `abs_tol` yoki `rel_tol` argumentlari berilganmi?
- Solishtirilayotgan qiymatlar diapazoni qanday (0 ga yaqin, katta, moliya)?
- Manual hisob-kitob yoki `abs(a-b) < epsilon` bilan tekshirib ko'r.

## Tuzatish (aynan shu)
1. Domain talabini aniqlang (qancha farq ruxsat etiladi).
2. `abs_tol` va/yoki `rel_tol` ni aniq bering.
3. Nolga yaqin uchun `abs_tol` majburiy.
4. Hujjatni o'qing: `help(math.isclose)`.

```python
import math

# Noto'g'ri (default yetarli emas)
if math.isclose(0.1 + 0.2, 0.3):  # ba'zida False
    ...

# To'g'ri
if math.isclose(0.1 + 0.2, 0.3, abs_tol=1e-9):
    ...

# Moliya uchun
if math.isclose(price1, price2, abs_tol=0.01, rel_tol=0.0):
    ...
```

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`math.isclose` ishlatganda har doim `abs_tol` va `rel_tol` ni domain bo'yicha aniq belgilang. Default qiymatlar universal emas — aniqlik xatosi yashirin bug'ga aylanadi.

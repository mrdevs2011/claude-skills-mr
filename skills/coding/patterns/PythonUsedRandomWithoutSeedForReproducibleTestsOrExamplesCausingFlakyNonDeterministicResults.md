---
name: python-used-random-without-seed-for-reproducible-tests-or-examples
description: Python code uses random.random, random.choice or similar without calling random.seed first, causing non-deterministic test failures or irreproducible examples.
---

# Python Used Random Without Seed For Reproducible Tests Or Examples

## Nima uchun bu skill kerak
Testlar, namuna ma'lumotlar yoki simulyatsiyalarda `random` moduli ishlatilganda seed o'rnatilmasa natijalar har safar o'zgaradi. Bu flaky testlar, debug qilish qiyinligi va boshqalar tomonidan takrorlanmaydigan natijalarga olib keladi. Coding patterns va productivity uchun muhim: barqaror, takrorlanadigan kod.

## Simptom (aynan shu)
- Test ba'zida o'tadi, ba'zida yiqiladi (flaky), lekin kod o'zgarmagan.
- `random.randint`, `random.choice`, `random.shuffle` yoki `numpy.random` ishlatilgan.
- Natija har ishga tushirishda boshqacha.
- Hech qanday `random.seed(...)` yoki `np.random.seed(...)` chaqiruvi yo'q.
- CI da tasodifiy muvaffaqiyatsizliklar.

## Sabab (100%)
Python `random` moduli (va numpy) default holatda tizim vaqtiga yoki OS random'iga asoslangan seed ishlatadi. Seed aniq o'rnatilmasa, har safar boshqa ketma-ketlik chiqadi. Bu normal flow emas — test va misollar uchun deterministik bo'lishi shart.

## Tasdiqlash
- Kodda `import random` yoki `from random import` bormi?
- `random.seed` yoki ekvivalent chaqiruv yo'qmi?
- Test yoki namuna generatsiya qilayotgan joyda random ishlatilganmi?
- Bir xil input bilan ikki marta ishga tushirib natija bir xilmi? (yo'q bo'lsa — tasdiq)

## Tuzatish (aynan shu)
Test yoki reproducible example boshida seed o'rnat:

```python
import random

# Test yoki script boshida, random ishlatishdan oldin
random.seed(42)  # yoki ma'lum bir qiymat, masalan 0, 123

# Endi random.choice, randint va h.k. har safar bir xil natija beradi
items = ["a", "b", "c"]
selected = random.choice(items)
print(selected)  # har safar bir xil
```

Numpy uchun:
```python
import numpy as np
np.random.seed(42)
```

Agar production random kerak bo'lsa (kriptografik emas), seed'ni faqat test/fixture da o'rnat, asosiy kodda emas. Pytest uchun `pytest-randomly` yoki fixture bilan boshqarish mumkin, lekin oddiy holatda `random.seed` yetarli.

## Xulosa — bu skillni o'qib nimani bilib oldingiz
`random` yoki `numpy.random` ishlatganda test va misollar uchun doim `random.seed(N)` chaqir. Bu flaky testlarni oldini oladi va natijani takrorlanadigan qiladi. Deterministik kod debug va review'ni osonlashtiradi.
